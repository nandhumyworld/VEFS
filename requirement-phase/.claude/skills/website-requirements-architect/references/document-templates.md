# Document Templates

This file contains markdown templates for different types of documentation in the website requirements system. Use these as starting points when creating new files.

## Page Documentation Template

```markdown
# [Page Name]

## Overview
[Brief 1-2 sentence description of the page's purpose and goals]

## Target Audience
[Who is this page for? What are their needs?]

## Content Sections

### [Section 1 Name] (e.g., Hero Section)
**Purpose:** [What this section accomplishes]

**Content:**
- Heading: "[Headline text]"
- Subheading: "[Subheading text]"
- Body text: "[Main content]"
- Call-to-action: "[CTA button text]" → [Links to page/action]

**Visual Elements:**
- Image: [Description/placeholder for image]
- Background: [Color/gradient/image]
- Layout: [Centered/Split/Full-width]

**Component References:**
- Uses: [Hero Component](../components/hero-section.md)

### [Section 2 Name]
[Repeat structure as needed]

## Navigation
- **Header:** [Include/Exclude, style preferences]
- **Footer:** [Include/Exclude, content to show]
- **Breadcrumbs:** [Yes/No]

## SEO Requirements
- **Meta Title:** "[Title for SEO - 60 chars max]"
- **Meta Description:** "[Description for SEO - 160 chars max]"
- **Keywords:** [keyword1, keyword2, keyword3]
- **URL Slug:** /[page-url]

## Responsive Behavior
- **Mobile:** [Any mobile-specific changes]
- **Tablet:** [Any tablet-specific changes]
- **Desktop:** [Desktop layout notes]

## Related Pages
- [Link to related page](path)
- [Link to related page](path)

## Status
- ✅ Complete
- 🔄 In Progress (missing: [what's missing])
- ⏳ Not Started

## Notes
[Any additional context, decisions, or special requirements]
```

## Component Documentation Template

```markdown
# [Component Name]

## Overview
[1-2 sentence description of what this component is and its purpose]

## Visual Design

### Layout
- **Type:** [Card/Section/Container/etc.]
- **Dimensions:** [Width x Height or responsive description]
- **Alignment:** [Left/Center/Right/Justified]
- **Spacing:**
  - Padding: [values]
  - Margin: [values]

### Colors
- **Background:** [Color name] (#hexcode)
- **Text:** [Color name] (#hexcode)
- **Borders:** [Color name] (#hexcode)
- **Accent:** [Color name] (#hexcode)

### Typography
- **Heading:** [Font family, size, weight, color]
- **Body:** [Font family, size, weight, color]
- **Links:** [Font family, size, weight, color]

### Borders & Effects
- **Border Radius:** [value]
- **Border:** [thickness, style, color]
- **Shadow:** [shadow specifications]
- **Other effects:** [gradients, opacity, etc.]

## Content Structure

### Static Content
[List any fixed text, labels, or content that doesn't change]

### Dynamic Content
[List any data that changes or comes from external source]
- Field 1: [description]
- Field 2: [description]

**Data Source:** [Reference to data schema if applicable]
- See: [Data Schema](../data-schemas/[name].md)

## Interactive Behavior

### States
- **Default:** [Description]
- **Hover:** [What changes on hover]
- **Active:** [What changes when clicked/active]
- **Focus:** [Focus state for keyboard navigation]
- **Disabled:** [If applicable]

### Animations
- **On Load:** [Animation description]
- **On Scroll:** [Scroll-triggered animations]
- **On Interaction:** [Click/hover animations]
- **Timing:** [Duration, easing]

### User Actions
- **Primary Action:** [What happens when user clicks/interacts]
- **Secondary Actions:** [Other possible interactions]

## Responsive Behavior

### Mobile (< 768px)
- [Layout changes]
- [Font size adjustments]
- [Spacing changes]
- [Hidden/shown elements]

### Tablet (768px - 1024px)
- [Layout changes]
- [Adjustments from mobile]

### Desktop (> 1024px)
- [Full layout description]

## Variants

### [Variant 1 Name]
- **When to use:** [Context]
- **Differences:** [What's different from default]

### [Variant 2 Name]
- **When to use:** [Context]
- **Differences:** [What's different from default]

## Accessibility

- **Keyboard Navigation:** [Tab order, keyboard shortcuts]
- **ARIA Labels:** [Required aria attributes]
- **Screen Reader:** [How it should be announced]
- **Color Contrast:** [Ratio requirements]

## Usage

### Where Used
- [Homepage](../pages/homepage.md#section-name)
- [About Page](../pages/about.md#section-name)

### Similar Components
- [Related Component](../components/related.md)

## Implementation Notes
[Any technical notes, dependencies, or special considerations]

## Status
- ✅ Complete
- 🔄 In Progress (missing: [what's missing])
- ⏳ Not Started

## Examples
[Optional: Visual description or ASCII art of the component]
```

