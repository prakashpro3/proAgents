# Structured Logging

JSON-formatted logs for better parsing and analysis.

---

## Why Structured Logging?

| Unstructured | Structured |
|--------------|------------|
| `User john logged in at 2024-01-15` | `{"event":"login","user":"john","time":"2024-01-15T10:30:00Z"}` |
| Hard to parse | Easy to parse |
| Inconsistent format | Consistent schema |
| Limited querying | Rich querying |
| Manual correlation | Automatic correlation |

---

## Log Schema

### Standard Fields

```yaml
# proagents.config.yaml
logging:
  structured:
    enabled: true

    # Standard fields included in every log
    standard_fields:
      timestamp:
        format: "iso8601"
        field_name: "@timestamp"

      level:
        field_name: "level"
        include_numeric: true

      message:
        field_name: "message"

      # Service identification
      service:
        name: "${SERVICE_NAME}"
        version: "${SERVICE_VERSION}"
        environment: "${NODE_ENV}"
        instance_id: "${HOSTNAME}"

      # Request context (when available)
      request:
        include: ["request_id", "trace_id", "span_id"]
```

### Log Entry Format

```json
{
  "@timestamp": "2024-01-15T10:30:00.123Z",
  "level": "info",
  "level_value": 30,
  "message": "User logged in successfully",
  "service": {
    "name": "auth-service",
    "version": "1.2.3",
    "environment": "production",
    "instance_id": "auth-service-abc123"
  },
  "request": {
    "id": "req-uuid-12345",
    "trace_id": "trace-uuid-67890",
    "span_id": "span-uuid-11111"
  },
  "event": {
    "type": "user.login",
    "outcome": "success"
  },
  "user": {
    "id": "user-123",
    "email": "j***@example.com"
  },
  "http": {
    "method": "POST",
    "path": "/api/auth/login",
    "status_code": 200,
    "duration_ms": 145
  }
}
```

---

## Field Configuration

### Custom Fields

```yaml
logging:
  structured:
    custom_fields:
      # Business context
      tenant:
        source: "context.tenant_id"
        always_include: true

      feature_flags:
        source: "context.active_flags"
        include_when: "level <= info"

      # Performance metrics
      performance:
        include:
          - "duration_ms"
          - "memory_used"
          - "cpu_time"

      # Error details
      error:
        include_when: "level >= error"
        fields:
          - "name"
          - "message"
          - "stack"
          - "code"
```

### Field Naming Convention

```yaml
logging:
  structured:
    naming:
      # Naming style
      style: "snake_case"  # or camelCase, kebab-case

      # Namespace separator
      separator: "."

      # Reserved prefixes
      reserved:
        - "@"      # Elasticsearch metadata
        - "_"      # Internal fields
        - "ecs."   # Elastic Common Schema

      # Field mappings
      mappings:
        userId: "user.id"
        requestId: "request.id"
        errorMessage: "error.message"
```

---

## Context Propagation

### Request Context

```yaml
logging:
  structured:
    context:
      # Automatic context capture
      auto_capture:
        http_request:
          include:
            - "method"
            - "path"
            - "query_params"
            - "headers.user-agent"
            - "headers.x-request-id"
          exclude:
            - "headers.authorization"
            - "headers.cookie"

        user:
          include:
            - "id"
            - "role"
          exclude:
            - "password"
            - "api_key"

      # Context propagation
      propagation:
        trace_id:
          header: "x-trace-id"
          generate_if_missing: true

        span_id:
          header: "x-span-id"
          generate_if_missing: true
```

### Async Context

```typescript
// Context management
import { LogContext } from '@proagents/logging';

// Set context for async operations
LogContext.run({ requestId: 'req-123', userId: 'user-456' }, async () => {
  // All logs in this context include requestId and userId
  logger.info('Processing started');
  await processData();
  logger.info('Processing completed');
});
```

---

## Log Formatters

### JSON Formatter

```yaml
logging:
  formatters:
    json:
      # Pretty print in development
      pretty:
        enabled: "${NODE_ENV !== 'production'}"
        indent: 2

      # Escape special characters
      escape_unicode: false

      # Include null fields
      include_null: false

      # Max depth for nested objects
      max_depth: 5

      # Circular reference handling
      circular: "replace"  # or "error", "ignore"
```

### Output Examples

```yaml
logging:
  formatters:
    # Production (compact JSON)
    production:
      type: "json"
      single_line: true

    # Development (readable)
    development:
      type: "pretty"
      colors: true
      timestamp_format: "HH:mm:ss.SSS"

    # Debug (full details)
    debug:
      type: "json"
      pretty: true
      include_all: true
```

---

## Common Schemas

### ECS (Elastic Common Schema)

```yaml
logging:
  structured:
    schema: "ecs"

    ecs:
      version: "8.0"

      # Field mappings to ECS
      mappings:
        timestamp: "@timestamp"
        level: "log.level"
        message: "message"
        service_name: "service.name"
        trace_id: "trace.id"
        span_id: "span.id"
        user_id: "user.id"
        http_method: "http.request.method"
        http_status: "http.response.status_code"
        error_message: "error.message"
        error_stack: "error.stack_trace"
```

### OpenTelemetry

```yaml
logging:
  structured:
    schema: "otel"

    otel:
      version: "1.0"

      # Resource attributes
      resource:
        service.name: "${SERVICE_NAME}"
        service.version: "${VERSION}"
        deployment.environment: "${ENVIRONMENT}"

      # Automatic context from traces
      trace_context:
        enabled: true
        fields:
          - "trace_id"
          - "span_id"
          - "trace_flags"
```

---

## Code Examples

### JavaScript/TypeScript

```typescript
import { createLogger } from '@proagents/logging';

const logger = createLogger({
  name: 'my-service',
  level: 'info',
  format: 'json',
});

// Simple log
logger.info('Server started', { port: 3000 });

// With context
logger.info('User action', {
  event: { type: 'purchase', outcome: 'success' },
  user: { id: 'user-123' },
  order: { id: 'order-456', total: 99.99 },
});

// Error logging
try {
  await processOrder(order);
} catch (error) {
  logger.error('Order processing failed', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    order: { id: order.id },
  });
}
```

### Express Middleware

```typescript
import { requestLogger } from '@proagents/logging/express';

app.use(requestLogger({
  // Log request start
  logStart: true,

  // Log request end
  logEnd: true,

  // Include fields
  include: ['method', 'path', 'status', 'duration'],

  // Exclude paths
  exclude: ['/health', '/metrics'],

  // Custom field extraction
  customFields: (req, res) => ({
    user_id: req.user?.id,
    tenant_id: req.tenant?.id,
  }),
}));
```

---

## Commands

```bash
# Validate log format
proagents logging validate --format json

# Convert logs to structured format
proagents logging convert --input app.log --output app.json

# Query structured logs
proagents logging query --filter 'level:error AND service.name:api'

# Generate log schema
proagents logging schema --output schema.json
```

---

## Best Practices

1. **Consistent Schema**: Use the same field names across services
2. **Include Context**: Add request/trace IDs for correlation
3. **Avoid Nesting**: Keep structure relatively flat
4. **Type Consistency**: Same field should have same type
5. **Meaningful Events**: Use event.type for categorization
6. **Redact Sensitive Data**: Never log PII or secrets
