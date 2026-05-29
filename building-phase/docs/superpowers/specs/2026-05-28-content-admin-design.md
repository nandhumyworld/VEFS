# VEFS Content Admin — Design Spec

**Date:** 2026-05-28
**Status:** Approved design, awaiting implementation plan
**Author:** Brainstormed with client (nankshr)

## 1. Purpose

The VEFS founder currently relies on the developer to manually edit JSON files (events, trainings, volunteers) and upload them via FTP. Two new content types are also needed: **Blog posts** and **Social media posts** (YouTube / Instagram / Facebook links displayed as thumbnail cards).

This spec designs a single password-protected admin area on the existing static PHP site that lets the founder create, edit, delete, and reorder content across all five types **without developer involvement** — while preserving the strict performance, security, and hosting constraints in `CLAUDE.md` (Hostinger static + PHP, no Node, no build step, FTP-only deploy).

## 2. Scope

### In scope
- Password-protected admin area at `/admin/` on the existing site.
- Admin CRUD UI for five content types:
  1. Blog posts (new)
  2. Social posts (new)
  3. Events (existing JSON, now editable via admin)
  4. Trainings (existing JSON, now editable via admin)
  5. Volunteer opportunities (existing JSON, now editable via admin)
- Direct browser-to-Cloudinary image uploads (unsigned preset) — no images on Hostinger disk.
- Public display: new `blog.html` index, `blog-post.php` single view with clean `/blog/<slug>` URLs and OG tags, and a "Latest from the blog" + "Follow our work" (social) section on `index.html`.
- Manual ordering via `order` field on every entry, surfaced in the dashboard with editable number + up/down arrows.
- File-locked JSON writes with rolling backups.

### Out of scope
- Multi-user accounts, roles, or 2FA (single-admin Trust site).
- Draft/publish workflow — saving makes content live.
- Comments on blog posts.
- Auto-fetching IG/FB metadata via their APIs (requires app tokens; not worth the complexity). YouTube thumbnails *are* auto-fetched from `img.youtube.com`.
- Modifying the existing public render code for events / trainings / volunteers — admin writes the same schema those pages already consume.
- `recent-registrations.json` — written by registration form processors, never admin-edited.

## 3. Architecture

```
VEFS-website/
├── admin/                              [NEW]
│   ├── .htaccess                       deny config.php, optional IP allowlist
│   ├── config.php                      bcrypt password hash, Cloudinary cloud name + preset
│   ├── index.php                       login form
│   ├── logout.php
│   ├── dashboard.php                   5 tabs: Blog | Social | Events | Trainings | Volunteers
│   ├── form-blog.php
│   ├── form-social.php
│   ├── form-event.php                  [Phase 2]
│   ├── form-training.php               [Phase 2]
│   ├── form-volunteer.php              [Phase 2]
│   └── api/
│       ├── save.php                    single endpoint, ?type=blog|social|event|training|volunteer
│       ├── delete.php
│       ├── reorder.php                 swap order values or set an explicit number
│       └── upload-meta.php             returns Cloudinary preset config to the admin JS
├── includes/                           [NEW]
│   ├── auth.php                        session_start, login check, regenerate, timeout
│   ├── csrf.php                        token issue + verify
│   ├── json-store.php                  locked read/write + atomic rename + backup
│   ├── sanitize-html.php               HTMLPurifier wrapper (vendored)
│   └── validate.php                    per-type field rules
├── vendor/                             [NEW]
│   └── htmlpurifier/                   dropped-in, no Composer
├── data/
│   ├── blog.json                       [NEW]
│   ├── social.json                     [NEW]
│   ├── events.json                     existing schema, now writable via admin
│   ├── trainings.json                  existing schema, now writable via admin
│   ├── volunteers.json                 existing schema, now writable via admin
│   ├── .login-attempts.json            [NEW] hidden, IP-keyed throttle log
│   ├── .audit-log.json                 [NEW] hidden, append-only action log
│   ├── backups/                        [NEW] last 20 versions per file
│   └── .htaccess                       deny dot-files, no directory index
├── blog.html                           [NEW] blog index, 6 per page
├── blog-post.php                       [NEW] single post, OG tags, sanitized HTML body
├── index.html                          add 2 sections: "Latest from the blog", "Follow our work"
└── .htaccess                           add: clean URL rewrite for /blog/<slug>
```

