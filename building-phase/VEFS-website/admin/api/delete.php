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
if (!in_array($type, ['blog', 'social', 'event', 'training', 'volunteer', 'gallery'], true)) {
    http_response_code(400); echo json_encode(['error' => 'bad type']); exit;
}
$id = (string)($body['id'] ?? '');

$dataDir = __DIR__ . '/../../data';
$file = admin_data_file($type);
$arrayKey = admin_array_key_for_type($type);
$data = json_store_read($file);
$before = count($data[$arrayKey] ?? []);
$data[$arrayKey] = array_values(array_filter($data[$arrayKey] ?? [], fn($p) => ($p['id'] ?? null) !== $id));
$data['metadata']['lastUpdated'] = date('c');
$data['metadata']['total'] = count($data[$arrayKey]);
json_store_write($file, $data, $dataDir . '/backups');
audit_log('delete', $type, $id);
echo json_encode(['success' => true, 'removed' => $before - count($data[$arrayKey])]);
