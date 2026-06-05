# Content Enhancements Design

**Date:** 2026-06-05
**Branch context:** `feature/restructure`
**Scope:** Five user-requested enhancements to the VEFS site — gallery admin CRUD, blog nav promotion, homepage social rail, homepage blog slider, and a shared "NEW" indicator across all six content types.

---

## 1. Goals

Add the following to the existing VEFS site without changing its architecture (vanilla JS + PHP admin + JSON-as-DB + Cloudinary for images):

1. **Gallery admin** — full CRUD for gallery photos (admin can add / edit / delete / duplicate / enable-disable / hide-from-public) with `title`, `description`, and `year`, served from Cloudinary.
2. **Blog page promotion** — add a `Blog` link to the main nav (between About and Trainings) with a "NEW" badge that auto-hides 60 days after launch.
3. **Homepage social rail** — horizontal, scroll-snap rail of social media posts (image + description), placed **above** the Upcoming Events section. Slow auto-scroll that pauses on hover/touch + manual arrow buttons.
4. **Homepage blog slider** — a one-at-a-time manual slider (no auto-advance) showing the latest 10 blog posts. Each slide: image (Cloudinary thumbnail), title, date. Prev/next arrows + keyboard support. Placed directly below the social rail.
5. **"NEW" indicator across 6 content types** — a small red/yellow blinking badge shown on cards for items that are recent. Auto-detected for 7 days after creation, with an admin override (force on / force off / auto). Applied to: events, trainings, volunteers, social, blog, gallery.

---

## 2. Non-goals

- No reorder UI for the social rail or blog slider — order is `createdAt` descending.
- No bulk image upload for gallery — admin re-uploads the existing ~14 photos one at a time through the new form (≈10 minutes).
- No analytics or impression tracking on the new sections.
- No new MySQL tables or backend services — everything stays in `data/*.json`.
- No animated GIF for the NEW badge — pure CSS animation only.

---

## 3. Architecture overview

All changes live within the existing two-tier system:

```
Admin (PHP) → POST /admin/api/save.php
  → CSRF check (csrf.php) + session check (auth.php)
  → validate.php (now covers gallery + new isNew enum)
  → sanitize-html.php
  → json-store.php (atomic write + backup to data/backups/)
  → data/<type>.json

Public page → fetch('/data/<type>.json') in browser
  → filter disabled + hiddenFromPublic client-side
  → render via per-page JS, calling isItemNew(item) for badge
```

No new infrastructure. The existing admin API endpoints (`save.php`, `delete.php`, `duplicate.php`, `toggle.php`, `reorder.php`) are reused by adding `gallery` to `admin_array_key_for_type()` in `includes/admin-helpers.php`.

---

## 4. Data & schema changes

### 4.1 Gallery (`data/gallery.json`) — migrated shape

**Current shape (flat array):**

```json
[
  { "filename": "...", "url": "images/gallery/...", "size": 255529 }
]
```

**New shape (matches other content types):**

```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2026-06-05T00:00:00+00:00",
    "total": 0
  },
  "items": [
    {
      "id": "gal-001",
      "title": "Tree planting drive",
      "description": "Volunteers planting saplings at Erode site.",
      "year": 2024,
      "imageUrl": "https://res.cloudinary.com/<cloud>/image/upload/.../photo.jpg",
      "isNew": "auto",
      "disabled": false,
      "hiddenFromPublic": false,
      "createdAt": "2026-06-05T12:00:00+00:00",
      "updatedAt": "2026-06-05T12:00:00+00:00"
    }
  ]
}
```

**Migration steps:**

1. Copy existing `data/gallery.json` to `data/backups/gallery.pre-migration.json`.
2. Replace `data/gallery.json` with the new `{metadata, items: []}` skeleton (empty items).
3. Admin re-uploads the 14 existing photos through the new admin form (Cloudinary upload + metadata).
4. Old local files in `images/gallery/` can stay until the deploy is verified, then be deleted in a follow-up cleanup.

### 4.2 Shared field added to all 6 content types

A single new field per item:

```json
"isNew": "auto"   // one of: "auto" | true | false
```

- `"auto"` (default for new items): badge shows if `createdAt` is within the last 7 days.
- `true`: badge always shows (force on).
- `false`: badge never shows (force off).

