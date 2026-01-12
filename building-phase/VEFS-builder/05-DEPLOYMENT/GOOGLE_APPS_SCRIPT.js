/**
 * VEFS Foundation - Google Sheets Form Handler
 * This script receives form submissions and stores them in Google Sheets
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet named "VEFS Registration Database"
 * 2. Create a sheet tab named "Contact Inquiries" with these columns:
 *    A: Timestamp | B: Name | C: Email | D: Phone | E: Inquiry Type | F: Message | G: Status
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this entire script
 * 5. Click Deploy > New deployment > Web app
 * 6. Settings:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the Web App URL and paste it in contact.js (GOOGLE_SCRIPT_URL variable)
 * 8. Update ADMIN_EMAIL below with your email address
 */

// ===========================
// CONFIGURATION
// ===========================

const CONFIG = {
  // Your admin email to receive notifications
  ADMIN_EMAIL: 'vefsfoundation@gmail.com',

  // Sheet names for different form types
  SHEETS: {
    CONTACT: 'Contact Inquiries',
    EVENTS: 'Event Registrations',
    TRAININGS: 'Training Registrations',
    VOLUNTEER: 'Volunteer Applications',
    DONATION: 'Donation Records'
  },

  // Email subject templates
  EMAIL_SUBJECTS: {
    ADMIN_CONTACT: '🔔 New Contact Form Submission - VEFS Foundation',
    USER_CONTACT: 'Thank you for contacting VEFS Foundation',
    ADMIN_EVENT: '🎉 New Event Registration - VEFS Foundation',
    USER_EVENT: 'Event Registration Confirmed - VEFS Foundation',
    ADMIN_TRAINING: '📚 New Training Registration - VEFS Foundation',
    USER_TRAINING: 'Training Registration Confirmed - VEFS Foundation',
    ADMIN_VOLUNTEER: '🤝 New Volunteer Application - VEFS Foundation',
    USER_VOLUNTEER: 'Thank you for volunteering - VEFS Foundation',
    ADMIN_DONATION: '💚 New Donation Received - VEFS Foundation',
    USER_DONATION: 'Thank you for your donation - VEFS Foundation'
  }
};

// ===========================
// MAIN HANDLER
// ===========================

/**
 * Handle POST requests from contact form
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Determine which form type and process accordingly
    const formType = data.formType || 'contact'; // Default to contact form

    // Basic validation - all forms need at least name and email
    if (!data.name || !data.email) {
      return createResponseWithCORS(false, 'Missing required fields (name and email)');
    }

    switch (formType) {
      case 'contact':
        return handleContactForm(data);
      case 'event':
        return handleEventRegistration(data);
      case 'training':
        return handleTrainingRegistration(data);
      case 'volunteer':
        return handleVolunteerApplication(data);
      case 'donation':
        return handleDonation(data);
      default:
        return createResponseWithCORS(false, 'Invalid form type');
    }

  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponseWithCORS(false, 'Server error: ' + error.message);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    'VEFS Foundation Form Handler is running. Use POST method to submit forms.'
  );
}

// ===========================
// CONTACT FORM HANDLER
// ===========================

/**
 * Handle contact form submissions
 */
function handleContactForm(data) {
  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Get or create the Contact Inquiries sheet
    let sheet = ss.getSheetByName(CONFIG.SHEETS.CONTACT);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.CONTACT);
      // Add headers
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Inquiry Type', 'Message', 'Status']);
      sheet.getRange('A1:G1').setFontWeight('bold').setBackground('#6B8E23').setFontColor('#ffffff');
    }

    // Prepare row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name,
      data.email,
      data.phone || '',
      data.inquiryType,
      data.message,
      'New' // Status
    ];

    // Append to sheet
    sheet.appendRow(rowData);

    // Send email notifications
    sendAdminNotification(data, 'contact');
    sendUserConfirmation(data, 'contact');

    return createResponseWithCORS(true, 'Your message has been sent successfully!');

  } catch (error) {
    console.error('Error in handleContactForm:', error);
    return createResponseWithCORS(false, 'Failed to save your message: ' + error.message);
  }
}

