# GitHub Copilot Configuration

Configure GitHub Copilot to work with ProAgents workflow.

---

## Overview

GitHub Copilot uses instructions files and workspace settings to customize AI behavior.

---

## Quick Setup

```bash
# Generate Copilot instructions
proagents ide generate copilot

# Creates .github/copilot-instructions.md
```

---

## Instructions File

Create `.github/copilot-instructions.md`:

```markdown
# GitHub Copilot Instructions

## Project Overview

This project uses the ProAgents development workflow. Follow these guidelines when providing suggestions and completions.

## Code Style

### TypeScript
- Use strict TypeScript with no implicit any
- Prefer interfaces over types for objects
- Use const assertions for literals
- Always provide return types for functions

### Naming
- Components: PascalCase (UserProfile)
- Functions: camelCase (getUserData)
- Constants: UPPER_SNAKE_CASE (MAX_RETRIES)
- Files: Match export name

### Imports
```typescript
// Order: React → External → Internal → Types → Styles
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import type { User } from '@/types';
import styles from './Component.module.css';
```

## Patterns to Follow

### React Components
```typescript
interface Props {
  title: string;
  onAction?: () => void;
}

export function Component({ title, onAction }: Props) {
  return (
    <div className="container">
      <h1>{title}</h1>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

### Custom Hooks
```typescript
export function useData<T>(key: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Implementation...

  return { data, loading, error };
}
```

### API Calls
```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  if (!response.ok) {
    throw new ApiError('Failed to fetch user', response.status);
  }
  return response.data;
}
```

## Error Handling

Always include error handling:
```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new OperationError('Failed to complete operation', { cause: error });
}
```

## Testing

Generate tests that:
- Cover happy path and edge cases
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

```typescript
describe('UserService', () => {
  describe('getUser', () => {
    it('should return user when found', async () => {
      // Arrange
      const mockUser = createMockUser();
      mockRepo.findById.mockResolvedValue(mockUser);

      // Act
      const result = await service.getUser('123');

      // Assert
      expect(result).toEqual(mockUser);
    });
  });
});
```

## Documentation

Include JSDoc for public APIs:
```typescript
/**
 * Fetches user data by ID
 * @param id - The user's unique identifier
 * @returns The user object or null if not found
 * @throws {ApiError} When the API request fails
 */
async function getUser(id: string): Promise<User | null> {
  // Implementation
}
```

## Security

- Never hardcode secrets or credentials
- Validate and sanitize all inputs
- Use parameterized queries
- Escape user content in HTML

## Accessibility

Include accessibility attributes:
```typescript
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  onClick={handleClick}
>
  <CloseIcon aria-hidden="true" />
</button>
```

## Performance

- Use React.memo for expensive components
- Implement proper dependency arrays
- Avoid inline object/function creation in renders
- Use proper loading states
```

---

## VS Code Settings

Configure Copilot behavior in `.vscode/settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "yaml": true
  },

  "github.copilot.advanced": {
    "inlineSuggestCount": 3,
    "listCount": 10
  },

  "editor.inlineSuggest.enabled": true,

  "github.copilot.chat.localeOverride": "en",

  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

---

## Copilot Chat Custom Instructions

For Copilot Chat, create `.github/copilot-chat-instructions.md`:

```markdown
# Copilot Chat Instructions

## Role
You are a senior developer helping with the ProAgents workflow.

## Response Style
- Be concise but thorough
- Show code examples when helpful
- Explain trade-offs of different approaches
- Reference existing project patterns

## Commands

Respond to these custom commands:

### pa:feature
Start a new feature workflow:
1. Ask about the feature requirements
2. Analyze affected areas
3. Propose implementation plan
4. Guide through implementation

### pa:fix
Quick bug fix workflow:
1. Help identify the bug
2. Suggest fix approach
3. Generate fix code
4. Suggest test cases

### pa:review
Code review assistance:
1. Check for common issues
2. Verify patterns are followed
3. Suggest improvements
4. Check test coverage

## When Answering

1. First check existing codebase for patterns
2. Follow established conventions
3. Consider edge cases
4. Include error handling
5. Suggest tests when relevant
```

---

## Workspace Configuration

For multi-root workspaces, create `.code-workspace`:

```json
{
  "folders": [
    { "path": "packages/web" },
    { "path": "packages/api" },
    { "path": "packages/shared" }
  ],
  "settings": {
    "github.copilot.enable": {
      "*": true
    }
  }
}
```

---

## Context Files

Create context files that Copilot can reference:

### `.github/copilot-context/architecture.md`
```markdown
# Architecture Overview

## Stack
- Frontend: Next.js 14, React 18, TypeScript
- Backend: Node.js, Express, PostgreSQL
- Styling: Tailwind CSS
- State: Zustand + React Query

## Key Patterns
- Feature-based folder structure
- Repository pattern for data access
- Custom hooks for business logic
```

### `.github/copilot-context/api-patterns.md`
```markdown
# API Patterns

## Endpoint Structure
- GET /api/resource - List
- GET /api/resource/:id - Get one
- POST /api/resource - Create
- PUT /api/resource/:id - Update
- DELETE /api/resource/:id - Delete

## Response Format
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}
```

---

## ProAgents Integration

```yaml
# proagents.config.yaml
ide:
  copilot:
    enabled: true

    # Instructions location
    instructions_path: ".github/copilot-instructions.md"
    chat_instructions_path: ".github/copilot-chat-instructions.md"

    # Context files to generate
    context_files:
      - architecture
      - api-patterns
      - component-patterns

    # Include in instructions
    include:
      - code_standards
      - naming_conventions
      - patterns
      - testing_guidelines
```

---

## Syncing Instructions

```bash
# Generate instructions from ProAgents config
proagents ide generate copilot

# Include detected patterns
proagents ide generate copilot --include-patterns

# Update after config changes
proagents ide sync copilot
```

---

## Best Practices

1. **Keep Instructions Focused**: Don't overload with too many rules
2. **Use Context Files**: Separate concerns into different files
3. **Update Regularly**: Sync when project evolves
4. **Version Control**: Commit all instruction files
5. **Team Alignment**: Ensure team uses consistent instructions
