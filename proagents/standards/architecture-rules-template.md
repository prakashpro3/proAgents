# Architecture Rules Template

Define your project's architecture rules and patterns. Customize for your project.

---

## Overview

This document defines architectural rules that all code must follow.
Violations should be caught during code review or automated linting.

---

## Module Structure

### Feature-Based Organization

```
src/
├── features/              # Feature modules
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Feature-specific components
│   │   ├── hooks/         # Feature-specific hooks
│   │   ├── services/      # Feature-specific services
│   │   ├── store/         # Feature-specific state
│   │   ├── types/         # Feature-specific types
│   │   ├── utils/         # Feature-specific utilities
│   │   └── index.ts       # Public API
│   ├── users/
│   └── products/
├── shared/                # Shared across features
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── core/                  # Core infrastructure
│   ├── api/
│   ├── config/
│   └── providers/
└── app/                   # App-level setup
    ├── routes/
    └── App.tsx
```

### Module Boundaries

```
✅ ALLOWED:
- feature/* → shared/*
- feature/* → core/*
- shared/* → core/*
- app/* → feature/*
- app/* → shared/*
- app/* → core/*

❌ NOT ALLOWED:
- core/* → feature/*        (core is independent)
- core/* → shared/*         (core is independent)
- feature/A → feature/B     (features are isolated)
- shared/* → feature/*      (shared is independent)
```

---

## Component Architecture

### Component Types

| Type | Location | Purpose | Rules |
|------|----------|---------|-------|
| Page | `features/*/pages/` | Route endpoints | May compose feature components |
| Feature | `features/*/components/` | Feature-specific UI | Only within feature |
| Shared | `shared/components/` | Reusable UI | No feature dependencies |
| Layout | `shared/components/layout/` | Page layouts | No business logic |

### Component Rules

```typescript
// Rule 1: Components should be pure where possible
// ✅ Good - Pure component
function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// ❌ Bad - Side effects in render
function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = useState<User>();
  fetch(`/api/users/${userId}`).then(setUser); // Side effect!
  return <div>{user?.name}</div>;
}
```

```typescript
// Rule 2: Extract business logic to hooks
// ✅ Good
function UserProfile({ userId }: Props) {
  const { user, isLoading, updateUser } = useUser(userId);
  return <ProfileView user={user} onUpdate={updateUser} />;
}

// ❌ Bad - Business logic in component
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState();
  const [isLoading, setLoading] = useState(true);
  // ... lots of business logic
}
```

```typescript
// Rule 3: Shared components must not import from features
// ✅ Good - Generic, reusable
import { Button } from '@/shared/components';

// ❌ Bad - Feature dependency in shared
import { UserAvatar } from '@/features/users/components'; // In shared!
```

---

## State Management

### State Types and Locations

| State Type | Tool | Location | Example |
|------------|------|----------|---------|
| UI State | useState | Component | Modal open/closed |
| Feature State | Context/Zustand | Feature store | User preferences |
| Global State | Zustand/Redux | Core store | Auth state |
| Server State | React Query | Cache | API data |
| Form State | React Hook Form | Component | Form values |
| URL State | Router | URL | Filters, pagination |

### State Rules

```typescript
// Rule 1: Server state should use React Query (or similar)
// ✅ Good
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

// ❌ Bad - Manual caching
function useUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);
  return users;
}
```

```typescript
// Rule 2: Global state only for cross-cutting concerns
// ✅ Good - Auth is cross-cutting
const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
}));

// ❌ Bad - Feature state in global store
const useGlobalStore = create((set) => ({
  // These belong in feature stores
  products: [],
  cartItems: [],
  userPreferences: {},
}));
```

---

## API Layer

### API Structure

```
src/core/api/
├── client.ts          # HTTP client setup
├── interceptors.ts    # Request/response interceptors
└── types.ts           # API types

src/features/users/services/
├── userApi.ts         # User API calls
└── types.ts           # User API types
```

### API Rules

```typescript
// Rule 1: All API calls through service layer
// ✅ Good
const userApi = {
  getUser: (id: string) => client.get<User>(`/users/${id}`),
  updateUser: (id: string, data: UpdateUserDto) =>
    client.put<User>(`/users/${id}`, data),
};

// ❌ Bad - Direct fetch in component
function UserProfile() {
  useEffect(() => {
    fetch('/api/users/123'); // Direct API call!
  }, []);
}
```

```typescript
// Rule 2: Typed API responses
// ✅ Good
interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
  };
}

async function getUsers(): Promise<ApiResponse<User[]>> {
  return client.get('/users');
}

// ❌ Bad - Untyped responses
async function getUsers() {
  return fetch('/api/users').then(r => r.json());
}
```

