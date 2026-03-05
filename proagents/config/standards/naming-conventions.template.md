# Naming Conventions Template

Copy this file to `naming-conventions.md` and customize for your project.

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | [PascalCase | kebab-case] | `UserProfile.tsx` or `user-profile.tsx` |
| Hooks | camelCase with `use` prefix | `useUserData.ts` |
| Utilities | [camelCase | kebab-case] | `formatDate.ts` or `format-date.ts` |
| Constants | [UPPER_SNAKE | camelCase] | `API_ENDPOINTS.ts` |
| Types | PascalCase | `UserTypes.ts` |
| Tests | Same as source + `.test` | `UserProfile.test.tsx` |
| Styles | Same as component + `.module` | `UserProfile.module.css` |

---

## Variable Naming

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Booleans | `is`, `has`, `can` prefix | `isActive`, `hasPermission` |
| Arrays | Plural nouns | `users`, `items` |
| Objects | Singular nouns | `user`, `config` |

---

## Function Naming

| Type | Convention | Example |
|------|------------|---------|
| Functions | camelCase, verb prefix | `getUserData`, `calculateTotal` |
| Event handlers | `handle` + Event | `handleClick`, `handleSubmit` |
| Async functions | Verb describing action | `fetchUser`, `saveData` |
| Predicates | `is`, `has`, `can` prefix | `isValid`, `hasAccess` |
| Transformers | `to` or `format` prefix | `toUpperCase`, `formatDate` |

---

## Component Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase, noun-based | `UserCard`, `NavigationMenu` |
| Pages | PascalCase + `Page` suffix | `HomePage`, `ProfilePage` |
| Layouts | PascalCase + `Layout` suffix | `MainLayout`, `AuthLayout` |
| Providers | PascalCase + `Provider` suffix | `AuthProvider`, `ThemeProvider` |
| HOCs | `with` prefix | `withAuth`, `withLoading` |

---

## Type/Interface Naming

| Type | Convention | Example |
|------|------------|---------|
| Interfaces | PascalCase (no `I` prefix) | `User`, `ApiResponse` |
| Types | PascalCase | `UserStatus`, `RequestConfig` |
| Props | Component name + `Props` | `UserCardProps` |
| Enums | PascalCase | `UserRole`, `OrderStatus` |
| Generics | Single uppercase or descriptive | `T`, `TData`, `TResponse` |

---

## API/Database Naming

| Type | Convention | Example |
|------|------------|---------|
| Endpoints | kebab-case, plural | `/api/users`, `/api/order-items` |
| Table names | snake_case, plural | `users`, `order_items` |
| Column names | snake_case | `created_at`, `user_id` |
| Foreign keys | Referenced table + `_id` | `user_id`, `order_id` |

---

## CSS/Styling Naming

| Type | Convention | Example |
|------|------------|---------|
| CSS Classes | [BEM | camelCase | kebab-case] | `.user-card__title` |
| CSS Variables | kebab-case with `--` | `--primary-color` |
| Tailwind | Standard Tailwind | `bg-blue-500` |

---

## Test Naming

```typescript
// Test files
UserProfile.test.tsx

// Describe blocks
describe('UserProfile', () => {

// Test cases - should describe behavior
it('renders user name when provided', () => {
it('shows loading state while fetching', () => {
it('calls onEdit when edit button clicked', () => {
```

---

## Git Branch Naming

| Type | Convention | Example |
|------|------------|---------|
| Features | `feature/[ticket]-description` | `feature/PROJ-123-user-auth` |
| Bug fixes | `fix/[ticket]-description` | `fix/PROJ-456-login-error` |
| Hotfixes | `hotfix/description` | `hotfix/critical-payment-bug` |
| Releases | `release/version` | `release/1.2.0` |
