# VEFS Events Page Requirements

**Status:** In Progress
**Priority:** High
**Created:** 2025-12-23

## Page Overview

The Events Page showcases all of VEFS's upcoming and past events, including workshops, seminars, field visits, trekking activities, competitions, and community gatherings. It serves as a central hub for discovering and participating in VEFS's community engagement initiatives.

## Page Structure & Sections

### 1. Page Header
- **Status:** Required
- **Content:**
  - Page title: "Our Events" or "Community Events"
  - Hero image or background (event photo from past gathering)
  - Subheading: Brief tagline (e.g., "Join Us in Creating Environmental Impact")
- **Design Notes:**
  - Consistent with other pages
  - Full-width banner with engaging image
  - Text overlay for readability

---

### 2. Introduction Section
- **Status:** Required
- **Format:** Text block with optional visual
- **Content:**
  - Overview of VEFS's event philosophy (2-3 sentences)
  - Types of events offered
  - Frequency and reach
  - Call-to-action to explore events
- **Design Notes:**
  - Warm, inviting tone
  - Optional: Featured statistic (e.g., "1000+ participants annually")

---

### 3. Filter/Search Options
- **Status:** Required
- **Format:** Horizontal filter bar (sticky/top-aligned)
- **Filter Options:**
  - **By Date:** Upcoming, This Month, Next 3 Months, Past Events
  - **By Event Type:** Workshops, Seminars, Field Visits, Trekking, Competitions, Gatherings, Other
  - **By Target Audience:** Students, Farmers, Women, General Public, Families
  - **By Location:** Geographic area/region (if multiple locations)
  - **Search Box:** Free-text search for event name/keyword
- **Design Notes:**
  - Filter pills/buttons (toggle)
  - Search with magnifying glass icon
  - "Reset Filters" button
  - Shows count of matching events
  - Mobile: Collapsible filter menu

---

### 4. Grid View - Event Cards
- **Status:** Required
- **Format:** Responsive grid layout (3 columns desktop, 2 tablet, 1 mobile)
- **Content per event card:**

