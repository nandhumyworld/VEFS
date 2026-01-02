# Command: /status

Display quick overview of project completion status.

## Purpose

Show at-a-glance progress without resuming detailed work.

## Execution Steps

1. Read PROGRESS.md and project-overview.md
2. Calculate completion metrics
3. Display formatted summary:

```markdown
## [Project Name] - Status Report

**Last Updated:** [Date from PROGRESS.md]
**Completion:** [X]% ([completed]/[total checked items])

### ✅ Completed ([X] sections)
- [List with checkmarks]

### 🔄 In Progress ([X] sections) 
- [List with progress indicators]

### ⏳ Pending ([X] sections)
- [List first 5, then "and X more..."]

### 📊 Progress by Category
- Pages: [X/Y completed]
- Components: [X/Y completed]
- Design System: [Complete/Incomplete]
- Functionality: [X/Y completed]
- Technical Requirements: [X/Y completed]
- Data Schemas: [X/Y completed]
- Integrations: [X/Y completed]

### 🎯 Suggested Next Steps
1. [Next priority item from PROGRESS.md]
2. [Second priority]
3. [Third priority]

---
Use /continue to resume work
Use /preview [section] to view any section
Use /finalize when ready for final validation
```

## Notes

- Don't begin gathering requirements - just show status
- Keep it concise and scannable
- Highlight what's done vs. what remains
- Give clear next steps

---

# Command: /update [section]

Modify existing requirements documentation.

## Purpose

Edit previously documented requirements when changes are needed.

## Usage Examples

- `/update homepage`
- `/update colors`
- `/update contact-form`
- `/update design-system`

## Execution Steps

### Step 1: Identify Target

Parse the section name from user command or ask:
```
Which section would you like to update?
```

### Step 2: Load Documentation

Find and load relevant file(s):
- Check pages/, components/, styles/, etc. for matching filename
- If found, read the file
- If not found, show available sections and ask for clarification

### Step 3: Display Current Content

Show summary of current requirements:
```markdown
## Current: [Section Name]

[Brief summary of key specifications]

**Status:** [Current status]
**Last Updated:** [Date]

What would you like to update?
```

### Step 4: Gather Changes

Ask what needs to change:
- "What specific changes would you like to make?"
- Listen for additions, modifications, or deletions
- Ask clarifying questions as needed

### Step 5: Update Documentation

- Modify the relevant markdown file(s)
- Maintain existing structure and formatting
- Update cross-references if names/links change
- Update the "Last Updated" date

### Step 6: Check Impact

If the change affects other sections:
```
This change affects:
- [Component X] (references this color)
- [Page Y] (uses this component)

Would you like me to update those as well?
```

Update related files if user confirms.

### Step 7: Update Progress

Append to PROGRESS.md session log:
```markdown
- Updated [section name]: [brief description of changes]
```

### Step 8: Confirm

```
✅ Updated [section name]

[Summary of changes made]

Would you like to:
1. Preview the updated section
2. Continue with other work
3. Update another section
```

## Notes

- Always show before/after or confirm changes
- Update cross-references automatically
- Be careful with dependent sections
- Maintain consistency with design system

---

# Command: /add [section]

Add new section to project scope.

## Purpose

Expand requirements with sections not in original scope.

## Usage Examples

- `/add pricing-page`
- `/add chatbot`
- `/add payment-integration`
- `/add testimonials-component`

## Execution Steps

### Step 1: Parse Section Name

Get section name from command or ask:
```
What would you like to add to the project?
```

### Step 2: Determine Type

Identify what type of section this is:
- Page → goes in pages/
- Component → goes in components/
- Data schema → goes in data-schemas/
- Functionality → goes in functionality/
- Integration → goes in integrations/
- Technical requirement → goes in technical-requirements/

If ambiguous, ask user.

### Step 3: Check Checklist

Look in project-overview.md:
- If item exists in checklist but unchecked, mark as `[x]`
- If item doesn't exist, add it to appropriate category

### Step 4: Gather Requirements

Use appropriate question patterns from `references/gathering-strategies.md`:
- For pages → page question pattern
- For components → component question pattern
- For schemas → data schema pattern
- etc.

### Step 5: Create Documentation

- Create new markdown file in appropriate folder
- Use template from `references/document-templates.md`
- Fill with gathered requirements
- Set status as ✅ Complete or 🔄 In Progress

### Step 6: Update Index

