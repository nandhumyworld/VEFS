# Projects Page — Design Spec

**Date:** 2026-06-20
**Branch:** feature/restructure
**Status:** Approved (brainstorming) — ready for implementation plan

## 1. Goal & Marketing Positioning

Add a new public page `/projects` plus per-project detail pages `/projects/<slug>` that present VEFS's current and future initiatives in a structured, transparent, donor-confidence-building format. Admin gets a full CRUD form to manage projects following the existing five-content-type pattern.

This page replaces the current `future-plans.html` page and links/aggregates existing events, trainings, and volunteer opportunities under their parent project.

**Primary outcome:** All three — donations, volunteer sign-ups, and credibility — balanced with smart hierarchy. The page must serve a prospective donor, a prospective volunteer, AND a grant reviewer / govt auditor / partner in the same visit without diluting any of those journeys.

**Marketing principles baked into the design:**
- Specificity beats adjectives ("12,400 native saplings in Salem" not "many trees")
- Names + faces — admin guidance recommends photos with people
- Loss-aversion framing on Future projects ("₹2L gap to start")
- Transparency compounds trust — completed projects stay visible
- Frictionless donate — buttons pre-select project on the donate page

## 2. Architecture Summary

A new content type `project` joins the existing six (blog / event / training / volunteer / social / gallery → +project). Stored in `data/projects.json` through `includes/json-store.php` using the existing atomic-write + backup pipeline.

`events.json`, `trainings.json`, `volunteers.json` each get one new optional field — `project_id` — to link activities to their parent project. Backward-compatible: null = unlinked, renders as today.

`gallery.json` items can carry a `project_id` tag. When admin uploads photos via the project form, the Cloudinary asset is created **once**; a gallery entry is auto-created with the project tag; the project record stores only `cloudinary_public_id` references — no URL duplication.

`future-plans.html` is removed; its high-level vision content folds into the new Projects page's hero + Future Projects section.

## 3. Data Model

### 3.1 `data/projects.json`

```json
{
  "projects": [
    {
      "id": "proj_01H...",
      "slug": "indigenous-tree-plantation",
      "name": "Indigenous Tree Plantation Program",
      "objective": "Restore 50,000 native Tamil Nadu tree species across degraded land.",
      "story": "<p>Sanitized HTMLPurifier-backed rich text...</p>",
      "theme": "ecology",
      "status": "active",
      "location": "Salem & Namakkal districts",
      "start_date": "2024-06-15",
      "end_date": null,
      "hero_image": "vefs/projects/tree-plantation-hero",
      "photos": [
        { "public_id": "vefs/projects/tree-plantation-1", "caption": "First sapling drive, June 2024" }
      ],
      "impact_metrics": [
        { "label": "Trees planted", "value": 12400, "unit": "", "icon": "tree" },
        { "label": "Villages reached", "value": 8, "unit": "", "icon": "village" }
      ],
      "fundraising": {
        "target_amount": 500000,
        "raised_amount": 120000,
        "donor_count": 47,
        "show_progress": true
      },
      "proposed_budget": null,
      "expected_beneficiaries": null,
      "required_volunteers": null,
      "sponsorship_opportunities": null,
      "featured": true,
      "order": 1,
      "disabled": false,
      "hide_from_public": false,
      "created_at": "2026-06-20T10:00:00Z",
      "updated_at": "2026-06-20T10:00:00Z"
    }
  ]
}
```

**Enums:**
- `theme`: `ecology` | `livelihood` | `women` | `education` | `heritage`
- `status`: `planning` | `active` | `completed` | `paused`

**Future-only fields** (used when `status = "planning"`):
- `proposed_budget` (number ₹)
- `expected_beneficiaries` (string, free-form e.g. "200 farmer families")
- `required_volunteers` (integer)
- `sponsorship_opportunities` (rich text — what sponsors get)

When `status != "planning"` these fields are null and the planning section is hidden in the form and the public detail page.

