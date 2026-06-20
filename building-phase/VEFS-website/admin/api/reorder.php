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

$dataDir = __DIR__ . '/../../data';
$file = admin_data_file($type);
$arrayKey = admin_array_key_for_type($type);
$data = json_store_read($file);
$posts =& $data[$arrayKey];

if (isset($body['swap']) && is_array($body['swap']) && count($body['swap']) === 2) {
    [$idA, $idB] = $body['swap'];
    $iA = $iB = null;
    foreach ($posts as $i => $p) {
        if (($p['id'] ?? null) === $idA) $iA = $i;
        if (($p['id'] ?? null) === $idB) $iB = $i;
    }
    if ($iA === null || $iB === null) { http_response_code(404); echo json_encode(['error' => 'id not found']); exit; }
    $tmp = $posts[$iA]['order'] ?? 0;
    $posts[$iA]['order'] = $posts[$iB]['order'] ?? 0;
    $posts[$iB]['order'] = $tmp;
} elseif (isset($body['id'])) {
    $id = (string)$body['id'];
    $order = (int)($body['order'] ?? 0);
    if ($order < 0) { http_response_code(400); echo json_encode(['error' => 'order must be ≥ 0']); exit; }
    $found = false;
    foreach ($posts as &$p) {
        if (($p['id'] ?? null) === $id) { $p['order'] = $order; $found = true; break; }
    }
    unset($p);
    if (!$found) { http_response_code(404); echo json_encode(['error' => 'id not found']); exit; }
} else {
    http_response_code(400); echo json_encode(['error' => 'missing id or swap']); exit;
}

$data['metadata']['lastUpdated'] = date('c');
json_store_write($file, $data, $dataDir . '/backups');
audit_log('reorder', $type, $body['id'] ?? implode(',', $body['swap'] ?? []));
echo json_encode(['success' => true]);
