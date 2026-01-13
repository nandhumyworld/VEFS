# Add Features Command

Systematically implement new features from a markdown requirements file.

## Usage

```
/add-features <requirements-file-path>
```

## Arguments

- `requirements-file-path`: Path to markdown file containing features under `## Features` section

## Examples

```
/add-features requirements.md
/add-features docs/sprint-23-features.md
/add-features backlog/new-features.md
```

## Prompt

I need you to implement new features from the requirements file: {requirements-file-path}

Follow this systematic workflow:

## PHASE 1: PARSE REQUIREMENTS (2 min)
1. Read the file: {requirements-file-path}
2. Extract all items under "## Features" section
3. For each feature, identify:
   - Feature description
   - Acceptance criteria (if mentioned)
   - Dependencies on other features
4. Present the parsed features list and ask for confirmation before proceeding

## PHASE 2: CODEBASE ANALYSIS (5-10 min)
1. Analyze current project structure:
   - Identify framework/tech stack (React, Next.js, vanilla JS, etc.)
   - Map component/module structure
   - Identify state management approach (Redux, Context, Zustand, etc.)
   - Note existing patterns (naming conventions, file organization, styling approach)
   - Check for existing utilities/helpers that can be reused
   - Identify API structure and data flow

2. For each feature, determine:
   - Which files need to be created
   - Which files need to be modified
   - Dependencies between features (implementation order)
   - Potential conflicts with existing code
   - Required packages/dependencies

3. Present analysis summary with:
   - Project structure overview
   - Tech stack identified
   - Proposed implementation order
   - Files to be created/modified
   - Any concerns or questions

## PHASE 3: IMPLEMENTATION PLANNING (5 min)
1. Create execution order based on:
   - **Dependencies**: Foundational features first (data models, utilities, API endpoints)
   - **Risk level**: Low-risk first to build confidence
   - **Logical grouping**: Related features together
   - **Infrastructure**: Backend/API before frontend if needed

2. For each feature, specify:
   - Exact files to create/modify
   - Implementation approach
   - Integration points
   - Testing strategy

3. Present the execution plan:
   ```
   Feature Execution Order:
   1. [Feature Name] - [Rationale]
      Files: [list]
      Approach: [brief description]
   
   2. [Feature Name] - [Rationale]
      Files: [list]
      Approach: [brief description]
   ```

4. Get approval before proceeding to implementation

## PHASE 4: SYSTEMATIC IMPLEMENTATION (Variable)
For EACH feature in execution order:

### Step 1: Pre-implementation (2 min)
- Review relevant existing code
- Identify exact insertion/modification points
- Note edge cases and error scenarios
- List any clarifications needed

### Step 2: Implement Feature (10-30 min)
- Create/modify files following existing patterns
- **Follow project conventions**:
  - Match existing naming conventions
  - Use same import style
  - Follow existing component patterns
  - Use project's state management approach
  - Match styling approach (CSS modules, styled-components, Tailwind, etc.)
  
- **Code quality**:
  - Add comprehensive error handling
  - Include inline comments for complex logic
  - Use meaningful variable/function names
  - Extract reusable logic to utilities
  - Avoid code duplication

- **Best practices**:
  - Write semantic HTML
  - Ensure accessibility (ARIA labels, keyboard navigation)
  - Responsive design considerations
  - Performance optimization (lazy loading, memoization)
  - SEO considerations (meta tags, semantic structure)

### Step 3: Self-validate (3 min)
- Review the code changes:
  - Syntax errors check
  - Logic correctness
  - Edge cases handled
  - Error messages clear and helpful
  - No console.logs left in production code
  
- Verify feature completeness:
  - All acceptance criteria met
  - Integration points working
  - Follows existing patterns
  - No breaking changes to existing features

### Step 4: Document Changes (1 min)
- Add inline comments where logic is complex
- Update relevant documentation files
- Note any breaking changes
- Document new APIs/functions

### Step 5: Report Progress (1 min)
After each feature, provide:
```
✅ Feature Implemented: [Feature Name]

Files Created:
- path/to/new/file.js

Files Modified:
- path/to/existing/file.js (added X functionality)
- path/to/another/file.js (updated Y logic)

Key Changes:
- [Brief description of main changes]

Decisions Made:
- [Any implementation decisions or tradeoffs]

Questions/Blockers:
- [Any issues or clarifications needed]

Next: [Next feature name]
```

