# AI Model Fallbacks

Configure fallback strategies when primary AI models are unavailable.

---

## Fallback Chain

```
┌─────────────────────────────────────────────────────────────┐
│                    Fallback Chain                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Request ──▶ Primary Model                                  │
│                   │                                         │
│              [Available?]                                   │
│              /         \                                    │
│           Yes           No                                  │
│            │             │                                  │
│            ▼             ▼                                  │
│         Process    Secondary Model                          │
│                         │                                   │
│                    [Available?]                             │
│                    /         \                              │
│                 Yes           No                            │
│                  │             │                            │
│                  ▼             ▼                            │
│              Process     Tertiary Model                     │
│                               │                             │
│                          [Continue...]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

### Fallback Chain Setup

```yaml
ai:
  fallbacks:
    enabled: true

    # Primary chain
    chain:
      - model: "claude-3-opus"
        provider: "anthropic"
      - model: "gpt-4-turbo"
        provider: "openai"
      - model: "claude-3-sonnet"
        provider: "anthropic"
      - model: "gpt-4"
        provider: "openai"
      - model: "claude-3-haiku"
        provider: "anthropic"

    # When to trigger fallback
    triggers:
      - "rate_limit"
      - "timeout"
      - "service_unavailable"
      - "model_overloaded"
      - "quota_exceeded"
```

### Provider-Specific Settings

```yaml
ai:
  providers:
    anthropic:
      api_key_env: "ANTHROPIC_API_KEY"
      timeout: 30000
      max_retries: 2

    openai:
      api_key_env: "OPENAI_API_KEY"
      timeout: 30000
      max_retries: 2

    google:
      api_key_env: "GOOGLE_AI_KEY"
      timeout: 30000
      max_retries: 2
```

---

## Fallback Triggers

### Automatic Triggers

| Trigger | Description | Action |
|---------|-------------|--------|
| `rate_limit` | API rate limit hit | Immediate fallback |
| `timeout` | Request timed out | Retry then fallback |
| `service_unavailable` | 503 error | Immediate fallback |
| `model_overloaded` | Model capacity | Immediate fallback |
| `quota_exceeded` | Billing limit | Fallback + alert |
| `error_5xx` | Server errors | Retry then fallback |

### Configuration

```yaml
ai:
  fallbacks:
    triggers:
      rate_limit:
        action: "immediate_fallback"
        notify: false

      timeout:
        threshold: 30000  # ms
        retry_count: 1
        action: "retry_then_fallback"

      quota_exceeded:
        action: "fallback_and_alert"
        alert_channel: "slack:#ai-alerts"
```

---

## Retry Logic

### Retry Configuration

```yaml
ai:
  fallbacks:
    retry:
      enabled: true
      max_attempts: 3

      # Backoff strategy
      backoff:
        type: "exponential"  # exponential, linear, fixed
        initial_delay: 1000  # ms
        max_delay: 10000     # ms
        multiplier: 2

      # Retry conditions
      retry_on:
        - "timeout"
        - "error_5xx"
        - "network_error"

      # Don't retry these
      no_retry:
        - "rate_limit"
        - "invalid_request"
        - "auth_error"
```

### Retry Flow

```
Request Failed
     │
     ▼
[Retryable Error?]
     │
    Yes ──▶ Wait (backoff) ──▶ Retry
     │              │
     │         [Max Attempts?]
     │              │
     │             Yes ──▶ Fallback to Next Model
     │              │
     │             No ──▶ Retry Again
     │
    No ──▶ Fallback Immediately
```

---

## Graceful Degradation

### Quality Tiers

```yaml
ai:
  fallbacks:
    degradation:
      # Define quality tiers
      tiers:
        premium:
          models: ["claude-3-opus", "gpt-4-turbo"]
          features: ["full"]

        standard:
          models: ["claude-3-sonnet", "gpt-4"]
          features: ["full"]

        basic:
          models: ["claude-3-haiku", "gpt-3.5-turbo"]
          features: ["limited"]
          disabled:
            - "complex_analysis"
            - "large_context"

      # Notify on degradation
      notify_on_degradation: true
      notification_channel: "slack:#ai-status"
```

### Feature Limitations

```yaml
ai:
  fallbacks:
    degradation:
      feature_fallbacks:
        # If complex analysis unavailable
        complex_analysis:
          fallback_to: "basic_analysis"
          notify: true

        # If large context unavailable
        large_context:
          fallback_to: "chunked_processing"
          max_chunk_size: 4000
```

---

## Health Monitoring

### Provider Health Checks

```yaml
ai:
  health:
    enabled: true
    check_interval: "60s"

    checks:
      anthropic:
        endpoint: "https://api.anthropic.com/health"
        timeout: 5000

      openai:
        endpoint: "https://api.openai.com/v1/models"
        timeout: 5000

    # Pre-emptive fallback
    preemptive:
      enabled: true
      unhealthy_threshold: 3  # consecutive failures
```

### Health Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ AI Provider Health                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Anthropic                                                   │
│ ├── claude-3-opus:   ✅ Healthy (45ms)                     │
│ ├── claude-3-sonnet: ✅ Healthy (32ms)                     │
│ └── claude-3-haiku:  ✅ Healthy (28ms)                     │
│                                                             │
│ OpenAI                                                      │
│ ├── gpt-4-turbo:     ✅ Healthy (120ms)                    │
│ ├── gpt-4:           ⚠️ Degraded (850ms)                   │
│ └── gpt-3.5-turbo:   ✅ Healthy (95ms)                     │
│                                                             │
│ Current Routing: claude-3-opus (primary)                    │
│ Fallback Ready: gpt-4-turbo                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Fallback Logging

### Log Events

```yaml
ai:
  fallbacks:
    logging:
      enabled: true

      log_events:
        - "fallback_triggered"
        - "retry_attempt"
        - "provider_switch"
        - "degradation_activated"

      include:
        - "original_model"
        - "fallback_model"
        - "trigger_reason"
        - "latency"
```

### Log Example

```json
{
  "event": "fallback_triggered",
  "timestamp": "2024-01-15T10:30:00Z",
  "original_model": "claude-3-opus",
  "fallback_model": "gpt-4-turbo",
  "trigger": "rate_limit",
  "retry_attempts": 0,
  "latency_impact": "+150ms"
}
```

---

## Commands

```bash
# Check fallback status
proagents ai fallback-status

# Test fallback chain
proagents ai test-fallback

# Force fallback (for testing)
proagents ai use-fallback --model gpt-4

# View fallback history
proagents ai fallback-history --last 24h
```

---

## Best Practices

1. **Multiple Providers**: Use models from different providers
2. **Similar Capabilities**: Fallback models should have similar features
3. **Monitor Costs**: Track cost differences between models
4. **Test Regularly**: Periodically test fallback chain
5. **Alert on Fallback**: Know when primary is unavailable
6. **Graceful Degradation**: Plan for reduced capabilities
