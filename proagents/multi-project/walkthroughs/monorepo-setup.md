# Monorepo Setup Walkthrough

A complete step-by-step guide to setting up a monorepo with ProAgents.

---

## Scenario

We're building **TaskFlow**, a task management platform with:
- **Web App** (Next.js)
- **API Server** (Node.js/Express)
- **Mobile App** (React Native)
- **Shared Packages** (Types, Utils, UI Components)

---

## Step 1: Create Directory Structure

```bash
# Create the monorepo root
mkdir taskflow && cd taskflow

# Initialize git
git init

# Create the structure
mkdir -p apps/{web,api,mobile}
mkdir -p packages/{types,utils,ui}
mkdir -p shared/proagents/{standards,rules,templates}
mkdir -p .proagents
```

**Result:**
```
taskflow/
├── apps/
│   ├── web/
│   ├── api/
│   └── mobile/
├── packages/
│   ├── types/
│   ├── utils/
│   └── ui/
├── shared/
│   └── proagents/
│       ├── standards/
│       ├── rules/
│       └── templates/
└── .proagents/
```

---

## Step 2: Initialize Package Manager (pnpm/yarn/npm)

Using pnpm (recommended for monorepos):

```bash
# Initialize pnpm workspace
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Initialize root package.json
cat > package.json << 'EOF'
{
  "name": "taskflow",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
EOF

# Install dependencies
pnpm install
```

---

## Step 3: Initialize ProAgents Workspace

```bash
# Create workspace configuration
cat > proagents.workspace.yaml << 'EOF'
# ProAgents Workspace Configuration
# TaskFlow Monorepo

workspace:
  name: "TaskFlow"
  description: "Task management platform monorepo"
  version: "1.0.0"

projects:
  # Web Application
  - name: web
    path: ./apps/web
    type: web-frontend
    framework: nextjs
    port: 3000
    description: "Next.js web application"

  # API Server
  - name: api
    path: ./apps/api
    type: nodejs
    framework: express
    port: 4000
    description: "Express REST API server"

  # Mobile Application
  - name: mobile
    path: ./apps/mobile
    type: react-native
    description: "React Native mobile app"

  # Shared Packages
  - name: types
    path: ./packages/types
    type: library
    description: "Shared TypeScript types"

  - name: utils
    path: ./packages/utils
    type: library
    description: "Shared utility functions"

  - name: ui
    path: ./packages/ui
    type: library
    description: "Shared UI components"

# Shared Configuration
shared:
  standards: ./shared/proagents/standards/
  rules: ./shared/proagents/rules/
  templates: ./shared/proagents/templates/

# Cross-Project Configuration
cross_project:
  dependency_tracking: true
  unified_changelog: true
  shared_analysis_cache: true
  coordinated_deployments: true

# Deployment Configuration
deployment:
  environments:
    - name: development
      auto_deploy: true
    - name: staging
      auto_deploy: false
      require_approval: true
    - name: production
      auto_deploy: false
      require_approval: true
      approval_roles:
        - tech_lead
        - devops
EOF
```

---

## Step 4: Create Shared Standards

### 4.1 Coding Standards

```bash
cat > shared/proagents/standards/coding-standards.md << 'EOF'
# TaskFlow Coding Standards

## TypeScript
- Strict mode enabled
- No `any` types (use `unknown` instead)
- Explicit return types for functions

## Naming Conventions
- Components: PascalCase (e.g., `TaskCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useTaskList.ts`)
- Types/Interfaces: PascalCase with descriptive names
- Files: kebab-case for utilities, PascalCase for components

## Import Order
1. React/Node built-ins
2. External dependencies
3. Internal packages (@taskflow/*)
4. Relative imports
5. Styles

## Code Style
- Max line length: 100 characters
- 2 space indentation
- Single quotes for strings
- Semicolons required
EOF
```

### 4.2 Architecture Rules

```bash
cat > shared/proagents/standards/architecture-rules.md << 'EOF'
# TaskFlow Architecture Rules

## Dependency Rules

### Apps can import from:
- @taskflow/types (shared types)
- @taskflow/utils (shared utilities)
- @taskflow/ui (shared UI - web and mobile only)

### Packages cannot import from:
- apps/* (no app code in packages)
- Each other (unless explicitly declared)

## API Patterns

### All API calls must:
1. Go through the API client in @taskflow/utils
2. Use typed request/response from @taskflow/types
3. Handle errors consistently

## State Management

- Web: Zustand for global state
- Mobile: Zustand for global state
- API: No state (stateless)

## Authentication

- JWT tokens stored securely
- Refresh token rotation enabled
- Auth context/hooks for all apps
EOF
```

