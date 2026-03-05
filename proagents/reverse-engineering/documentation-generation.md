# Documentation Generation

Automatically generate documentation from existing code.

---

## Documentation Types

### 1. API Documentation

Generates OpenAPI/Swagger documentation from API routes.

```yaml
api_docs:
  source: "src/app/api/"
  output: "docs/api/"
  format: "openapi"

  extracted:
    endpoints: 24
    schemas: 18
    auth_methods: 2

  output_files:
    - "openapi.yaml"
    - "api-reference.md"
```

**Generated OpenAPI:**

```yaml
openapi: 3.0.0
info:
  title: MyApp API
  version: 1.0.0
  description: Auto-generated from source code

paths:
  /api/users:
    get:
      summary: List all users
      description: Extracted from route handler JSDoc
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        200:
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedUsers'
        401:
          description: Unauthorized

    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserInput'
      responses:
        201:
          description: User created

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        name:
          type: string
```

---

### 2. Component Documentation

Generates documentation for UI components.

```markdown
# Component: UserProfile

## Overview
Displays and allows editing of user profile information.

## Location
`src/components/UserProfile/UserProfile.tsx`

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| userId | string | Yes | - | The user's unique identifier |
| onUpdate | (user: User) => void | No | undefined | Callback when profile is updated |
| editable | boolean | No | true | Whether profile can be edited |

## Usage

```tsx
import { UserProfile } from '@/components/UserProfile';

function ProfilePage() {
  return (
    <UserProfile
      userId="123"
      onUpdate={(user) => console.log('Updated:', user)}
      editable={true}
    />
  );
}
```

## Internal State

| State | Type | Description |
|-------|------|-------------|
| isEditing | boolean | Edit mode toggle |
| formData | UserFormData | Form field values |

## Dependencies

- `useUser` hook
- `Button` component
- `Avatar` component
- `userService`

## Events

| Event | Trigger | Action |
|-------|---------|--------|
| onEdit | Edit button click | Enters edit mode |
| onSave | Save button click | Saves changes to API |
| onCancel | Cancel button click | Discards changes |

## Accessibility

- Uses semantic HTML elements
- All inputs have labels
- Focus management on modal open
- Keyboard navigation supported
```

---

### 3. Module Documentation

Generates README for each module/feature.

```markdown
# Authentication Module

## Overview
Handles user authentication, authorization, and session management.

## Location
`src/features/auth/`

## Directory Structure
```
auth/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ForgotPassword.tsx
│   └── AuthProvider.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useSession.ts
├── services/
│   └── authService.ts
├── types/
│   └── auth.types.ts
└── index.ts
```

## Components

### LoginForm
Renders login form with email/password fields.

### RegisterForm
Renders registration form with validation.

### AuthProvider
Context provider for authentication state.

## Hooks

### useAuth()
Returns authentication state and methods.

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### useSession()
Returns current session information.

```typescript
const { session, refreshSession, isExpired } = useSession();
```

## Services

### authService
Handles API calls for authentication.

| Method | Description |
|--------|-------------|
| login(email, password) | Authenticate user |
| register(userData) | Create new account |
| logout() | End session |
| refreshToken() | Refresh access token |
| resetPassword(email) | Request password reset |

## Dependencies

| Module | Purpose |
|--------|---------|
| user | User data management |
| api | HTTP client |

## Usage Example

```typescript
import { AuthProvider, useAuth } from '@/features/auth';

// Wrap app with provider
function App() {
  return (
    <AuthProvider>
      <MyApp />
    </AuthProvider>
  );
}

// Use in components
function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      {user ? (
        <>
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
}
```
```

---

### 4. Database Documentation

Generates documentation from schema.

```markdown
# Database Schema

## Overview
PostgreSQL database managed with Prisma ORM.

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     User     │────<│     Post     │>────│   Category   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│   Profile    │     │   Comment    │
└──────────────┘     └──────────────┘
```

## Tables

### User
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | VARCHAR | UNIQUE, NOT NULL | User email |
| password | VARCHAR | NOT NULL | Hashed password |
| name | VARCHAR | | Display name |
| role | ENUM | DEFAULT 'USER' | User role |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |
| updatedAt | TIMESTAMP | | Last update time |

**Relations:**
- Has one Profile
- Has many Posts
- Has many Comments

**Indexes:**
- email (UNIQUE)
- createdAt

### Post
Stores blog posts or content.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| title | VARCHAR | NOT NULL | Post title |
| content | TEXT | | Post body |
| published | BOOLEAN | DEFAULT FALSE | Publication status |
| authorId | UUID | FK -> User.id | Author reference |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation time |

**Relations:**
- Belongs to User (author)
- Has many Comments
- Has many Categories (many-to-many)

## Migrations

| Version | Name | Description |
|---------|------|-------------|
| 001 | init | Initial schema |
| 002 | add_profile | Add profile table |
| 003 | add_categories | Add categories and junction |
| 004 | add_indexes | Performance indexes |
```

---

### 5. Full Project Documentation

Comprehensive project documentation.

```markdown
# Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Modules](#modules)
5. [API Reference](#api-reference)
6. [Components](#components)
7. [Database](#database)
8. [Configuration](#configuration)
9. [Deployment](#deployment)

---

## Overview

**Project:** MyApp
**Description:** A full-stack web application for...
**Tech Stack:** Next.js, TypeScript, Prisma, PostgreSQL

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm

### Installation
```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm dev
```

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| NEXTAUTH_SECRET | Yes | Session encryption key |
| NEXTAUTH_URL | Yes | Application URL |

## Architecture

[See architecture documentation]

## Modules

- [Authentication](./modules/auth.md)
- [User Management](./modules/user.md)
- [Dashboard](./modules/dashboard.md)

## API Reference

[See API documentation](./api/openapi.yaml)

## Components

[See component documentation](./components/)

## Database

[See database documentation](./database.md)
```

---

## Configuration

```yaml
# proagents.config.yaml

reverse_engineering:
  documentation:
    enabled: true

    generate:
      - api_docs
      - component_docs
      - module_docs
      - database_docs
      - project_overview

    output:
      directory: "docs/"
      format: "markdown"

    api_docs:
      format: "openapi"
      version: "3.0.0"
      include_examples: true

    component_docs:
      include_props: true
      include_usage: true
      include_dependencies: true

    templates:
      component: "proagents/templates/component-doc.md"
      module: "proagents/templates/module-doc.md"
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:re-docs` | Generate all documentation |
| `pa:re-docs --api` | Generate API docs only |
| `pa:re-docs --components` | Generate component docs |
| `pa:re-docs --modules` | Generate module docs |
| `pa:re-docs --database` | Generate database docs |
| `pa:re-docs --readme` | Generate project README |
