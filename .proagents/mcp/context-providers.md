# MCP Context Providers

Resources and context that ProAgents exposes to AI assistants via MCP.

---

## Overview

Context providers expose project data as MCP resources, allowing AI assistants to access relevant information without explicit tool calls.

---

## Resource URIs

| Resource | URI Pattern | Description |
|----------|-------------|-------------|
| Configuration | `proagents://config` | Project configuration |
| Features | `proagents://features` | Active features |
| Features (specific) | `proagents://features/{id}` | Specific feature |
| Analysis | `proagents://analysis` | Codebase analysis |
| Changelog | `proagents://changelog` | Recent changes |
| Todos | `proagents://todos` | Current task list |
| Standards | `proagents://standards` | Project standards |
| Patterns | `proagents://patterns` | Detected patterns |

---

## Configuration Resource

**URI:** `proagents://config`

Provides the current project configuration.

```json
{
  "uri": "proagents://config",
  "name": "Project Configuration",
  "mimeType": "application/json",
  "content": {
    "project": {
      "name": "my-project",
      "type": "fullstack",
      "path": "/path/to/project"
    },
    "checkpoints": {
      "after_analysis": true,
      "after_design": true,
      "before_deployment": true
    },
    "git": {
      "enabled": true,
      "branch_prefix": "feature/",
      "commit_convention": "conventional"
    },
    "testing": {
      "framework": "jest",
      "coverage_threshold": 80
    }
  }
}
```

---

## Features Resource

**URI:** `proagents://features`

Lists all active and recent features.

```json
{
  "uri": "proagents://features",
  "name": "Active Features",
  "mimeType": "application/json",
  "content": {
    "active": [
      {
        "id": "feature-user-auth",
        "name": "User Authentication",
        "status": "in_progress",
        "current_phase": "implementation",
        "progress": 65,
        "branch": "feature/user-auth",
        "started_at": "2024-01-15T10:00:00Z",
        "files_modified": ["src/auth/*", "src/api/auth.ts"]
      }
    ],
    "recent": [
      {
        "id": "feature-dashboard",
        "name": "Dashboard Redesign",
        "status": "completed",
        "completed_at": "2024-01-14T16:30:00Z"
      }
    ],
    "blocked": []
  }
}
```

**Single Feature URI:** `proagents://features/feature-user-auth`

```json
{
  "uri": "proagents://features/feature-user-auth",
  "name": "Feature: User Authentication",
  "mimeType": "application/json",
  "content": {
    "id": "feature-user-auth",
    "name": "User Authentication",
    "description": "Implement user login, registration, and session management",
    "status": "in_progress",
    "phases": {
      "analysis": { "status": "completed", "duration_minutes": 15 },
      "requirements": { "status": "completed", "duration_minutes": 20 },
      "design": { "status": "completed", "duration_minutes": 30 },
      "planning": { "status": "completed", "duration_minutes": 25 },
      "implementation": { "status": "in_progress", "progress": 60 },
      "testing": { "status": "pending" },
      "review": { "status": "pending" },
      "documentation": { "status": "pending" },
      "deployment": { "status": "pending" }
    },
    "files": {
      "created": ["src/auth/AuthService.ts", "src/auth/AuthContext.tsx"],
      "modified": ["src/api/index.ts", "src/App.tsx"],
      "deleted": []
    },
    "decisions": [
      {
        "decision": "Use JWT for authentication",
        "reason": "Stateless, scalable, works with mobile",
        "alternatives_considered": ["Session-based", "OAuth only"]
      }
    ]
  }
}
```

---

## Analysis Resource

**URI:** `proagents://analysis`

Provides cached codebase analysis.

```json
{
  "uri": "proagents://analysis",
  "name": "Codebase Analysis",
  "mimeType": "application/json",
  "content": {
    "generated_at": "2024-01-15T08:00:00Z",
    "expires_at": "2024-01-16T08:00:00Z",

    "structure": {
      "type": "fullstack",
      "framework": "next.js",
      "language": "typescript",
      "directories": {
        "src": "Source code",
        "src/components": "React components",
        "src/pages": "Next.js pages",
        "src/api": "API routes",
        "src/lib": "Utilities and helpers"
      }
    },

    "patterns": {
      "state_management": "zustand",
      "styling": "tailwind",
      "testing": "jest + testing-library",
      "api_client": "axios with react-query"
    },

    "conventions": {
      "naming": {
        "components": "PascalCase",
        "functions": "camelCase",
        "files": "kebab-case for utils, PascalCase for components"
      },
      "imports": "Absolute imports from @/",
      "exports": "Named exports preferred"
    },

    "dependencies": {
      "core": ["react", "next", "typescript"],
      "state": ["zustand"],
      "ui": ["tailwindcss", "@headlessui/react"],
      "data": ["axios", "@tanstack/react-query"]
    },

    "metrics": {
      "total_files": 156,
      "total_lines": 12500,
      "test_coverage": 78
    }
  }
}
```

---

## Changelog Resource

**URI:** `proagents://changelog`

Recent changes and history.

