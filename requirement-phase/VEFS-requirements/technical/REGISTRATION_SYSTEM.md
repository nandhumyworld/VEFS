# Registration/Booking System Architecture

**Project:** VEFS (Valluvam Ecological Farming and Social Welfare Foundation)
**Document Version:** 1.0
**Last Updated:** 2025-12-24
**Status:** Complete

---

## Overview

This document defines the architecture for the registration and booking system supporting Events, Trainings, and Donations on the VEFS website. The system is designed for **Hostinger static hosting** environment using PHP for email processing and JavaScript for client-side validation.

### System Scope

The registration system handles three distinct registration types:
1. **Event Registration** - Community events, workshops, awareness sessions
2. **Training Registration** - Structured training programs with detailed participant requirements
3. **Donation Processing** - Contribution form with compliance requirements

---

## 1. Technical Architecture

### 1.1 Hosting Environment
- **Platform:** Hostinger static hosting
- **Backend:** PHP (for email processing)
- **Frontend:** HTML5, JavaScript (vanilla), CSS3
- **Data Storage:** Email-based (no database)
- **File Structure:**
  ```
  public_html/
  ├── forms/
  │   ├── event-registration.php
  │   ├── training-registration.php
  │   ├── donation-form.php
  │   └── form-handler.php (shared logic)
  ├── js/
  │   ├── form-validation.js
  │   └── duplicate-checker.js
  ├── data/
  │   ├── events.json
  │   ├── trainings.json
  │   └── recent-registrations.json (for duplicate checking)
  └── email-templates/
      ├── event-confirmation.html
      ├── training-confirmation.html
      ├── donation-receipt.html
      └── admin-notification.html
  ```

### 1.2 Data Flow

```
User fills form → Client-side validation → Duplicate check →
PHP processing → Email to user (confirmation) →
Email to admin (CC notification) → Success message display
```

### 1.3 Email Delivery System

**Method:** PHP `mail()` function or SMTP (via Hostinger)

**Email Types:**
1. **User Confirmation Email** - Immediate auto-response
2. **Admin Notification Email** - Same content, admin in CC
3. **Payment Instructions Email** - For paid events/trainings

**SMTP Configuration (Recommended):**
```php
// Use Hostinger's SMTP for reliable delivery
$mail->isSMTP();
$mail->Host = 'smtp.hostinger.com';
$mail->SMTPAuth = true;
$mail->Username = 'noreply@vefs.org';
$mail->Password = '[SMTP_PASSWORD]';
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;
```

---

## 2. Event Registration System

### 2.1 Registration Form Fields

**Required Fields:**
- Full Name (text, 2-100 characters)
- Email Address (email validation)
- Phone Number (10-digit mobile number, Indian format)
- City/District (dropdown or text)

**Optional Fields:**
- Organization/Institution (text, optional)
- How did you hear about us? (dropdown, optional)

**Hidden Fields (auto-populated):**
- Event ID (from URL parameter or data attribute)
- Event Title
- Event Date
- Registration Timestamp
- Form Source (web/mobile)

### 2.2 Form Layout (Single-Step)

**Desktop Layout:**
- Two-column responsive grid
- Left column: Event details preview (read-only)
- Right column: Registration form
- Submit button at bottom-right

**Mobile Layout:**
- Single column, stacked
- Event preview collapsible accordion (to save space)
- Form fields full-width
- Sticky submit button

### 2.3 Validation Rules

**Client-side (JavaScript):**
- Name: Required, min 2 chars, letters and spaces only
- Email: Required, valid email format, no disposable email domains
- Phone: Required, exactly 10 digits, starts with 6-9
- City/District: Required if shown
- Terms checkbox: Must be checked (if applicable)

**Server-side (PHP):**
- Same validation as client-side (never trust client)
- Email duplicate check (same email for same event)
- Event capacity check (not applicable currently - no limits)
- Event status check (ensure event is "open" for registration)
- Sanitize all inputs to prevent XSS/injection

### 2.4 Duplicate Registration Prevention

**Mechanism:** JSON-based recent registrations tracker

**File:** `data/recent-registrations.json`
```json
{
  "event-123": [
    "user1@email.com",
    "user2@email.com"
  ],
  "training-456": [
    "user3@email.com"
  ]
}
```

**Logic:**
1. When user submits form, JavaScript checks `recent-registrations.json`
2. If email found for that event/training, show warning:
   - "You have already registered for this event. If you need to modify your registration, please contact us at [email/phone]."
3. Optionally allow user to "Register Anyway" (in case registering for someone else)
4. Update JSON file after successful registration
5. JSON file auto-cleans entries older than event date + 7 days

### 2.5 Payment Handling (For Paid Events)

**Event Types:**
- Free events (no payment required)
- Paid events (admin sets fee in events.json)

**Payment Field in events.json:**
```json
{
  "id": "evt-123",
  "title": "Advanced Organic Farming Workshop",
  "fee": 500,
  "paymentRequired": true,
  "paymentMethods": ["upi", "bank", "cash"],
  "upiId": "vefs@upi",
  "bankDetails": {
    "accountName": "VEFS Foundation",
    "accountNumber": "1234567890",
    "ifsc": "SBIN0001234",
    "bank": "State Bank of India"
  }
}
```

