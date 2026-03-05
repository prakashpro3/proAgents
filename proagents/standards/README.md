# Project Standards

Define and customize coding standards for your project.

---

## Overview

Standards define how code should be written in your project. ProAgents uses these standards to:

- Generate code that matches your style
- Validate existing code
- Provide consistent suggestions
- Reduce corrections needed

---

## Standard Types

### Coding Standards
How code is written.

```yaml
# See: coding-standards-template.md
covers:
  - Naming conventions
  - Code style (formatting, quotes, etc.)
  - Comments and documentation
  - Import organization
  - Error handling
```

### Architecture Rules
How code is organized.

```yaml
# See: architecture-rules-template.md
covers:
  - Directory structure
  - Module boundaries
  - Component patterns
  - State management
  - Data flow
```

---

## Quick Start

### 1. Copy Templates

```bash
cp proagents/standards/coding-standards-template.md \
   proagents/standards/coding-standards.md

cp proagents/standards/architecture-rules-template.md \
   proagents/standards/architecture-rules.md
```

### 2. Customize

Edit the files to match your project's conventions.

### 3. Enable

In `proagents.config.yaml`:

```yaml
standards:
  coding: "proagents/standards/coding-standards.md"
  architecture: "proagents/standards/architecture-rules.md"
  enforce: true
```

---

## Inheritance

Extend existing standards:

```yaml
extends:
  - "./base-standards.yaml"
  - "@company/coding-standards"

overrides:
  max_line_length: 100
```

---

## Files

| File | Description |
|------|-------------|
| `README.md` | This file |
| `coding-standards-template.md` | Code style template |
| `architecture-rules-template.md` | Architecture template |
| `naming-conventions-template.md` | Naming convention template |
| `architecture-patterns.md` | Custom architecture patterns |
| `override-system.md` | Complete override documentation |

---

## Related Documentation

| File | Description |
|------|-------------|
| `../rules/custom-rules.md` | Custom rules engine |
| `../rules/README.md` | Rules system overview |

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/standards-check` | Check code against standards |
| `/standards-view` | View current standards |
| `/standards-update` | Update standards from template |
