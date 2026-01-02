# JSON API & Gmail Integration

**Project:** VEFS (Valluvam Ecological Farming and Social Welfare Foundation)
**Document Version:** 1.0
**Last Updated:** 2025-12-24
**Status:** Complete

---

## Overview

This document defines:

1. **JSON as API** - How JSON files serve as data endpoints for the website
2. **Gmail API Integration** - Setup and configuration for sending emails via Gmail API
3. **Email Workflows** - Registration confirmations, contact form submissions, donation receipts

### Why Gmail API?

**Advantages over PHP mail():**
- More reliable delivery (fewer emails marked as spam)
- Better authentication (OAuth 2.0)
- Delivery tracking and status
- No SMTP configuration needed
- Free tier (2,000 emails/day limit)

---

## Part 1: JSON as API

### 1.1 JSON Endpoints

The VEFS website uses JSON files as lightweight API endpoints:

| Endpoint | Purpose | Access Method |
|----------|---------|---------------|
| `/data/events.json` | Events data | HTTP GET (fetch) |
| `/data/trainings.json` | Trainings data | HTTP GET (fetch) |
| `/data/programs.json` | Programs data | HTTP GET (fetch) |
| `/data/recent-registrations.json` | Recent registrations (for duplicate check) | HTTP GET (fetch) |

**Characteristics:**
- Static JSON files (no server-side processing)
- Read-only (no POST/PUT/DELETE)
- Client-side JavaScript consumption
- No authentication required
- CORS-friendly (same-origin)

---

### 1.2 Consuming JSON Data

**Example: Loading Events**

**JavaScript (Fetch API):**
```javascript
async function loadEvents() {
  try {
    const response = await fetch('/data/events.json');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.events;
  } catch (error) {
    console.error('Failed to load events:', error);
    return [];
  }
}

// Usage
loadEvents().then(events => {
  console.log('Loaded events:', events);
  // Render events to page
});
```

**With Caching and Error Handling:**
```javascript
class DataAPI {
  constructor() {
    this.cache = {};
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async fetch(endpoint) {
    // Check cache
    if (this.cache[endpoint] && Date.now() - this.cache[endpoint].timestamp < this.cacheTimeout) {
      return this.cache[endpoint].data;
    }

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Update cache
      this.cache[endpoint] = {
        data: data,
        timestamp: Date.now()
      };

      return data;
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);

      // Return cached data if available (stale is better than nothing)
      if (this.cache[endpoint]) {
        console.warn('Using stale cached data');
        return this.cache[endpoint].data;
      }

      throw error;
    }
  }

  async getEvents() {
    const data = await this.fetch('/data/events.json');
    return data.events || [];
  }

  async getTrainings() {
    const data = await this.fetch('/data/trainings.json');
    return data.trainings || [];
  }

  async getPrograms() {
    const data = await this.fetch('/data/programs.json');
    return data.programs || [];
  }
}

// Initialize
const api = new DataAPI();

// Usage
api.getEvents().then(events => {
  console.log('Events:', events);
});
```

---

### 1.3 JSON Response Structure

**Standard Format:**

All JSON files follow this structure:

```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2025-12-24T10:30:00Z",
    "total": 25
  },
  "events": [
    { /* event object */ }
  ]
}
```

**Error Handling:**

If JSON file doesn't exist or is malformed:
- Server returns 404 error
- JavaScript catch block handles error
- Display user-friendly error message
- Optionally fall back to cached data

---

### 1.4 JSON Security Considerations

**Read-Only Access:**
- JSON files are publicly readable (no authentication)
- Do NOT store sensitive data in JSON (passwords, PAN numbers, etc.)
- Use for public information only

**CORS:**
- Same-origin by default (no CORS issues)
- If accessing from different domain, configure CORS in .htaccess

**.htaccess CORS (if needed):**
```apache
<IfModule mod_headers.c>
  <FilesMatch "\.(json)$">
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, OPTIONS"
  </FilesMatch>
</IfModule>
```

**Rate Limiting:**
- Not applicable for static JSON files
- Hostinger may have bandwidth limits

---

## Part 2: Gmail API Integration

### 2.1 Gmail API Overview

**Use Cases:**
- Send registration confirmation emails
- Send contact form submissions to admin
- Send donation receipts
- Send admin notifications

**Gmail API Quotas:**
- **Free tier:** 2,000 emails/day
- **Workspace accounts:** Higher limits (check quota)
- **Rate limit:** 1 request/second

---

### 2.2 Setup Gmail API

#### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Create new project: "VEFS Website"
3. Enable Gmail API:
   - Navigate to "APIs & Services" → "Library"
   - Search "Gmail API"
   - Click "Enable"

