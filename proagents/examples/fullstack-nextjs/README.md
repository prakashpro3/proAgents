# Full-Stack Next.js Example

Complete walkthrough of ProAgents workflow for a Next.js full-stack application.

---

## Overview

This example demonstrates how to use ProAgents to build features in a Next.js application with both frontend and backend concerns. It covers API routes, database integration, and server-side rendering.

---

## Project Type

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** Prisma + PostgreSQL
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **Testing:** Vitest + Playwright

---

## Files in This Example

| File | Description |
|------|-------------|
| [workflow-example.md](./workflow-example.md) | Step-by-step workflow phases |
| [proagents.config.yaml](./proagents.config.yaml) | Project-specific configuration |

---

## What You'll Learn

### 1. Full-Stack Analysis
- Understanding App Router structure
- Identifying API routes and server actions
- Database schema analysis
- Authentication flow mapping

### 2. Feature Planning
- Coordinating frontend and backend changes
- Database migration planning
- API design and documentation

### 3. Implementation
- Server components vs client components
- API route handlers
- Database operations with Prisma
- Form handling with server actions

### 4. Testing
- Unit tests for utilities and hooks
- API route testing
- E2E tests with Playwright
- Database integration tests

---

## Quick Start

```bash
# Copy configuration to your Next.js project
cp proagents.config.yaml /path/to/your/nextjs-project/

# Start a new feature
proagents feature start "Add user settings page with API"
```

---

## Example Feature: Settings Page

The workflow-example.md demonstrates building a settings feature:
- Settings page with tabs (App Router)
- API routes for preferences CRUD
- Database schema updates
- Form validation and submission

---

## Key Patterns Demonstrated

### Project Structure
```
app/
├── (auth)/           # Auth-required routes
│   ├── dashboard/
│   └── settings/
├── api/              # API routes
│   └── settings/
├── layout.tsx
└── page.tsx
lib/
├── db.ts             # Prisma client
├── auth.ts           # Auth configuration
└── validations/      # Zod schemas
prisma/
├── schema.prisma
└── migrations/
```

### Full-Stack Workflow
1. **Analysis:** Understand existing patterns
2. **Database:** Plan schema changes first
3. **API:** Implement backend routes
4. **Frontend:** Build UI components
5. **Integration:** Connect frontend to API
6. **Testing:** Test all layers

---

## Configuration Highlights

```yaml
# From proagents.config.yaml
project:
  type: "fullstack"
  framework: "nextjs"

database:
  orm: "prisma"
  require_migrations: true

testing:
  unit_framework: "vitest"
  e2e_framework: "playwright"
  coverage_threshold: 80

checkpoints:
  after_analysis: true    # Review before changes
  after_design: true      # Review API design
  before_deployment: true # Final review
```

---

## Database Migration Workflow

```bash
# ProAgents guides you through:
1. Schema change design
2. Migration generation: npx prisma migrate dev
3. Migration review
4. Rollback script preparation
```

---

## Related Resources

- [Next.js Scaffolding Template](../../scaffolding/nextjs/)
- [Database Migrations Guide](../../database/)
- [API Versioning](../../api-versioning/)
- [Testing Standards](../../testing-standards/)
