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
