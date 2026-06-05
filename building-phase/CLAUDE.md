# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VEFS Foundation Website** — Valluvam Ecological Farming and Social Welfare Foundation (Tamil Nadu non-profit Trust, founded 2019). Public marketing/info site plus a password-protected PHP admin panel for managing dynamic content.

**Hosting:** Hostinger shared hosting — Apache + PHP 7.4+, no Node runtime in production.
**Status:** Active implementation. Current branch `feature/restructure` is building out the admin panel (CRUD forms for events, trainings, volunteers, blog, social — Duplicate / Enable-Disable / hide-from-public actions recently landed).

## Repository Layout

```
building-phase/                  ← repo root (working copy / dev workspace)
├── VEFS-website/                ← THE SITE — deploy this folder's contents to Hostinger public_html/
│   ├── *.html                   ← 9 public pages (index, about, trainings, events, volunteer,
│   │                              gallery, contact, donate, future-plans) + blog.html, privacy, terms
│   ├── blog-post.php            ← dynamic blog post renderer (/blog/<slug>)
│   ├── router.php               ← LOCAL DEV ONLY — used by `php -S` to mimic Apache rewrites
│   ├── admin/                   ← password-protected admin panel (PHP, see below)
│   ├── includes/                ← shared PHP: auth, csrf, json-store, validate, sanitize-html, admin-helpers
│   ├── forms/newsletter.php     ← public newsletter signup handler
│   ├── data/*.json              ← single source of truth for dynamic content
│   ├── data/backups/            ← auto-rotated JSON backups written on every admin save
│   ├── css/                     ← theme.css, layout.css, components/, responsive-mobile.css, etc.
│   ├── js/                      ← per-page scripts (events.js, trainings.js, …) + components/ + utils.js
│   ├── images/, videos/, vendor/htmlpurifier
│   ├── tests/                   ← PHP unit tests for includes/ (csrf, json-store, validate, sanitize-html)
│   └── llms.txt                 ← AI-agent-readable summary of the org
├── VEFS-requirements/           ← original spec docs (pages/, technical/, data-schemas/, styles/)
├── VEFS-builder/                ← project mgmt, testing artifacts, deployment guides, content docs
├── docs/                        ← additional design/architecture notes
├── package.json + node_modules/ ← Playwright (dev/test only — NOT shipped to prod)
└── test_modal_scroll.spec.js    ← root-level Playwright spec
```

The repo root also contains working-notes files (`bug_list.txt`, `changesrequired.txt`, `newfeature_list.txt`, `information needed.txt`, `mobil_version_need fix.jpg`). These are scratch notes — read them when relevant but don't deploy them.

## Critical Constraints (Production)

**Available:** Static HTML/CSS/JS, PHP 7.4+, MySQL (unused so far), FTP/SFTP, `.htaccess`.
**NOT available:** Node.js runtime, build tools, JS frameworks, CI/CD, custom long-running servers, WebSockets.

Implications:
- Vanilla JS only (no JSX/TS compilation). Plain CSS (no Sass/PostCSS).
- **What you write is what ships.** No build step — FTP upload is the deploy.
- Third-party libs must be CDN-linked or vendored (see `vendor/htmlpurifier`).
- Playwright in `package.json` is **dev-only** for local automated testing; it is not part of the deploy.

## Architecture

### Two-tier system: JSON-as-database

```
┌────────────────────────┐         ┌─────────────────────┐         ┌────────────────────┐
│  Admin panel (PHP)     │ writes  │  data/*.json        │  reads  │  Public pages      │
│  /admin/* + api/*.php  │────────▶│  events, trainings, │◀────────│  fetch() from JS,  │
│  CSRF + session auth   │         │  volunteers, blog,  │         │  or PHP renders    │
│                        │         │  social, gallery    │         │  (blog-post.php)   │
└────────────────────────┘         └─────────────────────┘         └────────────────────┘
```

`includes/json-store.php` is the single read/write gateway — handles atomic writes, backups into `data/backups/`, and locking. **Never write JSON files by hand from PHP**; go through `json_store_*` functions.

### Five content types, one CRUD pipeline

Admin handles five content types uniformly: `blog`, `social`, `event`, `training`, `volunteer`. Each has:
- A form page: `admin/form-<type>.php` + matching `admin/assets/form-<type>.js`
- Shared API endpoints under `admin/api/`: `save.php`, `delete.php`, `duplicate.php`, `toggle.php` (enable/disable / hide-from-public), `reorder.php`
- A JSON file in `data/` (key inside the file determined by `admin_array_key_for_type()` in `includes/admin-helpers.php`)

All admin API calls are JSON POSTs, require a valid session (`auth.php`) AND a CSRF token (`csrf.php`), and sanitize rich-text fields through HTMLPurifier (`sanitize-html.php`) and `validate.php`.

### Public-page data loading

Per-page JS (e.g. `js/events.js`, `js/trainings.js`, `js/volunteers.js`, `js/gallery.js`, `js/blog-home.js`, `js/social-home.js`) does `fetch('/data/<type>.json')` and renders client-side. The blog detail page is the exception — `blog-post.php` server-renders so individual posts have crawlable HTML and clean URLs (`/blog/<slug>` via `.htaccess` rewrite, mirrored in `router.php` for local dev).

Admin-driven flags like "disabled" or "hide from public page" are filtered out **client-side** by the public JS reading the JSON — keep that filter in mind when adding new fields.