No other fields change. `createdAt` already exists on `blog`, `social`, `events`, `trainings`, `volunteers` and is added to `gallery` items.

### 4.3 Blog nav badge expiry — no persistence

The 60-day expiry for the Blog nav-link "NEW" badge is a hardcoded constant in `js/components/blog-nav-badge.js`:

```js
const BLOG_LAUNCH_DATE = '2026-06-05';
const BLOG_BADGE_DAYS  = 60;
```

No JSON storage, no admin toggle — fire-and-forget. After 60 days, the badge stops rendering automatically.

---

## 5. Component breakdown

### 5.1 Gallery admin (new content type — 6th in pipeline)

**New files:**
- `admin/form-gallery.php`
- `admin/assets/form-gallery.js`

**Files to modify:**
- `includes/admin-helpers.php` — register `gallery` in `admin_array_key_for_type()`.
- `includes/validate.php` — add validation for gallery item shape (title required ≤200 chars, description ≤500 chars plain text, year integer 2000–current year, imageUrl required https URL, isNew enum).
- `admin/dashboard.php` — add Gallery card matching the other five content-type cards.
- `js/gallery.js` — read new schema, filter `disabled` + `hiddenFromPublic`, render NEW badge.

**Form fields (in order):**
1. Image upload (Cloudinary uploader, reuses `uploadToCloudinary()` from `admin/assets/admin.js`).
2. Title — text input, required, ≤200 chars.
3. Description — textarea, plain text, ≤500 chars (no rich HTML, no HTMLPurifier needed).
4. Year — number input, 2000 to current year, required.
5. NEW indicator — radio group: Auto / Force on / Force off (default Auto).
6. Disabled — checkbox.
7. Hidden from public — checkbox.

Save / Delete / Duplicate / Toggle / Reorder all route through existing `admin/api/*.php` endpoints with `type=gallery`.

### 5.2 Blog nav link + 60-day NEW badge

**Files to modify (all public HTML pages with the main nav):**
- `index.html`, `about.html`, `trainings.html`, `events.html`, `volunteer.html`, `gallery.html`, `future-plans.html`, `contact.html`, `donate.html`, `blog.html`, `privacy.html`, `terms.html`, `registration-confirmation.html`.

Insert between About and Trainings inside `.nav-list`:

```html
<li>
  <a href="blog.html" class="nav-link">
    Blog <span id="blog-nav-new" class="nav-new-slot" aria-hidden="true"></span>
  </a>
</li>
```

**New file:** `js/components/blog-nav-badge.js`
- On `DOMContentLoaded`, if `(Date.now() - launchTimestamp) / 86_400_000 < 60` then inject `<span class="badge-new">NEW</span>` into every `#blog-nav-new` slot.
- Otherwise: do nothing (badge slot stays empty).

Include this script on all 13 pages before `</body>`.

### 5.3 Homepage social rail (above Upcoming Events)

**Files to modify:**
- `index.html` — insert a new `<section class="social-rail">…</section>` before the Upcoming Events section (currently around line 1455).
- `js/social-home.js` — extend to (a) filter disabled/hidden items, (b) render into the rail track with image + description + NEW badge, (c) wire arrow buttons (`scrollBy(±cardWidth)`), (d) drive a slow auto-scroll via `requestAnimationFrame` that pauses on `mouseenter`, `touchstart`, `focusin`, and when `document.visibilityState !== 'visible'`.

**New CSS:** `css/components/horizontal-rail.css`
- Flex row, `scroll-snap-type: x mandatory`, hidden scrollbar, arrow button styles (≥768px only).
- Reused by both social rail and (optionally) any future card rail.

**Markup skeleton:**

```html
<section class="social-rail" aria-label="Recent social media posts">
  <div class="container">
    <h2 class="section-title">Recent <span class="accent">Posts</span></h2>
    <div class="social-rail__viewport">
      <button class="social-rail__arrow social-rail__arrow--prev" aria-label="Scroll left">‹</button>
      <div class="social-rail__track" tabindex="0" role="region" aria-roledescription="carousel">
        <!-- cards injected by social-home.js -->
      </div>
      <button class="social-rail__arrow social-rail__arrow--next" aria-label="Scroll right">›</button>
    </div>
  </div>
</section>
```

