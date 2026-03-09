# Architecture Rules Template

Copy this file to `architecture-rules.md` and customize for your project.

---

## Project Type: [Web Frontend | Full-Stack | Backend | Mobile]

---

## Directory Structure

```
[Define your expected directory structure]

src/
├── [folder]/     # [purpose]
├── [folder]/     # [purpose]
└── [folder]/     # [purpose]
```

---

## Dependency Rules

### Allowed Dependencies

| Layer | Can Import From |
|-------|-----------------|
| Components | hooks, utils, types, services |
| Pages | components, hooks, services |
| Services | utils, types |
| Utils | types only |

### Forbidden Dependencies

- Components CANNOT import from pages
- Utils CANNOT import from services
- No circular dependencies

---

## State Management

**Approach:** [Redux | Zustand | Context | MobX | None]

Rules:
- Global state for: [list what goes in global state]
- Local state for: [list what stays local]
- Server state managed by: [React Query | SWR | Apollo | etc.]

---

## API Patterns

**Style:** [REST | GraphQL | tRPC | gRPC]

Rules:
- All API calls through: `[service layer path]`
- Error handling: [centralized | per-call]
- Authentication: [how auth is handled]

---

## Component Patterns

**Style:** [Functional only | Class allowed]

Rules:
- Props interface above component
- Destructure props in signature
- Use memo() for: [criteria]
- Max component size: [lines or recommendation]

---

## Database Access

**ORM/Query Builder:** [Prisma | TypeORM | Drizzle | Raw SQL]

Rules:
- All queries in: `[repository/service path]`
- Transactions for: [multi-table operations]
- No raw SQL in: [controllers/routes]

---

## Authentication & Authorization

**Method:** [JWT | Session | OAuth]

Rules:
- Auth middleware on: [which routes]
- Role checks in: [where]
- Token storage: [localStorage | httpOnly cookie | memory]

---

## Error Handling

**Strategy:** [Error boundaries | Global handler | Per-component]

Rules:
- All errors logged to: [service]
- User-facing errors: [how handled]
- API errors: [format and handling]

---

## Performance Requirements

- Bundle size limit: [size]
- Initial load time: [target]
- API response time: [target]
- Core Web Vitals targets: [LCP, FID, CLS]

---

## Security Requirements

- Input validation: [where and how]
- Output encoding: [XSS prevention]
- CSRF protection: [method]
- Rate limiting: [requirements]
