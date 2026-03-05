# Coding Standards Template

Define your project's coding standards. Customize this template for your project.

---

## File Organization

### Directory Structure

```
src/
├── components/         # React components
│   ├── common/         # Shared/reusable components
│   ├── features/       # Feature-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── stores/             # State management
├── utils/              # Utility functions
├── types/              # TypeScript types/interfaces
├── styles/             # Global styles
└── constants/          # Constants and config
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with use- prefix | `useAuth.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase | `User.types.ts` |
| Constants | camelCase or UPPER_CASE | `apiEndpoints.ts` |
| Tests | Same as source + .test | `UserProfile.test.tsx` |
| Styles | Same as component | `UserProfile.styles.ts` |

---

## Naming Conventions

### Variables

```typescript
// ✅ Good
const userName = 'John';
const isLoggedIn = true;
const userList = [];
const MAX_RETRY_COUNT = 3;

// ❌ Bad
const user_name = 'John';
const logged = true;  // Not descriptive
const data = [];      // Too generic
const max = 3;        // Not clear
```

### Functions

```typescript
// ✅ Good - verb + noun, describes action
function getUserById(id: string): User { }
function validateEmail(email: string): boolean { }
function formatCurrency(amount: number): string { }
async function fetchUserData(): Promise<User> { }

// ❌ Bad
function user(id: string) { }    // Not descriptive
function process(data: any) { }  // Too generic
function doStuff() { }           // Meaningless
```

### Components

```typescript
// ✅ Good - PascalCase, descriptive
function UserProfileCard() { }
function NavigationMenu() { }
function ShoppingCartItem() { }

// ❌ Bad
function userCard() { }          // Not PascalCase
function Card() { }              // Too generic
function UPC() { }               // Abbreviation
```

### Hooks

```typescript
// ✅ Good - use prefix, describes purpose
function useAuth() { }
function useLocalStorage(key: string) { }
function useFetchUser(id: string) { }

// ❌ Bad
function auth() { }              // Missing use prefix
function useData() { }           // Too generic
```

### Types/Interfaces

```typescript
// ✅ Good
interface User { }
type UserRole = 'admin' | 'user';
interface ApiResponse<T> { }

// ❌ Bad (no I prefix for interfaces - or use consistently)
interface IUser { }              // Inconsistent prefix
type user = { };                 // Not PascalCase
```

---

## Code Style

### General Rules

- Maximum line length: **100 characters**
- Indentation: **2 spaces**
- Quotes: **Single quotes** for JS/TS, **double quotes** for JSX attributes
- Semicolons: **Required**
- Trailing commas: **Always (ES5)**

### Import Order

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal modules (absolute imports)
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common';
import { userService } from '@/services';

// 3. Relative imports
import { UserCard } from './UserCard';
import { formatUserName } from './utils';

// 4. Types (if separate)
import type { User } from '@/types';

// 5. Styles
import styles from './UserProfile.module.css';
```

### Destructuring

```typescript
// ✅ Good
const { name, email, role } = user;
const [isOpen, setIsOpen] = useState(false);
function UserCard({ user, onClick }: UserCardProps) { }

// ❌ Bad
const name = user.name;
const email = user.email;
```

---

## React Patterns

### Component Structure

```typescript
// Component file structure
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

// Types
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// Component
export const UserProfile: FC<UserProfileProps> = ({
  userId,
  onUpdate,
}) => {
  // 1. Hooks
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // 2. Effects
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  // 3. Handlers
  const handleUpdate = () => {
    // ...
  };

  // 4. Render helpers (if needed)
  const renderContent = () => {
    // ...
  };

  // 5. Early returns
  if (isLoading) return <Spinner />;
  if (!user) return <NotFound />;

  // 6. Main render
  return (
    <div className="user-profile">
      {/* ... */}
    </div>
  );
};
```

### Props

```typescript
// ✅ Good - Interface above component
interface ButtonProps {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary';
  /** Disabled state */
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}) => { /* ... */ };
```

### Conditional Rendering

```typescript
// ✅ Good
{isLoggedIn && <UserMenu />}
{isLoading ? <Spinner /> : <Content />}
{error && <ErrorMessage error={error} />}

// ❌ Bad - Nested ternaries
{isLoading ? <Spinner /> : error ? <Error /> : <Content />}
```

---

## TypeScript

### Type Definitions

```typescript
// ✅ Good - Explicit types
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

type UserRole = 'admin' | 'user' | 'guest';

// ✅ Good - Generic types
interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
  };
}

// ❌ Bad - Avoid any
function process(data: any) { }  // Use unknown or proper type
```

### Type vs Interface

```typescript
// Use interface for objects that might be extended
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Use type for unions, primitives, and complex types
type Status = 'pending' | 'active' | 'inactive';
type EventHandler = (event: Event) => void;
type Nullable<T> = T | null;
```

### Strict Null Checks

```typescript
// ✅ Good - Handle null/undefined
function getUserName(user: User | null): string {
  return user?.name ?? 'Unknown';
}

// ✅ Good - Non-null assertion only when certain
const element = document.getElementById('app')!;
```

---

## Error Handling

### Try-Catch

```typescript
// ✅ Good - Specific error handling
try {
  const user = await fetchUser(id);
  return user;
} catch (error) {
  if (error instanceof NotFoundError) {
    throw new UserNotFoundError(id);
  }
  if (error instanceof NetworkError) {
    throw new ServiceUnavailableError('User service');
  }
  throw error;
}
```

### Error Boundaries (React)

```typescript
// Use error boundaries for component errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <UserProfile />
</ErrorBoundary>
```

### API Error Handling

```typescript
// ✅ Good - Consistent error structure
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// ✅ Good - Error handling in service
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error);
  }

  return response.json();
}
```

---

## Comments and Documentation

### When to Comment

```typescript
// ✅ Good - Explain WHY, not WHAT
// Using setTimeout to debounce rapid input changes
// and prevent excessive API calls
const debouncedSearch = useMemo(
  () => debounce(searchUsers, 300),
  []
);

// ✅ Good - Document complex business logic
// Users with 'admin' role can edit any resource
// Users with 'user' role can only edit their own resources
// Guests cannot edit any resources
function canEdit(user: User, resource: Resource): boolean {
  // ...
}

// ❌ Bad - Obvious comments
// Get the user name
const name = user.name;
```

### JSDoc

```typescript
/**
 * Formats a price for display with currency symbol.
 *
 * @param amount - The price in cents
 * @param currency - ISO currency code (default: 'USD')
 * @returns Formatted price string
 *
 * @example
 * formatPrice(1999); // "$19.99"
 * formatPrice(1999, 'EUR'); // "€19.99"
 */
function formatPrice(amount: number, currency = 'USD'): string {
  // ...
}
```

---

## Testing Standards

### Test Naming

```typescript
describe('UserProfile', () => {
  describe('when user is logged in', () => {
    it('should display user name', () => { });
    it('should show edit button', () => { });
  });

  describe('when user is logged out', () => {
    it('should redirect to login', () => { });
  });
});
```

### Test Structure

```typescript
it('should update user name on form submit', async () => {
  // Arrange
  const user = createMockUser({ name: 'John' });
  render(<UserProfile user={user} />);

  // Act
  await userEvent.type(screen.getByLabelText('Name'), 'Jane');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));

  // Assert
  expect(screen.getByText('Jane')).toBeInTheDocument();
});
```

---

## Enforcement

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    'react/prop-types': 'off',
    // Add project-specific rules
  },
};
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

*Customize this template for your project's specific needs.*
