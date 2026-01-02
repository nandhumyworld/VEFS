# Integration Specifications

**Project:** VEFS (Valluvam Ecological Farming and Social Welfare Foundation)
**Document Version:** 1.0
**Last Updated:** 2025-12-24
**Status:** Complete

---

## Overview

This document defines integration specifications for third-party services used in the VEFS website:

1. **Payment Integration** - UPI, Bank Transfer, Payment Gateway
2. **Analytics Integration** - Google Analytics, Facebook Pixel
3. **Social Media Integration** - Sharing, feeds, links
4. **Maps Integration** - Google Maps embed

**Note:** Email integration (Gmail API) is documented separately in the JSON API & Gmail Integration document.

---

## 1. Payment Integration

### 1.1 Payment Methods Overview

The VEFS website supports multiple payment methods:

1. **UPI (Unified Payments Interface)** - Primary method
2. **Bank Transfer/NEFT** - Secondary method
3. **Cash on Arrival** - For events/trainings
4. **Payment Gateway (Optional)** - Razorpay/Instamojo for online processing

**Current Implementation:** Display payment instructions (UPI ID, QR code, bank details) after registration. Payment verification is manual.

**Future Enhancement:** Integrate Razorpay for automated payment processing.

---

### 1.2 UPI Payment Integration

**Method:** Display UPI ID and QR code for user to scan with their payment app.

#### Implementation

**Step 1: Generate UPI QR Code**

Use online QR code generator:
- URL: https://www.qr-code-generator.com/
- Content type: Text
- Text content: `upi://pay?pa=vefs@upi&pn=VEFS Foundation&am=500&cu=INR&tn=Event Registration`

**UPI URI Format:**
```
upi://pay?pa=<VPA>&pn=<PayeeName>&am=<Amount>&cu=INR&tn=<TransactionNote>
```

**Parameters:**
- `pa` = VPA (Virtual Payment Address), e.g., `vefs@upi`
- `pn` = Payee Name (VEFS Foundation)
- `am` = Amount (optional, leave blank for user to enter)
- `cu` = Currency (INR)
- `tn` = Transaction Note (e.g., "Event Registration")

**Example:**
```
upi://pay?pa=vefs@upi&pn=VEFS%20Foundation&cu=INR
```

**Step 2: Save QR Code Image**

- Download QR code as PNG (size: 300x300px)
- Save as `/images/references/payment-qr-upi.png`
- Upload to server

**Step 3: Display on Website**

**HTML (Payment Instructions Page):**
```html
<div class="payment-section">
  <h3>UPI Payment</h3>
  <p><strong>UPI ID:</strong> vefs@upi</p>

  <div class="qr-code-container">
    <img src="/images/references/payment-qr-upi.png" alt="UPI QR Code" class="qr-code">
    <p class="qr-code-caption">Scan with any UPI app (Google Pay, PhonePe, Paytm, etc.)</p>
  </div>

  <div class="payment-steps">
    <h4>How to Pay:</h4>
    <ol>
      <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
      <li>Scan the QR code above</li>
      <li>Enter amount: ₹<span class="payment-amount">500</span></li>
      <li>Complete the payment</li>
      <li>Take a screenshot of the payment confirmation</li>
      <li>Send screenshot to <a href="mailto:payments@vefs.org">payments@vefs.org</a> or WhatsApp: +91-XXXXXXXXXX</li>
    </ol>
  </div>
</div>
```

**CSS:**
```css
.qr-code-container {
  text-align: center;
  padding: var(--space-lg);
  background-color: var(--color-gray-100);
  border-radius: var(--radius-lg);
  margin: var(--space-md) 0;
}

.qr-code {
  width: 250px;
  height: 250px;
  border: 4px solid var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.qr-code-caption {
  margin-top: var(--space-sm);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}
```

#### Dynamic Amount in QR Code (Advanced)

For dynamic amounts, generate QR code on-the-fly using PHP or JavaScript library:

