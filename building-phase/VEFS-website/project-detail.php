<?php
declare(strict_types=1);
require __DIR__ . '/includes/json-store.php';

$slug = $_GET['slug'] ?? '';
$project = null;
if (preg_match('/^[a-z0-9-]+$/', $slug)) {
    $data = json_store_read(__DIR__ . '/data/projects.json');
    foreach ($data['projects'] ?? [] as $p) {
        if (($p['slug'] ?? null) === $slug) { $project = $p; break; }
    }
    if ($project && (!empty($project['disabled']) || !empty($project['hiddenFromPublic']) || ($project['enabled'] ?? null) === false)) {
        $project = null;
    }
}

if (!$project) {
    http_response_code(404);
    $title = 'Project not found — VEFS';
    $desc = 'The project you are looking for could not be found.';
    $cover = '';
} else {
    $title = htmlspecialchars($project['name'] . ' — VEFS Projects', ENT_QUOTES, 'UTF-8');
    $desc  = htmlspecialchars(mb_substr((string)($project['objective'] ?? ''), 0, 200), ENT_QUOTES, 'UTF-8');
    $cover = (string)($project['hero_image_url'] ?? '');
}

$canonical = 'https://' . ($_SERVER['HTTP_HOST'] ?? 'vefs.org') . '/projects/' . htmlspecialchars((string)$slug, ENT_QUOTES, 'UTF-8');

function _linked(string $file, string $key, string $projectId): array {
    if (!file_exists($file)) return [];
    $d = json_store_read($file);
    $rows = $d[$key] ?? [];
    return array_values(array_filter($rows, function ($r) use ($projectId) {
        return ($r['project_id'] ?? null) === $projectId
            && empty($r['disabled'])
            && empty($r['hiddenFromPublic'])
            && ($r['enabled'] ?? null) !== false;
    }));
}
$projectId = $project['id'] ?? '';
$linkedEvents     = $project ? _linked(__DIR__ . '/data/events.json',     'events',     $projectId) : [];
$linkedTrainings  = $project ? _linked(__DIR__ . '/data/trainings.json',  'trainings',  $projectId) : [];
$linkedVolunteers = $project ? _linked(__DIR__ . '/data/volunteers.json', 'volunteers', $projectId) : [];

$fund = $project['fundraising'] ?? [];
$target = (float)($fund['target_amount'] ?? 0);
$raised = (float)($fund['raised_amount'] ?? 0);
$pct = $target > 0 ? min(100, (int)floor(100 * ($raised / $target))) : 0;
$inr = function ($n) { return '₹' . number_format((float)$n, 0, '.', ','); };
$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= $title ?></title>
<meta name="description" content="<?= $desc ?>">
<link rel="canonical" href="<?= $canonical ?>">

<meta property="og:type" content="article">
<meta property="og:url" content="<?= $canonical ?>">
<meta property="og:title" content="<?= $title ?>">
<meta property="og:description" content="<?= $desc ?>">
<?php if ($cover): ?><meta property="og:image" content="<?= htmlspecialchars($cover, ENT_QUOTES, 'UTF-8') ?>"><?php endif; ?>
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" type="image/x-icon" href="/images/icons/vefs-favicon.ico">
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/components/badge-new.css">
<link rel="stylesheet" href="/css/components/projects.css">
<link rel="stylesheet" href="/css/responsive-mobile.css">
</head>
<body>
  <!-- Header / Navigation -->
