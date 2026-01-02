# Command: /export

Package all documentation for handoff to developers or AI builders.

## Purpose

Create a clean, well-organized handoff package with a comprehensive README that explains the documentation structure and how to use it.

## When to Use

- After successful finalization
- When ready to share with development team
- Before starting implementation
- For project archival

## Prerequisites

- Project should be finalized (run `/finalize` first)
- All critical issues should be resolved
- Documentation should be complete

## Execution Steps

### Step 1: Check Readiness

Verify project is ready for export:

```
Preparing to export...

Checking readiness:
✅ Project finalized: [Yes/No]
✅ Validation passed: [Yes/No]
⚠️ Outstanding issues: [X]

[If not finalized:]
⚠️ Project hasn't been finalized yet.

Recommend running /finalize first for quality check.

Export anyway? (yes/no)
```

If user proceeds:

### Step 2: Create HANDOFF-README.md

Generate comprehensive handoff documentation in project root:

```markdown
# [Project Name] - Website Requirements Documentation

**Version:** 1.0
**Exported:** [Date and Time]
**Status:** [Ready for Development / Ready for AI Building]
**Total Files:** [X]

## 📋 Project Overview

[Brief project description from project-overview.md]

**Scope:**
- [X] pages documented
- [X] reusable components defined
- [X] data schemas specified
- Complete design system
- Technical requirements
- Integration specifications

## 📁 Documentation Structure

```
[project-name]-requirements/
├── HANDOFF-README.md          ← You are here
├── PROGRESS.md                ← Project timeline and status
├── project-overview.md        ← Master index and checklist
│
├── pages/                     ← Page specifications
│   ├── homepage.md           ← Homepage requirements
│   ├── about.md              ← About page requirements
│   └── ...                   ← Additional pages
│
├── components/                ← Reusable component definitions
│   ├── navigation.md         ← Site navigation specs
│   ├── hero-section.md       ← Hero component specs
│   └── ...                   ← Additional components
│
├── content/                   ← Content specifications
│   ├── copy.md               ← Text content
│   └── media.md              ← Images, videos, assets
│
├── styles/                    ← Design system
│   └── design-system.md      ← Colors, fonts, spacing, effects
│
├── data-schemas/              ← Dynamic content structures
│   ├── events-schema.md      ← Event data structure
│   └── ...                   ← Additional schemas
│
├── functionality/             ← Interactive behaviors
│   ├── animations.md         ← Animation specifications
│   ├── form-validation.md    ← Form validation rules
│   └── ...                   ← Additional functionality
│
├── technical-requirements/    ← Technical specifications
│   ├── performance.md        ← Performance targets
│   ├── seo.md                ← SEO requirements
│   ├── accessibility.md      ← Accessibility standards
│   └── ...                   ← Additional requirements
│
└── integrations/              ← Third-party services
    ├── analytics.md          ← Analytics setup
    ├── payment-gateway.md    ← Payment integration
    └── ...                   ← Additional integrations