### Step 6: Move to Next Feature
Continue with next feature in execution order

## PHASE 5: FINAL VALIDATION (5-10 min)
1. Review all changes holistically:
   - Check consistency across features
   - Ensure no duplicate code
   - Verify proper error handling everywhere
   - Confirm all features work together
   - Check for unintended side effects

2. Create comprehensive summary:
   ```
   ## Implementation Summary
   
   ### Features Implemented: [X/X]
   ✅ Feature 1: [Name]
   ✅ Feature 2: [Name]
   ✅ Feature 3: [Name]
   
   ### Files Created: [X]
   - path/to/file1.js - [Description]
   - path/to/file2.js - [Description]
   
   ### Files Modified: [X]
   - path/to/file1.js - [Changes]
   - path/to/file2.js - [Changes]
   
   ### Key Implementation Details:
   - [Important architectural decisions]
   - [Patterns used]
   - [Libraries/dependencies added]
   
   ### Testing Recommendations:
   - [ ] Test feature 1: [Test scenario]
   - [ ] Test feature 2: [Test scenario]
   - [ ] Test integration between features
   - [ ] Test on mobile devices
   - [ ] Test accessibility with keyboard
   - [ ] Test error scenarios
   
   ### Manual Testing Checklist:
   1. [Specific test case]
   2. [Specific test case]
   3. [Specific test case]
   
   ### Next Steps:
   - [Suggestions for improvements]
   - [Features that could be added next]
   - [Performance optimizations to consider]
   ```

## IMPORTANT GUIDELINES

### Code Quality Standards:
- **Follow existing patterns**: Match the project's current code style, structure, and conventions
- **Don't over-engineer**: Keep solutions simple and maintainable
- **Reuse, don't duplicate**: Use existing utilities, components, and helpers
- **Think ahead**: Consider how features interact with each other
- **Write clean code**: Readable, well-structured, properly formatted

### Technical Requirements:
- Write clean, readable code with meaningful names
- Add error handling for all edge cases
- Follow accessibility best practices (WCAG 2.1 AA)
- Ensure responsive design (mobile-first approach)
- Use semantic HTML elements
- Optimize performance (code splitting, lazy loading, efficient algorithms)
- Consider SEO implications (meta tags, structured data, semantic markup)
- Add proper TypeScript types if project uses TypeScript

### Communication:
- **Ask when unclear**: If requirements are ambiguous, ask for clarification
- **One feature at a time**: Complete each feature fully before moving to next
- **Quality over speed**: Proper implementation is better than quick hacks
- **Explain decisions**: If making architectural choices, explain reasoning
- **Report blockers**: If stuck, communicate clearly what's blocking progress

### Best Practices:
- **Error handling**: Try-catch blocks, validation, user-friendly error messages
- **Loading states**: Show loading indicators for async operations
- **Empty states**: Handle cases where data is empty or not available
- **Edge cases**: Handle null, undefined, empty arrays, API failures
- **Validation**: Client-side and server-side validation for forms
- **Security**: Sanitize inputs, prevent XSS, CSRF protection
- **Performance**: Debounce/throttle expensive operations, optimize re-renders

### Frontend Specific:
- **Component structure**: Break down into reusable components
- **State management**: Use appropriate state solution (local, context, global)
- **Event handling**: Clean up event listeners, prevent memory leaks
- **Forms**: Proper validation, error messages, submit handling
- **Styling**: Follow existing CSS methodology (BEM, CSS Modules, styled-components)
- **Responsive**: Mobile-first, breakpoints at 640px, 768px, 1024px, 1280px
- **Accessibility**: ARIA labels, keyboard navigation, focus management, color contrast

### Backend Specific (if applicable):
- **API design**: RESTful endpoints, proper HTTP methods and status codes
- **Validation**: Input validation, sanitization, type checking
- **Error handling**: Proper error responses with meaningful messages
- **Database**: Efficient queries, proper indexing, transaction handling
- **Security**: Authentication, authorization, rate limiting
- **Logging**: Structured logging for debugging and monitoring

Start with PHASE 1 now.
