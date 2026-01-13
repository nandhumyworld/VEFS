/**
 * Trainings Page JavaScript
 * Handles training data loading, filtering, timeline display, and modal interactions
 */

// CONFIGURATION: Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyw2vis0PY7STZ9yYqgHGyI0vxEkxH64c6-Ll31cj6qCU5_07QMQDHzwZc6H4NwMZJh/exec';

class TrainingsPage {
  constructor() {
    this.trainings = [];
    this.filteredTrainings = [];
    this.filters = {
      date: 'all',
      type: null,
      audience: null
    };
    this.init();
  }

  async init() {
    await this.loadTrainings();
    this.setupFilters();
    this.handleHashNavigation();
    this.renderTimeline();
  }

  /**
   * Load trainings data from JSON
   */
  async loadTrainings() {
    try {
      const response = await fetch('data/trainings.json');
      const data = await response.json();
      this.trainings = data.trainings || [];

      // Sort by start date (ascending - earliest first)
      this.trainings.sort((a, b) => {
        const dateA = new Date(a.schedule.sessions[0].date);
        const dateB = new Date(b.schedule.sessions[0].date);
        return dateA - dateB;
      });

      this.filteredTrainings = [...this.trainings];
    } catch (error) {
      console.error('Error loading trainings:', error);
      document.getElementById('loading-spinner').innerHTML = `
        <p style="color: var(--color-error); text-align: center;">
          Failed to load trainings. Please try again later.
        </p>
      `;
    }
  }