**Option 1: Server-side PHP**
```php
<?php
// Using PHP QR Code library (https://github.com/chillerlan/php-qrcode)
require_once 'vendor/autoload.php';

use chillerlan\QRCode\QRCode;

$amount = $_GET['amount'] ?? '';
$upiString = "upi://pay?pa=vefs@upi&pn=VEFS Foundation&am={$amount}&cu=INR";

header('Content-Type: image/png');
echo (new QRCode)->render($upiString);
?>
```

**Option 2: Client-side JavaScript**
```html
<canvas id="qr-canvas"></canvas>

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
const amount = 500; // or get from form
const upiString = `upi://pay?pa=vefs@upi&pn=VEFS Foundation&am=${amount}&cu=INR`;

new QRCode(document.getElementById('qr-canvas'), {
  text: upiString,
  width: 256,
  height: 256
});
</script>
```

---

### 1.3 Bank Transfer Integration

**Method:** Display bank account details for NEFT/RTGS/IMPS transfer.

#### Implementation

**HTML:**
```html
<div class="payment-section">
  <h3>Bank Transfer / NEFT / RTGS</h3>

  <table class="bank-details-table">
    <tr>
      <th>Account Name:</th>
      <td>Valluvam Ecological Farming and Social Welfare Foundation</td>
    </tr>
    <tr>
      <th>Account Number:</th>
      <td class="highlight">1234567890</td>
    </tr>
    <tr>
      <th>IFSC Code:</th>
      <td class="highlight">SBIN0001234</td>
    </tr>
    <tr>
      <th>Bank Name:</th>
      <td>State Bank of India</td>
    </tr>
    <tr>
      <th>Branch:</th>
      <td>Chennai Main Branch</td>
    </tr>
    <tr>
      <th>Account Type:</th>
      <td>Current Account</td>
    </tr>
  </table>

  <div class="payment-steps">
    <h4>After Transfer:</h4>
    <ol>
      <li>Note the transaction reference number</li>
      <li>Send transaction details to <a href="mailto:payments@vefs.org">payments@vefs.org</a></li>
      <li>Include: Your name, amount, transaction date, reference number</li>
      <li>You will receive confirmation within 24 hours</li>
    </ol>
  </div>
</div>
```

**CSS:**
```css
.bank-details-table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-md) 0;
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.bank-details-table th,
.bank-details-table td {
  padding: var(--space-sm) var(--space-md);
  text-align: left;
  border-bottom: 1px solid var(--color-gray-200);
}

.bank-details-table th {
  background-color: var(--color-primary-pale);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  width: 40%;
}

.bank-details-table td.highlight {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}
```

---

### 1.4 Payment Gateway Integration (Razorpay)

**When to Use:** For automated payment processing, instant confirmation, refunds.

**Why Razorpay:**
- Indian payment gateway (supports UPI, cards, net banking, wallets)
- Easy integration
- Transparent pricing
- Good documentation

#### Setup Steps

**Step 1: Create Razorpay Account**
1. Sign up at https://razorpay.com
2. Complete KYC verification
3. Get API keys (Key ID and Secret)

**Step 2: Install Razorpay PHP Library**

If using Composer:
```bash
composer require razorpay/razorpay
```

Or download manually and include:
```php
require_once('path/to/Razorpay.php');
```

**Step 3: Create Payment Form**

**HTML:**
```html
<form id="razorpay-form">
  <input type="hidden" name="razorpay_payment_id" id="razorpay_payment_id">

  <div class="payment-summary">
    <h3>Payment Summary</h3>
    <p><strong>Event:</strong> Organic Farming Workshop</p>
    <p><strong>Amount:</strong> ₹500</p>
  </div>

  <button type="button" id="pay-button" class="btn btn-primary btn-lg btn-block">
    Pay ₹500 Now
  </button>
</form>

<div id="payment-success" style="display: none;">
  <div class="alert alert-success">
    <h3>Payment Successful!</h3>
    <p>Your payment has been received. You will receive a confirmation email shortly.</p>
    <p><strong>Payment ID:</strong> <span id="success-payment-id"></span></p>
  </div>
</div>
```

**JavaScript (Razorpay Checkout):**
```javascript
// Load Razorpay script
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
document.head.appendChild(script);

