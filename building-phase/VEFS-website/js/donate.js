/**
 * Donate Page JavaScript
 * Handles donation amount selection, form processing, and payment integration
 */

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
      // TODO: Replace with actual payment gateway integration in Phase 6
      // For now, simulate payment processing
      const response = await this.initiatePayment(donationData);

      if (response.success) {
        // Redirect to payment gateway or show success
        this.showSuccess(donationData);
      } else {
        this.showError(response.message || 'Payment initiation failed. Please try again.');
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
   * Initiate payment with payment gateway
   * NOTE: This is a placeholder for Phase 6 backend integration
   * @param {Object} donationData - Donation information
   * @returns {Promise<Object>} Payment response
   */
  async initiatePayment(donationData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Placeholder: In Phase 6, this will be replaced with:
    // const response = await fetch('/api/payment/initiate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(donationData)
    // });
    // const data = await response.json();
    // if (data.paymentUrl) {
    //   window.location.href = data.paymentUrl;  // Redirect to payment gateway
    // }
    // return data;

    // For now, simulate successful payment initiation
    console.log('Donation data (will be sent to payment gateway in Phase 6):', donationData);

    return {
      success: true,
      message: 'Payment gateway integration pending',
      paymentUrl: null
    };
  }

  /**
   * Show success message
   */
  showSuccess(donationData) {
    const form = document.getElementById('donation-form');

    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success animate-fade-in';
    successMessage.style.cssText = 'margin-top: var(--space-xl); padding: var(--space-2xl); text-align: center;';
    successMessage.innerHTML = `
      <div style="font-size: 4rem; margin-bottom: var(--space-md);">🎉</div>
      <h3 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-md); color: var(--color-success);">
        Thank You for Your Generous Donation!
      </h3>
      <p style="font-size: var(--font-size-lg); margin-bottom: var(--space-md);">
        Your contribution of <strong>₹${donationData.amount.toLocaleString('en-IN')}</strong> will make a real difference in our mission to conserve indigenous trees and empower communities.
      </p>
      <p style="color: var(--color-gray-700); margin-bottom: var(--space-lg);">
        A confirmation email with your donation receipt${donationData.options.taxBenefit ? ' and 80G certificate' : ''} has been sent to <strong>${donationData.donor.email}</strong>.
      </p>
      <div style="padding: var(--space-lg); background-color: var(--color-primary-light); border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
        <p style="margin: 0; color: var(--color-gray-800);">
          <strong>Note:</strong> Payment gateway integration is in progress. In production, you would be redirected to a secure payment page to complete your donation.
        </p>
      </div>
      <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
        <a href="/programs.html" class="btn btn-outline">Explore Our Programs</a>
        <a href="/" class="btn btn-primary">Return to Home</a>
      </div>
    `;

    // Hide form and show success message
    form.style.display = 'none';
    form.parentElement.insertBefore(successMessage, form);

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Reset form
    form.reset();
    this.selectedAmount = 0;
    this.donationType = 'one-time';
    this.updateTotalDisplay();
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
