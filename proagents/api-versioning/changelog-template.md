# API Changelog Template

Document API changes for each version.

---

## Changelog Format

```markdown
# API Changelog

All notable changes to the API are documented here.

## [v2.1.0] - 2024-01-15

### Added
- `GET /users/{id}/preferences` - Fetch user preferences
- `PUT /users/{id}/preferences` - Update user preferences
- `avatar_url` field to user response

### Changed
- `POST /auth/login` now returns refresh token in response body
- Rate limit increased from 100 to 200 requests/minute

### Deprecated
- `GET /users/{id}/settings` - Use `/preferences` instead (removal: v3.0.0)

### Fixed
- Fixed pagination returning duplicate items
- Fixed date format inconsistency in responses

### Security
- Added rate limiting to password reset endpoint

---

## [v2.0.0] - 2024-01-01

### Breaking Changes
- Response wrapper: All responses now wrapped in `{ data: ... }`
- Authentication: Moved from query parameter to Bearer token
- User ID: Changed from integer to UUID

### Added
- `POST /auth/refresh` - Refresh access token
- `DELETE /users/{id}` - Delete user account
- Pagination metadata in list responses

### Changed
- Error response format standardized
- All timestamps now in ISO 8601 format

### Removed
- `GET /users/search` - Use query parameters on `GET /users` instead
- `api_key` query parameter authentication

### Migration
See [v1 to v2 Migration Guide](./migration/v1-to-v2.md)
```

---

## Entry Types

### Added
New endpoints, fields, or features.

```markdown
### Added
- `GET /products/{id}/reviews` - List product reviews
- `rating` field added to product response
- Support for `sort` query parameter on list endpoints
```

### Changed
Modifications to existing behavior.

```markdown
### Changed
- `POST /orders` now requires `shipping_address` field
- Default page size changed from 10 to 20
- Error messages now include request ID
```

### Deprecated
Features marked for future removal.

```markdown
### Deprecated
- `GET /legacy/users` - Use `GET /users` instead
  - Deprecation date: 2024-03-01
  - Removal date: 2024-09-01
  - Migration guide: [link]
```

### Removed
Features that have been removed.

```markdown
### Removed
- `GET /v1/users` - Sunset completed
- `api_key` authentication method
- `legacy_id` field from user response
```

### Fixed
Bug fixes.

```markdown
### Fixed
- Fixed 500 error when email contains special characters
- Fixed incorrect count in pagination response
- Fixed timezone handling in date filters
```

### Security
Security-related changes.

```markdown
### Security
- Added CSRF protection to all state-changing endpoints
- Implemented rate limiting on authentication endpoints
- Fixed XSS vulnerability in user bio field
```

---

## Version Entry Template

```markdown
## [vX.Y.Z] - YYYY-MM-DD

### Summary
Brief description of this release.

### Breaking Changes
- [List breaking changes with migration instructions]

### Added
- [New endpoint/feature] - [Description]

### Changed
- [Modified behavior] - [What changed]

### Deprecated
- [Feature] - [Replacement and timeline]

### Removed
- [Feature] - [Reason]

### Fixed
- [Bug] - [What was fixed]

### Security
- [Security improvement]

### Documentation
- [Documentation updates]

### Internal
- [Internal changes not affecting API consumers]
```

---

## Automation

### Auto-Generate Changelog Entry

```yaml
# When creating PR for API changes
api_changelog:
  auto_generate: true

  detect_from:
    - route_changes
    - schema_changes
    - middleware_changes

  require_entry_for:
    - breaking_changes
    - new_endpoints
    - deprecated_features
```

### PR Template for API Changes

```markdown
## API Change Description

### Type of Change
- [ ] New endpoint
- [ ] Modified endpoint
- [ ] Deprecated endpoint
- [ ] Breaking change
- [ ] Bug fix
- [ ] Security fix

### Changelog Entry
```
### Added/Changed/Deprecated/Fixed
- [Your changelog entry here]
```

### Breaking Change Details
If breaking change, describe:
- What breaks
- Migration steps
- Timeline

### Documentation
- [ ] API docs updated
- [ ] Changelog updated
- [ ] Migration guide created (if breaking)
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:api-changelog add` | Add changelog entry |
| `pa:api-changelog view` | View API changelog |
| `pa:api-changelog generate` | Auto-generate from changes |
