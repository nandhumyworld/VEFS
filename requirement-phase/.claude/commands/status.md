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
