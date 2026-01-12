# Deployment Checklist - VEFS Website Forms Integration

## ✅ What's Complete

### Google Sheets Setup
- [x] Google Apps Script created and deployed
- [x] Google Sheet created with 5 tabs:
  - [x] Contact Inquiries
  - [x] Event Registrations
  - [x] Training Registrations
  - [x] Volunteer Applications
  - [x] Donation Records

### Frontend JavaScript Files
- [x] `contact.js` - Updated with Apps Script URL
- [x] `events.js` - Updated with Apps Script URL
- [x] `trainings.js` - Updated with Apps Script URL
- [x] `volunteers.js` - Updated with Apps Script URL
- [x] `donate.js` - Updated with Apps Script URL

### Apps Script Handlers
- [x] Contact form handler with email templates
- [x] Event registration handler with email templates
- [x] Training registration handler with email templates
- [x] Volunteer application handler with email templates
- [x] Donation handler with email templates (includes payment instructions)

### Configuration
- [x] Email templates configured with correct website URL (https://vefsfoundation.com/)
- [x] Admin email set to vefsfoundation@gmail.com
- [x] All form types route through single Apps Script URL

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

**Updated JavaScript Files (REQUIRED):**
```
VEFS-website/js/
├── contact.js (UPDATED - contains Google Script URL)
├── events.js (UPDATED - contains Google Script URL)
├── trainings.js (UPDATED - contains Google Script URL)
├── volunteers.js (UPDATED - contains Google Script URL)
└── donate.js (UPDATED - contains Google Script URL)
```

**HTML Pages (Verify these exist):**
```
VEFS-website/
├── contact.html
├── events.html
├── trainings.html
├── volunteer.html
└── donate.html
```

**Note**: All 5 JavaScript files must have the **same Google Apps Script URL** configured.

### Step 3: Test ALL Forms on Live Website

Test each form type to ensure complete integration. Use your real email for testing to verify email delivery.

#### ✅ Test 1: Contact Form

1. Go to `https://vefsfoundation.com/contact.html`
2. Fill out the contact form:
   - Name: `Test User`
   - Email: `your-email@example.com`
   - Phone: `9876543210`
   - Inquiry Type: Select any option
   - Message: Enter a test message
3. Click **Send Message**
4. **Verify:**
   - [ ] Success message appears on page
   - [ ] New row appears in Google Sheet → "Contact Inquiries" tab
   - [ ] Admin email received at vefsfoundation@gmail.com
   - [ ] User confirmation email received at your email
   - [ ] All form data is correct in the sheet

#### ✅ Test 2: Event Registration

1. Go to `https://vefsfoundation.com/events.html`
2. Click **Register** on any event (or use query param: `events.html#event-id`)
3. Fill out the registration form:
   - Name: `Test Participant`
   - Email: `your-email@example.com`
   - Phone: `9876543210`
   - Age: `25`
   - Attendees: `2`
4. Click **Register Now**
5. **Verify:**
   - [ ] Success modal appears
   - [ ] New row in "Event Registrations" tab
   - [ ] Admin email received with event details
   - [ ] User confirmation email with event details
   - [ ] Event ID, title, date, and fee are captured correctly

#### ✅ Test 3: Training Registration

1. Go to `https://vefsfoundation.com/trainings.html`
2. Click **Register** on any training program
3. Fill out the registration form:
   - Name: `Test Student`
   - Email: `your-email@example.com`
   - Phone: `9876543210`
   - Age: `30`
   - Education Level: Select any option
   - Occupation: `Software Engineer`
   - Background: `Interested in learning about sustainable farming practices and organic agriculture.`
4. Click **Submit Registration**
5. **Verify:**
   - [ ] Success modal appears
   - [ ] New row in "Training Registrations" tab
   - [ ] Admin email received with participant details
   - [ ] User confirmation email mentions training schedule
   - [ ] All education and background info captured

#### ✅ Test 4: Volunteer Application

1. Go to `https://vefsfoundation.com/volunteer.html`
2. Click **Apply Now** on any volunteer opportunity
3. Fill out the application form:
   - Name: `Test Volunteer`
   - Email: `your-email@example.com`
   - Phone: `9876543210`
   - Age: `28`
   - Motivation: `I am passionate about environmental conservation and want to contribute to tree planting initiatives.`
   - Experience: `Previous experience with community service and outdoor activities.`
4. Click **Submit Application**
5. **Verify:**
   - [ ] Success alert appears at top right
   - [ ] New row in "Volunteer Applications" tab
   - [ ] Admin email received with motivation and experience
   - [ ] User confirmation email received
   - [ ] Application stays on page for 3 seconds then modal closes

#### ✅ Test 5: Donation Form

1. Go to `https://vefsfoundation.com/donate.html`
2. Select a donation amount (e.g., ₹1000 or enter custom amount)
3. Fill out the donor information:
   - First Name: `Test`
   - Last Name: `Donor`
   - Email: `your-email@example.com`
   - Phone: `9876543210`
   - Select donation type (one-time/monthly)
   - Check options as desired (anonymous, newsletter, tax benefit)
4. Click **Proceed to Payment**
5. **Verify:**
   - [ ] Success message appears with payment instructions
   - [ ] New row in "Donation Records" tab
   - [ ] Admin email shows donation amount and donor info
   - [ ] User email includes UPI ID and bank transfer details
   - [ ] Tax benefit request captured if checked
   - [ ] Form is hidden and replaced with success message

### Step 4: Verify Data Integrity

After testing all forms, check the Google Sheet:

1. Open **VEFS Registration Database** in Google Sheets
2. Check each tab has **one test row**:
   - [ ] Contact Inquiries (1 row)
   - [ ] Event Registrations (1 row)
   - [ ] Training Registrations (1 row)
   - [ ] Volunteer Applications (1 row)
   - [ ] Donation Records (1 row)
3. Verify all columns are populated correctly
4. Check timestamps are in IST (Indian Standard Time)
5. **Optional**: Delete test rows or mark as "Test" in Notes column

### Step 5: Email Verification

Check your email inbox and vefsfoundation@gmail.com:

- [ ] Received **10 total emails** (2 per form × 5 forms)
- [ ] Admin emails have all form data
- [ ] User emails have personalized content
- [ ] All links in emails work correctly
- [ ] Email formatting looks good (not broken HTML)
- [ ] No emails in spam folder

## 🔧 Configuration Summary

### Google Apps Script URL
```
https://script.google.com/macros/s/AKfycbyw2vis0PY7STZ9yYqgHGyI0vxEkxH64c6-Ll31cj6qCU5_07QMQDHzwZc6H4NwMZJh/exec
```

This URL is configured in **ALL 5 JavaScript files**:
- `VEFS-website/js/contact.js` (line 7)
- `VEFS-website/js/events.js` (line 7)
- `VEFS-website/js/trainings.js` (line 7)
- `VEFS-website/js/volunteers.js` (line 7)
- `VEFS-website/js/donate.js` (line 7)

### Google Sheet Details
- **Sheet Name:** VEFS Registration Database
- **Admin Email:** vefsfoundation@gmail.com
- **Sheet Tabs:**
  1. Contact Inquiries
  2. Event Registrations
  3. Training Registrations
  4. Volunteer Applications
  5. Donation Records

### Email Templates (All Implemented)

| Form Type | Admin Email Subject | User Email Subject |
|-----------|---------------------|-------------------|
| Contact | 🔔 New Contact Form Submission | Thank you for contacting VEFS Foundation |
| Event | 🎉 New Event Registration | Event Registration Confirmed |
| Training | 📚 New Training Registration | Training Registration Confirmed |
| Volunteer | 🤝 New Volunteer Application | Thank you for volunteering |
| Donation | 💚 New Donation Received | Thank you for your donation |

**All email links point to:** `https://vefsfoundation.com/`

## 🚨 Troubleshooting

### Form shows success but no data in sheet
- **Check sheet tab names** - Must match exactly (case-sensitive):
  - Contact Inquiries
  - Event Registrations
  - Training Registrations
  - Volunteer Applications
  - Donation Records
- Check Apps Script execution logs (Extensions → Apps Script → Execution log)
- Ensure Apps Script is deployed with "Who has access: Anyone"
- Verify the `formType` parameter matches the handler

### No emails received
- Check spam/junk folder first
- Verify `ADMIN_EMAIL` in Apps Script (line 19)
- Check daily email quota (Gmail: 100/day, Workspace: 1,500/day)
- Check Apps Script logs for email errors
- Each form sends 2 emails (admin + user)

### Wrong data in wrong sheet tab
- Check browser console for the `formType` value being sent
- Should be: `contact`, `event`, `training`, `volunteer`, or `donation`
- Verify the switch statement in Apps Script `doPost()` function

### Form validation errors
- **Events**: Check age requirements in `events.json` file
- **Trainings**: Background field needs minimum 20 characters
- **Volunteer**: Check age requirements in `volunteers.json` file
- **Donation**: Minimum ₹100 required

### CORS errors in browser console
- This is expected with `mode: 'no-cors'` setting
- Forms still work correctly despite CORS warning
- Data is sent successfully to Google Sheets

## 📊 Expected Behavior on Live Site

### Contact Form
1. User fills form → Click "Send Message"
2. Button shows spinner: "Sending..."
3. Success message: "✓ Message Sent Successfully!"
4. Form clears automatically
5. Data saved to "Contact Inquiries" tab
6. 2 emails sent (admin + user)

### Event Registration
1. User clicks "Register" on event → Modal opens
2. Fill registration form → Click "Register Now"
3. Success modal appears with checkmark ✓
4. Form resets, registration modal stays open briefly
5. Data saved to "Event Registrations" tab
6. 2 emails sent with event details

### Training Registration
1. User clicks "Register" on training → Modal opens
2. Fill detailed form (education, background, etc.)
3. Success modal with checkmark ✓
4. Data saved to "Training Registrations" tab
5. 2 emails sent with next steps

### Volunteer Application
1. User clicks "Apply Now" → Modal opens
2. Fill motivation and experience fields
3. Success alert appears (top right, green)
4. Alert auto-dismisses after 8 seconds
5. Data saved to "Volunteer Applications" tab
6. 2 emails sent

### Donation Form
1. User selects amount → Fill donor info
2. Click "Proceed to Payment"
3. Form hidden, success message with payment instructions appears
4. Instructions include UPI ID and bank details
5. Data saved to "Donation Records" tab
6. 2 emails sent (user email includes payment details)

### Email Quota (All Forms Combined)
- Each submission sends 2 emails (admin + user)
- **Gmail free account**: ~50 submissions/day total
- **Google Workspace**: ~750 submissions/day total
- Typical usage: 20-30 submissions/day across all forms

## 🎯 Next Steps After Deployment

### Immediate (Within 24 hours)
1. ✅ Test all 5 forms on live site
2. ✅ Verify data appears in correct sheet tabs
3. ✅ Confirm emails delivering to vefsfoundation@gmail.com
4. ✅ Check spam folder for emails
5. ✅ Delete or mark test submissions in Google Sheet

### Ongoing Monitoring
1. **Daily**: Check Google Sheet for new submissions
2. **Daily**: Respond to inquiries and update Status columns
3. **Weekly**: Review email quota usage (if high traffic)
4. **Monthly**: Export Google Sheet as backup (.xlsx or CSV)
5. **As Needed**: Update Status column values:
   - `New` → `In Progress` → `Resolved` → `Closed`

### Data Management Best Practices
- Keep Status column updated for tracking
- Use Notes column for internal comments
- Filter by date range to find recent submissions
- Export monthly backups to local storage
- Archive old data after 1 year (optional)

## ✅ All Forms Implemented!

All 5 form types are now fully integrated:
- ✅ Contact Inquiries
- ✅ Event Registrations
- ✅ Training Registrations
- ✅ Volunteer Applications
- ✅ Donation Records

**Single Apps Script URL** handles all forms with automatic routing based on `formType`.

---

## 🚀 Ready to Deploy?

**Deployment Order:**
1. ✅ Update Apps Script (if needed)
2. ✅ Upload all 5 JavaScript files to Hostinger
3. ✅ Test each form thoroughly (use checklist above)
4. ✅ Verify data in Google Sheets
5. ✅ Confirm email delivery
6. ✅ Monitor for first 24 hours

**Questions or issues?** Check the [GOOGLE_SHEETS_SETUP_GUIDE.md](./GOOGLE_SHEETS_SETUP_GUIDE.md) for detailed troubleshooting.

---

**Status: Ready for Production Deployment** ✨