## Data Schema Documentation Template

```markdown
# [Data Type] Schema

## Overview
[What this data represents and how it's used in the website]

## Data Structure

### Fields

#### [Field Name 1]
- **Type:** [string/number/boolean/date/array/object]
- **Required:** [Yes/No]
- **Format:** [Any specific format requirements]
- **Validation:** [Any validation rules]
- **Max Length:** [If applicable]
- **Default Value:** [If applicable]
- **Description:** [What this field represents]

#### [Field Name 2]
[Repeat structure]

### Relationships
[If this data relates to other data types]
- **Related to:** [Other data schema](../data-schemas/other.md)
- **Relationship:** [One-to-many, many-to-many, etc.]

## Example Entry

```json
{
  "field1": "example value",
  "field2": 123,
  "field3": true,
  "field4": "2024-12-22",
  "field5": ["item1", "item2"],
  "field6": {
    "nested": "value"
  }
}
```

## Usage

### Where Displayed
- [Component/Page that uses this data](../components/[name].md)
- [Another location](path)

### Update Frequency
[How often this data changes: static, daily, real-time, user-generated]

### Data Management
- **Who can edit:** [Admin only / Users / System]
- **Edit method:** [CMS / Manual / API]
- **Storage:** [Database table name or file location]

## API Endpoints (if applicable)

### GET Endpoint
- **URL:** `/api/[endpoint]`
- **Method:** GET
- **Parameters:** [Query parameters]
- **Response:** [Response structure]

### POST Endpoint
- **URL:** `/api/[endpoint]`
- **Method:** POST
- **Body:** [Required fields]
- **Response:** [Response structure]

## Validation Rules

### Required Validations
- [Field]: [Validation rule]
- [Field]: [Validation rule]

### Error Messages
- [Validation failure]: "[Error message to display]"

## Display Formatting

### [Field Name]
- **Display as:** [How to format for display]
- **Example:** [Formatted example]

## Status
- ✅ Complete
- 🔄 In Progress (missing: [what's missing])
- ⏳ Not Started

## Notes
[Any additional context or special handling requirements]
```

## Design System Documentation Template

```markdown
# Design System

## Overview
[Brief description of the overall design approach and philosophy]

## Colors

### Primary Colors
- **Primary:** [Color name] (#hexcode)
  - Use case: [Where/when to use]
  - Contrast ratio: [If measured]
- **Primary Dark:** [Color name] (#hexcode)
  - Use case: [Hover states, darker elements]
- **Primary Light:** [Color name] (#hexcode)
  - Use case: [Backgrounds, lighter elements]

### Secondary Colors
- **Secondary:** [Color name] (#hexcode)
- **Secondary variations:** [list]

### Accent Colors
- **Accent:** [Color name] (#hexcode)
- **Success:** [Color name] (#hexcode)
- **Warning:** [Color name] (#hexcode)
- **Error:** [Color name] (#hexcode)
- **Info:** [Color name] (#hexcode)

### Neutral Colors
- **Background:** [Color name] (#hexcode)
- **Surface:** [Color name] (#hexcode)
- **Text Primary:** [Color name] (#hexcode)
- **Text Secondary:** [Color name] (#hexcode)
- **Border:** [Color name] (#hexcode)
- **Divider:** [Color name] (#hexcode)

### Gray Scale
- **Gray 100:** (#hexcode)
- **Gray 200:** (#hexcode)
- [Continue scale]

## Typography

### Font Families
- **Headings:** [Font family name]
  - Fallback: [System fonts]
  - Weight available: [300, 400, 700]
- **Body:** [Font family name]
  - Fallback: [System fonts]
  - Weight available: [400, 600]
- **Monospace:** [Font family name]
  - Use case: [Code, technical content]

### Font Sizes
- **Display:** [size] (e.g., 64px/4rem)
- **H1:** [size]
- **H2:** [size]
- **H3:** [size]
- **H4:** [size]
- **H5:** [size]
- **H6:** [size]
- **Body Large:** [size]
- **Body:** [size]
- **Body Small:** [size]
- **Caption:** [size]

### Font Weights
- **Light:** 300
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Line Heights
- **Tight:** [value]
- **Normal:** [value]
- **Relaxed:** [value]
- **Loose:** [value]

### Letter Spacing
- **Tight:** [value]
- **Normal:** 0
- **Wide:** [value]

## Spacing

### Spacing Scale
- **xs:** [value] (e.g., 4px/0.25rem)
- **sm:** [value]
- **md:** [value]
- **lg:** [value]
- **xl:** [value]
- **2xl:** [value]
- [Continue scale]

### Common Uses
- **Component padding:** [typical value]
- **Section spacing:** [typical value]
- **Element gaps:** [typical value]

## Layout

### Grid System
- **Columns:** [number] (e.g., 12)
- **Gutter:** [value]
- **Container max-width:** [value]

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px
- **Large Desktop:** > 1440px

### Container Widths
- **Mobile:** 100%
- **Tablet:** [value or %]
- **Desktop:** [value]
- **Max-width:** [value]

## Borders & Effects

### Border Radius
- **None:** 0
- **Small:** [value]
- **Medium:** [value]
- **Large:** [value]
- **Full:** 9999px (pills/circles)

### Borders
- **Thin:** 1px
- **Medium:** 2px
- **Thick:** 4px
- **Default color:** [reference color above]

### Shadows
- **Small:** [CSS shadow value]
- **Medium:** [CSS shadow value]
- **Large:** [CSS shadow value]
- **Extra Large:** [CSS shadow value]

### Other Effects
- **Opacity values:** [common values: 0.1, 0.5, 0.8]
- **Backdrop blur:** [if used]
- **Gradients:** [if used, define common gradients]

## Animations

### Timing Functions
- **Linear:** linear
- **Ease:** ease
- **Ease In:** ease-in
- **Ease Out:** ease-out
- **Ease In Out:** ease-in-out
- **Custom:** [if any custom bezier curves]

### Durations
- **Fast:** [value] (e.g., 150ms)
- **Normal:** [value]
- **Slow:** [value]

### Common Animations
- **Fade In:** [description]
- **Slide In:** [description]
- **Scale:** [description]
- [List common animation patterns]

## Icons

### Icon Set
- **Library:** [e.g., Font Awesome, Material Icons, Custom]
- **Style:** [Solid/Outline/Duotone]
- **Default Size:** [value]

### Common Icons
- **Menu:** [icon name]
- **Close:** [icon name]
- **Search:** [icon name]
- **Arrow:** [icon name]
- [List commonly used icons]

## Status
- ✅ Complete
- 🔄 In Progress (missing: [what's missing])
- ⏳ Not Started

## Design Tokens (Optional)
[If using design tokens/CSS variables, list them here]
```

