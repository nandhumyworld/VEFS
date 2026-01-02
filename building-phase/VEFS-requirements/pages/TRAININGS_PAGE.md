# VEFS Trainings Page Requirements

**Status:** In Progress
**Priority:** High
**Created:** 2025-12-23

## Page Overview

The Trainings Page is a dynamic hub for discovering, learning about, and registering for VEFS's educational and skill-development programs. It displays trainings in a timeline/calendar format, allowing visitors to browse upcoming opportunities and register for sessions of interest.

## Page Structure & Sections

### 1. Page Header
- **Status:** Required
- **Content:**
  - Page title: "Trainings & Workshops" or "Learn With Us"
  - Hero image or background (training/workshop in action)
  - Subheading: Brief tagline (e.g., "Develop Skills, Build Knowledge, Make a Difference")
- **Design Notes:**
  - Consistent header styling
  - Full-width banner with engaging image
  - Text overlay for readability

---

### 2. Introduction Section
- **Status:** Required
- **Format:** Text block with visual support
- **Content:**
  - Overview of VEFS training philosophy (2-3 sentences)
  - Types of trainings offered (workshops, field visits, webinars, etc.)
  - Who can participate
  - Benefits of participation
- **Design Notes:**
  - Warm, encouraging tone
  - Optional: Featured statistics (e.g., "2000+ people trained annually")

---

### 3. Filter/Search Options
- **Status:** Required
- **Format:** Horizontal filter bar
- **Filter Options:**
  - **By Date Range:** Past, Upcoming, This Month, Next 3 Months, All
  - **By Type:** Workshops, Field Visits, Online Sessions, Competitions, etc. (if applicable)
  - **By Target Audience:** Students, Farmers, Women, General Public
  - **By Topic/Focus:** Tree Plantation, Ecological Awareness, Sustainable Farming, etc.
  - **Search Box:** Free-text search for training name/keyword
- **Design Notes:**
  - Filter pills/buttons (toggle on/off)
  - Search box with magnifying glass icon
  - "Reset Filters" button
  - Shows count of matching trainings
  - Mobile: Hamburger menu for filter options

---

### 4. Timeline/Calendar View
- **Status:** Required
- **Format:** Chronological timeline with training cards
- **Content Structure:**

#### Timeline Layout
- **Vertical timeline** (recommended for mobile/tablet compatibility)
- **Horizontal timeline** (optional for desktop with smooth scrolling)
- **Year/Month headers** as timeline markers
- **Training cards** positioned on timeline by date

#### Each Training Card shows:
- **Training title** (H4)
- **Date and time** (clearly visible)
- **Duration** (e.g., "2 days" or "3-week program")
- **Location** (city/venue or "Online")
- **Audience icon/label** (Students, Farmers, Women, Public)
- **Brief description** (1-2 sentences)
- **Trainer name** (optional on card)
- **Number of seats available** (if applicable)
- **Card image/icon** (training-related visual)
- **Status badge:**
  - "Upcoming" (future date, green)
  - "Open Now" (active registration, golden/amber)
  - "Closing Soon" (few spots left, orange)
  - "Full" (no seats available, gray)
  - "Past" (historical, light gray)

#### Card Click Actions:
- **Click "View Details"** → Opens detailed training information
- **Click "Register Now"** → Opens registration form
- **Click card image/title** → Opens full details

---

### 5. Training Detail Modal/Page
- **Status:** Required
- **Triggered by:** "View Details" button on timeline card
- **Format:** Modal or dedicated page
- **Content for each training:**

**Essential Information:**
  - Training title (H2)
  - Training image/header
  - **Date & Time:** Start date, end date, session times
  - **Duration:** Total hours/days
  - **Location:** Venue name, address, map embed (if in-person)
  - **Mode:** In-person, Online, Hybrid
  - **Audience:** Who this training is designed for

**Detailed Information:**
  - **Overview:** Full training description (2-4 paragraphs)
  - **Objectives:** What participants will learn (bullet list)
  - **Activities:** What will be done (bullet list)
  - **Curriculum/Syllabus:** Detailed session-by-session breakdown (if applicable)
  - **Prerequisites:** Any prior knowledge/skills required
  - **Expected Outcomes:** What participants will gain
  - **Who Should Join:** Target audience description

**Practical Details:**
  - **Cost:** Free, paid, or sliding scale
  - **Registration Fee:** If applicable, payment methods
  - **Facilitator/Trainer:** Name, title, bio, photo (if available)
  - **Co-facilitators:** Other instructors (if applicable)
  - **Group Size:** Number of participants
  - **Seats Available:** Current availability
  - **Age/Education Requirements:** If any

**Logistics:**
  - **What to Bring:** Materials, supplies, documents needed
  - **Dress Code:** What to wear (especially outdoor trainings)
  - **Meals Provided:** Yes/No, dietary accommodations
  - **Accommodation:** If multi-day, housing information
  - **Transportation:** Directions, parking, public transit info
  - **Accessibility Info:** Wheelchair access, accessible facilities

