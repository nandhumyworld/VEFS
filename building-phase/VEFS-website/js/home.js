/**
 * Home Page JavaScript
 * Loads and displays featured programs, upcoming events, and trainings
 */

class HomePage {
  constructor() {
    this.programs = [];
    this.events = [];
    this.trainings = [];

    this.init();
  }

  async init() {
    await Promise.all([
      this.loadPrograms(),
      this.loadEvents(),
      this.loadTrainings()
    ]);

    this.renderFeaturedPrograms();
    this.renderUpcomingEvents();
    this.renderFeaturedTrainings();
    this.setupNewsletterForm();
  }

  /**
   * Load programs data from JSON
   */
  async loadPrograms() {
    try {
      const response = await fetch('data/programs.json');
      if (!response.ok) throw new Error('Failed to load programs');

      const data = await response.json();
      this.programs = data.programs.filter(p => p.active);
    } catch (error) {
      console.error('Error loading programs:', error);
      this.programs = [];
    }
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
      this.events = data.events
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
      this.trainings = data.trainings.filter(t =>
        t.status === 'open' || t.status === 'upcoming'
      );
    } catch (error) {
      console.error('Error loading trainings:', error);
      this.trainings = [];
    }
  }

  /**
   * Render featured programs (max 4)
   */
  renderFeaturedPrograms() {
    const container = document.getElementById('featured-programs-container');
    if (!container) return;

    // Get featured programs
    const featured = this.programs
      .filter(p => p.featured)
      .slice(0, 4);

    if (featured.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-gray-600);">
          <p>No featured programs available at this time.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = featured.map(program => `
      <div class="card">
        <div class="card-icon" style="font-size: 3rem; text-align: center; padding: var(--space-lg) 0;">
          ${this.getIconEmoji(program.icon)}
        </div>
        <div class="card-body">
          <span class="card-badge">${this.formatTargetAudience(program.targetAudience)}</span>
          <h3 class="card-title">${program.title}</h3>
          <p class="card-description">${program.shortDescription}</p>

          ${program.impact ? `
            <div class="card-meta" style="margin-top: var(--space-md); font-size: var(--font-size-sm); color: var(--color-gray-600);">
              <strong>Impact:</strong> ${this.formatFirstImpact(program.impact)}
            </div>
          ` : ''}

          <a href="/programs.html#${program.slug}" class="btn btn-text" style="margin-top: var(--space-md);">
            Learn More →
          </a>
        </div>
      </div>
    `).join('');
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
    if (!container) return;

    const featured = this.trainings.slice(0, 3);

    if (featured.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-gray-600);">
          <p>No trainings available for registration at this time.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = featured.map(training => {
      const isFree = training.registration.fee === 0;
      const statusClass = training.status === 'full' ? 'card-badge-danger' :
                         training.status === 'upcoming' ? 'card-badge-warning' :
                         'card-badge-success';

      return `
        <div class="card">
          ${training.images?.featured ? `
            <div class="card-image">
              <img src="${training.images.featured}" alt="${training.title}" loading="lazy">
            </div>
          ` : ''}
          <div class="card-body">
            <span class="card-badge ${statusClass}">${this.formatTrainingStatus(training.status)}</span>
            <h3 class="card-title">${training.title}</h3>
            <p class="card-description">${training.description}</p>

            <div class="card-meta" style="margin-top: var(--space-md);">
              <div style="margin-bottom: var(--space-xs);">
                <strong>Duration:</strong> ${this.formatDuration(training.duration)}
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
              <span class="card-price">${isFree ? 'FREE' : '₹' + training.registration.fee}</span>
              <a href="/trainings.html#${training.id}" class="btn btn-sm ${training.status === 'full' ? 'btn-outline' : 'btn-primary'}">
                ${training.status === 'full' ? 'View Details' : 'Register Now'}
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Setup newsletter form submission
   */
  setupNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput.value.trim();

      // In production, this would send to backend
      console.log('Newsletter subscription:', email);

      // Show success message
      const alertHtml = `
        <div class="alert alert-success" role="alert" style="position: fixed; top: 80px; right: 20px; z-index: 1000; max-width: 400px; animation: slideInRight 0.3s ease-out;">
          <strong>Success!</strong> You've been subscribed to our newsletter. Check your email for confirmation.
          <button class="alert-close" onclick="this.parentElement.remove()" aria-label="Close alert">×</button>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', alertHtml);

      // Clear form
      emailInput.value = '';

      // Remove alert after 5 seconds
      setTimeout(() => {
        const alert = document.querySelector('.alert-success');
        if (alert) alert.remove();
      }, 5000);
    });
  }

  /**
   * Helper: Get icon emoji from icon name
   */
  getIconEmoji(iconName) {
    const iconMap = {
      'graduation-cap': '🎓',
      'tractor': '🚜',
      'users': '👥',
      'leaf': '🍃',
      'heart': '❤️',
      'megaphone': '📢',
      'book': '📚',
      'tree': '🌳',
      'briefcase': '💼'
    };
    return iconMap[iconName] || '🌱';
  }

  /**
   * Helper: Format target audience for display
   */
  formatTargetAudience(audience) {
    const labels = {
      'students': 'Students',
      'farmers': 'Farmers',
      'women': 'Women',
      'public': 'Public',
      'youth': 'Youth',
      'seniors': 'Seniors',
      'professionals': 'Professionals',
      'all': 'All Ages'
    };
    return labels[audience] || audience;
  }

  /**
   * Helper: Format first impact metric
   */
  formatFirstImpact(impact) {
    const keys = Object.keys(impact).filter(k => k !== 'since');
    if (keys.length === 0) return '';

    const firstKey = keys[0];
    const value = impact[firstKey];
    const label = this.humanizeKey(firstKey);

    return `${value.toLocaleString()} ${label}`;
  }

  /**
   * Helper: Humanize camelCase key
   */
  humanizeKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .toLowerCase();
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
    if (duration.total) return duration.total;
    return 'TBD';
  }

  /**
   * Helper: Capitalize first letter
   */
  capitalize(str) {
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
