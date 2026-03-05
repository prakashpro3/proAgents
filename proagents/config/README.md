# Configuration

Project-specific configuration files and customization.

---

## Overview

This directory contains configuration for customizing ProAgents to your project's needs.

---

## Structure

```
proagents/config/
├── README.md                     # This file
├── proagents.config.yaml         # Main configuration file
├── standards/                    # Project coding standards
│   ├── README.md
│   ├── coding-standards.template.md
│   ├── architecture-rules.template.md
│   ├── naming-conventions.template.md
│   └── testing-standards.template.md
├── rules/                        # Custom validation rules
│   ├── README.md
│   ├── custom-rules.template.yaml
│   └── validation-rules.template.yaml
├── templates/                    # Code generation templates
│   ├── README.md
│   ├── component.template.tsx
│   ├── hook.template.ts
│   ├── api-route.template.ts
│   └── test.template.ts
└── integrations/                 # Third-party integrations
    ├── README.md
    └── [integration configs]
```

---

## Subdirectories

| Directory | Purpose | Documentation |
|-----------|---------|---------------|
| [standards/](./standards/) | Project coding standards | [README](./standards/README.md) |
| [rules/](./rules/) | Custom validation rules | [README](./rules/README.md) |
| [templates/](./templates/) | Code generation templates | [README](./templates/README.md) |
| [integrations/](./integrations/) | Integration configs | [README](./integrations/README.md) |

---

## Quick Start

### 1. Copy Main Config

```bash
# Copy the default configuration
cp proagents/proagents.config.yaml proagents/config/proagents.config.yaml
```

### 2. Add Project Standards

```bash
# Copy standards templates
cp proagents/config/standards/*.template.md proagents/config/standards/

# Remove .template from names
for f in proagents/config/standards/*.template.md; do
  mv "$f" "${f%.template.md}.md"
done

# Edit for your project
vim proagents/config/standards/coding-standards.md
```

### 3. Add Custom Rules

```bash
# Copy rules templates
cp proagents/config/rules/*.template.yaml proagents/config/rules/

# Edit for your project
vim proagents/config/rules/custom-rules.yaml
```

### 4. Add Code Templates

```bash
# Copy template files
cp proagents/config/templates/*.template.* proagents/config/templates/

# Customize for your project
vim proagents/config/templates/component.template.tsx
```

---

## Configuration Priority

When ProAgents runs, configuration is loaded in this order (later overrides earlier):

1. **Framework defaults** (lowest priority)
2. **Project config** (`proagents/config/`)
3. **Environment variables**
4. **Command line arguments** (highest priority)

---

## Main Configuration File

The `proagents.config.yaml` file controls all aspects of ProAgents:

```yaml
# proagents.config.yaml

project:
  name: "My Project"
  type: "fullstack"

# Checkpoints
checkpoints:
  after_analysis: true
  after_design: true
  before_deployment: true

# Git integration
git:
  enabled: true
  branch_prefix: "feature/"
  commit_convention: "conventional"

# Learning system
learning:
  enabled: true
  auto_apply_corrections: true

# Testing
testing:
  framework: "vitest"
  coverage_threshold: 80

# See proagents/proagents.config.yaml for full options
```

---

## Validation

Validate your configuration:

```bash
# Check configuration is valid
proagents config validate

# Show resolved configuration
proagents config show

# Test against project
proagents config test
```

---

## Template Locations

Templates exist in two locations for flexibility:

| Location | Naming Convention | Purpose |
|----------|-------------------|---------|
| `config/standards/` | `*.template.md` | Project-specific standards |
| `config/rules/` | `*.template.yaml` | Project-specific rules |
| `standards/` | `*-template.md` | Framework defaults |
| `rules/` | `*-template.yaml` | Framework defaults |

**Recommendation:** Use `config/` for project customization. The root `standards/` and `rules/` directories contain framework defaults that can be extended.

When customizing:
1. Copy from `config/` templates (project-specific)
2. Or extend from root templates (framework defaults)
3. Both approaches work - choose based on your needs
