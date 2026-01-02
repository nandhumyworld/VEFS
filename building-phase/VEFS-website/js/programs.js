/**
 * Programs Page JavaScript
 * Handles program filtering and display
 */

class ProgramsPage {
  constructor() {
    this.programs = [];
    this.filteredPrograms = [];
    this.currentFilter = 'all';

    this.init();
  }

  async init() {
    await this.loadPrograms();
    this.renderPrograms();
    this.setupFilters();
    this.handleHashNavigation();
  }

  /**
   * Load programs from JSON
   */
  async loadPrograms() {
    try {
      const response = await fetch('data/programs.json');
      if (!response.ok) throw new Error('Failed to load programs');

      const data = await response.json();

      // Get only active programs, sorted by order
      this.programs = data.programs
        .filter(p => p.active)
        .sort((a, b) => a.order - b.order);

      this.filteredPrograms = this.programs;
    } catch (error) {
      console.error('Error loading programs:', error);
      this.showError();
    }
  }

  /**
   * Filter programs by target audience
   */
  filterByAudience(audience) {
    this.currentFilter = audience;

    if (audience === 'all') {
      this.filteredPrograms = this.programs;
    } else {
      this.filteredPrograms = this.programs.filter(
        p => p.targetAudience === audience
      );
    }

    this.renderPrograms();
  }

  /**
   * Render programs grid
   */
  renderPrograms() {
    const container = document.getElementById('programs-container');
    const noResults = document.getElementById('no-results');

    if (!container) return;

    if (this.filteredPrograms.length === 0) {
      container.innerHTML = '';
      if (noResults) noResults.classList.remove('hidden');
      return;
    }

    if (noResults) noResults.classList.add('hidden');

    container.innerHTML = this.filteredPrograms.map(program => `
      <div class="card animate-fade-in">
        <div class="card-icon" style="font-size: 4rem; text-align: center; padding: var(--space-lg) 0; background-color: var(--color-primary-light);">
          ${this.getIconEmoji(program.icon)}
        </div>
        <div class="card-body">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-sm);">
            <span class="card-badge">${this.formatTargetAudience(program.targetAudience)}</span>
            ${program.featured ? '<span class="card-badge" style="background-color: var(--color-secondary); color: var(--color-white);">Featured</span>' : ''}
          </div>

          <h3 class="card-title">${program.title}</h3>
          <p class="card-description">${program.shortDescription}</p>

          <!-- Objectives preview (first 2) -->
          ${program.objectives && program.objectives.length > 0 ? `
            <ul style="margin-top: var(--space-md); padding-left: var(--space-lg); color: var(--color-gray-700); font-size: var(--font-size-sm); line-height: 1.7;">
              ${program.objectives.slice(0, 2).map(obj => `<li>${obj}</li>`).join('')}
              ${program.objectives.length > 2 ? '<li><em>...and more</em></li>' : ''}
            </ul>
          ` : ''}

          <!-- Impact metrics -->
          ${program.impact ? `
            <div class="card-meta" style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-gray-200);">
              <strong style="display: block; margin-bottom: var(--space-xs); color: var(--color-primary);">Impact:</strong>
              <div style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
                ${this.formatImpact(program.impact)}
              </div>
            </div>
          ` : ''}

          <!-- Cost information -->
          <div class="card-footer" style="margin-top: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: var(--color-primary);">
              ${this.formatCost(program.cost)}
            </span>
            <button class="btn btn-sm btn-primary" onclick="programsPageInstance.showDetails('${program.id}')">
              Learn More
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Show program details in modal
   */
  showDetails(programId) {
    const program = this.programs.find(p => p.id === programId);
    if (!program) return;

    const modalBody = document.getElementById('program-modal-body');
    if (!modalBody) return;

    // Update hash for direct linking
    window.location.hash = program.slug;

    modalBody.innerHTML = `
      ${program.images && program.images.hero ? `
        <img src="${program.images.hero}" alt="${program.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-lg);" loading="lazy">
      ` : ''}

      <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-lg); flex-wrap: wrap;">
        <span class="card-badge">${this.formatTargetAudience(program.targetAudience)}</span>
        ${program.featured ? '<span class="card-badge" style="background-color: var(--color-secondary);">Featured</span>' : ''}
        <span class="card-badge" style="background-color: var(--color-info);">${this.capitalize(program.category)}</span>
      </div>

      <div style="margin-bottom: var(--space-lg);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-xs);">Program Overview</h3>
        <p style="color: var(--color-gray-700); line-height: 1.7;">${program.fullDescription || program.shortDescription}</p>
      </div>

