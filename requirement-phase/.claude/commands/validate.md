# Command: /validate

Quick consistency check without full finalization.

## Purpose

Run lightweight validation to catch common issues without the full finalization process.

## When to Use

- Mid-project checkup
- After making several updates
- Before sharing work in progress
- When user wants quick quality check

## Execution Steps

### Step 1: Scan Project Files

Read all documentation files across all folders:
- pages/
- components/
- styles/
- data-schemas/
- functionality/
- technical-requirements/
- integrations/

### Step 2: Run Validation Checks

#### Check 1: Cross-Reference Integrity
- Find all markdown links `[text](path)`
- Verify each linked file exists
- Verify section anchors exist if specified
- List any broken links

#### Check 2: Referenced Components Exist
- Find all component references in page files
- Check if component documentation exists
- List any undefined components

#### Check 3: Data Schema References
- Find references to data schemas in components/pages
- Verify schema documentation exists
- List any undefined schemas

#### Check 4: Color Code Validity
- Find all hex color codes
- Validate format (#RGB or #RRGGBB)
- Flag invalid formats

#### Check 5: Checklist vs Documentation
- Compare checked items in project-overview.md
- Check if each has corresponding documentation
- Flag items marked [x] but missing docs

#### Check 6: Status Consistency
- Check if sections marked "Complete" actually have content
- Flag sections with only headers but marked complete

### Step 3: Generate Report

```markdown
## Validation Report

**Project:** [Name]
**Validated:** [Date and Time]
**Files Checked:** [Count]

### ✅ Passed Checks

- Cross-reference integrity: [X] links verified
- Component definitions: All referenced components documented
- Data schemas: All referenced schemas defined
- Color codes: [X] valid codes found
- [etc.]

### ⚠️ Issues Found

#### Broken Links ([X] issues)
- File: pages/homepage.md, Line: [X]
  - Links to: ../components/missing.md (doesn't exist)
- [More issues...]

#### Undefined Components ([X] issues)
- Homepage references "testimonial-card" but no documentation found
- About page references "team-member-grid" but no documentation found

#### Missing Documentation ([X] issues)
- "Blog Page" is checked in overview but no pages/blog.md found
- "Newsletter Integration" is checked but no integrations/newsletter.md found

#### Color Code Issues ([X] issues)
- styles/design-system.md: Invalid color "#GGG123" (should be #RRGGBB)

#### Status Inconsistencies ([X] issues)
- components/hero.md marked "Complete" but only has section headers
- pages/contact.md marked "Complete" but missing content sections

### 📊 Summary

**Total Issues:** [X]
- 🔴 Critical: [X] (broken functionality)
- 🟡 Warnings: [X] (inconsistencies)
- 🔵 Info: [X] (suggestions)

### 🎯 Recommendations

[If issues found:]
1. Fix broken links in [affected files]
2. Create missing component documentation
3. Update status markers to reflect actual completion
4. Run /validate again after fixes

[If no issues:]
✅ No issues found! 

Your documentation looks consistent. Consider:
1. Running /finalize for comprehensive review
2. Adding more detail to in-progress sections
3. Completing pending sections

---

**Note:** This is a quick check. Run /finalize for comprehensive validation before handoff.
```

### Step 4: Offer Next Steps

Based on results:

**If critical issues found:**
```
Found [X] critical issues that should be fixed.

Would you like me to:
1. Fix the broken links automatically
2. Create placeholder files for missing documentation
3. Guide you through fixing issues manually
4. Ignore for now and continue working
```

**If only warnings:**
```
Found [X] minor issues. These won't break anything but should be cleaned up.

Would you like to:
1. Fix these now
2. Add to TODO list for later
3. Continue working
```

**If no issues:**
```
✅ Validation passed!

Your documentation is consistent and complete.

Next steps:
- Run /finalize for full quality review
- Continue adding detail with /continue
- Export for handoff with /export
```

### Step 5: Auto-Fix Options

For fixable issues, offer automatic resolution:

**Broken links:**
```
I can automatically:
- Remove broken links
- Create placeholder files for missing targets
- Update links to correct paths

Apply auto-fixes? (yes/no)
```

**Missing component placeholders:**
```
Create placeholder files for [X] undefined components?
This will create:
- components/testimonial-card.md (template)
- components/team-member-grid.md (template)

You can fill them in later.

Create placeholders? (yes/no)
```

### Step 6: Log Validation

Update PROGRESS.md:
```markdown
- Ran validation check
  - Files checked: [X]
  - Issues found: [Y]
  - [Auto-fixes applied / No fixes needed]
```

## Success Criteria

- ✅ All documentation files scanned
- ✅ Validation checks executed
- ✅ Report generated with specific issues
- ✅ Actionable recommendations provided
- ✅ User offered next steps

## Validation Rules

### Critical Issues (Must Fix)
- Broken cross-reference links
- Referenced but undefined components
- Referenced but undefined data schemas
- Checklist items marked done but no documentation exists

### Warnings (Should Fix)
- Invalid color codes
- Status marked "Complete" but missing content
- Duplicate component/page names
- Inconsistent naming conventions

### Info (Nice to Fix)
- TODO markers in documentation
- Missing optional sections
- Opportunities for cross-linking
- Sections that could be split for better organization

## Notes

- This is lighter than `/finalize`
- Fast enough to run frequently
- Focuses on structural integrity
- Can auto-fix some issues
- Good for mid-project quality checks
- Always update PROGRESS.md with results
