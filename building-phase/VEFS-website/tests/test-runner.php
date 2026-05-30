<?php
declare(strict_types=1);

/**
 * Tiny assertion helper. Each test file does:
 *   require __DIR__ . '/test-runner.php';
 *   test('description', function() { assert_eq(1+1, 2); });
 *   summary();
 */

$GLOBALS['tests_passed'] = 0;
$GLOBALS['tests_failed'] = 0;
$GLOBALS['tests_failures'] = [];

function test(string $name, callable $fn): void {
    try {
        $fn();
        $GLOBALS['tests_passed']++;
        echo "  PASS  $name\n";
    } catch (Throwable $e) {
        $GLOBALS['tests_failed']++;
        $GLOBALS['tests_failures'][] = "$name: " . $e->getMessage();
        echo "  FAIL  $name\n        " . $e->getMessage() . "\n";
    }
}

function assert_eq($expected, $actual, string $msg = ''): void {
    if ($expected !== $actual) {
        $e = var_export($expected, true);
        $a = var_export($actual, true);
        throw new RuntimeException("Expected $e, got $a" . ($msg ? " ($msg)" : ''));
    }
}

function assert_true(bool $cond, string $msg = ''): void {
    if (!$cond) throw new RuntimeException("Expected true" . ($msg ? ": $msg" : ''));
}

function assert_throws(callable $fn, string $expectedMsgFragment = ''): void {
    try {
        $fn();
    } catch (Throwable $e) {
        if ($expectedMsgFragment !== '' && strpos($e->getMessage(), $expectedMsgFragment) === false) {
            throw new RuntimeException("Wrong exception: expected fragment '$expectedMsgFragment', got '" . $e->getMessage() . "'");
        }
        return;
    }
    throw new RuntimeException('Expected an exception, none thrown');
}

function summary(): void {
    $p = $GLOBALS['tests_passed'];
    $f = $GLOBALS['tests_failed'];
    echo "\n$p passed, $f failed\n";
    exit($f > 0 ? 1 : 0);
}