**Request flow — admin save:**
1. Browser submits form (CSRF token in hidden field, session cookie attached).
2. `api/save.php` calls `auth.php` (verify session, sliding timeout) and `csrf.php` (verify token).
3. `validate.php` runs per-type field rules. On failure → 400 + field-specific JSON error.
4. For blog `body_html`, run `sanitize-html.php` (HTMLPurifier) with strict allowlist.
5. `json-store.php` acquires `LOCK_EX` on the target file, reads current JSON, mutates the array, copies current file to `data/backups/<file>-<timestamp>.json` (keeping latest 20), writes new content to `<file>.tmp`, `rename()` to live path (atomic), releases lock.
6. Append entry to `.audit-log.json`.
7. Return `{ success: true, id: "..." }` → admin JS redirects to dashboard with a success toast.

**Request flow — public read:**
1. Page HTML loads (PHP-rendered head for `blog-post.php` to set OG tags from JSON).
2. Vanilla JS `fetch('/data/<file>.json?v=<mtime>')` where `mtime` comes from a 200-byte `/data/version.php` endpoint — cache-busts only when content changes.
3. JS sorts by `order` ascending, slices for the current page, renders cards.
4. Images are Cloudinary URLs with `/f_auto,q_auto/` appended for automatic format + quality.

**Request flow — image upload:**
1. Admin form's file input → JS reads the file.
2. JS POSTs to `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload` with `upload_preset=vefs_unsigned` and the file.
3. Cloudinary returns `{ secure_url: "..." }`.
4. JS writes the URL into the form's hidden field (cover image) or inserts an `<img src="...">` tag at the textarea cursor (body inline image).
5. No file ever touches the Hostinger server.

## 4. Data model

### 4.1 `blog.json` (new)
```json
{
  "metadata": { "lastUpdated": "...", "total": 1 },
  "posts": [
    {
      "id": "organic-farming-workshop",
      "order": 10,
      "title": "Organic Farming Workshop Recap",
      "subtitle": "Three days of hands-on learning with 40 farmers",
      "cover_image_url": "https://res.cloudinary.com/.../cover.jpg",
      "body_html": "<p>...</p><img src='https://...'/><p>...</p>",
      "reference_links": [
        { "label": "Event photos", "url": "https://..." }
      ],
      "cta_text": "Register for next workshop",
      "cta_url": "/trainings.html",
      "published_at": "2026-05-28T10:00:00+05:30",
      "updated_at": "2026-05-28T10:00:00+05:30"
    }
  ]
}
```
- `id` doubles as URL slug. Auto-generated from title; editable in form. Must match `^[a-z0-9-]+$`. Renaming `id` after publish breaks shared links — UI warns.
- `order` integer, default increments of 10 for easy insertion.

### 4.2 `social.json` (new)
```json
{
  "metadata": { "lastUpdated": "...", "total": 1 },
  "posts": [
    {
      "id": "yt-2026-05-20",
      "order": 10,
      "platform": "youtube",
      "post_url": "https://youtube.com/watch?v=...",
      "thumbnail_url": "https://res.cloudinary.com/.../thumb.jpg",
      "caption": "Tree planting drive — May 2026",
      "posted_at": "2026-05-20T18:00:00+05:30"
    }
  ]
}
```
- `platform` enum: `youtube` | `instagram` | `facebook`.
- For YouTube, thumbnail can be auto-filled with `https://img.youtube.com/vi/<videoId>/hqdefault.jpg` extracted from `post_url`. IG/FB require manual thumbnail upload via Cloudinary.

### 4.3 Existing schemas (events, trainings, volunteers)
The admin forms write the **exact same schemas** already documented in `VEFS-requirements/data-schemas/DATA_MANAGEMENT.md` and consumed by the existing public pages. Two additions per entity:
- Add an `order` integer field (default by `published_at` or existing order if any).
- Existing `featured` boolean is kept and respected by current public render code.

No public render code changes for events/trainings/volunteers in this project — admin just writes JSON the pages already know how to read.

**Form complexity note:** events/trainings/volunteers have deeply nested fields (`location` object, `agenda[]`, `requirements.age`, `benefits.learning[]`, `capacity` object). The admin forms render these as grouped sections with repeating-row controls for arrays. This is the reason these three are Phase 2.

## 5. Admin UI

### 5.1 Login (`/admin/index.php`)
- Single password field, no username.
- Bcrypt-hashed password (`cost=12`) stored in `/admin/config.php` (denied to web via `.htaccess`).
- Session cookie: `HttpOnly`, `Secure`, `SameSite=Strict`. `session_regenerate_id(true)` on login.
- Sliding 2-hour timeout. Each request refreshes.
- Throttle: 5 failed attempts from an IP → 15-minute lockout, logged in `data/.login-attempts.json`.

### 5.2 Dashboard (`/admin/dashboard.php`)
- Five tabs: **Blog | Social | Events | Trainings | Volunteers**.
- Each tab renders a table of entries from the corresponding JSON:
  - Columns: thumbnail (where applicable), title/caption, `order` (editable inline number input), date, ▲ ▼ arrows, Edit, Delete.
  - ▲ ▼ swap the entry's `order` with the neighbor above/below.
  - Inline `order` change autosaves via `api/reorder.php` (debounced).
  - "+ New X" button at top of each tab.