// Payment button click
document.getElementById('pay-button').addEventListener('click', function() {
  const options = {
    key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your key
    amount: 50000, // Amount in paise (₹500 = 50000 paise)
    currency: 'INR',
    name: 'VEFS Foundation',
    description: 'Event Registration - Organic Farming Workshop',
    image: 'https://vefs.org/images/logo/vefs-logo.png',
    handler: function(response) {
      // Payment successful
      document.getElementById('razorpay_payment_id').value = response.razorpay_payment_id;
      document.getElementById('success-payment-id').textContent = response.razorpay_payment_id;

      // Show success message
      document.getElementById('razorpay-form').style.display = 'none';
      document.getElementById('payment-success').style.display = 'block';

      // Send payment ID to server for verification
      verifyPayment(response.razorpay_payment_id);
    },
    prefill: {
      name: 'User Name',
      email: 'user@email.com',
      contact: '9876543210'
    },
    theme: {
      color: '#6B8E23' // VEFS primary color
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});

// Verify payment on server
function verifyPayment(paymentId) {
  fetch('/forms/verify-payment.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_id: paymentId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Payment verified');
      // Send confirmation email, update registration, etc.
    }
  });
}
```

**PHP (Server-side Verification):**

`/forms/verify-payment.php`:
```php
<?php
require_once('vendor/autoload.php');

use Razorpay\Api\Api;

// Razorpay credentials
$keyId = 'YOUR_RAZORPAY_KEY_ID';
$keySecret = 'YOUR_RAZORPAY_KEY_SECRET';

$api = new Api($keyId, $keySecret);

// Get payment ID from request
$data = json_decode(file_get_contents('php://input'), true);
$paymentId = $data['payment_id'];

try {
  // Fetch payment details
  $payment = $api->payment->fetch($paymentId);

  // Check payment status
  if ($payment->status === 'captured') {
    // Payment successful
    echo json_encode([
      'success' => true,
      'amount' => $payment->amount / 100, // Convert paise to rupees
      'currency' => $payment->currency,
      'email' => $payment->email
    ]);

    // TODO: Update registration status, send confirmation email
  } else {
    echo json_encode(['success' => false, 'error' => 'Payment not captured']);
  }
} catch (Exception $e) {
  echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
```

**Security Note:** NEVER expose your Razorpay Key Secret on client-side. Only use Key ID in JavaScript.

---

## 2. Analytics Integration

### 2.1 Google Analytics 4 (GA4)

**Purpose:** Track website traffic, user behavior, conversions.

#### Setup Steps

**Step 1: Create GA4 Property**
1. Sign in to https://analytics.google.com
2. Create new GA4 property
3. Get Measurement ID (format: G-XXXXXXXXXX)

**Step 2: Install Tracking Code**

Add to `<head>` of every page:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Step 3: Event Tracking**

**Track Registration Submissions:**
```javascript
// After successful registration
gtag('event', 'registration', {
  'event_category': 'Form',
  'event_label': 'Event Registration',
  'value': 'evt-025'
});
```

**Track Donation Clicks:**
```javascript
// Donate button click
document.getElementById('donate-btn').addEventListener('click', function() {
  gtag('event', 'click', {
    'event_category': 'Donation',
    'event_label': 'Donate Button Click'
  });
});
```

**Track Outbound Links:**
```javascript
// Social media clicks
document.querySelectorAll('a[href^="http"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const url = this.href;
    if (!url.includes(window.location.hostname)) {
      gtag('event', 'click', {
        'event_category': 'Outbound Link',
        'event_label': url
      });
    }
  });
});
```

**Track Downloads:**
```javascript
// PDF downloads
document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
  link.addEventListener('click', function() {
    gtag('event', 'download', {
      'event_category': 'File Download',
      'event_label': this.href
    });
  });
});
```

#### Key Metrics to Track

- Page views
- User sessions
- Event registrations (conversions)
- Donation form submissions (conversions)
- Contact form submissions
- Time on page
- Bounce rate
- Traffic sources (organic, social, direct)

---

### 2.2 Facebook Pixel (Optional)

**Purpose:** Track Facebook ad conversions, create custom audiences.

#### Setup

**Step 1: Create Facebook Pixel**
1. Go to Facebook Events Manager
2. Create Pixel
3. Get Pixel ID

**Step 2: Install Base Code**

Add to `<head>` of every page:

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
```

