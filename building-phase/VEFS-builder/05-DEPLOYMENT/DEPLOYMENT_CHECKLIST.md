# Deployment Checklist - Google Sheets Contact Form

## ✅ What's Complete

- [x] Google Apps Script created and deployed
- [x] Contact form JavaScript updated with Apps Script URL
- [x] Email templates configured with correct website URL (https://vefsfoundation.com/)
- [x] Test page created and tested successfully
- [x] Email notifications working (admin + user)
- [x] Data saving to Google Sheets confirmed

## 📤 Deployment Steps to Hostinger

### Step 1: Update Google Apps Script (IMPORTANT!)

Before deploying to Hostinger, you **MUST** update your deployed Apps Script with the latest code:

1. Open your Google Sheet "VEFS Registration Database"
2. Go to **Extensions** > **Apps Script**
3. **Replace all code** with the updated version from `GOOGLE_APPS_SCRIPT.js`
4. Click **Save** (💾)
5. Click **Deploy** > **Manage deployments**
6. Click the edit icon (✏️) next to your existing deployment
7. Under "Version", select **New version**
8. Add description: "Updated email links to vefsfoundation.com"
9. Click **Deploy**
10. Click **Done**

**What Changed:**
- Email links now point to `https://vefsfoundation.com/` instead of placeholder URLs

### Step 2: Upload Files to Hostinger

Upload the following files via FTP/File Manager:

**Files to Upload:**
```
VEFS-website/
├── contact.html (updated - already exists, just verify)
└── js/
    └── contact.js (UPDATED - contains Google Script URL)
```

**Optional (for testing):**
```
VEFS-website/
└── test-google-sheets.html (test page - can be deleted after testing)
```

### Step 3: Test on Live Website

1. Go to `https://vefsfoundation.com/contact.html`
2. Fill out the contact form with real data
3. Click "Send Message"
4. You should see: "✓ Message Sent Successfully!"
5. Verify:
   - New row appears in Google Sheet
   - Admin email received at vefsfoundation@gmail.com
   - User confirmation email received

### Step 4: Test with Test Page (Optional)

1. Upload `test-google-sheets.html` to Hostinger
2. Go to `https://vefsfoundation.com/test-google-sheets.html`
3. Click "Send Test Submission"
4. Verify success message
5. Check Google Sheet and emails
6. **Delete the test page** after confirming it works

### Step 5: Clean Up

After successful testing:
- Delete `test-google-sheets.html` from Hostinger
- Keep local copy for future testing if needed

## 🔧 Configuration Summary

### Google Apps Script URL
```
https://script.google.com/macros/s/AKfycbyw2vis0PY7STZ9yYqgHGyI0vxEkxH64c6-Ll31cj6qCU5_07QMQDHzwZc6H4NwMZJh/exec
```

This URL is already configured in:
- `VEFS-website/js/contact.js` (line 8)
- `VEFS-website/test-google-sheets.html` (line 99)

### Google Sheet Details
- **Sheet Name:** VEFS Registration Database
- **Tab Name:** Contact Inquiries
- **Admin Email:** vefsfoundation@gmail.com

### Email Templates
- **Admin Subject:** 🔔 New Contact Form Submission - VEFS Foundation
- **User Subject:** Thank you for contacting VEFS Foundation
- **Website Links:** All point to https://vefsfoundation.com/

## 🚨 Troubleshooting

### Form shows success but no data in sheet
- Check Apps Script execution logs
- Verify sheet tab name is exactly "Contact Inquiries"
- Ensure Apps Script is deployed with "Who has access: Anyone"

### No emails received
- Check spam/junk folder
- Verify ADMIN_EMAIL in Apps Script (line 25)
- Check daily email quota (Gmail: 100/day, Workspace: 1,500/day)

### CORS errors in browser console
- This is expected behavior during local development
- Will work fine on live Hostinger site
- Test with the test page on Hostinger to verify

## 📊 Expected Behavior on Live Site

### Successful Submission
1. User fills out contact form
2. Clicks "Send Message"
3. Button shows "Sending..." with spinner
4. Success message appears: "✓ Message Sent Successfully!"
5. Form is cleared
6. Data is saved to Google Sheet
7. Two emails are sent (admin + user)

### Email Quota
- Each submission sends 2 emails (admin + user)
- Gmail free account: ~50 submissions/day
- Google Workspace: ~750 submissions/day

## 🎯 Next Steps After Deployment

1. **Test thoroughly** on live site
2. **Monitor** Google Sheet for submissions
3. **Check email** notifications are arriving
4. **Update status** in Google Sheet after responding to inquiries
5. **Export data** periodically as backup

## 🔜 Future Enhancements

The same pattern can be used for:
- Event Registration forms
- Training Registration forms
- Volunteer Application forms
- Donation forms

Just add new sheet tabs and update the Apps Script with new form handlers!

---

**Ready to deploy? Follow Step 1 first, then upload files and test!**