**Payment Flow:**

1. **Free Events:**
   - Registration form submitted
   - Confirmation email sent immediately
   - "Successfully registered! See you at the event."

2. **Paid Events:**
   - Registration form submitted
   - Confirmation email sent with payment instructions
   - **On-screen confirmation page shows:**
     ```
     Registration Successful!

     To confirm your seat, please complete payment:

     Amount: ₹500

     Payment Options:
     1. UPI: vefs@upi (Scan QR code)
     2. Bank Transfer: [Bank details]
     3. Pay cash on arrival

     Once payment is made, please send screenshot/receipt to:
     payments@vefs.org or WhatsApp: [number]

     Event Details:
     [Event name, date, time, location]

     Questions? Contact us: [contact details]
     ```
   - Same information also sent via email

3. **Payment Confirmation (Manual):**
   - User sends payment proof to admin
   - Admin manually verifies and confirms
   - (Optional future enhancement: Auto-verification via payment gateway)

### 2.6 Confirmation Email Template

**Subject:** Registration Confirmed - [Event Title] on [Event Date]

**Email Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Email-safe CSS */
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background: #6B8E23; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .event-details { background: #f4f4f4; padding: 15px; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
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
            <strong>Location:</strong> [Event Location]<br>
            <strong>Contact:</strong> [Event Contact Person]</p>
        </div>

        <!-- If Paid Event -->
        <div class="payment-info">
            <h3>Payment Required:</h3>
            <p><strong>Amount:</strong> ₹[Fee]</p>

            <p><strong>Payment Options:</strong></p>
            <ol>
                <li><strong>UPI:</strong> [UPI ID] (Scan QR code attached)</li>
                <li><strong>Bank Transfer:</strong><br>
                    Account Name: [Account Name]<br>
                    Account Number: [Account Number]<br>
                    IFSC: [IFSC Code]<br>
                    Bank: [Bank Name]
                </li>
                <li><strong>Cash on Arrival:</strong> Pay at the venue</li>
            </ol>

            <p>After payment, please send proof to: <a href="mailto:payments@vefs.org">payments@vefs.org</a></p>
        </div>

        <div class="what-to-bring">
            <h3>What to Bring:</h3>
            <ul>
                <li>[Item from event description]</li>
                <li>Notebook and pen</li>
                <li>Water bottle</li>
            </ul>
        </div>

        <p><strong>Need to cancel or modify your registration?</strong><br>
        Please contact us at least 48 hours before the event:<br>
        Email: <a href="mailto:events@vefs.org">events@vefs.org</a><br>
        Phone: [Phone Number]</p>

        <p>We look forward to seeing you!</p>

        <p>Warm regards,<br>
        <strong>VEFS Team</strong><br>
        Valluvam Ecological Farming and Social Welfare Foundation</p>
    </div>

    <div class="footer">
        <p>&copy; 2025 VEFS Foundation | <a href="https://vefs.org" style="color: white;">vefs.org</a></p>
    </div>
</body>
</html>
```

### 2.7 Admin Notification Email

**Recipient:** Admin email (specified in config)
**CC:** User's email (so both receive same message)
**Subject:** New Event Registration - [Event Title]

**Email Content:**
```
New Event Registration Received

Event: [Event Title]
Date: [Event Date]
Registration Time: [Timestamp]

Registrant Details:
- Name: [Full Name]
- Email: [Email]
- Phone: [Phone]
- City/District: [City]
- Organization: [Organization] (if provided)

Payment Status: [Free / Pending Payment of ₹500]

Total Registrations for this event: [Count] (estimated)

---
This is an automated notification. Reply to this email to contact the registrant.
```

### 2.8 Success/Error Messages

**Success Message (On-screen):**
```
✓ Registration Successful!

Thank you for registering for [Event Name]!

A confirmation email has been sent to [email].

[If Paid: See payment instructions below]

