# VEFS Volunteer Page Requirements

**Status:** Complete
**Priority:** High
**Created:** 2026-01-03
**Last Updated:** 2026-01-03

## Page Overview

The Volunteer page showcases volunteer opportunities at VEFS Foundation, allowing individuals to apply for positions that match their skills, interests, and availability. The page emphasizes the "Work, Learn, and Grow" philosophy, offering meaningful experiences combined with skill development and certification.

## Purpose & Goals

- **Primary Goal:** Attract committed volunteers for various VEFS initiatives
- **Secondary Goals:**
  - Clearly communicate volunteer opportunities, requirements, and benefits
  - Provide easy application process with embedded registration forms
  - Showcase the value proposition (learning outcomes, certificates, stipends, impact)
  - Accommodate diverse volunteer profiles (students, professionals, retirees, remote workers)

## Page Structure & Sections

### 1. Hero Section
- **Gradient background** with brand colors (sage green to earth brown)
- **Main Heading:** "Volunteer Opportunities"
- **Subheading:** "Work, Learn, and Grow with VEFS Foundation"
- Consistent with trainings and events page hero design

---

### 2. Introduction Section
- **Heading:** "Make a Difference Through Action"
- **Content:** Two paragraphs explaining:
  1. What volunteering with VEFS offers (hands-on experience, skill development, community connection)
  2. Diversity of opportunities available (organic farming, education, restoration, digital content, surveys)
- **Tone:** Inspirational yet practical
- **Center-aligned** text for maximum readability

---

### 3. "Why Volunteer with VEFS?" Section
- **Background:** Light gray (`var(--color-gray-50)`)
- **Heading:** "Why Volunteer with VEFS?"
- **Format:** 3-column grid of benefit cards

#### Card 1: Learn & Grow 🌱
- **Icon:** Seedling emoji (3rem size)
- **Title:** "Learn & Grow"
- **Description:** Gain practical skills in conservation, sustainable agriculture, and community engagement. Learn from experienced facilitators and field experts.

#### Card 2: Make an Impact 🤝
- **Icon:** Handshake emoji
- **Title:** "Make an Impact"
- **Description:** Contribute directly to ecological restoration, community education, and environmental awareness. See the tangible results of your efforts.

#### Card 3: Get Certified 🎓
- **Icon:** Graduation cap emoji
- **Title:** "Get Certified"
- **Description:** Receive certificates of completion, gain valuable work experience, and build your professional portfolio in the environmental sector.

---

### 4. Current Opportunities Grid
- **Heading:** "Current Opportunities"
- **Format:** 3-column responsive card grid (`card-grid card-grid-3`)
- **Loading State:** Spinner with "Loading volunteer opportunities..." message
- **Empty State:** "No volunteer opportunities available at this time. Check back soon!"

#### Opportunity Card Components
Each card displays:
- **Image** (if available): Featured image with lazy loading, fallback if missing
- **Badge:** "Only X spots left" warning if spots.available <= 3
- **Title:** Opportunity title (e.g., "Organic Farm Assistant")
- **Description:** Brief description from volunteers.json
- **Key Details:**
  - 📅 Duration (e.g., "2 months")
  - 📍 Location (e.g., "Nilakottai")
  - ⏰ Commitment (e.g., "Full-time", "Part-time", "Weekend")
  - 💰 Stipend (if provided): "Stipend: ₹X,XXX/month" in green
- **Footer:**
  - Spots available count: "X spots available"
  - **CTA Button:** "Apply Now" (primary button, triggers modal)

---

### 5. Volunteer Detail Modal
- **Modal ID:** `volunteer-modal`
- **Size:** Large modal (`modal-lg`, max-width 900px)
- **Header:** Opportunity title with close button (×)
- **Body Content (Dynamically Loaded):**

#### Section A: About This Opportunity
- Full description from volunteers.json (description.full)
- Multiple paragraphs with detailed context

#### Section B: Key Information Grid
3-column responsive grid with info boxes:
1. **Duration Box:**
   - Icon: 📅
   - Duration value (e.g., "2 months")
   - Date range: "Feb 15, 2026 - Apr 15, 2026"
2. **Location Box:**
   - Icon: 📍
   - City, State
   - Type: "On-site" / "Remote" / "Hybrid"
