# Pattern Reconciliation

Reconcile existing code patterns with ProAgents recommendations.

---

## Overview

Existing projects often have multiple patterns for the same thing. Pattern reconciliation:
- Identifies all patterns in use
- Helps choose primary patterns
- Creates migration path for legacy patterns
- Configures ProAgents to respect project patterns

---

## Pattern Detection

### Running Detection

```bash
# Detect all patterns
/detect-patterns

# Focus on specific area
/detect-patterns --type state-management
/detect-patterns --type components
/detect-patterns --type api
```

### Detection Output

```yaml
pattern_detection:
  analyzed_files: 450
  patterns_found: 23
  inconsistencies: 8

  categories:
    components:
      patterns:
        - name: "Functional with hooks"
          usage: 85%
          age: "current"
          locations: ["src/components/*", "src/features/*"]

        - name: "Class components"
          usage: 15%
          age: "legacy"
          locations: ["src/legacy/*", "src/admin/*"]

      recommendation:
        primary: "Functional with hooks"
        migrate: "Class components"

    state_management:
      patterns:
        - name: "Zustand"
          usage: 30%
          age: "newest"

        - name: "Redux"
          usage: 45%
          age: "older"

        - name: "Context API"
          usage: 25%
          age: "medium"

      recommendation:
        primary: "Zustand"
        migrate: "Redux (gradual)"
        keep: "Context API (for DI)"
```

---

## Reconciliation Process

