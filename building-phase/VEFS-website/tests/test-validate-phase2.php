<?php
declare(strict_types=1);
require __DIR__ . '/test-runner.php';
require __DIR__ . '/../includes/validate.php';

function assert_contains(string $needle, $haystack, string $msg = ''): void {
    $h = (string)$haystack;
    if (strpos($h, $needle) === false) {
        throw new RuntimeException("Expected '$h' to contain '$needle'" . ($msg ? " ($msg)" : ''));
    }
}

// ---------- EVENT ----------

function minValidEvent(): array {
    return [
        'title' => 'My Event',
        'slug' => 'my-event',
        'type' => 'market',
        'status' => 'upcoming',
        'featured' => false,
        'order' => 10,
        'recurring' => ['isRecurring' => false, 'frequency' => '', 'pattern' => '', 'label' => ''],
        'date' => [
            'start' => '2026-06-01T09:00:00+05:30',
            'end'   => '2026-06-01T18:00:00+05:30',
            'timezone' => 'Asia/Kolkata',
        ],
        'duration' => ['value' => 9, 'unit' => 'hours'],
        'location' => ['type' => 'in-person', 'venue' => 'Hall', 'address' => '', 'city' => 'Chennai', 'state' => 'TN', 'mapUrl' => ''],
        'shortDescription' => 'A short description.',
        'fullDescription'  => 'Full description here.',
        'agenda' => [],
        'speakers' => [],
        'organizer' => ['name' => 'VEFS', 'email' => 'a@b.com', 'phone' => '123'],
        'registration' => ['required' => false, 'fee' => ['amount' => 0, 'currency' => 'INR', 'type' => 'free']],
        'capacity' => null,
        'requirements' => ['age' => ['min' => null, 'max' => null], 'whatToBring' => []],
        'links' => [],
        'images' => ['featured' => 'https://res.cloudinary.com/x/a.jpg', 'hero' => 'https://res.cloudinary.com/x/b.jpg'],
        'tags' => [],
    ];
}

test('validate_event: minimal valid passes', function () {
    assert_eq([], validate_event(minValidEvent()));
});

test('validate_event: missing title fails', function () {
    $d = minValidEvent(); unset($d['title']);
    assert_eq('Title is required.', validate_event($d)['title'] ?? null);
});

test('validate_event: bad type enum fails', function () {
    $d = minValidEvent(); $d['type'] = 'banana';
    assert_contains('Type must be one of', validate_event($d)['type'] ?? '');
});

test('validate_event: end before start fails', function () {
    $d = minValidEvent();
    $d['date']['end'] = '2026-05-01T09:00:00+05:30';
    assert_contains('End date must be after start date', validate_event($d)['date.end'] ?? '');
});

test('validate_event: bad iso date fails', function () {
    $d = minValidEvent();
    $d['date']['start'] = 'not-a-date';
    assert_contains('valid ISO 8601', validate_event($d)['date.start'] ?? '');
});

test('validate_event: bad location type fails', function () {
    $d = minValidEvent(); $d['location']['type'] = 'mars';
    assert_contains('Location type must be one of', validate_event($d)['location.type'] ?? '');
});

test('validate_event: organizer email malformed fails', function () {
    $d = minValidEvent(); $d['organizer']['email'] = 'not-email';
    assert_contains('valid email', validate_event($d)['organizer.email'] ?? '');
});

test('validate_event: agenda row missing title fails', function () {
    $d = minValidEvent();
    $d['agenda'] = [['time' => '9 AM', 'title' => '', 'description' => 'desc']];
    assert_contains('Title required', validate_event($d)['agenda.0.title'] ?? '');
});

test('validate_event: featured image URL must be http/https', function () {
    $d = minValidEvent(); $d['images']['featured'] = 'javascript:alert(1)';
    assert_contains('http/https', validate_event($d)['images.featured'] ?? '');
});

test('validate_event: fee.amount negative fails', function () {
    $d = minValidEvent(); $d['registration']['fee']['amount'] = -10;
    assert_contains('non-negative', validate_event($d)['registration.fee.amount'] ?? '');
});

// ---------- TRAINING ----------

function minValidTraining(): array {
    return [
        'title' => 'My Training',
        'slug' => 'my-training',
        'category' => 'farming',
        'status' => 'open',
        'featured' => false,
        'order' => 10,
        'schedule' => [
            'type' => 'daily-immersive',
            'sessions' => [],
            'dailyStructure' => ['morning' => '', 'afternoon' => '', 'evening' => '', 'night' => ''],
            'timezone' => 'Asia/Kolkata',
        ],
        'totalDuration' => ['value' => 1, 'unit' => 'months'],
        'location' => ['type' => 'offline', 'venue' => 'Farm', 'city' => 'Nilakottai', 'state' => 'TN', 'country' => 'India'],
        'audience' => ['students'],
        'targetAudience' => 'Anyone',
        'capacity' => ['total' => 10, 'registered' => 0, 'available' => 10],
        'description' => [
            'brief' => 'Brief',
            'full' => 'Full',
            'objectives' => [],
            'curriculum' => [],
            'outcomes' => [],
            'requirements' => [],
        ],
        'facilitators' => [],
        'registration' => ['required' => true, 'fee' => ['amount' => 0, 'currency' => 'INR', 'type' => 'free'], 'notes' => ''],
        'media' => ['featuredImage' => 'https://res.cloudinary.com/x/a.jpg', 'heroImage' => 'https://res.cloudinary.com/x/b.jpg'],
    ];
}

