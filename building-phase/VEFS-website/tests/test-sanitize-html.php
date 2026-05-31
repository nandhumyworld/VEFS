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
