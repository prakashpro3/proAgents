# Team Collaboration

Code ownership, handoffs, IDE setup, and team onboarding.

---

## Overview

ProAgents supports multi-developer workflows with clear ownership, communication templates, and comprehensive onboarding. This directory contains everything needed for effective team collaboration.

---

## Documentation

### Collaboration

| Document | Description |
|----------|-------------|
| [Code Ownership](./code-ownership.md) | CODEOWNERS and module ownership |
| [Handoff Protocol](./handoff-protocol.md) | Transferring work between developers |
| [Communication Templates](./communication-templates.md) | Standard messages and notifications |

### Onboarding

| Document | Description |
|----------|-------------|
| [Team Onboarding](./onboarding.md) | Complete guide for new team members |
| [IDE Setup](./ide-setup/README.md) | Development environment configuration |

### IDE Setup Guides

| IDE | Guide |
|-----|-------|
| VS Code | [vscode.md](./ide-setup/vscode.md) |
| Cursor | [cursor.md](./ide-setup/cursor.md) |
| JetBrains | [jetbrains.md](./ide-setup/jetbrains.md) |

---

## Quick Start

### For New Team Members

1. Follow the [Onboarding Guide](./onboarding.md)
2. Set up your IDE with [IDE Setup](./ide-setup/README.md)
3. Review [Coding Standards](../standards/README.md)
4. Read the [Workflow Guide](../WORKFLOW.md)

### For Existing Team

```bash
# View code owners for a path
proagents team owners src/auth/

# Create handoff document
proagents team handoff feature-123

# Notify team
proagents team notify "Feature ready for review"

# Check team assignments
proagents team status
```

---

## Code Ownership

### CODEOWNERS Integration

```
# CODEOWNERS file
/src/auth/*       @security-team
/src/payments/*   @payments-team
/src/ui/*         @frontend-team
/src/api/*        @backend-team
*.md              @docs-team
```

### Ownership Commands

```bash
# Check who owns a file
proagents team owners src/auth/login.ts

# Assign reviewer based on ownership
proagents team assign-reviewers

# View all ownership mappings
proagents team ownership-report
```

---

## Handoff Protocol

When transferring work between developers:

### Handoff Checklist

- [ ] Document current status (phase, progress percentage)
- [ ] List remaining tasks
- [ ] Note any blockers or dependencies
- [ ] Provide context (decisions made, alternatives considered)
- [ ] Update issue/task assignments
- [ ] Notify stakeholders

### Create Handoff Document

```bash
proagents team handoff feature-user-auth
```

This generates a handoff document with:
- Current status
- Work completed
- Work remaining
- Important context
- Known issues

---

## Communication

### Templates Available

| Template | Use Case |
|----------|----------|
| Feature Start | Announce new feature work |
| Feature Complete | Announce completion |
| Blocker Alert | Report blocking issue |
| Review Request | Request code review |
| Deploy Notification | Announce deployment |

### Using Templates

```bash
# Use a template
proagents team notify --template feature-complete

# Custom message
proagents team notify "Custom message here"
```

---

## Configuration

```yaml
# proagents.config.yaml
team:
  # Code ownership
  codeowners:
    enabled: true
    file: "CODEOWNERS"
    enforce_reviews: true

  # Handoff requirements
  handoffs:
    require_document: true
    notify_stakeholders: true
    include_checklist: true

  # Notifications
  notifications:
    enabled: true
    channels:
      default: "slack:#dev-team"
      urgent: "slack:#dev-alerts"
      deployments: "slack:#deployments"

  # Onboarding
  onboarding:
    mentor_assignment: true
    buddy_system: true
    checklist_tracking: true

  # Collaboration settings
  collaboration:
    require_reviewers: 1
    auto_assign_reviewers: true
    use_codeowners: true
```

---

## Team Workflows

### Daily Standups

```bash
# Generate standup summary
proagents team standup

# Shows:
# - Features in progress
# - Blockers
# - PRs awaiting review
```

### Weekly Reports

```bash
# Generate weekly report
proagents team weekly-report

# Shows:
# - Features completed
# - PRs merged
# - Code coverage changes
# - Velocity metrics
```

---

## Best Practices

### Code Reviews

1. Review within 24 hours
2. Provide constructive feedback
3. Use ProAgents checklists
4. Focus on patterns and standards

### Handoffs

1. Document everything
2. Schedule walkthrough if complex
3. Ensure all context is captured
4. Verify new owner has access

### Communication

1. Use templates for consistency
2. Include relevant links
3. Tag appropriate people
4. Keep updates concise

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| No reviewers assigned | Check CODEOWNERS file |
| Handoff document incomplete | Use checklist template |
| Notifications not sending | Check integration config |
| Onboarding steps unclear | Follow step-by-step guide |

### Getting Help

- **Team channel**: #dev-help
- **Documentation**: This directory
- **Escalation**: Tech lead
