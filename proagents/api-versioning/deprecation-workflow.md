# API Deprecation Workflow

Systematic process for deprecating API endpoints and features.

---

## Overview

Proper API deprecation ensures:
- Smooth migration for API consumers
- Backward compatibility during transition
- Clear communication and timelines
- Zero-downtime transitions

---

## Deprecation Lifecycle

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Active    │────▶│  Deprecated │────▶│   Sunset    │────▶│   Removed   │
│             │     │             │     │   Warning   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                    │             │     │             │
                    │  6 months   │     │  1 month    │
                    │  notice     │     │  final      │
                    └─────────────┘     └─────────────┘
```

---

## Deprecation States

### 1. Active (Current)
```yaml
state: active
status: "Fully supported"
actions:
  - "Available in documentation"
  - "No deprecation headers"
  - "Full support provided"
```

### 2. Deprecated
```yaml
state: deprecated
status: "Still functional, migration recommended"
duration: "6 months typical"
actions:
  - "Add deprecation headers to responses"
  - "Update documentation with warning"
  - "Provide migration guide"
  - "Log usage for tracking"
  - "Notify known API consumers"
```

### 3. Sunset Warning
```yaml
state: sunset
status: "Will be removed soon"
duration: "1 month before removal"
actions:
  - "Increase warning visibility"
  - "Direct outreach to active users"
  - "Final migration reminder"
  - "Prepare removal PR"
```

### 4. Removed
```yaml
state: removed
status: "No longer available"
actions:
  - "Return 410 Gone status"
  - "Include migration information in response"
  - "Archive documentation"
```

---

## Implementing Deprecation

### Response Headers

```typescript
// src/middleware/deprecation.ts
import { NextResponse } from 'next/server';

interface DeprecationConfig {
  deprecationDate: string;
  sunsetDate: string;
  alternativeEndpoint?: string;
  migrationGuide?: string;
}

export function addDeprecationHeaders(
  response: NextResponse,
  config: DeprecationConfig
) {
  // Standard deprecation header
  response.headers.set('Deprecation', config.deprecationDate);

  // Sunset header (RFC 8594)
  response.headers.set('Sunset', config.sunsetDate);

  // Link to alternative/migration guide
  const links: string[] = [];

  if (config.alternativeEndpoint) {
    links.push(`<${config.alternativeEndpoint}>; rel="successor-version"`);
  }

  if (config.migrationGuide) {
    links.push(`<${config.migrationGuide}>; rel="deprecation"`);
  }

  if (links.length > 0) {
    response.headers.set('Link', links.join(', '));
  }

  return response;
}

// Usage in API route
export async function GET(request: Request) {
  const response = NextResponse.json({ data: users });

  return addDeprecationHeaders(response, {
    deprecationDate: '2024-01-15',
    sunsetDate: '2024-07-15',
    alternativeEndpoint: '/api/v2/users',
    migrationGuide: 'https://docs.example.com/api/migration/v1-to-v2',
  });
}
```

### Response Body Warning

```typescript
// Include deprecation warning in response body
export async function GET(request: Request) {
  const users = await getUsers();

  return NextResponse.json({
    data: users,
    _deprecation: {
      warning: 'This endpoint is deprecated and will be removed on 2024-07-15',
      alternative: '/api/v2/users',
      migrationGuide: 'https://docs.example.com/api/migration/v1-to-v2',
    },
  });
}
```

### Deprecation Logger

```typescript
// src/lib/deprecation-logger.ts
import { logger } from './logger';

interface DeprecationLog {
  endpoint: string;
  clientId: string;
  timestamp: Date;
  userAgent: string;
  sunsetDate: string;
}

export async function logDeprecatedUsage(request: Request, endpoint: string) {
  const log: DeprecationLog = {
    endpoint,
    clientId: request.headers.get('x-client-id') || 'unknown',
    timestamp: new Date(),
    userAgent: request.headers.get('user-agent') || 'unknown',
    sunsetDate: getEndpointSunsetDate(endpoint),
  };

  logger.warn('Deprecated endpoint accessed', log);

  // Store for analytics
  await storeDeprecationMetric(log);
}
```

---

## Deprecation Registry

```yaml
# config/deprecations.yaml
deprecations:
  - endpoint: "/api/v1/users"
    method: "GET"
    deprecated_date: "2024-01-15"
    sunset_date: "2024-07-15"
    alternative: "/api/v2/users"
    migration_guide: "https://docs.example.com/migration/users-v2"
    reason: "New pagination format in v2"
    breaking_changes:
      - "Response format changed"
      - "Pagination parameters renamed"

  - endpoint: "/api/v1/users/:id/settings"
    method: "GET"
    deprecated_date: "2024-02-01"
    sunset_date: "2024-08-01"
    alternative: "/api/v2/users/:id/preferences"
    migration_guide: "https://docs.example.com/migration/settings-to-preferences"
    reason: "Merged with preferences endpoint"
    breaking_changes:
      - "Endpoint path changed"
      - "Response schema updated"

  - endpoint: "/api/v1/auth/login"
    method: "POST"
    deprecated_date: "2024-03-01"
    sunset_date: "2024-09-01"
    alternative: "/api/v2/auth/signin"
    reason: "OAuth 2.0 implementation"
    breaking_changes:
      - "Token format changed to JWT"
      - "Refresh token flow updated"
