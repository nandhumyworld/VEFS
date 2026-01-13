# Test Feature Command

Generate and execute comprehensive Playwright tests for a specific feature using Playwright MCP.

## Usage

```
/test-feature "<feature-description>"
```

## Arguments

- `feature-description`: Description of the feature to test (use quotes for multi-word descriptions)

## Examples

```
/test-feature "user login flow"
/test-feature "contact form submission"
/test-feature "shopping cart checkout"
/test-feature "image gallery navigation"
/test-feature "dark mode toggle"
```

## Prompt

I need you to test the following feature using Playwright MCP: "{feature-description}"

Follow this systematic testing workflow:

## PHASE 1: UNDERSTAND THE FEATURE (3-5 min)

### Analyze Implementation:

1. **Locate feature in codebase**:
   - Identify which pages/components implement this feature
   - Find relevant files (components, styles, logic)
   - Understand the tech stack (React, Vue, vanilla JS, etc.)
   - Map out the user interface elements involved

2. **Understand user interactions**:
   - What actions can users perform?
   - What's the expected user flow?
   - What data is displayed/collected?
   - What URLs/routes are involved?
   - What API calls are made (if any)?

3. **Identify expected behavior**:
   - What should happen on successful interaction?
   - What error states exist?
   - What loading states are shown?
   - What validation is in place?
   - What accessibility features are implemented?

### Define Test Scenarios:

Create comprehensive test coverage:

```
## Test Scenarios for: {feature-description}

### 1. Happy Path (Primary Success Scenario)
- User action: [Step-by-step flow]
- Expected result: [What should happen]
- Assertions needed: [What to verify]

### 2. Edge Cases
- Empty input: [Test scenario]
- Maximum input: [Test scenario]
- Special characters: [Test scenario]
- Boundary values: [Test scenario]

### 3. Error Cases
- Invalid input: [Test scenario]
- Network failure: [Test scenario]
- API error: [Test scenario]
- Timeout: [Test scenario]

### 4. State Variations
- User logged in vs logged out: [If applicable]
- Different user roles: [If applicable]
- Different data states: [If applicable]
- Browser state: [Cookies, localStorage, etc.]

### 5. Cross-browser/Device Testing
- Desktop (large screen)
- Tablet (medium screen)
- Mobile (small screen)
- Different browsers (if critical)

### 6. Accessibility Testing
- Keyboard navigation: [Test scenario]
- Screen reader: [Test scenario]
- Focus management: [Test scenario]
- ARIA labels: [Test scenario]

### 7. Performance Testing
- Load time: [Expectations]
- Time to interactive: [Expectations]
- API response time: [If applicable]
```

Present the test plan and get confirmation before proceeding.

## PHASE 2: SETUP TEST ENVIRONMENT (2-3 min)

### Determine Test Requirements:

1. **Application configuration**:
   - Base URL: [Determine from project]
   - Test data needs: [What data is required]
   - Authentication: [Login required?]
   - State setup: [Initial state needed]

2. **Check existing Playwright setup**:
   - Look for `playwright.config.ts/js`
   - Check for existing test directory structure
   - Identify test patterns to follow
   - Note any custom fixtures or helpers

3. **Plan test file structure**:
   ```
   Test file: tests/{feature-name}.spec.ts
   
   Structure:
   - describe() block for feature
   - beforeEach() for setup
   - Individual test() blocks for each scenario
   - afterEach() for cleanup (if needed)
   ```

## PHASE 3: WRITE PLAYWRIGHT TESTS (10-20 min)

### Test File Template:

