# Project Scaffolding

Quick-start templates for new projects.

---

## Overview

Pre-configured project templates with ProAgents integration built-in.

## Available Templates

| Template | Description |
|----------|-------------|
| [React](./react/) | React SPA with Vite |
| [Next.js](./nextjs/) | Full-stack Next.js |
| [React Native](./react-native/) | Cross-platform mobile |
| [Node.js](./nodejs/) | Express/Node.js backend |

See [Project Types](./project-types.md) for detailed comparison.

## Quick Start

```bash
# Create new project with template
proagents new my-app --template react

# Initialize ProAgents in existing project
proagents init --template nextjs
```

## Template Contents

Each template includes:

```
template/
├── src/                    # Source code structure
├── tests/                  # Test setup
├── .proagents/             # ProAgents config
│   ├── proagents.config.yaml
│   └── standards/
├── .github/                # CI/CD workflows
├── package.json            # Dependencies
└── README.md               # Documentation
```

## Creating Custom Templates

```bash
# Export current project as template
proagents scaffold export --name my-template

# Use custom template
proagents new my-app --template ./my-template
```

## Template Features

- Pre-configured linting (ESLint, Prettier)
- Testing setup (Jest, Vitest, or project-specific)
- CI/CD pipeline templates
- ProAgents workflow integration
- Git hooks (Husky)
