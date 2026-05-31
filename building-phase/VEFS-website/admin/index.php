<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';

auth_start_session();

if (auth_check_logged_in()) {
    header('Location: /admin/dashboard.php');
    exit;
}

$error = null;
$expired = isset($_GET['expired']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf'] ?? null)) {
        $error = 'Security token mismatch. Please try again.';
    } else {
        $pw = (string)($_POST['password'] ?? '');
        if (auth_attempt_login($pw)) {
            header('Location: /admin/dashboard.php');
            exit;
        } else {
            $error = 'Incorrect password, or too many failed attempts (15-minute lockout).';
        }
    }
}

$token = csrf_token();
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — Sign in</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body class="admin-login">
<main class="login-card">
    <h1>VEFS Admin</h1>
    <?php if ($expired): ?><p class="notice">Session expired. Please sign in again.</p><?php endif; ?>
    <?php if ($error): ?><p class="error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
    <form method="post" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>">
        <label for="pw">Password</label>
        <input id="pw" name="password" type="password" required autofocus>
        <button type="submit">Sign in</button>
    </form>
</main>
</body>
</html>
