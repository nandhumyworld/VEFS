/**
 * Modal Component
 * Handles modal dialogs with accessibility features and focus management
 */

class Modal {
  constructor() {
    this.activeModal = null;
    this.previousFocus = null;
    this.init();
  }

  /**
   * Initialize modal system
   */
  init() {
    // Modal trigger buttons
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-trigger');
        this.open(modalId);
      });
    });

    // Modal close buttons
    document.querySelectorAll('[data-modal-close]').forEach(closer => {
      closer.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });

    // Setup focus trap
    this.setupFocusTrap();
  }

  /**
   * Open modal by ID
   */
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with ID "${modalId}" not found`);
      return;
    }

    // Store current focus to restore later
    this.previousFocus = document.activeElement;

    this.activeModal = modal;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus first focusable element in modal
    const firstFocusable = modal.querySelector(
      'button:not([data-modal-close]), a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (firstFocusable) {
      // Small delay to ensure modal is visible
      setTimeout(() => firstFocusable.focus(), 100);
    } else {
      // If no focusable element, focus the close button
      const closeButton = modal.querySelector('[data-modal-close]');
      if (closeButton) {
        setTimeout(() => closeButton.focus(), 100);
      }
    }

    // Trigger custom event
    const openEvent = new CustomEvent('modalOpen', { detail: { modalId } });
    document.dispatchEvent(openEvent);
  }

  /**
   * Close active modal
   */
  close() {
    if (!this.activeModal) return;

    const modalId = this.activeModal.id;

    this.activeModal.classList.remove('active');
    this.activeModal.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';

    // Restore focus to element that opened the modal
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }

    this.activeModal = null;
    this.previousFocus = null;

    // Trigger custom event
    const closeEvent = new CustomEvent('modalClose', { detail: { modalId } });
    document.dispatchEvent(closeEvent);
  }

  /**
   * Setup focus trap to keep focus within modal
   */
  setupFocusTrap() {
    document.addEventListener('keydown', (e) => {
      if (!this.activeModal || e.key !== 'Tab') return;

      const focusableElements = this.activeModal.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Trap focus within modal
      if (e.shiftKey) {
        // Shift + Tab (backwards)
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forwards)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  /**
   * Load dynamic content into modal
   */
  loadContent(modalId, contentHTML) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = contentHTML;
    }

    this.open(modalId);
  }

  /**
   * Create and open a modal programmatically
   */
  createModal(options = {}) {
    const {
      id = 'dynamic-modal-' + Date.now(),
      title = 'Modal',
      content = '',
      footer = '',
      size = '', // 'sm', 'lg', or ''
      onOpen = null,
      onClose = null,
    } = options;

    // Check if modal already exists
    let modal = document.getElementById(id);

    if (!modal) {
      // Create modal HTML
      const modalHTML = `
        <div class="modal" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-title" aria-hidden="true">
          <div class="modal-backdrop" data-modal-close></div>
          <div class="modal-dialog ${size ? 'modal-dialog-' + size : ''}">
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title" id="${id}-title">${title}</h2>
                <button class="modal-close" data-modal-close aria-label="Close modal">
                  <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body">
                ${content}
              </div>
              ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
            </div>
          </div>
        </div>
      `;

      // Add modal to DOM
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      modal = document.getElementById(id);

      // Re-initialize modal triggers
      const closeButton = modal.querySelector('[data-modal-close]');
      if (closeButton) {
        closeButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
          if (onClose) onClose();
        });
      }
    } else {
      // Update existing modal content
      const modalTitle = modal.querySelector('.modal-title');
      const modalBody = modal.querySelector('.modal-body');
      const modalFooter = modal.querySelector('.modal-footer');

      if (modalTitle) modalTitle.textContent = title;
      if (modalBody) modalBody.innerHTML = content;

      if (footer && modalFooter) {
        modalFooter.innerHTML = footer;
      } else if (footer) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.insertAdjacentHTML('beforeend', `<div class="modal-footer">${footer}</div>`);
      }
    }

    if (onOpen) onOpen();
    this.open(id);

    return modal;
  }
}

// Initialize modal system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.modalInstance = new Modal();
});

// Export for manual use
if (typeof window !== 'undefined') {
  window.Modal = Modal;
}