- Logout button top-right. "Last login: <timestamp>" badge.

### 5.3 Blog form (`form-blog.php`)
- Fields in order:
  1. Title (text, required, ≤ 200 chars).
  2. Subtitle (text, ≤ 300 chars).
  3. Slug (auto-generated from title; editable; matches `^[a-z0-9-]+$`). Shows live preview: `https://vefs.org/blog/<slug>` + "Copy link" button.
  4. Cover image (file picker → Cloudinary upload → hidden URL field; thumbnail preview shown).
  5. Body (textarea with toolbar: **B**, *I*, link, h2, h3, ul, ol, blockquote, **Insert image**). Insert image runs the same Cloudinary flow and inserts `<img src="...">` at the cursor. A live HTML preview pane renders to the right.
  6. Reference links: repeating rows `[label] [url] [+ add row] [× remove]`.
  7. CTA text + CTA URL (two fields).
  8. Order (integer, defaults to highest existing `order` + 10).
- Submit posts to `api/save.php?type=blog` with CSRF token.

### 5.4 Social form (`form-social.php`)
- Platform dropdown: YouTube / Instagram / Facebook.
- Post URL (paste from platform).
- Thumbnail: file picker → Cloudinary. For YouTube, a "Use YouTube thumbnail" button extracts the video ID from `post_url` and writes `https://img.youtube.com/vi/<id>/hqdefault.jpg` into the field — no upload needed.
- Caption (text, 1–2 lines, ≤ 300 chars).
- Posted at (datetime, defaults to "now").
- Order.

### 5.5 Event / Training / Volunteer forms (Phase 2)
- Each renders the existing schema as grouped fieldsets.
- Nested arrays (agenda, requirements.skills, benefits.learning) use repeating-row controls.
- Images (event cover, training cover, volunteer media) use the same Cloudinary picker.
- All required fields per the existing schema are enforced server-side by `validate.php`.

## 6. Public display

### 6.1 `blog.html` — index
- Loads `/data/blog.json?v=<mtime>` once.
- Sorts posts by `order` ascending.
- Renders 6 cards per page. URL-based pagination (`?page=2`) so links are bookmarkable.
- Card: cover (lazy, dimensioned), title, subtitle, date, "Read more →" → `/blog/<slug>`.
- Empty state: friendly message + link home.

### 6.2 `blog-post.php` — single post
- Reads `?id=` from URL (set by `.htaccess` rewrite from `/blog/<slug>`).
- PHP loads `blog.json`, finds the post by `id`. If not found → render 404 view with link to `/blog`.
- PHP injects into `<head>`: `<title>`, `<meta name="description">`, `<meta property="og:title|og:description|og:image|og:url|og:type=article">` so WhatsApp / FB / X link previews show title + cover.
- Body: cover image, h1 title, h2 subtitle, date, sanitized `body_html`, "References" list (if any), CTA button, share row (WhatsApp / Facebook / X / Copy link — all built from `window.location.href`, no SDKs).

### 6.3 `index.html` additions
- **"Latest from the blog"** section: first 3 posts by `order`, compact cards, "View all →" link to `/blog.html`.
- **"Follow our work"** section: first 9 social posts by `order`, 3-column responsive grid (1 / 2 / 3 across breakpoints). "Load more" button reveals next 9 from already-fetched JSON. Cards are full clickable `<a>` to `post_url`, `target="_blank" rel="noopener"`. Inline SVG platform badge per card. Caption clamped to 2 lines.

### 6.4 Performance discipline
- No third-party SDKs (no YouTube iframe, no IG / FB embed scripts). Thumbnail + link only.
- One JSON fetch per page. JSON entries are small (~0.5–1 KB each); 500 entries gzip to ~50 KB.
- Cloudinary URLs always rendered with `/f_auto,q_auto/` injected client-side for WebP + auto-quality.
- All `<img>` get `loading="lazy"`, explicit `width`/`height`. Above-the-fold LCP image gets `fetchpriority="high"` and no lazy attribute.
- Pagination caps DOM: blog index 6 cards; home social grows 9 at a time.

## 7. Security

### 7.1 Authentication & sessions
See §5.1.

### 7.2 CSRF
- Every form (login, save, delete, reorder) carries a hidden CSRF token (32-byte hex from session).
- All write endpoints reject mismatched / missing tokens with 403 and log the event.

