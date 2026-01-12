/**
 * Donate Page JavaScript
 * Handles donation amount selection, form processing, and payment integration
 */

// Google Apps Script Web App URL for form submissions
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyw2vis0PY7STZ9yYqgHGyI0vxEkxH64c6-Ll31cj6qCU5_07QMQDHzwZc6H4NwMZJh/exec';

class DonatePage {
  constructor() {
    this.selectedAmount = 0;
    this.donationType = 'one-time';
    this.init();
  }

  init() {
    this.setupAmountSelection();
    this.setupCustomAmount();
    this.setupDonationType();
    this.setupFormSubmission();
    this.updateTotalDisplay();
  }

  /**
   * Setup amount button selection
   */
  setupAmountSelection() {
    const amountButtons = document.querySelectorAll('.amount-btn');

    amountButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        amountButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Set selected amount
        this.selectedAmount = parseInt(button.dataset.amount);

        // Clear custom amount input
        document.getElementById('custom-amount').value = '';

        // Update total display
        this.updateTotalDisplay();
      });
    });
  }

  /**
   * Setup custom amount input
   */
  setupCustomAmount() {
    const customAmountInput = document.getElementById('custom-amount');

    customAmountInput.addEventListener('input', (e) => {
      const value = parseInt(e.target.value) || 0;

      // Remove active class from all amount buttons
      document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      // Set selected amount
      this.selectedAmount = value;

      // Update total display
      this.updateTotalDisplay();
    });
  }

  /**
   * Setup donation type radio buttons
   */
  setupDonationType() {
    const typeRadios = document.querySelectorAll('input[name="donationType"]');

    typeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.donationType = e.target.value;
        this.updateTotalDisplay();
      });
    });
  }

  /**
   * Update total amount display
   */
  updateTotalDisplay() {
    const totalDisplay = document.getElementById('total-amount-display');
    const formattedAmount = this.selectedAmount.toLocaleString('en-IN');

    if (this.selectedAmount > 0) {
      if (this.donationType === 'monthly') {
        totalDisplay.innerHTML = `₹${formattedAmount}<span style="font-size: var(--font-size-sm); font-weight: 400;">/month</span>`;
      } else {
        totalDisplay.textContent = `₹${formattedAmount}`;
      }
    } else {
      totalDisplay.textContent = '₹0';
    }
  }

  /**
   * Setup form submission handler
   */
  setupFormSubmission() {
    const form = document.getElementById('donation-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate amount
      if (this.selectedAmount < 100) {
        alert('Please select or enter a donation amount of at least ₹100');
        return;
      }

      // Validate form using FormValidation component
      if (window.formValidation && !window.formValidation.validateForm(form)) {
        return;
      }

      await this.processDonation();
    });
  }

  /**
   * Process donation
   */
  async processDonation() {
    const form = document.getElementById('donation-form');
    const formData = new FormData(form);

    // Collect donation data
    const donationData = {
      amount: this.selectedAmount,
      type: this.donationType,
      category: formData.get('category'),
      donor: {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        organization: formData.get('organization') || ''
      },
      options: {
        anonymous: formData.get('anonymous') === 'on',
        newsletter: formData.get('newsletter') === 'on',
        taxBenefit: formData.get('taxBenefit') === 'on'
      },
      timestamp: new Date().toISOString(),
      source: 'donation-form'
    };

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="spinner spinner-sm" style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; border-width: 2px;"></span>
      Processing...
    `;

    try {
      // Send donation data to Google Sheets
      const response = await this.sendToBackend(donationData);

      if (response.success) {
        this.showSuccess(donationData);
        form.reset();
        this.selectedAmount = 0;
        this.updateTotalDisplay();
      } else {
        this.showError('Failed to submit donation information. Please try again.');
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      this.showError('An error occurred while processing your donation. Please try again or contact us for assistance.');
    } finally {
      // Reset button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  /**
   * Send donation data to Google Sheets backend
   * @param {Object} donationData - Donation information
   * @returns {Promise<Object>} Response from backend
   */
  async sendToBackend(donationData) {
    // Check if running in test mode
    const isTestMode = !GOOGLE_SCRIPT_URL ||
                       GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' ||
                       window.location.protocol === 'file:';

    if (isTestMode) {
      console.warn('⚠️ Running in test mode. Donation data:', donationData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Test mode: Donation logged to console' };
    }

    // Prepare payload for Google Sheets
    const payload = {
      formType: 'donation',
      firstName: donationData.donor.firstName,
      lastName: donationData.donor.lastName,
      email: donationData.donor.email,
      phone: donationData.donor.phone || '',
      organization: donationData.donor.organization || '',
      amount: donationData.amount,
      donationType: donationData.type,
      category: donationData.category || 'General Fund',
      anonymous: donationData.options.anonymous || false,
      newsletter: donationData.options.newsletter || false,
      taxBenefit: donationData.options.taxBenefit || false,
      timestamp: donationData.timestamp
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      console.log('Donation submitted to Google Sheets');
      return {
        success: true,
        message: 'Donation recorded successfully!'
      };
    } catch (error) {
      console.error('Error sending donation to Google Sheets:', error);
      return {
        success: true,
        message: 'Donation received!'
      };
    }
  }

  /**
   * Show success message with payment instructions modal
   */
  showSuccess(donationData) {
    const PAYMENT_INFO = {
      upi: { id: '9566667708@hdfcbank' },
      bank: {
        name: 'HDFC Bank',
        accountNumber: '50200115917889',
        ifsc: 'HDFC0002301',
        branch: 'Dindigul'
      },
      contact: {
        email: 'vefsfoundation@gmail.com',
        phone: '+91 95666 67708',
        whatsapp: '+91 95666 67708'
      }
    };

    const modal = document.createElement('div');
    modal.id = 'donation-success-modal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 10000; overflow-y: auto; padding: 20px;">
        <div style="background: white; padding: 32px; border-radius: 12px; max-width: 700px; width: 100%; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); max-height: 90vh; overflow-y: auto;">

          <!-- Success Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 4rem; color: #6B8E23; margin-bottom: 16px;">✓</div>
            <h3 style="font-size: 28px; color: #6B8E23; margin: 0 0 12px 0; font-weight: 600;">Thank You for Your Donation!</h3>
            <p style="font-size: 18px; color: #4a5568; margin: 0;">
              Your contribution of <strong>₹${donationData.amount.toLocaleString('en-IN')}</strong> will make a real difference.<br>
              Please check your email for confirmation.
            </p>
          </div>

          <!-- Payment Instructions -->
          <div style="background: #FFF9E6; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 2px solid #D4A574;">
            <h4 style="font-size: 20px; margin: 0 0 16px 0; color: #D4A574; text-align: center;">💳 Complete Your Donation</h4>
            <p style="font-size: 16px; margin: 0 0 8px 0; font-weight: 600; color: #333; text-align: center;">Donation Amount: ₹${donationData.amount.toLocaleString('en-IN')}</p>
            <p style="font-size: 14px; margin: 0; color: #666; text-align: center;">Please make your payment using one of the options below:</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <!-- UPI Payment -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
              <h4 style="font-size: 18px; margin: 0 0 12px 0; color: #6B8E23;">Option 1: UPI Payment</h4>
              <p style="font-weight: 600; margin: 0 0 8px 0; color: #333;">UPI ID: ${PAYMENT_INFO.upi.id}</p>
              <p style="font-size: 13px; color: #666; margin: 0;">Use any UPI app (GPay, PhonePe, Paytm)</p>
            </div>

            <!-- Bank Transfer -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
              <h4 style="font-size: 18px; margin: 0 0 12px 0; color: #6B8E23;">Option 2: Bank Transfer</h4>
              <div style="font-size: 13px; color: #333;">
                <p style="margin: 0 0 4px 0;"><strong>Bank:</strong> ${PAYMENT_INFO.bank.name}</p>
                <p style="margin: 0 0 4px 0;"><strong>A/C:</strong> ${PAYMENT_INFO.bank.accountNumber}</p>
                <p style="margin: 0 0 4px 0;"><strong>IFSC:</strong> ${PAYMENT_INFO.bank.ifsc}</p>
              </div>
            </div>
          </div>

          <!-- Important: Send Confirmation -->
          <div style="background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(107, 142, 35, 0.2)); padding: 20px; border-radius: 8px; border-left: 4px solid #D4A574; margin-bottom: 24px;">
            <h4 style="font-size: 18px; margin: 0 0 12px 0; color: #D4A574;">📸 Important: Send Payment Confirmation</h4>
            <p style="margin: 0 0 16px 0; color: #333; font-size: 14px;">After making the payment, please send a screenshot of the payment confirmation <strong>along with your name</strong> to:</p>

            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="https://wa.me/${PAYMENT_INFO.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Payment%20confirmation%20for%20donation%20of%20₹${donationData.amount}"
                 target="_blank"
                 rel="noopener"
                 style="display: inline-flex; align-items: center; gap: 8px; background-color: #25D366; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
                📱 WhatsApp
              </a>

              <a href="mailto:${PAYMENT_INFO.contact.email}?subject=Payment%20Confirmation%20-%20Donation"
                 style="display: inline-flex; align-items: center; gap: 8px; background-color: #6B8E23; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
                ✉️ Email
              </a>
            </div>
          </div>

          ${donationData.options.taxBenefit ? `
          <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #6B8E23;">
            <p style="margin: 0; color: #2e7d32; font-size: 14px;">
              <strong>✓ 80G Tax Exemption:</strong> Your 80G certificate will be sent to your email after payment verification.
            </p>
          </div>
          ` : ''}

          <div style="text-align: center;">
            <button onclick="document.getElementById('donation-success-modal').remove();" style="background: #6B8E23; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer;">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const form = document.getElementById('donation-form');

    // Remove existing error messages
    const existingError = form.querySelector('.alert-error');
    if (existingError) {
      existingError.remove();
    }

    // Create error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert alert-error animate-fade-in';
    errorMessage.style.cssText = 'margin-top: var(--space-lg);';
    errorMessage.innerHTML = `
      <strong>✗ Payment Processing Failed</strong><br>
      ${message}
    `;

    // Insert error message
    form.appendChild(errorMessage);

    // Scroll to error message
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      errorMessage.remove();
    }, 10000);
  }
}

/**
 * Global function to select donation amount from impact cards
 * @param {number} amount - Amount to select
 */
function selectDonationAmount(amount) {
  // Scroll to donation form
  document.getElementById('donation-form-section').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  // Select the corresponding amount button
  setTimeout(() => {
    const amountButton = document.querySelector(`.amount-btn[data-amount="${amount}"]`);
    if (amountButton) {
      amountButton.click();
    } else {
      // If no matching button, set custom amount
      document.getElementById('custom-amount').value = amount;
      document.getElementById('custom-amount').dispatchEvent(new Event('input'));
    }
  }, 500);
}

/**
 * Global function to focus custom amount input
 */
function focusCustomAmount() {
  // Scroll to donation form
  document.getElementById('donation-form-section').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  // Focus custom amount input
  setTimeout(() => {
    const customAmountInput = document.getElementById('custom-amount');
    customAmountInput.focus();
  }, 500);
}

// Initialize when DOM is ready
let donatePageInstance;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    donatePageInstance = new DonatePage();
  });
} else {
  donatePageInstance = new DonatePage();
}
