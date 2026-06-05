<?php
declare(strict_types=1);
require __DIR__ . '/includes/json-store.php';
require_once __DIR__ . '/includes/content-helpers.php';

$id = $_GET['id'] ?? '';
$post = null;
if (preg_match('/^[a-z0-9-]+$/', $id)) {
    $data = json_store_read(__DIR__ . '/data/blog.json');
    foreach ($data['posts'] ?? [] as $p) {
        if (($p['id'] ?? null) === $id) { $post = $p; break; }
    }
}

if (!$post) {
    http_response_code(404);
    $title = 'Post not found — VEFS';
    $desc = 'The blog post you are looking for could not be found.';
    $cover = '';
} else {
    $title = htmlspecialchars($post['title'] . ' — VEFS', ENT_QUOTES, 'UTF-8');
    $desc  = htmlspecialchars(mb_substr((string)($post['subtitle'] ?? ''), 0, 200), ENT_QUOTES, 'UTF-8');
    $cover = (string)($post['cover_image_url'] ?? '');
}

$canonical = 'https://' . ($_SERVER['HTTP_HOST'] ?? 'vefs.org') . '/blog/' . htmlspecialchars((string)$id, ENT_QUOTES, 'UTF-8');
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
<link rel="stylesheet" href="/css/components/blog.css">
<link rel="stylesheet" href="/css/components/badge-new.css">
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
            <li><a href="/future-plans.html" class="nav-link">Future Plans</a></li>
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
<?php if (!$post): ?>
    <section class="section section-py">
        <div class="container">
            <div class="blog-single">
                <h1>Post not found</h1>
                <p>The post you are looking for doesn't exist. <a href="/blog.html">Back to blog</a>.</p>
            </div>
        </div>
    </section>
<?php else: ?>
    <section class="section section-py">
        <div class="container">
            <article class="blog-single">
                <?php if ($cover): ?>
                    <img class="blog-single-cover" src="<?= htmlspecialchars($cover, ENT_QUOTES, 'UTF-8') ?>" alt="" fetchpriority="high" width="1200" height="600">
                <?php endif; ?>
                <h1 class="blog-single-title"><?= htmlspecialchars((string)$post['title'], ENT_QUOTES, 'UTF-8') ?> <?= render_new_badge($post) ?></h1>
                <?php if (!empty($post['subtitle'])): ?>
                    <p class="blog-single-subtitle"><?= htmlspecialchars((string)$post['subtitle'], ENT_QUOTES, 'UTF-8') ?></p>
                <?php endif; ?>
                <p class="blog-single-meta"><?= htmlspecialchars(date('j F Y', strtotime((string)($post['published_at'] ?? 'now'))), ENT_QUOTES, 'UTF-8') ?></p>

                <div class="blog-single-body"><?= $post['body_html'] /* already sanitized at save time */ ?></div>

                <?php if (!empty($post['reference_links'])): ?>
                    <div class="blog-references">
                        <h3>References</h3>
                        <ul>
                        <?php foreach ($post['reference_links'] as $r): ?>
                            <li><a href="<?= htmlspecialchars((string)$r['url'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer"><?= htmlspecialchars((string)$r['label'], ENT_QUOTES, 'UTF-8') ?></a></li>
                        <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <?php if (!empty($post['cta_text']) && !empty($post['cta_url'])): ?>
                    <a class="blog-cta" href="<?= htmlspecialchars((string)$post['cta_url'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars((string)$post['cta_text'], ENT_QUOTES, 'UTF-8') ?></a>
                <?php endif; ?>

                <div class="blog-share">
                    <span>Share:</span>
                    <a href="#" id="share-wa" target="_blank" rel="noopener">WhatsApp</a>
                    <a href="#" id="share-fb" target="_blank" rel="noopener">Facebook</a>
                    <a href="#" id="share-tw" target="_blank" rel="noopener">X</a>
                    <button id="share-copy" type="button">Copy link</button>
                </div>
            </article>
        </div>
    </section>
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
<script src="/js/blog-post.js"></script>
</body>
</html>
