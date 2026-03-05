# Cursor IDE Setup Guide

Configure Cursor for optimal ProAgents development with AI-first workflow.

---

## Overview

Cursor is built for AI-assisted development, making it ideal for ProAgents workflows. This guide covers configuration for maximum productivity.

---

## Initial Setup

### 1. Install Cursor

Download from [cursor.sh](https://cursor.sh)

### 2. Import VS Code Settings

Cursor can import your VS Code configuration:
- `Cmd+Shift+P` → "Cursor: Import VS Code Settings"

### 3. Configure AI Model

Settings → AI → Model:
- **Claude**: Recommended for complex tasks
- **GPT-4**: Alternative option
- **Local models**: For privacy-sensitive work

---

## Cursor-Specific Settings

Access via `Cmd+,` or Settings:

```json
{
  // AI Settings
  "cursor.ai.enableAutoComplete": true,
  "cursor.ai.autoCompleteModel": "claude-3-sonnet",
  "cursor.ai.chatModel": "claude-3-opus",

  // Code Actions
  "cursor.ai.enableInlineEdits": true,
  "cursor.ai.showInlineSuggestions": true,

  // Context
  "cursor.ai.includeProjectContext": true,
  "cursor.ai.maxContextFiles": 10,

  // Privacy
  "cursor.ai.codebaseIndexing": true,
  "cursor.ai.sendCodeToCloud": true  // Set false for sensitive projects
}
```

---

## ProAgents Integration

### Using ProAgents Commands in Cursor

Cursor's AI chat integrates well with ProAgents:

```
# In Cursor Chat (Cmd+L)

"Run /feature start 'Add user authentication'"

"Check the ProAgents workflow status"

"Apply the coding standards from proagents/standards/"
```

### Codebase Context

Cursor indexes your codebase for context. Ensure ProAgents files are indexed:

```json
{
  "cursor.ai.includePaths": [
    "src/**",
    "proagents/**"
  ],
  "cursor.ai.excludePaths": [
    "node_modules/**",
    "dist/**",
    ".next/**"
  ]
}
```

---

## Keyboard Shortcuts

### AI Features

| Shortcut | Action |
|----------|--------|
| `Cmd+L` | Open AI Chat |
| `Cmd+K` | Inline Edit |
| `Cmd+Shift+K` | Edit Selection |
| `Tab` | Accept Suggestion |
| `Esc` | Dismiss Suggestion |
| `Cmd+Shift+L` | Add to Chat Context |

### Standard Editing

| Shortcut | Action |
|----------|--------|
| `Cmd+P` | Quick Open File |
| `Cmd+Shift+P` | Command Palette |
| `Cmd+B` | Toggle Sidebar |
| `Cmd+J` | Toggle Terminal |
| `Cmd+/` | Toggle Comment |

---

## Cursor Rules (.cursorrules)

Create `.cursorrules` in project root:

```
# Project Context
This is a [project type] project using [technologies].

# Coding Standards
- Use TypeScript with strict mode
- Follow functional programming patterns
- Use Tailwind CSS for styling
- Follow the patterns in proagents/standards/

# Testing
- Write tests using Vitest
- Aim for 80% coverage
- Use React Testing Library for components

# Conventions
- Components in src/components/
- Hooks in src/hooks/
- Types in src/types/

# ProAgents
- Follow the workflow in proagents/WORKFLOW.md
- Check proagents/standards/ for coding guidelines
- Use proagents/checklists/ before completing phases
```

---

## AI Chat Prompts for ProAgents

### Starting Features

```
I'm starting a new feature: [description]

Please help me:
1. Analyze the codebase for related code
2. Suggest an implementation approach
3. Identify files that need changes
4. Create the implementation plan

Reference: proagents/prompts/04-planning.md
```

### Code Review

```
Review this code following ProAgents standards:

[paste code]

Check against:
- proagents/standards/coding-standards.md
- proagents/checklists/code-review.md

Provide specific feedback and suggestions.
```

### Debugging

```
I'm encountering this error:

[error message]

Help me debug following proagents/prompts/debugging/systematic.md

1. Analyze the error
2. Identify potential causes
3. Suggest debugging steps
4. Provide fix if possible
```

---

## Composer Mode

Cursor's Composer mode is powerful for multi-file changes:

### Using Composer for Features

1. `Cmd+I` to open Composer
2. Describe the feature
3. Reference ProAgents docs:
   ```
   Implement [feature] following:
   - proagents/standards/react-nextjs.md for code style
   - proagents/prompts/05-implementation.md for approach
   ```
4. Review proposed changes
5. Apply changes

### Best Practices

- Start with clear, specific prompts
- Reference ProAgents standards in prompts
- Review AI suggestions before applying
- Use `@file` to include specific files as context

---

## Workspace Configuration

Create `.cursor/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "cursor.ai.contextFiles": [
    "proagents/standards/*.md",
    "proagents/prompts/*.md",
    "README.md",
    "package.json"
  ],

  "cursor.composer.includePaths": [
    "src/**/*.{ts,tsx}",
    "proagents/**/*.md"
  ]
}
```

---

## Tips for AI-Assisted Development

1. **Be Specific**: Clear prompts get better results
2. **Provide Context**: Reference relevant ProAgents docs
3. **Iterate**: Refine AI suggestions with follow-up prompts
4. **Review**: Always review AI-generated code
5. **Learn**: Use AI explanations to understand code

---

## Troubleshooting

### AI Not Responding
- Check internet connection
- Verify API key in settings
- Try different model

### Context Too Large
- Exclude unnecessary files
- Use specific file references
- Split large requests

### Suggestions Not Relevant
- Improve `.cursorrules`
- Add more context in prompts
- Reference specific ProAgents docs
