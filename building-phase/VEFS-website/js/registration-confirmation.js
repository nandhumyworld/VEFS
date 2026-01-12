/**
 * VEFS Foundation - Registration Confirmation Page
 *
 * Handles display of registration confirmation for events, trainings, and volunteers
 * Reads data from sessionStorage and displays appropriate confirmation with payment instructions
 */

// Payment information configuration
const PAYMENT_INFO = {
  upi: {
    id: 'vefsfoundation@upi',
    qr: '/images/payment/upi-qr-code.png'
  },
  bank: {
    name: 'State Bank of India',
    accountNumber: 'XXXXX12345',  // Update with actual account number
    ifsc: 'SBIN0XXXXX',            // Update with actual IFSC code
    branch: 'Nilakottai'
  },
  contact: {
    email: 'vefsfoundation@gmail.com',
    phone: '+91 95666 67708',
    whatsapp: '+91 95666 67708'
  }
};

/**
 * Registration Confirmation Class
 */
class RegistrationConfirmation {
  constructor() {
    this.type = null;        // 'event', 'training', or 'volunteer'
    this.data = null;        // Registration data from sessionStorage
    this.itemId = null;      // ID of the event/training/volunteer
    this.init();
  }

  /**
   * Initialize the confirmation page
   */
  init() {
    // Read URL parameters
    const params = new URLSearchParams(window.location.search);
    this.type = params.get('type');
    this.itemId = params.get('id');

    // Read sessionStorage
    this.data = this.getStoredData();

    // Render confirmation
    this.renderConfirmation();

    // Clear sessionStorage after rendering
    this.clearStoredData();
  }

  /**
   * Get stored registration data from sessionStorage
   * @returns {Object|null} Registration data or null if not found
   */
  getStoredData() {
    const key = `vefs_registration_${this.type}`;
    const stored = sessionStorage.getItem(key);

    if (!stored) {
      console.warn(`No registration data found for type: ${this.type}`);
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing registration data:', error);
      return null;
    }
  }

  /**
   * Clear stored registration data from sessionStorage
   */
  clearStoredData() {
    if (this.type) {
      const key = `vefs_registration_${this.type}`;
      sessionStorage.removeItem(key);
    }
  }

  /**
   * Render confirmation based on registration type
   */
  renderConfirmation() {
    const container = document.getElementById('confirmation-content');

    if (!container) {
      console.error('Confirmation content container not found');
      return;
    }

    // Check if we have valid data
    if (!this.data || !this.type) {
      this.renderError(container);
      return;
    }

    // Render based on type
    switch (this.type) {
      case 'event':
        this.renderEventConfirmation(container);
        break;
      case 'training':
        this.renderTrainingConfirmation(container);
        break;
      case 'volunteer':
        this.renderVolunteerConfirmation(container);
        break;
      default:
        this.renderError(container);
    }
  }

  /**
   * Render event registration confirmation
   */
  renderEventConfirmation(container) {
    const { eventTitle, eventDate, eventFee, name, email, phone, age, attendees } = this.data;
    const hasFee = eventFee && eventFee > 0;

    container.innerHTML = `
      <!-- Success Message -->
      <div class="card" style="background: linear-gradient(135deg, rgba(107, 142, 35, 0.1), rgba(212, 165, 116, 0.1)); border: 2px solid var(--color-primary); padding: var(--space-xl); margin-bottom: var(--space-2xl); text-align: center;">
        <div style="font-size: 3rem; margin-bottom: var(--space-md); color: var(--color-primary);">✓</div>
        <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-sm); color: var(--color-primary);">Registration Successful!</h2>
        <p style="font-size: var(--font-size-lg); color: var(--color-gray-700);">Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
      </div>

      <!-- Event Details -->
      <div class="card" style="margin-bottom: var(--space-2xl); padding: var(--space-xl);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-lg); color: var(--color-primary); border-bottom: 2px solid var(--color-primary-light); padding-bottom: var(--space-sm);">Event Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg);">
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Event Name</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${eventTitle}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Date</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${formatDate(eventDate, 'long')}</p>
          </div>
          ${hasFee ? `
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Donation</p>
            <p style="font-weight: 600; color: var(--color-secondary);">₹${eventFee}</p>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Your Registration Details -->
      <div class="card" style="margin-bottom: var(--space-2xl); padding: var(--space-xl);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-lg); color: var(--color-primary); border-bottom: 2px solid var(--color-primary-light); padding-bottom: var(--space-sm);">Your Registration Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg);">
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Name</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${this.escapeHtml(name)}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Email</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${this.escapeHtml(email)}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Phone</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${this.escapeHtml(phone)}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Age</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${age}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Number of Attendees</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${attendees}</p>
          </div>
        </div>
      </div>

