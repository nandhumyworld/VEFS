# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VEFS Website** - Valluvam Ecological Farming and Social Welfare Foundation
A static website for a Trust focused on creating awareness about indigenous tree species, ecological conservation, and conducting educational programs.

**Hosting Environment:** Hostinger static hosting (PHP + JavaScript)
**Status:** Requirements documentation complete - Ready for implementation

## Critical Constraints

### What IS Available
- Static HTML, CSS, JavaScript files (starts from `index.html`)
- PHP support for form processing and email delivery
- MySQL database (available but not initially used)
- FTP/SFTP access via Hostinger File Manager
- Apache web server with .htaccess configuration

### What IS NOT Available
- **No Node.js** runtime or npm packages
- **No build tools** (Webpack, Vite, Parcel, etc.)
- **No frameworks** (React, Vue, Next.js, etc.)
- **No CI/CD pipelines** or auto-deployment
- **No custom server applications** or WebSocket servers

### What This Means for Development
1. Use **vanilla JavaScript only** - No JSX, no TypeScript compilation
2. Write plain CSS - No Sass, Less, or CSS-in-JS compilation
3. Files are deployed **directly via FTP** - What you write is what gets served
4. Changes take effect **immediately after upload** - No build step
5. All third-party libraries must be **CDN-linked** or vendored as static files

## Technology Stack

### Frontend (Client-Side)
- **HTML5** with semantic markup and ARIA labels
- **CSS3** with CSS Custom Properties (CSS Variables) for theming
- **Vanilla JavaScript (ES6+)** - No frameworks, use native Fetch API
- **Google Fonts** - Lora (serif headings) and Inter (sans-serif body)

### Backend (Server-Side)
- **PHP 7.4+** for form processing only
- **Gmail API** via Google API PHP Client for email delivery (2,000/day quota)
- **JSON files** as lightweight data storage (no database initially)

### Development Workflow
```
1. Edit files locally (HTML/CSS/JS/PHP)
2. Test in browser (local file system or localhost)
3. Validate JSON, HTML, CSS
4. Optimize images (<200KB each)
5. Upload via FTP to Hostinger
6. Verify on live site
```

## Data Architecture

### JSON-Based Content Management
All dynamic content (events, trainings, volunteers) is stored in JSON files:

```
public_html/data/
├── events.json       # All events with metadata
├── trainings.json    # Training programs and schedules
├── volunteers.json   # Volunteer opportunities with requirements and benefits
└── recent-registrations.json  # For duplicate checking
```

**Key Points:**
- Client-side JavaScript loads JSON via `fetch('/data/events.json')`
- Updates require manual FTP upload - changes are immediate
- No database queries - all filtering/sorting happens in JavaScript
- See `VEFS-requirements/data-schemas/DATA_MANAGEMENT.md` for complete schema

### Email-Based Data Collection
The site has **no admin dashboard**. Form submissions are:
1. Validated client-side (JavaScript)
2. Processed server-side (PHP)
3. Delivered via **Gmail API** to admin email
4. Confirmed to user via auto-response email

## File Organization

### Directory Structure
```
public_html/
├── index.html, about.html, volunteer.html, etc.  # 9 main pages
├── css/
│   ├── theme.css          # CSS variables and theming
│   ├── layout.css         # Grid and responsive layouts
│   └── components/        # Button, card, form, modal styles
├── js/
│   ├── components/        # Reusable JS modules
│   ├── events.js          # Event page logic
│   ├── trainings.js       # Training page logic
│   └── volunteers.js      # Volunteer page logic
├── data/                  # JSON content files
├── images/
│   ├── hero/, events/, trainings/, volunteers/
│   └── gallery/           # Organized by year/month
├── forms/                 # PHP form processors
└── email-templates/       # HTML email templates
```

See `VEFS-requirements/technical/FILE_MANAGEMENT_SYSTEM.md` for complete structure.

## Design System

### Brand Colors (CSS Variables)
```css
--color-primary: #6B8E23;        /* Sage Green - primary brand */
--color-secondary: #D4A574;      /* Golden/Amber - CTAs */
--color-accent: #8B7355;         /* Earth Brown */
```

### Typography
- **Headings:** Serif font (Lora, Georgia fallback) - Professional, trustworthy
- **Body:** Sans-serif (Inter, system font stack) - Clean, readable
- **Type Scale:** 13-point scale from 11.1px to 47.8px

### Spacing
- **Base unit:** 8px
- **Scale:** xs(8px), sm(16px), md(24px), lg(32px), xl(48px), 2xl(64px), 3xl(96px)

### Component Patterns
All components are defined in `VEFS-requirements/technical/COMPONENT_LIBRARY.md`:
- Buttons (primary/secondary variants)
- Cards (event, training, volunteer)
- Forms (validation, accessibility)
- Modals (with focus trap)
- Navigation (responsive, mobile-first)

**Complete design specifications:** `VEFS-requirements/styles/DESIGN_SYSTEM.md`

