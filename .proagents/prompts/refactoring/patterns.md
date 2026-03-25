# Refactoring Patterns Prompt

Common refactoring techniques and patterns.

---

## Prompt Template

```markdown
## Refactoring Request

Refactor the following code using {{pattern}} pattern:

```{{language}}
{{code}}
```

### Goals:
- [ ] Improve readability
- [ ] Reduce complexity
- [ ] Improve testability
- [ ] Remove duplication
- [ ] Better separation of concerns

### Constraints:
- Must maintain backward compatibility
- Must not change public API (unless requested)
- Must include tests for refactored code
```

---

## Extract Method

Transform long methods into smaller, focused functions.

### Before

```typescript
function processUserOrder(user, items) {
  // Validate user
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (!user.address || !user.address.street) {
    throw new Error('Invalid address');
  }

  // Calculate totals
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  // Create order
  const order = {
    userId: user.id,
    items: items,
    subtotal,
    tax,
    shipping,
    total,
    createdAt: new Date()
  };

  // Save and notify
  database.save('orders', order);
  emailService.send(user.email, 'Order Confirmation', `Total: $${total}`);

  return order;
}
```

### After

```typescript
function processUserOrder(user, items) {
  validateUser(user);
  const totals = calculateTotals(items);
  const order = createOrder(user, items, totals);
  saveAndNotify(order, user);
  return order;
}

function validateUser(user) {
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (!user.address || !user.address.street) {
    throw new Error('Invalid address');
  }
}

function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

function createOrder(user, items, totals) {
  return {
    userId: user.id,
    items,
    ...totals,
    createdAt: new Date()
  };
}

function saveAndNotify(order, user) {
  database.save('orders', order);
  emailService.send(user.email, 'Order Confirmation', `Total: $${order.total}`);
}
```

---

## Replace Conditional with Polymorphism

Replace type-based conditionals with polymorphic behavior.

### Before

```typescript
function calculateShipping(order) {
  switch (order.shippingType) {
    case 'standard':
      return order.weight * 0.5;
    case 'express':
      return order.weight * 0.5 + 10;
    case 'overnight':
      return order.weight * 0.5 + 25;
    case 'international':
      return order.weight * 2 + 50;
    default:
      throw new Error(`Unknown shipping type: ${order.shippingType}`);
  }
}
```

### After

```typescript
interface ShippingStrategy {
  calculate(weight: number): number;
}

class StandardShipping implements ShippingStrategy {
  calculate(weight: number): number {
    return weight * 0.5;
  }
}

class ExpressShipping implements ShippingStrategy {
  calculate(weight: number): number {
    return weight * 0.5 + 10;
  }
}

class OvernightShipping implements ShippingStrategy {
  calculate(weight: number): number {
    return weight * 0.5 + 25;
  }
}

class InternationalShipping implements ShippingStrategy {
  calculate(weight: number): number {
    return weight * 2 + 50;
  }
}

const shippingStrategies: Record<string, ShippingStrategy> = {
  standard: new StandardShipping(),
  express: new ExpressShipping(),
  overnight: new OvernightShipping(),
  international: new InternationalShipping()
};

function calculateShipping(order): number {
  const strategy = shippingStrategies[order.shippingType];
  if (!strategy) {
    throw new Error(`Unknown shipping type: ${order.shippingType}`);
  }
  return strategy.calculate(order.weight);
}
```

---

## Extract Class

Split a large class into multiple focused classes.

### Before

```typescript
class User {
  id: string;
  email: string;
  password: string;

  // Authentication methods
  login(password: string): boolean { /* ... */ }
  logout(): void { /* ... */ }
  resetPassword(newPassword: string): void { /* ... */ }

  // Profile methods
  updateProfile(data: ProfileData): void { /* ... */ }
  getFullName(): string { /* ... */ }
  getAvatar(): string { /* ... */ }

  // Notification methods
  sendEmail(subject: string, body: string): void { /* ... */ }
  sendSMS(message: string): void { /* ... */ }
  getNotificationPreferences(): Preferences { /* ... */ }

  // Subscription methods
  subscribe(plan: string): void { /* ... */ }
  cancelSubscription(): void { /* ... */ }
  getBillingHistory(): Bill[] { /* ... */ }
}
```

### After

