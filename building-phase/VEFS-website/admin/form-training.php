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
    'id' => '', 'slug' => '', 'title' => '', 'category' => 'farming', 'status' => 'open',
    'featured' => false, 'order' => 10,
    'schedule' => [
        'type' => 'daily-immersive', 'sessions' => [],
        'dailyStructure' => ['morning' => '', 'afternoon' => '', 'evening' => '', 'night' => ''],
        'timezone' => 'Asia/Kolkata',
    ],
    'totalDuration' => ['value' => 1, 'unit' => 'months'],
    'location' => ['type' => 'offline', 'venue' => '', 'city' => '', 'state' => '', 'country' => 'India'],
    'audience' => [], 'targetAudience' => '',
    'capacity' => ['total' => 0, 'registered' => 0, 'available' => 0],
    'description' => ['brief' => '', 'full' => '', 'objectives' => [], 'curriculum' => [], 'outcomes' => [], 'requirements' => []],
    'facilitators' => [],
    'registration' => ['required' => true, 'fee' => ['amount' => 0, 'currency' => 'INR', 'type' => 'free'], 'notes' => ''],
    'media' => ['featuredImage' => '', 'heroImage' => ''],
];
$post = $default;
$data = json_store_read(admin_data_file('training'));
if ($id) {
    foreach ($data['trainings'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) {
            $post = array_replace_recursive($default, $p);
            break;
        }
    }
} else {
    $maxOrder = 0;
    foreach ($data['trainings'] ?? [] as $p) $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
    $post['order'] = $maxOrder + 10;
}

