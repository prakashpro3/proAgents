# Webhooks

Event-driven integrations for ProAgents workflow events.

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Webhook Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ProAgents Events                                           │
│  ┌─────────────────┐                                       │
│  │ feature.started │──┐                                    │
│  │ phase.completed │──┤                                    │
│  │ test.failed     │──┼───► Webhook Dispatcher             │
│  │ deploy.success  │──┤         │                          │
│  │ pr.created      │──┘         │                          │
│  └─────────────────┘            ▼                          │
│                         ┌──────────────┐                   │
│                         │   Endpoint   │                   │
│                         │   Registry   │                   │
│                         └──────┬───────┘                   │
│                                │                            │
│                    ┌───────────┼───────────┐               │
│                    ▼           ▼           ▼               │
│              ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│              │ Slack   │ │ Discord │ │ Custom  │          │
│              │ Webhook │ │ Webhook │ │ API     │          │
│              └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Configure Webhook

```yaml
# proagents.config.yaml
webhooks:
  enabled: true

  endpoints:
    - name: "slack-notifications"
      url: "https://hooks.slack.com/services/xxx"
      events: ["feature.*", "deploy.*"]

    - name: "custom-api"
      url: "https://api.company.com/webhooks/proagents"
      events: ["*"]
      auth:
        type: "bearer"
        token_env: "WEBHOOK_TOKEN"
```

### 2. Test Webhook

```bash
# Send test event
proagents webhooks test slack-notifications

# Verify delivery
proagents webhooks history --endpoint slack-notifications
```

---

## Available Events

| Category | Events |
|----------|--------|
| **Feature** | `feature.started`, `feature.paused`, `feature.resumed`, `feature.completed` |
| **Phase** | `phase.started`, `phase.completed`, `phase.skipped` |
| **Analysis** | `analysis.started`, `analysis.completed`, `analysis.cached` |
| **Testing** | `test.started`, `test.passed`, `test.failed`, `coverage.changed` |
| **Review** | `review.requested`, `review.approved`, `review.rejected` |
| **Deploy** | `deploy.started`, `deploy.success`, `deploy.failed`, `rollback.triggered` |
| **Git** | `branch.created`, `commit.pushed`, `pr.created`, `pr.merged` |
| **Security** | `security.scan.completed`, `vulnerability.found`, `vulnerability.fixed` |
| **Approval** | `approval.requested`, `approval.granted`, `approval.denied` |

---

## Documentation

- [Endpoint Configuration](./endpoints.md) - Configure webhook endpoints
- [Event Reference](./events.md) - Complete event documentation
- [Payload Format](./payloads.md) - Request/response formats
- [Security](./security.md) - Authentication and verification
- [Retry & Reliability](./reliability.md) - Delivery guarantees

---

## Commands

```bash
# List configured webhooks
proagents webhooks list

# Test webhook delivery
proagents webhooks test <endpoint-name>

# View delivery history
proagents webhooks history

# Replay failed deliveries
proagents webhooks replay --failed

# Disable webhook temporarily
proagents webhooks disable <endpoint-name>
```

---

## Best Practices

1. **Use Event Filtering**: Subscribe only to needed events
2. **Implement Idempotency**: Handle duplicate deliveries
3. **Verify Signatures**: Always validate webhook signatures
4. **Handle Failures**: Implement proper error handling
5. **Monitor Deliveries**: Track webhook health and latency