[View Event Details] [Register for Another Event]
```

**Error Messages:**
- "You have already registered for this event. Contact us to modify: [email/phone]"
- "This event is no longer accepting registrations."
- "Please fill in all required fields."
- "Invalid email address format."
- "Invalid phone number. Please enter 10-digit mobile number."
- "Registration failed. Please try again or contact us at [email]."

### 2.9 No Capacity Limits

- All events accept unlimited registrations
- No "Fully Booked" message needed
- No waitlist functionality required
- (Future: If capacity limits are added, update events.json with `maxCapacity` field)

---

## 3. Training Registration System

### 3.1 Registration Form Fields

**All Event Fields +:**
- **Occupation/Professional Details:**
  - Current Occupation (dropdown: Student, Farmer, Teacher, Government Employee, NGO/Social Worker, Business Owner, Homemaker, Retired, Other)
  - Organization/Institution Name (text)
  - Years of Experience (dropdown: 0-2, 3-5, 6-10, 10+, Not Applicable)

- **Terms & Conditions:**
  - Checkbox: "I agree to the terms and conditions" (required)
  - Terms text loaded from trainings.json or separate terms file
  - Link to full T&C page (optional)

**Example Terms (stored in trainings.json):**
```json
{
  "id": "trn-123",
  "title": "Organic Farming Training",
  "termsAndConditions": [
    "Participants must attend all sessions to receive certificate",
    "Training materials are for personal use only",
    "Photography/recording during sessions requires prior permission",
    "Participants are responsible for their own travel and accommodation",
    "VEFS reserves the right to cancel/reschedule training with prior notice"
  ]
}
```

### 3.2 Form Layout

**Single-step form with sections:**

**Section 1: Personal Information**
- Name, Email, Phone, City/District

**Section 2: Professional Background**
- Occupation, Organization, Experience

**Section 3: Terms & Conditions**
- Scrollable terms box (max-height with scroll)
- "I agree" checkbox (required)

**Section 4: Payment (if applicable)**
- Displays only if training has fee
- Shows amount and payment methods

**Submit Button**
- Disabled until all required fields filled and terms accepted
- "Register for Training" or "Submit & Pay" (if paid)

### 3.3 Training-Specific Validation

Same as events, plus:
- Occupation: Required
- Organization: Optional
- Experience: Required if occupation is professional
- Terms checkbox: Must be checked (required)

### 3.4 Training Confirmation Email

Similar to event confirmation, with additions:
- **Training schedule** (multiple sessions if applicable)
- **Prerequisites/preparation** (materials to bring, pre-reading)
- **Certificate information** (attendance requirement, assessment details)
- **Contact person** for training-specific queries
- **Terms & Conditions** (full text included for reference)

---

## 4. Donation Form System

### 4.1 Donation Form Fields

**Basic Information (Always Required):**
- Full Name
- Email Address
- Phone Number

**Conditional Fields:**
- **If donation amount > ₹2000:**
  - PAN Number (required, validated format: ABCDE1234F)
  - Reason: Tax deduction compliance (80G certificate)

**Donation Details:**
- Donation Amount (number input, min ₹1)
- Donation Purpose (dropdown):
  - General Fund
  - Tree Plantation
  - Educational Programs
  - Community Training
  - Infrastructure Development
  - Other (specify)
- Anonymous Donation (checkbox - if checked, name not published in donor list)
- Message/Dedication (optional textarea)

### 4.2 Form Layout

**Section 1: Donation Details**
- Amount (₹) - Large number input
- Purpose - Dropdown
- Anonymous option

**Section 2: Donor Information**
- Name, Email, Phone
- PAN Number (appears only if amount > ₹2000)

**Section 3: Message (Optional)**
- Dedication or message (max 500 chars)

### 4.3 PAN Validation

**Client-side:**
```javascript
function validatePAN(pan) {
    // Format: ABCDE1234F
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
}

// Show PAN field only if amount > 2000
donationAmount.addEventListener('input', function() {
    if (parseInt(this.value) > 2000) {
        panField.style.display = 'block';
        panField.setAttribute('required', true);
    } else {
        panField.style.display = 'none';
        panField.removeAttribute('required');
    }
});
```

**Server-side:**
- Same validation
- Store PAN securely (encrypted or separate secure storage)
- Include in admin notification for 80G certificate processing

### 4.4 Donation Payment Flow

**All donations require payment before processing:**

1. User fills donation form
2. Form validates (including PAN if applicable)
3. Confirmation page shows:
   - Donation summary
   - Payment instructions (UPI, Bank, QR code)
   - Reference number (timestamp-based: DON-20250124-001)
4. Email sent to user and admin with:
   - Donation details
   - Payment instructions
   - Reference number
   - Request to send payment proof

5. **After Payment Verified (by admin):**
   - Admin sends thank you email
   - For donations > ₹2000: 80G certificate sent (separate process)
   - Donor name added to website donor list (unless anonymous)

### 4.5 Donation Confirmation Email

**Subject:** Thank You for Your Generous Donation - VEFS

**Email Content:**
```html
<div class="header">
    <h1>Thank You for Your Support!</h1>
</div>

