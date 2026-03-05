# Deep Code Analysis

Comprehensive analysis of source code structure, patterns, and quality.

---

## Analysis Scope

### 1. File-Level Analysis

```yaml
file_analysis:
  path: "src/services/authService.ts"

  metadata:
    lines: 245
    functions: 12
    classes: 1
    imports: 8
    exports: 5
    complexity: "medium"

  structure:
    imports:
      - { module: "axios", type: "external" }
      - { module: "@/lib/api", type: "internal" }
      - { module: "@/types/auth", type: "internal" }

    exports:
      - { name: "authService", type: "object" }
      - { name: "AuthService", type: "class" }
      - { name: "AuthError", type: "class" }

    functions:
      - name: "login"
        params: ["email: string", "password: string"]
        returns: "Promise<AuthResponse>"
        async: true
        lines: 15-35

      - name: "logout"
        params: []
        returns: "Promise<void>"
        async: true
        lines: 37-45
```

### 2. Component Analysis (React/Vue/Angular)

```yaml
component_analysis:
  path: "src/components/UserProfile.tsx"

  type: "functional"
  name: "UserProfile"

  props:
    - name: "userId"
      type: "string"
      required: true
    - name: "onUpdate"
      type: "(user: User) => void"
      required: false

  state:
    - name: "isEditing"
      type: "boolean"
      initial: false
    - name: "formData"
      type: "UserFormData"
      initial: "{}"

  hooks_used:
    - "useState" (2 times)
    - "useEffect" (1 time)
    - "useUser" (custom hook)
    - "useMutation" (react-query)

  dependencies:
    components:
      - "Avatar"
      - "Button"
      - "Input"
    hooks:
      - "useUser"
    services:
      - "userService"

  renders:
    conditional: 3
    lists: 1
    children_components: 5

  accessibility:
    aria_labels: 2
    roles: 1
    semantic_elements: true
```

### 3. API Endpoint Analysis

```yaml
api_analysis:
  path: "src/app/api/users/route.ts"

  endpoints:
    - method: "GET"
      handler: "GET"
      auth_required: true
      params: ["page", "limit", "search"]
      response_type: "PaginatedResponse<User>"

    - method: "POST"
      handler: "POST"
      auth_required: true
      body_schema: "CreateUserInput"
      validation: "zod"
      response_type: "User"

  middleware:
    - "authMiddleware"
    - "rateLimitMiddleware"

  error_handling:
    try_catch: true
    custom_errors: true
    error_responses: ["400", "401", "404", "500"]
```

### 4. Database Model Analysis

```yaml
model_analysis:
  path: "prisma/schema.prisma"

  models:
    - name: "User"
      fields:
        - { name: "id", type: "String", primary: true }
        - { name: "email", type: "String", unique: true }
        - { name: "name", type: "String", nullable: true }
        - { name: "createdAt", type: "DateTime" }
      relations:
        - { name: "posts", type: "Post[]", relation: "one-to-many" }
        - { name: "profile", type: "Profile?", relation: "one-to-one" }
      indexes:
        - { fields: ["email"], type: "unique" }

    - name: "Post"
      fields:
        - { name: "id", type: "String", primary: true }
        - { name: "title", type: "String" }
        - { name: "authorId", type: "String", foreign_key: true }
      relations:
        - { name: "author", type: "User", relation: "many-to-one" }
```

---

## Analysis Output

### Code Summary Report