```

---

## Migration Guide Template

```markdown
# Migration Guide: API v1 to v2

## Overview
This guide helps you migrate from API v1 to v2. The v1 API will be
sunset on **July 15, 2024**.

## Timeline
- **January 15, 2024**: v1 deprecated, v2 released
- **April 15, 2024**: Migration deadline for SLA support
- **July 15, 2024**: v1 sunset (removed)

## Quick Comparison

| Feature | v1 | v2 |
|---------|----|----|
| Base URL | `/api/v1` | `/api/v2` |
| Auth | API Key | OAuth 2.0 |
| Pagination | `page`, `limit` | `cursor`, `pageSize` |
| Response format | Nested | Flat with `_links` |

## Endpoint Changes

### Users List

**v1 (Deprecated):**
```bash
GET /api/v1/users?page=1&limit=10
```

**v2 (New):**
```bash
GET /api/v2/users?cursor=abc123&pageSize=10
```

### Response Format Changes

**v1 Response:**
```json
{
  "users": [
    { "id": "1", "name": "John" }
  ],
  "pagination": {
    "page": 1,
    "total": 100
  }
}
```

**v2 Response:**
```json
{
  "data": [
    { "id": "1", "name": "John" }
  ],
  "meta": {
    "cursor": "abc123",
    "hasMore": true
  },
  "_links": {
    "next": "/api/v2/users?cursor=def456"
  }
}
```

## Code Migration Examples

### JavaScript/TypeScript

**Before (v1):**
```typescript
const response = await fetch('/api/v1/users?page=1&limit=10', {
  headers: { 'X-API-Key': apiKey },
});
const { users, pagination } = await response.json();
```

**After (v2):**
```typescript
const response = await fetch('/api/v2/users?pageSize=10', {
  headers: { 'Authorization': `Bearer ${accessToken}` },
});
const { data, meta, _links } = await response.json();
```

## Common Issues

### Issue: 401 Unauthorized
**Cause:** Using old API key authentication
**Solution:** Migrate to OAuth 2.0 authentication

### Issue: 400 Bad Request on pagination
**Cause:** Using `page` parameter instead of `cursor`
**Solution:** Use cursor-based pagination

## Support

- Migration support: api-support@example.com
- Documentation: https://docs.example.com/api/v2
- Status page: https://status.example.com
```

---

## Communication Templates

### Initial Deprecation Notice

```markdown
Subject: API v1 Deprecation Notice - Action Required by July 15, 2024

Dear API Consumer,

We are writing to inform you that **API v1 will be deprecated** starting
January 15, 2024, and **sunset on July 15, 2024**.

## What's Changing
- API v1 endpoints will return deprecation headers
- API v2 is now available with improved features

## Timeline
- **Now - January 15**: Both v1 and v2 available
- **January 15 - July 15**: v1 deprecated, migration period
- **July 15**: v1 removed

## Your Action Items
1. Review the migration guide: [link]
2. Update your integration to use v2
3. Test in our sandbox environment

## Need Help?
- Migration guide: [link]
- API support: api-support@example.com

Thank you for being a valued API consumer.

Best regards,
The API Team
```

### 30-Day Warning

```markdown
Subject: [URGENT] API v1 Sunset in 30 Days - Migrate Now

Dear API Consumer,

**API v1 will be removed in 30 days (July 15, 2024).**

Our records show your application `{app_name}` is still using v1 endpoints.
To avoid service disruption, please migrate to v2 immediately.

## Your Recent v1 Usage
- Endpoint: /api/v1/users
- Last access: {date}
- Daily requests: ~{count}

## Migration Resources
- Quick start guide: [link]
- Code examples: [link]
- Support contact: api-support@example.com

We're here to help! Reply to this email if you need migration assistance.

Regards,
The API Team
```

---

## Automated Deprecation Workflow

```yaml
# .github/workflows/deprecation-check.yml
name: Deprecation Status Check

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM

jobs:
  check-deprecations:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Check deprecation dates
        run: |
          node scripts/check-deprecations.js

      - name: Send notifications
        if: env.NOTIFY_REQUIRED == 'true'
        run: |
          node scripts/send-deprecation-notifications.js
```

---

## Configuration

```yaml
# proagents.config.yaml

api:
  deprecation:
    enabled: true

    defaults:
      deprecation_period: "6 months"
      sunset_warning: "30 days"

    headers:
      add_deprecation: true
      add_sunset: true
      add_link: true

    logging:
      log_deprecated_usage: true
      notify_threshold: 100  # Notify if endpoint used > 100 times/day

    notifications:
      channels: ["email", "slack"]
      templates_path: "config/deprecation-templates/"

    response:
      include_warning_in_body: true
      include_migration_link: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/api-deprecate` | Start deprecation wizard |
| `/api-deprecate --endpoint [path]` | Deprecate specific endpoint |
| `/api-deprecate --list` | List all deprecated endpoints |
| `/api-deprecate --usage [endpoint]` | Show usage statistics |
| `/api-deprecate --notify` | Send migration reminders |