In project-overview.md:
- Add link to new documentation under "Documentation Index"
- Update checklist if needed

### Step 7: Update Progress

In PROGRESS.md:
- Add to completed or in-progress based on status
- Update session log

### Step 8: Check Integration

If new section relates to existing ones:
```
This new [section] could be referenced by:
- [Existing section 1]
- [Existing section 2]

Would you like me to add cross-references?
```

Add links if user confirms.

### Step 9: Confirm

```
✅ Added [section name] to project

📄 Created: [filepath]
✅ Status: [Complete/In Progress]
🔗 Referenced by: [X] other sections

Would you like to:
1. Preview what was created
2. Add another section
3. Continue with other work
```

## Notes

- Seamlessly integrate new sections
- Maintain existing structure and standards
- Create appropriate cross-references
- Update all tracking files

---

# Command: /remove [section]

Delete a section from project scope.

## Purpose

Remove requirements that are no longer needed.

## Usage Examples

- `/remove blog-page`
- `/remove analytics`
- `/remove user-authentication`

## Execution Steps

### Step 1: Confirm Section

Identify what to remove or ask:
```
Which section would you like to remove?
```

### Step 2: Find Related Files

Search for all related documentation:
- Main documentation file
- Any sub-files or dependencies
- Cross-references from other sections

### Step 3: Show Impact

Display what will be affected:
```markdown
⚠️ Removing [Section Name]

**Files to be deleted:**
- [filepath 1]
- [filepath 2]

**Cross-references in:**
- [Section A] (mentions this X times)
- [Section B] (links to this)

**Checklist items:**
- Will uncheck [item] in project-overview.md

Are you sure you want to remove this? (yes/no)
```

### Step 4: Confirm Deletion

Wait for explicit confirmation.

### Step 5: Execute Removal

If confirmed:
1. Delete documentation file(s)
2. Uncheck items in project-overview.md (change `[x]` to `[ ]`)
3. Remove from project-overview.md index
4. Remove from PROGRESS.md lists

### Step 6: Update Cross-References

For files that referenced the deleted section:
```
⚠️ Found broken references in:
- [File 1]: line [X]
- [File 2]: line [Y]

Would you like me to:
1. Remove these references
2. Replace with [alternative]
3. Leave as TODO markers
```

Update based on user choice.

### Step 7: Log Removal

Update PROGRESS.md session log:
```markdown
- Removed [section name] from project scope
  - Deleted [X] files
  - Updated [Y] cross-references
```

### Step 8: Confirm Completion

```
✅ Removed [section name]

Deleted files: [X]
Updated references: [Y]
Project scope updated

Would you like to:
1. Remove another section
2. Continue with other work
3. Review current status
```

## Notes

- Always confirm before deleting
- Show full impact of removal
- Handle cross-references carefully
- Keep audit trail in session log
- Be cautious about cascading deletions

---

# Command: /preview [section]

View complete requirements for a specific section.

## Purpose

Display formatted, comprehensive view of requirements without editing mode.

## Usage Examples

- `/preview homepage`
- `/preview navigation`
- `/preview design-system`
- `/preview events-schema`

## Execution Steps

### Step 1: Identify Section

Parse section name or ask:
```
Which section would you like to preview?
```

### Step 2: Load Files

Find and read all related documentation:
- Main section file
- Any referenced components or sub-sections
- Related design system elements

### Step 3: Resolve Cross-References

For each cross-reference link:
- Load the target section
- Include a brief summary (2-3 key points)
- Maintain the link for context

### Step 4: Format Display

Present clean, formatted view:

```markdown
# [Section Name] Preview

---

## Overview
[Content from file]

## Specifications
[Detailed requirements]

### [Subsection]
[Content]

**References:**
- [Component Name](path): [Brief summary]
- [Another Component](path): [Brief summary]

---

## Related Sections
- [Section A](path)
- [Section B](path)

---

## Status
[Status indicator]

## Last Updated
[Date]

---

Would you like to:
1. Update this section (/update [section])
2. Preview another section
3. Continue with other work
```

### Step 5: Offer Actions

Based on preview, suggest relevant actions:
- If incomplete → "Would you like to complete the missing details?"
- If outdated → "This was last updated [date]. Need to refresh?"
- If complete → "Looks complete! Ready to finalize?"

## Notes

- Don't enter edit mode
- Show everything: specs, links, status
- Include summaries of referenced sections
- Make it easy to transition to /update if needed
- Format for readability
