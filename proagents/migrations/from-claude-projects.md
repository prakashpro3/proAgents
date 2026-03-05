# Migrating from Claude Projects

Convert your Claude Project instructions to ProAgents configuration.

---

## Overview

Claude Projects use custom instructions to guide AI behavior. ProAgents provides:

- Structured configuration instead of free-form text
- Workflow automation beyond just instructions
- Cross-platform compatibility
- Version control integration

---

## Automated Migration

```bash
# Export Claude Project instructions first (manual step)
# Then migrate from the exported file

proagents migrate --from claude-project --source ./claude-instructions.md
```

---

## Manual Migration

### Step 1: Export Claude Instructions

From your Claude Project, copy:
1. Project instructions
2. Knowledge base documents
3. Custom conversation starters

### Step 2: Categorize Content

Separate your instructions into:

| Category | ProAgents Location |
|----------|-------------------|
| Project overview | `README.md` |
| Coding standards | `standards/*.md` |
| Architecture rules | `standards/architecture-rules.md` |
| Workflow instructions | `prompts/*.md` |
| Custom commands | `slash-commands.json` |
| Reference docs | `docs/` |

### Step 3: Convert Instructions to Standards

**From Claude Project:**
```
## Project Overview
This is a React application using TypeScript.

## Coding Guidelines
- Always use TypeScript
- Use functional components
- Follow existing patterns in the codebase
- Add proper error handling
- Write tests for new features

## Patterns
- State: Zustand
- Styling: Tailwind CSS
- Forms: React Hook Form
- API: React Query
```

**To ProAgents:**

**`proagents/README.md`:**
```markdown
# Project Name

React TypeScript application.

## Quick Start
proagents init
proagents feature start "Feature name"

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Zustand
```

**`proagents/standards/coding-standards.md`:**
```markdown
# Coding Standards

## TypeScript
- Strict mode required
- No any types
- Explicit return types

## React
- Functional components only
- Props interface required
- Use memo for expensive renders
```

**`proagents/standards/architecture-patterns.md`:**
```markdown
# Architecture Patterns

## State Management
- **Global State**: Zustand stores in `/stores`
- **Form State**: React Hook Form
- **Server State**: React Query

## Styling
- Tailwind CSS utility classes
- Custom components in `/components/ui`

## Data Fetching
- React Query for server state
- Custom hooks in `/hooks/api`
```

### Step 4: Convert Workflow Instructions

**From Claude Project:**
```
## When building new features:
1. First understand what exists
2. Plan the implementation
3. Write the code
4. Add tests
5. Update documentation
```

**To ProAgents Prompts:**

**`proagents/prompts/05-implementation.md`:**
```markdown
# Implementation Phase

## Before Coding
1. Review existing codebase patterns
2. Check for similar implementations
3. Understand data flow

## During Implementation
1. Follow project patterns
2. Add TypeScript types
3. Handle errors properly
4. Keep functions focused

## After Coding
1. Self-review the code
2. Write unit tests
3. Update documentation
```

### Step 5: Convert Knowledge Base

Move Claude Project documents to ProAgents:

```
proagents/
├── docs/
│   ├── api-reference.md
│   ├── database-schema.md
│   └── deployment.md
```

### Step 6: Create Configuration

**`proagents/proagents.config.yaml`:**
```yaml
project:
  name: "My React App"
  type: "web-frontend"

standards:
  path: "./proagents/standards"

checkpoints:
  after_analysis: true
  after_design: false
  before_deployment: true

learning:
  enabled: true
  track_patterns: true
```

---

## Feature Comparison

| Feature | Claude Projects | ProAgents |
|---------|-----------------|-----------|
| Instructions | Free-form text | Structured YAML/Markdown |
| Knowledge Base | File uploads | Version-controlled docs |
| Workflow | Manual prompting | Automated phases |
| IDE Integration | Copy/paste | Native integration |
| Collaboration | Per-user projects | Shared repository config |
| Versioning | None | Git-tracked |
| Offline | No | Yes |

---

## Mapping Reference

### Instruction Sections

| Claude Section | ProAgents File |
|----------------|----------------|
| Project Overview | `README.md` |
| How to Respond | `proagents.config.yaml` (communication settings) |
| Coding Style | `standards/coding-standards.md` |
| Architecture | `standards/architecture-patterns.md` |
| Testing | `standards/testing-standards.md` |
| Error Handling | `patterns/error-types.md` |

### Conversation Starters

**From Claude:**
```
- Help me build a new feature
- Review this code
- Debug this issue
- Write tests for this
```

**To ProAgents Slash Commands:**

**`proagents/slash-commands.json`:**
```json
{
  "commands": [
    {
      "name": "/feature",
      "description": "Start new feature development",
      "prompt": "Start a new feature workflow"
    },
    {
      "name": "/review",
      "description": "Code review assistance",
      "prompt": "Review the current code changes"
    },
    {
      "name": "/debug",
      "description": "Debug an issue",
      "prompt": "Help debug the following issue"
    },
    {
      "name": "/test",
      "description": "Generate tests",
      "prompt": "Generate tests for the current code"
    }
  ]
}
```

---

## Using Claude with ProAgents

You can still use Claude AI while benefiting from ProAgents:

### Option 1: MCP Integration

```json
// Claude Desktop config
{
  "mcpServers": {
    "proagents": {
      "command": "npx",
      "args": ["-y", "@proagents/mcp-server"]
    }
  }
}
```

### Option 2: Import Standards

Copy ProAgents standards into Claude Project instructions:

```bash
# Generate Claude-compatible instructions
proagents export --format claude-project > claude-instructions.md
```

---

## Migration Checklist

- [ ] Export Claude Project instructions
- [ ] Create ProAgents structure
- [ ] Migrate coding standards
- [ ] Migrate architecture patterns
- [ ] Set up workflow prompts
- [ ] Configure slash commands
- [ ] Test with a small feature
- [ ] Set up MCP integration (optional)

---

## Benefits of Migration

1. **Version Control**: Track changes to instructions over time
2. **Team Sharing**: Single source of truth for the team
3. **IDE Integration**: Works with Cursor, VS Code, JetBrains
4. **Workflow Automation**: More than just instructions
5. **Validation**: Automated enforcement of standards
6. **Offline Access**: Works without internet
