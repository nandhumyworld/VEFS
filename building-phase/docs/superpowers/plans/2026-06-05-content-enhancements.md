# Content Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship five user-requested enhancements to the VEFS site — gallery admin CRUD, a Blog promotion in the main nav, a homepage social media rail, a homepage blog slider, and a shared "NEW" indicator across all six content types — without changing the underlying architecture.

**Architecture:** Five features land inside the existing vanilla-JS + PHP admin + JSON-as-DB + Cloudinary system. The gallery becomes the 6th content type in the existing admin CRUD pipeline; a new shared CSS-animated NEW badge and a small `isItemNew()` helper drive a single new `isNew` field across all types; two new homepage sections (social rail + blog slider) are vanilla-JS components; the Blog nav link with a date-gated NEW badge is a tiny snippet replicated across 13 HTML pages.

**Tech Stack:** PHP 7.4+, vanilla ES6 JS, plain CSS, JSON files in `data/`, Cloudinary unsigned uploads, HTMLPurifier (already vendored), Playwright (E2E, dev-only).

**Spec:** `docs/superpowers/specs/2026-06-05-content-enhancements-design.md`

---

## File Map

**New files:**
- `VEFS-website/css/components/badge-new.css` — the shared blinking NEW badge.
- `VEFS-website/css/components/horizontal-rail.css` — shared horizontal scroll rail (used by social rail).
- `VEFS-website/css/components/blog-slider.css` — manual blog slider on the homepage.
- `VEFS-website/js/components/blog-nav-badge.js` — date-gated NEW badge for the Blog nav link.
- `VEFS-website/includes/content-helpers.php` — `is_item_new($item)` PHP helper used by `blog-post.php`.
- `VEFS-website/admin/form-gallery.php` — admin form for gallery items.
- `VEFS-website/admin/assets/form-gallery.js` — JS for the gallery form (Cloudinary upload + save).
- `VEFS-website/tests/test-validate-isnew.php` — PHP unit tests for the new `isNew` validator.
- `VEFS-website/tests/test-validate-gallery.php` — PHP unit tests for gallery validation.

**Files modified:**
- `VEFS-website/js/utils.js` — add `isItemNew()` helper.
- `VEFS-website/includes/validate.php` — add `_validate_is_new()` helper and `validate_gallery()`; call `_validate_is_new()` from each existing `validate_*()` function.
- `VEFS-website/includes/admin-helpers.php` — register `gallery` in maps; broaden id prefix lookup.
- `VEFS-website/admin/dashboard.php` — add Gallery card.
- `VEFS-website/admin/form-blog.php`, `form-social.php`, `form-event.php`, `form-training.php`, `form-volunteer.php` — add NEW-indicator radio group.
- `VEFS-website/js/events.js`, `trainings.js`, `volunteers.js`, `gallery.js`, `blog.js`, `blog-home.js`, `social-home.js` — render NEW badge.
- `VEFS-website/blog-post.php` — render NEW badge server-side.
- `VEFS-website/index.html` — insert social rail and blog slider sections; include `blog-slider.css`, `horizontal-rail.css`, `badge-new.css`.
- All 13 public HTML pages (`index.html`, `about.html`, `trainings.html`, `events.html`, `volunteer.html`, `gallery.html`, `future-plans.html`, `contact.html`, `donate.html`, `blog.html`, `privacy.html`, `terms.html`, `registration-confirmation.html`) — add Blog nav link with NEW badge slot; include `badge-new.css` + `blog-nav-badge.js`.
- `VEFS-website/data/gallery.json` — migrate to `{metadata, items: []}` shape (existing array backed up).

**Data:**
- `VEFS-website/data/backups/gallery.pre-migration.json` — one-time backup of the pre-migration gallery file (created by the migration task).

---

## Phase A — Shared Building Blocks

### Task 1: Add CSS-animated NEW badge

**Files:**
- Create: `VEFS-website/css/components/badge-new.css`

- [ ] **Step 1: Create `VEFS-website/css/components/badge-new.css`**

```css
/* Shared "NEW" indicator badge — blinks red/yellow.
   Respects prefers-reduced-motion. */

.badge-new {
  display: inline-block;
  padding: 2px 8px;
  margin-left: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  background: #d32f2f;
  border-radius: 4px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  vertical-align: middle;
  animation: badge-new-blink 1s steps(2, end) infinite;
}

@keyframes badge-new-blink {
  0%, 100% { background: #d32f2f; color: #fff; }
  50%      { background: #f9a825; color: #1a1a1a; }
}

@media (prefers-reduced-motion: reduce) {
  .badge-new { animation: none; }
}
```

- [ ] **Step 2: Commit**

```bash
git add VEFS-website/css/components/badge-new.css
git commit -m "feat(ui): add shared CSS-animated NEW badge component"
```

---

### Task 2: Add `isItemNew()` helper to `js/utils.js`

**Files:**
- Modify: `VEFS-website/js/utils.js` (append to end)

- [ ] **Step 1: Inspect existing `utils.js`**

Run: `head -60 VEFS-website/js/utils.js`
Note: this file is loaded as a plain `<script>`, NOT an ES module. Helpers are attached to `window.VEFS_UTILS` or exposed as globals — follow whichever pattern already exists.

- [ ] **Step 2: Append `isItemNew()` to `VEFS-website/js/utils.js`**

Append at the end of the file (replace `// EXISTING_END` mentally with the actual last line; do not delete anything):

```js
/**
 * Returns true if the item should display the "NEW" badge.
 *  - item.isNew === true  → always show
 *  - item.isNew === false → never show
 *  - item.isNew === "auto" or undefined → show if createdAt within 7 days
 */
function isItemNew(item) {
  if (!item || typeof item !== 'object') return false;
  if (item.isNew === true) return true;
  if (item.isNew === false) return false;
  // auto / undefined
  const created = item.createdAt || item.created_at || null;
  if (!created) return false;
  const ageMs = Date.now() - new Date(created).getTime();
  if (Number.isNaN(ageMs)) return false;
  return ageMs >= 0 && ageMs < 7 * 24 * 60 * 60 * 1000;
}

/** Returns the markup for the NEW badge (or empty string). */
function renderNewBadge(item) {
  return isItemNew(item) ? '<span class="badge-new">NEW</span>' : '';
}

// Expose globally for non-module scripts.
window.isItemNew = isItemNew;
window.renderNewBadge = renderNewBadge;
```

- [ ] **Step 3: Sanity-check from the dev server**

Run: `cd VEFS-website && php -S localhost:8000 router.php` (in background) then open `http://localhost:8000` and in the browser console:

```js
isItemNew({ createdAt: new Date().toISOString() }); // → true
isItemNew({ createdAt: new Date(Date.now() - 8*24*3600*1000).toISOString() }); // → false
isItemNew({ isNew: true }); // → true
isItemNew({ isNew: false, createdAt: new Date().toISOString() }); // → false
```

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/js/utils.js
git commit -m "feat(js): add isItemNew + renderNewBadge helpers"
```

---

### Task 3: Add `is_item_new()` PHP helper

**Files:**
- Create: `VEFS-website/includes/content-helpers.php`

- [ ] **Step 1: Create `VEFS-website/includes/content-helpers.php`**

```php
<?php
declare(strict_types=1);

