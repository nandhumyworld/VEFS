# Google Sheets Integration Setup Guide

This guide explains how to set up Google Sheets to receive form submissions from the VEFS website.

## Why Google Sheets?

- ✅ **Simple**: No PHP, no database, no complex authentication
- ✅ **Free**: Works with any Google account
- ✅ **Email Notifications**: Automatically sends emails to admin and users
- ✅ **Easy Data Management**: View, filter, export data directly in Google Sheets
- ✅ **Works with Static Hosting**: Perfect for Hostinger static hosting

---

## Step-by-Step Setup Instructions

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Rename it to: **VEFS Registration Database**

### Step 2: Create Sheet Tabs for All Forms

You need to create **5 sheet tabs** for all form types. Follow these steps for each:

#### Sheet Tab 1: Contact Inquiries

1. Rename the first sheet tab to: **Contact Inquiries**
2. Add the following headers in Row 1:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Inquiry Type`
   - F1: `Message`
   - G1: `Status`

#### Sheet Tab 2: Event Registrations

1. Click the **+** button at the bottom to add a new sheet tab
2. Rename it to: **Event Registrations**
3. Add the following headers in Row 1:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Age`
   - F1: `Attendees`
   - G1: `Event ID`
   - H1: `Event Title`
   - I1: `Event Date`
   - J1: `Event Fee`
   - K1: `Status`
   - L1: `Notes`

#### Sheet Tab 3: Training Registrations

1. Add a new sheet tab
2. Rename it to: **Training Registrations**
3. Add the following headers in Row 1:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Age`
   - F1: `Education Level`
   - G1: `Occupation`
   - H1: `Background/Experience`
   - I1: `Training ID`
   - J1: `Training Title`
   - K1: `Training Date`
   - L1: `Fee`
   - M1: `Status`
   - N1: `Notes`

#### Sheet Tab 4: Volunteer Applications

1. Add a new sheet tab
2. Rename it to: **Volunteer Applications**
3. Add the following headers in Row 1:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Age`
   - F1: `Motivation`
   - G1: `Skills/Experience`
   - H1: `Volunteer ID`
   - I1: `Volunteer Title`
   - J1: `Status`
   - K1: `Notes`

#### Sheet Tab 5: Donation Records

1. Add a new sheet tab
2. Rename it to: **Donation Records**
3. Add the following headers in Row 1:
   - A1: `Timestamp`
   - B1: `First Name`
   - C1: `Last Name`
   - D1: `Email`
   - E1: `Phone`
   - F1: `Organization`
   - G1: `Amount`
   - H1: `Type (one-time/monthly)`
   - I1: `Category`
   - J1: `Anonymous`
   - K1: `Newsletter`
   - L1: `Tax Benefit`
   - M1: `Status`
   - N1: `Payment Method`
   - O1: `Notes`

#### Format All Header Rows (Optional but Recommended)

For each sheet tab:
1. Select Row 1
2. Apply formatting:
   - **Bold text**
   - **Background color**: #6B8E23 (VEFS green)
   - **Text color**: White
   - **Font size**: 11pt

### Step 3: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. You'll see a code editor with a default function
3. **Delete all the default code**

### Step 4: Add the Form Handler Script

1. Open the file `GOOGLE_APPS_SCRIPT.js` from the project root
2. **Copy the entire contents** of that file
3. **Paste it** into the Apps Script editor
4. **Update the admin email** on line 19:
   ```javascript
   ADMIN_EMAIL: 'vefsfoundation@gmail.com',  // Change this to your email
   ```
5. Click the **Save** icon (💾) or press `Ctrl+S`
6. Name your project: **VEFS Form Handler**

### Step 5: Deploy as Web App

1. In the Apps Script editor, click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: `VEFS Contact Form Handler`
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. You may need to authorize the app:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to VEFS Form Handler (unsafe)**
   - Click **Allow**
7. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```

### Step 6: Configure the Website

The Google Apps Script URL needs to be configured in **5 JavaScript files**:

1. **Contact Form**: Open `VEFS-website/js/contact.js`
   - Find line 7: `const GOOGLE_SCRIPT_URL = '...'`
   - Replace with your Web App URL

2. **Events Page**: Open `VEFS-website/js/events.js`
   - Find line 7: `const GOOGLE_SCRIPT_URL = '...'`
   - Replace with your Web App URL

3. **Trainings Page**: Open `VEFS-website/js/trainings.js`
   - Find line 7: `const GOOGLE_SCRIPT_URL = '...'`
   - Replace with your Web App URL

4. **Volunteer Page**: Open `VEFS-website/js/volunteers.js`
   - Find line 7: `const GOOGLE_SCRIPT_URL = '...'`
   - Replace with your Web App URL

5. **Donation Page**: Open `VEFS-website/js/donate.js`
   - Find line 7: `const GOOGLE_SCRIPT_URL = '...'`
   - Replace with your Web App URL

**All files should have the same URL:**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

**Note**: It's the same URL for all forms - the Google Apps Script automatically routes to the correct handler based on the `formType` parameter.

---

## Testing the Setup

### Test All Forms (Before Deployment)

You should test **each form type** to ensure everything is working correctly.

#### Test 1: Contact Form

1. Open `VEFS-website/contact.html` in your browser
2. Fill out the contact form with test data:
   - Name: `Test User`
   - Email: `yourpersonal@email.com` (use your real email for testing)
   - Phone: `9876543210`
   - Inquiry Type: `Program Information`
   - Message: `This is a test submission to verify the Google Sheets integration is working.`
3. Click **Send Message**
4. Check for success:
   - ✅ You should see a success message on the page
   - ✅ Open your Google Sheet → **Contact Inquiries** tab - a new row should appear
   - ✅ Check your email inbox - you should receive 2 emails:
     - Admin notification (to vefsfoundation@gmail.com)
     - User confirmation (to the email you entered in the form)

#### Test 2: Event Registration

1. Open `VEFS-website/events.html` in your browser
2. Click **Register** on any event
3. Fill out the registration form:
   - Name: `Test Participant`
   - Email: `yourpersonal@email.com`
   - Phone: `9876543210`
   - Age: `25`
   - Attendees: `1`
4. Click **Register Now**
5. Check for success:
   - ✅ Success modal should appear
   - ✅ Check Google Sheet → **Event Registrations** tab
   - ✅ Check email inbox for 2 emails (admin + user confirmation)

#### Test 3: Training Registration

1. Open `VEFS-website/trainings.html` in your browser
2. Click **Register** on any training program
3. Fill out the registration form:
   - Name: `Test Student`
   - Email: `yourpersonal@email.com`
   - Phone: `9876543210`
   - Age: `28`
   - Education Level: `Graduate`
   - Occupation: `Software Engineer`
   - Background: `Interested in sustainable farming practices...` (at least 20 chars)
4. Click **Submit Registration**
5. Check for success:
   - ✅ Success modal should appear
   - ✅ Check Google Sheet → **Training Registrations** tab
   - ✅ Check email inbox for 2 emails

#### Test 4: Volunteer Application

1. Open `VEFS-website/volunteer.html` in your browser
2. Click **Apply Now** on any volunteer opportunity
3. Fill out the application form:
   - Name: `Test Volunteer`
   - Email: `yourpersonal@email.com`
   - Phone: `9876543210`
   - Age: `22`
   - Motivation: `I want to contribute to environmental conservation...`
   - Experience: `Previous experience with tree planting...`
4. Click **Submit Application**
5. Check for success:
   - ✅ Success alert should appear
   - ✅ Check Google Sheet → **Volunteer Applications** tab
   - ✅ Check email inbox for 2 emails

#### Test 5: Donation Form

1. Open `VEFS-website/donate.html` in your browser
2. Select a donation amount (or enter custom amount)
3. Fill out the donor information:
   - First Name: `Test`
   - Last Name: `Donor`
   - Email: `yourpersonal@email.com`
   - Phone: `9876543210`
   - Select donation type and options
4. Click **Proceed to Payment**
5. Check for success:
   - ✅ Success message with payment instructions should appear
   - ✅ Check Google Sheet → **Donation Records** tab
   - ✅ Check email inbox for 2 emails (including payment instructions)

### Test Mode (If URL Not Configured)

If you haven't configured the Google Script URL yet:
- The form will work in "test mode"
- Form data will be logged to the browser console
- No data will be sent to Google Sheets
- No emails will be sent
- You'll see a console warning: `⚠️ Google Apps Script URL not configured`

To see the test data:
1. Open browser DevTools (F12)
2. Go to the **Console** tab
3. Submit the form
4. You'll see the form data logged

---

## How It Works

### Form Submission Flow

```
User fills form → JavaScript validates → POST to Google Apps Script →
Apps Script saves to Sheet → Sends emails → Returns success
```

### Email Notifications

**Admin Email** (sent to vefsfoundation@gmail.com):
- Subject: 🔔 New Contact Form Submission - VEFS Foundation
- Contains all form data in a formatted table
- Includes timestamp in IST (Indian Standard Time)

**User Confirmation Email** (sent to user's email):
- Subject: Thank you for contacting VEFS Foundation
- Thanks the user and confirms receipt
- Includes their original message
- Promises response within 24-48 hours
- Links to website pages (trainings, events, volunteer)

---

## Managing Submissions

### View All Submissions

1. Open your Google Sheet: **VEFS Registration Database**
2. Click the **Contact Inquiries** tab
3. All submissions are listed chronologically

### Filter/Sort Data

- Click **Data** > **Create a filter**
- Use dropdown arrows in headers to filter by:
  - Inquiry Type
  - Status
  - Date range

### Export Data

- Click **File** > **Download**
- Choose format: Excel (.xlsx), CSV, PDF

### Mark as Processed

- Update the **Status** column to:
  - `New` (default)
  - `In Progress`
  - `Resolved`
  - `Closed`

---

## All Forms Implemented

This setup handles **all form types** in the VEFS website:
- ✅ **Contact Inquiries** - Contact form submissions
- ✅ **Event Registrations** - Event registration with attendee count
- ✅ **Training Registrations** - Training program applications with detailed participant info
- ✅ **Volunteer Applications** - Volunteer opportunity applications with motivation
- ✅ **Donation Records** - Donation submissions with payment instructions

All forms use the **same Google Apps Script URL** and automatically route to the correct handler based on `formType`.

---

## Troubleshooting

### Form submits but no data in sheet
- **Check sheet tab names** - They must be EXACTLY:
  - `Contact Inquiries`
  - `Event Registrations`
  - `Training Registrations`
  - `Volunteer Applications`
  - `Donation Records`
  - (Case-sensitive and spelling matters!)
- Verify the Apps Script is deployed with "Who has access: Anyone"
- Check Apps Script logs: In editor, click **Execution log** icon (look for errors)

### No email notifications
- Check spam/junk folder
- Verify `ADMIN_EMAIL` is set correctly in the script (line 19)
- Check daily email quota (Gmail free: 100/day, Google Workspace: 1,500/day)
- Check Apps Script execution logs for email sending errors

### Form shows error message
- Open browser console (F12) to see error details
- Check that `GOOGLE_SCRIPT_URL` is set correctly in ALL JavaScript files:
  - `contact.js`
  - `events.js`
  - `trainings.js`
  - `volunteers.js`
  - `donate.js`
- Make sure the URL is the same in all files
- Try redeploying the Apps Script as a new version

### Data appears in wrong sheet tab
- Check the `formType` parameter in the payload
- Verify the handler functions in Apps Script match the form types:
  - `contact`, `event`, `training`, `volunteer`, `donation`

### "Authorization required" error
- Redeploy the web app
- Make sure "Execute as: Me" is selected
- Complete the authorization flow again

### Form-Specific Issues

**Event Registration:**
- Age validation: Check event requirements in `events.json`
- Attendee count: Must be between 1-10

**Training Registration:**
- Background field: Minimum 20 characters required
- Education dropdown: Must select a value

**Volunteer Application:**
- Age validation: Check volunteer requirements in `volunteers.json`
- Both motivation and experience fields are required

**Donation Form:**
- Minimum amount: ₹100
- Payment instructions appear in success message and user email

---

## Email Quota Limits

Google Apps Script email quotas per day:
- **Gmail free account**: 100 emails/day
- **Google Workspace**: 1,500 emails/day

Each form submission sends **2 emails** (admin notification + user confirmation), so:
- **Free account**: ~50 form submissions/day (total across all 5 forms)
- **Workspace**: ~750 form submissions/day (total across all 5 forms)

**Example breakdown for a typical day:**
- Contact form: 5 submissions = 10 emails
- Event registrations: 10 submissions = 20 emails
- Training registrations: 3 submissions = 6 emails
- Volunteer applications: 2 submissions = 4 emails
- Donations: 1 submission = 2 emails
- **Total**: 21 submissions = 42 emails ✅ Well within the 100/day free limit

This is more than enough for most NGO websites!

---

## Security Notes

- ✅ **No API keys** needed
- ✅ **No OAuth complexity**
- ✅ **Form data is private** (only you can access the Google Sheet)
- ✅ **HTTPS by default** (Google Apps Script URLs are always HTTPS)
- ⚠️ Anyone with the Web App URL can submit forms (this is intentional)
- ⚠️ No rate limiting (add if needed - contact for help)

---

## Support

If you need help:
1. Check the troubleshooting section above
2. Review the Apps Script execution logs
3. Test with browser console open to see errors
4. Verify all steps were followed exactly

---

**That's it! Your contact form is now connected to Google Sheets.** 🎉

Simple, free, and effective!