<div class="content">
    <p>Dear [Donor Name],</p>

    <p>Thank you for your generous donation to VEFS Foundation!</p>

    <div class="donation-summary">
        <h3>Donation Details:</h3>
        <p><strong>Amount:</strong> ₹[Amount]<br>
        <strong>Purpose:</strong> [Purpose]<br>
        <strong>Reference Number:</strong> [DON-YYYYMMDD-XXX]<br>
        <strong>Date:</strong> [Date]</p>
    </div>

    <div class="payment-info">
        <h3>Payment Instructions:</h3>

        <p><strong>UPI Payment:</strong><br>
        UPI ID: vefs@upi<br>
        [QR Code Image]</p>

        <p><strong>Bank Transfer:</strong><br>
        Account Name: Valluvam Ecological Farming and Social Welfare Foundation<br>
        Account Number: [Account Number]<br>
        IFSC Code: [IFSC]<br>
        Bank: [Bank Name]</p>

        <p><strong>After making payment:</strong><br>
        Please send payment screenshot/receipt to:<br>
        Email: donations@vefs.org<br>
        WhatsApp: [Number]<br>
        Reference Number: [DON-YYYYMMDD-XXX]</p>
    </div>

    <!-- If PAN provided -->
    <div class="tax-benefit">
        <p><strong>Tax Benefit (80G):</strong><br>
        Your donation qualifies for tax deduction under Section 80G.<br>
        We will send your 80G certificate within 7-10 days after payment verification.</p>
    </div>

    <p>Your contribution helps us:</p>
    <ul>
        <li>Preserve indigenous tree species</li>
        <li>Conduct eco-education programs</li>
        <li>Support sustainable farming practices</li>
        <li>Create environmental awareness in communities</li>
    </ul>

    <p>With gratitude,<br>
    <strong>VEFS Team</strong></p>
</div>
```

### 4.6 Admin Notification for Donations

**Subject:** New Donation - ₹[Amount] - [Reference Number]

**Email Content:**
```
New Donation Received

Reference: [DON-YYYYMMDD-XXX]
Amount: ₹[Amount]
Purpose: [Purpose]
Timestamp: [DateTime]

Donor Details:
- Name: [Name] [If Anonymous: "Anonymous Donor"]
- Email: [Email]
- Phone: [Phone]
- PAN: [PAN Number] (if amount > ₹2000)

Message/Dedication:
[Message text if provided]

Payment Status: PENDING
Please verify payment and:
1. Send thank you email
2. Issue 80G certificate (if PAN provided)
3. Add to donor recognition list (if not anonymous)

---
Reply to this email to contact the donor.
```

---

## 5. Technical Implementation

### 5.1 PHP Form Handler

**File:** `forms/form-handler.php`

```php
<?php
// Configuration
define('ADMIN_EMAIL', 'admin@vefs.org');
define('FROM_EMAIL', 'noreply@vefs.org');
define('SITE_NAME', 'VEFS Foundation');

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method not allowed');
}

// Get form type
$formType = $_POST['form_type'] ?? ''; // 'event', 'training', 'donation'

// Sanitize inputs
function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Validate phone (Indian mobile)
function validate_phone($phone) {
    return preg_match('/^[6-9][0-9]{9}$/', $phone);
}

// Validate PAN
function validate_pan($pan) {
    return preg_match('/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/', $pan);
}

// Check duplicate registration
function check_duplicate($email, $eventId) {
    $file = '../data/recent-registrations.json';
    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);
        return isset($data[$eventId]) && in_array($email, $data[$eventId]);
    }
    return false;
}

// Add to recent registrations
function add_registration($email, $eventId) {
    $file = '../data/recent-registrations.json';
    $data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

    if (!isset($data[$eventId])) {
        $data[$eventId] = [];
    }

    $data[$eventId][] = $email;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Process based on form type
switch ($formType) {
    case 'event':
        include 'process-event-registration.php';
        break;
    case 'training':
        include 'process-training-registration.php';
        break;
    case 'donation':
        include 'process-donation.php';
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid form type']);
}
?>
```

### 5.2 Event Registration Processor

**File:** `forms/process-event-registration.php`

```php
<?php
// Validate required fields
$name = sanitize_input($_POST['name'] ?? '');
$email = sanitize_input($_POST['email'] ?? '');
$phone = sanitize_input($_POST['phone'] ?? '');
$city = sanitize_input($_POST['city'] ?? '');
$eventId = sanitize_input($_POST['event_id'] ?? '');
$eventTitle = sanitize_input($_POST['event_title'] ?? '');

$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please enter your full name';
}

if (!validate_email($email)) {
    $errors[] = 'Please enter a valid email address';
}

if (!validate_phone($phone)) {
    $errors[] = 'Please enter a valid 10-digit mobile number';
}

if (empty($city)) {
    $errors[] = 'Please select your city/district';
}

if (empty($eventId)) {
    $errors[] = 'Event information missing';
}

// Check for duplicate
if (check_duplicate($email, $eventId)) {
    $errors[] = 'You have already registered for this event. Contact us to modify your registration.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Load event details from events.json
$eventsData = json_decode(file_get_contents('../data/events.json'), true);
$event = null;
foreach ($eventsData['events'] as $e) {
    if ($e['id'] === $eventId) {
        $event = $e;
        break;
    }
}

if (!$event) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Event not found']);
    exit;
}

// Check if event accepts registrations
if ($event['status'] !== 'open') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'This event is not accepting registrations']);
    exit;
}

// Prepare email content
$isPaid = $event['paymentRequired'] ?? false;
$fee = $event['fee'] ?? 0;

// User confirmation email
$userSubject = "Registration Confirmed - {$event['title']}";
$userMessage = file_get_contents('../email-templates/event-confirmation.html');

