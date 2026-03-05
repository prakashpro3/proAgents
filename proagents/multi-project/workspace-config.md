# Workspace Configuration

Configure multi-project workspaces for unified management.

---

## Workspace File

### Basic Configuration

```yaml
# proagents.workspace.yaml

workspace:
  name: "My Platform"
  version: "1.0"

  # Project definitions
  projects:
    - name: frontend
      path: ./apps/web
      type: web-frontend
      description: "React web application"

    - name: backend
      path: ./apps/api
      type: nodejs
      description: "Node.js REST API"

    - name: mobile
      path: ./apps/mobile
      type: react-native
      description: "React Native mobile app"

    - name: shared
      path: ./packages/shared
      type: library
      description: "Shared utilities"
```

### Advanced Configuration

```yaml
# proagents.workspace.yaml

workspace:
  name: "Enterprise Platform"
  version: "2.0"

  # Workspace-level settings
  settings:
    parallel_features: true
    max_concurrent: 5
    unified_changelog: true
    coordinated_deploys: true

  # Projects
  projects:
    - name: web-app
      path: ./apps/web
      type: web-frontend
      team: frontend-team
      deploy_target: cloudfront
      dependencies:
        - api-gateway
        - shared-ui

    - name: api-gateway
      path: ./apps/api
      type: nodejs
      team: backend-team
      deploy_target: ecs
      dependencies:
        - shared-utils

    - name: mobile-ios
      path: ./apps/ios
      type: react-native
      team: mobile-team
      dependencies:
        - api-gateway
        - shared-ui

    - name: mobile-android
      path: ./apps/android
      type: react-native
      team: mobile-team
      dependencies:
        - api-gateway
        - shared-ui

    - name: shared-ui
      path: ./packages/ui
      type: library
      team: design-system-team
      publish: true

    - name: shared-utils
      path: ./packages/utils
      type: library
      team: platform-team
      publish: true

  # Shared configuration
  shared:
    # Inherit from these configs
    standards: ./shared/proagents/standards/
    rules: ./shared/proagents/rules/
    templates: ./shared/proagents/templates/

    # Shared environment variables
    env:
      - .env.shared
      - .env.workspace

  # Cross-project settings
  cross_project:
    # Dependency tracking
    dependency_tracking: true
    dependency_graph: true

    # Unified changelog
    changelog:
      enabled: true
      output: ./CHANGELOG.md
      format: "keep-a-changelog"

    # Shared analysis cache
    analysis_cache:
      enabled: true
      path: ./.proagents/cache
      ttl: "24h"

  # Deployment coordination
  deployment:
    environments:
      staging:
        auto_deploy: true
        order: [shared-utils, shared-ui, api-gateway, web-app, mobile-ios, mobile-android]

      production:
        auto_deploy: false
        approval_required: true
        order: [shared-utils, shared-ui, api-gateway, web-app, mobile-ios, mobile-android]

  # Team configuration
  teams:
    frontend-team:
      lead: "frontend-lead@company.com"
      slack: "#frontend"

    backend-team:
      lead: "backend-lead@company.com"
      slack: "#backend"

    mobile-team:
      lead: "mobile-lead@company.com"
      slack: "#mobile"
```

---

## Project Configuration

Each project can have its own configuration that extends workspace settings:

```yaml
# apps/web/proagents/proagents.config.yaml

project:
  name: "web-app"
  workspace: "../../"  # Reference to workspace root

  # Project-specific settings
  settings:
    checkpoints:
      after_design: true
      before_deployment: true

  # Override workspace standards
  overrides:
    standards:
      # Stricter rules for this project
      test_coverage: 90

  # Project-specific rules
  rules:
    - id: "require-accessibility"
      type: "custom"
      message: "All components must have aria labels"
```

---

## Configuration Inheritance

