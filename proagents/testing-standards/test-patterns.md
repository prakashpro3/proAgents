# Test Patterns

Common testing patterns and best practices.

---

## Test Structure

### AAA Pattern (Arrange-Act-Assert)

```typescript
describe('OrderService', () => {
  describe('calculateTotal', () => {
    it('should calculate total with tax', () => {
      // Arrange
      const items = [
        { name: 'Widget', price: 10, quantity: 2 },
        { name: 'Gadget', price: 25, quantity: 1 },
      ];
      const taxRate = 0.1;

      // Act
      const total = orderService.calculateTotal(items, taxRate);

      // Assert
      expect(total).toBe(49.5); // (20 + 25) * 1.1
    });
  });
});
```

### Given-When-Then (BDD)

```typescript
describe('User Registration', () => {
  describe('given valid registration data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User',
    };

    describe('when registering a new user', () => {
      let result: User;

      beforeEach(async () => {
        result = await userService.register(validData);
      });

      it('then should create the user', () => {
        expect(result.id).toBeDefined();
      });

      it('then should hash the password', () => {
        expect(result.password).not.toBe(validData.password);
      });

      it('then should send welcome email', () => {
        expect(emailService.send).toHaveBeenCalledWith(
          expect.objectContaining({ to: validData.email })
        );
      });
    });
  });
});
```

---

## Test Categories

### Unit Tests

```typescript
// Unit test: Tests a single function/method in isolation
describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});
```

### Integration Tests

```typescript
// Integration test: Tests multiple components working together
describe('UserRepository', () => {
  let repository: UserRepository;
  let db: Database;

  beforeAll(async () => {
    db = await createTestDatabase();
    repository = new UserRepository(db);
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.clear('users');
  });

  it('should create and retrieve user', async () => {
    const user = await repository.create({
      email: 'test@example.com',
      name: 'Test User',
    });

    const retrieved = await repository.findById(user.id);

    expect(retrieved).toEqual(user);
  });
});
```

### E2E Tests

```typescript
// E2E test: Tests complete user flows
describe('Checkout Flow', () => {
  let page: Page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('/');
  });

  afterEach(async () => {
    await page.close();
  });

  it('should complete purchase', async () => {
    // Add item to cart
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="cart-icon"]');

    // Checkout
    await page.click('[data-testid="checkout-button"]');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="card"]', '4242424242424242');
    await page.click('[data-testid="pay-button"]');

    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
```

---

## Common Patterns

### Test Factories

```typescript
// factories/user.factory.ts
interface UserFactoryOptions {
  email?: string;
  name?: string;
  role?: 'user' | 'admin';
}

export function createUser(options: UserFactoryOptions = {}): User {
  return {
    id: faker.string.uuid(),
    email: options.email ?? faker.internet.email(),
    name: options.name ?? faker.person.fullName(),
    role: options.role ?? 'user',
    createdAt: new Date(),
  };
}

// Usage
const user = createUser({ role: 'admin' });
const users = Array.from({ length: 10 }, () => createUser());
```

### Test Builders

```typescript
// builders/order.builder.ts
export class OrderBuilder {
  private order: Partial<Order> = {};

  withCustomer(customer: Customer): this {
    this.order.customer = customer;
    return this;
  }

  withItems(items: OrderItem[]): this {
    this.order.items = items;
    return this;
  }

  withStatus(status: OrderStatus): this {
    this.order.status = status;
    return this;
  }

  withShipping(address: Address): this {
    this.order.shippingAddress = address;
    return this;
  }

  build(): Order {
    return {
      id: faker.string.uuid(),
      customer: this.order.customer ?? createCustomer(),
      items: this.order.items ?? [createOrderItem()],
      status: this.order.status ?? 'pending',
      shippingAddress: this.order.shippingAddress ?? createAddress(),
      createdAt: new Date(),
    };
  }
}

// Usage
const order = new OrderBuilder()
  .withCustomer(vipCustomer)
  .withStatus('completed')
  .build();
```

### Test Fixtures

```typescript
// fixtures/index.ts
export const fixtures = {
  users: {
    admin: createUser({ role: 'admin', email: 'admin@test.com' }),
    regular: createUser({ role: 'user', email: 'user@test.com' }),
  },
  products: {
    widget: { id: '1', name: 'Widget', price: 10 },
    gadget: { id: '2', name: 'Gadget', price: 25 },
  },
  orders: {
    pending: new OrderBuilder().withStatus('pending').build(),
    completed: new OrderBuilder().withStatus('completed').build(),
  },
};

// Usage
it('should allow admin to delete user', async () => {
  await loginAs(fixtures.users.admin);
  await userService.delete(fixtures.users.regular.id);
});
```