#### Step 2: Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "VEFS Website Gmail"
5. Authorized redirect URIs:
   - `https://yoursite.com/forms/gmail-callback.php`
6. Click "Create"
7. Download JSON credentials file (save as `credentials.json`)

#### Step 3: Configure OAuth Consent Screen

1. "APIs & Services" → "OAuth consent screen"
2. User Type: "External" (if not using Google Workspace)
3. App name: "VEFS Website"
4. User support email: Your email
5. Developer contact: Your email
6. Scopes: Add `https://www.googleapis.com/auth/gmail.send`
7. Save and continue

#### Step 4: Get Authorization

Run one-time authorization to get refresh token:

**File:** `/forms/gmail-auth.php`
```php
<?php
require_once 'vendor/autoload.php';

use Google\Client;
use Google\Service\Gmail;

session_start();

// Load credentials
$client = new Client();
$client->setAuthConfig('credentials.json');
$client->addScope(Gmail::GMAIL_SEND);
$client->setAccessType('offline');
$client->setPrompt('consent');

// Redirect to Google OAuth
if (!isset($_GET['code'])) {
  $authUrl = $client->createAuthUrl();
  header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
  exit;
} else {
  // Exchange authorization code for access token
  $accessToken = $client->fetchAccessTokenWithAuthCode($_GET['code']);
  $client->setAccessToken($accessToken);

  // Save refresh token
  if (array_key_exists('refresh_token', $accessToken)) {
    file_put_contents('gmail-token.json', json_encode($accessToken));
    echo "Authorization successful! Refresh token saved.";
  } else {
    echo "Error: No refresh token received.";
  }
}
?>
```

**Run this script once:**
1. Upload `credentials.json` and `gmail-auth.php` to `/forms/`
2. Visit `https://yoursite.com/forms/gmail-auth.php` in browser
3. Sign in with Gmail account
4. Grant permissions
5. `gmail-token.json` will be created
6. **Delete `gmail-auth.php`** after setup (security)
7. **Protect `gmail-token.json`** with .htaccess

---

### 2.3 Install Google API PHP Client

#### Option 1: Using Composer (Recommended)

**On your local machine:**
```bash
composer require google/apiclient:"^2.0"
```

**Upload `vendor/` folder** to server via FTP.

#### Option 2: Manual Download

1. Download from https://github.com/googleapis/google-api-php-client/releases
2. Extract to `/forms/vendor/`
3. Include autoloader in PHP files

---

### 2.4 Send Email via Gmail API

**File:** `/forms/send-gmail.php`

```php
<?php
require_once 'vendor/autoload.php';

use Google\Client;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;

class GmailSender {
  private $client;
  private $service;

  public function __construct() {
    $this->client = new Client();
    $this->client->setAuthConfig('credentials.json');
    $this->client->addScope(Gmail::GMAIL_SEND);

    // Load saved token
    $tokenPath = 'gmail-token.json';
    if (file_exists($tokenPath)) {
      $accessToken = json_decode(file_get_contents($tokenPath), true);
      $this->client->setAccessToken($accessToken);

      // Refresh token if expired
      if ($this->client->isAccessTokenExpired()) {
        if ($this->client->getRefreshToken()) {
          $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
          file_put_contents($tokenPath, json_encode($this->client->getAccessToken()));
        }
      }
    }

    $this->service = new Gmail($this->client);
  }

  public function sendEmail($to, $subject, $body, $ccEmail = null) {
    try {
      // Create message
      $message = $this->createMessage($to, $subject, $body, $ccEmail);

      // Send message
      $result = $this->service->users_messages->send('me', $message);

      return [
        'success' => true,
        'messageId' => $result->getId()
      ];
    } catch (Exception $e) {
      error_log('Gmail send error: ' . $e->getMessage());
      return [
        'success' => false,
        'error' => $e->getMessage()
      ];
    }
  }

  private function createMessage($to, $subject, $body, $ccEmail = null) {
    $from = 'noreply@vefs.org'; // Your sender email

    $emailContent = "From: VEFS Foundation <{$from}>\r\n";
    $emailContent .= "To: {$to}\r\n";

    if ($ccEmail) {
      $emailContent .= "Cc: {$ccEmail}\r\n";
    }

    $emailContent .= "Subject: =?utf-8?B?" . base64_encode($subject) . "?=\r\n";
    $emailContent .= "MIME-Version: 1.0\r\n";
    $emailContent .= "Content-Type: text/html; charset=utf-8\r\n";
    $emailContent .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $emailContent .= base64_encode($body);

    $message = new Message();
    $message->setRaw(base64_encode($emailContent));

    return $message;
  }
}

// Example usage:
// $gmail = new GmailSender();
// $result = $gmail->sendEmail(
//   'user@email.com',
//   'Registration Confirmed',
//   '<html><body><h1>Thank you for registering!</h1></body></html>',
//   'admin@vefs.org' // CC to admin
// );
?>
```

