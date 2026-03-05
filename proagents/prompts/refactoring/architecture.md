# Architecture Refactoring Prompt

Guide for architecture-level refactoring.

---

## Prompt Template

```markdown
## Architecture Refactoring Request

### Current Architecture
{{description of current architecture}}

### Problems
- {{problem 1}}
- {{problem 2}}
- {{problem 3}}

### Desired Outcome
{{what the improved architecture should achieve}}

### Constraints
- {{constraint 1: e.g., must maintain API compatibility}}
- {{constraint 2: e.g., cannot introduce new dependencies}}
- {{constraint 3: e.g., must be done incrementally}}

### Analyze and Plan:
1. Current architecture assessment
2. Proposed target architecture
3. Migration strategy
4. Risk assessment
5. Implementation phases
```

---

## Monolith to Modular

Transform a monolithic codebase into modules.

### Before: Monolithic Structure

```
/src
├── index.ts
├── database.ts
├── api.ts
├── utils.ts
├── models/
│   ├── user.ts
│   ├── order.ts
│   └── product.ts
├── controllers/
│   ├── userController.ts
│   ├── orderController.ts
│   └── productController.ts
└── services/
    ├── userService.ts
    ├── orderService.ts
    └── productService.ts
```

### After: Modular Structure

```
/src
├── index.ts                    # Main entry
├── shared/                     # Shared utilities
│   ├── database/
│   │   ├── connection.ts
│   │   └── migrations/
│   ├── utils/
│   └── types/
│
├── modules/
│   ├── users/                  # User module
│   │   ├── index.ts           # Public API
│   │   ├── user.model.ts
│   │   ├── user.service.ts
│   │   ├── user.controller.ts
│   │   ├── user.routes.ts
│   │   ├── user.types.ts
│   │   └── __tests__/
│   │
│   ├── orders/                 # Order module
│   │   ├── index.ts
│   │   ├── order.model.ts
│   │   ├── order.service.ts
│   │   ├── order.controller.ts
│   │   └── __tests__/
│   │
│   └── products/               # Product module
│       ├── index.ts
│       └── ...
│
└── app.ts                      # Application setup
```

### Module Interface

```typescript
// modules/users/index.ts - Public API
export { UserService } from './user.service';
export { userRoutes } from './user.routes';
export type { User, CreateUserDTO, UpdateUserDTO } from './user.types';

// Other modules import from the index, not internal files
import { UserService, User } from '@/modules/users';
```

---

## Layer Separation

Separate concerns into distinct layers.

### Before: Mixed Concerns

```typescript
// Mixed database, business logic, and HTTP handling
app.post('/orders', async (req, res) => {
  // Validation
  if (!req.body.items?.length) {
    return res.status(400).json({ error: 'Items required' });
  }

  // Business logic mixed with DB
  const items = await db.query('SELECT * FROM products WHERE id IN (?)', [
    req.body.items.map(i => i.productId)
  ]);

  let total = 0;
  for (const item of req.body.items) {
    const product = items.find(p => p.id === item.productId);
    total += product.price * item.quantity;
  }

  // More DB operations
  const orderId = await db.query('INSERT INTO orders...', [total]);

  // HTTP response
  res.json({ orderId, total });
});
```

### After: Clean Layers

```typescript
// LAYER 1: Routes/Controllers (HTTP concerns)
// routes/orders.ts
router.post('/orders', orderController.create);

// controllers/order.controller.ts
class OrderController {
  async create(req: Request, res: Response) {
    try {
      const dto = plainToClass(CreateOrderDTO, req.body);
      await validateOrThrow(dto);

      const order = await this.orderService.create(dto);
      res.status(201).json(order);
    } catch (error) {
      handleError(res, error);
    }
  }
}

// LAYER 2: Services (Business Logic)
// services/order.service.ts
class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private productRepo: ProductRepository
  ) {}

  async create(dto: CreateOrderDTO): Promise<Order> {
    const products = await this.productRepo.findByIds(
      dto.items.map(i => i.productId)
    );

    const total = this.calculateTotal(dto.items, products);
    const order = new Order(dto.items, total);

    return this.orderRepo.save(order);
  }

  private calculateTotal(items, products): number {
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + product.price * item.quantity;
    }, 0);
  }
}

// LAYER 3: Repositories (Data Access)
// repositories/order.repository.ts
class OrderRepository {
  async save(order: Order): Promise<Order> {
    const result = await this.db.insert('orders', order);
    return { ...order, id: result.insertId };
  }

  async findById(id: string): Promise<Order | null> {
    return this.db.findOne('orders', { id });
  }
}
```

---

## Dependency Injection

Remove hard dependencies for better testability.

### Before: Hard Dependencies

```typescript
// Tightly coupled, hard to test
class UserService {
  async createUser(data: CreateUserDTO) {
    // Hard dependency on database
    const user = await prisma.user.create({ data });

    // Hard dependency on email service
    await sendgrid.send({
      to: user.email,
      subject: 'Welcome',
      body: 'Welcome to our platform'
    });

    // Hard dependency on analytics
    mixpanel.track('user_created', { userId: user.id });

    return user;
  }
}
```

### After: Dependency Injection

