# Project Management Integration

Integrate ProAgents with popular project management tools.

---

## Overview

Seamlessly connect your development workflow with project management platforms for automatic issue tracking, status updates, and team coordination.

```
┌─────────────────────────────────────────────────────────────┐
│                 PM Integration Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ProAgents Workflow                                         │
│       │                                                     │
│       ├──► Feature Start ──► Create/Link Issue             │
│       │                                                     │
│       ├──► Phase Change ──► Update Status                  │
│       │                                                     │
│       ├──► PR Created ──► Link to Issue                    │
│       │                                                     │
│       └──► Feature Complete ──► Close Issue                │
│                                                             │
│  Supported Platforms:                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  Jira   │ │ Trello  │ │ Linear  │ │ Notion  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │ GitHub  │ │ GitLab  │ │ Asana   │                       │
│  └─────────┘ └─────────┘ └─────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Enable Integration

```yaml
# proagents.config.yaml

integrations:
  pm:
    enabled: true
    primary: "jira"  # or linear, trello, notion, github, gitlab, asana
```

### Connect Platform

```bash
# Connect to Jira
proagents pm connect jira

# Connect to Linear
proagents pm connect linear

# Verify connection
proagents pm status
```

---

## Supported Platforms

| Platform | Features | Best For |
|----------|----------|----------|
| **Jira** | Full integration, custom workflows | Enterprise teams |
| **Linear** | Bi-directional sync, auto-linking | Modern dev teams |
| **Trello** | Card sync, board updates | Small teams, visual workflows |
| **Notion** | Database sync, documentation | Documentation-heavy teams |
| **GitHub Issues** | Native integration | Open source, GitHub-centric |
| **GitLab Issues** | Native integration | GitLab-centric workflows |
| **Asana** | Task sync, project updates | Cross-functional teams |

---

## Features

| Feature | Description |
|---------|-------------|
| **Auto-Create Issues** | Create issues when features start |
| **Status Sync** | Update PM status as workflow progresses |
| **PR Linking** | Automatically link PRs to issues |
| **Time Tracking** | Log time spent on features |
| **Comment Sync** | Sync comments and decisions |
| **Bi-directional** | Changes in PM reflect in workflow |

---

## Documentation Files

| File | Description |
|------|-------------|
| [jira.md](./jira.md) | Jira integration guide |
| [linear.md](./linear.md) | Linear integration guide |
| [trello.md](./trello.md) | Trello integration guide |
| [notion.md](./notion.md) | Notion integration guide |
| [github-issues.md](./github-issues.md) | GitHub Issues integration |
| [sync-config.md](./sync-config.md) | Synchronization configuration |

---

## Configuration

```yaml
# proagents.config.yaml

integrations:
  pm:
    enabled: true
    primary: "jira"

    # Auto-sync settings
    sync:
      on_feature_start: true
      on_phase_change: true
      on_pr_create: true
      on_feature_complete: true

    # Field mappings
    mappings:
      feature_name: "summary"
      feature_description: "description"
      current_phase: "status"
      assignee: "assignee"

    # Status transitions
    status_mapping:
      analysis: "In Progress"
      implementation: "In Development"
      testing: "In QA"
      review: "In Review"
      deployed: "Done"
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents pm connect <platform>` | Connect to platform |
| `proagents pm status` | Show connection status |
| `proagents pm sync` | Manual sync |
| `proagents pm link <issue-id>` | Link current feature to issue |
| `proagents pm create` | Create issue for current feature |
| `proagents pm disconnect` | Disconnect platform |
