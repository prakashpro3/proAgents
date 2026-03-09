# Logging Best Practices

Structured logging for debugging, monitoring, and compliance.

---

## Overview

Consistent, structured logging that supports debugging, monitoring, and audit requirements.

## Documentation

| Document | Description |
|----------|-------------|
| [Log Levels](./log-levels.md) | When to use each level |
| [Structured Logging](./structured-logging.md) | JSON log format |
| [Log Aggregation](./aggregation.md) | Centralized logging |
| [Sensitive Data](./sensitive-data.md) | Protecting PII in logs |

---

## Log Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| `error` | Application errors requiring attention | Database connection failed |
| `warn` | Unexpected but handled situations | Retry attempt, deprecation |
| `info` | Normal operations, milestones | Request completed, user logged in |
| `debug` | Detailed debugging information | Variable values, flow tracking |
| `trace` | Very detailed tracing | Function entry/exit |

---

## Structured Logging

### JSON Log Format

```typescript
// src/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
});

// Usage
logger.info({
  event: 'user_login',
  userId: user.id,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
});
```

### Log Output

```json
{
  "level": "info",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "event": "user_login",
  "userId": "user-123",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

---

## Request Logging

### HTTP Request Logger

```typescript
// src/middleware/request-logger.ts
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      event: 'http_request',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      requestId: req.id,
      userId: req.user?.id,
    });
  });

  next();
}
```

### Request ID Tracking

```typescript
// Add unique ID to each request
import { v4 as uuid } from 'uuid';

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuid();
  res.setHeader('x-request-id', req.id);
  next();
});
```

---

## Configuration

```yaml
# proagents.config.yaml
logging:
  level: "info"  # error, warn, info, debug, trace

  format: "json"  # json, pretty

  # Include in all logs
  default_fields:
    service: "my-app"
    version: "${APP_VERSION}"
    environment: "${NODE_ENV}"

  # Output destinations
  outputs:
    - type: "stdout"
    - type: "file"
      path: "logs/app.log"
      rotate: "daily"

  # Aggregation
  aggregation:
    provider: "datadog"  # datadog, cloudwatch, elasticsearch
```

---

## Log Aggregation

### Send to Aggregator

```typescript
// DataDog example
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.Http({
      host: 'http-intake.logs.datadoghq.com',
      path: `/api/v2/logs?dd-api-key=${process.env.DD_API_KEY}`,
      ssl: true,
    }),
  ],
});
```

### Log Search

```
┌─────────────────────────────────────────────────────────────┐
│ Log Search: service:my-app level:error                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 10:30:15 ERROR Database connection failed                   │
│          requestId: abc-123                                 │
│          error: ECONNREFUSED                                │
│          host: db.example.com                               │
│                                                             │
│ 10:28:42 ERROR Payment processing failed                    │
│          requestId: def-456                                 │
│          userId: user-789                                   │
│          error: Card declined                               │
│                                                             │
│ 10:25:10 ERROR API rate limit exceeded                      │
│          requestId: ghi-789                                 │
│          endpoint: /api/users                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sensitive Data Protection

### What NOT to Log

```typescript
// ❌ Never log these
logger.info({ password: user.password });  // Credentials
logger.info({ ssn: user.ssn });            // PII
logger.info({ creditCard: payment.card }); // Financial
logger.info({ token: auth.token });        // Secrets

// ✅ Safe alternatives
logger.info({ userId: user.id });
logger.info({ last4: payment.card.slice(-4) });
```

### Automatic Redaction

```typescript
const logger = pino({
  redact: {
    paths: [
      'password',
      'secret',
      'token',
      '*.password',
      'user.email',
      'creditCard',
    ],
    censor: '[REDACTED]',
  },
});

// Input
logger.info({ user: { email: 'user@example.com', password: 'secret123' } });

// Output
{ "user": { "email": "[REDACTED]", "password": "[REDACTED]" } }
```

---

## Performance Logging

### Timing Operations

```typescript
// Track operation duration
async function processOrder(orderId: string) {
  const start = Date.now();

  try {
    const result = await doProcessing(orderId);

    logger.info({
      event: 'order_processed',
      orderId,
      duration: Date.now() - start,
      status: 'success',
    });

    return result;
  } catch (error) {
    logger.error({
      event: 'order_processing_failed',
      orderId,
      duration: Date.now() - start,
      error: error.message,
    });
    throw error;
  }
}
```

---

## Best Practices

1. **Use Structured Logs**: JSON format for machine parsing
2. **Include Request IDs**: Trace requests across services
3. **Log at Right Level**: Don't overuse error/debug
4. **Add Context**: Include relevant business context
5. **Protect Sensitive Data**: Redact PII and secrets
6. **Aggregate Logs**: Use centralized logging
7. **Monitor Log Volume**: High volume may indicate issues
8. **Rotate Log Files**: Prevent disk exhaustion