### 3.2 Additions to existing JSON files

`events.json` items, `trainings.json` items, `volunteers.json` items each get an **optional** field:

```json
"project_id": "proj_01H..."   // null when not linked to a project
```

No other changes to existing schemas. Existing items without `project_id` are treated as `null`.

### 3.3 Additions to `gallery.json`

Each gallery item gains an optional:

```json
"project_id": "proj_01H..."   // null when not linked
```

Used by:
- The Gallery page to offer a "Filter by project" pill
- The Project detail page to render the photo strip
- The cascade-delete prompt when a project is removed

## 4. Public Pages

### 4.1 `/projects` — Listing Page (`projects.html`)

Top-to-bottom:

1. **Hero — Impact Dashboard**
   Headline + 4 animated counters aggregated from all active+completed projects' `impact_metrics`:
   `Trees planted · Farmers trained · Villages reached · ₹ Raised`
   Two equal CTAs: **Donate** (scrolls to grid) · **Volunteer with us** (jumps to volunteer page).

2. **Featured Project carousel**
   Auto-rotates every 7s (reuse homepage blog carousel JS pattern). Pulls `featured = true` projects. Full-width hero photo, name, objective, progress bar, "Read full story →".

3. **Filter bar (sticky)**
   - Status pills: `Active` (default) · `Planning` · `Completed` · `All`
   - Theme pills: 5 theme chips
   - Search input (client-side filter on name + objective)

4. **Active Projects grid** (2-col desktop, 1-col mobile)
   Card shows: hero photo + theme chip · name + 1-line objective · location + start month/year · top 2 impact metrics · progress bar (`₹X of ₹Y · N donors · Z% funded`) hidden if `show_progress=false` · **Donate to this project** primary CTA · **Volunteer** secondary CTA (only if linked volunteer slots exist) · "Read the full story →" link.

5. **Future Projects section**
   Header: *"What's next — and how you can shape it"*. Cards have softer/dashed-border visual treatment to signal planning stage. Shows: proposed_budget · expected_beneficiaries · required_volunteers · target start · CTA: **Become a sponsor** (opens contact form pre-filled with `?subject=Sponsor%20<project-name>`). Donation progress bar shown if admin set a target.

6. **Completed Projects strip** (collapsed accordion)
   Compact horizontal cards: name · dates · headline impact stat · "View results →". Builds credibility for grant applications without cluttering the active view.

7. **Closing CTA block**
   *"Have a project idea or want to sponsor one? Talk to us."* → contact form.

**Implementation:** Static `projects.html` shell + `js/projects.js` does `fetch('/data/projects.json')` and renders client-side. Filters/search are client-side. Animated counters use IntersectionObserver to trigger on scroll-into-view. Public JS filters out `disabled = true` and `hide_from_public = true` items.

### 4.2 `/projects/<slug>` — Detail Page (`project-detail.php`)

Server-rendered like `blog-post.php` for SEO + WhatsApp/social share previews (Open Graph tags). Rewrite rule added to `.htaccess` (mirrored in `router.php` for local dev).

Layout:
- Full-width hero photo · project name · status badge · theme chip · location · started date
- **Sticky right-side donate card** (desktop): target, raised, progress bar, donor count, **Donate** button, share row (WhatsApp, Twitter, Facebook, copy link). On mobile, this card sits below the hero.
- Full story (sanitized HTML)
- Inline photo gallery (resolves `photos[].public_id` to Cloudinary URLs at render time)
- **"Active right now" section** — auto-listed linked events / trainings / volunteer slots pulled from their JSON files via `project_id`
- Impact metrics block (large, scannable)
- Final donate CTA + share row

`project-detail.php` reads `data/projects.json`, finds project by slug, 404s if missing or `disabled`/`hide_from_public`. Sanitizes nothing on read (already sanitized at write time by `sanitize-html.php`).

### 4.3 Cross-page integration