```typescript
import { test, expect } from '@playwright/test';

test.describe('{feature-description}', () => {
  
  // Setup before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto('/[relevant-page]');
    
    // Setup initial state if needed
    // - Login user
    // - Set localStorage/cookies
    // - Wait for page to be ready
  });

  // HAPPY PATH TESTS
  test('should successfully complete {feature-description}', async ({ page }) => {
    // Arrange: Setup test data (if needed)
    
    // Act: Perform user actions
    // - Click buttons
    // - Fill inputs
    // - Navigate
    
    // Assert: Verify expected outcomes
    // - Check elements visible
    // - Verify text content
    // - Check URL changes
    // - Validate state changes
  });

  // VALIDATION TESTS
  test('should validate required fields', async ({ page }) => {
    // Test empty submission
    // Test invalid formats
    // Verify error messages
  });

  // EDGE CASE TESTS
  test('should handle edge cases', async ({ page }) => {
    // Test boundary values
    // Test special characters
    // Test maximum lengths
  });

  // ERROR HANDLING TESTS
  test('should display error message on failure', async ({ page }) => {
    // Mock API failure (if applicable)
    // Trigger error condition
    // Verify error is shown
    // Check user can recover
  });

  // ACCESSIBILITY TESTS
  test('should be keyboard accessible', async ({ page }) => {
    // Test Tab navigation
    // Test Enter to submit
    // Test Esc to close (if modal)
    // Verify focus indicators
  });

  // RESPONSIVE TESTS
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test feature on mobile
    // Verify responsive behavior
  });

});
```

### Writing Guidelines:

#### 1. Use Proper Selectors (Priority Order):

```typescript
// ✅ BEST: Accessibility-friendly selectors
await page.getByRole('button', { name: 'Submit' });
await page.getByRole('textbox', { name: 'Email' });
await page.getByRole('heading', { name: 'Welcome' });
await page.getByLabel('Email address');

// ✅ GOOD: Test IDs (add to components if needed)
await page.getByTestId('submit-button');
await page.getByTestId('error-message');

// ✅ OK: Text content (for unique text)
await page.getByText('Click here to continue');
await page.getByPlaceholder('Enter your email');

// ❌ AVOID: CSS selectors (brittle)
await page.locator('.btn-primary'); // Classes can change
await page.locator('#submit'); // IDs might not be unique
```

#### 2. Clear, Descriptive Test Names:

```typescript
// ✅ GOOD: Describes behavior and outcome
test('should display success message after form submission');
test('should prevent submission when email is invalid');
test('should close modal when clicking backdrop');

// ❌ BAD: Vague or implementation-focused
test('test form');
test('button click');
test('check if div has class');
```

#### 3. Comprehensive Assertions:

```typescript
// Visibility checks
await expect(page.getByRole('alert')).toBeVisible();
await expect(page.getByTestId('spinner')).not.toBeVisible();

// Text content
await expect(page.getByRole('heading')).toHaveText('Success!');
await expect(page.getByTestId('error')).toContainText('Invalid email');

// URL validation
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/\/profile\/\d+/);

// Element states
await expect(page.getByRole('button')).toBeDisabled();
await expect(page.getByRole('checkbox')).toBeChecked();
await expect(page.getByRole('textbox')).toHaveValue('test@example.com');

// Counts
await expect(page.getByRole('listitem')).toHaveCount(5);

// Attributes
await expect(page.getByRole('link')).toHaveAttribute('href', '/about');
await expect(page.getByRole('button')).toHaveAttribute('aria-label', 'Close');

// CSS properties (use sparingly)
await expect(page.getByTestId('modal')).toHaveCSS('display', 'block');
```

#### 4. Proper Waits:

```typescript
// ✅ GOOD: Auto-waiting is built into most actions
await page.click('button'); // Waits for element to be actionable
await page.fill('input', 'text'); // Waits for element to be visible

// Explicit waits when needed
await page.waitForURL('/dashboard');
await page.waitForSelector('[data-testid="loaded"]');
await page.waitForLoadState('networkidle');

// Wait for API responses
await page.waitForResponse(resp => 
  resp.url().includes('/api/') && resp.status() === 200
);

// ❌ BAD: Arbitrary timeouts
await page.waitForTimeout(3000); // Flaky, avoid unless absolutely necessary
```

#### 5. Error Handling and Debugging:

```typescript
test('feature test', async ({ page }) => {
  // Take screenshot before critical action
  await page.screenshot({ path: 'before-action.png' });
  
  try {
    // Perform action
    await page.click('[data-testid="submit"]');
    
    // Verify result
    await expect(page.getByText('Success')).toBeVisible();
  } catch (error) {
    // Take screenshot on failure (happens automatically in Playwright)
    await page.screenshot({ path: 'on-failure.png' });
    throw error;
  }
});
```

