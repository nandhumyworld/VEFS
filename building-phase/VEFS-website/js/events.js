/**
 * Events Page JavaScript
 * Handles event filtering and display
 */

// CONFIGURATION: Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyw2vis0PY7STZ9yYqgHGyI0vxEkxH64c6-Ll31cj6qCU5_07QMQDHzwZc6H4NwMZJh/exec';

class EventsPage {
  constructor() {
    this.events = [];
    this.filteredEvents = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    await this.loadEvents();
    this.renderEvents();
    this.setupFilters();
    this.handleHashNavigation();
  }

  async loadEvents() {
    try {
      const response = await fetch('data/events.json');
      if (!response.ok) throw new Error('Failed to load events');
      const data = await response.json();
      this.events = data.events.sort((a, b) => new Date(a.date.start) - new Date(b.date.start));
      this.filteredEvents = this.events;
    } catch (error) {
      console.error('Error loading events:', error);
      this.showError();
    }
  }

  filterEvents(filter) {
    this.currentFilter = filter;

    if (filter === 'all') {
      this.filteredEvents = this.events;
    } else if (filter === 'upcoming') {
      this.filteredEvents = this.events.filter(e => e.status === 'upcoming');
    } else {
      this.filteredEvents = this.events.filter(e => e.type === filter);
    }

    this.renderEvents();
  }