### 4.3 Custom Rules

```bash
cat > shared/proagents/rules/workspace-rules.yaml << 'EOF'
# TaskFlow Workspace Rules

rules:
  # Enforce package boundaries
  - id: no-cross-app-imports
    type: import
    pattern: "apps/*/src/**"
    disallow: "apps/*/src/**"
    message: "Apps cannot import from other apps directly"
    severity: error

  # Require shared types
  - id: use-shared-types
    type: import
    condition: "defines types used across projects"
    requires: "import from @taskflow/types"
    message: "Shared types must be in @taskflow/types"
    severity: warning

  # API versioning
  - id: api-versioning
    type: pattern
    applies_to: "apps/api/src/routes/**"
    pattern: "/api/v[0-9]+"
    message: "API routes must be versioned"
    severity: error
EOF
```

---

## Step 5: Initialize Each Project

### 5.1 Web App (Next.js)

```bash
cd apps/web

# Initialize Next.js app (or copy existing)
pnpm create next-app . --typescript --tailwind --eslint

# Create project-specific ProAgents config
mkdir proagents
cat > proagents/proagents.config.yaml << 'EOF'
# Web App Configuration
# Inherits from workspace, adds project-specific settings

project:
  name: "TaskFlow Web"
  type: "web-frontend"
  framework: "nextjs"

extends:
  - "../../shared/proagents/standards"
  - "../../shared/proagents/rules"

# Project-specific overrides
checkpoints:
  after_ui_design: true
  after_implementation: true

testing:
  framework: "jest"
  coverage_threshold: 80
  e2e:
    framework: "playwright"

deployment:
  platform: "vercel"
  preview_on_pr: true
EOF

cd ../..
```

### 5.2 API Server (Express)

```bash
cd apps/api

# Initialize package
cat > package.json << 'EOF'
{
  "name": "@taskflow/api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@taskflow/types": "workspace:*",
    "@taskflow/utils": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "@types/express": "^4.17.0"
  }
}
EOF

# Create ProAgents config
mkdir proagents
cat > proagents/proagents.config.yaml << 'EOF'
# API Server Configuration

project:
  name: "TaskFlow API"
  type: "nodejs"
  framework: "express"

extends:
  - "../../shared/proagents/standards"
  - "../../shared/proagents/rules"

# API-specific settings
api:
  versioning: "url"
  documentation: "openapi"

security:
  require_auth_review: true
  scan_dependencies: "daily"

testing:
  framework: "jest"
  coverage_threshold: 85
  integration_tests: true

deployment:
  platform: "railway"
  auto_scale: true
EOF

cd ../..
```

### 5.3 Mobile App (React Native)

```bash
cd apps/mobile

# Initialize React Native (or use existing)
# npx react-native init TaskFlowMobile --template react-native-template-typescript

# Create ProAgents config
mkdir proagents
cat > proagents/proagents.config.yaml << 'EOF'
# Mobile App Configuration

project:
  name: "TaskFlow Mobile"
  type: "react-native"

extends:
  - "../../shared/proagents/standards"
  - "../../shared/proagents/rules"

# Mobile-specific settings
platforms:
  - ios
  - android

testing:
  framework: "jest"
  coverage_threshold: 75
  detox: true

deployment:
  ios:
    platform: "app-store-connect"
    testflight: true
  android:
    platform: "google-play"
    internal_testing: true
EOF

cd ../..
```

### 5.4 Shared Packages

```bash
# Types package
cd packages/types
cat > package.json << 'EOF'
{
  "name": "@taskflow/types",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  }
}
EOF

mkdir src
cat > src/index.ts << 'EOF'
// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

// API types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    total?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
EOF

cd ../..

# Utils package
cd packages/utils
cat > package.json << 'EOF'
{
  "name": "@taskflow/utils",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "test": "jest"
  },
  "dependencies": {
    "@taskflow/types": "workspace:*"
  }
}
EOF

mkdir src
cat > src/index.ts << 'EOF'
export * from './api-client';
export * from './formatters';
export * from './validators';
EOF

cat > src/api-client.ts << 'EOF'
import type { ApiResponse, ApiError } from '@taskflow/types';

const API_BASE_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
EOF

cd ../..
```

---

## Step 6: Define Cross-Project Dependencies

