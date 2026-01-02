# Technical Implementation Specifications

**Project:** VEFS (Valluvam Ecological Farming and Social Welfare Foundation)
**Document Version:** 1.0
**Last Updated:** 2025-12-24
**Status:** Complete

---

## Overview

This document defines the technical implementation specifications for the VEFS website, including technology stack, browser compatibility, performance requirements, and deployment workflow.

### Target Platform

- **Hosting:** Hostinger static hosting
- **Environment:** PHP + JavaScript (client-side)
- **Build Process:** None (static files)
- **Deployment:** Manual FTP upload

---

## 1. Technology Stack

### 1.1 Frontend Technologies

**HTML**
- Version: HTML5
- Semantic markup (header, nav, main, section, article, footer)
- Accessible markup (ARIA labels, roles)
- Structured data (Schema.org JSON-LD)

**CSS**
- Version: CSS3
- CSS Custom Properties (CSS Variables) for theming
- Flexbox and Grid for layouts
- Media queries for responsive design
- No preprocessors (SASS/LESS) - vanilla CSS only
- BEM naming convention optional but recommended

**JavaScript**
- Version: ES6+ (ECMAScript 2015 and newer)
- Vanilla JavaScript (no frameworks)
- Modules (ES6 imports/exports)
- Async/await for asynchronous operations
- Fetch API for data loading
- IntersectionObserver API for scroll animations
- No build tools required (no webpack, babel, etc.)

**Fonts**
- Google Fonts CDN
- Primary: Lora (serif) for headings
- Secondary: Inter (sans-serif) for body text
- Fallbacks: Georgia, Arial, system fonts

### 1.2 Backend Technologies

**PHP**
- Version: PHP 7.4+ (Hostinger default)
- Used for: Form processing, email sending
- Libraries: None (native PHP functions only)
- Gmail API: via Google API PHP Client

