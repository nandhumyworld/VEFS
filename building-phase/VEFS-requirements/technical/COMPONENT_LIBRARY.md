# Component Library & Design Patterns

**Project:** VEFS (Valluvam Ecological Farming and Social Welfare Foundation)
**Document Version:** 1.0
**Last Updated:** 2025-12-24
**Status:** Complete

---

## Overview

This document defines the reusable component library and design patterns for the VEFS website. All components are built with **Vanilla JavaScript and CSS** (no framework dependencies), designed to be lightweight, accessible, and elegant while working seamlessly with Hostinger static hosting.

### Design Principles

1. **Modular & Reusable** - Components work across all pages
2. **Lightweight** - Minimal JavaScript, optimized CSS
3. **Accessible** - WCAG AA compliant, keyboard-friendly
4. **Themeable** - CSS variables for easy customization
5. **Responsive** - Mobile-first, works on all devices
6. **Elegant** - Clean, professional aesthetic aligned with VEFS brand

---

## 1. Theming System

### 1.1 CSS Variables (Custom Properties)

**File:** `css/theme.css`

```css
:root {
  /* Brand Colors */
  --color-primary: #6B8E23; /* Sage Green */
  --color-primary-light: #8AAA3F;
  --color-primary-dark: #556B1B;
  --color-primary-pale: #E8F0D8;

  --color-secondary: #D4A574; /* Golden/Amber */
  --color-secondary-light: #E6C19A;
  --color-secondary-dark: #B8895E;

  --color-accent: #8B7355; /* Earth Brown */

  /* Neutrals */
  --color-white: #FFFFFF;
  --color-off-white: #FAFAF8;
  --color-gray-100: #F5F5F3;
  --color-gray-200: #E8E8E4;
  --color-gray-300: #D1D1CC;
  --color-gray-400: #9E9E96;
  --color-gray-500: #6B6B63;
  --color-gray-600: #4A4A44;
  --color-gray-700: #2E2E2B;
  --color-gray-800: #1A1A18;
  --color-black: #000000;

  /* Semantic Colors */
  --color-success: #4CAF50;
  --color-error: #E53935;
  --color-warning: #FFA726;
  --color-info: #29B6F6;

  /* Typography */
  --font-serif: 'Lora', 'Georgia', serif;
  --font-sans: 'Inter', 'Helvetica Neue', Arial, sans-serif;

  --font-size-xs: 0.694rem;   /* 11.1px */
  --font-size-sm: 0.833rem;   /* 13.3px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-md: 1.2rem;     /* 19.2px */
  --font-size-lg: 1.44rem;    /* 23px */
  --font-size-xl: 1.728rem;   /* 27.6px */
  --font-size-2xl: 2.074rem;  /* 33.2px */
  --font-size-3xl: 2.488rem;  /* 39.8px */
  --font-size-4xl: 2.986rem;  /* 47.8px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing (8px base unit) */
  --space-xs: 0.5rem;   /* 8px */
  --space-sm: 1rem;     /* 16px */
  --space-md: 1.5rem;   /* 24px */
  --space-lg: 2rem;     /* 32px */
  --space-xl: 3rem;     /* 48px */
  --space-2xl: 4rem;    /* 64px */
  --space-3xl: 6rem;    /* 96px */

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04);

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;

  /* Z-index Scale */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-tooltip: 600;
}
```

### 1.2 Usage Example

```css
/* Use CSS variables in components */
.button {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-base);
}

.button:hover {
  background-color: var(--color-primary-dark);
}
```

**Benefits:**
- Change entire theme by updating root variables
- Consistent design across all components
- Easy to create color variants
- Support for dark mode in future (override variables)

---

## 2. Layout Components

### 2.1 Container

**Purpose:** Max-width wrapper for content sections

**HTML:**
```html
<div class="container">
  <!-- Content here -->
</div>

<!-- Fluid (full-width) variant -->
<div class="container-fluid">
  <!-- Content here -->
</div>
```

**CSS:**
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-sm);
  padding-right: var(--space-sm);
}

@media (min-width: 768px) {
  .container {
    padding-left: var(--space-lg);
    padding-right: var(--space-lg);
  }
}

.container-fluid {
  width: 100%;
  padding-left: var(--space-sm);
  padding-right: var(--space-sm);
}
```

**Props:**
- None (static layout component)

**Usage:**
- Wrap page sections to maintain consistent max-width
- Use `.container-fluid` for full-width sections (e.g., hero images)

---

### 2.2 Section Layouts

**Purpose:** Pre-built section templates for common page layouts

**HTML:**
```html
<!-- Basic Section -->
<section class="section">
  <div class="container">
    <h2 class="section-title">Section Title</h2>
    <p class="section-subtitle">Optional subtitle or description</p>
    <div class="section-content">
      <!-- Content here -->
    </div>
  </div>
</section>

<!-- Section with background -->
<section class="section section-bg-gray">
  <!-- Content -->
</section>

<!-- Section with padding variants -->
<section class="section section-py-sm">  <!-- Small padding -->
<section class="section section-py-lg">  <!-- Large padding -->
<section class="section section-py-xl">  <!-- Extra large padding -->
```

**CSS:**
```css
.section {
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-2xl);
}