// Replace placeholders
$userMessage = str_replace('[Name]', $name, $userMessage);
$userMessage = str_replace('[Event Title]', $event['title'], $userMessage);
$userMessage = str_replace('[Event Date]', $event['date'], $userMessage);
$userMessage = str_replace('[Event Time]', $event['time'], $userMessage);
$userMessage = str_replace('[Event Location]', $event['location'], $userMessage);

if ($isPaid) {
    $paymentInfo = "
    <div class='payment-info'>
        <h3>Payment Required</h3>
        <p><strong>Amount: ₹{$fee}</strong></p>
        <p><strong>Payment Options:</strong></p>
        <ol>
            <li><strong>UPI:</strong> {$event['upiId']}</li>
            <li><strong>Bank Transfer:</strong><br>
                Account: {$event['bankDetails']['accountName']}<br>
                Account Number: {$event['bankDetails']['accountNumber']}<br>
                IFSC: {$event['bankDetails']['ifsc']}<br>
                Bank: {$event['bankDetails']['bank']}
            </li>
            <li><strong>Cash on Arrival</strong></li>
        </ol>
        <p>After payment, send proof to: payments@vefs.org</p>
    </div>";
    $userMessage = str_replace('[PAYMENT_INFO]', $paymentInfo, $userMessage);
} else {
    $userMessage = str_replace('[PAYMENT_INFO]', '', $userMessage);
}

// Admin notification email
$adminSubject = "New Event Registration - {$event['title']}";
$adminMessage = "
New Event Registration

Event: {$event['title']}
Date: {$event['date']}
Registration Time: " . date('Y-m-d H:i:s') . "

Registrant Details:
- Name: $name
- Email: $email
- Phone: $phone
- City/District: $city

Payment: " . ($isPaid ? "Required - ₹{$fee}" : "Free Event") . "

---
Reply to this email to contact the registrant.
";

// Send emails
$headers = "From: " . FROM_EMAIL . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "CC: " . ADMIN_EMAIL . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Send to user with admin CC'd
$userEmailSent = mail($email, $userSubject, $userMessage, $headers);

// Add to recent registrations
add_registration($email, $eventId);