**Server**
- Apache (Hostinger default)
- .htaccess for URL rewriting and security
- SSL/TLS certificate (Let's Encrypt via Hostinger)

**Data Storage**
- JSON files (events, trainings, programs)
- No database (MySQL available but not used initially)
- File system storage for images and backups

### 1.3 Third-Party Services

| Service | Purpose | Implementation |
|---------|---------|----------------|
| Google Fonts | Web fonts (Lora, Inter) | CDN link in `<head>` |
| Google Maps | Location embed | Embed iframe |
| Google Analytics | Traffic analytics | Script in `<head>` |
| Gmail API | Email delivery | PHP library |
| Payment Gateway (Optional) | Online payments | Razorpay/Instamojo integration |

### 1.4 Development Tools

**Recommended:**
- Text Editor: VS Code, Sublime Text, or Notepad++
- FTP Client: FileZilla or Hostinger File Manager
- Image Editor: GIMP, Photoshop, or Photopea (online)
- JSON Validator: JSONLint.com
- Browser DevTools: Chrome DevTools, Firefox Developer Tools

**Not Required:**
- Node.js / npm
- Webpack / Parcel
- Sass / Less compilers
- Task runners (Gulp, Grunt)

---

## 2. Browser Compatibility

### 2.1 Supported Browsers

**Desktop:**
- Chrome 90+ (recommended)
- Firefox 88+
- Edge 90+
- Safari 14+

**Mobile:**
- Chrome for Android (latest 2 versions)
- Safari for iOS (latest 2 versions)
- Samsung Internet (latest 2 versions)

**Not Supported:**
- Internet Explorer (any version)
- Opera Mini
- Browsers older than 2 years

### 2.2 Graceful Degradation

**For older browsers:**
- CSS fallbacks for custom properties
- Polyfills not used (keep it simple)
- Feature detection with `@supports` in CSS
- Progressive enhancement approach

**Example CSS Fallback:**
```css
/* Fallback for browsers without CSS variables */
.button {
  background-color: #6B8E23; /* Fallback */
  background-color: var(--color-primary); /* Modern browsers */
}
```

### 2.3 Mobile-First Approach

**Design for mobile first, enhance for desktop:**
- Base styles for mobile (320px+)
- Media queries for tablet (768px+)
- Media queries for desktop (1024px+)
- Touch-friendly tap targets (min 44x44px)
- Responsive images with `srcset`

---

## 3. Performance Requirements

### 3.1 Page Load Performance

**Target Metrics:**
- **First Contentful Paint (FCP):** < 1.5 seconds
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **Time to Interactive (TTI):** < 3 seconds
- **Total Page Size:** < 2 MB per page
- **Number of Requests:** < 50 requests per page

**Measurement Tools:**
- Google PageSpeed Insights
- GTmetrix
- Chrome DevTools Lighthouse

### 3.2 Image Optimization

**Requirements:**
- **Format:** JPEG for photos, PNG for graphics, SVG for icons
- **Compression:** All images < 200 KB each
- **Lazy Loading:** Use `loading="lazy"` attribute for below-fold images
- **Responsive Images:** Use `srcset` for different screen sizes
- **WebP Format:** Optional, provide JPEG fallback

**Example:**
```html
<img
  src="/images/events/event-photo.jpg"
  srcset="/images/events/event-photo-400.jpg 400w,
          /images/events/event-photo-800.jpg 800w,
          /images/events/event-photo-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Event description"
  loading="lazy"
>
```

### 3.3 CSS Optimization

**Best Practices:**
- Minimize CSS file size (target < 100 KB total)
- Use CSS variables for reusability
- Avoid `@import` (use `<link>` instead)
- Inline critical CSS for above-fold content (optional)
- Remove unused CSS

**CSS Loading:**
```html
<!-- Critical CSS inline in <head> -->
<style>
  /* Above-fold critical styles here */
</style>

<!-- Non-critical CSS -->
<link rel="stylesheet" href="/css/main.css">
```

### 3.4 JavaScript Optimization

**Best Practices:**
- Load scripts at end of `<body>` or use `defer`/`async`
- Minimize JavaScript file size (target < 150 KB total)
- Avoid large libraries (jQuery, Bootstrap JS)
- Use native JavaScript instead
- Remove console.log in production

**Script Loading:**
```html
<!-- Defer non-critical scripts -->
<script src="/js/components/navigation.js" defer></script>
<script src="/js/programs.js" defer></script>

<!-- Async for analytics -->
<script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" async></script>
```

### 3.5 Caching Strategy

**Static Assets:**
- Images: Cache for 1 year
- CSS/JS: Cache for 1 month
- HTML: No cache (or short cache)

**.htaccess Configuration:**
```apache
<IfModule mod_expires.c>
  ExpiresActive On

  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"

  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"

  # HTML
  ExpiresByType text/html "access plus 0 seconds"

  # JSON
  ExpiresByType application/json "access plus 1 day"
</IfModule>
```

**Cache Busting:**

For critical updates, use version query parameters:

```html
<link rel="stylesheet" href="/css/main.css?v=1.5">
<script src="/js/main.js?v=1.5"></script>
```

### 3.6 Compression

**Enable Gzip Compression:**

`.htaccess`:
```apache
<IfModule mod_deflate.c>
  # Compress HTML, CSS, JavaScript, Text, XML
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE application/xml
</IfModule>
```

---

## 4. SEO Specifications

### 4.1 Meta Tags (Each Page)

**Required Meta Tags:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Page description (150-160 characters)">
<title>Page Title - VEFS Foundation</title>

<!-- Open Graph (Social Sharing) -->
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://vefs.org/images/og-image.jpg">
<meta property="og:url" content="https://vefs.org/page-url">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://vefs.org/images/twitter-image.jpg">

<!-- Favicon -->
<link rel="icon" type="image/png" href="/images/logo/favicon.png">
<link rel="apple-touch-icon" href="/images/logo/apple-touch-icon.png">
```

### 4.2 Structured Data (Schema.org)

**Organization Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Valluvam Ecological Farming and Social Welfare Foundation",
  "alternateName": "VEFS Foundation",
  "url": "https://vefs.org",
  "logo": "https://vefs.org/images/logo/vefs-logo.png",
  "description": "A Trust focused on creating awareness about indigenous tree species and ecological conservation",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chennai",
    "addressRegion": "Tamil Nadu",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "Customer Service",
    "email": "info@vefs.org"
  },
  "sameAs": [
    "https://facebook.com/vefsfoundation",
    "https://twitter.com/vefsfoundation",
    "https://instagram.com/vefsfoundation"
  ]
}
</script>
```

**Event Schema (on Events Page):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Organic Farming Workshop",
  "description": "Learn organic farming techniques",
  "startDate": "2025-03-15T09:00:00+05:30",
  "endDate": "2025-03-15T16:00:00+05:30",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "VEFS Training Center",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    }
  },
  "organizer": {
    "@type": "NGO",
    "name": "VEFS Foundation",
    "url": "https://vefs.org"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "url": "https://vefs.org/events/organic-farming-workshop"
  }
}
</script>
```

### 4.3 Sitemap & Robots.txt

**sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vefs.org/</loc>
    <lastmod>2025-12-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vefs.org/about</loc>
    <lastmod>2025-12-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vefs.org/programs</loc>
    <lastmod>2025-12-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Add all pages -->
</urlset>
```

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /forms/
Disallow: /backups/
Disallow: /logs/
Disallow: /data/

