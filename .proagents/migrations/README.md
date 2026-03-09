# Migration Guides

Migrate from other tools and workflows to ProAgents.

---

## Available Migrations

| From | Guide | Difficulty |
|------|-------|------------|
| Cursor Rules | [cursor-rules.md](./from-cursor-rules.md) | Easy |
| Claude Projects | [claude-projects.md](./from-claude-projects.md) | Easy |
| GitHub Copilot | [github-copilot.md](./from-github-copilot.md) | Easy |
| Custom Workflows | [custom-workflows.md](./from-custom-workflows.md) | Medium |

---

## Quick Migration

### Automated Migration

```bash
# Detect and migrate from existing setup
proagents migrate --detect

# Migrate from specific tool
proagents migrate --from cursor-rules
proagents migrate --from claude-projects

# Preview migration without applying
proagents migrate --from cursor-rules --dry-run
```

### Manual Migration

1. Install ProAgents
2. Run `proagents init`
3. Import existing configurations
4. Verify and adjust settings

---

## What Gets Migrated

| Source | Migrated To |
|--------|-------------|
| Cursor `.cursorrules` | ProAgents standards + IDE rules |
| Claude Project Instructions | ProAgents prompts + standards |
| Copilot Instructions | ProAgents standards + IDE rules |
| Custom Rules | ProAgents rules engine |
| Code Conventions | ProAgents standards |

---

## Migration Checklist

- [ ] Backup existing configuration
- [ ] Run migration in dry-run mode first
- [ ] Review generated ProAgents config
- [ ] Test with a small feature
- [ ] Update team documentation
- [ ] Remove old configuration (optional)

---

## Getting Help

```bash
# Show migration help
proagents migrate --help

# Validate migration result
proagents validate

# Compare configurations
proagents migrate diff --from cursor-rules
```