### 7.3 Input validation (`validate.php`)
- Per-type field rules: required-ness, max length, integer for `order`, enum for `platform`/`status`, URL validation via `filter_var(..., FILTER_VALIDATE_URL)` + scheme allowlist (`http`, `https`, `mailto`). Reject `javascript:`, `data:`, etc.
- Slug must match `^[a-z0-9-]+$` and be unique within its file.

### 7.4 HTML sanitization
- Body HTML (blog only) runs through **HTMLPurifier** (vendored, no Composer) at save time.
- Allowlist: `p, h2, h3, h4, strong, em, u, a, ul, ol, li, blockquote, br, img, hr`. Attributes: `a[href|title]`, `img[src|alt|width|height]`. URL schemes: `http, https, mailto`.
- Everything else stripped — including `<script>`, `<iframe>`, `<style>`, all `on*` event handlers, inline `style` attrs.
- Sanitization is done at **save** time so stored JSON is safe even if rendering later changes.

### 7.5 File write safety (`json-store.php`)
- All `data/*.json` writes go through this module — single audit point.
- `flock(LOCK_EX)`, read-modify-write, write to `.tmp`, atomic `rename()`, release lock.
- Pre-write: copy current file to `data/backups/<name>-YYYYMMDD-HHMMSS.json`. Prune to last 20.
- Crash mid-write leaves live file untouched.

### 7.6 `.htaccess` summary
At `/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteRule ^blog/([a-z0-9-]+)/?$ blog-post.php?id=$1 [L,QSA]
<FilesMatch "\.(tmp|log)$">Require all denied</FilesMatch>
<FilesMatch "^\.">Require all denied</FilesMatch>
```
At `/admin/.htaccess`:
```apache
<Files "config.php">Require all denied</Files>
# Optional: Require ip <client-static-ip>
```
At `/data/.htaccess`:
```apache
Options -Indexes
<FilesMatch "^\.">Require all denied</FilesMatch>
```

### 7.7 Cloudinary preset hardening
- Preset `vefs_unsigned`: allowed formats `jpg|jpeg|png|webp`, max 5 MB, max dimensions 2000×2000, folder `vefs/`, auto-format + auto-quality + incoming resize to ≤1600px wide.
- Worst case if preset name leaks: an abuser uploads jpegs to one folder. Mitigation: purge folder, rotate preset name in Cloudinary dashboard. No site-side change needed.

### 7.8 Audit log
- Append-only `data/.audit-log.json`: `{ ts, action, type, id, ip }` per write.
- Rotated monthly to `backups/audit-YYYYMM.json`.

## 8. Phasing

### Phase 1 — Foundation + Blog + Social
- `/admin/` shell: login, dashboard, logout, session, CSRF, throttle.
- `includes/auth.php`, `csrf.php`, `json-store.php`, `sanitize-html.php`, `validate.php`.
- Vendor HTMLPurifier.
- Cloudinary unsigned-upload integration (JS module shared by all forms).
- Blog: schema, form, save/delete/reorder API, `blog.html`, `blog-post.php`, `.htaccess` rewrite, OG tags, share row.
- Social: schema, form, save/delete/reorder API, home page "Follow our work" section.
- Home page "Latest from the blog" section.

**Deliverable:** Founder can independently publish blog posts and add social cards. The admin platform (auth, locking, backups, Cloudinary) is proven and reused as-is in Phase 2.

### Phase 2 — Events / Trainings / Volunteers
- Add three tabs to the existing dashboard.
- Build `form-event.php`, `form-training.php`, `form-volunteer.php` against existing schemas.
- Reuse all Phase 1 infrastructure unchanged. Only the per-type validation rules and the form HTML are new.

**Deliverable:** Founder no longer needs the developer to update any site content.

## 9. What we explicitly do not build (YAGNI)

- 2FA. Single-admin, HTTPS, bcrypt + throttle is appropriate.
- Multi-admin / roles.
- Draft/publish workflow.
- Comments / moderation.
- In-admin image gallery — Cloudinary's own dashboard handles that.
- Auto-fetch of Instagram / Facebook thumbnails via their APIs (would require app tokens, review processes, ongoing maintenance).
- CMS frameworks (Decap / Tina) — they require Git + CI, incompatible with the FTP-only Hostinger setup per `CLAUDE.md`.

## 10. Open dependencies before implementation planning

- Confirm Cloudinary account ownership and who creates the unsigned preset (likely developer sets it up once, hands cloud name to client).
- Confirm the existing public render code for events / trainings / volunteers in `VEFS-website/js/` reads the `order` field (or fall back to existing sort) — if it doesn't, Phase 2 adds a one-line sort tweak per page.
- Confirm Hostinger PHP version (≥ 7.4 needed for `password_hash` defaults and `JSON_THROW_ON_ERROR`).
