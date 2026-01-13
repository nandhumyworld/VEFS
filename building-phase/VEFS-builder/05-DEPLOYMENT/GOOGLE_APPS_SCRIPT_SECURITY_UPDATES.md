# Google Apps Script Security Updates

## Summary of Changes

The GOOGLE_APPS_SCRIPT.js file has been updated with comprehensive security improvements and bug fixes.

---

## 1. ✅ HTML Injection Prevention (XSS Protection)

### Issue
User input was being directly embedded in HTML email templates without escaping, creating XSS vulnerabilities.

### Solution
Added `escapeHtml()` function that escapes all dangerous characters:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#039;`

### Updated Email Templates
All user-provided data is now escaped in:
- ✅ Contact form emails (admin + user)
- ✅ Event registration emails (admin + user)
- ✅ Training registration emails (admin + user)
- ✅ Volunteer application emails (admin + user)
- ✅ Donation emails (admin + user)

**Example:**
```javascript
// Before (UNSAFE)
<div class="value">${data.message.replace(/\n/g, '<br>')}</div>

// After (SAFE)
<div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
```

---

## 2. ✅ Backend Validation Functions

Added four validation functions to prevent invalid data submission:

### `isValidEmail(email)`
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Validates proper email format

### `isValidPhone(phone)`
- Accepts Indian phone format: 10 digits starting with 6-9
- Optional field (if provided, must be valid)
- Strips non-numeric characters before validation

### `isValidAge(age)`
- Accepts ages 13-100
- Optional field (if provided, must be valid)

### `isValidAmount(amount)`
- For donations: ₹1 to ₹100,000
- Prevents negative or unrealistic amounts
- Optional field

### Implementation
Enhanced `doPost()` function now validates:
```javascript
// Email validation
if (!isValidEmail(data.email)) {
  return createResponseWithCORS(false, 'Invalid email format');
}

// Phone validation
if (data.phone && !isValidPhone(data.phone)) {
  return createResponseWithCORS(false, 'Invalid phone number format');
}

// Age validation
if (data.age && !isValidAge(data.age)) {
  return createResponseWithCORS(false, 'Age must be between 13 and 100');
}

// Amount validation (donations only)
if (formType === 'donation' && data.amount && !isValidAmount(data.amount)) {
  return createResponseWithCORS(false, 'Donation amount must be between ₹1 and ₹100,000');
}
```

---

## 3. ✅ CORS Headers Implementation

### Issue
`createResponseWithCORS()` function was defined but didn't actually set CORS headers.

### Solution
Added proper CORS headers to the function:
```javascript
return ContentService
  .createTextOutput(JSON.stringify(response))
  .setMimeType(ContentService.MimeType.JSON)
  .addHeader('Access-Control-Allow-Origin', '*')
  .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  .addHeader('Access-Control-Allow-Headers', 'Content-Type');
```

**Note:** Frontend uses `no-cors` mode, so CORS headers are informational for other potential clients.

---

## 4. ✅ Payment Information Update

### Issue
Donation email had placeholder/incorrect payment details:
- `UPI ID: vefsfoundation@upi` (placeholder)
- `Bank: SBIN0001234` (incorrect)
- `Account: 1234567890` (placeholder)

### Solution
Updated with correct VEFS Foundation payment details:

**UPI Payment:**
- UPI ID: `9566667708@hdfcbank` ✅

**Bank Transfer:**
- Bank: `HDFC Bank`
- Account: `50200115917889`
- IFSC: `HDFC0002301`
- Branch: `Dindigul`

All values are properly escaped in email templates.

---

## 5. Additional Security Enhancements

### Number/Amount Escaping
All numeric fields are now escaped using `escapeHtml(String(value))`:
- Donation amounts
- Event fees
- Training fees
- Ages
- Attendee counts

### Email Safety
- All email addresses are escaped in `mailto:` links
- Phone numbers are escaped
- Names are escaped
- Organization names are escaped
- Donation types and categories are escaped

---

## Testing Recommendations

### 1. Email Validation
```javascript
// Valid
doPost({postData: {contents: JSON.stringify({
  formType: 'contact',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  inquiryType: 'General',
  message: 'Test message'
})}})

// Invalid email
email: 'invalid.email'  // Should be rejected

// Invalid phone
phone: '1234567890'  // Should be rejected (doesn't start with 6-9)
```

### 2. XSS Prevention
```javascript
// Malicious input (should be escaped, not executed)
name: '<img src=x onerror=alert("XSS")>'
message: '<script>alert("XSS")</script>'
```

All should be rendered as text, not executed.

### 3. Donation Amount Validation
```javascript
// Valid
amount: 5000  // ✓

// Invalid
amount: 0     // ✗ Must be > 0
amount: 150000  // ✗ Must be ≤ 100,000
amount: -1000  // ✗ Must be > 0
```

---

## Deployment Instructions

1. **Backup Current Script** - Before deploying, backup the current Google Apps Script
2. **Copy Updated Code** - Replace the entire contents of GOOGLE_APPS_SCRIPT.js with the updated version
3. **Deploy New Version** - Click Deploy > New deployment > Web app
4. **Test All Forms** - Test contact, event, training, volunteer, and donation forms
5. **Verify Emails** - Check that emails are being sent correctly with proper formatting
6. **Monitor Logs** - Watch the Apps Script execution logs for any errors

---

## Summary of Security Improvements

| Issue | Before | After | Impact |
|-------|--------|-------|--------|
| **XSS Vulnerability** | Raw HTML injection possible | All user input escaped | CRITICAL |
| **Invalid Email** | Accepted without validation | Email regex validation | HIGH |
| **Invalid Phone** | Any string accepted | Indian format validation | MEDIUM |
| **Invalid Age** | Any number accepted | 13-100 range validation | MEDIUM |
| **Invalid Amount** | Any number accepted | ₹1-₹100,000 range | HIGH |
| **Hardcoded Placeholders** | Fake payment info | Real bank details | HIGH |
| **Missing CORS Headers** | Not implemented | Proper CORS headers set | LOW |

---

## Questions or Issues?

If you encounter any issues during deployment:
1. Check the Google Apps Script execution logs
2. Verify all sheet tabs exist with correct names
3. Test with sample form data
4. Check email delivery logs in Gmail

For more details, see the original GOOGLE_APPS_SCRIPT.js file documentation.