```bash
cat > .proagents/cross-project-deps.json << 'EOF'
{
  "version": "1.0",
  "dependencies": [
    {
      "from": "web",
      "to": "api",
      "type": "api_consumer",
      "contract": "openapi",
      "description": "Web app consumes REST API"
    },
    {
      "from": "mobile",
      "to": "api",
      "type": "api_consumer",
      "contract": "openapi",
      "description": "Mobile app consumes REST API"
    },
    {
      "from": "web",
      "to": "types",
      "type": "package",
      "description": "Web uses shared types"
    },
    {
      "from": "api",
      "to": "types",
      "type": "package",
      "description": "API uses shared types"
    },
    {
      "from": "mobile",
      "to": "types",
      "type": "package",
      "description": "Mobile uses shared types"
    }
  ],
  "deployment_order": [
    {
      "environment": "production",
      "order": ["types", "utils", "ui", "api", "web", "mobile"]
    }
  ]
}
EOF
```

---

## Step 7: Create Unified Changelog

```bash
mkdir -p .proagents/changelog

cat > .proagents/changelog/CHANGELOG.md << 'EOF'
# TaskFlow Changelog

All notable changes across all projects.

## [Unreleased]

### Web
- Initial setup

### API
- Initial setup

### Mobile
- Initial setup

---

## Format

Each entry includes:
- **[project]** Change description
- Links to commits/PRs
- Breaking change indicators
EOF
```

---

## Step 8: Verify Setup

```bash
# Check workspace status
proagents workspace status

# Expected output:
# ┌─────────────────────────────────────────────────┐
# │ TaskFlow Workspace                              │
# ├─────────────────────────────────────────────────┤
# │ Projects: 6                                     │
# │                                                 │
# │ ✓ web      (Next.js)    apps/web               │
# │ ✓ api      (Express)    apps/api               │
# │ ✓ mobile   (RN)         apps/mobile            │
# │ ✓ types    (Library)    packages/types         │
# │ ✓ utils    (Library)    packages/utils         │
# │ ✓ ui       (Library)    packages/ui            │
# │                                                 │
# │ Shared Config: ✓ Loaded                         │
# │ Dependencies: 5 defined                         │
# └─────────────────────────────────────────────────┘

# Validate workspace configuration
proagents workspace validate

# Check cross-project dependencies
proagents workspace deps --graph
```

---

## Step 9: Working with the Monorepo

### Start a Cross-Project Feature

```bash
# Start a feature that spans multiple projects
proagents feature start "Add task comments" --projects web,api,types

# ProAgents will:
# 1. Create branches in all affected projects
# 2. Track dependencies between changes
# 3. Coordinate commits and PRs
```

### Run Commands Across Projects

```bash
# Build all projects
proagents workspace run build

# Test specific projects
proagents workspace run test --filter web,api

# Lint all with shared rules
proagents workspace run lint
```

### Deploy Coordinated Changes

```bash
# Deploy to staging (respects deployment order)
proagents workspace deploy staging

# Deploy order: types → utils → api → web → mobile
```

---

## Common Operations

### Add a New Package

```bash
# Create new shared package
proagents workspace add-package hooks --path packages/hooks

# This will:
# 1. Create package structure
# 2. Add to workspace config
# 3. Configure with shared standards
```

### Sync Configuration Changes

```bash
# After updating shared standards
proagents workspace sync

# Validates all projects against updated standards
```

### Check for Breaking Changes

```bash
# Before merging a feature
proagents workspace check-breaking

# Reports any cross-project breaking changes
```

---

## Troubleshooting

### Issue: Package not found

```
Error: Cannot find module '@taskflow/types'
```

**Solution:**
```bash
# Rebuild packages
pnpm build --filter @taskflow/types
# Or build all
pnpm build
```

### Issue: Circular dependency detected

```
Error: Circular dependency: web → utils → types → web
```

**Solution:**
- Review the dependency graph
- Extract shared code to a lower-level package
- Use dependency injection to break cycles

### Issue: Workspace config not loading

```
Error: proagents.workspace.yaml not found
```

**Solution:**
```bash
# Ensure you're in workspace root
cd /path/to/taskflow

# Verify file exists
cat proagents.workspace.yaml
```

---

## Next Steps

1. **Add CI/CD**: Set up GitHub Actions for the monorepo
2. **Add More Packages**: As needed for shared code
3. **Configure Environments**: Set up dev, staging, production
4. **Team Onboarding**: Use this guide to onboard new developers
