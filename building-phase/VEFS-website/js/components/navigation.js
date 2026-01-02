/**
 * Navigation Component
 * Handles mobile menu toggle, active link highlighting, and scroll behavior
 */

class Navigation {
  constructor() {
    this.header = document.getElementById('main-header');
    this.nav = document.getElementById('main-nav');
    this.toggle = document.querySelector('.nav-toggle');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.overlay = null;

    this.init();
  }

  init() {
    // Create mobile menu overlay
    this.createOverlay();

    // Mobile menu toggle
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when link clicked
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMobileMenu();
    });

    // Close mobile menu when clicking overlay
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMobileMenu());
    }

    // Sticky header shadow on scroll
    window.addEventListener('scroll', () => this.handleScroll());

    // Set active link based on current page
    this.setActiveLink();
  }

  /**
   * Create overlay element for mobile menu
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'nav-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.overlay);
  }

  /**
   * Toggle mobile menu open/closed
   */
  toggleMobileMenu() {
    const isOpen = this.nav.classList.toggle('active');
    this.toggle.setAttribute('aria-expanded', isOpen);

    // Toggle overlay
    if (this.overlay) {
      this.overlay.classList.toggle('active', isOpen);
    }

    // Prevent body scroll when menu open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.nav.classList.remove('active');
    if (this.toggle) {
      this.toggle.setAttribute('aria-expanded', 'false');
    }
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  /**
   * Add shadow to header on scroll
   */
  handleScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  /**
   * Set active link based on current page URL
   */
  setActiveLink() {
    const currentPath = window.location.pathname;

    this.navLinks.forEach(link => {
      // Skip if link is inside a button (donate CTA)
      if (link.classList.contains('btn')) return;

      const linkPath = new URL(link.href).pathname;

      // Exact match or home page handling
      if (linkPath === currentPath ||
          (currentPath === '/' && linkPath === '/') ||
          (currentPath === '/index.html' && linkPath === '/')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});
