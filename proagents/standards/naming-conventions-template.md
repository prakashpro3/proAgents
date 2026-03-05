# Naming Conventions Template

Standardized naming conventions for consistent code across the project.

---

## Overview

Consistent naming improves:
- Code readability
- Team collaboration
- Onboarding speed
- Maintenance efficiency

---

## File Naming

### Components

```
✅ Good
├── UserProfile.tsx
├── UserProfileCard.tsx
├── UserProfileSettings.tsx
└── index.ts

❌ Bad
├── userProfile.tsx      # Should be PascalCase
├── user-profile.tsx     # Use PascalCase for components
├── User_Profile.tsx     # No underscores
```

**Rule:** PascalCase for component files

### Hooks

```
✅ Good
├── useAuth.ts
├── useUserData.ts
├── useLocalStorage.ts
└── index.ts

❌ Bad
├── auth.ts              # Missing 'use' prefix
├── UseAuth.ts           # Should be camelCase with use
├── use-auth.ts          # Use camelCase, not kebab
```

**Rule:** camelCase with `use` prefix

### Services

```
✅ Good
├── authService.ts
├── userService.ts
├── apiClient.ts
└── index.ts

❌ Bad
├── AuthService.ts       # Should be camelCase
├── auth-service.ts      # Use camelCase
├── auth_service.ts      # No underscores
```

**Rule:** camelCase for service files

### Utilities

```
✅ Good
├── formatDate.ts
├── validateEmail.ts
├── helpers.ts
└── index.ts

❌ Bad
├── FormatDate.ts        # Should be camelCase
├── format_date.ts       # No underscores
```

**Rule:** camelCase for utility files

### Types/Interfaces

```
✅ Good
├── user.types.ts
├── api.types.ts
├── auth.types.ts
└── index.ts

❌ Bad
├── UserTypes.ts         # Use .types.ts suffix
├── types.ts             # Too generic
```

**Rule:** `[domain].types.ts` format

### Constants

```
✅ Good
├── config.ts
├── routes.ts
├── api-endpoints.ts
└── index.ts
```

**Rule:** camelCase or kebab-case

### Tests

```
✅ Good
├── UserProfile.test.tsx
├── useAuth.test.ts
├── authService.test.ts
└── __mocks__/
    └── authService.ts

❌ Bad
├── UserProfile.spec.tsx  # Use .test.ts consistently
├── test-user-profile.tsx # Don't prefix with 'test'
```

**Rule:** `[filename].test.ts(x)` format

---

## Code Naming

### Variables

```typescript
// ✅ Good
const userName = 'John';
const isLoading = true;
const userCount = 42;
const hasPermission = false;

// ❌ Bad
const user_name = 'John';    // No underscores
const UserName = 'John';     // Not a class/component
const x = 'John';            // Not descriptive
const data = {};             // Too generic
```

**Rule:** camelCase, descriptive names

### Boolean Variables

```typescript
// ✅ Good - Use is/has/can/should prefix
const isLoading = true;
const hasError = false;
const canEdit = true;
const shouldRefresh = false;
const isAuthenticated = true;

// ❌ Bad
const loading = true;        // Missing prefix
const error = false;         // Ambiguous
const edit = true;           // Not clear it's boolean
```

**Rule:** Boolean prefix: `is`, `has`, `can`, `should`, `will`

### Constants

```typescript
// ✅ Good
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;

// ❌ Bad
const maxRetryCount = 3;     // Use UPPER_SNAKE for constants
const max_retry_count = 3;   // Use UPPER_SNAKE
```

**Rule:** UPPER_SNAKE_CASE for constants

### Functions

```typescript
// ✅ Good
function getUserById(id: string) {}
function calculateTotal(items: Item[]) {}
function validateEmail(email: string) {}
async function fetchUserData() {}

// ❌ Bad
function GetUserById(id: string) {}  // Not PascalCase
function get_user(id: string) {}     // No underscores
function doStuff() {}                // Not descriptive
```

**Rule:** camelCase, verb prefix (get, set, calculate, fetch, validate, etc.)

### Event Handlers

```typescript
// ✅ Good
function handleClick() {}
function handleSubmit() {}
function handleInputChange() {}
function onUserSelect() {}

// ❌ Bad
function click() {}          // Missing handle/on prefix
function clickHandler() {}   // 'handle' prefix preferred
```

**Rule:** `handle[Event]` or `on[Event]` prefix

### Classes

```typescript
// ✅ Good
class UserService {}
class AuthProvider {}
class ApiError extends Error {}

// ❌ Bad
class userService {}         // Should be PascalCase
class User_Service {}        // No underscores
```

**Rule:** PascalCase

### Interfaces & Types

```typescript
// ✅ Good
interface User {}
interface CreateUserInput {}
interface ApiResponse<T> {}
type UserId = string;
type UserRole = 'admin' | 'user';

// ❌ Bad
interface IUser {}           // No 'I' prefix
interface user {}            // Should be PascalCase
type userId = string;        // Should be PascalCase
```

