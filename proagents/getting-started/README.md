# Getting Started with ProAgents

Quick start guides for setting up ProAgents features.

---

## Quick Start (5 Minutes)

### 1. Initialize ProAgents

```bash
# In your project directory
/init
```

This creates the `.proagents/` directory with default configuration.

### 2. Configure Your Project

Edit `proagents.config.yaml`:

```yaml
project:
  name: "My Project"
  type: "fullstack"  # web-frontend | fullstack | mobile | backend

checkpoints:
  after_analysis: true
  after_design: true
  before_deployment: true
```

### 3. Start Your First Feature

```bash
/feature-start "Add user authentication"
```

That's it! ProAgents will guide you through the workflow.

---

## Feature-Specific Guides

| Guide | Description |
|-------|-------------|
| [MCP Integration](./mcp-setup.md) | Set up Model Context Protocol |
| [PM Tool Integration](./pm-integration.md) | Connect Jira, Linear, etc. |
| [AI Training Setup](./ai-training-setup.md) | Configure learning system |
| [IDE Setup](./ide-setup.md) | Configure your IDE |
| [Team Onboarding](./team-onboarding.md) | Onboard your team |

---

## Next Steps

1. **Explore Commands**: Run `/help` to see all available commands
2. **Customize Standards**: Set up [coding standards](../standards/)
3. **Configure Rules**: Add [validation rules](../rules/)
4. **Set Up Integrations**: Connect your [tools](../integrations/)