```json
{
  "uri": "proagents://changelog",
  "name": "Recent Changes",
  "mimeType": "application/json",
  "content": {
    "entries": [
      {
        "date": "2024-01-15",
        "type": "feature",
        "title": "Add user dashboard",
        "description": "Implemented user dashboard with analytics widgets",
        "commit": "abc123",
        "branch": "feature/user-dashboard",
        "files_changed": 12
      },
      {
        "date": "2024-01-14",
        "type": "fix",
        "title": "Fix login redirect loop",
        "description": "Resolved infinite redirect when session expired",
        "commit": "def456",
        "branch": "fix/login-redirect"
      }
    ],
    "summary": {
      "last_7_days": {
        "features": 3,
        "fixes": 5,
        "refactors": 2
      }
    }
  }
}
```

---

## Todos Resource

**URI:** `proagents://todos`

Current task list.

```json
{
  "uri": "proagents://todos",
  "name": "Current Tasks",
  "mimeType": "application/json",
  "content": {
    "items": [
      {
        "id": "todo-1",
        "content": "Implement login form validation",
        "status": "in_progress",
        "feature": "feature-user-auth",
        "created_at": "2024-01-15T10:30:00Z"
      },
      {
        "id": "todo-2",
        "content": "Add password strength indicator",
        "status": "pending",
        "feature": "feature-user-auth"
      },
      {
        "id": "todo-3",
        "content": "Write unit tests for AuthService",
        "status": "pending",
        "feature": "feature-user-auth"
      }
    ],
    "summary": {
      "total": 3,
      "completed": 0,
      "in_progress": 1,
      "pending": 2
    }
  }
}
```

---

## Standards Resource

**URI:** `proagents://standards`

Project coding standards and rules.

```json
{
  "uri": "proagents://standards",
  "name": "Project Standards",
  "mimeType": "application/json",
  "content": {
    "coding": {
      "language": "typescript",
      "strict_mode": true,
      "max_line_length": 100,
      "indentation": "2 spaces"
    },
    "naming": {
      "components": "PascalCase",
      "hooks": "use prefix + camelCase",
      "constants": "UPPER_SNAKE_CASE",
      "files": {
        "components": "PascalCase.tsx",
        "utilities": "kebab-case.ts",
        "tests": "{name}.test.ts"
      }
    },
    "architecture": {
      "state_management": "zustand for global, useState for local",
      "api_calls": "react-query hooks in /hooks/api/",
      "styling": "Tailwind utility classes"
    },
    "testing": {
      "framework": "jest",
      "coverage_minimum": 80,
      "required_for": ["services", "hooks", "utils"]
    }
  }
}
```

---

## Patterns Resource

**URI:** `proagents://patterns`

Detected code patterns and examples.

```json
{
  "uri": "proagents://patterns",
  "name": "Code Patterns",
  "mimeType": "application/json",
  "content": {
    "components": {
      "pattern": "Functional components with TypeScript interfaces",
      "example": "interface Props { title: string; } export function Card({ title }: Props) { ... }"
    },
    "hooks": {
      "pattern": "Custom hooks for data fetching",
      "example": "export function useUser(id: string) { return useQuery(['user', id], () => fetchUser(id)); }"
    },
    "api_calls": {
      "pattern": "Centralized API client with interceptors",
      "example": "const api = axios.create({ baseURL: '/api' }); api.interceptors.request.use(addAuth);"
    },
    "error_handling": {
      "pattern": "Error boundaries for components, try-catch for async",
      "example": "class ErrorBoundary extends React.Component { ... }"
    },
    "state": {
      "pattern": "Zustand stores with selectors",
      "example": "const useStore = create((set) => ({ user: null, setUser: (user) => set({ user }) }));"
    }
  }
}
```

---

## Resource Templates

For dynamic resources, use URI templates:

```json
{
  "uriTemplate": "proagents://files/{path}",
  "name": "Project Files",
  "description": "Access project file contents"
}
```

**Example:** `proagents://files/src/auth/AuthService.ts`

---

## Caching Behavior

| Resource | Cache Duration | Auto-Refresh |
|----------|---------------|--------------|
| config | 1 hour | On file change |
| features | 5 minutes | On status change |
| analysis | 24 hours | On significant changes |
| changelog | 10 minutes | On new commits |
| todos | 1 minute | On todo change |
| standards | 1 hour | On file change |
| patterns | 24 hours | On analysis refresh |

---

## Configuration

```yaml
# proagents.config.yaml
mcp:
  resources:
    enabled:
      - config
      - features
      - analysis
      - changelog
      - todos
      - standards
      - patterns

    cache:
      config: 3600        # 1 hour
      features: 300       # 5 minutes
      analysis: 86400     # 24 hours
      changelog: 600      # 10 minutes
      todos: 60           # 1 minute

    auto_refresh:
      enabled: true
      watch_files: true
```

---

## Best Practices

1. **Use Resources for Context**: Let AI access resources instead of repeated tool calls
2. **Cache Appropriately**: Balance freshness with performance
3. **Scope Resources**: Only expose necessary information
4. **Monitor Access**: Log resource access for debugging
5. **Handle Staleness**: Indicate when data may be outdated
