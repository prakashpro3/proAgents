# Domain Knowledge Learning

Learn business terminology, domain entities, and project-specific concepts.

---

## Overview

Domain knowledge helps the AI understand your business context for more accurate suggestions.

```
┌─────────────────────────────────────────────────────────────┐
│                    Domain Knowledge                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Sources:                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Code      │  │    Docs     │  │  Glossary   │        │
│  │  Comments   │  │  & READMEs  │  │   Files     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          │                                  │
│                          ▼                                  │
│              ┌─────────────────────┐                       │
│              │   Domain Model      │                       │
│              ├─────────────────────┤                       │
│              │ • Entities          │                       │
│              │ • Relationships     │                       │
│              │ • Business Rules    │                       │
│              │ • Terminology       │                       │
│              └─────────────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Domain Configuration

### Define Domain

```yaml
# proagents.config.yaml

learning:
  domain:
    enabled: true

    # Domain type
    type: "ecommerce"  # fintech, healthcare, saas, etc.

    # Custom glossary
    glossary_file: "docs/glossary.yaml"

    # Entity definitions
    entities_file: "docs/entities.yaml"

    # Business rules
    rules_file: "docs/business-rules.yaml"
```

### Glossary File

```yaml
# docs/glossary.yaml

terms:
  # Customer terminology
  user:
    definition: "A registered customer with an account"
    synonyms: ["customer", "member", "account holder"]
    not_to_confuse_with: ["visitor", "guest"]

  visitor:
    definition: "An unregistered person browsing the site"
    synonyms: ["guest", "anonymous user"]

  # Product terminology
  sku:
    definition: "Stock Keeping Unit - unique product identifier"
    format: "XXX-YYYY-ZZZ"
    example: "ELC-1234-BLK"

  # Order terminology
  order:
    definition: "A confirmed purchase by a user"
    states: ["pending", "processing", "shipped", "delivered", "cancelled"]

  cart:
    definition: "Temporary collection of items before checkout"
    synonyms: ["basket", "shopping cart"]

  # Business terms
  gmv:
    definition: "Gross Merchandise Value - total sales value"
    formula: "sum of all order totals before returns"

  aov:
    definition: "Average Order Value"
    formula: "GMV / number of orders"
```

---

## Entity Definitions

### Entity Schema

```yaml
# docs/entities.yaml

entities:
  User:
    description: "Registered customer account"
    attributes:
      id: "Unique identifier (UUID)"
      email: "Primary contact email"
      profile: "User profile information"
      addresses: "Shipping and billing addresses"
      orders: "Order history"
    relationships:
      - "User has many Orders"
      - "User has many Addresses"
      - "User has one Profile"
    business_rules:
      - "Email must be unique"
      - "Must verify email before first purchase"

  Order:
    description: "Purchase transaction"
    attributes:
      id: "Order identifier"
      user_id: "Reference to User"
      items: "Ordered products"
      total: "Order total amount"
      status: "Current order status"
    relationships:
      - "Order belongs to User"
      - "Order has many OrderItems"
      - "Order has one Payment"
    states:
      pending: "Order created, awaiting payment"
      processing: "Payment received, preparing shipment"
      shipped: "Order shipped, in transit"
      delivered: "Order received by customer"
      cancelled: "Order cancelled"
    business_rules:
      - "Cannot cancel after shipping"
      - "Refund within 30 days only"

  Product:
    description: "Item available for sale"
    attributes:
      id: "Product identifier"
      sku: "Stock keeping unit"
      name: "Product name"
      price: "Current price"
      inventory: "Stock count"
    relationships:
      - "Product belongs to Category"
      - "Product has many Variants"
    business_rules:
      - "Price must be positive"
      - "Cannot sell if inventory is 0"
```

---

## Business Rules

### Rule Definitions

```yaml
# docs/business-rules.yaml

