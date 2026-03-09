# Error Types

Standardized error classification and hierarchy.

---

## Error Hierarchy

```
BaseError
├── ApplicationError
│   ├── ValidationError
│   ├── BusinessLogicError
│   └── ConfigurationError
├── InfrastructureError
│   ├── DatabaseError
│   ├── NetworkError
│   └── FileSystemError
├── IntegrationError
│   ├── ExternalAPIError
│   ├── AuthenticationError
│   └── RateLimitError
└── SystemError
    ├── OutOfMemoryError
    ├── TimeoutError
    └── CriticalError
```

---

## Base Error Definition

### TypeScript Implementation

```typescript
// errors/base.ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    };
  }
}
```

---

## Application Errors

### Validation Error

```typescript
// errors/application.ts
export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  readonly isOperational = true;

  readonly field?: string;
  readonly value?: unknown;

  constructor(
    message: string,
    options?: { field?: string; value?: unknown; context?: Record<string, unknown> }
  ) {
    super(message, options?.context);
    this.field = options?.field;
    this.value = options?.value;
  }
}

// Usage
throw new ValidationError('Email is invalid', {
  field: 'email',
  value: userInput.email,
  context: { userId: user.id },
});
```

### Business Logic Error

```typescript
export class BusinessLogicError extends BaseError {
  readonly code = 'BUSINESS_LOGIC_ERROR';
  readonly statusCode = 422;
  readonly isOperational = true;

  readonly rule: string;

  constructor(message: string, rule: string, context?: Record<string, unknown>) {
    super(message, context);
    this.rule = rule;
  }
}

// Usage
throw new BusinessLogicError(
  'Insufficient funds for withdrawal',
  'account.balance.insufficient',
  { accountId: account.id, requested: amount, available: balance }
);
```

### Configuration Error

```typescript
export class ConfigurationError extends BaseError {
  readonly code = 'CONFIGURATION_ERROR';
  readonly statusCode = 500;
  readonly isOperational = false;

  readonly configKey: string;

  constructor(message: string, configKey: string) {
    super(message, { configKey });
    this.configKey = configKey;
  }
}

// Usage
throw new ConfigurationError(
  'Missing required configuration',
  'DATABASE_URL'
);
```

---

## Infrastructure Errors

### Database Error

```typescript
// errors/infrastructure.ts
export class DatabaseError extends BaseError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
  readonly isOperational = false;

  readonly operation: string;
  readonly originalError?: Error;

  constructor(
    message: string,
    operation: string,
    originalError?: Error,
    context?: Record<string, unknown>
  ) {
    super(message, context);
    this.operation = operation;
    this.originalError = originalError;
  }
}

// Specific database errors
export class ConnectionError extends DatabaseError {
  readonly code = 'DB_CONNECTION_ERROR';
}

export class QueryError extends DatabaseError {
  readonly code = 'DB_QUERY_ERROR';
}

export class TransactionError extends DatabaseError {
  readonly code = 'DB_TRANSACTION_ERROR';
}
```

### Network Error

```typescript
export class NetworkError extends BaseError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 503;
  readonly isOperational = true;

  readonly endpoint?: string;
  readonly timeout?: number;

  constructor(
    message: string,
    options?: { endpoint?: string; timeout?: number; context?: Record<string, unknown> }
  ) {
    super(message, options?.context);
    this.endpoint = options?.endpoint;
    this.timeout = options?.timeout;
  }
}
```

---

## Integration Errors

### External API Error

```typescript
// errors/integration.ts
export class ExternalAPIError extends BaseError {
  readonly code = 'EXTERNAL_API_ERROR';
  readonly statusCode = 502;
  readonly isOperational = true;

  readonly service: string;
  readonly originalStatus?: number;
  readonly originalMessage?: string;

  constructor(
    message: string,
    service: string,
    options?: {
      originalStatus?: number;
      originalMessage?: string;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, options?.context);
    this.service = service;
    this.originalStatus = options?.originalStatus;
    this.originalMessage = options?.originalMessage;
  }
}

// Usage
throw new ExternalAPIError(
  'Payment gateway unavailable',
  'stripe',
  {
    originalStatus: 503,
    originalMessage: 'Service temporarily unavailable',
    context: { paymentId, amount },
  }
);
```

### Authentication Error

```typescript
export class AuthenticationError extends BaseError {
  readonly code = 'AUTHENTICATION_ERROR';
  readonly statusCode = 401;
  readonly isOperational = true;

  readonly reason: 'invalid_credentials' | 'expired_token' | 'missing_token' | 'invalid_token';

  constructor(
    message: string,
    reason: AuthenticationError['reason'],
    context?: Record<string, unknown>
  ) {
    super(message, context);
    this.reason = reason;
  }
}
```