<header class="header" id="main-header">
  <div class="container">
    <div class="header-content">
      <div class="header-logo-section">
        <a href="/index.html" class="header-logo">
          <div class="logo-image-wrapper">
            <img src="/images/logos/vefs-logo.png" alt="VEFS Foundation Logo" width="60" height="60">
          </div>
          <div class="logo-text-wrapper">
            <span class="logo-text">VEFS Foundation</span>
            <span class="logo-text-full">Valluvam Ecological Farming</span>
            <span class="logo-text-full">and Social welfare foundation</span>
          </div>
        </a>
      </div>

      <div class="header-nav-section">
        <button class="nav-toggle" aria-label="Toggle navigation menu" aria-controls="main-nav" aria-expanded="false">
          <span class="nav-toggle-icon"></span>
        </button>
        <nav class="nav" id="main-nav">
          <div class="nav-social-mobile">
            <a href="https://www.facebook.com/people/VEFS-Foundation/61582906514169/" class="header-social-link" aria-label="Facebook" target="_blank" rel="noopener"><img src="/images/icons/facebook_icon.png" alt="Facebook" width="24" height="24"></a>
            <a href="https://www.instagram.com/vefsfoundation/" class="header-social-link" aria-label="Instagram" target="_blank" rel="noopener"><img src="/images/icons/instagram_icon.png" alt="Instagram" width="24" height="24"></a>
            <a href="https://www.youtube.com/@VEFSFOUNDATION" class="header-social-link" aria-label="YouTube" target="_blank" rel="noopener"><img src="/images/icons/youtube_icon.png" alt="YouTube" width="24" height="24"></a>
            <a href="https://www.whatsapp.com/channel/0029Vat5xFr6RGJJI5rJcv3D" class="header-social-link" aria-label="WhatsApp" target="_blank" rel="noopener"><img src="/images/icons/whatsapp_icon.png" alt="WhatsApp" width="24" height="24"></a>
            <a href="mailto:vefsfoundation@gmail.com" class="header-social-link" aria-label="Email"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>
          </div>
          <ul class="nav-list">
            <li><a href="/index.html" class="nav-link">Home</a></li>
            <li><a href="/about.html" class="nav-link">About</a></li>
            <li><a href="/trainings.html" class="nav-link">Trainings</a></li>
            <li><a href="/events.html" class="nav-link">Events</a></li>
            <li><a href="/volunteer.html" class="nav-link">Volunteer</a></li>
            <li><a href="/gallery.html" class="nav-link">Gallery</a></li>
            <li><a href="/projects.html" class="nav-link active" aria-current="page">Projects <span id="projects-nav-new" class="projects-nav-new-slot" aria-hidden="true"></span></a></li>
            <li><a href="/contact.html" class="nav-link">Contact</a></li>
            <li><a href="/donate.html" class="btn btn-primary btn-sm">Donate</a></li>
          </ul>
        </nav>
      </div>

      <div class="header-social-section">
        <a href="https://www.facebook.com/people/VEFS-Foundation/61582906514169/" class="header-social-link" aria-label="Facebook" target="_blank" rel="noopener"><img src="/images/icons/facebook_icon.png" alt="Facebook" width="20" height="20"></a>
        <a href="https://www.instagram.com/vefsfoundation/" class="header-social-link" aria-label="Instagram" target="_blank" rel="noopener"><img src="/images/icons/instagram_icon.png" alt="Instagram" width="20" height="20"></a>
        <a href="https://www.youtube.com/@VEFSFOUNDATION" class="header-social-link" aria-label="YouTube" target="_blank" rel="noopener"><img src="/images/icons/youtube_icon.png" alt="YouTube" width="20" height="20"></a>
        <a href="https://www.whatsapp.com/channel/0029Vat5xFr6RGJJI5rJcv3D" class="header-social-link" aria-label="WhatsApp" target="_blank" rel="noopener"><img src="/images/icons/whatsapp_icon.png" alt="WhatsApp" width="20" height="20"></a>
        <a href="mailto:vefsfoundation@gmail.com" class="header-social-link" aria-label="Email"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>
      </div>
    </div>
  </div>
</header>

<main>
<?php if (!$project): ?>
    <section class="section section-py">
        <div class="container" style="text-align:center;padding:var(--space-3xl) 0;">
            <h1>Project not found</h1>
            <p>The project you are looking for doesn't exist. <a href="/projects.html">Back to all projects</a>.</p>
        </div>
    </section>
