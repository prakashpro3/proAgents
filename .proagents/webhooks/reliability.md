# Webhook Reliability

Retry logic, delivery guarantees, and failure handling.

---

## Delivery Guarantees

### At-Least-Once Delivery

ProAgents guarantees at-least-once delivery:

- Every event will be delivered at least once
- Duplicate deliveries may occur
- Use idempotency keys for deduplication

```json
{
  "id": "evt_abc123",
  "metadata": {
    "idempotency_key": "idem_xyz789"
  }
}
```

---

## Retry Configuration

### Basic Retry

```yaml
webhooks:
  endpoints:
    - name: "reliable-webhook"
      url: "https://api.example.com/webhooks"
      retry:
        enabled: true
        max_attempts: 5
        initial_delay: 1000    # 1 second
        max_delay: 300000      # 5 minutes
        backoff: "exponential"
```

### Backoff Strategies

**Exponential Backoff:**
```yaml
retry:
  backoff: "exponential"
  initial_delay: 1000
  multiplier: 2
  max_delay: 300000

# Retry schedule: 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s, 300s (capped)
```

**Linear Backoff:**
```yaml
retry:
  backoff: "linear"
  initial_delay: 5000
  increment: 5000
  max_delay: 60000

# Retry schedule: 5s, 10s, 15s, 20s, 25s, ... 60s (capped)
```

**Fixed Delay:**
```yaml
retry:
  backoff: "fixed"
  delay: 30000

# Retry schedule: 30s, 30s, 30s, 30s, ...
```

### Jitter

```yaml
retry:
  backoff: "exponential"
  jitter:
    enabled: true
    type: "full"  # "full" | "equal" | "decorrelated"

# Adds randomness to prevent thundering herd
```

---

## Failure Handling

### Failure Detection

```yaml
webhooks:
  endpoints:
    - name: "monitored-webhook"
      url: "https://api.example.com/webhooks"
      failure_detection:
        # Status codes considered failures
        failure_codes: [500, 502, 503, 504]

        # Timeout
        timeout: 30000  # 30 seconds

        # Connection errors are always failures
        connection_errors: true
```

### Dead Letter Queue

```yaml
webhooks:
  dead_letter:
    enabled: true

    # After max retries, send to DLQ
    after_max_retries: true

    # DLQ destination
    queue:
      type: "database"  # "database" | "sqs" | "redis"

    # Retention
    retention: "7d"

    # Alerting
    alert_on_dlq: true
    alert_threshold: 10
```

### Circuit Breaker

```yaml
webhooks:
  endpoints:
    - name: "circuit-breaker-webhook"
      url: "https://api.example.com/webhooks"
      circuit_breaker:
        enabled: true

        # Open circuit after N consecutive failures
        failure_threshold: 5

        # Time to wait before trying again
        reset_timeout: 60000  # 1 minute

        # Half-open: allow limited requests
        half_open_requests: 3
```

**Circuit States:**
```
Closed (Normal)
     │
     │ 5 consecutive failures
     ▼
   Open (No requests sent)
     │
     │ 60 seconds
     ▼
Half-Open (Limited requests)
     │
     ├── Success → Closed
     └── Failure → Open
```

---

## Monitoring

### Health Metrics

```yaml
webhooks:
  monitoring:
    metrics:
      enabled: true
      export:
        - "prometheus"
        - "datadog"

    # Tracked metrics
    track:
      - "delivery_success_rate"
      - "delivery_latency"
      - "retry_count"
      - "dlq_size"
      - "circuit_breaker_state"
```

### Health Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Webhook Health - Last 24 Hours                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Endpoint: slack-notifications                               │
│ Status: ✅ Healthy                                          │
│                                                             │
│ Deliveries: 1,234                                           │
│ Success Rate: 99.5%                                         │
│ Avg Latency: 245ms                                          │
│ Retries: 12                                                 │
│ Failed (DLQ): 2                                             │
│                                                             │
│ Circuit Breaker: Closed                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Endpoint: custom-api                                        │
│ Status: ⚠️ Degraded                                         │
│                                                             │
│ Deliveries: 567                                             │
│ Success Rate: 85.2%                                         │
│ Avg Latency: 2,450ms                                        │
│ Retries: 156                                                │
│ Failed (DLQ): 45                                            │
│                                                             │
│ Circuit Breaker: Half-Open                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Alerting

```yaml
webhooks:
  alerting:
    channels:
      - type: "slack"
        webhook: "${ALERT_SLACK_WEBHOOK}"
      - type: "email"
        recipients: ["devops@company.com"]

    rules:
      - name: "high_failure_rate"
        condition: "success_rate < 95%"
        duration: "5m"
        severity: "warning"

      - name: "circuit_open"
        condition: "circuit_breaker == open"
        severity: "critical"

      - name: "dlq_growing"
        condition: "dlq_size > 100"
        severity: "warning"
```

---

## Manual Intervention

### Replay Failed Webhooks

```bash
# Replay all failed webhooks
proagents webhooks replay --failed

# Replay specific event
proagents webhooks replay --event-id evt_abc123

# Replay from DLQ
proagents webhooks replay --dlq --last 24h

# Dry run
proagents webhooks replay --failed --dry-run
```

### Manual Trigger

```bash
# Manually send webhook
proagents webhooks send \
  --endpoint slack-notifications \
  --event feature.completed \
  --data '{"feature_name": "test"}'
```

### Pause/Resume

```bash
# Pause webhook delivery
proagents webhooks pause slack-notifications

# Resume
proagents webhooks resume slack-notifications

# Pause all
proagents webhooks pause --all
```

---

## Delivery History

### Query History

```bash
# View recent deliveries
proagents webhooks history

# Filter by endpoint
proagents webhooks history --endpoint slack-notifications

# Filter by status
proagents webhooks history --status failed

# Filter by date
proagents webhooks history --from "2024-01-01" --to "2024-01-15"

# Export
proagents webhooks history --export csv > webhooks.csv
```

### History Record

```json
{
  "id": "del_abc123",
  "event_id": "evt_xyz789",
  "endpoint": "slack-notifications",
  "url": "https://hooks.slack.com/services/xxx",
  "timestamp": "2024-01-15T14:30:00Z",
  "status": "success",
  "attempts": 1,
  "latency_ms": 245,
  "request": {
    "method": "POST",
    "headers": {...},
    "body_size": 1234
  },
  "response": {
    "status_code": 200,
    "body": "ok"
  }
}
```

---

## Best Practices

### For Senders (ProAgents)

1. **Implement Retries**: Always retry failed deliveries
2. **Use Exponential Backoff**: Prevent overwhelming endpoints
3. **Add Jitter**: Avoid thundering herd
4. **Use Circuit Breakers**: Protect unhealthy endpoints
5. **Monitor Health**: Track success rates and latency
6. **Provide DLQ**: Store failed events for replay

### For Receivers

1. **Respond Quickly**: Return 2xx immediately, process async
2. **Be Idempotent**: Handle duplicate deliveries gracefully
3. **Log Everything**: Keep records for debugging
4. **Handle Failures**: Return appropriate error codes
5. **Use Queues**: Queue webhooks for reliable processing
6. **Monitor**: Track incoming webhook health
