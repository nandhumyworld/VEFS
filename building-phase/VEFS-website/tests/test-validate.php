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
