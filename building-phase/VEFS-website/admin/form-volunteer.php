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
    'id' => '', 'slug' => '', 'title' => '', 'order' => 10, 'status' => 'open',
    'description' => ['brief' => '', 'full' => ''],
    'dates' => ['start' => 'TBD', 'end' => 'TBD'],
    'duration' => ['value' => 0, 'unit' => 'months'],
    'commitment' => '',
    'requirements' => [
        'age' => ['min' => '', 'max' => ''],
        'skills' => [], 'physical' => '', 'education' => '',
    ],
    'benefits' => [
        'learning' => [], 'certificate' => false, 'meals' => false, 'accommodation' => false,
        'stipend' => ['provided' => false, 'amount' => 0],
    ],
    'relatedEvents' => [],
    'location' => ['type' => 'on-site', 'city' => '', 'state' => ''],
    'spots' => ['total' => 0, 'filled' => 0, 'available' => 0],
    'contact' => ['name' => '', 'email' => '', 'phone' => ''],
    'media' => ['featuredImage' => ''],
];
$post = $default;
$data = json_store_read(admin_data_file('volunteer'));
if ($id) {
    foreach ($data['volunteers'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) {
            $post = array_replace_recursive($default, $p);
            break;
        }
    }
} else {
    $maxOrder = 0;
    foreach ($data['volunteers'] ?? [] as $p) $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
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
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Volunteer Opportunity</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Volunteer Opportunity</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=volunteer">&larr; Back</a>
    </header>
    <form id="volunteer-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= $h($token) ?>">
        <input type="hidden" name="original_id" value="<?= $h($post['id']) ?>">

        <fieldset><legend>Basics</legend>
            <label>Title *<input id="title" type="text" required maxlength="200" value="<?= $h($post['title']) ?>"></label>
            <label>Slug<input id="slug" type="text" value="<?= $h($post['slug']) ?>"></label>
            <label>Status *
                <select id="status">
                    <?php foreach (['open','full','closed'] as $s): ?>
                        <option value="<?= $s ?>" <?= $post['status']===$s?'selected':'' ?>><?= $s ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Order<input id="order" type="number" min="0" value="<?= (int)$post['order'] ?>"></label>
            <label>Commitment<input id="commitment" type="text" value="<?= $h($post['commitment']) ?>" placeholder="Full-time / Part-time / Weekends"></label>
        </fieldset>

        <fieldset><legend>Description</legend>
            <label>Brief (≤ 500) *<textarea id="brief" rows="3" maxlength="500" required><?= $h($post['description']['brief']) ?></textarea></label>
            <label>Full *<textarea id="full" rows="8" required><?= $h($post['description']['full']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Dates & duration</legend>
            <label>Start ("TBD" or ISO date)<input id="dates-start" type="text" value="<?= $h($post['dates']['start']) ?>" placeholder="TBD or 2026-06-01"></label>
            <label>End<input id="dates-end" type="text" value="<?= $h($post['dates']['end']) ?>" placeholder="TBD or 2026-09-01"></label>
            <label>Duration value<input id="duration-value" type="number" min="0" value="<?= (int)$post['duration']['value'] ?>"></label>
            <label>Duration unit
                <select id="duration-unit">
                    <?php foreach (['days','weeks','months','years'] as $u): ?>
                        <option value="<?= $u ?>" <?= $post['duration']['unit']===$u?'selected':'' ?>><?= $u ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
        </fieldset>

        <fieldset><legend>Requirements</legend>
            <label>Min age (blank = none)<input id="age-min" type="number" min="0" value="<?= $post['requirements']['age']['min']===null||$post['requirements']['age']['min']===''?'':(int)$post['requirements']['age']['min'] ?>"></label>
            <label>Max age (blank = none)<input id="age-max" type="number" min="0" value="<?= $post['requirements']['age']['max']===null||$post['requirements']['age']['max']===''?'':(int)$post['requirements']['age']['max'] ?>"></label>
            <label>Skills (one per line)<textarea id="skills" rows="4"><?= $h(implode("\n", $post['requirements']['skills'])) ?></textarea></label>
            <label>Physical requirements<textarea id="physical" rows="3"><?= $h($post['requirements']['physical']) ?></textarea></label>
            <label>Education requirements<textarea id="education" rows="2"><?= $h($post['requirements']['education']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Benefits</legend>
            <label>What you'll learn (one per line)<textarea id="learning" rows="5"><?= $h(implode("\n", $post['benefits']['learning'])) ?></textarea></label>
            <label class="checkbox"><input id="ben-certificate" type="checkbox" <?= $post['benefits']['certificate']?'checked':'' ?>> Certificate</label>
            <label class="checkbox"><input id="ben-meals" type="checkbox" <?= $post['benefits']['meals']?'checked':'' ?>> Meals</label>
            <label class="checkbox"><input id="ben-accommodation" type="checkbox" <?= $post['benefits']['accommodation']?'checked':'' ?>> Accommodation</label>
            <label class="checkbox"><input id="stipend-provided" type="checkbox" <?= $post['benefits']['stipend']['provided']?'checked':'' ?>> Stipend provided</label>
            <label>Stipend amount (INR)<input id="stipend-amount" type="number" min="0" value="<?= (int)$post['benefits']['stipend']['amount'] ?>"></label>
        </fieldset>

        <fieldset><legend>Related events (event ids, one per line)</legend>
            <textarea id="relatedEvents" rows="3"><?= $h(implode("\n", $post['relatedEvents'])) ?></textarea>
        </fieldset>

        <fieldset><legend>Location</legend>
            <label>Type
                <select id="location-type">
                    <?php foreach (['on-site','remote','hybrid'] as $l): ?>
                        <option value="<?= $l ?>" <?= $post['location']['type']===$l?'selected':'' ?>><?= $l ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>City<input id="location-city" type="text" value="<?= $h($post['location']['city']) ?>"></label>
            <label>State<input id="location-state" type="text" value="<?= $h($post['location']['state']) ?>"></label>
        </fieldset>

        <fieldset><legend>Spots</legend>
            <label>Total<input id="spots-total" type="number" min="0" value="<?= (int)$post['spots']['total'] ?>"></label>
            <label>Filled<input id="spots-filled" type="number" min="0" value="<?= (int)$post['spots']['filled'] ?>"></label>
            <p class="form-hint">"Available" is calculated on save (total − filled).</p>
        </fieldset>

        <fieldset><legend>Contact</legend>
            <label>Name<input id="contact-name" type="text" value="<?= $h($post['contact']['name']) ?>"></label>
            <label>Email<input id="contact-email" type="email" value="<?= $h($post['contact']['email']) ?>"></label>
            <label>Phone<input id="contact-phone" type="text" value="<?= $h($post['contact']['phone']) ?>"></label>
        </fieldset>

        <fieldset><legend>Featured image</legend>
            <input type="file" id="featured-picker" accept="image/jpeg,image/png,image/webp">
            <input type="hidden" id="featured-url" value="<?= $h($post['media']['featuredImage']) ?>">
            <div class="upload-status" id="featured-status"></div>
            <img id="featured-preview" src="<?= $h($post['media']['featuredImage']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['media']['featuredImage']?'':'display:none' ?>">
        </fieldset>

        <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=volunteer">Cancel</a>
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
<script src="/admin/assets/form-volunteer.js"></script>
</body>
</html>