**Card Layout:**
  - Event image (featured photo from event or illustration)
  - Event date (day, month, year) - prominent display
  - Event title (H4 heading)
  - Event type badge (Workshop, Field Visit, Competition, etc.)
  - Location (city/venue name)
  - Brief description (1-2 sentences)
  - Audience icon/tag (visual indicator of who it's for)
  - CTA Button: "Learn More" or "View Details"
  - Optional: Filled seats indicator (if registration-based)

**Card Visual Specifications:**
  - Image: 400x250px (16:10 aspect ratio)
  - Border radius: 8px
  - Background: White with 1px subtle border
  - Shadow: 0 2px 8px rgba(0,0,0,0.08)
  - Hover effect: Card lift, shadow increase
  - Padding: 16px

**Event Type Badges:**
  - Workshop: Sage green badge
  - Field Visit: Nature green badge
  - Trekking: Adventure orange badge
  - Seminar: Professional blue badge
  - Competition: Energetic purple badge
  - Gathering: Community gold badge
  - Other: Gray badge

**Date Styling:**
  - Large font (18px, bold)
  - Sage green color
  - Format: "25 Dec" or "Dec 25, 2025"

---

### 5. Event Detail Modal/Page
- **Status:** Required
- **Triggered by:** "Learn More" button on card or card click
- **Format:** Modal or dedicated page
- **Content for each event:**

**Essential Information:**
  - Event title (H2)
  - Event date and time (prominent)
  - Duration (how long the event runs)
  - Location (venue, address, map embed for in-person)
  - Event type (Workshop, Field Visit, etc.)
  - Target audience
  - Event image(s)

**Detailed Information:**
  - **Overview:** Full event description (2-4 paragraphs)
  - **Purpose:** Why VEFS is organizing this event
  - **Activities:** What will happen during the event (agenda/schedule)
  - **Learning Outcomes:** What participants will gain
  - **Facilitators:** Names, titles, brief bios
  - **Group Size:** Number of participants
  - **Difficulty Level:** Easy, Moderate, Challenging (for outdoor events)

**Practical Details:**
  - **Cost:** Free, paid, or donation-based
  - **Registration Required:** Yes/No
  - **Spots Available:** If limited registration
  - **What to Bring:** Materials, supplies, clothing recommendations
  - **Dress Code:** Appropriate attire
  - **Food & Refreshments:** What's provided
  - **Parking & Transportation:** Directions, accessibility info
  - **Accessibility:** Wheelchair access, accessible facilities
  - **Age Requirements:** If any

**Event Schedule (for multi-day events):**
  - Session-by-session breakdown
  - Times and locations for each activity
  - Break times and meal arrangements

**Gallery & Media:**
  - 3-5 photos from the event (or similar past events)
  - Optional: Video teaser or documentation

**Registration & CTAs:**
  - Primary: "Register Now" button (golden/amber)
  - Secondary: "Contact for Questions" → Email form
  - Share options: Social media sharing buttons

**Cancellation/Rescheduling:**
  - Cancellation policy
  - Weather contingency (for outdoor events)
  - Refund policy (if applicable)

---

### 6. Upcoming Events Highlight
- **Status:** Optional
- **Format:** Featured carousel or highlighted cards (above grid)
- **Content:**
  - 2-3 featured upcoming events
  - Larger cards with more emphasis
  - "View All Events" link to full grid below
- **Design Notes:**
  - Eye-catching design
  - Auto-rotation (5 second intervals, pausable)

---

### 7. Event Categories/Types Section (Alternative View)
- **Status:** Optional
- **Format:** Tab or toggle view alongside grid
- **Options:**
  - View all events (default grid)
  - View by type (each type in its own section)
  - View by audience
  - Calendar view (optional)
- **Design Notes:**
  - View toggle near filters
  - Smooth transition between views

---

### 8. Impact & Statistics Section
- **Status:** Optional
- **Format:** Visual statistics display
- **Content:**
  - Total events hosted annually
  - Total participants engaged
  - Different event types offered
  - Geographic reach (number of locations/regions)
- **Design Notes:**
  - Large numbers with icons
  - Inspiring tone

---

### 9. Call-to-Action Section
- **Status:** Required
- **Format:** Banner or card section
- **Content:**
  - Heading: "Can't Find Your Perfect Event?"
  - Options:
    - "Suggest an Event" → Form to request custom event
    - "Request Group Booking" → Organize event for your group
    - "Become a Volunteer" → Help organize events
    - "Get Event Notifications" → Newsletter signup
- **Design Notes:**
  - Multiple pathways for engagement
  - Golden/amber CTAs

---

### 10. FAQ Section
- **Status:** Required
- **Format:** Accordion expandable Q&A
- **Typical Questions:**
  - How do I register for an event?
  - Is there a registration fee?
  - What if an event is cancelled?
  - Can I bring my family?
  - What's the age limit?
  - Do I need prior experience?
  - What should I bring to an outdoor event?
  - Are food and drinks provided?
  - Is transportation provided?
  - How far in advance should I register?
  - Can groups book events together?
  - Are past events documented (photos/videos)?

---

### 11. Contact & Inquiry Section
- **Status:** Required
- **Format:** Contact info block
- **Content:**
  - Events coordinator contact
  - Email for event inquiries
  - Phone number
  - Office address
  - Response time commitment
  - Alternative: Contact form for event-specific questions

---

### 12. Footer
- **Status:** Required (Standard footer)
- **Content:** Same as other pages

---

## Content Organization & Flow

**Page Structure (top to bottom):**
1. Page header with hero
2. Introduction section
3. Filter/search bar (sticky)
4. Featured events (optional carousel)
5. Grid view of all events (responsive 3/2/1 column)
6. Optional: Alternative view toggle (by type, by audience)
7. Impact statistics (optional)
8. Call-to-Action section
9. FAQ section
10. Contact & support
11. Footer

---

## Interactions & Features

### Event Card Interactions
- **Hover:** Card lift, shadow increase, slight color change
- **Click:** Opens detailed event information
- **Click "Learn More":** Opens full event details modal or dedicated page
- **Focus:** Clear focus outline for keyboard navigation

### Filter Interactions
- **Click filter:** Toggle on/off
- **Multiple filters:** AND logic (show events matching ALL selected filters)
- **Search:** Real-time filtering as user types
- **Reset:** Clear all filters, show all events
- **Results count:** "Showing X of Y events"

### Grid Responsiveness
- **Desktop (1024+):** 3-column grid
- **Tablet (768-1023):** 2-column grid
- **Mobile (<768):** 1-column grid
- **Infinite scroll** or pagination for many events

### Modal Interactions
- **Open:** Smooth fade-in animation
- **Close:** Close button (X) or outside click or Escape key
- **Navigation:** Optional Previous/Next event buttons
- **Scroll:** Scrollable content if needed
- **Register button:** Takes to registration form

---

## Design & Visual Approach

### Color Usage
- **Headers:** Sage green (#6B8E23)
- **Date display:** Sage green, bold
- **Type badges:** Color-coded by event type
- **CTA buttons:** Golden/amber (#FBBF24)
- **Card backgrounds:** White
- **Hover states:** Light gray background (#F5F5F5)

### Layout
- **Max content width:** 1200px
- **Grid gap:** 32px (desktop), 24px (tablet), 16px (mobile)
- **Card margins:** Responsive padding
- **Section padding:** 64px vertical (desktop), 32px (mobile)

### Typography
- **Section heading (H2):** Serif, 36px, sage green
- **Event title (H4):** Sans-serif, 20px, sage green
- **Date:** Sans-serif, 18px, bold, sage green
- **Location:** Sans-serif, 14px, gray
- **Description:** Sans-serif, 16px, dark gray

---

## Responsive Design

### Desktop (1024px+)
- 3-column event grid
- Full card details visible
- Side-by-side filter options
- All content visible without scrolling individual cards

### Tablet (768px - 1023px)
- 2-column grid
- Filter options in dropdown
- Touch-friendly card sizing
- Optimized spacing

### Mobile (< 768px)
- 1-column stack
- Full-width cards
- Larger touch targets (44x44px minimum)
- Collapsible filter menu
- Sticky filter bar at top

---

## Accessibility

- **Alt text** for all event images
- **Semantic HTML** for proper structure
- **Color contrast** WCAG AA compliant
- **Keyboard navigation** for all interactive elements
- **ARIA labels** for filters, buttons, modals
- **Focus indicators** clear and visible
- **Form accessibility:** Proper label associations

---

## SEO Considerations

- **Page title:** "Events | VEFS" or "Community Events"
- **Meta description:** Summary of event offerings
- **Keywords:** Events, workshops, community, environmental, educational
- **H1 tag:** Clear main heading
- **Structured data:** Event schema for each event
- **Internal links:** Cross-linking to programs, trainings, contact

---

## Content to Provide

### For Each Event (Upcoming & Past):
- [ ] Event title
- [ ] Date(s) and time(s)
- [ ] Duration
- [ ] Location (venue, address)
- [ ] Event type (Workshop, Field Visit, Trekking, Competition, etc.)
- [ ] Target audience
- [ ] Brief description (1-2 sentences)
- [ ] Full event overview (2-4 paragraphs)
- [ ] Activities/agenda
- [ ] Learning outcomes
- [ ] Facilitator names and bios
- [ ] Group size/capacity
- [ ] Cost/fee information
- [ ] Registration requirements
- [ ] What to bring/wear
- [ ] Accessibility information
- [ ] Cancellation policy
- [ ] Event images (2-4 photos)
- [ ] Testimonials from past participants (optional)

### General Content:
- [ ] Page introduction
- [ ] Event impact metrics
- [ ] FAQ content
- [ ] Contact information

---

## Next Steps

1. Review and approve event page structure
2. Provide event content and images
3. Determine registration requirements
4. Set up event detail pages or modals
5. Proceed to Gallery page documentation

---

**Document Version:** 1.0
**Last Updated:** 2025-12-23
