# Pattern Detection

Automatically detect design patterns, coding conventions, and architectural decisions from existing code.

---

## Overview

Pattern detection helps:
- Understand how a codebase is built
- Ensure new code follows existing conventions
- Document implicit decisions
- Identify inconsistencies and tech debt

---

## Detection Categories

### 1. Architectural Patterns

```yaml
architecture_detection:
  detected_pattern: "Feature-Based Architecture"
  confidence: 0.92

  evidence:
    - "src/features/ directory exists"
    - "Each feature has components/, hooks/, services/"
    - "Shared code in src/shared/"
    - "Clear module boundaries with index.ts exports"

  structure:
    features:
      - name: "auth"
        path: "src/features/auth/"
        components: ["LoginForm", "RegisterForm", "AuthProvider"]
        hooks: ["useAuth", "useSession"]
        services: ["authService"]

      - name: "dashboard"
        path: "src/features/dashboard/"
        components: ["DashboardPage", "StatsWidget"]
        hooks: ["useDashboardData"]
        services: ["dashboardService"]

  recommendation: "Continue using feature-based architecture for new features"
```

**Common Patterns Detected:**

| Pattern | Detection Signals |
|---------|-------------------|
| **Feature-Based** | `features/[name]/` with components, hooks, services |
| **Atomic Design** | `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/` |
| **MVC** | `controllers/`, `models/`, `views/` |
| **Clean Architecture** | `domain/`, `application/`, `infrastructure/` |
| **Layered** | `presentation/`, `business/`, `data/` |
| **Hexagonal** | `ports/`, `adapters/`, `core/` |

---

### 2. Component Patterns

```yaml
component_patterns:
  detected:
    - pattern: "Functional Components with Hooks"
      usage: "100%"
      evidence:
        - "No class components found"
        - "useState/useEffect in all stateful components"
        - "Custom hooks for shared logic"

    - pattern: "Props Interface Above Component"
      usage: "95%"
      evidence:
        - "interface [Component]Props defined before export"
        - "TypeScript strict mode enabled"
      example: |
        interface UserCardProps {
          user: User;
          onSelect?: (user: User) => void;
        }

        export const UserCard: FC<UserCardProps> = ({ user, onSelect }) => {
          // ...
        }

    - pattern: "Memo for Performance"
      usage: "40%"
      locations:
        - "src/components/DataTable.tsx"
        - "src/components/VirtualList.tsx"
      context: "Used for expensive renders"

    - pattern: "Compound Components"
      usage: "15%"
      locations:
        - "src/components/ui/Tabs/"
        - "src/components/ui/Accordion/"
      structure: |
        <Tabs>
          <Tabs.List>
            <Tabs.Trigger>...</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content>...</Tabs.Content>
        </Tabs>
```

---

### 3. State Management Patterns

```yaml
state_patterns:
  global_state:
    pattern: "Zustand Stores"
    usage: "Primary"
    stores_found:
      - name: "useAuthStore"
        path: "src/stores/authStore.ts"
        state: ["user", "token", "isAuthenticated"]
        actions: ["login", "logout", "setUser"]

      - name: "useUIStore"
        path: "src/stores/uiStore.ts"
        state: ["theme", "sidebarOpen", "notifications"]
        actions: ["setTheme", "toggleSidebar", "addNotification"]

  server_state:
    pattern: "React Query"
    usage: "All API calls"
    queries_found: 45
    mutations_found: 28
    example: |
      const { data, isLoading } = useQuery({
        queryKey: ['users', filters],
        queryFn: () => userService.getUsers(filters)
      });

  local_state:
    pattern: "useState for simple, useReducer for complex"
    simple_state:
      - "isOpen", "isLoading", "activeTab"
    complex_state:
      - "formState with useReducer"
      - "multiStepWizard with useReducer"

  context_usage:
    pattern: "Context for dependency injection"
    contexts:
      - "ThemeContext"
      - "AuthContext"
      - "ToastContext"
```

---

### 4. API/Data Patterns

