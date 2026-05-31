<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
auth_logout();
header('Location: /admin/index.php');
exit;