<?php else: ?>
    <header class="project-detail-hero" style="<?= $cover ? 'background-image:url(\'' . $h($cover) . '\')' : '' ?>">
        <div class="overlay">
            <div class="container">
                <div style="display:flex;gap:var(--space-xs);">
                    <span class="chip chip-status status-<?= $h($project['status']) ?>"><?= $h($project['status']) ?></span>
                    <span class="chip chip-theme theme-<?= $h($project['theme']) ?>"><?= $h($project['theme']) ?></span>
                </div>
                <h1><?= $h($project['name']) ?></h1>
                <p class="meta" style="opacity:0.95;"><?= $h($project['location']) ?> · Since <?= $h(date('M Y', strtotime((string)($project['start_date'] ?? 'now')))) ?></p>
            </div>
        </div>
    </header>

    <div class="project-detail-grid container">
        <article class="project-detail-body">
            <p style="font-size:1.2rem;color:var(--color-gray-700,#444);"><?= $h($project['objective']) ?></p>
            <?php if (!empty($project['story'])): ?>
                <div class="project-story"><?= $project['story'] /* sanitized at save time */ ?></div>
            <?php endif; ?>

            <?php if (!empty($project['impact_metrics'])): ?>
                <h2>Impact so far</h2>
                <ul class="metrics-big">
                    <?php foreach ($project['impact_metrics'] as $m): ?>
                        <li>
                            <strong><?= $h(number_format((float)($m['value'] ?? 0))) ?><?= !empty($m['unit']) ? ' ' . $h($m['unit']) : '' ?></strong>
                            <span><?= $h($m['label'] ?? '') ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

            <?php if (!empty($project['photos'])): ?>
                <h2>Photos</h2>
                <div class="photo-gallery">
                    <?php foreach ($project['photos'] as $p): ?>
                        <figure>
                            <img src="<?= $h($p['url']) ?>" alt="<?= $h($p['caption'] ?? '') ?>" loading="lazy">
                            <?php if (!empty($p['caption'])): ?>
                                <figcaption><?= $h($p['caption']) ?></figcaption>
                            <?php endif; ?>
                        </figure>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if ($linkedEvents || $linkedTrainings || $linkedVolunteers): ?>
                <h2>Active right now</h2>
                <?php if ($linkedEvents): ?>
                    <h3>Upcoming events</h3>
                    <ul>
                        <?php foreach ($linkedEvents as $e): ?>
                            <li><a href="/events.html#<?= $h($e['slug'] ?? $e['id']) ?>"><?= $h($e['title'] ?? $e['id']) ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
                <?php if ($linkedTrainings): ?>
                    <h3>Trainings</h3>
                    <ul>
                        <?php foreach ($linkedTrainings as $t): ?>
                            <li><a href="/trainings.html#<?= $h($t['slug'] ?? $t['id']) ?>"><?= $h($t['title'] ?? $t['id']) ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
                <?php if ($linkedVolunteers): ?>
                    <h3>Volunteer with us</h3>
                    <ul>
                        <?php foreach ($linkedVolunteers as $v): ?>
                            <li><a href="/volunteer.html#<?= $h($v['slug'] ?? $v['id']) ?>"><?= $h($v['title'] ?? $v['id']) ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            <?php endif; ?>

            <?php if ($project['status'] === 'planning' && !empty($project['sponsorship_opportunities'])): ?>
                <h2>Sponsorship opportunities</h2>
                <div class="sponsorship"><?= $project['sponsorship_opportunities'] /* sanitized at save time */ ?></div>
            <?php endif; ?>
        </article>

        <aside class="donate-card">
            <h2>Support this project</h2>
            <?php if (!empty($fund['show_progress']) && $target > 0): ?>
                <div class="progress"><div class="progress-bar" style="width:<?= $pct ?>%"></div></div>
                <p><strong><?= $inr($raised) ?></strong> raised of <?= $inr($target) ?></p>
                <p style="color:var(--color-gray-600,#666);font-size:0.9rem;"><?= (int)($fund['donor_count'] ?? 0) ?> donors · <?= $pct ?>% funded</p>
            <?php endif; ?>
            <a class="btn btn-primary btn-lg" style="display:block;text-align:center;margin-top:var(--space-md);" href="/donate.html?project=<?= urlencode((string)$project['slug']) ?>">Donate to this project</a>
            <div class="share-row">
                <a href="https://wa.me/?text=<?= urlencode($project['name'] . ' — ' . $canonical) ?>" target="_blank" rel="noopener">WhatsApp</a>
                <a href="https://twitter.com/intent/tweet?url=<?= urlencode($canonical) ?>&text=<?= urlencode($project['name']) ?>" target="_blank" rel="noopener">Twitter</a>
                <button type="button" onclick="navigator.clipboard.writeText(location.href); this.textContent='Copied'">Copy link</button>
            </div>
        </aside>
    </div>
