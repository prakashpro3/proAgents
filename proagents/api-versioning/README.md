# API Versioning

Manage API versions, deprecation, and backward compatibility.

---

## Overview

API versioning ensures smooth evolution of your APIs while maintaining backward compatibility for existing clients. ProAgents helps you manage API versions throughout the development lifecycle.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Versioning Strategy](./versioning-strategy.md) | URL vs header versioning, semantic versioning |
| [Deprecation Workflow](./deprecation-workflow.md) | Deprecation timeline, migration guides |
| [Changelog Template](./changelog-template.md) | API changelog format and automation |

---

## Versioning Strategies

### 1. URL-Based Versioning (Recommended)

```
https://api.example.com/v1/users
https://api.example.com/v2/users
```

**Pros:**
- Clear and explicit
- Easy to understand
- Cache-friendly
- Easy to test

**Cons:**
- URL changes between versions
- Multiple endpoints to maintain

### 2. Header-Based Versioning

```http
GET /users HTTP/1.1
Accept: application/vnd.api+json;version=2
```

**Pros:**
- Clean URLs
- Same resource URL across versions

**Cons:**
- Less visible
- Harder to test in browser
- Cache configuration needed

### 3. Query Parameter Versioning

```
https://api.example.com/users?version=2
```

**Pros:**
- Simple to implement
- Easy to test

**Cons:**
- Not RESTful
- Caching issues

---

## Quick Start

```yaml
# proagents.config.yaml
api_versioning:
  strategy: "url"              # url | header | query
  current_version: "v2"
  supported_versions: ["v1", "v2"]
  deprecation_notice: "6 months"

  # Version lifecycle
  lifecycle:
    alpha: "unstable, may change"
    beta: "stable, may have bugs"
    stable: "production ready"
    deprecated: "will be removed"
    sunset: "no longer available"
```

---

## Version Lifecycle

```
Alpha → Beta → Stable → Deprecated → Sunset
  ↓       ↓       ↓          ↓          ↓
Unstable  Testing  Current    Notice     Removed
```

### Timeline Example

| Version | Status | Date | Notes |
|---------|--------|------|-------|
| v1 | Deprecated | 2024-01 | Migration notice sent |
| v1 | Sunset | 2024-07 | No longer available |
| v2 | Stable | 2024-01 | Current version |
| v3 | Beta | 2024-06 | Testing phase |

---

## Commands

```bash
# Check API compatibility between versions
proagents api check-compatibility v1 v2

# Generate API changelog
proagents api changelog

# Generate migration guide
proagents api migration-guide v1 v2

# Mark version deprecated
proagents api deprecate v1 --sunset "2024-06-01"

# Check for breaking changes
proagents api breaking-changes v1 v2

# Validate API schema
proagents api validate-schema
```

---

## Breaking vs Non-Breaking Changes

### Breaking Changes (Require New Version)

| Change Type | Example |
|-------------|---------|
| Remove endpoint | DELETE /api/v1/legacy |
| Remove field | Remove `user.username` |
| Rename field | `user_id` → `userId` |
| Change field type | `id: number` → `id: string` |
| Add required field | Add required `email` |
| Change HTTP method | GET → POST |
| Change authentication | API key → OAuth |

### Non-Breaking Changes (Same Version)

| Change Type | Example |
|-------------|---------|
| Add endpoint | New POST /api/v1/preferences |
| Add optional field | Add `user.nickname` |
| Add enum value | Status: `active` → `active, pending` |
| Widen type | `int` → `number` |
| Deprecate (not remove) | Mark field deprecated |
| Add optional parameter | Add `?limit=10` |

---

## Deprecation Process

### Phase 1: Announcement (T-6 months)
- Add deprecation warnings to responses
- Update documentation
- Notify API consumers

### Phase 2: Migration Support (T-3 months)
- Provide migration guides
- Offer migration tools/scripts
- Support both versions

### Phase 3: Final Notice (T-1 month)
- Send final reminders
- Reduce support for deprecated version
- Track remaining usage

### Phase 4: Sunset (T-0)
- Remove deprecated version
- Return 410 Gone for old endpoints
- Archive documentation

---

## Response Headers

```http
HTTP/1.1 200 OK
X-API-Version: 2
X-API-Deprecated: true
X-API-Sunset: 2024-06-01
Link: <https://api.example.com/v2/users>; rel="successor-version"
```

---

## Changelog Format

```markdown
# API Changelog

## [v2.1.0] - 2024-01-15

### Added
- `GET /users/{id}/preferences` - Fetch user preferences
- `POST /users/{id}/avatar` - Upload user avatar

### Changed
- `GET /users` now supports pagination (breaking: removed `all` parameter)

### Deprecated
- `GET /users/{id}/settings` - Use `/preferences` instead

### Removed
- None

### Fixed
- Fixed rate limit calculation for authenticated requests

### Security
- Added input validation for user search endpoint
```

---

## Integration with Development

### During Implementation
- Check for breaking changes before implementation
- Generate version comparison reports
- Suggest migration strategies

### During Testing
- Test against multiple API versions
- Verify backward compatibility
- Check deprecation warnings

### During Documentation
- Generate version-specific docs
- Create migration guides
- Update changelog automatically

---

## Best Practices

1. **Version early** - Add versioning from the start
2. **Document changes** - Keep detailed changelogs
3. **Communicate** - Give advance notice of breaking changes
4. **Support transitions** - Maintain deprecated versions during migration
5. **Monitor usage** - Track version usage to guide sunset decisions
6. **Test thoroughly** - Test both old and new versions
7. **Use semantic versioning** - Major.Minor.Patch for clear communication