rules:
  # Pricing rules
  pricing:
    - id: "minimum_order"
      description: "Minimum order value for free shipping"
      condition: "order.total < 50"
      action: "Add shipping fee"
      fee: 5.99

    - id: "bulk_discount"
      description: "Discount for bulk orders"
      condition: "order.items.count >= 10"
      action: "Apply 10% discount"
      discount: 0.10

  # Inventory rules
  inventory:
    - id: "low_stock_alert"
      description: "Alert when stock is low"
      condition: "product.inventory < 10"
      action: "Send alert to inventory team"

    - id: "prevent_oversell"
      description: "Cannot sell more than available"
      condition: "order.quantity > product.inventory"
      action: "Reject order"
      error: "Insufficient stock"

  # User rules
  user:
    - id: "email_verification"
      description: "Verify email before purchase"
      condition: "user.email_verified == false"
      action: "Block checkout"
      message: "Please verify your email"

    - id: "account_suspension"
      description: "Suspend after chargebacks"
      condition: "user.chargebacks >= 3"
      action: "Suspend account"
```

---

## Learning from Code

### Automatic Entity Detection

ProAgents analyzes code to discover entities:

```typescript
// Detected from: src/models/User.ts
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ProAgents learns:
// - User entity exists
// - Has id, email, name, createdAt fields
// - Types: string, string, string, Date
```

### Comment Analysis

```typescript
/**
 * Process a refund for an order.
 *
 * Business Rule: Refunds are only allowed within 30 days
 * of delivery date. Partial refunds are supported.
 *
 * @param orderId - The order to refund
 * @param amount - Refund amount (max: order total)
 */
async function processRefund(orderId: string, amount: number) {
  // ...
}

// ProAgents learns:
// - Refund rule: 30 days from delivery
// - Partial refunds supported
// - Amount cannot exceed order total
```

---

## Domain Application

### In Requirements

```
User Request: "Add ability for customers to cancel their purchase"

Without Domain Knowledge:
AI: "Add a cancel button"

With Domain Knowledge:
AI: "Based on your business rules, orders can only be cancelled
     before shipping. I'll implement:
     1. Cancel button (visible only for pending/processing orders)
     2. Check order status before cancellation
     3. Process refund according to your refund policy
     4. Update inventory for cancelled items"
```

### In Code Generation

```
Without Domain Knowledge:
if (user.type === "customer") { ... }

With Domain Knowledge:
// Using learned terminology
if (user.isRegistered && user.emailVerified) {
  // Registered user with verified email can make purchases
}
```

### In Code Review

```
Code: order.cancel()

Review Without Domain Knowledge:
"Looks fine"

Review With Domain Knowledge:
"Warning: This allows cancellation without checking order status.
 Your business rules state orders cannot be cancelled after shipping.
 Suggested fix: Add status check before cancellation."
```

---

## Domain Commands

```bash
# View learned domain knowledge
proagents learning domain

# Add glossary term
proagents learning add-term "churn" "Customer who cancelled subscription"

# Add entity
proagents learning add-entity "Subscription" --file entities.yaml

# View business rules
proagents learning rules

# Validate against business rules
proagents learning validate --file src/services/OrderService.ts
```

---

## Domain Reports

```bash
proagents learning domain

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Domain Knowledge                                            │
├─────────────────────────────────────────────────────────────┤
│ Domain Type: E-commerce                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Entities (12):                                              │
│ ├── User (8 attributes, 3 relationships)                  │
│ ├── Order (6 attributes, 4 states)                        │
│ ├── Product (5 attributes, 2 relationships)               │
│ └── ... 9 more                                             │
│                                                             │
│ Glossary Terms (34):                                        │
│ ├── Business: GMV, AOV, churn, retention                  │
│ ├── Product: SKU, variant, category                       │
│ └── Process: checkout, fulfillment, refund                │
│                                                             │
│ Business Rules (18):                                        │
│ ├── Pricing: 4 rules                                       │
│ ├── Inventory: 3 rules                                     │
│ ├── Orders: 6 rules                                        │
│ └── Users: 5 rules                                         │
│                                                             │
│ Coverage: 85% of codebase mapped to domain                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Start with Glossary**: Define key terms first
2. **Document Entities**: Map your data model
3. **Capture Rules**: Document business logic
4. **Review Regularly**: Update as business evolves
5. **Use Comments**: Add context in code comments
6. **Validate Suggestions**: Ensure AI respects business rules
