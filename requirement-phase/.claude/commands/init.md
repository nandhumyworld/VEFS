# Command: /init

Initialize a new website requirements documentation project.

## Purpose

Create the complete folder structure, initialize tracking files, and begin high-level requirement gathering.

## When to Use

- User wants to start documenting a new website
- User says "plan my website", "start requirements gathering", etc.
- User explicitly types `/init`

## Prerequisites

None - this is the starting command for all projects.

## Execution Steps

### Step 1: Gather Project Basics

Ask the user:
```
Let's document your website requirements! First, a few quick questions:

1. What is the project name?
2. Brief description (1-2 sentences about the website's purpose)?
```

### Step 2: Create Folder Structure

Create the following directory structure in the user's working directory:

```
[project-name]-requirements/
├── PROGRESS.md
├── project-overview.md
├── pages/
├── components/
├── content/
├── styles/
├── data-schemas/
├── functionality/
├── technical-requirements/
└── integrations/
```

### Step 3: Initialize PROGRESS.md

Create PROGRESS.md with:

```markdown
# Requirements Gathering Progress

**Project:** [Project Name]
**Created:** [Current Date and Time]
**Last Updated:** [Current Date and Time]
**Current Phase:** Initial Scoping

## Completed Sections ✓
[None yet]

## In Progress 🔄
- Project scoping and planning

## Pending ⏳
[To be determined after scoping]

## Next Steps
1. Complete high-level scoping questions
2. Identify priority pages
3. Begin detailed page documentation

## Session Log

### Session 1 - [Current Date and Time]
- Project initialized
- Folder structure created
- Beginning scoping phase
```

### Step 4: Initialize project-overview.md

Load the complete checklist from `references/requirements-checklist.md` and create project-overview.md:

```markdown
# [Project Name] - Requirements Overview

**Description:** [User's brief description]
**Created:** [Date]
**Status:** In Progress

## Project Scope

Below is a comprehensive checklist of all possible website components. Items marked `[x]` are in scope for this project, `[ ]` are out of scope.

[Insert complete checklist from references/requirements-checklist.md with all items as [ ]]

## Documentation Index

[Will be populated as documentation is created]

## Quick Links
- [Progress Tracking](PROGRESS.md)
```

### Step 5: Begin High-Level Scoping

Ask the following questions in a conversational flow (don't overwhelm with all at once):

**Essential Questions:**
1. "How many pages will your website have?"
2. "What are those pages? (e.g., Home, About, Contact, Services, Blog)"
3. "Which pages are most important to document first?"
4. "Will your website need dynamic content that updates regularly? (e.g., blog posts, events, products, news)"
5. "Do you have existing brand guidelines or design preferences?"

**Functionality Questions:**
6. "What key functionality should the website have?"
   - Contact forms
   - Search
   - User accounts/login
   - E-commerce/shopping
   - Newsletter signup
   - Social media integration
   - Analytics
   - Other

**Technical Questions:**
7. "Are there any specific technical requirements?"
   - Mobile-first design
   - Specific accessibility standards (WCAG)
   - Performance targets
   - SEO priorities
   - Browser support needs

**Integration Questions:**
8. "Will the website need to integrate with any third-party services?"
   - Payment processors
   - Email marketing
   - CRM systems
   - Analytics platforms
   - Social media
   - Maps
   - Other APIs

### Step 6: Update project-overview.md Checklist

Based on user answers:
- Mark relevant checklist items as `[x]`
- Mark clearly irrelevant items as `[ ]`
- Leave uncertain items as `[ ]` for later decision

### Step 7: Create Prioritized Plan

Update PROGRESS.md with prioritized next steps:

```markdown
## Pending ⏳

### High Priority
- [ ] [Most important page from user's answer]
- [ ] [Second most important page]
- [ ] Design System (colors, typography, spacing)

### Medium Priority
- [ ] [Other pages]
- [ ] [Key components]
- [ ] [Dynamic content schemas]

### Lower Priority
- [ ] Technical requirements documentation
- [ ] Integration specifications
- [ ] Final validation
```

### Step 8: Begin First Priority

Automatically transition to documenting the first priority item (typically the homepage).

Say to user:
```
Great! I've set up your project structure. Let's start with [first priority item].

[Begin asking detailed questions about that item]
```

For a page, see `references/gathering-strategies.md` for question patterns.

## Success Criteria

- ✅ Folder structure created
- ✅ PROGRESS.md initialized with session log
- ✅ project-overview.md created with full checklist
- ✅ Checklist items marked based on user responses
- ✅ Prioritized plan established
- ✅ First documentation section started

## Next Command

Typically transitions naturally to gathering requirements for the first priority item. User can also:
- Use `/continue` if they want to pause
- Use `/status` to review what was set up
- Use `/update [section]` to modify initial decisions

## Error Handling

**If project already exists:**
- Warn user: "A project with this name already exists. Would you like to: 1) Use a different name, 2) Continue the existing project, 3) Archive the old and start fresh?"

**If user is unsure about scope:**
- Say: "No problem! I'll mark those items as 'to be determined' and we can decide later. Let's focus on what you're certain about first."

## Notes

- Be conversational, not overwhelming
- Ask 2-3 questions at a time, not all at once
- Show enthusiasm and support
- Explain that things can be changed later with `/update`
- Emphasize that the checklist helps ensure nothing is forgotten, but doesn't mean everything must be included
