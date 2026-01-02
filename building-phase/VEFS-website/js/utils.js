/**
 * VEFS Foundation - Utility Functions
 *
 * Shared helper functions used throughout the application
 */

/* ===== Data Loading Utilities ===== */

/**
 * Fetch JSON data with caching
 * @param {string} url - URL to fetch
 * @param {number} cacheDuration - Cache duration in milliseconds (default: 5 minutes)
 * @returns {Promise<Object>} Parsed JSON data
 */
async function fetchJSON(url, cacheDuration = 300000) {
  const cacheKey = `vefs_cache_${url}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Return cached data if still fresh
    if (now - timestamp < cacheDuration) {
      return data;
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the data
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);

    // Return cached data if available, even if expired
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }

    throw error;
  }
}

/* ===== Date Formatting Utilities ===== */

/**
 * Format ISO date string to readable format
 * @param {string} isoDate - ISO 8601 date string
 * @param {string} format - Format type: 'short', 'long', 'time'
 * @returns {string} Formatted date string
 */
function formatDate(isoDate, format = 'short') {
  if (!isoDate) return '';

  const date = new Date(isoDate);

  if (format === 'short') {
    // "15 Jan 2025"
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } else if (format === 'long') {
    // "January 15, 2025"
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } else if (format === 'time') {
    // "9:00 AM"
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else if (format === 'datetime') {
    // "15 Jan 2025, 9:00 AM"
    return `${formatDate(isoDate, 'short')}, ${formatDate(isoDate, 'time')}`;
  }

  return date.toLocaleDateString();
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Relative time string
 */
function getRelativeTime(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 7) {
    return formatDate(isoDate, 'short');
  } else if (diffDay > 0) {
    return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
  } else if (diffHour > 0) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  } else if (diffMin > 0) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  } else {
    return 'just now';
  }
}

/* ===== String Utilities ===== */

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Convert string to URL-friendly slug
 * @param {string} text - Text to slugify
 * @returns {string} URL-friendly slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

/* ===== DOM Utilities ===== */

/**
 * Safely get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null
 */
function getEl(id) {
  return document.getElementById(id);
}

/**
 * Safely query selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {HTMLElement|null} Element or null
 */
function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Safely query all selectors
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {NodeList} NodeList of elements
 */
function qsAll(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Add event listener to multiple elements
 * @param {NodeList|Array} elements - Elements to add listener to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
function addEventListeners(elements, event, handler) {
  elements.forEach(el => el.addEventListener(event, handler));
}

/* ===== Scroll Utilities ===== */

/**
 * Smooth scroll to element
 * @param {string|HTMLElement} target - Element or selector
 * @param {number} offset - Offset from top (default: nav height)
 */
function smoothScrollTo(target, offset = 80) {
  const element = typeof target === 'string' ? qs(target) : target;
  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Percentage of element that should be visible (0-1)
 * @returns {boolean} True if in viewport
 */
function isInViewport(element, threshold = 0.1) {
  const rect = element.getBoundingClientRect();
  const elementHeight = rect.height;
  const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

  return visibleHeight >= (elementHeight * threshold);
}

/* ===== Form Utilities ===== */

/**
 * Serialize form data to object
 * @param {HTMLFormElement} form - Form element
 * @returns {Object} Form data as object
 */
function serializeForm(form) {
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // Handle multiple values (checkboxes)
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }

  return data;
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid (10 digits starting with 6-9)
 */
function isValidPhone(phone) {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone.replace(/\s+/g, ''));
}

/* ===== Loading Utilities ===== */

/**
 * Show loading spinner in element
 * @param {HTMLElement} element - Element to show spinner in
 */
function showLoading(element) {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  spinner.innerHTML = '<div class="spinner-circle"></div>';
  element.appendChild(spinner);
}

/**
 * Hide loading spinner in element
 * @param {HTMLElement} element - Element to hide spinner from
 */
function hideLoading(element) {
  const spinner = element.querySelector('.spinner');
  if (spinner) {
    spinner.remove();
  }
}

/* ===== Debounce & Throttle ===== */

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ===== Export for use in other scripts ===== */

// Make utilities available globally
window.VEFSUtils = {
  fetchJSON,
  formatDate,
  getRelativeTime,
  truncate,
  slugify,
  getEl,
  qs,
  qsAll,
  addEventListeners,
  smoothScrollTo,
  isInViewport,
  serializeForm,
  isValidEmail,
  isValidPhone,
  showLoading,
  hideLoading,
  debounce,
  throttle
};
