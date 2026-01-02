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