**Post-Training:**
  - **Certificate Provided:** Yes/No details
  - **Follow-up Support:** Ongoing resources or mentoring
  - **Alumni Network:** Connection to past participants

**Gallery & Media:**
  - Training photos (2-5 images from past sessions)
  - Optional: Video introduction or sample session
  - Optional: Testimonials from past participants

**Cancellation & Rescheduling Policy:**
  - Terms for cancellation
  - Options for rescheduling if needed
  - Refund policy (if applicable)

**Registration & Next Steps:**
  - **Primary CTA:** "Register Now" button (golden/amber)
  - **Secondary CTA:** "Contact for Questions" → Email form
  - **Limited Spots:** Urgency messaging if seats running low

---

### 6. Registration Form
- **Status:** Required
- **Triggered by:** "Register Now" button
- **Format:** Modal form or dedicated page
- **Form Fields:**
  - **Personal Information:**
    - Full name (required)
    - Email address (required)
    - Phone number (required)
    - Age/Date of birth (if relevant)
  - **Educational/Background:**
    - Education level (if applicable)
    - Relevant experience (if applicable)
    - Prior VEFS participation (yes/no)
  - **Participation Details:**
    - How did you hear about this training? (multiple choice)
    - What are your learning goals? (text)
    - Any dietary restrictions? (if applicable)
    - Accessibility needs? (if applicable)
    - Preferred mode (if hybrid: in-person or online)
  - **Consent & Agreement:**
    - Checkbox: Agree to terms and conditions
    - Checkbox: Receive updates and newsletters (optional)
  - **Payment (if applicable):**
    - Payment method selection
    - Billing information
    - Invoice preference

**Form Design:**
- Step-by-step (multi-page form) for better UX
- Clear progress indicator
- Validation messages for required fields
- Submit button: "Complete Registration" (golden/amber)
- Confirmation: "Registration Successful" message with details

---

### 7. Training Categories/Types Section (Alternative View)
- **Status:** Optional (in addition to timeline)
- **Format:** Tab or toggle view
- **Options:**
  - View as Timeline (default)
  - View by Category
  - View as Grid/List
- **Categories:**
  - Workshops (short, skill-focused)
  - Field Visits (outdoor, experiential)
  - Online Sessions (webinars, virtual)
  - Long-term Programs (multi-week or seasonal)
  - Competitions (student-focused challenges)

---

### 8. Featured/Recommended Trainings Section
- **Status:** Optional
- **Format:** Carousel or grid of 3-4 highlighted trainings
- **Content:**
  - Heading: "Popular Trainings" or "Featured Programs"
  - Cards with training image, title, date, "Learn More" button
- **Design Notes:**
  - Positioned above or after main timeline
  - Eye-catching design

---

### 9. Impact/Success Metrics
- **Status:** Optional
- **Format:** Statistics display
- **Content:**
  - Total people trained
  - Number of trainings offered
  - Participant satisfaction rate
  - Average attendance
  - Repeat participant rate
- **Design Notes:**
  - Visually striking numbers
  - Icons or illustrations
  - Inspiring tone

---

### 10. Call-to-Action Section
- **Status:** Required
- **Format:** Banner or card section
- **Content:**
  - Heading: "Can't Find What You're Looking For?"
  - Subheading: Offer alternative options
  - Options:
    - "Request Custom Training" → Form for organizations
    - "Join Our Mailing List" → Newsletter signup
    - "Contact Program Team" → Email form
    - "Become a Trainer" → Partnership inquiry
- **Design Notes:**
  - Warm, inviting tone
  - Multiple pathways for engagement

---

### 11. FAQ Section
- **Status:** Required
- **Format:** Accordion or expandable Q&A
- **Typical Questions:**
  - How do I register for a training?
  - Is there a registration fee?
  - Can I cancel or reschedule?
  - What if I need to miss a session?
  - Do you provide certificates?
  - Are trainings available online?
  - How many trainings are offered per year?
  - Can groups book a training together?
  - Do you offer trainings in my area?
  - What is the typical class size?
  - Are meals/snacks provided?
  - How do I prepare for a field training?

---

### 12. Contact & Support Section
- **Status:** Required
- **Format:** Contact info block
- **Content:**
  - Email for training inquiries
  - Phone number
  - Office hours
  - Response time commitment (e.g., "We'll respond within 2 business days")
  - Mailing address (if applicable)
  - Social media links

---

### 13. Footer
- **Status:** Required (Standard footer)
- **Content:** Same as other pages
  - Navigation links
  - Contact information
  - Newsletter signup
  - Social media
  - Copyright

---

## Content Organization & Flow

**Page Structure (top to bottom):**
1. Page header with hero image
2. Introduction section
3. Filter/Search options (sticky)
4. Timeline/Calendar view (main content)
   - Organized chronologically
   - Interactive training cards
   - Detail modal on click
