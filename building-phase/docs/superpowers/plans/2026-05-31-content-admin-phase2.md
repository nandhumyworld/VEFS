# Content Admin Phase 2 — Events / Trainings / Volunteers

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing admin (currently handles Blog + Social) to also manage Events, Trainings, and Volunteer opportunities with full schema parity — every existing JSON field editable via form UI, no hand-edited JSON required.

**Architecture:** Reuses all Phase 1 infrastructure unchanged — `auth`, `csrf`, `json-store`, `sanitize-html`, `Cloudinary` upload helper. Adds three validators, three form pages, and three save-endpoint branches. Generalizes the dashboard and APIs to handle each type's distinct top-level array key (`posts` for blog/social, `events`/`trainings`/`volunteers` for the new types). Introduces a single reusable repeatable-rows JS helper so the three new form files stay short.

**Tech Stack:** PHP 7.4+ (vanilla, no framework), vanilla JS (ES6), Cloudinary unsigned uploads, JSON file storage with file locking and rolling backups.

**Reference:**
- Phase 1 plan: `docs/superpowers/plans/2026-05-28-content-admin-phase1.md`
- Phase 1 design spec: `docs/superpowers/specs/2026-05-28-content-admin-design.md` (§4.3, §5.5)
- Existing data shapes: `VEFS-website/data/events.json`, `trainings.json`, `volunteers.json`

---

## File Structure

### Files to create
| Path | Responsibility |
|---|---|
| `VEFS-website/includes/admin-helpers.php` | Tiny helper: `admin_array_key_for_type($type)` returns `'posts'`, `'events'`, `'trainings'`, or `'volunteers'`. One function, one responsibility. |
| `VEFS-website/admin/form-event.php` | Event create/edit form. |
| `VEFS-website/admin/form-training.php` | Training create/edit form. |
| `VEFS-website/admin/form-volunteer.php` | Volunteer create/edit form. |
| `VEFS-website/admin/assets/form-event.js` | Event form logic. |
| `VEFS-website/admin/assets/form-training.js` | Training form logic. |
| `VEFS-website/admin/assets/form-volunteer.js` | Volunteer form logic. |
| `VEFS-website/tests/test-validate-phase2.php` | Tests for the three new validators. |

### Files to modify
| Path | Why |
|---|---|
| `VEFS-website/includes/validate.php` | Add `validate_event`, `validate_training`, `validate_volunteer`. |
| `VEFS-website/admin/api/save.php` | Add `event`/`training`/`volunteer` branches with id auto-numbering, slug derivation, sanitization, timestamps. |
| `VEFS-website/admin/api/delete.php` | Extend whitelist + handle non-`posts` array keys. |
| `VEFS-website/admin/api/reorder.php` | Extend whitelist + handle non-`posts` array keys. |
| `VEFS-website/admin/dashboard.php` | Add three tabs; row rendering must read the correct array key and title field per type. |
| `VEFS-website/admin/assets/admin.js` | Export reusable `repeatableRows(container, fields, initial)` helper used by all three new form JS files. |
| `VEFS-website/data/events.json` | One-time migration: add `order` to each event (10, 20, …). |
| `VEFS-website/data/trainings.json` | Same migration. |
| `VEFS-website/data/volunteers.json` | Same migration. |

### Key decomposition decisions

1. **One helper, no abstraction layer.** Each form page is independent — same shape but distinct fields. Extracting "a generic schema-driven form" would over-engineer this. Three short files >> one big magic file.
2. **`admin-helpers.php` is one function.** It exists only so `save.php`, `delete.php`, `reorder.php`, `dashboard.php` don't each hard-code the same `switch`. If it grows beyond two small functions, split it.
3. **`repeatableRows()` JS helper is the only shared form widget.** All three forms have several "list of items where each item has N text fields" — without a helper, this is 200 lines of duplicated DOM-building code per form. With the helper each form's JS is ~150 lines total.
4. **No new CSS file.** Reuse `admin.css` classes (`form-grid`, `repeat-row`, `btn`, etc.).

---

## Schema reference (for the executing engineer)

Read once before starting — saves you flipping back and forth.

### Event (`data/events.json` → `events[]`)

```
id                              "evt-NNN" (auto-generated)
slug                            kebab-case, derived from title if blank
title                           string, required, ≤ 200
type                            enum: market | workshop | conference | meetup | celebration | other
status                          enum: upcoming | completed | cancelled
featured                        bool
order                           int ≥ 0 (NEW — Phase 2 adds this)
recurring.isRecurring           bool
recurring.frequency             enum: weekly | monthly | yearly | "" (when not recurring)
recurring.pattern               free string ("2nd-sunday", "1st-saturday", etc.)
recurring.label                 free string
date.start                      ISO 8601 with timezone (required)
date.end                        ISO 8601 with timezone (required)
date.timezone                   "Asia/Kolkata" (default)
duration.value                  int ≥ 0
duration.unit                   enum: minutes | hours | days
location.type                   enum: in-person | online | hybrid
location.venue                  string
location.address                string
location.city                   string
location.state                  string
location.mapUrl                 URL (optional, http/https)
shortDescription                string, required, ≤ 500
fullDescription                 string, required (multiline plain text — NOT HTML)
agenda[]                        repeating { time, title, description }
speakers[]                      repeating { name, title, bio }
organizer.name                  string
organizer.email                 email
organizer.phone                 string
registration.required           bool
registration.fee.amount         int ≥ 0
registration.fee.currency       "INR"
registration.fee.type           enum: free | paid | donation
capacity                        int ≥ 0 OR null
requirements.age.min            int OR null
requirements.age.max            int OR null
requirements.whatToBring[]      list of strings
links.whatsapp                  URL (optional)
links.youtube                   URL (optional)
links.map                       URL (optional)
images.featured                 URL (Cloudinary)
images.hero                     URL (Cloudinary)
tags[]                          list of strings
```

### Training (`data/trainings.json` → `trainings[]`)

```
id                              "trn-NNN" (auto-generated)
slug                            kebab-case, derived from title if blank
title                           string, required, ≤ 200
category                        enum: farming | conservation | skills-development | livelihood | other
status                          enum: open | full | upcoming | completed | cancelled
featured                        bool
order                           int ≥ 0 (NEW)
schedule.type                   enum: daily-immersive | weekend-sessions | online | hybrid
schedule.sessions[]             repeating { date (ISO), startTime, endTime, title, description }
schedule.dailyStructure.morning string (multiline)
schedule.dailyStructure.afternoon string
schedule.dailyStructure.evening string
schedule.dailyStructure.night   string
schedule.timezone               "Asia/Kolkata"
totalDuration.value             int ≥ 0
totalDuration.unit              enum: days | weeks | months
location.type                   enum: offline | online | hybrid
location.venue                  string
location.city                   string
location.state                  string
location.country                string
audience[]                      list of strings
targetAudience                  string (paragraph)
capacity.total                  int ≥ 0
capacity.registered             int ≥ 0 (manual, defaults 0)
capacity.available              int (server-calculated: total − registered)
description.brief               string, required, ≤ 500
description.full                string, required (paragraph)
description.objectives[]        list of strings
description.curriculum[]        repeating { module, topics[] } ← nested array of strings
description.outcomes[]          list of strings
description.requirements[]      list of strings
facilitators[]                  repeating { name, title, bio }
registration.required           bool
registration.fee.amount         int ≥ 0
registration.fee.currency       "INR"
registration.fee.type           enum: free | paid | donation
registration.notes              string (optional)
media.featuredImage             URL (Cloudinary)
media.heroImage                 URL (Cloudinary)
```

### Volunteer (`data/volunteers.json` → `volunteers[]`)

```
id                              "vol-NNN" (auto-generated)
slug                            kebab-case
title                           string, required, ≤ 200
description.brief               string, required, ≤ 500
description.full                string, required
dates.start                     "TBD" OR ISO 8601 date
dates.end                       "TBD" OR ISO 8601 date
duration.value                  int ≥ 0
duration.unit                   enum: days | weeks | months | years
commitment                      string ("Full-time", "Part-time", "Weekends", etc.)
requirements.age.min            int OR null
requirements.age.max            int OR null
requirements.skills[]           list of strings
requirements.physical           string
requirements.education          string
benefits.learning[]             list of strings
benefits.certificate            bool
benefits.meals                  bool
benefits.accommodation          bool
benefits.stipend.provided       bool
benefits.stipend.amount         int ≥ 0 (only meaningful when provided=true)
relatedEvents[]                 list of event ids (strings)
location.type                   enum: on-site | remote | hybrid
location.city                   string
location.state                  string
spots.total                     int ≥ 0
spots.filled                    int ≥ 0
spots.available                 int (server-calculated)
status                          enum: open | full | closed
order                           int ≥ 0 (NEW)
contact.name                    string
contact.email                   email
contact.phone                   string
media.featuredImage             URL
```

---

## Task 1: Bootstrap helper + migrate existing JSON

**Files:**
- Create: `VEFS-website/includes/admin-helpers.php`
- Modify: `VEFS-website/data/events.json`
- Modify: `VEFS-website/data/trainings.json`
- Modify: `VEFS-website/data/volunteers.json`

- [ ] **Step 1: Create `admin-helpers.php`**

```php
<?php
declare(strict_types=1);

/**
 * Maps a content type to its top-level array key inside the JSON file.
 * Blog and social use "posts" (Phase 1); the new types use plural type names.
 */
function admin_array_key_for_type(string $type): ?string {
    return [
        'blog'      => 'posts',
        'social'    => 'posts',
        'event'     => 'events',
        'training'  => 'trainings',
        'volunteer' => 'volunteers',
    ][$type] ?? null;
}

/**
 * Returns the human display title for a row, regardless of type.
 * Used by the dashboard list to render the "title" column.
 */
function admin_display_title(string $type, array $row): string {
    if ($type === 'social') return (string)($row['caption'] ?? '');
    return (string)($row['title'] ?? '');
}

/**
 * Returns the thumbnail URL for a row, regardless of type.
 */
function admin_display_thumb(string $type, array $row): string {
    return (string)(
        $row['cover_image_url']         // blog
        ?? $row['thumbnail_url']         // social
        ?? $row['images']['featured']    // event
        ?? $row['media']['featuredImage'] // training, volunteer
        ?? ''
    );
}

/**
 * Returns the data file path for a type.
 */
function admin_data_file(string $type): string {
    return __DIR__ . '/../data/' . admin_data_filename($type);
}

function admin_data_filename(string $type): string {
    return [
        'blog'      => 'blog.json',
        'social'    => 'social.json',
        'event'     => 'events.json',
        'training'  => 'trainings.json',
        'volunteer' => 'volunteers.json',
    ][$type];
}

/**
 * Auto-numbers a new id like "evt-007", "trn-003", "vol-012".
 * Reads the existing list, finds max numeric suffix, increments by 1.
 */
function admin_next_id(string $prefix, array $existingItems): string {
    $max = 0;
    foreach ($existingItems as $item) {
        $id = (string)($item['id'] ?? '');
        if (preg_match('/^' . preg_quote($prefix, '/') . '-(\d+)$/', $id, $m)) {
            $max = max($max, (int)$m[1]);
        }
    }
    return $prefix . '-' . str_pad((string)($max + 1), 3, '0', STR_PAD_LEFT);
}
```

- [ ] **Step 2: Migrate `events.json` — add `order` to each event**

Read the file. For each event in the `events[]` array, add `"order": <position * 10>` (10, 20, 30, …) after the `featured` key, preserving all other fields exactly. Save the file. Verify it still parses:

```powershell
..\.tooling\php\php.exe -r "json_decode(file_get_contents('VEFS-website/data/events.json'), true) ?: exit(1); echo 'OK';"
```

Expected: `OK`.

- [ ] **Step 3: Same migration for `trainings.json`**

Add `"order": 10` to the single existing training. Verify it parses.

- [ ] **Step 4: Same migration for `volunteers.json`**

Add `"order": 10, 20, 30, 40, 50` to the five existing volunteers. Verify parses.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/includes/admin-helpers.php VEFS-website/data/events.json VEFS-website/data/trainings.json VEFS-website/data/volunteers.json
git commit -m "feat(admin): add type→array-key helper and migrate JSON to include order field"
```

---

## Task 2: `validate_event` with tests

**Files:**
- Modify: `VEFS-website/includes/validate.php`
- Create: `VEFS-website/tests/test-validate-phase2.php`

- [ ] **Step 1: Write failing tests for `validate_event`**

Create `VEFS-website/tests/test-validate-phase2.php`:

```php
<?php
declare(strict_types=1);
require __DIR__ . '/_runner.php';
require __DIR__ . '/../includes/validate.php';

