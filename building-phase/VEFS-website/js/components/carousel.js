/**
 * Carousel Component
 * Auto-advancing carousel with manual controls for hero sections
 */

class Carousel {
  constructor(element, options = {}) {
    this.carousel = element;
    this.slides = element.querySelectorAll('.carousel-slide');
    this.currentIndex = 0;
    this.isPlaying = true;
    this.autoplayInterval = null;

    // Options
    this.options = {
      autoplay: options.autoplay !== undefined ? options.autoplay : true,
      interval: options.interval || 5000, // 5 seconds default
      pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : true,
      swipe: options.swipe !== undefined ? options.swipe : true,
    };

    this.init();
  }

  /**
   * Initialize carousel
   */
  init() {
    if (this.slides.length === 0) return;

    // Create controls if they don't exist
    this.createControls();

    // Setup event listeners
    this.setupEventListeners();

    // Start autoplay if enabled
    if (this.options.autoplay) {
      this.startAutoplay();
    }

    // Show first slide
    this.goToSlide(0);
  }

  /**
   * Create navigation controls
   */
  createControls() {
    const slidesContainer = this.carousel.querySelector('.carousel-slides');

    // Previous button
    if (!this.carousel.querySelector('.carousel-control-prev')) {
      const prevButton = document.createElement('button');
      prevButton.className = 'carousel-control carousel-control-prev';
      prevButton.setAttribute('aria-label', 'Previous slide');
      prevButton.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      this.carousel.appendChild(prevButton);
    }

    // Next button
    if (!this.carousel.querySelector('.carousel-control-next')) {
      const nextButton = document.createElement('button');
      nextButton.className = 'carousel-control carousel-control-next';
      nextButton.setAttribute('aria-label', 'Next slide');
      nextButton.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      this.carousel.appendChild(nextButton);
    }

    // Indicators
    if (!this.carousel.querySelector('.carousel-indicators')) {
      const indicators = document.createElement('div');
      indicators.className = 'carousel-indicators';
      indicators.setAttribute('role', 'tablist');

      this.slides.forEach((slide, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('type', 'button');
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        indicator.dataset.index = index;
        indicators.appendChild(indicator);
      });

      this.carousel.appendChild(indicators);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Previous/Next buttons
    const prevButton = this.carousel.querySelector('.carousel-control-prev');
    const nextButton = this.carousel.querySelector('.carousel-control-next');

    if (prevButton) {
      prevButton.addEventListener('click', () => this.prev());
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => this.next());
    }

    // Indicator dots
    const indicators = this.carousel.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Pause on hover
    if (this.options.pauseOnHover) {
      this.carousel.addEventListener('mouseenter', () => this.pause());
      this.carousel.addEventListener('mouseleave', () => this.play());
    }

    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Touch/swipe support
    if (this.options.swipe) {
      this.setupSwipe();
    }
  }

  /**
   * Setup touch swipe support
   */
  setupSwipe() {
    let startX = 0;
    let endX = 0;

    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.carousel.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    }, { passive: true });

    this.carousel.addEventListener('touchend', () => {
      const diff = startX - endX;

      // Swipe threshold: 50px
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next(); // Swipe left -> next
        } else {
          this.prev(); // Swipe right -> prev
        }
      }
    });
  }

  /**
   * Go to specific slide
   */
  goToSlide(index) {
    this.currentIndex = index;

    // Update slides position
    const slidesContainer = this.carousel.querySelector('.carousel-slides');
    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    // Update indicators
    const indicators = this.carousel.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-selected', 'true');
      } else {
        indicator.classList.remove('active');
        indicator.setAttribute('aria-selected', 'false');
      }
    });

    // Trigger custom event
    const event = new CustomEvent('slideChange', {
      detail: { index, slide: this.slides[index] },
    });
    this.carousel.dispatchEvent(event);
  }

  /**
   * Go to next slide
   */
  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  /**
   * Go to previous slide
   */
  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  /**
   * Start autoplay
   */
  startAutoplay() {
    if (this.autoplayInterval) return;

    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.options.interval);

    this.isPlaying = true;
  }

  /**
   * Stop autoplay
   */
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }

    this.isPlaying = false;
  }

  /**
   * Pause autoplay
   */
  pause() {
    if (this.options.autoplay && this.isPlaying) {
      this.stopAutoplay();
    }
  }

  /**
   * Resume autoplay
   */
  play() {
    if (this.options.autoplay && !this.isPlaying) {
      this.startAutoplay();
    }
  }

  /**
   * Toggle autoplay
   */
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Destroy carousel
   */
  destroy() {
    this.stopAutoplay();
    // Remove event listeners if needed
  }
}

// Auto-initialize carousels
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    const autoplay = carousel.dataset.autoplay !== 'false';
    const interval = parseInt(carousel.dataset.interval) || 5000;

    new Carousel(carousel, { autoplay, interval });
  });
});

// Export for manual initialization
if (typeof window !== 'undefined') {
  window.Carousel = Carousel;
}
