<?php
declare(strict_types=1);

function auth_config(): array {
    static $cfg = null;
    if ($cfg === null) {
        $cfg = require __DIR__ . '/../admin/config.php';
    }
    return $cfg;
}

function auth_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_name('vefs_admin');
    session_start();
}

function auth_check_logged_in(): bool {
    auth_start_session();
    if (empty($_SESSION['vefs_admin'])) return false;
    $cfg = auth_config();
    $now = time();
    $last = (int)($_SESSION['vefs_last_seen'] ?? 0);
    if ($now - $last > $cfg['session_timeout_seconds']) {
        auth_logout();
        return false;
    }
    $_SESSION['vefs_last_seen'] = $now;
    return true;
}

function auth_require(): void {
    if (!auth_check_logged_in()) {
        header('Location: /admin/index.php?expired=1');
        exit;
    }
}

function auth_attempt_login(string $password): bool {
    auth_start_session();
    $cfg = auth_config();
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

    if (_throttle_is_locked($ip)) return false;

    if (!password_verify($password, $cfg['admin_password_hash'])) {
        _throttle_record_fail($ip);
        return false;
    }

    _throttle_clear($ip);
    session_regenerate_id(true);
    $_SESSION['vefs_admin'] = true;
    $_SESSION['vefs_last_seen'] = time();
    return true;
}

function auth_logout(): void {
    auth_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', $p['secure'], $p['httponly']);
    }
    session_destroy();
}

function _throttle_path(): string { return __DIR__ . '/../data/.login-attempts.json'; }

function _throttle_load(): array {
    $p = _throttle_path();
    if (!is_file($p)) return [];
    $data = json_decode((string)file_get_contents($p), true);
    return is_array($data) ? $data : [];
}

function _throttle_save(array $data): void {
    file_put_contents(_throttle_path(), json_encode($data, JSON_PRETTY_PRINT));
}

function _throttle_is_locked(string $ip): bool {
    $cfg = auth_config();
    $data = _throttle_load();
    $rec = $data[$ip] ?? null;
    if (!$rec) return false;
    $window = $cfg['login_throttle_window_seconds'];
    if (time() - (int)$rec['first'] > $window) return false;
    return (int)$rec['count'] >= (int)$cfg['login_throttle_max'];
}

function _throttle_record_fail(string $ip): void {
    $cfg = auth_config();
    $data = _throttle_load();
    $now = time();
    $rec = $data[$ip] ?? ['first' => $now, 'count' => 0];
    if ($now - (int)$rec['first'] > $cfg['login_throttle_window_seconds']) {
        $rec = ['first' => $now, 'count' => 0];
    }
    $rec['count']++;
    $data[$ip] = $rec;
    _throttle_save($data);
}

function _throttle_clear(string $ip): void {
    $data = _throttle_load();
    unset($data[$ip]);
    _throttle_save($data);
}

/**
 * Append-only audit log. One JSON object per line, flock-guarded.
 */
function audit_log(string $action, string $type = '', string $entityId = ''): void {
    $path = __DIR__ . '/../data/.audit-log.json';
    $entry = [
        'ts' => date('c'),
        'action' => $action,
        'type' => $type,
        'id' => $entityId,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'cli',
    ];
    $fp = fopen($path, 'a');
    if ($fp === false) return;
    if (flock($fp, LOCK_EX)) {
        fwrite($fp, json_encode($entry, JSON_UNESCAPED_SLASHES) . "\n");
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}
