<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';

auth_require();
$cfg = auth_config();
$id = $_GET['id'] ?? null;
$post = [
    'id'               => '',
    'title'            => '',
    'description'      => '',
    'year'             => (int)date('Y'),
    'imageUrl'         => '',
    'isNew'            => 'auto',
    'disabled'         => false,
    'hiddenFromPublic' => false,
];

$data = json_store_read(__DIR__ . '/../data/gallery.json');
if ($id) {
    foreach ($data['items'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) { $post = array_merge($post, $p); break; }
    }
}

$token = csrf_token();
$isEdit = $id !== null;

$projectsList = [];
$projectsFile = __DIR__ . '/../data/projects.json';
if (file_exists($projectsFile)) {
    $projectsList = json_store_read($projectsFile)['projects'] ?? [];
}
$preselectedProjectId = $_GET['project_id'] ?? ($post['project_id'] ?? '');

$isNewRaw = $post['isNew'] ?? 'auto';
$isNewVal = $isNewRaw === true ? 'true' : ($isNewRaw === false ? 'false' : 'auto');
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Gallery Item</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Gallery Item</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=gallery">&larr; Back</a>
    </header>
    <form id="gallery-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>">
        <input type="hidden" name="original_id" value="<?= htmlspecialchars((string)($post['id'] ?? ''), ENT_QUOTES, 'UTF-8') ?>">

        <div>
            <label>Photo <span style="color:var(--color-error)">*</span></label>
            <input type="file" id="image-picker" accept="image/jpeg,image/png,image/webp">
            <p class="form-hint" style="margin-top:0.5rem;color:var(--color-muted,#666);font-size:0.9rem">JPG/PNG/WebP. Recommended &ge; 1200px wide. Uploads go to Cloudinary CDN.</p>
            <input type="hidden" name="imageUrl" id="image-url" value="<?= htmlspecialchars((string)$post['imageUrl'], ENT_QUOTES, 'UTF-8') ?>">
            <div class="upload-status" id="image-status"></div>
            <img id="image-preview" src="<?= htmlspecialchars((string)$post['imageUrl'], ENT_QUOTES, 'UTF-8') ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['imageUrl']?'':'display:none' ?>">
        </div>

        <div>
            <label for="title">Title <span style="color:var(--color-error)">*</span></label>
            <input id="title" name="title" type="text" maxlength="200" required value="<?= htmlspecialchars((string)$post['title'], ENT_QUOTES, 'UTF-8') ?>">
        </div>

        <div>
            <label for="description">Description</label>
            <textarea id="description" name="description" maxlength="500" rows="3"><?= htmlspecialchars((string)$post['description'], ENT_QUOTES, 'UTF-8') ?></textarea>
        </div>

        <div>
            <label for="year">Year <span style="color:var(--color-error)">*</span></label>
            <input id="year" name="year" type="number" min="2000" max="<?= (int)date('Y') ?>" required value="<?= htmlspecialchars((string)$post['year'], ENT_QUOTES, 'UTF-8') ?>">
        </div>

        <div>
            <label for="project_id">Linked Project (optional)</label>
            <select id="project_id" name="project_id">
                <option value="">— None —</option>
                <?php foreach ($projectsList as $proj): if (!empty($proj['disabled'])) continue; ?>
                    <option value="<?= htmlspecialchars((string)$proj['id'], ENT_QUOTES, 'UTF-8') ?>" <?= $preselectedProjectId === $proj['id'] ? 'selected' : '' ?>>
                        <?= htmlspecialchars((string)$proj['name'], ENT_QUOTES, 'UTF-8') ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

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
            <label><input type="checkbox" name="disabled" <?= !empty($post['disabled']) ? 'checked' : '' ?>> Disabled</label>
        </div>

        <div>
            <label><input type="checkbox" name="hiddenFromPublic" <?= !empty($post['hiddenFromPublic']) ? 'checked' : '' ?>> Hidden from public page</label>
        </div>

        <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=gallery">Cancel</a>
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
<script src="/admin/assets/form-gallery.js"></script>
</body>
</html>
