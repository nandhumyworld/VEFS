<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';

// Simulate a session for CLI
$_SESSION = [];
require __DIR__ . '/../includes/csrf.php';

test('csrf_token returns a 64-char hex string', function() {
    $t = csrf_token();
    assert_true(preg_match('/^[a-f0-9]{64}$/', $t) === 1, "got: $t");
});

test('csrf_token returns same token within session', function() {
    $a = csrf_token();
    $b = csrf_token();
    assert_eq($a, $b);
});

test('csrf_verify returns true for the current token', function() {
    $t = csrf_token();
    assert_true(csrf_verify($t));
});

test('csrf_verify returns false for wrong token', function() {
    csrf_token();
    assert_eq(false, csrf_verify(str_repeat('0', 64)));
});

test('csrf_verify returns false for empty string', function() {
    csrf_token();
    assert_eq(false, csrf_verify(''));
});

summary();
