<?php
// Local-dev router for `php -S` (NOT used in production — Hostinger uses Apache + .htaccess).
// Mimics the parts of .htaccess we care about so URLs work the same as on prod.

$uri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$root = __DIR__;
$path = $root . str_replace('/', DIRECTORY_SEPARATOR, $uri);

// 1) /blog/<slug>  ->  blog-post.php?id=<slug>
if (preg_match('#^/blog/([a-z0-9-]+)/?$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    $_SERVER['SCRIPT_NAME'] = '/blog-post.php';
    require $root . '/blog-post.php';
    return true;
}

// 1b) /projects/<slug>  ->  project-detail.php?slug=<slug>
if (preg_match('#^/projects/([a-z0-9-]+)/?$#', $uri, $m)) {
    $_GET['slug'] = $m[1];
    $_SERVER['SCRIPT_NAME'] = '/project-detail.php';
    require $root . '/project-detail.php';
    return true;
}

// 2) Existing static file?  Let the built-in server serve it as-is.
if ($uri !== '/' && is_file($path)) {
    return false;
}

// 3) Directory ->  try index.php, then index.html
if (is_dir($path)) {
    foreach (['index.php', 'index.html'] as $idx) {
        $candidate = rtrim($path, '/\\') . DIRECTORY_SEPARATOR . $idx;
        if (is_file($candidate)) {
            if (str_ends_with($idx, '.php')) { require $candidate; return true; }
            return false; // let server stream the html
        }
    }
}

// 4) Extension-less URL  ->  try .html / .php fallback (e.g. /about -> /about.html)
if ($uri !== '/' && !pathinfo($path, PATHINFO_EXTENSION)) {
    foreach (['.html', '.php'] as $ext) {
        if (is_file($path . $ext)) {
            if ($ext === '.php') { require $path . $ext; return true; }
            return false;
        }
    }
}

// 5) Default landing
if ($uri === '/' && is_file($root . '/index.html')) {
    return false;
}

http_response_code(404);
echo "404 Not Found: $uri";
return true;
