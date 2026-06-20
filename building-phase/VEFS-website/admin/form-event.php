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
    'id' => '', 'slug' => '', 'title' => '', 'type' => 'market', 'status' => 'upcoming',
    'featured' => false, 'order' => 10,
    'recurring' => ['isRecurring' => false, 'frequency' => '', 'pattern' => '', 'label' => ''],
    'date' => ['start' => '', 'end' => '', 'timezone' => 'Asia/Kolkata'],
    'duration' => ['value' => 0, 'unit' => 'hours'],
    'location' => ['type' => 'in-person', 'venue' => '', 'address' => '', 'city' => '', 'state' => '', 'mapUrl' => ''],
    'shortDescription' => '', 'fullDescription' => '',
    'agenda' => [], 'speakers' => [],
    'organizer' => ['name' => '', 'email' => '', 'phone' => ''],
    'registration' => ['required' => false, 'fee' => ['amount' => 0, 'currency' => 'INR', 'type' => 'free']],
    'capacity' => '',
    'requirements' => ['age' => ['min' => '', 'max' => ''], 'whatToBring' => []],
    'links' => ['whatsapp' => '', 'youtube' => '', 'map' => ''],
    'images' => ['featured' => '', 'hero' => ''],
    'tags' => [],
];
$post = $default;
$data = json_store_read(admin_data_file('event'));
if ($id) {
    foreach ($data['events'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) {
            $post = array_replace_recursive($default, $p);
            break;
        }
    }
} else {
    $maxOrder = 0;
    foreach ($data['events'] ?? [] as $p) $maxOrder = max($maxOrder, (int)($p['order'] ?? 0));
    $post['order'] = $maxOrder + 10;
}

$token = csrf_token();
$isEdit = $id !== null;
$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');

