# Testing Standards Template

Copy this file to `testing-standards.md` and customize for your project.

---

## Testing Framework

**Unit Tests:** [Jest | Vitest | Mocha | pytest]
**Integration Tests:** [Jest | Supertest | pytest]
**E2E Tests:** [Playwright | Cypress | Selenium]
**Component Tests:** [Testing Library | Enzyme]

---

## Coverage Requirements

| Type | Minimum Coverage |
|------|------------------|
| Overall | [80% | 85% | 90%] |
| Critical paths | [95% | 100%] |
| New code | [80% | 90%] |
| Utilities | [90% | 100%] |

---

## Test File Organization

```
src/
├── components/
│   ├── UserCard.tsx
│   └── UserCard.test.tsx      # Co-located
└── __tests__/                  # Or centralized
    └── integration/
        └── user-flow.test.ts
```

**Approach:** [Co-located | Centralized | Both]

---

## Unit Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  // Group related tests
  describe('when [condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

---

## What to Test

### Components
- [ ] Renders without crashing
- [ ] Renders correct content based on props
- [ ] Handles user interactions
- [ ] Shows correct states (loading, error, empty)
- [ ] Accessibility (labels, roles)

### Hooks
- [ ] Returns correct initial state
- [ ] Updates state correctly
- [ ] Handles edge cases
- [ ] Cleans up properly

### Services/API
- [ ] Makes correct API calls
- [ ] Handles success responses
- [ ] Handles error responses
- [ ] Handles loading states

### Utilities
- [ ] Returns correct output for valid input
- [ ] Handles edge cases
- [ ] Throws/returns appropriate errors for invalid input

---

## Mocking Guidelines

### Do Mock
- External API calls
- Third-party services
- Time/date functions
- Random values
- File system operations

### Don't Mock
- The component/function under test
- Simple utility functions
- React hooks (use Testing Library's approach)

---

## Test Data

```typescript
// Use factories for test data
const createUser = (overrides = {}): User => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

// Usage
const user = createUser({ name: 'Custom Name' });
```

---

## Async Testing

```typescript
// Always await async operations
it('fetches user data', async () => {
  render(<UserProfile userId="1" />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

---

## Integration Test Patterns

```typescript
describe('User Authentication Flow', () => {
  it('allows user to log in and view dashboard', async () => {
    // 1. Navigate to login
    // 2. Fill in credentials
    // 3. Submit form
    // 4. Verify redirect to dashboard
    // 5. Verify user data displayed
  });
});
```

---

## E2E Test Patterns

```typescript
// Playwright example
test('complete checkout flow', async ({ page }) => {
  // 1. Add item to cart
  await page.goto('/products/1');
  await page.click('[data-testid="add-to-cart"]');

  // 2. Go to checkout
  await page.click('[data-testid="checkout"]');

  // 3. Fill shipping info
  // 4. Complete payment
  // 5. Verify confirmation
});
```

---

## Snapshot Testing

**When to use:**
- UI components with stable output
- Error messages
- Generated content

**When NOT to use:**
- Dynamic content
- Frequently changing components
- Large component trees

---

## Performance Testing

- Measure render times for critical components
- Test with realistic data volumes
- Monitor bundle size changes
- Set performance budgets

---

## CI/CD Integration

```yaml
# Example CI config
test:
  script:
    - npm run test:unit
    - npm run test:integration
    - npm run test:e2e
  coverage:
    minimum: 80%
    fail_under: true
```
