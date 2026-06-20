<?php
declare(strict_types=1);
require __DIR__ . '/../../includes/auth.php';
require __DIR__ . '/../../includes/csrf.php';
require __DIR__ . '/../../includes/json-store.php';
require __DIR__ . '/../../includes/admin-helpers.php';

header('Content-Type: application/json');

auth_start_session();
if (!auth_check_logged_in()) { http_response_code(401); echo json_encode(['error' => 'Not authenticated']); exit; }

$body = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($body) || !csrf_verify($body['csrf'] ?? null)) {
    http_response_code(403); echo json_encode(['error' => 'CSRF']); exit;
}
$type = $body['type'] ?? '';
if (!in_array($type, ['blog', 'social', 'event', 'training', 'volunteer', 'gallery', 'project'], true)) {
    http_response_code(400); echo json_encode(['error' => 'bad type']); exit;
}
$id = (string)($body['id'] ?? '');
if ($id === '') { http_response_code(400); echo json_encode(['error' => 'missing id']); exit; }

$dataDir = __DIR__ . '/../../data';
$file = admin_data_file($type);
$arrayKey = admin_array_key_for_type($type);
$data = json_store_read($file);
$items = $data[$arrayKey] ?? [];

$src = null;
$maxOrder = 0;
foreach ($items as $p) {
    if (($p['id'] ?? null) === $id) $src = $p;
    $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
}
if ($src === null) { http_response_code(404); echo json_encode(['error' => 'id not found']); exit; }

$copy = $src;

// New id per type
if ($type === 'event')          $copy['id'] = admin_next_id('evt', $items);
elseif ($type === 'training')   $copy['id'] = admin_next_id('trn', $items);
elseif ($type === 'volunteer')  $copy['id'] = admin_next_id('vol', $items);
elseif ($type === 'gallery')    $copy['id'] = admin_next_id('gal', $items);
elseif ($type === 'social')     $copy['id'] = ($src['platform'] ?? 'social') . '-' . date('Ymd-His');
elseif ($type === 'blog') {
    // Blog id is a slug; pick a fresh unique one
    $base = $src['id'] . '-copy';
    $candidate = $base; $n = 2;
    $exists = fn($s) => (bool)array_filter($items, fn($p) => ($p['id'] ?? null) === $s);
    while ($exists($candidate)) { $candidate = $base . '-' . $n++; }
    $copy['id'] = $candidate;
}

// Title/caption "(Copy)" suffix and slug reset for slug-bearing types
if (isset($copy['title']))   $copy['title']   = $copy['title']   . ' (Copy)';
if (isset($copy['caption'])) $copy['caption'] = $copy['caption'] . ' (Copy)';
if (in_array($type, ['event', 'training', 'volunteer'], true)) {
    $copy['slug'] = ''; // will be re-derived on next save
}

$copy['enabled'] = false; // duplicates start disabled to avoid accidental publish
$copy['order'] = $maxOrder + 10;

// Timestamps where applicable
$nowIso = date('c');
if ($type === 'blog') {
    $copy['published_at'] = $nowIso;
    $copy['updated_at'] = $nowIso;
} elseif ($type === 'social') {
    $copy['posted_at'] = $nowIso;
    $copy['updated_at'] = $nowIso;
}

$items[] = $copy;
$data[$arrayKey] = $items;
$data['metadata']['lastUpdated'] = $nowIso;
$data['metadata']['total'] = count($items);

json_store_write($file, $data, $dataDir . '/backups');
audit_log('duplicate', $type, $copy['id'] . ' <- ' . $id);

echo json_encode(['success' => true, 'id' => $copy['id']]);
