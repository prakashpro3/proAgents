# Mocking Guidelines

Best practices for creating and using mocks in tests.

---

## When to Mock

| Mock | Don't Mock |
|------|------------|
| External APIs | Pure functions |
| Databases (unit tests) | Simple utilities |
| File system | Data transformations |
| Time/Date | Domain logic |
| Random values | Value objects |
| Third-party services | Internal collaborators (usually) |

---

## Mock Types

### Mocks

Full replacement with behavior verification.

```typescript
// Mock with Jest
const userRepository = {
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

// Set return value
userRepository.findById.mockResolvedValue({ id: '1', name: 'Test' });

// Verify calls
expect(userRepository.findById).toHaveBeenCalledWith('1');
expect(userRepository.save).toHaveBeenCalledTimes(1);
```

### Stubs

Predefined responses without verification.

```typescript
// Stub - just returns values
const configStub = {
  get: (key: string) => {
    const config = {
      'api.url': 'https://api.test.com',
      'api.timeout': 5000,
    };
    return config[key];
  },
};
```

### Spies

Wraps real implementation with tracking.

```typescript
// Spy on real method
const spy = jest.spyOn(logger, 'error');

await processOrder(invalidOrder);

expect(spy).toHaveBeenCalledWith('Order processing failed', expect.any(Error));

spy.mockRestore(); // Restore original
```

### Fakes

Working implementation for testing.

```typescript
// Fake in-memory repository
class FakeUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Test helper
  clear(): void {
    this.users.clear();
  }
}
```

---

## Jest Mocking

### Module Mocks

```typescript
// Mock entire module
jest.mock('./emailService');

// Access mock
import { sendEmail } from './emailService';
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

// Configure
mockSendEmail.mockResolvedValue({ success: true });

// Auto-mock with implementation
jest.mock('./userRepository', () => ({
  findById: jest.fn().mockResolvedValue({ id: '1', name: 'Test' }),
  save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
}));
```

### Partial Mocks

```typescript
// Mock only specific exports
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  fetchData: jest.fn(),
}));
```

### Class Mocks

```typescript
// Mock class
jest.mock('./UserService');

// Get mock constructor
const MockUserService = UserService as jest.MockedClass<typeof UserService>;

// Configure instance methods
MockUserService.prototype.getUser.mockResolvedValue(testUser);

// Verify instantiation
expect(MockUserService).toHaveBeenCalledWith(mockRepository);
```

---

## Dependency Injection

### Constructor Injection

```typescript
// Service with injected dependencies
class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentService: PaymentService,
    private readonly emailService: EmailService
  ) {}

  async placeOrder(order: Order): Promise<Order> {
    const saved = await this.orderRepository.save(order);
    await this.paymentService.charge(order.total);
    await this.emailService.sendConfirmation(order);
    return saved;
  }
}

// Test with mocks
describe('OrderService', () => {
  let service: OrderService;
  let mockOrderRepo: jest.Mocked<OrderRepository>;
  let mockPaymentService: jest.Mocked<PaymentService>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockOrderRepo = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    mockPaymentService = {
      charge: jest.fn(),
    };
    mockEmailService = {
      sendConfirmation: jest.fn(),
    };

    service = new OrderService(mockOrderRepo, mockPaymentService, mockEmailService);
  });

  it('should save order and process payment', async () => {
    const order = createOrder();
    mockOrderRepo.save.mockResolvedValue(order);
    mockPaymentService.charge.mockResolvedValue({ success: true });

    await service.placeOrder(order);

    expect(mockOrderRepo.save).toHaveBeenCalledWith(order);
    expect(mockPaymentService.charge).toHaveBeenCalledWith(order.total);
  });
});
```

---

## HTTP Mocking

### MSW (Mock Service Worker)

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        id,
        name: 'Test User',
        email: 'test@example.com',
      })
    );
  }),

  rest.post('/api/orders', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        id: 'order-123',
        ...body,
      })
    );
  }),

  // Error response
  rest.get('/api/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal server error' })
    );
  }),
];

// Setup in tests
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Override for specific test
it('should handle API error', async () => {
  server.use(
    rest.get('/api/users/:id', (req, res, ctx) => {
      return res(ctx.status(404));
    })
  );

  await expect(userService.getUser('1')).rejects.toThrow('Not found');
});
```

### Nock

```typescript
import nock from 'nock';

