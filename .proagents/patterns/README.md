# Error Handling Patterns

Consistent error handling across your application.

---

## Overview

Standardized error handling patterns for predictable, debuggable applications.

## Documentation

| Document | Description |
|----------|-------------|
| [Error Types](./error-types.md) | Custom error classes |
| [API Errors](./api-errors.md) | HTTP error handling |
| [Async Errors](./async-errors.md) | Promise and async/await |
| [UI Errors](./ui-errors.md) | Error boundaries and display |

---

## Error Classification

### Error Categories

| Category | HTTP Code | Example |
|----------|-----------|---------|
| Validation | 400 | Invalid input |
| Authentication | 401 | Invalid credentials |
| Authorization | 403 | Access denied |
| Not Found | 404 | Resource missing |
| Conflict | 409 | Duplicate entry |
| Server | 500 | Internal error |

---

## Custom Error Classes

### Base Error Class

```typescript
// src/errors/base.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, true);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 'FORBIDDEN', 403, true);
  }
}
```

---

## API Error Handling

### Express Middleware

```typescript
// src/middleware/error-handler.ts
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
```

### API Response Format

```typescript
// Success response
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid"
    }
  }
}
```

---

## Async Error Handling

### Async/Await Pattern

```typescript
// Wrap async route handlers
const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User');
  }
  res.json({ data: user });
}));
```

### Promise Error Handling

```typescript
// Always handle promise rejections
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundError('Data');
    }
    throw new AppError('Failed to fetch data', 'FETCH_ERROR', 500);
  }
}
```

---

## UI Error Handling

### React Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error service
    errorService.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Error Display Component

```typescript
// src/components/ErrorMessage.tsx
function ErrorMessage({ error }: { error: AppError }) {
  return (
    <div role="alert" className="error-message">
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
      {error.details && (
        <details>
          <summary>Details</summary>
          <pre>{JSON.stringify(error.details, null, 2)}</pre>
        </details>
      )}
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );
}
```

---

## Error Logging

### Structured Logging

```typescript
// Log errors with context
logger.error({
  message: error.message,
  code: error.code,
  stack: error.stack,
  context: {
    userId: req.user?.id,
    path: req.path,
    method: req.method,
    body: req.body,
  },
});
```

### Error Tracking Services

```yaml
# proagents.config.yaml
error_tracking:
  provider: "sentry"  # sentry, bugsnag, rollbar

  sentry:
    dsn_env: "SENTRY_DSN"
    environment: "${NODE_ENV}"

    # What to capture
    capture:
      - unhandled_exceptions
      - unhandled_rejections
      - console_errors

    # What to ignore
    ignore:
      - "NetworkError"
      - "AbortError"
```

---

## Best Practices

1. **Use Custom Errors**: Create specific error types
2. **Include Context**: Add relevant details to errors
3. **Handle All Paths**: Every code path should handle errors
4. **Log Appropriately**: Log errors with enough context
5. **User-Friendly Messages**: Show helpful messages to users
6. **Don't Expose Internals**: Hide stack traces in production
7. **Retry When Appropriate**: Implement retry logic for transient errors
8. **Monitor Errors**: Track error rates and patterns