/**
 * Mirrors js/utils.js::isItemNew for PHP-rendered pages (e.g. blog-post.php).
 *
 * @param array $item Content item from data/<type>.json
 * @return bool
 */
function is_item_new(array $item): bool {
    $flag = $item['isNew'] ?? 'auto';
    if ($flag === true)  return true;
    if ($flag === false) return false;

    $created = (string)($item['createdAt'] ?? $item['created_at'] ?? '');
    if ($created === '') return false;

    $ts = strtotime($created);
    if ($ts === false) return false;

    $ageSec = time() - $ts;
    return $ageSec >= 0 && $ageSec < 7 * 24 * 60 * 60;
}

/** Returns the markup for the NEW badge (or empty string). */
function render_new_badge(array $item): string {
    return is_item_new($item) ? '<span class="badge-new">NEW</span>' : '';
}
```

- [ ] **Step 2: Commit**

```bash
git add VEFS-website/includes/content-helpers.php
git commit -m "feat(php): add is_item_new + render_new_badge helpers"
```

---

## Phase B — `isNew` field across existing 5 content types

### Task 4: Add `_validate_is_new()` to `includes/validate.php` (TDD)

**Files:**
- Create: `VEFS-website/tests/test-validate-isnew.php`
- Modify: `VEFS-website/includes/validate.php`

- [ ] **Step 1: Look at existing test runner pattern**

Run: `ls VEFS-website/tests/` and `head -40 VEFS-website/tests/test-validate-phase2.php` to mirror the assertion style (existing tests `require_once` validate.php and call functions directly).

- [ ] **Step 2: Write failing test `VEFS-website/tests/test-validate-isnew.php`**

```php
<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/validate.php';

$pass = 0; $fail = 0;
function _assert(bool $cond, string $msg): void {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok  $msg\n"; }
    else       { $fail++; echo "  FAIL $msg\n"; }
}

echo "test: _validate_is_new accepts 'auto', true, false; rejects anything else\n";

_assert(_validate_is_new('auto')  === null, "'auto' is valid");
_assert(_validate_is_new(true)    === null, "true is valid");
_assert(_validate_is_new(false)   === null, "false is valid");
_assert(_validate_is_new(null)    === null, "null defaults to valid (treated as auto)");

_assert(_validate_is_new('yes')   !== null, "'yes' is rejected");
_assert(_validate_is_new(1)       !== null, "integer 1 is rejected");
_assert(_validate_is_new(0)       !== null, "integer 0 is rejected");
_assert(_validate_is_new([])      !== null, "array is rejected");

echo "\n$pass passed, $fail failed\n";
exit($fail === 0 ? 0 : 1);
```

- [ ] **Step 3: Run test, confirm it fails**

Run: `cd VEFS-website && php tests/test-validate-isnew.php`
Expected: PHP error `Call to undefined function _validate_is_new()`.

- [ ] **Step 4: Add `_validate_is_new()` to `includes/validate.php`**

Open `VEFS-website/includes/validate.php`. After the existing `_is_safe_url()` function (line ~375) add:

```php
/**
 * Validates the isNew flag.
 *  - Allowed: true, false, 'auto', null (treated as auto).
 * Returns an error message on invalid value, or null on valid.
 */
function _validate_is_new($v): ?string {
    if ($v === null) return null;
    if ($v === true || $v === false) return null;
    if ($v === 'auto') return null;
    return 'isNew must be true, false, or "auto".';
}
```

- [ ] **Step 5: Run test, confirm it passes**

Run: `cd VEFS-website && php tests/test-validate-isnew.php`
Expected: `8 passed, 0 failed` and exit code 0.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/includes/validate.php VEFS-website/tests/test-validate-isnew.php
git commit -m "feat(validate): add _validate_is_new helper with tests"
```

---

### Task 5: Wire `_validate_is_new()` into the 5 existing validators

**Files:**
- Modify: `VEFS-website/includes/validate.php`

- [ ] **Step 1: Extend `VEFS-website/tests/test-validate-isnew.php` with per-validator cases**

Append before `echo "\n$pass passed,"`:

```php
echo "\ntest: each validator surfaces isNew errors\n";

// Minimal valid skeletons borrowed from existing fixtures (real validators
// will still complain about other missing fields — we only assert isNew error.)
$bad = ['isNew' => 'maybe'];

foreach (['blog' => 'validate_blog', 'social' => 'validate_social',
          'event' => 'validate_event', 'training' => 'validate_training',
          'volunteer' => 'validate_volunteer'] as $name => $fn) {
    $errs = $fn($bad);
    _assert(isset($errs['isNew']), "$name flags invalid isNew");
}
```

