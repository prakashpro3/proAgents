# Feature Flags

Control feature rollouts, A/B testing, and kill switches.

---

## Overview

Feature flags enable safe deployments by decoupling code deployment from feature release.

## Documentation

| Document | Description |
|----------|-------------|
| [Flag Configuration](./configuration.md) | Setting up feature flags |
| [Rollout Strategies](./rollout-strategies.md) | Gradual rollout patterns |
| [A/B Testing](./ab-testing.md) | Experimentation with flags |
| [Kill Switches](./kill-switches.md) | Emergency flag controls |

---

## Quick Start

### Define a Flag

```yaml
# proagents.config.yaml
feature_flags:
  flags:
    new_checkout_flow:
      description: "New checkout experience"
      default: false

      # Rollout configuration
      rollout:
        type: "percentage"
        value: 25  # 25% of users

      # Environment overrides
      environments:
        development: true
        staging: true
        production: false
```

### Use in Code

```typescript
import { useFeatureFlag } from '@proagents/flags';

function CheckoutPage() {
  const newCheckout = useFeatureFlag('new_checkout_flow');

  if (newCheckout) {
    return <NewCheckoutFlow />;
  }
  return <LegacyCheckout />;
}
```

---

## Flag Types

### Boolean Flags

```yaml
feature_flags:
  flags:
    dark_mode:
      type: "boolean"
      default: false
```

### Percentage Rollout

```yaml
feature_flags:
  flags:
    new_feature:
      type: "percentage"
      rollout:
        value: 50  # 50% of users
        sticky: true  # Same user always gets same value
```

### User Targeting

```yaml
feature_flags:
  flags:
    beta_feature:
      type: "targeted"
      targets:
        # Specific users
        users:
          - "user-123"
          - "user-456"

        # User attributes
        attributes:
          - key: "plan"
            value: "enterprise"
          - key: "country"
            value: ["US", "CA"]
```

### Scheduled Flags

```yaml
feature_flags:
  flags:
    holiday_theme:
      type: "scheduled"
      schedule:
        start: "2024-12-20T00:00:00Z"
        end: "2024-12-26T23:59:59Z"
```

---

## Rollout Strategies

### Canary Release

```yaml
feature_flags:
  flags:
    new_api:
      rollout:
        strategy: "canary"
        stages:
          - percentage: 1
            duration: "1h"
          - percentage: 10
            duration: "4h"
          - percentage: 50
            duration: "1d"
          - percentage: 100

        # Auto-rollback on errors
        rollback:
          error_threshold: 5  # percent
          auto_rollback: true
```

### Ring Deployment

```yaml
feature_flags:
  flags:
    infrastructure_change:
      rollout:
        strategy: "ring"
        rings:
          - name: "internal"
            targets: ["@employees"]
          - name: "beta"
            targets: ["@beta_users"]
          - name: "early_adopters"
            percentage: 10
          - name: "general"
            percentage: 100
```

---

## Commands

```bash
# List all flags
proagents flags list

# Check flag status
proagents flags status new_checkout_flow

# Enable flag
proagents flags enable new_checkout_flow --env production

# Disable flag (kill switch)
proagents flags disable new_checkout_flow --env production

# Set rollout percentage
proagents flags rollout new_checkout_flow 50

# View flag history
proagents flags history new_checkout_flow
```

---

## Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Feature Flags                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Active Flags: 12                                            │
│                                                             │
│ Flag                    Dev    Staging   Prod    Rollout   │
│ ─────────────────────────────────────────────────────────  │
│ new_checkout_flow       ✅      ✅        🔄      25%      │
│ dark_mode               ✅      ✅        ✅      100%     │
│ beta_dashboard          ✅      ✅        ❌      0%       │
│ experimental_api        ✅      ❌        ❌      0%       │
│                                                             │
│ Recent Changes:                                             │
│ • new_checkout_flow: 10% → 25% (2h ago)                    │
│ • dark_mode: enabled in prod (1d ago)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Kill Switch

### Emergency Disable

```bash
# Immediate disable
proagents flags kill new_checkout_flow

# With notification
proagents flags kill new_checkout_flow \
  --notify "#incidents" \
  --reason "Performance issues detected"
```

### Auto-Kill Rules

```yaml
feature_flags:
  flags:
    new_feature:
      kill_switch:
        enabled: true

        triggers:
          - metric: "error_rate"
            threshold: 5  # percent

          - metric: "latency_p99"
            threshold: 3000  # ms

          - metric: "user_complaints"
            threshold: 10
            window: "1h"
```

---

## Best Practices

1. **Name Clearly**: `new_checkout_flow` not `flag_123`
2. **Set Defaults**: Always have a safe default
3. **Clean Up**: Remove flags after full rollout
4. **Document Purpose**: Explain what each flag controls
5. **Monitor Impact**: Track metrics per flag state
6. **Have Kill Switches**: Always be able to disable quickly
7. **Test Both States**: Test with flag on AND off
8. **Limit Active Flags**: Too many creates complexity