**Step 3: Track Conversions**

```javascript
// Track registration
fbq('track', 'CompleteRegistration', {
  content_name: 'Event Registration',
  value: 500,
  currency: 'INR'
});

// Track donation
fbq('track', 'Donate', {
  value: 1000,
  currency: 'INR'
});
```

---

## 3. Social Media Integration

### 3.1 Social Sharing Buttons

**Purpose:** Allow users to share pages/events on social media.

#### Implementation

**HTML:**
```html
<div class="social-share">
  <h4>Share This Event:</h4>
  <div class="social-share-buttons">
    <a href="#" class="social-share-btn social-share-facebook" data-share="facebook">
      <svg class="icon"><!-- Facebook icon --></svg>
      Facebook
    </a>
    <a href="#" class="social-share-btn social-share-twitter" data-share="twitter">
      <svg class="icon"><!-- Twitter icon --></svg>
      Twitter
    </a>
    <a href="#" class="social-share-btn social-share-whatsapp" data-share="whatsapp">
      <svg class="icon"><!-- WhatsApp icon --></svg>
      WhatsApp
    </a>
    <a href="#" class="social-share-btn social-share-linkedin" data-share="linkedin">
      <svg class="icon"><!-- LinkedIn icon --></svg>
      LinkedIn
    </a>
  </div>
</div>
```

**JavaScript:**
```javascript
// Social sharing
document.querySelectorAll('[data-share]').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();

    const platform = this.getAttribute('data-share');
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');

    let shareUrl;

    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    window.open(shareUrl, 'share', 'width=600,height=400');

    // Track share event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        'event_category': 'Social',
        'event_label': platform
      });
    }
  });
});
```

**CSS:**
```css
.social-share-buttons {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.social-share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  color: var(--color-white);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: transform var(--transition-fast);
}

.social-share-btn:hover {
  transform: translateY(-2px);
}

.social-share-facebook { background-color: #1877F2; }
.social-share-twitter { background-color: #1DA1F2; }
.social-share-whatsapp { background-color: #25D366; }
.social-share-linkedin { background-color: #0A66C2; }
```

---

### 3.2 Social Media Links (Footer)

**HTML:**
```html
<div class="social-media-links">
  <a href="https://facebook.com/vefsfoundation" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
    <svg class="icon"><!-- Facebook icon --></svg>
  </a>
  <a href="https://twitter.com/vefsfoundation" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
    <svg class="icon"><!-- Twitter icon --></svg>
  </a>
  <a href="https://instagram.com/vefsfoundation" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    <svg class="icon"><!-- Instagram icon --></svg>
  </a>
  <a href="https://youtube.com/@vefsfoundation" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
    <svg class="icon"><!-- YouTube icon --></svg>
  </a>
</div>
```

**Security Note:** Always use `rel="noopener noreferrer"` on external links.

---

### 3.3 Social Media Feed Embed (Optional)

**Facebook Page Plugin:**

```html
<div class="facebook-feed">
  <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fvefsfoundation&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
    width="340"
    height="500"
    style="border:none;overflow:hidden"
    scrolling="no"
    frameborder="0"
    allowfullscreen="true"
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
  </iframe>
</div>
```

**Instagram Feed:**

