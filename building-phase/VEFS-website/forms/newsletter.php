<?php
/**
 * Newsletter Subscription Handler
 * Validates email and forwards to Google Apps Script,
 * which logs to the "Newsletter Subscribers" Google Sheet.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

$input  = json_decode(file_get_contents('php://input'), true);
$email  = isset($input['email'])  ? trim(strtolower($input['email']))                                    : '';
$source = isset($input['source']) ? htmlspecialchars(trim($input['source']), ENT_QUOTES, 'UTF-8') : 'website';

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'invalid_email']);
    exit;
}

// Forward to Google Apps Script (fire-and-forget, 5 s timeout)
$googleScriptUrl = 'https://script.google.com/macros/s/AKfycbw24TWvT6pK-DAD1KMNqfeAKBSpa4fRbs8vJQP3Pv63eoD7V5BEz89CTEX_O30PYshZ/exec';

$payload = json_encode([
    'formType' => 'newsletter',
    'name'     => 'Newsletter Subscriber',
    'email'    => $email,
    'source'   => $source,
]);

$context = stream_context_create([
    'http' => [
        'method'        => 'POST',
        'header'        => "Content-Type: text/plain\r\n",
        'content'       => $payload,
        'timeout'       => 5,
        'ignore_errors' => true,
    ]
]);
@file_get_contents($googleScriptUrl, false, $context);

echo json_encode(['success' => true, 'message' => 'Successfully subscribed']);
