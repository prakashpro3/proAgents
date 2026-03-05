# Notification Routing

Intelligent routing of notifications to the right channels and recipients.

---

## Routing Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Routing Pipeline                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Event                                                      │
│    │                                                        │
│    ▼                                                        │
│  ┌─────────────┐                                           │
│  │ Event Type  │──► Determine base routing                 │
│  └─────────────┘                                           │
│    │                                                        │
│    ▼                                                        │
│  ┌─────────────┐                                           │
│  │  Priority   │──► Adjust channels by urgency             │
│  └─────────────┘                                           │
│    │                                                        │
│    ▼                                                        │
│  ┌─────────────┐                                           │
│  │  Context    │──► Add team/feature context               │
│  └─────────────┘                                           │
│    │                                                        │
│    ▼                                                        │
│  ┌─────────────┐                                           │
│  │ Preferences │──► Apply user/team preferences            │
│  └─────────────┘                                           │
│    │                                                        │
│    ▼                                                        │
│  ┌─────────────┐                                           │
│  │  Delivery   │──► Send to channels                       │
│  └─────────────┘                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Event-Based Routing

### Route by Event Type

```yaml
notifications:
  routing:
    rules:
      # Feature events
      - match:
          event: "feature.*"
        route:
          channels: ["slack"]
          slack_channel: "#dev-features"

      # Deployment events
      - match:
          event: "deploy.*"
        route:
          channels: ["slack", "email"]
          slack_channel: "#deployments"

      # Security events
      - match:
          event: "security.*"
        route:
          channels: ["slack", "email", "pagerduty"]
          slack_channel: "#security-alerts"
          priority: "high"
```

### Route by Event Attributes

```yaml
notifications:
  routing:
    rules:
      # Failed tests in production
      - match:
          event: "test.failed"
          environment: "production"
        route:
          channels: ["slack", "pagerduty"]
          priority: "high"

      # Failed tests in staging (lower priority)
      - match:
          event: "test.failed"
          environment: "staging"
        route:
          channels: ["slack"]
          priority: "normal"
```

---

## Priority-Based Routing

### Priority Levels

```yaml
notifications:
  priorities:
    critical:
      channels: ["slack", "sms", "pagerduty", "email"]
      immediate: true
      escalation: true

    high:
      channels: ["slack", "email"]
      immediate: true

    normal:
      channels: ["slack"]
      batching_allowed: true

    low:
      channels: ["email"]
      digest_only: true
```

### Auto Priority Detection

```yaml
notifications:
  routing:
    auto_priority:
      enabled: true

      rules:
        # Production failures are critical
        - condition: "event.environment == 'production' && event.status == 'failed'"
          priority: "critical"

        # Security issues are high priority
        - condition: "event.type.startsWith('security.')"
          priority: "high"

        # Test failures in staging are normal
        - condition: "event.type == 'test.failed' && event.environment == 'staging'"
          priority: "normal"
```

---

## Context-Based Routing

### Route by Team

```yaml
notifications:
  routing:
    rules:
      # Frontend team
      - match:
          paths:
            - "src/components/**"
            - "src/pages/**"
            - "src/styles/**"
        route:
          team: "frontend"
          channels: ["slack"]
          slack_channel: "#frontend"

      # Backend team
      - match:
          paths:
            - "src/api/**"
            - "src/services/**"
            - "src/models/**"
        route:
          team: "backend"
          channels: ["slack"]
          slack_channel: "#backend"
```

### Route by Feature

```yaml
notifications:
  routing:
    rules:
      # Auth feature
      - match:
          feature_tags: ["auth", "authentication"]
        route:
          team: "auth-team"
          slack_channel: "#auth-dev"

      # Payment feature
      - match:
          feature_tags: ["payment", "billing"]
        route:
          team: "payments-team"
          slack_channel: "#payments-dev"
          priority: "high"  # Payment issues are important
```

---

## Recipient Routing

### Route to Specific Users

```yaml
notifications:
  routing:
    rules:
      # Route to feature owner
      - match:
          event: "review.needed"
        route:
          users:
            - "{{feature.owner}}"
          channels: ["slack", "email"]

      # Route to code owner
      - match:
          event: "pr.created"
        route:
          users:
            - "{{codeowners}}"
          channels: ["slack"]
```