## Page Architecture

### Nine Main Pages
1. **Home** - Hero carousel (3 slides), video, featured content
2. **About** - Story, mission/vision, values, impact metrics, timeline, founder profile
3. **Trainings** - Timeline view with calendar, registration forms
4. **Events** - Grid view with filters, detail modals
5. **Volunteer** - Opportunity grid with requirements, benefits, and embedded registration forms
6. **Gallery** - Masonry grid with lightbox, organized by year/category
7. **Contact** - Multiple contact methods, inquiry form, Google Maps embed
8. **Donation** - Impact showcase, payment integration (UPI QR, bank transfer, optional Razorpay)
9. **Future Plans** - Vision timeline and strategic goals

**Detailed page specifications:** `VEFS-requirements/pages/` directory

## Registration System Architecture

### Four Registration Types
1. **Event Registration** - Community events, workshops
2. **Training Registration** - Structured programs with detailed participant requirements
3. **Volunteer Applications** - Opportunity-based applications with age validation and motivation assessment
4. **Donation Processing** - Contribution form with 80G compliance

### Registration Flow
```
User fills form → Client-side validation → Duplicate check (JSON) →
PHP processing → Gmail API email delivery → User confirmation + Admin CC
```

**Key Features:**
- CSRF token protection on all forms
- Rate limiting and honeypot spam prevention
- Duplicate registration checking via `recent-registrations.json`
- Multi-step forms with progress indicators
- Accessible, keyboard-navigable

**Complete architecture:** `VEFS-requirements/technical/REGISTRATION_SYSTEM.md`

## Performance & SEO Requirements

### Performance Targets
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Page Size:** < 2MB per page
- **Requests:** < 50 per page

### Image Optimization
- Format: JPEG for photos (<200KB), PNG for graphics, SVG for icons
- Use `loading="lazy"` for below-fold images
- Provide responsive images with `srcset`

### SEO Essentials
- Meta tags (title, description, OG tags) on every page
- Schema.org structured data (Organization, Event schemas)
- `sitemap.xml` and `robots.txt` configured
- HTTPS enforced via .htaccess

### Accessibility (WCAG 2.1 AA)
- Semantic HTML with ARIA labels
- Color contrast ratio ≥ 4.5:1 for text
- Keyboard navigation support
- Focus indicators visible (2px sage green outline)
- Alt text for all images

**Complete specifications:** `VEFS-requirements/technical/TECHNICAL_IMPLEMENTATION.md`

## Integration Specifications

### Gmail API Integration
- **Purpose:** Reliable email delivery for registrations and confirmations
- **Quota:** 2,000 emails/day (free tier)
- **Authentication:** OAuth 2.0
- **Implementation:** PHP with Google API Client library

**Setup guide:** `VEFS-requirements/technical/JSON_API_GMAIL_INTEGRATION.md`

### Payment Integration
- **Primary:** UPI QR codes and bank transfer (manual)
- **Optional:** Razorpay/Instamojo gateway for online payments
- **80G Certificate:** Provided for tax exemption

### Analytics
- Google Analytics 4 for traffic tracking
- Facebook Pixel for social media tracking (optional)

### Maps
- Google Maps embedded iframe for office location
- Custom markers and styling

**Complete integration specs:** `VEFS-requirements/technical/INTEGRATION_SPECIFICATIONS.md`

## Security Measures

### .htaccess Security
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
```

### Form Security
- CSRF tokens on all forms
- Server-side input validation and sanitization (prevent XSS)
- Rate limiting to prevent spam
- Honeypot fields

### File Permissions
- Folders: 755
- Files: 644
- Protected directories: `/backups/`, `/logs/`, `/forms/`

## Code Standards

### HTML
- Semantic HTML5 elements
- Lowercase tags and attributes
- Quote all attribute values
- Include alt text for images

### CSS
- Use CSS variables for theming
- BEM naming convention (optional but recommended)
- Mobile-first media queries
- Component-based organization

### JavaScript
- Use `const`/`let` (never `var`)
- Descriptive names for variables/functions
- Async/await for asynchronous operations
- ES6 class syntax for components
- Error handling with try/catch

## Common Development Tasks

### Updating Events/Trainings Data
1. Edit `data/events.json` or `data/trainings.json` locally
2. Validate JSON at jsonlint.com
3. Upload via FTP to `/public_html/data/`
4. Changes appear immediately (consider cache-busting: `?v=1.1`)

### Adding New Images
1. Optimize image (<200KB, appropriate dimensions)
2. Use descriptive filename: `event-organic-farming-march-2025.jpg`
3. Upload to appropriate folder (`images/events/`, etc.)
4. Reference in JSON or HTML with absolute path: `/images/events/...`

### Deploying Changes
1. Backup current production files (download via FTP)
2. Upload new/modified files
3. Clear browser cache and test
4. Check browser console for errors
5. Verify forms, links, and images load correctly

### Testing Checklist
- [ ] All pages load correctly
- [ ] Navigation works (desktop + mobile)
- [ ] Forms submit and validate
- [ ] Images load with proper lazy loading
- [ ] Registration emails deliver successfully
- [ ] PageSpeed Insights score > 80
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA

### Automated Testing with Playwright MCP

**IMPORTANT:** This project has Playwright MCP server configured for automated browser testing.

**When to Use Playwright MCP:**
- **Phase 8: Testing & QA** - Use for comprehensive automated testing
- **Bug Fixes** - Test fixes before marking as complete
- **Visual Verification** - Take screenshots to verify CSS/layout changes
- **Regression Testing** - Ensure changes don't break existing functionality

**What Playwright MCP Can Do:**
1. Navigate to pages and verify CSS/JS loading
2. Take screenshots for visual verification
3. Test responsive design across viewports (mobile 375px, tablet 768px, desktop 1920px)
4. Verify accessibility (WCAG AA compliance)
5. Test form validation and interactions
6. Check for JavaScript console errors
7. Verify navigation and links work correctly
8. Test dynamic content loading (when using local server)

**Configuration:**
- MCP Server: Configured in `.mcp.json` at project root
- Base URL: `file://` protocol for static files (local testing)
- Browsers: Chromium, Firefox (configured)
- Screenshots: Automatically saved on test failures