Re-run: `php tests/test-validate-isnew.php` — expect 5 NEW failures (validators don't yet check `isNew`).

- [ ] **Step 2: Add the `isNew` check to each `validate_*()` function**

In `VEFS-website/includes/validate.php`, inside each of `validate_blog`, `validate_social`, `validate_event`, `validate_training`, `validate_volunteer`, add this block immediately before the final `return $e;`:

```php
if (array_key_exists('isNew', $d)) {
    $err = _validate_is_new($d['isNew']);
    if ($err !== null) $e['isNew'] = $err;
}
```

- [ ] **Step 3: Run tests, confirm all pass**

Run: `cd VEFS-website && php tests/test-validate-isnew.php`
Expected: all 13 assertions pass.

- [ ] **Step 4: Run the full test suite to make sure nothing else regressed**

Run: `cd VEFS-website && php tests/test-runner.php`
Expected: every existing suite still passes.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/includes/validate.php VEFS-website/tests/test-validate-isnew.php
git commit -m "feat(validate): enforce isNew on all 5 existing content types"
```

---

### Task 6: Add NEW-indicator radio group to all 5 existing admin forms

**Files:**
- Modify: `VEFS-website/admin/form-blog.php`, `form-social.php`, `form-event.php`, `form-training.php`, `form-volunteer.php`

- [ ] **Step 1: Open one form to find the right insertion point**

Run: `grep -n "disabled\|hiddenFromPublic\|hidden_from_public\|enable\|publish" VEFS-website/admin/form-blog.php | head -20`

We want to insert the NEW radio group near the existing "disabled" / "hidden from public" controls so admins find it grouped with publishing flags.

- [ ] **Step 2: Decide on a shared partial vs duplicated markup**

There is no current partial pattern. To keep this surgical, **duplicate the same `<fieldset>` block in each form** (the markup is short). If we discover an existing include pattern in step 1, prefer it.

- [ ] **Step 3: Add the following `<fieldset>` to each of the 5 forms**

Insert near the existing "disabled / hidden from public" controls (or, if none, immediately before the submit button):

```html
<fieldset class="form-fieldset">
  <legend>"NEW" badge</legend>
  <p class="hint">Auto: shows for 7 days after creation. Use Force on / off to override.</p>
  <label>
    <input type="radio" name="isNew" value="auto" checked> Auto
  </label>
  <label>
    <input type="radio" name="isNew" value="true"> Force on
  </label>
  <label>
    <input type="radio" name="isNew" value="false"> Force off
  </label>
</fieldset>
```

When loading existing items into the form, the corresponding `form-*.js` already serializes form fields. For each of the 5 form JS files (`admin/assets/form-blog.js`, `form-social.js`, `form-event.js`, `form-training.js`, `form-volunteer.js`):

1. **On load:** read `item.isNew` (defaulting to `'auto'`) and check the matching radio.
2. **On submit:** read the chosen radio value. Convert `'true'` / `'false'` strings to booleans; leave `'auto'` as the string. Send as `isNew` in the JSON body.

- [ ] **Step 4: Implementation snippet for each form JS**

Add (or fold into the existing populate/serialize functions):

```js
// Load
const isNewValue = (item && Object.prototype.hasOwnProperty.call(item, 'isNew'))
  ? item.isNew : 'auto';
const radioVal = isNewValue === true ? 'true'
              : isNewValue === false ? 'false'
              : 'auto';
const radio = form.querySelector(`input[name="isNew"][value="${radioVal}"]`);
if (radio) radio.checked = true;

// Serialize
const chosen = (form.querySelector('input[name="isNew"]:checked') || {}).value || 'auto';
payload.isNew = chosen === 'true' ? true : chosen === 'false' ? false : 'auto';
```

- [ ] **Step 5: Manual smoke test**

Run: `cd VEFS-website && php -S localhost:8000 router.php`
- Log into `/admin/`, edit a blog post, set NEW = "Force on", save, reload — radio still shows "Force on".
- Inspect `data/blog.json`, confirm `"isNew": true` saved on that item.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/admin/form-*.php VEFS-website/admin/assets/form-*.js
git commit -m "feat(admin): add NEW indicator radio group to all 5 content forms"
```

---

### Task 7: Render the NEW badge in the 5 existing public render JS files + blog-post.php

**Files:**
- Modify: `VEFS-website/js/events.js`, `trainings.js`, `volunteers.js`, `blog.js`, `blog-home.js`, `social-home.js`
- Modify: `VEFS-website/blog-post.php`
- Modify: `VEFS-website/index.html`, `events.html`, `trainings.html`, `volunteer.html`, `gallery.html`, `blog.html` — include `css/components/badge-new.css`

- [ ] **Step 1: Wire the badge CSS into every page that renders content cards**

In each public HTML page that renders cards (`index.html`, `events.html`, `trainings.html`, `volunteer.html`, `gallery.html`, `blog.html`), add inside `<head>` (next to other component CSS):

```html
<link rel="stylesheet" href="css/components/badge-new.css">
```

- [ ] **Step 2: Inject `renderNewBadge(item)` into each card template in JS**

For each of `events.js`, `trainings.js`, `volunteers.js`, `blog.js`, `blog-home.js`, `social-home.js`:

1. Find the function that builds a card's HTML (e.g., `renderEventCard(ev)` or a template literal).
2. Insert `${renderNewBadge(item)}` next to the title.

Example pattern (use the existing card title position):

```js
// Before
return `<article class="event-card"><h3>${ev.title}</h3>…</article>`;

// After
return `<article class="event-card">
  <h3>${ev.title}${renderNewBadge(ev)}</h3>
  …
</article>`;
```

Do NOT change any other logic in these files.

- [ ] **Step 3: Update `blog-post.php` to include the badge near the post title**

At the top of `VEFS-website/blog-post.php`, add `require_once __DIR__ . '/includes/content-helpers.php';`.

Find where the post's `<h1>` is rendered and add (PHP-escaped variable assumed):

```php
<h1><?= htmlspecialchars($post['title']) ?> <?= render_new_badge($post) ?></h1>
```

Also add the badge CSS link in the same `<head>`:

```html
<link rel="stylesheet" href="/css/components/badge-new.css">
```

- [ ] **Step 4: Manual test**

Run: `cd VEFS-website && php -S localhost:8000 router.php`
- Open `/events.html`. Confirm any item with `createdAt` in the last 7 days shows the blinking NEW badge.
- Set one item's `isNew` to `false` in `data/events.json` and reload — badge gone.
- Set another item's `isNew` to `true` and reload — badge shows even if old.
- In Chrome DevTools, enable Rendering → Emulate CSS prefers-reduced-motion → reduce. Reload: badge stops blinking but stays visible (solid red).

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/js/*.js VEFS-website/blog-post.php VEFS-website/*.html
git commit -m "feat(public): render NEW badge across events, trainings, volunteers, blog, social"
```

---

## Phase C — Gallery Admin (6th content type)

### Task 8: Migrate `data/gallery.json` to the new shape

**Files:**
- Modify: `VEFS-website/data/gallery.json`
- Create: `VEFS-website/data/backups/gallery.pre-migration.json`

- [ ] **Step 1: Back up the current file**

Run: `cp VEFS-website/data/gallery.json VEFS-website/data/backups/gallery.pre-migration.json`

- [ ] **Step 2: Rewrite `VEFS-website/data/gallery.json` to the new shape**

Replace the entire file with:

```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2026-06-05T00:00:00+00:00",
    "total": 0
  },
  "items": []
}
```

The admin will re-upload the 14 photos through the new form once Tasks 11–13 ship.

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/data/gallery.json VEFS-website/data/backups/gallery.pre-migration.json
git commit -m "chore(gallery): migrate gallery.json to {metadata, items} shape"
```

---

### Task 9: Add `validate_gallery()` (TDD)

**Files:**
- Create: `VEFS-website/tests/test-validate-gallery.php`
- Modify: `VEFS-website/includes/validate.php`

- [ ] **Step 1: Write failing test**

Create `VEFS-website/tests/test-validate-gallery.php`:

```php
<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/validate.php';

$pass = 0; $fail = 0;
function _assert(bool $cond, string $msg): void {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok  $msg\n"; }
    else       { $fail++; echo "  FAIL $msg\n"; }
}

$validBase = [
    'title'       => 'Tree planting drive',
    'description' => 'Volunteers at Erode.',
    'year'        => 2024,
    'imageUrl'    => 'https://res.cloudinary.com/vefs/image/upload/x.jpg',
    'isNew'       => 'auto',
];

echo "test: validate_gallery happy path\n";
_assert(validate_gallery($validBase) === [], "valid item produces no errors");

echo "\ntest: validate_gallery requires title\n";
_assert(isset(validate_gallery(['title' => '']     + $validBase)['title']), "empty title rejected");
_assert(isset(validate_gallery(['title' => str_repeat('a', 201)] + $validBase)['title']), "title >200 chars rejected");

echo "\ntest: validate_gallery description optional but ≤500 chars\n";
_assert(validate_gallery(['description' => ''] + $validBase) === [], "empty description allowed");
_assert(isset(validate_gallery(['description' => str_repeat('a', 501)] + $validBase)['description']),
        "description >500 chars rejected");

echo "\ntest: validate_gallery year required, 2000..currentYear\n";
$thisYear = (int)date('Y');
_assert(isset(validate_gallery(['year' => 1999] + $validBase)['year']), "year 1999 rejected");
_assert(isset(validate_gallery(['year' => $thisYear + 1] + $validBase)['year']), "future year rejected");
_assert(validate_gallery(['year' => 2024]  + $validBase) === [], "year 2024 accepted");
_assert(isset(validate_gallery(['year' => 'lol'] + $validBase)['year']), "non-numeric year rejected");

echo "\ntest: validate_gallery imageUrl required https\n";
_assert(isset(validate_gallery(['imageUrl' => ''] + $validBase)['imageUrl']), "empty url rejected");
_assert(isset(validate_gallery(['imageUrl' => 'ftp://x'] + $validBase)['imageUrl']), "ftp url rejected");

echo "\ntest: validate_gallery isNew enum\n";
_assert(isset(validate_gallery(['isNew' => 'maybe'] + $validBase)['isNew']), "invalid isNew rejected");
_assert(validate_gallery(['isNew' => true]  + $validBase) === [], "true accepted");
_assert(validate_gallery(['isNew' => false] + $validBase) === [], "false accepted");

echo "\n$pass passed, $fail failed\n";
exit($fail === 0 ? 0 : 1);
```

- [ ] **Step 2: Run, confirm fail**

Run: `cd VEFS-website && php tests/test-validate-gallery.php`
Expected: `Call to undefined function validate_gallery()`.

- [ ] **Step 3: Add `validate_gallery()` to `includes/validate.php`**

Append before the `_parse_iso_date` helper (line ~369):

```php
function validate_gallery(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be ≤ 200 characters.';

    $desc = (string)($d['description'] ?? '');
    if (mb_strlen($desc) > 500) $e['description'] = 'Description must be ≤ 500 characters.';

    $year = $d['year'] ?? null;
    $thisYear = (int)date('Y');
    if (!is_numeric($year) || (int)$year < 2000 || (int)$year > $thisYear) {
        $e['year'] = 'Year must be an integer between 2000 and ' . $thisYear . '.';
    }

    $url = (string)($d['imageUrl'] ?? '');
    if ($url === '' || !_is_safe_url($url)) {
        $e['imageUrl'] = 'Image URL is required and must be an http/https URL.';
    }

    if (array_key_exists('isNew', $d)) {
        $err = _validate_is_new($d['isNew']);
        if ($err !== null) $e['isNew'] = $err;
    }

    return $e;
}
```

- [ ] **Step 4: Run, confirm pass**

Run: `cd VEFS-website && php tests/test-validate-gallery.php`
Expected: all assertions pass.

- [ ] **Step 5: Run full test runner**

Run: `cd VEFS-website && php tests/test-runner.php`
Expected: every suite passes.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/includes/validate.php VEFS-website/tests/test-validate-gallery.php
git commit -m "feat(validate): add validate_gallery with tests"
```

---

### Task 10: Register `gallery` in `admin-helpers.php`

**Files:**
- Modify: `VEFS-website/includes/admin-helpers.php`

- [ ] **Step 1: Open `VEFS-website/includes/admin-helpers.php` and update three lookup tables**

Replace the function bodies:

```php
function admin_array_key_for_type(string $type): ?string {
    return [
        'blog'      => 'posts',
        'social'    => 'posts',
        'event'     => 'events',
        'training'  => 'trainings',
        'volunteer' => 'volunteers',
        'gallery'   => 'items',
    ][$type] ?? null;
}

function admin_display_title(string $type, array $row): string {
    if ($type === 'social') return (string)($row['caption'] ?? '');
    return (string)($row['title'] ?? '');
}

function admin_display_thumb(string $type, array $row): string {
    return (string)(
        $row['cover_image_url']
        ?? $row['thumbnail_url']
        ?? $row['imageUrl']
        ?? $row['images']['featured']
        ?? $row['media']['featuredImage']
        ?? ''
    );
}

function admin_data_filename(string $type): string {
    return [
        'blog'      => 'blog.json',
        'social'    => 'social.json',
        'event'     => 'events.json',
        'training'  => 'trainings.json',
        'volunteer' => 'volunteers.json',
        'gallery'   => 'gallery.json',
    ][$type];
}
```

Also extend the id-prefix logic. If `admin_next_id()` callers use a per-type prefix elsewhere (check `admin/api/save.php`), add a `gallery` → `gal` mapping there:

Run: `grep -n "admin_next_id" VEFS-website/admin/api/*.php`

Wherever a prefix dictionary exists (likely a `match` or array in `save.php`), add `'gallery' => 'gal',`. If only one place currently maps types to prefixes, edit it.

- [ ] **Step 2: Confirm save.php now accepts type=gallery**

Open `VEFS-website/admin/api/save.php`. Look for any `in_array($type, [...])` whitelist of allowed types. Add `'gallery'` to that whitelist if present.

Do the same in `admin/api/delete.php`, `duplicate.php`, `toggle.php`, `reorder.php`. (Run `grep -n "'blog'" VEFS-website/admin/api/*.php` and mirror.)

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/includes/admin-helpers.php VEFS-website/admin/api/*.php
git commit -m "feat(admin): register gallery as 6th content type across helpers + APIs"
```

---

### Task 11: Add Gallery card to admin dashboard

**Files:**
- Modify: `VEFS-website/admin/dashboard.php`

- [ ] **Step 1: Inspect existing card pattern**

Run: `grep -n "form-blog\|form-event\|form-training" VEFS-website/admin/dashboard.php`

The dashboard renders a card per content type. Replicate the closest pattern (likely a loop over a static list, or one block per type).

- [ ] **Step 2: Add a Gallery card matching the others**

Add a new card whose primary link is `form-gallery.php?id=<id>` (edit) and "Create new" link is `form-gallery.php` (no id). It should list existing items by `title` + year and show the Cloudinary thumbnail.

If the dashboard iterates a `$types` array, add `'gallery'` to it. If it has handwritten sections, copy the most similar (`event`) section and adapt:
- Heading: "Gallery"
- List source: `data/gallery.json` → `items`
- Per-row display: `title` + ` (year)` + Enable/Disable + Hide-from-public + Duplicate + Delete using the existing API endpoints

- [ ] **Step 3: Smoke test**

Run: `cd VEFS-website && php -S localhost:8000 router.php`, log into admin, confirm Gallery card appears.

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/admin/dashboard.php
git commit -m "feat(admin): add Gallery card to dashboard"
```

---

### Task 12: Create `admin/form-gallery.php` + `admin/assets/form-gallery.js`

**Files:**
- Create: `VEFS-website/admin/form-gallery.php`
- Create: `VEFS-website/admin/assets/form-gallery.js`

- [ ] **Step 1: Use `form-social.php` as the template**

Run: `cat VEFS-website/admin/form-social.php`

The social form is the closest in shape (single image + caption + minimal metadata). Copy its structure, then adapt fields.

- [ ] **Step 2: Create `VEFS-website/admin/form-gallery.php`**

Template (mirror the social form's auth + CSRF + config bootstrap, then this body):

```html
<form id="gallery-form" autocomplete="off">
  <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
  <input type="hidden" name="id"   value="<?= htmlspecialchars($id ?? '') ?>">

  <fieldset class="form-fieldset">
    <legend>Photo</legend>
    <div id="cloudinary-uploader"></div>
    <input type="hidden" name="imageUrl" id="imageUrl">
    <p class="hint">JPG/PNG. Recommended ≥ 1200px wide.</p>
  </fieldset>

  <label>Title <span class="req">*</span>
    <input type="text" name="title" maxlength="200" required>
  </label>

  <label>Description
    <textarea name="description" maxlength="500" rows="3"></textarea>
  </label>

  <label>Year <span class="req">*</span>
    <input type="number" name="year" min="2000" max="<?= (int)date('Y') ?>" required>
  </label>

  <fieldset class="form-fieldset">
    <legend>"NEW" badge</legend>
    <label><input type="radio" name="isNew" value="auto" checked> Auto</label>
    <label><input type="radio" name="isNew" value="true">  Force on</label>
    <label><input type="radio" name="isNew" value="false"> Force off</label>
  </fieldset>

  <label><input type="checkbox" name="disabled"> Disabled</label>
  <label><input type="checkbox" name="hiddenFromPublic"> Hidden from public page</label>

  <button type="submit" class="btn-primary">Save</button>
  <a href="dashboard.php" class="btn-secondary">Cancel</a>
</form>

<script>
window.VEFS_CONFIG = {
  cloudinary: {
    cloud_name:    <?= json_encode($cfg['cloudinary']['cloud_name']) ?>,
    upload_preset: <?= json_encode($cfg['cloudinary']['upload_preset']) ?>,
  },
  type: 'gallery',
  item: <?= json_encode($item ?? null) ?>,
};
</script>
<script src="assets/admin.js"></script>
<script src="assets/form-gallery.js"></script>
```

The PHP wrapper above this body must mirror `form-social.php` — same `require_once` for `config.php`, `auth.php`, `csrf.php`, `json-store.php`, `admin-helpers.php`; same loading of an existing item by `id` if present.

- [ ] **Step 3: Create `VEFS-website/admin/assets/form-gallery.js`**

```js
(function () {
  const cfg = window.VEFS_CONFIG;
  const form = document.getElementById('gallery-form');
  const urlInput = document.getElementById('imageUrl');
  const uploader = document.getElementById('cloudinary-uploader');
  const item = cfg.item || null;

  // --- populate from existing item ---
  if (item) {
    form.querySelector('[name="title"]').value       = item.title || '';
    form.querySelector('[name="description"]').value = item.description || '';
    form.querySelector('[name="year"]').value        = item.year || '';
    urlInput.value = item.imageUrl || '';
    if (item.imageUrl) {
      uploader.innerHTML = `<img src="${item.imageUrl}" alt="" style="max-width:240px">`;
    }
    const isNewVal = item.isNew === true ? 'true'
                  : item.isNew === false ? 'false' : 'auto';
    form.querySelector(`input[name="isNew"][value="${isNewVal}"]`).checked = true;
    form.querySelector('[name="disabled"]').checked         = !!item.disabled;
    form.querySelector('[name="hiddenFromPublic"]').checked = !!item.hiddenFromPublic;
  }

  // --- Cloudinary file picker ---
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  uploader.appendChild(fileInput);

  const status = document.createElement('span');
  status.className = 'hint';
  uploader.appendChild(status);

  fileInput.addEventListener('change', async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file, status); // defined in admin.js
      urlInput.value = url;
      const preview = uploader.querySelector('img') || document.createElement('img');
      preview.src = url;
      preview.style.maxWidth = '240px';
      preview.alt = '';
      if (!preview.parentNode) uploader.insertBefore(preview, fileInput);
      status.textContent = 'Uploaded.';
    } catch (e) {
      status.textContent = 'Upload failed: ' + e.message;
    }
  });

  // --- submit ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const chosen = (form.querySelector('input[name="isNew"]:checked') || {}).value || 'auto';
    const payload = {
      id:               form.id.value || undefined,
      type:             'gallery',
      title:            form.title.value.trim(),
      description:      form.description.value.trim(),
      year:             Number(form.year.value),
      imageUrl:         urlInput.value,
      isNew:            chosen === 'true' ? true : chosen === 'false' ? false : 'auto',
      disabled:         form.disabled.checked,
      hiddenFromPublic: form.hiddenFromPublic.checked,
    };

    const res = await fetch('api/save.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': form.csrf.value },
      body:    JSON.stringify(payload),
    });
    const body = await res.json();
    if (!res.ok || body.errors) {
      alert('Save failed: ' + JSON.stringify(body.errors || body, null, 2));
      return;
    }
    window.location = 'dashboard.php';
  });
})();
```

- [ ] **Step 4: Smoke test end-to-end**

Run: `cd VEFS-website && php -S localhost:8000 router.php`
- From dashboard, click "Create new" Gallery item.
- Upload a JPG. Confirm preview appears with a Cloudinary URL in `imageUrl`.
- Fill title / year / description, save.
- Confirm `data/gallery.json` now contains one item with `id: gal-001`, the Cloudinary URL, and `isNew: "auto"`.
- Click Edit on the new item — form populates with saved values.
- Click Duplicate on dashboard — creates `gal-002`.
- Toggle Disabled — item still appears in admin list but flagged.
- Click Delete — confirm removal.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/admin/form-gallery.php VEFS-website/admin/assets/form-gallery.js
git commit -m "feat(admin): add Gallery form with Cloudinary upload + CRUD wiring"
```

---

### Task 13: Update `js/gallery.js` to read the new schema

**Files:**
- Modify: `VEFS-website/js/gallery.js`
- Modify: `VEFS-website/gallery.html` (if it doesn't already include `badge-new.css` + `utils.js`)

- [ ] **Step 1: Confirm `gallery.html` includes `js/utils.js` and `css/components/badge-new.css`**

Run: `grep -n "utils.js\|badge-new" VEFS-website/gallery.html`

If either is missing, add them.

- [ ] **Step 2: Rewrite the data-loading + render in `js/gallery.js`**

Open `VEFS-website/js/gallery.js`. The current file expects `data/gallery.json` to be a flat array of `{filename, url, size}`. Change the fetch handler:

```js
async function loadGallery() {
  const res = await fetch('data/gallery.json', { cache: 'no-store' });
  const json = await res.json();

  const items = (json.items || [])
    .filter(it => !it.disabled && !it.hiddenFromPublic);

  const grid = document.getElementById('gallery-grid'); // use the existing selector
  grid.innerHTML = items.map(it => `
    <figure class="gallery-card">
      <img src="${it.imageUrl}" alt="${escapeHtml(it.title || '')}" loading="lazy">
      <figcaption>
        <h3>${escapeHtml(it.title || '')}${renderNewBadge(it)}</h3>
        ${it.description ? `<p>${escapeHtml(it.description)}</p>` : ''}
        <span class="year">${it.year || ''}</span>
      </figcaption>
    </figure>
  `).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

document.addEventListener('DOMContentLoaded', loadGallery);
```

Keep selectors and class names consistent with whatever `gallery.html` already declares; only the render markup changes. If `gallery.html` references `data-filename` or lightbox handlers that need rewiring, port those over.

- [ ] **Step 3: Smoke test**

Add 2–3 items via admin. Confirm:
- They render on `/gallery.html` with image, title, description, year.
- Items with `disabled: true` or `hiddenFromPublic: true` do NOT appear.
- An item created within 7 days shows the NEW badge.

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/js/gallery.js VEFS-website/gallery.html
git commit -m "feat(gallery): public page renders new schema with NEW badge + filters"
```

---

## Phase D — Homepage Social Rail

### Task 14: Build the horizontal-rail CSS

**Files:**
- Create: `VEFS-website/css/components/horizontal-rail.css`

- [ ] **Step 1: Create `VEFS-website/css/components/horizontal-rail.css`**

```css
.social-rail { padding: var(--space-2xl, 64px) 0; }

.social-rail__viewport {
  position: relative;
  display: flex;
  align-items: center;
}

.social-rail__track {
  display: flex;
  gap: var(--space-md, 24px);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding: var(--space-sm, 16px) var(--space-xs, 8px);
  flex: 1;
  scrollbar-width: none;
}
.social-rail__track::-webkit-scrollbar { display: none; }

.social-rail__card {
  flex: 0 0 320px;
  scroll-snap-align: start;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.social-rail__card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: #f3f3f3;
}

.social-rail__card-body {
  padding: var(--space-sm, 16px);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #333;
}

.social-rail__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px; height: 40px;
  border: none;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,.15);
  font-size: 1.4rem;
  cursor: pointer;
  z-index: 2;
}
.social-rail__arrow--prev { left: -10px; }
.social-rail__arrow--next { right: -10px; }

@media (max-width: 768px) {
  .social-rail__arrow { display: none; }
  .social-rail__card { flex-basis: 80vw; }
}
```

- [ ] **Step 2: Commit**

```bash
git add VEFS-website/css/components/horizontal-rail.css
git commit -m "feat(ui): add horizontal-rail CSS for social-media rail"
```

---

### Task 15: Add social rail section + JS

**Files:**
- Modify: `VEFS-website/index.html` (inject section + include CSS/JS)
- Modify: `VEFS-website/js/social-home.js` (extend to render into rail)

- [ ] **Step 1: Add the CSS include in `index.html` `<head>`**

```html
<link rel="stylesheet" href="css/components/badge-new.css">
<link rel="stylesheet" href="css/components/horizontal-rail.css">
```

- [ ] **Step 2: Insert the rail section immediately before the Upcoming Events section**

In `VEFS-website/index.html`, find line 1455 `<!-- Upcoming Events Section -->`. Immediately before it, insert:

```html
<!-- Recent Social Media Section -->
<section class="social-rail" aria-label="Recent social media posts">
  <div class="container">
    <h2 class="section-title text-center">Recent <span class="accent">Posts</span></h2>
    <div class="social-rail__viewport">
      <button type="button" class="social-rail__arrow social-rail__arrow--prev"
              aria-label="Scroll left">‹</button>
      <div class="social-rail__track" id="social-rail-track"
           tabindex="0" role="region" aria-roledescription="carousel">
        <!-- cards injected by social-home.js -->
      </div>
      <button type="button" class="social-rail__arrow social-rail__arrow--next"
              aria-label="Scroll right">›</button>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Replace render block in `js/social-home.js`**

Open `VEFS-website/js/social-home.js`. Whatever it currently renders, replace the render section with:

```js
async function loadSocialRail() {
  const track = document.getElementById('social-rail-track');
  if (!track) return;

  const res = await fetch('data/social.json', { cache: 'no-store' });
  const json = await res.json();
  const items = (json.posts || [])
    .filter(p => !p.disabled && !p.hiddenFromPublic);

  track.innerHTML = items.map(p => `
    <article class="social-rail__card">
      <a href="${p.post_url}" target="_blank" rel="noopener">
        <img src="${p.thumbnail_url}" alt="" loading="lazy">
      </a>
      <div class="social-rail__card-body">
        ${renderNewBadge(p)}
        <p>${escapeHtml(p.caption || '')}</p>
      </div>
    </article>
  `).join('');

  wireRail(track);
}

function wireRail(track) {
  const viewport = track.parentElement;
  const prev = viewport.querySelector('.social-rail__arrow--prev');
  const next = viewport.querySelector('.social-rail__arrow--next');
  const cardWidth = () => {
    const card = track.querySelector('.social-rail__card');
    return card ? card.getBoundingClientRect().width + 24 /* gap */ : 320;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left:  cardWidth(), behavior: 'smooth' }));

  // Slow auto-scroll via rAF; pause on hover/touch/focus/hidden tab.
  let paused = false;
  ['mouseenter','touchstart','focusin'].forEach(ev =>
    viewport.addEventListener(ev, () => { paused = true; }, { passive: true }));
  ['mouseleave','touchend','focusout'].forEach(ev =>
    viewport.addEventListener(ev, () => { paused = false; }, { passive: true }));
  document.addEventListener('visibilitychange',
    () => { paused = document.visibilityState !== 'visible'; });

  let last = performance.now();
  const PX_PER_SEC = 20; // gentle
  function step(now) {
    const dt = (now - last) / 1000;
    last = now;
    if (!paused) {
      const max = track.scrollWidth - track.clientWidth;
      const next = track.scrollLeft + PX_PER_SEC * dt;
      track.scrollLeft = next >= max - 1 ? 0 : next;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

document.addEventListener('DOMContentLoaded', loadSocialRail);
```

If the old `social-home.js` was rendering somewhere else on the homepage that's no longer in the DOM, remove that block too. The rail is now the sole homepage destination for social posts.

- [ ] **Step 4: Manual test**

Run: `cd VEFS-website && php -S localhost:8000 router.php`. Open `/`. Confirm:
- Rail appears above Upcoming Events.
- Cards auto-drift slowly to the right; hovering pauses.
- Arrow buttons scroll exactly one card per click.
- On a mobile-emulated viewport (DevTools), arrows disappear, cards are ~80vw wide, native swipe works.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/index.html VEFS-website/js/social-home.js
git commit -m "feat(home): add recent social-media rail above Upcoming Events"
```

---

## Phase E — Homepage Blog Slider

### Task 16: Build the blog-slider CSS

**Files:**
- Create: `VEFS-website/css/components/blog-slider.css`

- [ ] **Step 1: Create `VEFS-website/css/components/blog-slider.css`**

```css
.blog-slider { padding: var(--space-2xl, 64px) 0; background: #f7f6f3; }

.blog-slider__frame {
  position: relative;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}

.blog-slider__track {
  display: flex;
  transition: transform 0.4s ease;
  will-change: transform;
}

.blog-slider__slide {
  flex: 0 0 100%;
  padding: var(--space-md, 24px);
  text-align: center;
}

.blog-slider__slide img {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 8px;
}

.blog-slider__slide h3 {
  margin: var(--space-md, 24px) 0 var(--space-xs, 8px);
  font-family: 'Lora', serif;
  font-size: 1.6rem;
}

.blog-slider__slide .date {
  font-family: 'Inter', sans-serif;
  color: #666;
  font-size: 0.9rem;
}

.blog-slider__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px; height: 44px;
  border: none;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2;
}
.blog-slider__arrow--prev { left: 8px; }
.blog-slider__arrow--next { right: 8px; }
.blog-slider__arrow[disabled] { opacity: .3; cursor: not-allowed; }
```

- [ ] **Step 2: Commit**

```bash
git add VEFS-website/css/components/blog-slider.css
git commit -m "feat(ui): add blog-slider CSS for homepage"
```

---

### Task 17: Add blog slider section + JS

**Files:**
- Modify: `VEFS-website/index.html`
- Modify: `VEFS-website/js/blog-home.js`

- [ ] **Step 1: Confirm the date field on blog items**

Run: `head -40 VEFS-website/data/blog.json`

Identify which field carries the publish date — likely `publishedAt` or `date`. Use whichever exists. If both, prefer `publishedAt`. In the code below, replace `PUBLISH_FIELD` with the chosen field name.

- [ ] **Step 2: Add CSS include in `index.html` `<head>`**

```html
<link rel="stylesheet" href="css/components/blog-slider.css">
```

- [ ] **Step 3: Insert the slider section in `index.html` immediately after the social rail section**

```html
<!-- From the Blog Section -->
<section class="blog-slider" aria-label="Latest blog posts">
  <div class="container">
    <h2 class="section-title text-center">From the <span class="accent">Blog</span></h2>
    <div class="blog-slider__frame"
         id="blog-slider-frame"
         role="region"
         aria-roledescription="carousel"
         aria-live="polite"
         tabindex="0">
      <button type="button" class="blog-slider__arrow blog-slider__arrow--prev"
              aria-label="Previous post">‹</button>
      <div class="blog-slider__track" id="blog-slider-track">
        <!-- slides injected by blog-home.js -->
      </div>
      <button type="button" class="blog-slider__arrow blog-slider__arrow--next"
              aria-label="Next post">›</button>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Replace render in `js/blog-home.js`**

```js
const PUBLISH_FIELD = 'publishedAt'; // or 'date' / 'createdAt' — confirm in step 1

async function loadBlogSlider() {
  const track = document.getElementById('blog-slider-track');
  if (!track) return;

  const res = await fetch('data/blog.json', { cache: 'no-store' });
  const json = await res.json();
  const posts = (json.posts || [])
    .filter(p => !p.disabled && !p.hiddenFromPublic)
    .sort((a,b) => new Date(b[PUBLISH_FIELD]||0) - new Date(a[PUBLISH_FIELD]||0))
    .slice(0, 10);

  track.innerHTML = posts.map(p => `
    <article class="blog-slider__slide">
      <a href="/blog/${encodeURIComponent(p.slug || p.id)}">
        <img src="${p.cover_image_url}" alt="" loading="lazy">
        <h3>${escapeHtml(p.title || '')}${renderNewBadge(p)}</h3>
        <p class="date">${formatDate(p[PUBLISH_FIELD])}</p>
      </a>
    </article>
  `).join('');

  wireSlider(track, posts.length);
}

function wireSlider(track, total) {
  const frame = track.parentElement;
  const prev = frame.querySelector('.blog-slider__arrow--prev');
  const next = frame.querySelector('.blog-slider__arrow--next');
  let i = 0;

  function go(delta) {
    i = Math.max(0, Math.min(total - 1, i + delta));
    track.style.transform = `translateX(-${i * 100}%)`;
    prev.disabled = (i === 0);
    next.disabled = (i === total - 1);
  }
  go(0);

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(+1));

  frame.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(+1); }
  });

  // Touch swipe
  let startX = null;
  frame.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  frame.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? +1 : -1);
    startX = null;
  });
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

