# Migrating from Cursor Rules

Convert your `.cursorrules` file to ProAgents configuration.

---

## Overview

Cursor uses a `.cursorrules` file for AI instructions. ProAgents provides a more structured approach with:

- Separate standards, rules, and prompts
- Version-controlled configuration
- Cross-IDE compatibility
- Workflow integration

---

## Automated Migration

```bash
# Detect and migrate Cursor rules
proagents migrate --from cursor-rules

# Preview changes
proagents migrate --from cursor-rules --dry-run

# Specify custom source path
proagents migrate --from cursor-rules --source ./.cursorrules
```

---

## Manual Migration

### Step 1: Analyze Existing Rules

Review your `.cursorrules` content and identify:

1. **Coding Standards** - Style, naming, formatting rules
2. **Project Patterns** - Architecture, state management, etc.
3. **Instructions** - How AI should behave
4. **Custom Commands** - Commands or workflows

### Step 2: Create Standards Files

**From Cursor:**
```markdown
## Code Style
- Use TypeScript strict mode
- Prefer functional components
- Use named exports
```

**To ProAgents (`proagents/standards/coding-standards.md`):**
```markdown
# Coding Standards

## TypeScript
- Use strict mode (`"strict": true` in tsconfig.json)
- No implicit any
- Explicit return types for public functions

## React
- Functional components only
- Named exports for components
- Props interface above component
```

### Step 3: Create Rules Files

**From Cursor:**
```markdown
## Naming
- Components: PascalCase
- Hooks: useXxx
- Constants: UPPER_SNAKE
```

**To ProAgents (`proagents/rules/naming-rules.yaml`):**
```yaml
rules:
  - id: component-naming
    type: naming
    pattern: "^[A-Z][a-zA-Z]+$"
    applies_to: "components/**/*.tsx"
    message: "Components must use PascalCase"
    severity: error

  - id: hook-naming
    type: naming
    pattern: "^use[A-Z]"
    applies_to: "hooks/**/*.ts"
    message: "Hooks must start with 'use'"
    severity: error

  - id: constant-naming
    type: naming
    pattern: "^[A-Z][A-Z0-9_]+$"
    applies_to: "constants/**/*.ts"
    message: "Constants must use UPPER_SNAKE_CASE"
    severity: warning
```

### Step 4: Update Prompts

**From Cursor:**
```markdown
## Instructions
When writing code:
1. Check existing patterns first
2. Follow naming conventions
3. Add proper error handling
```

**To ProAgents (`proagents/prompts/05-implementation.md`):**
```markdown
# Implementation Phase

## Pre-Implementation Checklist
- [ ] Review existing patterns in codebase
- [ ] Verify naming conventions
- [ ] Plan error handling approach

## Implementation Guidelines
1. **Check Existing Patterns**
   - Search for similar implementations
   - Follow established patterns
   - Match code style

2. **Apply Naming Conventions**
   - Components: PascalCase
   - Hooks: useXxx prefix
   - Constants: UPPER_SNAKE_CASE

3. **Error Handling**
   - Use try-catch for async operations
   - Provide meaningful error messages
   - Log errors with context
```

### Step 5: Configure ProAgents

Create `proagents/proagents.config.yaml`:

```yaml
project:
  name: "My Project"
  type: "fullstack"

standards:
  path: "./proagents/standards"
  enforce: true

rules:
  path: "./proagents/rules"
  severity_threshold: "warning"

# Generate IDE rules for Cursor compatibility
ide:
  cursor:
    enabled: true
    auto_generate: true
    include:
      - standards
      - rules
      - patterns
```

### Step 6: Generate Cursor-Compatible Rules

ProAgents can generate `.cursorrules` from your configuration:

```bash
# Generate .cursorrules from ProAgents config
proagents ide generate cursor

# Keep both in sync
proagents ide sync cursor
```

---

## Mapping Reference

| Cursor Section | ProAgents Location |
|----------------|-------------------|
| Code Style | `standards/coding-standards.md` |
| Naming Conventions | `rules/naming-rules.yaml` |
| Project Structure | `standards/architecture-rules.md` |
| Testing Guidelines | `standards/testing-standards.md` |
| Instructions | `prompts/*.md` |
| Custom Commands | `slash-commands.json` |

---

## Side-by-Side Comparison

### Before (Cursor)

```markdown
# .cursorrules

You are an AI assistant helping with a Next.js project.

## Code Style
- TypeScript strict mode
- Functional components
- Tailwind CSS

## Patterns
- Use Zustand for state
- React Query for data fetching
- Zod for validation

## Rules
- No console.log in production
- Always handle errors
- Write tests for new code

## When coding
1. Check existing patterns
2. Follow conventions
3. Add tests
```

### After (ProAgents)

**`proagents/standards/coding-standards.md`:**
```markdown
# Coding Standards

## TypeScript
- Strict mode enabled
- No implicit any

## React
- Functional components only
- Use Tailwind CSS for styling
```

**`proagents/standards/architecture-patterns.md`:**
```markdown
# Architecture Patterns

## State Management
- Zustand for global state
- React hooks for local state

## Data Fetching
- React Query for server state
- Axios for HTTP client

## Validation
- Zod for runtime validation
- TypeScript for compile-time
```

**`proagents/rules/quality-rules.yaml`:**
```yaml
rules:
  - id: no-console-log
    pattern: "console\\.log"
    severity: error
    message: "Remove console.log before committing"

  - id: require-error-handling
    type: pattern
    condition: "async function"
    requires: "try-catch"
    severity: warning
```

**`proagents/proagents.config.yaml`:**
```yaml
project:
  name: "My Next.js Project"
  type: "fullstack"

testing:
  require_for_new_code: true
  coverage_threshold: 80
```

---

## Benefits of Migration

| Aspect | Cursor Rules | ProAgents |
|--------|--------------|-----------|
| Structure | Single file | Organized directories |
| Versioning | Manual | Automatic tracking |
| IDE Support | Cursor only | Multiple IDEs |
| Workflow | Instructions only | Full development workflow |
| Enforcement | AI honor system | Automated validation |
| Collaboration | Copy/paste | Shared configuration |

---

## Keeping Both Systems

You can use ProAgents while keeping Cursor rules:

```yaml
# proagents.config.yaml
ide:
  cursor:
    enabled: true
    auto_generate: true
    sync_on_change: true
```

This automatically updates `.cursorrules` when ProAgents config changes.

---

## Troubleshooting

### Migration Warnings

```bash
# View migration warnings
proagents migrate --from cursor-rules --verbose
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Rules not enforced | Enable `enforce: true` in config |
| IDE not updating | Run `proagents ide sync cursor` |
| Missing patterns | Run `proagents analyze` first |

---

## Rollback

If you need to revert:

```bash
# Restore original .cursorrules
git checkout .cursorrules

# Remove ProAgents config
rm -rf ./proagents
```