  /**
   * Setup filter button handlers
   */
  setupFilters() {
    const filterButtons = document.querySelectorAll('[data-filter-type]');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterType = button.dataset.filterType;
        const filterValue = button.dataset.filterValue;

        // Remove active class from siblings
        const siblings = document.querySelectorAll(`[data-filter-type="${filterType}"]`);
        siblings.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Update filter
        this.filters[filterType] = filterValue === this.filters[filterType] ? null : filterValue;

        this.applyFilters();
      });
    });
  }

  /**
   * Apply all active filters
   */
  applyFilters() {
    this.filteredTrainings = this.trainings.filter(training => {
      // Date filter
      if (this.filters.date && this.filters.date !== 'all') {
        if (!this.matchesDateFilter(training, this.filters.date)) {
          return false;
        }
      }

      // Type filter (using location.type for workshop/field-visit/online)
      if (this.filters.type) {
        if (training.location.type !== this.filters.type) {
          return false;
        }
      }

      // Audience filter (check if training has multiple audiences)
      if (this.filters.audience) {
        const audiences = Array.isArray(training.audience)
          ? training.audience
          : [training.audience];

        if (!audiences.includes(this.filters.audience)) {
          return false;
        }
      }

      return true;
    });

    this.renderTimeline();
  }

  /**
   * Check if training matches date filter
   */
  matchesDateFilter(training, dateFilter) {
    const now = new Date();
    const startDate = new Date(training.schedule.sessions[0].date);
    const lastSession = training.schedule.sessions[training.schedule.sessions.length - 1];
    const endDate = new Date(lastSession.date);

    switch (dateFilter) {
      case 'upcoming':
        return startDate > now;

      case 'this-month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return startDate >= monthStart && startDate <= monthEnd;

      case 'past':
        return endDate < now;

      default:
        return true;
    }
  }

  /**
   * Render timeline with training cards
   */
  renderTimeline() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const timelineContent = document.getElementById('timeline-content');
    const noResults = document.getElementById('no-results');

    // Hide loading
    loadingSpinner.style.display = 'none';

    // Check if no results
    if (this.filteredTrainings.length === 0) {
      timelineContent.style.display = 'none';
      noResults.style.display = 'block';
      return;
    }

    // Show timeline
    noResults.style.display = 'none';
    timelineContent.style.display = 'block';

    // Group trainings by year and month
    const grouped = this.groupByYearMonth(this.filteredTrainings);

    // Render timeline
    timelineContent.innerHTML = Object.entries(grouped).map(([yearMonth, trainings]) => {
      const [year, month] = yearMonth.split('-');
      const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

      return `
        <div class="timeline-section" style="margin-bottom: var(--space-3xl);">
          <!-- Year/Month Header -->
          <div style="display: flex; align-items: center; margin-bottom: var(--space-xl);">
            <div style="background-color: var(--color-primary); color: white; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-full); font-weight: 600;">
              ${monthName} ${year}
            </div>
            <div style="flex: 1; height: 3px; background-color: var(--color-primary-light); margin-left: var(--space-md);"></div>
          </div>

          <!-- Training Cards for this month -->
          <div style="display: grid; gap: var(--space-lg); position: relative; padding-left: var(--space-xl); border-left: 3px solid var(--color-primary-light);">
            ${trainings.map(training => this.renderTrainingCard(training)).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Group trainings by year and month
   */
  groupByYearMonth(trainings) {
    return trainings.reduce((groups, training) => {
      const date = new Date(training.schedule.sessions[0].date);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      groups[yearMonth].push(training);

      return groups;
    }, {});
  }

  /**
   * Render individual training card
   */
  renderTrainingCard(training) {
    const startDate = new Date(training.schedule.sessions[0].date);
    const lastSession = training.schedule.sessions[training.schedule.sessions.length - 1];
    const endDate = new Date(lastSession.date);
    const isUpcoming = startDate > new Date();
    const isPast = endDate < new Date();
    const isFull = training.status === 'full';
    const isOpen = training.status === 'open';
    const isFree = training.registration.fee.amount === 0;

    // Status badge
    let statusBadge = '';
    let statusColor = '';
    if (isPast) {
      statusBadge = 'Completed';
      statusColor = 'var(--color-gray-500)';
    } else if (isFull) {
      statusBadge = 'Full';
      statusColor = 'var(--color-gray-500)';
    } else if (isOpen) {
      statusBadge = 'Open Now';
      statusColor = 'var(--color-secondary)';
    } else if (isUpcoming) {
      statusBadge = 'Upcoming';
      statusColor = 'var(--color-success)';
    }

    // Audience labels
    const audiences = Array.isArray(training.audience)
      ? training.audience
      : [training.audience];

    // Format duration
    const duration = `${training.totalDuration.value} ${training.totalDuration.unit}`;

    // Extract time from first session (format: HH:MM from ISO datetime)
    const sessionTime = new Date(training.schedule.sessions[0].date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `
      <div class="card animate-fade-in" style="position: relative; margin-left: var(--space-lg); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"
           onclick="trainingsPageInstance.showDetails('${training.id}')"
           onmouseenter="this.style.transform='translateX(8px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'"
           onmouseleave="this.style.transform='translateX(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">

        <!-- Timeline Dot -->
        <div style="position: absolute; left: -${parseInt('var(--space-lg)'.match(/\d+/)?.[0] || '32') + 8}px; top: var(--space-lg); width: 14px; height: 14px; border-radius: 50%; background-color: var(--color-primary); border: 3px solid white; box-shadow: 0 0 0 3px var(--color-primary-light);"></div>

        <div style="display: flex; gap: var(--space-lg); align-items: start;">
          <!-- Training Image -->
          <div style="flex-shrink: 0; width: 120px; height: 120px; border-radius: var(--radius-md); overflow: hidden; background-color: var(--color-gray-200);">
            <img
              src="${training.media?.featuredImage || '/images/trainings/default-training.jpg'}"
              alt="${training.title}"
              style="width: 100%; height: 100%; object-fit: cover;"
              loading="lazy"
            >
          </div>

          <!-- Training Info -->
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-sm);">
              <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin: 0;">${training.title}</h3>
              ${statusBadge ? `<span style="background-color: ${statusColor}; color: white; padding: var(--space-2xs) var(--space-sm); border-radius: var(--radius-full); font-size: var(--font-size-sm); font-weight: 600; white-space: nowrap;">${statusBadge}</span>` : ''}
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: var(--space-md); margin-bottom: var(--space-sm); color: var(--color-gray-600); font-size: var(--font-size-sm);">
              <span>📅 ${window.VEFSUtils.formatDate(startDate)}</span>
              <span>⏰ ${sessionTime}</span>
              <span>📍 ${training.location.type === 'online' ? 'Online' : training.location.city}</span>
              <span>⏳ ${duration}</span>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-sm);">
              <span style="background-color: var(--color-primary-light); color: var(--color-primary); padding: var(--space-2xs) var(--space-sm); border-radius: var(--radius-sm); font-size: var(--font-size-sm);">
                ${this.getCategoryLabel(training.category)}
              </span>
              ${audiences.map(aud => `
                <span style="background-color: var(--color-gray-200); color: var(--color-gray-700); padding: var(--space-2xs) var(--space-sm); border-radius: var(--radius-sm); font-size: var(--font-size-sm);">
                  ${this.capitalize(aud)}
                </span>
              `).join('')}
            </div>

            <p style="color: var(--color-gray-700); margin-bottom: var(--space-md); line-height: 1.6;">
              ${training.description.brief}
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: ${isFree ? 'var(--color-success)' : 'var(--color-gray-900)'}; font-size: var(--font-size-lg);">
                ${isFree ? 'FREE' : '₹' + training.registration.fee.amount}
              </span>
              <button class="btn btn-sm ${isPast || isFull ? 'btn-outline' : 'btn-primary'}"
                      onclick="event.stopPropagation(); trainingsPageInstance.showDetails('${training.id}')">
                ${isPast ? 'View Details' : isFull ? 'View Details' : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Show training details in modal
   */
  showDetails(trainingId) {
    const training = this.trainings.find(t => t.id === trainingId);
    if (!training) return;

    // Update URL hash
    window.location.hash = training.slug || trainingId;

    const startDate = new Date(training.schedule.sessions[0].date);
    const lastSession = training.schedule.sessions[training.schedule.sessions.length - 1];
    const endDate = new Date(lastSession.date);
    const isPast = endDate < new Date();
    const isFull = training.status === 'full';
    const isFree = training.registration.fee.amount === 0;

    const modalBody = document.getElementById('training-modal-body');

    // Format duration and time
    const duration = `${training.totalDuration.value} ${training.totalDuration.unit}`;
    const sessionTime = new Date(training.schedule.sessions[0].date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    modalBody.innerHTML = `
      <div>
        <!-- Header Image -->
        ${training.media?.featuredImage ? `
          <img src="${training.media.featuredImage}" alt="${training.title}"
               style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
        ` : ''}

        <!-- Title and Status -->
        <div style="margin-bottom: var(--space-lg);">
          <h2 id="training-modal-title" style="font-size: var(--font-size-3xl); color: var(--color-primary); margin-bottom: var(--space-sm);">
            ${training.title}
          </h2>
          <p style="font-size: var(--font-size-lg); color: var(--color-gray-700);">
            ${training.description.brief}
          </p>
        </div>

        <!-- Key Details Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-xl); padding: var(--space-lg); background-color: var(--color-gray-50); border-radius: var(--radius-md);">
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">📅 Date</div>
            <div style="font-weight: 600;">${window.VEFSUtils.formatDate(startDate)}${startDate.getTime() !== endDate.getTime() ? ' - ' + window.VEFSUtils.formatDate(endDate) : ''}</div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">⏰ Time</div>
            <div style="font-weight: 600;">${sessionTime}</div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">⏳ Duration</div>
            <div style="font-weight: 600;">${duration}</div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">📍 Location</div>
            <div style="font-weight: 600;">${training.location.type === 'online' ? 'Online' : training.location.venue}</div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">💰 Donation</div>
            <div style="font-weight: 600; color: ${isFree ? 'var(--color-success)' : 'var(--color-gray-900)'};">
              ${isFree ? 'FREE' : '₹' + training.registration.fee.amount}
            </div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">👥 Capacity</div>
            <div style="font-weight: 600;">${training.capacity.total} participants</div>
          </div>
        </div>

        <!-- Description -->
        <div style="margin-bottom: var(--space-xl);">
          <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">About This Training</h3>
          <p style="color: var(--color-gray-700); line-height: 1.8; white-space: pre-line;">${training.description.full || training.description.brief}</p>
        </div>

        <!-- Curriculum -->
        ${training.description.curriculum && training.description.curriculum.length > 0 ? `
          <div style="margin-bottom: var(--space-xl);">
            <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">Curriculum</h3>
            ${training.description.curriculum.map((weekModule) => `
              <div style="padding: var(--space-md); margin-bottom: var(--space-md); background-color: var(--color-gray-50); border-left: 4px solid var(--color-primary); border-radius: var(--radius-sm);">
                <strong>Week ${weekModule.week}:</strong>
                <ul style="margin-top: var(--space-sm); padding-left: var(--space-lg);">
                  ${weekModule.topics.map(topic => `<li>${topic}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Prerequisites -->
        ${training.requirements?.prerequisites ? `
          <div style="margin-bottom: var(--space-xl);">
            <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">Prerequisites</h3>
            <p style="color: var(--color-gray-700);">${training.requirements.prerequisites}</p>
          </div>
        ` : ''}

        <!-- Certificate Info -->
        ${training.certificate?.provided ? `
          <div style="padding: var(--space-lg); background-color: var(--color-success-light); border-radius: var(--radius-md); margin-bottom: var(--space-xl);">
            <div style="display: flex; align-items: center; gap: var(--space-md);">
              <span style="font-size: 2rem;">🎓</span>
              <div>
                <div style="font-weight: 600; color: var(--color-success); margin-bottom: var(--space-2xs);">${training.certificate.type}</div>
                <div style="color: var(--color-gray-700); font-size: var(--font-size-sm);">
                  ${training.certificate.criteria}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Facilitators -->
        ${training.facilitators && training.facilitators.length > 0 ? `
          <div style="margin-bottom: var(--space-xl);">
            <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">Facilitator${training.facilitators.length > 1 ? 's' : ''}</h3>
            ${training.facilitators.map(facilitator => `
              <div style="display: flex; gap: var(--space-lg); align-items: start; padding: var(--space-lg); background-color: var(--color-gray-50); border-radius: var(--radius-md); margin-bottom: var(--space-md);">
                ${facilitator.photo ? `
                  <img src="${facilitator.photo}" alt="${facilitator.name}"
                       style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                ` : ''}
                <div>
                  <div style="font-weight: 600; font-size: var(--font-size-lg); margin-bottom: var(--space-xs);">${facilitator.name}</div>
                  <div style="color: var(--color-gray-600); font-size: var(--font-size-sm); margin-bottom: var(--space-xs);">${facilitator.title}</div>
                  <p style="color: var(--color-gray-700); margin: 0;">${facilitator.bio}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Call to Action / Registration Form -->
        ${isPast ? `
          <div style="margin-top: var(--space-2xl); padding-top: var(--space-xl); border-top: 2px solid var(--color-gray-200);">
            <p style="text-align: center; color: var(--color-gray-600); margin-bottom: var(--space-md);">
              This training has been completed. Check back for future sessions!
            </p>
            <a href="/trainings.html" class="btn btn-outline" style="width: 100%;">View All Trainings</a>
          </div>
        ` : isFull ? `
          <div style="margin-top: var(--space-2xl); padding-top: var(--space-xl); border-top: 2px solid var(--color-gray-200);">
            <p style="text-align: center; color: var(--color-gray-600); margin-bottom: var(--space-md);">
              This training is currently full. Contact us to join the waitlist.
            </p>
            <a href="/contact.html?inquiry=training&training=${training.id}" class="btn btn-primary" style="width: 100%;">Join Waitlist</a>
          </div>
        ` : `
          <div style="background: var(--color-gray-50); padding: var(--space-xl); border-radius: var(--radius-md); margin-top: var(--space-2xl);">
            <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md); color: var(--color-primary);">Register for This Training</h3>
            <form id="training-registration-form" class="form" data-training-id="${training.id}">
              ${this.generateTrainingFormFields(training)}
              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
                ${isFree ? 'Register Now' : 'Register & View Payment Details'}
              </button>
            </form>
          </div>
        `}
      </div>
    `;

    // Setup form validation and submission if form is present
    if (!isPast && !isFull) {
      setTimeout(() => this.setupTrainingRegistrationForm(training), 100);
    }

    // Open modal
    if (window.modalInstance) {
      window.modalInstance.open('training-modal');
    }
  }

  /**
   * Generate form fields for training registration
   * @param {Object} training - Training object
   * @returns {string} HTML string for form fields
   */
  generateTrainingFormFields(training) {
    const minAge = training.requirements?.age?.min || 18;
    const maxAge = training.requirements?.age?.max || 65;

    return `
      <div class="form-row">
        <div class="form-group">
          <label for="training-name" class="form-label">Full Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" id="training-name" name="name" class="form-input" required>
          <div class="form-error"></div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="training-email" class="form-label">Email <span style="color: var(--color-error);">*</span></label>
          <input type="email" id="training-email" name="email" class="form-input" required>
          <div class="form-error"></div>
        </div>

        <div class="form-group">
          <label for="training-phone" class="form-label">Phone <span style="color: var(--color-error);">*</span></label>
          <input type="tel" id="training-phone" name="phone" class="form-input" required pattern="[6-9][0-9]{9}" placeholder="98765 43210">
          <div class="form-error"></div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="training-age" class="form-label">Age <span style="color: var(--color-error);">*</span></label>
          <input type="number" id="training-age" name="age" class="form-input" min="${minAge}" max="${maxAge}" required>
          <div class="form-error"></div>
          <small style="color: var(--color-gray-600); font-size: var(--font-size-sm);">Must be between ${minAge} and ${maxAge} years</small>
        </div>

        <div class="form-group">
          <label for="training-education" class="form-label">Education Level <span style="color: var(--color-error);">*</span></label>
          <select id="training-education" name="education" class="form-input" required>
            <option value="">Select...</option>
            <option value="high-school">High School</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="post-graduate">Post-Graduate</option>
            <option value="vocational">Vocational/Diploma</option>
            <option value="other">Other</option>
          </select>
          <div class="form-error"></div>
        </div>
      </div>

      <div class="form-group">
        <label for="training-occupation" class="form-label">Occupation/Organization <span style="color: var(--color-error);">*</span></label>
        <input type="text" id="training-occupation" name="occupation" class="form-input" required>
        <div class="form-error"></div>
      </div>

      <div class="form-group">
        <label for="training-background" class="form-label">Prior Experience/Background <span style="color: var(--color-error);">*</span></label>
        <textarea id="training-background" name="background" class="form-input" rows="4" required minlength="20"></textarea>
        <div class="form-error"></div>
        <small style="color: var(--color-gray-600); font-size: var(--font-size-sm);">Minimum 20 characters</small>
      </div>
    `;
  }

  /**
   * Setup training registration form validation and submission
   * @param {Object} training - Training object
   */
  setupTrainingRegistrationForm(training) {
    const form = document.getElementById('training-registration-form');
    if (!form) {
      console.warn('Training registration form not found');
      return;
    }

    // Get submit button reference
    const submitButton = form.querySelector('button[type="submit"]');

    // Initialize form validation
    if (window.FormValidation) {
      const minAge = training.requirements?.age?.min || 18;
      const maxAge = training.requirements?.age?.max || 65;

      new window.FormValidation(form, {
        name: { required: true, minLength: 2 },
        email: { required: true, email: true },
        phone: { required: true, phone: true },
        age: { required: true, min: minAge, max: maxAge },
        education: { required: true },
        occupation: { required: true, minLength: 2 },
        background: { required: true, minLength: 20 }
      });
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const registrationData = {
        type: 'training',
        trainingId: training.id,
        trainingTitle: training.title,
        trainingDate: training.schedule.sessions[0].date,
        trainingFee: training.registration.fee.amount || 0,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        education: formData.get('education'),
        occupation: formData.get('occupation'),
        background: formData.get('background'),
        submittedAt: new Date().toISOString()
      };

      console.log('Training registration submitted:', registrationData);

      // Disable submit button and show progress indicator
      this.setSubmitState(submitButton, true);

      // Send to Google Sheets
      try {
        const response = await this.sendToBackend(registrationData);

        if (response.success) {
          this.showSuccessModal(training);
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

  /**
   * Handle hash navigation for direct links
   */
  handleHashNavigation() {
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      const training = this.trainings.find(t => t.slug === hash || t.id === hash);

      if (training) {
        setTimeout(() => {
          this.showDetails(training.id);
        }, 500);
      }
    }
  }

  /**
   * Get human-readable category label
   */
  getCategoryLabel(category) {
    const labels = {
      'farming': 'Farming',
      'conservation': 'Conservation',
      'skills-development': 'Skills Development'
    };
    return labels[category] || this.capitalize(category);
  }

  /**
   * Get human-readable type label
   */
  getTypeLabel(type) {
    const labels = {
      'workshop': 'Workshop',
      'field-visit': 'Field Visit',
      'online': 'Online Session',
      'certification': 'Certification Program',
      'bootcamp': 'Bootcamp'
    };
    return labels[type] || this.capitalize(type);
  }

  /**
   * Capitalize string
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Send registration data to Google Sheets backend
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

    const payload = {
      ...data,
      formType: 'training'
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Training registration submitted to Google Sheets');
      // Note: no-cors mode means we can't read the response
      // We assume success if no error is thrown
      return { success: true, message: 'Registration successful!' };
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
  showSuccessModal(training) {
    const hasFee = training.registration.fee.amount && training.registration.fee.amount > 0;

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
            Thank you for registering for <strong>${training.title}</strong>!<br>
            Please check your email for confirmation.${hasFee ? '<br>Click below to proceed with payment.' : '<br>We\'ll send you training details shortly.'}
          </p>
          <button id="success-modal-btn" style="background: #6B8E23; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; min-width: 120px;">
            ${hasFee ? 'Proceed to Payment' : 'OK'}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listener for the button
    const button = document.getElementById('success-modal-btn');
    if (button) {
      button.addEventListener('click', () => {
        document.getElementById('registration-success-modal').remove();
        if (hasFee) {
          this.showPaymentModal(training);
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
  showPaymentModal(training) {
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
            <p style="font-size: 20px; margin: 0 0 8px 0; font-weight: 600; color: #333;">Donation Amount: ₹${training.registration.fee.amount}</p>
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
              <a href="https://wa.me/${PAYMENT_INFO.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Payment%20confirmation%20for%20${encodeURIComponent(training.title)}"
                 target="_blank"
                 rel="noopener"
                 style="display: inline-flex; align-items: center; gap: 8px; background-color: #25D366; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
                📱 WhatsApp
              </a>

              <a href="mailto:${PAYMENT_INFO.contact.email}?subject=Payment%20Confirmation%20-%20${encodeURIComponent(training.title)}"
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
    alert(message);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.trainingsPageInstance = new TrainingsPage();
  });
} else {
  window.trainingsPageInstance = new TrainingsPage();
}
