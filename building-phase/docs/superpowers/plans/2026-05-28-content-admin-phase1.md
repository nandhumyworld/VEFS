# Content Admin — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a password-protected admin area at `/admin/` that lets the VEFS founder publish Blog posts and Social cards (YouTube / Instagram / Facebook thumbnails) without developer involvement, including the public `blog.html` index, `/blog/<slug>` single-post pages with OG tags, and home-page "Latest from the blog" + "Follow our work" sections.

**Architecture:** Vanilla PHP + JS on Hostinger shared hosting. JSON files in `VEFS-website/data/` are the source of truth. All writes go through `includes/json-store.php` (flock + atomic rename + rolling backups). Images are uploaded browser→Cloudinary via an unsigned preset (no files on Hostinger disk). Blog body HTML is sanitized at save time with HTMLPurifier (vendored, no Composer).

**Tech Stack:** PHP 7.4+, vanilla JavaScript (ES6+), HTMLPurifier (vendored), Cloudinary (unsigned upload preset), Apache + `.htaccess`. No build tools. No framework.

**Spec:** `docs/superpowers/specs/2026-05-28-content-admin-design.md`

**Testing approach:** Security-critical and logic-heavy PHP modules (`json-store`, `csrf`, `sanitize-html`, `validate`) use lightweight PHP CLI test scripts under `VEFS-website/tests/` runnable via `php tests/<name>.php` — exit code 0 = pass, non-zero = fail. UI flows are verified manually via Playwright MCP per `CLAUDE.md` Phase 8 guidance. Pure HTML/CSS templates are verified by visual inspection, not unit tests.

**Conventions:**
- All site paths are relative to `VEFS-website/`. Commands assume cwd at the repo root (`building-phase/`).
- Commit after every task. Commits should be small and reversible.
- PHP files start with `<?php` (no closing tag) and use `declare(strict_types=1);`.
- All user input is treated as hostile until validated server-side.

---

## File Structure

### New files
```
VEFS-website/
├── admin/
│   ├── .htaccess                    deny config.php
│   ├── config.sample.php            template — engineer copies to config.php and fills hash
│   ├── index.php                    login form
│   ├── logout.php
│   ├── dashboard.php                tabs: Blog | Social
│   ├── form-blog.php
│   ├── form-social.php
│   ├── api/
│   │   ├── save.php                 ?type=blog|social
│   │   ├── delete.php
│   │   └── reorder.php
│   └── assets/
│       ├── admin.css
│       └── admin.js                 Cloudinary upload + form helpers
├── includes/
│   ├── auth.php
│   ├── csrf.php
│   ├── json-store.php
│   ├── sanitize-html.php
│   └── validate.php
├── vendor/
│   └── htmlpurifier/                vendored library (downloaded)
├── data/
│   ├── blog.json                    starter: { "metadata": {...}, "posts": [] }
│   ├── social.json                  starter: { "metadata": {...}, "posts": [] }
│   ├── .htaccess                    deny dot-files, no indexes
│   └── version.php                  returns { "blog": <mtime>, "social": <mtime> }
├── blog.html                        public blog index, 6-per-page
├── blog-post.php                    single post, PHP-rendered OG tags
├── js/
│   ├── blog.js                      renders blog.html
│   ├── blog-post.js                 renders blog-post.php body
│   ├── blog-home.js                 home "Latest from blog" section
│   └── social-home.js               home "Follow our work" section
├── css/components/
│   └── blog.css                     blog card + single post styles
└── tests/
    ├── test-runner.php              tiny assertion helper
    ├── test-json-store.php
    ├── test-csrf.php
    ├── test-sanitize-html.php
    └── test-validate.php
```

### Modified files
- `VEFS-website/.htaccess` — create if missing; add HTTPS force, `/blog/<slug>` rewrite, dot-file deny.
- `VEFS-website/index.html` — add two `<section>` blocks (blog teaser + social grid).

---

## Task 1: Bootstrap directories and starter data files

**Files:**
- Create: `VEFS-website/admin/`, `VEFS-website/includes/`, `VEFS-website/vendor/`, `VEFS-website/tests/`, `VEFS-website/data/backups/`
- Create: `VEFS-website/data/blog.json`
- Create: `VEFS-website/data/social.json`
- Create: `VEFS-website/data/.htaccess`

- [ ] **Step 1: Create directories**

```bash
mkdir -p VEFS-website/admin/api VEFS-website/admin/assets VEFS-website/includes VEFS-website/vendor VEFS-website/tests VEFS-website/data/backups
```

- [ ] **Step 2: Create starter `blog.json`**

Write `VEFS-website/data/blog.json`:
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2026-05-28T00:00:00+05:30",
    "total": 0
  },
  "posts": []
}
```

- [ ] **Step 3: Create starter `social.json`**

Write `VEFS-website/data/social.json`:
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2026-05-28T00:00:00+05:30",
    "total": 0
  },
  "posts": []
}
```

- [ ] **Step 4: Create `data/.htaccess`**

Write `VEFS-website/data/.htaccess`:
```apache
Options -Indexes
<FilesMatch "^\.">
    Require all denied
</FilesMatch>
<FilesMatch "\.(tmp|log)$">
    Require all denied
</FilesMatch>
```

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/admin VEFS-website/includes VEFS-website/vendor VEFS-website/tests VEFS-website/data/blog.json VEFS-website/data/social.json VEFS-website/data/.htaccess VEFS-website/data/backups
git commit -m "feat(admin): bootstrap directories and starter JSON files"
```

---

## Task 2: Build test runner

**Files:**
- Create: `VEFS-website/tests/test-runner.php`

- [ ] **Step 1: Write the test runner**

Write `VEFS-website/tests/test-runner.php`:
```php
<?php
declare(strict_types=1);

/**
 * Tiny assertion helper. Each test file does:
 *   require __DIR__ . '/test-runner.php';
 *   test('description', function() { assert_eq(1+1, 2); });
 *   summary();
 */

$GLOBALS['tests_passed'] = 0;
$GLOBALS['tests_failed'] = 0;
$GLOBALS['tests_failures'] = [];

function test(string $name, callable $fn): void {
    try {
        $fn();
        $GLOBALS['tests_passed']++;
        echo "  PASS  $name\n";
    } catch (Throwable $e) {
        $GLOBALS['tests_failed']++;
        $GLOBALS['tests_failures'][] = "$name: " . $e->getMessage();
        echo "  FAIL  $name\n        " . $e->getMessage() . "\n";
    }
}

function assert_eq($expected, $actual, string $msg = ''): void {
    if ($expected !== $actual) {
        $e = var_export($expected, true);
        $a = var_export($actual, true);
        throw new RuntimeException("Expected $e, got $a" . ($msg ? " ($msg)" : ''));
    }
}

function assert_true(bool $cond, string $msg = ''): void {
    if (!$cond) throw new RuntimeException("Expected true" . ($msg ? ": $msg" : ''));
}

function assert_throws(callable $fn, string $expectedMsgFragment = ''): void {
    try {
        $fn();
    } catch (Throwable $e) {
        if ($expectedMsgFragment !== '' && strpos($e->getMessage(), $expectedMsgFragment) === false) {
            throw new RuntimeException("Wrong exception: expected fragment '$expectedMsgFragment', got '" . $e->getMessage() . "'");
        }
        return;
    }
    throw new RuntimeException('Expected an exception, none thrown');
}

function summary(): void {
    $p = $GLOBALS['tests_passed'];
    $f = $GLOBALS['tests_failed'];
    echo "\n$p passed, $f failed\n";
    exit($f > 0 ? 1 : 0);
}
```

- [ ] **Step 2: Smoke-test the runner**

Create `VEFS-website/tests/test-smoke.php`:
```php
<?php
require __DIR__ . '/test-runner.php';
test('runner basic equality works', function() {
    assert_eq(2, 1 + 1);
});
summary();
```

Run: `php VEFS-website/tests/test-smoke.php`
Expected output: `  PASS  runner basic equality works` then `1 passed, 0 failed`, exit code 0.

- [ ] **Step 3: Delete smoke test and commit**

```bash
rm VEFS-website/tests/test-smoke.php
git add VEFS-website/tests/test-runner.php
git commit -m "feat(tests): add tiny PHP CLI test runner"
```

---

## Task 3: `json-store.php` — locked, atomic, backed-up JSON I/O

**Files:**
- Create: `VEFS-website/tests/test-json-store.php`
- Create: `VEFS-website/includes/json-store.php`

- [ ] **Step 1: Write the failing test**

Write `VEFS-website/tests/test-json-store.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';
require __DIR__ . '/../includes/json-store.php';

$tmpDir = sys_get_temp_dir() . '/vefs-jsonstore-test-' . uniqid();
mkdir($tmpDir);
mkdir($tmpDir . '/backups');
$file = $tmpDir . '/data.json';
file_put_contents($file, json_encode(['posts' => []]));

test('read returns decoded array', function() use ($file) {
    $data = json_store_read($file);
    assert_eq(['posts' => []], $data);
});

test('write persists data', function() use ($file, $tmpDir) {
    json_store_write($file, ['posts' => [['id' => 'a']]], $tmpDir . '/backups');
    $data = json_store_read($file);
    assert_eq([['id' => 'a']], $data['posts']);
});

test('write creates backup of previous content', function() use ($file, $tmpDir) {
    json_store_write($file, ['posts' => [['id' => 'b']]], $tmpDir . '/backups');
    $backups = glob($tmpDir . '/backups/*.json');
    assert_true(count($backups) >= 1, 'expected at least one backup');
    $backupData = json_decode(file_get_contents($backups[0]), true);
    assert_eq([['id' => 'a']], $backupData['posts'], 'backup should hold the pre-write content');
});

test('write rejects invalid current JSON without overwriting', function() use ($tmpDir) {
    $bad = $tmpDir . '/bad.json';
    file_put_contents($bad, '{not valid json');
    assert_throws(function() use ($bad, $tmpDir) {
        json_store_write($bad, ['posts' => []], $tmpDir . '/backups');
    }, 'current file is not valid JSON');
    assert_eq('{not valid json', file_get_contents($bad), 'bad file untouched');
});

test('backups are pruned to 20', function() use ($tmpDir) {
    $f = $tmpDir . '/prune.json';
    $b = $tmpDir . '/prune-backups';
    mkdir($b);
    file_put_contents($f, json_encode(['n' => 0]));
    for ($i = 1; $i <= 25; $i++) {
        usleep(1100); // ensure unique timestamps
        json_store_write($f, ['n' => $i], $b);
    }
    $backups = glob($b . '/*.json');
    assert_eq(20, count($backups), 'should keep newest 20 backups');
});

summary();
```

- [ ] **Step 2: Run to verify it fails**

Run: `php VEFS-website/tests/test-json-store.php`
Expected: fatal error "require ... failed" because `includes/json-store.php` doesn't exist yet.

- [ ] **Step 3: Implement `json-store.php`**

Write `VEFS-website/includes/json-store.php`:
```php
<?php
declare(strict_types=1);

/**
 * Read a JSON file and return decoded array. Throws if file missing or invalid JSON.
 */
function json_store_read(string $path): array {
    if (!is_file($path)) {
        throw new RuntimeException("JSON file not found: $path");
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        throw new RuntimeException("Failed to read: $path");
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        throw new RuntimeException("Not valid JSON: $path");
    }
    return $data;
}

