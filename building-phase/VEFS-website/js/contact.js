/**
 * Contact Page JavaScript
 * Handles contact form submission and URL parameter handling
 */

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
   * Examples:
   * - /contact.html?inquiry=program
   * - /contact.html?inquiry=event&event=evt-001
   * - /contact.html?inquiry=partnership
   */
  handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryType = urlParams.get('inquiry');
    const eventId = urlParams.get('event');
    const programId = urlParams.get('program');

    if (inquiryType) {
      const inquirySelect = document.getElementById('inquiry-type');
      if (inquirySelect) {
        // Set the inquiry type if it matches an option
        const option = Array.from(inquirySelect.options).find(
          opt => opt.value === inquiryType
        );
        if (option) {
          inquirySelect.value = inquiryType;
        }
      }
    }

    // Pre-fill message based on context
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
      // TODO: Replace with actual backend endpoint in Phase 6
      // For now, simulate API call
      const response = await this.sendToBackend(data);

      if (response.success) {
        this.showSuccess();
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
   * Send form data to backend
   * NOTE: This is a placeholder for Phase 6 backend integration
   * @param {Object} data - Form data object
   * @returns {Promise<Object>} Response object
   */
  async sendToBackend(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder: In Phase 6, this will be replaced with:
    // const response = await fetch('/forms/contact-handler.php', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return await response.json();

    // For now, simulate successful submission
    console.log('Contact form data (will be sent to backend in Phase 6):', data);

    return {
      success: true,
      message: 'Message sent successfully'
    };
  }

  /**
   * Set submit button state (loading/disabled)
   * @param {boolean} isSubmitting - Whether form is submitting
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
   * Show success message
   */
  showSuccess() {
    this.removeMessages();

    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success animate-fade-in';
    successMessage.style.cssText = 'margin-top: var(--space-lg);';
    successMessage.innerHTML = `
      <strong>✓ Message Sent Successfully!</strong><br>
      Thank you for contacting VEFS Foundation. We've received your message and will get back to you within 24-48 hours.
    `;

    this.form.insertAdjacentElement('afterend', successMessage);

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Remove success message after 10 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 10000);
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
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

    // Scroll to error message
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
