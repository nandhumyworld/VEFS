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

---

# Command: /finalize

Comprehensive validation and final review before handoff.

## Purpose

Thorough quality check that ensures requirements are complete, consistent, and ready for implementation.

## When to Use

- Before handing off to developers
- Before giving to AI builder
- At project completion
- Before major milestones

## Execution Steps

### Step 1: Run Full Validation

Execute all checks from `/validate` plus additional comprehensive checks:

#### Additional Checks for Finalize

**Content Completeness:**
- Verify all required sections have actual content (not just headers)
- Check that examples are provided where needed
- Verify data schemas have all required fields defined
- Ensure technical requirements specify measurable criteria

**Design System Completeness:**
- All colors defined with both name and code
- Typography scale is complete
- Spacing scale is defined
- Component styles reference design system

**Requirement Specificity:**
- Vague language flagged: "nice looking", "modern", "good"
- Missing measurements: "large" without px/rem values
- Ambiguous behaviors: "smooth animation" without duration
- Missing error states and edge cases

**Documentation Quality:**
- Each page has purpose and target audience
- Components have usage guidelines
- Data schemas have example entries
- Technical requirements have acceptance criteria

**Completeness vs Scope:**
- All checked items in overview have documentation
- All created documentation is checked in overview
- No orphaned files (files not linked anywhere)
- All TODOs and placeholders are resolved or explicitly marked

### Step 2: Generate Comprehensive Report

```markdown
# Final Validation Report

**Project:** [Name]
**Finalized:** [Date and Time]
**Total Files:** [Count]
**Total Sections:** [Count]

## Executive Summary

✅ **Validation Status:** [PASSED / ISSUES FOUND]
📊 **Completion:** [X]%
📄 **Pages Documented:** [X]
🧩 **Components Defined:** [X]
🎨 **Design System:** [Complete / Incomplete]
⚙️ **Functionality Specs:** [X] items
🔧 **Technical Requirements:** [X] items
🔗 **Integrations:** [X] items
📊 **Data Schemas:** [X] types

---

## Validation Results

### ✅ Passed Checks ([X] checks)

[List all passing validation categories]

### ⚠️ Issues Found

[Organize by severity and category, same as /validate but more detailed]

### 📋 Content Review

#### Pages ([X] pages)
[For each page:]
- **[Page Name]**
  - Status: ✅ Complete / 🔄 Missing: [details]
  - Sections: [X/Y] documented
  - Content: [Actual content / Placeholders]
  - Quality: [Specific / Vague]

#### Components ([X] components)
[For each component:]
- **[Component Name]**
  - Visual Design: ✅ Complete / ⚠️ Vague / ❌ Missing
  - Behavior: ✅ Detailed / ⚠️ Partial / ❌ Missing
  - States: ✅ All defined / ⚠️ Some missing
  - Responsive: ✅ Specified / ❌ Not specified

#### Design System
- Colors: ✅ [X] defined / ⚠️ [Y] missing codes
- Typography: ✅ Complete / ⚠️ Incomplete scale
- Spacing: ✅ Defined / ❌ Not defined
- Components: ✅ All reference system / ⚠️ Some inconsistent

#### Data Schemas ([X] schemas)
[For each schema:]
- **[Schema Name]**
  - Fields: ✅ [X] fully defined / ⚠️ [Y] incomplete
  - Validation: ✅ Specified / ❌ Missing
  - Examples: ✅ Provided / ❌ Missing

### 🎯 Quality Metrics

**Specificity Score:** [X]% (higher is better)
- Measurements provided: [X/Y] places
- Colors specified with codes: [X/Y] places
- Animation timings specified: [X/Y] places

**Completeness Score:** [X]%
- Documentation for checked items: [X/Y]
- Required fields in schemas: [X/Y]
- Component states defined: [X/Y]

**Consistency Score:** [X]%
- Cross-references valid: [X/Y]
- Naming conventions followed: [X/Y]
- Status markers accurate: [X/Y]

---

## Readiness Assessment

### For Development: [READY / NOT READY]

**Required for Ready:**
- ✅ All pages have complete specifications
- ✅ Components have visual and behavioral details
- ✅ Design system is fully defined
- ✅ Technical requirements are measurable
- ✅ No critical validation issues

**Current Status:**
[List which requirements are met and which aren't]

### For AI Building: [READY / NOT READY]

**Required for Ready:**
- ✅ Visual descriptions are detailed
- ✅ Layout specifications are clear
- ✅ Color codes are provided (not just names)
- ✅ Component behaviors are explicit
- ✅ Examples are provided for dynamic content

**Current Status:**
[List which requirements are met and which aren't]

---

## Missing or Incomplete

### Critical (Must Complete)
1. [Issue description with specific action needed]
2. [Issue description with specific action needed]

### Important (Should Complete)
1. [Issue description with specific action needed]
2. [Issue description with specific action needed]

### Optional (Nice to Have)
1. [Enhancement suggestion]
2. [Enhancement suggestion]

---

## Final Recommendations

[Based on assessment:]

**If ready for handoff:**
✅ Your requirements are complete and ready!

Next steps:
1. Export with /export for clean handoff package
2. Share documentation with development team
3. Begin implementation

**If issues found:**
⚠️ [X] issues should be resolved before handoff.

Priority actions:
1. [Specific fix needed]
2. [Specific fix needed]
3. [Specific fix needed]

Would you like me to help fix these issues?

---

## Changelog

[Summary of what was finalized:]
- Pages documented: [X]
- Components defined: [X]
- Requirements specified: [X]
- Validation issues: [X] fixed, [Y] remaining
- Total documentation files: [X]
```