/**
 * Atomically write JSON. Steps:
 *   1. Open with LOCK_EX
 *   2. Read & validate current content (refuses to overwrite corrupt JSON)
 *   3. Copy current to backups/<basename>-YYYYMMDD-HHMMSS-<microsec>.json
 *   4. Write new content to <path>.tmp
 *   5. rename() tmp -> live (atomic on POSIX)
 *   6. Release lock
 *   7. Prune backups to newest 20
 */
function json_store_write(string $path, array $data, string $backupDir): void {
    if (!is_file($path)) {
        throw new RuntimeException("JSON file not found: $path");
    }
    if (!is_dir($backupDir)) {
        throw new RuntimeException("Backup dir missing: $backupDir");
    }

    $fp = fopen($path, 'c+');
    if ($fp === false) throw new RuntimeException("Cannot open: $path");

    try {
        if (!flock($fp, LOCK_EX)) {
            throw new RuntimeException("Cannot lock: $path");
        }

        $current = stream_get_contents($fp);
        $decoded = json_decode($current, true);
        if (!is_array($decoded)) {
            throw new RuntimeException("current file is not valid JSON: $path");
        }

        // Backup current content
        $base = pathinfo($path, PATHINFO_FILENAME);
        [$usec, $sec] = explode(' ', microtime());
        $stamp = date('Ymd-His', (int)$sec) . '-' . substr($usec, 2, 6);
        $backupPath = rtrim($backupDir, '/\\') . DIRECTORY_SEPARATOR . $base . '-' . $stamp . '.json';
        if (file_put_contents($backupPath, $current) === false) {
            throw new RuntimeException("Backup failed: $backupPath");
        }

        // Write to tmp then atomic rename
        $tmp = $path . '.tmp';
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($json === false) throw new RuntimeException("json_encode failed");
        if (file_put_contents($tmp, $json) === false) {
            throw new RuntimeException("Cannot write tmp: $tmp");
        }
        if (!rename($tmp, $path)) {
            @unlink($tmp);
            throw new RuntimeException("Rename failed: $tmp -> $path");
        }
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }

    // Prune backups
    $pattern = rtrim($backupDir, '/\\') . DIRECTORY_SEPARATOR . pathinfo($path, PATHINFO_FILENAME) . '-*.json';
    $files = glob($pattern) ?: [];
    if (count($files) > 20) {
        sort($files); // oldest first (timestamp prefix sorts chronologically)
        $toDelete = array_slice($files, 0, count($files) - 20);
        foreach ($toDelete as $f) @unlink($f);
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `php VEFS-website/tests/test-json-store.php`
Expected: all 5 tests PASS, exit 0.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/includes/json-store.php VEFS-website/tests/test-json-store.php
git commit -m "feat(includes): add json-store with flock, atomic rename, and rolling backups"
```

---

## Task 4: `csrf.php` — token issue and verify

**Files:**
- Create: `VEFS-website/tests/test-csrf.php`
- Create: `VEFS-website/includes/csrf.php`

- [ ] **Step 1: Write the failing test**

Write `VEFS-website/tests/test-csrf.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';

// Simulate a session for CLI
$_SESSION = [];
require __DIR__ . '/../includes/csrf.php';

test('csrf_token returns a 64-char hex string', function() {
    $t = csrf_token();
    assert_true(preg_match('/^[a-f0-9]{64}$/', $t) === 1, "got: $t");
});

test('csrf_token returns same token within session', function() {
    $a = csrf_token();
    $b = csrf_token();
    assert_eq($a, $b);
});

test('csrf_verify returns true for the current token', function() {
    $t = csrf_token();
    assert_true(csrf_verify($t));
});

test('csrf_verify returns false for wrong token', function() {
    csrf_token();
    assert_eq(false, csrf_verify(str_repeat('0', 64)));
});

test('csrf_verify returns false for empty string', function() {
    csrf_token();
    assert_eq(false, csrf_verify(''));
});

summary();
```

- [ ] **Step 2: Run to verify fail**

Run: `php VEFS-website/tests/test-csrf.php`
Expected: fail to require csrf.php.

- [ ] **Step 3: Implement `csrf.php`**

Write `VEFS-website/includes/csrf.php`:
```php
<?php
declare(strict_types=1);

/**
 * Returns the current session's CSRF token, generating one if absent.
 * Caller must have called session_start() first (or be in CLI test mode with $_SESSION array).
 */
function csrf_token(): string {
    if (!isset($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Constant-time comparison against the session token.
 */
function csrf_verify(?string $submitted): bool {
    if ($submitted === null || $submitted === '') return false;
    if (!isset($_SESSION['csrf_token'])) return false;
    return hash_equals($_SESSION['csrf_token'], $submitted);
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `php VEFS-website/tests/test-csrf.php`
Expected: all 5 PASS.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/includes/csrf.php VEFS-website/tests/test-csrf.php
git commit -m "feat(includes): add CSRF token issue/verify with hash_equals"
```

---

## Task 5: Vendor HTMLPurifier and write the sanitizer wrapper

**Files:**
- Create: `VEFS-website/vendor/htmlpurifier/` (downloaded library)
- Create: `VEFS-website/includes/sanitize-html.php`
- Create: `VEFS-website/tests/test-sanitize-html.php`

- [ ] **Step 1: Download HTMLPurifier standalone**

Download HTMLPurifier 4.17.0 (or latest 4.x) standalone build:
```bash
curl -L -o /tmp/htmlpurifier.tar.gz https://github.com/ezyang/htmlpurifier/releases/download/v4.17.0/htmlpurifier-4.17.0.tar.gz
tar -xzf /tmp/htmlpurifier.tar.gz -C /tmp
cp -r /tmp/htmlpurifier-4.17.0/library/* VEFS-website/vendor/htmlpurifier/
```

Verify: `ls VEFS-website/vendor/htmlpurifier/HTMLPurifier.standalone.php` exists.

- [ ] **Step 2: Write the failing sanitizer test**

Write `VEFS-website/tests/test-sanitize-html.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';
require __DIR__ . '/../includes/sanitize-html.php';

test('keeps allowed tags', function() {
    $in = '<p>Hello <strong>world</strong></p>';
    assert_eq($in, sanitize_blog_html($in));
});

test('strips script tag', function() {
    $out = sanitize_blog_html('<p>Hi</p><script>alert(1)</script>');
    assert_true(strpos($out, '<script') === false, "got: $out");
    assert_true(strpos($out, 'alert') === false, "got: $out");
});

test('strips iframe', function() {
    $out = sanitize_blog_html('<iframe src="evil"></iframe><p>ok</p>');
    assert_true(strpos($out, 'iframe') === false, "got: $out");
});

test('strips onclick attribute', function() {
    $out = sanitize_blog_html('<a href="https://x.com" onclick="alert(1)">link</a>');
    assert_true(strpos($out, 'onclick') === false, "got: $out");
    assert_true(strpos($out, 'href="https://x.com"') !== false, "got: $out");
});

test('strips javascript: URL', function() {
    $out = sanitize_blog_html('<a href="javascript:alert(1)">x</a>');
    assert_true(strpos($out, 'javascript:') === false, "got: $out");
});

test('keeps img with src and alt', function() {
    $in = '<p>Photo:</p><img src="https://res.cloudinary.com/x.jpg" alt="A photo">';
    $out = sanitize_blog_html($in);
    assert_true(strpos($out, '<img') !== false, "got: $out");
    assert_true(strpos($out, 'src="https://res.cloudinary.com/x.jpg"') !== false, "got: $out");
    assert_true(strpos($out, 'alt="A photo"') !== false, "got: $out");
});

test('strips inline style attribute', function() {
    $out = sanitize_blog_html('<p style="color:red">x</p>');
    assert_true(strpos($out, 'style=') === false, "got: $out");
});

summary();
```

- [ ] **Step 3: Run, verify fail**

Run: `php VEFS-website/tests/test-sanitize-html.php`
Expected: fail (sanitize-html.php missing).

- [ ] **Step 4: Implement `sanitize-html.php`**

Write `VEFS-website/includes/sanitize-html.php`:
```php
<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/htmlpurifier/HTMLPurifier.standalone.php';

/**
 * Sanitize blog body HTML with a strict allowlist.
 * Tags:  p, h2, h3, h4, strong, em, u, a, ul, ol, li, blockquote, br, img, hr
 * Attrs: a[href|title|rel], img[src|alt|width|height]
 * URL schemes: http, https, mailto
 */
function sanitize_blog_html(string $html): string {
    static $purifier = null;
    if ($purifier === null) {
        $config = HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', 'p,h2,h3,h4,strong,em,u,a[href|title|rel],ul,ol,li,blockquote,br,img[src|alt|width|height],hr');
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true]);
        $config->set('Attr.AllowedRel', ['nofollow', 'noopener', 'noreferrer']);
        $config->set('Cache.SerializerPath', sys_get_temp_dir());
        $config->set('HTML.Doctype', 'HTML 4.01 Transitional');
        $purifier = new HTMLPurifier($config);
    }
    return $purifier->purify($html);
}
```

- [ ] **Step 5: Run, verify pass**

Run: `php VEFS-website/tests/test-sanitize-html.php`
Expected: all 7 PASS.

- [ ] **Step 6: Commit**

```bash
git add VEFS-website/vendor/htmlpurifier VEFS-website/includes/sanitize-html.php VEFS-website/tests/test-sanitize-html.php
git commit -m "feat(includes): vendor HTMLPurifier and add strict blog HTML sanitizer"
```

---

## Task 6: `validate.php` — per-type field rules

**Files:**
- Create: `VEFS-website/tests/test-validate.php`
- Create: `VEFS-website/includes/validate.php`

- [ ] **Step 1: Write failing tests**

Write `VEFS-website/tests/test-validate.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';
require __DIR__ . '/../includes/validate.php';

test('blog: requires title', function() {
    $errs = validate_blog(['title' => '', 'body_html' => 'x', 'order' => 10]);
    assert_true(isset($errs['title']));
});

test('blog: rejects title over 200 chars', function() {
    $errs = validate_blog(['title' => str_repeat('a', 201), 'body_html' => 'x', 'order' => 10]);
    assert_true(isset($errs['title']));
});

test('blog: rejects bad slug', function() {
    $errs = validate_blog(['title' => 'ok', 'slug' => 'NOT_OK', 'body_html' => 'x', 'order' => 10]);
    assert_true(isset($errs['slug']));
});

test('blog: accepts good slug', function() {
    $errs = validate_blog(['title' => 'ok', 'slug' => 'my-post-1', 'body_html' => 'x', 'order' => 10]);
    assert_eq(false, isset($errs['slug']));
});

test('blog: rejects javascript: in cta_url', function() {
    $errs = validate_blog(['title' => 'ok', 'body_html' => 'x', 'order' => 10, 'cta_url' => 'javascript:alert(1)']);
    assert_true(isset($errs['cta_url']));
});

test('blog: order must be positive int', function() {
    $errs = validate_blog(['title' => 'ok', 'body_html' => 'x', 'order' => -1]);
    assert_true(isset($errs['order']));
});

test('social: requires platform enum', function() {
    $errs = validate_social(['platform' => 'tiktok', 'post_url' => 'https://x.com', 'thumbnail_url' => 'https://x.com/a.jpg', 'caption' => 'c', 'order' => 10]);
    assert_true(isset($errs['platform']));
});

test('social: accepts youtube', function() {
    $errs = validate_social(['platform' => 'youtube', 'post_url' => 'https://youtube.com/watch?v=x', 'thumbnail_url' => 'https://img.youtube.com/x.jpg', 'caption' => 'c', 'order' => 10]);
    assert_eq([], $errs);
});

test('social: rejects non-http post_url', function() {
    $errs = validate_social(['platform' => 'youtube', 'post_url' => 'ftp://x.com', 'thumbnail_url' => 'https://x.com/a.jpg', 'caption' => 'c', 'order' => 10]);
    assert_true(isset($errs['post_url']));
});

summary();
```

- [ ] **Step 2: Run, verify fail**

Run: `php VEFS-website/tests/test-validate.php`

- [ ] **Step 3: Implement `validate.php`**

Write `VEFS-website/includes/validate.php`:
```php
<?php
declare(strict_types=1);

/**
 * Returns array of field => error message. Empty array = valid.
 */
function validate_blog(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be ≤ 200 characters.';

    if (isset($d['subtitle']) && mb_strlen((string)$d['subtitle']) > 300) {
        $e['subtitle'] = 'Subtitle must be ≤ 300 characters.';
    }

    if (isset($d['slug']) && $d['slug'] !== '' && !preg_match('/^[a-z0-9-]+$/', (string)$d['slug'])) {
        $e['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    if (trim((string)($d['body_html'] ?? '')) === '') {
        $e['body_html'] = 'Body is required.';
    }

    foreach (['cover_image_url', 'cta_url'] as $f) {
        if (isset($d[$f]) && $d[$f] !== '' && !_is_safe_url((string)$d[$f])) {
            $e[$f] = ucfirst(str_replace('_', ' ', $f)) . ' must be a valid http/https URL.';
        }
    }

    if (!isset($d['order']) || !is_int($d['order']) && !ctype_digit((string)$d['order'])) {
        $e['order'] = 'Order must be a non-negative integer.';
    } elseif ((int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    if (isset($d['reference_links']) && is_array($d['reference_links'])) {
        foreach ($d['reference_links'] as $i => $row) {
            if (!is_array($row)) { $e["reference_links.$i"] = 'Invalid row.'; continue; }
            $label = trim((string)($row['label'] ?? ''));
            $url   = trim((string)($row['url'] ?? ''));
            if ($label === '' && $url === '') continue; // empty row OK; will be stripped on save
            if ($label === '') $e["reference_links.$i.label"] = 'Label required.';
            if (!_is_safe_url($url)) $e["reference_links.$i.url"] = 'URL must be http/https.';
        }
    }

    return $e;
}

function validate_social(array $d): array {
    $e = [];
    $platforms = ['youtube', 'instagram', 'facebook'];
    $p = (string)($d['platform'] ?? '');
    if (!in_array($p, $platforms, true)) $e['platform'] = 'Platform must be one of: ' . implode(', ', $platforms);

    foreach (['post_url', 'thumbnail_url'] as $f) {
        $v = (string)($d[$f] ?? '');
        if ($v === '') $e[$f] = ucfirst(str_replace('_', ' ', $f)) . ' is required.';
        elseif (!_is_safe_url($v)) $e[$f] = ucfirst(str_replace('_', ' ', $f)) . ' must be a valid http/https URL.';
    }

    $cap = trim((string)($d['caption'] ?? ''));
    if ($cap === '') $e['caption'] = 'Caption is required.';
    elseif (mb_strlen($cap) > 300) $e['caption'] = 'Caption must be ≤ 300 characters.';

    if (!isset($d['order']) || (!is_int($d['order']) && !ctype_digit((string)$d['order']))) {
        $e['order'] = 'Order must be a non-negative integer.';
    } elseif ((int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    return $e;
}

function _is_safe_url(string $url): bool {
    if (filter_var($url, FILTER_VALIDATE_URL) === false) return false;
    $scheme = strtolower((string)parse_url($url, PHP_URL_SCHEME));
    return in_array($scheme, ['http', 'https'], true);
}
```

- [ ] **Step 4: Run, verify pass**

Run: `php VEFS-website/tests/test-validate.php`
Expected: all 9 PASS.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/includes/validate.php VEFS-website/tests/test-validate.php
git commit -m "feat(includes): add per-type validation rules for blog and social"
```

---

## Task 7: `auth.php` — session, login check, throttle

**Files:**
- Create: `VEFS-website/includes/auth.php`
- Create: `VEFS-website/admin/config.sample.php`

- [ ] **Step 1: Write `config.sample.php`**

Write `VEFS-website/admin/config.sample.php`:
```php
<?php
// Copy this file to config.php and fill in the values.
// config.php is protected by /admin/.htaccess (deny all).

// Generate a hash with:
//   php -r "echo password_hash('YOUR_PASSWORD', PASSWORD_BCRYPT, ['cost' => 12]).PHP_EOL;"
return [
    'admin_password_hash' => '$2y$12$REPLACE_WITH_REAL_HASH',
    'session_timeout_seconds' => 7200,   // 2 hours sliding
    'login_throttle_max' => 5,
    'login_throttle_window_seconds' => 900, // 15 minutes
    'cloudinary' => [
        'cloud_name' => 'REPLACE_WITH_CLOUD_NAME',
        'upload_preset' => 'vefs_unsigned',
    ],
];
```

- [ ] **Step 2: Write `auth.php`**

Write `VEFS-website/includes/auth.php`:
```php
<?php
declare(strict_types=1);

function auth_config(): array {
    static $cfg = null;
    if ($cfg === null) {
        $cfg = require __DIR__ . '/../admin/config.php';
    }
    return $cfg;
}

function auth_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_name('vefs_admin');
    session_start();
}

function auth_check_logged_in(): bool {
    auth_start_session();
    if (empty($_SESSION['vefs_admin'])) return false;
    $cfg = auth_config();
    $now = time();
    $last = (int)($_SESSION['vefs_last_seen'] ?? 0);
    if ($now - $last > $cfg['session_timeout_seconds']) {
        auth_logout();
        return false;
    }
    $_SESSION['vefs_last_seen'] = $now;
    return true;
}

function auth_require(): void {
    if (!auth_check_logged_in()) {
        header('Location: /admin/index.php?expired=1');
        exit;
    }
}

function auth_attempt_login(string $password): bool {
    auth_start_session();
    $cfg = auth_config();
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

    if (_throttle_is_locked($ip)) return false;

    if (!password_verify($password, $cfg['admin_password_hash'])) {
        _throttle_record_fail($ip);
        return false;
    }

    _throttle_clear($ip);
    session_regenerate_id(true);
    $_SESSION['vefs_admin'] = true;
    $_SESSION['vefs_last_seen'] = time();
    return true;
}

function auth_logout(): void {
    auth_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', $p['secure'], $p['httponly']);
    }
    session_destroy();
}

function _throttle_path(): string { return __DIR__ . '/../data/.login-attempts.json'; }

function _throttle_load(): array {
    $p = _throttle_path();
    if (!is_file($p)) return [];
    $data = json_decode((string)file_get_contents($p), true);
    return is_array($data) ? $data : [];
}

function _throttle_save(array $data): void {
    file_put_contents(_throttle_path(), json_encode($data, JSON_PRETTY_PRINT));
}

function _throttle_is_locked(string $ip): bool {
    $cfg = auth_config();
    $data = _throttle_load();
    $rec = $data[$ip] ?? null;
    if (!$rec) return false;
    $window = $cfg['login_throttle_window_seconds'];
    if (time() - (int)$rec['first'] > $window) return false;
    return (int)$rec['count'] >= (int)$cfg['login_throttle_max'];
}

function _throttle_record_fail(string $ip): void {
    $cfg = auth_config();
    $data = _throttle_load();
    $now = time();
    $rec = $data[$ip] ?? ['first' => $now, 'count' => 0];
    if ($now - (int)$rec['first'] > $cfg['login_throttle_window_seconds']) {
        $rec = ['first' => $now, 'count' => 0];
    }
    $rec['count']++;
    $data[$ip] = $rec;
    _throttle_save($data);
}

function _throttle_clear(string $ip): void {
    $data = _throttle_load();
    unset($data[$ip]);
    _throttle_save($data);
}
```

- [ ] **Step 3: Create local `config.php` for development**

```bash
cp VEFS-website/admin/config.sample.php VEFS-website/admin/config.php
php -r "echo 'Generated hash: ' . password_hash('changeme', PASSWORD_BCRYPT, ['cost' => 12]) . PHP_EOL;"
```

Copy the printed hash into `VEFS-website/admin/config.php`'s `admin_password_hash` field. **Do not commit `config.php`** — add it to `.gitignore`.

- [ ] **Step 4: Add `.gitignore` entry**

Append to `VEFS-website/.gitignore` (create if missing):
```
admin/config.php
data/.login-attempts.json
data/.audit-log.json
data/backups/
data/*.json.tmp
```

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/includes/auth.php VEFS-website/admin/config.sample.php VEFS-website/.gitignore
git commit -m "feat(admin): auth session, password verify, IP throttle"
```

---

## Task 8: `admin/.htaccess` and root `.htaccess` updates

**Files:**
- Create: `VEFS-website/admin/.htaccess`
- Create/modify: `VEFS-website/.htaccess`

- [ ] **Step 1: Write `admin/.htaccess`**

Write `VEFS-website/admin/.htaccess`:
```apache
<Files "config.php">
    Require all denied
</Files>
<Files "config.sample.php">
    Require all denied
</Files>
```

- [ ] **Step 2: Update root `.htaccess`**

Check current state:
```bash
cat VEFS-website/.htaccess 2>/dev/null || echo "MISSING"
```

If missing, write `VEFS-website/.htaccess`:
```apache
RewriteEngine On

# Force HTTPS (Hostinger production)
RewriteCond %{HTTPS} off
RewriteCond %{HTTP_HOST} !^localhost
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Clean URL for blog single posts
RewriteRule ^blog/([a-z0-9-]+)/?$ blog-post.php?id=$1 [L,QSA]

# Deny tmp/log artifacts
<FilesMatch "\.(tmp|log)$">
    Require all denied
</FilesMatch>

# Deny dot-files
<FilesMatch "^\.">
    Require all denied
</FilesMatch>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

If a `.htaccess` exists, merge: add only the `RewriteRule ^blog/`, the two `<FilesMatch>` blocks, and the rewrite cond/rule pair for HTTPS if not present. Show the file to confirm the merge.

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/admin/.htaccess VEFS-website/.htaccess
git commit -m "feat(admin): htaccess deny config.php; add /blog/<slug> rewrite"
```

---

## Task 9: Admin login page

**Files:**
- Create: `VEFS-website/admin/index.php`

- [ ] **Step 1: Write `admin/index.php`**

Write `VEFS-website/admin/index.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';

auth_start_session();

if (auth_check_logged_in()) {
    header('Location: /admin/dashboard.php');
    exit;
}

$error = null;
$expired = isset($_GET['expired']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf'] ?? null)) {
        $error = 'Security token mismatch. Please try again.';
    } else {
        $pw = (string)($_POST['password'] ?? '');
        if (auth_attempt_login($pw)) {
            header('Location: /admin/dashboard.php');
            exit;
        } else {
            $error = 'Incorrect password, or too many failed attempts (15-minute lockout).';
        }
    }
}

$token = csrf_token();
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>VEFS Admin — Sign in</title>
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body class="admin-login">
<main class="login-card">
    <h1>VEFS Admin</h1>
    <?php if ($expired): ?><p class="notice">Session expired. Please sign in again.</p><?php endif; ?>
    <?php if ($error): ?><p class="error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
    <form method="post" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>">
        <label for="pw">Password</label>
        <input id="pw" name="password" type="password" required autofocus>
        <button type="submit">Sign in</button>
    </form>
</main>
</body>
</html>
```

- [ ] **Step 2: Write `admin/logout.php`**

Write `VEFS-website/admin/logout.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
auth_logout();
header('Location: /admin/index.php');
exit;
```

- [ ] **Step 3: Write minimal `admin/assets/admin.css`**

Write `VEFS-website/admin/assets/admin.css`:
```css
:root {
    --color-primary: #6B8E23;
    --color-secondary: #D4A574;
    --color-text: #2c2c2c;
    --color-muted: #6b6b6b;
    --color-border: #e0e0e0;
    --color-error: #b00020;
    --color-bg: #f7f5f0;
    --color-surface: #ffffff;
}
* { box-sizing: border-box; }
body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: var(--color-text); background: var(--color-bg); margin: 0; }
.admin-login { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1rem; }
.login-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 2rem; width: 100%; max-width: 360px; }
.login-card h1 { margin: 0 0 1rem; color: var(--color-primary); }
.login-card label { display: block; margin: 1rem 0 0.25rem; font-size: 0.9rem; }
.login-card input[type=password] { width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 4px; font-size: 1rem; }
.login-card button { margin-top: 1.25rem; width: 100%; background: var(--color-primary); color: #fff; border: 0; padding: 0.75rem; border-radius: 4px; font-size: 1rem; cursor: pointer; }
.login-card .error { color: var(--color-error); margin: 0.5rem 0; }
.login-card .notice { background: #fff8e1; padding: 0.5rem 0.75rem; border-radius: 4px; margin: 0.5rem 0; font-size: 0.9rem; }
.admin-shell { max-width: 1100px; margin: 0 auto; padding: 1.5rem; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.admin-tabs { display: flex; gap: 0.5rem; border-bottom: 2px solid var(--color-border); margin-bottom: 1.5rem; }
.admin-tabs a { padding: 0.6rem 1rem; text-decoration: none; color: var(--color-muted); border-bottom: 2px solid transparent; margin-bottom: -2px; }
.admin-tabs a.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight: 600; }
.admin-table { width: 100%; border-collapse: collapse; background: var(--color-surface); }
.admin-table th, .admin-table td { text-align: left; padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
.admin-table th { background: #faf8f3; font-weight: 600; font-size: 0.85rem; color: var(--color-muted); }
.admin-table img { width: 60px; height: 40px; object-fit: cover; border-radius: 3px; }
.admin-table input[type=number] { width: 70px; padding: 0.3rem; }
.btn { display: inline-block; padding: 0.5rem 0.9rem; border-radius: 4px; border: 0; cursor: pointer; text-decoration: none; font-size: 0.9rem; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-secondary { background: var(--color-secondary); color: #fff; }
.btn-danger { background: var(--color-error); color: #fff; }
.btn-ghost { background: transparent; color: var(--color-text); border: 1px solid var(--color-border); }
.form-grid { display: grid; gap: 1rem; max-width: 720px; }
.form-grid label { font-weight: 600; font-size: 0.9rem; }
.form-grid input[type=text], .form-grid input[type=url], .form-grid input[type=number], .form-grid select, .form-grid textarea { width: 100%; padding: 0.5rem 0.6rem; border: 1px solid var(--color-border); border-radius: 4px; font-size: 0.95rem; font-family: inherit; }
.form-grid textarea { min-height: 240px; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
.form-grid .field-error { color: var(--color-error); font-size: 0.85rem; }
.toolbar { display: flex; gap: 0.25rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.toolbar button { background: #fff; border: 1px solid var(--color-border); padding: 0.3rem 0.6rem; border-radius: 3px; cursor: pointer; font-size: 0.85rem; }
.preview { background: #fff; border: 1px dashed var(--color-border); border-radius: 4px; padding: 1rem; min-height: 200px; }
.repeat-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; }
.upload-status { font-size: 0.85rem; color: var(--color-muted); margin-top: 0.25rem; }
.toast { position: fixed; bottom: 1rem; right: 1rem; padding: 0.75rem 1rem; border-radius: 4px; color: #fff; background: var(--color-primary); }
.toast.error { background: var(--color-error); }
```

- [ ] **Step 4: Manually verify login flow with Playwright MCP**

Start a local PHP server:
```bash
cd VEFS-website && php -S localhost:8000
```

Use Playwright MCP to:
1. Navigate to `http://localhost:8000/admin/index.php` — verify login form renders.
2. Submit wrong password 5 times — verify lockout message shows.
3. Wait or clear `data/.login-attempts.json`, submit correct password (`changeme`) — verify redirect to `/admin/dashboard.php` (will 404 until Task 10).

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/admin/index.php VEFS-website/admin/logout.php VEFS-website/admin/assets/admin.css
git commit -m "feat(admin): login + logout pages with CSRF and styling"
```

---

## Task 10: Admin dashboard with Blog and Social tabs

**Files:**
- Create: `VEFS-website/admin/dashboard.php`

- [ ] **Step 1: Write `dashboard.php`**

Write `VEFS-website/admin/dashboard.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/../includes/auth.php';
require __DIR__ . '/../includes/csrf.php';
require __DIR__ . '/../includes/json-store.php';

auth_require();

$tab = isset($_GET['tab']) && $_GET['tab'] === 'social' ? 'social' : 'blog';
$file = __DIR__ . '/../data/' . $tab . '.json';
$data = json_store_read($file);
$posts = $data['posts'] ?? [];
usort($posts, fn($a, $b) => ($a['order'] ?? PHP_INT_MAX) <=> ($b['order'] ?? PHP_INT_MAX));
$csrf = csrf_token();
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
        <a href="?tab=blog" class="<?= $tab==='blog'?'active':'' ?>">Blog Posts</a>
        <a href="?tab=social" class="<?= $tab==='social'?'active':'' ?>">Social Posts</a>
    </nav>

    <div style="margin-bottom:1rem;">
        <a class="btn btn-primary" href="/admin/form-<?= $tab ?>.php">+ New <?= ucfirst($tab) ?> Post</a>
    </div>

    <table class="admin-table" data-csrf="<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>" data-type="<?= $tab ?>">
        <thead>
        <tr>
            <th style="width:80px">Image</th>
            <th><?= $tab==='blog' ? 'Title' : 'Caption' ?></th>
            <th style="width:90px">Order</th>
            <th style="width:60px"></th>
            <th style="width:160px">Actions</th>
        </tr>
        </thead>
        <tbody>
        <?php if (empty($posts)): ?>
            <tr><td colspan="5" style="text-align:center;color:#888;padding:2rem">No posts yet.</td></tr>
        <?php else: foreach ($posts as $i => $p): ?>
            <tr data-id="<?= htmlspecialchars((string)$p['id'], ENT_QUOTES, 'UTF-8') ?>">
                <td>
                    <?php $img = $p['cover_image_url'] ?? $p['thumbnail_url'] ?? ''; ?>
                    <?php if ($img): ?><img src="<?= htmlspecialchars($img, ENT_QUOTES, 'UTF-8') ?>" alt=""><?php endif; ?>
                </td>
                <td><?= htmlspecialchars((string)($p['title'] ?? $p['caption'] ?? ''), ENT_QUOTES, 'UTF-8') ?></td>
                <td><input type="number" class="order-input" value="<?= (int)($p['order'] ?? 0) ?>" min="0"></td>
                <td>
                    <button class="btn btn-ghost arrow-up" title="Move up" <?= $i===0?'disabled':'' ?>>▲</button>
                    <button class="btn btn-ghost arrow-down" title="Move down" <?= $i===count($posts)-1?'disabled':'' ?>>▼</button>
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
<script src="/admin/assets/admin.js"></script>
</body>
</html>
```

- [ ] **Step 2: Manually verify with Playwright MCP**

With the PHP server running:
1. Log in.
2. Navigate to `/admin/dashboard.php` — verify both tabs render. Empty state visible.
3. Click "Social Posts" tab — verify URL changes to `?tab=social` and table shows empty state.

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/admin/dashboard.php
git commit -m "feat(admin): dashboard with Blog/Social tabs and empty state"
```

---

## Task 11: Cloudinary upload helper and core admin JS

**Files:**
- Create: `VEFS-website/admin/assets/admin.js`

- [ ] **Step 1: Write `admin.js`**

Write `VEFS-website/admin/assets/admin.js`:
```javascript
// VEFS admin client. Vanilla JS, no dependencies.
// Cloudinary cloud_name + preset are injected via window.VEFS_CONFIG by the page.

const cfg = window.VEFS_CONFIG || {};

function toast(msg, isError = false) {
    const el = document.createElement('div');
    el.className = 'toast' + (isError ? ' error' : '');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

async function uploadToCloudinary(file, statusEl) {
    if (!cfg.cloudinary || !cfg.cloudinary.cloud_name || !cfg.cloudinary.upload_preset) {
        throw new Error('Cloudinary not configured');
    }
    if (statusEl) statusEl.textContent = 'Uploading…';
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', cfg.cloudinary.upload_preset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudinary.cloud_name}/image/upload`, {
        method: 'POST',
        body: form,
    });
    if (!res.ok) {
        if (statusEl) statusEl.textContent = '';
        const errText = await res.text();
        throw new Error('Cloudinary upload failed: ' + errText.slice(0, 200));
    }
    const json = await res.json();
    if (statusEl) statusEl.textContent = 'Uploaded ✓';
    return json.secure_url;
}

function wireImagePicker(pickerInput, urlInput, previewImg, statusEl) {
    pickerInput.addEventListener('change', async () => {
        const file = pickerInput.files[0];
        if (!file) return;
        try {
            const url = await uploadToCloudinary(file, statusEl);
            urlInput.value = url;
            if (previewImg) { previewImg.src = url; previewImg.style.display = 'block'; }
        } catch (e) {
            toast(e.message, true);
        }
    });
}

function postJSON(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'same-origin',
    }).then(async r => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || ('HTTP ' + r.status));
        return data;
    });
}

// Dashboard wiring
function wireDashboard() {
    const table = document.querySelector('.admin-table');
    if (!table) return;
    const csrf = table.dataset.csrf;
    const type = table.dataset.type;

    table.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('tr');
            const id = row.dataset.id;
            if (!confirm('Delete this post? This cannot be undone (but a backup is kept).')) return;
            try {
                await postJSON('/admin/api/delete.php', { csrf, type, id });
                row.remove();
                toast('Deleted');
            } catch (e) { toast(e.message, true); }
        });
    });

    table.querySelectorAll('.order-input').forEach(input => {
        let timer;
        input.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                const row = input.closest('tr');
                try {
                    await postJSON('/admin/api/reorder.php', {
                        csrf, type, id: row.dataset.id, order: parseInt(input.value, 10) || 0,
                    });
                    toast('Order updated');
                } catch (e) { toast(e.message, true); }
            }, 600);
        });
    });

    table.querySelectorAll('.arrow-up, .arrow-down').forEach(btn => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('tr');
            const otherRow = btn.classList.contains('arrow-up') ? row.previousElementSibling : row.nextElementSibling;
            if (!otherRow) return;
            try {
                await postJSON('/admin/api/reorder.php', {
                    csrf, type,
                    swap: [row.dataset.id, otherRow.dataset.id],
                });
                location.reload();
            } catch (e) { toast(e.message, true); }
        });
    });
}

