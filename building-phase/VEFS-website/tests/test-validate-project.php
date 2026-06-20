<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';
require __DIR__ . '/../includes/validate.php';

$base = [
    'name' => 'Tree Plantation',
    'objective' => 'Plant native species',
    'theme' => 'ecology',
    'status' => 'active',
    'location' => 'Salem',
    'start_date' => '2024-06-15',
    'order' => 0,
];

test('project: requires name', function() {
    $errs = validate_project([]);
    assert_true(isset($errs['name']));
});

test('project: requires objective', function() {
    $errs = validate_project(['name' => 'X']);
    assert_true(isset($errs['objective']));
});

test('project: minimal valid project passes', function() use ($base) {
    assert_eq([], validate_project($base));
});

test('project: rejects bogus theme', function() use ($base) {
    $bad = $base; $bad['theme'] = 'bogus';
    $errs = validate_project($bad);
    assert_true(isset($errs['theme']));
});

test('project: rejects invalid status', function() use ($base) {
    $bad = $base; $bad['status'] = 'wip';
    $errs = validate_project($bad);
    assert_true(isset($errs['status']));
});

test('project: rejects bad slug', function() use ($base) {
    $bad = $base; $bad['slug'] = 'Bad Slug!';
    $errs = validate_project($bad);
    assert_true(isset($errs['slug']));
});

test('project: accepts valid slug', function() use ($base) {
    $ok = $base; $ok['slug'] = 'tree-plantation-2024';
    $errs = validate_project($ok);
    assert_true(!isset($errs['slug']));
});

test('project: rejects raised > target', function() use ($base) {
    $bad = $base; $bad['fundraising'] = ['target_amount' => 100, 'raised_amount' => 200];
    $errs = validate_project($bad);
    assert_true(isset($errs['fundraising.raised_amount']));
});

test('project: rejects end_date before start_date', function() use ($base) {
    $bad = $base; $bad['end_date'] = '2024-01-01';
    $errs = validate_project($bad);
    assert_true(isset($errs['end_date']));
});

test('project: rejects proposed_budget when not planning', function() use ($base) {
    $bad = $base; $bad['proposed_budget'] = 100000;
    $errs = validate_project($bad);
    assert_true(isset($errs['proposed_budget']));
});

test('project: accepts proposed_budget when planning', function() use ($base) {
    $ok = $base; $ok['status'] = 'planning'; $ok['proposed_budget'] = 100000;
    $errs = validate_project($ok);
    assert_true(!isset($errs['proposed_budget']));
});

test('project: rejects non-numeric metric value', function() use ($base) {
    $bad = $base; $bad['impact_metrics'] = [['label' => 'Trees', 'value' => 'NaN']];
    $errs = validate_project($bad);
    assert_true(isset($errs['impact_metrics.0.value']));
});

test('project: rejects empty metric label when value present', function() use ($base) {
    $bad = $base; $bad['impact_metrics'] = [['label' => '', 'value' => 100]];
    $errs = validate_project($bad);
    assert_true(isset($errs['impact_metrics.0.label']));
});

test('project: skips fully-empty metric rows', function() use ($base) {
    $ok = $base; $ok['impact_metrics'] = [['label' => '', 'value' => '']];
    $errs = validate_project($ok);
    assert_eq([], $errs);
});

test('project: rejects photo without url', function() use ($base) {
    $bad = $base; $bad['photos'] = [['caption' => 'oops']];
    $errs = validate_project($bad);
    assert_true(isset($errs['photos.0.url']));
});

test('project: rejects bad hero_image_url', function() use ($base) {
    $bad = $base; $bad['hero_image_url'] = 'not-a-url';
    $errs = validate_project($bad);
    assert_true(isset($errs['hero_image_url']));
});

test('project: accepts valid hero_image_url', function() use ($base) {
    $ok = $base; $ok['hero_image_url'] = 'https://res.cloudinary.com/vefs/image/upload/sample.jpg';
    $errs = validate_project($ok);
    assert_true(!isset($errs['hero_image_url']));
});

summary();
