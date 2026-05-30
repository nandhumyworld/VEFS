<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';
require __DIR__ . '/../includes/json-store.php';

$tmpDir = sys_get_temp_dir() . '/vefs-jsonstore-test-' . uniqid();
mkdir($tmpDir);
mkdir($tmpDir . '/backups');
$file = $tmpDir . '/data.json';
file_put_contents($file, json_encode(['posts' => []]));

test('read returns decoded array', function() use ($file) {
    $data = json_store_read($file);
    assert_eq(['posts' => []], $data);
});

test('write persists data', function() use ($file, $tmpDir) {
    json_store_write($file, ['posts' => [['id' => 'a']]], $tmpDir . '/backups');
    $data = json_store_read($file);
    assert_eq([['id' => 'a']], $data['posts']);
});

test('write creates backup of previous content', function() use ($file, $tmpDir) {
    json_store_write($file, ['posts' => [['id' => 'b']]], $tmpDir . '/backups');
    $backups = glob($tmpDir . '/backups/*.json');
    assert_true(count($backups) >= 1, 'expected at least one backup');
    $backupData = json_decode(file_get_contents($backups[0]), true);
    assert_eq([['id' => 'a']], $backupData['posts'], 'backup should hold the pre-write content');
});

test('write rejects invalid current JSON without overwriting', function() use ($tmpDir) {
    $bad = $tmpDir . '/bad.json';
    file_put_contents($bad, '{not valid json');
    assert_throws(function() use ($bad, $tmpDir) {
        json_store_write($bad, ['posts' => []], $tmpDir . '/backups');
    }, 'current file is not valid JSON');
    assert_eq('{not valid json', file_get_contents($bad), 'bad file untouched');
});

test('backups are pruned to 20', function() use ($tmpDir) {
    $f = $tmpDir . '/prune.json';
    $b = $tmpDir . '/prune-backups';
    mkdir($b);
    file_put_contents($f, json_encode(['n' => 0]));
    for ($i = 1; $i <= 25; $i++) {
        usleep(1100); // ensure unique timestamps
        json_store_write($f, ['n' => $i], $b);
    }
    $backups = glob($b . '/*.json');
    assert_eq(20, count($backups), 'should keep newest 20 backups');
});

summary();