.section-py-sm {
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
}

.section-py-lg {
  padding-top: var(--space-3xl);
  padding-bottom: var(--space-3xl);
}

.section-py-xl {
  padding-top: 8rem;
  padding-bottom: 8rem;
}

/* Background variants */
.section-bg-gray {
  background-color: var(--color-gray-100);
}

.section-bg-primary {
  background-color: var(--color-primary-pale);
}

.section-bg-white {
  background-color: var(--color-white);
}

/* Section header */
.section-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
  text-align: center;
  margin-bottom: var(--space-sm);
}

.section-subtitle {
  font-family: var(--font-sans);
  font-size: var(--font-size-md);
  color: var(--color-gray-600);
  text-align: center;
  margin-bottom: var(--space-xl);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.section-content {
  /* Content area - no default styles */
}
```

**Visual Example:**

```
┌─────────────────────────────────────┐
│         SECTION PADDING TOP         │
│                                     │
│   ┌───────────────────────────┐   │
│   │     Section Title         │   │
│   │  Optional subtitle here   │   │
│   │                           │   │
│   │    Section Content        │   │
│   │  (cards, text, images)    │   │
│   └───────────────────────────┘   │
│                                     │
│        SECTION PADDING BOTTOM       │
└─────────────────────────────────────┘
```

**Usage:**
- Use `.section` for all major page sections
- Add background variants to alternate section colors
- Center section titles with `.section-title`
- Use `.section-subtitle` for descriptive text

---

### 2.3 Spacing Utilities

**Purpose:** Helper classes for margins and padding

**CSS:**
```css
/* Margin utilities (m = margin) */
.m-0 { margin: 0; }
.mt-0 { margin-top: 0; }
.mb-0 { margin-bottom: 0; }
.ml-0 { margin-left: 0; }
.mr-0 { margin-right: 0; }

.m-xs { margin: var(--space-xs); }
.mt-xs { margin-top: var(--space-xs); }
.mb-xs { margin-bottom: var(--space-xs); }
.ml-xs { margin-left: var(--space-xs); }
.mr-xs { margin-right: var(--space-xs); }

.m-sm { margin: var(--space-sm); }
.mt-sm { margin-top: var(--space-sm); }
.mb-sm { margin-bottom: var(--space-sm); }
.ml-sm { margin-left: var(--space-sm); }
.mr-sm { margin-right: var(--space-sm); }

.m-md { margin: var(--space-md); }
.mt-md { margin-top: var(--space-md); }
.mb-md { margin-bottom: var(--space-md); }
.ml-md { margin-left: var(--space-md); }
.mr-md { margin-right: var(--space-md); }

.m-lg { margin: var(--space-lg); }
.mt-lg { margin-top: var(--space-lg); }
.mb-lg { margin-bottom: var(--space-lg); }
.ml-lg { margin-left: var(--space-lg); }
.mr-lg { margin-right: var(--space-lg); }

.m-xl { margin: var(--space-xl); }
.mt-xl { margin-top: var(--space-xl); }
.mb-xl { margin-bottom: var(--space-xl); }
.ml-xl { margin-left: var(--space-xl); }
.mr-xl { margin-right: var(--space-xl); }

/* Margin auto (for centering) */
.mx-auto { margin-left: auto; margin-right: auto; }

/* Padding utilities (p = padding) */
.p-0 { padding: 0; }
.pt-0 { padding-top: 0; }
.pb-0 { padding-bottom: 0; }
.pl-0 { padding-left: 0; }
.pr-0 { padding-right: 0; }

.p-xs { padding: var(--space-xs); }
.pt-xs { padding-top: var(--space-xs); }
.pb-xs { padding-bottom: var(--space-xs); }
.pl-xs { padding-left: var(--space-xs); }
.pr-xs { padding-right: var(--space-xs); }

.p-sm { padding: var(--space-sm); }
.pt-sm { padding-top: var(--space-sm); }
.pb-sm { padding-bottom: var(--space-sm); }
.pl-sm { padding-left: var(--space-sm); }
.pr-sm { padding-right: var(--space-sm); }

.p-md { padding: var(--space-md); }
.pt-md { padding-top: var(--space-md); }
.pb-md { padding-bottom: var(--space-md); }
.pl-md { padding-left: var(--space-md); }
.pr-md { padding-right: var(--space-md); }

.p-lg { padding: var(--space-lg); }
.pt-lg { padding-top: var(--space-lg); }
.pb-lg { padding-bottom: var(--space-lg); }
.pl-lg { padding-left: var(--space-lg); }
.pr-lg { padding-right: var(--space-lg); }

.p-xl { padding: var(--space-xl); }
.pt-xl { padding-top: var(--space-xl); }
.pb-xl { padding-bottom: var(--space-xl); }
.pl-xl { padding-left: var(--space-xl); }
.pr-xl { padding-right: var(--space-xl); }
```

**Usage:**
```html
<div class="mt-lg mb-xl">Content with custom margins</div>
<div class="p-md">Content with padding</div>
<img src="image.jpg" class="mb-sm">
```

---

## 3. Navigation Components

### 3.1 Main Header & Navigation

**HTML:**
```html
<header class="header" id="main-header">
  <div class="container">
    <div class="header-content">
      <!-- Logo -->
      <a href="/" class="header-logo">
        <img src="/images/vefs-logo.png" alt="VEFS Foundation" class="logo-img">
        <span class="logo-text">VEFS</span>
      </a>

      <!-- Mobile menu toggle -->
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="main-nav">
        <span class="nav-toggle-icon"></span>
      </button>

      <!-- Navigation -->
      <nav class="nav" id="main-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="/" class="nav-link active" aria-current="page">Home</a>
          </li>
          <li class="nav-item">
            <a href="/about" class="nav-link">About Us</a>
          </li>
          <li class="nav-item">
            <a href="/programs" class="nav-link">Programs</a>
          </li>
          <li class="nav-item">
            <a href="/trainings" class="nav-link">Trainings</a>
          </li>
          <li class="nav-item">
            <a href="/events" class="nav-link">Events</a>
          </li>
          <li class="nav-item">
            <a href="/gallery" class="nav-link">Gallery</a>
          </li>
          <li class="nav-item">
            <a href="/contact" class="nav-link">Contact</a>
          </li>
          <li class="nav-item nav-item-cta">
            <a href="/donate" class="btn btn-primary btn-sm">Donate</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</header>
```

**CSS:**
```css
/* Header */
.header {
  background-color: var(--color-white);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  transition: box-shadow var(--transition-base);
}

.header.scrolled {
  box-shadow: var(--shadow-md);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) 0;
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  text-decoration: none;
  color: var(--color-gray-800);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  transition: opacity var(--transition-fast);
}

