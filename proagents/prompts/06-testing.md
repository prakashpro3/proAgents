# Testing Prompts

Universal prompts for comprehensive testing phase.

---

## Quick Start

```
/test
```

Related commands:
- `/test-unit` - Run unit tests
- `/test-integration` - Run integration tests
- `/test-e2e` - Run end-to-end tests
- `/test-all` - Run all tests

---

## Testing Strategy

### Define Test Strategy

```
Define testing strategy for: [FEATURE_NAME]

UNIT TESTS (Target: 80%+ coverage):
- Components to test
- Functions to test
- Hooks to test

INTEGRATION TESTS:
- Component interactions
- API integrations
- State management flows

E2E TESTS:
- Critical user journeys
- Happy path scenarios
- Error scenarios

TEST PRIORITIES:
- P1: Must have before merge
- P2: Should have before release
- P3: Nice to have
```

---

## Unit Testing

### Generate Unit Tests

```
Generate unit tests for: [FUNCTION/COMPONENT]

Code to test:
[CODE]

Test cases needed:
1. Normal input - expected output
2. Edge cases (empty, null, undefined)
3. Boundary values
4. Error conditions
5. Async behavior (if applicable)

Follow project test pattern:
- Test framework: [Jest/Vitest/etc.]
- Assertion style: [expect/assert]
- Mock approach: [project's mocking pattern]
```

### Component Test Template

```
Generate component tests for: [COMPONENT_NAME]

Test categories:

RENDERING:
- Renders without crashing
- Renders with minimal props
- Renders with all props
- Renders different variants

INTERACTION:
- Click handlers called
- Input changes handled
- Form submission works
- Keyboard navigation works

STATE:
- Initial state correct
- State updates on interaction
- Loading states displayed
- Error states displayed

INTEGRATION:
- Works with child components
- Context consumers work
- Hooks behave correctly
```

### Function Test Template

```
Generate tests for function: [FUNCTION_NAME]

Function signature:
[FUNCTION SIGNATURE]

Test cases:

VALID INPUTS:
| Input | Expected Output |
|-------|-----------------|
| [val] | [result] |

EDGE CASES:
| Input | Expected Output |
|-------|-----------------|
| empty | [result] |
| null | [result] |
| undefined | [result] |

BOUNDARY VALUES:
| Input | Expected Output |
|-------|-----------------|
| min | [result] |
| max | [result] |

ERROR CASES:
| Input | Expected Error |
|-------|----------------|
| invalid | [error] |
```

### Hook Test Template

```
Generate tests for hook: [HOOK_NAME]

Hook:
[HOOK CODE]

Test cases:

INITIALIZATION:
- Returns expected initial values
- Sets up correctly with params

UPDATES:
- Updates on param changes
- Updates on action calls

SIDE EFFECTS:
- API calls made correctly
- Cleanup on unmount

ERROR HANDLING:
- Handles errors gracefully
- Returns error state
```

---

## Integration Testing

### Generate Integration Tests

```
Generate integration tests for: [FEATURE]

Components involved:
- [Component 1]
- [Component 2]
- [Service/API]

Flows to test:
1. [Flow 1]: User does X → Y happens
2. [Flow 2]: User does A → B happens

Mock requirements:
- [API endpoints to mock]
- [Services to mock]

Test structure:
- Setup: [initial state]
- Action: [user actions]
- Assert: [expected outcomes]
```

### API Integration Test

```
Generate API integration tests for: [ENDPOINT]

Endpoint: [METHOD] [URL]

Test cases:

SUCCESS CASES:
- Valid request → Success response
- With optional params → Correct filtering

ERROR CASES:
- Invalid input → 400 error
- Unauthorized → 401 error
- Not found → 404 error
- Server error → 500 error

EDGE CASES:
- Empty response
- Large payload
- Timeout handling
```

### State Management Test

```
Generate tests for state: [STORE/STATE]

State structure:
[STATE SHAPE]

Test cases:

INITIAL STATE:
- Has correct initial values

ACTIONS:
- [Action 1]: Updates state correctly
- [Action 2]: Updates state correctly

ASYNC ACTIONS:
- Sets loading state
- Handles success
- Handles error

SELECTORS:
- Returns correct derived data
- Memoization works
```

---

## E2E Testing

### Generate E2E Tests

```
Generate E2E tests for: [USER FLOW]

User journey:
1. User visits [page]
2. User sees [elements]
3. User clicks [element]
4. User fills [form]
5. User submits
6. User sees [result]

Test with:
- Framework: [Cypress/Playwright/etc.]
- Test data: [fixtures needed]

Cover:
- Happy path
- Error scenarios
- Edge cases
```

### E2E Test Template

```
E2E test for: [FEATURE]

```javascript
describe('[Feature Name]', () => {
  beforeEach(() => {
    // Setup: visit page, login if needed
  });

  it('should [happy path scenario]', () => {
    // Steps
    // Assertions
  });

  it('should handle [error scenario]', () => {
    // Setup error condition
    // Trigger error
    // Assert error handling
  });

  it('should [edge case]', () => {
    // Edge case setup
    // Actions
    // Assertions
  });
});
```
```

### Critical Path Tests

