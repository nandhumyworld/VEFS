/**
 * Events Page JavaScript
 * Handles event filtering and display
 */

class EventsPage {
  constructor() {
    this.events = [];
    this.filteredEvents = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    await this.loadEvents();
    this.renderEvents();
    this.setupFilters();
    this.handleHashNavigation();
  }

  async loadEvents() {
    try {
      const response = await fetch('data/events.json');
      if (!response.ok) throw new Error('Failed to load events');
      const data = await response.json();
      this.events = data.events.sort((a, b) => new Date(a.date.start) - new Date(b.date.start));
      this.filteredEvents = this.events;
    } catch (error) {
      console.error('Error loading events:', error);
      this.showError();
    }
  }

  filterEvents(filter) {
    this.currentFilter = filter;

    if (filter === 'all') {
      this.filteredEvents = this.events;
    } else if (filter === 'upcoming') {
      this.filteredEvents = this.events.filter(e => e.status === 'upcoming');
    } else {
      this.filteredEvents = this.events.filter(e => e.type === filter);
    }

    this.renderEvents();
  }

  renderEvents() {
    const container = document.getElementById('events-container');
    const noResults = document.getElementById('no-results');

    if (!container) return;

    if (this.filteredEvents.length === 0) {
      container.innerHTML = '';
      if (noResults) noResults.classList.remove('hidden');
      return;
    }

    if (noResults) noResults.classList.add('hidden');

    container.innerHTML = this.filteredEvents.map(event => {
      const startDate = new Date(event.date.start);
      const isPast = event.status === 'completed';
      const isFull = event.status === 'full';
      const isFree = event.fee === 0;

      return `
        <div class="card animate-fade-in">
          ${event.images?.featured ? `
            <div class="card-image">
              <img src="${event.images.featured}" alt="${event.title}" loading="lazy">
              ${event.featured ? '<span class="card-badge card-badge-featured" style="position: absolute; top: var(--space-sm); left: var(--space-sm);">Featured</span>' : ''}
              ${isFull ? '<span class="card-badge card-badge-danger" style="position: absolute; top: var(--space-sm); right: var(--space-sm);">Full</span>' : ''}
              ${isPast ? '<span class="card-badge" style="position: absolute; top: var(--space-sm); right: var(--space-sm); background-color: var(--color-gray-600);">Completed</span>' : ''}
            </div>
          ` : ''}
          <div class="card-body">
            <div class="card-meta" style="margin-bottom: var(--space-sm);">
              <span>📅 ${window.VEFSUtils.formatDate(startDate)}</span>
              <span>📍 ${event.location.city}</span>
            </div>
            <h3 class="card-title">${event.title}</h3>
            <p class="card-description">${event.shortDescription}</p>

            <div class="card-footer" style="margin-top: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: var(--color-primary);">${isFree ? 'FREE' : '₹' + event.fee}</span>
              <button class="btn btn-sm ${isFull || isPast ? 'btn-outline' : 'btn-primary'}" onclick="eventsPageInstance.showDetails('${event.id}')">
                ${isPast ? 'View Details' : isFull ? 'View Details' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  showDetails(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    const modalBody = document.getElementById('event-modal-body');
    if (!modalBody) return;

    window.location.hash = event.id;

    const startDate = new Date(event.date.start);
    const endDate = new Date(event.date.end);
    const isPast = event.status === 'completed';
    const isFull = event.status === 'full';

    modalBody.innerHTML = `
      ${event.images?.hero ? `
        <img src="${event.images.hero}" alt="${event.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
      ` : ''}

      <h3>${event.title}</h3>

      <div style="display: flex; gap: var(--space-md); margin: var(--space-md) 0; flex-wrap: wrap;">
        <div><strong>📅 Date:</strong> ${window.VEFSUtils.formatDate(startDate)}</div>
        <div><strong>⏰ Time:</strong> ${window.VEFSUtils.formatTime(startDate)} - ${window.VEFSUtils.formatTime(endDate)}</div>
        <div><strong>📍 Location:</strong> ${event.location.venue}, ${event.location.city}</div>
        <div><strong>💰 Fee:</strong> ${event.fee === 0 ? 'FREE' : '₹' + event.fee}</div>
      </div>

      <p style="margin-bottom: var(--space-lg); line-height: 1.7;">${event.fullDescription || event.shortDescription}</p>

      ${event.organizer ? `
        <div style="margin: var(--space-lg) 0; padding: var(--space-md); background-color: var(--color-gray-50); border-radius: var(--radius-md);">
          <strong>Organizer:</strong> ${event.organizer.name}<br>
          <strong>Contact:</strong> ${event.organizer.email} | ${event.organizer.phone}
        </div>
      ` : ''}

      ${!isPast && !isFull ? `
        <a href="/contact.html?inquiry=event&event=${event.id}" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-lg);">
          Register for This Event
        </a>
      ` : isPast ? `
        <div class="alert alert-info" style="margin-top: var(--space-lg);">This event has been completed.</div>
      ` : `
        <div class="alert alert-warning" style="margin-top: var(--space-lg);">This event is now full. Contact us to be added to the waitlist.</div>
      `}
    `;

    if (window.modalInstance) {
      window.modalInstance.open('event-modal');
    }
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.filterEvents(button.getAttribute('data-filter'));
      });
    });
  }

  handleHashNavigation() {
    if (window.location.hash) {
      const eventId = window.location.hash.substring(1);
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        setTimeout(() => this.showDetails(event.id), 100);
      }
    }
  }

  showError() {
    const container = document.getElementById('events-container');
    if (!container) return;
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl);">
        <div class="alert alert-error">Unable to load events. Please try again later.</div>
      </div>
    `;
  }
}

let eventsPageInstance;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    eventsPageInstance = new EventsPage();
  });
} else {
  eventsPageInstance = new EventsPage();
}
