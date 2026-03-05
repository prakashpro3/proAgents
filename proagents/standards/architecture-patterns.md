# Architecture Patterns

Define and enforce custom architecture patterns for your project.

---

## Overview

Architecture patterns define:
- How code is organized (directory structure)
- How modules interact (dependencies)
- How data flows (state management, API patterns)
- How features are structured (feature organization)

ProAgents detects your patterns and lets you override defaults completely.

---

## Pattern Definition

### Complete Architecture Schema

```yaml
# proagents/standards/architecture.yaml

architecture:
  name: "My Project Architecture"
  type: "feature-based"  # feature-based | layer-based | modular | custom
  version: "1.0"

  # Directory structure
  structure:
    root: "src"
    directories:
      components:
        path: "components"
        purpose: "Shared UI components"
        naming: "PascalCase"
      features:
        path: "features"
        purpose: "Feature modules"
        contains: "feature_module"
      shared:
        path: "shared"
        purpose: "Shared utilities"
      types:
        path: "types"
        purpose: "TypeScript types"

  # Module patterns
  modules:
    feature_module:
      structure:
        - "index.ts"           # Barrel export
        - "components/"        # Feature components
        - "hooks/"            # Feature hooks
        - "store.ts"          # Feature state
        - "api.ts"            # Feature API calls
        - "types.ts"          # Feature types
      required: ["index.ts", "components/"]
      optional: ["hooks/", "store.ts"]

  # Dependency rules
  dependencies:
    allowed:
      - from: "features/*"
        to: ["shared", "types", "components"]
      - from: "components"
        to: ["shared", "types"]
    forbidden:
      - from: "shared"
        to: ["features/*", "components"]
      - from: "features/*"
        to: ["features/*"]  # No cross-feature imports

  # Component patterns
  components:
    types: ["page", "layout", "feature", "ui"]
    naming:
      page: "{Name}Page"
      layout: "{Name}Layout"
      feature: "{Name}"
      ui: "{Name}"
```

---

## Built-in Architecture Types

### 1. Feature-Based Architecture

```yaml
architecture:
  type: "feature-based"

  structure:
    src/
    ├── features/           # Feature modules
    │   ├── auth/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── store.ts
    │   │   ├── api.ts
    │   │   └── index.ts
    │   └── dashboard/
    ├── shared/             # Shared code
    │   ├── components/
    │   ├── hooks/
    │   └── utils/
    ├── pages/              # Page components
    └── App.tsx

  principles:
    - "Features are self-contained"
    - "No cross-feature imports"
    - "Shared code in shared/"
    - "Pages compose features"
```

### 2. Layer-Based Architecture

```yaml
architecture:
  type: "layer-based"

  structure:
    src/
    ├── presentation/       # UI layer
    │   ├── components/
    │   ├── pages/
    │   └── layouts/
    ├── application/        # Business logic
    │   ├── services/
    │   ├── hooks/
    │   └── stores/
    ├── domain/            # Domain models
    │   ├── entities/
    │   └── value-objects/
    ├── infrastructure/    # External services
    │   ├── api/
    │   └── persistence/
    └── App.tsx

  principles:
    - "Dependency flows inward"
    - "Domain has no dependencies"
    - "Infrastructure at the edges"
```

### 3. Atomic Design

```yaml
architecture:
  type: "atomic"

  structure:
    src/
    ├── components/
    │   ├── atoms/         # Basic building blocks
    │   │   ├── Button/
    │   │   ├── Input/
    │   │   └── Text/
    │   ├── molecules/     # Simple combinations
    │   │   ├── SearchBox/
    │   │   └── FormField/
    │   ├── organisms/     # Complex components
    │   │   ├── Header/
    │   │   └── ProductCard/
    │   ├── templates/     # Page layouts
    │   │   └── MainLayout/
    │   └── pages/         # Full pages
    │       └── HomePage/
    └── App.tsx

  principles:
    - "Build from small to large"
    - "Atoms have no dependencies on other atoms"
    - "Molecules combine atoms"
    - "Organisms combine molecules"
```