---

### 2.5 Integration with Registration Forms

**Update Form Handler to Use Gmail API:**

**File:** `/forms/process-event-registration.php`

```php
<?php
require_once 'send-gmail.php';
require_once 'config.php';

// ... [Previous validation code] ...

// After successful validation:

// Prepare email content
$userEmailBody = file_get_contents('../email-templates/event-confirmation.html');

// Replace placeholders
$userEmailBody = str_replace('[Name]', $name, $userEmailBody);
$userEmailBody = str_replace('[Event Title]', $event['title'], $userEmailBody);
$userEmailBody = str_replace('[Event Date]', $event['date'], $userEmailBody);
// ... more replacements ...

// Send email via Gmail API
$gmail = new GmailSender();

// Send to user (with admin CC'd)
$result = $gmail->sendEmail(
  $email, // To: user
  "Registration Confirmed - {$event['title']}", // Subject
  $userEmailBody, // Body
  ADMIN_EMAIL // CC: admin
);

if ($result['success']) {
  // Email sent successfully
  echo json_encode([
    'success' => true,
    'message' => 'Registration successful! Confirmation email sent.',
    'messageId' => $result['messageId']
  ]);
} else {
  // Email failed, but registration was successful
  error_log('Gmail API error: ' . $result['error']);
  echo json_encode([
    'success' => true,
    'message' => 'Registration successful! (Email delivery pending)',
    'emailError' => true
  ]);
}
?>
```

---

### 2.6 Email Templates

**Load HTML Email Templates:**

**File:** `/email-templates/event-confirmation.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #6B8E23; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .event-details { background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #6B8E23; }
    .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background: #6B8E23; color: white; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Confirmed</h1>
    </div>

    <div class="content">
      <p>Dear [Name],</p>

      <p>Thank you for registering for <strong>[Event Title]</strong>!</p>

      <div class="event-details">
        <h3>Event Details:</h3>
        <p><strong>Date:</strong> [Event Date]<br>
        <strong>Time:</strong> [Event Time]<br>
        <strong>Location:</strong> [Event Location]</p>
      </div>

      <!-- Payment info if paid event -->
      [PAYMENT_INFO]

      <p>We look forward to seeing you!</p>

      <p>Best regards,<br>
      <strong>VEFS Team</strong></p>
    </div>

    <div class="footer">
      <p>&copy; 2025 VEFS Foundation | <a href="https://vefs.org" style="color: white;">vefs.org</a></p>
    </div>
  </div>
</body>
</html>
```

---

### 2.7 Error Handling & Fallback

**Graceful Degradation:**

If Gmail API fails, fall back to PHP `mail()`:

```php
<?php
// Try Gmail API first
$gmail = new GmailSender();
$result = $gmail->sendEmail($to, $subject, $body, $cc);

if (!$result['success']) {
  // Fallback to PHP mail()
  error_log('Gmail API failed, falling back to PHP mail()');

  $headers = "From: VEFS Foundation <noreply@vefs.org>\r\n";
  $headers .= "Reply-To: info@vefs.org\r\n";
  $headers .= "Cc: {$cc}\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

  $success = mail($to, $subject, $body, $headers);

  if ($success) {
    error_log('Email sent via PHP mail() fallback');
  } else {
    error_log('Both Gmail API and PHP mail() failed');
  }
}
?>
```

---

### 2.8 Security Best Practices

**Protect Sensitive Files:**

**File:** `/forms/.htaccess`

```apache
# Deny access to credentials and tokens
<FilesMatch "^(credentials\.json|gmail-token\.json|config\.php)$">
  Order Deny,Allow
  Deny from all
</FilesMatch>
```

**File Permissions:**
- `credentials.json`: 600 (read/write owner only)
- `gmail-token.json`: 600
- `config.php`: 644

**Never commit to Git:**

If using Git, add to `.gitignore`:
```
credentials.json
gmail-token.json
config.php
```

---

### 2.9 Monitoring & Logging

**Email Send Logging:**

**File:** `/forms/email-log.php`

```php
<?php
function logEmail($to, $subject, $status, $error = null) {
  $logEntry = date('Y-m-d H:i:s') . " | To: {$to} | Subject: {$subject} | Status: {$status}";

  if ($error) {
    $logEntry .= " | Error: {$error}";
  }

  $logEntry .= "\n";

  file_put_contents('../logs/email-log.txt', $logEntry, FILE_APPEND);
}

// Usage:
// logEmail('user@email.com', 'Registration Confirmed', 'Success');
// logEmail('user@email.com', 'Registration Confirmed', 'Failed', 'Gmail API timeout');
?>
```