document.addEventListener('DOMContentLoaded', wireDashboard);

// Export for form pages
window.VEFS = { uploadToCloudinary, wireImagePicker, postJSON, toast };
```

- [ ] **Step 2: Inject `VEFS_CONFIG` from PHP**

Since Cloudinary config lives in `admin/config.php`, the dashboard and forms must expose `cloud_name` + `upload_preset` to JS. Modify `VEFS-website/admin/dashboard.php` — add this BEFORE the `<script src="/admin/assets/admin.js">` line:

```php
<?php $cfg = auth_config(); ?>
<script>
window.VEFS_CONFIG = {
    cloudinary: {
        cloud_name: <?= json_encode($cfg['cloudinary']['cloud_name']) ?>,
        upload_preset: <?= json_encode($cfg['cloudinary']['upload_preset']) ?>,
    }
};
</script>
```

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/admin/assets/admin.js VEFS-website/admin/dashboard.php
git commit -m "feat(admin): JS helper for Cloudinary upload, delete, and reorder"
```

---

## Task 12: Blog form page

**Files:**
- Create: `VEFS-website/admin/form-blog.php`

- [ ] **Step 1: Write `form-blog.php`**

Write `VEFS-website/admin/form-blog.php`:
```php
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
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=blog">← Back</a>
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
```

