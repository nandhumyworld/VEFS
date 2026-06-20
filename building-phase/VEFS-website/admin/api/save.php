<?php
declare(strict_types=1);
require __DIR__ . '/../../includes/auth.php';
require __DIR__ . '/../../includes/csrf.php';
require __DIR__ . '/../../includes/json-store.php';
require __DIR__ . '/../../includes/validate.php';
require __DIR__ . '/../../includes/sanitize-html.php';
require __DIR__ . '/../../includes/admin-helpers.php';

header('Content-Type: application/json');

function json_fail(int $code, string $msg, array $extra = []): void {
    http_response_code($code);
    echo json_encode(array_merge(['error' => $msg], $extra));
    exit;
}

auth_start_session();
if (!auth_check_logged_in()) json_fail(401, 'Not authenticated');

$body = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($body)) json_fail(400, 'Invalid JSON body');
if (!csrf_verify($body['csrf'] ?? null)) json_fail(403, 'CSRF token mismatch');

$type = $body['type'] ?? '';
if (!in_array($type, ['blog', 'social', 'event', 'training', 'volunteer', 'gallery', 'project'], true)) json_fail(400, 'Invalid type');

$data = $body['data'] ?? null;
if (!is_array($data)) json_fail(400, 'Missing data');

$originalId = $body['original_id'] ?? null;

$dataDir = __DIR__ . '/../../data';
$file = admin_data_file($type);
$backupDir = $dataDir . '/backups';
$arrayKey = admin_array_key_for_type($type);

$existing = json_store_read($file);
$items = $existing[$arrayKey] ?? [];

$nowIso = date('c');

// Preserve `enabled` across edits; default true for new items.
if (!array_key_exists('enabled', $data)) {
    $existingEnabled = true;
    if ($originalId !== null) {
        foreach ($items as $p) {
            if (($p['id'] ?? null) === $originalId) {
                $existingEnabled = !array_key_exists('enabled', $p) || !empty($p['enabled']);
                break;
            }
        }
    }
    $data['enabled'] = $existingEnabled;
} else {
    $data['enabled'] = !empty($data['enabled']);
}

