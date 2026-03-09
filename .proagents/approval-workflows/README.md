# Approval Workflows

Multi-level approval chains for features, releases, and deployments.

---

## Overview

Configure approval requirements for different stages of your development workflow.

```
┌─────────────────────────────────────────────────────────────┐
│                    Approval Workflow                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Feature Complete                                           │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│  │  Tech Lead  │──►│   Product   │──►│   Deploy    │      │
│  │   Review    │   │   Review    │   │  Approval   │      │
│  └─────────────┘   └─────────────┘   └─────────────┘      │
│       │                  │                  │              │
│       ▼                  ▼                  ▼              │
│  [Approved]         [Approved]        [Approved]          │
│       │                  │                  │              │
│       └──────────────────┴──────────────────┘              │
│                          │                                  │
│                          ▼                                  │
│                    ┌───────────┐                           │
│                    │  Deploy   │                           │
│                    └───────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Enable Approvals

```yaml
# proagents.config.yaml

approvals:
  enabled: true

  feature_approval:
    required: true
    approvers: ["@team/tech-leads"]
```

### Request Approval

```bash
# Request approval for current feature
proagents approval request

# Check approval status
proagents approval status
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Level** | Chain multiple approval stages |
| **Role-Based** | Assign approvers by role |
| **Conditional** | Different rules for different changes |
| **Emergency Bypass** | Override for critical situations |
| **Audit Trail** | Full history of approvals |
| **Notifications** | Alert approvers automatically |

---

## Documentation Files

| File | Description |
|------|-------------|
| [approval-config.md](./approval-config.md) | Configuration options |
| [approval-stages.md](./approval-stages.md) | Stage definitions |
| [emergency-bypass.md](./emergency-bypass.md) | Emergency procedures |
| [notifications.md](./notifications.md) | Approval notifications |

---

## Configuration

```yaml
# proagents.config.yaml

approvals:
  enabled: true

  # Feature approval
  feature_approval:
    stages:
      - name: "tech_review"
        approvers: ["@team/tech-leads"]
        required: true

      - name: "product_review"
        approvers: ["@team/product"]
        required: false

  # Deployment approval
  deployment_approval:
    staging:
      required: false

    production:
      required: true
      approvers:
        - "@team/tech-leads"
        - "@team/devops"
      min_approvals: 2

  # Notifications
  notifications:
    on_request: true
    on_approval: true
    on_rejection: true
    channels: ["slack:#approvals"]

  # Timeouts
  timeouts:
    default: "48h"
    escalate_after: "24h"
    escalate_to: "@team/managers"
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents approval request` | Request approval |
| `proagents approval status` | Check status |
| `proagents approval approve` | Approve request |
| `proagents approval reject` | Reject request |
| `proagents approval bypass` | Emergency bypass |
| `proagents approval history` | View history |