### 5.4 Homepage blog slider (below social rail)

**Files to modify:**
- `index.html` — insert a new `<section class="blog-slider">…</section>` immediately after the social rail.
- `js/blog-home.js` — fetch `data/blog.json`, filter disabled/hidden, sort by the existing publish-date field on blog items (whichever of `publishedAt` / `date` / `createdAt` the current schema uses — to be confirmed against `data/blog.json` during implementation; one field is chosen and used consistently), descending, slice to 10, render all slides, track `currentIndex`, wire prev/next buttons, keyboard left/right arrow handling when the slider is focused. **No auto-advance.**

**New CSS:** `css/components/blog-slider.css`
- Single-slide visible; uses `transform: translateX(-N * 100%)` for transitions.
- Mobile: full-width slide, native swipe via touch event handlers in `blog-home.js`.

**Markup skeleton:**

```html
<section class="blog-slider" aria-label="Latest blog posts">
  <div class="container">
    <h2 class="section-title">From the <span class="accent">Blog</span></h2>
    <div class="blog-slider__frame"
         role="region"
         aria-roledescription="carousel"
         aria-live="polite"
         tabindex="0">
      <button class="blog-slider__arrow blog-slider__arrow--prev" aria-label="Previous post">‹</button>
      <div class="blog-slider__track">
        <!-- slides injected by blog-home.js -->
      </div>
      <button class="blog-slider__arrow blog-slider__arrow--next" aria-label="Next post">›</button>
    </div>
  </div>
</section>
```

Each slide: image (Cloudinary thumbnail, `w_800,q_auto,f_auto`), title (`<h3>`), formatted date, NEW badge if applicable. Clicking the slide navigates to `/blog/<slug>`.

### 5.5 Shared "NEW" badge across 6 content types

**New shared file:** `css/components/badge-new.css`

```css
.badge-new {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: #d32f2f;
  border-radius: 4px;
  animation: badge-new-blink 1s steps(2, end) infinite;
}
@keyframes badge-new-blink {
  0%, 100% { background: #d32f2f; }
  50%      { background: #f9a825; }
}
@media (prefers-reduced-motion: reduce) {
  .badge-new { animation: none; }
}
```

**New helper in `js/utils.js`:**

```js
export function isItemNew(item) {
  if (item.isNew === true)  return true;
  if (item.isNew === false) return false;
  // "auto" (default): within 7 days of createdAt
  if (!item.createdAt) return false;
  const ageMs = Date.now() - new Date(item.createdAt).getTime();
  return ageMs >= 0 && ageMs < 7 * 24 * 60 * 60 * 1000;
}
```

**Public render JS to update:** `events.js`, `trainings.js`, `volunteers.js`, `gallery.js`, `blog.js`, `blog-home.js`, `social-home.js`, and the server-rendered `blog-post.php`. A PHP equivalent `is_item_new($item)` is added to a new `includes/content-helpers.php` (kept separate from `admin-helpers.php` so public-page code does not have to load admin helpers).

**Admin forms to update:** `form-blog.php`, `form-social.php`, `form-event.php`, `form-training.php`, `form-volunteer.php`, plus the new `form-gallery.php`. Each form gets a "NEW indicator" radio group (Auto / Force on / Force off, default Auto).

**Validation:** `includes/validate.php` — add `isNew` enum check (`'auto' | true | false`) to all six content types.

---

## 6. Data flow (unchanged pattern)

```
Admin form submit
  → POST /admin/api/save.php  (with type=<event|training|volunteer|social|blog|gallery>)
  → CSRF + session check
  → validate.php (now includes gallery + isNew)
  → sanitize-html.php (rich-text fields only — gallery description is plain text and skips this)
  → json-store.php → data/<type>.json + data/backups/<type>-<timestamp>.json

Public page load
  → fetch('/data/<type>.json')
  → filter items where !disabled && !hiddenFromPublic
  → for each item, call isItemNew(item) and conditionally render <span class="badge-new">NEW</span>
  → render card markup
```

---

## 7. Accessibility & motion