```typescript
// Interfaces for dependencies
interface UserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
}

interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface Analytics {
  track(event: string, properties: Record<string, any>): void;
}

// Service with injected dependencies
class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
    private analytics: Analytics
  ) {}

  async createUser(data: CreateUserDTO): Promise<User> {
    const user = await this.userRepo.create(data);

    await this.emailService.send(
      user.email,
      'Welcome',
      'Welcome to our platform'
    );

    this.analytics.track('user_created', { userId: user.id });

    return user;
  }
}

// Production implementation
const userService = new UserService(
  new PrismaUserRepository(),
  new SendGridEmailService(),
  new MixpanelAnalytics()
);

// Test implementation
const testUserService = new UserService(
  new InMemoryUserRepository(),
  new MockEmailService(),
  new MockAnalytics()
);
```

---

## Event-Driven Architecture

Decouple components using events.

### Before: Direct Coupling

```typescript
class OrderService {
  async createOrder(data: CreateOrderDTO) {
    const order = await this.orderRepo.save(data);

    // Direct calls to other services - tight coupling
    await this.inventoryService.decrementStock(order.items);
    await this.notificationService.sendOrderConfirmation(order);
    await this.analyticsService.trackOrder(order);
    await this.loyaltyService.addPoints(order.userId, order.total);
  }
}
```

### After: Event-Driven

```typescript
// Event definitions
interface OrderCreatedEvent {
  type: 'ORDER_CREATED';
  payload: {
    orderId: string;
    userId: string;
    items: OrderItem[];
    total: number;
  };
}

// Event bus
class EventBus {
  private handlers: Map<string, Function[]> = new Map();

  on(eventType: string, handler: Function) {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  emit(event: { type: string; payload: any }) {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach(handler => handler(event.payload));
  }
}

// Order service - only emits event
class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private eventBus: EventBus
  ) {}

  async createOrder(data: CreateOrderDTO) {
    const order = await this.orderRepo.save(data);

    // Emit event instead of direct calls
    this.eventBus.emit({
      type: 'ORDER_CREATED',
      payload: {
        orderId: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total
      }
    });

    return order;
  }
}

// Event handlers - decoupled
class InventoryHandler {
  constructor(eventBus: EventBus) {
    eventBus.on('ORDER_CREATED', this.handleOrderCreated.bind(this));
  }

  async handleOrderCreated(payload: OrderCreatedEvent['payload']) {
    await this.inventoryService.decrementStock(payload.items);
  }
}

class NotificationHandler {
  constructor(eventBus: EventBus) {
    eventBus.on('ORDER_CREATED', this.handleOrderCreated.bind(this));
  }

  async handleOrderCreated(payload: OrderCreatedEvent['payload']) {
    await this.notificationService.sendOrderConfirmation(payload.orderId);
  }
}
```

---

## API Versioning Architecture

Structure for supporting multiple API versions.

```
/src
├── api/
│   ├── v1/                     # Version 1 (legacy)
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── transformers/       # V1 response format
│   │
│   ├── v2/                     # Version 2 (current)
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── transformers/       # V2 response format
│   │
│   └── shared/                 # Shared between versions
│       ├── middleware/
│       └── validators/
│
├── domain/                     # Version-agnostic business logic
│   ├── services/
│   └── entities/
│
└── infrastructure/             # Database, external services
    ├── repositories/
    └── external/
```

```typescript
// Version-specific transformer
// api/v1/transformers/user.transformer.ts
export function transformUserV1(user: User): UserV1Response {
  return {
    id: user.id,
    name: user.fullName,  // V1 uses 'name'
    email: user.email
  };
}

// api/v2/transformers/user.transformer.ts
export function transformUserV2(user: User): UserV2Response {
  return {
    id: user.id,
    firstName: user.firstName,   // V2 splits name
    lastName: user.lastName,
    emailAddress: user.email     // V2 uses 'emailAddress'
  };
}
```

---

## Migration Strategy

### Strangler Fig Pattern

Gradually replace old system with new.

```markdown
## Phase 1: Identify Seams
- Find natural boundaries in the system
- Identify components that can be extracted
- Map dependencies

## Phase 2: Create Facade
- Introduce facade/proxy in front of old system
- All requests go through facade
- Facade routes to old system initially

## Phase 3: Extract Incrementally
- Move one component at a time to new system
- Update facade to route to new system
- Keep old system running as fallback

## Phase 4: Complete Migration
- All traffic goes to new system
- Monitor for issues
- Decommission old system
```

```typescript
// Facade that routes between old and new systems
class UserFacade {
  constructor(
    private legacyService: LegacyUserService,
    private newService: NewUserService,
    private featureFlags: FeatureFlags
  ) {}

  async getUser(id: string): Promise<User> {
    if (this.featureFlags.isEnabled('new-user-service')) {
      try {
        return await this.newService.getUser(id);
      } catch (error) {
        // Fallback to legacy on error
        console.error('New service failed, falling back:', error);
        return await this.legacyService.getUser(id);
      }
    }
    return await this.legacyService.getUser(id);
  }
}
```

---

## Architecture Refactoring Checklist

```markdown
### Planning
- [ ] Document current architecture
- [ ] Identify pain points and goals
- [ ] Define target architecture
- [ ] Create migration plan with phases
- [ ] Identify risks and mitigations

### Preparation
- [ ] Improve test coverage
- [ ] Set up monitoring and metrics
- [ ] Create rollback plan
- [ ] Communicate with stakeholders

### Execution
- [ ] Make small, incremental changes
- [ ] Feature flag new components
- [ ] Run parallel systems if needed
- [ ] Monitor metrics continuously

### Completion
- [ ] Remove feature flags
- [ ] Clean up legacy code
- [ ] Update documentation
- [ ] Conduct post-mortem
```