```yaml
api_patterns:
  client:
    pattern: "Axios with interceptors"
    path: "src/lib/api.ts"
    features:
      - "Base URL configuration"
      - "Auth token injection"
      - "Error interceptor"
      - "Request/response logging"

  service_layer:
    pattern: "Service objects"
    structure: |
      // Typical service pattern found
      export const userService = {
        getAll: (params) => api.get('/users', { params }),
        getById: (id) => api.get(`/users/${id}`),
        create: (data) => api.post('/users', data),
        update: (id, data) => api.put(`/users/${id}`, data),
        delete: (id) => api.delete(`/users/${id}`),
      };

  error_handling:
    pattern: "Centralized error handling"
    approach:
      - "API interceptor catches errors"
      - "Custom error classes (ApiError, ValidationError)"
      - "Toast notifications for user feedback"
      - "Error boundaries for React components"

  data_fetching:
    pattern: "React Query + Custom Hooks"
    example: |
      // Custom hook wrapping React Query
      export function useUsers(filters: UserFilters) {
        return useQuery({
          queryKey: ['users', filters],
          queryFn: () => userService.getUsers(filters),
          staleTime: 5 * 60 * 1000,
        });
      }
```

---

### 5. Form Patterns

```yaml
form_patterns:
  library: "React Hook Form"
  validation: "Zod"

  structure:
    pattern: "Form + Schema + Component"
    example: |
      // 1. Schema (validation)
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      // 2. Form hook
      const form = useForm({
        resolver: zodResolver(loginSchema),
      });

      // 3. Component
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input {...form.register('email')} />
        <Input {...form.register('password')} />
      </form>

  field_components:
    - "FormField" - wrapper with label/error
    - "Input", "Select", "Checkbox" - controlled inputs
    - "FormMessage" - error display

  submission_pattern:
    pattern: "React Query mutations"
    example: |
      const mutation = useMutation({
        mutationFn: authService.login,
        onSuccess: () => router.push('/dashboard'),
        onError: (error) => toast.error(error.message),
      });
```

---

### 6. Styling Patterns

```yaml
styling_patterns:
  primary:
    approach: "Tailwind CSS"
    usage: "95%"
    features:
      - "Utility-first classes"
      - "Custom theme in tailwind.config"
      - "Component variants with CVA"

  component_styling:
    pattern: "CVA (Class Variance Authority)"
    example: |
      const buttonVariants = cva(
        "inline-flex items-center justify-center rounded-md",
        {
          variants: {
            variant: {
              default: "bg-primary text-primary-foreground",
              destructive: "bg-destructive text-destructive-foreground",
              outline: "border border-input bg-background",
            },
            size: {
              default: "h-10 px-4 py-2",
              sm: "h-9 px-3",
              lg: "h-11 px-8",
            },
          },
          defaultVariants: {
            variant: "default",
            size: "default",
          },
        }
      );

  design_system:
    tokens:
      colors: "CSS variables in globals.css"
      spacing: "Tailwind default scale"
      typography: "Custom font in tailwind.config"
    components:
      library: "shadcn/ui pattern"
      location: "src/components/ui/"
```

---

### 7. Testing Patterns

```yaml
testing_patterns:
  unit_tests:
    framework: "Vitest"
    pattern: "AAA (Arrange-Act-Assert)"
    naming: "should [expected behavior] when [condition]"
    example: |
      describe('UserService', () => {
        it('should return user when valid id provided', async () => {
          // Arrange
          const userId = 'user-123';
          mockApi.get.mockResolvedValue({ data: mockUser });

          // Act
          const result = await userService.getById(userId);

          // Assert
          expect(result).toEqual(mockUser);
          expect(mockApi.get).toHaveBeenCalledWith(`/users/${userId}`);
        });
      });

  component_tests:
    framework: "Testing Library"
    pattern: "User-centric testing"
    queries_preferred:
      - "getByRole"
      - "getByLabelText"
      - "getByText"
    example: |
      it('should submit form with valid data', async () => {
        render(<LoginForm onSubmit={mockSubmit} />);

        await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password123');
        await userEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(mockSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

  e2e_tests:
    framework: "Playwright"
    pattern: "Page Object Model"
    structure: |
      // Page object
      class LoginPage {
        constructor(page) {
          this.page = page;
          this.emailInput = page.getByLabel('Email');
          this.passwordInput = page.getByLabel('Password');
          this.submitButton = page.getByRole('button', { name: 'Login' });
        }

        async login(email, password) {
          await this.emailInput.fill(email);
          await this.passwordInput.fill(password);
          await this.submitButton.click();
        }
      }
```

---

### 8. Error Handling Patterns