- [ ] **Step 2: Write `form-blog.js` (form-specific behavior)**

Write `VEFS-website/admin/assets/form-blog.js`:
```javascript
(function() {
    const { wireImagePicker, uploadToCloudinary, postJSON, toast } = window.VEFS;

    function slugify(s) {
        return s.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    const titleEl = document.getElementById('title');
    const slugEl = document.getElementById('slug');
    const shareEl = document.getElementById('share-url');
    const originalIdEl = document.querySelector('[name=original_id]');
    let userEditedSlug = !!originalIdEl.value;

    slugEl.addEventListener('input', () => { userEditedSlug = true; shareEl.textContent = '/blog/' + slugEl.value; });
    titleEl.addEventListener('input', () => {
        if (!userEditedSlug) {
            slugEl.value = slugify(titleEl.value);
            shareEl.textContent = '/blog/' + slugEl.value;
        }
    });

    document.getElementById('copy-share').addEventListener('click', () => {
        navigator.clipboard.writeText(location.origin + shareEl.textContent);
        toast('Link copied');
    });

    // Cover image
    wireImagePicker(
        document.getElementById('cover-picker'),
        document.getElementById('cover-url'),
        document.getElementById('cover-preview'),
        document.getElementById('cover-status'),
    );

    // Body toolbar
    const body = document.getElementById('body');
    function wrap(beforeAfter) {
        const [before, after] = beforeAfter.split('|');
        const start = body.selectionStart, end = body.selectionEnd;
        const sel = body.value.slice(start, end);
        body.value = body.value.slice(0, start) + before + sel + after + body.value.slice(end);
        body.focus();
        body.selectionStart = start + before.length;
        body.selectionEnd = end + before.length;
        refreshPreview();
    }
    document.querySelectorAll('.toolbar [data-wrap]').forEach(b => b.addEventListener('click', () => wrap(b.dataset.wrap.replace(/\\n/g, '\n'))));
    document.getElementById('link-btn').addEventListener('click', () => {
        const url = prompt('Link URL (https://…)');
        if (!url) return;
        wrap('<a href="' + url + '">|</a>');
    });

    // Inline image
    const inlinePicker = document.getElementById('inline-img-picker');
    const inlineStatus = document.getElementById('inline-status');
    document.getElementById('insert-img-btn').addEventListener('click', () => inlinePicker.click());
    inlinePicker.addEventListener('change', async () => {
        const file = inlinePicker.files[0]; if (!file) return;
        try {
            const url = await uploadToCloudinary(file, inlineStatus);
            const start = body.selectionStart;
            const tag = '<img src="' + url + '" alt="">';
            body.value = body.value.slice(0, start) + tag + body.value.slice(start);
            refreshPreview();
            setTimeout(() => { inlineStatus.textContent = ''; }, 2000);
        } catch (e) { toast(e.message, true); }
        inlinePicker.value = '';
    });

    // Live preview
    const preview = document.getElementById('preview');
    function refreshPreview() { preview.innerHTML = body.value; }
    body.addEventListener('input', refreshPreview);
    refreshPreview();

    // Reference links
    const refs = document.getElementById('ref-rows');
    function addRef(label = '', url = '') {
        const row = document.createElement('div');
        row.className = 'repeat-row';
        row.innerHTML = '<input type="text" placeholder="Label"><input type="url" placeholder="https://…"><button type="button" class="btn btn-ghost">×</button>';
        const [labelEl, urlEl, rmBtn] = row.children;
        labelEl.value = label; urlEl.value = url;
        rmBtn.addEventListener('click', () => row.remove());
        refs.appendChild(row);
    }
    (window.VEFS_INITIAL_REFS || []).forEach(r => addRef(r.label || '', r.url || ''));
    document.getElementById('add-ref').addEventListener('click', () => addRef());

    // Submit
    document.getElementById('blog-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const refLinks = Array.from(refs.querySelectorAll('.repeat-row')).map(row => ({
            label: row.children[0].value.trim(),
            url: row.children[1].value.trim(),
        })).filter(r => r.label || r.url);

        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'blog',
            original_id: originalIdEl.value || null,
            data: {
                id: slugEl.value || slugify(titleEl.value),
                order: parseInt(document.getElementById('order').value, 10) || 0,
                title: titleEl.value,
                subtitle: document.getElementById('subtitle').value,
                cover_image_url: document.getElementById('cover-url').value,
                body_html: body.value,
                reference_links: refLinks,
                cta_text: document.getElementById('cta_text').value,
                cta_url: document.getElementById('cta_url').value,
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=blog';
        } catch (e) { toast(e.message, true); }
    });
})();
```

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/admin/form-blog.php VEFS-website/admin/assets/form-blog.js
git commit -m "feat(admin): blog form with Cloudinary upload, toolbar, live preview"
```

---

## Task 13: Social form page

**Files:**
- Create: `VEFS-website/admin/form-social.php`
- Create: `VEFS-website/admin/assets/form-social.js`

- [ ] **Step 1: Write `form-social.php`**

Write `VEFS-website/admin/form-social.php`:
```php
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
        <a class="btn btn-ghost" href="/admin/dashboard.php?tab=social">← Back</a>
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
```

- [ ] **Step 2: Write `form-social.js`**

Write `VEFS-website/admin/assets/form-social.js`:
```javascript
(function() {
    const { wireImagePicker, postJSON, toast } = window.VEFS;

    wireImagePicker(
        document.getElementById('thumb-picker'),
        document.getElementById('thumb-url'),
        document.getElementById('thumb-preview'),
        document.getElementById('thumb-status'),
    );

    document.getElementById('yt-thumb-btn').addEventListener('click', () => {
        const url = document.getElementById('post_url').value;
        const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
        if (!m) { toast('Could not detect YouTube video id from Post URL', true); return; }
        const thumb = 'https://img.youtube.com/vi/' + m[1] + '/hqdefault.jpg';
        document.getElementById('thumb-url').value = thumb;
        const img = document.getElementById('thumb-preview');
        img.src = thumb; img.style.display = 'block';
        document.getElementById('thumb-status').textContent = 'YouTube thumbnail loaded ✓';
    });

    document.getElementById('social-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'social',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                platform: document.getElementById('platform').value,
                post_url: document.getElementById('post_url').value,
                thumbnail_url: document.getElementById('thumb-url').value,
                caption: document.getElementById('caption').value,
                order: parseInt(document.getElementById('order').value, 10) || 0,
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=social';
        } catch (e) { toast(e.message, true); }
    });
})();
```

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/admin/form-social.php VEFS-website/admin/assets/form-social.js
git commit -m "feat(admin): social form with Cloudinary + YouTube thumbnail auto-fetch"
```