### 4. Feature-Sliced Design

```yaml
architecture:
  type: "feature-sliced"

  structure:
    src/
    ├── app/               # App initialization
    │   ├── providers/
    │   └── styles/
    ├── processes/         # Complex workflows
    ├── pages/             # Route pages
    │   ├── home/
    │   └── profile/
    ├── widgets/           # Compositional blocks
    │   ├── header/
    │   └── sidebar/
    ├── features/          # User interactions
    │   ├── auth/
    │   └── cart/
    ├── entities/          # Business entities
    │   ├── user/
    │   └── product/
    └── shared/            # Reusable code
        ├── ui/
        ├── lib/
        └── api/

  layer_order:
    - app
    - processes
    - pages
    - widgets
    - features
    - entities
    - shared

  principles:
    - "Lower layers can't import higher layers"
    - "Each slice is independent"
    - "Shared is the foundation"
```

---

## Custom Architecture Definition

### Defining Your Own

```yaml
# proagents/standards/architecture.yaml

architecture:
  name: "Company Standard Architecture"
  type: "custom"

  structure:
    root: "src"

    layers:
      - name: "ui"
        path: "ui"
        contains: ["pages", "components", "layouts"]
        can_import: ["domain", "infrastructure", "shared"]

      - name: "domain"
        path: "domain"
        contains: ["models", "services", "events"]
        can_import: ["shared"]
        cannot_import: ["ui", "infrastructure"]

      - name: "infrastructure"
        path: "infrastructure"
        contains: ["api", "storage", "analytics"]
        can_import: ["domain", "shared"]

      - name: "shared"
        path: "shared"
        contains: ["utils", "types", "constants"]
        can_import: []  # No imports allowed

  module_templates:
    page:
      structure:
        - "{PageName}.tsx"
        - "{PageName}.test.tsx"
        - "{PageName}.module.css"
        - "index.ts"
      naming: "PascalCase"
      location: "ui/pages"

    component:
      structure:
        - "{ComponentName}.tsx"
        - "{ComponentName}.test.tsx"
        - "index.ts"
      naming: "PascalCase"
      location: "ui/components"

    service:
      structure:
        - "{ServiceName}Service.ts"
        - "{ServiceName}Service.test.ts"
        - "types.ts"
      naming: "PascalCase with Service suffix"
      location: "domain/services"

  enforcement:
    import_rules: "strict"
    structure_rules: "strict"
    naming_rules: "warning"
```

---

## Component Patterns

### Defining Component Types

```yaml
component_patterns:
  # Page components
  page:
    definition: "Top-level route components"
    location: "pages/"
    naming: "{Name}Page"
    structure:
      required:
        - "{Name}Page.tsx"
        - "index.ts"
      optional:
        - "{Name}Page.test.tsx"
        - "{Name}Page.module.css"
    template: |
      import { FC } from 'react';
      import { ErrorBoundary } from '@/shared/components';

      interface {Name}PageProps {}

      export const {Name}Page: FC<{Name}PageProps> = () => {
        return (
          <ErrorBoundary>
            <div>
              {/* Page content */}
            </div>
          </ErrorBoundary>
        );
      };

  # Feature components
  feature:
    definition: "Self-contained feature modules"
    location: "features/"
    naming: "{FeatureName}"
    structure:
      required:
        - "index.ts"
        - "components/"
      optional:
        - "hooks/"
        - "store.ts"
        - "api.ts"
        - "types.ts"

  # UI components
  ui:
    definition: "Reusable UI components"
    location: "shared/components/"
    naming: "{Name}"
    structure:
      required:
        - "{Name}.tsx"
        - "index.ts"
      optional:
        - "{Name}.test.tsx"
        - "{Name}.stories.tsx"
        - "{Name}.module.css"
    props_interface: true
    memo: "when_appropriate"
```

