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

    if (array_key_exists('isNew', $d)) {
        $err = _validate_is_new($d['isNew']);
        if ($err !== null) $e['isNew'] = $err;
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

    if (array_key_exists('isNew', $d)) {
        $err = _validate_is_new($d['isNew']);
        if ($err !== null) $e['isNew'] = $err;
    }

    return $e;
}

function validate_event(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be ≤ 200 characters.';

    if (isset($d['slug']) && $d['slug'] !== '' && !preg_match('/^[a-z0-9-]+$/', (string)$d['slug'])) {
        $e['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    $types = ['market', 'workshop', 'conference', 'meetup', 'celebration', 'other'];
    if (!in_array((string)($d['type'] ?? ''), $types, true)) {
        $e['type'] = 'Type must be one of: ' . implode(', ', $types);
    }

    $statuses = ['upcoming', 'completed', 'cancelled'];
    if (!in_array((string)($d['status'] ?? ''), $statuses, true)) {
        $e['status'] = 'Status must be one of: ' . implode(', ', $statuses);
    }

    if (!isset($d['order']) || (!is_int($d['order']) && !ctype_digit((string)$d['order'])) || (int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    $start = (string)($d['date']['start'] ?? '');
    $end   = (string)($d['date']['end'] ?? '');
    $tsStart = _parse_iso_date($start);
    $tsEnd   = _parse_iso_date($end);
    if ($tsStart === null) $e['date.start'] = 'Start date must be a valid ISO 8601 timestamp.';
    if ($tsEnd === null)   $e['date.end']   = 'End date must be a valid ISO 8601 timestamp.';
    if ($tsStart !== null && $tsEnd !== null && $tsEnd <= $tsStart) {
        $e['date.end'] = 'End date must be after start date.';
    }

    $locTypes = ['in-person', 'online', 'hybrid'];
    if (!in_array((string)($d['location']['type'] ?? ''), $locTypes, true)) {
        $e['location.type'] = 'Location type must be one of: ' . implode(', ', $locTypes);
    }
    if (isset($d['location']['mapUrl']) && $d['location']['mapUrl'] !== '' && !_is_safe_url((string)$d['location']['mapUrl'])) {
        $e['location.mapUrl'] = 'Map URL must be a valid http/https URL.';
    }

    if (trim((string)($d['shortDescription'] ?? '')) === '') $e['shortDescription'] = 'Short description is required.';
    elseif (mb_strlen((string)$d['shortDescription']) > 500) $e['shortDescription'] = 'Short description must be ≤ 500 characters.';

    if (trim((string)($d['fullDescription'] ?? '')) === '') $e['fullDescription'] = 'Full description is required.';

    if (isset($d['agenda']) && is_array($d['agenda'])) {
        foreach ($d['agenda'] as $i => $row) {
            if (!is_array($row)) continue;
            if (trim((string)($row['time'] ?? '')) === '' && trim((string)($row['title'] ?? '')) === '') continue;
            if (trim((string)($row['title'] ?? '')) === '') $e["agenda.$i.title"] = 'Title required.';
        }
    }

    if (isset($d['speakers']) && is_array($d['speakers'])) {
        foreach ($d['speakers'] as $i => $row) {
            if (!is_array($row)) continue;
            if (trim((string)($row['name'] ?? '')) === '' && trim((string)($row['title'] ?? '')) === '' && trim((string)($row['bio'] ?? '')) === '') continue;
            if (trim((string)($row['name'] ?? '')) === '') $e["speakers.$i.name"] = 'Name required.';
        }
    }

    $orgEmail = (string)($d['organizer']['email'] ?? '');
    if ($orgEmail !== '' && filter_var($orgEmail, FILTER_VALIDATE_EMAIL) === false) {
        $e['organizer.email'] = 'Organizer email must be a valid email address.';
    }

    $feeTypes = ['free', 'paid', 'donation'];
    $ft = (string)($d['registration']['fee']['type'] ?? '');
    if ($ft !== '' && !in_array($ft, $feeTypes, true)) {
        $e['registration.fee.type'] = 'Fee type must be one of: ' . implode(', ', $feeTypes);
    }
    $amt = $d['registration']['fee']['amount'] ?? 0;
    if (!is_numeric($amt) || (int)$amt < 0) {
        $e['registration.fee.amount'] = 'Fee amount must be a non-negative integer.';
    }

    foreach (['featured', 'hero'] as $imgKey) {
        $v = (string)($d['images'][$imgKey] ?? '');
        if ($v !== '' && !_is_safe_url($v)) {
            $e["images.$imgKey"] = ucfirst($imgKey) . ' image must be a valid http/https URL.';
        }
    }

    foreach (['whatsapp', 'youtube', 'map'] as $linkKey) {
        $v = (string)($d['links'][$linkKey] ?? '');
        if ($v !== '' && !_is_safe_url($v)) {
            $e["links.$linkKey"] = ucfirst($linkKey) . ' link must be a valid http/https URL.';
        }
    }

    if (array_key_exists('isNew', $d)) {
        $err = _validate_is_new($d['isNew']);
        if ($err !== null) $e['isNew'] = $err;
    }

    return $e;
}

function validate_training(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be ≤ 200 characters.';

    if (isset($d['slug']) && $d['slug'] !== '' && !preg_match('/^[a-z0-9-]+$/', (string)$d['slug'])) {
        $e['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    $cats = ['farming', 'conservation', 'skills-development', 'livelihood', 'other'];
    if (!in_array((string)($d['category'] ?? ''), $cats, true)) {
        $e['category'] = 'Category must be one of: ' . implode(', ', $cats);
    }

    $statuses = ['open', 'full', 'upcoming', 'completed', 'cancelled'];
    if (!in_array((string)($d['status'] ?? ''), $statuses, true)) {
        $e['status'] = 'Status must be one of: ' . implode(', ', $statuses);
    }

    if (!isset($d['order']) || (!is_int($d['order']) && !ctype_digit((string)$d['order'])) || (int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    $schedTypes = ['daily-immersive', 'weekend-sessions', 'online', 'hybrid'];
    if (!in_array((string)($d['schedule']['type'] ?? ''), $schedTypes, true)) {
        $e['schedule.type'] = 'Schedule type must be one of: ' . implode(', ', $schedTypes);
    }

    $durUnits = ['days', 'weeks', 'months'];
    if (!in_array((string)($d['totalDuration']['unit'] ?? ''), $durUnits, true)) {
        $e['totalDuration.unit'] = 'Total duration unit must be one of: ' . implode(', ', $durUnits);
    }
    $dv = $d['totalDuration']['value'] ?? null;
    if (!is_numeric($dv) || (int)$dv < 0) {
        $e['totalDuration.value'] = 'Total duration value must be a non-negative integer.';
    }

    $locTypes = ['offline', 'online', 'hybrid'];
    if (!in_array((string)($d['location']['type'] ?? ''), $locTypes, true)) {
        $e['location.type'] = 'Location type must be one of: ' . implode(', ', $locTypes);
    }

    $cap = $d['capacity'] ?? null;
    if (is_array($cap)) {
        $total = $cap['total'] ?? null;
        $reg   = $cap['registered'] ?? null;
        if (!is_numeric($total) || (int)$total < 0) $e['capacity.total'] = 'Capacity total must be a non-negative integer.';
        if (!is_numeric($reg)   || (int)$reg < 0)   $e['capacity.registered'] = 'Capacity registered must be a non-negative integer.';
        if (is_numeric($total) && is_numeric($reg) && (int)$reg > (int)$total) {
            $e['capacity.registered'] = 'Capacity registered cannot exceed total.';
        }
    }

    foreach (['brief', 'full'] as $f) {
        $v = trim((string)($d['description'][$f] ?? ''));
        if ($v === '') $e["description.$f"] = ucfirst($f) . ' description is required.';
    }
    if (mb_strlen((string)($d['description']['brief'] ?? '')) > 500) {
        $e['description.brief'] = 'Brief description must be ≤ 500 characters.';
    }

    if (isset($d['description']['curriculum']) && is_array($d['description']['curriculum'])) {
        foreach ($d['description']['curriculum'] as $i => $row) {
            if (!is_array($row)) continue;
            $module = trim((string)($row['module'] ?? ''));
            $topics = $row['topics'] ?? [];
            if ($module === '' && empty($topics)) continue;
            if ($module === '') $e["description.curriculum.$i.module"] = 'Module name required.';
        }
    }

    if (isset($d['facilitators']) && is_array($d['facilitators'])) {
        foreach ($d['facilitators'] as $i => $row) {
            if (!is_array($row)) continue;
            $name = trim((string)($row['name'] ?? ''));
            $titleF = trim((string)($row['title'] ?? ''));
            $bio = trim((string)($row['bio'] ?? ''));
            if ($name === '' && $titleF === '' && $bio === '') continue;
            if ($name === '') $e["facilitators.$i.name"] = 'Name required.';
        }
    }

    $feeTypes = ['free', 'paid', 'donation'];
    $ft = (string)($d['registration']['fee']['type'] ?? '');
    if ($ft !== '' && !in_array($ft, $feeTypes, true)) {
        $e['registration.fee.type'] = 'Fee type must be one of: ' . implode(', ', $feeTypes);
    }
    $amt = $d['registration']['fee']['amount'] ?? 0;
    if (!is_numeric($amt) || (int)$amt < 0) {
        $e['registration.fee.amount'] = 'Fee amount must be a non-negative integer.';
    }

    foreach (['featuredImage', 'heroImage'] as $imgKey) {
        $v = (string)($d['media'][$imgKey] ?? '');
        if ($v !== '' && !_is_safe_url($v)) {
            $e["media.$imgKey"] = ucfirst($imgKey) . ' must be a valid http/https URL.';
        }
    }

    if (array_key_exists('isNew', $d)) {
        $err = _validate_is_new($d['isNew']);
        if ($err !== null) $e['isNew'] = $err;
    }

    return $e;
}

function validate_volunteer(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be ≤ 200 characters.';

    if (isset($d['slug']) && $d['slug'] !== '' && !preg_match('/^[a-z0-9-]+$/', (string)$d['slug'])) {
        $e['slug'] = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    if (!isset($d['order']) || (!is_int($d['order']) && !ctype_digit((string)$d['order'])) || (int)$d['order'] < 0) {
        $e['order'] = 'Order must be a non-negative integer.';
    }

    $statuses = ['open', 'full', 'closed'];
    if (!in_array((string)($d['status'] ?? ''), $statuses, true)) {
        $e['status'] = 'Status must be one of: ' . implode(', ', $statuses);
    }

    foreach (['brief', 'full'] as $f) {
        if (trim((string)($d['description'][$f] ?? '')) === '') {
            $e["description.$f"] = ucfirst($f) . ' description is required.';
        }
    }
    if (mb_strlen((string)($d['description']['brief'] ?? '')) > 500) {
        $e['description.brief'] = 'Brief description must be ≤ 500 characters.';
    }

    foreach (['start', 'end'] as $df) {
        $v = (string)($d['dates'][$df] ?? '');
        if ($v !== '' && $v !== 'TBD' && _parse_iso_date($v) === null) {
            $e["dates.$df"] = ucfirst($df) . ' date must be "TBD" or a valid ISO 8601 date.';
        }
    }

    $durUnits = ['days', 'weeks', 'months', 'years'];
    if (!in_array((string)($d['duration']['unit'] ?? ''), $durUnits, true)) {
        $e['duration.unit'] = 'Duration unit must be one of: ' . implode(', ', $durUnits);
    }
    $dv = $d['duration']['value'] ?? null;
    if (!is_numeric($dv) || (int)$dv < 0) {
        $e['duration.value'] = 'Duration value must be a non-negative integer.';
    }

    $age = $d['requirements']['age'] ?? null;
    if (is_array($age)) {
        $min = $age['min'] ?? null; $max = $age['max'] ?? null;
        if ($min !== null && (!is_numeric($min) || (int)$min < 0)) $e['requirements.age.min'] = 'Min age must be a non-negative integer or null.';
        if ($max !== null && (!is_numeric($max) || (int)$max < 0)) $e['requirements.age.max'] = 'Max age must be a non-negative integer or null.';
        if (is_numeric($min) && is_numeric($max) && (int)$min > (int)$max) {
            $e['requirements.age'] = 'Requirements: min age cannot exceed max age.';
        }
    }

    $stipend = $d['benefits']['stipend'] ?? null;
    if (is_array($stipend)) {
        $amt = $stipend['amount'] ?? 0;
        if (!is_numeric($amt) || (int)$amt < 0) {
            $e['benefits.stipend.amount'] = 'Stipend amount must be a non-negative integer.';
        }
    }

    $locTypes = ['on-site', 'remote', 'hybrid'];
    if (!in_array((string)($d['location']['type'] ?? ''), $locTypes, true)) {
        $e['location.type'] = 'Location type must be one of: ' . implode(', ', $locTypes);
    }

    $spots = $d['spots'] ?? null;
    if (is_array($spots)) {
        $total = $spots['total'] ?? null;
        $filled = $spots['filled'] ?? null;
        if (!is_numeric($total)  || (int)$total < 0)  $e['spots.total']  = 'Spots total must be a non-negative integer.';
        if (!is_numeric($filled) || (int)$filled < 0) $e['spots.filled'] = 'Spots filled must be a non-negative integer.';
        if (is_numeric($total) && is_numeric($filled) && (int)$filled > (int)$total) {
            $e['spots.filled'] = 'Spots filled cannot exceed total.';
        }
    }

    $email = (string)($d['contact']['email'] ?? '');
    if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $e['contact.email'] = 'Contact email must be a valid email address.';
    }

    $mi = (string)($d['media']['featuredImage'] ?? '');
    if ($mi !== '' && !_is_safe_url($mi) && !preg_match('#^/#', $mi)) {
        $e['media.featuredImage'] = 'Featured image must be a valid http/https URL or root-relative path.';
    }

    if (array_key_exists('isNew', $d)) {
        $err = _validate_is_new($d['isNew']);
        if ($err !== null) $e['isNew'] = $err;
    }

    return $e;
}

function validate_gallery(array $d): array {
    $e = [];

    $title = trim((string)($d['title'] ?? ''));
    if ($title === '') $e['title'] = 'Title is required.';
    elseif (mb_strlen($title) > 200) $e['title'] = 'Title must be <= 200 characters.';

    $desc = (string)($d['description'] ?? '');
    if (mb_strlen($desc) > 500) $e['description'] = 'Description must be <= 500 characters.';

    $year = $d['year'] ?? null;
    $thisYear = (int)date('Y');
    if (!is_numeric($year) || (int)$year < 2000 || (int)$year > $thisYear) {
        $e['year'] = 'Year must be an integer between 2000 and ' . $thisYear . '.';
    }

    $url = (string)($d['imageUrl'] ?? '');
    if ($url === '' || !_is_safe_url($url)) {
        $e['imageUrl'] = 'Image URL is required and must be an http/https URL.';
    }

    if (array_key_exists('isNew', $d)) {
        $err = _validate_is_new($d['isNew']);
        if ($err !== null) $e['isNew'] = $err;
    }

    return $e;
}

function _parse_iso_date(string $s): ?int {
    if ($s === '') return null;
    $ts = strtotime($s);
    return $ts === false ? null : $ts;
}

function _is_safe_url(string $url): bool {
    if (filter_var($url, FILTER_VALIDATE_URL) === false) return false;
    $scheme = strtolower((string)parse_url($url, PHP_URL_SCHEME));
    return in_array($scheme, ['http', 'https'], true);
}

/**
 * Validates the isNew flag.
 *  - Allowed: true, false, 'auto', null (treated as auto).
 * Returns an error message on invalid value, or null on valid.
 */
function _validate_is_new($v): ?string {
    if ($v === null) return null;
    if ($v === true || $v === false) return null;
    if ($v === 'auto') return null;
    return 'isNew must be true, false, or "auto".';
}
