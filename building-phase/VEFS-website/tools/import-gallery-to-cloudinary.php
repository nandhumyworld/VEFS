<?php
declare(strict_types=1);

/**
 * One-shot CLI: upload VEFS-website/images/gallery/*.{jpg,jpeg,png,webp} to
 * Cloudinary (unsigned preset from admin/config.php), append items to
 * data/gallery.json matching the admin form's shape, and move processed files
 * to VEFS-website/images/gallery-archive/.
 *
 * Usage (from VEFS-website/):
 *   php tools/import-gallery-to-cloudinary.php           # do it
 *   php tools/import-gallery-to-cloudinary.php --dry-run # plan only
 *
 * Idempotent: re-running skips files already recorded in tools/.import-state.json.
 */

if (PHP_SAPI !== 'cli') { fwrite(STDERR, "CLI only\n"); exit(1); }

$root        = realpath(__DIR__ . '/..');
$galleryDir  = $root . '/images/gallery';
$archiveDir  = $root . '/images/gallery-archive';
$dataFile    = $root . '/data/gallery.json';
$backupDir   = $root . '/data/backups';
$stateFile   = __DIR__ . '/.import-state.json';
$dryRun      = in_array('--dry-run', $argv, true);

require $root . '/includes/json-store.php';
require $root . '/includes/admin-helpers.php';

$cfg = require $root . '/admin/config.php';
$cloudName    = $cfg['cloudinary']['cloud_name']    ?? '';
$uploadPreset = $cfg['cloudinary']['upload_preset'] ?? '';
if ($cloudName === '' || $uploadPreset === '' || strpos($cloudName, 'REPLACE') !== false) {
    fwrite(STDERR, "Cloudinary not configured in admin/config.php\n");
    exit(1);
}

if (!is_dir($galleryDir)) { fwrite(STDERR, "Missing: $galleryDir\n"); exit(1); }
if (!is_dir($archiveDir) && !$dryRun) { mkdir($archiveDir, 0755, true); }

$state = is_file($stateFile) ? (json_decode((string)file_get_contents($stateFile), true) ?: []) : [];
$state['imported'] = $state['imported'] ?? [];

$files = [];
foreach (scandir($galleryDir) ?: [] as $f) {
    if ($f === '.' || $f === '..') continue;
    if (!preg_match('/\.(jpe?g|png|webp)$/i', $f)) continue;
    $files[] = $f;
}
sort($files);

if (!$files) { echo "No images found in $galleryDir\n"; exit(0); }

$data = json_store_read($dataFile);
$items = $data['items'] ?? [];

$uploaded = 0; $skipped = 0; $failed = 0;

foreach ($files as $name) {
    $path = $galleryDir . '/' . $name;
    if (in_array($name, $state['imported'], true)) {
        echo "[skip ] $name (already imported)\n";
        $skipped++; continue;
    }

    $year = detect_year($path, $name);
    echo ($dryRun ? "[plan ] " : "[up   ] ") . "$name  year=$year\n";

    if ($dryRun) continue;

    try {
        $url = cloudinary_upload($path, $cloudName, $uploadPreset);
    } catch (Throwable $e) {
        echo "[fail ] $name: " . $e->getMessage() . "\n";
        $failed++; continue;
    }

    $id = admin_next_id('gal', $items);
    $iso = sprintf('%04d-01-01T00:00:00+00:00', $year);
    $items[] = [
        'id'               => $id,
        'title'            => '',
        'description'      => '',
        'year'             => $year,
        'imageUrl'         => $url,
        'isNew'            => false,
        'disabled'         => false,
        'hiddenFromPublic' => false,
        'enabled'          => true,
        'createdAt'        => $iso,
        'updatedAt'        => gmdate('c'),
    ];

    $data['items'] = $items;
    $data['metadata']['lastUpdated'] = gmdate('c');
    $data['metadata']['total'] = count($items);
    json_store_write($dataFile, $data, $backupDir);

    $dest = $archiveDir . '/' . $name;
    if (!@rename($path, $dest)) {
        echo "[warn ] uploaded but could not move $name to archive\n";
    }

    $state['imported'][] = $name;
    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT));

    echo "[ok   ] $name -> $id  $url\n";
    $uploaded++;
}

echo "\nDone. uploaded=$uploaded skipped=$skipped failed=$failed total_items=" . count($items) . "\n";


// ---------------- helpers ----------------

function detect_year(string $path, string $name): int {
    // 1. EXIF DateTimeOriginal (JPEG only)
    if (function_exists('exif_read_data') && preg_match('/\.jpe?g$/i', $name)) {
        $exif = @exif_read_data($path);
        if (is_array($exif)) {
            $dt = $exif['DateTimeOriginal'] ?? $exif['DateTime'] ?? null;
            if (is_string($dt) && preg_match('/^(\d{4})/', $dt, $m)) {
                $y = (int)$m[1];
                if ($y >= 2000 && $y <= (int)date('Y')) return $y;
            }
        }
    }
    // 2. Filename patterns
    //    YYYYMMDD_..., IMG-YYYYMMDD-..., Screenshot_YYYYMMDD_..., VideoCapture_YYYYMMDD-...
    if (preg_match('/(?:^|[_\-])((?:19|20)\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])/', $name, $m)) {
        return (int)$m[1];
    }
    //    Any 13-digit unix-ms run (FB_IMG_<ms>, bare <ms>.jpg, etc.)
    if (preg_match('/(?<!\d)(\d{13})(?!\d)/', $name, $m)) {
        $ts = (int)substr($m[1], 0, 10);
        $y = (int)gmdate('Y', $ts);
        if ($y >= 2000 && $y <= (int)date('Y')) return $y;
    }
    // 3. File mtime fallback
    $y = (int)date('Y', (int)filemtime($path));
    return $y >= 2000 ? $y : (int)date('Y');
}

function cloudinary_upload(string $path, string $cloudName, string $preset): string {
    $url = "https://api.cloudinary.com/v1_1/$cloudName/image/upload";
    $ch = curl_init($url);
    $post = [
        'upload_preset' => $preset,
        'file'          => new CURLFile($path),
    ];
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $post,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 120,
        // Local one-shot CLI; bundled PHP has no CA bundle. Endpoint is fixed Cloudinary.
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    if ($body === false) throw new RuntimeException("cURL error: $err");
    $json = json_decode((string)$body, true);
    if ($code < 200 || $code >= 300 || !is_array($json) || empty($json['secure_url'])) {
        $msg = is_array($json) ? json_encode($json) : substr((string)$body, 0, 300);
        throw new RuntimeException("HTTP $code: $msg");
    }
    return (string)$json['secure_url'];
}
