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
