# Webhook Payload Format

Standard payload structure and customization options.

---

## Standard Payload Structure

### Base Format

```json
{
  "id": "evt_abc123def456",
  "event": "feature.completed",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "version": "1.0",
  "source": {
    "project": "my-project",
    "environment": "production",
    "proagents_version": "2.5.0"
  },
  "data": {
    // Event-specific data
  },
  "metadata": {
    "delivery_attempt": 1,
    "idempotency_key": "idem_xyz789"
  }
}
```

---

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique event identifier |
| `event` | string | Event type (e.g., `feature.completed`) |
| `timestamp` | ISO 8601 | Event occurrence time |
| `version` | string | Payload schema version |
| `source.project` | string | Project name |
| `source.environment` | string | Environment (dev/staging/prod) |
| `source.proagents_version` | string | ProAgents version |
| `data` | object | Event-specific payload |
| `metadata.delivery_attempt` | number | Delivery attempt number |
| `metadata.idempotency_key` | string | Key for deduplication |

---

## Custom Payload Transformation

### Template-Based

```yaml
webhooks:
  endpoints:
    - name: "slack-webhook"
      url: "https://hooks.slack.com/services/xxx"
      events: ["feature.completed"]
      transform:
        template: |
          {
            "text": "Feature {{data.feature_name}} completed!",
            "attachments": [
              {
                "color": "good",
                "fields": [
                  {
                    "title": "Duration",
                    "value": "{{data.duration_minutes}} minutes",
                    "short": true
                  },
                  {
                    "title": "Files Changed",
                    "value": "{{data.files_changed}}",
                    "short": true
                  }
                ]
              }
            ]
          }
```

### Field Mapping

```yaml
webhooks:
  endpoints:
    - name: "custom-api"
      url: "https://api.example.com/webhooks"
      events: ["*"]
      transform:
        mapping:
          event_type: "event"
          occurred_at: "timestamp"
          project_name: "source.project"
          payload: "data"
```

### JavaScript Transform

```yaml
webhooks:
  endpoints:
    - name: "transformed-webhook"
      url: "https://api.example.com/webhooks"
      events: ["*"]
      transform:
        script: |
          function transform(payload) {
            return {
              type: payload.event,
              time: new Date(payload.timestamp).getTime(),
              info: payload.data,
              tags: [payload.source.project, payload.source.environment]
            };
          }
```

---

## Platform-Specific Formats

### Slack Format

```yaml
webhooks:
  endpoints:
    - name: "slack"
      url: "https://hooks.slack.com/services/xxx"
      format: "slack"
      events: ["feature.*", "deploy.*"]
```

**Auto-Generated Slack Payload:**
```json
{
  "text": "ProAgents Event: feature.completed",
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
    }
  ]
}
```

### Discord Format

```yaml
webhooks:
  endpoints:
    - name: "discord"
      url: "https://discord.com/api/webhooks/xxx"
      format: "discord"
      events: ["feature.*", "deploy.*"]
```

**Auto-Generated Discord Payload:**
```json
{
  "content": "ProAgents Event",
  "embeds": [
    {
      "title": "Feature Completed",
      "color": 5763719,
      "fields": [
        {
          "name": "Feature",
          "value": "User Authentication",
          "inline": true
        },
        {
          "name": "Duration",
          "value": "4 hours",
          "inline": true
        }
      ],
      "timestamp": "2024-01-15T14:30:00.000Z"
    }
  ]
}
```

### Microsoft Teams Format

```yaml
webhooks:
  endpoints:
    - name: "teams"
      url: "https://outlook.office.com/webhook/xxx"
      format: "teams"
      events: ["feature.*", "deploy.*"]
```

**Auto-Generated Teams Payload:**
```json
{
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "summary": "ProAgents Event: feature.completed",
  "themeColor": "0076D7",
  "title": "Feature Completed",
  "sections": [
    {
      "facts": [
        {
          "name": "Feature",
          "value": "User Authentication"
        },
        {
          "name": "Duration",
          "value": "4 hours"
        }
      ]
    }
  ]
}
```

---

## Payload Size Limits

### Default Limits

```yaml
webhooks:
  limits:
    max_payload_size: "1MB"
    max_array_items: 100
    truncate_strings: 10000
```

### Large Payload Handling

```yaml
webhooks:
  endpoints:
    - name: "large-payload-api"
      url: "https://api.example.com/webhooks"
      events: ["*"]
      large_payload:
        # If payload exceeds limit
        action: "link"  # "truncate" | "link" | "split"

        # For "link" action
        storage: "s3"
        bucket: "proagents-webhooks"
        expiry: "24h"
```

**Linked Payload Example:**
```json
{
  "id": "evt_abc123",
  "event": "analysis.completed",
  "timestamp": "2024-01-15T14:30:00Z",
  "payload_truncated": true,
  "payload_url": "https://s3.amazonaws.com/proagents-webhooks/evt_abc123.json",
  "payload_expires": "2024-01-16T14:30:00Z"
}
```

---

## Response Handling

### Expected Response

```json
{
  "status": "received",
  "id": "your-internal-id"
}
```

### Response Processing

```yaml
webhooks:
  endpoints:
    - name: "response-aware"
      url: "https://api.example.com/webhooks"
      events: ["*"]
      response:
        # Expect acknowledgment
        expect_ack: true

        # Success status codes
        success_codes: [200, 201, 202]

        # Parse response
        parse_response: true

        # Store response
        log_response: true
```

---

## Best Practices

1. **Idempotent Processing**: Use `metadata.idempotency_key` for deduplication
2. **Verify Event ID**: Check `id` to prevent duplicate processing
3. **Handle Large Payloads**: Implement proper handling for large data
4. **Respond Quickly**: Acknowledge webhooks quickly, process async
5. **Log Webhooks**: Keep records for debugging
