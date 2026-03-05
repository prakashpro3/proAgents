# Cursor Rules Configuration

Configure Cursor IDE to work with ProAgents workflow.

---

## Overview

Cursor uses a `.cursorrules` file in the project root to provide context and instructions to its AI assistant.

---

## Quick Setup

```bash
# Generate Cursor rules from ProAgents config
proagents ide generate cursor

# This creates .cursorrules in your project root
```

---

## Complete .cursorrules Template

Create `.cursorrules` in your project root:

```markdown
# ProAgents Development Workflow

You are an AI assistant integrated with the ProAgents development workflow. Follow these guidelines for all development tasks.

## Workflow Commands

When the user types a slash command, follow the corresponding workflow:

- `pa:init` - Initialize ProAgents in this project
- `/feature <name>` - Start a new feature with full workflow
- `/fix <description>` - Start bug fix workflow
- `pa:doc` - Generate documentation
- `pa:test` - Run tests
- `pa:qa` - Quality assurance checks
- `pa:deploy` - Deployment workflow
- `pa:status` - Show current workflow status

## Development Phases

For new features, follow these phases in order:

1. **Analysis** - Understand existing codebase patterns
2. **Requirements** - Clarify feature requirements
3. **Design** - Plan UI/architecture
4. **Planning** - Create implementation plan
5. **Implementation** - Write code following project patterns
6. **Testing** - Write comprehensive tests
7. **Review** - Self-review against checklist
8. **Documentation** - Document the feature

## Code Standards

### TypeScript/JavaScript
- Use TypeScript strict mode
- Prefer functional components
- Use named exports
- Follow existing naming conventions

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: kebab-case (e.g., `string-utils.ts`)
- Tests: `{name}.test.ts`

### Imports
- Use absolute imports with `@/` prefix
- Order: React → Third-party → Local → Styles

## Project Patterns

### State Management
- Use Zustand for global state
- Use React hooks for local state
- Use React Query for server state

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design

### Error Handling
- Use try-catch for async operations
- Use Error Boundaries for components
- Log errors with proper context

### Testing
- Write unit tests for utilities and hooks
- Write integration tests for components
- Aim for 80% coverage on new code

## Before Writing Code

Always:
1. Check existing patterns in the codebase
2. Look for similar implementations to follow
3. Verify the approach aligns with project architecture
4. Consider edge cases and error handling

## Code Quality Checklist

Before completing any implementation:
- [ ] Code follows project conventions
- [ ] No TypeScript errors
- [ ] Tests written and passing
- [ ] Error handling implemented
- [ ] No hardcoded values
- [ ] Accessible (ARIA labels, keyboard nav)

## Communication

- Explain your reasoning before making changes
- Ask clarifying questions if requirements are unclear
- Suggest alternatives when appropriate
- Warn about potential breaking changes

## File Locations

- Components: `src/components/`
- Pages: `src/pages/` or `src/app/`
- Hooks: `src/hooks/`
- Utils: `src/utils/` or `src/lib/`
- Types: `src/types/`
- Tests: `__tests__/` or colocated with source

## Don't

- Don't create files outside the project structure
- Don't modify configuration files without asking
- Don't remove existing functionality without confirmation
- Don't skip tests for "simple" changes
- Don't use deprecated APIs or patterns
```

---

## Dynamic Rules Generation

ProAgents can generate rules based on your project analysis:

```bash
# Generate with detected patterns
proagents ide generate cursor --include-patterns

# Generate with learned preferences
proagents ide generate cursor --include-learning

# Full generation with everything
proagents ide generate cursor --full
```

---

## Project-Specific Additions

Add to `.cursorrules` based on your project:

### For React Projects
```markdown
## React Patterns

- Use functional components exclusively
- Implement React.memo for expensive renders
- Use useCallback for event handlers passed to children
- Use useMemo for expensive calculations
```

### For Next.js Projects
```markdown
## Next.js Patterns

- Use App Router conventions
- Implement loading.tsx for suspense boundaries
- Use server components by default
- Client components only when needed (use 'use client')
```

### For API Projects
```markdown
## API Patterns

- Use controller → service → repository pattern
- Validate all inputs with Zod/Joi
- Return consistent error responses
- Document endpoints with JSDoc
```

---

## Cursor-Specific Features

### Composer Mode
```markdown
## Composer Guidelines

When using Cursor Composer:
- Create files in correct locations
- Follow import conventions
- Include all necessary dependencies
- Add appropriate tests
```

### Chat Mode
```markdown
## Chat Guidelines

When answering questions:
- Reference specific files when relevant
- Provide code snippets with context
- Explain trade-offs of different approaches
```

---

## Syncing with ProAgents Config

```yaml
# proagents.config.yaml
ide:
  cursor:
    enabled: true

    # Sections to include
    include:
      - workflow_commands
      - code_standards
      - project_patterns
      - checklists

    # Custom additions
    custom_sections:
      - name: "API Guidelines"
        content: |
          - All API calls go through /src/api/
          - Use React Query for data fetching
          - Handle loading and error states
```

---

## Updating Rules

When your project evolves:

```bash
# Regenerate rules after config changes
proagents ide sync cursor

# Diff current rules with generated
proagents ide diff cursor

# Backup and update
proagents ide update cursor --backup
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Rules not loading | Restart Cursor IDE |
| Rules too long | Use `--compact` flag |
| Missing patterns | Run `proagents analyze` first |
| Conflicts with manual rules | Use `include` blocks |

---

## Best Practices

1. **Keep Rules Focused**: Don't overload with too many instructions
2. **Update Regularly**: Sync rules when project patterns change
3. **Test Rules**: Verify AI follows rules correctly
4. **Version Control**: Commit `.cursorrules` with your project
5. **Team Alignment**: Ensure all team members use same rules