3. **Commitment Box:**
   - Icon: ⏰
   - Commitment level
   - Spots available: "X spots available"

#### Section C: Requirements
- **Age Range:** Min - Max years
- **Skills Needed:** Bulleted list
- **Physical Requirements:** Paragraph (if applicable)
- **Education:** Requirements or "No formal requirements"

#### Section D: What You'll Gain (Benefits)
- **Learning Outcomes:** Bulleted list of skills/knowledge gained
- **Benefits Icons:**
  - ✓ Certificate provided (green)
  - ✓ Meals included (green)
  - ✓ Accommodation provided (green)
  - ✓ Stipend: ₹X/month (green)

#### Section E: Registration Form
- **Background:** Light gray box with rounded corners
- **Heading:** "Apply for This Opportunity"
- **Form Fields:**
  1. **Full Name** (required, text input)
  2. **Email** (required, email input with validation)
  3. **Phone** (required, tel input with validation)
  4. **Age** (required, number input with min/max validation based on requirements)
     - Helper text: "Must be between X and Y years"
  5. **Why do you want to volunteer with us?** (required, textarea, 4 rows)
  6. **Relevant Skills/Experience** (optional, textarea, 3 rows)
- **Submit Button:** "Submit Application" (full-width, primary, large)

#### Section F: Contact Information
- Light blue background box
- **Format:** "Questions? Contact [Name] at [email] or [phone]"
- Clickable mailto: and tel: links

---

### 6. FAQ Section
- **Background:** Light gray (`var(--color-gray-50)`)
- **Heading:** "Frequently Asked Questions"
- **Format:** Collapsible `<details>` elements styled as cards

#### FAQ Questions:
1. **Do I need prior experience to volunteer?**
   - Answer: Not at all! Most positions welcome enthusiastic beginners with training provided.

2. **Are food and accommodation provided?**
   - Answer: Benefits vary by opportunity. Check each opportunity's details under "Benefits".

3. **Will I receive a stipend?**
   - Answer: Some positions offer modest stipends (₹2,000-5,000/month). All positions provide certificates.

4. **How do I apply for a volunteer position?**
   - Answer: Click "Apply Now" on any opportunity card, fill out the application form.

5. **What if I can only volunteer on weekends?**
   - Answer: We have flexible options! Look for "Weekend" or "Part-time" commitment opportunities.

6. **Can international volunteers apply?**
   - Answer: Yes! You'll need to arrange your own visa and travel. Remote positions open to anyone with internet access.

---

### 7. Call-to-Action Section
- **Background:** Primary light color (`var(--color-primary-light)`)
- **Center-aligned** text
- **Heading:** "Can't Commit Right Now?" (gradient text effect)
- **Subheading:** "Stay connected with VEFS Foundation! Join our mailing list..."
- **Buttons (Flexbox, center-aligned):**
  1. **Primary:** "Get in Touch" → Links to contact.html
  2. **Outline:** "Support Our Work" → Links to donate.html
  3. **Outline:** "Attend an Event" → Links to events.html

---

## Technical Implementation

### Data Source
- **File:** `data/volunteers.json`
- **Loading:** Client-side via `fetch()` API
- **JavaScript Module:** `js/volunteers.js`
- **Class:** `VolunteersPage`

### Key JavaScript Features
1. **Data Loading:**
   - Fetch volunteers.json on page load
   - Filter for status === 'open'
   - Sort by start date (earliest first)

2. **Card Rendering:**
   - Dynamic HTML generation from JSON data
   - Error handling for missing images
   - Responsive grid layout

3. **Modal System:**
   - Uses existing `window.modalInstance` from `js/components/modal.js`
   - Dynamically populates modal content
   - Hash navigation support (e.g., `volunteer.html#organic-farm-assistant`)

4. **Form Validation:**
   - Uses `window.FormValidation` component
   - Age validation against opportunity min/max requirements
   - Email and phone validation
   - Minimum character count for motivation field

5. **Form Submission:**
   - Client-side validation first
   - Console log (development)
   - Success message display
   - Modal auto-close after 3 seconds

6. **Hash Navigation:**
   - Direct links to specific opportunities
   - URL updates when modal opens
   - Hash change event listener