// Minimum valid event used as a base
function minValidEvent(): array {
    return [
        'title' => 'My Event',
        'slug' => 'my-event',
        'type' => 'market',
        'status' => 'upcoming',
        'featured' => false,
        'order' => 10,
        'recurring' => ['isRecurring' => false, 'frequency' => '', 'pattern' => '', 'label' => ''],
        'date' => [
            'start' => '2026-06-01T09:00:00+05:30',
            'end'   => '2026-06-01T18:00:00+05:30',
            'timezone' => 'Asia/Kolkata',
        ],
        'duration' => ['value' => 9, 'unit' => 'hours'],
        'location' => ['type' => 'in-person', 'venue' => 'Hall', 'address' => '', 'city' => 'Chennai', 'state' => 'TN', 'mapUrl' => ''],
        'shortDescription' => 'A short description.',
        'fullDescription'  => 'Full description here.',
        'agenda' => [],
        'speakers' => [],
        'organizer' => ['name' => 'VEFS', 'email' => 'a@b.com', 'phone' => '123'],
        'registration' => ['required' => false, 'fee' => ['amount' => 0, 'currency' => 'INR', 'type' => 'free']],
        'capacity' => null,
        'requirements' => ['age' => ['min' => null, 'max' => null], 'whatToBring' => []],
        'links' => [],
        'images' => ['featured' => 'https://res.cloudinary.com/x/a.jpg', 'hero' => 'https://res.cloudinary.com/x/b.jpg'],
        'tags' => [],
    ];
}

t('validate_event: minimal valid passes', function () {
    assertEq([], validate_event(minValidEvent()));
});

t('validate_event: missing title fails', function () {
    $d = minValidEvent(); unset($d['title']);
    assertEq('Title is required.', validate_event($d)['title'] ?? null);
});

t('validate_event: bad type enum fails', function () {
    $d = minValidEvent(); $d['type'] = 'banana';
    assertContains('Type must be one of', validate_event($d)['type'] ?? '');
});

t('validate_event: end before start fails', function () {
    $d = minValidEvent();
    $d['date']['end'] = '2026-05-01T09:00:00+05:30';
    assertContains('End date must be after start date', validate_event($d)['date.end'] ?? '');
});

t('validate_event: bad iso date fails', function () {
    $d = minValidEvent();
    $d['date']['start'] = 'not-a-date';
    assertContains('valid ISO 8601', validate_event($d)['date.start'] ?? '');
});

t('validate_event: bad location type fails', function () {
    $d = minValidEvent(); $d['location']['type'] = 'mars';
    assertContains('Location type must be one of', validate_event($d)['location.type'] ?? '');
});

t('validate_event: organizer email malformed fails', function () {
    $d = minValidEvent(); $d['organizer']['email'] = 'not-email';
    assertContains('valid email', validate_event($d)['organizer.email'] ?? '');
});

t('validate_event: agenda row missing title fails', function () {
    $d = minValidEvent();
    $d['agenda'] = [['time' => '9 AM', 'title' => '', 'description' => 'desc']];
    assertContains('Title required', validate_event($d)['agenda.0.title'] ?? '');
});

t('validate_event: featured image URL must be http/https', function () {
    $d = minValidEvent(); $d['images']['featured'] = 'javascript:alert(1)';
    assertContains('http/https', validate_event($d)['images.featured'] ?? '');
});

t('validate_event: fee.amount negative fails', function () {
    $d = minValidEvent(); $d['registration']['fee']['amount'] = -10;
    assertContains('non-negative', validate_event($d)['registration.fee.amount'] ?? '');
});