---

## Task 14: Save API endpoint

**Files:**
- Create: `VEFS-website/admin/api/save.php`

- [ ] **Step 1: Write `save.php`**

Write `VEFS-website/admin/api/save.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/../../includes/auth.php';
require __DIR__ . '/../../includes/csrf.php';
require __DIR__ . '/../../includes/json-store.php';
require __DIR__ . '/../../includes/validate.php';
require __DIR__ . '/../../includes/sanitize-html.php';

header('Content-Type: application/json');

function json_fail(int $code, string $msg, array $extra = []): void {
    http_response_code($code);
    echo json_encode(array_merge(['error' => $msg], $extra));
    exit;
}

auth_start_session();
if (!auth_check_logged_in()) json_fail(401, 'Not authenticated');

$body = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($body)) json_fail(400, 'Invalid JSON body');
if (!csrf_verify($body['csrf'] ?? null)) json_fail(403, 'CSRF token mismatch');

$type = $body['type'] ?? '';
if (!in_array($type, ['blog', 'social'], true)) json_fail(400, 'Invalid type');

$data = $body['data'] ?? null;
if (!is_array($data)) json_fail(400, 'Missing data');

$originalId = $body['original_id'] ?? null;

$dataDir = __DIR__ . '/../../data';
$file = $dataDir . '/' . $type . '.json';
$backupDir = $dataDir . '/backups';

$existing = json_store_read($file);
$posts = $existing['posts'] ?? [];

$nowIso = date('c');

if ($type === 'blog') {
    // Slug handling
    $slug = trim((string)($data['id'] ?? ''));
    if ($slug === '') {
        $slug = _slugify((string)($data['title'] ?? ''));
        if ($slug === '') json_fail(400, 'Could not derive slug from title');
    }
    // Uniqueness check (exclude self when editing)
    foreach ($posts as $p) {
        if (($p['id'] ?? null) === $slug && $slug !== $originalId) {
            json_fail(409, 'A post with this slug already exists', ['field' => 'slug']);
        }
    }
    $data['id'] = $slug;

    // Validate
    $errs = validate_blog($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    // Sanitize body HTML
    $data['body_html'] = sanitize_blog_html((string)$data['body_html']);

    // Filter reference rows
    $data['reference_links'] = array_values(array_filter(
        $data['reference_links'] ?? [],
        fn($r) => is_array($r) && !empty($r['label']) && !empty($r['url'])
    ));

    // Timestamps
    if ($originalId === null) $data['published_at'] = $nowIso;
    $data['updated_at'] = $nowIso;

    $posts = _upsert($posts, $data, $originalId);
}
elseif ($type === 'social') {
    // Validate first
    $errs = validate_social($data);
    if (!empty($errs)) json_fail(422, 'Validation failed', ['fields' => $errs]);

    // Generate id if new
    if ($originalId === null) {
        $stamp = date('Ymd-His');
        $data['id'] = $data['platform'] . '-' . $stamp;
    } else {
        $data['id'] = $originalId;
    }

    if ($originalId === null) $data['posted_at'] = $nowIso;
    $data['updated_at'] = $nowIso;

    $posts = _upsert($posts, $data, $originalId);
}

$existing['posts'] = $posts;
$existing['metadata']['lastUpdated'] = $nowIso;
$existing['metadata']['total'] = count($posts);

json_store_write($file, $existing, $backupDir);

echo json_encode(['success' => true, 'id' => $data['id']]);

function _upsert(array $posts, array $newItem, ?string $originalId): array {
    if ($originalId === null) {
        $posts[] = $newItem;
        return $posts;
    }
    $found = false;
    foreach ($posts as $i => $p) {
        if (($p['id'] ?? null) === $originalId) {
            $posts[$i] = $newItem;
            $found = true;
            break;
        }
    }
    if (!$found) $posts[] = $newItem;
    return $posts;
}

function _slugify(string $s): string {
    $s = strtolower(trim($s));
    $s = preg_replace('/[^a-z0-9\s-]/', '', $s);
    $s = preg_replace('/[\s_-]+/', '-', $s);
    return trim($s, '-');
}
```