// Log registration (optional - for analytics)
$logEntry = date('Y-m-d H:i:s') . " | Event: $eventId | Email: $email | Phone: $phone\n";
file_put_contents('../logs/registrations.log', $logEntry, FILE_APPEND);

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Registration successful!',
    'isPaid' => $isPaid,
    'fee' => $fee,
    'paymentInfo' => $isPaid ? [
        'upi' => $event['upiId'],
        'bank' => $event['bankDetails']
    ] : null
]);
?>
```

### 5.3 Client-Side Validation (JavaScript)

**File:** `js/form-validation.js`

```javascript
// Form validation and duplicate checking
class RegistrationForm {
    constructor(formId, formType) {
        this.form = document.getElementById(formId);
        this.formType = formType;
        this.duplicateCheckURL = '/data/recent-registrations.json';

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        this.form.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Duplicate email check
        const emailInput = this.form.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.checkDuplicate(emailInput.value));
        }

        // PAN field visibility for donations
        if (this.formType === 'donation') {
            const amountInput = this.form.querySelector('input[name="amount"]');
            amountInput.addEventListener('input', () => this.togglePANField());
        }
    }

    validateField(input) {
        const name = input.name;
        const value = input.value.trim();
        let error = '';

        switch(name) {
            case 'name':
                if (value.length < 2) error = 'Name must be at least 2 characters';
                if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Name can only contain letters';
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) error = 'Please enter a valid email';
                break;

            case 'phone':
                const phoneRegex = /^[6-9][0-9]{9}$/;
                if (!phoneRegex.test(value)) error = 'Please enter valid 10-digit mobile number';
                break;

            case 'pan':
                const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                if (value && !panRegex.test(value)) error = 'Invalid PAN format (e.g., ABCDE1234F)';
                break;
        }

        this.showError(input, error);
        return error === '';
    }

    async checkDuplicate(email) {
        const eventId = this.form.querySelector('input[name="event_id"]')?.value ||
                       this.form.querySelector('input[name="training_id"]')?.value;

        if (!eventId || !email) return;

        try {
            const response = await fetch(this.duplicateCheckURL);
            const data = await response.json();

            if (data[eventId] && data[eventId].includes(email)) {
                this.showDuplicateWarning();
            }
        } catch (error) {
            console.error('Duplicate check failed:', error);
        }
    }

    showDuplicateWarning() {
        const warning = document.createElement('div');
        warning.className = 'alert alert-warning';
        warning.innerHTML = `
            <strong>Already Registered:</strong> This email is already registered for this event.
            Need to modify? Contact us: events@vefs.org or [phone]
            <button type="button" class="close" onclick="this.parentElement.remove()">×</button>
        `;
        this.form.insertBefore(warning, this.form.firstChild);
    }

    togglePANField() {
        const amount = parseInt(this.form.querySelector('input[name="amount"]').value);
        const panField = this.form.querySelector('.pan-field-wrapper');
        const panInput = this.form.querySelector('input[name="pan"]');

        if (amount > 2000) {
            panField.style.display = 'block';
            panInput.required = true;
        } else {
            panField.style.display = 'none';
            panInput.required = false;
        }
    }

    showError(input, message) {
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = message ? 'block' : 'none';
        }

        if (message) {
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        this.form.querySelectorAll('input[required]').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        // Submit form
        this.showLoading(true);

        try {
            const formData = new FormData(this.form);
            formData.append('form_type', this.formType);

            const response = await fetch('/forms/form-handler.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess(result);
            } else {
                this.showMessage(result.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            this.showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    showSuccess(result) {
        // Hide form
        this.form.style.display = 'none';

        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-container';

        let html = `
            <div class="success-icon">✓</div>
            <h2>Registration Successful!</h2>
            <p>A confirmation email has been sent to <strong>${this.form.querySelector('input[name="email"]').value}</strong></p>
        `;

        if (result.isPaid) {
            html += `
                <div class="payment-instructions">
                    <h3>Payment Required: ₹${result.fee}</h3>
                    <div class="payment-options">
                        <div class="payment-option">
                            <h4>UPI Payment</h4>
                            <p>${result.paymentInfo.upi}</p>
                            <img src="/images/qr-code.png" alt="QR Code" class="qr-code">
                        </div>
                        <div class="payment-option">
                            <h4>Bank Transfer</h4>
                            <p>Account: ${result.paymentInfo.bank.accountName}</p>
                            <p>Number: ${result.paymentInfo.bank.accountNumber}</p>
                            <p>IFSC: ${result.paymentInfo.bank.ifsc}</p>
                        </div>
                        <div class="payment-option">
                            <h4>Cash on Arrival</h4>
                            <p>Pay at the venue</p>
                        </div>
                    </div>
                    <p class="payment-note">
                        After payment, please send screenshot/receipt to:<br>
                        <strong>payments@vefs.org</strong>
                    </p>
                </div>
            `;
        }

        html += `
            <div class="action-buttons">
                <a href="/" class="btn btn-primary">Back to Home</a>
                <a href="/events" class="btn btn-secondary">View More Events</a>
            </div>
        `;

        successDiv.innerHTML = html;
        this.form.parentElement.appendChild(successDiv);
    }

    showLoading(show) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Register Now';
        }
    }

    showMessage(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        this.form.insertBefore(alertDiv, this.form.firstChild);

        setTimeout(() => alertDiv.remove(), 5000);
    }
}

// Initialize forms
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('event-registration-form')) {
        new RegistrationForm('event-registration-form', 'event');
    }

    if (document.getElementById('training-registration-form')) {
        new RegistrationForm('training-registration-form', 'training');
    }

    if (document.getElementById('donation-form')) {
        new RegistrationForm('donation-form', 'donation');
    }
});
```

---

## 6. User Modification/Cancellation Process

### 6.1 Cancellation Policy

**How Users Cancel/Modify:**
1. User contacts admin via email or phone
2. Provides registration details (name, email, event/training name)
3. Admin manually processes request:
   - Updates internal tracking
   - Sends confirmation email
   - If paid event, processes refund (if applicable)

**Email Template for Cancellation Request:**

User sends email to: events@vefs.org or trainings@vefs.org

```
Subject: Cancellation Request - [Event/Training Name]

I would like to cancel my registration for [Event/Training Name] on [Date].

My Details:
Name: [Full Name]
Email: [Registered Email]
Phone: [Phone Number]

Reason for cancellation (optional): [Reason]

[If paid] I have made payment of ₹[Amount]. Please advise on refund process.

Thank you.
```

**Admin Response Template:**

```
Subject: Cancellation Confirmed - [Event/Training Name]

Dear [Name],

Your registration for [Event/Training Name] on [Date] has been successfully cancelled.

[If paid event with refund policy:]
Your payment of ₹[Amount] will be refunded within 7-10 business days to your original payment method.

We hope to see you at our future events!

If you have any questions, please contact us at [phone/email].

Best regards,
VEFS Team
```

### 6.2 Modification Process

Similar to cancellation:
1. User emails modification request
2. Admin manually updates records
3. Sends updated confirmation email

---

## 7. Security & Privacy Considerations

### 7.1 Data Protection

**Sensitive Data:**
- Email addresses
- Phone numbers
- PAN numbers (for donations > ₹2000)
- Payment information

**Protection Measures:**
1. **HTTPS/SSL:** All forms use HTTPS encryption
2. **Input Sanitization:** All inputs sanitized to prevent XSS/SQL injection
3. **CSRF Protection:** Use CSRF tokens in forms
4. **Rate Limiting:** Limit form submissions per IP (prevent spam)
5. **Email Storage:** Store emails securely, never share with third parties
6. **PAN Encryption:** Encrypt PAN numbers if storing locally

### 7.2 CSRF Protection

```php
// Generate CSRF token
session_start();
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// In form
echo '<input type="hidden" name="csrf_token" value="' . $_SESSION['csrf_token'] . '">';