t_done();
```

Run:
```powershell
..\.tooling\php\php.exe VEFS-website/tests/test-validate-phase2.php
```
Expected: FAIL (function `validate_event` undefined).

- [ ] **Step 2: Implement `validate_event` in `validate.php`**

Append to `VEFS-website/includes/validate.php` (after `validate_social`, before `_is_safe_url`):

```php
function validate_event(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be ≤ 200 characters.';

    if (isset($d['slug']) && $d['slug'] !== '' && !preg_match('/^[a-z0-9-]+$/', (string)$d['slug'])) {
        $e['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    $types = ['market', 'workshop', 'conference', 'meetup', 'celebration', 'other'];
    if (!in_array((string)($d['type'] ?? ''), $types, true)) {
        $e['type'] = 'Type must be one of: ' . implode(', ', $types);
    }

    $statuses = ['upcoming', 'completed', 'cancelled'];
    if (!in_array((string)($d['status'] ?? ''), $statuses, true)) {
        $e['status'] = 'Status must be one of: ' . implode(', ', $statuses);
    }

    if (!isset($d['order']) || (!is_int($d['order']) && !ctype_digit((string)$d['order'])) || (int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    $start = (string)($d['date']['start'] ?? '');
    $end   = (string)($d['date']['end'] ?? '');
    $tsStart = _parse_iso_date($start);
    $tsEnd   = _parse_iso_date($end);
    if ($tsStart === null) $e['date.start'] = 'Start date must be a valid ISO 8601 timestamp.';
    if ($tsEnd === null)   $e['date.end']   = 'End date must be a valid ISO 8601 timestamp.';
    if ($tsStart !== null && $tsEnd !== null && $tsEnd <= $tsStart) {
        $e['date.end'] = 'End date must be after start date.';
    }

    $locTypes = ['in-person', 'online', 'hybrid'];
    if (!in_array((string)($d['location']['type'] ?? ''), $locTypes, true)) {
        $e['location.type'] = 'Location type must be one of: ' . implode(', ', $locTypes);
    }
    if (isset($d['location']['mapUrl']) && $d['location']['mapUrl'] !== '' && !_is_safe_url((string)$d['location']['mapUrl'])) {
        $e['location.mapUrl'] = 'Map URL must be a valid http/https URL.';
    }

    if (trim((string)($d['shortDescription'] ?? '')) === '') $e['shortDescription'] = 'Short description is required.';
    elseif (mb_strlen((string)$d['shortDescription']) > 500) $e['shortDescription'] = 'Short description must be ≤ 500 characters.';

    if (trim((string)($d['fullDescription'] ?? '')) === '') $e['fullDescription'] = 'Full description is required.';

    if (isset($d['agenda']) && is_array($d['agenda'])) {
        foreach ($d['agenda'] as $i => $row) {
            if (!is_array($row)) continue;
            if (trim((string)($row['time'] ?? '')) === '' && trim((string)($row['title'] ?? '')) === '') continue;
            if (trim((string)($row['title'] ?? '')) === '') $e["agenda.$i.title"] = 'Title required.';
        }
    }

    if (isset($d['speakers']) && is_array($d['speakers'])) {
        foreach ($d['speakers'] as $i => $row) {
            if (!is_array($row)) continue;
            if (trim((string)($row['name'] ?? '')) === '' && trim((string)($row['title'] ?? '')) === '' && trim((string)($row['bio'] ?? '')) === '') continue;
            if (trim((string)($row['name'] ?? '')) === '') $e["speakers.$i.name"] = 'Name required.';
        }
    }

    $orgEmail = (string)($d['organizer']['email'] ?? '');
    if ($orgEmail !== '' && filter_var($orgEmail, FILTER_VALIDATE_EMAIL) === false) {
        $e['organizer.email'] = 'Organizer email must be a valid email address.';
    }

    $feeTypes = ['free', 'paid', 'donation'];
    $ft = (string)($d['registration']['fee']['type'] ?? '');
    if ($ft !== '' && !in_array($ft, $feeTypes, true)) {
        $e['registration.fee.type'] = 'Fee type must be one of: ' . implode(', ', $feeTypes);
    }
    $amt = $d['registration']['fee']['amount'] ?? 0;
    if (!is_numeric($amt) || (int)$amt < 0) {
        $e['registration.fee.amount'] = 'Fee amount must be a non-negative integer.';
    }

    foreach (['featured', 'hero'] as $imgKey) {
        $v = (string)($d['images'][$imgKey] ?? '');
        if ($v !== '' && !_is_safe_url($v)) {
            $e["images.$imgKey"] = ucfirst($imgKey) . ' image must be a valid http/https URL.';
        }
    }

    foreach (['whatsapp', 'youtube', 'map'] as $linkKey) {
        $v = (string)($d['links'][$linkKey] ?? '');
        if ($v !== '' && !_is_safe_url($v)) {
            $e["links.$linkKey"] = ucfirst($linkKey) . ' link must be a valid http/https URL.';
        }
    }

    return $e;
}

function _parse_iso_date(string $s): ?int {
    if ($s === '') return null;
    $ts = strtotime($s);
    return $ts === false ? null : $ts;
}
```

- [ ] **Step 3: Run the test**

```powershell
..\.tooling\php\php.exe VEFS-website/tests/test-validate-phase2.php
```
Expected: all green, exit 0.

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/includes/validate.php VEFS-website/tests/test-validate-phase2.php
git commit -m "feat(validate): add validate_event with full schema coverage and tests"
```

---

## Task 3: `validate_training` with tests

**Files:**
- Modify: `VEFS-website/includes/validate.php`
- Modify: `VEFS-website/tests/test-validate-phase2.php`

- [ ] **Step 1: Append failing tests**

Append before `t_done();` in `test-validate-phase2.php`:

```php
function minValidTraining(): array {
    return [
        'title' => 'My Training',
        'slug' => 'my-training',
        'category' => 'farming',
        'status' => 'open',
        'featured' => false,
        'order' => 10,
        'schedule' => [
            'type' => 'daily-immersive',
            'sessions' => [],
            'dailyStructure' => ['morning' => '', 'afternoon' => '', 'evening' => '', 'night' => ''],
            'timezone' => 'Asia/Kolkata',
        ],
        'totalDuration' => ['value' => 1, 'unit' => 'month'],
        'location' => ['type' => 'offline', 'venue' => 'Farm', 'city' => 'Nilakottai', 'state' => 'TN', 'country' => 'India'],
        'audience' => ['students'],
        'targetAudience' => 'Anyone',
        'capacity' => ['total' => 10, 'registered' => 0, 'available' => 10],
        'description' => [
            'brief' => 'Brief',
            'full' => 'Full',
            'objectives' => [],
            'curriculum' => [],
            'outcomes' => [],
            'requirements' => [],
        ],
        'facilitators' => [],
        'registration' => ['required' => true, 'fee' => ['amount' => 0, 'currency' => 'INR', 'type' => 'free'], 'notes' => ''],
        'media' => ['featuredImage' => 'https://res.cloudinary.com/x/a.jpg', 'heroImage' => 'https://res.cloudinary.com/x/b.jpg'],
    ];
}

t('validate_training: minimal valid passes', function () {
    assertEq([], validate_training(minValidTraining()));
});

t('validate_training: missing title fails', function () {
    $d = minValidTraining(); unset($d['title']);
    assertContains('Title is required', validate_training($d)['title'] ?? '');
});

t('validate_training: bad category fails', function () {
    $d = minValidTraining(); $d['category'] = 'rocket-science';
    assertContains('Category must be one of', validate_training($d)['category'] ?? '');
});

t('validate_training: bad totalDuration unit fails', function () {
    $d = minValidTraining(); $d['totalDuration']['unit'] = 'fortnights';
    assertContains('unit must be one of', validate_training($d)['totalDuration.unit'] ?? '');
});

t('validate_training: capacity.total < registered fails', function () {
    $d = minValidTraining();
    $d['capacity'] = ['total' => 5, 'registered' => 6, 'available' => -1];
    assertContains('registered cannot exceed', validate_training($d)['capacity.registered'] ?? '');
});

t('validate_training: curriculum module missing fails', function () {
    $d = minValidTraining();
    $d['description']['curriculum'] = [['module' => '', 'topics' => ['t1']]];
    assertContains('Module name required', validate_training($d)['description.curriculum.0.module'] ?? '');
});

t('validate_training: facilitator missing name fails', function () {
    $d = minValidTraining();
    $d['facilitators'] = [['name' => '', 'title' => 'Trainer', 'bio' => 'Bio']];
    assertContains('Name required', validate_training($d)['facilitators.0.name'] ?? '');
});

t('validate_training: brief > 500 chars fails', function () {
    $d = minValidTraining(); $d['description']['brief'] = str_repeat('x', 501);
    assertContains('≤ 500', validate_training($d)['description.brief'] ?? '');
});
```

Run, expect fails.

- [ ] **Step 2: Implement `validate_training`**

Append to `validate.php`:

```php
function validate_training(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be ≤ 200 characters.';

    if (isset($d['slug']) && $d['slug'] !== '' && !preg_match('/^[a-z0-9-]+$/', (string)$d['slug'])) {
        $e['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    $cats = ['farming', 'conservation', 'skills-development', 'livelihood', 'other'];
    if (!in_array((string)($d['category'] ?? ''), $cats, true)) {
        $e['category'] = 'Category must be one of: ' . implode(', ', $cats);
    }

    $statuses = ['open', 'full', 'upcoming', 'completed', 'cancelled'];
    if (!in_array((string)($d['status'] ?? ''), $statuses, true)) {
        $e['status'] = 'Status must be one of: ' . implode(', ', $statuses);
    }

    if (!isset($d['order']) || (!is_int($d['order']) && !ctype_digit((string)$d['order'])) || (int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    $schedTypes = ['daily-immersive', 'weekend-sessions', 'online', 'hybrid'];
    if (!in_array((string)($d['schedule']['type'] ?? ''), $schedTypes, true)) {
        $e['schedule.type'] = 'Schedule type must be one of: ' . implode(', ', $schedTypes);
    }

    $durUnits = ['days', 'weeks', 'months'];
    if (!in_array((string)($d['totalDuration']['unit'] ?? ''), $durUnits, true)) {
        $e['totalDuration.unit'] = 'Total duration unit must be one of: ' . implode(', ', $durUnits);
    }
    $dv = $d['totalDuration']['value'] ?? null;
    if (!is_numeric($dv) || (int)$dv < 0) {
        $e['totalDuration.value'] = 'Total duration value must be a non-negative integer.';
    }

    $locTypes = ['offline', 'online', 'hybrid'];
    if (!in_array((string)($d['location']['type'] ?? ''), $locTypes, true)) {
        $e['location.type'] = 'Location type must be one of: ' . implode(', ', $locTypes);
    }

    $cap = $d['capacity'] ?? null;
    if (is_array($cap)) {
        $total = $cap['total'] ?? null;
        $reg   = $cap['registered'] ?? null;
        if (!is_numeric($total) || (int)$total < 0) $e['capacity.total'] = 'Capacity total must be a non-negative integer.';
        if (!is_numeric($reg)   || (int)$reg < 0)   $e['capacity.registered'] = 'Capacity registered must be a non-negative integer.';
        if (is_numeric($total) && is_numeric($reg) && (int)$reg > (int)$total) {
            $e['capacity.registered'] = 'Capacity registered cannot exceed total.';
        }
    }

    foreach (['brief', 'full'] as $f) {
        $v = trim((string)($d['description'][$f] ?? ''));
        if ($v === '') $e["description.$f"] = ucfirst($f) . ' description is required.';
    }
    if (mb_strlen((string)($d['description']['brief'] ?? '')) > 500) {
        $e['description.brief'] = 'Brief description must be ≤ 500 characters.';
    }

    if (isset($d['description']['curriculum']) && is_array($d['description']['curriculum'])) {
        foreach ($d['description']['curriculum'] as $i => $row) {
            if (!is_array($row)) continue;
            $module = trim((string)($row['module'] ?? ''));
            $topics = $row['topics'] ?? [];
            if ($module === '' && empty($topics)) continue;
            if ($module === '') $e["description.curriculum.$i.module"] = 'Module name required.';
        }
    }

    if (isset($d['facilitators']) && is_array($d['facilitators'])) {
        foreach ($d['facilitators'] as $i => $row) {
            if (!is_array($row)) continue;
            $name = trim((string)($row['name'] ?? ''));
            $titleF = trim((string)($row['title'] ?? ''));
            $bio = trim((string)($row['bio'] ?? ''));
            if ($name === '' && $titleF === '' && $bio === '') continue;
            if ($name === '') $e["facilitators.$i.name"] = 'Name required.';
        }
    }

    $feeTypes = ['free', 'paid', 'donation'];
    $ft = (string)($d['registration']['fee']['type'] ?? '');
    if ($ft !== '' && !in_array($ft, $feeTypes, true)) {
        $e['registration.fee.type'] = 'Fee type must be one of: ' . implode(', ', $feeTypes);
    }
    $amt = $d['registration']['fee']['amount'] ?? 0;
    if (!is_numeric($amt) || (int)$amt < 0) {
        $e['registration.fee.amount'] = 'Fee amount must be a non-negative integer.';
    }

    foreach (['featuredImage', 'heroImage'] as $imgKey) {
        $v = (string)($d['media'][$imgKey] ?? '');
        if ($v !== '' && !_is_safe_url($v)) {
            $e["media.$imgKey"] = ucfirst($imgKey) . ' must be a valid http/https URL.';
        }
    }

    return $e;
}
```

- [ ] **Step 3: Run tests, verify green, commit**

```powershell
..\.tooling\php\php.exe VEFS-website/tests/test-validate-phase2.php
```

```bash
git add VEFS-website/includes/validate.php VEFS-website/tests/test-validate-phase2.php
git commit -m "feat(validate): add validate_training with full schema coverage and tests"
```

---

## Task 4: `validate_volunteer` with tests

**Files:**
- Modify: `VEFS-website/includes/validate.php`
- Modify: `VEFS-website/tests/test-validate-phase2.php`

- [ ] **Step 1: Append failing tests**

Append before `t_done();`:

```php
function minValidVolunteer(): array {
    return [
        'title' => 'Farm Helper',
        'slug' => 'farm-helper',
        'order' => 10,
        'status' => 'open',
        'description' => ['brief' => 'Brief', 'full' => 'Full'],
        'dates' => ['start' => 'TBD', 'end' => 'TBD'],
        'duration' => ['value' => 3, 'unit' => 'months'],
        'commitment' => 'Full-time',
        'requirements' => [
            'age' => ['min' => 18, 'max' => 60],
            'skills' => [],
            'physical' => '',
            'education' => '',
        ],
        'benefits' => [
            'learning' => [],
            'certificate' => true,
            'meals' => true,
            'accommodation' => true,
            'stipend' => ['provided' => false, 'amount' => 0],
        ],
        'relatedEvents' => [],
        'location' => ['type' => 'on-site', 'city' => 'Nilakottai', 'state' => 'TN'],
        'spots' => ['total' => 4, 'filled' => 1, 'available' => 3],
        'contact' => ['name' => 'A', 'email' => 'a@b.com', 'phone' => '+91 1234567890'],
        'media' => ['featuredImage' => 'https://res.cloudinary.com/x/a.jpg'],
    ];
}

t('validate_volunteer: minimal valid passes', function () {
    assertEq([], validate_volunteer(minValidVolunteer()));
});

t('validate_volunteer: missing title fails', function () {
    $d = minValidVolunteer(); unset($d['title']);
    assertContains('Title is required', validate_volunteer($d)['title'] ?? '');
});

t('validate_volunteer: bad duration unit fails', function () {
    $d = minValidVolunteer(); $d['duration']['unit'] = 'centuries';
    assertContains('unit must be one of', validate_volunteer($d)['duration.unit'] ?? '');
});

t('validate_volunteer: age min > max fails', function () {
    $d = minValidVolunteer();
    $d['requirements']['age'] = ['min' => 50, 'max' => 30];
    assertContains('min age cannot exceed', validate_volunteer($d)['requirements.age'] ?? '');
});

t('validate_volunteer: stipend.amount negative fails', function () {
    $d = minValidVolunteer();
    $d['benefits']['stipend'] = ['provided' => true, 'amount' => -100];
    assertContains('non-negative', validate_volunteer($d)['benefits.stipend.amount'] ?? '');
});

t('validate_volunteer: spots.filled > total fails', function () {
    $d = minValidVolunteer();
    $d['spots'] = ['total' => 3, 'filled' => 5, 'available' => 0];
    assertContains('filled cannot exceed', validate_volunteer($d)['spots.filled'] ?? '');
});

t('validate_volunteer: contact email bad fails', function () {
    $d = minValidVolunteer(); $d['contact']['email'] = 'not-an-email';
    assertContains('valid email', validate_volunteer($d)['contact.email'] ?? '');
});

t('validate_volunteer: bad location.type fails', function () {
    $d = minValidVolunteer(); $d['location']['type'] = 'mars';
    assertContains('Location type must be one of', validate_volunteer($d)['location.type'] ?? '');
});
```

Run, expect fails.

- [ ] **Step 2: Implement `validate_volunteer`**

Append to `validate.php`:

```php
function validate_volunteer(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be ≤ 200 characters.';

    if (isset($d['slug']) && $d['slug'] !== '' && !preg_match('/^[a-z0-9-]+$/', (string)$d['slug'])) {
        $e['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    if (!isset($d['order']) || (!is_int($d['order']) && !ctype_digit((string)$d['order'])) || (int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    $statuses = ['open', 'full', 'closed'];
    if (!in_array((string)($d['status'] ?? ''), $statuses, true)) {
        $e['status'] = 'Status must be one of: ' . implode(', ', $statuses);
    }

    foreach (['brief', 'full'] as $f) {
        if (trim((string)($d['description'][$f] ?? '')) === '') {
            $e["description.$f"] = ucfirst($f) . ' description is required.';
        }
    }
    if (mb_strlen((string)($d['description']['brief'] ?? '')) > 500) {
        $e['description.brief'] = 'Brief description must be ≤ 500 characters.';
    }

    // Dates: "TBD" or ISO 8601
    foreach (['start', 'end'] as $df) {
        $v = (string)($d['dates'][$df] ?? '');
        if ($v !== '' && $v !== 'TBD' && _parse_iso_date($v) === null) {
            $e["dates.$df"] = ucfirst($df) . ' date must be "TBD" or a valid ISO 8601 date.';
        }
    }

    $durUnits = ['days', 'weeks', 'months', 'years'];
    if (!in_array((string)($d['duration']['unit'] ?? ''), $durUnits, true)) {
        $e['duration.unit'] = 'Duration unit must be one of: ' . implode(', ', $durUnits);
    }
    $dv = $d['duration']['value'] ?? null;
    if (!is_numeric($dv) || (int)$dv < 0) {
        $e['duration.value'] = 'Duration value must be a non-negative integer.';
    }

    $age = $d['requirements']['age'] ?? null;
    if (is_array($age)) {
        $min = $age['min']; $max = $age['max'];
        if ($min !== null && (!is_numeric($min) || (int)$min < 0)) $e['requirements.age.min'] = 'Min age must be a non-negative integer or null.';
        if ($max !== null && (!is_numeric($max) || (int)$max < 0)) $e['requirements.age.max'] = 'Max age must be a non-negative integer or null.';
        if (is_numeric($min) && is_numeric($max) && (int)$min > (int)$max) {
            $e['requirements.age'] = 'Requirements: min age cannot exceed max age.';
        }
    }

    $stipend = $d['benefits']['stipend'] ?? null;
    if (is_array($stipend)) {
        $amt = $stipend['amount'] ?? 0;
        if (!is_numeric($amt) || (int)$amt < 0) {
            $e['benefits.stipend.amount'] = 'Stipend amount must be a non-negative integer.';
        }
    }

    $locTypes = ['on-site', 'remote', 'hybrid'];
    if (!in_array((string)($d['location']['type'] ?? ''), $locTypes, true)) {
        $e['location.type'] = 'Location type must be one of: ' . implode(', ', $locTypes);
    }

    $spots = $d['spots'] ?? null;
    if (is_array($spots)) {
        $total = $spots['total'] ?? null;
        $filled = $spots['filled'] ?? null;
        if (!is_numeric($total)  || (int)$total < 0)  $e['spots.total']  = 'Spots total must be a non-negative integer.';
        if (!is_numeric($filled) || (int)$filled < 0) $e['spots.filled'] = 'Spots filled must be a non-negative integer.';
        if (is_numeric($total) && is_numeric($filled) && (int)$filled > (int)$total) {
            $e['spots.filled'] = 'Spots filled cannot exceed total.';
        }
    }

    $email = (string)($d['contact']['email'] ?? '');
    if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $e['contact.email'] = 'Contact email must be a valid email address.';
    }

    $mi = (string)($d['media']['featuredImage'] ?? '');
    if ($mi !== '' && !_is_safe_url($mi) && !preg_match('#^/#', $mi)) {
        // Allow both absolute URLs and root-relative paths (legacy entries)
        $e['media.featuredImage'] = 'Featured image must be a valid http/https URL or root-relative path.';
    }

    return $e;
}
```

- [ ] **Step 3: Run tests, verify green, commit**

```bash
git add VEFS-website/includes/validate.php VEFS-website/tests/test-validate-phase2.php
git commit -m "feat(validate): add validate_volunteer with full schema coverage and tests"
```

---

## Task 5: Extend `save.php` for the three new types

**Files:**
- Modify: `VEFS-website/admin/api/save.php`

- [ ] **Step 1: Require helpers + extend type whitelist**

In `save.php`, after the existing `require` lines, add:
```php
require __DIR__ . '/../../includes/admin-helpers.php';
```

Change the type whitelist line:
```php
if (!in_array($type, ['blog', 'social'], true)) json_fail(400, 'Invalid type');
```
to:
```php
if (!in_array($type, ['blog', 'social', 'event', 'training', 'volunteer'], true)) json_fail(400, 'Invalid type');
```

- [ ] **Step 2: Generalize the existing/posts lookup**

Replace:
```php
$dataDir = __DIR__ . '/../../data';
$file = $dataDir . '/' . $type . '.json';
$backupDir = $dataDir . '/backups';

$existing = json_store_read($file);
$posts = $existing['posts'] ?? [];
```

with:
```php
$dataDir = __DIR__ . '/../../data';
$file = admin_data_file($type);
$backupDir = $dataDir . '/backups';
$arrayKey = admin_array_key_for_type($type);

$existing = json_store_read($file);
$items = $existing[$arrayKey] ?? [];
```

And replace ALL remaining occurrences of `$posts` with `$items` in this file (there are several inside the existing blog/social branches and `_upsert` calls).

Replace the write-back lines:
```php
$existing['posts'] = $posts;
$existing['metadata']['lastUpdated'] = $nowIso;
$existing['metadata']['total'] = count($posts);
```

with:
```php
$existing[$arrayKey] = $items;
$existing['metadata']['lastUpdated'] = $nowIso;
$existing['metadata']['total'] = count($items);
```

- [ ] **Step 3: Add the three new branches**

After the `elseif ($type === 'social')` block, before `$existing[$arrayKey] = $items;`, insert:

```php
elseif ($type === 'event') {
    $errs = validate_event($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    if ($originalId === null) {
        $data['id'] = admin_next_id('evt', $items);
    } else {
        $data['id'] = $originalId;
    }

    $slug = trim((string)($data['slug'] ?? ''));
    if ($slug === '') $slug = _slugify((string)($data['title'] ?? ''));
    $selfIdx = _findIndex($items, $originalId);
    $selfSlug = $selfIdx === null ? null : ($items[$selfIdx]['slug'] ?? null);
    foreach ($items as $p) {
        if (($p['slug'] ?? null) === $slug && $slug !== $selfSlug) {
            json_fail(409, 'An event with this slug already exists', ['field' => 'slug']);
        }
    }
    $data['slug'] = $slug;

    // Sanitize descriptions (plain text — strip any HTML to be safe)
    $data['shortDescription'] = strip_tags((string)$data['shortDescription']);
    $data['fullDescription']  = strip_tags((string)$data['fullDescription']);

    // Drop empty agenda/speaker rows
    $data['agenda'] = array_values(array_filter(
        $data['agenda'] ?? [],
        fn($r) => is_array($r) && (trim((string)($r['time'] ?? '')) !== '' || trim((string)($r['title'] ?? '')) !== '')
    ));
    $data['speakers'] = array_values(array_filter(
        $data['speakers'] ?? [],
        fn($r) => is_array($r) && trim((string)($r['name'] ?? '')) !== ''
    ));

    $items = _upsert($items, $data, $originalId);
}
elseif ($type === 'training') {
    $errs = validate_training($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    if ($originalId === null) {
        $data['id'] = admin_next_id('trn', $items);
    } else {
        $data['id'] = $originalId;
    }

    $slug = trim((string)($data['slug'] ?? ''));
    if ($slug === '') $slug = _slugify((string)($data['title'] ?? ''));
    $data['slug'] = $slug;

    // Server-calculate available
    if (isset($data['capacity']) && is_array($data['capacity'])) {
        $t = (int)($data['capacity']['total'] ?? 0);
        $r = (int)($data['capacity']['registered'] ?? 0);
        $data['capacity']['available'] = max(0, $t - $r);
    }

    // Sanitize description strings (plain text)
    foreach (['brief', 'full'] as $f) {
        $data['description'][$f] = strip_tags((string)($data['description'][$f] ?? ''));
    }

    // Drop empty curriculum rows
    if (isset($data['description']['curriculum']) && is_array($data['description']['curriculum'])) {
        $data['description']['curriculum'] = array_values(array_filter(
            $data['description']['curriculum'],
            fn($r) => is_array($r) && trim((string)($r['module'] ?? '')) !== ''
        ));
    }

    // Drop empty facilitator rows
    $data['facilitators'] = array_values(array_filter(
        $data['facilitators'] ?? [],
        fn($r) => is_array($r) && trim((string)($r['name'] ?? '')) !== ''
    ));

    $items = _upsert($items, $data, $originalId);
}
elseif ($type === 'volunteer') {
    $errs = validate_volunteer($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    if ($originalId === null) {
        $data['id'] = admin_next_id('vol', $items);
    } else {
        $data['id'] = $originalId;
    }

    $slug = trim((string)($data['slug'] ?? ''));
    if ($slug === '') $slug = _slugify((string)($data['title'] ?? ''));
    $data['slug'] = $slug;

    // Server-calculate spots.available
    if (isset($data['spots']) && is_array($data['spots'])) {
        $t = (int)($data['spots']['total'] ?? 0);
        $f = (int)($data['spots']['filled'] ?? 0);
        $data['spots']['available'] = max(0, $t - $f);
    }

    foreach (['brief', 'full'] as $f) {
        $data['description'][$f] = strip_tags((string)($data['description'][$f] ?? ''));
    }

    $items = _upsert($items, $data, $originalId);
}
```

- [ ] **Step 4: Add the `_findIndex` helper**

Append below the existing `_slugify` function:

```php
function _findIndex(array $items, ?string $id): ?int {
    if ($id === null) return null;
    foreach ($items as $i => $p) {
        if (($p['id'] ?? null) === $id) return $i;
    }
    return null;
}
```

- [ ] **Step 5: Manual smoke test (no automated test — endpoint is covered by E2E in Task 11)**

```powershell
..\.tooling\php\php.exe -l VEFS-website/admin/api/save.php
```
Expected: `No syntax errors detected`.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/admin/api/save.php
git commit -m "feat(admin): extend save endpoint to handle event/training/volunteer types"
```

---

## Task 6: Extend `delete.php` and `reorder.php`

**Files:**
- Modify: `VEFS-website/admin/api/delete.php`
- Modify: `VEFS-website/admin/api/reorder.php`

- [ ] **Step 1: Update `delete.php`**

Add `require __DIR__ . '/../../includes/admin-helpers.php';` after the existing requires.

Change the type whitelist:
```php
if (!in_array($type, ['blog', 'social'], true)) { ... }
```
to:
```php
if (!in_array($type, ['blog', 'social', 'event', 'training', 'volunteer'], true)) {
```

Replace:
```php
$file = $dataDir . '/' . $type . '.json';
$data = json_store_read($file);
$before = count($data['posts'] ?? []);
$data['posts'] = array_values(array_filter($data['posts'] ?? [], fn($p) => ($p['id'] ?? null) !== $id));
$data['metadata']['lastUpdated'] = date('c');
$data['metadata']['total'] = count($data['posts']);
```
with:
```php
$file = admin_data_file($type);
$arrayKey = admin_array_key_for_type($type);
$data = json_store_read($file);
$before = count($data[$arrayKey] ?? []);
$data[$arrayKey] = array_values(array_filter($data[$arrayKey] ?? [], fn($p) => ($p['id'] ?? null) !== $id));
$data['metadata']['lastUpdated'] = date('c');
$data['metadata']['total'] = count($data[$arrayKey]);
```

And change the audit log line to compute removed correctly:
```php
echo json_encode(['success' => true, 'removed' => $before - count($data[$arrayKey])]);
```

- [ ] **Step 2: Update `reorder.php`**

Add the same `require` line.

Change the type whitelist the same way.

Replace:
```php
$file = $dataDir . '/' . $type . '.json';
$data = json_store_read($file);
$posts =& $data['posts'];
```
with:
```php
$file = admin_data_file($type);
$arrayKey = admin_array_key_for_type($type);
$data = json_store_read($file);
$posts =& $data[$arrayKey];
```

(Keep the local variable name `$posts` inside the rest of the function — the function works on a reference to the array regardless of its top-level key.)

- [ ] **Step 3: Syntax check**

```powershell
..\.tooling\php\php.exe -l VEFS-website/admin/api/delete.php
..\.tooling\php\php.exe -l VEFS-website/admin/api/reorder.php
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/admin/api/delete.php VEFS-website/admin/api/reorder.php
git commit -m "feat(admin): extend delete/reorder endpoints to handle event/training/volunteer types"
```

---

## Task 7: Extend `dashboard.php` with three new tabs

**Files:**
- Modify: `VEFS-website/admin/dashboard.php`

- [ ] **Step 1: Replace the file**

Overwrite `dashboard.php` with:

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';
require __DIR__ . '/../includes/admin-helpers.php';

auth_require();

$tab = $_GET['tab'] ?? 'blog';
if (!in_array($tab, ['blog', 'social', 'event', 'training', 'volunteer'], true)) {
    $tab = 'blog';
}

$file = admin_data_file($tab);
$arrayKey = admin_array_key_for_type($tab);
$data = json_store_read($file);
$items = $data[$arrayKey] ?? [];
usort($items, fn($a, $b) => ($a['order'] ?? PHP_INT_MAX) <=> ($b['order'] ?? PHP_INT_MAX));
$csrf = csrf_token();
$cfg = auth_config();

$tabLabels = [
    'blog'      => 'Blog Posts',
    'social'    => 'Social Posts',
    'event'     => 'Events',
    'training'  => 'Trainings',
    'volunteer' => 'Volunteers',
];
$titleColLabel = $tab === 'social' ? 'Caption' : 'Title';
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — Dashboard</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1>VEFS Admin</h1>
        <a class="btn btn-ghost" href="/admin/logout.php">Sign out</a>
    </header>
    <nav class="admin-tabs">
        <?php foreach ($tabLabels as $key => $label): ?>
            <a href="?tab=<?= $key ?>" class="<?= $tab === $key ? 'active' : '' ?>"><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8') ?></a>
        <?php endforeach; ?>
    </nav>

    <div style="margin-bottom:1rem;">
        <a class="btn btn-primary" href="/admin/form-<?= $tab ?>.php">+ New <?= htmlspecialchars(rtrim($tabLabels[$tab], 's'), ENT_QUOTES, 'UTF-8') ?></a>
    </div>

    <table class="admin-table" data-csrf="<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>" data-type="<?= $tab ?>">
        <thead>
        <tr>
            <th style="width:80px">Image</th>
            <th><?= $titleColLabel ?></th>
            <th style="width:100px">Status</th>
            <th style="width:90px">Order</th>
            <th style="width:60px"></th>
            <th style="width:160px">Actions</th>
        </tr>
        </thead>
        <tbody>
        <?php if (empty($items)): ?>
            <tr><td colspan="6" style="text-align:center;color:#888;padding:2rem">No items yet.</td></tr>
        <?php else: foreach ($items as $i => $p): ?>
            <tr data-id="<?= htmlspecialchars((string)$p['id'], ENT_QUOTES, 'UTF-8') ?>">
                <td>
                    <?php $img = admin_display_thumb($tab, $p); ?>
                    <?php if ($img): ?><img src="<?= htmlspecialchars($img, ENT_QUOTES, 'UTF-8') ?>" alt=""><?php endif; ?>
                </td>
                <td><?= htmlspecialchars(admin_display_title($tab, $p), ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars((string)($p['status'] ?? '—'), ENT_QUOTES, 'UTF-8') ?></td>
                <td><input type="number" class="order-input" value="<?= (int)($p['order'] ?? 0) ?>" min="0"></td>
                <td>
                    <button class="btn btn-ghost arrow-up" title="Move up" <?= $i===0?'disabled':'' ?>>&#9650;</button>
                    <button class="btn btn-ghost arrow-down" title="Move down" <?= $i===count($items)-1?'disabled':'' ?>>&#9660;</button>
                </td>
                <td>
                    <a class="btn btn-ghost" href="/admin/form-<?= $tab ?>.php?id=<?= urlencode((string)$p['id']) ?>">Edit</a>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </td>
            </tr>
        <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>
<script>
window.VEFS_CONFIG = {
    cloudinary: {
        cloud_name: <?= json_encode($cfg['cloudinary']['cloud_name']) ?>,
        upload_preset: <?= json_encode($cfg['cloudinary']['upload_preset']) ?>,
    }
};
</script>
<script src="/admin/assets/admin.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Start server (already running), open `http://localhost:8000/admin/dashboard.php` → see five tabs. Click each — empty placeholder for new types, blog/social rows still render. Existing reorder arrows + delete still work for blog/social.

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/admin/dashboard.php
git commit -m "feat(admin): add Events/Trainings/Volunteers tabs to dashboard"
```

---

## Task 8: Add reusable `repeatableRows` helper to `admin.js`

**Files:**
- Modify: `VEFS-website/admin/assets/admin.js`

- [ ] **Step 1: Append the helper**

In `admin.js`, before the `window.VEFS = { ... }` export at the bottom, add:

```js
/**
 * Manages a list of repeatable rows of inputs.
 *
 * @param {HTMLElement} container - DOM element to append rows to.
 * @param {Array<{name:string, placeholder:string, type?:string}>} fields - Field definitions.
 * @param {Array<Object>} initial - Initial values; one object per row, keyed by field name.
 * @param {HTMLElement} addBtn - Button that triggers adding a new empty row.
 * @returns {{ readAll: () => Array<Object>, addRow: (vals?: Object) => void }}
 */
function repeatableRows(container, fields, initial, addBtn) {
    function addRow(vals = {}) {
        const row = document.createElement('div');
        row.className = 'repeat-row';
        fields.forEach(f => {
            const input = document.createElement(f.type === 'textarea' ? 'textarea' : 'input');
            if (f.type && f.type !== 'textarea') input.type = f.type;
            input.placeholder = f.placeholder;
            input.dataset.field = f.name;
            input.value = vals[f.name] || '';
            row.appendChild(input);
        });
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn btn-ghost';
        rm.textContent = '×';
        rm.title = 'Remove row';
        rm.addEventListener('click', () => row.remove());
        row.appendChild(rm);
        container.appendChild(row);
    }
    (initial || []).forEach(addRow);
    if (addBtn) addBtn.addEventListener('click', () => addRow());
    function readAll() {
        return Array.from(container.querySelectorAll('.repeat-row')).map(row => {
            const obj = {};
            row.querySelectorAll('[data-field]').forEach(el => {
                obj[el.dataset.field] = el.value;
            });
            return obj;
        });
    }
    return { readAll, addRow };
}
```

Update the export at the bottom:
```js
window.VEFS = { uploadToCloudinary, wireImagePicker, postJSON, toast, repeatableRows };
```

- [ ] **Step 2: Syntax check by loading in browser**

Reload any admin page. Open DevTools console, type:
```js
typeof window.VEFS.repeatableRows
```
Expected: `"function"`.

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/admin/assets/admin.js
git commit -m "feat(admin): add reusable repeatableRows helper for form pages"
```

---

## Task 9: Build `form-event.php` + `form-event.js`

**Files:**
- Create: `VEFS-website/admin/form-event.php`
- Create: `VEFS-website/admin/assets/form-event.js`

- [ ] **Step 1: Create `form-event.php`**

Write this complete file:

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';
require __DIR__ . '/../includes/admin-helpers.php';

auth_require();
$cfg = auth_config();
$id = $_GET['id'] ?? null;

$default = [
    'id' => '', 'slug' => '', 'title' => '', 'type' => 'market', 'status' => 'upcoming',
    'featured' => false, 'order' => 10,
    'recurring' => ['isRecurring' => false, 'frequency' => '', 'pattern' => '', 'label' => ''],
    'date' => ['start' => '', 'end' => '', 'timezone' => 'Asia/Kolkata'],
    'duration' => ['value' => 0, 'unit' => 'hours'],
    'location' => ['type' => 'in-person', 'venue' => '', 'address' => '', 'city' => '', 'state' => '', 'mapUrl' => ''],
    'shortDescription' => '', 'fullDescription' => '',
    'agenda' => [], 'speakers' => [],
    'organizer' => ['name' => '', 'email' => '', 'phone' => ''],
    'registration' => ['required' => false, 'fee' => ['amount' => 0, 'currency' => 'INR', 'type' => 'free']],
    'capacity' => '',
    'requirements' => ['age' => ['min' => '', 'max' => ''], 'whatToBring' => []],
    'links' => ['whatsapp' => '', 'youtube' => '', 'map' => ''],
    'images' => ['featured' => '', 'hero' => ''],
    'tags' => [],
];
$post = $default;
$data = json_store_read(admin_data_file('event'));
if ($id) {
    foreach ($data['events'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) {
            // Merge with defaults so missing keys don't crash the template
            $post = array_replace_recursive($default, $p);
            break;
        }
    }
} else {
    $maxOrder = 0;
    foreach ($data['events'] ?? [] as $p) $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
    $post['order'] = $maxOrder + 10;
}

$token = csrf_token();
$isEdit = $id !== null;
$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Event</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Event</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=event">&larr; Back</a>
    </header>
    <form id="event-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= $h($token) ?>">
        <input type="hidden" name="original_id" value="<?= $h($post['id']) ?>">

        <fieldset><legend>Basics</legend>
            <label>Title *<input id="title" name="title" type="text" required maxlength="200" value="<?= $h($post['title']) ?>"></label>
            <label>Slug (auto from title if blank)<input id="slug" name="slug" type="text" value="<?= $h($post['slug']) ?>"></label>
            <label>Type *
                <select id="type" name="type">
                    <?php foreach (['market','workshop','conference','meetup','celebration','other'] as $t): ?>
                        <option value="<?= $t ?>" <?= $post['type']===$t?'selected':'' ?>><?= ucfirst($t) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Status *
                <select id="status" name="status">
                    <?php foreach (['upcoming','completed','cancelled'] as $s): ?>
                        <option value="<?= $s ?>" <?= $post['status']===$s?'selected':'' ?>><?= ucfirst($s) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Order<input id="order" name="order" type="number" min="0" value="<?= (int)$post['order'] ?>"></label>
            <label class="checkbox"><input id="featured" name="featured" type="checkbox" <?= $post['featured']?'checked':'' ?>> Featured</label>
        </fieldset>

        <fieldset><legend>Recurring</legend>
            <label class="checkbox"><input id="recurring-isRecurring" type="checkbox" <?= $post['recurring']['isRecurring']?'checked':'' ?>> Is recurring</label>
            <label>Frequency
                <select id="recurring-frequency">
                    <?php foreach (['','weekly','monthly','yearly'] as $f): ?>
                        <option value="<?= $f ?>" <?= $post['recurring']['frequency']===$f?'selected':'' ?>><?= $f?:'(none)' ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Pattern (e.g. "2nd-sunday")<input id="recurring-pattern" type="text" value="<?= $h($post['recurring']['pattern']) ?>"></label>
            <label>Label (display text)<input id="recurring-label" type="text" value="<?= $h($post['recurring']['label']) ?>"></label>
        </fieldset>

        <fieldset><legend>Date & duration</legend>
            <label>Start (ISO 8601) *<input id="date-start" type="text" required value="<?= $h($post['date']['start']) ?>" placeholder="2026-06-01T09:00:00+05:30"></label>
            <label>End (ISO 8601) *<input id="date-end" type="text" required value="<?= $h($post['date']['end']) ?>" placeholder="2026-06-01T18:00:00+05:30"></label>
            <label>Timezone<input id="date-timezone" type="text" value="<?= $h($post['date']['timezone']) ?>"></label>
            <label>Duration value<input id="duration-value" type="number" min="0" value="<?= (int)$post['duration']['value'] ?>"></label>
            <label>Duration unit
                <select id="duration-unit">
                    <?php foreach (['minutes','hours','days'] as $u): ?>
                        <option value="<?= $u ?>" <?= $post['duration']['unit']===$u?'selected':'' ?>><?= $u ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
        </fieldset>

        <fieldset><legend>Location</legend>
            <label>Type
                <select id="location-type">
                    <?php foreach (['in-person','online','hybrid'] as $l): ?>
                        <option value="<?= $l ?>" <?= $post['location']['type']===$l?'selected':'' ?>><?= $l ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Venue<input id="location-venue" type="text" value="<?= $h($post['location']['venue']) ?>"></label>
            <label>Address<input id="location-address" type="text" value="<?= $h($post['location']['address']) ?>"></label>
            <label>City<input id="location-city" type="text" value="<?= $h($post['location']['city']) ?>"></label>
            <label>State<input id="location-state" type="text" value="<?= $h($post['location']['state']) ?>"></label>
            <label>Map URL<input id="location-mapUrl" type="url" value="<?= $h($post['location']['mapUrl']) ?>"></label>
        </fieldset>

        <fieldset><legend>Descriptions</legend>
            <label>Short (≤ 500 chars) *<textarea id="shortDescription" rows="3" maxlength="500" required><?= $h($post['shortDescription']) ?></textarea></label>
            <label>Full *<textarea id="fullDescription" rows="10" required><?= $h($post['fullDescription']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Agenda</legend>
            <div id="agenda-rows"></div>
            <button type="button" id="add-agenda" class="btn btn-ghost">+ Add agenda item</button>
        </fieldset>

        <fieldset><legend>Speakers</legend>
            <div id="speakers-rows"></div>
            <button type="button" id="add-speaker" class="btn btn-ghost">+ Add speaker</button>
        </fieldset>

        <fieldset><legend>Organizer</legend>
            <label>Name<input id="organizer-name" type="text" value="<?= $h($post['organizer']['name']) ?>"></label>
            <label>Email<input id="organizer-email" type="email" value="<?= $h($post['organizer']['email']) ?>"></label>
            <label>Phone<input id="organizer-phone" type="text" value="<?= $h($post['organizer']['phone']) ?>"></label>
        </fieldset>

        <fieldset><legend>Registration & capacity</legend>
            <label class="checkbox"><input id="registration-required" type="checkbox" <?= $post['registration']['required']?'checked':'' ?>> Registration required</label>
            <label>Fee amount<input id="fee-amount" type="number" min="0" value="<?= (int)$post['registration']['fee']['amount'] ?>"></label>
            <label>Fee type
                <select id="fee-type">
                    <?php foreach (['free','paid','donation'] as $t): ?>
                        <option value="<?= $t ?>" <?= $post['registration']['fee']['type']===$t?'selected':'' ?>><?= $t ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Capacity (blank for unlimited)<input id="capacity" type="number" min="0" value="<?= $post['capacity']===null||$post['capacity']===''?'':(int)$post['capacity'] ?>"></label>
        </fieldset>

        <fieldset><legend>Requirements</legend>
            <label>Min age (blank = no min)<input id="age-min" type="number" min="0" value="<?= $post['requirements']['age']['min']===null||$post['requirements']['age']['min']===''?'':(int)$post['requirements']['age']['min'] ?>"></label>
            <label>Max age (blank = no max)<input id="age-max" type="number" min="0" value="<?= $post['requirements']['age']['max']===null||$post['requirements']['age']['max']===''?'':(int)$post['requirements']['age']['max'] ?>"></label>
            <label>What to bring (one per line)<textarea id="whatToBring" rows="4"><?= $h(implode("\n", $post['requirements']['whatToBring'])) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Links</legend>
            <label>WhatsApp URL<input id="link-whatsapp" type="url" value="<?= $h($post['links']['whatsapp']) ?>"></label>
            <label>YouTube URL<input id="link-youtube" type="url" value="<?= $h($post['links']['youtube']) ?>"></label>
            <label>Map URL<input id="link-map" type="url" value="<?= $h($post['links']['map']) ?>"></label>
        </fieldset>

        <fieldset><legend>Images (uploaded to Cloudinary)</legend>
            <label>Featured image
                <input type="file" id="featured-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="featured-url" value="<?= $h($post['images']['featured']) ?>">
                <div class="upload-status" id="featured-status"></div>
                <img id="featured-preview" src="<?= $h($post['images']['featured']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['images']['featured']?'':'display:none' ?>">
            </label>
            <label>Hero image
                <input type="file" id="hero-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="hero-url" value="<?= $h($post['images']['hero']) ?>">
                <div class="upload-status" id="hero-status"></div>
                <img id="hero-preview" src="<?= $h($post['images']['hero']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['images']['hero']?'':'display:none' ?>">
            </label>
        </fieldset>

        <fieldset><legend>Tags (comma-separated)</legend>
            <input id="tags" type="text" value="<?= $h(implode(', ', $post['tags'])) ?>">
        </fieldset>

        <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=event">Cancel</a>
        </div>
    </form>
</div>
<script>
window.VEFS_CONFIG = {
    cloudinary: {
        cloud_name: <?= json_encode($cfg['cloudinary']['cloud_name']) ?>,
        upload_preset: <?= json_encode($cfg['cloudinary']['upload_preset']) ?>,
    }
};
window.VEFS_INITIAL = {
    agenda: <?= json_encode($post['agenda']) ?>,
    speakers: <?= json_encode($post['speakers']) ?>,
};
</script>
<script src="/admin/assets/admin.js"></script>
<script src="/admin/assets/form-event.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `form-event.js`**

```js
(function() {
    const { wireImagePicker, postJSON, toast, repeatableRows } = window.VEFS;

    wireImagePicker(
        document.getElementById('featured-picker'),
        document.getElementById('featured-url'),
        document.getElementById('featured-preview'),
        document.getElementById('featured-status'),
    );
    wireImagePicker(
        document.getElementById('hero-picker'),
        document.getElementById('hero-url'),
        document.getElementById('hero-preview'),
        document.getElementById('hero-status'),
    );

    const agenda = repeatableRows(
        document.getElementById('agenda-rows'),
        [
            { name: 'time',  placeholder: 'Time (e.g. 9:00 AM)' },
            { name: 'title', placeholder: 'Title' },
            { name: 'description', placeholder: 'Description', type: 'textarea' },
        ],
        window.VEFS_INITIAL.agenda,
        document.getElementById('add-agenda'),
    );

    const speakers = repeatableRows(
        document.getElementById('speakers-rows'),
        [
            { name: 'name',  placeholder: 'Name' },
            { name: 'title', placeholder: 'Title' },
            { name: 'bio',   placeholder: 'Bio',   type: 'textarea' },
        ],
        window.VEFS_INITIAL.speakers,
        document.getElementById('add-speaker'),
    );

    function intOrNull(v) {
        const s = String(v).trim();
        if (s === '') return null;
        return parseInt(s, 10);
    }
    function splitLines(s) {
        return String(s).split(/\r?\n/).map(l => l.trim()).filter(l => l);
    }
    function splitCsv(s) {
        return String(s).split(',').map(l => l.trim()).filter(l => l);
    }

    document.getElementById('event-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const capRaw = document.getElementById('capacity').value.trim();
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'event',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                slug: document.getElementById('slug').value,
                title: document.getElementById('title').value,
                type: document.getElementById('type').value,
                status: document.getElementById('status').value,
                featured: document.getElementById('featured').checked,
                order: parseInt(document.getElementById('order').value, 10) || 0,
                recurring: {
                    isRecurring: document.getElementById('recurring-isRecurring').checked,
                    frequency:   document.getElementById('recurring-frequency').value,
                    pattern:     document.getElementById('recurring-pattern').value,
                    label:       document.getElementById('recurring-label').value,
                },
                date: {
                    start:    document.getElementById('date-start').value,
                    end:      document.getElementById('date-end').value,
                    timezone: document.getElementById('date-timezone').value,
                },
                duration: {
                    value: parseInt(document.getElementById('duration-value').value, 10) || 0,
                    unit:  document.getElementById('duration-unit').value,
                },
                location: {
                    type:    document.getElementById('location-type').value,
                    venue:   document.getElementById('location-venue').value,
                    address: document.getElementById('location-address').value,
                    city:    document.getElementById('location-city').value,
                    state:   document.getElementById('location-state').value,
                    mapUrl:  document.getElementById('location-mapUrl').value,
                },
                shortDescription: document.getElementById('shortDescription').value,
                fullDescription:  document.getElementById('fullDescription').value,
                agenda:   agenda.readAll(),
                speakers: speakers.readAll(),
                organizer: {
                    name:  document.getElementById('organizer-name').value,
                    email: document.getElementById('organizer-email').value,
                    phone: document.getElementById('organizer-phone').value,
                },
                registration: {
                    required: document.getElementById('registration-required').checked,
                    fee: {
                        amount:   parseInt(document.getElementById('fee-amount').value, 10) || 0,
                        currency: 'INR',
                        type:     document.getElementById('fee-type').value,
                    },
                },
                capacity: capRaw === '' ? null : parseInt(capRaw, 10),
                requirements: {
                    age: {
                        min: intOrNull(document.getElementById('age-min').value),
                        max: intOrNull(document.getElementById('age-max').value),
                    },
                    whatToBring: splitLines(document.getElementById('whatToBring').value),
                },
                links: {
                    whatsapp: document.getElementById('link-whatsapp').value,
                    youtube:  document.getElementById('link-youtube').value,
                    map:      document.getElementById('link-map').value,
                },
                images: {
                    featured: document.getElementById('featured-url').value,
                    hero:     document.getElementById('hero-url').value,
                },
                tags: splitCsv(document.getElementById('tags').value),
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=event';
        } catch (e) { toast(e.message, true); }
    });
})();
```

- [ ] **Step 3: Manual test — create a new event**

In browser: Dashboard → Events tab → **+ New Event**. Fill title, ISO start/end, descriptions, upload an image. Add one agenda row, one speaker. Save.

Expected: redirect to dashboard, new row visible with order auto-assigned, id like `evt-003`.

- [ ] **Step 4: Edit the event and re-save**

Click Edit. Verify all fields repopulate correctly (especially nested ones — date, location, agenda rows, image preview). Change one field, save. Reopen — verify the change persisted.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/admin/form-event.php VEFS-website/admin/assets/form-event.js
git commit -m "feat(admin): add Events create/edit form with full schema parity"
```

---

## Task 10: Build `form-training.php` + `form-training.js`

**Files:**
- Create: `VEFS-website/admin/form-training.php`
- Create: `VEFS-website/admin/assets/form-training.js`

This form has the most complex widget: `description.curriculum[]` is a list of `{ module, topics[] }` — a list of lists. We handle it by storing topics as a textarea (one per line) inside each curriculum row, which keeps the UI simple.

- [ ] **Step 1: Create `form-training.php`**

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';
require __DIR__ . '/../includes/admin-helpers.php';

auth_require();
$cfg = auth_config();
$id = $_GET['id'] ?? null;

$default = [
    'id' => '', 'slug' => '', 'title' => '', 'category' => 'farming', 'status' => 'open',
    'featured' => false, 'order' => 10,
    'schedule' => [
        'type' => 'daily-immersive', 'sessions' => [],
        'dailyStructure' => ['morning' => '', 'afternoon' => '', 'evening' => '', 'night' => ''],
        'timezone' => 'Asia/Kolkata',
    ],
    'totalDuration' => ['value' => 1, 'unit' => 'months'],
    'location' => ['type' => 'offline', 'venue' => '', 'city' => '', 'state' => '', 'country' => 'India'],
    'audience' => [], 'targetAudience' => '',
    'capacity' => ['total' => 0, 'registered' => 0, 'available' => 0],
    'description' => ['brief' => '', 'full' => '', 'objectives' => [], 'curriculum' => [], 'outcomes' => [], 'requirements' => []],
    'facilitators' => [],
    'registration' => ['required' => true, 'fee' => ['amount' => 0, 'currency' => 'INR', 'type' => 'free'], 'notes' => ''],
    'media' => ['featuredImage' => '', 'heroImage' => ''],
];
$post = $default;
$data = json_store_read(admin_data_file('training'));
if ($id) {
    foreach ($data['trainings'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) {
            $post = array_replace_recursive($default, $p);
            break;
        }
    }
} else {
    $maxOrder = 0;
    foreach ($data['trainings'] ?? [] as $p) $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
    $post['order'] = $maxOrder + 10;
}

$token = csrf_token();
$isEdit = $id !== null;
$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Training</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Training</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=training">&larr; Back</a>
    </header>
    <form id="training-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= $h($token) ?>">
        <input type="hidden" name="original_id" value="<?= $h($post['id']) ?>">

        <fieldset><legend>Basics</legend>
            <label>Title *<input id="title" type="text" required maxlength="200" value="<?= $h($post['title']) ?>"></label>
            <label>Slug<input id="slug" type="text" value="<?= $h($post['slug']) ?>"></label>
            <label>Category *
                <select id="category">
                    <?php foreach (['farming','conservation','skills-development','livelihood','other'] as $c): ?>
                        <option value="<?= $c ?>" <?= $post['category']===$c?'selected':'' ?>><?= $c ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Status *
                <select id="status">
                    <?php foreach (['open','full','upcoming','completed','cancelled'] as $s): ?>
                        <option value="<?= $s ?>" <?= $post['status']===$s?'selected':'' ?>><?= $s ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Order<input id="order" type="number" min="0" value="<?= (int)$post['order'] ?>"></label>
            <label class="checkbox"><input id="featured" type="checkbox" <?= $post['featured']?'checked':'' ?>> Featured</label>
        </fieldset>

        <fieldset><legend>Schedule</legend>
            <label>Type
                <select id="schedule-type">
                    <?php foreach (['daily-immersive','weekend-sessions','online','hybrid'] as $t): ?>
                        <option value="<?= $t ?>" <?= $post['schedule']['type']===$t?'selected':'' ?>><?= $t ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Timezone<input id="schedule-timezone" type="text" value="<?= $h($post['schedule']['timezone']) ?>"></label>
            <label>Morning routine<textarea id="dailyStructure-morning" rows="2"><?= $h($post['schedule']['dailyStructure']['morning']) ?></textarea></label>
            <label>Afternoon<textarea id="dailyStructure-afternoon" rows="2"><?= $h($post['schedule']['dailyStructure']['afternoon']) ?></textarea></label>
            <label>Evening<textarea id="dailyStructure-evening" rows="2"><?= $h($post['schedule']['dailyStructure']['evening']) ?></textarea></label>
            <label>Night<textarea id="dailyStructure-night" rows="2"><?= $h($post['schedule']['dailyStructure']['night']) ?></textarea></label>
            <div>Sessions (optional — for weekend-style schedules)</div>
            <div id="sessions-rows"></div>
            <button type="button" id="add-session" class="btn btn-ghost">+ Add session</button>
        </fieldset>

        <fieldset><legend>Total duration</legend>
            <label>Value<input id="totalDuration-value" type="number" min="0" value="<?= (int)$post['totalDuration']['value'] ?>"></label>
            <label>Unit
                <select id="totalDuration-unit">
                    <?php foreach (['days','weeks','months'] as $u): ?>
                        <option value="<?= $u ?>" <?= $post['totalDuration']['unit']===$u?'selected':'' ?>><?= $u ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
        </fieldset>

        <fieldset><legend>Location</legend>
            <label>Type
                <select id="location-type">
                    <?php foreach (['offline','online','hybrid'] as $l): ?>
                        <option value="<?= $l ?>" <?= $post['location']['type']===$l?'selected':'' ?>><?= $l ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Venue<input id="location-venue" type="text" value="<?= $h($post['location']['venue']) ?>"></label>
            <label>City<input id="location-city" type="text" value="<?= $h($post['location']['city']) ?>"></label>
            <label>State<input id="location-state" type="text" value="<?= $h($post['location']['state']) ?>"></label>
            <label>Country<input id="location-country" type="text" value="<?= $h($post['location']['country']) ?>"></label>
        </fieldset>

        <fieldset><legend>Audience</legend>
            <label>Audience tags (one per line)<textarea id="audience" rows="4"><?= $h(implode("\n", $post['audience'])) ?></textarea></label>
            <label>Target audience paragraph<textarea id="targetAudience" rows="3"><?= $h($post['targetAudience']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Capacity</legend>
            <label>Total<input id="capacity-total" type="number" min="0" value="<?= (int)$post['capacity']['total'] ?>"></label>
            <label>Registered<input id="capacity-registered" type="number" min="0" value="<?= (int)$post['capacity']['registered'] ?>"></label>
            <p class="form-hint">"Available" is calculated on save (total − registered).</p>
        </fieldset>

        <fieldset><legend>Description</legend>
            <label>Brief (≤ 500) *<textarea id="brief" rows="3" maxlength="500" required><?= $h($post['description']['brief']) ?></textarea></label>
            <label>Full *<textarea id="full" rows="10" required><?= $h($post['description']['full']) ?></textarea></label>
            <label>Objectives (one per line)<textarea id="objectives" rows="6"><?= $h(implode("\n", $post['description']['objectives'])) ?></textarea></label>
            <label>Outcomes (one per line)<textarea id="outcomes" rows="6"><?= $h(implode("\n", $post['description']['outcomes'])) ?></textarea></label>
            <label>Requirements (one per line)<textarea id="requirements-list" rows="6"><?= $h(implode("\n", $post['description']['requirements'])) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Curriculum (modules)</legend>
            <div id="curriculum-rows"></div>
            <button type="button" id="add-curriculum" class="btn btn-ghost">+ Add module</button>
            <p class="form-hint">For each module, enter topics one per line in the second box.</p>
        </fieldset>

        <fieldset><legend>Facilitators</legend>
            <div id="facilitators-rows"></div>
            <button type="button" id="add-facilitator" class="btn btn-ghost">+ Add facilitator</button>
        </fieldset>

        <fieldset><legend>Registration</legend>
            <label class="checkbox"><input id="registration-required" type="checkbox" <?= $post['registration']['required']?'checked':'' ?>> Required</label>
            <label>Fee amount<input id="fee-amount" type="number" min="0" value="<?= (int)$post['registration']['fee']['amount'] ?>"></label>
            <label>Fee type
                <select id="fee-type">
                    <?php foreach (['free','paid','donation'] as $t): ?>
                        <option value="<?= $t ?>" <?= $post['registration']['fee']['type']===$t?'selected':'' ?>><?= $t ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Notes<textarea id="registration-notes" rows="2"><?= $h($post['registration']['notes']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Media</legend>
            <label>Featured image
                <input type="file" id="featured-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="featured-url" value="<?= $h($post['media']['featuredImage']) ?>">
                <div class="upload-status" id="featured-status"></div>
                <img id="featured-preview" src="<?= $h($post['media']['featuredImage']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['media']['featuredImage']?'':'display:none' ?>">
            </label>
            <label>Hero image
                <input type="file" id="hero-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="hero-url" value="<?= $h($post['media']['heroImage']) ?>">
                <div class="upload-status" id="hero-status"></div>
                <img id="hero-preview" src="<?= $h($post['media']['heroImage']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['media']['heroImage']?'':'display:none' ?>">
            </label>
        </fieldset>

        <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=training">Cancel</a>
        </div>
    </form>
</div>
<script>
window.VEFS_CONFIG = {
    cloudinary: {
        cloud_name: <?= json_encode($cfg['cloudinary']['cloud_name']) ?>,
        upload_preset: <?= json_encode($cfg['cloudinary']['upload_preset']) ?>,
    }
};
// Convert curriculum topics[] into joined text for the textarea field
window.VEFS_INITIAL = {
    sessions: <?= json_encode($post['schedule']['sessions']) ?>,
    curriculum: <?= json_encode(array_map(
        fn($c) => ['module' => $c['module'] ?? '', 'topicsText' => implode("\n", $c['topics'] ?? [])],
        $post['description']['curriculum']
    )) ?>,
    facilitators: <?= json_encode($post['facilitators']) ?>,
};
</script>
<script src="/admin/assets/admin.js"></script>
<script src="/admin/assets/form-training.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `form-training.js`**

```js
(function() {
    const { wireImagePicker, postJSON, toast, repeatableRows } = window.VEFS;

    wireImagePicker(
        document.getElementById('featured-picker'),
        document.getElementById('featured-url'),
        document.getElementById('featured-preview'),
        document.getElementById('featured-status'),
    );
    wireImagePicker(
        document.getElementById('hero-picker'),
        document.getElementById('hero-url'),
        document.getElementById('hero-preview'),
        document.getElementById('hero-status'),
    );

    const sessions = repeatableRows(
        document.getElementById('sessions-rows'),
        [
            { name: 'date',        placeholder: 'Date (YYYY-MM-DD)' },
            { name: 'startTime',   placeholder: 'Start time' },
            { name: 'endTime',     placeholder: 'End time' },
            { name: 'title',       placeholder: 'Title' },
            { name: 'description', placeholder: 'Description', type: 'textarea' },
        ],
        window.VEFS_INITIAL.sessions,
        document.getElementById('add-session'),
    );

    const curriculum = repeatableRows(
        document.getElementById('curriculum-rows'),
        [
            { name: 'module',     placeholder: 'Module name' },
            { name: 'topicsText', placeholder: 'Topics (one per line)', type: 'textarea' },
        ],
        window.VEFS_INITIAL.curriculum,
        document.getElementById('add-curriculum'),
    );

    const facilitators = repeatableRows(
        document.getElementById('facilitators-rows'),
        [
            { name: 'name',  placeholder: 'Name' },
            { name: 'title', placeholder: 'Title' },
            { name: 'bio',   placeholder: 'Bio', type: 'textarea' },
        ],
        window.VEFS_INITIAL.facilitators,
        document.getElementById('add-facilitator'),
    );

    function splitLines(s) {
        return String(s).split(/\r?\n/).map(l => l.trim()).filter(l => l);
    }

    document.getElementById('training-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'training',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                slug: document.getElementById('slug').value,
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                status: document.getElementById('status').value,
                featured: document.getElementById('featured').checked,
                order: parseInt(document.getElementById('order').value, 10) || 0,
                schedule: {
                    type: document.getElementById('schedule-type').value,
                    sessions: sessions.readAll(),
                    dailyStructure: {
                        morning:   document.getElementById('dailyStructure-morning').value,
                        afternoon: document.getElementById('dailyStructure-afternoon').value,
                        evening:   document.getElementById('dailyStructure-evening').value,
                        night:     document.getElementById('dailyStructure-night').value,
                    },
                    timezone: document.getElementById('schedule-timezone').value,
                },
                totalDuration: {
                    value: parseInt(document.getElementById('totalDuration-value').value, 10) || 0,
                    unit:  document.getElementById('totalDuration-unit').value,
                },
                location: {
                    type:    document.getElementById('location-type').value,
                    venue:   document.getElementById('location-venue').value,
                    city:    document.getElementById('location-city').value,
                    state:   document.getElementById('location-state').value,
                    country: document.getElementById('location-country').value,
                },
                audience: splitLines(document.getElementById('audience').value),
                targetAudience: document.getElementById('targetAudience').value,
                capacity: {
                    total:      parseInt(document.getElementById('capacity-total').value, 10) || 0,
                    registered: parseInt(document.getElementById('capacity-registered').value, 10) || 0,
                    available:  0, // recomputed server-side
                },
                description: {
                    brief: document.getElementById('brief').value,
                    full:  document.getElementById('full').value,
                    objectives:   splitLines(document.getElementById('objectives').value),
                    curriculum:   curriculum.readAll().map(r => ({
                        module: r.module,
                        topics: splitLines(r.topicsText),
                    })),
                    outcomes:     splitLines(document.getElementById('outcomes').value),
                    requirements: splitLines(document.getElementById('requirements-list').value),
                },
                facilitators: facilitators.readAll(),
                registration: {
                    required: document.getElementById('registration-required').checked,
                    fee: {
                        amount:   parseInt(document.getElementById('fee-amount').value, 10) || 0,
                        currency: 'INR',
                        type:     document.getElementById('fee-type').value,
                    },
                    notes: document.getElementById('registration-notes').value,
                },
                media: {
                    featuredImage: document.getElementById('featured-url').value,
                    heroImage:     document.getElementById('hero-url').value,
                },
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=training';
        } catch (e) { toast(e.message, true); }
    });
})();
```

- [ ] **Step 3: Manual test — round-trip the existing `trn-001`**

In the dashboard, edit the existing training. Verify every field repopulates correctly (especially curriculum modules with their topics joined by newlines). Save without changes — confirm dashboard still shows it.

- [ ] **Step 4: Create a fresh training**

Add a new one with two curriculum modules, one facilitator. Save. Reopen. Verify all nested fields persist.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/admin/form-training.php VEFS-website/admin/assets/form-training.js
git commit -m "feat(admin): add Trainings create/edit form with full schema parity"
```

---

## Task 11: Build `form-volunteer.php` + `form-volunteer.js`

**Files:**
- Create: `VEFS-website/admin/form-volunteer.php`
- Create: `VEFS-website/admin/assets/form-volunteer.js`

- [ ] **Step 1: Create `form-volunteer.php`**

```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';
require __DIR__ . '/../includes/admin-helpers.php';

auth_require();
$cfg = auth_config();
$id = $_GET['id'] ?? null;

$default = [
    'id' => '', 'slug' => '', 'title' => '', 'order' => 10, 'status' => 'open',
    'description' => ['brief' => '', 'full' => ''],
    'dates' => ['start' => 'TBD', 'end' => 'TBD'],
    'duration' => ['value' => 0, 'unit' => 'months'],
    'commitment' => '',
    'requirements' => [
        'age' => ['min' => '', 'max' => ''],
        'skills' => [], 'physical' => '', 'education' => '',
    ],
    'benefits' => [
        'learning' => [], 'certificate' => false, 'meals' => false, 'accommodation' => false,
        'stipend' => ['provided' => false, 'amount' => 0],
    ],
    'relatedEvents' => [],
    'location' => ['type' => 'on-site', 'city' => '', 'state' => ''],
    'spots' => ['total' => 0, 'filled' => 0, 'available' => 0],
    'contact' => ['name' => '', 'email' => '', 'phone' => ''],
    'media' => ['featuredImage' => ''],
];
$post = $default;
$data = json_store_read(admin_data_file('volunteer'));
if ($id) {
    foreach ($data['volunteers'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) {
            $post = array_replace_recursive($default, $p);
            break;
        }
    }
} else {
    $maxOrder = 0;
    foreach ($data['volunteers'] ?? [] as $p) $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
    $post['order'] = $maxOrder + 10;
}

$token = csrf_token();
$isEdit = $id !== null;
$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Volunteer Opportunity</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Volunteer Opportunity</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=volunteer">&larr; Back</a>
    </header>
    <form id="volunteer-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= $h($token) ?>">
        <input type="hidden" name="original_id" value="<?= $h($post['id']) ?>">

        <fieldset><legend>Basics</legend>
            <label>Title *<input id="title" type="text" required maxlength="200" value="<?= $h($post['title']) ?>"></label>
            <label>Slug<input id="slug" type="text" value="<?= $h($post['slug']) ?>"></label>
            <label>Status *
                <select id="status">
                    <?php foreach (['open','full','closed'] as $s): ?>
                        <option value="<?= $s ?>" <?= $post['status']===$s?'selected':'' ?>><?= $s ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Order<input id="order" type="number" min="0" value="<?= (int)$post['order'] ?>"></label>
            <label>Commitment<input id="commitment" type="text" value="<?= $h($post['commitment']) ?>" placeholder="Full-time / Part-time / Weekends"></label>
        </fieldset>

        <fieldset><legend>Description</legend>
            <label>Brief (≤ 500) *<textarea id="brief" rows="3" maxlength="500" required><?= $h($post['description']['brief']) ?></textarea></label>
            <label>Full *<textarea id="full" rows="8" required><?= $h($post['description']['full']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Dates & duration</legend>
            <label>Start ("TBD" or ISO date)<input id="dates-start" type="text" value="<?= $h($post['dates']['start']) ?>" placeholder="TBD or 2026-06-01"></label>
            <label>End<input id="dates-end" type="text" value="<?= $h($post['dates']['end']) ?>" placeholder="TBD or 2026-09-01"></label>
            <label>Duration value<input id="duration-value" type="number" min="0" value="<?= (int)$post['duration']['value'] ?>"></label>
            <label>Duration unit
                <select id="duration-unit">
                    <?php foreach (['days','weeks','months','years'] as $u): ?>
                        <option value="<?= $u ?>" <?= $post['duration']['unit']===$u?'selected':'' ?>><?= $u ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
        </fieldset>

        <fieldset><legend>Requirements</legend>
            <label>Min age (blank = none)<input id="age-min" type="number" min="0" value="<?= $post['requirements']['age']['min']===null||$post['requirements']['age']['min']===''?'':(int)$post['requirements']['age']['min'] ?>"></label>
            <label>Max age (blank = none)<input id="age-max" type="number" min="0" value="<?= $post['requirements']['age']['max']===null||$post['requirements']['age']['max']===''?'':(int)$post['requirements']['age']['max'] ?>"></label>
            <label>Skills (one per line)<textarea id="skills" rows="4"><?= $h(implode("\n", $post['requirements']['skills'])) ?></textarea></label>
            <label>Physical requirements<textarea id="physical" rows="3"><?= $h($post['requirements']['physical']) ?></textarea></label>
            <label>Education requirements<textarea id="education" rows="2"><?= $h($post['requirements']['education']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Benefits</legend>
            <label>What you'll learn (one per line)<textarea id="learning" rows="5"><?= $h(implode("\n", $post['benefits']['learning'])) ?></textarea></label>
            <label class="checkbox"><input id="ben-certificate" type="checkbox" <?= $post['benefits']['certificate']?'checked':'' ?>> Certificate</label>
            <label class="checkbox"><input id="ben-meals" type="checkbox" <?= $post['benefits']['meals']?'checked':'' ?>> Meals</label>
            <label class="checkbox"><input id="ben-accommodation" type="checkbox" <?= $post['benefits']['accommodation']?'checked':'' ?>> Accommodation</label>
            <label class="checkbox"><input id="stipend-provided" type="checkbox" <?= $post['benefits']['stipend']['provided']?'checked':'' ?>> Stipend provided</label>
            <label>Stipend amount (INR)<input id="stipend-amount" type="number" min="0" value="<?= (int)$post['benefits']['stipend']['amount'] ?>"></label>
        </fieldset>

        <fieldset><legend>Related events (event ids, one per line)</legend>
            <textarea id="relatedEvents" rows="3"><?= $h(implode("\n", $post['relatedEvents'])) ?></textarea>
        </fieldset>

        <fieldset><legend>Location</legend>
            <label>Type
                <select id="location-type">
                    <?php foreach (['on-site','remote','hybrid'] as $l): ?>
                        <option value="<?= $l ?>" <?= $post['location']['type']===$l?'selected':'' ?>><?= $l ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>City<input id="location-city" type="text" value="<?= $h($post['location']['city']) ?>"></label>
            <label>State<input id="location-state" type="text" value="<?= $h($post['location']['state']) ?>"></label>
        </fieldset>

        <fieldset><legend>Spots</legend>
            <label>Total<input id="spots-total" type="number" min="0" value="<?= (int)$post['spots']['total'] ?>"></label>
            <label>Filled<input id="spots-filled" type="number" min="0" value="<?= (int)$post['spots']['filled'] ?>"></label>
            <p class="form-hint">"Available" is calculated on save (total − filled).</p>
        </fieldset>

        <fieldset><legend>Contact</legend>
            <label>Name<input id="contact-name" type="text" value="<?= $h($post['contact']['name']) ?>"></label>
            <label>Email<input id="contact-email" type="email" value="<?= $h($post['contact']['email']) ?>"></label>
            <label>Phone<input id="contact-phone" type="text" value="<?= $h($post['contact']['phone']) ?>"></label>
        </fieldset>

        <fieldset><legend>Featured image</legend>
            <input type="file" id="featured-picker" accept="image/jpeg,image/png,image/webp">
            <input type="hidden" id="featured-url" value="<?= $h($post['media']['featuredImage']) ?>">
            <div class="upload-status" id="featured-status"></div>
            <img id="featured-preview" src="<?= $h($post['media']['featuredImage']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['media']['featuredImage']?'':'display:none' ?>">
        </fieldset>

        <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=volunteer">Cancel</a>
        </div>
    </form>
</div>
<script>
window.VEFS_CONFIG = {
    cloudinary: {
        cloud_name: <?= json_encode($cfg['cloudinary']['cloud_name']) ?>,
        upload_preset: <?= json_encode($cfg['cloudinary']['upload_preset']) ?>,
    }
};
</script>
<script src="/admin/assets/admin.js"></script>
<script src="/admin/assets/form-volunteer.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `form-volunteer.js`**

```js
(function() {
    const { wireImagePicker, postJSON, toast } = window.VEFS;

    wireImagePicker(
        document.getElementById('featured-picker'),
        document.getElementById('featured-url'),
        document.getElementById('featured-preview'),
        document.getElementById('featured-status'),
    );

    function intOrNull(v) {
        const s = String(v).trim();
        if (s === '') return null;
        return parseInt(s, 10);
    }
    function splitLines(s) {
        return String(s).split(/\r?\n/).map(l => l.trim()).filter(l => l);
    }

    document.getElementById('volunteer-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'volunteer',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                slug: document.getElementById('slug').value,
                title: document.getElementById('title').value,
                status: document.getElementById('status').value,
                order: parseInt(document.getElementById('order').value, 10) || 0,
                commitment: document.getElementById('commitment').value,
                description: {
                    brief: document.getElementById('brief').value,
                    full:  document.getElementById('full').value,
                },
                dates: {
                    start: document.getElementById('dates-start').value,
                    end:   document.getElementById('dates-end').value,
                },
                duration: {
                    value: parseInt(document.getElementById('duration-value').value, 10) || 0,
                    unit:  document.getElementById('duration-unit').value,
                },
                requirements: {
                    age: {
                        min: intOrNull(document.getElementById('age-min').value),
                        max: intOrNull(document.getElementById('age-max').value),
                    },
                    skills:    splitLines(document.getElementById('skills').value),
                    physical:  document.getElementById('physical').value,
                    education: document.getElementById('education').value,
                },
                benefits: {
                    learning:      splitLines(document.getElementById('learning').value),
                    certificate:   document.getElementById('ben-certificate').checked,
                    meals:         document.getElementById('ben-meals').checked,
                    accommodation: document.getElementById('ben-accommodation').checked,
                    stipend: {
                        provided: document.getElementById('stipend-provided').checked,
                        amount:   parseInt(document.getElementById('stipend-amount').value, 10) || 0,
                    },
                },
                relatedEvents: splitLines(document.getElementById('relatedEvents').value),
                location: {
                    type:  document.getElementById('location-type').value,
                    city:  document.getElementById('location-city').value,
                    state: document.getElementById('location-state').value,
                },
                spots: {
                    total:     parseInt(document.getElementById('spots-total').value, 10) || 0,
                    filled:    parseInt(document.getElementById('spots-filled').value, 10) || 0,
                    available: 0,
                },
                contact: {
                    name:  document.getElementById('contact-name').value,
                    email: document.getElementById('contact-email').value,
                    phone: document.getElementById('contact-phone').value,
                },
                media: {
                    featuredImage: document.getElementById('featured-url').value,
                },
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=volunteer';
        } catch (e) { toast(e.message, true); }
    });
})();
```

- [ ] **Step 3: Round-trip an existing volunteer**

Edit `vol-001` from the dashboard. Verify all fields repopulate. Save without changes. Reopen — confirm.

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/admin/form-volunteer.php VEFS-website/admin/assets/form-volunteer.js
git commit -m "feat(admin): add Volunteers create/edit form with full schema parity"
```

---

## Task 12: End-to-end manual verification

**Files:** none (verification only)

- [ ] **Step 1: Restart the server with clean state**

Stop the running PHP server (Ctrl+C in its terminal). Optionally clean the rolling backups so you can see fresh ones land during this verification:

```powershell
Remove-Item VEFS-website/data/backups/*.json -Force -ErrorAction SilentlyContinue
```

Restart server from `VEFS-website/`:
```powershell
..\.tooling\php\php.exe -S localhost:8000 router.php
```

- [ ] **Step 2: Run all PHP CLI tests**

```powershell
..\.tooling\php\php.exe VEFS-website/tests/test-json-store.php
..\.tooling\php\php.exe VEFS-website/tests/test-csrf.php
..\.tooling\php\php.exe VEFS-website/tests/test-sanitize-html.php
..\.tooling\php\php.exe VEFS-website/tests/test-validate.php
..\.tooling\php\php.exe VEFS-website/tests/test-validate-phase2.php
```
Expected: all green.

- [ ] **Step 3: Events flow**

1. Dashboard → Events → **+ New Event**. Fill all required fields including ISO dates, descriptions, upload featured + hero images, add 2 agenda rows + 2 speaker rows, add 3 tags. Save.
2. Verify redirect to dashboard with the row visible. Id starts with `evt-`.
3. Click Edit. Confirm ALL fields repopulated (including nested location, agenda rows in order, speaker rows in order, image previews visible, tags joined by commas).
4. Change the title. Save. Reopen — title persisted.
5. Add a second event, then use ▲ to swap order. Confirm order values swap in the dashboard.
6. Delete the second event. Confirm row gone.
7. View source of the JSON file (`data/events.json`) — confirm structure matches the original schema exactly (no extra fields, no missing fields).

- [ ] **Step 4: Trainings flow**

1. Dashboard → Trainings → Edit the existing `trn-001`. Confirm every nested field repopulates (especially each curriculum module's topics rendered as newline-separated text).
2. Add a new training. Fill basics, schedule (daily structure for all 4 time slots), 2 curriculum modules each with 3 topics, 1 facilitator. Save.
3. Reopen — confirm curriculum survived the round-trip (topics still in same order).
4. Check `data/trainings.json` directly — `capacity.available` should equal `total - registered`.

- [ ] **Step 5: Volunteers flow**

1. Dashboard → Volunteers → Edit `vol-001`. Confirm all fields repopulate.
2. Add a new volunteer opportunity. Fill all fields, upload an image.
3. Save → confirm dashboard row.
4. Verify in `data/volunteers.json`: `spots.available = total - filled` and `id` follows `vol-NNN`.
5. Delete a test volunteer. Row removed. Backup file present in `data/backups/`.

- [ ] **Step 6: Public site verification**

The existing public pages already read these JSON files. Open each in the browser:

1. `http://localhost:8000/events.html` → confirm your new events render in the grid.
2. `http://localhost:8000/trainings.html` → confirm new training renders.
3. `http://localhost:8000/volunteer.html` → confirm new opportunity renders.
4. DevTools console on each page → no JS errors related to missing/changed fields.

If any field rendering breaks, the public page's JS is expecting a field name or shape that doesn't match what the admin produced. Fix by aligning the admin's save shape with the public page's expectation (the schemas in this plan match the original JSON, so this should not happen — but check anyway).

- [ ] **Step 7: Security spot-checks (same set as Phase 1)**

1. Logged out: `curl.exe http://localhost:8000/admin/api/save.php -X POST -H "Content-Type: application/json" -d '{\"type\":\"event\"}'` → expect 401.
2. Logged in, omit CSRF token in payload → 403.
3. Save an event with `<script>alert(1)</script>` in `fullDescription` → confirm `<script>` is stripped in the saved JSON (we use `strip_tags`).
4. Save a training with capacity total=5, registered=10 → expect 422 with `capacity.registered` field error.

- [ ] **Step 8: Save verification screenshots**

Drop screenshots of the three working flows into `VEFS-builder/04-TESTING/screenshots/phase2-admin/`. Commit:

```bash
git add VEFS-builder/04-TESTING/screenshots/phase2-admin/
git commit -m "test(admin): phase 2 end-to-end verification screenshots"
```

- [ ] **Step 9: Final commit (if any patches needed)**

If anything required a fix during E2E, commit those fixes separately with clear messages.

---

## Notes for the executing engineer

- **No Apache locally** — the local `router.php` does NOT enforce `.htaccess` rules. Anything that depends on Apache (HTTPS redirect, deny on `/admin/config.php`) must be re-tested on Hostinger after deploy. This applies to all three new types' admin URLs the same way.
- **Public page schema drift** — events.html / trainings.html / volunteer.html were built before this admin. They read the JSON fields by name. The plan preserves the exact existing field names — do not rename anything when implementing. If you find yourself wanting to "clean up" a field name, stop and check whether a public page reads it first (`grep -r "fieldName" VEFS-website/js`).
- **Image previews on edit** — root-relative image paths (like `/images/hero/...` in `vol-001`) display fine via `<img src=...>` once the server is running. Cloudinary URLs work the same way. Mixing both is OK; new uploads always go to Cloudinary.
- **PHP error reporting** — when developing forms it helps to add `ini_set('display_errors','1'); error_reporting(E_ALL);` at the top of `save.php` temporarily. Revert before commit.
- **Backup directory hygiene** — every save writes a backup to `data/backups/`. Over a long testing session this accumulates dozens of files. They're gitignored. If you need to clear: `Remove-Item VEFS-website/data/backups/*.json -Force`.
- **The `description.curriculum` round-trip** — the only schema element where we display data differently from how we store it (topics array → newline-joined textarea → array again). Test specifically: edit a training with 3 modules × 3 topics, save without changes, diff `trainings.json` against pre-edit version. Should be byte-identical apart from `updated_at` (if we add it — currently we don't on training/event/volunteer; Phase 1 only adds it on blog/social).

---

## Phase 2 done — what's next

After this lands, the admin manages every JSON-backed content type the site uses. Reasonable follow-ups (not in scope here):

1. **Cloudinary cleanup** — currently deletes leave orphaned images. Could be added later by storing `public_id` alongside each URL and calling Cloudinary's destroy API with signed params from `delete.php`.
2. **Public-page schema validator** — a small CI-style script that loads each JSON file and asserts the fields each public-page JS expects are present. Would catch admin/public drift early.
3. **Bulk import/export** — a dashboard button to download/upload the JSON for offline editing. Useful for events with lots of Tamil content that's easier to compose in a text editor.
