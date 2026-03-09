# Notification Preferences

User and team notification settings.

---

## Preference Levels

```
┌─────────────────────────────────────────────────────────────┐
│                  Preference Hierarchy                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Preferences (Highest Priority)                        │
│         │                                                   │
│         ▼                                                   │
│  Team Preferences                                           │
│         │                                                   │
│         ▼                                                   │
│  Project Defaults                                           │
│         │                                                   │
│         ▼                                                   │
│  System Defaults (Lowest Priority)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## User Preferences

### Configure User Settings

```yaml
notifications:
  users:
    john.doe:
      email: "john.doe@company.com"
      slack_id: "U12345678"

      # Channel preferences
      channels:
        default: ["slack"]
        urgent: ["slack", "sms"]

      # Event preferences
      events:
        feature.completed: ["slack"]
        deploy.failed: ["slack", "email"]
        review.requested: ["slack"]

      # Quiet hours
      quiet_hours:
        enabled: true
        start: "22:00"
        end: "08:00"
        timezone: "America/New_York"
        except: ["critical"]

      # Digest preferences
      digest:
        enabled: true
        frequency: "daily"
        time: "09:00"
```

### User Self-Service

Users can manage their own preferences:

```bash
# View current preferences
proagents notifications preferences

# Update channel preference
proagents notifications preferences set \
  --channel slack \
  --events "feature.*,deploy.*"

# Set quiet hours
proagents notifications preferences set \
  --quiet-hours "22:00-08:00" \
  --timezone "America/New_York"

# Enable digest
proagents notifications preferences set \
  --digest daily \
  --time "09:00"

# Mute temporarily
proagents notifications mute --duration 2h
```

---

## Team Preferences

### Team Configuration

```yaml
notifications:
  teams:
    frontend:
      members:
        - "john.doe"
        - "jane.smith"
      channels:
        default: "#frontend"
        alerts: "#frontend-alerts"
      events:
        - "feature.*"
        - "deploy.*"
        - "test.failed"

    backend:
      members:
        - "bob.wilson"
        - "alice.jones"
      channels:
        default: "#backend"
        alerts: "#backend-alerts"
      events:
        - "feature.*"
        - "deploy.*"
        - "security.*"
        - "database.*"

    devops:
      members:
        - "charlie.brown"
      channels:
        default: "#devops"
        alerts: "#incidents"
      events:
        - "deploy.*"
        - "security.*"
        - "system.*"
```

### Team Mentions

```yaml
notifications:
  teams:
    frontend:
      slack_group: "@frontend-team"
      email_group: "frontend@company.com"

      # When to mention
      mention_on:
        - "deploy.failed"
        - "security.critical"
        - "review.needed"
```

---

## Project Defaults

### Default Settings

```yaml
notifications:
  defaults:
    # Default channels by event type
    channels:
      feature_events: ["slack"]
      deploy_events: ["slack", "email"]
      security_events: ["slack", "email", "sms"]
      review_events: ["slack"]

    # Default priority
    priority:
      feature.completed: "normal"
      deploy.failed: "high"
      security.critical: "critical"

    # Default formatting
    formatting:
      include_context: true
      include_actions: true
      verbose: false
```

---

## Event Subscriptions

### Subscribe to Events

```yaml
notifications:
  subscriptions:
    # Subscribe user to events
    - user: "john.doe"
      events:
        - "feature.*"
        - "deploy.*"
      channels: ["slack"]

    # Subscribe team to events
    - team: "devops"
      events:
        - "deploy.*"
        - "security.*"
      channels: ["slack", "pagerduty"]

    # Subscribe channel to events
    - channel: "#releases"
      events:
        - "deploy.success"
        - "release.*"
```

### Conditional Subscriptions

```yaml
notifications:
  subscriptions:
    # Only production deployments
    - user: "john.doe"
      events: ["deploy.*"]
      conditions:
        environment: "production"

    # Only for specific features
    - team: "auth-team"
      events: ["*"]
      conditions:
        feature_tags: ["auth", "security"]

    # Only during business hours
    - channel: "#support"
      events: ["*"]
      conditions:
        hours: "09:00-17:00"
        days: ["mon", "tue", "wed", "thu", "fri"]
```

---

## Muting & Do Not Disturb

### Temporary Mute

```yaml
notifications:
  muting:
    # Allow users to mute
    allow_user_mute: true

    # Mute options
    options:
      - "30m"
      - "1h"
      - "2h"
      - "4h"
      - "until_tomorrow"
      - "until_monday"

    # Never mute these
    never_mute:
      - priority: "critical"
      - events: ["security.critical", "system.down"]
```

### Scheduled DND

```yaml
notifications:
  users:
    john.doe:
      dnd:
        # Regular quiet hours
        daily:
          start: "22:00"
          end: "08:00"
          timezone: "America/New_York"

        # Weekend
        weekend:
          enabled: true
          start: "Friday 18:00"
          end: "Monday 08:00"

        # Exceptions
        exceptions:
          - priority: "critical"
          - events: ["deploy.failed", "security.*"]
```

---

## Notification Fatigue Prevention

### Rate Limiting

```yaml
notifications:
  fatigue_prevention:
    # Rate limits per user
    user_limits:
      per_minute: 5
      per_hour: 30
      per_day: 100

    # Aggregation
    aggregation:
      enabled: true
      window: "5m"
      threshold: 3  # Aggregate after 3 similar events

    # Smart batching
    batching:
      enabled: true
      events: ["test.*", "lint.*"]
      interval: "15m"
```

### Importance Scoring

```yaml
notifications:
  importance:
    scoring:
      enabled: true

      # Factors
      factors:
        - name: "event_type"
          weights:
            "deploy.failed": 100
            "security.critical": 100
            "feature.completed": 50
            "test.failed": 40
            "lint.warning": 10

        - name: "user_involvement"
          weight: 20
          # Higher if user is involved in feature

        - name: "time_sensitivity"
          weight: 15
          # Higher for urgent items

    # Only notify above threshold
    threshold: 30
```

---

## Preference Management

### Export/Import

```bash
# Export preferences
proagents notifications preferences export > my-prefs.yaml

# Import preferences
proagents notifications preferences import my-prefs.yaml

# Share team preferences
proagents notifications preferences export --team frontend > team-prefs.yaml
```

### Reset Preferences

```bash
# Reset to defaults
proagents notifications preferences reset

# Reset specific settings
proagents notifications preferences reset --quiet-hours
proagents notifications preferences reset --channels
```

---

## Commands

```bash
# View all preferences
proagents notifications preferences list

# Set preference
proagents notifications preferences set <key> <value>

# Get specific preference
proagents notifications preferences get <key>

# Mute notifications
proagents notifications mute --duration 2h
proagents notifications mute --until "2024-01-16 09:00"

# Unmute
proagents notifications unmute

# Subscribe to event
proagents notifications subscribe "deploy.*"

# Unsubscribe
proagents notifications unsubscribe "test.*"
```

---

## Best Practices

1. **Start Minimal**: Begin with essential notifications only
2. **Use Quiet Hours**: Respect personal time
3. **Aggregate Similar**: Batch related notifications
4. **Allow Customization**: Let users control their experience
5. **Smart Defaults**: Good defaults reduce configuration
6. **Monitor Fatigue**: Track and prevent notification overload
