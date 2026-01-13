/**
 * Volunteers Page JavaScript
 * Loads and displays volunteer opportunities with registration functionality
 */

// CONFIGURATION: Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyw2vis0PY7STZ9yYqgHGyI0vxEkxH64c6-Ll31cj6qCU5_07QMQDHzwZc6H4NwMZJh/exec';

class VolunteersPage {
  constructor() {
    this.volunteers = [];
    this.filteredVolunteers = [];
    this.init();
  }

  async init() {
    await this.loadVolunteers();
    this.renderVolunteers();
    this.handleHashNavigation();
  }

  /**
   * Load volunteers data from JSON
   */
  async loadVolunteers() {
    try {
      const response = await fetch('data/volunteers.json');
      if (!response.ok) throw new Error('Failed to load volunteers');

      const data = await response.json();

      // Filter for open opportunities and sort by start date
      this.volunteers = data.volunteers
        .filter(v => v.status === 'open')
        .sort((a, b) => new Date(a.dates.start) - new Date(b.dates.start));

      this.filteredVolunteers = [...this.volunteers];

      console.log('Loaded volunteers:', this.volunteers.length);
    } catch (error) {
      console.error('Error loading volunteers:', error);
      this.showError();
    }
  }

  /**
   * Render volunteer opportunities in grid
   */
  renderVolunteers() {
    const container = document.getElementById('volunteers-container');
    if (!container) {
      console.error('Volunteers container not found');
      return;
    }

    if (this.filteredVolunteers.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-gray-600);">
          <p>No volunteer opportunities available at this time. Check back soon!</p>
        </div>
      `;
      return;
    }

    try {
      container.innerHTML = this.filteredVolunteers.map(volunteer => {
        const startDate = new Date(volunteer.dates.start);
        const hasStipend = volunteer.benefits.stipend.provided;
        const spotsRemaining = volunteer.spots.available;

        return `
          <div class="card animate-fade-in" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"
               onclick="volunteersPageInstance.showDetails('${volunteer.id}')"
               onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'"
               onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
            ${volunteer.media?.featuredImage ? `
              <div class="card-image">
                <img src="${volunteer.media.featuredImage}" alt="${volunteer.title}" loading="lazy" onerror="this.parentElement.style.display='none'">
                ${spotsRemaining <= 3 ? `<span class="card-badge card-badge-warning">Only ${spotsRemaining} spots left</span>` : ''}
              </div>
            ` : ''}
            <div class="card-body">
              <h3 class="card-title">${volunteer.title}</h3>
              <p class="card-description">${volunteer.description.brief}</p>

              <div class="card-meta" style="margin-top: var(--space-md);">
                <div style="margin-bottom: var(--space-xs);">
                  <strong>📅 Duration:</strong> ${this.formatDuration(volunteer.duration)}
                </div>
                <div style="margin-bottom: var(--space-xs);">
                  <strong>📍 Location:</strong> ${volunteer.location.city}
                </div>
                <div style="margin-bottom: var(--space-xs);">
                  <strong>⏰ Commitment:</strong> ${volunteer.commitment}
                </div>
                ${hasStipend ? `
                  <div style="color: var(--color-success); margin-top: var(--space-xs);">
                    💰 Stipend: ₹${volunteer.benefits.stipend.amount}/month
                  </div>
                ` : ''}
              </div>

              <div class="card-footer" style="margin-top: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--color-gray-600); font-size: var(--font-sm);">
                  ${spotsRemaining} ${spotsRemaining === 1 ? 'spot' : 'spots'} available
                </span>
                <button onclick="event.stopPropagation(); volunteersPageInstance.showDetails('${volunteer.id}')" class="btn btn-sm btn-primary">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (error) {
      console.error('Error rendering volunteers:', error);
      this.showError();
    }
  }

  /**
   * Show error message when data loading fails
   */
  showError() {
    const container = document.getElementById('volunteers-container');
    if (!container) return;
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl);">
        <div class="alert alert-error">Unable to load volunteer opportunities. Please try again later.</div>
      </div>
    `;
  }

  /**
   * Show volunteer details in modal with registration form
   */
  showDetails(volunteerId) {
    const volunteer = this.volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;

    const modalBody = document.getElementById('volunteer-modal-body');

    if (!modalBody) {
      console.error('Modal elements not found');
      return;
    }

    // Update URL hash
    window.location.hash = volunteer.slug || volunteer.id;

    const startDate = new Date(volunteer.dates.start);
    const endDate = new Date(volunteer.dates.end);
    const hasStipend = volunteer.benefits.stipend.provided;

    modalBody.innerHTML = `
      <!-- Featured Image -->
      ${volunteer.media?.featuredImage ? `
        <img src="${volunteer.media.featuredImage}" alt="${volunteer.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
      ` : ''}

