# Project Rules Configuration

Place your project-specific rules here. These are enforced during code generation and review.

---

## How It Works

1. Copy templates from this directory
2. Customize rules for your project
3. ProAgents validates code against these rules
4. Rules can block commits or show warnings

---

## Files

| File | Purpose |
|------|---------|
| `custom-rules.yaml` | Project-specific validation rules |
| `validation-rules.yaml` | Input/output validation rules |

---

## Quick Start

```bash
# Copy the template
cp proagents/config/rules/custom-rules.template.yaml \
   proagents/config/rules/custom-rules.yaml

# Edit for your project
vim proagents/config/rules/custom-rules.yaml
```

---

## Rule Severity Levels

| Level | Behavior |
|-------|----------|
| `error` | Blocks progress, must fix |
| `warning` | Shows alert, can proceed |
| `info` | Informational only |
| `off` | Disabled |

---

## Rule Types

| Type | Description |
|------|-------------|
| `naming` | File/variable naming patterns |
| `import` | Import restrictions |
| `structure` | Code organization rules |
| `pattern` | Code pattern requirements |
| `security` | Security-related checks |
| `coverage` | Test coverage requirements |
| `custom` | Custom business rules |

---

## Example Rule

```yaml
rules:
  - id: require-error-boundary
    type: pattern
    condition: "page_component"
    requires: "ErrorBoundary wrapper"
    message: "All page components must have error boundaries"
    severity: error
```
