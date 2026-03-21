<?php
/**
 * Gallery Image Scanner
 * Scans images/gallery/ and returns a JSON list of images.
 * Simply upload new images to that folder — they will appear automatically.
 */

header('Content-Type: application/json');

$galleryDir = __DIR__ . '/images/gallery/';
$webPath    = 'images/gallery/';
$allowed    = ['jpg', 'jpeg', 'png', 'webp'];

$images = [];

if (is_dir($galleryDir)) {
    $files = scandir($galleryDir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed)) continue;

        $images[] = [
            'filename' => $file,
            'url'      => $webPath . $file,
            'size'     => filesize($galleryDir . $file),
            'modified' => filemtime($galleryDir . $file),
        ];
    }
    // Sort newest modified first
    usort($images, fn($a, $b) => $b['modified'] - $a['modified']);
}

echo json_encode($images, JSON_UNESCAPED_SLASHES);