.header-logo:hover {
  opacity: 0.8;
}

.logo-img {
  height: 40px;
  width: auto;
}

.logo-text {
  font-family: var(--font-serif);
}

/* Mobile toggle button */
.nav-toggle {
  display: none; /* Hidden on desktop */
  background: none;
  border: none;
  padding: var(--space-xs);
  cursor: pointer;
  z-index: var(--z-fixed);
}

.nav-toggle-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--color-gray-800);
  position: relative;
  transition: background-color var(--transition-fast);
}

.nav-toggle-icon::before,
.nav-toggle-icon::after {
  content: '';
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--color-gray-800);
  position: absolute;
  transition: transform var(--transition-base);
}

.nav-toggle-icon::before {
  top: -8px;
}

.nav-toggle-icon::after {
  bottom: -8px;
}

/* Hamburger to X animation */
.nav-toggle[aria-expanded="true"] .nav-toggle-icon {
  background-color: transparent;
}

.nav-toggle[aria-expanded="true"] .nav-toggle-icon::before {
  transform: rotate(45deg) translateY(8px);
}

.nav-toggle[aria-expanded="true"] .nav-toggle-icon::after {
  transform: rotate(-45deg) translateY(-8px);
}

/* Navigation */
.nav-list {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: block;
  padding: var(--space-xs) var(--space-sm);
  color: var(--color-gray-700);
  text-decoration: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background-color var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--color-primary);
  background-color: var(--color-gray-100);
}

.nav-link.active {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: var(--space-sm);
  right: var(--space-sm);
  height: 2px;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
}

/* CTA button in nav */
.nav-item-cta {
  margin-left: var(--space-sm);
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .nav-toggle {
    display: block;
  }

  .nav {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    background-color: var(--color-white);
    box-shadow: var(--shadow-xl);
    transform: translateX(100%);
    transition: transform var(--transition-base);
    overflow-y: auto;
    padding-top: 80px; /* Space for close button */
  }

  .nav.active {
    transform: translateX(0);
  }

  .nav-list {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: var(--space-md);
  }

  .nav-link {
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-gray-200);
  }

  .nav-link.active::after {
    left: 0;
    right: 0;
    bottom: -1px;
  }

  .nav-item-cta {
    margin-left: 0;
    margin-top: var(--space-md);
  }

  .nav-item-cta .btn {
    width: 100%;
    justify-content: center;
  }
}
```

**JavaScript:**
```javascript
// File: js/navigation.js

class Navigation {
  constructor() {
    this.header = document.getElementById('main-header');
    this.nav = document.getElementById('main-nav');
    this.toggle = document.querySelector('.nav-toggle');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.init();
  }

  init() {
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

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Sticky header shadow on scroll
    window.addEventListener('scroll', () => this.handleScroll());

    // Set active link based on current page
    this.setActiveLink();
  }

  toggleMobileMenu() {
    const isOpen = this.nav.classList.toggle('active');
    this.toggle.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll when menu open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.nav.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    this.navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});
```

**Visual States:**

1. **Desktop:** Horizontal menu, items inline
2. **Mobile:** Hamburger icon, slide-in menu from right
3. **Scrolled:** Enhanced shadow
4. **Active link:** Green color, underline
5. **Hover:** Light background, green text

**Accessibility Features:**
- ✓ Keyboard navigable (Tab, Enter, Escape)
- ✓ ARIA labels and states
- ✓ Focus indicators
- ✓ Screen reader friendly
- ✓ Semantic HTML (`<nav>`, `<header>`)

---

## 4. Button Components

### 4.1 Button Variants

**HTML:**
```html
<!-- Primary button -->
<button class="btn btn-primary">Donate Now</button>
<a href="/donate" class="btn btn-primary">Donate Now</a>