- [ ] **Step 2: Manually verify via Playwright MCP**

With the PHP server running:
1. Log in, click "+ New Blog Post".
2. Fill title "Hello World", body "<p>First post</p>", save.
3. Verify redirect to dashboard and the row shows up.
4. Open `VEFS-website/data/blog.json` — verify post appended with sanitized body and timestamps.
5. Edit the post, change title, save — verify same `id` retained and `updated_at` changed but `published_at` unchanged.
6. Try posting with empty title — verify 422 error toast.

- [ ] **Step 3: Commit**

```bash
git add VEFS-website/admin/api/save.php
git commit -m "feat(admin): save endpoint with CSRF, validation, sanitization, upsert"
```

---

## Task 15: Delete and reorder API endpoints

**Files:**
- Create: `VEFS-website/admin/api/delete.php`
- Create: `VEFS-website/admin/api/reorder.php`

- [ ] **Step 1: Write `delete.php`**

Write `VEFS-website/admin/api/delete.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/../../includes/auth.php';
require __DIR__ . '/../../includes/csrf.php';
require __DIR__ . '/../../includes/json-store.php';

header('Content-Type: application/json');

auth_start_session();
if (!auth_check_logged_in()) { http_response_code(401); echo json_encode(['error' => 'Not authenticated']); exit; }

$body = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($body) || !csrf_verify($body['csrf'] ?? null)) {
    http_response_code(403); echo json_encode(['error' => 'CSRF']); exit;
}
$type = $body['type'] ?? '';
if (!in_array($type, ['blog', 'social'], true)) { http_response_code(400); echo json_encode(['error' => 'bad type']); exit; }
$id = (string)($body['id'] ?? '');

$dataDir = __DIR__ . '/../../data';
$file = $dataDir . '/' . $type . '.json';
$data = json_store_read($file);
$before = count($data['posts'] ?? []);
$data['posts'] = array_values(array_filter($data['posts'] ?? [], fn($p) => ($p['id'] ?? null) !== $id));
$data['metadata']['lastUpdated'] = date('c');
$data['metadata']['total'] = count($data['posts']);
json_store_write($file, $data, $dataDir . '/backups');
echo json_encode(['success' => true, 'removed' => $before - count($data['posts'])]);
```

- [ ] **Step 2: Write `reorder.php`**

Write `VEFS-website/admin/api/reorder.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/../../includes/auth.php';
require __DIR__ . '/../../includes/csrf.php';
require __DIR__ . '/../../includes/json-store.php';

header('Content-Type: application/json');

auth_start_session();
if (!auth_check_logged_in()) { http_response_code(401); echo json_encode(['error' => 'Not authenticated']); exit; }

$body = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($body) || !csrf_verify($body['csrf'] ?? null)) {
    http_response_code(403); echo json_encode(['error' => 'CSRF']); exit;
}
$type = $body['type'] ?? '';
if (!in_array($type, ['blog', 'social'], true)) { http_response_code(400); echo json_encode(['error' => 'bad type']); exit; }

$dataDir = __DIR__ . '/../../data';
$file = $dataDir . '/' . $type . '.json';
$data = json_store_read($file);
$posts =& $data['posts'];

if (isset($body['swap']) && is_array($body['swap']) && count($body['swap']) === 2) {
    [$idA, $idB] = $body['swap'];
    $iA = $iB = null;
    foreach ($posts as $i => $p) {
        if (($p['id'] ?? null) === $idA) $iA = $i;
        if (($p['id'] ?? null) === $idB) $iB = $i;
    }
    if ($iA === null || $iB === null) { http_response_code(404); echo json_encode(['error' => 'id not found']); exit; }
    $tmp = $posts[$iA]['order'] ?? 0;
    $posts[$iA]['order'] = $posts[$iB]['order'] ?? 0;
    $posts[$iB]['order'] = $tmp;
} elseif (isset($body['id'])) {
    $id = (string)$body['id'];
    $order = (int)($body['order'] ?? 0);
    if ($order < 0) { http_response_code(400); echo json_encode(['error' => 'order must be ≥ 0']); exit; }
    $found = false;
    foreach ($posts as &$p) {
        if (($p['id'] ?? null) === $id) { $p['order'] = $order; $found = true; break; }
    }
    unset($p);
    if (!$found) { http_response_code(404); echo json_encode(['error' => 'id not found']); exit; }
} else {
    http_response_code(400); echo json_encode(['error' => 'missing id or swap']); exit;
}

$data['metadata']['lastUpdated'] = date('c');
json_store_write($file, $data, $dataDir . '/backups');
echo json_encode(['success' => true]);
```

- [ ] **Step 3: Manually verify with Playwright MCP**

1. Create three blog posts. Verify they appear sorted by order in the dashboard.
2. Change one's order via the inline number input — wait for debounce, verify toast and JSON updated.
3. Use ▲/▼ arrows — verify rows swap.
4. Delete a post — verify row removed and JSON entry gone.

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/admin/api/delete.php VEFS-website/admin/api/reorder.php
git commit -m "feat(admin): delete and reorder API endpoints with CSRF"
```

---

## Task 16: Public blog index (`blog.html`)

**Files:**
- Create: `VEFS-website/blog.html`
- Create: `VEFS-website/js/blog.js`
- Create: `VEFS-website/css/components/blog.css`

- [ ] **Step 1: Write `blog.html`**

Use the same `<head>` and header/footer structure as `events.html` for visual consistency. Body:
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Blog — VEFS</title>
<meta name="description" content="Stories, updates, and learnings from VEFS — Valluvam Ecological Farming and Social Welfare Foundation.">
<link rel="stylesheet" href="/css/reset.css">
<link rel="stylesheet" href="/css/theme.css">
<link rel="stylesheet" href="/css/typography.css">
<link rel="stylesheet" href="/css/layout.css">
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/components/blog.css">
<link rel="stylesheet" href="/css/responsive-mobile.css">
</head>
<body>
<!-- INCLUDE SAME <header> as events.html -->

<main class="page-blog">
    <section class="page-hero">
        <div class="container">
            <h1>From the field</h1>
            <p class="lede">Stories, updates, and learnings from our work.</p>
        </div>
    </section>

    <section class="blog-list-section">
        <div class="container">
            <div id="blog-grid" class="blog-grid" aria-live="polite"></div>
            <nav id="blog-pagination" class="blog-pagination"></nav>
            <p id="blog-empty" class="empty-state" hidden>No posts yet. Check back soon.</p>
        </div>
    </section>
</main>

<!-- INCLUDE SAME <footer> as events.html -->

<script src="/js/utils.js"></script>
<script src="/js/blog.js"></script>
</body>
</html>
```

(Engineer: copy the actual `<header>` and `<footer>` markup from `VEFS-website/events.html`.)

- [ ] **Step 2: Write `blog.js`**

Write `VEFS-website/js/blog.js`:
```javascript
(async function() {
    const PER_PAGE = 6;
    const grid = document.getElementById('blog-grid');
    const pagi = document.getElementById('blog-pagination');
    const empty = document.getElementById('blog-empty');

    const params = new URLSearchParams(location.search);
    const page = Math.max(1, parseInt(params.get('page') || '1', 10));

    let data;
    try {
        const res = await fetch('/data/blog.json?v=' + Date.now(), { cache: 'no-store' });
        data = await res.json();
    } catch (e) {
        empty.textContent = 'Could not load blog posts.';
        empty.hidden = false;
        return;
    }

    const posts = (data.posts || []).slice().sort((a, b) => (a.order ?? 9e9) - (b.order ?? 9e9));
    if (posts.length === 0) { empty.hidden = false; return; }

    const totalPages = Math.ceil(posts.length / PER_PAGE);
    const safePage = Math.min(page, totalPages);
    const slice = posts.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    function cldOpt(url) {
        if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
        return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
    }

    grid.innerHTML = slice.map(p => `
        <article class="blog-card">
            <a class="blog-card-link" href="/blog/${encodeURIComponent(p.id)}">
                ${p.cover_image_url ? `<img class="blog-card-cover" src="${cldOpt(p.cover_image_url)}" alt="" loading="lazy" width="800" height="500">` : ''}
                <div class="blog-card-body">
                    <h2 class="blog-card-title">${escapeHtml(p.title || '')}</h2>
                    ${p.subtitle ? `<p class="blog-card-subtitle">${escapeHtml(p.subtitle)}</p>` : ''}
                    <p class="blog-card-meta">${formatDate(p.published_at)}</p>
                    <span class="blog-card-cta">Read more →</span>
                </div>
            </a>
        </article>
    `).join('');

    // Pagination
    if (totalPages > 1) {
        const links = [];
        for (let i = 1; i <= totalPages; i++) {
            links.push(`<a href="?page=${i}" class="${i===safePage?'active':''}">${i}</a>`);
        }
        pagi.innerHTML = links.join('');
    }

    function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function formatDate(iso) {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch { return ''; }
    }
})();
```

- [ ] **Step 3: Write `css/components/blog.css`**

