<?php
declare(strict_types=1);

/**
 * Maps a content type to its top-level array key inside the JSON file.
 * Blog and social use "posts" (Phase 1); the new types use plural type names.
 */
function admin_array_key_for_type(string $type): ?string {
    return [
        'blog'      => 'posts',
        'social'    => 'posts',
        'event'     => 'events',
        'training'  => 'trainings',
        'volunteer' => 'volunteers',
        'gallery'   => 'items',
        'project'   => 'projects',
    ][$type] ?? null;
}

/**
 * Returns the human display title for a row, regardless of type.
 */
function admin_display_title(string $type, array $row): string {
    if ($type === 'social')  return (string)($row['caption'] ?? '');
    if ($type === 'project') return (string)($row['name'] ?? '');
    return (string)($row['title'] ?? '');
}

/**
 * Returns the thumbnail URL for a row, regardless of type.
 */
function admin_display_thumb(string $type, array $row): string {
    if ($type === 'project') {
        return (string)($row['hero_image_url'] ?? '');
    }
    return (string)(
        $row['cover_image_url']
        ?? $row['thumbnail_url']
        ?? $row['imageUrl']
        ?? $row['images']['featured']
        ?? $row['media']['featuredImage']
        ?? ''
    );
}

function admin_data_file(string $type): string {
    return __DIR__ . '/../data/' . admin_data_filename($type);
}

function admin_data_filename(string $type): string {
    return [
        'blog'      => 'blog.json',
        'social'    => 'social.json',
        'event'     => 'events.json',
        'training'  => 'trainings.json',
        'volunteer' => 'volunteers.json',
        'gallery'   => 'gallery.json',
        'project'   => 'projects.json',
    ][$type];
}

function cloudinary_url(string $publicId, string $transform = ''): string {
    $cloud = getenv('CLOUDINARY_CLOUD_NAME') ?: 'vefs';
    $tx = $transform === '' ? '' : ('/' . $transform);
    return "https://res.cloudinary.com/{$cloud}/image/upload{$tx}/{$publicId}";
}

/**
 * Auto-numbers a new id like "evt-007", "trn-003", "vol-012".
 */
function admin_next_id(string $prefix, array $existingItems): string {
    $max = 0;
    foreach ($existingItems as $item) {
        $id = (string)($item['id'] ?? '');
        if (preg_match('/^' . preg_quote($prefix, '/') . '-(\d+)$/', $id, $m)) {
            $max = max($max, (int)$m[1]);
        }
    }
    return $prefix . '-' . str_pad((string)($max + 1), 3, '0', STR_PAD_LEFT);
}