<!-- Secondary button -->
<button class="btn btn-secondary">Learn More</button>

<!-- Outline button -->
<button class="btn btn-outline">View Details</button>

<!-- Text button (minimal) -->
<button class="btn btn-text">Read More →</button>

<!-- Icon button -->
<button class="btn btn-primary btn-icon">
  <svg class="btn-icon-svg"><!-- icon --></svg>
  <span>Register Now</span>
</button>

<!-- Button sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Full width button -->
<button class="btn btn-primary btn-block">Full Width Button</button>

<!-- Loading state -->
<button class="btn btn-primary" disabled>
  <span class="btn-spinner"></span>
  <span>Loading...</span>
</button>

<!-- Disabled state -->
<button class="btn btn-primary" disabled>Disabled</button>
```

**CSS:**
```css
/* Base button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  user-select: none;
}

.btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Primary button */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Secondary button */
.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
  border-color: var(--color-secondary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-dark);
  border-color: var(--color-secondary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Outline button */
.btn-outline {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-outline:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--color-white);
}

/* Text button */
.btn-text {
  background-color: transparent;
  color: var(--color-primary);
  border-color: transparent;
  padding: var(--space-xs) var(--space-sm);
}

.btn-text:hover:not(:disabled) {
  color: var(--color-primary-dark);
  background-color: var(--color-gray-100);
}

/* Button sizes */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
}

/* Full width */
.btn-block {
  display: flex;
  width: 100%;
}

/* Icon button */
.btn-icon-svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* Loading spinner */
.btn-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Disabled state */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Focus visible (keyboard only) */
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:focus:not(:focus-visible) {
  outline: none;
}
```

**Visual States:**

```
┌─────────────────┐
│  Donate Now     │  ← Default
└─────────────────┘

┌─────────────────┐
│  Donate Now  ↗  │  ← Hover (lifted, shadow)
└─────────────────┘

┌─────────────────┐
│  Loading...  ⟳  │  ← Loading (spinner)
└─────────────────┘

┌─────────────────┐
│  Disabled       │  ← Disabled (faded)
└─────────────────┘
```

**Accessibility:**
- ✓ Keyboard focusable
- ✓ Visible focus indicator
- ✓ Disabled state with `disabled` attribute
- ✓ ARIA labels for icon-only buttons
- ✓ Color contrast meets WCAG AA

**Usage Guidelines:**
- **Primary buttons:** Main actions (Donate, Register, Submit)
- **Secondary buttons:** Secondary actions (Learn More, View Programs)
- **Outline buttons:** Tertiary actions, less emphasis
- **Text buttons:** Inline actions, minimal emphasis
- **Icon buttons:** Actions with clear visual meaning
- **Use sparingly:** Max 1-2 primary buttons per section

---

## 5. Card Components

### 5.1 Event Card

**HTML:**
```html
<article class="card card-event">
  <!-- Card image -->
  <div class="card-image">
    <img src="/images/event-image.jpg" alt="Event name" loading="lazy">
    <div class="card-badge">Workshop</div>
  </div>

  <!-- Card content -->
  <div class="card-body">
    <!-- Meta info -->
    <div class="card-meta">
      <span class="card-meta-item">
        <svg class="icon"><!-- calendar icon --></svg>
        March 15, 2025
      </span>
      <span class="card-meta-item">
        <svg class="icon"><!-- location icon --></svg>
        Chennai
      </span>
    </div>

    <!-- Title -->
    <h3 class="card-title">
      <a href="/events/organic-farming-workshop" class="card-link">
        Organic Farming Workshop for Beginners
      </a>
    </h3>

    <!-- Description -->
    <p class="card-description">
      Learn the fundamentals of organic farming practices and sustainable agriculture techniques.
    </p>

    <!-- Footer with CTA -->
    <div class="card-footer">
      <span class="card-price">Free</span>
      <a href="/events/organic-farming-workshop" class="btn btn-outline btn-sm">
        Register Now
      </a>
    </div>
  </div>
