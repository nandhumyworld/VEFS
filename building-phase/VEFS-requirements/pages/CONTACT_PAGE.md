# VEFS Contact Page Requirements

**Status:** In Progress
**Priority:** Medium
**Created:** 2025-12-23

## Page Overview

The Contact Page provides multiple pathways for visitors to connect with VEFS, ask questions, request services, or express interest in collaborating. It features a comprehensive contact form alongside traditional contact methods, ensuring accessibility for all communication preferences.

## Page Structure & Sections

### 1. Page Header
- **Status:** Required
- **Content:**
  - Page title: "Contact Us" or "Get In Touch"
  - Hero image or background
  - Subheading: Brief tagline (e.g., "We'd Love to Hear From You")
- **Design Notes:**
  - Consistent header styling
  - Warm, welcoming tone

---

### 2. Quick Contact Info Cards
- **Status:** Required
- **Format:** 3-4 cards displaying different contact methods
- **Content per card:**

#### Card 1: Email
- Icon: Envelope icon (sage green)
- **Heading:** "Email Us"
- **Primary Email:** [general inquiry email]
- **Alternative:** [specific department email]
- Description: "Best for detailed inquiries"

#### Card 2: Phone
- Icon: Phone icon (sage green)
- **Heading:** "Call Us"
- **Phone Number:** [main phone]
- **Hours:** [office hours]
- Description: "Monday - Friday, [time range]"

#### Card 3: Visit Us
- Icon: Location/Map icon (sage green)
- **Heading:** "Visit Our Office"
- **Address:** [Full office address]
- **Hours:** [office hours]
- Description: "Drop by or schedule an appointment"

#### Card 4: Connect Online
- Icon: Social media icon (sage green)
- **Heading:** "Follow Us"
- **Social Links:** Facebook, Instagram, LinkedIn, Twitter
- Description: "Stay updated with our latest news"

**Design Notes:**
- Card layout: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
- White cards with sage green icons
- Clickable: Email and phone links functional
- Social links open in new tab

---

### 3. Contact Form Section
- **Status:** Required
- **Format:** Full-width form section
- **Layout:** Left side form, right side info (desktop), stacked (mobile)

#### Form Fields:
- **Name** (text input, required)
- **Email** (email input, required)
- **Phone** (phone input, optional)
- **Inquiry Type** (dropdown/select, required)
  - Options: General Inquiry, Program Question, Training Registration, Partnership, Donation, Volunteer, Media, Other
- **Subject** (text input, required)
- **Message** (textarea, required)
  - Placeholder: "Tell us how we can help..."
  - Min 20 characters, max 5000 characters
- **Preferred Contact Method** (radio buttons)
  - Email, Phone, No preference
- **Newsletter Opt-in** (checkbox, optional)
  - "Yes, I'd like to receive updates about VEFS programs and events"
- **reCAPTCHA** (anti-spam verification)
- **Submit Button:** "Send Message" (golden/amber, large)
- **Reset Button:** "Clear Form" (secondary style)

#### Form Design:
- Clean, spacious layout (not cramped)
- Clear labels and helpful placeholder text
- Form validation messages
- Success message after submission
- Optional: Progress indicator for multi-step form
- Responsive: Stack inputs on mobile

**Form Submission:**
- Send email to admin/contact email
- Save to database if available
- Send confirmation email to user
- Redirect to thank you page or show success message

#### Info Section (Right side, desktop):
- **Heading:** "Why Contact VEFS?"
- **Bullet points:**
  - Learn about our programs and opportunities
  - Ask questions about events and trainings
  - Explore partnership or collaboration opportunities
  - Arrange workshops for your organization
  - Report issues or provide feedback
  - Inquire about other matters
- **Response Time:** "We typically respond within 2-3 business days"

---

### 4. Department-Specific Contacts (Optional)
- **Status:** Optional
- **Format:** Expandable sections or separate cards
- **Content:**
  - **Programs Coordinator:** [name, email, phone, focus]
  - **Trainings Coordinator:** [name, email, phone, focus]
  - **Events Coordinator:** [name, email, phone, focus]
  - **Partnerships Manager:** [name, email, phone, focus]
  - **Communications Lead:** [name, email, phone, focus]