### Inheritance Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                  Configuration Inheritance                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. ProAgents Defaults (lowest priority)                   │
│     └── Built-in defaults                                  │
│                                                             │
│  2. Workspace Config                                        │
│     └── proagents.workspace.yaml                           │
│                                                             │
│  3. Shared Config                                           │
│     └── shared/proagents/standards/                        │
│                                                             │
│  4. Project Config                                          │
│     └── apps/web/proagents/proagents.config.yaml          │
│                                                             │
│  5. Feature-level Override (highest priority)              │
│     └── Command-line flags, feature-specific settings      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Override Examples

```yaml
# Workspace level
workspace:
  settings:
    test_coverage: 80

# Project level override
project:
  overrides:
    settings:
      test_coverage: 90  # Stricter for this project

# Feature level override
# proagents feature start "Critical feature" --coverage 95
```

---

## Shared Configuration

### Shared Standards

```yaml
# shared/proagents/standards/coding-standards.yaml

standards:
  naming:
    components: "PascalCase"
    functions: "camelCase"
    constants: "UPPER_SNAKE_CASE"

  code_style:
    indentation: 2
    quotes: "single"
    semicolons: true

  # Applied to all projects in workspace
  applies_to: "all"
```

### Shared Rules

```yaml
# shared/proagents/rules/security-rules.yaml

rules:
  - id: "no-eval"
    type: "security"
    pattern: "eval\\("
    message: "eval() is not allowed"
    severity: "error"
    applies_to: "all"

  - id: "no-inline-secrets"
    type: "security"
    pattern: "(api_key|password|secret)\\s*=\\s*['\"][^'\"]+['\"]"
    message: "No inline secrets"
    severity: "error"
    applies_to: "all"
```

### Shared Templates

```
shared/proagents/templates/
├── component/           # React component template
├── api-endpoint/        # API endpoint template
├── test/               # Test file template
└── feature-spec/       # Feature specification template
```

---

## Environment Configuration

### Workspace Environments

```yaml
workspace:
  environments:
    development:
      api_url: "http://localhost:3000"
      features:
        debug_mode: true

    staging:
      api_url: "https://staging-api.company.com"
      features:
        debug_mode: false

    production:
      api_url: "https://api.company.com"
      features:
        debug_mode: false
```

### Environment Files

```
.env.shared           # Shared across all projects
.env.workspace        # Workspace-specific
apps/web/.env         # Project-specific
apps/web/.env.local   # Local overrides (gitignored)
```

### Environment Loading Order

```
1. .env.shared
2. .env.workspace
3. .env.[project]
4. .env.[project].local
5. .env.[environment]
```

---

## Syncing Configuration

### Manual Sync

```bash
# Sync all projects with workspace config
proagents workspace sync

# Sync specific project
proagents workspace sync --project frontend

# Preview sync changes
proagents workspace sync --dry-run
```

### Auto Sync

```yaml
workspace:
  settings:
    auto_sync:
      enabled: true
      on_change: true  # Sync when workspace config changes
      interval: "1h"   # Or periodic sync
```

---

## Validation

### Workspace Validation

```bash
# Validate workspace configuration
proagents workspace validate

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Workspace Validation                                        │
├─────────────────────────────────────────────────────────────┤
│ ✅ Workspace file: Valid                                   │
│ ✅ Projects: 4 found, all valid                            │
│ ✅ Dependencies: No circular dependencies                  │
│ ✅ Shared config: Valid                                    │
│ ⚠️ Warning: mobile-android missing proagents config        │
└─────────────────────────────────────────────────────────────┘
```

### Configuration Linting

```bash
# Lint all configuration files
proagents workspace lint

# Fix issues
proagents workspace lint --fix
```

---

## Best Practices

1. **Single Source of Truth**: Keep shared standards in workspace
2. **Minimal Overrides**: Only override when necessary
3. **Document Overrides**: Comment why overrides exist
4. **Version Control**: Keep workspace config in git
5. **Regular Validation**: Run validation in CI
6. **Sync Regularly**: Keep projects in sync with workspace
