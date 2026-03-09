# Approval Notifications

Configure notifications for approval workflow events.

---

## Notification Events

| Event | Description | Default |
|-------|-------------|---------|
| `approval_requested` | New approval needed | Notify approvers |
| `approval_granted` | Approval given | Notify requester |
| `approval_rejected` | Approval denied | Notify requester |
| `approval_reminder` | Pending reminder | Notify approvers |
| `approval_escalated` | Escalated to next level | Notify escalation target |
| `approval_expired` | Timeout reached | Notify all parties |

---

## Configuration

### Notification Setup

```yaml
approvals:
  notifications:
    enabled: true

    # Default channels
    default_channels:
      - "email"
      - "slack"

    # Event-specific settings
    events:
      approval_requested:
        channels: ["slack", "email"]
        template: "approval_request"
        priority: "high"

      approval_granted:
        channels: ["slack"]
        template: "approval_granted"
        priority: "normal"

      approval_rejected:
        channels: ["slack", "email"]
        template: "approval_rejected"
        priority: "high"

      approval_reminder:
        channels: ["slack"]
        template: "approval_reminder"
        schedule:
          - after: "4h"
          - after: "12h"
          - after: "20h"
```

### Channel Configuration

```yaml
approvals:
  notifications:
    channels:
      slack:
        webhook_url_env: "SLACK_WEBHOOK_URL"
        default_channel: "#approvals"

        # Channel routing
        routing:
          security_review: "#security-approvals"
          production_deploy: "#prod-approvals"

      email:
        smtp:
          host: "smtp.company.com"
          port: 587
          from: "approvals@company.com"

      teams:
        webhook_url_env: "TEAMS_WEBHOOK_URL"

      pagerduty:
        api_key_env: "PAGERDUTY_API_KEY"
        service_id: "P123ABC"
        # Only for urgent approvals
        events: ["approval_escalated"]
```

---

## Notification Templates

### Slack Templates

```yaml
approvals:
  notifications:
    templates:
      approval_request:
        slack:
          blocks:
            - type: "header"
              text: "🔔 Approval Required"
            - type: "section"
              fields:
                - "*Feature:*\n{{feature.name}}"
                - "*Requester:*\n{{requester.name}}"
                - "*Stage:*\n{{stage.name}}"
            - type: "section"
              text: "{{description}}"
            - type: "actions"
              elements:
                - type: "button"
                  text: "Review"
                  url: "{{review_url}}"
                  style: "primary"
```

### Email Templates

```yaml
approvals:
  notifications:
    templates:
      approval_request:
        email:
          subject: "[Action Required] Approval needed: {{feature.name}}"
          body: |
            Hi {{approver.name}},

            Your approval is required for:

            **Feature:** {{feature.name}}
            **Requester:** {{requester.name}}
            **Stage:** {{stage.name}}

            **Description:**
            {{description}}

            Please review and approve at:
            {{review_url}}

            This request will expire in {{timeout}}.

            ---
            ProAgents Approval System
```

---

## Reminder Configuration

### Reminder Schedule

```yaml
approvals:
  notifications:
    reminders:
      enabled: true

      schedule:
        # First reminder
        - after: "4h"
          message: "Reminder: Approval pending for {{feature.name}}"

        # Second reminder
        - after: "12h"
          message: "Second reminder: Approval still pending"
          escalate: false

        # Final reminder before escalation
        - after: "20h"
          message: "Final reminder: Will escalate in 4 hours"
          escalate_warning: true

      # Business hours only
      business_hours:
        enabled: true
        start: "09:00"
        end: "18:00"
        timezone: "America/New_York"
        skip_weekends: true
```

---

## Escalation Notifications

### Escalation Setup

```yaml
approvals:
  notifications:
    escalation:
      # Notify when escalating
      notify_original_approvers: true
      notify_escalation_target: true
      notify_requester: true

      template:
        subject: "⚠️ Escalated: {{feature.name}} approval"
        message: |
          This approval has been escalated due to timeout.

          Original approvers: {{original_approvers}}
          Escalated to: {{escalation_target}}
          Pending since: {{pending_duration}}
```

---

## Recipient Configuration

### Dynamic Recipients

```yaml
approvals:
  notifications:
    recipients:
      # Always notify
      always:
        - "{{requester.email}}"

      # Based on stage
      by_stage:
        code_review:
          - "{{codeowners}}"
          - "@tech-leads"

        security_review:
          - "@security-team"

        production_deploy:
          - "@devops"
          - "{{manager.email}}"

      # Escalation chain
      escalation:
        - level: 1
          recipients: ["@tech-leads"]
        - level: 2
          recipients: ["@engineering-managers"]
        - level: 3
          recipients: ["@directors"]
```

---

## Notification Preferences

### User Preferences

```yaml
approvals:
  notifications:
    user_preferences:
      enabled: true

      # Users can configure
      configurable:
        - channels      # Which channels to use
        - frequency     # Immediate vs digest
        - quiet_hours   # Do not disturb

      defaults:
        channels: ["slack", "email"]
        frequency: "immediate"
        quiet_hours:
          enabled: false
```

### Digest Mode

```yaml
approvals:
  notifications:
    digest:
      enabled: true

      # Combine notifications
      schedule: "0 9 * * *"  # Daily at 9 AM

      template:
        subject: "Daily Approval Summary"
        include:
          - pending_approvals
          - completed_approvals
          - upcoming_deadlines
```

---

## Commands

```bash
# Test notification
proagents approvals test-notification --event approval_requested

# View notification history
proagents approvals notifications --last 24h

# Configure preferences
proagents approvals preferences set --channel slack --frequency immediate

# Mute notifications temporarily
proagents approvals mute --duration 2h
```

---

## Best Practices

1. **Don't Over-Notify**: Balance urgency with noise
2. **Use Right Channels**: Urgent → Slack/PagerDuty, Normal → Email
3. **Clear Templates**: Include all needed context
4. **Respect Time Zones**: Send during business hours
5. **Allow Preferences**: Let users configure their notifications
6. **Track Delivery**: Monitor notification delivery rates