// ===========================
// EVENT REGISTRATION HANDLER
// ===========================

/**
 * Handle event registration submissions
 */
function handleEventRegistration(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.EVENTS);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.EVENTS);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Age', 'Attendees', 'Event ID', 'Event Title', 'Event Date', 'Event Donation', 'Status', 'Notes']);
      sheet.getRange('A1:L1').setFontWeight('bold').setBackground('#6B8E23').setFontColor('#ffffff');
    }

    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name,
      data.email,
      data.phone || '',
      data.age || '',
      data.attendees || 1,
      data.eventId || '',
      data.eventTitle || '',
      data.eventDate || '',
      data.eventFee || 0,
      'New',
      ''
    ];

    sheet.appendRow(rowData);

    sendAdminNotification(data, 'event');
    sendUserConfirmation(data, 'event');

    return createResponseWithCORS(true, 'Event registration successful!');

  } catch (error) {
    console.error('Error in handleEventRegistration:', error);
    return createResponseWithCORS(false, 'Failed to save registration: ' + error.message);
  }
}

// ===========================
// TRAINING REGISTRATION HANDLER
// ===========================

/**
 * Handle training registration submissions
 */
function handleTrainingRegistration(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.TRAININGS);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.TRAININGS);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Age', 'Education Level', 'Occupation', 'Background/Experience', 'Training ID', 'Training Title', 'Training Date', 'Donation', 'Status', 'Notes']);
      sheet.getRange('A1:N1').setFontWeight('bold').setBackground('#6B8E23').setFontColor('#ffffff');
    }

    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name,
      data.email,
      data.phone || '',
      data.age || '',
      data.education || '',
      data.occupation || '',
      data.background || '',
      data.trainingId || '',
      data.trainingTitle || '',
      data.trainingDate || '',
      data.trainingFee || 0,
      'New',
      ''
    ];

    sheet.appendRow(rowData);

    sendAdminNotification(data, 'training');
    sendUserConfirmation(data, 'training');

    return createResponseWithCORS(true, 'Training registration successful!');

  } catch (error) {
    console.error('Error in handleTrainingRegistration:', error);
    return createResponseWithCORS(false, 'Failed to save registration: ' + error.message);
  }
}

// ===========================
// VOLUNTEER APPLICATION HANDLER
// ===========================

/**
 * Handle volunteer application submissions
 */
function handleVolunteerApplication(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.VOLUNTEER);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.VOLUNTEER);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Age', 'Motivation', 'Skills/Experience', 'Volunteer ID', 'Volunteer Title', 'Status', 'Notes']);
      sheet.getRange('A1:K1').setFontWeight('bold').setBackground('#6B8E23').setFontColor('#ffffff');
    }

    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name,
      data.email,
      data.phone || '',
      data.age || '',
      data.motivation || '',
      data.experience || '',
      data.volunteerId || '',
      data.volunteerTitle || '',
      'New',
      ''
    ];

    sheet.appendRow(rowData);

    sendAdminNotification(data, 'volunteer');
    sendUserConfirmation(data, 'volunteer');

    return createResponseWithCORS(true, 'Volunteer application submitted successfully!');

  } catch (error) {
    console.error('Error in handleVolunteerApplication:', error);
    return createResponseWithCORS(false, 'Failed to save application: ' + error.message);
  }
}

// ===========================
// DONATION HANDLER
// ===========================

/**
 * Handle donation form submissions
 */
