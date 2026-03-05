# IDE Integration

Configure AI-powered IDEs to work with ProAgents workflow.

---

## Supported IDEs

| IDE | Configuration File | AI Backend |
|-----|-------------------|------------|
| [Cursor](./cursor-rules.md) | `.cursorrules` | Claude/GPT |
| [Windsurf](./windsurf-rules.md) | `.windsurfrules` | Cascade |
| [GitHub Copilot](./github-copilot.md) | `.github/copilot-instructions.md` | GPT-4 |
| [Cline](./cline-config.md) | `.clinerules` | Claude/GPT |
| [Continue](./continue-config.md) | `.continuerc.json` | Various |

---

## Quick Setup

### Generate Rules for Your IDE

```bash
# Generate Cursor rules
proagents ide generate cursor

# Generate Windsurf rules
proagents ide generate windsurf

# Generate all IDE rules
proagents ide generate all
```

### Manual Setup

Copy the appropriate rules file to your project root:

```bash
# Cursor
cp /path/to/proagents/ide-integration/.cursorrules ./.cursorrules

# Windsurf
cp /path/to/proagents/ide-integration/.windsurfrules ./.windsurfrules
```

---

## What IDE Rules Do

IDE rules configure the AI assistant to:

1. **Follow ProAgents Workflow**: Use the correct phases and checkpoints
2. **Match Project Patterns**: Follow detected code conventions
3. **Use Commands**: Recognize `pa:feature`, `pa:fix`, `pa:doc` commands
4. **Maintain Context**: Keep track of current feature and phase
5. **Apply Standards**: Enforce project-specific coding standards

---

## Configuration

```yaml
# proagents.config.yaml
ide:
  # Auto-generate rules on init
  auto_generate: true

  # Target IDEs
  targets:
    - cursor
    - windsurf
    - copilot

  # Include project-specific patterns
  include_patterns: true

  # Include learned preferences
  include_learning: true

  # Update frequency
  auto_update: "on_config_change"
```

---

## Rule Synchronization

Keep IDE rules in sync with ProAgents config:

```bash
# Sync all IDE rules with current config
proagents ide sync

# Watch for changes and auto-sync
proagents ide watch
```

---

## Custom Rules

Add project-specific rules:

```yaml
# proagents.config.yaml
ide:
  custom_rules:
    - "Always use TypeScript strict mode"
    - "Prefer functional components over class components"
    - "Use Tailwind CSS for styling"
    - "Follow the existing error handling patterns in src/utils/errors.ts"
```

These are automatically included in generated IDE rules.

---

## Documentation

- [Cursor Rules](./cursor-rules.md) - Configuration for Cursor IDE
- [Windsurf Rules](./windsurf-rules.md) - Configuration for Windsurf IDE
- [GitHub Copilot](./github-copilot.md) - Configuration for GitHub Copilot
- [Cline Config](./cline-config.md) - Configuration for Cline extension
- [Continue Config](./continue-config.md) - Configuration for Continue extension
