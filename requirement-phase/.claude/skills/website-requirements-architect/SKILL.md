---
name: website-requirements-architect
description: Comprehensive system for gathering, documenting, and managing website requirements in AI-readable markdown format. Use when the user wants to document website specifications, create structured requirement documents for frontend development, capture complete website details (pages, components, styles, functionality, technical specs), plan website projects with detailed specifications, or edit/update existing website requirement documents. Supports progressive requirement gathering, modular documentation with cross-references, progress tracking for session resumption, and validation for consistency checking. Activated by commands like /init, /continue, /status, /update, /add, /remove, /preview, /validate, /finalize, /export or natural language requests to plan/document websites.
---

# Website Requirements Architect

## Overview

This skill transforms website planning into a structured, comprehensive documentation system. It creates modular markdown files organized in folders that capture every aspect of a website project - from pages and components to styles, functionality, technical requirements, and data schemas. The documentation is optimized for AI agents to understand and build from, while remaining human-readable and editable.

## Architecture

The skill is organized into three main components:

### 1. Commands (`commands/`)
Executable command modules that handle specific workflows. Each command is a separate markdown file with clear instructions for Claude to follow.

**Available Commands:**
- `init.md` - Initialize new project with folder structure and scoping
- `continue.md` - Resume from last session using progress tracking
- `status.md` - Display current completion status
- `update.md` - Modify existing requirements
- `add.md` - Add new sections to project scope
- `remove.md` - Delete sections from project
- `preview.md` - View complete requirements for a section
- `validate.md` - Quick consistency check
- `finalize.md` - Comprehensive validation and final review
- `export.md` - Package documentation for handoff

### 2. References (`references/`)
Supporting documentation and templates that commands reference as needed.

**Available References:**
- `requirements-checklist.md` - Complete 300+ item checklist of all possible website sections
- `document-templates.md` - Markdown templates for different document types
- `gathering-strategies.md` - Question patterns and progressive disclosure techniques

### 3. Main Skill File (`SKILL.md`)
This file - provides high-level overview and architecture guide.

## How Commands Work

### Command Invocation

**Slash Syntax:**
```
/init
/continue
/update homepage
/add pricing-page
```

**Natural Language:**
```
"Let's start documenting my website"
"Continue where we left off"
"Update the homepage requirements"
"Add a pricing page to the project"
```

Both approaches work - Claude understands intent and loads the appropriate command file.

### Command Execution Flow

1. **User triggers command** (slash syntax or natural language)
2. **Claude identifies** which command to execute
3. **Claude reads** the corresponding command file from `commands/` folder
4. **Claude follows** the step-by-step instructions in that command
5. **Claude references** any needed files from `references/` folder
6. **Claude executes** the workflow and creates/updates documentation

### Command Loading

When a command is triggered, Claude should:

1. **Load the command file**: Read `commands/[command-name].md`
2. **Follow instructions**: Execute steps in sequence
3. **Reference templates**: Load from `references/` as needed
4. **Update progress**: Always log changes to PROGRESS.md
5. **Cross-reference**: Link between documentation files appropriately

## Core Documentation Structure

All commands work within this standard folder structure:

```
[project-name]-requirements/
├── PROGRESS.md                     # Session tracking and status
├── project-overview.md             # Master checklist and index
├── pages/                          # Page specifications
│   ├── homepage.md
│   ├── about.md
│   └── contact.md
├── components/                     # Component definitions
│   ├── navigation.md
│   ├── hero-section.md
│   └── contact-form.md
├── content/                        # Content specifications
│   ├── copy.md
│   └── media.md
├── styles/                         # Design system
│   └── design-system.md
├── data-schemas/                   # Dynamic content structures
│   ├── events-schema.md
│   └── blog-posts-schema.md
├── functionality/                  # Interactive behaviors
│   ├── animations.md
│   └── form-validation.md
├── technical-requirements/         # Performance, SEO, etc.
│   ├── performance.md
│   ├── seo.md
│   └── accessibility.md
└── integrations/                   # Third-party services
    ├── analytics.md
    └── payment-gateway.md
```

## Document Standards

### Markdown File Naming
- Use kebab-case: `contact-form.md`, `hero-section.md`
- Be descriptive: `homepage-hero-section.md` not `hero.md`
- Group related files with prefixes: `nav-desktop.md`, `nav-mobile.md`

### Cross-Referencing
- Always use relative paths: `[Navigation Component](../components/navigation.md)`
- Include section anchors: `[Color Palette](../styles/design-system.md#colors)`
- Use descriptive link text: `[Contact Form Validation Rules](../functionality/form-validation.md)`

### Status Indicators
Every documentation file should include status:
- ✅ Complete
- 🔄 In Progress (missing: X, Y)
- ⏳ Not Started

### Heading Structure
Standard hierarchy for all documents:
```markdown
# [Section Name]
## Overview
## Specifications
## Related Sections
## Status
## Notes
```

## Progressive Disclosure Strategy

Commands follow a progressive disclosure pattern:

1. **Start broad** - High-level scoping with `/init`
2. **Drill down** - Detail priority sections first
3. **Cross-reference** - Link related components as discovered
4. **Validate** - Check consistency with `/validate` or `/finalize`
5. **Iterate** - Update with `/update`, expand with `/add`

## Best Practices

### For Command Execution
1. **Load command file first** - Always read from `commands/` folder
2. **Follow steps sequentially** - Don't skip unless explicitly indicated
3. **Update PROGRESS.md** - Log every significant action
4. **Reference templates** - Use from `references/` for consistency
5. **Cross-link everything** - Create bidirectional references

### For Documentation Quality
1. **Be specific** - Vague requirements lead to vague implementations
2. **Include examples** - Show, don't just tell
3. **Link liberally** - Connect related sections
4. **Mark TODOs** - Explicitly note decisions for later
5. **Validate often** - Catch issues early with `/validate`

### For Context Management
1. **Split large files** - Keep individual files under 500 lines
2. **Use cross-references** - Don't duplicate information
3. **Progressive detail** - Overview in main file, details in separate files
4. **Modular organization** - Each major concept gets its own file

## Getting Started

To use this skill:

1. **Trigger initialization**: Use `/init` or say "I want to plan my website"
2. **Follow prompts**: Answer questions about your project
3. **Review structure**: Check the created documentation folders
4. **Continue iterating**: Use other commands to refine requirements
5. **Validate before handoff**: Run `/finalize` when complete

## Command Reference Quick Guide

| Command | Purpose | Example Usage |
|---------|---------|---------------|
| `/init` | Start new project | `/init` or "Plan my portfolio site" |
| `/continue` | Resume work | `/continue` or "Let's keep going" |
| `/status` | Check progress | `/status` or "Show me current progress" |
| `/update [section]` | Modify requirements | `/update homepage` |
| `/add [section]` | Expand scope | `/add blog` |
| `/remove [section]` | Delete sections | `/remove pricing-page` |
| `/preview [section]` | View specifications | `/preview navigation` |
| `/validate` | Quick check | `/validate` |
| `/finalize` | Full validation | `/finalize` |
| `/export` | Package for handoff | `/export` |

For detailed instructions on each command, see the corresponding file in the `commands/` folder.

## Implementation Notes

This skill is designed to work both:
- **Standalone** - In claude.ai conversations
- **In repositories** - As a .claude/skills/ plugin for Claude Code
- **Collaborative** - Multiple users can edit the markdown files

The modular command structure makes it easy to:
- Add new commands
- Modify existing workflows
- Extend functionality
- Customize for specific needs

## Version

**Version:** 2.0 (Command-based architecture)
**Last Updated:** December 2024