</article>
```

**CSS:**
```css
/* Base card styles */
.card {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Card image */
.card-image {
  position: relative;
  overflow: hidden;
  background-color: var(--color-gray-200);
  aspect-ratio: 16 / 9;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.card:hover .card-image img {
  transform: scale(1.05);
}

/* Card badge */
.card-badge {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  padding: 0.25rem 0.75rem;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Card body */
.card-body {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* Card meta */
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.card-meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-meta-item .icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Card title */
.card-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
  margin-bottom: var(--space-sm);
  line-height: var(--line-height-tight);
}

.card-link {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.card-link:hover {
  color: var(--color-primary);
}

/* Card description */
.card-description {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  line-height: var(--line-height-normal);
  margin-bottom: var(--space-md);
  flex-grow: 1;

  /* Limit to 3 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Card footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-gray-200);
}

.card-price {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

/* Card grid layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

**Props:**
- `card-image`: Image URL, alt text
- `card-badge`: Badge text (e.g., "Workshop", "Free", "New")
- `card-meta`: Date, location, time
- `card-title`: Event/item title
- `card-description`: Short description (3 lines max)
- `card-price`: Price or "Free"
- Button: CTA text and link

**Visual Example:**

```
┌─────────────────────────────────┐
│ [  Event Image with Badge  ]  │
│                                 │
├─────────────────────────────────┤
│  📅 March 15  📍 Chennai       │
│                                 │
│  Organic Farming Workshop       │
│                                 │
│  Learn the fundamentals of      │
│  organic farming practices...   │
│                                 │
├─────────────────────────────────┤
│  Free        [Register Now]     │
└─────────────────────────────────┘
```

**Accessibility:**
- ✓ Semantic HTML (`<article>`)
- ✓ Descriptive alt text for images
- ✓ `loading="lazy"` for performance
- ✓ Color contrast on all text
- ✓ Focusable links with visible focus

---

### 5.2 Program Card

**HTML:**
```html
<div class="card card-program">
  <!-- Icon or image -->
  <div class="card-icon">
    <svg class="icon-lg"><!-- program icon --></svg>
  </div>

  <div class="card-body">
    <h3 class="card-title">School Awareness Programs</h3>
    <p class="card-description">
      Educational sessions for students about indigenous trees, ecology, and environmental conservation.
    </p>

    <ul class="card-features">
      <li>Interactive workshops</li>
      <li>Field visits</li>
      <li>Free materials</li>
    </ul>

    <a href="#program-details" class="btn btn-text" data-modal-trigger="program-school">
      Learn More →
    </a>
  </div>
</div>
```

**CSS:**
```css
.card-program {
  text-align: center;
  padding: var(--space-xl);
}

.card-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-pale);
  border-radius: var(--radius-lg);
}

.icon-lg {
  width: 40px;
  height: 40px;
  fill: var(--color-primary);
}

.card-features {
  list-style: none;
  padding: 0;
  margin: var(--space-md) 0;
  text-align: left;
}

.card-features li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: var(--color-gray-700);
}

.card-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}
```

---

### 5.3 Training Card

**HTML:**
```html
<div class="card card-training">
  <div class="card-header">
    <div class="card-date">
      <span class="card-date-month">MAR</span>
      <span class="card-date-day">15</span>
    </div>
    <div class="card-status card-status-available">Available</div>
  </div>

  <div class="card-body">
    <span class="card-category">Farming Training</span>
    <h3 class="card-title">
      <a href="/trainings/organic-farming-101" class="card-link">
        Organic Farming 101
      </a>
    </h3>

    <div class="card-meta">
      <span class="card-meta-item">
        <svg class="icon"><!-- clock --></svg>
        9:00 AM - 4:00 PM
      </span>
      <span class="card-meta-item">
        <svg class="icon"><!-- users --></svg>
        25 seats left
      </span>
    </div>

    <div class="card-footer">
      <span class="card-price">₹500</span>
      <a href="/trainings/organic-farming-101" class="btn btn-primary btn-sm">
        Register
      </a>
    </div>
  </div>
</div>
```

**CSS:**
```css
.card-training {
  display: flex;
  flex-direction: row;
  gap: var(--space-md);
}

.card-header {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  background-color: var(--color-gray-100);
  border-radius: var(--radius-md);
}

.card-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card-date-month {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-date-day {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
  line-height: 1;
}

.card-status {
  padding: 0.25rem 0.5rem;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.card-status-available {
  background-color: var(--color-success);
  color: var(--color-white);
}

.card-status-full {
  background-color: var(--color-error);
  color: var(--color-white);
}

.card-category {
  display: inline-block;
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-xs);
}

@media (max-width: 640px) {
  .card-training {
    flex-direction: column;
  }
}
```

---

## 6. Form Components

### 6.1 Form Input Fields

**HTML:**
```html
<!-- Text input -->
<div class="form-group">
  <label for="name" class="form-label">
    Full Name <span class="required">*</span>
  </label>
  <input
    type="text"
    id="name"
    name="name"
    class="form-input"
    placeholder="Enter your full name"
    required
    aria-describedby="name-error name-help"
  >
  <span class="form-help" id="name-help">As it appears on official documents</span>
  <span class="form-error" id="name-error" role="alert"></span>
</div>

<!-- Email input -->
<div class="form-group">
  <label for="email" class="form-label">Email Address *</label>
  <input
    type="email"
    id="email"
    name="email"
    class="form-input"
    placeholder="you@example.com"
    required
  >
</div>

<!-- Phone input -->
<div class="form-group">
  <label for="phone" class="form-label">Phone Number *</label>
  <input
    type="tel"
    id="phone"
    name="phone"
    class="form-input"
    placeholder="10-digit mobile number"
    pattern="[6-9][0-9]{9}"
    required
  >
</div>

<!-- Select dropdown -->
<div class="form-group">
  <label for="city" class="form-label">City *</label>
  <select id="city" name="city" class="form-select" required>
    <option value="">Select your city</option>
    <option value="chennai">Chennai</option>
    <option value="coimbatore">Coimbatore</option>
    <option value="madurai">Madurai</option>
  </select>
</div>

<!-- Textarea -->
<div class="form-group">
  <label for="message" class="form-label">Message</label>
  <textarea
    id="message"
    name="message"
    class="form-textarea"
    rows="4"
    placeholder="Your message here..."
  ></textarea>
</div>

<!-- Checkbox -->
<div class="form-group">
  <div class="form-check">
    <input
      type="checkbox"
      id="terms"
      name="terms"
      class="form-checkbox"
      required
    >
    <label for="terms" class="form-check-label">
      I agree to the <a href="/terms">terms and conditions</a> *
    </label>
  </div>
</div>

<!-- Radio buttons -->
<div class="form-group">
  <label class="form-label">Preferred Contact Method *</label>
  <div class="form-radio-group">
    <div class="form-check">
      <input type="radio" id="contact-email" name="contact-method" value="email" class="form-radio">
      <label for="contact-email" class="form-check-label">Email</label>
    </div>
    <div class="form-check">
      <input type="radio" id="contact-phone" name="contact-method" value="phone" class="form-radio">
      <label for="contact-phone" class="form-check-label">Phone</label>
    </div>
  </div>
</div>

<!-- Input with validation states -->
<div class="form-group">
  <label for="pan" class="form-label">PAN Number</label>
  <input
    type="text"
    id="pan"
    name="pan"
    class="form-input is-valid"
    value="ABCDE1234F"
  >
  <span class="form-success">Valid PAN format</span>
</div>

<div class="form-group">
  <label for="email-invalid" class="form-label">Email</label>
  <input
    type="email"
    id="email-invalid"
    name="email"
    class="form-input is-invalid"
    value="invalid-email"
  >
  <span class="form-error">Please enter a valid email address</span>
</div>
```

**CSS:**
```css
/* Form group (wrapper) */
.form-group {
  margin-bottom: var(--space-md);
}

/* Form label */
.form-label {
  display: block;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin-bottom: var(--space-xs);
}

.required {
  color: var(--color-error);
}

/* Base input styles */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--color-gray-800);
  background-color: var(--color-white);
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-pale);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-gray-400);
}

/* Select arrow */
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B63' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-sm) center;
  padding-right: calc(var(--space-md) + 24px);
}