Write `VEFS-website/css/components/blog.css`:
```css
.page-blog .page-hero { background: var(--color-bg, #f7f5f0); padding: 3rem 0 1.5rem; text-align: center; }
.page-blog .page-hero h1 { font-family: var(--font-serif, "Lora", Georgia, serif); margin: 0 0 0.5rem; }
.page-blog .page-hero .lede { color: var(--color-muted, #6b6b6b); max-width: 36rem; margin: 0 auto; }

.blog-list-section { padding: 2.5rem 0 4rem; }
.blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.blog-card { background: #fff; border: 1px solid #e6e0d3; border-radius: 8px; overflow: hidden; transition: box-shadow 0.18s ease; }
.blog-card:hover { box-shadow: 0 8px 18px rgba(0,0,0,0.08); }
.blog-card-link { color: inherit; text-decoration: none; display: block; }
.blog-card-cover { width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block; background: #eee; }
.blog-card-body { padding: 1rem 1.1rem 1.2rem; }
.blog-card-title { font-family: var(--font-serif, "Lora", Georgia, serif); font-size: 1.25rem; margin: 0 0 0.4rem; }
.blog-card-subtitle { color: var(--color-muted, #555); margin: 0 0 0.6rem; font-size: 0.95rem; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.blog-card-meta { color: #888; font-size: 0.85rem; margin: 0 0 0.6rem; }
.blog-card-cta { color: var(--color-primary, #6B8E23); font-weight: 600; font-size: 0.9rem; }

.blog-pagination { display: flex; justify-content: center; gap: 0.4rem; margin: 2.5rem 0 0; }
.blog-pagination a { padding: 0.45rem 0.85rem; border: 1px solid #e0e0e0; border-radius: 4px; text-decoration: none; color: var(--color-text, #2c2c2c); }
.blog-pagination a.active { background: var(--color-primary, #6B8E23); color: #fff; border-color: var(--color-primary, #6B8E23); }
.empty-state { text-align: center; color: #888; padding: 3rem 1rem; }

/* Single post */
.blog-single { max-width: 760px; margin: 0 auto; padding: 0 1rem 4rem; }
.blog-single-cover { width: 100%; max-height: 480px; object-fit: cover; border-radius: 8px; margin: 1.5rem 0; }
.blog-single-title { font-family: var(--font-serif, "Lora", Georgia, serif); font-size: 2.2rem; margin: 0 0 0.5rem; }
.blog-single-subtitle { color: var(--color-muted, #555); font-size: 1.15rem; margin: 0 0 1rem; font-weight: 400; }
.blog-single-meta { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }
.blog-single-body { line-height: 1.75; font-size: 1.05rem; }
.blog-single-body img { max-width: 100%; height: auto; border-radius: 6px; margin: 1.5rem 0; }
.blog-single-body h2, .blog-single-body h3 { font-family: var(--font-serif, "Lora", Georgia, serif); margin-top: 2rem; }
.blog-single-body blockquote { border-left: 4px solid var(--color-primary, #6B8E23); padding: 0.5rem 1rem; color: #555; font-style: italic; margin: 1.5rem 0; }
.blog-references { margin: 2.5rem 0; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; }
.blog-references h3 { margin-top: 0; }
.blog-cta { display: inline-block; background: var(--color-secondary, #D4A574); color: #fff; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; margin: 2rem 0 1rem; }
.blog-share { display: flex; gap: 0.6rem; align-items: center; margin: 2rem 0 1rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; }
.blog-share button, .blog-share a { background: #fff; border: 1px solid #ddd; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; text-decoration: none; color: inherit; font-size: 0.9rem; }
```

- [ ] **Step 4: Manually verify with Playwright MCP**

Navigate to `http://localhost:8000/blog.html`. Verify the seed posts created earlier render. Click a card — it goes to `/blog/<slug>` which will 404 until next task.

- [ ] **Step 5: Commit**

```bash
git add VEFS-website/blog.html VEFS-website/js/blog.js VEFS-website/css/components/blog.css
git commit -m "feat(public): blog index page with pagination and Cloudinary auto-format"
```

---

## Task 17: Public single-post page with OG tags

**Files:**
- Create: `VEFS-website/blog-post.php`
- Create: `VEFS-website/js/blog-post.js`

- [ ] **Step 1: Write `blog-post.php`**

Write `VEFS-website/blog-post.php`:
```php
<?php
declare(strict_types=1);
require __DIR__ . '/includes/json-store.php';

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
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= $title ?></title>
<meta name="description" content="<?= $desc ?>">
<link rel="canonical" href="<?= $canonical ?>">

<meta property="og:type" content="article">
<meta property="og:url" content="<?= $canonical ?>">
<meta property="og:title" content="<?= $title ?>">
<meta property="og:description" content="<?= $desc ?>">
<?php if ($cover): ?><meta property="og:image" content="<?= htmlspecialchars($cover, ENT_QUOTES, 'UTF-8') ?>"><?php endif; ?>
<meta name="twitter:card" content="summary_large_image">

<link rel="stylesheet" href="/css/reset.css">
<link rel="stylesheet" href="/css/theme.css">
<link rel="stylesheet" href="/css/typography.css">
<link rel="stylesheet" href="/css/layout.css">
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/components/blog.css">
<link rel="stylesheet" href="/css/responsive-mobile.css">
</head>
<body>
<!-- INCLUDE SAME <header> as events.html -->

<main>
<?php if (!$post): ?>
    <section class="blog-single">
        <h1>Post not found</h1>
        <p>The post you are looking for doesn't exist. <a href="/blog.html">Back to blog</a>.</p>
    </section>
<?php else: ?>
    <article class="blog-single">
        <?php if ($cover): ?>
            <img class="blog-single-cover" src="<?= htmlspecialchars($cover, ENT_QUOTES, 'UTF-8') ?>" alt="" fetchpriority="high" width="1200" height="600">
        <?php endif; ?>
        <h1 class="blog-single-title"><?= htmlspecialchars((string)$post['title'], ENT_QUOTES, 'UTF-8') ?></h1>
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
<?php endif; ?>
</main>

<!-- INCLUDE SAME <footer> as events.html -->

<script src="/js/blog-post.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `blog-post.js`**

Write `VEFS-website/js/blog-post.js`:
```javascript
(function() {
    const url = location.href;
    const title = document.title;
    const wa = document.getElementById('share-wa');
    const fb = document.getElementById('share-fb');
    const tw = document.getElementById('share-tw');
    const copy = document.getElementById('share-copy');
    if (!wa) return;

    wa.href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
    fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    tw.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(url);
        copy.textContent = 'Copied ✓';
        setTimeout(() => copy.textContent = 'Copy link', 2000);
    });
})();
```

- [ ] **Step 3: Manually verify with Playwright MCP**

1. From `/blog.html`, click a post — should land on `/blog/<slug>` (rewritten by .htaccess to `/blog-post.php?id=<slug>`). Note: the PHP CLI server doesn't honor .htaccess; for local testing visit `/blog-post.php?id=<slug>` directly.
2. Verify cover, title, subtitle, body, references, CTA, and share row render.
3. View page source — confirm `<meta property="og:title">`, `og:description`, `og:image` are present with real values.
4. Click "Copy link" — verify clipboard updated.
5. Hit a bogus slug — verify 404 page renders.

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/blog-post.php VEFS-website/js/blog-post.js
git commit -m "feat(public): single blog post page with OG tags, references, CTA, share row"
```

---

## Task 18: Home page sections (blog teaser + social grid)

**Files:**
- Modify: `VEFS-website/index.html`
- Create: `VEFS-website/js/blog-home.js`
- Create: `VEFS-website/js/social-home.js`
- Modify: `VEFS-website/css/components/blog.css` (add social-grid styles)

- [ ] **Step 1: Inspect existing index.html structure**

Read `VEFS-website/index.html` and identify a good insertion point — typically near the bottom of `<main>`, after existing featured content but before the footer.

- [ ] **Step 2: Add the two sections to `index.html`**

Insert before the closing `</main>` (or before the footer):
```html
<section class="home-blog-teaser">
    <div class="container">
        <h2 class="section-title">Latest from the blog</h2>
        <div id="home-blog-grid" class="blog-grid blog-grid-3"></div>
        <p class="section-cta-row"><a href="/blog.html" class="btn btn-secondary">View all blogs →</a></p>
    </div>
</section>

<section class="home-social-section">
    <div class="container">
        <h2 class="section-title">Follow our work</h2>
        <p class="section-lede">Updates from our YouTube, Instagram, and Facebook.</p>
        <div id="home-social-grid" class="social-grid"></div>
        <p class="section-cta-row"><button id="social-load-more" class="btn btn-ghost" hidden>Load more</button></p>
    </div>
</section>
```

Also add to the page's `<link>` section if not already linked:
```html
<link rel="stylesheet" href="/css/components/blog.css">
```

And before `</body>`:
```html
<script src="/js/blog-home.js"></script>
<script src="/js/social-home.js"></script>
```

- [ ] **Step 3: Write `blog-home.js`**

Write `VEFS-website/js/blog-home.js`:
```javascript
(async function() {
    const grid = document.getElementById('home-blog-grid');
    if (!grid) return;
    try {
        const res = await fetch('/data/blog.json?v=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        const posts = (data.posts || []).slice().sort((a, b) => (a.order ?? 9e9) - (b.order ?? 9e9)).slice(0, 3);
        if (posts.length === 0) { grid.closest('section').hidden = true; return; }
        const cld = (u) => (typeof u === 'string' && u.includes('res.cloudinary.com')) ? u.replace('/upload/', '/upload/f_auto,q_auto,w_600/') : u;
        const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        grid.innerHTML = posts.map(p => `
            <article class="blog-card">
                <a class="blog-card-link" href="/blog/${encodeURIComponent(p.id)}">
                    ${p.cover_image_url ? `<img class="blog-card-cover" src="${cld(p.cover_image_url)}" alt="" loading="lazy" width="600" height="375">` : ''}
                    <div class="blog-card-body">
                        <h3 class="blog-card-title">${esc(p.title || '')}</h3>
                        ${p.subtitle ? `<p class="blog-card-subtitle">${esc(p.subtitle)}</p>` : ''}
                    </div>
                </a>
            </article>`).join('');
    } catch (e) { grid.closest('section').hidden = true; }
})();
```

- [ ] **Step 4: Write `social-home.js`**

Write `VEFS-website/js/social-home.js`:
```javascript
(async function() {
    const PER_BATCH = 9;
    const grid = document.getElementById('home-social-grid');
    const more = document.getElementById('social-load-more');
    if (!grid) return;

    let posts;
    try {
        const res = await fetch('/data/social.json?v=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        posts = (data.posts || []).slice().sort((a, b) => (a.order ?? 9e9) - (b.order ?? 9e9));
    } catch (e) {
        grid.closest('section').hidden = true; return;
    }
    if (posts.length === 0) { grid.closest('section').hidden = true; return; }

    const ICONS = {
        youtube: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000" aria-label="YouTube"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
        instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#E4405F" aria-label="Instagram"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.3.4.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.4.4 1.1.4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.3-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.4.2-1.1.4-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.3-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.3.2-.6.5-1 1-1.5s.9-.8 1.5-1c.4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 5.4a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm5.6-.7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg>',
        facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" aria-label="Facebook"><path d="M22 12a10 10 0 1 0-11.6 9.9V15h-2.5v-3h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 3h-2.3v6.9A10 10 0 0 0 22 12z"/></svg>',
    };

    let shown = 0;
    function renderBatch() {
        const batch = posts.slice(shown, shown + PER_BATCH);
        const cld = (u) => (typeof u === 'string' && u.includes('res.cloudinary.com')) ? u.replace('/upload/', '/upload/f_auto,q_auto,w_500/') : u;
        const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const html = batch.map(p => `
            <a class="social-card social-card-${esc(p.platform)}" href="${esc(p.post_url)}" target="_blank" rel="noopener noreferrer">
                <div class="social-card-thumb-wrap">
                    <img class="social-card-thumb" src="${cld(p.thumbnail_url)}" alt="" loading="lazy">
                    <span class="social-card-badge">${ICONS[p.platform] || ''}</span>
                </div>
                <p class="social-card-caption">${esc(p.caption || '')}</p>
            </a>`).join('');
        grid.insertAdjacentHTML('beforeend', html);
        shown += batch.length;
        if (shown < posts.length) more.hidden = false; else more.hidden = true;
    }
    renderBatch();
    more.addEventListener('click', renderBatch);
})();
```

- [ ] **Step 5: Append social-grid styles to `blog.css`**