if ($type === 'blog') {
    // Slug handling
    $slug = trim((string)($data['id'] ?? ''));
    if ($slug === '') {
        $slug = _slugify((string)($data['title'] ?? ''));
        if ($slug === '') json_fail(400, 'Could not derive slug from title');
    }
    foreach ($items as $p) {
        if (($p['id'] ?? null) === $slug && $slug !== $originalId) {
            json_fail(409, 'A post with this slug already exists', ['field' => 'slug']);
        }
    }
    $data['id'] = $slug;

    $errs = validate_blog($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    $data['body_html'] = sanitize_blog_html((string)$data['body_html']);

    $data['reference_links'] = array_values(array_filter(
        $data['reference_links'] ?? [],
        fn($r) => is_array($r) && !empty($r['label']) && !empty($r['url'])
    ));

    if ($originalId === null) $data['published_at'] = $nowIso;
    $data['updated_at'] = $nowIso;

    $items = _upsert($items, $data, $originalId);
}
elseif ($type === 'social') {
    $errs = validate_social($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    if ($originalId === null) {
        $stamp = date('Ymd-His');
        $data['id'] = $data['platform'] . '-' . $stamp;
    } else {
        $data['id'] = $originalId;
    }

    if ($originalId === null) $data['posted_at'] = $nowIso;
    $data['updated_at'] = $nowIso;

    $items = _upsert($items, $data, $originalId);
}
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

    $data['shortDescription'] = strip_tags((string)$data['shortDescription']);
    $data['fullDescription']  = strip_tags((string)$data['fullDescription']);

    $data['agenda'] = array_values(array_filter(
        $data['agenda'] ?? [],
        fn($r) => is_array($r) && (trim((string)($r['time'] ?? '')) !== '' || trim((string)($r['title'] ?? '')) !== '')
    ));
    $data['speakers'] = array_values(array_filter(
        $data['speakers'] ?? [],
        fn($r) => is_array($r) && trim((string)($r['name'] ?? '')) !== ''
    ));

    $data['project_id'] = (isset($data['project_id']) && trim((string)$data['project_id']) !== '') ? trim((string)$data['project_id']) : null;

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

    if (isset($data['capacity']) && is_array($data['capacity'])) {
        $t = (int)($data['capacity']['total'] ?? 0);
        $r = (int)($data['capacity']['registered'] ?? 0);
        $data['capacity']['available'] = max(0, $t - $r);
    }

    foreach (['brief', 'full'] as $f) {
        $data['description'][$f] = strip_tags((string)($data['description'][$f] ?? ''));
    }

    if (isset($data['description']['curriculum']) && is_array($data['description']['curriculum'])) {
        $data['description']['curriculum'] = array_values(array_filter(
            $data['description']['curriculum'],
            fn($r) => is_array($r) && trim((string)($r['module'] ?? '')) !== ''
        ));
    }

    $data['facilitators'] = array_values(array_filter(
        $data['facilitators'] ?? [],
        fn($r) => is_array($r) && trim((string)($r['name'] ?? '')) !== ''
    ));

    $data['project_id'] = (isset($data['project_id']) && trim((string)$data['project_id']) !== '') ? trim((string)$data['project_id']) : null;

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

    if (isset($data['spots']) && is_array($data['spots'])) {
        $t = (int)($data['spots']['total'] ?? 0);
        $f = (int)($data['spots']['filled'] ?? 0);
        $data['spots']['available'] = max(0, $t - $f);
    }

    foreach (['brief', 'full'] as $f) {
        $data['description'][$f] = strip_tags((string)($data['description'][$f] ?? ''));
    }

    $data['project_id'] = (isset($data['project_id']) && trim((string)$data['project_id']) !== '') ? trim((string)$data['project_id']) : null;

    $items = _upsert($items, $data, $originalId);
}
elseif ($type === 'gallery') {
    $errs = validate_gallery($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    if ($originalId === null) {
        $id = admin_next_id('gal', $items);
    } else {
        $id = $originalId;
    }

    $existingItem = null;
    if ($originalId !== null) {
        foreach ($items as $p) {
            if (($p['id'] ?? null) === $originalId) { $existingItem = $p; break; }
        }
    }

    $isNew = $data['isNew'] ?? 'auto';
    if (is_string($isNew) && $isNew !== 'auto') {
        $lower = strtolower($isNew);
        if ($lower === 'true') $isNew = true;
        elseif ($lower === 'false') $isNew = false;
    }

    $item = [
        'id'               => $id,
        'title'            => trim((string)($data['title'] ?? '')),
        'description'      => trim((string)($data['description'] ?? '')),
        'year'             => (int)($data['year'] ?? 0),
        'imageUrl'         => (string)($data['imageUrl'] ?? ''),
        'isNew'            => $isNew,
        'project_id'       => (isset($data['project_id']) && trim((string)$data['project_id']) !== '') ? trim((string)$data['project_id']) : null,
        'disabled'         => !empty($data['disabled']),
        'hiddenFromPublic' => !empty($data['hiddenFromPublic']),
        'createdAt'        => (string)($existingItem['createdAt'] ?? gmdate('c')),
        'updatedAt'        => gmdate('c'),
    ];

    $data = $item;
    $items = _upsert($items, $item, $originalId);
}
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
    $futureVals = [
        'proposed_budget' => null,
        'expected_beneficiaries' => null,
        'required_volunteers' => null,
        'sponsorship_opportunities' => null,
    ];
    if ($status === 'planning') {
        foreach ($futureVals as $k => $_) {
            if (isset($data[$k]) && $data[$k] !== '') $futureVals[$k] = $data[$k];
        }
    }

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
        $url = trim((string)($row['url'] ?? ''));
        if ($url === '') continue;
        $photos[] = ['url' => $url, 'caption' => trim((string)($row['caption'] ?? ''))];
    }

    $story = sanitize_blog_html((string)($data['story'] ?? ''));
    $sponsorship = $futureVals['sponsorship_opportunities'] === null
        ? null
        : sanitize_blog_html((string)$futureVals['sponsorship_opportunities']);

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
        'hero_image_url'             => trim((string)($data['hero_image_url'] ?? '')),
        'photos'                     => $photos,
        'impact_metrics'             => $metrics,
        'fundraising'                => [
            'target_amount'  => (float)($data['fundraising']['target_amount'] ?? 0),
            'raised_amount'  => (float)($data['fundraising']['raised_amount'] ?? 0),
            'donor_count'    => (int)($data['fundraising']['donor_count'] ?? 0),
            'show_progress'  => !empty($data['fundraising']['show_progress']),
        ],
        'proposed_budget'            => $futureVals['proposed_budget'] === null ? null : (float)$futureVals['proposed_budget'],
        'expected_beneficiaries'     => $futureVals['expected_beneficiaries'],
        'required_volunteers'        => $futureVals['required_volunteers'] === null ? null : (int)$futureVals['required_volunteers'],
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

    // Auto-tag project photos in gallery.json. For each project photo URL not
    // already present in gallery items, add a gallery row tagged with project_id.
    $galleryFile = $dataDir . '/gallery.json';
    if (file_exists($galleryFile)) {
        $galleryData = json_store_read($galleryFile);
        $galleryItems = $galleryData['items'] ?? [];
        $existingUrls = [];
        foreach ($galleryItems as $g) $existingUrls[(string)($g['imageUrl'] ?? '')] = true;

        $added = false;
        $allUrls = $photos;
        if ($item['hero_image_url'] !== '') {
            array_unshift($allUrls, ['url' => $item['hero_image_url'], 'caption' => $item['name']]);
        }
        foreach ($allUrls as $row) {
            $url = $row['url'];
            if (isset($existingUrls[$url])) continue;
            $galleryItems[] = [
                'id'               => admin_next_id('gal', $galleryItems),
                'title'            => $row['caption'] !== '' ? $row['caption'] : $item['name'],
                'description'      => '',
                'year'             => (int)substr($item['start_date'], 0, 4),
                'imageUrl'         => $url,
                'isNew'            => 'auto',
                'project_id'       => $item['id'],
                'disabled'         => false,
                'hiddenFromPublic' => false,
                'createdAt'        => gmdate('c'),
                'updatedAt'        => gmdate('c'),
            ];
            $existingUrls[$url] = true;
            $added = true;
        }
        if ($added) {
            $galleryData['items'] = $galleryItems;
            $galleryData['metadata']['lastUpdated'] = $nowIso;
            $galleryData['metadata']['total'] = count($galleryItems);
            json_store_write($galleryFile, $galleryData, $backupDir);
        }
    }
}

$existing[$arrayKey] = $items;
$existing['metadata']['lastUpdated'] = $nowIso;
$existing['metadata']['total'] = count($items);

json_store_write($file, $existing, $backupDir);

audit_log($originalId === null ? 'create' : 'update', $type, (string)$data['id']);

echo json_encode(['success' => true, 'id' => $data['id']]);

function _upsert(array $items, array $newItem, ?string $originalId): array {
    if ($originalId === null) {
        $items[] = $newItem;
        return $items;
    }
    $found = false;
    foreach ($items as $i => $p) {
        if (($p['id'] ?? null) === $originalId) {
            $items[$i] = $newItem;
            $found = true;
            break;
        }
    }
    if (!$found) $items[] = $newItem;
    return $items;
}

function _slugify(string $s): string {
    $s = strtolower(trim($s));
    $s = preg_replace('/[^a-z0-9\s-]/', '', $s);
    $s = preg_replace('/[\s_-]+/', '-', $s);
    return trim($s, '-');
}

function _findIndex(array $items, ?string $id): ?int {
    if ($id === null) return null;
    foreach ($items as $i => $p) {
        if (($p['id'] ?? null) === $id) return $i;
    }
    return null;
}
