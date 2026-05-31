<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';

auth_require();

$cfg = auth_config();
$id = $_GET['id'] ?? null;
$post = [
    'id' => '', 'order' => 10, 'title' => '', 'subtitle' => '',
    'cover_image_url' => '', 'body_html' => '',
    'reference_links' => [], 'cta_text' => '', 'cta_url' => '',
];

if ($id) {
    $data = json_store_read(__DIR__ . '/../data/blog.json');
    foreach ($data['posts'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) { $post = array_merge($post, $p); break; }
    }
} else {
    $data = json_store_read(__DIR__ . '/../data/blog.json');
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
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Blog Post</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit Blog Post' : 'New Blog Post' ?></h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=blog">&larr; Back</a>
    </header>

    <form id="blog-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>">
        <input type="hidden" name="original_id" value="<?= htmlspecialchars((string)($post['id'] ?? ''), ENT_QUOTES, 'UTF-8') ?>">

        <div>
            <label for="title">Title <span style="color:var(--color-error)">*</span></label>
            <input id="title" name="title" type="text" maxlength="200" required value="<?= htmlspecialchars((string)$post['title'], ENT_QUOTES, 'UTF-8') ?>">
        </div>

        <div>
            <label for="subtitle">Subtitle</label>
            <input id="subtitle" name="subtitle" type="text" maxlength="300" value="<?= htmlspecialchars((string)$post['subtitle'], ENT_QUOTES, 'UTF-8') ?>">
        </div>

        <div>
            <label for="slug">URL slug (auto from title; edit if you want)</label>
            <input id="slug" name="slug" type="text" pattern="[a-z0-9-]+" value="<?= htmlspecialchars((string)$post['id'], ENT_QUOTES, 'UTF-8') ?>">
            <div style="font-size:0.85rem;color:var(--color-muted);margin-top:0.25rem">
                Share URL: <code id="share-url">/blog/<?= htmlspecialchars((string)$post['id'], ENT_QUOTES, 'UTF-8') ?></code>
                <button type="button" id="copy-share" class="btn btn-ghost" style="font-size:0.75rem;padding:0.2rem 0.5rem">Copy</button>
            </div>
        </div>

        <div>
            <label>Cover image</label>
            <input type="file" id="cover-picker" accept="image/jpeg,image/png,image/webp">
            <input type="hidden" name="cover_image_url" id="cover-url" value="<?= htmlspecialchars((string)$post['cover_image_url'], ENT_QUOTES, 'UTF-8') ?>">
            <div class="upload-status" id="cover-status"></div>
            <img id="cover-preview" src="<?= htmlspecialchars((string)$post['cover_image_url'], ENT_QUOTES, 'UTF-8') ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['cover_image_url']?'':'display:none' ?>">
        </div>

        <div>
            <label for="body">Body (HTML)</label>
            <div class="toolbar">
                <button type="button" data-wrap="<strong>|</strong>"><b>B</b></button>
                <button type="button" data-wrap="<em>|</em>"><i>I</i></button>
                <button type="button" data-wrap="<h2>|</h2>">H2</button>
                <button type="button" data-wrap="<h3>|</h3>">H3</button>
                <button type="button" data-wrap="<p>|</p>">P</button>
                <button type="button" data-wrap="<ul>\n  <li>|</li>\n</ul>">UL</button>
                <button type="button" data-wrap="<blockquote>|</blockquote>">Quote</button>
                <button type="button" id="link-btn">Link</button>
                <button type="button" id="insert-img-btn">Insert image</button>
                <input type="file" id="inline-img-picker" accept="image/jpeg,image/png,image/webp" style="display:none">
            </div>
            <textarea id="body" name="body_html" required><?= htmlspecialchars((string)$post['body_html'], ENT_QUOTES, 'UTF-8') ?></textarea>
            <div class="upload-status" id="inline-status"></div>
            <details style="margin-top:0.5rem"><summary>Live preview</summary>
                <div id="preview" class="preview"></div>
            </details>
        </div>

        <div>
            <label>Reference links (label + URL)</label>
            <div id="ref-rows"></div>
            <button type="button" class="btn btn-ghost" id="add-ref">+ Add row</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 2fr;gap:0.5rem">
            <div>
                <label for="cta_text">CTA text</label>
                <input id="cta_text" name="cta_text" type="text" value="<?= htmlspecialchars((string)$post['cta_text'], ENT_QUOTES, 'UTF-8') ?>">
            </div>
            <div>
                <label for="cta_url">CTA URL</label>
                <input id="cta_url" name="cta_url" type="url" value="<?= htmlspecialchars((string)$post['cta_url'], ENT_QUOTES, 'UTF-8') ?>">
            </div>
        </div>

        <div>
            <label for="order">Order (lower = shown first)</label>
            <input id="order" name="order" type="number" min="0" value="<?= (int)$post['order'] ?>">
        </div>

        <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=blog">Cancel</a>
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
window.VEFS_INITIAL_REFS = <?= json_encode($post['reference_links'] ?: []) ?>;
</script>
<script src="/admin/assets/admin.js"></script>
<script src="/admin/assets/form-blog.js"></script>
</body>
</html>
