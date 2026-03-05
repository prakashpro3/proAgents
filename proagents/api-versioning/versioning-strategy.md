# API Versioning Strategy

Manage API versions and maintain backward compatibility.

---

## Versioning Approaches

### 1. URL Path Versioning (Recommended)

```
/api/v1/users
/api/v2/users
```

**Pros:**
- Clear and explicit
- Easy to route
- Works with all clients

**Implementation:**
```typescript
// routes/index.ts
import { Router } from 'express';
import v1Routes from './v1';
import v2Routes from './v2';

const router = Router();

router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

export default router;
```

---

### 2. Header Versioning

```
Accept: application/vnd.api+json;version=2
```

**Implementation:**
```typescript
// middleware/version.middleware.ts
export function versionMiddleware(req, res, next) {
  const acceptHeader = req.headers.accept || '';
  const versionMatch = acceptHeader.match(/version=(\d+)/);
  req.apiVersion = versionMatch ? parseInt(versionMatch[1]) : 1;
  next();
}
```

---

### 3. Query Parameter Versioning

```
/api/users?version=2
```

**Note:** Generally not recommended, but useful for quick testing.

---

## Version Lifecycle

### Version States

| State | Description | Support Level |
|-------|-------------|---------------|
| **Current** | Active, recommended version | Full support |
| **Supported** | Still maintained | Security fixes |
| **Deprecated** | Marked for removal | Limited support |
| **Sunset** | No longer available | No support |

### Lifecycle Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│ Version Lifecycle                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ v1 ──────────────┬─────────────┬────────────┬────────────────  │
│    Current       │ Supported   │ Deprecated │ Sunset           │
│    (12 months)   │ (6 months)  │ (6 months) │                  │
│                  │             │            │                  │
│ v2 ──────────────┴─────────────┴────────────┴─────────────     │
│    Development → Current → Supported → Deprecated → Sunset     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Breaking vs Non-Breaking Changes

### Non-Breaking (Safe in same version)

- Adding new endpoints
- Adding optional fields to responses
- Adding optional query parameters
- Adding new enum values (if client ignores unknown)
- Performance improvements
- Bug fixes

### Breaking (Requires new version)

- Removing endpoints
- Removing response fields
- Changing field types
- Renaming fields
- Changing authentication
- Changing error formats
- Making optional fields required

---

## Version Migration Guide

### Creating a New Version

```bash
# 1. Copy existing version
cp -r src/api/v1 src/api/v2

# 2. Update version routes
# src/api/v2/index.ts

# 3. Implement changes
# Make breaking changes in v2

# 4. Update API docs
# docs/api/v2.md

# 5. Create migration guide
# docs/migration/v1-to-v2.md
```

### Migration Guide Template

```markdown
# Migration Guide: v1 to v2

## Overview
Summary of changes in v2.

## Breaking Changes

### 1. User Response Format
**Before (v1):**
```json
{ "id": 1, "name": "John" }
```

**After (v2):**
```json
{ "data": { "id": "uuid", "fullName": "John" } }
```

**Migration:**
- Update response parsing
- Change `name` to `fullName`
- Handle wrapped response

### 2. Authentication
**Before:** API key in query
**After:** Bearer token in header

**Migration:**
```javascript
// Before
fetch('/api/v1/users?apiKey=xxx')

// After
fetch('/api/v2/users', {
  headers: { 'Authorization': 'Bearer xxx' }
})
```

## Deprecation Timeline
- v1 deprecated: March 1, 2024
- v1 sunset: September 1, 2024
```

---

## Deprecation Process

### 1. Announce Deprecation

```typescript
// Add deprecation header
app.use('/api/v1', (req, res, next) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 01 Sep 2024 00:00:00 GMT');
  res.set('Link', '</api/v2>; rel="successor-version"');
  next();
});
```

### 2. Add Warning to Responses

```json
{
  "data": { ... },
  "_warnings": [
    {
      "code": "DEPRECATED_VERSION",
      "message": "API v1 is deprecated. Please migrate to v2 by September 1, 2024.",
      "documentation": "https://docs.example.com/migration/v1-to-v2"
    }
  ]
}
```

### 3. Track Usage

```typescript
// Log v1 usage for migration tracking
app.use('/api/v1', (req, res, next) => {
  logger.info('v1_api_call', {
    endpoint: req.path,
    client: req.headers['user-agent'],
    timestamp: new Date()
  });
  next();
});
```

### 4. Notify Clients

```markdown
Subject: API v1 Deprecation Notice

Dear Developer,

API v1 will be deprecated on March 1, 2024, and sunset on September 1, 2024.

Action Required:
- Migrate to API v2 before September 1, 2024
- See migration guide: [link]
- Contact support if you need assistance

Timeline:
- March 1: Deprecation warnings added
- June 1: Rate limits reduced on v1
- September 1: v1 endpoints return 410 Gone
```

---

## Configuration

```yaml
# proagents.config.yaml

api_versioning:
  strategy: "url_path"  # url_path | header | query
  prefix: "/api"

  versions:
    v1:
      status: "deprecated"
      sunset_date: "2024-09-01"
      successor: "v2"

    v2:
      status: "current"

  deprecation:
    warning_header: true
    response_warning: true
    log_usage: true

  documentation:
    auto_generate: true
    format: "openapi"
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:api-version new [version]` | Create new API version |
| `pa:api-version deprecate [version]` | Mark version as deprecated |
| `pa:api-version status` | Show version status |
| `pa:api-migration-guide [from] [to]` | Generate migration guide |
