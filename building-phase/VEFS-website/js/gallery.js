/**
 * Gallery Page JavaScript
 * Loads photos from data/gallery.json (admin-managed, Cloudinary-hosted).
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
    this.buildYearFilters();
    this.setupFilters();
    this.setupSearch();
    this.setupLightbox();
    this.renderGallery();
  }

  // ─── Load photos from admin-managed JSON ──────────────────────────────────

  async loadPhotos() {
    try {
      const json = await this.fetchJSON('data/gallery.json');
      const items = (json && Array.isArray(json.items)) ? json.items : [];
      this.photos = items
        .filter(it => !it.disabled && !it.hiddenFromPublic)
        .map((it, index) => this.buildPhotoFromItem(it, index));
    } catch (err) {
      console.warn('Could not load gallery images:', err);
      this.photos = [];
    }
    this.filteredPhotos = [...this.photos];
    this.updateResultsCount();
  }

  async fetchJSON(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      const text = await res.text();
      if (text.trim().startsWith('<?')) return null; // PHP not executed
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  // ─── Build a photo object from the new admin schema item ───────────────────

  buildPhotoFromItem(item, index) {
    const year = item.year
      ? parseInt(item.year)
      : (item.createdAt ? new Date(item.createdAt).getFullYear() : new Date().getFullYear());

    return {
      id:          item.id || `photo-${index}`,
      filename:    '',
      title:       item.title || `Photo ${index + 1}`,
      description: item.description || '',
      category:    'general',
      year:        Number.isFinite(year) ? year : new Date().getFullYear(),
      date:        item.createdAt || `${year}-01-01`,
      url:         item.imageUrl || '',
      isNew:       item.isNew,
      createdAt:   item.createdAt || null,
    };
  }

  // ─── Build year filter buttons dynamically ─────────────────────────────────

  buildYearFilters() {
    const years = [...new Set(this.photos.map(p => p.year))].sort((a, b) => b - a);
    const container = document.getElementById('gallery-filters');

    // Remove existing hard-coded year buttons
    container.querySelectorAll('[data-filter-type="year"]').forEach(btn => btn.remove());

    // Anchor insertion after the "All Photos" button
    const allPhotosBtn = container.querySelector('[data-filter-value="all"]');
    if (!allPhotosBtn) return;

    let insertAfter = allPhotosBtn;
    years.forEach(year => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline btn-sm gallery-filter-btn';
      btn.dataset.filterType  = 'year';
      btn.dataset.filterValue = String(year);
      btn.textContent = String(year);
      insertAfter.insertAdjacentElement('afterend', btn);
      insertAfter = btn;
    });
  }

  // ─── Filters ───────────────────────────────────────────────────────────────

  setupFilters() {
    document.getElementById('gallery-filters').addEventListener('click', (e) => {
      const button = e.target.closest('[data-filter-type]');
      if (!button) return;

      const filterType  = button.dataset.filterType;
      const filterValue = button.dataset.filterValue;

      // Update active state within this filter group
      document.querySelectorAll(`[data-filter-type="${filterType}"]`).forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      this.filters[filterType] = filterValue === 'all' ? (filterType === 'category' ? 'all' : null) : filterValue;

      // "All Photos" clears year filter too
      if (filterType === 'category' && filterValue === 'all') {
        this.filters.year = null;
        document.querySelectorAll('[data-filter-type="year"]').forEach(btn => btn.classList.remove('active'));
      }

      this.applyFilters();
    });

  }

  setupSearch() {
    const input = document.getElementById('gallery-search');
    if (!input) return;
    input.addEventListener('input', (e) => {
      this.filters.search = e.target.value.toLowerCase();
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredPhotos = this.photos.filter(photo => {
      if (this.filters.category && this.filters.category !== 'all') {
        if (photo.category !== this.filters.category) return false;
      }
      if (this.filters.year) {
        if (photo.year.toString() !== this.filters.year) return false;
      }
      if (this.filters.search) {
        const text = `${photo.title} ${photo.category} ${photo.year}`.toLowerCase();
        if (!text.includes(this.filters.search)) return false;
      }
      return true;
    });

    this.updateResultsCount();
    this.renderGallery();
  }

  resetFilters() {
    this.filters = { category: 'all', year: null, search: '' };
    document.querySelectorAll('[data-filter-type]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter-value="all"]').classList.add('active');
    document.getElementById('gallery-search').value = '';
    this.applyFilters();
  }

  updateResultsCount() {
    document.getElementById('count-current').textContent = this.filteredPhotos.length;
    document.getElementById('count-total').textContent   = this.photos.length;
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  renderGallery() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const photosGrid     = document.getElementById('photos-grid');
    const noResults      = document.getElementById('no-results');

    loadingSpinner.style.display = 'none';

    if (this.filteredPhotos.length === 0) {
      photosGrid.style.display = 'none';
      noResults.style.display  = 'block';
      return;
    }

    noResults.style.display  = 'none';
    photosGrid.style.display = 'block';

    const renderBadge = (typeof window !== 'undefined' && typeof window.renderNewBadge === 'function')
      ? window.renderNewBadge
      : () => '';

    photosGrid.innerHTML = this.filteredPhotos.map((photo, index) => {
      const cacheBust = photo.modified ? `?v=${photo.modified}` : '';
      const altText = photo.title ? this.escapeAttr(photo.title) : `VEFS photo ${photo.year}`;
      return `
      <div class="photo-item animate-fade-in" onclick="galleryPageInstance.openLightbox(${index})" role="button" tabindex="0" aria-label="View photo ${photo.year}">
        <img
          src="${photo.url}${cacheBust}"
          alt="${altText}"
          loading="lazy"
          onerror="this.parentElement.style.display='none'"
        >
        ${renderBadge(photo)}
        <div class="photo-overlay">
          <div style="font-size:var(--font-size-sm);opacity:0.9;">${photo.year}</div>
        </div>
      </div>
    `;
    }).join('');

    // Keyboard support
    photosGrid.querySelectorAll('.photo-item').forEach((item, i) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') this.openLightbox(i);
      });
    });
  }

  // ─── Lightbox ──────────────────────────────────────────────────────────────

  setupLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    document.getElementById('lightbox-close-btn').addEventListener('click', () => this.closeLightbox());
    document.getElementById('lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); this.navigateLightbox(-1); });
    document.getElementById('lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); this.navigateLightbox(1); });

    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape')     this.closeLightbox();
      if (e.key === 'ArrowLeft')  this.navigateLightbox(-1);
      if (e.key === 'ArrowRight') this.navigateLightbox(1);
    });

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) this.closeLightbox(); });
  }

  openLightbox(index) {
    this.currentPhotoIndex = index;
    const photo = this.filteredPhotos[index];

    document.getElementById('lightbox-image').src           = photo.url;
    document.getElementById('lightbox-image').alt           = photo.title;
    document.getElementById('lightbox-title').textContent   = photo.title;
    document.getElementById('lightbox-date').textContent    = `📅 ${photo.year}`;
    document.getElementById('lightbox-category').textContent = `📂 ${this.capitalize(photo.category)}`;
    document.getElementById('lightbox-location').textContent = '';
    document.getElementById('lightbox-description').textContent = '';
    document.getElementById('lightbox-counter').textContent = `Photo ${index + 1} of ${this.filteredPhotos.length}`;

    const lightbox = document.getElementById('gallery-lightbox');
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  navigateLightbox(direction) {
    this.currentPhotoIndex = (this.currentPhotoIndex + direction + this.filteredPhotos.length) % this.filteredPhotos.length;
    this.openLightbox(this.currentPhotoIndex);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  escapeAttr(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
}

// Initialize
let galleryPageInstance;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { galleryPageInstance = new GalleryPage(); });
} else {
  galleryPageInstance = new GalleryPage();
}