/* Textarea resize */
.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Checkbox and Radio */
.form-check {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.form-checkbox,
.form-radio {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.form-check-label {
  font-size: var(--font-size-base);
  color: var(--color-gray-700);
  cursor: pointer;
  user-select: none;
}

.form-check-label a {
  color: var(--color-primary);
  text-decoration: underline;
}

.form-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

/* Help text */
.form-help {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin-top: var(--space-xs);
}

/* Validation states */
.is-valid {
  border-color: var(--color-success);
}

.is-valid:focus {
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-success {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-success);
  margin-top: var(--space-xs);
}

.is-invalid {
  border-color: var(--color-error);
}

.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
}

.form-error {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--space-xs);
}

/* Disabled state */
.form-input:disabled,
.form-select:disabled,
.form-textarea:disabled {
  background-color: var(--color-gray-100);
  color: var(--color-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Form layout helpers */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-md);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
```

**JavaScript Validation:**
```javascript
// File: js/form-validation.js (already included in Registration System doc)
// See Registration System Architecture for full validation code

// Quick example of real-time validation
const emailInput = document.getElementById('email');

emailInput.addEventListener('blur', function() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(this.value)) {
    this.classList.add('is-invalid');
    this.classList.remove('is-valid');
    document.getElementById('email-error').textContent = 'Please enter a valid email';
  } else {
    this.classList.add('is-valid');
    this.classList.remove('is-invalid');
    document.getElementById('email-error').textContent = '';
  }
});
```

**Accessibility:**
- ✓ Labels associated with inputs (`for` and `id`)
- ✓ Required fields marked visually and with `required` attribute
- ✓ `aria-describedby` links errors and help text
- ✓ Error messages have `role="alert"`
- ✓ Focus states clearly visible
- ✓ Keyboard accessible
- ✓ Placeholder text not used as labels

---

## 7. Modal/Dialog Components

### 7.1 Modal Component

**HTML:**
```html
<!-- Modal trigger button -->
<button class="btn btn-primary" data-modal-trigger="event-details">
  View Details
</button>

<!-- Modal structure -->
<div class="modal" id="event-details" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
  <div class="modal-backdrop" data-modal-close></div>

  <div class="modal-dialog">
    <div class="modal-content">
      <!-- Modal header -->
      <div class="modal-header">
        <h2 class="modal-title" id="modal-title">Event Details</h2>
        <button class="modal-close" data-modal-close aria-label="Close modal">
          <svg class="icon"><!-- X icon --></svg>
        </button>
      </div>

      <!-- Modal body -->
      <div class="modal-body">
        <p>Modal content goes here...</p>
      </div>

      <!-- Modal footer (optional) -->
      <div class="modal-footer">
        <button class="btn btn-outline" data-modal-close>Cancel</button>
        <button class="btn btn-primary">Register Now</button>
      </div>
    </div>
  </div>
</div>
```

**CSS:**
```css
/* Modal container */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  overflow-y: auto;
  animation: fadeIn var(--transition-base);
}

.modal.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop);
  cursor: pointer;
}

