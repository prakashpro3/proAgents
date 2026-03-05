# Test Naming Conventions

Consistent naming patterns for tests, files, and test suites.

---

## File Naming

### Test File Patterns

| Pattern | Usage | Example |
|---------|-------|---------|
| `*.test.ts` | Unit tests | `userService.test.ts` |
| `*.spec.ts` | Unit/integration tests | `userService.spec.ts` |
| `*.integration.test.ts` | Integration tests | `database.integration.test.ts` |
| `*.e2e.test.ts` | End-to-end tests | `checkout.e2e.test.ts` |

### Configuration

```yaml
# proagents.config.yaml
testing:
  naming:
    # File patterns
    files:
      unit: "{name}.test.ts"
      integration: "{name}.integration.test.ts"
      e2e: "{name}.e2e.test.ts"

    # Test directory structure
    structure:
      colocated: false  # Tests next to source files
      separate: true    # Tests in __tests__ directory

    # Describe blocks
    describe:
      style: "PascalCase"  # Match class/component names

    # It blocks
    it:
      prefix: "should"
      style: "sentence"
```

---

## Test Suite Naming

### Describe Block Patterns

```typescript
// For classes: Use class name
describe('UserService', () => {
  // Tests here
});

// For functions: Use function name
describe('validateEmail', () => {
  // Tests here
});

// For components: Use component name
describe('UserProfileCard', () => {
  // Tests here
});

// For modules: Use module path
describe('services/auth', () => {
  // Tests here
});
```

### Nested Describe Patterns

```typescript
// Method grouping
describe('UserService', () => {
  describe('createUser', () => {
    // Tests for createUser
  });

  describe('deleteUser', () => {
    // Tests for deleteUser
  });
});

// Context grouping (Given-When-Then style)
describe('OrderService', () => {
  describe('calculateTotal', () => {
    describe('given valid items', () => {
      describe('when calculating with tax', () => {
        it('should include tax in total', () => {
          // Test
        });
      });
    });

    describe('given empty cart', () => {
      it('should return zero', () => {
        // Test
      });
    });
  });
});

// State grouping
describe('ShoppingCart', () => {
  describe('when empty', () => {
    it('should have zero items', () => {});
    it('should have zero total', () => {});
  });

  describe('when has items', () => {
    it('should calculate correct total', () => {});
    it('should allow item removal', () => {});
  });
});
```

---

## Test Case Naming

### The "should" Pattern

```typescript
// ✅ Good: Describes expected behavior
it('should return user when valid ID provided', () => {});
it('should throw NotFoundError when user does not exist', () => {});
it('should hash password before saving', () => {});

// ❌ Bad: Vague or implementation-focused
it('test user', () => {});
it('works correctly', () => {});
it('calls the database', () => {});
```

### Naming Formula

```
it('should [expected behavior] when [condition/context]')

Examples:
- 'should return null when user not found'
- 'should throw ValidationError when email is invalid'
- 'should emit event when order is placed'
- 'should redirect to login when session expires'
```

### Action-Based Naming

```typescript
// For actions/mutations
it('should create user with hashed password', () => {});
it('should update order status to shipped', () => {});
it('should delete all related records', () => {});

// For queries/reads
it('should return all active users', () => {});
it('should find order by tracking number', () => {});
it('should calculate correct discount amount', () => {});

// For side effects
it('should send welcome email after registration', () => {});
it('should log error when payment fails', () => {});
it('should invalidate cache after update', () => {});
```

---

## Edge Case Naming

### Error Cases

```typescript
describe('UserService', () => {
  describe('getUser', () => {
    // Happy path
    it('should return user when valid ID provided', () => {});

    // Error cases - explicit about the error
    it('should throw NotFoundError when user does not exist', () => {});
    it('should throw ValidationError when ID is invalid format', () => {});
    it('should throw AuthorizationError when user lacks permission', () => {});
  });
});
```

### Boundary Cases

```typescript
describe('validateAge', () => {
  // Boundaries named explicitly
  it('should reject age below minimum (0)', () => {});
  it('should accept minimum valid age (1)', () => {});
  it('should accept maximum valid age (120)', () => {});
  it('should reject age above maximum (121)', () => {});

  // Edge values
  it('should handle null input', () => {});
  it('should handle undefined input', () => {});
  it('should handle negative numbers', () => {});
});
```

### Special Cases

```typescript
describe('formatCurrency', () => {
  it('should format positive amounts with currency symbol', () => {});
  it('should format negative amounts with minus sign', () => {});
  it('should format zero as $0.00', () => {});
  it('should round to two decimal places', () => {});
  it('should handle very large numbers', () => {});
  it('should handle very small decimals', () => {});
});
```

---

## Integration Test Naming

### API Tests

```typescript
describe('POST /api/users', () => {
  it('should create user and return 201', () => {});
  it('should return 400 when email is missing', () => {});
  it('should return 409 when email already exists', () => {});
  it('should return 401 when not authenticated', () => {});
});

describe('GET /api/users/:id', () => {
  it('should return user when exists', () => {});
  it('should return 404 when user not found', () => {});
});
```

### Database Tests