---

## State Management Patterns

### Defining State Patterns

```yaml
state_patterns:
  primary: "zustand"  # Primary state management

  patterns:
    zustand:
      use_for: ["feature_state", "global_state"]
      location: "{feature}/store.ts"
      template: |
        import { create } from 'zustand';
        import { devtools } from 'zustand/middleware';

        interface {Feature}State {
          // State
        }

        interface {Feature}Actions {
          // Actions
        }

        export const use{Feature}Store = create<{Feature}State & {Feature}Actions>()(
          devtools((set) => ({
            // Implementation
          }))
        );

    context:
      use_for: ["dependency_injection", "theme", "auth"]
      location: "shared/contexts/"
      template: |
        import { createContext, useContext, FC, ReactNode } from 'react';

        interface {Name}ContextValue {}

        const {Name}Context = createContext<{Name}ContextValue | null>(null);

        export const {Name}Provider: FC<{ children: ReactNode }> = ({ children }) => {
          return (
            <{Name}Context.Provider value={{}}>
              {children}
            </{Name}Context.Provider>
          );
        };

        export const use{Name} = () => {
          const context = useContext({Name}Context);
          if (!context) throw new Error('use{Name} must be used within {Name}Provider');
          return context;
        };

    react_query:
      use_for: ["server_state", "caching"]
      location: "{feature}/api.ts"
      template: |
        import { useQuery, useMutation } from '@tanstack/react-query';

        export const use{Entity}Query = () => {
          return useQuery({
            queryKey: ['{entity}'],
            queryFn: fetch{Entity},
          });
        };

  rules:
    - "Use zustand for client state"
    - "Use React Query for server state"
    - "Use Context for dependency injection only"
    - "Never use Redux in new code"
```

---

## API Patterns

### Defining API Patterns

```yaml
api_patterns:
  client: "axios"
  wrapper: "react-query"

  patterns:
    api_client:
      location: "shared/api/client.ts"
      template: |
        import axios from 'axios';

        export const apiClient = axios.create({
          baseURL: process.env.API_URL,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        apiClient.interceptors.request.use(addAuthHeader);
        apiClient.interceptors.response.use(
          (response) => response,
          handleApiError
        );

    api_service:
      location: "{feature}/api.ts"
      template: |
        import { apiClient } from '@/shared/api/client';
        import type { {Entity}, Create{Entity}Dto } from './types';

        export const {entity}Api = {
          getAll: () =>
            apiClient.get<{Entity}[]>('/{entities}'),

          getById: (id: string) =>
            apiClient.get<{Entity}>(`/{entities}/${id}`),

          create: (data: Create{Entity}Dto) =>
            apiClient.post<{Entity}>('/{entities}', data),

          update: (id: string, data: Partial<{Entity}>) =>
            apiClient.patch<{Entity}>(`/{entities}/${id}`, data),

          delete: (id: string) =>
            apiClient.delete(`/{entities}/${id}`),
        };

    query_hook:
      location: "{feature}/hooks/use{Entity}.ts"
      template: |
        import { useQuery } from '@tanstack/react-query';
        import { {entity}Api } from '../api';

        export const use{Entity} = (id: string) => {
          return useQuery({
            queryKey: ['{entity}', id],
            queryFn: () => {entity}Api.getById(id),
          });
        };

  error_handling:
    pattern: "centralized"
    location: "shared/api/error-handler.ts"
```

---

## Override Defaults

### Completely Replace Default Architecture

```yaml
# proagents.config.yaml

architecture:
  use_custom: true
  config_file: "proagents/standards/architecture.yaml"

  override_defaults:
    completely: true  # Ignore all ProAgents defaults

  # Or selectively override
  overrides:
    structure: "custom"
    components: "default"
    state_management: "custom"
    api_patterns: "default"
```

### Extend Default Architecture

