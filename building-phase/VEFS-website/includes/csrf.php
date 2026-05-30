<?php
declare(strict_types=1);

/**
 * Returns the current session's CSRF token, generating one if absent.
 * Caller must have called session_start() first (or be in CLI test mode with $_SESSION array).
 */
function csrf_token(): string {
    if (!isset($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Constant-time comparison against the session token.
 */
function csrf_verify(?string $submitted): bool {
    if ($submitted === null || $submitted === '') return false;
    if (!isset($_SESSION['csrf_token'])) return false;
    return hash_equals($_SESSION['csrf_token'], $submitted);
}
