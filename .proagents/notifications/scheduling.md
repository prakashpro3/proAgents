# Notification Scheduling

Quiet hours, batching, and scheduled notifications.

---

## Quiet Hours

### Global Quiet Hours

```yaml
notifications:
  scheduling:
    quiet_hours:
      enabled: true

      # Default quiet period
      default:
        start: "22:00"
        end: "08:00"
        timezone: "UTC"

      # Weekend quiet hours
      weekend:
        enabled: true
        start: "Friday 20:00"
        end: "Monday 08:00"
```

### Per-User Quiet Hours

```yaml
notifications:
  users:
    john.doe:
      quiet_hours:
        enabled: true
        start: "21:00"
        end: "09:00"
        timezone: "America/New_York"

        # Custom weekend
        weekend:
          start: "Friday 18:00"
          end: "Monday 10:00"
```

### Quiet Hours Exceptions

```yaml
notifications:
  scheduling:
    quiet_hours:
      exceptions:
        # Always deliver critical events
        - priority: "critical"

        # Always deliver security events
        - events:
            - "security.critical"
            - "security.breach"

        # Always deliver production failures
        - conditions:
            event: "deploy.failed"
            environment: "production"
```

### Quiet Hours Behavior

```yaml
notifications:
  scheduling:
    quiet_hours:
      behavior:
        # What to do with notifications during quiet hours
        action: "queue"  # "queue" | "digest" | "discard"

        # Deliver queued notifications when quiet hours end
        deliver_on_resume: true

        # Or include in morning digest
        include_in_digest: true
```

---

## Notification Batching

### Batch Configuration

```yaml
notifications:
  scheduling:
    batching:
      enabled: true

      # Batch similar events
      rules:
        # Batch test failures
        - events: ["test.failed"]
          window: "5m"
          min_count: 3
          title: "{{count}} Test Failures"

        # Batch lint warnings
        - events: ["lint.warning"]
          window: "10m"
          min_count: 5
          title: "{{count}} Lint Warnings"

        # Batch build events
        - events: ["build.*"]
          window: "15m"
          group_by: "feature"
```

### Batch Message Format

```yaml
notifications:
  scheduling:
    batching:
      format:
        title: "{{count}} {{event_type}} events"
        summary: "Batched notifications from the last {{window}}"

        # Show individual items
        show_items: true
        max_items: 10

        # Collapse similar items
        collapse_similar: true
```

### Example Batched Notification

```
┌─────────────────────────────────────────────────────────────┐
│ 8 Test Failures (Last 5 minutes)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Feature: user-authentication                                │
│                                                             │
│ Failed Tests:                                               │
│ • UserService.login.should_validate_email                  │
│ • UserService.login.should_check_password                  │
│ • AuthController.login.should_return_token                 │
│ • AuthController.login.should_handle_invalid_credentials   │
│ • ... and 4 more                                           │
│                                                             │
│ [View All Failures] [Run Tests]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scheduled Digests

### Daily Digest

```yaml
notifications:
  scheduling:
    digest:
      daily:
        enabled: true
        time: "09:00"
        timezone: "America/New_York"

        # Include
        include:
          - events_summary: true
          - features_progress: true
          - pending_reviews: true
          - upcoming_deploys: true

        # Channels
        channels: ["email", "slack"]
```

### Weekly Digest

```yaml
notifications:
  scheduling:
    digest:
      weekly:
        enabled: true
        day: "monday"
        time: "09:00"
        timezone: "America/New_York"

        include:
          - features_completed: true
          - bugs_fixed: true
          - deployments: true
          - metrics: true
          - highlights: true
```

### Digest Content

```
┌─────────────────────────────────────────────────────────────┐
│ Daily Digest - January 15, 2024                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Summary                                                     │
│ ├── Features Completed: 2                                  │
│ ├── Bugs Fixed: 5                                          │
│ ├── Deployments: 3                                         │
│ └── PRs Merged: 8                                          │
│                                                             │
│ Completed Features                                          │
│ • User Authentication - by John Doe                        │
│ • Dashboard Redesign - by Jane Smith                       │
│                                                             │
│ Pending Reviews (3)                                         │
│ • PR #123: Add payment integration (waiting 2 days)        │
│ • PR #124: Update user profile (waiting 1 day)             │
│ • PR #125: Fix login bug (waiting 4 hours)                 │
│                                                             │
│ Upcoming Deployments                                        │
│ • Staging: v1.5.0 - Today at 14:00                         │
│ • Production: v1.5.0 - Tomorrow at 10:00                   │
│                                                             │
│ [View Dashboard] [View All PRs]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scheduled Notifications