### Escalation Routing

```yaml
notifications:
  routing:
    escalation:
      enabled: true

      levels:
        # Level 1: Direct owner
        - delay: 0
          users: ["{{feature.owner}}"]
          channels: ["slack"]

        # Level 2: Team lead
        - delay: "15m"
          users: ["{{team.lead}}"]
          channels: ["slack", "email"]

        # Level 3: Manager
        - delay: "30m"
          users: ["{{team.manager}}"]
          channels: ["slack", "email", "sms"]

        # Level 4: On-call
        - delay: "1h"
          users: ["{{oncall}}"]
          channels: ["pagerduty"]
```

---

## Channel Routing

### Multi-Channel Delivery

```yaml
notifications:
  routing:
    rules:
      - match:
          event: "deploy.failed"
          environment: "production"
        route:
          channels:
            - name: "slack"
              config:
                channel: "#incidents"
                mention: "@oncall"

            - name: "email"
              config:
                recipients: ["devops@company.com"]
                priority: "high"

            - name: "pagerduty"
              config:
                severity: "critical"
```

### Fallback Channels

```yaml
notifications:
  routing:
    fallback:
      # If Slack fails, use email
      slack: "email"

      # If email fails, use SMS
      email: "sms"

      # Always fallback to
      default: "email"
```

---

## Conditional Routing

### Time-Based Routing

```yaml
notifications:
  routing:
    rules:
      # Business hours: Slack
      - match:
          event: "*"
        conditions:
          time:
            hours: "09:00-18:00"
            days: ["mon", "tue", "wed", "thu", "fri"]
        route:
          channels: ["slack"]

      # After hours: Email
      - match:
          event: "*"
        conditions:
          time:
            hours: "18:00-09:00"
        route:
          channels: ["email"]

      # Weekends: Email digest
      - match:
          event: "*"
        conditions:
          time:
            days: ["sat", "sun"]
        route:
          channels: ["email"]
          digest: true
```

### Environment-Based Routing

```yaml
notifications:
  routing:
    rules:
      # Development: Minimal notifications
      - match:
          environment: "development"
        route:
          channels: ["slack"]
          slack_channel: "#dev-noise"
          priority: "low"

      # Staging: Standard notifications
      - match:
          environment: "staging"
        route:
          channels: ["slack"]
          slack_channel: "#staging"

      # Production: Full notifications
      - match:
          environment: "production"
        route:
          channels: ["slack", "email"]
          slack_channel: "#production"
          priority: "high"
```

---

## Route Testing

### Test Routing Rules

```bash
# Test how an event would be routed
proagents notifications route test \
  --event "deploy.failed" \
  --environment "production"

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Routing Test: deploy.failed (production)                    │
├─────────────────────────────────────────────────────────────┤
│ Matched Rules:                                              │
│ • Rule: "production-failures" (priority: 100)              │
│ • Rule: "deploy-events" (priority: 50)                     │
│                                                             │
│ Final Route:                                                │
│ • Channels: slack, email, pagerduty                        │
│ • Slack: #incidents                                         │
│ • Priority: critical                                        │
│ • Escalation: enabled                                       │
│                                                             │
│ Recipients:                                                 │
│ • @devops-team                                             │
│ • oncall@company.com                                       │
└─────────────────────────────────────────────────────────────┘
```

### Dry Run

```bash
# Send test notification without actual delivery
proagents notifications send \
  --event "deploy.failed" \
  --dry-run

# Shows what would be sent without actually sending
```

---

## Commands

```bash
# List routing rules
proagents notifications routing list

# Add routing rule
proagents notifications routing add \
  --match "event:deploy.*" \
  --channels "slack,email"

# Test routing
proagents notifications routing test --event "deploy.failed"

# View route for event
proagents notifications routing show --event "security.critical"
```

---

## Best Practices

1. **Specific First**: More specific rules should have higher priority
2. **Don't Over-Route**: Not every event needs every channel
3. **Test Rules**: Verify routing before production
4. **Use Fallbacks**: Always have a backup channel
5. **Consider Time**: Route differently during off-hours
6. **Escalate Appropriately**: Don't wake everyone for low-priority issues
