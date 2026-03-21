<?php
/**
 * Newsletter Subscription Handler
 * Saves subscriber to data/newsletter-subscribers.json
 * and notifies admin via Google Apps Script
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Parse input
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim(strtolower($input['email'])) : '';
$source = isset($input['source']) ? htmlspecialchars(trim($input['source']), ENT_QUOTES, 'UTF-8') : 'website';

// Validate email
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'invalid_email']);
    exit;
}

// Path to subscribers file
$dataFile = __DIR__ . '/../data/newsletter-subscribers.json';

// Read existing data
$data = [
    'subscribers' => [],
    'metadata' => [
        'totalSubscribers' => 0,
        'lastUpdated' => '',
        'version' => '1.0',
        'notes' => 'Newsletter subscriber list. Managed automatically by forms/newsletter.php. Do not edit manually.'
    ]
];

if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    $decoded = json_decode($content, true);
    if ($decoded && isset($decoded['subscribers'])) {
        $data = $decoded;
    }
}

// Check for duplicate (emails stored lowercase)
foreach ($data['subscribers'] as $subscriber) {
    if (strtolower($subscriber['email']) === $email) {
        echo json_encode(['success' => false, 'error' => 'already_subscribed']);
        exit;
    }
}

// Add new subscriber
$newSubscriber = [
    'email'        => $email,
    'subscribedAt' => date('c'),
    'source'       => $source
];

$data['subscribers'][] = $newSubscriber;
$data['metadata']['totalSubscribers'] = count($data['subscribers']);
$data['metadata']['lastUpdated'] = date('c');

// Save file
if (file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
    echo json_encode(['success' => false, 'error' => 'save_failed']);
    exit;
}

// Notify admin via Google Apps Script (non-blocking, ignore errors)
$googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyw2vis0PY7STZ9yYqgHGyI0vxEkxH64c6-Ll31cj6qCU5_07QMQDHzwZc6H4NwMZJh/exec';

$payload = json_encode([
    'formType'         => 'newsletter',
    'name'             => 'Newsletter Subscriber',
    'email'            => $email,
    'source'           => $source,
    'subscribedAt'     => $newSubscriber['subscribedAt'],
    'totalSubscribers' => $data['metadata']['totalSubscribers']
]);

$context = stream_context_create([
    'http' => [
        'method'        => 'POST',
        'header'        => "Content-Type: text/plain\r\n",
        'content'       => $payload,
        'timeout'       => 5,
        'ignore_errors' => true
    ]
]);
@file_get_contents($googleScriptUrl, false, $context);

echo json_encode(['success' => true, 'message' => 'Successfully subscribed']);