Use third-party services like:
- Elfsight Instagram Feed
- Instagram Feed by 10Web
- Embed Instagram (https://embedsocial.com/)

---

## 4. Google Maps Integration

### 4.1 Embedded Map (Contact Page)

**Purpose:** Show VEFS office location on contact page.

#### Implementation

**Step 1: Get Embed Code**
1. Go to https://www.google.com/maps
2. Search for your location
3. Click "Share" → "Embed a map"
4. Copy iframe code

**Step 2: Add to Contact Page**

**HTML:**
```html
<div class="map-container">
  <h3>Visit Us</h3>
  <div class="map-wrapper">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.1234567890!2d80.1234567!3d13.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA3JzI0LjQiTiA4MMKwMDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
      width="600"
      height="450"
      style="border:0;"
      allowfullscreen=""
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  </div>
  <div class="map-details">
    <p><strong>Address:</strong> 123 Main Street, Chennai, Tamil Nadu 600001</p>
    <p><a href="https://goo.gl/maps/YOUR_SHORT_LINK" target="_blank" class="btn btn-outline">Get Directions</a></p>
  </div>
</div>
```

**CSS:**
```css
.map-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.map-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .map-wrapper {
    padding-bottom: 75%; /* Taller on mobile */
  }
}
```

**Accessibility:**
- Provide text address alongside map
- Include "Get Directions" link
- Use `loading="lazy"` for performance

---

### 4.2 Google Maps API (Advanced - Optional)

For custom markers, styling, or interactive features:

**Step 1: Get API Key**
1. Go to https://console.cloud.google.com/
2. Enable Maps JavaScript API
3. Create API key
4. Restrict key to your domain

**Step 2: Add Custom Map**

**HTML:**
```html
<div id="custom-map" style="width: 100%; height: 450px;"></div>
```

**JavaScript:**
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
<script>
function initMap() {
  const location = { lat: 13.0827, lng: 80.2707 }; // Chennai coordinates

  const map = new google.maps.Map(document.getElementById('custom-map'), {
    zoom: 15,
    center: location,
    styles: [ /* Custom map styling */ ]
  });

  const marker = new google.maps.Marker({
    position: location,
    map: map,
    title: 'VEFS Foundation Office',
    icon: '/images/icons/map-marker.png' // Custom marker icon
  });

  const infoWindow = new google.maps.InfoWindow({
    content: '<div class="map-info-window"><h4>VEFS Foundation</h4><p>123 Main Street<br>Chennai, Tamil Nadu 600001</p></div>'
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

// Initialize map on page load
google.maps.event.addDomListener(window, 'load', initMap);
</script>
```

**Note:** Google Maps API has usage limits and may require billing setup. For simple embed, use iframe method (Section 4.1).

---

## 5. Integration Testing Checklist

### 5.1 Payment Integration

- [ ] UPI QR code scannable
- [ ] UPI ID displays correctly
- [ ] Bank details accurate
- [ ] Payment instructions clear
- [ ] Payment confirmation email sent
- [ ] Razorpay (if used) processes payments
- [ ] Razorpay webhooks configured

### 5.2 Analytics Integration

- [ ] Google Analytics tracking code installed
- [ ] Page views tracked
- [ ] Events tracked (registrations, donations)
- [ ] Conversion goals configured
- [ ] Real-time data showing in GA dashboard
- [ ] Facebook Pixel (if used) tracking

### 5.3 Social Media Integration

- [ ] Social share buttons work
- [ ] Correct URL and title shared
- [ ] Social media icons link to correct profiles
- [ ] Social media feeds display (if embedded)
- [ ] Open Graph tags present for rich previews

### 5.4 Maps Integration

- [ ] Map loads on contact page
- [ ] Location marker correct
- [ ] "Get Directions" link works
- [ ] Map responsive on mobile
- [ ] Lazy loading implemented

---

## 6. Troubleshooting

### 6.1 Payment Issues

**QR Code Not Scanning:**
- Check QR code image quality (min 250x250px)
- Verify UPI string format correct
- Test with different UPI apps
- Regenerate QR code if corrupted

**Razorpay Payment Fails:**
- Check API keys correct (Key ID, not Secret)
- Verify amount in paise (₹500 = 50000 paise)
- Check browser console for errors
- Test in Razorpay test mode first

### 6.2 Analytics Issues

**Google Analytics Not Tracking:**
- Check Measurement ID correct (G-XXXXXXXXXX)
- Wait 24-48 hours for data to appear
- Use "Real-time" report for immediate verification
- Check browser ad-blockers disabled
- Verify script loaded (check Network tab in DevTools)

**Events Not Tracking:**
- Check event syntax correct
- Verify gtag function available
- Test in browser console: `gtag('event', 'test')`
- Check GA4 Events report (may take hours to appear)

### 6.3 Maps Issues

**Map Not Loading:**
- Check internet connection
- Verify iframe src URL correct
- Check Content Security Policy allows Google Maps
- Try different browser
- Check browser console for errors

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-24 | Initial documentation | Requirements Team |

---

**End of Document**
