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
