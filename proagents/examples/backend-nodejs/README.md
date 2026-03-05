# Backend Node.js Example

Complete walkthrough of ProAgents workflow for a Node.js backend API service.

---

## Overview

This example demonstrates how to use ProAgents to build features in a Node.js backend application. It covers API design, database operations, authentication, and service architecture.

---

## Project Type

- **Runtime:** Node.js 18+
- **Framework:** Express / Fastify
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma
- **Testing:** Vitest + Supertest

---

## Files in This Example

| File | Description |
|------|-------------|
| [workflow-example.md](./workflow-example.md) | Step-by-step workflow phases |
| [complete-conversation.md](./complete-conversation.md) | Full AI conversation example |
| [proagents.config.yaml](./proagents.config.yaml) | Project-specific configuration |

---

## What You'll Learn

### 1. Backend Analysis
- Understanding service architecture
- API endpoint mapping
- Database schema analysis
- Middleware and authentication flows

### 2. API Design
- RESTful endpoint design
- Request/response schemas (Zod)
- Error handling patterns
- API documentation (OpenAPI)

### 3. Implementation
- Controller and service layers
- Database operations
- Input validation
- Error handling and logging

### 4. Testing
- Unit tests for services
- Integration tests for API routes
- Database testing with transactions
- 85% coverage target for backend

---

## Quick Start

```bash
# Copy configuration to your Node.js project
cp proagents.config.yaml /path/to/your/nodejs-project/

# Start a new feature
proagents feature start "Add user preferences API"
```

---

## Example Feature: Preferences API

The complete-conversation.md shows building a preferences API:
- CRUD endpoints for user preferences
- Database schema and migrations
- Input validation with Zod
- Comprehensive error handling

---

## Key Patterns Demonstrated

### Project Structure
```
src/
├── controllers/      # Request handlers
│   └── users.controller.ts
├── services/         # Business logic
│   └── users.service.ts
├── models/           # Database models
│   └── user.model.ts
├── routes/           # Route definitions
│   └── users.routes.ts
├── middleware/       # Express middleware
│   ├── auth.ts
│   ├── validation.ts
│   └── error-handler.ts
├── schemas/          # Zod validation schemas
│   └── user.schema.ts
├── utils/            # Utilities
└── types/            # TypeScript types
```

### Layered Architecture
```
Request → Route → Controller → Service → Database
                      ↓
                  Validation
                      ↓
                  Response
```

---

## Configuration Highlights

```yaml
# From proagents.config.yaml
project:
  type: "backend"
  framework: "express"

database:
  orm: "prisma"
  require_migrations: true

api:
  versioning: "url"  # /api/v1/...
  documentation: "openapi"

testing:
  framework: "vitest"
  coverage_threshold: 85
  integration_tests: true

security:
  scan_dependencies: true
  require_auth_review: true

checkpoints:
  after_analysis: true    # Review existing patterns
  after_design: true      # Review API design
  before_deployment: true # Security review
```

---

## API Design Workflow

```bash
# ProAgents guides you through:
1. Define endpoint structure
2. Create Zod schemas for validation
3. Design error responses
4. Generate OpenAPI documentation
5. Implement with tests
```

---

## Security Considerations

### Authentication
- JWT token validation
- Role-based access control
- Rate limiting

### Input Validation
- Zod schema validation
- SQL injection prevention
- XSS protection

### Logging & Monitoring
- Request logging
- Error tracking
- Performance metrics

---

## Related Resources

- [Node.js Scaffolding Template](../../scaffolding/nodejs/)
- [API Versioning Guide](../../api-versioning/)
- [Database Migrations](../../database/)
- [Security Scanning](../../security/)
- [Contract Testing](../../contract-testing/)