  renderEvents() {
    const container = document.getElementById('events-container');
    const noResults = document.getElementById('no-results');

    if (!container) return;

    if (this.filteredEvents.length === 0) {
      container.innerHTML = '';
      if (noResults) noResults.classList.remove('hidden');
      return;
    }

    if (noResults) noResults.classList.add('hidden');

    container.innerHTML = this.filteredEvents.map(event => {
      const startDate = new Date(event.date.start);
      const isPast = event.status === 'completed';
      const isFull = event.status === 'full';
      // Handle fee - support both old format (event.fee) and new format (event.registration.fee.amount)
      const feeAmount = event.registration?.fee?.amount !== undefined ? event.registration.fee.amount : (event.fee || 0);
      const isFree = feeAmount === 0;

      return `
        <div class="card animate-fade-in">
          ${event.images?.featured ? `
            <div class="card-image">
              <img src="${event.images.featured}" alt="${event.title}" loading="lazy">
              ${event.featured ? '<span class="card-badge card-badge-featured" style="position: absolute; top: var(--space-sm); left: var(--space-sm);">Featured</span>' : ''}
              ${isFull ? '<span class="card-badge card-badge-danger" style="position: absolute; top: var(--space-sm); right: var(--space-sm);">Full</span>' : ''}
              ${isPast ? '<span class="card-badge" style="position: absolute; top: var(--space-sm); right: var(--space-sm); background-color: var(--color-gray-600);">Completed</span>' : ''}
            </div>
          ` : ''}
          <div class="card-body">
            <div class="card-meta" style="margin-bottom: var(--space-sm);">
              <span>📅 ${window.VEFSUtils.formatDate(startDate)}</span>
              <span>📍 ${event.location.city}</span>
            </div>
            <h3 class="card-title">${event.title}</h3>
            <p class="card-description">${event.shortDescription}</p>

            <div class="card-footer" style="margin-top: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: var(--color-primary);">${isFree ? 'FREE' : '₹' + feeAmount}</span>
              <button class="btn btn-sm ${isFull || isPast ? 'btn-outline' : 'btn-primary'}" onclick="eventsPageInstance.showDetails('${event.id}')">
                ${isPast ? 'View Details' : isFull ? 'View Details' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  showDetails(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    const modalBody = document.getElementById('event-modal-body');
    if (!modalBody) return;

    window.location.hash = event.id;

    const startDate = new Date(event.date.start);
    const endDate = new Date(event.date.end);
    const isPast = event.status === 'completed';
    const isFull = event.status === 'full';

    // Handle fee - support both old format (event.fee) and new format (event.registration.fee.amount)
    const feeAmount = event.registration?.fee?.amount !== undefined ? event.registration.fee.amount : (event.fee || 0);
    const isFree = feeAmount === 0;

    modalBody.innerHTML = `
      <!-- Header Image -->
      ${event.images?.hero ? `
        <img src="${event.images.hero}" alt="${event.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
      ` : ''}

      <!-- Title and Description -->
      <div style="margin-bottom: var(--space-lg);">
        <h2 id="event-modal-title" style="font-size: var(--font-size-3xl); color: var(--color-primary); margin-bottom: var(--space-sm);">
          ${event.title}
        </h2>
        <p style="font-size: var(--font-size-lg); color: var(--color-gray-700);">
          ${event.shortDescription}
        </p>
      </div>

      <!-- Key Details Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-xl); padding: var(--space-lg); background-color: var(--color-gray-50); border-radius: var(--radius-md);">
        <div>
          <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">📅 Date</div>
          <div style="font-weight: 600;">${window.VEFSUtils.formatDate(startDate)}</div>
        </div>
        <div>
          <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">⏰ Time</div>
          <div style="font-weight: 600;">${window.VEFSUtils.formatDate(startDate, 'time')} - ${window.VEFSUtils.formatDate(endDate, 'time')}</div>
        </div>
        <div>
          <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">📍 Location</div>
          <div style="font-weight: 600;">${event.location.venue || event.location.city}</div>
        </div>
        <div>
          <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">💰 Donation</div>
          <div style="font-weight: 600; color: ${isFree ? 'var(--color-success)' : 'var(--color-gray-900)'};">
            ${isFree ? 'FREE' : '₹' + feeAmount}
          </div>
        </div>
        ${event.capacity ? `
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">👥 Capacity</div>
            <div style="font-weight: 600;">${typeof event.capacity === 'object' ? (event.capacity.total + ' participants' + (event.capacity.available !== undefined ? ' (' + event.capacity.available + ' available)' : '')) : (event.capacity + ' participants')}</div>
          </div>
        ` : ''}
      </div>

      <!-- Full Description -->
      ${event.fullDescription ? `
        <div style="margin-bottom: var(--space-xl);">
          <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">About This Event</h3>
          <p style="color: var(--color-gray-700); line-height: 1.8; white-space: pre-line;">${event.fullDescription}</p>
        </div>
      ` : ''}

      <!-- Agenda/Schedule -->
      ${event.agenda && event.agenda.length > 0 ? `
        <div style="margin-bottom: var(--space-xl);">
          <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">Event Agenda</h3>
          ${event.agenda.map(item => `
            <div style="padding: var(--space-md); margin-bottom: var(--space-sm); background-color: var(--color-gray-50); border-left: 4px solid var(--color-primary); border-radius: var(--radius-sm);">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="font-weight: 600;">${item.title}</div>
                <div style="color: var(--color-gray-600); font-size: var(--font-size-sm);">${item.time}</div>
              </div>
              ${item.description ? `<p style="margin-top: var(--space-xs); color: var(--color-gray-700);">${item.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Speakers/Facilitators -->
      ${event.speakers && event.speakers.length > 0 ? `
        <div style="margin-bottom: var(--space-xl);">
          <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">Speaker${event.speakers.length > 1 ? 's' : ''}</h3>
          ${event.speakers.map(speaker => `
            <div style="display: flex; gap: var(--space-lg); align-items: start; padding: var(--space-lg); background-color: var(--color-gray-50); border-radius: var(--radius-md); margin-bottom: var(--space-md);">
              ${speaker.photo ? `
                <img src="${speaker.photo}" alt="${speaker.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
              ` : ''}
              <div>
                <div style="font-weight: 600; font-size: var(--font-size-lg); margin-bottom: var(--space-xs);">${speaker.name}</div>
                <div style="color: var(--color-gray-600); font-size: var(--font-size-sm); margin-bottom: var(--space-xs);">${speaker.title || speaker.role}</div>
                ${speaker.bio ? `<p style="color: var(--color-gray-700); margin: 0;">${speaker.bio}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Organizer Info -->
      ${event.organizer ? `
        <div style="padding: var(--space-lg); background-color: var(--color-primary-light); border-radius: var(--radius-md); margin-bottom: var(--space-xl);">
          <h4 style="color: var(--color-primary); margin-bottom: var(--space-sm);">Event Organizer</h4>
          <div style="color: var(--color-gray-700);">
            <strong>${event.organizer.name}</strong><br>
            ${event.organizer.email ? `<a href="mailto:${event.organizer.email}" style="color: var(--color-primary);">${event.organizer.email}</a>` : ''}
            ${event.organizer.phone ? ` | <a href="tel:${event.organizer.phone}" style="color: var(--color-primary);">${event.organizer.phone}</a>` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Call to Action / Registration Form -->
      ${isPast ? `
        <div style="margin-top: var(--space-2xl); padding-top: var(--space-xl); border-top: 2px solid var(--color-gray-200);">
          <p style="text-align: center; color: var(--color-gray-600); margin-bottom: var(--space-md);">
            This event has been completed. Check back for future events!
          </p>
          <a href="/events.html" class="btn btn-outline" style="width: 100%;">View All Events</a>
        </div>
      ` : isFull ? `
        <div style="margin-top: var(--space-2xl); padding-top: var(--space-xl); border-top: 2px solid var(--color-gray-200);">
          <p style="text-align: center; color: var(--color-gray-600); margin-bottom: var(--space-md);">
            This event is currently full. Contact us to join the waitlist.
          </p>
          <a href="/contact.html?inquiry=event&event=${event.id}" class="btn btn-primary" style="width: 100%;">Join Waitlist</a>
        </div>
      ` : `
        <div style="background: var(--color-gray-50); padding: var(--space-xl); border-radius: var(--radius-md); margin-top: var(--space-2xl);">
          <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md); color: var(--color-primary);">Register for This Event</h3>
          <form id="event-registration-form" class="form" data-event-id="${event.id}">
            ${this.generateEventFormFields(event)}
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
              ${isFree ? 'Register Now' : 'Register & View Payment Details'}
            </button>
          </form>
        </div>
      `}
    `;

    // Setup form validation and submission if form is present
    if (!isPast && !isFull) {
      setTimeout(() => this.setupEventRegistrationForm(event), 100);
    }

    if (window.modalInstance) {
      window.modalInstance.open('event-modal');
    }
  }

  /**
   * Generate form fields for event registration
   * @param {Object} event - Event object
   * @returns {string} HTML string for form fields
   */
  generateEventFormFields(event) {
    const minAge = event.requirements?.age?.min || 0;
    const maxAge = event.requirements?.age?.max || 100;

    return `
      <div class="form-row">
        <div class="form-group">
          <label for="event-name" class="form-label">Full Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" id="event-name" name="name" class="form-input" required>
          <div class="form-error"></div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="event-email" class="form-label">Email <span style="color: var(--color-error);">*</span></label>
          <input type="email" id="event-email" name="email" class="form-input" required>
          <div class="form-error"></div>
        </div>

        <div class="form-group">
          <label for="event-phone" class="form-label">Phone <span style="color: var(--color-error);">*</span></label>
          <input type="tel" id="event-phone" name="phone" class="form-input" required pattern="[6-9][0-9]{9}" placeholder="98765 43210">
          <div class="form-error"></div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="event-age" class="form-label">Age <span style="color: var(--color-error);">*</span></label>
          <input type="number" id="event-age" name="age" class="form-input" min="${minAge}" max="${maxAge}" required>
          <div class="form-error"></div>
          ${minAge > 0 ? `<small style="color: var(--color-gray-600); font-size: var(--font-size-sm);">Must be between ${minAge} and ${maxAge} years</small>` : ''}
        </div>

        <div class="form-group">
          <label for="event-attendees" class="form-label">Number of Attendees <span style="color: var(--color-error);">*</span></label>
          <input type="number" id="event-attendees" name="attendees" class="form-input" min="1" max="10" value="1" required>
          <div class="form-error"></div>
          <small style="color: var(--color-gray-600); font-size: var(--font-size-sm);">Maximum 10 attendees per registration</small>
        </div>
      </div>
    `;
  }

  /**
   * Setup event registration form validation and submission
   * @param {Object} event - Event object
   */
  setupEventRegistrationForm(event) {
    const form = document.getElementById('event-registration-form');
    if (!form) {
      console.warn('Event registration form not found');
      return;
    }

    // Get submit button reference
    const submitButton = form.querySelector('button[type="submit"]');

    // Initialize form validation
    if (window.FormValidation) {
      const minAge = event.requirements?.age?.min || 0;
      const maxAge = event.requirements?.age?.max || 100;

      new window.FormValidation(form, {
        name: { required: true, minLength: 2 },
        email: { required: true, email: true },
        phone: { required: true, phone: true },
        age: { required: true, min: minAge, max: maxAge },
        attendees: { required: true, min: 1, max: 10 }
      });
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      // Handle fee - support both old format (event.fee) and new format (event.registration.fee.amount)
      const feeAmount = event.registration?.fee?.amount !== undefined ? event.registration.fee.amount : (event.fee || 0);
      const registrationData = {
        type: 'event',
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date.start,
        eventFee: feeAmount,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        attendees: formData.get('attendees'),
        submittedAt: new Date().toISOString()
      };

      console.log('Event registration submitted:', registrationData);

      // Disable submit button and show progress indicator
      this.setSubmitState(submitButton, true);

      // Send to Google Sheets instead of sessionStorage
      try {
        const response = await this.sendToBackend(registrationData);

        if (response.success) {
          this.showSuccessModal(event);
          form.reset();
        } else {
          this.showErrorMessage('Failed to submit registration. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting registration:', error);
        this.showErrorMessage('An error occurred. Please try again or contact us directly.');
      } finally {
        // Re-enable submit button
        this.setSubmitState(submitButton, false);
      }
    });
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.filterEvents(button.getAttribute('data-filter'));
      });
    });
  }

  handleHashNavigation() {
    if (window.location.hash) {
      const eventId = window.location.hash.substring(1);
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        setTimeout(() => this.showDetails(event.id), 100);
      }
    }
  }