**Testing Workflow:**
1. **Manual fixes first** - Make code changes as needed
2. **Local verification** - Open in browser to verify visually
3. **Playwright MCP testing** - Use MCP tools to automate verification
4. **Take screenshots** - Capture before/after for visual comparison
5. **Check console** - Verify no JavaScript errors
6. **Test responsiveness** - Check mobile/tablet/desktop viewports
7. **Mark complete** - Only after automated tests pass

**Example Usage (for Claude):**
When fixing a bug like "CSS not loading":
1. Fix the paths in HTML files
2. Use Playwright MCP to navigate to `index.html`
3. Take screenshot to verify CSS applied
4. Check browser console for errors
5. Test on mobile viewport (375px)
6. Confirm fix successful before reporting to user

**For Local Server Testing:**
If testing dynamic features (JSON loading, etc.):
1. Start Python server: `cd VEFS-website && python -m http.server 8000`
2. Update base URL in tests to `http://localhost:8000`
3. Run Playwright tests with full JavaScript functionality

**Note:** Test scripts will be created during Phase 8. For now, the MCP server is configured and ready for use when needed.

## Documentation Index

All requirements are fully documented in `VEFS-requirements/`:

### Pages
- `pages/HOME_PAGE.md` - Hero carousel, video container, featured content
- `pages/ABOUT_PAGE.md` - Story, mission, values, impact, timeline
- `pages/PROGRAMS_PAGE.md` - Program cards organized by audience
- `pages/TRAININGS_PAGE.md` - Calendar view with registration
- `pages/EVENTS_PAGE.md` - Grid with filters and detail modals
- `pages/GALLERY_PAGE.md` - Masonry grid with lightbox
- `pages/CONTACT_PAGE.md` - Contact form and Google Maps
- `pages/DONATION_PAGE.md` - Payment integration and impact showcase
- `pages/FUTURE_PLANS_PAGE.md` - Vision timeline

### Technical
- `technical/TECHNICAL_IMPLEMENTATION.md` - Technology stack, browser support, performance
- `technical/COMPONENT_LIBRARY.md` - Reusable components (buttons, cards, forms, modals)
- `technical/REGISTRATION_SYSTEM.md` - Event/training/donation form architecture
- `technical/FILE_MANAGEMENT_SYSTEM.md` - Directory structure and content workflows
- `technical/INTEGRATION_SPECIFICATIONS.md` - Payment, analytics, maps, social media
- `technical/JSON_API_GMAIL_INTEGRATION.md` - Email delivery system setup

### Data & Design
- `data-schemas/DATA_MANAGEMENT.md` - JSON schemas for events, trainings, programs
- `data-schemas/PROGRAMS_DATA_SCHEMA.md` - Programs JSON structure
- `styles/DESIGN_SYSTEM.md` - Complete visual identity and component guidelines

### Project Management
- `project-overview.md` - Scope, features, priorities
- `PROGRESS.md` - Session log and completion status (all requirements complete)

## Key Reminders

1. **No Build Process** - Everything you write goes directly to production via FTP
2. **Vanilla JavaScript Only** - No frameworks, no JSX, no TypeScript compilation
3. **Email-Based Content Management** - No admin dashboard, registrations go to email
4. **JSON for Dynamic Content** - Events/trainings/programs stored in JSON files
5. **Mobile-First** - Design for 320px+ first, enhance for larger screens
6. **Performance Matters** - Keep images <200KB, total page size <2MB
7. **Accessibility is Required** - WCAG AA compliance for all components
8. **Hostinger-Specific** - Use FTP for uploads, PHP for forms, Gmail API for email
