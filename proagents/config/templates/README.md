# Project Templates Configuration

Place your project-specific code templates here. ProAgents uses these when generating new code.

---

## How It Works

1. Create templates for your common patterns
2. ProAgents uses these templates when generating code
3. Templates support variables and conditionals

---

## Template Files

| File | Purpose |
|------|---------|
| `component.template.tsx` | React component template |
| `hook.template.ts` | Custom hook template |
| `api-route.template.ts` | API route/endpoint template |
| `test.template.ts` | Test file template |
| `service.template.ts` | Service class template |

---

## Quick Start

```bash
# Copy a template
cp proagents/config/templates/component.template.tsx \
   proagents/config/templates/component.template.tsx

# Edit for your project
vim proagents/config/templates/component.template.tsx
```

---

## Template Variables

Templates support these variables:

| Variable | Description |
|----------|-------------|
| `{{ComponentName}}` | PascalCase name |
| `{{componentName}}` | camelCase name |
| `{{component-name}}` | kebab-case name |
| `{{COMPONENT_NAME}}` | UPPER_SNAKE_CASE name |
| `{{description}}` | Component description |
| `{{date}}` | Current date |
| `{{author}}` | Current user |

---

## Conditional Sections

```typescript
// {{#if hasProps}}
interface {{ComponentName}}Props {
  // Props here
}
// {{/if}}
```

---

## Example Usage

When you ask ProAgents to create a new component, it will:
1. Load your `component.template.tsx`
2. Replace variables with actual values
3. Apply your coding standards
4. Generate the file