**Monitor Gmail API Quota:**

Check quota usage at:
https://console.cloud.google.com/apis/api/gmail.googleapis.com/quotas

---

### 2.10 Testing Gmail Integration

**Test Script:**

**File:** `/forms/test-gmail.php`

```php
<?php
require_once 'send-gmail.php';

$gmail = new GmailSender();

// Test email
$result = $gmail->sendEmail(
  'your-email@gmail.com', // Your test email
  'Test Email from VEFS Website',
  '<html><body><h1>This is a test email</h1><p>If you receive this, Gmail API is working!</p></body></html>'
);

if ($result['success']) {
  echo "✅ Email sent successfully!<br>";
  echo "Message ID: " . $result['messageId'];
} else {
  echo "❌ Email failed!<br>";
  echo "Error: " . $result['error'];
}
?>
```

**Testing Checklist:**
- [ ] Test email received
- [ ] Subject line correct
- [ ] HTML formatting displays
- [ ] Links work
- [ ] Images load (if any)
- [ ] CC works (admin receives copy)
- [ ] Token refreshes automatically

---

## 3. Email Workflows

### 3.1 Event Registration Email

**Trigger:** User successfully registers for event

**Recipients:**
- **To:** User's email
- **CC:** Admin email

**Template:** `/email-templates/event-confirmation.html`

**Placeholders:**
- `[Name]` - User's name
- `[Event Title]` - Event name
- `[Event Date]` - Event date
- `[Event Time]` - Event time
- `[Event Location]` - Venue
- `[PAYMENT_INFO]` - Payment details (if paid event)

---

### 3.2 Training Registration Email

**Trigger:** User registers for training

**Recipients:**
- **To:** User's email
- **CC:** Training coordinator email

**Template:** `/email-templates/training-confirmation.html`

**Additional Info:**
- Training schedule (multi-day)
- Prerequisites
- Materials to bring
- Certificate information

---

### 3.3 Donation Receipt Email

**Trigger:** Donation form submitted

**Recipients:**
- **To:** Donor's email
- **CC:** Donations team email

**Template:** `/email-templates/donation-receipt.html`

**Includes:**
- Donation amount
- Reference number
- Payment instructions
- Tax benefit info (80G certificate for donations > ₹2000)
- Thank you message

---

### 3.4 Contact Form Submission

**Trigger:** Contact form submitted

**Recipients:**
- **To:** Admin email (info@vefs.org)
- **Auto-reply To:** User's email

**Two Emails:**
1. **Admin Notification:** New contact inquiry
2. **User Confirmation:** "We received your message"

---

## 4. Troubleshooting

### 4.1 Gmail API Issues

**Error: Invalid Credentials**
- Check `credentials.json` exists and is valid
- Verify OAuth credentials in Google Cloud Console
- Ensure redirect URI matches exactly

**Error: Token Expired**
- Delete `gmail-token.json`
- Re-run authorization script (`gmail-auth.php`)
- Check refresh token saved correctly

**Error: Insufficient Permissions**
- Verify scope includes `https://www.googleapis.com/auth/gmail.send`
- Re-authorize with correct scopes

**Error: Daily Quota Exceeded**
- Check quota at Google Cloud Console
- Wait 24 hours for quota reset
- Consider upgrading to Google Workspace for higher limits

### 4.2 Email Delivery Issues

**Email Not Received:**
- Check spam/junk folder
- Verify recipient email correct
- Check email log for errors
- Test with different email provider

**Email Formatting Broken:**
- Check HTML template validity
- Test with simple plain text first
- Verify Content-Type header correct
- Check for special characters (encode properly)

---

## 5. Future Enhancements

### 5.1 Advanced Features

- **Email Queuing:** Queue emails for retry on failure
- **Email Templates System:** WYSIWYG template editor
- **Personalization:** Dynamic content based on user data
- **Email Analytics:** Track open rates, click rates
- **Unsubscribe Handling:** Manage newsletter preferences
- **Attachment Support:** Send PDFs (certificates, receipts)
- **Bulk Emails:** Newsletter campaigns (use Mailchimp/SendGrid instead)

### 5.2 Alternative Email Services

If Gmail API limits are reached, consider:

- **SendGrid** (100 emails/day free)
- **Mailgun** (5,000 emails/month free first 3 months)
- **Amazon SES** (Pay per email, very cheap)
- **Mailchimp** (Transactional emails + marketing)

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-24 | Initial documentation | Requirements Team |

---

**End of Document**