```

## 🚀 Quick Start

### For Developers

1. **Start with** `project-overview.md` for project scope
2. **Review** `styles/design-system.md` for visual standards
3. **Build pages** using specs in `pages/` folder
4. **Implement components** from `components/` folder
5. **Reference** technical requirements and integrations as needed

### For AI Builders (Claude, etc.)

1. **Provide complete context:** Share all markdown files
2. **Start with high priority:** Begin with `pages/homepage.md`
3. **Reference design system:** Always check `styles/design-system.md`
4. **Follow cross-links:** Documentation is interconnected
5. **Validate output:** Compare built components against specs

## 📖 How to Read the Documentation

### Page Documents

Each page document contains:
- **Overview:** Purpose and target audience
- **Content Sections:** Detailed section specifications
- **Components Used:** Links to reusable components
- **SEO Requirements:** Meta tags and optimization
- **Responsive Behavior:** Mobile/tablet/desktop specs

**Example Structure:**
```markdown
# [Page Name]
## Overview
## Content Sections
### Hero Section
### Features Section
## Navigation
## SEO Requirements
## Responsive Behavior
## Related Pages
## Status
```

### Component Documents

Each component document contains:
- **Visual Design:** Layout, colors, typography, spacing
- **Interactive Behavior:** Hover states, animations, transitions
- **Content Structure:** Static and dynamic content
- **Responsive Behavior:** Breakpoint specifications
- **Usage Guidelines:** Where and how to use

**Look for:**
- Color codes (e.g., #3B82F6)
- Exact measurements (e.g., 48px, 2rem)
- Animation durations (e.g., 300ms)
- Specific font families and sizes
- Detailed state descriptions

### Data Schemas

Each schema document contains:
- **Field Definitions:** Name, type, required/optional
- **Validation Rules:** Format requirements, constraints
- **Example Entries:** Sample data
- **Relationships:** Links to other data types
- **Usage Context:** Where this data is displayed

## 🎨 Design System

**Complete specifications in:** `styles/design-system.md`

### Quick Reference

**Colors:**
- Primary: [Color name] (#hexcode)
- Secondary: [Color name] (#hexcode)
- [Additional colors...]

**Typography:**
- Headings: [Font family]
- Body: [Font family]
- [Font sizes and weights...]

**Spacing Scale:**
- [Scale values...]

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

*See design-system.md for complete specifications*

## ⚙️ Technical Requirements

### Performance
[Key performance targets from technical-requirements/performance.md]

### SEO
[Key SEO requirements from technical-requirements/seo.md]

### Accessibility
[Accessibility standards from technical-requirements/accessibility.md]

### Browser Support
[Browser compatibility requirements]

*See technical-requirements/ folder for detailed specifications*

## 🔗 Integrations

[List key integrations with links to their documentation]

- **[Integration Name]:** [Brief description] - See `integrations/[name].md`
- **[Integration Name]:** [Brief description] - See `integrations/[name].md`

## 📊 Data & Content

### Dynamic Content

[List all data schemas]

- **[Schema Name]:** [Brief description] - See `data-schemas/[name].md`
  - Fields: [X]
  - Usage: [Where displayed]

### Static Content

- Copy: See `content/copy.md`
- Media: See `content/media.md`

## ✅ Validation Status

**Last Validated:** [Date from PROGRESS.md]
**Status:** [PASSED / PASSED WITH NOTES]

**Quality Metrics:**
- Completeness: [X]%
- Specificity: [X]%
- Consistency: [X]%

[If issues exist:]
**Known Gaps:**
- [Item] - [Status/Note]
- [Item] - [Status/Note]

## 🗺️ Development Roadmap

### Phase 1: Foundation
1. Set up design system
2. Implement core components
3. Build page templates

### Phase 2: Pages
1. [Priority 1 page]
2. [Priority 2 page]
3. [Priority 3 page]

### Phase 3: Functionality
1. [Key functionality]
2. [Key functionality]
3. [Key functionality]

### Phase 4: Integration
1. [Integration 1]
2. [Integration 2]
3. [Integration 3]

### Phase 5: Polish
1. Performance optimization
2. SEO implementation
3. Accessibility audit
4. Testing and QA

*Phases can be adjusted based on development approach*

## 📝 Important Notes

### Using This Documentation

- **All links are relative:** Documentation uses relative paths for cross-references
- **Status indicators:** Look for ✅ (complete), 🔄 (in progress), ⏳ (not started)
- **TODO markers:** Any remaining TODOs are explicitly marked
- **Examples provided:** Look for example sections in schemas and components

### File Format

- All files are standard **Markdown (.md)**
- Can be viewed in any text editor
- Renders nicely in GitHub, GitLab, etc.
- Easy to edit and update

### Updating Documentation

- These requirements can evolve
- Update files as decisions change
- Maintain cross-references
- Document changes in PROGRESS.md

## 🤝 Collaboration

### With Developers

**Recommended workflow:**
1. Developer reads page/component spec
2. Implements according to requirements
3. Refers back to design system for details
4. Cross-checks with technical requirements
5. Reviews with stakeholders

### With AI Builders

**Recommended workflow:**
1. Provide complete context (all markdown files)
2. Start with one page or component
3. AI builds following exact specifications
4. Review output against documentation
5. Iterate and refine

## 📞 Questions or Issues?

If you encounter:
- **Missing information:** Check related sections via cross-links
- **Unclear requirements:** Flag for clarification with team
- **Contradictions:** Refer to most recent date in file
- **TODOs:** These are placeholders for future decisions

## 📚 Additional Resources

- **PROGRESS.md:** Complete project timeline and session history
- **project-overview.md:** Full checklist and documentation index

## 🎉 Ready to Build!

This documentation package contains everything needed to build [Project Name].

**Key strengths:**
- Comprehensive coverage of all aspects
- Detailed, specific requirements
- Interconnected with cross-references
- Validated for consistency
- Ready for implementation

**Success criteria:** [From finalization]
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

---

**Documentation created using:** Website Requirements Architect
**Exported:** [Date and Time]
**Version:** 1.0

Happy building! 🚀
```

### Step 3: Create Quick Reference Card

Create QUICK-REFERENCE.md for fast lookups:

```markdown
# Quick Reference Card

## 🎨 Design Tokens

### Colors
```
Primary: #hexcode
Secondary: #hexcode
[Key colors...]
```

### Typography
```
H1: [font-family], [size], [weight]
H2: [font-family], [size], [weight]
Body: [font-family], [size], [weight]
```

### Spacing
```
xs: [value]
sm: [value]
md: [value]
lg: [value]
xl: [value]
```

### Breakpoints
```
mobile: < 768px
tablet: 768px - 1024px
desktop: > 1024px
```

## 📄 Pages

[List all pages with links]

## 🧩 Components

[List all components with links]

## 📊 Data Schemas

[List all schemas with links]

## ⚡ Key Functionality

[List key features]

## 🔗 Integrations

[List integrations]

---

*Full documentation in HANDOFF-README.md*
```

### Step 4: Verify Package Completeness

Check that package includes:
- ✅ All documentation files
- ✅ HANDOFF-README.md
- ✅ QUICK-REFERENCE.md
- ✅ PROGRESS.md (history)
- ✅ project-overview.md (index)
- ✅ No broken links
- ✅ All referenced files exist

### Step 5: Create File Listing

Generate FILE-INDEX.txt:

```
# Complete File Index
# [Project Name] Requirements Documentation
# Exported: [Date]

./HANDOFF-README.md
./QUICK-REFERENCE.md
./FILE-INDEX.txt
./PROGRESS.md
./project-overview.md

./pages/
  - homepage.md
  - about.md
  [List all files...]

./components/
  - navigation.md
  - hero-section.md
  [List all files...]

[Continue for all folders...]

Total files: [X]
Total size: [Size]
```

### Step 6: Update PROGRESS.md

Add export record:

```markdown
## Project Status: EXPORTED ✅

**Exported:** [Date and Time]
**Package Version:** 1.0
**Export Status:** Complete

### Export Contents
- Documentation files: [X]
- HANDOFF-README.md: Created
- QUICK-REFERENCE.md: Created
- FILE-INDEX.txt: Created
- Package verified: ✅

### Session Log

#### Session [N] - [Date and Time]
- Exported complete documentation package
- Created handoff materials
- Verified package completeness
- Project ready for implementation
```

### Step 7: Present to User

```markdown
# ✅ Export Complete!

## Package Contents

📦 **[Project Name] Requirements Package**

**Includes:**
- ✅ [X] documentation files
- ✅ HANDOFF-README.md (comprehensive guide)
- ✅ QUICK-REFERENCE.md (fast lookup)
- ✅ FILE-INDEX.txt (complete file list)
- ✅ All validated and ready

**Location:** `[project-name]-requirements/`

## 📚 Handoff Materials

### Main Documents
- **HANDOFF-README.md** - Start here! Comprehensive guide for developers/AI builders
- **QUICK-REFERENCE.md** - Fast access to key info
- **project-overview.md** - Complete project scope and index
- **PROGRESS.md** - Project history and timeline

### Documentation Folders
- `pages/` - [X] page specifications
- `components/` - [X] component definitions
- `styles/` - Complete design system
- `data-schemas/` - [X] data structures
- `functionality/` - Interactive specifications
- `technical-requirements/` - Performance, SEO, accessibility
- `integrations/` - Third-party service specs

## 🚀 Next Steps

### For Human Developers
1. Read HANDOFF-README.md
2. Review design system
3. Build according to specifications
4. Cross-reference as needed

### For AI Builders
1. Provide all markdown files as context
2. Start with priority pages
3. Reference design system for all styling
4. Follow cross-links between documents

## 📋 Package Statistics

- Total pages: [X]
- Total components: [X]
- Total data schemas: [X]
- Total documentation files: [X]
- Validation status: ✅ PASSED
- Quality score: [X]%

---

**Your requirements package is ready!**

The documentation is complete, validated, and ready for implementation.

Would you like me to:
1. Create a summary document
2. Generate a PDF version
3. Help you get started with implementation
4. Archive this project and start a new one
```

## Success Criteria

- ✅ HANDOFF-README.md created
- ✅ QUICK-REFERENCE.md created
- ✅ FILE-INDEX.txt created
- ✅ All files verified present
- ✅ No broken links in package
- ✅ PROGRESS.md updated with export
- ✅ Clear handoff instructions provided

## Package Quality Checklist

Before marking export complete:

- [ ] HANDOFF-README.md is comprehensive
- [ ] Quick reference includes all key info
- [ ] File index is complete and accurate
- [ ] All documentation files are included
- [ ] No temporary or draft files included
- [ ] Cross-references work correctly
- [ ] Export is properly dated and versioned

## Notes

- Always recommend `/finalize` before `/export`
- Package should be self-contained and comprehensive
- HANDOFF-README.md is critical - make it excellent
- Include both high-level and detailed reference
- Make it easy for developers to navigate
- Optimize for both human and AI consumption
- Can export multiple times with version numbers
- Archive exports for reference