```yaml
# proagents.config.yaml

architecture:
  extends: "feature-based"  # Start with feature-based

  additions:
    directories:
      - name: "analytics"
        path: "src/analytics"
        purpose: "Analytics tracking"

    component_types:
      - name: "widget"
        location: "widgets/"
        naming: "{Name}Widget"

  modifications:
    # Modify existing patterns
    feature_module:
      required:
        - "index.ts"
        - "components/"
        - "api.ts"      # Make API required (was optional)
```

### Per-Feature Overrides

```yaml
# proagents/standards/architecture.yaml

feature_overrides:
  - feature: "auth"
    overrides:
      structure:
        additional: ["providers/", "guards/"]
      state_pattern: "context"  # Auth uses context

  - feature: "legacy-dashboard"
    overrides:
      rules: "lenient"
      state_pattern: "redux"  # Legacy uses Redux
      ignore_import_rules: true
```

---

## Validation & Enforcement

### Architecture Validation

```yaml
validation:
  on_file_create:
    check_location: true
    suggest_correct_location: true
    block_wrong_location: false

  on_import:
    check_allowed: true
    block_forbidden: true

  on_commit:
    validate_structure: true
    validate_naming: true

  on_pr:
    full_architecture_check: true
    report_violations: true
    block_on_violations: false  # Warn only
```

### Architecture Report

```
┌─────────────────────────────────────────────────────────────┐
│               Architecture Compliance Report                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Architecture: Feature-Based (Custom)                       │
│  Compliance: 85%                                            │
│                                                             │
│  Structure Violations:                                      │
│  ├── Component in wrong location: 3                        │
│  │   └── Button.tsx should be in shared/components/        │
│  └── Missing required files: 2                             │
│       └── features/auth missing index.ts                    │
│                                                             │
│  Import Violations:                                         │
│  ├── Cross-feature import: 5                               │
│  │   └── dashboard imports from auth                        │
│  └── Forbidden layer import: 1                             │
│       └── shared imports from features                      │
│                                                             │
│  Naming Violations:                                         │
│  └── Incorrect naming: 2                                   │
│       └── userprofile.tsx should be UserProfile.tsx         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scaffolding Integration

### Generate from Patterns

```bash
# Create a new feature following patterns
pa:scaffold feature user-profile

# Output:
Created feature 'user-profile' at src/features/user-profile/
├── index.ts
├── components/
│   └── index.ts
├── hooks/
│   └── index.ts
├── store.ts
├── api.ts
└── types.ts
```

### Custom Scaffolding Templates

```yaml
scaffolding:
  templates:
    feature:
      command: "pa:scaffold feature {name}"
      structure:
        - path: "index.ts"
          template: "templates/feature-index.ts"
        - path: "components/index.ts"
          template: "templates/barrel-export.ts"
        - path: "store.ts"
          template: "templates/zustand-store.ts"
          variables:
            storeName: "{Name}Store"

    component:
      command: "pa:scaffold component {name} --type {type}"
      variants:
        page:
          structure: "component_patterns.page.structure"
        ui:
          structure: "component_patterns.ui.structure"
```

---

## Configuration

```yaml
# proagents.config.yaml

architecture:
  enabled: true
  config_file: "proagents/standards/architecture.yaml"

  detection:
    auto_detect: true
    confidence_threshold: 0.8

  enforcement:
    structure: "error"      # error | warning | off
    imports: "error"
    naming: "warning"
    patterns: "warning"

  scaffolding:
    use_patterns: true
    templates_dir: "proagents/templates/"

  reporting:
    on_pr: true
    on_commit: false
    dashboard: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:architecture-check` | Validate architecture compliance |
| `pa:architecture-view` | View current architecture |
| `pa:architecture-diagram` | Generate architecture diagram |
| `pa:scaffold [type] [name]` | Generate from patterns |
| `pa:import-check` | Check import rules |
| `pa:structure-check` | Check directory structure |
