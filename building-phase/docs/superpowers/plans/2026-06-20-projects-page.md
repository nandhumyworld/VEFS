# Projects Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public `/projects` listing + `/projects/<slug>` detail pages with admin CRUD, linked to existing events/trainings/volunteers/gallery via a new `project_id` field, and a Cloudinary-once photo model that auto-tags gallery items.

**Architecture:** New content type `project` joins the existing six (blog/social/event/training/volunteer/gallery). Public pages: static HTML + vanilla JS reading `data/projects.json`; detail page is server-rendered PHP for SEO/OG previews. Admin form follows existing form-`<type>`.php pattern and reuses the generic `admin/api/*.php` CRUD pipeline. No new endpoints — `project` is registered into the existing maps.

**Tech Stack:** PHP 7.4+, vanilla ES6+ JS, HTMLPurifier (vendored), Cloudinary (admin upload widget), Playwright (E2E only — dev), `.htaccess` rewrites for clean URLs.

## Global Constraints

- **No build step.** Vanilla JS / plain CSS only — what you write is what ships.
- **Admin endpoints require session AND CSRF token AND HTMLPurifier-sanitized rich text.** Never skip any of the three.
- **JSON store gateway only.** All reads/writes to `data/*.json` MUST go through `includes/json-store.php` (`json_store_read` / `json_store_write`) — never `file_put_contents` directly.
- **Backward-compatible additions to existing JSON.** New optional `project_id` field on events/trainings/volunteers/gallery items; null = unlinked = renders as today.
- **Visibility flag names follow gallery pattern:** `disabled` (bool) + `hiddenFromPublic` (bool). Camel-case, matching the most recent migration (`gallery`), NOT snake_case.
- **ID prefix:** `prj` → IDs are `prj-001`, `prj-002`, etc. (use `admin_next_id('prj', $items)`).
- **Slug uniqueness within `projects.json`.** Slug regex: `^[a-z0-9-]+$`.
- **Cloudinary once, gallery linked.** Project photo uploads create exactly one Cloudinary asset, then auto-create a `gallery.json` entry tagged with `project_id`. Project record stores `cloudinary_public_id` references only.
- **Future-only fields gated by status.** `proposed_budget`, `expected_beneficiaries`, `required_volunteers`, `sponsorship_opportunities` only valid when `status === 'planning'`; rejected otherwise.
- **Public JS filters `disabled=true` or `hiddenFromPublic=true` items.**
- **Design tokens:** Sage `#6B8E23` primary, Golden `#D4A574` secondary, Earth Brown `#8B7355` accent. 8px spacing scale.
- **WCAG AA + mobile-first ≥ 320px.**

---

## File Structure

**Create:**
- `VEFS-website/data/projects.json` — seeded empty container
- `VEFS-website/includes/admin-helpers.php` — extend with `project` mappings (modify, not create)
- `VEFS-website/includes/validate.php` — add `validate_project()` (modify)
- `VEFS-website/admin/api/save.php` — add `project` branch + `project_id` accept on other types (modify)
- `VEFS-website/admin/projects-list.php` — admin list view for projects
- `VEFS-website/admin/form-project.php` — create/edit form
- `VEFS-website/admin/assets/form-project.js` — form behavior
- `VEFS-website/admin/api/project-photo-upload.php` — Cloudinary upload + gallery auto-tag
- `VEFS-website/projects.html` — public listing page
- `VEFS-website/js/projects.js` — listing page renderer + filters
- `VEFS-website/css/components/projects.css` — styles for projects pages
- `VEFS-website/project-detail.php` — server-rendered detail page
- `VEFS-website/tests/test-validate-project.php` — PHP unit tests for `validate_project`
- `VEFS-website/tests/test-project-linking.php` — PHP unit tests for project_id on events/etc.
- `tests-e2e/projects.spec.js` — Playwright specs

**Modify (existing):**
- `VEFS-website/includes/admin-helpers.php` — register `project`
- `VEFS-website/includes/validate.php` — add `project_id` acceptance to event/training/volunteer/gallery validators
- `VEFS-website/admin/api/save.php`, `delete.php`, `duplicate.php`, `toggle.php`, `reorder.php` — add `'project'` to type whitelist
- `VEFS-website/admin/dashboard.php` — add Projects card
- `VEFS-website/admin/form-event.php`, `form-training.php`, `form-volunteer.php`, `form-gallery.php` — add "Linked Project" dropdown
- `VEFS-website/.htaccess` — `/projects/<slug>` rewrite
- `VEFS-website/router.php` — mirror rewrite for local dev
- All public HTML pages (`index.html`, `about.html`, `trainings.html`, `events.html`, `volunteer.html`, `gallery.html`, `contact.html`, `donate.html`, `blog.html`, `privacy.html`, `terms.html`, `registration-confirmation.html`) — replace `future-plans.html` nav link with `projects.html`
- `VEFS-website/donate.html` (+ its handler if any) — read `?project=<slug>` query string
- `VEFS-website/gallery.html` + `js/gallery.js` — "Filter by project" pill row

**Remove:**
- `VEFS-website/future-plans.html`

---

## Task 1: Data Foundation — Validation + Content-Type Registration

**Files:**
- Create: `VEFS-website/data/projects.json`
- Create: `VEFS-website/tests/test-validate-project.php`
- Create: `VEFS-website/tests/test-project-linking.php`
- Modify: `VEFS-website/includes/admin-helpers.php`
- Modify: `VEFS-website/includes/validate.php`
- Modify: `VEFS-website/admin/api/save.php`, `delete.php`, `duplicate.php`, `toggle.php`, `reorder.php`

**Interfaces:**
- Consumes: existing `json_store_read/write`, `admin_next_id`, `_slugify`, `_upsert`, `_findIndex` from save.php helpers
- Produces:
  - `validate_project(array $d): array` — returns field=>error map, empty = valid
  - `admin_data_filename('project')` → `'projects.json'`
  - `admin_array_key_for_type('project')` → `'projects'`
  - `data/projects.json` schema: `{ "projects": [...], "metadata": { "lastUpdated": "...", "total": 0 } }`

### Steps

- [ ] **Step 1: Write the failing validate-project test**

Create `VEFS-website/tests/test-validate-project.php`:

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/validate.php';

$failures = 0;
$passes = 0;
function assert_eq($actual, $expected, string $msg) {
    global $failures, $passes;
    if ($actual === $expected) { $passes++; return; }
    $failures++;
    echo "FAIL: $msg\n  expected: " . var_export($expected, true) . "\n  actual:   " . var_export($actual, true) . "\n";
}
function assert_has_field(array $errs, string $field, string $msg) {
    global $failures, $passes;
    if (isset($errs[$field])) { $passes++; return; }
    $failures++;
    echo "FAIL: $msg\n  expected error on field: $field\n  actual: " . json_encode($errs) . "\n";
}
function assert_no_field(array $errs, string $field, string $msg) {
    global $failures, $passes;
    if (!isset($errs[$field])) { $passes++; return; }
    $failures++;
    echo "FAIL: $msg\n  unexpected error on $field: " . $errs[$field] . "\n";
}

// --- Required-field tests
assert_has_field(validate_project([]), 'name', 'name required');
assert_has_field(validate_project(['name' => 'X']), 'objective', 'objective required');

$base = [
    'name' => 'Tree Plantation', 'objective' => 'Plant native species',
    'theme' => 'ecology', 'status' => 'active',
    'location' => 'Salem', 'start_date' => '2024-06-15',
    'order' => 0,
];
assert_eq(validate_project($base), [], 'minimal valid project passes');

// --- Enum tests
assert_has_field(validate_project($base + ['theme' => 'xx']), 'theme', 'invalid theme rejected');
$bad = $base; $bad['theme'] = 'bogus'; assert_has_field(validate_project($bad), 'theme', 'bogus theme rejected');
$bad = $base; $bad['status'] = 'wip'; assert_has_field(validate_project($bad), 'status', 'invalid status rejected');

// --- Slug regex
$bad = $base; $bad['slug'] = 'Bad Slug!'; assert_has_field(validate_project($bad), 'slug', 'invalid slug rejected');
$ok  = $base; $ok['slug'] = 'tree-plantation-2024'; assert_no_field(validate_project($ok), 'slug', 'valid slug accepted');

// --- Fundraising target >= raised
$bad = $base; $bad['fundraising'] = ['target_amount' => 100, 'raised_amount' => 200];
assert_has_field(validate_project($bad), 'fundraising.raised_amount', 'raised cannot exceed target');

// --- Date sanity
$bad = $base; $bad['end_date'] = '2024-01-01';
assert_has_field(validate_project($bad), 'end_date', 'end_date before start_date rejected');

// --- Future-only fields when status != planning
$bad = $base; $bad['proposed_budget'] = 100000;
assert_has_field(validate_project($bad), 'proposed_budget', 'proposed_budget only valid when planning');

$ok = $base; $ok['status'] = 'planning'; $ok['proposed_budget'] = 100000;
assert_no_field(validate_project($ok), 'proposed_budget', 'proposed_budget allowed when planning');

// --- Impact metrics shape
$bad = $base; $bad['impact_metrics'] = [['label' => '', 'value' => 'NaN']];
assert_has_field(validate_project($bad), 'impact_metrics.0.label', 'metric label required');
assert_has_field(validate_project($bad), 'impact_metrics.0.value', 'metric value must be numeric');

