# ADR-0002: Use URL-Based API Versioning

## Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2024-01-20 |
| **Author** | @api-lead |
| **Reviewers** | @tech-lead, @frontend-lead, @mobile-lead |
| **Tags** | api, versioning, backend |

---

## Context

Our API is evolving rapidly, and we need to make breaking changes to improve the data model and fix design mistakes. However, we have multiple clients:

- Web application (controlled release cycle)
- iOS app (App Store review delays)
- Android app (Play Store delays)
- Third-party integrations (no control over update timeline)

We need a versioning strategy that allows us to:
- Make breaking changes without disrupting existing clients
- Maintain multiple versions during transition periods
- Deprecate old versions gracefully
- Keep the implementation manageable

Currently, our API has no versioning, and breaking changes require coordinated releases across all clients, which is becoming increasingly difficult.

---

## Decision

We will implement **URL-based API versioning** with the following structure:

```
https://api.example.com/v1/users
https://api.example.com/v2/users
```

**Rules:**
- Major version in URL path (`/v1/`, `/v2/`, etc.)
- Minor/patch changes within a version are backward compatible
- Support N-2 versions minimum (e.g., v3 current, v2 and v1 still supported)
- Deprecation period of 6 months before version removal
- Version-specific documentation and changelogs

---

## Rationale

URL-based versioning was chosen because:

1. **Visibility**: Version is immediately apparent in logs, monitoring, and debugging.

2. **Simplicity**: No header parsing required; easy to test with browser or curl.

3. **Routing**: Easy to route different versions to different server instances if needed.

4. **Caching**: CDN and proxy caching works naturally without custom rules.

5. **Documentation**: API docs can cleanly separate versions.

6. **Adoption**: Most widely used pattern, familiar to developers.

---

## Consequences

### Positive

- **Clear separation** between API versions
- **Easy debugging** - version visible in all requests
- **Simple client implementation** - just change base URL
- **Independent deployment** - can deploy v2 without affecting v1
- **Gradual migration** - clients can upgrade on their own schedule
- **Clean deprecation** - can monitor and sunset old versions

### Negative

- **URL pollution** - version becomes part of the resource path
- **Duplication** - may need to duplicate code for multiple versions
- **Maintenance burden** - supporting multiple versions increases work
- **Not pure REST** - version is not a resource characteristic

### Neutral

- Requires documentation for each supported version
- Need monitoring per version to track adoption

---

## Alternatives Considered

### Alternative 1: Header-Based Versioning

**Description:** Version specified in HTTP header (`Accept: application/vnd.api.v1+json`)

**Pros:**
- Cleaner URLs
- More "RESTful"
- Flexible media type negotiation

**Cons:**
- Harder to test (can't just use browser)
- Version not visible in logs without custom parsing
- Caching requires header inspection
- More complex client implementation

**Why not chosen:** The debugging and caching complications outweigh the purity benefits.

### Alternative 2: Query Parameter Versioning

**Description:** Version in query string (`/users?version=1`)

**Pros:**
- URLs stay clean for latest version
- Easy to implement

**Cons:**
- Easy to forget parameter
- Caching complications
- Looks hacky
- Conflicts with actual query parameters

**Why not chosen:** Too easy to accidentally use wrong version; feels unprofessional.

### Alternative 3: No Versioning (Evolutionary API)

**Description:** Never make breaking changes; only additive changes.

**Pros:**
- No version management
- Single codebase
- Simple

**Cons:**
- Limits our ability to improve API design
- Technical debt accumulates
- Doesn't work for significant changes

**Why not chosen:** We need the flexibility to make breaking improvements to our API.

### Alternative 4: Date-Based Versioning

**Description:** Use dates in URL (`/2024-01-15/users`)

**Pros:**
- Clear when version was released
- Naturally ordered

**Cons:**
- Verbose URLs
- Confusing if version released on different dates
- Not a standard pattern

**Why not chosen:** Non-standard, potentially confusing for developers.

---

## Implementation

### Approach

We will implement versioning as a first-class routing concern with shared code where possible.

### Structure

```
src/
├── api/
│   ├── v1/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── schemas/
│   ├── v2/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── schemas/
│   └── shared/
│       ├── middleware/
│       ├── services/
│       └── utils/
```

### Routing

```typescript
// Server setup
import v1Router from './api/v1/routes';
import v2Router from './api/v2/routes';

app.use('/v1', v1Router);
app.use('/v2', v2Router);

// Default to latest
app.use('/api', v2Router);
```

### Version Lifecycle

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Active    │ →   │  Current    │ →   │ Deprecated  │ →   │   Sunset    │
│  (default)  │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
     v2                  v1                  v0               (removed)
```

### Deprecation Headers

```typescript
// For deprecated versions
app.use('/v1', (req, res, next) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 15 Jun 2024 00:00:00 GMT');
  res.set('Link', '</v2>; rel="successor-version"');
  next();
});
```

### Phases

1. **Phase 1: Infrastructure** (Sprint 1)
   - Set up versioned routing
   - Create v1 namespace for existing API
   - Add version monitoring

2. **Phase 2: Documentation** (Sprint 1)
   - Version-specific API docs
   - Migration guide template
   - Deprecation policy documentation

3. **Phase 3: v2 Development** (Sprint 2-3)
   - Design v2 schema
   - Implement v2 endpoints
   - Create migration guide

4. **Phase 4: Client Migration** (Sprint 4-6)
   - Update web application
   - Update mobile applications
   - Notify third-party integrators

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Clients don't migrate | Medium | High | Clear deprecation timeline, support |
| Code duplication | High | Medium | Shared services layer |
| Version proliferation | Low | Medium | Strict version policy, regular cleanup |

---

## Validation

### Success Criteria

- [ ] All existing clients work without changes on /v1
- [ ] New features can be added to /v2 without breaking /v1
- [ ] Version-specific monitoring shows clear adoption metrics
- [ ] Documentation clearly separates version information
- [ ] At least 80% of traffic on latest version within 6 months

### Metrics to Track

- Request count per version
- Error rate per version
- Client distribution per version
- Time to deprecation compliance

### Review Date

This decision will be reviewed on 2024-07-20 (6 months after implementation) to assess:
- Is the versioning strategy working?
- Are we maintaining too many versions?
- Should we adjust the deprecation timeline?

---

## References

- [API Versioning Best Practices](https://www.postman.com/api-platform/api-versioning/)
- [Stripe API Versioning](https://stripe.com/docs/api/versioning)
- [GitHub API Versioning](https://docs.github.com/en/rest/overview/api-versions)
- Internal RFC: API Design Guidelines (link)

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2024-01-18 | @api-lead | Initial draft |
| 2024-01-19 | @api-lead | Added deprecation headers section |
| 2024-01-20 | @api-lead | Status changed to Accepted |