```typescript
describe('UserRepository', () => {
  describe('with PostgreSQL', () => {
    it('should persist user to database', () => {});
    it('should retrieve user by email', () => {});
    it('should update user fields', () => {});
    it('should handle concurrent updates', () => {});
  });
});
```

---

## E2E Test Naming

### User Journey Pattern

```typescript
describe('User Registration Flow', () => {
  it('should complete registration with valid data', () => {});
  it('should show validation errors for invalid email', () => {});
  it('should redirect to dashboard after successful registration', () => {});
});

describe('Checkout Flow', () => {
  it('should complete purchase with credit card', () => {});
  it('should apply discount code correctly', () => {});
  it('should show order confirmation after payment', () => {});
});
```

### Feature-Based Pattern

```typescript
describe('Feature: User Authentication', () => {
  describe('Scenario: Successful login', () => {
    it('should allow login with valid credentials', () => {});
    it('should display user dashboard after login', () => {});
  });

  describe('Scenario: Failed login', () => {
    it('should show error for invalid password', () => {});
    it('should lock account after 5 failed attempts', () => {});
  });
});
```

---

## Component Test Naming

### React Component Tests

```typescript
describe('LoginForm', () => {
  // Rendering
  it('should render email and password inputs', () => {});
  it('should render submit button', () => {});

  // User interactions
  it('should update email field on input', () => {});
  it('should call onSubmit with credentials when form submitted', () => {});

  // States
  it('should disable submit button when loading', () => {});
  it('should display error message when login fails', () => {});

  // Accessibility
  it('should have accessible form labels', () => {});
  it('should focus first input on mount', () => {});
});
```

### Snapshot Tests

```typescript
describe('Button', () => {
  it('should match snapshot for primary variant', () => {});
  it('should match snapshot for secondary variant', () => {});
  it('should match snapshot for disabled state', () => {});
});
```

---

## Anti-Patterns

### Names to Avoid

```typescript
// ❌ Too vague
it('works', () => {});
it('test 1', () => {});
it('should work correctly', () => {});

// ❌ Implementation-focused (not behavior)
it('calls fetchUser function', () => {});
it('sets state to loading', () => {});
it('uses the cache', () => {});

// ❌ Negative phrasing (confusing)
it('should not not fail', () => {});
it('should not throw when valid', () => {});  // Better: 'should succeed when valid'

// ❌ Multiple behaviors in one name
it('should validate, save, and send email', () => {});

// ❌ Copy-paste artifacts
it('should create user (copy)', () => {});
it('should create user 2', () => {});
```

### Better Alternatives

```typescript
// ✅ Clear and specific
it('should return user data when valid ID provided', () => {});

// ✅ Behavior-focused
it('should hash password before saving to database', () => {});

// ✅ Positive phrasing
it('should succeed when input is valid', () => {});

// ✅ Single behavior per test
it('should validate email format', () => {});
it('should save user to database', () => {});
it('should send welcome email', () => {});
```

---

## Parameterized Test Naming

### Table-Driven Tests

```typescript
describe('validateEmail', () => {
  // Use descriptive table headers
  it.each([
    ['user@example.com', true, 'standard email'],
    ['user.name@example.co.uk', true, 'email with subdomain'],
    ['invalid', false, 'missing @ symbol'],
    ['user@', false, 'missing domain'],
  ])(
    'should return %s for %s (%s)',
    (email, expected, description) => {
      expect(validateEmail(email)).toBe(expected);
    }
  );
});

// Alternative: descriptive name in test
describe('calculateDiscount', () => {
  it.each([
    { orderTotal: 100, expected: 0, description: 'no discount for small orders' },
    { orderTotal: 500, expected: 25, description: '5% discount for medium orders' },
    { orderTotal: 1000, expected: 100, description: '10% discount for large orders' },
  ])(
    'should apply $description ($orderTotal -> $expected)',
    ({ orderTotal, expected }) => {
      expect(calculateDiscount(orderTotal)).toBe(expected);
    }
  );
});
```

---

## Commands

```bash
# Check test naming conventions
proagents test lint --check-naming

# Auto-fix naming issues
proagents test lint --fix-naming

# Generate test file with correct naming
proagents test scaffold UserService

# Validate all test names
proagents test validate --naming-only
```

---

## Configuration Examples

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/*.spec.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
```

### ESLint Rules

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['jest'],
  rules: {
    'jest/valid-title': [
      'error',
      {
        mustMatch: {
          it: '^should ',
          test: '^should ',
        },
        mustNotMatch: {
          it: ['\\.$', 'Ends with period'],
        },
      },
    ],
    'jest/lowercase-name': [
      'error',
      {
        ignore: ['describe'],
      },
    ],
  },
};
```

---

## Best Practices

1. **Be Descriptive**: Names should explain what is being tested without reading the code
2. **Use "should"**: Start test names with "should" for consistent, readable tests
3. **Include Context**: Mention the condition or scenario being tested
4. **One Behavior Per Test**: Each test should verify a single behavior
5. **Avoid Implementation Details**: Focus on behavior, not internal implementation
6. **Match File to Source**: Test file names should match source file names
7. **Group Related Tests**: Use nested describe blocks for logical grouping
8. **Be Consistent**: Follow the same naming patterns across the entire project