$token = csrf_token();
$isEdit = $id !== null;
$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Training</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Training</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=training">&larr; Back</a>
    </header>
    <form id="training-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= $h($token) ?>">
        <input type="hidden" name="original_id" value="<?= $h($post['id']) ?>">

        <fieldset><legend>Basics</legend>
            <label>Title *<input id="title" type="text" required maxlength="200" value="<?= $h($post['title']) ?>"></label>
            <label>Slug<input id="slug" type="text" value="<?= $h($post['slug']) ?>"></label>
            <label>Category *
                <select id="category">
                    <?php foreach (['farming','conservation','skills-development','livelihood','other'] as $c): ?>
                        <option value="<?= $c ?>" <?= $post['category']===$c?'selected':'' ?>><?= $c ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Status *
                <select id="status">
                    <?php foreach (['open','full','upcoming','completed','cancelled'] as $s): ?>
                        <option value="<?= $s ?>" <?= $post['status']===$s?'selected':'' ?>><?= $s ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Order<input id="order" type="number" min="0" value="<?= (int)$post['order'] ?>"></label>
            <label class="checkbox"><input id="featured" type="checkbox" <?= $post['featured']?'checked':'' ?>> Featured</label>
        </fieldset>

        <fieldset><legend>Schedule</legend>
            <label>Type
                <select id="schedule-type">
                    <?php foreach (['daily-immersive','weekend-sessions','online','hybrid'] as $t): ?>
                        <option value="<?= $t ?>" <?= $post['schedule']['type']===$t?'selected':'' ?>><?= $t ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Timezone<input id="schedule-timezone" type="text" value="<?= $h($post['schedule']['timezone']) ?>"></label>
            <label>Morning routine<textarea id="dailyStructure-morning" rows="2"><?= $h($post['schedule']['dailyStructure']['morning']) ?></textarea></label>
            <label>Afternoon<textarea id="dailyStructure-afternoon" rows="2"><?= $h($post['schedule']['dailyStructure']['afternoon']) ?></textarea></label>
            <label>Evening<textarea id="dailyStructure-evening" rows="2"><?= $h($post['schedule']['dailyStructure']['evening']) ?></textarea></label>
            <label>Night<textarea id="dailyStructure-night" rows="2"><?= $h($post['schedule']['dailyStructure']['night']) ?></textarea></label>
            <div>Sessions (optional — for weekend-style schedules)</div>
            <div id="sessions-rows"></div>
            <button type="button" id="add-session" class="btn btn-ghost">+ Add session</button>
        </fieldset>

        <fieldset><legend>Total duration</legend>
            <label>Value<input id="totalDuration-value" type="number" min="0" value="<?= (int)$post['totalDuration']['value'] ?>"></label>
            <label>Unit
                <select id="totalDuration-unit">
                    <?php foreach (['days','weeks','months'] as $u): ?>
                        <option value="<?= $u ?>" <?= $post['totalDuration']['unit']===$u?'selected':'' ?>><?= $u ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
        </fieldset>

        <fieldset><legend>Location</legend>
            <label>Type
                <select id="location-type">
                    <?php foreach (['offline','online','hybrid'] as $l): ?>
                        <option value="<?= $l ?>" <?= $post['location']['type']===$l?'selected':'' ?>><?= $l ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Venue<input id="location-venue" type="text" value="<?= $h($post['location']['venue']) ?>"></label>
            <label>City<input id="location-city" type="text" value="<?= $h($post['location']['city']) ?>"></label>
            <label>State<input id="location-state" type="text" value="<?= $h($post['location']['state']) ?>"></label>
            <label>Country<input id="location-country" type="text" value="<?= $h($post['location']['country']) ?>"></label>
        </fieldset>

        <fieldset><legend>Audience</legend>
            <label>Audience tags (one per line)<textarea id="audience" rows="4"><?= $h(implode("\n", $post['audience'])) ?></textarea></label>
            <label>Target audience paragraph<textarea id="targetAudience" rows="3"><?= $h($post['targetAudience']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Capacity</legend>
            <label>Total<input id="capacity-total" type="number" min="0" value="<?= (int)$post['capacity']['total'] ?>"></label>
            <label>Registered<input id="capacity-registered" type="number" min="0" value="<?= (int)$post['capacity']['registered'] ?>"></label>
            <p class="form-hint">"Available" is calculated on save (total − registered).</p>
        </fieldset>

        <fieldset><legend>Description</legend>
            <label>Brief (≤ 500) *<textarea id="brief" rows="3" maxlength="500" required><?= $h($post['description']['brief']) ?></textarea></label>
            <label>Full *<textarea id="full" rows="10" required><?= $h($post['description']['full']) ?></textarea></label>
            <label>Objectives (one per line)<textarea id="objectives" rows="6"><?= $h(implode("\n", $post['description']['objectives'])) ?></textarea></label>
            <label>Outcomes (one per line)<textarea id="outcomes" rows="6"><?= $h(implode("\n", $post['description']['outcomes'])) ?></textarea></label>
            <label>Requirements (one per line)<textarea id="requirements-list" rows="6"><?= $h(implode("\n", $post['description']['requirements'])) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Curriculum (modules)</legend>
            <div id="curriculum-rows"></div>
            <button type="button" id="add-curriculum" class="btn btn-ghost">+ Add module</button>
            <p class="form-hint">For each module, enter topics one per line in the second box.</p>
        </fieldset>

        <fieldset><legend>Facilitators</legend>
            <div id="facilitators-rows"></div>
            <button type="button" id="add-facilitator" class="btn btn-ghost">+ Add facilitator</button>
        </fieldset>

        <fieldset><legend>Registration</legend>
            <label class="checkbox"><input id="registration-required" type="checkbox" <?= $post['registration']['required']?'checked':'' ?>> Required</label>
            <label>Fee amount<input id="fee-amount" type="number" min="0" value="<?= (int)$post['registration']['fee']['amount'] ?>"></label>
            <label>Fee type
                <select id="fee-type">
                    <?php foreach (['free','paid','donation'] as $t): ?>
                        <option value="<?= $t ?>" <?= $post['registration']['fee']['type']===$t?'selected':'' ?>><?= $t ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Notes<textarea id="registration-notes" rows="2"><?= $h($post['registration']['notes']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Media</legend>
            <label>Featured image
                <input type="file" id="featured-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="featured-url" value="<?= $h($post['media']['featuredImage']) ?>">
                <div class="upload-status" id="featured-status"></div>
                <img id="featured-preview" src="<?= $h($post['media']['featuredImage']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['media']['featuredImage']?'':'display:none' ?>">
            </label>
            <label>Hero image
                <input type="file" id="hero-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="hero-url" value="<?= $h($post['media']['heroImage']) ?>">
                <div class="upload-status" id="hero-status"></div>
                <img id="hero-preview" src="<?= $h($post['media']['heroImage']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['media']['heroImage']?'':'display:none' ?>">
            </label>
        </fieldset>

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
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=training">Cancel</a>
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
    sessions: <?= json_encode($post['schedule']['sessions']) ?>,
    curriculum: <?= json_encode(array_map(
        fn($c) => ['module' => $c['module'] ?? '', 'topicsText' => implode("\n", $c['topics'] ?? [])],
        $post['description']['curriculum']
    )) ?>,
    facilitators: <?= json_encode($post['facilitators']) ?>,
};
</script>
<script src="/admin/assets/admin.js"></script>
<script src="/admin/assets/form-training.js"></script>
</body>
</html>