### Rate Limit Error

```typescript
export class RateLimitError extends BaseError {
  readonly code = 'RATE_LIMIT_ERROR';
  readonly statusCode = 429;
  readonly isOperational = true;

  readonly limit: number;
  readonly window: string;
  readonly retryAfter: number;

  constructor(
    message: string,
    options: { limit: number; window: string; retryAfter: number }
  ) {
    super(message);
    this.limit = options.limit;
    this.window = options.window;
    this.retryAfter = options.retryAfter;
  }
}
```

---

## Error Codes

### Code Convention

```yaml
# proagents.config.yaml
patterns:
  error_types:
    codes:
      format: "{CATEGORY}_{SUBCATEGORY}_{SPECIFIC}"

      categories:
        VAL: "Validation"
        BUS: "Business Logic"
        CFG: "Configuration"
        DB: "Database"
        NET: "Network"
        API: "External API"
        AUTH: "Authentication"
        SYS: "System"

      examples:
        VAL_INPUT_INVALID: "Invalid input validation"
        VAL_EMAIL_FORMAT: "Invalid email format"
        BUS_ACCOUNT_INSUFFICIENT: "Insufficient account balance"
        DB_CONN_FAILED: "Database connection failed"
        API_STRIPE_TIMEOUT: "Stripe API timeout"
        AUTH_TOKEN_EXPIRED: "Authentication token expired"
```

### Error Code Registry

```typescript
// errors/codes.ts
export const ErrorCodes = {
  // Validation
  VAL_INPUT_INVALID: { message: 'Invalid input', status: 400 },
  VAL_EMAIL_FORMAT: { message: 'Invalid email format', status: 400 },
  VAL_REQUIRED_FIELD: { message: 'Required field missing', status: 400 },

  // Business Logic
  BUS_INSUFFICIENT_FUNDS: { message: 'Insufficient funds', status: 422 },
  BUS_DUPLICATE_ENTRY: { message: 'Duplicate entry', status: 409 },
  BUS_OPERATION_NOT_ALLOWED: { message: 'Operation not allowed', status: 403 },

  // Database
  DB_CONNECTION_FAILED: { message: 'Database connection failed', status: 500 },
  DB_QUERY_FAILED: { message: 'Database query failed', status: 500 },
  DB_CONSTRAINT_VIOLATION: { message: 'Database constraint violation', status: 409 },

  // Authentication
  AUTH_INVALID_CREDENTIALS: { message: 'Invalid credentials', status: 401 },
  AUTH_TOKEN_EXPIRED: { message: 'Token expired', status: 401 },
  AUTH_INSUFFICIENT_PERMISSIONS: { message: 'Insufficient permissions', status: 403 },
} as const;
```

---

## Error Factory

### Creating Errors

```typescript
// errors/factory.ts
export class ErrorFactory {
  static validation(field: string, message: string, value?: unknown): ValidationError {
    return new ValidationError(message, { field, value });
  }

  static notFound(resource: string, id: string): NotFoundError {
    return new NotFoundError(`${resource} not found`, { resource, id });
  }

  static unauthorized(reason: AuthenticationError['reason']): AuthenticationError {
    return new AuthenticationError('Unauthorized', reason);
  }

  static businessRule(rule: string, message: string): BusinessLogicError {
    return new BusinessLogicError(message, rule);
  }

  static external(service: string, error: Error): ExternalAPIError {
    return new ExternalAPIError(`${service} error: ${error.message}`, service, {
      originalMessage: error.message,
    });
  }
}

// Usage
throw ErrorFactory.validation('email', 'Invalid email format', input.email);
throw ErrorFactory.notFound('User', userId);
throw ErrorFactory.unauthorized('expired_token');
```

---

## Configuration

```yaml
# proagents.config.yaml
patterns:
  error_types:
    # Base error class
    base_class: "BaseError"

    # Required properties
    required_properties:
      - code
      - statusCode
      - isOperational

    # Logging
    logging:
      operational: "warn"
      programmer: "error"
      include_stack: true

    # Serialization
    serialization:
      include_stack: false  # In production
      include_context: true
```

---

## Best Practices

1. **Use Specific Types**: Create specific error classes for different scenarios
2. **Include Context**: Always add relevant context to errors
3. **Operational vs Programmer**: Distinguish between user errors and bugs
4. **Consistent Codes**: Use a consistent error code system
5. **Factory Pattern**: Use factories for common error creation
6. **Logging**: Log all errors appropriately by type
