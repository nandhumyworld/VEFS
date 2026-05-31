<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';
require __DIR__ . '/../includes/admin-helpers.php';

auth_require();

$tab = $_GET['tab'] ?? 'blog';
if (!in_array($tab, ['blog', 'social', 'event', 'training', 'volunteer'], true)) {
    $tab = 'blog';
}

$file = admin_data_file($tab);
$arrayKey = admin_array_key_for_type($tab);
$data = json_store_read($file);
$items = $data[$arrayKey] ?? [];
usort($items, fn($a, $b) => ($a['order'] ?? PHP_INT_MAX) <=> ($b['order'] ?? PHP_INT_MAX));
$csrf = csrf_token();
$cfg = auth_config();

$tabLabels = [
    'blog'      => 'Blog Posts',
    'social'    => 'Social Posts',
    'event'     => 'Events',
    'training'  => 'Trainings',
    'volunteer' => 'Volunteers',
];
$titleColLabel = $tab === 'social' ? 'Caption' : 'Title';
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — Dashboard</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1>VEFS Admin</h1>
        <a class="btn btn-ghost" href="/admin/logout.php">Sign out</a>
    </header>
    <nav class="admin-tabs">
        <?php foreach ($tabLabels as $key => $label): ?>
            <a href="?tab=<?= $key ?>" class="<?= $tab === $key ? 'active' : '' ?>"><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8') ?></a>
        <?php endforeach; ?>
    </nav>

    <div style="margin-bottom:1rem;">
        <a class="btn btn-primary" href="/admin/form-<?= $tab ?>.php">+ New <?= htmlspecialchars(rtrim($tabLabels[$tab], 's'), ENT_QUOTES, 'UTF-8') ?></a>
    </div>

    <table class="admin-table" data-csrf="<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>" data-type="<?= $tab ?>">
        <thead>
        <tr>
            <th style="width:80px">Image</th>
            <th><?= $titleColLabel ?></th>
            <th style="width:100px">Status</th>
            <th style="width:90px">Order</th>
            <th style="width:60px"></th>
            <th style="width:160px">Actions</th>
        </tr>
        </thead>
        <tbody>
        <?php if (empty($items)): ?>
            <tr><td colspan="6" style="text-align:center;color:#888;padding:2rem">No items yet.</td></tr>
        <?php else: foreach ($items as $i => $p): ?>
            <tr data-id="<?= htmlspecialchars((string)$p['id'], ENT_QUOTES, 'UTF-8') ?>">
                <td>
                    <?php $img = admin_display_thumb($tab, $p); ?>
                    <?php if ($img): ?><img src="<?= htmlspecialchars($img, ENT_QUOTES, 'UTF-8') ?>" alt=""><?php endif; ?>
                </td>
                <td><?= htmlspecialchars(admin_display_title($tab, $p), ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars((string)($p['status'] ?? '—'), ENT_QUOTES, 'UTF-8') ?></td>
                <td><input type="number" class="order-input" value="<?= (int)($p['order'] ?? 0) ?>" min="0"></td>
                <td>
                    <button class="btn btn-ghost arrow-up" title="Move up" <?= $i===0?'disabled':'' ?>>&#9650;</button>
                    <button class="btn btn-ghost arrow-down" title="Move down" <?= $i===count($items)-1?'disabled':'' ?>>&#9660;</button>
                </td>
                <td>
                    <a class="btn btn-ghost" href="/admin/form-<?= $tab ?>.php?id=<?= urlencode((string)$p['id']) ?>">Edit</a>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </td>
            </tr>
        <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>
<script>
window.VEFS_CONFIG = {
    cloudinary: {
        cloud_name: <?= json_encode($cfg['cloudinary']['cloud_name']) ?>,
        upload_preset: <?= json_encode($cfg['cloudinary']['upload_preset']) ?>,
    }
};
</script>
<script src="/admin/assets/admin.js"></script>
</body>
</html>