### Schedule Future Notifications

```yaml
notifications:
  scheduling:
    scheduled:
      # Pre-deployment reminder
      - name: "deployment-reminder"
        trigger:
          event: "deploy.scheduled"
        notifications:
          - delay: "-1h"
            message: "Deployment in 1 hour: {{deploy.version}}"
            channels: ["slack"]

          - delay: "-15m"
            message: "Deployment in 15 minutes: {{deploy.version}}"
            channels: ["slack"]
            mention: "@team"

      # Review reminders
      - name: "review-reminder"
        trigger:
          event: "review.pending"
          age: "24h"
        notifications:
          - message: "PR #{{pr.number}} is waiting for review"
            channels: ["slack"]
            mention: "{{pr.reviewers}}"
```

### Recurring Notifications

```yaml
notifications:
  scheduling:
    recurring:
      # Daily standup reminder
      - name: "standup-reminder"
        schedule: "0 9 * * 1-5"  # 9 AM weekdays
        channels: ["slack"]
        slack_channel: "#daily-standup"
        message: "Time for daily standup! What are you working on today?"

      # Weekly review reminder
      - name: "weekly-review"
        schedule: "0 14 * * 5"  # 2 PM Friday
        channels: ["slack"]
        message: "Don't forget to submit your weekly review!"

      # Monthly metrics report
      - name: "monthly-metrics"
        schedule: "0 10 1 * *"  # 10 AM, 1st of month
        channels: ["email"]
        template: "monthly-report"
```

---

## Delay & Throttling

### Notification Delay

```yaml
notifications:
  scheduling:
    delay:
      # Delay non-urgent notifications
      rules:
        - match:
            priority: "low"
          delay: "5m"

        - match:
            priority: "normal"
            time: "outside_business_hours"
          delay: "until_business_hours"
```

### Throttling

```yaml
notifications:
  scheduling:
    throttling:
      enabled: true

      # Per-user limits
      per_user:
        per_minute: 5
        per_hour: 30
        per_day: 100

      # Per-channel limits
      per_channel:
        slack:
          per_minute: 10
          per_hour: 100

      # On limit reached
      on_limit:
        action: "batch"  # "batch" | "queue" | "drop"
        notify_user: true
```

---

## Time Zone Handling

### Time Zone Configuration

```yaml
notifications:
  scheduling:
    timezone:
      # Default timezone
      default: "UTC"

      # Respect user timezone
      use_user_timezone: true

      # Respect team timezone
      use_team_timezone: true
```

### Multi-Timezone Teams

```yaml
notifications:
  teams:
    global-team:
      members:
        - name: "john.doe"
          timezone: "America/New_York"
        - name: "jane.smith"
          timezone: "Europe/London"
        - name: "bob.wilson"
          timezone: "Asia/Tokyo"

      # Notifications respect individual timezones
      respect_timezones: true

      # Find overlap for team notifications
      team_notifications:
        find_overlap: true
        min_overlap: "2h"
```

---

## Commands

```bash
# View scheduled notifications
proagents notifications schedule list

# Schedule notification
proagents notifications schedule add \
  --message "Deploy reminder" \
  --time "2024-01-16 10:00" \
  --channel slack

# Cancel scheduled notification
proagents notifications schedule cancel <id>

# View digest settings
proagents notifications digest config

# Trigger digest now
proagents notifications digest send --type daily

# Set quiet hours
proagents notifications quiet-hours set "22:00-08:00"

# Disable quiet hours temporarily
proagents notifications quiet-hours disable --until "2024-01-16"
```

---

## Best Practices

1. **Respect Time Zones**: Deliver at appropriate local times
2. **Use Quiet Hours**: Don't disturb during off-hours
3. **Batch Related**: Combine similar notifications
4. **Summarize in Digests**: Daily/weekly summaries reduce noise
5. **Allow Exceptions**: Critical issues should always get through
6. **Test Scheduling**: Verify notifications arrive when expected