Sitemap: https://vefs.org/sitemap.xml
```

---

## 5. Security Specifications

### 5.1 HTTPS/SSL

**Requirements:**
- All pages served over HTTPS
- Hostinger provides free SSL (Let's Encrypt)
- Force HTTPS redirect in .htaccess

**.htaccess Force HTTPS:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### 5.2 Form Security

**Measures:**
- CSRF tokens on all forms
- Server-side input validation
- Input sanitization (prevent XSS)
- Rate limiting (prevent spam)
- Honeypot fields (spam prevention)

**See Registration System Architecture document for implementation details.**

### 5.3 File Permissions

**Standard Permissions:**
- Folders: 755
- Files (HTML, CSS, JS, JSON, Images): 644
- PHP files: 644 (NOT 755)
- .htaccess: 644

**Protected Folders:**
- `/backups/` - Deny web access
- `/logs/` - Deny web access
- `/forms/` - Deny direct access (only via POST)

### 5.4 Security Headers

**.htaccess Security Headers:**
```apache
<IfModule mod_headers.c>
  # Prevent clickjacking
  Header always set X-Frame-Options "SAMEORIGIN"

  # XSS Protection
  Header always set X-XSS-Protection "1; mode=block"

  # Prevent MIME sniffing
  Header always set X-Content-Type-Options "nosniff"

  # Referrer Policy
  Header always set Referrer-Policy "strict-origin-when-cross-origin"

  # Content Security Policy (adjust as needed)
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com;"
</IfModule>
```

---

## 6. Accessibility (WCAG 2.1 AA)

### 6.1 Requirements

**Must comply with:**
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators visible
- Color contrast ratio ≥ 4.5:1 (text)
- Color contrast ratio ≥ 3:1 (UI components)
- Alt text for all images
- Form labels associated with inputs
- Skip links for navigation

**See Component Library documentation for implementation details.**

### 6.2 Testing Tools

- axe DevTools (Chrome/Firefox extension)
- WAVE (Web Accessibility Evaluation Tool)
- Lighthouse (Chrome DevTools)
- Screen reader testing (NVDA, JAWS, VoiceOver)

---

## 7. Deployment Workflow

### 7.1 Development to Production

**Process:**
1. Develop/edit files locally
2. Test in browser (localhost or local preview)
3. Validate HTML, CSS, JSON
4. Optimize images
5. Backup current production files
6. Upload via FTP to Hostinger
7. Verify changes on live site
8. Monitor for errors

**No Build Process Required:**
- Files uploaded directly
- No compilation or transpilation
- No npm scripts or webpack builds

### 7.2 FTP Upload Checklist

Before uploading:
- [ ] Files validated (HTML, CSS, JSON)
- [ ] Images optimized (<200KB each)
- [ ] Backup created
- [ ] Test files locally if possible
- [ ] Version numbers incremented (CSS/JS cache busting)

After uploading:
- [ ] Verify pages load correctly
- [ ] Test forms and interactions
- [ ] Check images load
- [ ] Clear browser cache and retest
- [ ] Check browser console for errors

### 7.3 Rollback Procedure

If deployment causes issues:
1. Download backup files from `/backups/` folder
2. Upload backup files to replace broken files
3. Site should return to working state
4. Investigate what went wrong
5. Fix issue locally
6. Re-deploy corrected version

---

## 8. Monitoring & Maintenance

### 8.1 Regular Checks

**Daily:**
- Check website is online and loads correctly
- Monitor email delivery (registration confirmations)

**Weekly:**
- Review Google Analytics for traffic
- Check form submissions (registrations, contact forms)
- Review error logs (`/logs/errors.log`)

**Monthly:**
- Run PageSpeed Insights / Lighthouse audit
- Check for broken links
- Update events/trainings data
- Create backups
- Review and optimize images

**Quarterly:**
- Review and update content
- Check browser compatibility
- Security audit
- Performance optimization review

### 8.2 Error Logging

**PHP Error Logging:**

`/forms/config.php`:
```php
<?php
// Error logging
ini_set('display_errors', 0); // Don't show errors to users
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/public_html/logs/errors.log');
?>
```

**JavaScript Error Logging:**

```javascript
// Log JavaScript errors
window.addEventListener('error', function(event) {
  console.error('JavaScript Error:', event.error);
  // Optionally send to server for logging
});
```

---

## 9. Code Standards

### 9.1 HTML Standards

- Use semantic HTML5 elements
- Proper nesting and indentation (2 or 4 spaces)
- Lowercase element and attribute names
- Quote all attribute values
- Include alt text for images
- Use ARIA labels where appropriate

**Example:**
```html
<section class="programs-section">
  <div class="container">
    <h2 class="section-title">Our Programs</h2>
    <div class="card-grid">
      <article class="card">
        <img src="/images/program.jpg" alt="School awareness program" loading="lazy">
        <h3>Program Title</h3>
        <p>Description</p>
      </article>
    </div>
  </div>
