# Windsurf Rules Configuration

Configure Windsurf IDE (Codeium) to work with ProAgents workflow.

---

## Overview

Windsurf uses a `.windsurfrules` file in the project root to guide its Cascade AI assistant.

---

## Quick Setup

```bash
# Generate Windsurf rules from ProAgents config
proagents ide generate windsurf

# This creates .windsurfrules in your project root
```

---

## Complete .windsurfrules Template

Create `.windsurfrules` in your project root:

```markdown
# ProAgents Development Workflow for Windsurf

You are Cascade, integrated with the ProAgents development workflow. Follow these guidelines for all development tasks.

## Workflow Recognition

Recognize and respond to these workflow commands:

| Command | Action |
|---------|--------|
| `pa:init` | Initialize ProAgents workflow |
| `pa:feature <name>` | Start new feature development |
| `pa:fix <desc>` | Quick bug fix workflow |
| `pa:doc` | Generate documentation |
| `pa:test` | Run test suite |
| `pa:qa` | Quality checks |
| `pa:deploy` | Deployment preparation |

## Cascade Flow Integration

When using Cascade Flows:

### Feature Flow
1. Analyze existing codebase
2. Gather requirements
3. Design solution
4. Plan implementation
5. Generate code
6. Create tests
7. Review output

### Fix Flow
1. Identify bug location
2. Analyze root cause
3. Implement fix
4. Verify with tests
5. Document change

## Code Generation Rules

### Always
- Follow existing project patterns
- Use TypeScript with strict mode
- Add proper type annotations
- Include error handling
- Write accompanying tests

### Never
- Skip type definitions
- Ignore existing conventions
- Create duplicate utilities
- Leave TODO comments without context

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── services/       # Business logic
├── utils/          # Utilities
├── types/          # TypeScript types
└── __tests__/      # Test files
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with use | `useAuth.ts` |
| Utils | kebab-case | `string-helpers.ts` |
| Types | PascalCase | `UserTypes.ts` |
| Constants | UPPER_SNAKE | `API_ENDPOINTS.ts` |

## Code Patterns

### Component Pattern
```typescript
interface ComponentProps {
  // Props definition
}

export function Component({ prop }: ComponentProps) {
  // Implementation
}
```

### Hook Pattern
```typescript
export function useCustomHook(param: Type) {
  // Hook logic
  return { data, loading, error };
}
```

### Service Pattern
```typescript
class ServiceName {
  async method(input: Input): Promise<Output> {
    // Implementation
  }
}
```

## Quality Standards

### Before Completion
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Tests written and passing
- [ ] Error states handled
- [ ] Loading states handled
- [ ] Accessibility considered

### Performance
- Avoid unnecessary re-renders
- Use proper memoization
- Lazy load when appropriate
- Optimize images and assets

## Communication Style

When interacting:
1. Explain approach before implementing
2. Show relevant existing code for context
3. Highlight any breaking changes
4. Suggest improvements when appropriate
5. Ask for clarification when needed

## Multi-File Changes

When changes span multiple files:
1. List all affected files first
2. Explain the relationship between changes
3. Implement in dependency order
4. Provide a summary of all changes

## Context Awareness

Always consider:
- Current file location in project
- Related files and dependencies
- Recent changes in conversation
- Project-wide patterns and conventions
```

---

## Windsurf-Specific Features

### Cascade Flows

Configure custom flows in `.windsurfrules`:

```markdown
## Custom Flows

### /refactor Flow
1. Analyze current implementation
2. Identify improvement opportunities
3. Propose refactoring plan
4. Implement changes incrementally
5. Verify no regressions
6. Update tests if needed

### /optimize Flow
1. Profile current performance
2. Identify bottlenecks
3. Propose optimizations
4. Implement with benchmarks
5. Verify improvements
```

### Supercomplete Integration

```markdown
## Supercomplete Settings

When providing completions:
- Consider full file context
- Match existing code style
- Include type annotations
- Add JSDoc for public APIs
```

---

## Dynamic Configuration

```yaml
# proagents.config.yaml
ide:
  windsurf:
    enabled: true

    # Flow configurations
    flows:
      feature:
        phases: ["analyze", "design", "implement", "test"]
        checkpoints: ["after_design"]

      fix:
        phases: ["identify", "fix", "verify"]
        fast_track: true

    # Cascade settings
    cascade:
      context_depth: "full"
      include_tests: true
      auto_format: true
```

---

## Project Detection

Windsurf rules can include project-type specific guidance:

### React/Next.js
```markdown
## Framework: Next.js

- Use App Router patterns
- Prefer Server Components
- Use 'use client' only when needed
- Implement proper metadata
- Use next/image for images
```

### Node.js/Express
```markdown
## Framework: Express

- Use async route handlers
- Implement proper middleware order
- Validate all inputs
- Use consistent error responses
- Document with OpenAPI
```

---

## Multi-Root Workspace

For monorepos:

```markdown
## Monorepo Structure

This is a monorepo with multiple packages:

- `/packages/web` - Next.js frontend
- `/packages/api` - Express backend
- `/packages/shared` - Shared utilities

When working in a package:
- Use package-specific patterns
- Import shared code from @shared/
- Run tests in package context
```

---

## Syncing Rules

```bash
# Sync with ProAgents config
proagents ide sync windsurf

# Include detected patterns
proagents ide generate windsurf --include-patterns

# Validate rules
proagents ide validate windsurf
```

---

## Best Practices

1. **Keep Flows Focused**: Each flow should have a clear purpose
2. **Context Matters**: Include project-specific context
3. **Update Regularly**: Sync when patterns evolve
4. **Test Flows**: Verify flows work as expected
5. **Team Consistency**: Share rules across the team