<?php endif; ?>
</main>

<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-grid-4col">
            <div class="footer-column">
                <div class="footer-logo">
                    <img src="/images/logos/vefs-logo.png" alt="VEFS Foundation" width="50" height="50">
                    <span class="footer-logo-text">VEFS Foundation</span>
                </div>
                <p class="footer-text">Valluvam Ecological Farming and Social Welfare Foundation - promoting organic farming, biodiversity conservation, and community empowerment across Tamil Nadu.</p>
            </div>
            <div class="footer-column">
                <h3 class="footer-heading">Follow Us</h3>
                <div class="footer-social">
                    <a href="https://www.facebook.com/people/VEFS-Foundation/61582906514169/" class="social-link" data-platform="facebook" aria-label="Facebook" target="_blank" rel="noopener"><img src="/images/icons/facebook_icon.png" alt="Facebook" width="24" height="24"></a>
                    <a href="https://www.instagram.com/vefsfoundation/" class="social-link" data-platform="instagram" aria-label="Instagram" target="_blank" rel="noopener"><img src="/images/icons/instagram_icon.png" alt="Instagram" width="24" height="24"></a>
                    <a href="https://www.youtube.com/@VEFSFOUNDATION" class="social-link" data-platform="youtube" aria-label="YouTube" target="_blank" rel="noopener"><img src="/images/icons/youtube_icon.png" alt="YouTube" width="24" height="24"></a>
                    <a href="https://www.whatsapp.com/channel/0029Vat5xFr6RGJJI5rJcv3D" class="social-link" data-platform="whatsapp" aria-label="WhatsApp" target="_blank" rel="noopener"><img src="/images/icons/whatsapp_icon.png" alt="WhatsApp" width="24" height="24"></a>
                    <a href="mailto:vefsfoundation@gmail.com" class="social-link" data-platform="email" aria-label="Email"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>
                </div>
            </div>
            <div class="footer-column">
                <h3 class="footer-heading">Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="/index.html">Home</a></li>
                    <li><a href="/about.html">About Us</a></li>
                    <li><a href="/trainings.html">Trainings</a></li>
                    <li><a href="/events.html">Events</a></li>
                    <li><a href="/volunteer.html">Volunteer</a></li>
                    <li><a href="/gallery.html">Gallery</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3 class="footer-heading">Contact Us</h3>
                <ul class="footer-contact">
                    <li><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> Nilakottai, Dindigul, Tamil Nadu</li>
                    <li><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> <a href="mailto:vefsfoundation@gmail.com">vefsfoundation@gmail.com</a></li>
                    <li><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg> <a href="tel:+919342211488">+91 9342211488</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p class="footer-copyright">&copy; 2026 VEFS Foundation. All rights reserved.</p>
            <div class="footer-legal">
                <a href="/privacy.html">Privacy Policy</a>
                <a href="/terms.html">Terms of Service</a>
            </div>
        </div>
    </div>
</footer>

<script src="/js/utils.js"></script>
<script src="/js/components/navigation.js"></script>
</body>
</html>