**Rule:** PascalCase, no prefix

### Enums

```typescript
// ✅ Good
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

// ❌ Bad
enum userRole {              // Should be PascalCase
  Admin = 'admin',           // Members should be UPPER_SNAKE
}
```

**Rule:** PascalCase enum name, UPPER_SNAKE_CASE members

### React Components

```typescript
// ✅ Good
function UserProfile({ userId }: UserProfileProps) {}
const UserCard: FC<UserCardProps> = ({ user }) => {};

// ❌ Bad
function userProfile() {}    // Should be PascalCase
const user_card = () => {};  // Should be PascalCase
```

**Rule:** PascalCase

### Props

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
  children: React.ReactNode;
}

// ❌ Bad
interface ButtonProps {
  click: () => void;         // Should be onClick
  disabled?: boolean;        // Should be isDisabled for clarity
}
```

**Rule:** camelCase, event handlers start with `on`

---

## Directory Naming

```
✅ Good
├── src/
│   ├── components/
│   │   ├── UserProfile/     # PascalCase for component folders
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserProfile.test.tsx
│   │   │   └── index.ts
│   │   └── ui/              # lowercase for category folders
│   ├── features/
│   │   ├── auth/            # kebab-case for feature folders
│   │   └── user-management/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── types/

❌ Bad
├── src/
│   ├── Components/          # Should be lowercase
│   ├── user_profile/        # No underscores
│   └── UserManagement/      # Use kebab-case for features
```

---

## API Naming

### Endpoints

```
✅ Good
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/posts
POST   /api/auth/login
POST   /api/auth/refresh-token

❌ Bad
GET    /api/getUsers         # Don't use verbs
GET    /api/user/:id         # Use plural
POST   /api/users/create     # Verb in POST
DELETE /api/users/:id/delete # Redundant verb
```

**Rule:**
- Use nouns, not verbs
- Use plural for collections
- Use kebab-case for multi-word
- HTTP method indicates action

### Query Parameters

```
✅ Good
/api/users?page=1&pageSize=20
/api/users?sortBy=name&sortOrder=asc
/api/posts?status=published&authorId=123

❌ Bad
/api/users?Page=1            # Should be camelCase
/api/users?page_size=20      # Use camelCase
```

**Rule:** camelCase for query parameters

---

## Database Naming

### Tables

```sql
-- ✅ Good
users
posts
user_roles
post_categories

-- ❌ Bad
User                         -- Use lowercase
tbl_users                    -- No prefixes
userRoles                    -- Use snake_case
```

**Rule:** lowercase snake_case, plural

### Columns

```sql
-- ✅ Good
id
user_id
created_at
is_active
email_verified

-- ❌ Bad
ID                           -- Use lowercase
userId                       -- Use snake_case
createdAt                    -- Use snake_case
```

**Rule:** lowercase snake_case

### Indexes

```sql
-- ✅ Good
idx_users_email
idx_posts_author_id_created_at
uq_users_email

-- ❌ Bad
users_email_index            -- Use idx_ prefix
index1                       -- Not descriptive
```

**Rule:** `idx_[table]_[columns]` or `uq_[table]_[columns]`

---

## Git Naming

### Branches

```
✅ Good
feature/user-authentication
feature/add-dashboard-widgets
bugfix/login-redirect-loop
hotfix/security-vulnerability
chore/update-dependencies

❌ Bad
userAuth                     # Missing prefix
feature-user-auth            # Use / separator
Feature/UserAuth             # Use lowercase
```

**Rule:** `[type]/[description]` in kebab-case

### Commits

```
✅ Good
feat: add user authentication
fix: resolve login redirect loop
docs: update API documentation
refactor: extract validation logic
test: add unit tests for auth service

❌ Bad
added user auth              # Use conventional format
Fix bug                      # Too vague
WIP                          # Not descriptive
```

**Rule:** Conventional Commits format

---

## Configuration

```yaml
# proagents.config.yaml

naming_conventions:
  files:
    components: "PascalCase"
    hooks: "camelCase-use-prefix"
    services: "camelCase"
    utilities: "camelCase"
    types: "domain.types.ts"
    tests: ".test.ts"

  code:
    variables: "camelCase"
    constants: "UPPER_SNAKE_CASE"
    functions: "camelCase"
    classes: "PascalCase"
    interfaces: "PascalCase-no-prefix"
    enums: "PascalCase-UPPER_SNAKE-members"

  directories:
    components: "PascalCase"
    features: "kebab-case"
    utilities: "lowercase"

  api:
    endpoints: "kebab-case-plural"
    query_params: "camelCase"

  database:
    tables: "snake_case-plural"
    columns: "snake_case"

  git:
    branches: "type/kebab-case"
    commits: "conventional"
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:naming-check` | Check naming conventions |
| `pa:naming-fix` | Auto-fix naming issues |
| `pa:naming-guide` | Show naming guide |
