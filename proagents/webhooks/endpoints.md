# Webhook Endpoint Configuration

Configure and manage webhook endpoints.

---

## Basic Configuration

### Single Endpoint

```yaml
webhooks:
  endpoints:
    - name: "my-webhook"
      url: "https://api.example.com/webhooks"
      events: ["feature.completed", "deploy.success"]
```

### Multiple Endpoints

```yaml
webhooks:
  endpoints:
    # Slack for notifications
    - name: "slack-dev"
      url: "https://hooks.slack.com/services/xxx"
      events: ["feature.*", "test.failed"]

    # Discord for team updates
    - name: "discord-team"
      url: "https://discord.com/api/webhooks/xxx"
      events: ["deploy.*"]

    # Custom API for all events
    - name: "analytics-api"
      url: "https://analytics.company.com/events"
      events: ["*"]
```

---

## Authentication

### Bearer Token

```yaml
webhooks:
  endpoints:
    - name: "secure-api"
      url: "https://api.example.com/webhooks"
      auth:
        type: "bearer"
        token_env: "WEBHOOK_API_TOKEN"
```

### Basic Auth

```yaml
webhooks:
  endpoints:
    - name: "basic-auth-api"
      url: "https://api.example.com/webhooks"
      auth:
        type: "basic"
        username_env: "WEBHOOK_USER"
        password_env: "WEBHOOK_PASS"
```

### Custom Headers

```yaml
webhooks:
  endpoints:
    - name: "custom-header-api"
      url: "https://api.example.com/webhooks"
      headers:
        X-API-Key: "${WEBHOOK_API_KEY}"
        X-Custom-Header: "proagents"
```

### HMAC Signature

```yaml
webhooks:
  endpoints:
    - name: "signed-webhook"
      url: "https://api.example.com/webhooks"
      signature:
        enabled: true
        algorithm: "sha256"
        secret_env: "WEBHOOK_SECRET"
        header: "X-ProAgents-Signature"
```

---

## Event Filtering

### Wildcard Patterns

```yaml
webhooks:
  endpoints:
    - name: "all-events"
      events: ["*"]                    # All events

    - name: "feature-events"
      events: ["feature.*"]            # All feature events

    - name: "specific-events"
      events:
        - "feature.completed"
        - "deploy.success"
        - "test.failed"
```

### Conditional Filtering

```yaml
webhooks:
  endpoints:
    - name: "production-only"
      url: "https://api.example.com/webhooks"
      events: ["deploy.*"]
      filters:
        environment: "production"

    - name: "critical-only"
      url: "https://alerts.example.com/webhooks"
      events: ["*"]
      filters:
        severity: ["critical", "high"]
```

### Branch Filtering

```yaml
webhooks:
  endpoints:
    - name: "main-branch-only"
      url: "https://api.example.com/webhooks"
      events: ["deploy.*", "pr.merged"]
      filters:
        branches:
          - "main"
          - "release/*"
```

---

## Request Configuration

### Timeout & Retries

```yaml
webhooks:
  endpoints:
    - name: "reliable-webhook"
      url: "https://api.example.com/webhooks"
      events: ["*"]
      request:
        timeout: 30000          # 30 seconds
        retries: 3
        retry_delay: 5000       # 5 seconds between retries
        retry_backoff: "exponential"
```

### Custom Payload

```yaml
webhooks:
  endpoints:
    - name: "custom-format"
      url: "https://api.example.com/webhooks"
      events: ["feature.completed"]
      transform:
        template: |
          {
            "type": "proagents_event",
            "event_name": "{{event}}",
            "feature": "{{data.feature_name}}",
            "timestamp": "{{timestamp}}"
          }
```

### Batch Delivery

```yaml
webhooks:
  endpoints:
    - name: "batched-webhook"
      url: "https://api.example.com/webhooks/batch"
      events: ["*"]
      batching:
        enabled: true
        max_size: 100           # Max events per batch
        max_wait: 10000         # Max wait time (ms)
```

---

## Environment-Specific

### Per-Environment Webhooks

```yaml
webhooks:
  environments:
    development:
      endpoints:
        - name: "dev-slack"
          url: "${DEV_SLACK_WEBHOOK}"
          events: ["*"]

    staging:
      endpoints:
        - name: "staging-slack"
          url: "${STAGING_SLACK_WEBHOOK}"
          events: ["deploy.*", "test.failed"]

    production:
      endpoints:
        - name: "prod-slack"
          url: "${PROD_SLACK_WEBHOOK}"
          events: ["deploy.*", "security.*"]

        - name: "pagerduty"
          url: "https://events.pagerduty.com/v2/enqueue"
          events: ["deploy.failed", "security.vulnerability.critical"]
```

---

## Endpoint Management

### Enable/Disable

```yaml
webhooks:
  endpoints:
    - name: "maintenance-mode"
      url: "https://api.example.com/webhooks"
      enabled: false              # Temporarily disabled
      events: ["*"]
```

### Maintenance Windows

```yaml
webhooks:
  endpoints:
    - name: "business-hours-only"
      url: "https://api.example.com/webhooks"
      events: ["*"]
      schedule:
        enabled_hours: "09:00-18:00"
        enabled_days: ["mon", "tue", "wed", "thu", "fri"]
        timezone: "America/New_York"
```

---

## Commands

```bash
# List all endpoints
proagents webhooks list

# Add endpoint
proagents webhooks add \
  --name "new-webhook" \
  --url "https://api.example.com/webhooks" \
  --events "feature.*,deploy.*"

# Update endpoint
proagents webhooks update new-webhook --events "*"

# Remove endpoint
proagents webhooks remove new-webhook

# Enable/disable
proagents webhooks enable new-webhook
proagents webhooks disable new-webhook

# Test endpoint
proagents webhooks test new-webhook --event feature.completed
```

---

## Best Practices

1. **Use Environment Variables**: Never hardcode URLs or secrets
2. **Filter Events**: Only subscribe to events you need
3. **Set Timeouts**: Prevent hanging connections
4. **Enable Retries**: Handle transient failures
5. **Use Signatures**: Verify webhook authenticity
6. **Monitor Health**: Track delivery success rates
