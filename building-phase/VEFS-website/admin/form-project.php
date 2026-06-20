<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';
require __DIR__ . '/../includes/admin-helpers.php';

auth_require();
$cfg = auth_config();
$id = $_GET['id'] ?? null;

$default = [
    'id' => '', 'slug' => '', 'name' => '',
    'objective' => '', 'story' => '',
    'theme' => 'ecology', 'status' => 'active',
    'location' => '', 'start_date' => '', 'end_date' => '',
    'hero_image_url' => '',
    'photos' => [],
    'impact_metrics' => [],
    'fundraising' => ['target_amount' => 0, 'raised_amount' => 0, 'donor_count' => 0, 'show_progress' => true],
    'proposed_budget' => null,
    'expected_beneficiaries' => null,
    'required_volunteers' => null,
    'sponsorship_opportunities' => null,
    'featured' => false,
    'order' => 10,
    'disabled' => false,
    'hiddenFromPublic' => false,
];
$post = $default;
$data = json_store_read(admin_data_file('project'));
if ($id) {
    foreach ($data['projects'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) {
            $post = array_replace_recursive($default, $p);
            break;
        }
    }
} else {
    $maxOrder = 0;
    foreach ($data['projects'] ?? [] as $p) $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
    $post['order'] = $maxOrder + 10;
}

