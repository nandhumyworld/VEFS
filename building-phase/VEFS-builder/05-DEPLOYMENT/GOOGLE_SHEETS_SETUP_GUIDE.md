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

### Step 2: Create Sheet Tab for Contact Form

1. Rename the first sheet tab to: **Contact Inquiries**
2. Add the following headers in Row 1:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Inquiry Type`
   - F1: `Message`
   - G1: `Status`

3. (Optional) Format the header row:
   - Select Row 1
   - Bold text
   - Background color: #6B8E23 (VEFS green)
   - Text color: White

**Your sheet should look like this:**

```
| Timestamp | Name | Email | Phone | Inquiry Type | Message | Status |
|-----------|------|-------|-------|--------------|---------|--------|
```

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

1. Open `VEFS-website/js/contact.js`
2. Find line 8:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL you copied
4. Example:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
   ```
5. Save the file

---

## Testing the Setup

### Test Locally (Before Deployment)

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
   - ✅ Open your Google Sheet - a new row should appear with the test data
   - ✅ Check your email inbox - you should receive 2 emails:
     - Admin notification (to vefsfoundation@gmail.com)
     - User confirmation (to the email you entered in the form)

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

## Future Expansion

This same setup can handle **all form types**:
- ✅ Contact Inquiries (already implemented)
- 🔜 Event Registrations
- 🔜 Training Registrations
- 🔜 Volunteer Applications
- 🔜 Donation Records

To add more forms later:
1. Create new sheet tabs (e.g., "Events Registration", "Training Registration")
2. The Apps Script already has placeholders for these (commented out)
3. Uncomment and customize the handlers in `GOOGLE_APPS_SCRIPT.js`
4. No need to redeploy - changes are automatic!

---

## Troubleshooting

### Form submits but no data in sheet
- Check that the sheet tab name is exactly **Contact Inquiries** (case-sensitive)
- Verify the Apps Script is deployed with "Who has access: Anyone"
- Check Apps Script logs: In editor, click **Execution log** icon

### No email notifications
- Check spam/junk folder
- Verify `ADMIN_EMAIL` is set correctly in the script (line 19)
- Check daily email quota (Gmail free: 100/day, Google Workspace: 1,500/day)

### Form shows error message
- Open browser console (F12) to see error details
- Check that `GOOGLE_SCRIPT_URL` is set correctly in `contact.js`
- Try redeploying the Apps Script as a new version

### "Authorization required" error
- Redeploy the web app
- Make sure "Execute as: Me" is selected
- Complete the authorization flow again

---

## Email Quota Limits

Google Apps Script email quotas per day:
- **Gmail free account**: 100 emails/day
- **Google Workspace**: 1,500 emails/day

Each form submission sends **2 emails** (admin + user), so:
- Free account: ~50 form submissions/day
- Workspace: ~750 form submissions/day

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