  showError() {
    const container = document.getElementById('events-container');
    if (!container) return;
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl);">
        <div class="alert alert-error">Unable to load events. Please try again later.</div>
      </div>
    `;
  }

  /**
   * Send registration data to Google Sheets via Google Apps Script
   */
  async sendToBackend(data) {
    // Check if running in test mode (file protocol or placeholder URL)
    // Note: localhost is allowed to enable testing with Google Sheets
    const isTestMode = !GOOGLE_SCRIPT_URL ||
                       GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' ||
                       window.location.protocol === 'file:';

    if (isTestMode) {
      console.warn('⚠️ Running in test mode. Registration data:', data);
      return {
        success: true,
        message: 'Test mode - Registration logged to console'
      };
    }

    // Production: Send to Google Sheets
    const payload = {
      formType: 'event',
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      age: data.age || '',
      attendees: data.attendees || 1,
      eventId: data.eventId,
      eventTitle: data.eventTitle,
      eventDate: data.eventDate,
      eventFee: data.eventFee || 0,
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

      console.log('Event registration submitted to Google Sheets');
      return {
        success: true,
        message: 'Registration successful!'
      };

    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
      return {
        success: true,
        message: 'Registration received!'
      };
    }
  }

  /**
   * Show success modal after registration
   */
  showSuccessModal(event) {
    // Handle fee - support both old format (event.fee) and new format (event.registration.fee.amount)
    const feeAmount = event.registration?.fee?.amount !== undefined ? event.registration.fee.amount : (event.fee || 0);
    const hasFee = feeAmount > 0;

    const modal = document.createElement('div');
    modal.id = 'registration-success-modal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div style="background: white; padding: 40px; border-radius: 12px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
          <div style="font-size: 4rem; color: #6B8E23; margin-bottom: 20px;">✓</div>
          <h3 style="font-size: 28px; color: #6B8E23; margin-bottom: 16px; font-weight: 600;">
            Registration Successful!
          </h3>
          <p style="font-size: 18px; color: #4a5568; margin-bottom: 24px; line-height: 1.6;">
            Thank you for registering for <strong>${event.title}</strong>!<br>
            Please check your email for confirmation.${hasFee ? '<br>Click below to proceed with payment.' : '<br>We\'ll send you event details shortly.'}
          </p>
          <button id="success-modal-btn" style="background: #6B8E23; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; min-width: 120px;">
            ${hasFee ? 'Proceed to Payment' : 'OK'}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listener instead of inline onclick
    const button = document.getElementById('success-modal-btn');
    if (button) {
      button.addEventListener('click', () => {
        document.getElementById('registration-success-modal').remove();
        if (hasFee) {
          this.showPaymentModal(event);
        } else {
          if (window.modalInstance) {
            window.modalInstance.close();
          }
        }
      });
    }

    // Close the registration modal if it's open
    if (window.modalInstance) {
      window.modalInstance.close();
    }
  }

  /**
   * Show payment instructions modal
   */
  showPaymentModal(event) {
    // Handle fee - support both old format (event.fee) and new format (event.registration.fee.amount)
    const feeAmount = event.registration?.fee?.amount !== undefined ? event.registration.fee.amount : (event.fee || 0);

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
    modal.id = 'payment-modal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 10000; overflow-y: auto; padding: 20px;">
        <div style="background: white; padding: 32px; border-radius: 12px; max-width: 700px; width: 100%; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h3 style="font-size: 24px; color: #D4A574; margin: 0; font-weight: 600;">💳 Payment Instructions</h3>
            <button onclick="document.getElementById('payment-modal').remove();" style="background: none; border: none; font-size: 28px; color: #999; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">&times;</button>
          </div>

          <div style="background: #FFF9E6; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 2px solid #D4A574;">
            <p style="font-size: 20px; margin: 0 0 8px 0; font-weight: 600; color: #333;">Donation Amount: ₹${feeAmount}</p>
            <p style="font-size: 14px; margin: 0; color: #666;">This amount is treated as a donation to support our environmental conservation efforts.</p>
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
          <div style="background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(107, 142, 35, 0.2)); padding: 20px; border-radius: 8px; border-left: 4px solid #D4A574;">
            <h4 style="font-size: 18px; margin: 0 0 12px 0; color: #D4A574;">📸 Important: Send Payment Confirmation</h4>
            <p style="margin: 0 0 16px 0; color: #333; font-size: 14px;">After making the payment, please send a screenshot of the payment confirmation <strong>along with your name</strong> to:</p>

            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="https://wa.me/${PAYMENT_INFO.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Payment%20confirmation%20for%20${encodeURIComponent(event.title)}"
                 target="_blank"
                 rel="noopener"
                 style="display: inline-flex; align-items: center; gap: 8px; background-color: #25D366; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
                📱 WhatsApp
              </a>

              <a href="mailto:${PAYMENT_INFO.contact.email}?subject=Payment%20Confirmation%20-%20${encodeURIComponent(event.title)}"
                 style="display: inline-flex; align-items: center; gap: 8px; background-color: #6B8E23; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
                ✉️ Email
              </a>
            </div>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <button onclick="document.getElementById('payment-modal').remove();" style="background: #6B8E23; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer;">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
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
        Registering...
      `;
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Register';
    }
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    const alertHtml = `
      <div class="alert alert-error" role="alert" style="position: fixed; top: 80px; right: 20px; z-index: 1100; max-width: 400px; animation: slideInRight 0.3s ease-out;">
        <strong>✗ Registration Failed</strong>
        <p>${message}</p>
        <button class="alert-close" onclick="this.parentElement.remove()" aria-label="Close alert">×</button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', alertHtml);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      const alert = document.querySelector('.alert-error');
      if (alert) alert.remove();
    }, 5000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.eventsPageInstance = new EventsPage();
  });
} else {
  window.eventsPageInstance = new EventsPage();
}
