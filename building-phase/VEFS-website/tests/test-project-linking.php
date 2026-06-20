<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';
require __DIR__ . '/../includes/validate.php';

$validEvent = [
    'title' => 'Tree drive',
    'type' => 'meetup',
    'shortDescription' => 'x',
    'fullDescription' => 'x',
    'date' => '2026-07-01',
    'time' => '10:00',
    'location' => 'Salem',
    'order' => 0,
];

test('event: accepts valid project_id', function() use ($validEvent) {
    $errs = validate_event($validEvent + ['project_id' => 'prj-001']);
    assert_true(!isset($errs['project_id']));
});

test('event: rejects bogus project_id', function() use ($validEvent) {
    $errs = validate_event($validEvent + ['project_id' => 'bogus']);
    assert_true(isset($errs['project_id']));
});

test('event: allows null project_id', function() use ($validEvent) {
    $errs = validate_event($validEvent + ['project_id' => null]);
    assert_true(!isset($errs['project_id']));
});

test('event: allows missing project_id', function() use ($validEvent) {
    $errs = validate_event($validEvent);
    assert_true(!isset($errs['project_id']));
});

test('gallery: accepts valid project_id', function() {
    $errs = validate_gallery([
        'title' => 'Photo', 'description' => '', 'year' => (int)date('Y'),
        'imageUrl' => 'https://example.com/x.jpg',
        'project_id' => 'prj-042',
    ]);
    assert_true(!isset($errs['project_id']));
});

test('gallery: rejects malformed project_id', function() {
    $errs = validate_gallery([
        'title' => 'Photo', 'description' => '', 'year' => (int)date('Y'),
        'imageUrl' => 'https://example.com/x.jpg',
        'project_id' => 'prj_abc',
    ]);
    assert_true(isset($errs['project_id']));
});

summary();