- `badge-new.css` disables blink under `prefers-reduced-motion: reduce` (stays solid red).
- Blink cycle is ~1s — well under the 3-flash/sec photosensitive threshold (WCAG 2.3.1).
- Horizontal rails and blog slider use `role="region"` + `aria-roledescription="carousel"`, arrow buttons get explicit `aria-label`s, and the slider frame uses `aria-live="polite"` so screen readers announce slide changes.
- All Cloudinary images carry meaningful `alt` text drawn from the item's `title`.
- Rails and slider are keyboard-navigable: `tabindex="0"` on the track/frame, left/right arrow keys scroll the rail or advance the slider when focused.

---

## 8. Mobile behavior

- Horizontal rail (social) — native touch scroll + `scroll-snap-type: x mandatory`. Arrow buttons hidden below 768px.
- Blog slider — full-width single slide, touch swipe (basic `touchstart` / `touchend` delta) advances or rewinds.
- Cloudinary URL transforms keep image weight in check: gallery thumbnails `w_400,q_auto,f_auto`; full views `w_1200,q_auto,f_auto`; blog/social rail thumbnails `w_600,q_auto,f_auto`.

---

## 9. Performance considerations

- All new images served from Cloudinary CDN with `f_auto,q_auto` — auto WebP/AVIF and adaptive quality.
- Social rail auto-scroll uses `requestAnimationFrame`, not `setInterval`, and pauses when the tab is hidden (`document.visibilityState`).
- Lazy-load all below-fold images (`loading="lazy"`).
- No additional third-party libraries — slider and rail are vanilla JS.
- Page-size target of < 2MB stays comfortably intact.

---

## 10. Security considerations

- Admin endpoints continue to require both **session** (`auth.php`) and **CSRF token** (`csrf.php`). Gallery uses the same endpoints — no new auth surface.
- Gallery `description` is plain text (textarea); it is HTML-escaped on render. It does not go through HTMLPurifier.
- Gallery `imageUrl` must be an `https://` Cloudinary URL — `validate.php` enforces the scheme and host pattern.
- No file uploads hit the PHP server; uploads go directly browser → Cloudinary, then the resulting URL is saved to JSON.

---

## 11. Testing strategy

### PHP unit tests (`VEFS-website/tests/`)
- Extend `test-validate.php` with `isNew` enum cases (valid: `"auto"`, `true`, `false`; invalid: any other string/number) for all six types.
- New `test-validate-gallery.php` covering title/description/year/imageUrl rules.
- `test-json-store.php` already covers atomic writes and backups; gallery's new shape is exercised through it.

### Playwright E2E
- **Gallery admin:** create item with image upload → appears on public `gallery.html`; toggle Disabled → disappears; Duplicate creates a copy with `(Copy)` suffix.
- **NEW badge:** item with `createdAt` of today shows badge; item with `isNew:false` hides it; in a `prefers-reduced-motion` emulation, badge is solid red.
- **Social rail:** arrow buttons scroll the track; `mouseenter` pauses auto-scroll; touch swipe works on mobile viewport.
- **Blog slider:** prev/next cycles through latest 10; no auto-advance occurs over a 10-second wait; left/right arrow keys advance when focused.
- **Blog nav badge:** present when system clock is within 60 days of launch; absent when mocked past 60 days.

---

## 12. Rollout / migration steps (suggested order)

1. **Shared building blocks first** — `badge-new.css`, `isItemNew()` in `js/utils.js`, `horizontal-rail.css`, PHP equivalent of `isItemNew` for `blog-post.php`.
2. **`isNew` field rollout** — add to validate.php; add the Auto/Force-on/Force-off radio to each of the 5 existing admin forms; update each public render JS to show badge.
3. **Gallery admin** — new form + new dashboard card + migration of `gallery.json` shape; admin re-uploads the 14 photos.
4. **Update `js/gallery.js`** to read the new schema.
5. **Homepage social rail** — markup + CSS + `social-home.js` updates.
6. **Homepage blog slider** — markup + CSS + `blog-home.js` updates.
7. **Blog nav link + nav badge** — add `<li>` to all 13 HTML pages + `blog-nav-badge.js`.
8. **Tests + Playwright verification.**
9. **Deploy** by FTPing `VEFS-website/` to Hostinger.

---

## 13. Open questions / follow-ups

None at design time. Re-upload of the 14 existing gallery photos is a manual admin task once the new form ships; if that becomes painful, a one-off Cloudinary fetch-upload migration script can be written later.