      <!-- Duration and Format -->
      ${program.duration ? `
        <div style="margin-bottom: var(--space-lg); padding: var(--space-md); background-color: var(--color-gray-50); border-radius: var(--radius-md);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
            <div>
              <strong style="display: block; margin-bottom: var(--space-xs); color: var(--color-gray-600);">Duration:</strong>
              <span>${program.duration.typical}</span>
            </div>
            <div>
              <strong style="display: block; margin-bottom: var(--space-xs); color: var(--color-gray-600);">Format:</strong>
              <span>${this.capitalize(program.duration.format)}</span>
            </div>
            <div>
              <strong style="display: block; margin-bottom: var(--space-xs); color: var(--color-gray-600);">Frequency:</strong>
              <span>${program.duration.frequency}</span>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Objectives -->
      ${program.objectives && program.objectives.length > 0 ? `
        <div style="margin-bottom: var(--space-lg);">
          <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md);">Learning Objectives</h3>
          <ul style="padding-left: var(--space-lg); color: var(--color-gray-700); line-height: 1.8;">
            ${program.objectives.map(obj => `<li style="margin-bottom: var(--space-xs);">${obj}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Outcomes -->
      ${program.outcomes && program.outcomes.length > 0 ? `
        <div style="margin-bottom: var(--space-lg);">
          <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md);">Expected Outcomes</h3>
          <ul style="padding-left: var(--space-lg); color: var(--color-gray-700); line-height: 1.8;">
            ${program.outcomes.map(out => `<li style="margin-bottom: var(--space-xs);">${out}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Activities -->
      ${program.activities && program.activities.length > 0 ? `
        <div style="margin-bottom: var(--space-lg);">
          <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md);">Program Activities</h3>
          ${program.activities.map(activity => `
            <div style="margin-bottom: var(--space-md); padding: var(--space-md); border-left: 3px solid var(--color-primary); background-color: var(--color-gray-50);">
              <h4 style="margin-bottom: var(--space-xs); color: var(--color-primary);">
                ${activity.name}
                ${activity.duration ? `<span style="font-weight: 400; font-size: var(--font-size-sm); color: var(--color-gray-600);"> (${activity.duration})</span>` : ''}
              </h4>
              <p style="color: var(--color-gray-700); line-height: 1.7;">${activity.description}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Materials -->
      ${program.materials ? `
        <div style="margin-bottom: var(--space-lg);">
          <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md);">Materials & Requirements</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-md);">
            ${program.materials.provided && program.materials.provided.length > 0 ? `
              <div style="padding: var(--space-md); background-color: var(--color-success-light); border-radius: var(--radius-md);">
                <h4 style="margin-bottom: var(--space-sm); color: var(--color-success);">✓ Provided by VEFS</h4>
                <ul style="padding-left: var(--space-lg); font-size: var(--font-size-sm); line-height: 1.7;">
                  ${program.materials.provided.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            ${program.materials.studentsBring && program.materials.studentsBring.length > 0 ? `
              <div style="padding: var(--space-md); background-color: var(--color-info-light); border-radius: var(--radius-md);">
                <h4 style="margin-bottom: var(--space-sm); color: var(--color-info);">ℹ Participants Should Bring</h4>
                <ul style="padding-left: var(--space-lg); font-size: var(--font-size-sm); line-height: 1.7;">
                  ${program.materials.studentsBring.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Testimonials -->
      ${program.testimonials && program.testimonials.length > 0 ? `
        <div style="margin-bottom: var(--space-lg);">
          <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md);">What Participants Say</h3>
          ${program.testimonials.map(test => `
            <blockquote style="margin-bottom: var(--space-md); padding: var(--space-md); border-left: 4px solid var(--color-primary); background-color: var(--color-gray-50); font-style: italic;">
              <p style="margin-bottom: var(--space-sm); color: var(--color-gray-700);">"${test.quote}"</p>
              <footer style="font-style: normal; font-size: var(--font-size-sm); color: var(--color-gray-600);">
                — <strong>${test.author}</strong>${test.school ? `, ${test.school}` : test.location ? `, ${test.location}` : ''}
              </footer>
            </blockquote>
          `).join('')}
        </div>
      ` : ''}

      <!-- Impact -->
      ${program.impact ? `
        <div style="margin-bottom: var(--space-lg); padding: var(--space-lg); background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light)); border-radius: var(--radius-md);">
          <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md); color: var(--color-primary);">Program Impact${program.impact.since ? ` (Since ${program.impact.since})` : ''}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-md);">
            ${Object.keys(program.impact).filter(k => k !== 'since').map(key => `
              <div style="text-align: center;">
                <div style="font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-xs);">
                  ${typeof program.impact[key] === 'number' ? program.impact[key].toLocaleString() : program.impact[key]}
                </div>
                <div style="font-size: var(--font-size-sm); color: var(--color-gray-700);">
                  ${this.humanizeKey(key)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Contact & Cost -->
      <div style="margin-bottom: var(--space-lg); padding: var(--space-lg); background-color: var(--color-gray-50); border-radius: var(--radius-md);">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-md);">Get Involved</h3>

        <div style="margin-bottom: var(--space-md);">
          <strong style="display: block; margin-bottom: var(--space-xs); color: var(--color-gray-700);">Cost:</strong>
          <span style="font-size: var(--font-size-lg); color: var(--color-primary); font-weight: 600;">${this.formatCost(program.cost)}</span>
          ${program.cost.notes ? `<p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin-top: var(--space-xs);">${program.cost.notes}</p>` : ''}
        </div>

        ${program.contact ? `
          <div style="margin-bottom: var(--space-md);">
            <strong style="display: block; margin-bottom: var(--space-xs); color: var(--color-gray-700);">Contact:</strong>
            <p style="margin-bottom: var(--space-xs);">${program.contact.person}</p>
            <p style="font-size: var(--font-size-sm);">
              Email: <a href="mailto:${program.contact.email}" style="color: var(--color-primary);">${program.contact.email}</a><br>
              Phone: <a href="tel:${program.contact.phone}" style="color: var(--color-primary);">${program.contact.phone}</a>
            </p>
          </div>
        ` : ''}

        <a href="/contact.html?inquiry=program&program=${program.id}" class="btn btn-primary">
          Inquire About This Program
        </a>
      </div>
    `;

    // Open modal
    if (window.modalInstance) {
      window.modalInstance.open('program-modal');
    }
  }

  /**
   * Setup filter buttons
   */
  setupFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter programs
        const audience = button.getAttribute('data-filter');
        this.filterByAudience(audience);
      });
    });
  }

  /**
   * Handle hash navigation (direct links to programs)
   */
  handleHashNavigation() {
    if (window.location.hash) {
      const slug = window.location.hash.substring(1);
      const program = this.programs.find(p => p.slug === slug);
      if (program) {
        // Small delay to ensure modal is initialized
        setTimeout(() => this.showDetails(program.id), 100);
      }
    }
  }

  /**
   * Show error message
   */
  showError() {
    const container = document.getElementById('programs-container');
    if (!container) return;

    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl);">
        <div class="alert alert-error" role="alert">
          <strong>Error:</strong> Unable to load programs. Please try again later.
        </div>
      </div>
    `;
  }

  /**
   * Helper: Get icon emoji
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
   * Helper: Format target audience
   */
  formatTargetAudience(audience) {
    const labels = {
      'students': 'Students',
      'farmers': 'Farmers',
      'women': 'Women',
      'public': 'Public',
      'youth': 'Youth (18-30)',
      'seniors': 'Seniors (55+)',
      'professionals': 'Professionals',
      'all': 'All Ages'
    };
    return labels[audience] || audience;
  }

  /**
   * Helper: Format cost
   */
  formatCost(cost) {
    if (!cost) return 'Contact for details';
    if (cost.type === 'free') return 'FREE';
    if (cost.type === 'paid') return `₹${cost.amount.toLocaleString()}`;
    if (cost.type === 'donation') return `Suggested Donation: ₹${cost.amount.toLocaleString()}`;
    if (cost.type === 'sponsored') return 'Customized packages available';
    return cost.notes || 'Contact for details';
  }

  /**
   * Helper: Format impact metrics
   */
  formatImpact(impact) {
    const keys = Object.keys(impact).filter(k => k !== 'since');
    if (keys.length === 0) return '';

    const firstTwo = keys.slice(0, 2).map(key => {
      const value = impact[key];
      const label = this.humanizeKey(key);
      return `${typeof value === 'number' ? value.toLocaleString() : value} ${label}`;
    });

    return firstTwo.join(' • ');
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
   * Helper: Capitalize first letter
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize
let programsPageInstance;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    programsPageInstance = new ProgramsPage();
  });
} else {
  programsPageInstance = new ProgramsPage();
}
