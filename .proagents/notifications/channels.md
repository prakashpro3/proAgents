# Notification Channels

Configure and manage notification delivery channels.

---

## Slack

### Basic Setup

```yaml
notifications:
  channels:
    slack:
      enabled: true

      # Webhook URL
      webhook_env: "SLACK_WEBHOOK_URL"

      # Default channel
      default_channel: "#proagents"

      # Bot token (for advanced features)
      bot_token_env: "SLACK_BOT_TOKEN"
```

### Channel Routing

```yaml
notifications:
  channels:
    slack:
      routing:
        # Route by event type
        feature_events: "#dev-features"
        deploy_events: "#deployments"
        security_events: "#security-alerts"

        # Route by severity
        critical: "#incidents"
        warning: "#dev-alerts"
        info: "#proagents"
```

### Message Formatting

```yaml
notifications:
  channels:
    slack:
      formatting:
        # Use Slack blocks
        use_blocks: true

        # Include action buttons
        include_actions: true

        # Thread follow-up messages
        use_threads: true

        # Add reactions for status
        status_reactions:
          success: "white_check_mark"
          failure: "x"
          warning: "warning"
```

### Example Message

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Feature Completed"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Feature:*\nUser Authentication"
        },
        {
          "type": "mrkdwn",
          "text": "*Duration:*\n4 hours"
        }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {"type": "plain_text", "text": "View PR"},
          "url": "https://github.com/org/repo/pull/123"
        }
      ]
    }
  ]
}
```

---

## Discord

### Setup

```yaml
notifications:
  channels:
    discord:
      enabled: true
      webhook_env: "DISCORD_WEBHOOK_URL"

      # Bot token for advanced features
      bot_token_env: "DISCORD_BOT_TOKEN"
```

### Channel Routing

```yaml
notifications:
  channels:
    discord:
      routing:
        default: "general"
        deployments: "deployments"
        alerts: "alerts"
```

### Embed Formatting

```yaml
notifications:
  channels:
    discord:
      formatting:
        use_embeds: true
        colors:
          success: 0x00FF00
          failure: 0xFF0000
          warning: 0xFFFF00
          info: 0x0000FF
```

---

## Microsoft Teams

### Setup

```yaml
notifications:
  channels:
    teams:
      enabled: true
      webhook_env: "TEAMS_WEBHOOK_URL"
```

### Adaptive Cards

```yaml
notifications:
  channels:
    teams:
      formatting:
        use_adaptive_cards: true
        include_actions: true
```

### Example Adaptive Card

```json
{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": "0076D7",
  "summary": "Feature Completed",
  "sections": [{
    "activityTitle": "Feature Completed",
    "facts": [{
      "name": "Feature",
      "value": "User Authentication"
    }, {
      "name": "Duration",
      "value": "4 hours"
    }],
    "markdown": true
  }],
  "potentialAction": [{
    "@type": "OpenUri",
    "name": "View PR",
    "targets": [{
      "os": "default",
      "uri": "https://github.com/org/repo/pull/123"
    }]
  }]
}
```

---

## Email

### SMTP Setup

```yaml
notifications:
  channels:
    email:
      enabled: true

      smtp:
        host_env: "SMTP_HOST"
        port: 587
        secure: true
        user_env: "SMTP_USER"
        pass_env: "SMTP_PASS"

      from:
        name: "ProAgents"
        email: "proagents@company.com"
```

### Email Providers

**SendGrid:**
```yaml
notifications:
  channels:
    email:
      provider: "sendgrid"
      api_key_env: "SENDGRID_API_KEY"
```

**AWS SES:**
```yaml
notifications:
  channels:
    email:
      provider: "ses"
      region: "us-east-1"
      access_key_env: "AWS_ACCESS_KEY"
      secret_key_env: "AWS_SECRET_KEY"
```

**Mailgun:**
```yaml
notifications:
  channels:
    email:
      provider: "mailgun"
      api_key_env: "MAILGUN_API_KEY"
      domain: "mail.company.com"
```

### Email Formatting

```yaml
notifications:
  channels:
    email:
      formatting:
        format: "html"  # "html" | "text" | "both"
        template_dir: "./templates/email"

      # Threading
      threading:
        enabled: true
        by: "feature"  # Group by feature
```

---

## SMS

### Twilio Setup

```yaml
notifications:
  channels:
    sms:
      enabled: true
      provider: "twilio"

      twilio:
        account_sid_env: "TWILIO_ACCOUNT_SID"
        auth_token_env: "TWILIO_AUTH_TOKEN"
        from_number: "+15551234567"

      # Only for critical alerts
      events:
        - "deploy.failed"
        - "security.critical"
        - "system.down"
```

### Rate Limiting

```yaml
notifications:
  channels:
    sms:
      rate_limit:
        max_per_hour: 10
        max_per_day: 50
```

---

## Push Notifications

### Web Push

```yaml
notifications:
  channels:
    push:
      enabled: true
      provider: "web-push"

      vapid:
        public_key_env: "VAPID_PUBLIC_KEY"
        private_key_env: "VAPID_PRIVATE_KEY"
        subject: "mailto:admin@company.com"
```

### Firebase Cloud Messaging

```yaml
notifications:
  channels:
    push:
      enabled: true
      provider: "fcm"

      firebase:
        credentials_file: "./firebase-credentials.json"
        # Or
        project_id_env: "FIREBASE_PROJECT_ID"
        private_key_env: "FIREBASE_PRIVATE_KEY"
        client_email_env: "FIREBASE_CLIENT_EMAIL"
```

---

## Custom Webhooks

### Configuration

```yaml
notifications:
  channels:
    custom:
      - name: "pagerduty"
        url_env: "PAGERDUTY_URL"
        method: "POST"
        headers:
          Authorization: "Token token=${PAGERDUTY_TOKEN}"
        events:
          - "deploy.failed"
          - "security.critical"

      - name: "internal-api"
        url: "https://api.internal.com/notifications"
        method: "POST"
        auth:
          type: "bearer"
          token_env: "INTERNAL_API_TOKEN"
```

---

## Channel Priority

### Priority Routing

```yaml
notifications:
  priority:
    critical:
      channels: ["sms", "slack", "email"]
      immediate: true

    high:
      channels: ["slack", "email"]
      immediate: true

    normal:
      channels: ["slack"]
      batching: true

    low:
      channels: ["email"]
      batching: true
      digest: "daily"
```

---

## Channel Health

### Monitoring

```yaml
notifications:
  monitoring:
    health_check:
      enabled: true
      interval: "5m"

    fallback:
      # If primary fails, use fallback
      slack: "email"
      email: "sms"
```

### Health Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Notification Channel Health                                 │
├─────────────────────────────────────────────────────────────┤
│ Slack        │ ✅ Healthy  │ 99.9% delivery │ 245ms avg    │
│ Discord      │ ✅ Healthy  │ 99.8% delivery │ 312ms avg    │
│ Email        │ ✅ Healthy  │ 99.5% delivery │ 1.2s avg     │
│ SMS          │ ⚠️ Degraded │ 95.2% delivery │ 2.4s avg     │
│ Push         │ ✅ Healthy  │ 98.7% delivery │ 456ms avg    │
└─────────────────────────────────────────────────────────────┘
```

---

## Commands

```bash
# List channels
proagents notifications channels list

# Test channel
proagents notifications channels test slack

# Check health
proagents notifications channels health

# Enable/disable channel
proagents notifications channels enable email
proagents notifications channels disable sms

# View channel stats
proagents notifications channels stats --last 7d
```
