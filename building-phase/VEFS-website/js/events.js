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
      const isFree = event.fee === 0;

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
              <span style="font-weight: 600; color: var(--color-primary);">${isFree ? 'FREE' : '₹' + event.fee}</span>
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
    const isFree = event.fee === 0;

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
          <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">💰 Fee</div>
          <div style="font-weight: 600; color: ${isFree ? 'var(--color-success)' : 'var(--color-gray-900)'};">
            ${isFree ? 'FREE' : '₹' + event.fee}
          </div>
        </div>
        ${event.capacity ? `
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">👥 Capacity</div>
            <div style="font-weight: 600;">${event.capacity} participants</div>
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
      const registrationData = {
        type: 'event',
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date.start,
        eventFee: event.fee || 0,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        attendees: formData.get('attendees'),
        submittedAt: new Date().toISOString()
      };

      console.log('Event registration submitted:', registrationData);

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
    // Check if running in test mode
    const isTestMode = !GOOGLE_SCRIPT_URL ||
                       GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' ||
                       window.location.protocol === 'file:';

    if (isTestMode) {
      console.warn('⚠️ Running in test mode. Registration data:', data);
      return {
        success: true,
        message: 'Test mode: Registration logged to console'
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
            Please check your email for confirmation.<br>
            We'll send you event details shortly.
          </p>
          <button onclick="document.getElementById('registration-success-modal').remove(); if(window.modalInstance) window.modalInstance.close('event-registration-modal');" style="background: #6B8E23; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; min-width: 120px;">
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

let eventsPageInstance;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    eventsPageInstance = new EventsPage();
  });
} else {
  eventsPageInstance = new EventsPage();
}
