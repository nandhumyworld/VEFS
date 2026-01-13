# Fix Bugs Command

Systematically fix bugs and issues from a markdown file with root cause analysis.

## Usage

```
/fix-bugs <bugs-file-path>
```

## Arguments

- `bugs-file-path`: Path to markdown file containing bugs under `## Bugs` section

## Examples

```
/fix-bugs bugs.md
/fix-bugs issues/testing-feedback.md
/fix-bugs sprint-23-bugs.md
```

## Prompt

I need you to fix bugs and issues from the file: {bugs-file-path}

Follow this systematic debugging and fixing workflow:

## PHASE 1: PARSE BUGS (2 min)
1. Read the file: {bugs-file-path}
2. Extract all items under "## Bugs" section
3. For each bug, identify:
   - Bug description
   - Steps to reproduce (if mentioned)
   - Expected vs actual behavior
   - Severity level (Critical/High/Medium/Low - infer if not specified)
   - Affected component/feature
   - Environment details (if mentioned)

4. Present parsed bugs list:
   ```
   ## Bugs Identified: [X total]
   
   ### Critical Priority:
   1. [Bug name] - [Brief description]
   
   ### High Priority:
   2. [Bug name] - [Brief description]
   
   ### Medium Priority:
   3. [Bug name] - [Brief description]
   
   ### Low Priority:
   4. [Bug name] - [Brief description]
   ```

## PHASE 2: BUG ANALYSIS & TRIAGE (5-10 min)

### For Each Bug:

1. **Identify bug category**:
   - Logic error (incorrect algorithm, wrong condition)
   - State management issue (stale state, incorrect updates)
   - Event handling problem (missing listeners, duplicate events)
   - API/data issue (wrong endpoint, data parsing error)
   - UI/styling issue (CSS conflicts, layout problems)
   - Performance issue (memory leaks, slow rendering)
   - Edge case not handled (null checks, empty arrays)
   - Race condition (async timing issues)
   - Browser compatibility (vendor-specific behavior)

2. **Perform root cause analysis**:
   - Identify likely file(s) containing the bug
   - Trace the execution flow
   - Identify what's causing the unexpected behavior
   - Determine if it's a simple fix or requires architectural change

3. **Assess fix complexity**:
   - **Simple**: 1-5 line change (missing check, typo, wrong value)
   - **Medium**: Function/component logic change (5-30 lines)
   - **Complex**: Architectural change or multiple files affected (30+ lines)

### Prioritization Strategy:

**P0 (Critical)** - Fix immediately:
- Blocking core functionality
- Data loss or corruption
- Security vulnerabilities
- Crashes or errors that prevent app usage

**P1 (High)** - Fix after critical:
- Major features broken
- Poor user experience
- Frequent errors
- Affects many users

**P2 (Medium)** - Fix after high:
- Minor functionality issues
- Workarounds available
- Edge case errors
- Affects few users

**P3 (Low)** - Fix when time permits:
- Cosmetic issues
- Minor UX improvements
- Rare edge cases
- Nice-to-have fixes

### Dependency Analysis:
- Identify bugs that are related
- Determine if fixing one bug resolves others
- Note potential regressions from fixes
- Plan fix order to minimize risk

### Present Triage Summary:
```
## Bug Triage Complete

### Fix Order:
1. Bug #1 (P0) - [Name] - [Category] - [Complexity]
   Root Cause: [Brief explanation]
   Files: [Affected files]
   
2. Bug #2 (P1) - [Name] - [Category] - [Complexity]
   Root Cause: [Brief explanation]
   Files: [Affected files]

[Continue for all bugs...]

### Dependencies Identified:
- Fixing Bug #1 will also resolve Bug #5
- Bug #3 and Bug #7 are related (same root cause)

Ready to proceed with fixes?
```

## PHASE 3: SYSTEMATIC BUG FIXING (Variable)

For EACH bug in priority order:

### Step 1: REPRODUCE & UNDERSTAND (3-5 min)

1. **Read the relevant code**:
   - Locate the files containing the bug
   - Understand the current logic flow
   - Trace how the bug manifests
   - Check related code that might be affected

2. **Confirm the root cause**:
   - Understand WHY the bug occurs (not just WHERE)
   - Identify the incorrect assumption or logic
   - Check if it's a symptom of a deeper issue
   - Verify understanding by mentally walking through the code

3. **Consider the context**:
   - How does this code interact with other parts?
   - What are the dependencies?
   - What assumptions did the original code make?
   - Are there similar patterns elsewhere that might have the same bug?

