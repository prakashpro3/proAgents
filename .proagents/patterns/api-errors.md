# API Error Handling

Standardized error responses for REST and GraphQL APIs.

---

## REST API Errors

### Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "invalid-email"
      }
    ],
    "requestId": "req-abc123",
    "timestamp": "2024-01-15T10:30:00Z",
    "documentation": "https://api.example.com/docs/errors#VALIDATION_ERROR"
  }
}
```

### HTTP Status Code Mapping

| Status | Use Case | Example |
|--------|----------|---------|
| 400 | Bad Request | Malformed JSON, invalid parameters |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Valid auth, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry, version conflict |
| 422 | Unprocessable | Valid format, business rule violation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Unexpected server error |
| 502 | Bad Gateway | External service error |
| 503 | Service Unavailable | Maintenance, overload |

---

## Error Handler Configuration

### Express Middleware

```yaml
# proagents.config.yaml
patterns:
  api_errors:
    framework: "express"

    handler:
      # Error response format
      format:
        wrapper: "error"
        include:
          - code
          - message
          - details
          - requestId
          - timestamp
        exclude_in_production:
          - stack
          - internalMessage

      # Status code mapping
      status_mapping:
        ValidationError: 400
        NotFoundError: 404
        AuthenticationError: 401
        AuthorizationError: 403
        BusinessLogicError: 422
        RateLimitError: 429
        ExternalAPIError: 502
        default: 500
```

### Implementation

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors';
import { logger } from '../logging';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error
  if (error instanceof BaseError && error.isOperational) {
    logger.warn('Operational error', { error: error.toJSON(), requestId: req.id });
  } else {
    logger.error('Unexpected error', { error, requestId: req.id });
  }

  // Determine status code
  const statusCode = error instanceof BaseError
    ? error.statusCode
    : 500;

  // Build response
  const response = {
    error: {
      code: error instanceof BaseError ? error.code : 'INTERNAL_ERROR',
      message: error.message,
      ...(error instanceof ValidationError && { details: error.details }),
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  };

  // Add stack in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
  }

  res.status(statusCode).json(response);
}

// Usage
app.use(errorHandler);
```

---

## Validation Errors

### Field-Level Errors

```typescript
// errors/validation.ts
export interface ValidationDetail {
  field: string;
  message: string;
  code: string;
  value?: unknown;
  constraints?: Record<string, unknown>;
}

export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  readonly isOperational = true;

  readonly details: ValidationDetail[];

  constructor(message: string, details: ValidationDetail[]) {
    super(message);
    this.details = details;
  }
}

// Usage
throw new ValidationError('Validation failed', [
  { field: 'email', message: 'Invalid email format', code: 'INVALID_FORMAT' },
  { field: 'password', message: 'Too short', code: 'MIN_LENGTH', constraints: { min: 8 } },
]);
```

### Response Example

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "INVALID_FORMAT"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters",
        "code": "MIN_LENGTH",
        "constraints": {
          "min": 8
        }
      }
    ],
    "requestId": "req-abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## GraphQL Errors

### Error Extensions

```typescript
// graphql/errors.ts
import { GraphQLError } from 'graphql';

export class GraphQLAPIError extends GraphQLError {
  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message, {
      extensions: {
        code,
        statusCode,
        ...details,
      },
    });
  }
}

// Specific errors
export class GraphQLValidationError extends GraphQLAPIError {
  constructor(message: string, details: ValidationDetail[]) {
    super(message, 'VALIDATION_ERROR', 400, { details });
  }
}

export class GraphQLNotFoundError extends GraphQLAPIError {
  constructor(resource: string, id: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, { resource, id });
  }
}
```

### GraphQL Response Format

```json
{
  "data": null,
  "errors": [
    {
      "message": "User not found",
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND",
        "statusCode": 404,
        "resource": "User",
        "id": "user-123"
      }
    }
  ]
}
```

### Apollo Error Handler

```typescript
// graphql/errorHandler.ts
import { ApolloServerPlugin } from '@apollo/server';

export const errorPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors({ errors, request }) {
        for (const error of errors) {
          // Log errors
          if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
            logger.error('GraphQL error', {
              message: error.message,
              path: error.path,
              stack: error.originalError?.stack,
            });
          }
        }
      },
    };
  },
};

// Format error for response
export function formatError(error: GraphQLError) {
  // Don't expose internal errors
  if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
    return {
      message: 'An unexpected error occurred',
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    };
  }

  return error;
}
```

---

## Error Documentation

### OpenAPI Specification

```yaml
# openapi.yaml
components:
  schemas:
    Error:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
              example: "VALIDATION_ERROR"
            message:
              type: string
              example: "Invalid input data"
            details:
              type: array
              items:
                $ref: '#/components/schemas/ErrorDetail'
            requestId:
              type: string
              example: "req-abc123"
            timestamp:
              type: string
              format: date-time

    ErrorDetail:
      type: object
      properties:
        field:
          type: string
        message:
          type: string
        code:
          type: string

  responses:
    BadRequest:
      description: Invalid request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

---

## Client Handling

### TypeScript API Client

```typescript
// client/errors.ts
export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
    requestId: string;
  };
}

export class APIError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: APIErrorResponse['error']['details'];
  readonly requestId: string;

  constructor(response: APIErrorResponse, statusCode: number) {
    super(response.error.message);
    this.code = response.error.code;
    this.statusCode = statusCode;
    this.details = response.error.details;
    this.requestId = response.error.requestId;
  }

  isValidationError(): boolean {
    return this.code === 'VALIDATION_ERROR';
  }

  isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  getFieldError(field: string): string | undefined {
    return this.details?.find(d => d.field === field)?.message;
  }
}

// API client wrapper
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData: APIErrorResponse = await response.json();
    throw new APIError(errorData, response.status);
  }

  return response.json();
}
```

---

## Commands

```bash
# Generate error documentation
proagents errors generate-docs

# Validate error responses
proagents errors validate

# Test error handling
proagents errors test --endpoint /api/users
```

---

## Best Practices

1. **Consistent Format**: Use the same error structure everywhere
2. **Meaningful Codes**: Error codes should be self-explanatory
3. **Field-Level Details**: Include specific field errors for validation
4. **Request ID**: Always include for debugging
5. **Don't Expose Internals**: Hide stack traces in production
6. **Document Errors**: Include errors in API documentation
