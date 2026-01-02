# VEFS Website - Implementation Plan

This is the master implementation plan for building the VEFS Foundation website.

**Full plan reference:** See `C:\Users\NANDHU\.claude\plans\majestic-swimming-pudding.md`

## Quick Reference

### Project Constraints
- Hostinger static hosting (PHP + vanilla JavaScript)
- NO Node.js, NO build tools, NO frameworks
- Manual FTP deployment
- Entry point: index.html

### Folder Structure
- **VEFS-builder/** - Development files, documentation (NOT deployed)
- **VEFS-website/** - Production-ready files (copy to Hostinger)

### Timeline
30 days total (~6 weeks full-time)

### Critical Build Order
1. CSS theme.css (CSS variables foundation)
2. CSS layout.css (grid, containers)
3. CSS/JS navigation (used on all pages)
4. JS utils.js (helper functions)
5. Data JSON files (events, trainings, programs)
6. index.html (Home page - validates foundation)

### 10 Implementation Phases
0. Foundation (2 days) - **CURRENT**
1. Core Components (3 days)
2. Data Layer (2 days)
3. Priority 1 Pages (5 days)
4. Priority 2 Pages (5 days)
5. Priority 3 Pages (3 days)
6. Backend Integration (3 days)
7. SEO/Performance/Accessibility (3 days)
8. Testing & QA (2 days)
9. Deployment Preparation (2 days)

### Key Reminders
- Use placeholder content (user will replace later)
- Create realistic sample data
- Gmail API credentials from user (placeholder in code)
- UPI QR codes only for payments
- Mobile-first responsive design
- WCAG AA accessibility required
- Performance: PageSpeed 80+, LCP < 2.5s
