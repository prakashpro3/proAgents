# Plugin System

Extend ProAgents with custom plugins and integrations.

---

## Overview

ProAgents supports a plugin architecture that allows you to:

- Add custom workflow phases
- Integrate with external tools
- Create custom commands
- Add new code generators
- Implement custom validators
- Extend reporting capabilities

---

## Quick Start

### Install a Plugin

```bash
# From npm
proagents plugin install @proagents/plugin-jira

# From GitHub
proagents plugin install github:user/proagents-plugin-custom

# From local path
proagents plugin install ./my-plugin
```

### Enable Plugin

```yaml
# proagents.config.yaml
plugins:
  enabled:
    - "@proagents/plugin-jira"
    - "@proagents/plugin-slack"
    - "./custom-plugins/my-plugin"
```

---

## Available Official Plugins

| Plugin | Description |
|--------|-------------|
| `@proagents/plugin-jira` | Jira integration |
| `@proagents/plugin-slack` | Slack notifications |
| `@proagents/plugin-github` | GitHub Actions integration |
| `@proagents/plugin-sentry` | Sentry error tracking |
| `@proagents/plugin-datadog` | Datadog monitoring |
| `@proagents/plugin-sonarqube` | SonarQube code quality |

---

## Plugin Types

### Workflow Plugins
Extend or modify workflow phases.

### Integration Plugins
Connect with external services.

### Generator Plugins
Add code generation capabilities.

### Validator Plugins
Add custom validation rules.

### Reporter Plugins
Add custom report formats.

---

## Documentation

- [Plugin API](./plugin-api.md) - Complete API reference
- [Creating Plugins](./creating-plugins.md) - Build your own plugins
- [Plugin Registry](./plugin-registry.md) - Browse available plugins

---

## Configuration

```yaml
# proagents.config.yaml
plugins:
  # Enabled plugins
  enabled:
    - "@proagents/plugin-jira"
    - "@proagents/plugin-slack"

  # Plugin-specific configuration
  config:
    "@proagents/plugin-jira":
      baseUrl: "https://company.atlassian.net"
      projectKey: "PROJ"

    "@proagents/plugin-slack":
      webhookUrl: "${SLACK_WEBHOOK_URL}"
      channel: "#development"

  # Plugin directories
  directories:
    - "./plugins"
    - "~/.proagents/plugins"

  # Auto-update settings
  autoUpdate: false
```

---

## Commands

```bash
# List installed plugins
proagents plugin list

# Install a plugin
proagents plugin install <plugin-name>

# Remove a plugin
proagents plugin remove <plugin-name>

# Update plugins
proagents plugin update

# Create new plugin
proagents plugin create my-plugin

# Validate plugin
proagents plugin validate ./my-plugin
```
