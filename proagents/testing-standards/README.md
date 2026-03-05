# Testing Standards

Comprehensive testing guidelines and standards for consistent quality.

---

## Overview

Define testing requirements, coverage targets, and best practices for your project.

## Documentation

| Document | Description |
|----------|-------------|
| [Coverage Requirements](./coverage-requirements.md) | Minimum coverage targets |
| [Test Patterns](./test-patterns.md) | Unit, integration, E2E patterns |
| [Mocking Guidelines](./mocking-guidelines.md) | When and how to mock |
| [Test Naming](./test-naming.md) | Naming conventions |

---

## Coverage Requirements

### By Project Type

| Project Type | Unit | Integration | E2E |
|--------------|------|-------------|-----|
| Web Frontend | 80% | 60% | Critical flows |
| Full-stack | 80% | 70% | Critical flows |
| Mobile | 75% | 60% | Smoke tests |
| Backend/API | 85% | 75% | N/A |

### Configuration

```yaml
# proagents.config.yaml
testing:
  coverage:
    minimum: 80
    fail_under: true

    by_directory:
      "src/core/": 90
      "src/utils/": 85
      "src/ui/": 70
```

---

## Test Structure

### Unit Tests

```typescript
// Good: Focused, isolated
describe('calculateTotal', () => {
  it('should sum all items', () => {
    const items = [{ price: 10 }, { price: 20 }];
    expect(calculateTotal(items)).toBe(30);
  });

  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('should handle negative prices', () => {
    const items = [{ price: 10 }, { price: -5 }];
    expect(calculateTotal(items)).toBe(5);
  });
});
```

### Integration Tests

```typescript
// Test component with dependencies
describe('UserProfile', () => {
  it('should fetch and display user data', async () => {
    // Setup
    const mockUser = { id: 1, name: 'John' };
    server.use(
      rest.get('/api/users/1', (req, res, ctx) => {
        return res(ctx.json(mockUser));
      })
    );

    // Act
    render(<UserProfile userId={1} />);

    // Assert
    await screen.findByText('John');
  });
});
```

### E2E Tests

```typescript
// Test complete user flow
describe('Login Flow', () => {
  it('should login and redirect to dashboard', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back');
  });
});
```

---

## Test Naming Convention

### Format

```
describe('[Component/Function Name]', () => {
  it('should [expected behavior] when [condition]', () => {
    // ...
  });
});
```

### Examples

```typescript
// Good
it('should return null when user is not found')
it('should throw error when input is invalid')
it('should update state when button is clicked')

// Bad
it('test1')
it('works correctly')
it('handles edge case')
```

---

## Mocking Guidelines

### When to Mock

| Mock | Don't Mock |
|------|------------|
| External APIs | Business logic |
| Database calls | Pure functions |
| Time/Date | Internal modules |
| Random values | Simple utilities |
| Third-party services | |

### Mock Example

```typescript
// Mock external service
jest.mock('../services/api', () => ({
  fetchUser: jest.fn(),
}));

// Mock time
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-15'));

// Mock random
jest.spyOn(Math, 'random').mockReturnValue(0.5);
```

---

## Test Commands

```bash
# Run all tests
proagents test

# Run with coverage
proagents test --coverage

# Run specific type
proagents test --type unit
proagents test --type integration
proagents test --type e2e

# Watch mode
proagents test --watch

# Run for changed files only
proagents test --changed
```

---

## Test Reports

```
┌─────────────────────────────────────────────────────────────┐
│ Test Results                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Tests: 245 passed, 2 failed, 247 total                     │
│ Time: 12.5s                                                 │
│                                                             │
│ Coverage:                                                   │
│ ├── Statements: 85.2% (target: 80%) ✅                      │
│ ├── Branches: 78.5% (target: 75%) ✅                        │
│ ├── Functions: 88.1% (target: 80%) ✅                       │
│ └── Lines: 84.8% (target: 80%) ✅                           │
│                                                             │
│ Failed Tests:                                               │
│ ├── UserService.test.ts:45 - timeout                       │
│ └── LoginForm.test.ts:82 - assertion failed                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what, not how
2. **Keep Tests Independent**: No shared state between tests
3. **Use Descriptive Names**: Clear intent in test names
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **One Assertion Per Test**: When possible
6. **Test Edge Cases**: Empty, null, boundary values
7. **Don't Test Frameworks**: Trust library code
8. **Maintain Test Quality**: Tests are code too