- **Nav:** "Projects" link added to the main nav across all public pages (replacing "Future Plans"). New badge logic if/when a new project ships (mirror the recent Blog NEW badge pattern, optional — defer until requested).
- **Donate page:** Accepts `?project=<slug>` query string and pre-selects that project in the donation form.
- **Contact page:** Accepts `?subject=...` query string and pre-fills the subject for the sponsorship CTA.
- **Gallery page:** New "Filter by project" pill row using gallery items' `project_id`.
- **Home page (`index.html`):** Optional — add a "Current Projects" rail (3 featured cards) below the existing blog rail in a future iteration; not in scope for this spec.

## 5. Admin Panel

Follows the existing CRUD pipeline exactly. Register `project` in `admin_array_key_for_type()` and the content-type whitelist in `includes/admin-helpers.php`; the generic `save.php` / `delete.php` / `duplicate.php` / `toggle.php` / `reorder.php` endpoints under `admin/api/` then work for projects with no new endpoints needed.

### 5.1 New files

- `admin/form-project.php` — create/edit form
- `admin/assets/form-project.js` — client-side validation, photo uploader integration, dynamic field show/hide on status change
- `admin/projects-list.php` — list view (or extend `dashboard.php` with a Projects card + dedicated list page)
- `data/projects.json` — seeded with `{"projects": []}`

### 5.2 Form layout — `admin/form-project.php`

Collapsible accordion sections so the admin only sees what's relevant:

**A. Basics**
Name (required) · Slug (auto from name, editable, uniqueness check) · Objective (textarea, 140-char counter, required) · Theme (dropdown) · Status (dropdown — toggles downstream sections) · Location · Start date · End date (only when status = Completed) · Featured toggle (pins to hero carousel).

