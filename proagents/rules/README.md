# Custom Rules System

Define and enforce project-specific rules.

---

## Overview

The rules system allows you to define custom validation rules that are enforced during development. Rules can check:

- Naming conventions
- File structure
- Code patterns
- Security practices
- Testing requirements
- Performance best practices
- Accessibility standards

---

## Quick Start

### 1. Create Rules File

Create `proagents/rules/custom-rules.yaml`:

```yaml
naming_rules:
  - id: "component-naming"
    pattern: "^[A-Z][a-zA-Z]*$"
    applies_to: "**/*.tsx"
    message: "Components must be PascalCase"
    severity: "error"
```

### 2. Enable Rules

In `proagents.config.yaml`:

```yaml
rules:
  enabled: true
  config_file: "proagents/rules/custom-rules.yaml"
  fail_on_error: true
```

### 3. Run Validation

```bash
/rules-check        # Check all rules
/rules-check --fix  # Auto-fix where possible
```

---

## Rule Types

### Naming Rules
Enforce naming conventions for files, variables, and functions.

```yaml
naming_rules:
  - id: "hook-prefix"
    type: "naming"
    pattern: "^use[A-Z]"
    applies_to: "**/hooks/**/*.ts"
    message: "Hooks must start with 'use'"
```

### Structure Rules
Enforce file organization and imports.

```yaml
structure_rules:
  - id: "no-deep-imports"
    type: "structure"
    rule: "No imports from more than 2 levels deep"
    pattern: "from ['\"]\\.\\..*\\.\\."
    message: "Use path aliases for deep imports"
```

### Pattern Rules
Detect or require specific code patterns.

```yaml
pattern_rules:
  - id: "no-console"
    type: "pattern"
    pattern: "console\\.log"
    applies_to: "src/**/*.ts"
    exclude: ["**/*.test.ts"]
    message: "Remove console.log statements"
```

### Security Rules
Enforce security best practices.

```yaml
security_rules:
  - id: "no-eval"
    type: "security"
    pattern: "\\beval\\("
    message: "eval() is a security risk"
    severity: "error"
```

### Testing Rules
Ensure adequate test coverage.

```yaml
testing_rules:
  - id: "test-coverage"
    type: "coverage"
    minimum: 80
    applies_to: "src/**/*.ts"
    message: "Coverage must be at least 80%"
```

---

## Severity Levels

| Level | Behavior |
|-------|----------|
| `error` | Blocks commits/builds |
| `warning` | Shows warning, allows proceed |
| `info` | Informational only |
| `off` | Rule disabled |

---

## Configuration Options

```yaml
configuration:
  global:
    fail_on_error: true
    fail_on_warning: false
    auto_fix_enabled: true

  overrides:
    - path: "src/legacy/**"
      rules:
        some-rule: "off"

  ignore:
    - "node_modules/**"
    - "dist/**"
```

---

## Files

| File | Description |
|------|-------------|
| `README.md` | This file |
| `custom-rules.md` | Complete custom rules documentation |
| `custom-rules-template.yaml` | Full template with all rule types |

---

## Related Documentation

| File | Description |
|------|-------------|
| `../standards/override-system.md` | Override hierarchy and configuration |
| `../standards/architecture-patterns.md` | Architecture pattern definitions |

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/rules-check` | Run rule validation |
| `/rules-list` | List all active rules |
| `/rules-add` | Add new rule |
| `/rules-disable [id]` | Disable a rule |