## Functionality Documentation Template

```markdown
# [Functionality Name]

## Overview
[What this functionality does and why it's needed]

## User Experience

### User Flow
1. [Step 1: User action]
2. [Step 2: System response]
3. [Step 3: Next action]
4. [Continue...]

### Entry Points
- [Where user can trigger this functionality]
- [Alternative entry points]

## Behavior Specifications

### [Action/Feature 1]
- **Trigger:** [What initiates this]
- **Process:** [What happens step-by-step]
- **Result:** [End state]
- **Feedback:** [What user sees/hears]

### Error Handling
- **Error Type 1:** [Description]
  - **Message:** "[User-facing error message]"
  - **Recovery:** [How user can resolve]
- **Error Type 2:** [Repeat]

### Loading States
- **Initial Load:** [What user sees]
- **Loading:** [Loading indicator description]
- **Success:** [Success state]
- **Empty State:** [If no data]

## Validation Rules

### Input Validation
- **[Field name]:**
  - Required: [Yes/No]
  - Format: [Rules]
  - Min/Max: [If applicable]
  - Error message: "[Message text]"

### Business Logic
- [Any business rules or constraints]

## Technical Requirements

### Dependencies
- [Required integrations or services]
- [External APIs]

### Performance
- **Response Time:** [Target: e.g., < 500ms]
- **Throttling:** [If applicable]
- **Caching:** [Strategy]

## Related Components
- [Component that implements this](../components/[name].md)
- [Pages that use this](../pages/[name].md)

## Status
- ✅ Complete
- 🔄 In Progress (missing: [what's missing])
- ⏳ Not Started

## Notes
[Additional context or implementation notes]
```

---

## Usage Instructions

1. **Select the appropriate template** based on what you're documenting
2. **Copy the template** to your new markdown file
3. **Fill in the bracketed placeholders** with actual content
4. **Remove sections** that don't apply (but consider if they might be needed later)
5. **Add sections** if you need additional categories not in the template
6. **Link to related documents** using relative paths
7. **Update status** as work progresses
8. **Keep formatting consistent** across all documentation files

## Template Customization

These templates are starting points. Feel free to:
- Add sections specific to your project needs
- Remove sections that aren't relevant
- Adjust the structure to match your workflow
- Create hybrid templates by combining elements from multiple templates

The goal is clear, comprehensive documentation - not rigid adherence to a template.