- **Design Notes:**
  - Use if organization is large enough
  - Helps route inquiries efficiently
  - Optional: Expandable cards

---

### 5. Embedded Map
- **Status:** Required
- **Format:** Embedded Google Map
- **Content:**
  - Location pin on VEFS office
  - Address label
  - Clickable to open in Google Maps
  - Optional: "Get Directions" button
- **Design Notes:**
  - Responsive map sizing
  - Zoom appropriate for office location
  - Interactive and functional

---

### 6. Office Hours
- **Status:** Required
- **Format:** Simple table or list
- **Content:**
  - Monday - Friday: [hours]
  - Saturday: [hours or closed]
  - Sunday: [hours or closed]
  - Holidays: [note if applicable]
- **Design Notes:**
  - Clear, scannable format
  - Icon for each day

---

### 7. FAQ - Contact-Related
- **Status:** Optional
- **Format:** Accordion expandable Q&A
- **Typical Questions:**
  - How quickly will I hear back?
  - What's the best way to contact VEFS?
  - Can I request a specific person?
  - Are there different contacts for different inquiries?
  - What if I have an urgent matter?
  - Can I visit without an appointment?
  - Are video calls available?
  - How do I report a problem or provide feedback?

---

### 8. Call-to-Action Section
- **Status:** Optional
- **Format:** Banner or card section
- **Content:**
  - Heading: "Not Sure What to Ask?"
  - Options:
    - Browse our FAQ
    - Explore our Programs
    - Check Upcoming Events
    - Learn About Trainings
- **Design Notes:**
  - Helpful guidance for uncertain visitors

---

### 9. Footer
- **Status:** Required (Standard footer)
- **Content:** Same as other pages

---

## Content Organization & Flow

**Page Structure (top to bottom):**
1. Page header
2. Quick contact info cards (4 methods)
3. Contact form section (with side info)
4. Optional: Department-specific contacts
5. Embedded map of office location
6. Office hours
7. Optional: FAQ
8. Optional: CTA Section
9. Footer

---

## Design & Visual Approach

### Color Usage
- **Headers:** Sage green (#6B8E23)
- **Icons:** Sage green
- **Form inputs:** White background, sage green focus outline
- **Submit button:** Golden/amber (#FBBF24)
- **Card backgrounds:** White or light gray

### Layout
- **Max content width:** 1200px
- **Contact cards:** 4 columns grid (responsive)
- **Form + Info:** 2-column layout (stacked on mobile)
- **Section padding:** 64px vertical (desktop), 32px (mobile)

### Typography
- **Headers:** Serif, sage green
- **Card titles (H4):** Sans-serif, 20px
- **Form labels:** Sans-serif, 14px, bold
- **Body text:** Sans-serif, 16px

---

## Responsive Design

### Desktop (1024px+)
- Contact cards in 4-column grid
- Form + info side-by-side
- Embedded map responsive
- Full-size inputs

### Tablet (768px - 1023px)
- Contact cards in 2-column grid
- Form + info stacked
- Adjusted spacing

### Mobile (< 768px)
- Contact cards in 1-column stack
- Full-width form
- Full-width map
- Touch-friendly input sizes

---

## Accessibility

- **Form labels:** Associated with inputs (for attribute)
- **Form validation:** Clear error messages
- **Keyboard navigation:** Tab through all form fields
- **Focus indicators:** Clear, visible focus outlines
- **Color contrast:** WCAG AA compliant
- **reCAPTCHA:** Accessible verification
- **Map:** Keyboard navigable, labeled

---

## SEO Considerations

- **Page title:** "Contact Us | VEFS"
- **Meta description:** Contact information and inquiry form
- **Keywords:** Contact, inquiry, reach out, support
- **H1 tag:** Main heading
- **Structured data:** ContactPoint schema with address, phone, email

---

## Content to Provide

- [ ] General inquiry email address
- [ ] Office phone number
- [ ] Office address (full, with postal code)
- [ ] Office hours
- [ ] Department contacts (if applicable)
- [ ] Names and titles of key team members
- [ ] Response time commitment
- [ ] Social media links
- [ ] Map location (latitude/longitude for Google Maps embed)
- [ ] Any special contact procedures
- [ ] Holiday closure dates

---

**Document Version:** 1.0
**Last Updated:** 2025-12-23