### Form submissions (public → email)

Public registration/contact/donation forms use the legacy flow specified in `VEFS-requirements/technical/REGISTRATION_SYSTEM.md`: client-side validation → PHP handler → Gmail API → email to admin + user confirmation. Currently `forms/newsletter.php` exists; other registration handlers are being built out.

### Auth model

Single shared admin password stored hashed in `admin/config.php` (gitignored — `config.sample.php` is the template). Sessions are short-lived; 15-minute lockout after failed attempts. There is no user table or role system.

## Tech Stack Snapshot

- **Frontend:** HTML5, CSS3 (CSS custom properties for theming), vanilla ES6+. Google Fonts: Lora (serif headings), Inter (sans body).
- **Backend:** PHP 7.4+ for admin, form handlers, blog rendering. HTMLPurifier vendored for HTML sanitization.
- **Email:** Gmail API via Google API PHP Client (OAuth2, 2,000/day quota). Setup: `VEFS-requirements/technical/JSON_API_GMAIL_INTEGRATION.md`.
- **Storage:** JSON files in `data/`. MySQL is available but not used.
- **Testing:** Playwright (`@playwright/test`) for browser E2E; PHP test scripts in `VEFS-website/tests/`.

## Common Commands

Run from the **repo root** (`building-phase/`) unless noted.

```bash
# Local dev server (run from VEFS-website/) — uses router.php to mimic Apache rewrites
cd VEFS-website && php -S localhost:8000 router.php

# Static-only alternative (no PHP — won't run admin / blog-post.php)
cd VEFS-website && python -m http.server 8000

# Playwright E2E (devDependency installed at repo root)
npx playwright test                              # all specs
npx playwright test test_modal_scroll.spec.js    # single spec
npx playwright test --ui                         # interactive mode

# PHP unit tests for includes/ (run from VEFS-website/)
php tests/test-runner.php                        # runs all test-*.php
php tests/test-csrf.php                          # individual suite
```

No npm/lint/build commands — `package.json` only carries the Playwright devDependency.

## Design System (essentials)

```css
--color-primary:   #6B8E23;  /* Sage Green   — primary brand */
--color-secondary: #D4A574;  /* Golden/Amber — CTAs */
--color-accent:    #8B7355;  /* Earth Brown  */
```

- 8px spacing scale: xs(8) sm(16) md(24) lg(32) xl(48) 2xl(64) 3xl(96).
- Mobile-first; design for ≥320px, enhance up.
- WCAG 2.1 AA required (4.5:1 contrast, keyboard nav, 2px sage focus ring, alt text everywhere).
- Full spec: `VEFS-requirements/styles/DESIGN_SYSTEM.md`, components in `VEFS-requirements/technical/COMPONENT_LIBRARY.md`.

## Performance Targets

FCP < 1.5s · LCP < 2.5s · Page size < 2MB · < 50 requests/page · JPEG photos < 200KB · `loading="lazy"` on below-fold images.

## Security Notes

- All admin API endpoints check **session AND CSRF token** — never add an endpoint that skips either.
- All user-supplied HTML must pass through `sanitize-html.php` (HTMLPurifier) before being stored.
- `.htaccess` enforces HTTPS and sets `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`.
- Public forms use CSRF + honeypot + rate limiting; duplicate registrations checked against `data/recent-registrations.json` (per spec).
- `admin/config.php`, `/backups/`, `/logs/` must not be web-readable. Permissions: dirs 755, files 644.

## Where Spec Lives

`VEFS-requirements/` is the source of truth for design intent and was written before code. When code and spec disagree, ask which one is current — the implementation is the authoritative answer in most cases now, but a few areas (registration form handlers) still defer to the spec.

Key indexes:
- Pages: `VEFS-requirements/pages/*.md` (one per public page)
- System architecture: `VEFS-requirements/technical/{TECHNICAL_IMPLEMENTATION,REGISTRATION_SYSTEM,FILE_MANAGEMENT_SYSTEM,INTEGRATION_SPECIFICATIONS,JSON_API_GMAIL_INTEGRATION}.md`
- Data schemas: `VEFS-requirements/data-schemas/*.md`

`VEFS-builder/` holds project-management, deployment, and content-handoff docs — never write new docs at the repo root; put them in the appropriate `VEFS-builder/0X-*` subfolder.

## Working-File Conventions

- **Generated docs / test screenshots / deployment scripts** → `VEFS-builder/0X-*/` subfolders (see `04-TESTING/screenshots/`, `05-DEPLOYMENT/`, `06-DOCUMENTATION/`).
- **Site code** → `VEFS-website/`.
- **Repo root** stays clean: only `CLAUDE.md`, `package.json`, `.mcp.json`, and the working-notes `.txt` files belong there.

## Key Reminders

1. **No build process** — FTP-deployed VEFS-website/ contents go straight to prod.
2. **Vanilla JS only** — no frameworks, no TS, no JSX.
3. **JSON is the database.** All dynamic content lives in `data/*.json`. The admin panel is the canonical writer; public JS is a reader.
4. **Admin endpoints = session + CSRF + sanitize.** Don't shortcut any of the three.
5. **Email-based contact flow** — there is no admin notifications dashboard; registrations land in inbox via Gmail API.
6. **Mobile-first + WCAG AA** are hard requirements, not nice-to-haves.
7. **Playwright MCP** is configured (`.mcp.json`) for browser-driven verification — use it for visual / regression checks before declaring UI work done.