document.addEventListener('DOMContentLoaded', loadBlogSlider);
```

- [ ] **Step 5: Manual test**

Run: `cd VEFS-website && php -S localhost:8000 router.php`. On `/`:
- Slider appears below the social rail.
- One slide at a time visible.
- Prev/Next cycles through up to 10 posts; arrows disable at ends.
- No auto-advance after 10 seconds idle.
- Keyboard left/right works when slider focused.
- Mobile-emulated touch swipe advances slides.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/index.html VEFS-website/js/blog-home.js
git commit -m "feat(home): add manual blog slider showing latest 10 posts"
```

---

## Phase F — Blog Nav Link + Date-Gated NEW Badge

### Task 18: Create `blog-nav-badge.js`

**Files:**
- Create: `VEFS-website/js/components/blog-nav-badge.js`

- [ ] **Step 1: Create the file**

```js
(function () {
  const BLOG_LAUNCH_DATE = '2026-06-05';
  const BLOG_BADGE_DAYS  = 60;

  function init() {
    const launchTs = new Date(BLOG_LAUNCH_DATE + 'T00:00:00Z').getTime();
    const ageDays = (Date.now() - launchTs) / (24 * 60 * 60 * 1000);
    if (ageDays < 0 || ageDays >= BLOG_BADGE_DAYS) return;

    document.querySelectorAll('#blog-nav-new, .blog-nav-new-slot').forEach(slot => {
      if (slot.dataset.injected) return;
      slot.dataset.injected = '1';
      slot.innerHTML = '<span class="badge-new">NEW</span>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 2: Commit**

```bash
git add VEFS-website/js/components/blog-nav-badge.js
git commit -m "feat(nav): add date-gated NEW badge script for Blog nav link"
```

---

### Task 19: Add Blog nav link + include badge script across all 13 HTML pages

**Files (modify all):**
- `VEFS-website/index.html`
- `VEFS-website/about.html`
- `VEFS-website/trainings.html`
- `VEFS-website/events.html`
- `VEFS-website/volunteer.html`
- `VEFS-website/gallery.html`
- `VEFS-website/future-plans.html`
- `VEFS-website/contact.html`
- `VEFS-website/donate.html`
- `VEFS-website/blog.html`
- `VEFS-website/privacy.html`
- `VEFS-website/terms.html`
- `VEFS-website/registration-confirmation.html`

- [ ] **Step 1: In every page above, insert the Blog `<li>` between About and Trainings inside the `.nav-list`**

Find the existing nav line:

```html
<li><a href="about.html" class="nav-link">About</a></li>
```

Immediately after it, insert:

```html
<li><a href="blog.html" class="nav-link">Blog <span id="blog-nav-new" class="blog-nav-new-slot" aria-hidden="true"></span></a></li>
```

(On the page that IS Blog, mark the link `active`: `class="nav-link active" aria-current="page"`.)

Run `grep -n 'class="nav-link active"' VEFS-website/blog.html` after editing — should show the Blog link, not Home.

- [ ] **Step 2: In every page above, before `</body>` add (after other component scripts, before `</body>`):**

```html
<link rel="stylesheet" href="css/components/badge-new.css">
<script src="js/components/blog-nav-badge.js"></script>
```

If the page already includes `badge-new.css` (from earlier tasks), don't double-include — only add the script.

- [ ] **Step 3: Smoke test**

Run: `cd VEFS-website && php -S localhost:8000 router.php`. Walk through every page (Home, About, Blog, Trainings, Events, Volunteer, Gallery, Future Plans, Contact, Donate, Privacy, Terms, Registration Confirmation) and confirm:
- A blinking NEW badge appears next to "Blog" in the nav.
- The badge stops blinking with `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Verify the 60-day expiry**