### Dependencies
- `js/utils.js` - Utility functions (formatDate, etc.)
- `js/components/navigation.js` - Header navigation
- `js/components/modal.js` - Modal functionality
- `js/components/form-validation.js` - Form validation
- `js/volunteers.js` - Main volunteer page logic

### JSON Schema Reference
See `data/volunteers.json` for complete schema. Key fields:
- `id`, `title`, `slug`
- `description.brief`, `description.full`
- `dates.start`, `dates.end`
- `duration.value`, `duration.unit`
- `commitment` (Full-time/Part-time/Weekend)
- `requirements` (age, skills, physical, education)
- `benefits` (learning, certificate, meals, accommodation, stipend)
- `location` (city, state, type)
- `spots` (total, filled, available)
- `status` ("open" or "closed")
- `contact` (name, email, phone)
- `media.featuredImage`

---

## Design Specifications

### Colors
- **Background gradients:** Sage Green (#6B8E23) to Earth Brown (#8B7355)
- **Text overlays:** White with gradient effects
- **Success indicators:** var(--color-success) for benefits
- **Warning badges:** var(--color-warning) for "only X spots left"

### Typography
- **Hero heading:** var(--font-size-4xl), bold (700), gradient text fill
- **Section headings:** var(--font-size-3xl), primary color
- **Card titles:** var(--font-size-xl)
- **Body text:** var(--font-size-lg) for intro, standard for descriptions

### Spacing
- **Section padding:** var(--space-3xl) vertical
- **Card gap:** var(--space-xl) in grid
- **Info box padding:** var(--space-lg)

### Responsive Behavior
- **Desktop (>1024px):** 3-column grid
- **Tablet (768-1023px):** 2-column grid
- **Mobile (<768px):** Single column

---

## SEO & Accessibility

### Meta Tags
```html
<title>Volunteer Opportunities - Work, Learn & Grow | VEFS Foundation</title>
<meta name="description" content="Volunteer with VEFS Foundation. Work, learn, and grow through meaningful environmental conservation opportunities across Tamil Nadu.">
<meta name="keywords" content="volunteer opportunities Tamil Nadu, environmental volunteering, conservation work, VEFS volunteers, ecological restoration volunteering">
```

### Accessibility Features
- Semantic HTML (`<main>`, `<section>`, `<details>`, etc.)
- ARIA labels on modal and buttons
- Keyboard navigation support (modal focus trap)
- Alt text for all images (with onerror fallback)
- Form labels properly associated with inputs
- Color contrast meets WCAG AA standards

---

## Content Management

### Adding New Opportunities
1. Edit `data/volunteers.json` locally
2. Add new volunteer object to `volunteers` array
3. Increment `metadata.totalOpportunities`
4. Update `metadata.lastUpdated` timestamp
5. Validate JSON at jsonlint.com
6. Upload to Hostinger via FTP

### Opportunity Status Management
- Set `status: "closed"` to hide from display
- Adjust `spots.available` as applications come in
- Archive completed opportunities by changing status

---

## Future Enhancements (Out of Scope)

- [ ] Backend integration for application submission
- [ ] Admin dashboard for managing applications
- [ ] Email notifications to applicants
- [ ] Application status tracking
- [ ] Volunteer profile system
- [ ] Advanced search/filter functionality
- [ ] Application deadline countdown timers
- [ ] Testimonials from past volunteers

---

## Notes

- **Philosophy:** "Work, Learn, Grow" - emphasizes that volunteering is a two-way benefit
- **Diversity:** Opportunities range from physical (farm work, pond restoration) to digital (social media) to flexible (weekend surveys)
- **Inclusivity:** Age ranges, remote options, and stipends make volunteering accessible
- **Transparency:** Full disclosure of requirements, benefits, and expectations upfront
- **Simplicity:** No filters on main page - just browse all open opportunities
- **Mobile-friendly:** Critical since many potential volunteers browse on phones

---

## Related Documents
- `data/volunteers.json` - Complete data schema
- `VEFS-requirements/technical/FILE_MANAGEMENT_SYSTEM.md` - File structure
- `VEFS-requirements/technical/COMPONENT_LIBRARY.md` - Reusable components
- `VEFS-requirements/technical/REGISTRATION_SYSTEM.md` - Form architecture
