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
    // Future: Add more sheets for events, trainings, etc.
    // EVENTS: 'Events Registration',
    // TRAININGS: 'Training Registration',
    // VOLUNTEER: 'Volunteer Applications',
    // DONATION: 'Donation Records'
  },

  // Email subject templates
  EMAIL_SUBJECTS: {
    ADMIN_CONTACT: '🔔 New Contact Form Submission - VEFS Foundation',
    USER_CONTACT: 'Thank you for contacting VEFS Foundation'
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

    // Validate required fields
    if (!data.name || !data.email || !data.inquiryType || !data.message) {
      return createResponseWithCORS(false, 'Missing required fields');
    }

    // Determine which form type and process accordingly
    const formType = data.formType || 'contact'; // Default to contact form

    switch (formType) {
      case 'contact':
        return handleContactForm(data);
      // Future: Add handlers for other form types
      // case 'event':
      //   return handleEventRegistration(data);
      // case 'training':
      //   return handleTrainingRegistration(data);
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
// EMAIL FUNCTIONS
// ===========================

/**
 * Send notification email to admin
 */
function sendAdminNotification(data, formType) {
  try {
    let subject = '';
    let body = '';

    if (formType === 'contact') {
      subject = CONFIG.EMAIL_SUBJECTS.ADMIN_CONTACT;
      body = createAdminContactEmail(data);
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

    if (formType === 'contact') {
      subject = CONFIG.EMAIL_SUBJECTS.USER_CONTACT;
      body = createUserContactEmail(data);
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