```
Generate tests for critical user paths:

PATH 1: [Name]
1. Entry point: [URL/action]
2. Steps: [user actions]
3. Success criteria: [expected outcome]
4. Failure handling: [error scenarios]

PATH 2: [Name]
...

Priority: Test these before any release
```

---

## Test Data & Mocking

### Generate Test Fixtures

```
Generate test fixtures for: [DATA TYPE]

Fixture requirements:
- Valid data examples
- Edge case data
- Invalid data examples
- Large dataset sample

Format:
```typescript
export const validUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

export const invalidUser = {
  // Missing required fields
};

export const userList = [
  // Multiple users for list testing
];
```
```

### Generate Mock Functions

```
Generate mocks for: [SERVICE/API]

Mock requirements:
```typescript
// Success mock
const mockSuccess = jest.fn().mockResolvedValue({
  data: [expected data]
});

// Error mock
const mockError = jest.fn().mockRejectedValue({
  message: 'Error message'
});

// Conditional mock
const mockConditional = jest.fn().mockImplementation((input) => {
  if (condition) return success;
  return failure;
});
```
```

### API Mock Setup

```
Setup API mocks for: [FEATURE]

Endpoints to mock:
```typescript
// GET /api/resource
server.use(
  rest.get('/api/resource', (req, res, ctx) => {
    return res(ctx.json({ data: [...] }));
  })
);

// POST /api/resource
server.use(
  rest.post('/api/resource', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ data: {...} }));
  })
);

// Error scenario
server.use(
  rest.get('/api/resource', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Server error' }));
  })
);
```
```

---

## Test Coverage

### Check Coverage

```
Analyze test coverage for: [FEATURE/MODULE]

Current coverage:
- Statements: [X]%
- Branches: [X]%
- Functions: [X]%
- Lines: [X]%

Target coverage:
- Minimum: 80%
- Recommended: 90%

Uncovered areas:
- [List uncovered code]

Recommended tests to add:
- [Test 1 to increase coverage]
- [Test 2 to increase coverage]
```

### Coverage Report Analysis

```
Analyze this coverage report:

[COVERAGE REPORT]

Identify:
1. Critical uncovered code
2. Edge cases not tested
3. Error paths not tested
4. Low-priority uncovered code

Recommend:
- High priority tests to add
- Medium priority tests
- Tests that can be skipped
```

---

## Test Quality

### Review Test Quality

```
Review test quality for: [TEST FILE]

Tests:
[TEST CODE]

Check for:
□ Tests are isolated (no dependencies)
□ Tests are deterministic (same result)
□ Tests are focused (one concern each)
□ Tests have clear names
□ Tests use proper assertions
□ Tests cover edge cases
□ Tests are maintainable
□ No flaky tests
```

### Improve Test

```
Improve this test:

Current test:
[TEST CODE]

Issues:
- [Issue 1]
- [Issue 2]

Improve by:
- Making assertions more specific
- Adding missing edge cases
- Improving test isolation
- Better test organization
```

---

## Regression Testing

### Regression Test Plan

```
Create regression test plan for: [FEATURE]

Areas at risk:
- [Area 1] - [why]
- [Area 2] - [why]

Regression tests needed:
1. [Test existing functionality 1]
2. [Test existing functionality 2]
3. [Test integration points]

Automated regression:
- [List automated tests to run]

Manual regression:
- [List manual checks if needed]
```

---

## Performance Testing

### Performance Test Cases

```
Generate performance tests for: [FEATURE]

Metrics to measure:
- Render time
- Re-render count
- Memory usage
- API response time

Test scenarios:
1. Initial load performance
2. Performance with large data
3. Performance under stress
4. Memory leak detection

Thresholds:
- Max render time: [X]ms
- Max re-renders: [X]
- Memory growth: < [X]%
```

---

## Accessibility Testing

### A11y Test Cases

```
Generate accessibility tests for: [COMPONENT]

Test for:
□ Keyboard navigation works
□ Focus order is logical
□ Focus indicators visible
□ ARIA attributes correct
□ Screen reader announces correctly
□ Color contrast sufficient
□ Touch targets adequate (44px)
□ Form labels associated
□ Error messages announced
□ Loading states announced
```

---

## Test Checklist

```
Testing checklist for: [FEATURE]

UNIT TESTS:
□ All components have tests
□ All utility functions tested
□ All hooks tested
□ Edge cases covered
□ Error cases covered

INTEGRATION TESTS:
□ Component interactions tested
□ API integrations tested
□ State management tested

E2E TESTS:
□ Happy path tested
□ Error scenarios tested
□ Critical paths tested

COVERAGE:
□ Statements: [X]% (target: 80%)
□ Branches: [X]% (target: 75%)
□ Functions: [X]% (target: 80%)

QUALITY:
□ No flaky tests
□ Tests run fast
□ Tests are maintainable
□ CI/CD passes
```

---

## Slash Commands Reference

| Command | Description |
|---------|-------------|
| `/test` | Show testing overview |
| `/test-unit` | Generate/run unit tests |
| `/test-integration` | Generate/run integration tests |
| `/test-e2e` | Generate/run E2E tests |
| `/test-all` | Run all tests |
| `/test-coverage` | Check test coverage |
| `/test-fixtures` | Generate test fixtures |
| `/test-mocks` | Generate mock functions |
