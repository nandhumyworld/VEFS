# Requirement Gathering Strategies

This reference provides question patterns and progressive disclosure techniques for gathering different types of requirements.

## Core Principles

### 1. Start Broad, Then Narrow
- Begin with high-level goals
- Drill down into specifics
- Build from general to particular

### 2. Ask 2-3 Questions at a Time
- Don't overwhelm the user
- Allow conversation to flow naturally
- Build on previous answers

### 3. Provide Examples
- Help users visualize options
- Offer concrete choices when users seem uncertain
- Use "For example..." frequently

### 4. Accept Ambiguity Early
- Mark TODOs for details to be decided later
- Use "To be determined" when appropriate
- Come back to unresolved items in validation

### 5. Build on What's Known
- Reference previously documented elements
- Create connections: "Like the [component] we defined earlier?"
- Maintain consistency across requirements

## Question Patterns by Type

### For Pages

#### Initial Questions (Broad)
1. "What is the primary purpose of this page?"
2. "Who is the target audience?"
3. "What action do you want users to take on this page?"

#### Content Structure Questions
4. "How should the page be organized? What main sections?"
   - Provide examples: "For example: Hero section, features, testimonials, call-to-action"
5. "What's the most important message on this page?"
6. "What supporting information is needed?"

#### Specific Section Questions
For each section:
7. "What content goes in the [section name]?"
   - Heading text
   - Body copy
   - Images/media
   - Call-to-action buttons

8. "How should this section look visually?"
   - Layout (centered, split, grid)
   - Background (color, image, video)
   - Size/prominence

#### Navigation Questions
9. "Should this page have the standard navigation, or something different?"
10. "Any breadcrumbs or secondary navigation needed?"

#### Technical Questions
11. "What's the URL for this page?" (slug)
12. "What's the page title for SEO?"
13. "Brief meta description for search engines?"

#### Responsive Questions
14. "Any specific mobile layout changes needed?"
15. "Should content order change on smaller screens?"

### For Components

#### Purpose Questions (Broad)
1. "What is this component for?"
2. "Where will it be used?" (which pages)
3. "Is it similar to any existing components?"

#### Visual Design Questions
4. "How should it look?"
   - Layout/structure
   - Size
   - Colors from design system
   - Typography

5. "What spacing should it have?"
   - Internal padding
   - External margins
   - Gap between elements

6. "Any borders, shadows, or special effects?"
   - Border radius
   - Box shadows
   - Gradients
   - Opacity

#### Content Questions
7. "What content does this component display?"
   - Static text/labels
   - Dynamic data fields
   - Images or icons
   - Links or buttons

8. "Is the content static or dynamic?"
   - If dynamic: link to data schema

#### Interaction Questions
9. "How should it behave when users interact?"
   - Hover effects
   - Click actions
   - Active states
   - Disabled states

10. "Are there any animations?"
    - Entry animations
    - Transitions
    - Durations and easing

#### Responsive Questions
11. "How should it adapt to different screen sizes?"
    - Mobile layout
    - Tablet adjustments
    - Desktop full version

#### Usage Questions
12. "Are there different variations needed?"
    - Different sizes (small, medium, large)
    - Different styles (outlined, filled)
    - Different colors (primary, secondary)

### For Design System

#### Color Questions
1. "Do you have existing brand colors, or should we define new ones?"

2. "What feeling should the colors convey?"
   - Professional, playful, bold, subtle, etc.
   - If descriptive words: suggest specific hex codes

3. "Primary color for main actions and branding?"
   - Get hex code or description
   - Suggest variations (light, dark)

4. "Secondary color for supporting elements?"

5. "Accent colors for calls-to-action, highlights?"

6. "Neutral colors?"
   - Background colors
   - Text colors (dark, medium, light)
   - Border colors

7. "Semantic colors?"
   - Success/error/warning colors
   - Info color

#### Typography Questions
8. "Font personality preference?"
   - Modern, classic, playful, serious, technical
   - Suggest font families based on description

9. "Separate fonts for headings vs. body text?"
   - Often yes: serif for headings, sans-serif for body
   - Or all same family

10. "Font sizes - should we use a scale?"
    - Suggest: h1 larger, h2 smaller, body text, small text
    - Or get specific sizes

11. "Font weights needed?"
    - Light (300), Regular (400), Medium (500), Bold (700)

#### Spacing Questions
12. "Tight, comfortable, or spacious layout?"
    - Affects overall spacing scale

13. "Should we use a consistent spacing scale?"
    - Suggest: 4px base (4, 8, 12, 16, 24, 32, 48, 64)
    - Or rem-based

#### Layout Questions
14. "Maximum content width?"
    - Standard: 1200px or 1440px
    - Full width or contained?

15. "Responsive breakpoints?"
    - Standard: Mobile < 768px, Tablet 768-1024px, Desktop > 1024px
    - Any custom needs?