```markdown
# Code Analysis Report

## Project: MyApp
## Analyzed: 2024-01-15

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Files | 156 |
| Total Lines | 24,500 |
| Source Files | 128 |
| Test Files | 28 |
| Average File Size | 190 lines |
| Total Functions | 450 |
| Total Components | 65 |
| Total API Routes | 24 |

---

## File Type Distribution

| Type | Count | Lines |
|------|-------|-------|
| Components (.tsx) | 65 | 8,500 |
| Hooks (.ts) | 24 | 1,800 |
| Services (.ts) | 18 | 2,200 |
| API Routes (.ts) | 24 | 3,600 |
| Types (.ts) | 15 | 1,200 |
| Tests (.test.ts) | 28 | 4,200 |
| Config Files | 12 | 800 |

---

## Complexity Analysis

### Most Complex Files
| File | Complexity | Functions | Lines |
|------|------------|-----------|-------|
| authService.ts | High | 15 | 380 |
| Dashboard.tsx | High | 8 | 320 |
| orderUtils.ts | Medium | 12 | 250 |

### Complexity Distribution
- Low (< 10): 85 files (68%)
- Medium (10-20): 32 files (26%)
- High (> 20): 8 files (6%)

---

## Dependency Analysis

### Most Imported Internal Modules
1. `@/lib/utils` - 45 imports
2. `@/components/ui` - 38 imports
3. `@/types` - 35 imports
4. `@/hooks/useAuth` - 28 imports

### External Dependencies
| Package | Import Count | Used In |
|---------|--------------|---------|
| react | 128 | All components |
| axios | 24 | Services |
| zod | 18 | Validation |
| date-fns | 15 | Date handling |

---

## Code Quality Indicators

### Positive Patterns
- ✅ Consistent naming conventions
- ✅ TypeScript strict mode enabled
- ✅ Components are modular
- ✅ Services are well-organized
- ✅ Good test coverage (78%)

### Areas for Improvement
- ⚠️ Some components exceed 300 lines
- ⚠️ 12 files have circular dependencies
- ⚠️ 8 functions have complexity > 15
- ⚠️ Missing error boundaries in 5 pages

---

## Extracted Patterns

### Component Patterns
- Functional components with hooks
- Props interface above component
- Memo for expensive renders
- Error boundary wrapper for pages

### Service Patterns
- Object with methods pattern
- Async/await for all API calls
- Centralized error handling
- Type-safe responses

### State Management
- Zustand for global state
- React Query for server state
- useState for local state
- useReducer for complex forms
```

---

## Deep Analysis Features

### Function Complexity Analysis

```yaml
function_analysis:
  name: "processOrder"
  path: "src/services/orderService.ts:45"

  metrics:
    lines: 85
    cyclomatic_complexity: 18
    cognitive_complexity: 22
    parameters: 4
    return_paths: 6
    nested_depth: 4

  issues:
    - type: "high_complexity"
      message: "Function has 18 decision points"
      suggestion: "Consider breaking into smaller functions"

    - type: "deep_nesting"
      message: "Maximum nesting depth is 4"
      suggestion: "Use early returns to reduce nesting"

  dependencies:
    calls:
      - "validateOrder"
      - "calculateTotal"
      - "applyDiscount"
      - "createInvoice"
    called_by:
      - "checkout"
      - "reorder"
```

### Type Coverage Analysis

```yaml
type_analysis:
  coverage: 94%

  untyped:
    - path: "src/utils/legacy.ts"
      lines: [45, 67, 89]
      severity: "warning"

    - path: "src/lib/helpers.ts"
      lines: [12]
      severity: "info"

  any_usage:
    count: 8
    locations:
      - "src/services/api.ts:34"
      - "src/utils/transform.ts:56"

  recommendations:
    - "Add return type to function at api.ts:34"
    - "Replace 'any' with proper type at transform.ts:56"
```

---

## Configuration

```yaml
# proagents.config.yaml

reverse_engineering:
  code_analysis:
    enabled: true

    analyze:
      - file_structure
      - components
      - functions
      - types
      - imports
      - complexity

    complexity:
      threshold_warning: 10
      threshold_error: 20

    output:
      format: "markdown"
      include_metrics: true
      include_recommendations: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:re-analyze` | Full code analysis |
| `pa:re-analyze --file [path]` | Analyze specific file |
| `pa:re-analyze --complexity` | Complexity analysis |
| `pa:re-analyze --types` | Type coverage analysis |
| `pa:re-analyze --functions` | Function analysis |
