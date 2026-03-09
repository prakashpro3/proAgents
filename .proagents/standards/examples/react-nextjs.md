# React/Next.js Project Standards

Complete standards example for React and Next.js projects.

---

## Naming Conventions

### Files and Folders

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | UPPER_SNAKE_CASE file | `API_ENDPOINTS.ts` |
| Types/Interfaces | PascalCase | `types.ts` or `User.types.ts` |
| Tests | Same as file + `.test` | `UserProfile.test.tsx` |
| Styles | Same as component + `.module` | `UserProfile.module.css` |

### Code Elements

```typescript
// Components - PascalCase
export function UserProfileCard() {}
export const UserAvatar: FC<Props> = () => {}

// Hooks - camelCase with 'use' prefix
export function useUserData() {}
export function useLocalStorage() {}

// Regular functions - camelCase
function calculateTotal() {}
const formatCurrency = () => {}

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// Types/Interfaces - PascalCase
interface UserProfile {}
type ButtonVariant = 'primary' | 'secondary';

// Enums - PascalCase with PascalCase members
enum UserRole {
  Admin = 'admin',
  User = 'user',
}

// Props interfaces - ComponentNameProps
interface UserCardProps {}
interface ModalProps {}
```

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── api/               # API routes
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── Modal/
│   │
│   ├── features/          # Feature-specific components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── profile/
│   │
│   └── layouts/           # Layout components
│       ├── Header/
│       └── Sidebar/
│
├── hooks/                 # Custom hooks
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── index.ts
│
├── lib/                   # Utility libraries
│   ├── api.ts
│   ├── utils.ts
│   └── constants.ts
│
├── stores/                # State management
│   ├── useAuthStore.ts
│   └── useUIStore.ts
│
├── types/                 # TypeScript types
│   ├── api.ts
│   ├── user.ts
│   └── index.ts
│
└── styles/               # Global styles
    ├── globals.css
    └── variables.css
```

---

## Component Patterns

### Functional Components

```tsx
// Standard component structure
import { FC, memo } from 'react';
import styles from './UserCard.module.css';
import type { UserCardProps } from './types';

export const UserCard: FC<UserCardProps> = memo(function UserCard({
  user,
  onSelect,
  className,
}) {
  const handleClick = () => {
    onSelect(user.id);
  };

  return (
    <div className={cn(styles.card, className)} onClick={handleClick}>
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
```

### Props Interface

```tsx
// Props above component, exported for reuse
export interface UserCardProps {
  /** The user object to display */
  user: User;
  /** Callback when card is selected */
  onSelect: (userId: string) => void;
  /** Additional CSS classes */
  className?: string;
}
```

### Component Index Files

```tsx
// components/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

---

## State Management (Zustand)

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const { user, token } = await authApi.login(credentials);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

---

## Custom Hooks

```typescript
// hooks/useAsync.ts
import { useState, useCallback } from 'react';

interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { data, loading, error, execute };
}
```

---

## API Patterns

### API Client

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new APIError(response.status, await response.text());
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => fetchAPI<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    fetchAPI<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) =>
    fetchAPI<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    fetchAPI<T>(endpoint, { method: 'DELETE' }),
};
```

### React Query Integration

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDTO) => api.post<User>('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

---

## Error Handling

```tsx
// Error Boundary
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}
```

---

## Testing Patterns

```tsx
// UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatar.jpg',
};

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard user={mockUser} onSelect={jest.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<UserCard user={mockUser} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('John Doe'));

    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

---

## Import Order

```typescript
// 1. React/Next imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Internal absolute imports
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';
import { api } from '@/lib/api';

// 4. Relative imports
import { UserCard } from './UserCard';
import type { UserListProps } from './types';

// 5. Styles
import styles from './UserList.module.css';
```