/* Modal dialog */
.modal-dialog {
  position: relative;
  z-index: var(--z-modal);
  max-width: 600px;
  margin: var(--space-2xl) auto;
  padding: var(--space-md);
  animation: slideDown var(--transition-base);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal content */
.modal-content {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

/* Modal header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.modal-close:hover {
  background-color: var(--color-gray-200);
}

.modal-close .icon {
  width: 20px;
  height: 20px;
  fill: var(--color-gray-600);
}

/* Modal body */
.modal-body {
  padding: var(--space-lg);
  max-height: 60vh;
  overflow-y: auto;
}

/* Modal footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-gray-200);
  background-color: var(--color-gray-100);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .modal-dialog {
    margin: 0;
    padding: 0;
    max-width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
  }

  .modal-content {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 90vh;
  }

  @keyframes slideDown {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
```

**JavaScript:**
```javascript
// File: js/modal.js

class Modal {
  constructor() {
    this.activeModal = null;
    this.init();
  }

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
      closer.addEventListener('click', () => this.close());
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });

    // Focus trap
    this.setupFocusTrap();
  }

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.activeModal = modal;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    const firstFocusable = modal.querySelector('button, a, input, select, textarea');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }

  close() {
    if (!this.activeModal) return;

    this.activeModal.classList.remove('active');
    this.activeModal.setAttribute('aria-hidden', 'true');
    this.activeModal = null;

    // Restore body scroll
    document.body.style.overflow = '';
  }

  setupFocusTrap() {
    document.addEventListener('keydown', (e) => {
      if (!this.activeModal || e.key !== 'Tab') return;

      const focusableElements = this.activeModal.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  }
}

// Initialize modal system
document.addEventListener('DOMContentLoaded', () => {
  new Modal();
});
```

**Accessibility:**
- ✓ `role="dialog"` and `aria-modal="true"`
- ✓ `aria-labelledby` references title
- ✓ Focus trapped within modal
- ✓ Focus moved to modal on open
- ✓ Escape key closes modal
- ✓ Background click closes modal
- ✓ Body scroll prevented when open
- ✓ `aria-hidden` manages visibility for screen readers

---

## 8. Animation & Transition Patterns

### 8.1 Fade In on Scroll

**HTML:**
```html
<div class="fade-in-scroll" data-scroll-animation>
  <h2>Content appears as you scroll</h2>
</div>
```

**CSS:**
```css
.fade-in-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**JavaScript:**
```javascript
// File: js/scroll-animations.js

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-scroll-animation]');
    this.init();
  }

  init() {
    // Use Intersection Observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after animating once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.elements.forEach(el => observer.observe(el));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
});
```

### 8.2 Stagger Animation (for lists)

**HTML:**
```html
<div class="card-grid" data-stagger-animation>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

**CSS:**
```css
[data-stagger-animation] > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

[data-stagger-animation].visible > *:nth-child(1) { transition-delay: 0.1s; }
[data-stagger-animation].visible > *:nth-child(2) { transition-delay: 0.2s; }
[data-stagger-animation].visible > *:nth-child(3) { transition-delay: 0.3s; }
[data-stagger-animation].visible > *:nth-child(4) { transition-delay: 0.4s; }
[data-stagger-animation].visible > *:nth-child(5) { transition-delay: 0.5s; }
[data-stagger-animation].visible > *:nth-child(6) { transition-delay: 0.6s; }

[data-stagger-animation].visible > * {
  opacity: 1;
  transform: translateY(0);
}
```

### 8.3 Hover Lift Effect

**CSS:**
```css
.hover-lift {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

**Usage:**
```html
<div class="card hover-lift">...</div>
<button class="btn hover-lift">...</button>
```

---

## 9. Utility Components

### 9.1 Loading Spinner

**HTML:**
```html
<!-- Inline spinner -->
<div class="spinner"></div>

<!-- Spinner with text -->
<div class="spinner-container">
  <div class="spinner"></div>
  <p class="spinner-text">Loading...</p>
</div>

<!-- Full page overlay -->
<div class="loading-overlay">
  <div class="spinner spinner-lg"></div>
  <p class="spinner-text">Please wait...</p>
</div>
```

**CSS:**
```css
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-gray-300);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

.spinner-lg {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xl);
}

.spinner-text {
  color: var(--color-gray-600);
  font-size: var(--font-size-base);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}
```

### 9.2 Alert/Notification

**HTML:**
```html
<!-- Success alert -->
<div class="alert alert-success" role="alert">
  <svg class="alert-icon"><!-- checkmark icon --></svg>
  <div class="alert-content">
    <strong>Success!</strong> Your registration has been confirmed.
  </div>
  <button class="alert-close" aria-label="Close alert">×</button>
</div>

<!-- Error alert -->
<div class="alert alert-error" role="alert">
  <svg class="alert-icon"><!-- error icon --></svg>
  <div class="alert-content">
    <strong>Error!</strong> Please check your form and try again.
  </div>
</div>

<!-- Warning alert -->
<div class="alert alert-warning">
  <svg class="alert-icon"><!-- warning icon --></svg>
  <div class="alert-content">
    You have already registered for this event.
  </div>
</div>

<!-- Info alert -->
<div class="alert alert-info">
  <svg class="alert-icon"><!-- info icon --></svg>
  <div class="alert-content">
    Registration closes in 2 days.
  </div>
</div>
```

**CSS:**
```css
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
  margin-bottom: var(--space-md);
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-content {
  flex-grow: 1;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

.alert-content strong {
  font-weight: var(--font-weight-semibold);
}

.alert-close {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  line-height: 1;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity var(--transition-fast);
  padding: 0;
  width: 24px;
  height: 24px;
}

.alert-close:hover {
  opacity: 1;
}

/* Alert variants */
.alert-success {
  background-color: #E8F5E9;
  border-color: var(--color-success);
  color: #1B5E20;
}

.alert-success .alert-icon {
  fill: var(--color-success);
}

.alert-error {
  background-color: #FFEBEE;
  border-color: var(--color-error);
  color: #B71C1C;
}

.alert-error .alert-icon {
  fill: var(--color-error);
}

.alert-warning {
  background-color: #FFF3E0;
  border-color: var(--color-warning);
  color: #E65100;
}

.alert-warning .alert-icon {
  fill: var(--color-warning);
}

.alert-info {
  background-color: #E1F5FE;
  border-color: var(--color-info);
  color: #01579B;
}

.alert-info .alert-icon {
  fill: var(--color-info);
}
```

---

## 10. Component File Structure

### 10.1 Recommended File Organization

```
public_html/
├── css/
│   ├── theme.css                 (CSS variables)
│   ├── reset.css                 (CSS reset/normalize)
│   ├── layout.css                (Container, section, spacing utilities)
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   ├── navigation.css
│   │   ├── modals.css
│   │   ├── alerts.css
│   │   └── spinners.css
│   └── main.css                  (Import all CSS files)
├── js/
│   ├── components/
│   │   ├── navigation.js
│   │   ├── modal.js
│   │   ├── form-validation.js
│   │   └── scroll-animations.js
│   └── main.js                   (Import all JS files or initialize)
└── images/
    └── icons/                    (SVG icons)
```

### 10.2 Main CSS Import

**File:** `css/main.css`

```css
/* Import order matters! */
@import url('reset.css');
@import url('theme.css');
@import url('layout.css');

/* Components */
@import url('components/buttons.css');
@import url('components/cards.css');
@import url('components/forms.css');
@import url('components/navigation.css');
@import url('components/modals.css');
@import url('components/alerts.css');
@import url('components/spinners.css');
```

### 10.3 HTML Template Include

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VEFS Foundation</title>

  <!-- CSS -->
  <link rel="stylesheet" href="/css/main.css">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Content here -->

  <!-- JavaScript -->
  <script src="/js/components/navigation.js"></script>
  <script src="/js/components/modal.js"></script>
  <script src="/js/components/form-validation.js"></script>
  <script src="/js/components/scroll-animations.js"></script>
</body>
</html>
```

---

## 11. Design Tokens Summary

Quick reference for developers:

**Colors:**
- Primary: `var(--color-primary)` - #6B8E23
- Secondary: `var(--color-secondary)` - #D4A574
- Accent: `var(--color-accent)` - #8B7355

**Spacing:**
- xs: 8px, sm: 16px, md: 24px, lg: 32px, xl: 48px, 2xl: 64px

**Typography:**
- Serif: Lora (headings)
- Sans: Inter (body)
- Sizes: xs → 4xl (11.1px → 47.8px)

**Border Radius:**
- sm: 4px, md: 8px, lg: 12px, xl: 16px, full: 9999px

**Shadows:**
- sm, md, lg, xl

**Transitions:**
- fast: 150ms, base: 250ms, slow: 350ms

---

## 12. Usage Guidelines

### When to Use Each Component

**Navigation:**
- Header on every page
- Sticky on scroll for easy access

**Buttons:**
- Primary: Main actions (Donate, Register, Submit)
- Secondary: Alternative actions
- Outline: Tertiary actions
- Text: Inline/subtle actions

**Cards:**
- Event cards: Events page, home page featured events
- Program cards: Programs page
- Training cards: Trainings page, timeline view

**Forms:**
- All inputs need labels (accessibility)
- Mark required fields with asterisk
- Provide real-time validation
- Show success/error states

**Modals:**
- Event/training details
- Terms & conditions
- Registration confirmations
- Image galleries (lightbox)

**Animations:**
- Fade-in on scroll for sections
- Hover lift for interactive elements
- Loading spinners for async actions
- Stagger for card grids

---

## 13. Accessibility Checklist

For all components:

- [ ] Semantic HTML (correct elements)
- [ ] ARIA labels where needed
- [ ] Keyboard navigable (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] alt text for images
- [ ] Labels for form inputs
- [ ] Error messages associated with inputs
- [ ] Loading states announced to screen readers
- [ ] Modal focus trap
- [ ] Skip links for navigation

---

## 14. Performance Optimization

**CSS:**
- Use CSS variables for theme consistency
- Minimize animations on mobile
- Use `will-change` sparingly
- Prefer transforms over position changes

**JavaScript:**
- Use event delegation where possible
- Debounce scroll/resize events
- Lazy load images (`loading="lazy"`)
- Use Intersection Observer for scroll animations

**Images:**
- Optimize images (WebP format)
- Provide responsive images (`srcset`)
- Lazy load below-fold images
- Use SVGs for icons (inline for styling)

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-24 | Initial documentation | Requirements Team |

---

**End of Document**