      <!-- Title -->
      <h2 id="volunteer-modal-title" style="font-size: var(--font-size-3xl); color: var(--color-primary); margin-bottom: var(--space-lg);">
        ${volunteer.title}
      </h2>

      <!-- Volunteer Details -->
      <div style="margin-bottom: var(--space-xl);">
        <h3 style="margin-bottom: var(--space-md); color: var(--color-primary);">About This Opportunity</h3>
        <p style="line-height: 1.6; color: var(--color-gray-700);">${volunteer.description.full}</p>
      </div>

      <!-- Key Information -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-xl);">
        <div class="info-box">
          <strong>📅 Duration</strong>
          <p>${this.formatDuration(volunteer.duration)}</p>
          <p style="font-size: var(--font-sm); color: var(--color-gray-600);">
            ${window.VEFSUtils.formatDate(startDate)} - ${window.VEFSUtils.formatDate(endDate)}
          </p>
        </div>
        <div class="info-box">
          <strong>📍 Location</strong>
          <p>${volunteer.location.city}, ${volunteer.location.state}</p>
          <p style="font-size: var(--font-sm); color: var(--color-gray-600);">
            ${this.capitalize(volunteer.location.type)}
          </p>
        </div>
        <div class="info-box">
          <strong>⏰ Commitment</strong>
          <p>${volunteer.commitment}</p>
          <p style="font-size: var(--font-sm); color: var(--color-gray-600);">
            ${volunteer.spots.available} spots available
          </p>
        </div>
      </div>

      <!-- Requirements -->
      <div style="margin-bottom: var(--space-xl);">
        <h3 style="margin-bottom: var(--space-md); color: var(--color-primary);">Requirements</h3>
        <div style="display: grid; gap: var(--space-md);">
          <div>
            <strong>Age Range:</strong> ${volunteer.requirements.age.min} - ${volunteer.requirements.age.max} years
          </div>
          <div>
            <strong>Skills Needed:</strong>
            <ul style="margin-top: var(--space-xs); padding-left: var(--space-md);">
              ${volunteer.requirements.skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </div>
          ${volunteer.requirements.physical ? `
            <div>
              <strong>Physical Requirements:</strong>
              <p style="margin-top: var(--space-xs);">${volunteer.requirements.physical}</p>
            </div>
          ` : ''}
          ${volunteer.requirements.education ? `
            <div>
              <strong>Education:</strong>
              <p style="margin-top: var(--space-xs);">${volunteer.requirements.education}</p>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Benefits -->
      <div style="margin-bottom: var(--space-xl);">
        <h3 style="margin-bottom: var(--space-md); color: var(--color-primary);">What You'll Gain</h3>
        <div style="display: grid; gap: var(--space-md);">
          <div>
            <strong>Learning Outcomes:</strong>
            <ul style="margin-top: var(--space-xs); padding-left: var(--space-md);">
              ${volunteer.benefits.learning.map(outcome => `<li>${outcome}</li>`).join('')}
            </ul>
          </div>
          <div style="display: flex; gap: var(--space-lg); flex-wrap: wrap;">
            ${volunteer.benefits.certificate ? '<span style="color: var(--color-success);">✓ Certificate provided</span>' : ''}
            ${volunteer.benefits.meals ? '<span style="color: var(--color-success);">✓ Meals included</span>' : ''}
            ${volunteer.benefits.accommodation ? '<span style="color: var(--color-success);">✓ Accommodation provided</span>' : ''}
            ${hasStipend ? `<span style="color: var(--color-success);">✓ Stipend: ₹${volunteer.benefits.stipend.amount}/month</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Registration Form -->
      <div style="background: var(--color-gray-50); padding: var(--space-lg); border-radius: 8px;">
        <h3 style="margin-bottom: var(--space-md); color: var(--color-primary);">Apply for This Opportunity</h3>
        <form id="volunteer-registration-form" class="form" data-volunteer-id="${volunteer.id}">
          ${this.generateVolunteerFormFields(volunteer)}
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
            Submit Application
          </button>
        </form>
      </div>

      <!-- Contact Information -->
      <div style="margin-top: var(--space-lg); padding: var(--space-md); background: var(--color-primary-light); border-radius: 8px; color: var(--color-white);">
        <strong>Questions?</strong> Contact
        <a href="mailto:vefsfoundation@gmail.com" style="color: var(--color-white); font-weight: bold; text-decoration: underline;">vefsfoundation@gmail.com</a> or
        <a href="tel:+919342211488" style="color: var(--color-white); font-weight: bold; text-decoration: underline;">+91 9342211488</a>
      </div>
    `;

    // Setup form validation and submission with delay to ensure modal is rendered
    setTimeout(() => this.setupVolunteerRegistrationForm(volunteer), 100);

    // Open modal
    if (window.modalInstance) {
      window.modalInstance.open('volunteer-modal');
    }
  }

  /**
   * Generate form fields for volunteer registration
   * @param {Object} volunteer - Volunteer object
   * @returns {string} HTML string for form fields
   */
  generateVolunteerFormFields(volunteer) {
    const minAge = volunteer.requirements.age.min;
    const maxAge = volunteer.requirements.age.max;

    return `
      <div class="form-row">
        <div class="form-group">
          <label for="vol-name" class="form-label">Full Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" id="vol-name" name="name" class="form-input" required>
          <div class="form-error"></div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="vol-email" class="form-label">Email <span style="color: var(--color-error);">*</span></label>
          <input type="email" id="vol-email" name="email" class="form-input" required>
          <div class="form-error"></div>
        </div>

        <div class="form-group">
          <label for="vol-phone" class="form-label">Phone <span style="color: var(--color-error);">*</span></label>
          <input type="tel" id="vol-phone" name="phone" class="form-input" required pattern="[6-9][0-9]{9}" placeholder="98765 43210">
          <div class="form-error"></div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="vol-age" class="form-label">Age <span style="color: var(--color-error);">*</span></label>
          <input type="number" id="vol-age" name="age" class="form-input" min="${minAge}" max="${maxAge}" required>
          <div class="form-error"></div>
          <small style="color: var(--color-gray-600); font-size: var(--font-size-sm);">Must be between ${minAge} and ${maxAge} years</small>
        </div>
      </div>

      <div class="form-group">
        <label for="vol-motivation" class="form-label">Why do you want to volunteer with us? <span style="color: var(--color-error);">*</span></label>
        <textarea id="vol-motivation" name="motivation" class="form-input" rows="4" required minlength="20"></textarea>
        <div class="form-error"></div>
        <small style="color: var(--color-gray-600); font-size: var(--font-size-sm);">Minimum 20 characters</small>
      </div>

      <div class="form-group">
        <label for="vol-experience" class="form-label">Relevant Skills/Experience (Optional)</label>
        <textarea id="vol-experience" name="experience" class="form-input" rows="3"></textarea>
        <div class="form-error"></div>
      </div>
    `;
  }

  /**
   * Setup volunteer registration form validation and submission
   * @param {Object} volunteer - Volunteer object
   */
  setupVolunteerRegistrationForm(volunteer) {
    const form = document.getElementById('volunteer-registration-form');
    if (!form) {
      console.warn('Volunteer registration form not found');
      return;
    }

    // Get submit button reference
    const submitButton = form.querySelector('button[type="submit"]');

    // Initialize form validation
    if (window.FormValidation) {
      const minAge = volunteer.requirements.age.min;
      const maxAge = volunteer.requirements.age.max;

      new window.FormValidation(form, {
        name: { required: true, minLength: 2 },
        email: { required: true, email: true },
        phone: { required: true, phone: true },
        age: { required: true, min: minAge, max: maxAge },
        motivation: { required: true, minLength: 20 }
      });
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const registrationData = {
        type: 'volunteer',
        volunteerId: volunteer.id,
        volunteerTitle: volunteer.title,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        motivation: formData.get('motivation'),
        experience: formData.get('experience'),
        submittedAt: new Date().toISOString()
      };

      console.log('Volunteer registration submitted:', registrationData);

      // Disable submit button and show progress indicator
      this.setSubmitState(submitButton, true);

      // Send to Google Sheets
      try {
        const response = await this.sendToBackend(registrationData);

        if (response.success) {
          this.showSuccessModal(volunteer);
          form.reset();
        } else {
          this.showErrorMessage('Failed to submit application. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        this.showErrorMessage('An error occurred. Please try again or contact us directly.');
      } finally {
        // Re-enable submit button
        this.setSubmitState(submitButton, false);
      }
    });
  }

  /**
   * Handle hash navigation for direct links to volunteers
   */
  handleHashNavigation() {
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      const volunteer = this.volunteers.find(v => v.slug === hash || v.id === hash);

      if (volunteer) {
        setTimeout(() => {
          this.showDetails(volunteer.id);
        }, 100);
      }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.slice(1);
      if (newHash) {
        const volunteer = this.volunteers.find(v => v.slug === newHash || v.id === newHash);
        if (volunteer) {
          this.showDetails(volunteer.id);
        }
      }
    });
  }

  /**
   * Send volunteer application to Google Sheets via Google Apps Script
   */
  async sendToBackend(data) {
    // Check if running in test mode (file protocol or placeholder URL)
    // Note: localhost is allowed to enable testing with Google Sheets
    const isTestMode = !GOOGLE_SCRIPT_URL ||
                       GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' ||
                       window.location.protocol === 'file:';

    if (isTestMode) {
      console.warn('⚠️ Running in test mode. Application data:', data);
      return {
        success: true,
        message: 'Test mode - Application logged to console'
      };
    }

    const payload = {
      formType: 'volunteer',
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      age: data.age || '',
      motivation: data.motivation || '',
      experience: data.experience || '',
      volunteerId: data.volunteerId,
      volunteerTitle: data.volunteerTitle,
      timestamp: new Date().toISOString()
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

      console.log('Volunteer application submitted to Google Sheets');
      return {
        success: true,
        message: 'Application successful!'
      };

    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
      return {
        success: false,
        message: 'Failed to submit application. Please try again.'
      };
    }
  }

  /**
   * Show success modal after application submission
   * @param {Object} volunteer - Volunteer opportunity object
   */
  showSuccessModal(volunteer) {
    const modal = document.createElement('div');
    modal.id = 'volunteer-success-modal';
    modal.innerHTML = `
      <div id="success-modal-backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 10000; cursor: pointer;">
        <div id="success-modal-content" style="background: white; padding: 40px; border-radius: 12px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); cursor: default;">
          <div style="font-size: 4rem; color: #6B8E23; margin-bottom: 20px;">✓</div>
          <h3 style="font-size: 28px; color: #6B8E23; margin-bottom: 16px; font-weight: 600;">
            Application Submitted!
          </h3>
          <p style="font-size: 18px; color: #4a5568; margin-bottom: 24px; line-height: 1.6;">
            Thank you for applying to <strong>${volunteer.title}</strong>!<br>
            Please check your email for confirmation.<br>
            We'll review your application and contact you soon.
          </p>
          <button id="success-modal-btn" style="background: #6B8E23; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: not-allowed; min-width: 120px; opacity: 0.6;" disabled>
            OK
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Track whether modal can be closed
    let canClose = false;

    // Function to close modal and navigate back to volunteer page
    const closeModalAndNavigate = () => {
      if (!canClose) return;

      // Remove success modal
      document.getElementById('volunteer-success-modal').remove();

      // Clear the hash to go back to main volunteer page
      window.location.hash = '';

      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Enable closing after 3 seconds
    setTimeout(() => {
      canClose = true;
      const button = document.getElementById('success-modal-btn');
      if (button) {
        button.disabled = false;
        button.style.cursor = 'pointer';
        button.style.opacity = '1';
      }
    }, 3000);

    // Add event listener to OK button
    const button = document.getElementById('success-modal-btn');
    if (button) {
      button.addEventListener('click', closeModalAndNavigate);
    }

    // Add event listener to backdrop (click anywhere outside)
    const backdrop = document.getElementById('success-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        // Only close if clicking the backdrop itself, not the modal content
        if (e.target === backdrop) {
          closeModalAndNavigate();
        }
      });
    }

    // Prevent clicks on modal content from bubbling to backdrop
    const content = document.getElementById('success-modal-content');
    if (content) {
      content.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Close the volunteer details modal immediately (matching events.js pattern)
    // This ensures when success modal closes, user sees the main volunteer page
    if (window.modalInstance) {
      window.modalInstance.close();
    }
  }

  /**
   * Set submit button state (disable/enable with progress indicator)
   * @param {HTMLElement} button - Submit button element
   * @param {boolean} isSubmitting - Whether form is currently submitting
   */
  setSubmitState(button, isSubmitting) {
    if (!button) return;

    if (isSubmitting) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.innerHTML = `
        <span class="spinner spinner-sm" style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; border-width: 2px;"></span>
        Submitting...
      `;
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Apply Now';
    }
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    const alertHtml = `
      <div class="alert alert-error" role="alert" style="position: fixed; top: 80px; right: 20px; z-index: 1100; max-width: 400px; animation: slideInRight 0.3s ease-out;">
        <strong>✗ Submission Failed</strong>
        <p>${message}</p>
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', alertHtml);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      const alert = document.querySelector('.alert-error');
      if (alert) alert.remove();
    }, 5000);
  }

  /**
   * Helper: Format duration
   */
  formatDuration(duration) {
    if (typeof duration === 'string') return duration;
    if (duration && duration.value && duration.unit) {
      return `${duration.value} ${duration.unit}`;
    }
    return 'TBD';
  }

  /**
   * Helper: Capitalize first letter
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.volunteersPageInstance = new VolunteersPage();
  });
} else {
  window.volunteersPageInstance = new VolunteersPage();
}
