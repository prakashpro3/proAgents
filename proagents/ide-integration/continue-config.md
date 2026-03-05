# Continue Configuration

Configure Continue extension to work with ProAgents workflow.

---

## Overview

Continue is an open-source AI code assistant that works with VS Code and JetBrains IDEs. It supports multiple AI providers and custom configurations.

---

## Quick Setup

```bash
# Generate Continue configuration
proagents ide generate continue

# Creates .continuerc.json in project root
```

---

## Configuration File

Create `.continuerc.json` in your project root:

```json
{
  "name": "ProAgents Workflow",
  "version": "1.0.0",

  "models": [
    {
      "title": "Claude 3.5 Sonnet",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "apiKey": "${ANTHROPIC_API_KEY}"
    },
    {
      "title": "GPT-4o",
      "provider": "openai",
      "model": "gpt-4o",
      "apiKey": "${OPENAI_API_KEY}"
    }
  ],

  "tabAutocompleteModel": {
    "title": "Codestral",
    "provider": "mistral",
    "model": "codestral-latest"
  },

  "customCommands": [
    {
      "name": "feature",
      "description": "Start a new feature with ProAgents workflow",
      "prompt": "I want to implement a new feature: {{{ input }}}. Follow the ProAgents workflow:\n1. First, analyze existing patterns in the codebase\n2. Propose an implementation plan\n3. Get confirmation before coding\n4. Implement with tests\n5. Document the feature"
    },
    {
      "name": "fix",
      "description": "Fix a bug using ProAgents workflow",
      "prompt": "Help me fix this bug: {{{ input }}}. Follow the ProAgents bug fix workflow:\n1. Identify the bug location\n2. Analyze the root cause\n3. Propose a minimal fix\n4. Add a regression test"
    },
    {
      "name": "doc",
      "description": "Generate documentation",
      "prompt": "Generate documentation for {{{ input }}}. Include:\n- Overview\n- API reference\n- Usage examples\n- Error handling"
    },
    {
      "name": "test",
      "description": "Generate tests",
      "prompt": "Generate comprehensive tests for {{{ input }}}. Include:\n- Unit tests for all functions\n- Edge cases\n- Error scenarios\n- Integration tests if applicable"
    },
    {
      "name": "review",
      "description": "Code review",
      "prompt": "Review this code following ProAgents quality standards:\n- Code correctness\n- Pattern compliance\n- Error handling\n- Performance\n- Security\n- Accessibility\n\n{{{ input }}}"
    }
  ],

  "slashCommands": [
    {
      "name": "proagents",
      "description": "ProAgents workflow commands",
      "steps": [
        {
          "type": "prompt",
          "prompt": "You are integrated with ProAgents workflow. Available commands:\n- pa:feature <name> - Start new feature\n- pa:fix <bug> - Fix a bug\n- pa:doc - Generate documentation\n- pa:test - Generate tests\n- pa:review - Code review\n\nUser request: {{{ input }}}"
        }
      ]
    }
  ],

  "contextProviders": [
    {
      "name": "proagents-context",
      "params": {
        "configPath": "./proagents/proagents.config.yaml",
        "includePatterns": true,
        "includeStandards": true
      }
    },
    {
      "name": "codebase",
      "params": {
        "nRetrieve": 25,
        "nFinal": 10,
        "useReranking": true
      }
    },
    {
      "name": "folder",
      "params": {}
    },
    {
      "name": "diff",
      "params": {}
    }
  ],

  "systemMessage": "You are an AI assistant integrated with the ProAgents development workflow. Follow these principles:\n\n1. **Analyze First**: Always understand existing patterns before suggesting code\n2. **Follow Conventions**: Match the project's coding standards\n3. **Quality Focus**: Include error handling, tests, and documentation\n4. **Explain Reasoning**: Describe your approach before implementing\n5. **Minimal Changes**: Make only necessary modifications\n\nProject Standards:\n- TypeScript with strict mode\n- Functional React components\n- Tailwind CSS for styling\n- Jest for testing\n- Follow existing patterns in the codebase"
}
```

---

## Custom Context Providers

### ProAgents Context Provider

Create `.continue/proagents-context.ts`:

```typescript
import { ContextProvider, ContextItem } from "@continuedev/core";
import * as fs from "fs";
import * as path from "path";

export class ProAgentsContextProvider implements ContextProvider {
  name = "proagents-context";
  description = "Provides ProAgents workflow context";

  async getContextItems(query: string): Promise<ContextItem[]> {
    const items: ContextItem[] = [];
    const projectRoot = process.cwd();

    // Load ProAgents config
    const configPath = path.join(projectRoot, "proagents/proagents.config.yaml");
    if (fs.existsSync(configPath)) {
      items.push({
        name: "ProAgents Configuration",
        description: "Project workflow configuration",
        content: fs.readFileSync(configPath, "utf-8"),
      });
    }

    // Load active feature status
    const featuresPath = path.join(projectRoot, "proagents/active-features");
    if (fs.existsSync(featuresPath)) {
      const features = fs.readdirSync(featuresPath);
      for (const feature of features) {
        const statusPath = path.join(featuresPath, feature, "status.json");
        if (fs.existsSync(statusPath)) {
          items.push({
            name: `Feature: ${feature}`,
            description: "Active feature status",
            content: fs.readFileSync(statusPath, "utf-8"),
          });
        }
      }
    }

    // Load coding standards
    const standardsPath = path.join(projectRoot, "proagents/standards");
    if (fs.existsSync(standardsPath)) {
      const standards = fs.readdirSync(standardsPath).filter(f => f.endsWith('.md'));
      for (const standard of standards.slice(0, 3)) {
        items.push({
          name: `Standard: ${standard}`,
          description: "Coding standard",
          content: fs.readFileSync(path.join(standardsPath, standard), "utf-8"),
        });
      }
    }

    return items;
  }
}
```

---

## Workflow Prompts

### Feature Development Prompt

```json
{
  "name": "proagents-feature",
  "description": "Complete feature development workflow",
  "steps": [
    {
      "type": "context",
      "query": "Find existing patterns related to: {{{ input }}}"
    },
    {
      "type": "prompt",
      "prompt": "Based on the existing codebase patterns, create an implementation plan for: {{{ input }}}\n\nInclude:\n1. Files to create/modify\n2. Key components/functions\n3. Integration points\n4. Testing approach"
    },
    {
      "type": "prompt",
      "prompt": "Now implement the feature following the plan. Create complete, working code with proper error handling and types."
    },
    {
      "type": "prompt",
      "prompt": "Generate comprehensive tests for the implementation."
    }
  ]
}
```

### Code Review Prompt

```json
{
  "name": "proagents-review",
  "description": "Comprehensive code review",
  "steps": [
    {
      "type": "context",
      "query": "Get project coding standards"
    },
    {
      "type": "prompt",
      "prompt": "Review the following code against ProAgents quality standards:\n\n## Checklist\n- [ ] Follows project patterns\n- [ ] Proper TypeScript types\n- [ ] Error handling\n- [ ] Performance considerations\n- [ ] Security (no vulnerabilities)\n- [ ] Accessibility\n- [ ] Test coverage\n\n## Code to Review\n{{{ input }}}\n\nProvide detailed feedback with specific suggestions."
    }
  ]
}
```

---

## Model Configuration

### For Different Tasks

```json
{
  "models": [
    {
      "title": "Claude (Code Analysis)",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "roles": ["chat", "edit"]
    },
    {
      "title": "GPT-4 (Documentation)",
      "provider": "openai",
      "model": "gpt-4o",
      "roles": ["chat"]
    },
    {
      "title": "Codestral (Autocomplete)",
      "provider": "mistral",
      "model": "codestral-latest",
      "roles": ["autocomplete"]
    }
  ],

  "modelRoles": {
    "default": "Claude (Code Analysis)",
    "summarize": "Claude (Code Analysis)",
    "edit": "Claude (Code Analysis)",
    "chat": "Claude (Code Analysis)"
  }
}
```

### Local Models

```json
{
  "models": [
    {
      "title": "Ollama CodeLlama",
      "provider": "ollama",
      "model": "codellama:13b"
    },
    {
      "title": "Ollama Deepseek",
      "provider": "ollama",
      "model": "deepseek-coder:6.7b"
    }
  ]
}
```

---

## ProAgents Integration

```yaml
# proagents.config.yaml
ide:
  continue:
    enabled: true

    # Config output
    config_path: ".continuerc.json"

    # Custom commands to generate
    commands:
      - feature
      - fix
      - doc
      - test
      - review
      - refactor

    # Context providers
    context:
      include_config: true
      include_features: true
      include_standards: true
      include_patterns: true

    # Model preferences
    models:
      chat: "anthropic/claude-3-5-sonnet"
      autocomplete: "mistral/codestral"

    # System message customization
    include_in_system:
      - project_overview
      - coding_standards
      - patterns
```

---

## Syncing Configuration

```bash
# Generate Continue config
proagents ide generate continue

# Include all context
proagents ide generate continue --full

# Sync after changes
proagents ide sync continue

# Validate configuration
proagents ide validate continue
```

---

## VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "continue.enableTabAutocomplete": true,
  "continue.showInlineTip": true,
  "continue.remoteConfigServerUrl": null,
  "continue.customConfigPath": ".continuerc.json"
}
```

---

## Best Practices

1. **Model Selection**: Use appropriate models for different tasks
2. **Context Management**: Configure context providers for relevant information
3. **Custom Commands**: Create commands for common workflows
4. **System Message**: Keep it concise but comprehensive
5. **Regular Updates**: Sync config when project evolves