```typescript
class User {
  id: string;
  email: string;

  profile: UserProfile;
  auth: UserAuth;
  notifications: UserNotifications;
  subscription: UserSubscription;

  constructor(data: UserData) {
    this.id = data.id;
    this.email = data.email;
    this.profile = new UserProfile(data);
    this.auth = new UserAuth(data);
    this.notifications = new UserNotifications(this);
    this.subscription = new UserSubscription(this);
  }
}

class UserProfile {
  private firstName: string;
  private lastName: string;
  private avatar: string;

  updateProfile(data: ProfileData): void { /* ... */ }
  getFullName(): string { return `${this.firstName} ${this.lastName}`; }
  getAvatar(): string { return this.avatar; }
}

class UserAuth {
  private passwordHash: string;

  login(password: string): boolean { /* ... */ }
  logout(): void { /* ... */ }
  resetPassword(newPassword: string): void { /* ... */ }
}

class UserNotifications {
  private user: User;

  sendEmail(subject: string, body: string): void { /* ... */ }
  sendSMS(message: string): void { /* ... */ }
  getPreferences(): Preferences { /* ... */ }
}

class UserSubscription {
  private user: User;

  subscribe(plan: string): void { /* ... */ }
  cancel(): void { /* ... */ }
  getBillingHistory(): Bill[] { /* ... */ }
}
```

---

## Replace Magic Numbers with Constants

Replace literal values with named constants.

### Before

```typescript
function calculateDiscount(price, userType) {
  if (userType === 1) {
    return price * 0.9;  // 10% off
  } else if (userType === 2) {
    return price * 0.85; // 15% off
  } else if (userType === 3) {
    return price * 0.8;  // 20% off
  }
  return price;
}

function isEligibleForFreeShipping(total) {
  return total >= 100;
}
```

### After

```typescript
const UserType = {
  REGULAR: 1,
  PREMIUM: 2,
  VIP: 3
} as const;

const Discount = {
  [UserType.REGULAR]: 0.10,
  [UserType.PREMIUM]: 0.15,
  [UserType.VIP]: 0.20
} as const;

const FREE_SHIPPING_THRESHOLD = 100;

function calculateDiscount(price: number, userType: number): number {
  const discountRate = Discount[userType] ?? 0;
  return price * (1 - discountRate);
}

function isEligibleForFreeShipping(total: number): boolean {
  return total >= FREE_SHIPPING_THRESHOLD;
}
```

---

## Introduce Parameter Object

Replace multiple parameters with a single object.

### Before

```typescript
function createUser(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  street: string,
  city: string,
  state: string,
  zipCode: string,
  country: string
) {
  // ...
}

createUser('John', 'Doe', 'john@example.com', '555-1234',
  '123 Main St', 'Anytown', 'CA', '12345', 'USA');
```

### After

```typescript
interface CreateUserParams {
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

function createUser(params: CreateUserParams) {
  // ...
}

createUser({
  name: { first: 'John', last: 'Doe' },
  email: 'john@example.com',
  phone: '555-1234',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA'
  }
});
```

---

## Replace Nested Conditionals with Guard Clauses

Flatten deeply nested conditionals.

### Before

```typescript
function processPayment(order, payment) {
  if (order) {
    if (order.status === 'pending') {
      if (payment) {
        if (payment.amount >= order.total) {
          if (validatePaymentMethod(payment.method)) {
            // Actually process payment
            return processTransaction(order, payment);
          } else {
            throw new Error('Invalid payment method');
          }
        } else {
          throw new Error('Insufficient payment amount');
        }
      } else {
        throw new Error('No payment provided');
      }
    } else {
      throw new Error('Order is not pending');
    }
  } else {
    throw new Error('No order provided');
  }
}
```

### After

```typescript
function processPayment(order, payment) {
  // Guard clauses - early returns for invalid cases
  if (!order) {
    throw new Error('No order provided');
  }

  if (order.status !== 'pending') {
    throw new Error('Order is not pending');
  }

  if (!payment) {
    throw new Error('No payment provided');
  }

  if (payment.amount < order.total) {
    throw new Error('Insufficient payment amount');
  }

  if (!validatePaymentMethod(payment.method)) {
    throw new Error('Invalid payment method');
  }

  // Happy path - main logic
  return processTransaction(order, payment);
}
```

---

## Refactoring Commands

```bash
# Apply specific refactoring pattern
pa:refactor apply extract-method --function processOrder

# Apply polymorphism
pa:refactor apply polymorphism --switch-statement line:45

# Extract class
pa:refactor apply extract-class --class User --extract Profile,Auth

# Replace magic numbers
pa:refactor apply constants --file config.ts

# Introduce parameter object
pa:refactor apply param-object --function createUser

# Flatten conditionals
pa:refactor apply guard-clauses --function processPayment
```

---

## Refactoring Checklist

```markdown
### Before Refactoring
- [ ] Tests pass
- [ ] Code coverage adequate
- [ ] Behavior documented
- [ ] Performance baseline captured

### During Refactoring
- [ ] Small, incremental changes
- [ ] Tests still pass after each change
- [ ] No behavior changes (unless intended)
- [ ] Git commits for each refactoring step

### After Refactoring
- [ ] All tests pass
- [ ] Coverage maintained or improved
- [ ] No performance regression
- [ ] Code reviewed
- [ ] Documentation updated
```