### Step 3: Ask Clarifying Questions

For each issue found, especially vague requirements:

```
I found some areas that need more detail:

1. **Homepage Hero Section** - Description says "modern and clean"
   - What specific layout? (Centered, Split, Full-width?)
   - What background? (Color, Image, Video?)
   - What text hierarchy? (Font sizes, weights?)

2. **Contact Form** - No validation rules specified
   - Email format validation?
   - Required field indicators?
   - Error message text?

[Continue for each issue...]

Would you like to address these now, or mark them as "Client to provide"?
```

### Step 4: Resolve Issues Interactively

For each issue user wants to fix:
- Ask specific questions
- Update relevant documentation
- Re-run validation for that section
- Mark as resolved in report

### Step 5: Mark Project as Finalized

Update PROGRESS.md:

```markdown
## Project Status: FINALIZED ✅

**Finalized:** [Date and Time]
**Validation Status:** [PASSED / PASSED WITH NOTES]
**Total Sections:** [X] complete, [Y] with notes
**Ready for:** [Development / AI Building / Both]

### Finalization Summary
- Files validated: [X]
- Issues resolved: [Y]
- Documentation quality: [Score/Assessment]
- Handoff package prepared: [Yes/No]

### Known Gaps (if any)
- [Item] - To be provided by [client/stakeholder]
- [Item] - To be decided during implementation

### Next Steps
1. Export with /export
2. Share with development team
3. Begin implementation
```

### Step 6: Generate Final Summary

```markdown
# 🎉 Requirements Finalization Complete!

## Project Summary

**[Project Name]** - Website Requirements Documentation

📊 **Statistics:**
- Total Pages: [X]
- Components: [X]
- Data Schemas: [X]
- Total Documentation Files: [X]
- Validation Status: ✅ PASSED

🎯 **Readiness:**
- Development Ready: [Yes/No]
- AI Building Ready: [Yes/No]
- Quality Score: [X]%

📋 **What's Documented:**
- Complete page specifications
- Reusable component definitions
- Full design system
- Functionality requirements
- Technical specifications
- Integration details
- Dynamic content schemas

✅ **Quality Checks:**
- Cross-references validated
- All components defined
- Design system complete
- Requirements specific and measurable
- Examples provided
- No critical issues

---

**Your requirements documentation is ready!**

Next step: Use /export to package everything for handoff.

Would you like to:
1. Export the documentation package
2. Preview any specific section
3. Make final adjustments
```

## Success Criteria

- ✅ Comprehensive validation executed
- ✅ All issues identified and categorized
- ✅ Quality metrics calculated
- ✅ Readiness assessment provided
- ✅ Interactive issue resolution offered
- ✅ Project marked as finalized in PROGRESS.md
- ✅ Clear handoff instructions provided

## Finalization Checklist

Before marking as PASSED:

**Structure:**
- [ ] All checked items have documentation
- [ ] All documentation files are indexed
- [ ] No orphaned files
- [ ] Cross-references are valid

**Content:**
- [ ] Pages have purpose and target audience
- [ ] Components have visual and behavioral specs
- [ ] Design system is complete
- [ ] Data schemas have all fields defined
- [ ] Technical requirements are measurable

**Quality:**
- [ ] Specific measurements provided
- [ ] Colors have codes, not just names
- [ ] Animations have durations
- [ ] Error states are defined
- [ ] Examples are provided

**Completeness:**
- [ ] No empty sections marked "Complete"
- [ ] No placeholders in critical areas
- [ ] All TODOs resolved or explicitly marked
- [ ] Validation rules specified

## Notes

- This is the most thorough command
- Takes longer than /validate
- Interactive process with user
- Results in high-quality, implementation-ready documentation
- Should be run before any handoff
- Can mark items as "To be provided later" if client-dependent
- Always offer /export after successful finalization