**B. Story & Photos**
- Story — rich-text editor sanitized via HTMLPurifier (reuse blog form's editor)
- Hero image — Cloudinary upload widget (reuse gallery uploader)
- Additional photos — multi-upload; each upload pushes to Cloudinary once, auto-creates a `gallery.json` entry tagged with `project_id`, project record stores `public_id` + caption
- "Pick from existing gallery" — modal lets admin link existing gallery items to this project (no re-upload)

**C. Impact Metrics** — repeatable rows
Label · Value · Unit · Icon (optional preset dropdown). Helper text: *"Be specific — '12,400 trees' beats 'many trees.'"*

**D. Fundraising**
Target ₹ · Raised ₹ · Donor count · "Show progress publicly" toggle (default on). Helper: *"Update after each donation batch — visitors trust accurate numbers."*

**E. Future Project fields** — only visible when status = Planning
Proposed budget · Expected beneficiaries · Required volunteers · Sponsorship opportunities (rich text).

**F. Linked Activities** — read-only listing
Auto-pulled from events/trainings/volunteers where `project_id` matches. Buttons: "Link a new event" / "Link a new training" / "Link a new volunteer slot" open the respective forms with `project_id` pre-filled.

**G. Visibility** (matches existing pattern)
`disabled` toggle · `hide_from_public` toggle · `order` (drag-to-reorder from the list page).

### 5.3 Additions to existing forms

`form-event.php`, `form-training.php`, `form-volunteer.php` each get **one** new field at the top: **"Linked Project"** — dropdown populated from `projects.json` (optional, default null). No other changes.

### 5.4 Dashboard

`dashboard.php` gains a Projects card mirroring Events/Trainings:
- Total / Active / Planning counts
- Recent edits
- "+ New Project" button
- Link to the projects list view

Projects list view shows: name · theme chip · status · raised/target · last updated · actions (Edit / Duplicate / Toggle disable / Delete).

### 5.5 Security & validation

- All endpoints require valid session (`auth.php`) AND CSRF token (`csrf.php`) — no exceptions
- Rich-text fields (`story`, `sponsorship_opportunities`) sanitized via `sanitize-html.php` (HTMLPurifier) before save
- `validate.php` rules:
  - Required: name, objective, theme, status, location, start_date
  - Slug: unique within `projects.json`, kebab-case, max 80 chars
  - `fundraising.raised_amount <= fundraising.target_amount` when both set
  - Cloudinary `public_id` format check on hero_image and photos[]
  - Date sanity: `end_date >= start_date` when both set
  - Future-only fields rejected when status != planning

### 5.6 Backup & deletion

- `json-store.php` already rotates backups to `data/backups/` on every save — projects piggyback
- On project delete: prompt admin "Also remove N linked gallery photos? Unlink N events/trainings/volunteer slots?" — defaults: keep gallery photos, set linked items' `project_id` to null

## 6. Files to Create / Modify

**Create:**
- `VEFS-website/projects.html`
- `VEFS-website/project-detail.php`
- `VEFS-website/js/projects.js`
- `VEFS-website/css/components/projects.css` (or extend existing components stylesheet)
- `VEFS-website/admin/form-project.php`
- `VEFS-website/admin/assets/form-project.js`
- `VEFS-website/admin/projects-list.php`
- `VEFS-website/data/projects.json` (seeded empty)
- `VEFS-website/tests/test-projects.php` (PHP unit tests for project validation + project_id linking)

**Modify:**
- `VEFS-website/includes/admin-helpers.php` — register `project` content type
- `VEFS-website/includes/validate.php` — project validation rules
- `VEFS-website/admin/form-event.php`, `form-training.php`, `form-volunteer.php` — add Linked Project dropdown
- `VEFS-website/admin/form-gallery.php` — add Linked Project dropdown (so gallery uploads can also tag manually)
- `VEFS-website/admin/dashboard.php` — Projects card
- `VEFS-website/.htaccess` — rewrite rule `/projects/<slug>` → `project-detail.php?slug=<slug>`
- `VEFS-website/router.php` — mirror the rewrite for local dev
- All public HTML pages — replace "Future Plans" nav link with "Projects"
- `VEFS-website/donate.html` (or its handler) — read `?project=<slug>` query string
- `VEFS-website/contact.html` (or its handler) — read `?subject=...` query string
- `VEFS-website/gallery.html` + `js/gallery.js` — "Filter by project" pill row

**Remove:**
- `VEFS-website/future-plans.html` (content folded into Projects page hero + Future Projects section)

## 7. Build Sequence (high-level)

1. Data layer: `projects.json` seed, register content type in admin-helpers, validation rules, unit tests
2. Admin form: `form-project.php` + JS, dashboard card, list view — verify CRUD via existing generic endpoints
3. Cross-form changes: add Linked Project dropdown to event/training/volunteer/gallery forms
4. Public listing page: `projects.html` + `js/projects.js` (hero, carousel, grid, future section, completed strip)
5. Detail page: `project-detail.php` + `.htaccess` + `router.php` rewrites + OG tags
6. Cross-page integration: nav swap on all public pages, donate page query-string handling, gallery filter
7. Remove `future-plans.html` and all references
8. Seed 2–3 sample projects (one active, one planning, one completed) for visual review
9. Playwright E2E specs covering: listing renders, filters work, detail page loads, donate CTA passes query string, admin CRUD round-trip, project_id linking on events

## 8. Out of Scope (for this spec)

- Live Razorpay/UPI integration auto-updating `raised_amount` — manual entry only for v1
- Public donor wall ("top supporters" list) — can be added later with opt-in
- Multi-language (Tamil) toggle on the projects page — handle in a separate spec
- Home page "Current Projects" rail — separate iteration
- "NEW" nav badge for newly added projects — defer

## 9. Open Decisions Deferred to Implementation

- Exact icon set for impact metrics (admin dropdown vs free-text emoji vs SVG library — pick lightest at build time)
- Whether `featured` carousel auto-rotates or requires explicit pin-order (start with auto-rotate, add ordering if needed)
- Exact theme color tokens for the 5 theme chips (Ecology=sage primary, Livelihood=golden secondary, etc. — finalize against design system tokens at build time)
