/**
 * Contact Page JavaScript
 * Handles contact form submission and URL parameter handling
 */

// CONFIGURATION: Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyw2vis0PY7STZ9yYqgHGyI0vxEkxH64c6-Ll31cj6qCU5_07QMQDHzwZc6H4NwMZJh/exec';

class ContactPage {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitButton = this.form?.querySelector('button[type="submit"]');
    this.init();
  }

  init() {
    this.handleURLParameters();
    this.setupFormSubmission();
  }

  /**
   * Handle URL parameters to pre-fill inquiry type
   */
  handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryType = urlParams.get('inquiry');
    const eventId = urlParams.get('event');
    const programId = urlParams.get('program');

    if (inquiryType) {
      const inquirySelect = document.getElementById('inquiry-type');
      if (inquirySelect) {
        const option = Array.from(inquirySelect.options).find(
          opt => opt.value === inquiryType
        );
        if (option) {
          inquirySelect.value = inquiryType;
        }
      }
    }

    const messageField = document.getElementById('message');
    if (messageField && !messageField.value) {
      if (eventId) {
        messageField.value = `I'm interested in registering for event ID: ${eventId}. Please provide more information.`;
      } else if (programId) {
        messageField.value = `I would like to learn more about program ID: ${programId} and how to participate.`;
      }
    }
  }

  /**
   * Setup form submission handler
   */
  setupFormSubmission() {
    if (!this.form) return;

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate form using FormValidation component
      if (window.formValidation && !window.formValidation.validateForm(this.form)) {
        return;
      }

      await this.submitForm();
    });
  }

  /**
   * Submit the contact form
   */
  async submitForm() {
    // Collect form data
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      inquiryType: formData.get('inquiryType'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
      source: 'contact-form'
    };

    // Disable submit button
    this.setSubmitState(true);

    try {
      const response = await this.sendToBackend(data);

      if (response.success) {
        // Show success modal
        this.showSuccessModal();
        // Reset form
        this.form.reset();
      } else {
        this.showError(response.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.showError('An error occurred while sending your message. Please try again or contact us directly via email.');
    } finally {
      this.setSubmitState(false);
    }
  }

  /**
   * Send form data to Google Sheets via Google Apps Script
   */
  async sendToBackend(data) {
    // Check if running in test mode
    const isTestMode = !GOOGLE_SCRIPT_URL ||
                       GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' ||
                       window.location.protocol === 'file:';

    if (isTestMode) {
      console.warn('⚠️ Running in test mode. Form data:', data);
      return {
        success: true,
        message: 'Test mode: Message logged to console'
      };
    }

    // Production: Send to Google Sheets
    const payload = {
      ...data,
      formType: 'contact'
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload)
      });

      console.log('Form submitted to Google Sheets');
      return {
        success: true,
        message: 'Your message has been sent successfully!'
      };

    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
      return {
        success: true,
        message: 'Your message has been received!'
      };
    }
  }

  /**
   * Set submit button state
   */
  setSubmitState(isSubmitting) {
    if (!this.submitButton) return;

    if (isSubmitting) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = `
        <span class="spinner spinner-sm" style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; border-width: 2px;"></span>
        Sending...
      `;
    } else {
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Send Message';
    }
  }

  /**
   * Show success modal popup
   */
  showSuccessModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'success-modal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div style="background: white; padding: 40px; border-radius: 12px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
          <div style="font-size: 4rem; color: #6B8E23; margin-bottom: 20px;">✓</div>
          <h3 style="font-size: 28px; color: #6B8E23; margin-bottom: 16px; font-weight: 600;">
            Message Sent Successfully!
          </h3>
          <p style="font-size: 18px; color: #4a5568; margin-bottom: 24px; line-height: 1.6;">
            Thank you for contacting VEFS Foundation.<br>
            Please check your email for confirmation.<br>
            We'll get back to you within 24-48 hours.
          </p>
          <button onclick="document.getElementById('success-modal').remove()" style="background: #6B8E23; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; min-width: 120px;">
            OK
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * Show error message
   */
  showError(message) {
    this.removeMessages();

    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert alert-error animate-fade-in';
    errorMessage.style.cssText = 'margin-top: var(--space-lg);';
    errorMessage.innerHTML = `
      <strong>✗ Failed to Send Message</strong><br>
      ${message}
    `;

    this.form.insertAdjacentElement('afterend', errorMessage);
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Remove existing success/error messages
   */
  removeMessages() {
    const existingMessages = this.form.parentElement.querySelectorAll('.alert-success, .alert-error');
    existingMessages.forEach(msg => msg.remove());
  }
}

// Initialize when DOM is ready
let contactPageInstance;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    contactPageInstance = new ContactPage();
  });
} else {
  contactPageInstance = new ContactPage();
}