### Step 1: Identify All Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                   Pattern Inventory                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  State Management                                           │
│  ├── Redux (45%) ──────────── src/store/                   │
│  ├── Zustand (30%) ────────── src/features/*/store.ts      │
│  └── Context (25%) ────────── src/contexts/                │
│                                                             │
│  Components                                                 │
│  ├── Functional (85%) ─────── src/components/              │
│  └── Class (15%) ──────────── src/legacy/                  │
│                                                             │
│  Styling                                                    │
│  ├── Tailwind (60%) ───────── src/components/              │
│  ├── CSS Modules (30%) ────── src/features/                │
│  └── Styled Components (10%)─ src/legacy/                  │
│                                                             │
│  API Calls                                                  │
│  ├── React Query (50%) ────── src/features/                │
│  ├── Custom hooks (30%) ───── src/hooks/                   │
│  └── Direct axios (20%) ───── src/services/                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Categorize Patterns

```yaml
pattern_categorization:
  state_management:
    primary:
      name: "Zustand"
      reason: "Newest, simplest, team prefers"
      use_for: "New feature state"

    secondary:
      name: "Context API"
      reason: "Good for dependency injection"
      use_for: "Theme, auth context"

    legacy:
      name: "Redux"
      reason: "Older code, works but complex"
      use_for: "Existing features (don't add new)"
      migration: "gradual"

  components:
    primary:
      name: "Functional with hooks"
      use_for: "All new components"

    legacy:
      name: "Class components"
      migration: "when touched"

  styling:
    primary:
      name: "Tailwind"
      use_for: "All new components"

    secondary:
      name: "CSS Modules"
      use_for: "Complex animations"

    legacy:
      name: "Styled Components"
      migration: "when refactoring"
```

### Step 3: Document Decisions

```markdown
# Pattern Decisions

## State Management

### Decision: Use Zustand for new features

**Context:**
We currently have three state management solutions:
- Redux (45% of codebase)
- Zustand (30% of codebase)
- Context API (25% of codebase)

**Decision:**
- Zustand is primary for new feature state
- Context API for dependency injection (theme, auth)
- Redux: maintain but don't add new

**Rationale:**
- Zustand is simpler, less boilerplate
- Team productivity higher with Zustand
- Redux migration would be disruptive

**Migration Plan:**
- New features: Zustand only
- When touching Redux code: consider migration
- Target: Redux < 20% in 6 months
```

### Step 4: Configure ProAgents

```yaml
# proagents.config.yaml

patterns:
  state_management:
    primary: "zustand"
    allowed: ["zustand", "context"]
    discouraged: ["redux"]

    on_discouraged:
      action: "warn"
      message: "Consider using Zustand for new state"

    on_disallowed:
      action: "block"
      message: "MobX is not used in this project"

  components:
    primary: "functional"
    allowed: ["functional"]
    discouraged: ["class"]

    on_discouraged:
      action: "suggest_migration"
      provide_example: true

  styling:
    primary: "tailwind"
    allowed: ["tailwind", "css-modules"]
    discouraged: ["styled-components"]

  api:
    primary: "react-query"
    allowed: ["react-query", "custom-hooks"]
    discouraged: ["direct-axios"]

  migration:
    mode: "gradual"
    suggest_on_touch: true
    create_issues: true
```

---

## Pattern Migration

### Migration Strategies

#### Strategy 1: Gradual (Recommended)

```yaml
gradual_migration:
  trigger: "when_touched"

  process:
    1. "Developer modifies file with old pattern"
    2. "ProAgents suggests migration"
    3. "Developer decides: migrate now or later"
    4. "If later, create tracking issue"
    5. "Track migration progress"

  example:
    file: "src/features/user/UserProfile.tsx"
    current: "Class component with Redux"
    suggested: "Functional with Zustand"

    suggestion: |
      This file uses legacy patterns:
      - Class component → Consider functional
      - Redux → Consider Zustand

      Would you like to:
      1. Migrate now (30 min estimated)
      2. Create migration task for later
      3. Skip (file will be tracked)
```

#### Strategy 2: Dedicated Migration

```yaml
dedicated_migration:
  approach: "Sprint allocation"

  process:
    1. "Allocate 20% of sprint to migration"
    2. "Pick highest-impact files"
    3. "Full migration with tests"
    4. "Track progress"

  sprint_plan:
    sprint_1:
      - "Migrate auth feature Redux → Zustand"
      - "Convert 5 class components"

    sprint_2:
      - "Migrate user feature"
      - "Convert 5 more components"
```

#### Strategy 3: Big Bang (Risky)

```yaml
big_bang_migration:
  use_when: "Small codebase or major refactor anyway"

  process:
    1. "Plan comprehensive migration"
    2. "Freeze feature development"
    3. "Migrate everything"
    4. "Extensive testing"
    5. "Resume development"

  risk: "High"
  recommendation: "Avoid unless necessary"
```

### Migration Tracking

```yaml
migration_tracking:
  redux_to_zustand:
    total_files: 45
    migrated: 12
    in_progress: 3
    remaining: 30
    percentage: 27%

    priority:
      high:
        - "src/store/authSlice.ts"
        - "src/store/userSlice.ts"
      medium:
        - "src/store/settingsSlice.ts"
      low:
        - "src/store/adminSlice.ts"

  class_to_functional:
    total_files: 23
    migrated: 8
    remaining: 15
    percentage: 35%
```

---

## Handling Conflicts

### When Patterns Conflict

```yaml
conflict_example:
  situation: "New feature needs to use both old and new patterns"

  old_pattern:
    name: "Redux"
    existing_feature: "User management"

  new_pattern:
    name: "Zustand"
    new_feature: "User preferences"

  resolution_options:
    - option: "Bridge"
      description: "Create adapter between patterns"
      code: |
        // Bridge Redux and Zustand
        const useUserBridge = () => {
          const reduxUser = useSelector(selectUser);
          const zustandUser = useUserStore(s => s.user);
          return reduxUser || zustandUser;
        }

    - option: "Isolate"
      description: "Keep patterns completely separate"
      boundary: "Feature boundary"

    - option: "Migrate First"
      description: "Migrate dependency before new feature"
      effort: "Additional time"
```

### Coexistence Rules

```yaml
coexistence:
  state_management:
    rule: "One source of truth per domain"
    example:
      - "User data: Redux only (until migrated)"
      - "UI state: Zustand only"
      - "Theme: Context only"

  components:
    rule: "New components are functional"
    exception: "Error boundaries can be class"

  api:
    rule: "React Query for server state"
    exception: "One-off requests can use axios directly"
```

---

## Pattern Documentation

### Auto-Generated Pattern Guide

```markdown
# Project Patterns Guide

## State Management

### Primary: Zustand
Use Zustand for all new feature state.

```typescript
// Example: Creating a store
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Usage
const user = useUserStore((state) => state.user);
```

### Legacy: Redux
Existing code uses Redux. Maintain but don't add new.

### When to Use What
| Use Case | Pattern |
|----------|---------|
| Feature state | Zustand |
| Global app state | Zustand |
| Server state | React Query |
| Theme/Auth context | Context API |
| Legacy features | Redux (existing) |

## Components

### Primary: Functional Components

```typescript
interface Props {
  title: string;
}

export const MyComponent: FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Migration from Class

[See migration guide]
```

---

## Configuration

```yaml
# proagents.config.yaml

pattern_reconciliation:
  enabled: true

  detection:
    on_init: true
    periodic: "weekly"

  reconciliation:
    auto_suggest: true
    create_documentation: true
    track_migration: true

  enforcement:
    level: "warn"  # warn | suggest | block
    exceptions_allowed: true

  migration:
    mode: "gradual"
    track_progress: true
    create_issues: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:detect-patterns` | Detect all patterns |
| `pa:pattern-status` | View pattern usage |
| `pa:pattern-reconcile` | Start reconciliation |
| `pa:pattern-migrate [from] [to]` | Plan migration |
| `pa:pattern-document` | Generate pattern docs |
