# Code Smells Detection

Identify and resolve common code smells.

---

## Prompt Template

```
Analyze the following code for code smells and suggest improvements:

{code}

Look for:
1. Long Methods - Functions doing too much
2. Large Classes - Classes with too many responsibilities
3. Duplicate Code - Similar code in multiple places
4. Dead Code - Unused functions, variables, imports
5. God Objects - Objects that know/do too much
6. Feature Envy - Methods using other class data excessively
7. Data Clumps - Data items that appear together repeatedly
8. Primitive Obsession - Overuse of primitives instead of objects
9. Long Parameter Lists - Functions with many parameters
10. Comments - Excessive comments hiding complex code

For each smell found:
- Describe the issue
- Explain why it's problematic
- Suggest a refactoring approach
- Provide example improved code
```

---

## Smell Categories

### Bloaters

**Long Method:**
```typescript
// ❌ Bad: Method doing too much
async function processOrder(order: Order) {
  // Validate order (20 lines)
  // Calculate totals (15 lines)
  // Apply discounts (25 lines)
  // Process payment (30 lines)
  // Send notifications (20 lines)
  // Update inventory (15 lines)
}

// ✅ Good: Extracted methods
async function processOrder(order: Order) {
  validateOrder(order);
  const totals = calculateTotals(order);
  const finalPrice = applyDiscounts(totals, order.customer);
  await processPayment(order, finalPrice);
  await sendNotifications(order);
  await updateInventory(order.items);
}
```

**Large Class:**
```typescript
// ❌ Bad: Class handling too much
class UserManager {
  createUser() {}
  updateUser() {}
  deleteUser() {}
  authenticateUser() {}
  sendPasswordReset() {}
  generateReport() {}
  exportToCSV() {}
  importFromCSV() {}
  validateEmail() {}
  // ... 20 more methods
}

// ✅ Good: Split by responsibility
class UserService { /* CRUD operations */ }
class AuthService { /* Authentication */ }
class UserReportService { /* Reporting */ }
class UserImportExportService { /* Import/Export */ }
```

### Object-Orientation Abusers

**Switch Statements:**
```typescript
// ❌ Bad: Switch on type
function getPrice(animal: Animal) {
  switch (animal.type) {
    case 'dog': return 50;
    case 'cat': return 40;
    case 'bird': return 20;
  }
}

// ✅ Good: Polymorphism
interface Animal {
  getPrice(): number;
}

class Dog implements Animal {
  getPrice() { return 50; }
}
```

### Change Preventers

**Divergent Change:**
```typescript
// ❌ Bad: Class changes for many reasons
class Employee {
  calculatePay() {}      // Changes for pay rules
  reportHours() {}       // Changes for reporting format
  saveToDatabase() {}    // Changes for DB schema
}

// ✅ Good: Single responsibility
class PayCalculator { calculatePay() {} }
class HoursReporter { reportHours() {} }
class EmployeeRepository { save() {} }
```

---

## Detection Commands

```bash
# Find long methods
/refactor smell long-methods --threshold 30

# Find large files
/refactor smell large-files --threshold 500

# Find duplicate code
/refactor smell duplicates

# Find complex functions
/refactor smell complexity --threshold 10

# Full analysis
/refactor smell all
```

---

## Automated Fixes

```bash
# Extract long method
/refactor extract-method {function_name}

# Split large class
/refactor split-class {class_name}

# Remove dead code
/refactor remove-dead-code

# Inline trivial methods
/refactor inline-trivial
```

---

## Priority Matrix

| Smell | Impact | Fix Difficulty | Priority |
|-------|--------|----------------|----------|
| Dead Code | Low | Easy | Low |
| Long Method | High | Medium | High |
| Duplicate Code | High | Medium | High |
| Large Class | High | Hard | Medium |
| God Object | Critical | Hard | High |