$projectsList = [];
$projectsFile = __DIR__ . '/../data/projects.json';
if (file_exists($projectsFile)) {
    $projectsList = json_store_read($projectsFile)['projects'] ?? [];
}
$preselectedProjectId = $_GET['project_id'] ?? ($post['project_id'] ?? '');
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — <?= $isEdit ? 'Edit' : 'New' ?> Event</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
    <header class="admin-header">
        <h1><?= $isEdit ? 'Edit' : 'New' ?> Event</h1>
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=event">&larr; Back</a>
    </header>
    <form id="event-form" class="form-grid" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= $h($token) ?>">
        <input type="hidden" name="original_id" value="<?= $h($post['id']) ?>">

        <fieldset><legend>Basics</legend>
            <label>Title *<input id="title" name="title" type="text" required maxlength="200" value="<?= $h($post['title']) ?>"></label>
            <label>Slug (auto from title if blank)<input id="slug" name="slug" type="text" value="<?= $h($post['slug']) ?>"></label>
            <label>Type *
                <select id="type" name="type">
                    <?php foreach (['market','workshop','conference','meetup','celebration','other'] as $t): ?>
                        <option value="<?= $t ?>" <?= $post['type']===$t?'selected':'' ?>><?= ucfirst($t) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Status *
                <select id="status" name="status">
                    <?php foreach (['upcoming','completed','cancelled'] as $s): ?>
                        <option value="<?= $s ?>" <?= $post['status']===$s?'selected':'' ?>><?= ucfirst($s) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Order<input id="order" name="order" type="number" min="0" value="<?= (int)$post['order'] ?>"></label>
            <label class="checkbox"><input id="featured" name="featured" type="checkbox" <?= $post['featured']?'checked':'' ?>> Featured</label>
            <label>Linked Project (optional)
                <select id="project_id">
                    <option value="">— None —</option>
                    <?php foreach ($projectsList as $proj): if (!empty($proj['disabled'])) continue; ?>
                        <option value="<?= $h($proj['id']) ?>" <?= $preselectedProjectId === $proj['id'] ? 'selected' : '' ?>><?= $h($proj['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
        </fieldset>

        <fieldset><legend>Recurring</legend>
            <label class="checkbox"><input id="recurring-isRecurring" type="checkbox" <?= $post['recurring']['isRecurring']?'checked':'' ?>> Is recurring</label>
            <label>Frequency
                <select id="recurring-frequency">
                    <?php foreach (['','weekly','monthly','yearly'] as $f): ?>
                        <option value="<?= $f ?>" <?= $post['recurring']['frequency']===$f?'selected':'' ?>><?= $f?:'(none)' ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Pattern (e.g. "2nd-sunday")<input id="recurring-pattern" type="text" value="<?= $h($post['recurring']['pattern']) ?>"></label>
            <label>Label (display text)<input id="recurring-label" type="text" value="<?= $h($post['recurring']['label']) ?>"></label>
        </fieldset>

        <fieldset><legend>Date & duration</legend>
            <label>Start (ISO 8601) *<input id="date-start" type="text" required value="<?= $h($post['date']['start']) ?>" placeholder="2026-06-01T09:00:00+05:30"></label>
            <label>End (ISO 8601) *<input id="date-end" type="text" required value="<?= $h($post['date']['end']) ?>" placeholder="2026-06-01T18:00:00+05:30"></label>
            <label>Timezone<input id="date-timezone" type="text" value="<?= $h($post['date']['timezone']) ?>"></label>
            <label>Duration value<input id="duration-value" type="number" min="0" value="<?= (int)$post['duration']['value'] ?>"></label>
            <label>Duration unit
                <select id="duration-unit">
                    <?php foreach (['minutes','hours','days'] as $u): ?>
                        <option value="<?= $u ?>" <?= $post['duration']['unit']===$u?'selected':'' ?>><?= $u ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
        </fieldset>

        <fieldset><legend>Location</legend>
            <label>Type
                <select id="location-type">
                    <?php foreach (['in-person','online','hybrid'] as $l): ?>
                        <option value="<?= $l ?>" <?= $post['location']['type']===$l?'selected':'' ?>><?= $l ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Venue<input id="location-venue" type="text" value="<?= $h($post['location']['venue']) ?>"></label>
            <label>Address<input id="location-address" type="text" value="<?= $h($post['location']['address']) ?>"></label>
            <label>City<input id="location-city" type="text" value="<?= $h($post['location']['city']) ?>"></label>
            <label>State<input id="location-state" type="text" value="<?= $h($post['location']['state']) ?>"></label>
            <label>Map URL<input id="location-mapUrl" type="url" value="<?= $h($post['location']['mapUrl']) ?>"></label>
        </fieldset>

        <fieldset><legend>Descriptions</legend>
            <label>Short (≤ 500 chars) *<textarea id="shortDescription" rows="3" maxlength="500" required><?= $h($post['shortDescription']) ?></textarea></label>
            <label>Full *<textarea id="fullDescription" rows="10" required><?= $h($post['fullDescription']) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Agenda</legend>
            <div id="agenda-rows"></div>
            <button type="button" id="add-agenda" class="btn btn-ghost">+ Add agenda item</button>
        </fieldset>

        <fieldset><legend>Speakers</legend>
            <div id="speakers-rows"></div>
            <button type="button" id="add-speaker" class="btn btn-ghost">+ Add speaker</button>
        </fieldset>

        <fieldset><legend>Organizer</legend>
            <label>Name<input id="organizer-name" type="text" value="<?= $h($post['organizer']['name']) ?>"></label>
            <label>Email<input id="organizer-email" type="email" value="<?= $h($post['organizer']['email']) ?>"></label>
            <label>Phone<input id="organizer-phone" type="text" value="<?= $h($post['organizer']['phone']) ?>"></label>
        </fieldset>

        <fieldset><legend>Registration & capacity</legend>
            <label class="checkbox"><input id="registration-required" type="checkbox" <?= $post['registration']['required']?'checked':'' ?>> Registration required</label>
            <label>Fee amount<input id="fee-amount" type="number" min="0" value="<?= (int)$post['registration']['fee']['amount'] ?>"></label>
            <label>Fee type
                <select id="fee-type">
                    <?php foreach (['free','paid','donation'] as $t): ?>
                        <option value="<?= $t ?>" <?= $post['registration']['fee']['type']===$t?'selected':'' ?>><?= $t ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Capacity (blank for unlimited)<input id="capacity" type="number" min="0" value="<?= $post['capacity']===null||$post['capacity']===''?'':(int)$post['capacity'] ?>"></label>
        </fieldset>

        <fieldset><legend>Requirements</legend>
            <label>Min age (blank = no min)<input id="age-min" type="number" min="0" value="<?= $post['requirements']['age']['min']===null||$post['requirements']['age']['min']===''?'':(int)$post['requirements']['age']['min'] ?>"></label>
            <label>Max age (blank = no max)<input id="age-max" type="number" min="0" value="<?= $post['requirements']['age']['max']===null||$post['requirements']['age']['max']===''?'':(int)$post['requirements']['age']['max'] ?>"></label>
            <label>What to bring (one per line)<textarea id="whatToBring" rows="4"><?= $h(implode("\n", $post['requirements']['whatToBring'])) ?></textarea></label>
        </fieldset>

        <fieldset><legend>Links</legend>
            <label>WhatsApp URL<input id="link-whatsapp" type="url" value="<?= $h($post['links']['whatsapp']) ?>"></label>
            <label>YouTube URL<input id="link-youtube" type="url" value="<?= $h($post['links']['youtube']) ?>"></label>
            <label>Map URL<input id="link-map" type="url" value="<?= $h($post['links']['map']) ?>"></label>
        </fieldset>

        <fieldset><legend>Images (uploaded to Cloudinary)</legend>
            <label>Featured image
                <input type="file" id="featured-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="featured-url" value="<?= $h($post['images']['featured']) ?>">
                <div class="upload-status" id="featured-status"></div>
                <img id="featured-preview" src="<?= $h($post['images']['featured']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['images']['featured']?'':'display:none' ?>">
            </label>
            <label>Hero image
                <input type="file" id="hero-picker" accept="image/jpeg,image/png,image/webp">
                <input type="hidden" id="hero-url" value="<?= $h($post['images']['hero']) ?>">
                <div class="upload-status" id="hero-status"></div>
                <img id="hero-preview" src="<?= $h($post['images']['hero']) ?>" style="max-width:280px;margin-top:0.5rem;<?= $post['images']['hero']?'':'display:none' ?>">
            </label>
        </fieldset>

        <fieldset><legend>Tags (comma-separated)</legend>
            <input id="tags" type="text" value="<?= $h(implode(', ', $post['tags'])) ?>">
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
            <a class="btn btn-ghost" href="/admin/dashboard.php?tab=event">Cancel</a>
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
    agenda: <?= json_encode($post['agenda']) ?>,
    speakers: <?= json_encode($post['speakers']) ?>,
};
</script>
<script src="/admin/assets/admin.js"></script>
<script src="/admin/assets/form-event.js"></script>
</body>
</html>
