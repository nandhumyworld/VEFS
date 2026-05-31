<?php
// Copy this file to config.php and fill in the values.
// config.php is protected by /admin/.htaccess (deny all).

// Generate a hash with:
//   php -r "echo password_hash('YOUR_PASSWORD', PASSWORD_BCRYPT, ['cost' => 12]).PHP_EOL;"
return [
    'admin_password_hash' => '$2y$12$REPLACE_WITH_REAL_HASH',
    'session_timeout_seconds' => 7200,   // 2 hours sliding
    'login_throttle_max' => 5,
    'login_throttle_window_seconds' => 900, // 15 minutes
    'cloudinary' => [
        'cloud_name' => 'REPLACE_WITH_CLOUD_NAME',
        'upload_preset' => 'vefs_unsigned',
    ],
];