// Validate on submission
if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    die('Invalid CSRF token');
}
```

### 7.3 Rate Limiting

```php
// Simple rate limiting (IP-based)
$ip = $_SERVER['REMOTE_ADDR'];
$rateFile = "../data/rate-limit.json";
$data = file_exists($rateFile) ? json_decode(file_get_contents($rateFile), true) : [];

$now = time();
$limit = 5; // 5 submissions per hour
$period = 3600; // 1 hour

if (!isset($data[$ip])) {
    $data[$ip] = [];
}

// Clean old entries
$data[$ip] = array_filter($data[$ip], function($timestamp) use ($now, $period) {
    return $timestamp > ($now - $period);
});

// Check limit
if (count($data[$ip]) >= $limit) {
    http_response_code(429);
    die('Too many requests. Please try again later.');
}

// Add current request
$data[$ip][] = $now;
file_put_contents($rateFile, json_encode($data));
```

### 7.4 Privacy Policy Reference

All forms should include link to privacy policy:
"By submitting this form, you agree to our [Privacy Policy](/privacy-policy)"

**Privacy Policy should cover:**
- What data is collected
- How it's used (event management, communication)
- Who has access (admin team only)
- Data retention period
- User rights (access, deletion requests)
- Contact for privacy concerns

---

## 8. Analytics & Reporting

### 8.1 Registration Tracking

**Manual Tracking (Current Approach):**
- Admin receives email for each registration
- Manually compile into spreadsheet
- Track metrics: total registrations, by event, by location, by date

**Simple Log File (Optional):**
- Each registration appends to `logs/registrations.log`
- Format: `YYYY-MM-DD HH:MM:SS | Type: event | ID: evt-123 | Email: user@email.com`
- Can be parsed for basic analytics

### 8.2 Key Metrics to Track

**For Events:**
- Total registrations per event
- Registration timeline (early vs. last-minute)
- Geographic distribution (by city)
- Registration source (organic, social media, email)

**For Trainings:**
- Participant demographics (occupation, experience)
- Registration vs. attendance rate
- Feedback/satisfaction scores (post-training)

**For Donations:**
- Total donations (amount, count)
- Average donation amount
- Donation purposes (most popular)
- Repeat donors
- 80G certificate requests (PAN provided)

### 8.3 Future Enhancements

**Phase 2 (Database Implementation):**
- MySQL database for structured storage
- Admin dashboard for real-time metrics
- Export to CSV/Excel
- Automated reports (weekly/monthly)

**Phase 3 (Advanced Features):**
- QR code tickets for events
- Attendance tracking (scan QR on arrival)
- Automated reminders (email 1 day before event)
- Waitlist management
- Payment gateway integration (Razorpay)
- Certificate generation (for trainings)

---

## 9. Testing & Quality Assurance

### 9.1 Testing Checklist

**Functional Testing:**
- [ ] Event registration (free) - successful submission
- [ ] Event registration (paid) - payment instructions displayed
- [ ] Training registration - all fields validated
- [ ] Donation form - PAN field appears for amount > ₹2000
- [ ] Duplicate email detection works
- [ ] Email delivery (user confirmation)
- [ ] Email delivery (admin notification with CC)
- [ ] Form validation (client-side)
- [ ] Form validation (server-side)
- [ ] Error handling (invalid inputs)
- [ ] Success messages displayed correctly

**Email Testing:**
- [ ] User receives confirmation email
- [ ] Admin receives notification email
- [ ] Admin is CC'd on user confirmation
- [ ] Email formatting renders correctly (Gmail, Outlook, mobile)
- [ ] Links in email work
- [ ] Payment instructions clear and complete

**Security Testing:**
- [ ] CSRF protection working
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] Rate limiting prevents spam
- [ ] HTTPS enforced

**Browser Compatibility:**
- [ ] Chrome (desktop, mobile)
- [ ] Firefox
- [ ] Safari (desktop, iOS)
- [ ] Edge
- [ ] Responsive design works on all screen sizes

**Performance:**
- [ ] Form loads in < 2 seconds
- [ ] Submission completes in < 3 seconds
- [ ] Email delivery within 1 minute
- [ ] No PHP errors in logs

### 9.2 User Acceptance Testing

**Test Scenarios:**
1. **New user registers for free event:**
   - Fills form, submits, sees success message
   - Receives confirmation email within 1 minute

2. **User registers for paid training:**
   - Fills form with occupation details
   - Sees payment instructions on screen
   - Receives email with payment details

3. **User tries to register twice:**
   - Warning message appears
   - Option to contact admin provided

4. **User donates ₹5000:**
   - PAN field appears automatically
   - Validates PAN format
   - Shows payment instructions
   - Email mentions 80G certificate

5. **Admin receives notification:**
   - Email arrives within 1 minute
   - All details clearly visible
   - Can reply to contact registrant

---

## 10. Maintenance & Support

### 10.1 Regular Maintenance Tasks

**Weekly:**
- Review registrations log
- Check for bounce/failed emails
- Clean up old entries in recent-registrations.json (older than 30 days)

**Monthly:**
- Backup registration logs
- Review and update email templates if needed
- Check form analytics (submission rate, error rate)

**As Needed:**
- Update event/training details in JSON files
- Modify payment details (UPI ID, bank account)
- Update terms & conditions

### 10.2 Troubleshooting Guide

**Problem: Emails not being delivered**

Solutions:
1. Check PHP mail() configuration in Hostinger
2. Verify sender email (noreply@vefs.org) is configured
3. Check spam folder
4. Use SMTP instead of PHP mail() for better delivery
5. Check email logs in Hostinger panel

**Problem: Duplicate registrations still happening**

Solutions:
1. Verify recent-registrations.json file exists and is writable
2. Check JavaScript console for errors
3. Ensure event IDs are unique and consistent

**Problem: PAN field not appearing for large donations**

Solutions:
1. Check JavaScript console for errors
2. Verify amount input has correct name attribute
3. Clear browser cache

**Problem: Form validation not working**

Solutions:
1. Check if JavaScript is enabled
2. Verify form-validation.js is loaded
3. Check browser console for errors
4. Ensure input names match validation rules

### 10.3 Support Contact

**For Users:**
- Event registrations: events@vefs.org | [Phone]
- Training registrations: trainings@vefs.org | [Phone]
- Donations: donations@vefs.org | [Phone]
- General inquiries: info@vefs.org | [Phone]

**For Technical Issues:**
- Developer/Webmaster: [Technical Contact]

---

## 11. Appendices

### Appendix A: Email Template Files

**Location:** `/email-templates/`

Files:
1. `event-confirmation.html` - Event registration confirmation
2. `training-confirmation.html` - Training registration confirmation
3. `donation-receipt.html` - Donation acknowledgment
4. `admin-notification.html` - Admin notification template
5. `payment-instructions.html` - Payment details template

### Appendix B: Form HTML Examples

**Event Registration Form:**
```html
<form id="event-registration-form" method="POST" novalidate>
    <input type="hidden" name="csrf_token" value="[TOKEN]">
    <input type="hidden" name="event_id" value="evt-123">
    <input type="hidden" name="event_title" value="Organic Farming Workshop">

    <div class="form-group">
        <label for="name">Full Name *</label>
        <input type="text" id="name" name="name" required minlength="2">
        <div class="error-message"></div>
    </div>

    <div class="form-group">
        <label for="email">Email Address *</label>
        <input type="email" id="email" name="email" required>
        <div class="error-message"></div>
    </div>

    <div class="form-group">
        <label for="phone">Phone Number *</label>
        <input type="tel" id="phone" name="phone" required pattern="[6-9][0-9]{9}">
        <div class="error-message"></div>
    </div>

    <div class="form-group">
        <label for="city">City/District *</label>
        <select id="city" name="city" required>
            <option value="">Select...</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
            <!-- More options -->
        </select>
        <div class="error-message"></div>
    </div>

    <button type="submit" class="btn btn-primary">Register Now</button>