```yaml
error_patterns:
  api_errors:
    pattern: "Custom Error Classes"
    hierarchy:
      - "AppError (base)"
      - "ApiError extends AppError"
      - "ValidationError extends AppError"
      - "AuthError extends AppError"
    example: |
      class ApiError extends AppError {
        constructor(message, status, code) {
          super(message);
          this.status = status;
          this.code = code;
        }
      }

  react_errors:
    pattern: "Error Boundaries"
    usage:
      - "Global error boundary at app level"
      - "Feature-level boundaries for isolation"
    fallback: "Custom error UI with retry"

  async_errors:
    pattern: "Try-catch with typed errors"
    example: |
      try {
        await userService.update(id, data);
      } catch (error) {
        if (error instanceof ValidationError) {
          setFieldErrors(error.fields);
        } else if (error instanceof AuthError) {
          router.push('/login');
        } else {
          toast.error('An unexpected error occurred');
        }
      }
```

---

### 9. File/Naming Conventions

```yaml
naming_conventions:
  files:
    components: "PascalCase.tsx"
    hooks: "use[Name].ts"
    services: "[name]Service.ts"
    types: "[name].types.ts"
    utils: "camelCase.ts"
    constants: "UPPER_SNAKE_CASE or camelCase"
    tests: "[name].test.ts or [name].spec.ts"

  code:
    variables: "camelCase"
    constants: "UPPER_SNAKE_CASE"
    functions: "camelCase"
    classes: "PascalCase"
    interfaces: "PascalCase (no I prefix)"
    types: "PascalCase"
    enums: "PascalCase with UPPER_SNAKE members"

  directories:
    features: "kebab-case"
    components: "PascalCase"
    utilities: "kebab-case"

  examples:
    good:
      - "UserProfile.tsx"
      - "useUserData.ts"
      - "userService.ts"
      - "MAX_RETRY_COUNT"
    bad:
      - "userprofile.tsx"  # Should be PascalCase
      - "UserData.ts"      # Hook should have 'use' prefix
      - "UserService.ts"   # Services are camelCase
```

---

## Pattern Report

```markdown
# Pattern Detection Report

## Project: MyApp
## Analyzed: 2024-01-15

---

## Architecture
**Pattern:** Feature-Based Architecture
**Confidence:** 92%
**Status:** Consistently Applied

---

## Component Patterns

| Pattern | Usage | Consistency |
|---------|-------|-------------|
| Functional Components | 100% | High |
| Props Interface First | 95% | High |
| Custom Hooks | 85% | High |
| Memo for Performance | 40% | Medium |

---

## State Management

| Scope | Solution | Adoption |
|-------|----------|----------|
| Global State | Zustand | 100% |
| Server State | React Query | 100% |
| Form State | React Hook Form | 100% |
| Local State | useState/useReducer | 100% |

---

## API Patterns
- **Client:** Axios with interceptors
- **Services:** Object method pattern
- **Error Handling:** Custom error classes

---

## Inconsistencies Found

1. **Naming inconsistency in `/src/utils/`**
   - `formatDate.ts` vs `StringHelpers.ts`
   - Recommendation: Use camelCase for all utils

2. **Mixed error handling in forms**
   - Some use try-catch, some use onError
   - Recommendation: Standardize on mutation onError

3. **Test naming variations**
   - `.test.ts` and `.spec.ts` both used
   - Recommendation: Standardize on `.test.ts`

---

## Recommendations

1. Create a CONVENTIONS.md documenting detected patterns
2. Add ESLint rules to enforce naming conventions
3. Standardize error handling approach
4. Consider adding more Memo usage for list items
```

---

## Configuration

```yaml
# proagents.config.yaml

reverse_engineering:
  pattern_detection:
    enabled: true

    detect:
      - architecture_patterns
      - component_patterns
      - state_patterns
      - api_patterns
      - form_patterns
      - styling_patterns
      - testing_patterns
      - error_patterns
      - naming_conventions

    report:
      generate: true
      format: "markdown"
      include_examples: true
      include_recommendations: true

    learning:
      store_patterns: true
      apply_to_new_code: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:re-patterns` | Detect all patterns |
| `pa:re-patterns --type architecture` | Architecture patterns only |
| `pa:re-patterns --type components` | Component patterns only |
| `pa:re-patterns --type state` | State management patterns |
| `pa:re-patterns --type naming` | Naming conventions only |
| `pa:re-patterns --report` | Generate full report |
| `pa:re-patterns --inconsistencies` | Show inconsistencies only |
