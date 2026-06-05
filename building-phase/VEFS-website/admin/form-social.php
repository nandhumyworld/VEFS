<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';

auth_require();
$cfg = auth_config();
$id = $_GET['id'] ?? null;
$post = ['id' => '', 'order' => 10, 'platform' => 'youtube', 'post_url' => '', 'thumbnail_url' => '', 'caption' => ''];

$data = json_store_read(__DIR__ . '/../data/social.json');
if ($id) {
    foreach ($data['posts'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) { $post = array_merge($post, $p); break; }
    }
} else {
    $maxOrder = 0;
    foreach ($data['posts'] ?? [] as $p) $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
    $post['order'] = $maxOrder + 10;
}

$token = csrf_token();
$isEdit = $id !== null;
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Social Post</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Social Post</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=social">&larr; Back</a>
    </header>
    <form id="social-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>">
        <input type="hidden" name="original_id" value="<?= htmlspecialchars((string)($post['id'] ?? ''), ENT_QUOTES, 'UTF-8') ?>">

        <div>
            <label for="platform">Platform <span style="color:var(--color-error)">*</span></label>
            <select id="platform" name="platform">
                <option value="youtube" <?= $post['platform']==='youtube'?'selected':'' ?>>YouTube</option>
                <option value="instagram" <?= $post['platform']==='instagram'?'selected':'' ?>>Instagram</option>
                <option value="facebook" <?= $post['platform']==='facebook'?'selected':'' ?>>Facebook</option>
            </select>
        </div>

        <div>
            <label for="post_url">Post URL <span style="color:var(--color-error)">*</span></label>
            <input id="post_url" name="post_url" type="url" required value="<?= htmlspecialchars((string)$post['post_url'], ENT_QUOTES, 'UTF-8') ?>">
        </div>

        <div>
            <label>Thumbnail <span style="color:var(--color-error)">*</span></label>
            <input type="file" id="thumb-picker" accept="image/jpeg,image/png,image/webp">
            <button type="button" id="yt-thumb-btn" class="btn btn-ghost" style="margin-top:0.5rem">Use YouTube thumbnail from Post URL</button>
            <p id="thumb-hint" class="form-hint" style="margin-top:0.5rem;display:none;color:var(--color-muted,#666);font-size:0.9rem">For Instagram/Facebook there is no public thumbnail API — take a screenshot of the post/reel and upload it above.</p>
            <input type="hidden" name="thumbnail_url" id="thumb-url" value="<?= htmlspecialchars((string)$post['thumbnail_url'], ENT_QUOTES, 'UTF-8') ?>">
            <div class="upload-status" id="thumb-status"></div>
            <img id="thumb-preview" src="<?= htmlspecialchars((string)$post['thumbnail_url'], ENT_QUOTES, 'UTF-8') ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['thumbnail_url']?'':'display:none' ?>">
        </div>

        <div>
            <label for="caption">Caption <span style="color:var(--color-error)">*</span></label>
            <input id="caption" name="caption" type="text" maxlength="300" required value="<?= htmlspecialchars((string)$post['caption'], ENT_QUOTES, 'UTF-8') ?>">
        </div>

        <div>
            <label for="order">Order</label>
            <input id="order" name="order" type="number" min="0" value="<?= (int)$post['order'] ?>">
        </div>

        <?php
            $isNewRaw = $post['isNew'] ?? 'auto';
            $isNewVal = $isNewRaw === true ? 'true' : ($isNewRaw === false ? 'false' : 'auto');
        ?>
        <fieldset class="form-fieldset">
            <legend>"NEW" badge</legend>
            <p class="hint">Auto: shows for 7 days after creation. Use Force on / off to override.</p>
            <label>
                <input type="radio" name="isNew" value="auto" <?= $isNewVal==='auto'?'checked':'' ?>> Auto
            </label>
            <label>
                <input type="radio" name="isNew" value="true" <?= $isNewVal==='true'?'checked':'' ?>> Force on
            </label>
            <label>
                <input type="radio" name="isNew" value="false" <?= $isNewVal==='false'?'checked':'' ?>> Force off
            </label>
        </fieldset>

        <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=social">Cancel</a>
        </div>
    </form>
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
<script src="/admin/assets/form-social.js"></script>
</body>
</html>
