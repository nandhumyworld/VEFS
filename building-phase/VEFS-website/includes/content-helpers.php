<?php
declare(strict_types=1);

/**
 * Mirrors js/utils.js::isItemNew for PHP-rendered pages (e.g. blog-post.php).
 *
 * @param array $item Content item from data/<type>.json
 * @return bool
 */
function is_item_new(array $item): bool {
    $flag = $item['isNew'] ?? 'auto';
    if ($flag === true)  return true;
    if ($flag === false) return false;

    $created = (string)($item['createdAt'] ?? $item['created_at'] ?? '');
    if ($created === '') return false;

    $ts = strtotime($created);
    if ($ts === false) return false;

    $ageSec = time() - $ts;
    return $ageSec >= 0 && $ageSec < 7 * 24 * 60 * 60;
}

/** Returns the markup for the NEW badge (or empty string). */
function render_new_badge(array $item): string {
    return is_item_new($item) ? '<span class="badge-new">NEW</span>' : '';
}