16. "Grid system?"
    - 12-column grid typical
    - Or flexbox/CSS grid approach

### For Data Schemas

#### High-Level Questions
1. "What type of data is this?" (events, products, blog posts, etc.)
2. "Where will this data be displayed?" (link to pages/components)
3. "How often will it update?" (static, daily, real-time, user-generated)

#### Field Definition Questions
For each field:
4. "What information do you need to capture?"
   - List out fields

5. For each field:
   - "What type of data?" (text, number, date, boolean, array, object)
   - "Is it required or optional?"
   - "Any character limits?"
   - "Any validation rules?" (email format, URL format, min/max values)
   - "Any default values?"

#### Example Questions
6. "Can you give me an example entry?"
   - Helps clarify structure
   - Use as template in documentation

#### Relationship Questions
7. "Does this relate to other data types?"
   - Products relate to categories
   - Blog posts relate to authors
   - Events relate to locations

#### Management Questions
8. "Who can add/edit this data?"
   - Admin only
   - Registered users
   - Automated from API

9. "How will it be managed?"
   - CMS interface
   - Manual JSON files
   - API integration

### For Functionality

#### Behavior Questions
1. "What happens when [user action]?"
2. "What feedback does the user see?"
3. "Are there any animations or transitions?"

#### Form Functionality Questions
4. "What fields are required?"
5. "What validation rules?"
   - Email format
   - Password requirements
   - Field lengths
   - Pattern matching

6. "What error messages should display?"
   - Be specific: "Please enter a valid email address"
   - Not generic: "Error"

7. "What happens on successful submission?"
   - Confirmation message
   - Redirect to another page
   - Email sent

#### Search/Filter Questions
8. "What can users search by?"
9. "What filters are available?"
10. "How should results be sorted?"
    - Default sort order
    - User-selectable options

11. "Pagination or infinite scroll?"

#### Animation Questions
12. "What should animate?"
    - On page load
    - On scroll into view
    - On user interaction

13. "How long should animations take?"
    - Fast: 150-200ms
    - Normal: 300-400ms
    - Slow: 500-800ms

14. "What easing/timing function?"
    - Linear, ease, ease-in-out, custom

### For Technical Requirements

#### Performance Questions
1. "Any page load speed targets?"
   - Under 3 seconds typical
   - Specific requirements?

2. "Image optimization strategy?"
   - Lazy loading
   - WebP format
   - Responsive images

3. "Any caching requirements?"

#### SEO Questions
4. "Priority pages for SEO?"
5. "Target keywords?"
6. "Meta description strategy?"
7. "Need structured data (schema markup)?"
8. "XML sitemap needed?"

#### Accessibility Questions
9. "What WCAG level to target?"
   - Level A (basic)
   - Level AA (standard - recommended)
   - Level AAA (highest)

10. "Keyboard navigation requirements?"
11. "Screen reader considerations?"
12. "Color contrast ratios?"

#### Browser/Device Support
13. "Which browsers must be supported?"
    - Chrome, Firefox, Safari, Edge (modern browsers)
    - Any legacy browser support? (IE11, etc.)

14. "Device support?"
    - Desktop, tablet, mobile
    - Specific devices to test?

15. "Minimum supported screen size?"

### For Integrations

#### Service Identification
1. "What third-party service?" (Google Analytics, Stripe, Mailchimp, etc.)
2. "What's it used for?"
3. "Already have an account/API keys?"

#### Integration Details
4. "What data needs to be exchanged?"
5. "Real-time or batch?"
6. "Authentication method?"
   - API keys
   - OAuth
   - JWT

#### Configuration Questions
7. "Any specific configuration needed?"
   - Tracking IDs
   - Webhook URLs
   - Custom parameters

8. "Error handling?"
   - What if service is down?
   - Fallback behavior?

9. "Privacy/compliance considerations?"
   - GDPR requirements
   - Cookie consent needed
   - Data retention policies

## Progressive Disclosure Techniques

### Technique 1: Offer Defaults with Option to Customize

Instead of asking everything:
```
"I'll use a standard contact form with Name, Email, Message fields. 
 Would you like to customize this or is standard fine?"
```

### Technique 2: Build on Examples

Show, don't just ask:
```
"For your hero section, here are some common patterns:
 A) Large centered text with background image
 B) Split layout - image left, content right  
 C) Full-width video with text overlay
 
 Which feels right, or something different?"
```

### Technique 3: Reference Existing Elements

Create consistency:
```
"Should this button use the primary color we defined earlier (#3B82F6),
 or a different color?"
```

### Technique 4: Ask Permission to Use Placeholders

When user is unsure:
```
"I can mark this as 'To be determined' and we can come back to it.
 Or we can decide now. What would you prefer?"
```

### Technique 5: Summarize Before Diving Deeper

After broad questions:
```
"So you want:
 - 5 pages (Home, About, Services, Portfolio, Contact)
 - Focus on mobile-first design
 - Clean, professional aesthetic
 
 Great! Let's start with the homepage. What's the main goal?"
```