</section>
```

### 9.2 CSS Standards

- Use BEM naming or consistent class naming
- Organize by component
- Use CSS variables for theming
- Mobile-first media queries
- Comments for complex styles

**Example:**
```css
/* Program Card Component */
.card-program {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
}

.card-program__title {
  font-size: var(--font-size-xl);
  color: var(--color-gray-800);
}

/* Responsive */
@media (max-width: 768px) {
  .card-program {
    padding: var(--space-md);
  }
}
```

### 9.3 JavaScript Standards

- Use const/let (not var)
- Descriptive variable and function names
- Comment complex logic
- Use async/await for async operations
- Error handling with try/catch
- ES6 class syntax for components

**Example:**
```javascript
// Programs loader class
class ProgramsLoader {
  constructor() {
    this.programs = [];
    this.init();
  }

  async init() {
    try {
      await this.loadPrograms();
      this.render();
    } catch (error) {
      console.error('Failed to load programs:', error);
      this.showError();
    }
  }

  async loadPrograms() {
    const response = await fetch('/data/programs.json');
    const data = await response.json();
    this.programs = data.programs.filter(p => p.active);
  }

  render() {
    // Render programs to DOM
  }

  showError() {
    // Display error message
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new ProgramsLoader();
});
```

---

## 10. Testing Checklist

### 10.1 Pre-Launch Testing

**Functionality:**
- [ ] All pages load correctly
- [ ] Navigation works (desktop and mobile)
- [ ] Forms submit and validate correctly
- [ ] Modal popups open and close
- [ ] Image lazy loading works
- [ ] Smooth scroll anchors work
- [ ] Registration system works
- [ ] Email delivery works

**Performance:**
- [ ] PageSpeed Insights score > 80
- [ ] All images optimized (<200KB)
- [ ] Page load time < 3 seconds
- [ ] Mobile performance acceptable

**SEO:**
- [ ] Meta tags present on all pages
- [ ] sitemap.xml created and submitted
- [ ] robots.txt configured
- [ ] Structured data validated
- [ ] 404 page exists

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Alt text on all images

**Security:**
- [ ] HTTPS enabled
- [ ] Forms have CSRF protection
- [ ] Sensitive folders protected
- [ ] File permissions correct
- [ ] Security headers set

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## 11. Future Enhancements

### 11.1 Phase 2 Potential Upgrades

- **Progressive Web App (PWA):** Offline support, installable
- **Service Worker:** Advanced caching strategies
- **WebP Images:** Better compression for modern browsers
- **Lazy Loading:** Native lazy loading for all images
- **Payment Gateway Integration:** Razorpay/Instamojo for online payments
- **Database Migration:** Move from JSON to MySQL
- **Admin Dashboard:** Custom PHP admin panel
- **Automated Backups:** Scheduled backups to cloud storage

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-24 | Initial documentation | Requirements Team |

---

**End of Document**