Append to `VEFS-website/css/components/blog.css`:
```css
.home-blog-teaser, .home-social-section { padding: 3rem 0; }
.home-blog-teaser { background: #fafaf6; }
.section-title { font-family: var(--font-serif, "Lora", Georgia, serif); font-size: 1.8rem; text-align: center; margin: 0 0 0.5rem; }
.section-lede { text-align: center; color: var(--color-muted, #6b6b6b); margin: 0 auto 1.5rem; max-width: 36rem; }
.section-cta-row { text-align: center; margin: 1.5rem 0 0; }
.blog-grid-3 { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }

.social-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
.social-card { background: #fff; border: 1px solid #e6e0d3; border-radius: 8px; overflow: hidden; text-decoration: none; color: inherit; transition: transform 0.15s ease; display: block; }
.social-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0,0,0,0.08); }
.social-card-thumb-wrap { position: relative; aspect-ratio: 16/9; background: #eee; }
.social-card-instagram .social-card-thumb-wrap, .social-card-facebook .social-card-thumb-wrap { aspect-ratio: 1/1; }
.social-card-thumb { width: 100%; height: 100%; object-fit: cover; display: block; }
.social-card-badge { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.95); border-radius: 999px; padding: 0.25rem; display: flex; }
.social-card-caption { padding: 0.7rem 0.85rem 0.9rem; margin: 0; font-size: 0.92rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.7em; }
```

- [ ] **Step 6: Manually verify with Playwright MCP**

1. Create 4+ blog posts and 12+ social posts via the admin.
2. Open `/index.html`. Verify blog section shows top 3, social section shows top 9.
3. Click "Load more" — verify next 9 appear, button hides when no more.
4. Click a social card — verify it opens the platform URL in new tab.
5. Verify console has no JS errors.
6. Test mobile viewport (375px) — both grids should be 1 column.

- [ ] **Step 7: Commit**

```bash
git add VEFS-website/index.html VEFS-website/js/blog-home.js VEFS-website/js/social-home.js VEFS-website/css/components/blog.css
git commit -m "feat(public): home page blog teaser and social grid sections"
```

---

## Task 19: Audit log + Cloudinary preset configuration doc

**Files:**
- Modify: `VEFS-website/admin/api/save.php`
- Modify: `VEFS-website/admin/api/delete.php`
- Modify: `VEFS-website/admin/api/reorder.php`
- Modify: `VEFS-website/includes/auth.php`
- Create: `VEFS-builder/06-DOCUMENTATION/CLOUDINARY_SETUP.md`

- [ ] **Step 1: Add audit logger to auth**

Append to `VEFS-website/includes/auth.php`:
```php
function audit_log(string $action, string $type = '', string $entityId = ''): void {
    $path = __DIR__ . '/../data/.audit-log.json';
    $entry = [
        'ts' => date('c'),
        'action' => $action,
        'type' => $type,
        'id' => $entityId,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'cli',
    ];
    $fp = fopen($path, 'a');
    if ($fp === false) return;
    if (flock($fp, LOCK_EX)) {
        fwrite($fp, json_encode($entry, JSON_UNESCAPED_SLASHES) . "\n");
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}
```

(Note: append-line format keeps the log durable without re-reading. Pretty-JSON is not needed.)

- [ ] **Step 2: Call audit_log from each write endpoint**

In `save.php` just before the final `echo`:
```php
audit_log($originalId === null ? 'create' : 'update', $type, (string)$data['id']);
```

In `delete.php` just before the final `echo`:
```php
audit_log('delete', $type, $id);
```

In `reorder.php` just before the final `echo`:
```php
audit_log('reorder', $type, $body['id'] ?? implode(',', $body['swap'] ?? []));
```

- [ ] **Step 3: Write Cloudinary setup guide**

Write `VEFS-builder/06-DOCUMENTATION/CLOUDINARY_SETUP.md`:
```markdown
# Cloudinary Setup for VEFS Admin

The admin area uploads images directly browser→Cloudinary using an unsigned upload preset. No images are stored on Hostinger disk.

## One-time setup (developer)

1. Sign up at https://cloudinary.com (free tier: 25 GB storage, 25 GB bandwidth/month).
2. From the dashboard, note your **Cloud name** (e.g. `dxabc1234`).
3. Settings → Upload → "Add upload preset":
   - **Preset name:** `vefs_unsigned`
   - **Signing mode:** Unsigned
   - **Folder:** `vefs/`
   - **Use filename:** No
   - **Unique filename:** Yes
   - **Allowed formats:** `jpg,jpeg,png,webp`
   - **Max file size:** `5000000` (5 MB)
   - **Max image width:** `2000`
   - **Max image height:** `2000`
   - **Auto-format:** `auto` (under "Media analysis and AI" or "Delivery")
   - **Quality:** `auto`
   - Save.
4. Edit `VEFS-website/admin/config.php`:
   ```php
   'cloudinary' => [
       'cloud_name' => 'dxabc1234',
       'upload_preset' => 'vefs_unsigned',
   ],
   ```

## Rotating the preset (if compromised)

Cloudinary Settings → Upload → Delete `vefs_unsigned`, create `vefs_unsigned_v2` with the same locks, update `config.php`. Old uploads stay accessible by URL; new uploads use the new preset.

## Verifying public URLs

A successful upload returns `secure_url` like:
```
https://res.cloudinary.com/dxabc1234/image/upload/v1700000000/vefs/abc123.jpg
```

The site appends `f_auto,q_auto` at render time:
```
https://res.cloudinary.com/dxabc1234/image/upload/f_auto,q_auto,w_800/v1700000000/vefs/abc123.jpg
```
Cloudinary delivers WebP to supporting browsers, original format otherwise — automatically.
```

- [ ] **Step 4: Commit**

```bash
git add VEFS-website/includes/auth.php VEFS-website/admin/api/save.php VEFS-website/admin/api/delete.php VEFS-website/admin/api/reorder.php VEFS-builder/06-DOCUMENTATION/CLOUDINARY_SETUP.md
git commit -m "feat(admin): audit log + Cloudinary setup documentation"
```

---

## Task 20: End-to-end verification with Playwright MCP

**Files:** none (verification only)

- [ ] **Step 1: Reset to clean state**

Stop any running PHP server. Delete test data:
```bash
echo '{"metadata":{"version":"1.0","lastUpdated":"2026-05-28T00:00:00+05:30","total":0},"posts":[]}' > VEFS-website/data/blog.json
echo '{"metadata":{"version":"1.0","lastUpdated":"2026-05-28T00:00:00+05:30","total":0},"posts":[]}' > VEFS-website/data/social.json
rm -f VEFS-website/data/.login-attempts.json VEFS-website/data/.audit-log.json
rm -f VEFS-website/data/backups/*.json
```

Start PHP server:
```bash
cd VEFS-website && php -S localhost:8000
```

- [ ] **Step 2: Run all PHP CLI tests**

```bash
php VEFS-website/tests/test-json-store.php && \
php VEFS-website/tests/test-csrf.php && \
php VEFS-website/tests/test-sanitize-html.php && \
php VEFS-website/tests/test-validate.php
```
Expected: all green, exit 0.

- [ ] **Step 3: Playwright MCP — full admin happy path**

Using Playwright MCP, execute and screenshot at each step:
1. Navigate `/admin/index.php` → see login form.
2. Submit wrong password 5× → see lockout message.
3. Clear `data/.login-attempts.json`. Submit correct password → land on dashboard.
4. Click "+ New Blog Post" → see form. Fill title "Welcome to the VEFS blog", subtitle "Our first post", body `<p>Hello world. <strong>Welcome.</strong></p>`, add one reference link, CTA text "Visit our trainings" with URL `/trainings.html`. Save.
5. Verify redirect to dashboard with the row visible, order=10.
6. Click Edit → change subtitle → save → verify update.
7. Add a second blog post (order auto = 20). Use the ▲ arrow on the second row → verify order values swap.
8. Switch to Social tab. Click "+ New Social Post". Choose YouTube, paste a YouTube URL (e.g. `https://www.youtube.com/watch?v=dQw4w9WgXcQ`), click "Use YouTube thumbnail" → verify thumbnail loads. Fill caption "Sample video". Save.
9. Add two more social posts (different platforms — use any image upload).
10. Delete one — verify row removed.

- [ ] **Step 4: Playwright MCP — public verification**

1. Navigate `/blog.html` → verify both blog posts render in cards, sorted by order.
2. Click a card → confirm URL is `/blog-post.php?id=<slug>` (locally; production rewrites to `/blog/<slug>`). Verify cover, title, subtitle, body, reference link, CTA, share row all render.
3. View page source: confirm `og:title`, `og:description`, `og:image` are populated.
4. Navigate `/index.html` → verify "Latest from the blog" shows top 3 and "Follow our work" shows the 3 social posts.
5. Resize to 375px viewport → verify single-column layout, no overflow.
6. Open browser console → verify no errors anywhere.

- [ ] **Step 5: Security spot-checks**

1. While logged out, `curl http://localhost:8000/admin/dashboard.php` → expect 302 redirect to login.
2. While logged out, `curl -X POST http://localhost:8000/admin/api/save.php -H 'Content-Type: application/json' -d '{"type":"blog"}'` → expect 401 JSON.
3. While logged in (browser), use devtools to submit a save without the CSRF token → expect 403.
4. `curl http://localhost:8000/admin/config.php` → expect 403 from `.htaccess` (note: the PHP CLI server does not honor `.htaccess`; this check must run against an Apache deployment — flag for production verification).
5. Try saving a blog post with `<script>alert(1)</script>` in the body → verify the saved JSON has the `<script>` stripped.

- [ ] **Step 6: Commit verification screenshots**

Save screenshots to `VEFS-builder/04-TESTING/screenshots/phase1-admin/` per `CLAUDE.md` conventions. Commit:
```bash
git add VEFS-builder/04-TESTING/screenshots/phase1-admin/
git commit -m "test(admin): phase 1 end-to-end verification screenshots"
```

---

## Phase 2 (follow-up plan)

After Phase 1 ships and is validated in production, a follow-up plan will add Events / Trainings / Volunteer admin tabs reusing the entire infrastructure built here (`auth`, `csrf`, `json-store`, `sanitize-html`, `validate`, `Cloudinary` JS). Per the spec, only the per-type form pages and `validate.php` extensions are new — the dashboard gains three more tabs, the save endpoint gains three new `type` branches.

**Phase 2 spec sections:** §4.3, §5.5, §8 (Phase 2 bullet) of `docs/superpowers/specs/2026-05-28-content-admin-design.md`.

---

## Notes for the executing engineer

- **Hostinger production deployment:** files in `VEFS-website/` are uploaded via FTP to `public_html/`. `admin/config.php` must be uploaded manually (it's gitignored). The `.htaccess` rules only take effect on Apache — local PHP CLI server (`php -S`) ignores them, so for local testing you'll hit `/admin/api/save.php` directly rather than via clean URLs.
- **Header/footer markup:** Tasks 16 and 17 say "INCLUDE SAME `<header>` as events.html" — copy the actual HTML; there is no server-side include system in this project. (A future enhancement could extract these to PHP includes.)
- **PHP version:** Requires PHP 7.4+ for `password_hash` default cost and arrow functions used in scripts. Hostinger defaults to PHP 8.x; verify in hPanel.
- **Backups:** Keep `data/backups/` writable (755) on production. If you ever need to restore, copy the chosen `<file>-YYYYMMDD-HHMMSS.json` back to `data/<file>.json`.
- **The first password:** Task 7 generates a `changeme` hash. **Before production**, generate a strong password hash and update `config.php` on the server.