5. Optional: Alternative view tabs (by category, by audience)
6. Featured trainings (optional carousel)
7. Call-to-Action Section
8. FAQ Section
9. Contact & Support
10. Footer

---

## Interactions & Features

### Timeline Card Interactions
- **Hover:** Card elevation, shadow increase, slight color change
- **Click on card:** Expands inline details or opens modal
- **Click "View Details":** Opens full training details modal
- **Click "Register Now":** Opens registration form
- **Focus:** Clear focus outline for keyboard navigation

### Filter Interactions
- **Click filter pill:** Toggle on/off
- **Search input:** Real-time filtering as user types
- **Reset button:** Clear all filters and show all trainings
- **Results count:** Shows "Showing X of Y trainings"

### Modal/Detail Page Interactions
- **Open:** Smooth fade-in animation
- **Close:** Close button (X) or outside click
- **Navigation:** Optional Previous/Next training buttons
- **Scroll:** Scrollable content if needed
- **Register button:** Takes user to registration form

### Form Interactions
- **Multi-step form:** Progress bar showing steps
- **Validation:** Real-time field validation with clear error messages
- **Confirmation:** Redirect to confirmation page with training details
- **Email confirmation:** Send confirmation details to registered email

---

## Design & Visual Approach

### Color Usage
- **Headers:** Sage green (#6B8E23)
- **Timeline line:** Sage green
- **Timeline markers:** Golden/amber circles
- **Status badges:**
  - Upcoming: Green (#10B981)
  - Open: Amber (#FBBF24)
  - Full: Gray (#9CA3AF)
- **CTA buttons:** Golden/amber (#FBBF24)
- **Card backgrounds:** White with subtle border

### Layout
- **Max content width:** 1200px
- **Timeline width:** Full width with padding
- **Card margins:** Generous spacing (24px between cards)
- **Section padding:** 64px vertical on desktop, 32px on mobile
- **Filter bar:** Sticky positioning at top (after header)

### Typography
- **Section heading (H2):** Serif, 36px, sage green
- **Training title (H4):** Sans-serif, 20px, sage green
- **Date/time:** Sans-serif, 14px, bold, dark gray
- **Description:** Sans-serif, 16px, regular, dark gray
- **Status badge:** Sans-serif, 12px, bold, white text

---

## Responsive Design

### Desktop (1024px+)
- Full timeline with horizontal scroll option
- Training cards in 2-column layout within timeline
- All filter options visible
- Full details in modal

### Tablet (768px - 1023px)
- Vertical timeline (most responsive)
- Training cards stack in single column
- Filter options in dropdown or tabs
- Touch-friendly card sizing

### Mobile (< 768px)
- Single-column vertical timeline
- Full-width training cards
- Filter options in collapsible hamburger menu
- Larger touch targets (minimum 44x44px)
- Sticky filter bar at top

---

## Accessibility

- **Alt text** for all training images and icons
- **Semantic HTML** for timeline structure
- **Color contrast** WCAG AA compliant
- **Keyboard navigation** for all interactive elements
- **ARIA labels** for buttons, forms, and modals
- **Focus indicators** clear and visible
- **Form accessibility:** Proper label associations, error messages
- **Modal accessibility:** Proper focus management, dismissible with Escape key

---

## SEO Considerations

- **Page title:** "Trainings & Workshops | VEFS"
- **Meta description:** Compelling summary of training offerings
- **Keywords:** Trainings, workshops, education, ecological learning, skill development
- **H1 tag:** Main heading (e.g., "Discover Our Trainings")
- **Structured data:** Event schema for each training
- **Internal links:** Cross-linking to programs, events, about page

---

## Content to Provide

### For Each Training (Upcoming & Past):
- [ ] Training title
- [ ] Date(s) and time(s)
- [ ] Duration
- [ ] Location (or "Online")
- [ ] Training type/category
- [ ] Target audience
- [ ] Brief description (1-2 sentences)
- [ ] Full overview (2-4 paragraphs)
- [ ] Objectives (bullet list)
- [ ] Activities/Curriculum (detailed outline)
- [ ] Prerequisites
- [ ] Expected outcomes
- [ ] Cost/Fee information
- [ ] Facilitator name(s) and bio(s)
- [ ] Group size/capacity
- [ ] Seats available
- [ ] What to bring/wear
- [ ] Accessibility information
- [ ] Cancellation policy
- [ ] Certification details (if applicable)
- [ ] Training images (2-4 photos)
- [ ] Testimonials from past participants (optional)

### General Content:
- [ ] Page introduction
- [ ] Training categories/types
- [ ] Impact metrics
- [ ] FAQ content
- [ ] Training coordinator contact info

---

## Next Steps

1. Review and approve training page structure
2. Provide training content and images
3. Set up database for dynamic training listings
4. Configure registration form fields
5. Set up email confirmation system
6. Proceed to Events page documentation

---

**Document Version:** 1.0
**Last Updated:** 2025-12-23
