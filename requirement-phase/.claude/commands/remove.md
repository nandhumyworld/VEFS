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