## PHASE 4: EXECUTE TESTS WITH PLAYWRIGHT MCP (5-10 min)

### Test Execution Strategy:

For each test scenario, execute using Playwright MCP:

```
Test Scenario: [Name]

Step 1: Navigate to [URL]
- Command: await page.goto('[URL]');
- Verify: Page loaded successfully

Step 2: Interact with [element]
- Command: await page.[action]('[selector]');
- Verify: Action completed

Step 3: Verify [expected behavior]
- Command: await expect([locator]).[assertion]();
- Result: ✅ Pass / ❌ Fail

Step 4: Capture evidence
- Screenshot: [If needed for verification]
- Console logs: [If debugging needed]
```

### Documentation for Each Test:

```
## Test: {test-name}

### Status: ✅ PASS / ❌ FAIL

### Execution Time: X.XX seconds

### Steps Performed:
1. [Action 1] - ✅ Success
2. [Action 2] - ✅ Success
3. [Action 3] - ❌ Failed: [Error message]

### Assertions:
- ✅ [Assertion 1] passed
- ✅ [Assertion 2] passed
- ❌ [Assertion 3] failed: Expected "X" but got "Y"

### Screenshots:
- [Screenshot 1]: Initial state
- [Screenshot 2]: After action
- [Screenshot 3]: Error state (if failed)

### Issues Found:
- [Description of any bugs discovered]
- [Severity: Critical/High/Medium/Low]
- [Steps to reproduce]
```

## PHASE 5: REPORT RESULTS (3-5 min)

### Comprehensive Test Report:

```
# Test Report: {feature-description}
Date: [Current date]
Duration: [Total execution time]

## Executive Summary
- Total Scenarios: X
- Passed: X (XX%)
- Failed: X (XX%)
- Skipped: X (XX%)

## Test Results

### ✅ PASSED TESTS (X/X)

#### 1. [Test Name]
- **Duration**: X.XX seconds
- **Scenario**: [Brief description]
- **Result**: All assertions passed
- **Screenshot**: [If available]

#### 2. [Test Name]
- **Duration**: X.XX seconds
- **Scenario**: [Brief description]
- **Result**: Feature works as expected
- **Screenshot**: [If available]

### ❌ FAILED TESTS (X/X)

#### 1. [Test Name]
- **Duration**: X.XX seconds
- **Scenario**: [Brief description]
- **Expected**: [What should happen]
- **Actual**: [What actually happened]
- **Error**: [Error message]
- **Screenshot**: [Failure screenshot]
- **Priority**: [Critical/High/Medium/Low]

## Issues Discovered

### Bug 1: [Issue Title]
- **Severity**: Critical/High/Medium/Low
- **Component**: [Affected component]
- **Steps to Reproduce**:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- **Expected Behavior**: [What should happen]
- **Actual Behavior**: [What actually happens]
- **Screenshot**: [Visual evidence]
- **Suggested Fix**: [If obvious]

### Bug 2: [Issue Title]
[Same structure...]

## Test Coverage Analysis

### Covered Scenarios:
✅ Happy path / primary flow
✅ Input validation
✅ Error handling
✅ Edge cases
✅ Accessibility (keyboard navigation)
✅ Responsive design (mobile/tablet/desktop)

### Not Covered (Recommendations):
- [ ] Performance under load
- [ ] Cross-browser testing (Safari, Firefox)
- [ ] Slow network conditions
- [ ] Offline behavior
- [ ] [Other scenarios...]

## Performance Observations

- Page load time: X.XX seconds
- Time to interactive: X.XX seconds
- API response times: X.XX seconds average
- Rendering performance: Smooth / Janky
- Memory usage: Normal / High

## Accessibility Findings

### ✅ Passed:
- Keyboard navigation works
- Focus indicators visible
- ARIA labels present
- Color contrast acceptable

### ❌ Issues:
- [Accessibility issue 1]
- [Accessibility issue 2]

## Recommendations

### Immediate Actions (High Priority):
1. [Fix critical bug X]
2. [Address accessibility issue Y]
3. [Improve error message Z]

### Improvements (Medium Priority):
1. [Enhancement suggestion 1]
2. [Enhancement suggestion 2]
3. [Performance optimization 3]

### Nice to Have (Low Priority):
1. [Polish item 1]
2. [UX improvement 2]

## Next Steps

1. **For Developers**:
   - Fix critical bugs found
   - Review failed test scenarios
   - Implement suggested improvements

2. **For Testing**:
   - Re-run tests after fixes
   - Add tests for uncovered scenarios
   - Perform manual exploratory testing

3. **For Product**:
   - Review UX findings
   - Prioritize improvements
   - Consider feature iterations
```