Temporarily edit `blog-nav-badge.js`, set `BLOG_LAUNCH_DATE = '2026-01-01'` (older than 60 days from today). Reload `/` — badge should be absent. Revert the constant.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/*.html
git commit -m "feat(nav): add Blog nav link with date-gated NEW badge across 13 pages"
```

---

## Phase G — End-to-End Verification

### Task 20: Playwright E2E coverage

**Files:**
- Create: `tests/e2e/content-enhancements.spec.js` (path may vary — match existing Playwright layout if one exists at repo root)

- [ ] **Step 1: Locate where Playwright specs currently live**

Run: `ls *.spec.js tests 2>/dev/null` (in repo root) and `cat playwright.config.* 2>/dev/null`.

Use the same directory and naming convention as `test_modal_scroll.spec.js` at repo root.

- [ ] **Step 2: Create `content-enhancements.spec.js` covering the headline behaviors**

```js
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8000';

test.describe('content enhancements', () => {
  test('Blog nav link with NEW badge appears on Home', async ({ page }) => {
    await page.goto(BASE + '/');
    const blogLink = page.locator('.nav-list a[href="blog.html"]');
    await expect(blogLink).toBeVisible();
    await expect(blogLink.locator('.badge-new')).toBeVisible();
  });

  test('Social rail appears above Upcoming Events', async ({ page }) => {
    await page.goto(BASE + '/');
    const rail = page.locator('.social-rail');
    const events = page.locator('text=Upcoming').first();
    await expect(rail).toBeVisible();
    const railBox  = await rail.boundingBox();
    const eventBox = await events.boundingBox();
    expect(railBox.y).toBeLessThan(eventBox.y);
  });

  test('Blog slider has prev/next but no auto-advance', async ({ page }) => {
    await page.goto(BASE + '/');
    const slider = page.locator('.blog-slider');
    await expect(slider).toBeVisible();
    const initial = await page.locator('#blog-slider-track').evaluate(el => el.style.transform);
    await page.waitForTimeout(8000);
    const later = await page.locator('#blog-slider-track').evaluate(el => el.style.transform);
    expect(later).toBe(initial); // no auto-advance
    await page.locator('.blog-slider__arrow--next').click();
    const afterClick = await page.locator('#blog-slider-track').evaluate(el => el.style.transform);
    expect(afterClick).not.toBe(initial);
  });

  test('Gallery public page renders new schema', async ({ page }) => {
    await page.goto(BASE + '/gallery.html');
    const cards = page.locator('.gallery-card');
    // assumes at least one item has been added via admin in the run-up
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
  });
});
```

- [ ] **Step 3: Run the spec**

In two terminals:

```bash
# T1
cd VEFS-website && php -S localhost:8000 router.php

# T2
npx playwright test tests/e2e/content-enhancements.spec.js
```

Expected: all tests pass. (Gallery test assumes the admin has saved at least one gallery item — add one via the admin form first if needed.)

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/content-enhancements.spec.js
git commit -m "test(e2e): cover blog nav badge, social rail, blog slider, gallery rendering"
```

---

## Phase H — PHP Test Suite Sweep

### Task 21: Re-run full PHP test suite & document any new edge cases

- [ ] **Step 1: Run all PHP tests**

Run: `cd VEFS-website && php tests/test-runner.php`
Expected: every suite passes including the new `test-validate-isnew.php` and `test-validate-gallery.php`.

- [ ] **Step 2: If any pre-existing test broke**

Inspect the failure. The likely culprit is a fixture that was missing `isNew` and a strict validator now flags it. If so, the validator should only check `isNew` when the field is present (it already does — `if (array_key_exists('isNew', $d))`). Fix any test fixtures that explicitly set `isNew` to a non-enum value.

- [ ] **Step 3: Commit any fixture fixes**

```bash
git add VEFS-website/tests/
git commit -m "test: backfill fixtures for new isNew field"
```

(No-op commit fine if nothing changed.)

---

## Phase I — Migrate Existing 14 Gallery Photos

### Task 22: Re-upload pre-existing gallery photos via admin

**Owner:** site admin (manual, ~10 minutes). Not blocking deploy of code changes.

- [ ] **Step 1: List the 14 photos to migrate**

Run: `ls VEFS-website/images/gallery/`

- [ ] **Step 2: For each photo, in the admin UI:**

1. Open `admin/form-gallery.php`.
2. Upload the file via the Cloudinary picker.
3. Add title (filename → human-readable).
4. Add year (derive from EXIF or filename `VideoCapture_20240227-...` → 2024).
5. Save.

- [ ] **Step 3: Once all 14 are uploaded, optionally delete the local files**

Run: `git rm VEFS-website/images/gallery/*.jpg` (or `.png`).
Commit: `chore(gallery): remove local image files after Cloudinary migration`.

This is the final cleanup step — do it only after the live site has been verified to show all photos from Cloudinary.

---

## Done

All 5 user-requested changes are now live in the dev workspace. Final pre-deploy checklist:

- [ ] `php tests/test-runner.php` — all green
- [ ] `npx playwright test` — all green
- [ ] Manual walkthrough: Home, Gallery, every admin form, every public content page
- [ ] FTP `VEFS-website/` to Hostinger
- [ ] Verify on production: NEW badges blink, Blog nav badge present, social rail auto-scrolls, blog slider arrows work, gallery photos visible from Cloudinary
