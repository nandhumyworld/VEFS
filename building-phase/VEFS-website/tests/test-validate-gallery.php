<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/validate.php';

$pass = 0; $fail = 0;
function _assert(bool $cond, string $msg): void {
    global $pass, $fail;
    if ($cond) { $pass++; echo "  ok  $msg\n"; }
    else       { $fail++; echo "  FAIL $msg\n"; }
}

$validBase = [
    'title'       => 'Tree planting drive',
    'description' => 'Volunteers at Erode.',
    'year'        => 2024,
    'imageUrl'    => 'https://res.cloudinary.com/vefs/image/upload/x.jpg',
    'isNew'       => 'auto',
];

echo "test: validate_gallery happy path\n";
_assert(validate_gallery($validBase) === [], "valid item produces no errors");

echo "\ntest: validate_gallery requires title\n";
_assert(isset(validate_gallery(['title' => '']     + $validBase)['title']), "empty title rejected");
_assert(isset(validate_gallery(['title' => str_repeat('a', 201)] + $validBase)['title']), "title >200 chars rejected");

echo "\ntest: validate_gallery description optional but <=500 chars\n";
_assert(validate_gallery(['description' => ''] + $validBase) === [], "empty description allowed");
_assert(isset(validate_gallery(['description' => str_repeat('a', 501)] + $validBase)['description']),
        "description >500 chars rejected");

echo "\ntest: validate_gallery year required, 2000..currentYear\n";
$thisYear = (int)date('Y');
_assert(isset(validate_gallery(['year' => 1999] + $validBase)['year']), "year 1999 rejected");
_assert(isset(validate_gallery(['year' => $thisYear + 1] + $validBase)['year']), "future year rejected");
_assert(validate_gallery(['year' => 2024]  + $validBase) === [], "year 2024 accepted");
_assert(isset(validate_gallery(['year' => 'lol'] + $validBase)['year']), "non-numeric year rejected");

echo "\ntest: validate_gallery imageUrl required https\n";
_assert(isset(validate_gallery(['imageUrl' => ''] + $validBase)['imageUrl']), "empty url rejected");
_assert(isset(validate_gallery(['imageUrl' => 'ftp://x'] + $validBase)['imageUrl']), "ftp url rejected");

echo "\ntest: validate_gallery isNew enum\n";
_assert(isset(validate_gallery(['isNew' => 'maybe'] + $validBase)['isNew']), "invalid isNew rejected");
_assert(validate_gallery(['isNew' => true]  + $validBase) === [], "true accepted");
_assert(validate_gallery(['isNew' => false] + $validBase) === [], "false accepted");

echo "\n$pass passed, $fail failed\n";
exit($fail === 0 ? 0 : 1);