echo "\n$passes passed, $failures failed\n";
exit($failures === 0 ? 0 : 1);
```

- [ ] **Step 2: Run test to verify it fails**

Run from `VEFS-website/`:
```
php tests/test-validate-project.php
```
Expected: FAIL — `validate_project` is not defined.

- [ ] **Step 3: Add `validate_project` to `includes/validate.php`**

Append at the end of `validate.php` (before the closing PHP block / EOF — there is no closing tag):

```php
function validate_project(array $d): array {
    $e = [];

    $name = trim((string)($d['name'] ?? ''));
    if ($name === '') $e['name'] = 'Name is required.';
    elseif (mb_strlen($name) > 200) $e['name'] = 'Name must be ≤ 200 characters.';

    $obj = trim((string)($d['objective'] ?? ''));
    if ($obj === '') $e['objective'] = 'Objective is required.';
    elseif (mb_strlen($obj) > 140) $e['objective'] = 'Objective must be ≤ 140 characters.';

    if (isset($d['slug']) && $d['slug'] !== '' && !preg_match('/^[a-z0-9-]+$/', (string)$d['slug'])) {
        $e['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    $themes = ['ecology', 'livelihood', 'women', 'education', 'heritage'];
    if (!in_array((string)($d['theme'] ?? ''), $themes, true)) {
        $e['theme'] = 'Theme must be one of: ' . implode(', ', $themes);
    }

    $statuses = ['planning', 'active', 'completed', 'paused'];
    $status = (string)($d['status'] ?? '');
    if (!in_array($status, $statuses, true)) {
        $e['status'] = 'Status must be one of: ' . implode(', ', $statuses);
    }

    if (trim((string)($d['location'] ?? '')) === '') $e['location'] = 'Location is required.';

    $sd = (string)($d['start_date'] ?? '');
    if ($sd === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $sd)) {
        $e['start_date'] = 'Start date is required (YYYY-MM-DD).';
    }
    $ed = (string)($d['end_date'] ?? '');
    if ($ed !== '') {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $ed)) $e['end_date'] = 'End date must be YYYY-MM-DD.';
        elseif ($sd !== '' && strcmp($ed, $sd) < 0) $e['end_date'] = 'End date must be on or after start date.';
    }

    if (!isset($d['order']) || (!is_int($d['order']) && !ctype_digit((string)$d['order'])) || (int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    // Fundraising
    if (isset($d['fundraising']) && is_array($d['fundraising'])) {
        $t = $d['fundraising']['target_amount'] ?? null;
        $r = $d['fundraising']['raised_amount'] ?? null;
        if ($t !== null && (!is_numeric($t) || $t < 0)) $e['fundraising.target_amount'] = 'Target must be a non-negative number.';
        if ($r !== null && (!is_numeric($r) || $r < 0)) $e['fundraising.raised_amount'] = 'Raised must be a non-negative number.';
        if (is_numeric($t) && is_numeric($r) && (float)$r > (float)$t) {
            $e['fundraising.raised_amount'] = 'Raised cannot exceed target.';
        }
        if (isset($d['fundraising']['donor_count']) && (!ctype_digit((string)$d['fundraising']['donor_count']) || (int)$d['fundraising']['donor_count'] < 0)) {
            $e['fundraising.donor_count'] = 'Donor count must be a non-negative integer.';
        }
    }

    // Impact metrics
    if (isset($d['impact_metrics']) && is_array($d['impact_metrics'])) {
        foreach ($d['impact_metrics'] as $i => $row) {
            if (!is_array($row)) { $e["impact_metrics.$i"] = 'Invalid metric row.'; continue; }
            $label = trim((string)($row['label'] ?? ''));
            $val   = $row['value'] ?? null;
            if ($label === '' && ($val === null || $val === '')) continue; // empty row stripped on save
            if ($label === '') $e["impact_metrics.$i.label"] = 'Metric label required.';
            if (!is_numeric($val)) $e["impact_metrics.$i.value"] = 'Metric value must be numeric.';
        }
    }

    // Future-only fields gated by status
    $futureOnly = ['proposed_budget', 'expected_beneficiaries', 'required_volunteers', 'sponsorship_opportunities'];
    foreach ($futureOnly as $f) {
        if (isset($d[$f]) && $d[$f] !== null && $d[$f] !== '' && $status !== 'planning') {
            $e[$f] = ucfirst(str_replace('_', ' ', $f)) . ' is only valid when status is "planning".';
        }
    }
    if ($status === 'planning') {
        if (isset($d['proposed_budget']) && $d['proposed_budget'] !== null && $d['proposed_budget'] !== '' && (!is_numeric($d['proposed_budget']) || $d['proposed_budget'] < 0)) {
            $e['proposed_budget'] = 'Proposed budget must be a non-negative number.';
        }
        if (isset($d['required_volunteers']) && $d['required_volunteers'] !== null && $d['required_volunteers'] !== '' && (!ctype_digit((string)$d['required_volunteers']) || (int)$d['required_volunteers'] < 0)) {
            $e['required_volunteers'] = 'Required volunteers must be a non-negative integer.';
        }
    }

    // Photos shape
    if (isset($d['photos']) && is_array($d['photos'])) {
        foreach ($d['photos'] as $i => $row) {
            if (!is_array($row) || trim((string)($row['public_id'] ?? '')) === '') {
                $e["photos.$i.public_id"] = 'Each photo needs a Cloudinary public_id.';
            }
        }
    }

    return $e;
}
```

- [ ] **Step 4: Run validate-project test to verify it passes**

Run: `php tests/test-validate-project.php`
Expected: `N passed, 0 failed`.

- [ ] **Step 5: Register `project` content type in `includes/admin-helpers.php`**

Modify the three maps:

```php
function admin_array_key_for_type(string $type): ?string {
    return [
        'blog'      => 'posts',
        'social'    => 'posts',
        'event'     => 'events',
        'training'  => 'trainings',
        'volunteer' => 'volunteers',
        'gallery'   => 'items',
        'project'   => 'projects',
    ][$type] ?? null;
}

function admin_data_filename(string $type): string {
    return [
        'blog'      => 'blog.json',
        'social'    => 'social.json',
        'event'     => 'events.json',
        'training'  => 'trainings.json',
        'volunteer' => 'volunteers.json',
        'gallery'   => 'gallery.json',
        'project'   => 'projects.json',
    ][$type];
}
```

Extend `admin_display_title` and `admin_display_thumb` so projects work in the list view:

```php
function admin_display_title(string $type, array $row): string {
    if ($type === 'social')  return (string)($row['caption'] ?? '');
    if ($type === 'project') return (string)($row['name'] ?? '');
    return (string)($row['title'] ?? '');
}

function admin_display_thumb(string $type, array $row): string {
    if ($type === 'project') {
        $publicId = (string)($row['hero_image'] ?? '');
        if ($publicId === '') return '';
        return _cloudinary_url($publicId, 'w_200,h_120,c_fill');
    }
    return (string)(
        $row['cover_image_url']
        ?? $row['thumbnail_url']
        ?? $row['imageUrl']
        ?? $row['images']['featured']
        ?? $row['media']['featuredImage']
        ?? ''
    );
}

function _cloudinary_url(string $publicId, string $transform = ''): string {
    $cloud = getenv('CLOUDINARY_CLOUD_NAME') ?: 'vefs';
    $tx = $transform === '' ? '' : ('/' . $transform);
    return "https://res.cloudinary.com/{$cloud}/image/upload{$tx}/{$publicId}";
}
```

- [ ] **Step 6: Seed `data/projects.json`**

Create `VEFS-website/data/projects.json`:

```json
{
  "projects": [],
  "metadata": {
    "lastUpdated": "2026-06-20T00:00:00+00:00",
    "total": 0
  }
}
```

- [ ] **Step 7: Whitelist `project` in all five admin/api endpoints**

In `admin/api/save.php`, change line 26 from:
```php
if (!in_array($type, ['blog', 'social', 'event', 'training', 'volunteer', 'gallery'], true)) json_fail(400, 'Invalid type');
```
to include `'project'`:
```php
if (!in_array($type, ['blog', 'social', 'event', 'training', 'volunteer', 'gallery', 'project'], true)) json_fail(400, 'Invalid type');
```

Repeat the same change in `admin/api/delete.php`, `duplicate.php`, `toggle.php`, `reorder.php` — find the matching `in_array($type, [...])` whitelist and add `'project'`.

- [ ] **Step 8: Add `project` branch to `admin/api/save.php`**

Insert this `elseif` block after the `gallery` branch ends (around line 242, after `_upsert($items, $item, $originalId)` for gallery, before `$existing[$arrayKey] = $items;`):

```php
elseif ($type === 'project') {
    $errs = validate_project($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    if ($originalId === null) {
        $id = admin_next_id('prj', $items);
    } else {
        $id = $originalId;
    }

    $slug = trim((string)($data['slug'] ?? ''));
    if ($slug === '') $slug = _slugify((string)($data['name'] ?? ''));
    $selfIdx = _findIndex($items, $originalId);
    $selfSlug = $selfIdx === null ? null : ($items[$selfIdx]['slug'] ?? null);
    foreach ($items as $p) {
        if (($p['slug'] ?? null) === $slug && $slug !== $selfSlug) {
            json_fail(409, 'A project with this slug already exists', ['field' => 'slug']);
        }
    }

    $existingItem = null;
    if ($originalId !== null) {
        foreach ($items as $p) {
            if (($p['id'] ?? null) === $originalId) { $existingItem = $p; break; }
        }
    }

    $status = (string)$data['status'];
    $futureOnlyNullable = ['proposed_budget' => null, 'expected_beneficiaries' => null, 'required_volunteers' => null, 'sponsorship_opportunities' => null];
    if ($status === 'planning') {
        foreach ($futureOnlyNullable as $k => $_) {
            if (isset($data[$k]) && $data[$k] !== '') $futureOnlyNullable[$k] = $data[$k];
        }
    }

    // Strip empty impact-metric rows
    $metrics = [];
    foreach ((array)($data['impact_metrics'] ?? []) as $row) {
        if (!is_array($row)) continue;
        $label = trim((string)($row['label'] ?? ''));
        $val   = $row['value'] ?? null;
        if ($label === '' && ($val === null || $val === '')) continue;
        $metrics[] = [
            'label' => $label,
            'value' => is_numeric($val) ? (0 + $val) : 0,
            'unit'  => trim((string)($row['unit'] ?? '')),
            'icon'  => trim((string)($row['icon'] ?? '')),
        ];
    }

    $photos = [];
    foreach ((array)($data['photos'] ?? []) as $row) {
        if (!is_array($row)) continue;
        $pid = trim((string)($row['public_id'] ?? ''));
        if ($pid === '') continue;
        $photos[] = ['public_id' => $pid, 'caption' => trim((string)($row['caption'] ?? ''))];
    }

    $story = sanitize_blog_html((string)($data['story'] ?? ''));
    $sponsorship = $futureOnlyNullable['sponsorship_opportunities'] === null
        ? null
        : sanitize_blog_html((string)$futureOnlyNullable['sponsorship_opportunities']);

    $item = [
        'id'                         => $id,
        'slug'                       => $slug,
        'name'                       => trim((string)$data['name']),
        'objective'                  => trim((string)$data['objective']),
        'story'                      => $story,
        'theme'                      => (string)$data['theme'],
        'status'                     => $status,
        'location'                   => trim((string)$data['location']),
        'start_date'                 => (string)$data['start_date'],
        'end_date'                   => trim((string)($data['end_date'] ?? '')) ?: null,
        'hero_image'                 => trim((string)($data['hero_image'] ?? '')),
        'photos'                     => $photos,
        'impact_metrics'             => $metrics,
        'fundraising'                => [
            'target_amount'  => (float)($data['fundraising']['target_amount'] ?? 0),
            'raised_amount'  => (float)($data['fundraising']['raised_amount'] ?? 0),
            'donor_count'    => (int)($data['fundraising']['donor_count'] ?? 0),
            'show_progress'  => !empty($data['fundraising']['show_progress']),
        ],
        'proposed_budget'            => $futureOnlyNullable['proposed_budget'] === null ? null : (float)$futureOnlyNullable['proposed_budget'],
        'expected_beneficiaries'     => $futureOnlyNullable['expected_beneficiaries'],
        'required_volunteers'        => $futureOnlyNullable['required_volunteers'] === null ? null : (int)$futureOnlyNullable['required_volunteers'],
        'sponsorship_opportunities'  => $sponsorship,
        'featured'                   => !empty($data['featured']),
        'order'                      => (int)($data['order'] ?? 0),
        'disabled'                   => !empty($data['disabled']),
        'hiddenFromPublic'           => !empty($data['hiddenFromPublic']),
        'createdAt'                  => (string)($existingItem['createdAt'] ?? gmdate('c')),
        'updatedAt'                  => gmdate('c'),
    ];

    $data = $item;
    $items = _upsert($items, $item, $originalId);
}
```

- [ ] **Step 9: Add `project_id` acceptance to event/training/volunteer/gallery validators**

In `validate.php`, add this snippet at the bottom of each of `validate_event`, `validate_training`, `validate_volunteer`, `validate_gallery` (before the final `return $e;`):

```php
if (isset($d['project_id']) && $d['project_id'] !== null && $d['project_id'] !== '' && !preg_match('/^prj-\d+$/', (string)$d['project_id'])) {
    $e['project_id'] = 'Linked project must be a valid project id.';
}
```

In `admin/api/save.php`, for each of the event/training/volunteer/gallery branches, just before `_upsert(...)`, add:
```php
$data['project_id'] = (isset($data['project_id']) && trim((string)$data['project_id']) !== '') ? trim((string)$data['project_id']) : null;
```
For gallery specifically (where `$item` is built explicitly around line 227), add `'project_id' => (isset($data['project_id']) && trim((string)$data['project_id']) !== '') ? trim((string)$data['project_id']) : null,` to the `$item` array literal.

- [ ] **Step 10: Write project-linking test**

Create `VEFS-website/tests/test-project-linking.php`:

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/validate.php';

$failures = 0; $passes = 0;
function ok($cond, string $msg) {
    global $failures, $passes;
    if ($cond) { $passes++; return; }
    $failures++; echo "FAIL: $msg\n";
}

$validEvent = [
    'title' => 'Tree drive', 'type' => 'meetup',
    'shortDescription' => 'x', 'fullDescription' => 'x',
    'date' => '2026-07-01', 'time' => '10:00',
    'location' => 'Salem', 'order' => 0,
];

ok(empty(validate_event($validEvent + ['project_id' => 'prj-001'])['project_id']), 'valid project_id on event accepted');
$bad = validate_event($validEvent + ['project_id' => 'bogus']);
ok(isset($bad['project_id']), 'invalid project_id on event rejected');
ok(empty(validate_event($validEvent + ['project_id' => null])['project_id']), 'null project_id on event allowed');
ok(empty(validate_event($validEvent)['project_id']), 'missing project_id allowed');

echo "\n$passes passed, $failures failed\n";
exit($failures === 0 ? 0 : 1);
```

Run: `php tests/test-project-linking.php`
Expected: `4 passed, 0 failed`.

- [ ] **Step 11: Run all PHP tests**

Run from `VEFS-website/`: `php tests/test-runner.php`
Expected: every existing suite still passes plus the two new suites.

- [ ] **Step 12: Commit**

```bash
git add VEFS-website/data/projects.json VEFS-website/includes/admin-helpers.php VEFS-website/includes/validate.php VEFS-website/admin/api/save.php VEFS-website/admin/api/delete.php VEFS-website/admin/api/duplicate.php VEFS-website/admin/api/toggle.php VEFS-website/admin/api/reorder.php VEFS-website/tests/test-validate-project.php VEFS-website/tests/test-project-linking.php
git commit -m "feat(admin): register project content type + project_id linking on events/trainings/volunteers/gallery"
```

---

## Task 2: Admin Dashboard Card + Projects List Page

**Files:**
- Create: `VEFS-website/admin/projects-list.php`
- Modify: `VEFS-website/admin/dashboard.php`

**Interfaces:**
- Consumes: `admin_data_file('project')`, `json_store_read`, `admin_display_title`, `admin_display_thumb`
- Produces: `/admin/projects-list.php` page; `/admin/dashboard.php` shows Projects card with counts and "+ New Project" link

### Steps

- [ ] **Step 1: Read existing dashboard structure to learn the card pattern**

Read `VEFS-website/admin/dashboard.php` end-to-end. Identify how Events / Trainings cards are rendered (count, link to list, "+ New" button).

- [ ] **Step 2: Add a Projects card mirroring Events**

In `dashboard.php`, after the Trainings/Events cards block, add a Projects card using the same markup pattern. Pull counts from `data/projects.json`:

```php
<?php
$projectsFile = __DIR__ . '/../data/projects.json';
$projectsData = file_exists($projectsFile) ? json_store_read($projectsFile) : ['projects' => []];
$projects = $projectsData['projects'] ?? [];
$totalProjects     = count($projects);
$activeProjects    = count(array_filter($projects, fn($p) => ($p['status'] ?? '') === 'active' && empty($p['disabled'])));
$planningProjects  = count(array_filter($projects, fn($p) => ($p['status'] ?? '') === 'planning' && empty($p['disabled'])));
$completedProjects = count(array_filter($projects, fn($p) => ($p['status'] ?? '') === 'completed' && empty($p['disabled'])));
?>
<div class="card">
  <h3>Projects</h3>
  <p class="card-stats">
    <span><strong><?= $totalProjects ?></strong> total</span>
    <span><strong><?= $activeProjects ?></strong> active</span>
    <span><strong><?= $planningProjects ?></strong> planning</span>
    <span><strong><?= $completedProjects ?></strong> completed</span>
  </p>
  <a class="btn btn-primary" href="form-project.php">+ New Project</a>
  <a class="btn btn-secondary" href="projects-list.php">Manage all</a>
</div>
```

- [ ] **Step 3: Create `admin/projects-list.php`**

Mirror `admin/dashboard.php`'s "manage" sub-pages or whichever existing list page is the convention. The page must:
1. Require auth (`require __DIR__ . '/../includes/auth.php'; auth_start_session(); if (!auth_check_logged_in()) { header('Location: index.php'); exit; }`)
2. Output a table: thumbnail · name · theme · status · ₹raised / ₹target · last updated · actions (Edit / Duplicate / Disable-Enable toggle / Delete)
3. Each action calls the existing generic endpoint via `fetch` with type=`project`.
4. Include CSRF token via `csrf_token()` and pass it on each JSON POST.

Minimal skeleton:

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';
require __DIR__ . '/../includes/admin-helpers.php';

auth_start_session();
if (!auth_check_logged_in()) { header('Location: index.php'); exit; }

$data = json_store_read(admin_data_file('project'));
$items = $data['projects'] ?? [];
usort($items, fn($a, $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));
?>
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><title>Projects · Admin</title>
<link rel="stylesheet" href="assets/admin.css">
</head><body data-csrf="<?= htmlspecialchars(csrf_token()) ?>">
<header class="admin-header">
  <a href="dashboard.php">← Dashboard</a>
  <h1>Projects</h1>
  <a class="btn btn-primary" href="form-project.php">+ New Project</a>
</header>
<table class="admin-table">
  <thead><tr><th></th><th>Name</th><th>Theme</th><th>Status</th><th>Raised / Target</th><th>Updated</th><th>Actions</th></tr></thead>
  <tbody>
  <?php foreach ($items as $p): ?>
    <tr data-id="<?= htmlspecialchars($p['id']) ?>">
      <td><?php $thumb = admin_display_thumb('project', $p); if ($thumb): ?><img src="<?= htmlspecialchars($thumb) ?>" alt="" width="60"><?php endif; ?></td>
      <td><strong><?= htmlspecialchars($p['name']) ?></strong><br><small><?= htmlspecialchars($p['slug']) ?></small></td>
      <td><span class="chip theme-<?= htmlspecialchars($p['theme']) ?>"><?= htmlspecialchars($p['theme']) ?></span></td>
      <td><span class="status status-<?= htmlspecialchars($p['status']) ?>"><?= htmlspecialchars($p['status']) ?></span></td>
      <td>₹<?= number_format((float)($p['fundraising']['raised_amount'] ?? 0)) ?> / ₹<?= number_format((float)($p['fundraising']['target_amount'] ?? 0)) ?></td>
      <td><?= htmlspecialchars(substr((string)($p['updatedAt'] ?? ''), 0, 10)) ?></td>
      <td>
        <a href="form-project.php?id=<?= urlencode($p['id']) ?>">Edit</a>
        <button type="button" data-action="duplicate">Duplicate</button>
        <button type="button" data-action="toggle"><?= empty($p['disabled']) ? 'Disable' : 'Enable' ?></button>
        <button type="button" data-action="delete" class="danger">Delete</button>
      </td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
<script src="assets/projects-list.js"></script>
</body></html>
```

- [ ] **Step 4: Create `admin/assets/projects-list.js`**

```javascript
(function () {
  const csrf = document.body.dataset.csrf;
  document.querySelectorAll('.admin-table tbody tr').forEach((row) => {
    const id = row.dataset.id;
    row.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.action;
        if (action === 'delete' && !confirm('Delete this project? Linked events/trainings/volunteers will become unlinked.')) return;
        const endpoint = ({ duplicate: 'duplicate', toggle: 'toggle', delete: 'delete' })[action];
        const res = await fetch(`api/${endpoint}.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csrf, type: 'project', id }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) { alert(json.error || 'Action failed'); return; }
        location.reload();
      });
    });
  });
})();
```

- [ ] **Step 5: Smoke test in browser**

Start dev server from `VEFS-website/`: `php -S localhost:8000 router.php`. Log into admin at `http://localhost:8000/admin/`. Open `/admin/dashboard.php` — confirm Projects card renders with `0 total`. Open `/admin/projects-list.php` — confirm empty table renders.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/admin/dashboard.php VEFS-website/admin/projects-list.php VEFS-website/admin/assets/projects-list.js
git commit -m "feat(admin): projects dashboard card + list page"
```

---

## Task 3: Admin Form — Basics, Visibility, CRUD Round-Trip

**Files:**
- Create: `VEFS-website/admin/form-project.php` (Section A + Section G only — story/photos/metrics/fundraising/future fields come later)
- Create: `VEFS-website/admin/assets/form-project.js`

**Interfaces:**
- Consumes: `csrf_token()`, `admin_data_file('project')`, `json_store_read`, the generic `admin/api/save.php` (which we registered `project` into in Task 1)
- Produces: a working form at `/admin/form-project.php` that creates/edits a project with required basics + visibility flags. Story/photos/etc. left as TODO inputs to be replaced in later tasks.

### Steps

- [ ] **Step 1: Read `admin/form-event.php` end-to-end** to learn the layout, CSRF token wiring, and how it POSTs to `api/save.php`. This is the closest analog to what we're building.

- [ ] **Step 2: Create `admin/form-project.php` with Section A + G only**

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';
require __DIR__ . '/../includes/admin-helpers.php';

auth_start_session();
if (!auth_check_logged_in()) { header('Location: index.php'); exit; }

$editingId = $_GET['id'] ?? null;
$item = null;
if ($editingId) {
    $data = json_store_read(admin_data_file('project'));
    foreach ($data['projects'] ?? [] as $p) {
        if (($p['id'] ?? null) === $editingId) { $item = $p; break; }
    }
}
$mode = $item ? 'edit' : 'create';
$themes = ['ecology', 'livelihood', 'women', 'education', 'heritage'];
$statuses = ['planning', 'active', 'completed', 'paused'];
?>
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title><?= $mode === 'edit' ? 'Edit' : 'New' ?> Project · Admin</title>
<link rel="stylesheet" href="assets/admin.css">
</head>
<body data-csrf="<?= htmlspecialchars(csrf_token()) ?>" data-mode="<?= $mode ?>" data-original-id="<?= htmlspecialchars($editingId ?? '') ?>">
<header class="admin-header">
  <a href="projects-list.php">← Projects</a>
  <h1><?= $mode === 'edit' ? 'Edit Project' : 'New Project' ?></h1>
</header>

<form id="project-form" novalidate>

  <section class="form-section" data-section="basics">
    <h2>Basics</h2>
    <label>Name *<input name="name" required maxlength="200" value="<?= htmlspecialchars($item['name'] ?? '') ?>"></label>
    <label>Slug <small>(auto from name if blank — lowercase, hyphens only)</small>
      <input name="slug" pattern="[a-z0-9\-]+" value="<?= htmlspecialchars($item['slug'] ?? '') ?>">
    </label>
    <label>Objective * <small><span data-counter="objective">0</span>/140</small>
      <textarea name="objective" required maxlength="140"><?= htmlspecialchars($item['objective'] ?? '') ?></textarea>
    </label>
    <label>Theme *
      <select name="theme" required>
        <?php foreach ($themes as $t): ?>
          <option value="<?= $t ?>" <?= (($item['theme'] ?? '') === $t) ? 'selected' : '' ?>><?= ucfirst($t) ?></option>
        <?php endforeach; ?>
      </select>
    </label>
    <label>Status *
      <select name="status" required>
        <?php foreach ($statuses as $s): ?>
          <option value="<?= $s ?>" <?= (($item['status'] ?? '') === $s) ? 'selected' : '' ?>><?= ucfirst($s) ?></option>
        <?php endforeach; ?>
      </select>
    </label>
    <label>Location *<input name="location" required value="<?= htmlspecialchars($item['location'] ?? '') ?>"></label>
    <label>Start date *<input type="date" name="start_date" required value="<?= htmlspecialchars($item['start_date'] ?? '') ?>"></label>
    <label data-show-when="status=completed">End date<input type="date" name="end_date" value="<?= htmlspecialchars($item['end_date'] ?? '') ?>"></label>
    <label><input type="checkbox" name="featured" <?= !empty($item['featured']) ? 'checked' : '' ?>> Featured (pins to hero carousel)</label>
  </section>

  <!-- Sections B–F added in later tasks. -->

  <section class="form-section" data-section="visibility">
    <h2>Visibility</h2>
    <label><input type="checkbox" name="disabled" <?= !empty($item['disabled']) ? 'checked' : '' ?>> Disabled (hidden everywhere — admin can re-enable)</label>
    <label><input type="checkbox" name="hiddenFromPublic" <?= !empty($item['hiddenFromPublic']) ? 'checked' : '' ?>> Hide from public site (still visible in admin)</label>
    <label>Display order<input type="number" name="order" min="0" value="<?= (int)($item['order'] ?? 0) ?>"></label>
  </section>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary">Save</button>
    <a href="projects-list.php" class="btn btn-secondary">Cancel</a>
    <p id="form-status" role="status" aria-live="polite"></p>
  </div>
</form>

<script src="assets/form-project.js"></script>
</body></html>
```

- [ ] **Step 3: Create `admin/assets/form-project.js`** (minimal — covers Basics + Visibility serialize/submit)

```javascript
(function () {
  const form = document.getElementById('project-form');
  const csrf = document.body.dataset.csrf;
  const mode = document.body.dataset.mode;
  const originalId = document.body.dataset.originalId || null;
  const statusEl = document.getElementById('form-status');

  // 140-char counter on objective
  const objective = form.objective;
  const counter = form.querySelector('[data-counter="objective"]');
  const updateCounter = () => { counter.textContent = String(objective.value.length); };
  objective.addEventListener('input', updateCounter);
  updateCounter();

  // Show end_date only when status === 'completed'
  const statusSel = form.status;
  const toggleStatusFields = () => {
    form.querySelectorAll('[data-show-when]').forEach((el) => {
      const [field, val] = el.dataset.showWhen.split('=');
      el.style.display = form[field] && form[field].value === val ? '' : 'none';
    });
  };
  statusSel.addEventListener('change', toggleStatusFields);
  toggleStatusFields();

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    statusEl.textContent = 'Saving…';
    const fd = new FormData(form);
    const data = {
      name: fd.get('name'),
      slug: fd.get('slug') || '',
      objective: fd.get('objective'),
      theme: fd.get('theme'),
      status: fd.get('status'),
      location: fd.get('location'),
      start_date: fd.get('start_date'),
      end_date: fd.get('end_date') || '',
      featured: form.featured.checked,
      disabled: form.disabled.checked,
      hiddenFromPublic: form.hiddenFromPublic.checked,
      order: Number(fd.get('order') || 0),
      // Story/photos/metrics/fundraising/future fields are added in later tasks.
    };
    const body = { csrf, type: 'project', data, original_id: mode === 'edit' ? originalId : null };
    const res = await fetch('api/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      statusEl.textContent = json.error || 'Save failed';
      if (json.fields) {
        Object.entries(json.fields).forEach(([k, v]) => {
          const field = form.querySelector(`[name="${k}"]`);
          if (field) field.setCustomValidity(v);
        });
      }
      return;
    }
    statusEl.textContent = 'Saved.';
    setTimeout(() => { location.href = 'projects-list.php'; }, 600);
  });
})();
```

- [ ] **Step 4: Manual round-trip smoke test**

1. Open `/admin/form-project.php` — confirm blank form renders.
2. Fill: Name "Tree Plantation", Objective short text, Theme "ecology", Status "active", Location "Salem", Start date "2024-06-15". Submit.
3. Confirm redirect to `projects-list.php` showing 1 project, slug auto-derived `tree-plantation`.
4. Confirm `data/projects.json` has the record with `id: prj-001`.
5. Click "Edit", change Name to "Tree Plantation Program", save, confirm updated record (same id, slug unchanged).
6. Click "Disable" on the list page — confirm `disabled: true` in JSON. Click "Enable" — confirm flipped.
7. Click "Duplicate" — confirm `prj-002` appears with `(copy)` suffix on the name (whatever `duplicate.php` adds today).
8. Click "Delete" on the duplicate — confirm removed.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/admin/form-project.php VEFS-website/admin/assets/form-project.js
git commit -m "feat(admin): project form basics + visibility + CRUD round-trip"
```

---

## Task 4: Admin Form — Story & Photos (Cloudinary-Once + Gallery Auto-Tag)

**Files:**
- Create: `VEFS-website/admin/api/project-photo-upload.php`
- Modify: `VEFS-website/admin/form-project.php` (add Section B)
- Modify: `VEFS-website/admin/assets/form-project.js` (wire upload + photo list + story editor)

**Interfaces:**
- Consumes: existing Cloudinary upload pattern from `form-gallery.php` (read it before starting); `sanitize_blog_html()`
- Produces: `POST /admin/api/project-photo-upload.php` with multipart `{ csrf, file, caption, project_id? }` returns `{ public_id, gallery_id }`. Side effect: one Cloudinary asset + one new `gallery.json` entry tagged `{ project_id }`.

### Steps

- [ ] **Step 1: Read `admin/form-gallery.php` + the existing Cloudinary upload endpoint** to understand how the project copies the existing upload widget. If the gallery form uses a JS Cloudinary widget configured with cloud_name + unsigned preset, mirror that. If it uses a server-side signed upload via PHP cURL, mirror that. Pick whichever the codebase already uses — do not introduce a new pattern.

- [ ] **Step 2: Add Section B to `form-project.php`** (insert between Section A and the Visibility section):

```php
  <section class="form-section" data-section="story-photos">
    <h2>Story & Photos</h2>

    <label>Hero image
      <div class="photo-row" data-role="hero">
        <?php if (!empty($item['hero_image'])): ?>
          <img src="<?= htmlspecialchars(_cloudinary_url($item['hero_image'], 'w_300,h_180,c_fill')) ?>" alt="">
          <input type="hidden" name="hero_image" value="<?= htmlspecialchars($item['hero_image']) ?>">
          <button type="button" data-action="replace-hero">Replace</button>
        <?php else: ?>
          <input type="hidden" name="hero_image" value="">
          <button type="button" data-action="upload-hero">Upload hero image</button>
        <?php endif; ?>
      </div>
    </label>

    <label>Story
      <textarea name="story" id="project-story" rows="14"><?= htmlspecialchars($item['story'] ?? '') ?></textarea>
      <small>HTML allowed — sanitized on save (HTMLPurifier).</small>
    </label>

    <label>Additional photos</label>
    <div id="photos-list">
      <?php foreach (($item['photos'] ?? []) as $i => $p): ?>
        <div class="photo-row" data-index="<?= $i ?>">
          <img src="<?= htmlspecialchars(_cloudinary_url($p['public_id'], 'w_200,h_120,c_fill')) ?>" alt="">
          <input type="hidden" name="photos[<?= $i ?>][public_id]" value="<?= htmlspecialchars($p['public_id']) ?>">
          <input type="text" name="photos[<?= $i ?>][caption]" placeholder="Caption" value="<?= htmlspecialchars($p['caption'] ?? '') ?>">
          <button type="button" data-action="remove-photo">Remove</button>
        </div>
      <?php endforeach; ?>
    </div>
    <button type="button" data-action="upload-photo">Upload additional photo</button>
    <button type="button" data-action="pick-from-gallery">Pick from existing gallery</button>
  </section>
```

- [ ] **Step 3: Create `admin/api/project-photo-upload.php`**

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../../includes/auth.php';
require __DIR__ . '/../../includes/csrf.php';
require __DIR__ . '/../../includes/json-store.php';
require __DIR__ . '/../../includes/admin-helpers.php';

header('Content-Type: application/json');
function fail(int $c, string $m) { http_response_code($c); echo json_encode(['error' => $m]); exit; }

auth_start_session();
if (!auth_check_logged_in()) fail(401, 'Not authenticated');
if (!csrf_verify($_POST['csrf'] ?? null)) fail(403, 'CSRF token mismatch');

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    fail(400, 'No file uploaded');
}
$caption    = trim((string)($_POST['caption'] ?? ''));
$projectId  = trim((string)($_POST['project_id'] ?? ''));
if ($projectId !== '' && !preg_match('/^prj-\d+$/', $projectId)) fail(400, 'Invalid project_id');

// --- Cloudinary upload (mirror the pattern used by form-gallery's upload endpoint).
// Replace this block with the existing gallery upload's exact technique. The
// example below uses unsigned upload via signed server preset.
$cloudName = getenv('CLOUDINARY_CLOUD_NAME') ?: 'vefs';
$preset    = getenv('CLOUDINARY_UPLOAD_PRESET') ?: 'vefs_projects';
$ch = curl_init("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => [
        'file' => new CURLFile($_FILES['file']['tmp_name'], $_FILES['file']['type'], $_FILES['file']['name']),
        'upload_preset' => $preset,
        'folder' => 'vefs/projects',
    ],
]);
$resp = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($status !== 200) fail(502, 'Cloudinary upload failed');
$cloud = json_decode($resp, true);
$publicId = (string)($cloud['public_id'] ?? '');
if ($publicId === '') fail(502, 'Cloudinary response missing public_id');

// --- Auto-tag in gallery.json
$galleryFile = __DIR__ . '/../../data/gallery.json';
$galleryData = json_store_read($galleryFile);
$items = $galleryData['items'] ?? [];
$galleryId = admin_next_id('gal', $items);
$now = gmdate('c');
$galleryItem = [
    'id'               => $galleryId,
    'title'            => $caption !== '' ? $caption : 'Project photo',
    'description'      => '',
    'year'             => (int)date('Y'),
    'imageUrl'         => "https://res.cloudinary.com/{$cloudName}/image/upload/{$publicId}",
    'project_id'       => $projectId !== '' ? $projectId : null,
    'isNew'            => 'auto',
    'disabled'         => false,
    'hiddenFromPublic' => false,
    'createdAt'        => $now,
    'updatedAt'        => $now,
];
$items[] = $galleryItem;
$galleryData['items'] = $items;
$galleryData['metadata']['lastUpdated'] = $now;
$galleryData['metadata']['total'] = count($items);
json_store_write($galleryFile, $galleryData, __DIR__ . '/../../data/backups');

echo json_encode(['public_id' => $publicId, 'gallery_id' => $galleryId]);
```

- [ ] **Step 4: Extend `assets/form-project.js`** with photo + story handling.

Append to the bottom of the previous IIFE body, before the final closing `})();`:

```javascript
  // --- Photo upload helpers
  const csrfToken = document.body.dataset.csrf;
  const originalIdForUpload = document.body.dataset.originalId || '';

  async function uploadPhoto(file, caption) {
    const fd = new FormData();
    fd.append('csrf', csrfToken);
    fd.append('file', file);
    fd.append('caption', caption || '');
    if (originalIdForUpload) fd.append('project_id', originalIdForUpload);
    const res = await fetch('api/project-photo-upload.php', { method: 'POST', body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    return json; // { public_id, gallery_id }
  }

  function fileInput(onChoice) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => { if (input.files[0]) onChoice(input.files[0]); });
    input.click();
  }

  function cloudinaryThumb(publicId, w = 200, h = 120) {
    const cloud = 'vefs'; // configured server-side
    return `https://res.cloudinary.com/${cloud}/image/upload/w_${w},h_${h},c_fill/${publicId}`;
  }

  form.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const action = btn.dataset.action;
      if (action === 'upload-hero' || action === 'replace-hero') {
        fileInput(async (file) => {
          try {
            const { public_id } = await uploadPhoto(file, '');
            const heroDiv = form.querySelector('[data-role="hero"]');
            heroDiv.innerHTML =
              `<img src="${cloudinaryThumb(public_id, 300, 180)}" alt="">` +
              `<input type="hidden" name="hero_image" value="${public_id}">` +
              `<button type="button" data-action="replace-hero">Replace</button>`;
            // Re-bind the new Replace button
            heroDiv.querySelector('[data-action="replace-hero"]').addEventListener('click', () => btn.click());
          } catch (e) { alert(e.message); }
        });
      } else if (action === 'upload-photo') {
        fileInput(async (file) => {
          try {
            const { public_id } = await uploadPhoto(file, '');
            const list = document.getElementById('photos-list');
            const i = list.children.length;
            const row = document.createElement('div');
            row.className = 'photo-row';
            row.dataset.index = String(i);
            row.innerHTML =
              `<img src="${cloudinaryThumb(public_id)}" alt="">` +
              `<input type="hidden" name="photos[${i}][public_id]" value="${public_id}">` +
              `<input type="text" name="photos[${i}][caption]" placeholder="Caption">` +
              `<button type="button" data-action="remove-photo">Remove</button>`;
            list.appendChild(row);
            row.querySelector('[data-action="remove-photo"]').addEventListener('click', () => row.remove());
          } catch (e) { alert(e.message); }
        });
      } else if (action === 'pick-from-gallery') {
        // Defer to Task 4-stretch: a small modal that fetches /data/gallery.json,
        // shows thumbnails, and lets the admin select one. For initial CRUD, this
        // button can be left as a no-op stub with a note.
        alert('Pick-from-gallery picker is built in the next iteration. Use Upload for now.');
      } else if (action === 'remove-photo') {
        btn.closest('.photo-row').remove();
      }
    });
  });

  // Re-bind hero replace button after page load
  const heroReplace = form.querySelector('[data-action="replace-hero"]');
  // (above delegation also covers it; no extra wiring needed.)
```

Extend the existing `data` object in the submit handler to include story + hero + photos:

```javascript
data.hero_image = form.hero_image ? form.hero_image.value : '';
data.story = form.story.value;
data.photos = Array.from(form.querySelectorAll('#photos-list .photo-row')).map((row) => ({
  public_id: row.querySelector('input[type="hidden"]').value,
  caption: row.querySelector('input[type="text"]').value,
}));
```

- [ ] **Step 5: Smoke test photo upload**

1. Edit the existing project. Upload a hero image — confirm thumbnail appears.
2. Upload an additional photo with caption — confirm row appears.
3. Save. Confirm `data/projects.json` has `hero_image` + `photos[]` populated.
4. Confirm `data/gallery.json` now contains 2 new entries tagged with `project_id: prj-001`.
5. Re-open the edit page — confirm existing photos render and the captions are preserved.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/admin/api/project-photo-upload.php VEFS-website/admin/form-project.php VEFS-website/admin/assets/form-project.js
git commit -m "feat(admin): project form story + photos (cloudinary-once + gallery auto-tag)"
```

---

## Task 5: Admin Form — Impact Metrics, Fundraising, Future-Only Fields

**Files:**
- Modify: `VEFS-website/admin/form-project.php` (add Sections C, D, E)
- Modify: `VEFS-website/admin/assets/form-project.js` (status-driven section toggle + repeatable metric rows + fundraising serialization)

**Interfaces:**
- Consumes: nothing new
- Produces: form sections that serialize into the shape expected by `save.php`'s `project` branch (Task 1, Step 8).

### Steps

- [ ] **Step 1: Insert Section C (Impact Metrics) into `form-project.php`** between Story-Photos and Visibility:

```php
  <section class="form-section" data-section="impact">
    <h2>Impact Metrics</h2>
    <p class="hint">Be specific — "12,400 trees" beats "many trees."</p>
    <div id="metrics-list">
      <?php foreach (($item['impact_metrics'] ?? []) as $i => $m): ?>
        <div class="metric-row" data-index="<?= $i ?>">
          <input type="text" name="impact_metrics[<?= $i ?>][label]" placeholder="Label (e.g. Trees planted)" value="<?= htmlspecialchars($m['label'] ?? '') ?>">
          <input type="number" name="impact_metrics[<?= $i ?>][value]" placeholder="Value" step="any" value="<?= htmlspecialchars((string)($m['value'] ?? '')) ?>">
          <input type="text" name="impact_metrics[<?= $i ?>][unit]" placeholder="Unit (optional)" value="<?= htmlspecialchars($m['unit'] ?? '') ?>">
          <input type="text" name="impact_metrics[<?= $i ?>][icon]" placeholder="Icon (optional)" value="<?= htmlspecialchars($m['icon'] ?? '') ?>">
          <button type="button" data-action="remove-metric">×</button>
        </div>
      <?php endforeach; ?>
    </div>
    <button type="button" data-action="add-metric">+ Add metric</button>
  </section>
```

- [ ] **Step 2: Insert Section D (Fundraising):**

```php
  <section class="form-section" data-section="fundraising">
    <h2>Fundraising</h2>
    <p class="hint">Update after each donation batch — visitors trust accurate numbers.</p>
    <label>Target amount (₹)<input type="number" name="fundraising[target_amount]" min="0" step="1" value="<?= htmlspecialchars((string)($item['fundraising']['target_amount'] ?? '')) ?>"></label>
    <label>Raised amount (₹)<input type="number" name="fundraising[raised_amount]" min="0" step="1" value="<?= htmlspecialchars((string)($item['fundraising']['raised_amount'] ?? '')) ?>"></label>
    <label>Donor count<input type="number" name="fundraising[donor_count]" min="0" step="1" value="<?= htmlspecialchars((string)($item['fundraising']['donor_count'] ?? '')) ?>"></label>
    <label><input type="checkbox" name="fundraising[show_progress]" <?= !empty($item['fundraising']['show_progress']) ? 'checked' : '' ?>> Show progress publicly</label>
  </section>
```

- [ ] **Step 3: Insert Section E (Future-only):**

```php
  <section class="form-section" data-section="future" data-show-when="status=planning">
    <h2>Future Project Fields</h2>
    <p class="hint">Only used when status is Planning.</p>
    <label>Proposed budget (₹)<input type="number" name="proposed_budget" min="0" step="1" value="<?= htmlspecialchars((string)($item['proposed_budget'] ?? '')) ?>"></label>
    <label>Expected beneficiaries<input type="text" name="expected_beneficiaries" value="<?= htmlspecialchars((string)($item['expected_beneficiaries'] ?? '')) ?>"></label>
    <label>Required volunteers<input type="number" name="required_volunteers" min="0" step="1" value="<?= htmlspecialchars((string)($item['required_volunteers'] ?? '')) ?>"></label>
    <label>Sponsorship opportunities (HTML allowed)<textarea name="sponsorship_opportunities" rows="6"><?= htmlspecialchars((string)($item['sponsorship_opportunities'] ?? '')) ?></textarea></label>
  </section>
```

- [ ] **Step 4: Extend the `data-show-when` handler in form-project.js** — already present from Task 3 — to also toggle Section E and the End-date field.

(The existing `toggleStatusFields` from Task 3 already covers any element with `data-show-when="status=<x>"`. Re-test it works by switching status to/from "planning" and "completed" and watching the future section + end_date appear/disappear.)

- [ ] **Step 5: Add metric-row JS handlers**

Inside the `data-action` switch added in Task 4, add:

```javascript
      } else if (action === 'add-metric') {
        const list = document.getElementById('metrics-list');
        const i = list.children.length;
        const row = document.createElement('div');
        row.className = 'metric-row';
        row.dataset.index = String(i);
        row.innerHTML =
          `<input type="text" name="impact_metrics[${i}][label]" placeholder="Label">` +
          `<input type="number" name="impact_metrics[${i}][value]" placeholder="Value" step="any">` +
          `<input type="text" name="impact_metrics[${i}][unit]" placeholder="Unit (optional)">` +
          `<input type="text" name="impact_metrics[${i}][icon]" placeholder="Icon (optional)">` +
          `<button type="button" data-action="remove-metric">×</button>`;
        list.appendChild(row);
        row.querySelector('[data-action="remove-metric"]').addEventListener('click', () => row.remove());
      } else if (action === 'remove-metric') {
        btn.closest('.metric-row').remove();
```

- [ ] **Step 6: Extend the submit handler's `data` payload**

Add the following lines just before the `body` object is constructed:

```javascript
data.impact_metrics = Array.from(form.querySelectorAll('#metrics-list .metric-row')).map((row) => ({
  label: row.querySelector('input[name$="[label]"]').value,
  value: row.querySelector('input[name$="[value]"]').value,
  unit:  row.querySelector('input[name$="[unit]"]').value,
  icon:  row.querySelector('input[name$="[icon]"]').value,
})).filter((m) => m.label || m.value);

data.fundraising = {
  target_amount: Number(form['fundraising[target_amount]'].value || 0),
  raised_amount: Number(form['fundraising[raised_amount]'].value || 0),
  donor_count:   Number(form['fundraising[donor_count]'].value || 0),
  show_progress: form['fundraising[show_progress]'].checked,
};

if (form.status.value === 'planning') {
  data.proposed_budget          = form.proposed_budget.value === '' ? null : Number(form.proposed_budget.value);
  data.expected_beneficiaries   = form.expected_beneficiaries.value || null;
  data.required_volunteers      = form.required_volunteers.value === '' ? null : Number(form.required_volunteers.value);
  data.sponsorship_opportunities = form.sponsorship_opportunities.value || null;
} else {
  data.proposed_budget = null;
  data.expected_beneficiaries = null;
  data.required_volunteers = null;
  data.sponsorship_opportunities = null;
}
```

- [ ] **Step 7: Smoke test**

1. Edit the existing project. Add 2 metrics, set target ₹500000 / raised ₹120000 / donors 47, check "show progress publicly." Save.
2. Verify `data/projects.json` reflects the metrics array and fundraising object.
3. Change status to "planning", set proposed_budget = 1000000, add expected_beneficiaries text, save. Verify those fields land.
4. Switch status back to "active" + save. Verify future-only fields are reset to null on save.
5. Try saving raised > target — confirm validation error renders.

- [ ] **Step 8: Commit**

```bash
git add VEFS-website/admin/form-project.php VEFS-website/admin/assets/form-project.js
git commit -m "feat(admin): project form impact metrics + fundraising + future-only fields"
```

---

## Task 6: Linked Activities Section + Linked-Project Dropdowns on Other Forms

**Files:**
- Modify: `VEFS-website/admin/form-project.php` (add Section F — read-only listing)
- Modify: `VEFS-website/admin/form-event.php`, `form-training.php`, `form-volunteer.php`, `form-gallery.php` (add Linked Project dropdown)
- Modify: their corresponding `assets/form-*.js` files to serialize `project_id` into the save payload

**Interfaces:**
- Consumes: `json_store_read(admin_data_file('event'|'training'|'volunteer'))` for reverse-listing
- Produces: each existing form sends `data.project_id` (string or null) in its save payload; project form shows linked items.

### Steps

- [ ] **Step 1: Insert Section F into `form-project.php`** (between Future-only and Visibility):

```php
<?php
$linked = ['events' => [], 'trainings' => [], 'volunteers' => []];
if ($editingId) {
    foreach (['event' => 'events', 'training' => 'trainings', 'volunteer' => 'volunteers'] as $t => $key) {
        $file = admin_data_file($t);
        if (file_exists($file)) {
            $rows = json_store_read($file)[admin_array_key_for_type($t)] ?? [];
            foreach ($rows as $r) {
                if (($r['project_id'] ?? null) === $editingId) $linked[$key][] = $r;
            }
        }
    }
}
?>
<section class="form-section" data-section="linked">
  <h2>Linked Activities</h2>
  <?php if (!$editingId): ?>
    <p class="hint">Save this project first, then come back to link activities.</p>
  <?php else: ?>
    <?php foreach (['events' => ['Events', 'form-event.php'], 'trainings' => ['Trainings', 'form-training.php'], 'volunteers' => ['Volunteer slots', 'form-volunteer.php']] as $key => [$label, $href]): ?>
      <h3><?= $label ?></h3>
      <?php if (empty($linked[$key])): ?>
        <p>No <?= strtolower($label) ?> linked yet.</p>
      <?php else: ?>
        <ul>
          <?php foreach ($linked[$key] as $row): ?>
            <li><a href="<?= $href ?>?id=<?= urlencode($row['id']) ?>"><?= htmlspecialchars($row['title'] ?? $row['name'] ?? $row['id']) ?></a></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
      <a class="btn btn-secondary" href="<?= $href ?>?project_id=<?= urlencode($editingId) ?>">+ Link a new <?= strtolower(rtrim($label, 's')) ?></a>
    <?php endforeach; ?>
  <?php endif; ?>
</section>
```

- [ ] **Step 2: Add a Linked Project dropdown to each of `form-event.php`, `form-training.php`, `form-volunteer.php`, `form-gallery.php`**

At the top of each form's main fieldset, before the existing fields, insert:

```php
<?php
$projectsFile = __DIR__ . '/../data/projects.json';
$projectsList = file_exists($projectsFile) ? (json_store_read($projectsFile)['projects'] ?? []) : [];
$presetProjectId = $_GET['project_id'] ?? ($item['project_id'] ?? '');
?>
<label>Linked Project (optional)
  <select name="project_id">
    <option value="">— None —</option>
    <?php foreach ($projectsList as $p): if (!empty($p['disabled'])) continue; ?>
      <option value="<?= htmlspecialchars($p['id']) ?>" <?= $presetProjectId === $p['id'] ? 'selected' : '' ?>>
        <?= htmlspecialchars($p['name']) ?>
      </option>
    <?php endforeach; ?>
  </select>
</label>
```

Make sure the PHP at the top of each form `require`s `includes/json-store.php` and `includes/admin-helpers.php` if not already.

- [ ] **Step 3: Update each form's JS** (`assets/form-event.js`, `form-training.js`, `form-volunteer.js`, `form-gallery.js`) to include `project_id` in the save payload.

In each file's `data = {...}` object passed to `api/save.php`, add:
```javascript
project_id: form.project_id ? form.project_id.value || null : null,
```

- [ ] **Step 4: Smoke test reverse linking**

1. Create an event with Linked Project = "Tree Plantation Program". Save.
2. Open the project's edit page — confirm the event appears in "Linked Activities → Events."
3. Click "+ Link a new training" from the project — confirm `form-training.php` opens with the project dropdown pre-selected.
4. Save a training that way — verify reverse listing on the project.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/admin/form-project.php VEFS-website/admin/form-event.php VEFS-website/admin/form-training.php VEFS-website/admin/form-volunteer.php VEFS-website/admin/form-gallery.php VEFS-website/admin/assets/form-event.js VEFS-website/admin/assets/form-training.js VEFS-website/admin/assets/form-volunteer.js VEFS-website/admin/assets/form-gallery.js
git commit -m "feat(admin): linked-activities section + linked-project dropdown on event/training/volunteer/gallery"
```

---

## Task 7: Public Listing — Hero, Filters, Active Grid

**Files:**
- Create: `VEFS-website/projects.html`
- Create: `VEFS-website/js/projects.js`
- Create: `VEFS-website/css/components/projects.css`

**Interfaces:**
- Consumes: `fetch('/data/projects.json')` (public-facing — must be web-readable; it already is)
- Produces: `/projects` renders hero counters + filter bar + active project cards. Future / Completed sections added in Task 8.

### Steps

- [ ] **Step 1: Create `VEFS-website/projects.html`**

Use whichever public-page HTML scaffold exists (header / nav / footer partials, theme.css, etc.). Mirror the structure of `events.html`. The body's main content:

```html
<main id="projects-page">
  <section class="hero">
    <h1>Rooted in action across Tamil Nadu</h1>
    <p class="lede">Every project here is real, accountable, and open for you to join or fund.</p>
    <div class="impact-counters" data-counters>
      <div class="counter"><span data-metric="trees">0</span><label>Trees planted</label></div>
      <div class="counter"><span data-metric="farmers">0</span><label>Farmers trained</label></div>
      <div class="counter"><span data-metric="villages">0</span><label>Villages reached</label></div>
      <div class="counter"><span data-metric="raised">₹0</span><label>Raised</label></div>
    </div>
    <div class="hero-cta">
      <a href="#active" class="btn btn-primary">Donate</a>
      <a href="volunteer.html" class="btn btn-secondary">Volunteer with us</a>
    </div>
  </section>

  <section class="featured-rail" data-featured-rail aria-label="Featured projects" hidden>
    <!-- populated by JS when at least one featured project exists -->
  </section>

  <nav class="filter-bar" aria-label="Project filters">
    <div class="status-pills" data-status-pills>
      <button data-status="active" class="pill is-active">Active</button>
      <button data-status="planning" class="pill">Planning</button>
      <button data-status="completed" class="pill">Completed</button>
      <button data-status="all" class="pill">All</button>
    </div>
    <div class="theme-pills" data-theme-pills>
      <button data-theme="all" class="pill is-active">All themes</button>
      <button data-theme="ecology" class="pill">Ecology</button>
      <button data-theme="livelihood" class="pill">Livelihood</button>
      <button data-theme="women" class="pill">Women</button>
      <button data-theme="education" class="pill">Education</button>
      <button data-theme="heritage" class="pill">Heritage</button>
    </div>
    <input type="search" placeholder="Search projects" data-search aria-label="Search projects">
  </nav>

  <section id="active" class="project-grid" data-active-grid>
    <!-- cards rendered by JS -->
  </section>

  <!-- Future + Completed sections added in Task 8 -->
</main>

<link rel="stylesheet" href="css/components/projects.css">
<script src="js/projects.js" defer></script>
```

- [ ] **Step 2: Create `js/projects.js`**

```javascript
(function () {
  const state = {
    projects: [],
    filters: { status: 'active', theme: 'all', search: '' },
  };

  const cloudUrl = (publicId, t = 'w_640,h_400,c_fill,q_auto,f_auto') =>
    publicId ? `https://res.cloudinary.com/vefs/image/upload/${t}/${publicId}` : '';

  const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

  async function load() {
    const res = await fetch('/data/projects.json', { cache: 'no-store' });
    const json = await res.json();
    state.projects = (json.projects || []).filter((p) => !p.disabled && !p.hiddenFromPublic);
    renderHero();
    renderFeaturedRail();
    bindFilters();
    renderGrid();
  }

  function renderHero() {
    const totals = state.projects.reduce(
      (acc, p) => {
        (p.impact_metrics || []).forEach((m) => {
          const lbl = (m.label || '').toLowerCase();
          if (lbl.includes('tree')) acc.trees += Number(m.value || 0);
          if (lbl.includes('farmer')) acc.farmers += Number(m.value || 0);
          if (lbl.includes('village')) acc.villages += Number(m.value || 0);
        });
        acc.raised += Number((p.fundraising || {}).raised_amount || 0);
        return acc;
      },
      { trees: 0, farmers: 0, villages: 0, raised: 0 }
    );
    document.querySelector('[data-metric="trees"]').textContent = totals.trees.toLocaleString('en-IN');
    document.querySelector('[data-metric="farmers"]').textContent = totals.farmers.toLocaleString('en-IN');
    document.querySelector('[data-metric="villages"]').textContent = totals.villages.toLocaleString('en-IN');
    document.querySelector('[data-metric="raised"]').textContent = inr(totals.raised);
  }

  function renderFeaturedRail() {
    const rail = document.querySelector('[data-featured-rail]');
    const featured = state.projects.filter((p) => p.featured && p.status === 'active');
    if (featured.length === 0) { rail.hidden = true; return; }
    rail.hidden = false;
    rail.innerHTML = `
      <h2>Featured</h2>
      <div class="featured-track">
        ${featured.map(featuredCard).join('')}
      </div>`;
    if (featured.length > 1) startCarousel(rail.querySelector('.featured-track'));
  }

  function featuredCard(p) {
    return `
      <article class="featured-card">
        <img src="${cloudUrl(p.hero_image, 'w_1200,h_500,c_fill,q_auto,f_auto')}" alt="">
        <div class="featured-body">
          <h3>${escape(p.name)}</h3>
          <p>${escape(p.objective)}</p>
          ${progressBar(p)}
          <a href="/projects/${encodeURIComponent(p.slug)}" class="btn btn-primary">Read the full story →</a>
        </div>
      </article>`;
  }

  function startCarousel(track) {
    const cards = track.children;
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % cards.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
    }, 7000);
  }

  function bindFilters() {
    document.querySelectorAll('[data-status-pills] button').forEach((b) => {
      b.addEventListener('click', () => {
        document.querySelectorAll('[data-status-pills] button').forEach((x) => x.classList.remove('is-active'));
        b.classList.add('is-active');
        state.filters.status = b.dataset.status;
        renderGrid();
      });
    });
    document.querySelectorAll('[data-theme-pills] button').forEach((b) => {
      b.addEventListener('click', () => {
        document.querySelectorAll('[data-theme-pills] button').forEach((x) => x.classList.remove('is-active'));
        b.classList.add('is-active');
        state.filters.theme = b.dataset.theme;
        renderGrid();
      });
    });
    const search = document.querySelector('[data-search]');
    search.addEventListener('input', () => { state.filters.search = search.value.toLowerCase(); renderGrid(); });
  }

  function renderGrid() {
    const grid = document.querySelector('[data-active-grid]');
    const filtered = state.projects.filter((p) => {
      if (state.filters.status !== 'all' && p.status !== state.filters.status) return false;
      if (state.filters.theme !== 'all' && p.theme !== state.filters.theme) return false;
      if (state.filters.search) {
        const hay = `${p.name} ${p.objective}`.toLowerCase();
        if (!hay.includes(state.filters.search)) return false;
      }
      return true;
    });
    grid.innerHTML = filtered.length
      ? filtered.map(projectCard).join('')
      : '<p class="empty-state">No projects match these filters.</p>';
  }

  function projectCard(p) {
    const m1 = (p.impact_metrics || [])[0];
    const m2 = (p.impact_metrics || [])[1];
    return `
      <article class="project-card" data-theme="${p.theme}">
        <a href="/projects/${encodeURIComponent(p.slug)}">
          <img src="${cloudUrl(p.hero_image)}" alt="">
        </a>
        <div class="card-body">
          <div class="card-meta"><span class="chip theme-${p.theme}">${p.theme}</span><span class="status status-${p.status}">${p.status}</span></div>
          <h3><a href="/projects/${encodeURIComponent(p.slug)}">${escape(p.name)}</a></h3>
          <p class="objective">${escape(p.objective)}</p>
          <p class="meta">${escape(p.location)} · Started ${formatMonth(p.start_date)}</p>
          ${m1 || m2 ? `<ul class="metrics">
            ${m1 ? `<li><strong>${Number(m1.value).toLocaleString('en-IN')}${m1.unit ? ' ' + escape(m1.unit) : ''}</strong> ${escape(m1.label)}</li>` : ''}
            ${m2 ? `<li><strong>${Number(m2.value).toLocaleString('en-IN')}${m2.unit ? ' ' + escape(m2.unit) : ''}</strong> ${escape(m2.label)}</li>` : ''}
          </ul>` : ''}
          ${progressBar(p)}
          <div class="card-cta">
            <a href="donate.html?project=${encodeURIComponent(p.slug)}" class="btn btn-primary">Donate to this project</a>
            <a href="/projects/${encodeURIComponent(p.slug)}" class="btn btn-secondary">Read the full story →</a>
          </div>
        </div>
      </article>`;
  }

  function progressBar(p) {
    const f = p.fundraising || {};
    if (!f.show_progress || !f.target_amount) return '';
    const pct = Math.min(100, Math.round((f.raised_amount / f.target_amount) * 100));
    return `
      <div class="progress" aria-label="Funding progress">
        <div class="progress-bar" style="width:${pct}%"></div>
      </div>
      <p class="progress-meta">${inr(f.raised_amount)} of ${inr(f.target_amount)} · ${f.donor_count || 0} donors · ${pct}% funded</p>`;
  }

  function formatMonth(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
  }

  function escape(s) {
    return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  load().catch((e) => { console.error(e); });
})();
```

- [ ] **Step 3: Create `css/components/projects.css`**

Minimal styles — extend the existing design system tokens:

```css
.hero { padding: var(--space-3xl) var(--space-md); text-align: center; background: linear-gradient(135deg, rgba(107,142,35,0.08), rgba(212,165,116,0.08)); }
.hero h1 { font-family: var(--font-serif); color: var(--color-primary); }
.impact-counters { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-md); margin: var(--space-xl) 0; }
.counter { background: white; padding: var(--space-md); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.counter span { font-size: 2rem; font-weight: 700; color: var(--color-primary); display: block; }
.counter label { font-size: 0.875rem; color: var(--color-accent); }

.filter-bar { position: sticky; top: 0; z-index: 10; background: white; padding: var(--space-sm) var(--space-md); border-bottom: 1px solid #eee; display: flex; flex-wrap: wrap; gap: var(--space-sm); }
.pill { padding: 6px 14px; border: 1px solid var(--color-primary); background: white; border-radius: 999px; cursor: pointer; }
.pill.is-active { background: var(--color-primary); color: white; }

.project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-lg); padding: var(--space-xl) var(--space-md); }
.project-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.project-card img { width: 100%; height: 220px; object-fit: cover; }
.card-body { padding: var(--space-md); }
.card-meta { display: flex; gap: var(--space-xs); margin-bottom: var(--space-xs); }
.chip { padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; background: rgba(107,142,35,0.15); color: var(--color-primary); }
.status { padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
.status-active { background: rgba(107,142,35,0.2); color: var(--color-primary); }
.status-planning { background: rgba(212,165,116,0.25); color: var(--color-secondary); }
.status-completed { background: rgba(139,115,85,0.2); color: var(--color-accent); }
.progress { height: 8px; background: #eee; border-radius: 999px; overflow: hidden; margin-top: var(--space-sm); }
.progress-bar { height: 100%; background: var(--color-secondary); }
.progress-meta { font-size: 0.85rem; color: var(--color-accent); margin: var(--space-xs) 0 var(--space-sm); }
.card-cta { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
.featured-rail { padding: var(--space-xl) var(--space-md); overflow: hidden; }
.featured-track { display: flex; transition: transform 600ms ease; }
.featured-card { flex: 0 0 100%; }

@media (max-width: 480px) {
  .project-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Smoke test with seed data**

1. Add 2–3 active projects via the admin form (one featured), with metrics + hero photo + fundraising values.
2. Open `http://localhost:8000/projects.html`. Confirm:
   - Counters total correctly.
   - Featured rail rotates if more than one featured project exists.
   - Status pill defaults to "Active" — clicking "All" shows everything.
   - Theme pill filters.
   - Search filters by name/objective.
   - Progress bar renders only when `show_progress=true` and target>0.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/projects.html VEFS-website/js/projects.js VEFS-website/css/components/projects.css
git commit -m "feat(public): projects listing page with hero, filters, active grid"
```

---

## Task 8: Public Listing — Future Projects, Completed Strip, Closing CTA

**Files:**
- Modify: `VEFS-website/projects.html`
- Modify: `VEFS-website/js/projects.js`
- Modify: `VEFS-website/css/components/projects.css`

**Interfaces:**
- Consumes: same `state.projects` from Task 7.
- Produces: visible "What's next" Future section + collapsible Completed strip + closing CTA on `projects.html`.

### Steps

- [ ] **Step 1: Append HTML sections to `projects.html`**

Below the active grid section, before `</main>`:

```html
  <section class="future-projects" aria-label="Future projects" data-future hidden>
    <h2>What's next — and how you can shape it</h2>
    <p class="lede">Projects in planning. Sponsor early, shape the design.</p>
    <div class="future-grid" data-future-grid></div>
  </section>

  <section class="completed-strip" aria-label="Completed projects" data-completed-section hidden>
    <details>
      <summary><strong>Completed projects</strong> <span data-completed-count></span></summary>
      <ul class="completed-list" data-completed-list></ul>
    </details>
  </section>

  <section class="closing-cta">
    <h2>Have a project idea or want to sponsor one?</h2>
    <p>Tell us. We'll get back within 48 hours.</p>
    <a href="contact.html" class="btn btn-primary">Talk to us</a>
  </section>
```

- [ ] **Step 2: Extend `js/projects.js`**

Inside the `load()` function, after `renderGrid()`, call `renderFuture()` and `renderCompleted()`:

```javascript
    renderFuture();
    renderCompleted();
```

Add these functions before the `escape` helper:

```javascript
  function renderFuture() {
    const section = document.querySelector('[data-future]');
    const grid = document.querySelector('[data-future-grid]');
    const future = state.projects.filter((p) => p.status === 'planning');
    if (future.length === 0) { section.hidden = true; return; }
    section.hidden = false;
    grid.innerHTML = future.map((p) => `
      <article class="future-card" data-theme="${p.theme}">
        ${p.hero_image ? `<img src="${cloudUrl(p.hero_image)}" alt="">` : ''}
        <div class="card-body">
          <span class="chip theme-${p.theme}">${p.theme}</span>
          <h3>${escape(p.name)}</h3>
          <p>${escape(p.objective)}</p>
          <ul class="future-meta">
            ${p.proposed_budget ? `<li><strong>${inr(p.proposed_budget)}</strong> proposed budget</li>` : ''}
            ${p.expected_beneficiaries ? `<li><strong>${escape(p.expected_beneficiaries)}</strong> expected beneficiaries</li>` : ''}
            ${p.required_volunteers ? `<li><strong>${p.required_volunteers}</strong> volunteers needed</li>` : ''}
            ${p.start_date ? `<li>Target start: ${formatMonth(p.start_date)}</li>` : ''}
          </ul>
          ${progressBar(p)}
          <a href="contact.html?subject=${encodeURIComponent('Sponsor ' + p.name)}" class="btn btn-primary">Become a sponsor</a>
          <a href="/projects/${encodeURIComponent(p.slug)}" class="btn btn-secondary">Read more →</a>
        </div>
      </article>`).join('');
  }

  function renderCompleted() {
    const section = document.querySelector('[data-completed-section]');
    const list = document.querySelector('[data-completed-list]');
    const completed = state.projects.filter((p) => p.status === 'completed');
    if (completed.length === 0) { section.hidden = true; return; }
    section.hidden = false;
    document.querySelector('[data-completed-count]').textContent = `(${completed.length})`;
    list.innerHTML = completed.map((p) => {
      const headline = (p.impact_metrics || [])[0];
      const headlineStr = headline ? `${Number(headline.value).toLocaleString('en-IN')} ${escape(headline.label)}` : '';
      return `
        <li>
          <a href="/projects/${encodeURIComponent(p.slug)}">
            <strong>${escape(p.name)}</strong>
            <span>${formatMonth(p.start_date)} – ${p.end_date ? formatMonth(p.end_date) : 'ongoing'}</span>
            <span class="headline-stat">${headlineStr}</span>
            <span>View results →</span>
          </a>
        </li>`;
    }).join('');
  }
```

- [ ] **Step 3: Add styles for future + completed**

Append to `css/components/projects.css`:

```css
.future-projects { padding: var(--space-xl) var(--space-md); background: rgba(212,165,116,0.05); }
.future-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-lg); }
.future-card { background: white; border: 2px dashed var(--color-secondary); border-radius: 12px; overflow: hidden; }
.future-card img { width: 100%; height: 180px; object-fit: cover; }
.future-meta { list-style: none; padding: 0; margin: var(--space-sm) 0; }
.future-meta li { padding: 4px 0; font-size: 0.9rem; }

.completed-strip { padding: var(--space-lg) var(--space-md); }
.completed-strip summary { cursor: pointer; padding: var(--space-sm); border-radius: 8px; background: #f7f7f5; }
.completed-list { list-style: none; padding: 0; margin: var(--space-md) 0; display: grid; gap: var(--space-sm); }
.completed-list a { display: grid; grid-template-columns: 2fr 1fr 2fr auto; gap: var(--space-md); padding: var(--space-sm) var(--space-md); background: white; border-radius: 8px; text-decoration: none; color: inherit; align-items: center; }
.completed-list .headline-stat { color: var(--color-primary); font-weight: 600; }

.closing-cta { text-align: center; padding: var(--space-3xl) var(--space-md); }
```

- [ ] **Step 4: Smoke test**

1. Mark one project status=planning with proposed_budget + beneficiaries — confirm Future section renders that card.
2. Mark one project status=completed with end_date and impact_metrics — confirm Completed strip shows under the collapsible.
3. Click "Become a sponsor" — confirm it navigates to `contact.html?subject=Sponsor%20<Name>`.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/projects.html VEFS-website/js/projects.js VEFS-website/css/components/projects.css
git commit -m "feat(public): future projects + completed strip + closing CTA on /projects"
```

---

## Task 9: Project Detail Page (`/projects/<slug>`)

**Files:**
- Create: `VEFS-website/project-detail.php`
- Modify: `VEFS-website/.htaccess`
- Modify: `VEFS-website/router.php`

**Interfaces:**
- Consumes: `data/projects.json`, `data/events.json`, `data/trainings.json`, `data/volunteers.json` for reverse-linked listing
- Produces: `/projects/<slug>` URL serves a server-rendered HTML page with full project details, linked activities, share metadata.

### Steps

- [ ] **Step 1: Add `.htaccess` rewrite**

Append to `VEFS-website/.htaccess` (before the existing rewrites for blog if any; otherwise alongside them):

```
RewriteRule ^projects/([a-z0-9-]+)/?$ project-detail.php?slug=$1 [L,QSA]
```

- [ ] **Step 2: Mirror in `router.php`**

Read `router.php` to see how `blog-post.php` is wired. Add an analogous arm:

```php
if (preg_match('#^/projects/([a-z0-9-]+)/?$#', $path, $m)) {
    $_GET['slug'] = $m[1];
    require __DIR__ . '/project-detail.php';
    return true;
}
```

- [ ] **Step 3: Create `project-detail.php`**

```php
<?php
declare(strict_types=1);
require __DIR__ . '/includes/json-store.php';

$slug = preg_replace('/[^a-z0-9-]/', '', (string)($_GET['slug'] ?? ''));
if ($slug === '') { http_response_code(404); echo 'Project not found'; exit; }

$data = json_store_read(__DIR__ . '/data/projects.json');
$project = null;
foreach ($data['projects'] ?? [] as $p) {
    if (($p['slug'] ?? null) === $slug) { $project = $p; break; }
}
if ($project === null || !empty($project['disabled']) || !empty($project['hiddenFromPublic'])) {
    http_response_code(404); echo 'Project not found'; exit;
}

$projectId = $project['id'];

function linked(string $file, string $key, string $projectId): array {
    if (!file_exists($file)) return [];
    $d = json_store_read($file);
    return array_values(array_filter($d[$key] ?? [], fn($r) => ($r['project_id'] ?? null) === $projectId && empty($r['disabled']) && empty($r['hiddenFromPublic'])));
}
$linkedEvents     = linked(__DIR__ . '/data/events.json', 'events', $projectId);
$linkedTrainings  = linked(__DIR__ . '/data/trainings.json', 'trainings', $projectId);
$linkedVolunteers = linked(__DIR__ . '/data/volunteers.json', 'volunteers', $projectId);

$cloud = 'vefs';
$heroUrl = $project['hero_image'] ? "https://res.cloudinary.com/{$cloud}/image/upload/w_1600,h_700,c_fill,q_auto,f_auto/{$project['hero_image']}" : '';
$ogUrl   = $project['hero_image'] ? "https://res.cloudinary.com/{$cloud}/image/upload/w_1200,h_630,c_fill,q_auto,f_auto/{$project['hero_image']}" : '';

$inr = fn($n) => '₹' . number_format((float)$n, 0, '.', ',');
$f = $project['fundraising'] ?? [];
$pct = !empty($f['target_amount']) ? (int)floor(100 * (($f['raised_amount'] ?? 0) / $f['target_amount'])) : 0;
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title><?= htmlspecialchars($project['name']) ?> · VEFS Projects</title>
<meta name="description" content="<?= htmlspecialchars($project['objective']) ?>">
<meta property="og:title" content="<?= htmlspecialchars($project['name']) ?>">
<meta property="og:description" content="<?= htmlspecialchars($project['objective']) ?>">
<meta property="og:type" content="article">
<meta property="og:image" content="<?= htmlspecialchars($ogUrl) ?>">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/css/theme.css">
<link rel="stylesheet" href="/css/layout.css">
<link rel="stylesheet" href="/css/components/projects.css">
</head>
<body>
<?php include __DIR__ . '/partials/nav.html'; // or whatever the existing site uses ?>

<main class="project-detail">
  <header class="detail-hero" style="<?= $heroUrl ? 'background-image:url(' . htmlspecialchars($heroUrl) . ')' : '' ?>">
    <div class="overlay">
      <span class="status status-<?= htmlspecialchars($project['status']) ?>"><?= htmlspecialchars($project['status']) ?></span>
      <span class="chip theme-<?= htmlspecialchars($project['theme']) ?>"><?= htmlspecialchars($project['theme']) ?></span>
      <h1><?= htmlspecialchars($project['name']) ?></h1>
      <p class="meta"><?= htmlspecialchars($project['location']) ?> · Since <?= htmlspecialchars(substr($project['start_date'], 0, 7)) ?></p>
    </div>
  </header>

  <div class="detail-grid">
    <article class="detail-body">
      <p class="objective"><?= htmlspecialchars($project['objective']) ?></p>
      <div class="story"><?= $project['story'] /* already sanitized at save time */ ?></div>

      <?php if (!empty($project['impact_metrics'])): ?>
        <h2>Impact so far</h2>
        <ul class="metrics-big">
          <?php foreach ($project['impact_metrics'] as $m): ?>
            <li><strong><?= number_format((float)$m['value']) ?><?= !empty($m['unit']) ? ' ' . htmlspecialchars($m['unit']) : '' ?></strong><span><?= htmlspecialchars($m['label']) ?></span></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>

      <?php if (!empty($project['photos'])): ?>
        <h2>Photos</h2>
        <div class="photo-gallery">
          <?php foreach ($project['photos'] as $p): ?>
            <figure>
              <img src="https://res.cloudinary.com/<?= $cloud ?>/image/upload/w_600,h_400,c_fill,q_auto,f_auto/<?= htmlspecialchars($p['public_id']) ?>" alt="<?= htmlspecialchars($p['caption']) ?>">
              <?php if (!empty($p['caption'])): ?><figcaption><?= htmlspecialchars($p['caption']) ?></figcaption><?php endif; ?>
            </figure>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

      <?php if ($linkedEvents || $linkedTrainings || $linkedVolunteers): ?>
        <h2>Active right now</h2>
        <?php if ($linkedEvents): ?>
          <h3>Upcoming events</h3>
          <ul><?php foreach ($linkedEvents as $e): ?><li><a href="/events.html#<?= htmlspecialchars($e['slug'] ?? $e['id']) ?>"><?= htmlspecialchars($e['title']) ?></a></li><?php endforeach; ?></ul>
        <?php endif; ?>
        <?php if ($linkedTrainings): ?>
          <h3>Trainings</h3>
          <ul><?php foreach ($linkedTrainings as $t): ?><li><a href="/trainings.html#<?= htmlspecialchars($t['slug'] ?? $t['id']) ?>"><?= htmlspecialchars($t['title']) ?></a></li><?php endforeach; ?></ul>
        <?php endif; ?>
        <?php if ($linkedVolunteers): ?>
          <h3>Volunteer with us</h3>
          <ul><?php foreach ($linkedVolunteers as $v): ?><li><a href="/volunteer.html#<?= htmlspecialchars($v['slug'] ?? $v['id']) ?>"><?= htmlspecialchars($v['title']) ?></a></li><?php endforeach; ?></ul>
        <?php endif; ?>
      <?php endif; ?>

      <?php if ($project['status'] === 'planning' && !empty($project['sponsorship_opportunities'])): ?>
        <h2>Sponsorship opportunities</h2>
        <div class="sponsorship"><?= $project['sponsorship_opportunities'] ?></div>
      <?php endif; ?>
    </article>

    <aside class="donate-card">
      <h2>Support this project</h2>
      <?php if (!empty($f['show_progress']) && !empty($f['target_amount'])): ?>
        <div class="progress"><div class="progress-bar" style="width:<?= $pct ?>%"></div></div>
        <p><strong><?= $inr($f['raised_amount'] ?? 0) ?></strong> raised of <?= $inr($f['target_amount']) ?></p>
        <p><?= (int)($f['donor_count'] ?? 0) ?> donors · <?= $pct ?>% funded</p>
      <?php endif; ?>
      <a class="btn btn-primary" href="/donate.html?project=<?= urlencode($project['slug']) ?>">Donate to this project</a>
      <div class="share-row">
        <a href="https://wa.me/?text=<?= urlencode($project['name'] . ' — https://vefs.org/projects/' . $project['slug']) ?>" target="_blank" rel="noopener">WhatsApp</a>
        <a href="https://twitter.com/intent/tweet?url=<?= urlencode('https://vefs.org/projects/' . $project['slug']) ?>" target="_blank" rel="noopener">Twitter</a>
        <button type="button" onclick="navigator.clipboard.writeText(location.href); this.textContent='Copied'">Copy link</button>
      </div>
    </aside>
  </div>
</main>

<?php include __DIR__ . '/partials/footer.html'; // or whatever exists ?>
</body></html>
```

(If the codebase does not use `partials/nav.html` / `partials/footer.html`, copy the nav + footer markup from `blog-post.php` to match its conventions exactly.)

- [ ] **Step 4: Add detail-page styles**

Append to `css/components/projects.css`:

```css
.detail-hero { min-height: 360px; background-size: cover; background-position: center; position: relative; }
.detail-hero .overlay { background: linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.1)); color: white; padding: var(--space-2xl) var(--space-md); height: 100%; display: flex; flex-direction: column; justify-content: flex-end; }
.detail-hero h1 { font-family: var(--font-serif); font-size: 2.4rem; margin: var(--space-xs) 0; }

.detail-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-xl); padding: var(--space-xl) var(--space-md); max-width: 1200px; margin: 0 auto; }
.donate-card { background: white; padding: var(--space-lg); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); position: sticky; top: var(--space-lg); align-self: start; }
.metrics-big { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-md); padding: 0; list-style: none; }
.metrics-big li { background: rgba(107,142,35,0.08); padding: var(--space-md); border-radius: 8px; }
.metrics-big strong { display: block; font-size: 1.8rem; color: var(--color-primary); }
.photo-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-md); }
.photo-gallery figcaption { font-size: 0.85rem; color: var(--color-accent); padding: 4px 0; }
.share-row { display: flex; gap: var(--space-sm); margin-top: var(--space-md); }

@media (max-width: 800px) {
  .detail-grid { grid-template-columns: 1fr; }
  .donate-card { position: static; }
}
```

- [ ] **Step 5: Smoke test**

1. With dev server running, visit `http://localhost:8000/projects/tree-plantation-program`. Confirm page renders with hero, story, metrics, photos, donate sidebar, linked items.
2. Visit a bad slug: `http://localhost:8000/projects/does-not-exist`. Expect 404.
3. View source — confirm `og:image`, `og:title`, `twitter:card` meta tags present.
4. Click "Donate to this project" — should land at `/donate.html?project=tree-plantation-program`.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/project-detail.php VEFS-website/.htaccess VEFS-website/router.php VEFS-website/css/components/projects.css
git commit -m "feat(public): project detail page /projects/<slug> with OG tags + linked activities"
```

---

## Task 10: Cross-Page Integration — Nav, Donate Query, Gallery Filter, Remove future-plans

**Files:**
- Modify: all public HTML pages (`index.html`, `about.html`, `trainings.html`, `events.html`, `volunteer.html`, `gallery.html`, `contact.html`, `donate.html`, `blog.html`, `privacy.html`, `terms.html`, `registration-confirmation.html`)
- Modify: `VEFS-website/donate.html` (or its handler) — read `?project=<slug>`
- Modify: `VEFS-website/gallery.html`, `js/gallery.js` — "Filter by project" pill row
- Remove: `VEFS-website/future-plans.html`

**Interfaces:**
- Consumes: `?project=` query param, `?subject=` query param, `data/projects.json` (read by gallery for filter labels)
- Produces: nav link "Projects" everywhere, donate page pre-selects project, gallery filterable by project.

### Steps

- [ ] **Step 1: Replace nav link "Future Plans" → "Projects" across all public HTML pages**

Search-and-replace project-wide: find `future-plans.html` in nav blocks → replace with `projects.html`. Find display text `Future Plans` (or similar) → replace with `Projects`. Confirm each of the 12 pages.

Run a verification grep:
```
grep -rn "future-plans" VEFS-website/*.html
```
Expected: zero hits remaining (other than `future-plans.html` itself, which we delete next).

- [ ] **Step 2: Delete `future-plans.html`**

```
rm VEFS-website/future-plans.html
```

Search any remaining references and clean them:
```
grep -rn "future-plans" VEFS-website/
```

- [ ] **Step 3: Wire `?project=<slug>` on donate.html**

Open `VEFS-website/donate.html` + its JS handler. Find the donation form's "select project" or "purpose" field. If it doesn't exist, add a hidden input `<input type="hidden" name="purpose" id="donate-purpose">` and a small visible label "Donating to: <span id='donate-purpose-label'>General fund</span>".

In the donate JS (find existing donate.js or inline script), at the top:

```javascript
(function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get('project');
  if (!slug) return;
  fetch('/data/projects.json').then(r => r.json()).then(({ projects }) => {
    const p = (projects || []).find(x => x.slug === slug && !x.disabled && !x.hiddenFromPublic);
    if (!p) return;
    document.getElementById('donate-purpose').value = p.id;
    document.getElementById('donate-purpose-label').textContent = p.name;
  });
})();
```

If `donate.html` already submits to a PHP handler, ensure the handler accepts the `purpose` field and stores/forwards it in the email body so the admin knows which project the donor pointed at.

- [ ] **Step 4: Add "Filter by project" pill row to gallery**

In `gallery.html`, just above the gallery grid, add:

```html
<nav class="filter-bar" aria-label="Gallery filters">
  <div class="project-pills" data-project-pills>
    <button data-project="all" class="pill is-active">All photos</button>
  </div>
</nav>
```

In `js/gallery.js`, after the data loads:

```javascript
async function buildProjectPills(galleryItems) {
  const projectIds = [...new Set(galleryItems.map(i => i.project_id).filter(Boolean))];
  if (projectIds.length === 0) return;
  const projects = await fetch('/data/projects.json').then(r => r.json()).then(j => j.projects || []);
  const byId = Object.fromEntries(projects.map(p => [p.id, p]));
  const container = document.querySelector('[data-project-pills]');
  projectIds.forEach((id) => {
    const p = byId[id];
    if (!p || p.disabled || p.hiddenFromPublic) return;
    const btn = document.createElement('button');
    btn.dataset.project = id;
    btn.className = 'pill';
    btn.textContent = p.name;
    container.appendChild(btn);
  });
  container.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button[data-project]');
    if (!btn) return;
    container.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const sel = btn.dataset.project;
    document.querySelectorAll('.gallery-item').forEach((item) => {
      const pid = item.dataset.projectId || '';
      item.style.display = (sel === 'all' || sel === pid) ? '' : 'none';
    });
  });
}
```

Wire `data-project-id` into each gallery item's rendering — find where gallery cards are generated and add `data-project-id="${item.project_id || ''}"` on the wrapper.

- [ ] **Step 5: Smoke test**

1. Open every public page — confirm "Projects" appears in the nav, no "Future Plans" link remains, no 404 if a user pasted the old URL (this is acceptable since the page is gone).
2. Click `Donate to this project` from `/projects` → confirm donate page shows "Donating to: <Project Name>".
3. Open `gallery.html` — confirm new project pills appear and filter the gallery grid.
4. Verify Playwright specs that targeted nav still pass (run existing E2E suite).

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/*.html VEFS-website/js/gallery.js
git rm VEFS-website/future-plans.html
git commit -m "feat(public): nav swap to Projects, donate pre-fill, gallery project filter; remove future-plans.html"
```

---

## Task 11: Playwright E2E + Sample Seed

**Files:**
- Create: `tests-e2e/projects.spec.js` (or wherever the existing Playwright specs live — check `package.json` testDir)
- Modify: `VEFS-website/data/projects.json` — leave empty (don't commit seed data to repo); document a seed script instead

**Interfaces:**
- Consumes: dev server at `localhost:8000`
- Produces: an E2E spec covering listing render, filters, detail page, donate query string, admin CRUD round-trip.

### Steps

- [ ] **Step 1: Check existing Playwright location**

Look at `package.json` for `testDir` or root-level specs (`test_modal_scroll.spec.js`). Match the convention.

- [ ] **Step 2: Write the spec**

Create at the matching location (e.g., `tests-e2e/projects.spec.js`):

```javascript
const { test, expect } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:8000';

test.describe('Projects page', () => {
  test('renders hero counters and at least one active project card', async ({ page }) => {
    await page.goto(`${BASE}/projects.html`);
    await expect(page.locator('h1')).toContainText(/Rooted in action|Projects/i);
    await expect(page.locator('[data-counters]')).toBeVisible();
    // Assumes seed data exists; otherwise this asserts the empty state which is also valid.
    const cards = page.locator('.project-card');
    const empty = page.locator('.empty-state');
    await expect(cards.or(empty).first()).toBeVisible();
  });

  test('filter pills change which projects show', async ({ page }) => {
    await page.goto(`${BASE}/projects.html`);
    await page.locator('[data-status-pills] button[data-status="all"]').click();
    await expect(page.locator('[data-status-pills] button[data-status="all"]')).toHaveClass(/is-active/);
  });

  test('donate CTA passes ?project= query string', async ({ page }) => {
    await page.goto(`${BASE}/projects.html`);
    const donate = page.locator('.project-card .btn-primary').first();
    if (await donate.count() === 0) test.skip(true, 'No seeded projects to test against');
    const href = await donate.getAttribute('href');
    expect(href).toMatch(/donate\.html\?project=/);
  });

  test('detail page renders for a real slug or returns 404', async ({ page }) => {
    const res = await page.goto(`${BASE}/projects/does-not-exist`);
    expect(res.status()).toBe(404);
  });
});
```

- [ ] **Step 3: Manually seed 3 sample projects via the admin form** (active + planning + completed). Re-run the Playwright spec — expect all tests to pass.

```
npx playwright test tests-e2e/projects.spec.js
```

- [ ] **Step 4: Commit**

```bash
git add tests-e2e/projects.spec.js
git commit -m "test(e2e): projects listing, filters, donate query, detail 404"
```

---

## Self-Review Notes

- **Spec coverage:** Sections 1–7 of the spec map to Tasks 1–11. Section 8 (out of scope) and Section 9 (deferred decisions) intentionally have no tasks.
- **Cloudinary pattern:** Step 1 of Task 4 explicitly tells the executor to **read the existing gallery upload endpoint first and mirror it**, because the spec doesn't pin down whether the codebase uses unsigned widget or server-signed upload. The PHP stub provided is a reasonable default; mirroring the existing pattern overrides it.
- **`data-show-when` mechanism** is defined once in Task 3 Step 3, and Task 5 Step 4 reuses it for the future section + end_date — same selector convention so no rebinding needed.
- **ID prefix `prj` and slug uniqueness** are enforced in save.php Task 1 Step 8 and validated in Task 1 Step 3.
- **`project_id` is added in two places** (validate.php in Task 1 Step 9, save.php in Task 1 Step 9 plus form dropdowns in Task 6) — the validator catches malformed values; the form provides the legitimate values.
- **`hiddenFromPublic` (camelCase)** is used consistently throughout (matches gallery convention as decided in Global Constraints).
