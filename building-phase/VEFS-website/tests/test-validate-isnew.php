<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/validate.php';

$pass = 0; $fail = 0;
function _assert(bool $cond, string $msg): void {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok  $msg\n"; }
    else       { $fail++; echo "  FAIL $msg\n"; }
}

echo "test: _validate_is_new accepts 'auto', true, false; rejects anything else\n";

_assert(_validate_is_new('auto')  === null, "'auto' is valid");
_assert(_validate_is_new(true)    === null, "true is valid");
_assert(_validate_is_new(false)   === null, "false is valid");
_assert(_validate_is_new(null)    === null, "null defaults to valid (treated as auto)");

_assert(_validate_is_new('yes')   !== null, "'yes' is rejected");
_assert(_validate_is_new(1)       !== null, "integer 1 is rejected");
_assert(_validate_is_new(0)       !== null, "integer 0 is rejected");
_assert(_validate_is_new([])      !== null, "array is rejected");

echo "\n$pass passed, $fail failed\n";
exit($fail === 0 ? 0 : 1);
