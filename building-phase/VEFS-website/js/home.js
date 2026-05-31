/**
 * Home Page JavaScript
 * Loads and displays upcoming events and featured trainings
 */

class HomePage {
  constructor() {
    this.events = [];
    this.trainings = [];

    this.init();
  }

  async init() {
    await Promise.all([
      this.loadEvents(),
      this.loadTrainings()
    ]);

    this.renderUpcomingEvents();
    this.renderFeaturedTrainings();
  }

  /**
   * Load events data from JSON
   */
  async loadEvents() {
    try {
      const response = await fetch('data/events.json');
      if (!response.ok) throw new Error('Failed to load events');

      const data = await response.json();

      // Filter for upcoming events only
      const now = new Date();
      this.events = (data.events || [])
        .filter(e => e.enabled !== false)
        .filter(e => e.status === 'upcoming' && new Date(e.date.start) > now)
        .sort((a, b) => new Date(a.date.start) - new Date(b.date.start));
    } catch (error) {
      console.error('Error loading events:', error);
      this.events = [];
    }
  }

  /**
   * Load trainings data from JSON
   */
  async loadTrainings() {
    try {
      const response = await fetch('data/trainings.json');
      if (!response.ok) throw new Error('Failed to load trainings');

      const data = await response.json();

      // Filter for open/upcoming trainings
      this.trainings = (data.trainings || []).filter(t => t.enabled !== false).filter(t =>
        t.status === 'open' || t.status === 'upcoming'
      );
    } catch (error) {
      console.error('Error loading trainings:', error);
      this.trainings = [];
    }
  }

  /**
   * Render upcoming events (max 3)
   */
  renderUpcomingEvents() {
    const container = document.getElementById('upcoming-events-container');
    if (!container) return;

    const upcoming = this.events.slice(0, 3);

    if (upcoming.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-gray-600);">
          <p>No upcoming events scheduled. Check back soon!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = upcoming.map(event => {
      const startDate = new Date(event.date.start);
      const isFree = event.fee === 0;

      return `
        <div class="card">
          ${event.images?.featured ? `
            <div class="card-image">
              <img src="${event.images.featured}" alt="${event.title}" loading="lazy">
              ${event.featured ? '<span class="card-badge card-badge-featured">Featured</span>' : ''}
            </div>
          ` : ''}
          <div class="card-body">
            <div class="card-meta">
              <span>📅 ${window.VEFSUtils.formatDate(startDate)}</span>
              <span>📍 ${event.location.city}</span>
            </div>
            <h3 class="card-title">${event.title}</h3>
            <p class="card-description">${event.shortDescription}</p>

            <div class="card-footer" style="margin-top: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
              <span class="card-price">${isFree ? 'FREE' : '₹' + event.fee}</span>
              <a href="/events.html#${event.id}" class="btn btn-sm btn-primary">
                ${event.registrationRequired ? 'Register' : 'Learn More'}
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render featured trainings (max 3)
   */
  renderFeaturedTrainings() {
    const container = document.getElementById('featured-trainings-container');
    if (!container) {
      console.error('Featured trainings container not found');
      return;
    }

    console.log('Rendering featured trainings:', this.trainings.length, 'trainings loaded');

    const featured = this.trainings.slice(0, 3);

    if (featured.length === 0) {
      console.log('No featured trainings to display');
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-gray-600);">
          <p>No trainings available for registration at this time.</p>
        </div>
      `;
      return;
    }

    try {

    container.innerHTML = featured.map(training => {
      const isFree = (training.registration?.fee?.amount ?? 0) === 0;
      const statusClass = training.status === 'full' ? 'card-badge-danger' :
                         training.status === 'upcoming' ? 'card-badge-warning' :
                         'card-badge-success';

      return `
        <div class="card">
          ${training.media?.featuredImage ? `
            <div class="card-image">
              <img src="${training.media.featuredImage}" alt="${training.title}" loading="lazy">
            </div>
          ` : ''}
          <div class="card-body">
            <span class="card-badge ${statusClass}">${this.formatTrainingStatus(training.status)}</span>
            <h3 class="card-title">${training.title}</h3>
            <p class="card-description">${training.description.brief}</p>

            <div class="card-meta" style="margin-top: var(--space-md);">
              <div style="margin-bottom: var(--space-xs);">
                <strong>Duration:</strong> ${this.formatDuration(training.totalDuration)}
              </div>
              <div style="margin-bottom: var(--space-xs);">
                <strong>Category:</strong> ${this.capitalize(training.category)}
              </div>
              ${training.certificate?.provided ? `
                <div style="color: var(--color-success);">
                  ✓ Certificate provided
                </div>
              ` : ''}
            </div>

            <div class="card-footer" style="margin-top: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
              <span class="card-price">${isFree ? 'FREE' : '₹' + (training.registration?.fee?.amount || '')}</span>
              <a href="/trainings.html#${training.id}" class="btn btn-sm ${training.status === 'full' ? 'btn-outline' : 'btn-primary'}">
                ${training.status === 'full' ? 'View Details' : 'Register Now'}
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    } catch (error) {
      console.error('Error rendering featured trainings:', error);
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-error);">
          <p>Error loading trainings. Please refresh the page.</p>
        </div>
      `;
    }
  }

  /**
   * Helper: Format training status
   */
  formatTrainingStatus(status) {
    const statusMap = {
      'open': 'Open for Registration',
      'full': 'Full',
      'upcoming': 'Opening Soon'
    };
    return statusMap[status] || status;
  }

  /**
   * Helper: Format training duration
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
    new HomePage();
  });
} else {
  new HomePage();
}
