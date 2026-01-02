/**
 * Gallery Page JavaScript
 * Handles photo display, filtering, search, and lightbox functionality
 */

class GalleryPage {
  constructor() {
    this.photos = [];
    this.filteredPhotos = [];
    this.currentPhotoIndex = 0;
    this.filters = {
      category: 'all',
      year: null,
      search: ''
    };
    this.init();
  }

  async init() {
    await this.loadPhotos();
    this.setupFilters();
    this.setupSearch();
    this.setupLightbox();
    this.renderGallery();
  }

  /**
   * Load photos data (placeholder - will use JSON in production)
   */
  async loadPhotos() {
    // TODO: Replace with actual JSON file in production
    // const response = await fetch('data/gallery.json');
    // this.photos = await response.json();

    // For now, create sample data
    this.photos = this.generateSamplePhotos();
    this.filteredPhotos = [...this.photos];
    this.updateResultsCount();
  }

  /**
   * Generate sample photos for demonstration
   */
  generateSamplePhotos() {
    const categories = ['programs', 'trainings', 'events', 'nature'];
    const years = [2023, 2024, 2025];
    const photos = [];

    for (let i = 1; i <= 24; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const year = years[Math.floor(Math.random() * years.length)];

      photos.push({
        id: `photo-${i}`,
        title: `${this.capitalize(category)} Photo ${i}`,
        description: `A memorable moment from our ${category} activities. Capturing the essence of community engagement and environmental conservation.`,
        category: category,
        year: year,
        date: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
        location: i % 3 === 0 ? 'Coimbatore' : i % 3 === 1 ? 'Salem' : 'Madurai',
        image: `/images/gallery/${year}/${category}/photo-${i}.jpg`  // Placeholder path
      });
    }

    return photos;
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
        this.filters[filterType] = filterValue === 'all' ? (filterType === 'category' ? 'all' : null) : filterValue;

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
    const searchInput = document.getElementById('gallery-search');

    searchInput.addEventListener('input', (e) => {
      this.filters.search = e.target.value.toLowerCase();
      this.applyFilters();
    });
  }

  /**
   * Apply all active filters
   */
  applyFilters() {
    this.filteredPhotos = this.photos.filter(photo => {
      // Category filter
      if (this.filters.category && this.filters.category !== 'all') {
        if (photo.category !== this.filters.category) {
          return false;
        }
      }

      // Year filter
      if (this.filters.year) {
        if (photo.year.toString() !== this.filters.year) {
          return false;
        }
      }

      // Search filter
      if (this.filters.search) {
        const searchableText = `${photo.title} ${photo.description} ${photo.category}`.toLowerCase();
        if (!searchableText.includes(this.filters.search)) {
          return false;
        }
      }

      return true;
    });

    this.updateResultsCount();
    this.renderGallery();
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.filters = {
      category: 'all',
      year: null,
      search: ''
    };

    // Reset UI
    document.querySelectorAll('[data-filter-type]').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector('[data-filter-value="all"]').classList.add('active');
    document.getElementById('gallery-search').value = '';

    this.applyFilters();
  }

  /**
   * Update results count display
   */
  updateResultsCount() {
    document.getElementById('count-current').textContent = this.filteredPhotos.length;
    document.getElementById('count-total').textContent = this.photos.length;
  }

  /**
   * Render gallery grid
   */
  renderGallery() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const photosGrid = document.getElementById('photos-grid');
    const noResults = document.getElementById('no-results');

    // Hide loading
    loadingSpinner.style.display = 'none';

    // Check if no results
    if (this.filteredPhotos.length === 0) {
      photosGrid.style.display = 'none';
      noResults.style.display = 'block';
      return;
    }

    // Show grid
    noResults.style.display = 'none';
    photosGrid.style.display = 'block';

    // Render photos
    photosGrid.innerHTML = this.filteredPhotos.map((photo, index) => `
      <div class="photo-item animate-fade-in" onclick="galleryPageInstance.openLightbox(${index})">
        <img
          src="${photo.image}"
          alt="${photo.title}"
          loading="lazy"
          onerror="this.src='/images/placeholder.jpg'"
        >
        <div class="photo-overlay">
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">${photo.title}</div>
            <div style="font-size: var(--font-size-sm); opacity: 0.9;">${photo.date.split('-')[0]}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Setup lightbox functionality
   */
  setupLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    const closeBtn = lightbox.querySelector('.modal-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    // Close button
    closeBtn.addEventListener('click', () => {
      this.closeLightbox();
    });

    // Navigation buttons
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateLightbox(-1);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateLightbox(1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          this.closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          this.navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
          this.navigateLightbox(1);
        }
      }
    });

    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });
  }

  /**
   * Open lightbox with photo at index
   */
  openLightbox(index) {
    this.currentPhotoIndex = index;
    const photo = this.filteredPhotos[index];

    // Update lightbox content
    document.getElementById('lightbox-image').src = photo.image;
    document.getElementById('lightbox-image').alt = photo.title;
    document.getElementById('lightbox-title').textContent = photo.title;
    document.getElementById('lightbox-date').textContent = `📅 ${new Date(photo.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}`;
    document.getElementById('lightbox-category').textContent = `📂 ${this.capitalize(photo.category)}`;
    document.getElementById('lightbox-location').textContent = `📍 ${photo.location}`;
    document.getElementById('lightbox-description').textContent = photo.description;
    document.getElementById('lightbox-counter').textContent = `Photo ${index + 1} of ${this.filteredPhotos.length}`;

    // Show lightbox
    const lightbox = document.getElementById('gallery-lightbox');
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close lightbox
   */
  closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Navigate lightbox (prev/next)
   */
  navigateLightbox(direction) {
    this.currentPhotoIndex += direction;

    // Wrap around
    if (this.currentPhotoIndex < 0) {
      this.currentPhotoIndex = this.filteredPhotos.length - 1;
    } else if (this.currentPhotoIndex >= this.filteredPhotos.length) {
      this.currentPhotoIndex = 0;
    }

    this.openLightbox(this.currentPhotoIndex);
  }

  /**
   * Capitalize string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize when DOM is ready
let galleryPageInstance;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    galleryPageInstance = new GalleryPage();
  });
} else {
  galleryPageInstance = new GalleryPage();
}