## Handling Different User Types

### Detail-Oriented User
- Wants to specify everything precisely
- **Approach:** Ask thorough questions, accept detailed answers
- **Pace:** Can cover more ground per session
- **Documentation:** Will be very complete

### High-Level User
- Prefers broad strokes, decisions on specifics later
- **Approach:** Offer defaults, mark TODOs liberally
- **Pace:** Move quickly through sections
- **Documentation:** May need refinement during /finalize

### Visual Thinker
- Better with examples and visual descriptions
- **Approach:** Use lots of examples, describe visually
- **Questions:** "Picture this...", "Imagine..."
- **Documentation:** Include visual descriptions

### Uncertain User
- Needs guidance and suggestions
- **Approach:** Provide options, explain trade-offs
- **Questions:** Multiple choice format
- **Documentation:** Mark decisions as "recommended" vs. "required"

## Common Scenarios

### Scenario: User Gives Vague Description

**User says:** "I want it to look modern"

**Response:**
```
"Modern design" can mean different things! Let me get specific:

For layout:
- Clean with lots of white space?
- Minimalist with few elements?
- Bold with strong typography?

For colors:
- Neutral (blacks, whites, grays)?
- Vibrant accent colors?
- Gradients?

For feel:
- Corporate/professional?
- Tech/cutting-edge?
- Creative/artistic?

What resonates with you?
```

### Scenario: User Unsure About Technical Details

**User says:** "I don't know about breakpoints"

**Response:**
```
No problem! I'll use standard responsive breakpoints:
- Mobile: screens under 768px
- Tablet: 768px to 1024px  
- Desktop: above 1024px

This covers about 99% of devices. We can adjust if needed later.

Sound good?
```

### Scenario: User Has Partial Information

**User says:** "I want a contact form but not sure what fields"

**Response:**
```
Let's start with the essentials:
- Name ✓
- Email ✓
- Message ✓

Common additions:
- Phone number?
- Company/organization?
- Subject/category dropdown?
- How did you hear about us?

Which of these would be useful?
```

### Scenario: Requirements Conflict

**User says:** "I want it minimalist but with lots of features"

**Response:**
```
I hear you want both simplicity and functionality. Let's balance this:

Approach options:
1. **Progressive disclosure:** Clean interface, features hidden until needed
2. **Tabbed sections:** Organize features into categories
3. **Minimal by default:** Core features visible, advanced features in menu

Which approach feels right?
```

## Documentation Quality Tips

### During Gathering

1. **Be specific:** Get actual measurements, not adjectives
   - ❌ "Large heading"
   - ✅ "Heading: 48px, bold, dark gray (#1F2937)"

2. **Get examples:** Request sample content when possible
   - ❌ "Blog post fields"
   - ✅ "Title: 'How We Improved Load Times', Date: '2024-12-22', Body: '...'"

3. **Clarify ambiguity:** Don't assume
   - ❌ Accept "modern look"
   - ✅ "By modern, do you mean: minimalist, flat design, lots of white space?"

4. **Link as you go:** Create cross-references during gathering
   - "This page will use the [Navigation Component] we defined"

5. **Mark uncertainties:** Explicit TODOs better than gaps
   - "Color: TODO - client to provide brand colors"
   - "Animation duration: TODO - test during development"

### After Gathering

1. **Review for completeness:** Did you get enough detail?
2. **Check consistency:** Do colors/fonts match design system?
3. **Verify links:** Do cross-references work?
4. **Add examples:** Include sample data in schemas
5. **Update status:** Mark as complete or note what's missing

## Session Management

### Starting a Session
- Greet warmly
- Show what's been completed
- Preview what's next
- Ask if ready to continue

### During a Session
- Keep momentum going
- Acknowledge progress: "Great, that's 3 pages done!"
- Ask if user needs a break
- Save frequently to PROGRESS.md

### Ending a Session
- Summarize what was accomplished
- Update PROGRESS.md with session log
- Preview next session's focus
- Thank user for their time

## Quality Indicators

### Good Requirements
- ✅ Specific measurements and values
- ✅ Concrete examples provided
- ✅ Clear acceptance criteria
- ✅ Fully cross-referenced
- ✅ No ambiguous language
- ✅ All options specified

### Need Improvement
- ⚠️ Vague descriptions ("nice", "clean", "modern")
- ⚠️ Missing measurements ("large", "small")
- ⚠️ No examples
- ⚠️ Assumptions about "standard"
- ⚠️ Undefined references
- ⚠️ TODO markers without context

## Remember

- **You're helping the user think through their project**
- **Good questions lead to better requirements**
- **It's okay to not know everything upfront**
- **Documentation can evolve - that's expected**
- **The goal is actionable specifications, not perfection**

These strategies ensure you gather complete, clear, and useful requirements that lead to successful implementation.