describe('API Client', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch user', async () => {
    nock('https://api.example.com')
      .get('/users/1')
      .reply(200, { id: '1', name: 'Test User' });

    const user = await apiClient.getUser('1');

    expect(user.name).toBe('Test User');
  });

  it('should retry on failure', async () => {
    nock('https://api.example.com')
      .get('/users/1')
      .reply(500)
      .get('/users/1')
      .reply(200, { id: '1', name: 'Test User' });

    const user = await apiClient.getUser('1');

    expect(user.name).toBe('Test User');
  });
});
```

---

## Database Mocking

### Repository Mocks

```typescript
// Create typed mock repository
function createMockUserRepository(): jest.Mocked<UserRepository> {
  return {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  };
}

// Usage
const mockRepo = createMockUserRepository();
mockRepo.findById.mockResolvedValue(testUser);
```

### Test Containers

```typescript
// Use real database in containers
import { PostgreSqlContainer } from 'testcontainers';

describe('UserRepository (Integration)', () => {
  let container: PostgreSqlContainer;
  let db: Database;

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
    db = await createConnection(container.getConnectionUri());
    await db.migrate();
  }, 60000);

  afterAll(async () => {
    await db.close();
    await container.stop();
  });

  it('should save and retrieve user', async () => {
    const repo = new UserRepository(db);
    const user = await repo.save(createUser());
    const found = await repo.findById(user.id);
    expect(found).toEqual(user);
  });
});
```

---

## Time Mocking

### Jest Fake Timers

```typescript
describe('Scheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should schedule job for tomorrow', () => {
    const job = scheduler.scheduleForTomorrow(callback);

    expect(job.scheduledTime).toEqual(new Date('2024-01-16T10:00:00Z'));
  });

  it('should execute after delay', () => {
    const callback = jest.fn();
    scheduler.scheduleIn(5000, callback);

    jest.advanceTimersByTime(4999);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalled();
  });
});
```

---

## Anti-Patterns

### Over-Mocking

```typescript
// ❌ Bad: Mocking too much
it('should calculate total', () => {
  const mockMultiply = jest.fn().mockReturnValue(100);
  const mockAdd = jest.fn().mockReturnValue(110);

  // Testing implementation, not behavior
  expect(calculateTotal([{ price: 10, qty: 10 }], 0.1)).toBe(110);
});

// ✅ Good: Test behavior, not implementation
it('should calculate total with tax', () => {
  const items = [{ price: 10, quantity: 10 }];
  expect(calculateTotal(items, 0.1)).toBe(110);
});
```

### Mock Verification Overkill

```typescript
// ❌ Bad: Over-verifying
it('should save user', async () => {
  await userService.create(userData);

  expect(mockRepo.save).toHaveBeenCalled();
  expect(mockRepo.save).toHaveBeenCalledTimes(1);
  expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining(userData));
  expect(mockRepo.save.mock.calls[0][0].id).toBeDefined();
  // etc...
});

// ✅ Good: Verify what matters
it('should save user with generated id', async () => {
  const user = await userService.create(userData);

  expect(user.id).toBeDefined();
  expect(mockRepo.save).toHaveBeenCalledWith(
    expect.objectContaining({ ...userData, id: expect.any(String) })
  );
});
```

---

## Configuration

```yaml
# proagents.config.yaml
testing:
  mocking:
    # HTTP mocking
    http:
      tool: "msw"  # or "nock"
      handlers_dir: "__mocks__/handlers"

    # Database mocking
    database:
      strategy: "repository_mock"  # or "test_container", "in_memory"

    # Time mocking
    time:
      default_date: "2024-01-15T10:00:00Z"
```

---

## Best Practices

1. **Mock at Boundaries**: Mock external systems, not internal code
2. **Prefer Fakes**: Use fakes over mocks when behavior matters
3. **Verify Behavior**: Check what matters, not implementation details
4. **Reset State**: Clean up mocks between tests
5. **Type Safety**: Use typed mocks to catch errors
6. **Don't Mock What You Don't Own**: Wrap third-party code first
7. **Keep Mocks Simple**: Complex mocks indicate design issues
