# Integrations

Third-party tool integrations for ProAgents.

---

## Overview

ProAgents integrates with various development tools to provide a seamless workflow experience.

---

## Available Integrations

| Category | Tools | Documentation |
|----------|-------|---------------|
| **Project Management** | Jira, Linear, Asana, Trello, Notion | [PM Integrations](./pm/) |
| **Version Control** | GitHub, GitLab | [Config](../config/integrations/) |
| **Communication** | Slack | [Config](../config/integrations/slack.yaml) |

---

## Quick Links

### Configuration Files

All integration configurations are in [`config/integrations/`](../config/integrations/):

| File | Purpose |
|------|---------|
| [github.yaml](../config/integrations/github.yaml) | GitHub integration |
| [jira.yaml](../config/integrations/jira.yaml) | Jira integration |
| [linear.yaml](../config/integrations/linear.yaml) | Linear integration |
| [notion.yaml](../config/integrations/notion.yaml) | Notion integration |
| [slack.yaml](../config/integrations/slack.yaml) | Slack integration |

### Detailed Guides

| Guide | Description |
|-------|-------------|
| [PM Integration Setup](../getting-started/pm-integration.md) | Getting started with PM tools |
| [PM Directory](./pm/) | Detailed PM integration docs |

---

## Setting Up Integrations

### 1. Choose Your Tools

Identify which tools your team uses:
- Project management (Jira, Linear, etc.)
- Communication (Slack)
- Version control (GitHub, GitLab)

### 2. Configure Integration

Copy and customize the configuration:

```bash
# View available configs
ls proagents/config/integrations/

# Edit for your project
vim proagents/config/integrations/jira.yaml
```

### 3. Add Credentials

Set up environment variables:

```bash
# .env or environment
JIRA_API_TOKEN=your-token
SLACK_WEBHOOK_URL=your-webhook
GITHUB_TOKEN=your-token
```

### 4. Enable in Config

```yaml
# proagents.config.yaml
integrations:
  jira:
    enabled: true
  slack:
    enabled: true
  github:
    enabled: true
```

---

## Related Resources

- [Configuration Guide](../config/README.md)
- [PM Integration Guide](./pm/)
- [Getting Started](../getting-started/)