## IMPORTANT TESTING GUIDELINES

### Best Practices:

#### Test from User Perspective:
- Think like an end user, not a developer
- Test the "why" not just the "what"
- Follow realistic user journeys
- Don't just test happy paths

#### Write Maintainable Tests:
- Clear, descriptive test names
- One concept per test
- Independent tests (no interdependencies)
- Clean up after each test
- Use page objects for repeated elements

#### Comprehensive Coverage:
- Happy path (primary flow)
- Edge cases (empty, max, special chars)
- Error cases (failures, timeouts)
- Different user states
- Different devices/viewports
- Accessibility scenarios

### Common Testing Scenarios:

#### Forms:
- Required field validation
- Format validation (email, phone, etc.)
- Min/max length validation
- Special characters handling
- Submit button disabled until valid
- Error messages clear and helpful
- Success confirmation shown
- Form clears after submission

#### Navigation:
- All links work
- Correct pages load
- Back/forward buttons work
- Active page indication
- Mobile menu opens/closes
- Keyboard accessible

#### Interactive Elements:
- Buttons trigger correct actions
- Dropdowns show/hide properly
- Modals open/close correctly
- Tabs switch content
- Accordions expand/collapse
- Tooltips appear on hover

#### Data Display:
- Content renders correctly
- Loading states show appropriately
- Empty states handled gracefully
- Error states shown clearly
- Data updates reflected
- Pagination works

#### Responsive Behavior:
- Works on mobile (< 768px)
- Works on tablet (768px - 1024px)
- Works on desktop (> 1024px)
- Touch interactions work
- Gestures work (swipe, pinch)

### Accessibility Testing:

#### Keyboard Navigation:
```typescript
// Tab through interactive elements
await page.keyboard.press('Tab');
await page.keyboard.press('Tab');
await page.keyboard.press('Enter');

// Test Escape to close
await page.keyboard.press('Escape');

// Test arrow keys in lists
await page.keyboard.press('ArrowDown');
```

#### Screen Reader Simulation:
```typescript
// Check ARIA labels
await expect(page.getByRole('button')).toHaveAttribute('aria-label', 'Submit form');

// Check landmarks
await expect(page.getByRole('navigation')).toBeVisible();
await expect(page.getByRole('main')).toBeVisible();

// Check form labels
await expect(page.getByLabel('Email address')).toBeVisible();
```

#### Focus Management:
```typescript
// Check focus visible
await page.keyboard.press('Tab');
const focused = await page.locator(':focus');
await expect(focused).toHaveCSS('outline', expect.stringContaining(''));

// Check focus trap in modal
await page.keyboard.press('Tab');
// Focus should stay within modal
```

### Performance Checks:

```typescript
// Measure page load
const loadTime = await page.evaluate(() => {
  return window.performance.timing.loadEventEnd - 
         window.performance.timing.navigationStart;
});
expect(loadTime).toBeLessThan(3000); // 3 seconds

// Check for memory leaks
// Open and close feature multiple times
// Memory should not continuously grow
```

### Playwright MCP Tips:

- Use `page.screenshot()` for visual verification
- Use `page.pause()` to debug interactively
- Mock API responses for consistent testing
- Use fixtures for common test data
- Take video recordings for complex flows
- Check network requests: `page.on('request', ...)`
- Intercept API calls: `page.route()`

Start with PHASE 1 now.
