# Notifications System

Multi-channel notification system for ProAgents events.

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  Notification Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Events                      Channels                       │
│  ┌─────────────────┐        ┌─────────────────┐            │
│  │ feature.complete│        │      Slack      │            │
│  │ deploy.failed   │        ├─────────────────┤            │
│  │ review.needed   │───────►│     Discord     │            │
│  │ approval.pending│        ├─────────────────┤            │
│  │ security.alert  │        │      Email      │            │
│  └─────────────────┘        ├─────────────────┤            │
│          │                  │  Microsoft Teams│            │
│          │                  ├─────────────────┤            │
│          ▼                  │   Push/Mobile   │            │
│  ┌─────────────────┐        └─────────────────┘            │
│  │   Preferences   │                                       │
│  │  ┌───────────┐  │                                       │
│  │  │ User      │  │        ┌─────────────────┐            │
│  │  │ Team      │  │───────►│ Message Router  │            │
│  │  │ Project   │  │        └─────────────────┘            │
│  │  └───────────┘  │                                       │
│  └─────────────────┘                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Configure Channels

```yaml
# proagents.config.yaml
notifications:
  enabled: true

  channels:
    slack:
      enabled: true
      webhook_env: "SLACK_WEBHOOK_URL"
      default_channel: "#proagents"

    email:
      enabled: true
      smtp:
        host_env: "SMTP_HOST"
        port: 587
        user_env: "SMTP_USER"
        pass_env: "SMTP_PASS"
```

### 2. Set Preferences

```yaml
notifications:
  defaults:
    feature_events: ["slack"]
    deploy_events: ["slack", "email"]
    security_events: ["slack", "email", "sms"]
```

### 3. Test Notifications

```bash
proagents notifications test slack
proagents notifications test email --to team@company.com
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Channel** | Slack, Discord, Teams, Email, SMS, Push |
| **User Preferences** | Per-user notification settings |
| **Team Routing** | Route by team/role |
| **Templates** | Customizable message templates |
| **Scheduling** | Quiet hours and scheduling |
| **Aggregation** | Batch related notifications |
| **Priority** | Urgent vs normal routing |

---

## Documentation

- [Channels](./channels.md) - Configure notification channels
- [Templates](./templates.md) - Customize message formats
- [Preferences](./preferences.md) - User and team preferences
- [Routing](./routing.md) - Intelligent message routing
- [Scheduling](./scheduling.md) - Quiet hours and batching

---

## Supported Channels

| Channel | Features |
|---------|----------|
| **Slack** | Channels, DMs, threads, reactions, blocks |
| **Discord** | Channels, DMs, embeds, reactions |
| **Microsoft Teams** | Channels, adaptive cards |
| **Email** | HTML/text, attachments, threading |
| **SMS** | Via Twilio, for urgent alerts |
| **Push** | Mobile/desktop push notifications |
| **Webhooks** | Custom HTTP endpoints |

---

## Commands

```bash
# List configured channels
proagents notifications channels

# Test notification
proagents notifications test <channel>

# View notification history
proagents notifications history

# Update preferences
proagents notifications preferences

# Mute notifications temporarily
proagents notifications mute --duration 2h

# Clear notification queue
proagents notifications clear-queue
```

---

## Best Practices

1. **Don't Over-Notify**: Only send important notifications
2. **Respect Preferences**: Honor user quiet hours
3. **Use Priorities**: Route urgent items differently
4. **Aggregate**: Batch related notifications
5. **Allow Muting**: Easy temporary silencing
6. **Track Delivery**: Monitor notification health
