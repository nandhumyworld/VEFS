---
description: Repository Information Overview
alwaysApply: true
---

# VEFS Website Repository Information

## Summary
VEFS (Valluvam Ecological Farming and Social Welfare Foundation) is a static website for a Tamil Nadu-based Trust focused on indigenous tree conservation, ecological education, and agricultural welfare. The site is built with vanilla HTML5, CSS3, and JavaScript (ES6+) with no build tools or frameworks, designed for Hostinger static hosting with PHP support for forms and email delivery via Gmail API.

## Repository Structure
The repository is organized into two main components:

### VEFS-website (Primary)
The production website containing 11 HTML pages, CSS styling system, JavaScript functionality, JSON data files, images, and video assets.

### VEFS-requirements & VEFS-builder
Documentation directories containing complete specifications, design system, component library, data schemas, and project management files.

## Main Repository Components
- **VEFS-website**: Production website with HTML pages, CSS, JavaScript, and JSON data
- **VEFS-requirements**: Complete technical specifications and design documentation
- **VEFS-builder**: Project management and implementation tracking
- **node_modules**: Playwright testing framework

## Language & Runtime
**Primary Language**: HTML5, CSS3, JavaScript (ES6+)  
**Runtime Environment**: Browsers (no Node.js runtime - static hosting)  
**Server Support**: PHP 7.4+ (for form processing only)  
**Target Browsers**: Modern browsers with ES6 support  
**Architecture**: Static site with client-side rendering, no build step

## Dependencies
**Frontend Libraries**: None (vanilla JavaScript)  
**Google Fonts**: Lora (headings), Inter (body), Annie Use Your Telescope (accent)  
**Development**: Playwright ^1.57.0 (@playwright/test)

**Note**: All third-party code is CDN-linked or vendored; no npm packages in production build.

## Structure & Pages
**HTML Pages** (11 total):
- `index.html` - Home (hero carousel, featured content)
- `about.html` - Organization story, mission, values, timeline
- `trainings.html` - Training programs with calendar view
- `events.html` - Community events grid with filters
- `volunteer.html` - Volunteer opportunities with requirements
- `gallery.html` - Masonry gallery with lightbox
- `contact.html` - Contact form and inquiry system
- `donate.html` - Donation/payment integration
- `future-plans.html` - Vision timeline and goals
- `terms.html` - Terms of service
- `privacy.html` - Privacy policy

## CSS Architecture
**Design System Files**:
- `css/reset.css` - Normalize styles
- `css/theme.css` - CSS variables (brand colors, spacing, typography)
- `css/typography.css` - Font sizes, line heights, type scale
- `css/layout.css` - Grid, flexbox layouts
- `css/utilities.css` - Helper classes
- `css/responsive-mobile.css` - Mobile-first responsive design
- `css/main.css` - Master stylesheet imports
- `css/components/` - Button, card, form, modal, navigation, footer, carousel, alert styles

**Brand Colors**: Sage Green (#6B8E23), Golden Amber (#D4A574), Earth Brown (#8B7355)  
**Spacing Base Unit**: 8px with scale (xs, sm, md, lg, xl, 2xl, 3xl)

## JavaScript Components
**Page Logic**:
- `js/home.js` - Hero carousel, video container
- `js/events.js` - Event filtering and detail modals
- `js/trainings.js` - Training timeline and registration
- `js/volunteers.js` - Opportunity listing and applications
- `js/gallery.js` - Masonry layout and lightbox
- `js/contact.js` - Contact form handling
- `js/donate.js` - Donation form and payment options
- `js/utils.js` - Shared utilities and helpers

**Reusable Components**:
- `js/components/form-validation.js` - Client-side form validation
- `js/components/modal.js` - Modal dialog management
- `js/components/carousel.js` - Image carousel functionality
- `js/components/navigation.js` - Navigation menu interactions

## Data Architecture
**JSON Data Files** (4 total in `data/`):
- `events.json` (46.84 KB) - All events with metadata, dates, locations, capacity
- `trainings.json` (40.46 KB) - Training programs with schedules, requirements, details
- `volunteers.json` (13.1 KB) - Volunteer opportunities with benefits and qualifications
- `recent-registrations.json` (1.82 KB) - Recent form submissions for duplicate checking

**Data Management**: Client-side JavaScript loads JSON via Fetch API; updates require manual FTP upload. All filtering, sorting, and rendering happens in JavaScript.

## Build & Installation
**No Build Process Required**: Files are deployed directly via FTP to Hostinger. What you write is what gets served.

**Development Workflow**:
```bash
# 1. Edit HTML/CSS/JS files locally
# 2. Test in browser (local file or localhost)
# 3. Validate HTML/CSS/JSON
# 4. Optimize images (<200KB each)
# 5. Upload via FTP to Hostinger
# 6. Verify on live site
```

**Local Development Server** (optional):
```bash
cd VEFS-website
python -m http.server 8000
# Access at http://localhost:8000
```

## Testing & Validation
**Framework**: Playwright ^1.57.0  
**Test Configuration**: `.mcp.json` (MCP server for automated testing)  
**Test Baseurl**: `file://` protocol for static files  
**Browsers**: Chromium, Firefox  

**Testing Capabilities**:
- Navigate and verify CSS/JS loading
- Take screenshots for visual verification
- Test responsive design (mobile 375px, tablet 768px, desktop 1920px)
- Verify WCAG AA accessibility compliance
- Test form validation and interactions
- Check browser console for errors
- Verify navigation and links

**Run Command**:
```bash
npx playwright test
```

## Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Page Size**: < 2MB per page
- **HTTP Requests**: < 50 per page
- **Image Size**: < 200KB each

## Key Configuration Files
- `.mcp.json` - Playwright MCP server configuration for testing
- `package.json` - Node.js project metadata and Playwright dependency
- `CLAUDE.md` - Development guidelines and technology stack reference
- `.htaccess` - (Production) HTTPS enforcement and security headers

## Security Implementation
**Client-Side**: CSRF tokens, client-side form validation, honeypot spam prevention  
**Server-Side**: Input sanitization, rate limiting, duplicate registration checking  
**Server Headers**: HTTPS enforcement, X-Frame-Options, X-XSS-Protection, X-Content-Type-Options

## Integration Points
**Gmail API**: Email delivery for form submissions (2,000/day quota)  
**Google Fonts**: CDN-linked typography (Lora, Inter, Annie Use Your Telescope)  
**Google Maps**: Embedded iframe for office location  
**Google Analytics 4**: Traffic tracking  
**Google Schema.org**: Structured data (Organization, Event schemas)

**Payment Integration** (optional): Razorpay/Instamojo for online donations; manual UPI QR and bank transfer supported.

## Accessibility Compliance
**Standard**: WCAG 2.1 Level AA  
**Implementation**: Semantic HTML5, ARIA labels, keyboard navigation, focus indicators (2px sage green), color contrast ≥ 4.5:1, alt text for all images.

## Deployment
**Hosting**: Hostinger static hosting  
**Access**: FTP/SFTP via Hostinger File Manager  
**Web Server**: Apache with .htaccess configuration  
**PHP Support**: Yes (7.4+) for form processing  
**Database**: MySQL available (not used initially, JSON-based content management)