      <!-- Payment Instructions (if applicable) -->
      ${hasFee ? this.renderPaymentInstructions(eventFee, eventTitle) : ''}

      <!-- Next Steps -->
      <div class="card" style="background-color: var(--color-primary-light); padding: var(--space-xl);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md); color: var(--color-primary);">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-gray-200);">
            <strong>✓ Confirmation Email:</strong> You will receive a confirmation email at <strong>${this.escapeHtml(email)}</strong> shortly.
          </li>
          ${hasFee ? `
          <li style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-gray-200);">
            <strong>✓ Payment Verification:</strong> Once we receive your payment confirmation, we will verify and confirm your registration.
          </li>
          ` : ''}
          <li style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-gray-200);">
            <strong>✓ Event Reminder:</strong> We will send you a reminder before the event with additional details and location information.
          </li>
          <li style="padding: var(--space-sm) 0;">
            <strong>✓ Questions?</strong> Contact us at <a href="mailto:${PAYMENT_INFO.contact.email}" style="color: var(--color-primary); font-weight: 600;">${PAYMENT_INFO.contact.email}</a> or <a href="tel:${PAYMENT_INFO.contact.phone}" style="color: var(--color-primary); font-weight: 600;">${PAYMENT_INFO.contact.phone}</a>
          </li>
        </ul>
      </div>
    `;
  }

  /**
   * Render training registration confirmation
   */
  renderTrainingConfirmation(container) {
    const { trainingTitle, trainingDate, trainingFee, name, email, phone, age, education, occupation, background } = this.data;
    const hasFee = trainingFee && trainingFee > 0;

    container.innerHTML = `
      <!-- Success Message -->
      <div class="card" style="background: linear-gradient(135deg, rgba(107, 142, 35, 0.1), rgba(212, 165, 116, 0.1)); border: 2px solid var(--color-primary); padding: var(--space-xl); margin-bottom: var(--space-2xl); text-align: center;">
        <div style="font-size: 3rem; margin-bottom: var(--space-md); color: var(--color-primary);">✓</div>
        <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-sm); color: var(--color-primary);">Registration Successful!</h2>
        <p style="font-size: var(--font-size-lg); color: var(--color-gray-700);">Your registration for <strong>${trainingTitle}</strong> has been confirmed.</p>
      </div>

      <!-- Training Details -->
      <div class="card" style="margin-bottom: var(--space-2xl); padding: var(--space-xl);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-lg); color: var(--color-primary); border-bottom: 2px solid var(--color-primary-light); padding-bottom: var(--space-sm);">Training Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg);">
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Training Program</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${trainingTitle}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Start Date</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${formatDate(trainingDate, 'long')}</p>
          </div>
          ${hasFee ? `
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Donation</p>
            <p style="font-weight: 600; color: var(--color-secondary);">₹${trainingFee}</p>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Your Registration Details -->
      <div class="card" style="margin-bottom: var(--space-2xl); padding: var(--space-xl);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-lg); color: var(--color-primary); border-bottom: 2px solid var(--color-primary-light); padding-bottom: var(--space-sm);">Your Registration Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-lg);">
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Name</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${this.escapeHtml(name)}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Email</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${this.escapeHtml(email)}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Phone</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${this.escapeHtml(phone)}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Age</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${age}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Education Level</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${this.formatEducationLevel(education)}</p>
          </div>
          <div>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Occupation/Organization</p>
            <p style="font-weight: 600; color: var(--color-gray-900);">${this.escapeHtml(occupation)}</p>
          </div>
        </div>
        <div>
          <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">Background/Experience</p>
          <p style="color: var(--color-gray-900); white-space: pre-line;">${this.escapeHtml(background)}</p>
        </div>
      </div>

      <!-- Payment Instructions (if applicable) -->
      ${hasFee ? this.renderPaymentInstructions(trainingFee, trainingTitle) : ''}

      <!-- Next Steps -->
      <div class="card" style="background-color: var(--color-primary-light); padding: var(--space-xl);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md); color: var(--color-primary);">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-gray-200);">
            <strong>✓ Confirmation Email:</strong> You will receive a confirmation email at <strong>${this.escapeHtml(email)}</strong> with training details and joining instructions.
          </li>
          ${hasFee ? `
          <li style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-gray-200);">
            <strong>✓ Payment Verification:</strong> Once we receive your payment confirmation, we will confirm your seat and send you the training materials.
          </li>
          ` : ''}
          <li style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-gray-200);">
            <strong>✓ Training Materials:</strong> Pre-training materials and preparation guidelines will be shared via email before the program starts.
          </li>
          <li style="padding: var(--space-sm) 0;">
            <strong>✓ Questions?</strong> Contact us at <a href="mailto:${PAYMENT_INFO.contact.email}" style="color: var(--color-primary); font-weight: 600;">${PAYMENT_INFO.contact.email}</a> or <a href="tel:${PAYMENT_INFO.contact.phone}" style="color: var(--color-primary); font-weight: 600;">${PAYMENT_INFO.contact.phone}</a>
          </li>
        </ul>
      </div>
    `;
  }

  /**
   * Render volunteer registration confirmation (for future compatibility)
   */
  renderVolunteerConfirmation(container) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: var(--space-3xl);">
        <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-md); color: var(--color-primary);">Volunteer Registration Confirmed</h2>
        <p style="color: var(--color-gray-700); margin-bottom: var(--space-lg);">Thank you for your interest in volunteering with VEFS Foundation. We will contact you shortly with more details.</p>
        <a href="volunteer.html" class="btn btn-primary">Back to Volunteer Opportunities</a>
      </div>
    `;
  }

  /**
   * Render payment instructions section
   * @param {number} fee - Fee amount
   * @param {string} title - Event/Training title
   * @returns {string} HTML string for payment section
   */
  renderPaymentInstructions(fee, title) {
    return `
      <div class="card" style="background-color: #FFF9E6; border: 2px solid var(--color-secondary); padding: var(--space-xl); margin-bottom: var(--space-2xl);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md); color: var(--color-secondary);">💳 Payment Instructions</h3>

        <div style="background: white; padding: var(--space-lg); border-radius: 8px; margin-bottom: var(--space-lg);">
          <p style="font-size: var(--font-size-lg); margin-bottom: var(--space-sm);"><strong>Donation Amount: ₹${fee}</strong></p>
          <p style="font-size: var(--font-size-sm); color: var(--color-gray-600);">This amount is treated as a donation to support our environmental conservation efforts.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-xl); margin-bottom: var(--space-xl);">
          <!-- UPI Payment -->
          <div style="background: white; padding: var(--space-lg); border-radius: 8px;">
            <h4 style="font-size: var(--font-size-lg); margin-bottom: var(--space-md); color: var(--color-primary);">Option 1: UPI Payment</h4>
            <p style="font-weight: 600; margin-bottom: var(--space-sm);">UPI ID: ${PAYMENT_INFO.upi.id}</p>
            <p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-md);">Scan QR code or use UPI ID to pay</p>
            <!-- QR Code placeholder - add actual QR code image when available -->
            <div style="background: var(--color-gray-100); height: 150px; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: var(--color-gray-500);">
              <p>QR Code Here</p>
            </div>
          </div>

          <!-- Bank Transfer -->
          <div style="background: white; padding: var(--space-lg); border-radius: 8px;">
            <h4 style="font-size: var(--font-size-lg); margin-bottom: var(--space-md); color: var(--color-primary);">Option 2: Bank Transfer</h4>
            <div style="font-size: var(--font-size-sm);">
              <p style="margin-bottom: var(--space-xs);"><strong>Bank:</strong> ${PAYMENT_INFO.bank.name}</p>
              <p style="margin-bottom: var(--space-xs);"><strong>Account No:</strong> ${PAYMENT_INFO.bank.accountNumber}</p>
              <p style="margin-bottom: var(--space-xs);"><strong>IFSC Code:</strong> ${PAYMENT_INFO.bank.ifsc}</p>
              <p style="margin-bottom: var(--space-xs);"><strong>Branch:</strong> ${PAYMENT_INFO.bank.branch}</p>
            </div>
          </div>
        </div>

        <!-- Important: Send Payment Confirmation -->
        <div style="background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(107, 142, 35, 0.2)); padding: var(--space-lg); border-radius: 8px; border-left: 4px solid var(--color-secondary);">
          <h4 style="font-size: var(--font-size-lg); margin-bottom: var(--space-md); color: var(--color-secondary);">📸 Important: Send Payment Confirmation</h4>
          <p style="margin-bottom: var(--space-md); color: var(--color-gray-900);">After making the payment, please send a screenshot of the payment confirmation <strong>along with your name</strong> to:</p>

          <div style="display: flex; gap: var(--space-md); flex-wrap: wrap; margin-top: var(--space-md);">
            <a href="https://wa.me/${PAYMENT_INFO.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Payment%20confirmation%20for%20${encodeURIComponent(title)}"
               target="_blank"
               rel="noopener"
               class="btn btn-primary"
               style="display: inline-flex; align-items: center; gap: 8px; background-color: #25D366; text-decoration: none;">
              <span>📱 WhatsApp: ${PAYMENT_INFO.contact.whatsapp}</span>
            </a>

            <a href="mailto:${PAYMENT_INFO.contact.email}?subject=Payment%20Confirmation%20-%20${encodeURIComponent(title)}&body=Please%20find%20attached%20payment%20screenshot%20for%20${encodeURIComponent(title)}"
               class="btn btn-outline"
               style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
              <span>✉️ Email: ${PAYMENT_INFO.contact.email}</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render error message when no data is found
   */
  renderError(container) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: var(--space-3xl);">
        <div style="font-size: 4rem; margin-bottom: var(--space-md); color: var(--color-error);">⚠️</div>
        <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-md); color: var(--color-error);">Registration Data Not Found</h2>
        <p style="color: var(--color-gray-700); margin-bottom: var(--space-lg);">
          We couldn't find your registration information. This may happen if you refreshed the page or navigated here directly.
        </p>
        <p style="color: var(--color-gray-600); margin-bottom: var(--space-xl);">
          Don't worry! If you just submitted a registration, you should receive a confirmation email shortly.
        </p>
        <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
          <a href="events.html" class="btn btn-primary">Browse Events</a>
          <a href="trainings.html" class="btn btn-primary">Browse Trainings</a>
          <a href="contact.html" class="btn btn-outline">Contact Us</a>
        </div>
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format education level from value to display text
   * @param {string} value - Education level value
   * @returns {string} Display text
   */
  formatEducationLevel(value) {
    const educationLevels = {
      'high-school': 'High School',
      'undergraduate': 'Undergraduate',
      'graduate': 'Graduate',
      'post-graduate': 'Post-Graduate',
      'vocational': 'Vocational/Diploma',
      'other': 'Other'
    };
    return educationLevels[value] || value;
  }
}

// Initialize confirmation page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new RegistrationConfirmation();
});
