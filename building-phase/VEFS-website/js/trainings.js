/**
 * Trainings Page JavaScript
 * Handles training data loading, filtering, timeline display, and modal interactions
 */

class TrainingsPage {
  constructor() {
    this.trainings = [];
    this.filteredTrainings = [];
    this.filters = {
      date: 'all',
      type: null,
      audience: null,
      search: ''
    };
    this.init();
  }

  async init() {
    await this.loadTrainings();
    this.setupFilters();
    this.setupSearch();
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
        const dateA = new Date(a.schedule.startDate);
        const dateB = new Date(b.schedule.startDate);
        return dateA - dateB;
      });

      this.filteredTrainings = [...this.trainings];
      this.updateResultsCount();
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

    // Reset button
    document.getElementById('reset-filters').addEventListener('click', () => {
      this.resetFilters();
    });
  }

  /**
   * Setup search input handler
   */
  setupSearch() {
    const searchInput = document.getElementById('training-search');

    searchInput.addEventListener('input', (e) => {
      this.filters.search = e.target.value.toLowerCase();
      this.applyFilters();
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

      // Type filter
      if (this.filters.type) {
        if (training.type !== this.filters.type) {
          return false;
        }
      }

      // Audience filter (check if training has multiple audiences)
      if (this.filters.audience) {
        const audiences = Array.isArray(training.targetAudience)
          ? training.targetAudience
          : [training.targetAudience];

        if (!audiences.includes(this.filters.audience)) {
          return false;
        }
      }

      // Search filter
      if (this.filters.search) {
        const searchableText = `${training.title} ${training.shortDescription} ${training.category}`.toLowerCase();
        if (!searchableText.includes(this.filters.search)) {
          return false;
        }
      }

      return true;
    });

    this.updateResultsCount();
    this.renderTimeline();
  }

  /**
   * Check if training matches date filter
   */
  matchesDateFilter(training, dateFilter) {
    const now = new Date();
    const startDate = new Date(training.schedule.startDate);
    const endDate = new Date(training.schedule.endDate);

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
   * Reset all filters
   */
  resetFilters() {
    this.filters = {
      date: 'all',
      type: null,
      audience: null,
      search: ''
    };

    // Reset UI
    document.querySelectorAll('[data-filter-type]').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector('[data-filter-value="all"]').classList.add('active');
    document.getElementById('training-search').value = '';

    this.applyFilters();
  }

  /**
   * Update results count display
   */
  updateResultsCount() {
    document.getElementById('count-current').textContent = this.filteredTrainings.length;
    document.getElementById('count-total').textContent = this.trainings.length;
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
      const date = new Date(training.schedule.startDate);
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
    const startDate = new Date(training.schedule.startDate);
    const endDate = new Date(training.schedule.endDate);
    const isUpcoming = startDate > new Date();
    const isPast = endDate < new Date();
    const isFull = training.status === 'full';
    const isOpen = training.status === 'open';
    const isFree = training.fee === 0;

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
    const audiences = Array.isArray(training.targetAudience)
      ? training.targetAudience
      : [training.targetAudience];

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
              src="${training.images?.featured || '/images/trainings/default-training.jpg'}"
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
              <span>⏰ ${training.schedule.time || 'TBA'}</span>
              <span>📍 ${training.location.mode === 'online' ? 'Online' : training.location.city}</span>
              <span>⏳ ${training.schedule.duration}</span>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-sm);">
              <span style="background-color: var(--color-primary-light); color: var(--color-primary); padding: var(--space-2xs) var(--space-sm); border-radius: var(--radius-sm); font-size: var(--font-size-sm);">
                ${this.getTypeLabel(training.type)}
              </span>
              ${audiences.map(aud => `
                <span style="background-color: var(--color-gray-200); color: var(--color-gray-700); padding: var(--space-2xs) var(--space-sm); border-radius: var(--radius-sm); font-size: var(--font-size-sm);">
                  ${this.capitalize(aud)}
                </span>
              `).join('')}
            </div>

            <p style="color: var(--color-gray-700); margin-bottom: var(--space-md); line-height: 1.6;">
              ${training.shortDescription}
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: ${isFree ? 'var(--color-success)' : 'var(--color-gray-900)'}; font-size: var(--font-size-lg);">
                ${isFree ? 'FREE' : '₹' + training.fee}
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

    const startDate = new Date(training.schedule.startDate);
    const endDate = new Date(training.schedule.endDate);
    const isPast = endDate < new Date();
    const isFull = training.status === 'full';
    const isFree = training.fee === 0;

    const modalBody = document.getElementById('training-modal-body');

    modalBody.innerHTML = `
      <div>
        <!-- Header Image -->
        ${training.images?.hero ? `
          <img src="${training.images.hero}" alt="${training.title}"
               style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
        ` : ''}

        <!-- Title and Status -->
        <div style="margin-bottom: var(--space-lg);">
          <h2 id="training-modal-title" style="font-size: var(--font-size-3xl); color: var(--color-primary); margin-bottom: var(--space-sm);">
            ${training.title}
          </h2>
          <p style="font-size: var(--font-size-lg); color: var(--color-gray-700);">
            ${training.shortDescription}
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
            <div style="font-weight: 600;">${training.schedule.time || 'TBA'}</div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">⏳ Duration</div>
            <div style="font-weight: 600;">${training.schedule.duration}</div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">📍 Location</div>
            <div style="font-weight: 600;">${training.location.mode === 'online' ? 'Online' : training.location.venue}</div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">💰 Fee</div>
            <div style="font-weight: 600; color: ${isFree ? 'var(--color-success)' : 'var(--color-gray-900)'};">
              ${isFree ? 'FREE' : '₹' + training.fee}
            </div>
          </div>
          <div>
            <div style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-bottom: var(--space-xs);">👥 Capacity</div>
            <div style="font-weight: 600;">${training.capacity} participants</div>
          </div>
        </div>

        <!-- Description -->
        <div style="margin-bottom: var(--space-xl);">
          <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">About This Training</h3>
          <p style="color: var(--color-gray-700); line-height: 1.8; white-space: pre-line;">${training.fullDescription || training.shortDescription}</p>
        </div>

        <!-- Curriculum -->
        ${training.curriculum && training.curriculum.length > 0 ? `
          <div style="margin-bottom: var(--space-xl);">
            <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">Curriculum</h3>
            <ul style="list-style: none; padding: 0;">
              ${training.curriculum.map((module, index) => `
                <li style="padding: var(--space-md); margin-bottom: var(--space-sm); background-color: var(--color-gray-50); border-left: 4px solid var(--color-primary); border-radius: var(--radius-sm);">
                  <strong>Module ${index + 1}:</strong> ${module}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Prerequisites -->
        ${training.prerequisites ? `
          <div style="margin-bottom: var(--space-xl);">
            <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">Prerequisites</h3>
            <p style="color: var(--color-gray-700);">${training.prerequisites}</p>
          </div>
        ` : ''}

        <!-- Certificate Info -->
        ${training.certificate ? `
          <div style="padding: var(--space-lg); background-color: var(--color-success-light); border-radius: var(--radius-md); margin-bottom: var(--space-xl);">
            <div style="display: flex; align-items: center; gap: var(--space-md);">
              <span style="font-size: 2rem;">🎓</span>
              <div>
                <div style="font-weight: 600; color: var(--color-success); margin-bottom: var(--space-2xs);">Certificate Provided</div>
                <div style="color: var(--color-gray-700); font-size: var(--font-size-sm);">
                  Participants who complete the full program will receive a Certificate of Completion from VEFS Foundation.
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Instructor -->
        ${training.instructor ? `
          <div style="margin-bottom: var(--space-xl);">
            <h3 style="font-size: var(--font-size-xl); color: var(--color-primary); margin-bottom: var(--space-md);">Facilitator</h3>
            <div style="display: flex; gap: var(--space-lg); align-items: start; padding: var(--space-lg); background-color: var(--color-gray-50); border-radius: var(--radius-md);">
              ${training.instructor.photo ? `
                <img src="${training.instructor.photo}" alt="${training.instructor.name}"
                     style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
              ` : ''}
              <div>
                <div style="font-weight: 600; font-size: var(--font-size-lg); margin-bottom: var(--space-xs);">${training.instructor.name}</div>
                <p style="color: var(--color-gray-700); margin: 0;">${training.instructor.bio}</p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Call to Action -->
        <div style="margin-top: var(--space-2xl); padding-top: var(--space-xl); border-top: 2px solid var(--color-gray-200);">
          ${isPast ? `
            <p style="text-align: center; color: var(--color-gray-600); margin-bottom: var(--space-md);">
              This training has been completed. Check back for future sessions!
            </p>
            <a href="/trainings.html" class="btn btn-outline" style="width: 100%;">View All Trainings</a>
          ` : isFull ? `
            <p style="text-align: center; color: var(--color-gray-600); margin-bottom: var(--space-md);">
              This training is currently full. Contact us to join the waitlist.
            </p>
            <a href="/contact.html?inquiry=training&training=${training.id}" class="btn btn-primary" style="width: 100%;">Join Waitlist</a>
          ` : `
            <p style="text-align: center; color: var(--color-gray-700); margin-bottom: var(--space-md); font-size: var(--font-size-lg);">
              Ready to join this training? Register now to secure your spot!
            </p>
            <a href="/contact.html?inquiry=training&training=${training.id}" class="btn btn-primary btn-lg" style="width: 100%;">Register Now</a>
          `}
        </div>
      </div>
    `;

    // Open modal
    if (window.modalInstance) {
      window.modalInstance.open('training-modal');
    }
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
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize when DOM is ready
let trainingsPageInstance;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    trainingsPageInstance = new TrainingsPage();
  });
} else {
  trainingsPageInstance = new TrainingsPage();
}
