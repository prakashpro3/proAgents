# Cross-Project Dependencies

Track and manage dependencies between projects in a workspace.

---

## Overview

Cross-project dependency tracking ensures changes are coordinated across related projects.

```
┌─────────────────────────────────────────────────────────────┐
│                    Dependency Graph                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  shared-utils ◄────────────────────────────────────────┐   │
│       │                                                │   │
│       ▼                                                │   │
│  shared-ui ◄─────────────────────────────────────┐    │   │
│       │                                          │    │   │
│       ├─────────────► web-app                    │    │   │
│       │                   │                      │    │   │
│       │                   ▼                      │    │   │
│       │              api-gateway ◄───────────────┼────┘   │
│       │                   │                      │        │
│       ├─────────────► mobile-ios ◄───────────────┘        │
│       │                                                   │
│       └─────────────► mobile-android ◄────────────────────┘
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Dependency Declaration

### In Workspace Config

```yaml
# proagents.workspace.yaml

workspace:
  projects:
    - name: web-app
      dependencies:
        - shared-ui
        - api-gateway  # Runtime dependency

    - name: api-gateway
      dependencies:
        - shared-utils

    - name: mobile-ios
      dependencies:
        - shared-ui
        - api-gateway

    - name: shared-ui
      dependencies:
        - shared-utils

    - name: shared-utils
      dependencies: []  # No dependencies
```

### In Project Config

```yaml
# apps/web/proagents/proagents.config.yaml

project:
  name: web-app

  dependencies:
    internal:
      - name: shared-ui
        type: build      # Build-time dependency
        version: "^1.0"

      - name: api-gateway
        type: runtime    # Runtime dependency (API contract)
        contract: ./api-contract.yaml

    external:
      - name: react
        type: package
        version: "^18.0"
```

---

## Dependency Types

| Type | Description | Impact |
|------|-------------|--------|
| **Build** | Required at build time | Blocks build if unavailable |
| **Runtime** | Required at runtime | Blocks deploy if incompatible |
| **Development** | Required for development | No deployment impact |
| **Optional** | Nice to have | Graceful degradation |

### Build Dependencies

```yaml
dependencies:
  - name: shared-ui
    type: build
    reason: "UI components used in app"
    import_from: "@company/shared-ui"
```

### Runtime Dependencies

```yaml
dependencies:
  - name: api-gateway
    type: runtime
    reason: "API calls at runtime"
    contract:
      file: ./api-contract.yaml
      version_check: true
```

### API Contracts

```yaml
# api-contract.yaml

api:
  name: api-gateway
  version: "2.0"

  endpoints:
    - path: /users
      methods: [GET, POST]
      version_added: "1.0"

    - path: /users/:id
      methods: [GET, PUT, DELETE]
      version_added: "1.0"

  breaking_changes:
    - version: "2.0"
      change: "Renamed /user to /users"
      migration: "Update all /user calls to /users"
```

---

## Dependency Analysis

### View Dependencies

```bash
# Show dependency graph
proagents workspace deps

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Workspace Dependencies                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ shared-utils (0 dependencies)                              │
│ └── Used by: shared-ui, api-gateway                        │
│                                                             │
│ shared-ui (1 dependency)                                   │
│ ├── Depends on: shared-utils                               │
│ └── Used by: web-app, mobile-ios, mobile-android          │
│                                                             │
│ api-gateway (1 dependency)                                 │
│ ├── Depends on: shared-utils                               │
│ └── Used by: web-app, mobile-ios, mobile-android          │
│                                                             │
│ web-app (2 dependencies)                                   │
│ ├── Depends on: shared-ui, api-gateway                    │
│ └── Used by: (none)                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Visualize Dependencies

```bash
# Generate visual graph
proagents workspace deps --graph

# Export as image
proagents workspace deps --graph --output deps.png
```

### Check for Issues