function handleDonation(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.DONATION);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.DONATION);
      sheet.appendRow(['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Organization', 'Amount', 'Type', 'Category', 'Anonymous', 'Newsletter', 'Tax Benefit', 'Status', 'Payment Method', 'Notes']);
      sheet.getRange('A1:O1').setFontWeight('bold').setBackground('#6B8E23').setFontColor('#ffffff');
    }

    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.firstName || '',
      data.lastName || '',
      data.email,
      data.phone || '',
      data.organization || '',
      data.amount || 0,
      data.donationType || 'one-time',
      data.category || 'General Fund',
      data.anonymous ? 'Yes' : 'No',
      data.newsletter ? 'Yes' : 'No',
      data.taxBenefit ? 'Yes' : 'No',
      'Pending',
      'Manual',
      ''
    ];

    sheet.appendRow(rowData);

    sendAdminNotification(data, 'donation');
    sendUserConfirmation(data, 'donation');

    return createResponseWithCORS(true, 'Donation recorded successfully!');

  } catch (error) {
    console.error('Error in handleDonation:', error);
    return createResponseWithCORS(false, 'Failed to record donation: ' + error.message);
  }
}

// ===========================
// EMAIL FUNCTIONS
// ===========================

/**
 * Send notification email to admin
 */
function sendAdminNotification(data, formType) {
  try {
    let subject = '';
    let body = '';

    switch(formType) {
      case 'contact':
        subject = CONFIG.EMAIL_SUBJECTS.ADMIN_CONTACT;
        body = createAdminContactEmail(data);
        break;
      case 'event':
        subject = CONFIG.EMAIL_SUBJECTS.ADMIN_EVENT;
        body = createAdminEventEmail(data);
        break;
      case 'training':
        subject = CONFIG.EMAIL_SUBJECTS.ADMIN_TRAINING;
        body = createAdminTrainingEmail(data);
        break;
      case 'volunteer':
        subject = CONFIG.EMAIL_SUBJECTS.ADMIN_VOLUNTEER;
        body = createAdminVolunteerEmail(data);
        break;
      case 'donation':
        subject = CONFIG.EMAIL_SUBJECTS.ADMIN_DONATION;
        body = createAdminDonationEmail(data);
        break;
    }

    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: subject,
      htmlBody: body
    });

  } catch (error) {
    console.error('Error sending admin notification:', error);
    // Don't throw error - form submission should still succeed
  }
}

/**
 * Send confirmation email to user
 */
function sendUserConfirmation(data, formType) {
  try {
    let subject = '';
    let body = '';

    switch(formType) {
      case 'contact':
        subject = CONFIG.EMAIL_SUBJECTS.USER_CONTACT;
        body = createUserContactEmail(data);
        break;
      case 'event':
        subject = CONFIG.EMAIL_SUBJECTS.USER_EVENT;
        body = createUserEventEmail(data);
        break;
      case 'training':
        subject = CONFIG.EMAIL_SUBJECTS.USER_TRAINING;
        body = createUserTrainingEmail(data);
        break;
      case 'volunteer':
        subject = CONFIG.EMAIL_SUBJECTS.USER_VOLUNTEER;
        body = createUserVolunteerEmail(data);
        break;
      case 'donation':
        subject = CONFIG.EMAIL_SUBJECTS.USER_DONATION;
        body = createUserDonationEmail(data);
        break;
    }

    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      htmlBody: body
    });

  } catch (error) {
    console.error('Error sending user confirmation:', error);
    // Don't throw error - form submission should still succeed
  }
}

/**
 * Create admin notification email for contact form
 */
function createAdminContactEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6B8E23; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #6B8E23; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Contact Form Submission</h2>
        </div>

        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>

          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>

          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone || 'Not provided'}</div>
          </div>

          <div class="field">
            <div class="label">Inquiry Type:</div>
            <div class="value">${data.inquiryType}</div>
          </div>

          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>

          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification from VEFS Foundation website.</p>
          <p>Please respond to the inquiry within 24-48 hours.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Create user confirmation email for contact form
 */
function createUserContactEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #6B8E23; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .highlight { background: white; padding: 15px; border-left: 4px solid #D4A574; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Contacting Us!</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">VEFS Foundation</p>
        </div>

        <div class="content">
          <p>Dear ${data.name},</p>

          <p>Thank you for reaching out to VEFS Foundation. We have received your inquiry regarding <strong>${data.inquiryType}</strong>.</p>

          <div class="highlight">
            <strong>Your Message:</strong><br>
            ${data.message.replace(/\n/g, '<br>')}
          </div>

          <p>Our team will review your message and get back to you within 24-48 hours via email at <strong>${data.email}</strong>${data.phone ? ' or phone at <strong>' + data.phone + '</strong>' : ''}.</p>

          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Explore our <a href="https://vefsfoundation.com/trainings.html" style="color: #6B8E23;">Training Programs</a></li>
            <li>Check out upcoming <a href="https://vefsfoundation.com/events.html" style="color: #6B8E23;">Events</a></li>
            <li>Learn about <a href="https://vefsfoundation.com/volunteer.html" style="color: #6B8E23;">Volunteer Opportunities</a></li>
          </ul>

          <p style="text-align: center;">
            <a href="https://vefsfoundation.com" class="button">Visit Our Website</a>
          </p>

          <p style="margin-top: 30px;">Best regards,<br>
          <strong>VEFS Foundation Team</strong><br>
          Valluvam Ecological Farming and Social Welfare Foundation</p>
        </div>

        <div class="footer">
          <p><strong>Contact Us:</strong></p>
          <p>Email: vefsfoundation@gmail.com | Phone: +91 95666 67708</p>
          <p>Nilakottai, Dindigul, Tamil Nadu - 624211</p>
          <p style="margin-top: 15px;">
            <a href="https://www.facebook.com/people/VEFS-Foundation/61582906514169/" style="color: #6B8E23; margin: 0 5px;">Facebook</a> |
            <a href="https://www.youtube.com/@VEFSFOUNDATION" style="color: #6B8E23; margin: 0 5px;">YouTube</a> |
            <a href="https://www.instagram.com/vefsfoundation/" style="color: #6B8E23; margin: 0 5px;">Instagram</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ===========================
// EVENT EMAIL TEMPLATES
// ===========================

function createAdminEventEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6B8E23; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #6B8E23; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎉 New Event Registration</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Event:</div>
            <div class="value">${data.eventTitle || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Age:</div>
            <div class="value">${data.age || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Number of Attendees:</div>
            <div class="value">${data.attendees || 1}</div>
          </div>
          <div class="field">
            <div class="label">Event Date:</div>
            <div class="value">${data.eventDate || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="label">Donation:</div>
            <div class="value">${data.eventFee ? '₹' + data.eventFee : 'FREE'}</div>
          </div>
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from VEFS Foundation website.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createUserEventEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #6B8E23; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .highlight { background: white; padding: 15px; border-left: 4px solid #D4A574; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Event Registration Confirmed!</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">VEFS Foundation</p>
        </div>
        <div class="content">
          <p>Dear ${data.name},</p>
          <p>Thank you for registering for <strong>${data.eventTitle || 'our event'}</strong>!</p>
          <div class="highlight">
            <strong>Event Details:</strong><br>
            📅 Date: ${data.eventDate || 'TBA'}<br>
            👥 Attendees: ${data.attendees || 1} person(s)<br>
            💰 Donation: ${data.eventFee ? '₹' + data.eventFee : 'FREE'}
          </div>
          <p>We've received your registration and will send you more details about the event via email at <strong>${data.email}</strong>${data.phone ? ' or call you at <strong>' + data.phone + '</strong>' : ''}.</p>
          <p>Please arrive 15 minutes before the scheduled start time.</p>
          <p style="margin-top: 30px;">Best regards,<br>
          <strong>VEFS Foundation Team</strong><br>
          Valluvam Ecological Farming and Social Welfare Foundation</p>
        </div>
        <div class="footer">
          <p><strong>Contact Us:</strong></p>
          <p>Email: vefsfoundation@gmail.com | Phone: +91 95666 67708</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ===========================
// TRAINING EMAIL TEMPLATES
// ===========================

function createAdminTrainingEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6B8E23; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #6B8E23; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📚 New Training Registration</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Training:</div>
            <div class="value">${data.trainingTitle || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Age:</div>
            <div class="value">${data.age || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Education Level:</div>
            <div class="value">${data.education || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Occupation/Organization:</div>
            <div class="value">${data.occupation || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Background/Experience:</div>
            <div class="value">${data.background ? data.background.replace(/\n/g, '<br>') : 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Training Date:</div>
            <div class="value">${data.trainingDate || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="label">Donation:</div>
            <div class="value">${data.trainingFee ? '₹' + data.trainingFee : 'FREE'}</div>
          </div>
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from VEFS Foundation website.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createUserTrainingEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #6B8E23; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .highlight { background: white; padding: 15px; border-left: 4px solid #D4A574; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Training Registration Confirmed!</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">VEFS Foundation</p>
        </div>
        <div class="content">
          <p>Dear ${data.name},</p>
          <p>Thank you for registering for <strong>${data.trainingTitle || 'our training program'}</strong>!</p>
          <div class="highlight">
            <strong>Training Details:</strong><br>
            📅 Start Date: ${data.trainingDate || 'TBA'}<br>
            💰 Donation: ${data.trainingFee ? '₹' + data.trainingFee : 'FREE'}
          </div>
          <p>We've received your registration. Our team will review your application and send you further details including:</p>
          <ul>
            <li>Complete training schedule and curriculum</li>
            <li>Prerequisites and materials needed</li>
            <li>Location and timing details</li>
            ${data.trainingFee && data.trainingFee > 0 ? '<li>Payment instructions</li>' : ''}
          </ul>
          <p>We'll contact you at <strong>${data.email}</strong>${data.phone ? ' or <strong>' + data.phone + '</strong>' : ''} within 24-48 hours.</p>
          <p style="margin-top: 30px;">Best regards,<br>
          <strong>VEFS Foundation Team</strong><br>
          Valluvam Ecological Farming and Social Welfare Foundation</p>
        </div>
        <div class="footer">
          <p><strong>Contact Us:</strong></p>
          <p>Email: vefsfoundation@gmail.com | Phone: +91 95666 67708</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ===========================
// VOLUNTEER EMAIL TEMPLATES
// ===========================

function createAdminVolunteerEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6B8E23; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #6B8E23; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🤝 New Volunteer Application</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Opportunity:</div>
            <div class="value">${data.volunteerTitle || 'N/A'}</div>
          </div>
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Age:</div>
            <div class="value">${data.age || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Motivation:</div>
            <div class="value">${data.motivation ? data.motivation.replace(/\n/g, '<br>') : 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Skills/Experience:</div>
            <div class="value">${data.experience ? data.experience.replace(/\n/g, '<br>') : 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from VEFS Foundation website.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createUserVolunteerEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #6B8E23; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .highlight { background: white; padding: 15px; border-left: 4px solid #D4A574; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Volunteering!</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">VEFS Foundation</p>
        </div>
        <div class="content">
          <p>Dear ${data.name},</p>
          <p>Thank you for your interest in volunteering with VEFS Foundation for <strong>${data.volunteerTitle || 'our program'}</strong>!</p>
          <div class="highlight">
            <strong>Your Motivation:</strong><br>
            ${data.motivation ? data.motivation.replace(/\n/g, '<br>') : 'Thank you for your interest!'}
          </div>
          <p>We're grateful for your willingness to contribute to our mission of ecological conservation and community development.</p>
          <p>Our team will review your application and reach out to you within 3-5 business days at <strong>${data.email}</strong>${data.phone ? ' or <strong>' + data.phone + '</strong>' : ''}.</p>
          <p>In the meantime, feel free to explore more about our work and initiatives on our website.</p>
          <p style="margin-top: 30px;">Best regards,<br>
          <strong>VEFS Foundation Team</strong><br>
          Valluvam Ecological Farming and Social Welfare Foundation</p>
        </div>
        <div class="footer">
          <p><strong>Contact Us:</strong></p>
          <p>Email: vefsfoundation@gmail.com | Phone: +91 95666 67708</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ===========================
// DONATION EMAIL TEMPLATES
// ===========================

function createAdminDonationEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6B8E23; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #6B8E23; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .amount-highlight { font-size: 24px; color: #6B8E23; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>💚 New Donation Received</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Amount:</div>
            <div class="value amount-highlight">₹${data.amount || 0}</div>
          </div>
          <div class="field">
            <div class="label">Type:</div>
            <div class="value">${data.donationType || 'one-time'}</div>
          </div>
          <div class="field">
            <div class="label">Category:</div>
            <div class="value">${data.category || 'General Fund'}</div>
          </div>
          <div class="field">
            <div class="label">Donor Name:</div>
            <div class="value">${data.anonymous ? 'Anonymous' : (data.firstName || '') + ' ' + (data.lastName || '')}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Organization:</div>
            <div class="value">${data.organization || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Tax Benefit Requested:</div>
            <div class="value">${data.taxBenefit ? 'Yes (Send 80G certificate)' : 'No'}</div>
          </div>
          <div class="field">
            <div class="label">Newsletter:</div>
            <div class="value">${data.newsletter ? 'Yes' : 'No'}</div>
          </div>
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from VEFS Foundation website.</p>
          <p style="color: #D97706; font-weight: bold;">Action Required: Manual payment verification needed</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createUserDonationEmail(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23, #D4A574); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #6B8E23; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .highlight { background: white; padding: 15px; border-left: 4px solid #D4A574; margin: 15px 0; }
        .payment-box { background: #FEF3C7; border: 2px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Your Generous Donation!</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">VEFS Foundation</p>
        </div>
        <div class="content">
          <p>Dear ${data.anonymous ? 'Supporter' : (data.firstName || '') + ' ' + (data.lastName || '')},</p>
          <p>Thank you for your generous donation of <strong>₹${data.amount}</strong> to VEFS Foundation!</p>

          <div class="payment-box">
            <h3 style="margin-top: 0; color: #92400E;">Next Steps - Payment Information</h3>
            <p>To complete your donation, please transfer ₹${data.amount} using one of the following methods:</p>

            <strong>UPI Payment:</strong><br>
            UPI ID: <code style="background: white; padding: 2px 8px; border-radius: 4px;">vefsfoundation@upi</code><br><br>

            <strong>Bank Transfer:</strong><br>
            Account Name: VEFS Foundation<br>
            Account Number: 1234567890<br>
            IFSC Code: SBIN0001234<br>
            Bank: State Bank of India<br><br>

            <p style="margin-top: 15px;"><strong>Important:</strong> After making the payment, please email the transaction screenshot to <a href="mailto:vefsfoundation@gmail.com">vefsfoundation@gmail.com</a> with reference "Donation - ${data.email}"</p>
          </div>

          <div class="highlight">
            <strong>Your Donation Details:</strong><br>
            Amount: ₹${data.amount}<br>
            Type: ${data.donationType || 'one-time'}<br>
            Category: ${data.category || 'General Fund'}<br>
            ${data.taxBenefit ? '✓ 80G Tax benefit certificate will be issued after payment verification' : ''}
          </div>

          <p>Your contribution will help us:</p>
          <ul>
            <li>Promote indigenous tree species conservation</li>
            <li>Conduct educational programs for sustainable farming</li>
            <li>Support community development initiatives</li>
            <li>Empower women and youth in rural areas</li>
          </ul>

          ${data.taxBenefit ? '<p><strong>Tax Benefit:</strong> Once we verify your payment, we\'ll send you the 80G certificate for tax exemption benefits.</p>' : ''}

          <p>If you have any questions, please contact us at <strong>vefsfoundation@gmail.com</strong> or call +91 95666 67708.</p>

          <p style="margin-top: 30px;">With gratitude,<br>
          <strong>VEFS Foundation Team</strong><br>
          Valluvam Ecological Farming and Social Welfare Foundation</p>
        </div>
        <div class="footer">
          <p><strong>Contact Us:</strong></p>
          <p>Email: vefsfoundation@gmail.com | Phone: +91 95666 67708</p>
          <p>Nilakottai, Dindigul, Tamil Nadu - 624211</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Create standardized response object
 */
function createResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
    ...data
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create standardized response object with CORS headers
 */
function createResponseWithCORS(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
    ...data
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