$token = csrf_token();
$isEdit = $id !== null;
$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
$themes = ['ecology' => 'Ecology', 'livelihood' => 'Livelihood', 'women' => 'Women', 'education' => 'Education', 'heritage' => 'Heritage'];
$statuses = ['planning' => 'Planning', 'active' => 'Active', 'completed' => 'Completed', 'paused' => 'Paused'];
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Project</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Project</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=project">&larr; Back</a>
    </header>
    <form id="project-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= $h($token) ?>">
        <input type="hidden" name="original_id" value="<?= $h($post['id']) ?>">

        <fieldset><legend>Basics</legend>
            <label>Name *<input id="name" type="text" required maxlength="200" value="<?= $h($post['name']) ?>"></label>
            <label>Slug (auto from name if blank)<input id="slug" type="text" value="<?= $h($post['slug']) ?>"></label>
            <label>Objective * <small>(<span id="objective-count">0</span>/140)</small>
                <textarea id="objective" rows="2" required maxlength="140"><?= $h($post['objective']) ?></textarea>
            </label>
            <label>Theme *
                <select id="theme">
                    <?php foreach ($themes as $k => $v): ?>
                        <option value="<?= $k ?>" <?= $post['theme']===$k?'selected':'' ?>><?= $v ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Status *
                <select id="status">
                    <?php foreach ($statuses as $k => $v): ?>
                        <option value="<?= $k ?>" <?= $post['status']===$k?'selected':'' ?>><?= $v ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Location *<input id="location" type="text" required value="<?= $h($post['location']) ?>"></label>
            <label>Start date *<input id="start_date" type="date" required value="<?= $h($post['start_date']) ?>"></label>
            <label data-show-when="status=completed">End date<input id="end_date" type="date" value="<?= $h($post['end_date']) ?>"></label>
            <label>Display order<input id="order" type="number" min="0" value="<?= (int)$post['order'] ?>"></label>
            <label class="checkbox"><input id="featured" type="checkbox" <?= $post['featured']?'checked':'' ?>> Featured (pins to hero carousel)</label>
        </fieldset>

        <fieldset><legend>Story & Photos</legend>
            <label>Hero image
                <input type="file" id="hero-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="hero-url" value="<?= $h($post['hero_image_url']) ?>">
                <div class="upload-status" id="hero-status"></div>
                <img id="hero-preview" src="<?= $h($post['hero_image_url']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['hero_image_url']?'':'display:none' ?>">
            </label>
            <label>Story (HTML allowed — sanitized on save)
                <textarea id="story" rows="14"><?= $h($post['story']) ?></textarea>
            </label>
            <label>Additional photos</label>
            <div id="photos-rows"></div>
            <button type="button" id="add-photo" class="btn btn-ghost">+ Upload photo</button>
            <p class="hint">Photos upload to Cloudinary once and are auto-added to the gallery, tagged to this project.</p>
        </fieldset>

        <fieldset><legend>Impact Metrics</legend>
            <p class="hint">Be specific — "12,400 trees" beats "many trees."</p>
            <div id="metrics-rows"></div>
            <button type="button" id="add-metric" class="btn btn-ghost">+ Add metric</button>
        </fieldset>

        <fieldset><legend>Fundraising</legend>
            <p class="hint">Update after each donation batch — visitors trust accurate numbers.</p>
            <label>Target amount (₹)<input id="target_amount" type="number" min="0" step="1" value="<?= (float)$post['fundraising']['target_amount'] ?>"></label>
            <label>Raised amount (₹)<input id="raised_amount" type="number" min="0" step="1" value="<?= (float)$post['fundraising']['raised_amount'] ?>"></label>
            <label>Donor count<input id="donor_count" type="number" min="0" step="1" value="<?= (int)$post['fundraising']['donor_count'] ?>"></label>
            <label class="checkbox"><input id="show_progress" type="checkbox" <?= $post['fundraising']['show_progress']?'checked':'' ?>> Show progress publicly</label>
        </fieldset>

        <fieldset data-show-when="status=planning"><legend>Future Project Fields</legend>
            <p class="hint">Only used when status is Planning.</p>
            <label>Proposed budget (₹)<input id="proposed_budget" type="number" min="0" step="1" value="<?= $post['proposed_budget']!==null?(float)$post['proposed_budget']:'' ?>"></label>
            <label>Expected beneficiaries<input id="expected_beneficiaries" type="text" value="<?= $h($post['expected_beneficiaries'] ?? '') ?>"></label>
            <label>Required volunteers<input id="required_volunteers" type="number" min="0" step="1" value="<?= $post['required_volunteers']!==null?(int)$post['required_volunteers']:'' ?>"></label>
            <label>Sponsorship opportunities (HTML allowed)
                <textarea id="sponsorship_opportunities" rows="6"><?= $h($post['sponsorship_opportunities'] ?? '') ?></textarea>
            </label>
        </fieldset>

        <?php if ($isEdit): ?>
        <fieldset><legend>Linked Activities</legend>
            <?php
            $linked = ['event' => [], 'training' => [], 'volunteer' => []];
            foreach ($linked as $t => $_) {
                $f = admin_data_file($t);
                if (file_exists($f)) {
                    $rows = json_store_read($f)[admin_array_key_for_type($t)] ?? [];
                    foreach ($rows as $r) {
                        if (($r['project_id'] ?? null) === $id) $linked[$t][] = $r;
                    }
                }
            }
            foreach ([['event','Events','event'], ['training','Trainings','training'], ['volunteer','Volunteer slots','volunteer']] as [$key, $label, $formKey]):
            ?>
            <div class="linked-block">
                <h4><?= $label ?></h4>
                <?php if (empty($linked[$key])): ?>
                    <p class="hint">No <?= strtolower($label) ?> linked yet.</p>
                <?php else: ?>
                    <ul>
                    <?php foreach ($linked[$key] as $row): ?>
                        <li><a href="/admin/form-<?= $formKey ?>.php?id=<?= urlencode((string)$row['id']) ?>"><?= $h($row['title'] ?? $row['name'] ?? $row['id']) ?></a></li>
                    <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
                <a class="btn btn-ghost" href="/admin/form-<?= $formKey ?>.php?project_id=<?= urlencode((string)$id) ?>">+ Link new <?= strtolower(rtrim($label,'s')) ?></a>
            </div>
            <?php endforeach; ?>
        </fieldset>
        <?php endif; ?>

        <fieldset><legend>Visibility</legend>
            <label class="checkbox"><input id="disabled" type="checkbox" <?= $post['disabled']?'checked':'' ?>> Disabled (hidden everywhere — admin can re-enable)</label>
            <label class="checkbox"><input id="hiddenFromPublic" type="checkbox" <?= $post['hiddenFromPublic']?'checked':'' ?>> Hide from public site (still visible in admin)</label>
        </fieldset>

        <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=project">Cancel</a>
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
window.VEFS_INITIAL = {
    photos: <?= json_encode($post['photos']) ?>,
    impact_metrics: <?= json_encode($post['impact_metrics']) ?>,
};
</script>
<script src="/admin/assets/admin.js"></script>
<script src="/admin/assets/form-project.js"></script>
</body>
</html>