```bash
# Check for circular dependencies
proagents workspace deps --check

# Check for version conflicts
proagents workspace deps --check-versions

# Output:
✅ No circular dependencies
⚠️ Version conflict: shared-utils
   - web-app requires: ^1.2.0
   - mobile-ios requires: ^1.1.0
   Recommendation: Update mobile-ios to use ^1.2.0
```

---

## Impact Analysis

### Change Impact

When modifying a project, understand the impact:

```bash
# Analyze impact of changes to shared-ui
proagents workspace impact --project shared-ui

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Impact Analysis: shared-ui                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Direct Dependents (3):                                     │
│ ├── web-app (build dependency)                            │
│ ├── mobile-ios (build dependency)                         │
│ └── mobile-android (build dependency)                     │
│                                                             │
│ Impact Summary:                                             │
│ • 3 projects need rebuild                                  │
│ • 3 test suites should run                                 │
│ • 3 deployments may be needed                              │
│                                                             │
│ Recommended Actions:                                        │
│ 1. Run tests in: web-app, mobile-ios, mobile-android      │
│ 2. Update version in dependents                           │
│ 3. Coordinate deployment order                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Breaking Change Detection

```bash
# Check if changes are breaking
proagents workspace breaking-changes --project api-gateway

# Output:
⚠️ Breaking Changes Detected:

1. Endpoint removed: GET /users/legacy
   Affected: web-app (2 calls), mobile-ios (1 call)

2. Response schema changed: GET /users/:id
   Field removed: 'legacyField'
   Affected: web-app, mobile-ios, mobile-android

Recommendations:
- Deprecate endpoint before removing
- Provide migration path for schema changes
- Coordinate with dependent teams
```

---

## Dependency Synchronization

### Version Synchronization

```bash
# Sync all project versions
proagents workspace sync-versions

# Sync specific dependency
proagents workspace sync-versions --package shared-ui
```

### Lock File Management

```yaml
# .proagents/workspace-lock.yaml

locked_versions:
  shared-utils: "1.2.3"
  shared-ui: "2.0.1"

  external:
    react: "18.2.0"
    typescript: "5.0.0"
```

### Automatic Updates

```yaml
workspace:
  dependency_management:
    auto_update:
      internal: true    # Auto-update internal dependencies
      external: false   # Manual external updates

    update_strategy:
      internal: "latest"
      external: "minor"  # Only minor/patch updates
```

---

## Notifications

### Dependency Change Notifications

```yaml
workspace:
  notifications:
    dependency_changes:
      enabled: true
      channels:
        - slack: "#platform"

      notify_on:
        - breaking_changes
        - version_updates
        - new_dependencies
```

### Example Notification

```
🔔 Dependency Update: shared-ui v2.0.1

Changes:
• New: Button loading state prop
• Fixed: Modal accessibility issues

Affected Projects:
• web-app - needs update
• mobile-ios - needs update
• mobile-android - needs update

Action Required: Update imports in affected projects
```

---

## CI/CD Integration

### Dependency-Aware CI

```yaml
# .github/workflows/ci.yml

on:
  push:
    paths:
      - 'packages/shared-ui/**'

jobs:
  test-dependents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Get affected projects
        id: affected
        run: |
          proagents workspace impact --project shared-ui --json > affected.json

      - name: Test affected projects
        run: |
          proagents workspace test --projects $(cat affected.json | jq -r '.dependents[]')
```

### Coordinated Builds

```bash
# Build in dependency order
proagents workspace build --ordered

# Build order:
# 1. shared-utils
# 2. shared-ui (depends on shared-utils)
# 3. api-gateway (depends on shared-utils)
# 4. web-app, mobile-ios, mobile-android (parallel)
```

---

## Best Practices

1. **Minimize Dependencies**: Keep dependency graph shallow
2. **Version Everything**: Use semantic versioning
3. **Document Contracts**: Define API contracts explicitly
4. **Test Thoroughly**: Test dependents when changing shared code
5. **Communicate Changes**: Notify teams of breaking changes
6. **Automate Detection**: Use CI to detect dependency issues