test('validate_training: minimal valid passes', function () {
    assert_eq([], validate_training(minValidTraining()));
});

test('validate_training: missing title fails', function () {
    $d = minValidTraining(); unset($d['title']);
    assert_contains('Title is required', validate_training($d)['title'] ?? '');
});

test('validate_training: bad category fails', function () {
    $d = minValidTraining(); $d['category'] = 'rocket-science';
    assert_contains('Category must be one of', validate_training($d)['category'] ?? '');
});

test('validate_training: bad totalDuration unit fails', function () {
    $d = minValidTraining(); $d['totalDuration']['unit'] = 'fortnights';
    assert_contains('unit must be one of', validate_training($d)['totalDuration.unit'] ?? '');
});

test('validate_training: capacity.total < registered fails', function () {
    $d = minValidTraining();
    $d['capacity'] = ['total' => 5, 'registered' => 6, 'available' => -1];
    assert_contains('registered cannot exceed', validate_training($d)['capacity.registered'] ?? '');
});

test('validate_training: curriculum module missing fails', function () {
    $d = minValidTraining();
    $d['description']['curriculum'] = [['module' => '', 'topics' => ['t1']]];
    assert_contains('Module name required', validate_training($d)['description.curriculum.0.module'] ?? '');
});

test('validate_training: facilitator missing name fails', function () {
    $d = minValidTraining();
    $d['facilitators'] = [['name' => '', 'title' => 'Trainer', 'bio' => 'Bio']];
    assert_contains('Name required', validate_training($d)['facilitators.0.name'] ?? '');
});

test('validate_training: brief > 500 chars fails', function () {
    $d = minValidTraining(); $d['description']['brief'] = str_repeat('x', 501);
    assert_contains('≤ 500', validate_training($d)['description.brief'] ?? '');
});

// ---------- VOLUNTEER ----------

function minValidVolunteer(): array {
    return [
        'title' => 'Farm Helper',
        'slug' => 'farm-helper',
        'order' => 10,
        'status' => 'open',
        'description' => ['brief' => 'Brief', 'full' => 'Full'],
        'dates' => ['start' => 'TBD', 'end' => 'TBD'],
        'duration' => ['value' => 3, 'unit' => 'months'],
        'commitment' => 'Full-time',
        'requirements' => [
            'age' => ['min' => 18, 'max' => 60],
            'skills' => [],
            'physical' => '',
            'education' => '',
        ],
        'benefits' => [
            'learning' => [],
            'certificate' => true,
            'meals' => true,
            'accommodation' => true,
            'stipend' => ['provided' => false, 'amount' => 0],
        ],
        'relatedEvents' => [],
        'location' => ['type' => 'on-site', 'city' => 'Nilakottai', 'state' => 'TN'],
        'spots' => ['total' => 4, 'filled' => 1, 'available' => 3],
        'contact' => ['name' => 'A', 'email' => 'a@b.com', 'phone' => '+91 1234567890'],
        'media' => ['featuredImage' => 'https://res.cloudinary.com/x/a.jpg'],
    ];
}

test('validate_volunteer: minimal valid passes', function () {
    assert_eq([], validate_volunteer(minValidVolunteer()));
});

test('validate_volunteer: missing title fails', function () {
    $d = minValidVolunteer(); unset($d['title']);
    assert_contains('Title is required', validate_volunteer($d)['title'] ?? '');
});

test('validate_volunteer: bad duration unit fails', function () {
    $d = minValidVolunteer(); $d['duration']['unit'] = 'centuries';
    assert_contains('unit must be one of', validate_volunteer($d)['duration.unit'] ?? '');
});

test('validate_volunteer: age min > max fails', function () {
    $d = minValidVolunteer();
    $d['requirements']['age'] = ['min' => 50, 'max' => 30];
    assert_contains('min age cannot exceed', validate_volunteer($d)['requirements.age'] ?? '');
});

test('validate_volunteer: stipend.amount negative fails', function () {
    $d = minValidVolunteer();
    $d['benefits']['stipend'] = ['provided' => true, 'amount' => -100];
    assert_contains('non-negative', validate_volunteer($d)['benefits.stipend.amount'] ?? '');
});

test('validate_volunteer: spots.filled > total fails', function () {
    $d = minValidVolunteer();
    $d['spots'] = ['total' => 3, 'filled' => 5, 'available' => 0];
    assert_contains('filled cannot exceed', validate_volunteer($d)['spots.filled'] ?? '');
});

test('validate_volunteer: contact email bad fails', function () {
    $d = minValidVolunteer(); $d['contact']['email'] = 'not-an-email';
    assert_contains('valid email', validate_volunteer($d)['contact.email'] ?? '');
});

test('validate_volunteer: bad location.type fails', function () {
    $d = minValidVolunteer(); $d['location']['type'] = 'mars';
    assert_contains('Location type must be one of', validate_volunteer($d)['location.type'] ?? '');
});

summary();