```typescript
// Rule 3: Centralized error handling
// ✅ Good - Interceptor handles common errors
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.logout();
    }
    throw error;
  }
);
```

---

## Dependency Rules

### Import Rules

```typescript
// Rule 1: Use absolute imports
// ✅ Good
import { Button } from '@/shared/components';
import { useAuth } from '@/features/auth';

// ❌ Bad - Deep relative imports
import { Button } from '../../../shared/components';
```

```typescript
// Rule 2: Import from public API (index.ts)
// ✅ Good
import { UserCard, useUser } from '@/features/users';

// ❌ Bad - Import internal modules
import { UserCard } from '@/features/users/components/UserCard/UserCard';
```

```typescript
// Rule 3: No circular dependencies
// Feature A and Feature B cannot import from each other
// If shared logic needed, move to shared/
```

### Dependency Injection

```typescript
// Rule: Inject dependencies for testability
// ✅ Good - Injectable
function createUserService(api: ApiClient) {
  return {
    getUser: (id: string) => api.get(`/users/${id}`),
  };
}

// ❌ Bad - Hard-coded dependency
function getUser(id: string) {
  return globalApiClient.get(`/users/${id}`); // Hard to test
}
```

---

## Error Handling

### Error Boundaries

```typescript
// Rule: Wrap feature roots with error boundaries
// ✅ Good
<ErrorBoundary fallback={<FeatureError />}>
  <UserFeature />
</ErrorBoundary>

// Page-level error boundary for graceful degradation
<Routes>
  <Route
    path="/users"
    element={
      <ErrorBoundary fallback={<PageError />}>
        <UsersPage />
      </ErrorBoundary>
    }
  />
</Routes>
```

### API Error Handling

```typescript
// Rule: Handle errors at appropriate level
// ✅ Good - Service level for API errors
async function getUser(id: string): Promise<Result<User, ApiError>> {
  try {
    const user = await api.get(`/users/${id}`);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: toApiError(error) };
  }
}

// ✅ Good - Component level for UI errors
function UserProfile() {
  const { data, error } = useUser(id);

  if (error) {
    return <UserError error={error} onRetry={refetch} />;
  }
}
```

---

## Security

### Input Validation

```typescript
// Rule: Validate all external input
// ✅ Good
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

function handleSubmit(data: unknown) {
  const validated = userSchema.parse(data);
  // Use validated data
}
```

### Output Encoding

```typescript
// Rule: React handles XSS, but be careful with dangerouslySetInnerHTML
// ✅ Good - Sanitize if using raw HTML
import DOMPurify from 'dompurify';

function RichContent({ html }: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
}
```

---

## Performance

### Code Splitting

```typescript
// Rule: Lazy load routes and heavy components
// ✅ Good
const UsersPage = lazy(() => import('./pages/UsersPage'));
const ChartComponent = lazy(() => import('./components/Chart'));

// Route-based splitting
<Route
  path="/users"
  element={
    <Suspense fallback={<PageLoader />}>
      <UsersPage />
    </Suspense>
  }
/>
```

### Memoization

```typescript
// Rule: Memoize expensive computations and callbacks
// ✅ Good - Expensive computation
const sortedUsers = useMemo(
  () => users.sort(complexSortFn),
  [users]
);

// ✅ Good - Callback passed to child
const handleClick = useCallback(
  () => onSelect(item.id),
  [item.id, onSelect]
);

// ❌ Bad - Over-memoization of simple values
const name = useMemo(() => user.name, [user.name]); // Unnecessary
```

---

## Testing

### Test Structure

```
src/features/users/
├── components/
│   ├── UserCard.tsx
│   └── UserCard.test.tsx      # Co-located test
├── hooks/
│   ├── useUser.ts
│   └── useUser.test.ts        # Co-located test
└── __tests__/                  # Integration tests
    └── UserFlow.test.tsx
```

### Testing Rules

```typescript
// Rule: Test behavior, not implementation
// ✅ Good - Tests user behavior
it('should display error message on invalid email', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText('Email'), 'invalid');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});

// ❌ Bad - Tests implementation details
it('should call setError with message', () => {
  const setError = jest.fn();
  // Testing internal state updates
});
```

---

## Enforcement

### ESLint Rules

```javascript
// eslint-plugin-import for import rules
rules: {
  'import/no-cycle': 'error',
  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        // features cannot import from other features
        {
          target: './src/features/users',
          from: './src/features/products',
        },
        // core cannot import from features
        {
          target: './src/core',
          from: './src/features',
        },
      ],
    },
  ],
}
```

---

*Customize these rules based on your project's specific needs.*
