# Multi-Project & Monorepo Support

Manage multiple related projects and monorepos with unified workflows.

---

## Overview

ProAgents supports managing multiple projects together, whether in a monorepo or as separate related projects.

```
┌─────────────────────────────────────────────────────────────┐
│                    Multi-Project Architecture                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Workspace                                                  │
│  ├── Shared Config ──────────────────────────────────────  │
│  │   └── Common standards, rules, and templates            │
│  │                                                          │
│  ├── Projects ───────────────────────────────────────────  │
│  │   ├── frontend/      (React web app)                    │
│  │   ├── backend/       (Node.js API)                      │
│  │   ├── mobile/        (React Native)                     │
│  │   └── shared/        (Common libraries)                 │
│  │                                                          │
│  └── Cross-Project Features ─────────────────────────────  │
│      ├── Dependency tracking                               │
│      ├── Unified changelog                                 │
│      └── Coordinated deployments                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Initialize Workspace

```bash
# Create workspace configuration
proagents workspace init

# Add existing projects
proagents workspace add ./frontend --type web-frontend
proagents workspace add ./backend --type nodejs
proagents workspace add ./mobile --type react-native
```

### Configure Workspace

```yaml
# proagents.workspace.yaml

workspace:
  name: "My Platform"

  projects:
    - name: frontend
      path: ./frontend
      type: web-frontend

    - name: backend
      path: ./backend
      type: nodejs

    - name: mobile
      path: ./mobile
      type: react-native

  shared:
    standards: ./shared/proagents/standards/
    rules: ./shared/proagents/rules/
```

---

## Use Cases

| Scenario | Solution |
|----------|----------|
| Monorepo with multiple apps | Single workspace, multiple projects |
| Microservices architecture | Linked workspaces with dependencies |
| Frontend + Backend | Two projects with API contract sync |
| Multi-platform app | Web, mobile, desktop as linked projects |

---

## Features

| Feature | Description |
|---------|-------------|
| **Unified Config** | Share standards and rules across projects |
| **Cross-Project Dependencies** | Track dependencies between projects |
| **Coordinated Deployments** | Deploy in correct order |
| **Unified Changelog** | Single changelog for all projects |
| **Shared Analysis** | Reuse codebase analysis |

---

## Documentation Files

| File | Description |
|------|-------------|
| [workspace-config.md](./workspace-config.md) | Workspace configuration |
| [cross-project-deps.md](./cross-project-deps.md) | Cross-project dependencies |
| [unified-changelog.md](./unified-changelog.md) | Unified changelog management |
| [coordinated-deploy.md](./coordinated-deploy.md) | Coordinated deployments |

## Walkthroughs

| Walkthrough | Description |
|-------------|-------------|
| [Monorepo Setup](./walkthroughs/monorepo-setup.md) | Complete step-by-step monorepo setup guide |

---

## Workspace Structure

### Monorepo Layout

```
/workspace/
├── proagents.workspace.yaml     # Workspace configuration
├── shared/
│   ├── proagents/               # Shared ProAgents config
│   │   ├── standards/
│   │   ├── rules/
│   │   └── templates/
│   └── packages/                # Shared code packages
│       ├── ui-components/
│       └── utils/
├── apps/
│   ├── web/
│   │   └── proagents/           # Project-specific config
│   ├── api/
│   │   └── proagents/
│   └── mobile/
│       └── proagents/
└── .proagents/                  # Workspace-level data
    ├── cross-project-deps.json
    ├── unified-changelog/
    └── workspace-state.json
```

### Separate Repos Layout

```
/company-projects/
├── proagents.workspace.yaml     # Links all repos
├── frontend-repo/               # Separate git repo
│   └── proagents/
├── backend-repo/                # Separate git repo
│   └── proagents/
└── mobile-repo/                 # Separate git repo
    └── proagents/
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents workspace init` | Initialize workspace |
| `proagents workspace add` | Add project to workspace |
| `proagents workspace status` | Show workspace status |
| `proagents workspace deps` | Show dependencies |
| `proagents workspace sync` | Sync shared config |
| `proagents workspace deploy` | Coordinated deploy |