</form>
```

### Appendix C: JSON Schema Examples

**recent-registrations.json:**
```json
{
  "evt-123": [
    "user1@email.com",
    "user2@email.com"
  ],
  "trn-456": [
    "user3@email.com"
  ],
  "_metadata": {
    "lastCleaned": "2025-12-24",
    "totalRegistrations": 125
  }
}
```

**rate-limit.json:**
```json
{
  "192.168.1.1": [1734976800, 1734976850, 1734976900],
  "192.168.1.2": [1734976920],
  "_metadata": {
    "lastCleaned": "2025-12-24T10:30:00"
  }
}
```

### Appendix D: Configuration File

**config.php:**
```php
<?php
// Email Configuration
define('ADMIN_EMAIL', 'admin@vefs.org');
define('EVENTS_EMAIL', 'events@vefs.org');
define('TRAININGS_EMAIL', 'trainings@vefs.org');
define('DONATIONS_EMAIL', 'donations@vefs.org');
define('FROM_EMAIL', 'noreply@vefs.org');
define('FROM_NAME', 'VEFS Foundation');

// SMTP Configuration (if using SMTP)
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);
define('SMTP_USERNAME', 'noreply@vefs.org');
define('SMTP_PASSWORD', '[PASSWORD]');

// Site Configuration
define('SITE_NAME', 'VEFS Foundation');
define('SITE_URL', 'https://vefs.org');

// Form Settings
define('MAX_REGISTRATIONS_PER_HOUR', 5);
define('DUPLICATE_CHECK_ENABLED', true);
define('PAN_THRESHOLD', 2000); // Amount threshold for PAN requirement

// File Paths
define('DATA_PATH', __DIR__ . '/../data/');
define('LOG_PATH', __DIR__ . '/../logs/');
define('TEMPLATE_PATH', __DIR__ . '/../email-templates/');

// Security
define('CSRF_ENABLED', true);
define('RATE_LIMIT_ENABLED', true);
?>
```

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-24 | Initial documentation | Requirements Team |

---

## Approval

**Prepared By:** Claude AI Assistant
**Reviewed By:** [Name]
**Approved By:** [Name]
**Date:** 2025-12-24

---

**End of Document**
