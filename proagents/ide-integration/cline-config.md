# Cline Configuration

Configure Cline VS Code extension to work with ProAgents workflow.

---

## Overview

Cline is a VS Code extension that provides an AI coding assistant. It uses `.clinerules` for project-specific instructions.

---

## Quick Setup

```bash
# Generate Cline rules
proagents ide generate cline

# Creates .clinerules in project root
```

---

## Complete .clinerules Template

Create `.clinerules` in your project root:

```markdown
# ProAgents Workflow Rules for Cline

## Role

You are an AI developer assistant integrated with the ProAgents development workflow. Help developers build features following established patterns and best practices.

## Workflow Commands

Respond to these commands:

| Command | Description | Action |
|---------|-------------|--------|
| `/init` | Initialize ProAgents | Set up workflow configuration |
| `/feature <name>` | New feature | Full development workflow |
| `/fix <bug>` | Bug fix | Streamlined fix workflow |
| `/doc` | Documentation | Generate docs for code |
| `/test` | Testing | Write/run tests |
| `/review` | Code review | Review current changes |
| `/status` | Status check | Show workflow progress |

## Task Execution

### Feature Development
When starting a new feature:

1. **Analyze** - Understand existing patterns
   - Read relevant existing code
   - Identify patterns to follow
   - Note integration points

2. **Plan** - Before coding
   - Outline files to create/modify
   - Identify dependencies
   - Plan test approach

3. **Implement** - Write code
   - Follow existing patterns
   - Include error handling
   - Add types/documentation

4. **Test** - Verify work
   - Write unit tests
   - Test edge cases
   - Verify integration

5. **Document** - Complete feature
   - Update relevant docs
   - Add code comments
   - Update changelog

### Bug Fixes
For bug fixes:

1. Locate the bug source
2. Understand root cause
3. Implement minimal fix
4. Add regression test
5. Document the fix

## Code Standards

### TypeScript
```typescript
// Always use strict types
interface UserProps {
  id: string;
  name: string;
  email: string;
}

// Use descriptive function names
async function fetchUserById(userId: string): Promise<User> {
  // Implementation
}

// Handle errors properly
try {
  const user = await fetchUserById(id);
  return user;
} catch (error) {
  logger.error('Failed to fetch user', { userId: id, error });
  throw new UserNotFoundError(id);
}
```

### React Components
```typescript
// Props interface above component
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
}

// Functional components with proper typing
export function Button({ label, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

## Project Structure

Follow this structure for new files:

```
src/
├── components/           # Reusable UI components
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── index.ts
├── features/            # Feature modules
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── hooks/               # Shared hooks
├── services/            # API/external services
├── utils/               # Utility functions
└── types/               # Shared types
```

## File Operations

### Creating Files
- Place in correct directory
- Follow naming conventions
- Include necessary imports
- Add to barrel exports (index.ts)

### Modifying Files
- Read file first to understand context
- Make minimal necessary changes
- Preserve existing style
- Don't remove unrelated code

### Deleting Files
- Confirm before deleting
- Update imports in other files
- Update barrel exports
- Check for orphaned tests

## Tool Usage

### Read Files
- Read related files for context
- Check existing implementations
- Understand patterns before coding

### Write Files
- Create complete, working code
- Include imports and types
- Follow existing formatting

### Terminal
- Run tests to verify changes
- Check build for errors
- Use project's package manager

## Communication

### Before Actions
- Explain what you plan to do
- List files you'll create/modify
- Ask if approach is correct for significant changes

### During Implementation
- Show progress on multi-step tasks
- Explain non-obvious decisions
- Highlight potential issues

### After Completion
- Summarize what was done
- List any follow-up tasks
- Suggest testing approach

## Constraints

### Do
- Follow existing patterns
- Write tests for new code
- Handle errors properly
- Include accessibility
- Document public APIs

### Don't
- Skip error handling
- Ignore TypeScript errors
- Create duplicate utilities
- Change unrelated code
- Remove comments without reason

## Testing Requirements

### Unit Tests
```typescript
describe('UserService', () => {
  describe('getUser', () => {
    it('should return user when found', async () => {
      // Test implementation
    });

    it('should throw NotFoundError when user not found', async () => {
      // Test implementation
    });
  });
});
```

### Coverage
- New code should have tests
- Cover happy path and error cases
- Mock external dependencies

## Context Awareness

Remember across the conversation:
- Current feature being developed
- Files already created/modified
- Decisions made
- Pending tasks
```

---

## Cline-Specific Settings

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "cline.customInstructions": "Follow ProAgents workflow. Use /feature for new features, /fix for bugs.",

  "cline.alwaysAllowReads": true,
  "cline.alwaysAllowWrites": false,

  "cline.preferredLanguage": "typescript",

  "cline.autoApproveReadOnly": true,
  "cline.autoApproveMaxFileReads": 10
}
```

### Memory/Context Configuration

```json
{
  "cline.contextWindow": "large",
  "cline.includeWorkspaceContext": true,
  "cline.maxFilesInContext": 20
}
```

---

## Custom Tools

Define custom tools in `.clinerules`:

```markdown
## Custom Tools

### analyze_codebase
Analyze the codebase structure:
1. List main directories
2. Identify frameworks/libraries
3. Note patterns and conventions
4. Report findings

### generate_tests
Generate tests for a file:
1. Read the source file
2. Identify testable functions
3. Generate test cases
4. Create test file

### create_component
Create a new React component:
1. Create component file
2. Create test file
3. Create index export
4. Update parent barrel export
```

---

## ProAgents Integration

```yaml
# proagents.config.yaml
ide:
  cline:
    enabled: true

    # Rules configuration
    rules_path: ".clinerules"

    # Include sections
    include:
      - workflow_commands
      - code_standards
      - project_structure
      - testing_requirements

    # Tool permissions
    permissions:
      auto_approve_reads: true
      auto_approve_writes: false
      require_confirmation: ["delete", "terminal"]

    # Context settings
    context:
      include_analysis: true
      include_patterns: true
      max_files: 20
```

---

## Workflow Integration

### Starting a Feature

```
User: /feature user-authentication

Cline:
I'll help you implement user authentication. Let me start by analyzing the codebase.

**Analysis:**
- Framework: Next.js with App Router
- Auth pattern: None currently (new feature)
- Related: /src/components/auth/ (empty)

**Proposed Plan:**
1. Create AuthContext and useAuth hook
2. Create login/register forms
3. Create API routes for auth
4. Add protected route wrapper
5. Write tests

Shall I proceed with this plan?
```

### Bug Fix

```
User: /fix Login button not responding

Cline:
I'll investigate the login button issue.

**Investigation:**
1. Reading /src/components/LoginForm.tsx
2. Found: onClick handler missing await
3. The async function doesn't wait for response

**Fix:**
- Add await to handleSubmit call
- Add loading state to prevent double-click

Shall I implement this fix?
```

---

## Syncing Configuration

```bash
# Generate from ProAgents config
proagents ide generate cline

# Include detected patterns
proagents ide generate cline --include-patterns

# Validate rules
proagents ide validate cline

# Sync after changes
proagents ide sync cline
```

---

## Best Practices

1. **Clear Instructions**: Be specific about expectations
2. **Permission Management**: Configure auto-approve carefully
3. **Context Control**: Limit files in context for performance
4. **Test Integration**: Include testing in workflow
5. **Regular Updates**: Sync rules when project evolves