### Step 2: PLAN THE FIX (2-3 min)

1. **Determine the fix approach**:
   - **Minimal change**: Fix only what's necessary
   - **Root cause**: Address the underlying issue, not symptoms
   - **Side effects**: Consider impact on other features
   - **Breaking changes**: Avoid if possible, document if necessary

2. **Consider alternatives**:
   - Is there a simpler fix?
   - Is there a more robust fix?
   - Should this be refactored or just patched?
   - What's the best balance of quick fix vs. proper solution?

3. **Plan validation**:
   - How to verify the fix works
   - Edge cases to test
   - Regression scenarios to check
   - Manual testing steps

### Step 3: IMPLEMENT THE FIX (5-15 min)

1. **Make the code changes**:
   ```
   Fix Strategy:
   - Fix the immediate bug
   - Add validation/checks to prevent recurrence  
   - Add defensive programming where appropriate
   - Handle edge cases discovered
   - Add error handling if missing
   ```

2. **Code quality checklist**:
   - [ ] Fix follows project patterns
   - [ ] No bandaid solutions (fix root cause, not symptoms)
   - [ ] Clean, readable code
   - [ ] Proper error messages
   - [ ] Edge cases handled
   - [ ] No console.logs left in code
   - [ ] Comments added if logic is complex
   - [ ] Existing code style maintained

3. **Defensive programming**:
   - Add null/undefined checks where needed
   - Validate inputs before processing
   - Add try-catch for operations that might fail
   - Set sensible defaults
   - Handle empty arrays/objects
   - Check API response structure
   - Validate user inputs

### Step 4: VERIFY THE FIX (2-5 min)

1. **Self-review**:
   - Does this fix the reported issue? ✅
   - Does this introduce any regressions? ✅
   - Are edge cases handled? ✅
   - Is error handling comprehensive? ✅
   - Could this break other features? ✅

2. **Test case considerations**:
   - **Normal case**: The bug scenario itself
   - **Edge cases**: Empty, null, undefined, max/min values
   - **Error scenarios**: Network failures, invalid data
   - **Integration**: How fix affects related features
   - **Regression**: Ensure existing functionality still works

3. **Performance check**:
   - Does fix impact performance?
   - Any memory leaks introduced?
   - Excessive re-renders or calculations?

### Step 5: DOCUMENT & REPORT (1-2 min)

Report for each bug fixed:
```
✅ Bug Fixed: [Bug Name]

Severity: [P0/P1/P2/P3]
Category: [Logic/State/Event/API/UI/Performance/Edge case]

Root Cause:
[Clear explanation of why the bug occurred]

Fix Implemented:
[What was changed and why]

Files Modified:
- path/to/file.js (line XX: [specific change])

Code Changes:
[Brief description or small code snippet if helpful]

Edge Cases Handled:
- [Edge case 1]
- [Edge case 2]

Side Effects:
- None / [Description of any side effects]

Testing Recommendations:
1. [Specific test scenario]
2. [Another test scenario]

Regression Risk: Low/Medium/High
[Brief explanation if Medium or High]
```

### Step 6: MOVE TO NEXT BUG

Continue with next bug in priority order.

## PHASE 4: REGRESSION CHECK (5 min)

After all bugs are fixed:

1. **Review all changes holistically**:
   - Check for unintended interactions between fixes
   - Ensure consistent error handling across all fixes
   - Verify no new edge cases introduced
   - Look for patterns in bugs (indicates systemic issues)

2. **Identify critical test scenarios**:
   ```
   ## Critical Testing Scenarios:
   
   ### Fixed Bugs Verification:
   1. Bug #1: [Test scenario]
   2. Bug #2: [Test scenario]
   
   ### Related Functionality:
   1. Feature X: [Test scenario]
   2. Feature Y: [Test scenario]
   
   ### Common User Flows:
   1. [Primary user flow]
   2. [Secondary user flow]
   
   ### Regression Testing:
   1. [Feature that might be affected]
   2. [Another potentially affected feature]
   ```

3. **Performance check**:
   - Do fixes impact load time?
   - Any memory leaks introduced?
   - Check for excessive API calls

## PHASE 5: FINAL SUMMARY (2 min)

Create comprehensive bug fix summary:

```
## Bug Fixing Session Complete

### Summary Statistics:
- Total Bugs: [X]
- Fixed: [X]
- Files Modified: [X]
- Lines Changed: [~X]

### Bugs Fixed by Priority:
✅ Critical (P0): [X/X]
✅ High (P1): [X/X]
✅ Medium (P2): [X/X]
✅ Low (P3): [X/X]

### Files Modified:
- path/to/file1.js - [# bugs fixed]
- path/to/file2.js - [# bugs fixed]

### Root Causes Summary:
[Analysis of common patterns found across bugs]

Common Issues Found:
- [Pattern 1]: Affected bugs #1, #3, #5
- [Pattern 2]: Affected bugs #2, #4
- [Pattern 3]: Affected bug #6

### Testing Required:

#### Manual Testing Checklist:
- [ ] Test bug #1 scenario: [Description]
- [ ] Test bug #2 scenario: [Description]
- [ ] Test feature X: [Description]
- [ ] Test feature Y: [Description]
- [ ] Test on mobile devices
- [ ] Test with slow network
- [ ] Test edge cases

#### Regression Testing Areas:
- [Feature/Component that might be affected]
- [Another feature to check]

#### Recommended Playwright Tests:
- /test-feature "[feature affected by bugs]"
- /test-feature "[another affected feature]"

### Preventive Recommendations:

#### Code Improvements:
1. [Suggestion to prevent similar bugs]
2. [Another improvement]

#### Monitoring Suggestions:
1. [What to monitor going forward]
2. [Error tracking to add]

#### Documentation Needs:
1. [What to document better]
2. [Edge cases to note]

### Next Steps:
1. Run manual tests from checklist
2. Execute Playwright tests for affected features
3. Monitor for new issues after deployment
4. Consider [preventive measure]
```

## IMPORTANT GUIDELINES

### Debugging Mindset:
- **Fix root causes, not symptoms**: Don't just hide the error, solve the underlying problem
- **Understand before fixing**: Make sure you know WHY the bug happens
- **Consider side effects**: Think about how the fix affects other code
- **Test your understanding**: Mentally trace through the fix logic
- **Keep it simple**: The simplest fix that solves the problem properly is often the best

### Defensive Programming:
- **Add validation**: Check inputs, data shapes, API responses
- **Handle edge cases**: Null, undefined, empty arrays, boundary values
- **Graceful degradation**: Handle errors without breaking the app
- **User-friendly errors**: Clear messages that help users understand what went wrong
- **Fail safely**: If something breaks, don't take down the entire app

### Code Quality:
- **Follow existing patterns**: Match the project's error handling style
- **Don't introduce technical debt**: Fix properly, not with hacks
- **Comment tricky fixes**: If the fix isn't obvious, explain why
- **Clean up while fixing**: Remove dead code, improve naming if touching nearby code
- **Consistent formatting**: Match project's code style

### Common Bug Patterns to Watch For:

#### JavaScript/TypeScript:
- Missing null/undefined checks
- Incorrect comparison operators (== vs ===, comparing objects)
- Off-by-one errors in loops
- Async/await issues (missing await, unhandled promises, promise.all() errors)
- Type coercion bugs (truthy/falsy confusion)
- Scope and closure problems
- Reference vs value (mutating objects/arrays)
- Floating point precision issues

#### React/Frontend:
- Stale state/closures in effects and callbacks
- Incorrect useEffect dependencies
- Event listener memory leaks (missing cleanup)
- Infinite render loops
- Key prop issues in lists
- Race conditions in state updates
- Missing loading/error states
- Incorrect conditional rendering

#### State Management:
- Mutating state directly instead of immutably
- Not handling pending/loading states
- Race conditions between multiple updates
- Stale data from cache
- Not invalidating cache when needed

#### API/Backend:
- Not handling API errors
- Incorrect HTTP methods/status codes
- Race conditions in async operations
- Not validating request data
- SQL injection vulnerabilities
- Missing authentication checks
- CORS issues

#### CSS/Styling:
- Z-index conflicts
- Specificity wars
- Missing vendor prefixes
- Responsive breakpoint issues
- Overflow hidden cutting off content
- Fixed positioning issues on mobile

#### Performance:
- Memory leaks (event listeners, timers, subscriptions)
- Unnecessary re-renders
- N+1 query problems
- Large bundle sizes
- Not lazy loading images/components
- Blocking the main thread

### Testing Strategy:
- **Test the bug**: Verify the original issue is fixed
- **Test edge cases**: What if input is null? Empty? Max value?
- **Test integration**: Does the fix affect other features?
- **Test errors**: What happens when API fails? Network is slow?
- **Test performance**: Did the fix slow anything down?
- **Test on different browsers/devices**: Cross-browser compatibility

Start with PHASE 1 now.