---

## Test Isolation

### Database Isolation

```typescript
// hooks/database.ts
export function useTestDatabase() {
  let db: Database;

  beforeAll(async () => {
    db = await createTestDatabase();
    await db.migrate();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.truncateAll();
  });

  return () => db;
}

// Usage
describe('UserService', () => {
  const getDb = useTestDatabase();

  it('should create user', async () => {
    const db = getDb();
    const service = new UserService(db);
    // ...
  });
});
```

### Transaction Rollback

```typescript
// hooks/transaction.ts
export function useTransaction() {
  let transaction: Transaction;

  beforeEach(async () => {
    transaction = await db.beginTransaction();
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  return () => transaction;
}
```

---

## Async Testing

### Promises

```typescript
// Testing async functions
it('should fetch user', async () => {
  const user = await userService.getById('123');
  expect(user.name).toBe('Test User');
});

// Testing rejected promises
it('should throw on invalid id', async () => {
  await expect(userService.getById('invalid')).rejects.toThrow('User not found');
});
```

### Timers

```typescript
// Testing setTimeout/setInterval
describe('Scheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should schedule task', () => {
    const callback = jest.fn();
    scheduler.scheduleIn(1000, callback);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

### Event Emitters

```typescript
// Testing events
it('should emit event on save', async () => {
  const eventHandler = jest.fn();
  eventEmitter.on('user.saved', eventHandler);

  await userService.save(user);

  expect(eventHandler).toHaveBeenCalledWith(
    expect.objectContaining({ userId: user.id })
  );
});
```

---

## Error Testing

### Expected Errors

```typescript
// Testing thrown errors
it('should throw ValidationError for invalid input', () => {
  expect(() => validateUser({ email: 'invalid' })).toThrow(ValidationError);
});

// Testing error properties
it('should include field in validation error', () => {
  try {
    validateUser({ email: 'invalid' });
    fail('Should have thrown');
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.field).toBe('email');
  }
});

// Testing async errors
it('should reject with NotFoundError', async () => {
  await expect(userService.getById('nonexistent'))
    .rejects.toBeInstanceOf(NotFoundError);
});
```

---

## Parameterized Tests

### Table-Driven Tests

```typescript
describe('calculateDiscount', () => {
  it.each([
    { orderTotal: 100, expectedDiscount: 0 },
    { orderTotal: 500, expectedDiscount: 25 },
    { orderTotal: 1000, expectedDiscount: 100 },
    { orderTotal: 2000, expectedDiscount: 300 },
  ])(
    'should return $expectedDiscount discount for $orderTotal order',
    ({ orderTotal, expectedDiscount }) => {
      expect(calculateDiscount(orderTotal)).toBe(expectedDiscount);
    }
  );
});

// With descriptive names
describe('email validation', () => {
  const validEmails = [
    'user@example.com',
    'user.name@example.co.uk',
    'user+tag@example.com',
  ];

  const invalidEmails = [
    'invalid',
    'user@',
    '@example.com',
    'user@.com',
  ];

  it.each(validEmails)('should accept valid email: %s', (email) => {
    expect(validateEmail(email)).toBe(true);
  });

  it.each(invalidEmails)('should reject invalid email: %s', (email) => {
    expect(validateEmail(email)).toBe(false);
  });
});
```

---

## Configuration

```yaml
# proagents.config.yaml
testing:
  patterns:
    # Required patterns
    structure: "aaa"  # or "bdd"

    # Test organization
    organization:
      unit: "__tests__/unit/"
      integration: "__tests__/integration/"
      e2e: "__tests__/e2e/"

    # Naming convention
    naming:
      file: "{name}.test.ts"
      describe: "PascalCase"
      it: "should {action}"
```

---

## Best Practices

1. **One Assert Per Test**: Each test verifies one behavior
2. **Descriptive Names**: Test names describe expected behavior
3. **Independent Tests**: Tests don't depend on each other
4. **Fast Tests**: Unit tests should be milliseconds
5. **Deterministic**: Same input = same result
6. **Readable**: Tests serve as documentation
7. **Maintainable**: Use factories and builders for test data
