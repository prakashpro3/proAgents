# Kill Switches

Emergency controls for instantly disabling features.

---

## What Are Kill Switches?

Kill switches are feature flags designed for emergency use. They allow instant disabling of features without code deployment.

| Regular Flag | Kill Switch |
|--------------|-------------|
| Gradual rollout | Instant toggle |
| A/B testing | Emergency only |
| User targeting | All-or-nothing |
| Complex rules | Simple on/off |

---

## Kill Switch Configuration

### Basic Definition

```yaml
# proagents.config.yaml
feature_flags:
  kill_switches:
    # Payment processing
    payments_enabled:
      description: "Master switch for all payment processing"
      default: true
      critical: true
      notify_on_change: ["#payments", "oncall"]

    # External integrations
    third_party_api_enabled:
      description: "Toggle external API integrations"
      default: true
      dependencies:
        - "analytics_enabled"
        - "notifications_enabled"

    # Feature-specific
    ai_features_enabled:
      description: "All AI/ML powered features"
      default: true
      fallback_behavior: "graceful_degradation"
```

### Hierarchical Kill Switches

```yaml
feature_flags:
  kill_switches:
    # Master switches
    master:
      api_enabled:
        description: "Master API switch"
        affects: ["*"]

      frontend_features:
        description: "All frontend features"
        affects: ["ui/*"]

    # Module-level switches
    modules:
      checkout:
        enabled: true
        parent: "api_enabled"
        affects: ["checkout/*"]

      user_profiles:
        enabled: true
        parent: "api_enabled"
        affects: ["profiles/*"]

    # Feature-level switches
    features:
      express_checkout:
        enabled: true
        parent: "checkout"

      profile_avatars:
        enabled: true
        parent: "user_profiles"
```

---

## Emergency Response

### Automatic Kill Switch Triggers

```yaml
feature_flags:
  kill_switches:
    automation:
      triggers:
        # Error rate trigger
        - name: "high_error_rate"
          condition: "error_rate > 5%"
          window: "5m"
          kill_switch: "affected_feature_enabled"
          action: "disable"
          notify: ["#incidents", "oncall"]

        # Latency trigger
        - name: "high_latency"
          condition: "p99_latency > 5000ms"
          window: "10m"
          kill_switch: "slow_feature_enabled"
          action: "disable"

        # External dependency failure
        - name: "external_api_down"
          condition: "external_api_success_rate < 50%"
          window: "2m"
          kill_switch: "external_integration_enabled"
          action: "disable"

        # Resource exhaustion
        - name: "memory_critical"
          condition: "memory_usage > 95%"
          kill_switch: "memory_intensive_features"
          action: "disable"
```

### Manual Emergency Response

```yaml
feature_flags:
  kill_switches:
    emergency:
      # Quick access
      hotkeys:
        enabled: true
        confirm_required: true

      # Predefined emergency actions
      runbooks:
        - name: "payment_outage"
          switches:
            - "payments_enabled: false"
            - "checkout_enabled: false"
          notify: ["#payments", "#support", "oncall"]
          escalate_to: ["payments-team-lead"]

        - name: "security_incident"
          switches:
            - "user_registration: false"
            - "password_reset: false"
            - "api_tokens_enabled: false"
          notify: ["#security", "#incidents"]
          escalate_to: ["security-team", "cto"]

        - name: "ddos_response"
          switches:
            - "public_api_enabled: false"
            - "rate_limiting: aggressive"
          notify: ["#infrastructure"]
```

---

## Graceful Degradation

### Fallback Behavior

```yaml
feature_flags:
  kill_switches:
    graceful_degradation:
      ai_recommendations:
        when_disabled:
          behavior: "fallback"
          fallback: "popular_items"
          user_message: "Recommendations temporarily unavailable"

      real_time_notifications:
        when_disabled:
          behavior: "queue"
          queue_duration: "1h"
          user_message: null  # Silent degradation

      file_uploads:
        when_disabled:
          behavior: "reject"
          http_status: 503
          user_message: "File uploads temporarily disabled"
          retry_after: "300"
```

### Dependency Handling

```yaml
feature_flags:
  kill_switches:
    dependencies:
      # When parent is disabled, all children are disabled
      cascade:
        payments_enabled:
          children:
            - "subscription_billing"
            - "one_time_payments"
            - "refund_processing"

      # Graceful degradation chain
      degradation_chain:
        - if_disabled: "real_time_sync"
          fallback_to: "polling_sync"
        - if_disabled: "polling_sync"
          fallback_to: "manual_refresh"
        - if_disabled: "manual_refresh"
          show_error: true
```

---

## Access Control

### Who Can Flip Kill Switches?

```yaml
feature_flags:
  kill_switches:
    access:
      # Role-based access
      roles:
        # Critical switches
        critical:
          allowed: ["sre", "tech-lead", "admin"]
          require_reason: true
          require_approval: false  # Emergency use

        # Standard switches
        standard:
          allowed: ["developer", "sre", "tech-lead", "admin"]
          require_reason: true

        # Low-risk switches
        low_risk:
          allowed: ["*"]
          require_reason: false

      # Specific switch overrides
      overrides:
        master_api_switch:
          allowed: ["sre", "cto"]
          require_approval_from: ["cto"]
          except_during: "declared_incident"
```

### Audit Trail

```yaml
feature_flags:
  kill_switches:
    audit:
      # Log all changes
      log_all_changes: true

      # Required fields
      required_fields:
        - "reason"
        - "expected_duration"
        - "incident_ticket"  # Optional but encouraged

      # Retention
      retention: "2 years"

      # Notifications
      notify_on_change:
        channels: ["#kill-switches", "#incidents"]
        include: ["who", "what", "when", "reason"]
```

---

## Recovery Procedures

### Re-enabling Features

```yaml
feature_flags:
  kill_switches:
    recovery:
      # Gradual re-enable
      gradual_recovery:
        enabled: true
        phases:
          - percentage: 10
            duration: "5m"
            verify: ["error_rate < 1%"]

          - percentage: 50
            duration: "10m"
            verify: ["error_rate < 0.5%"]

          - percentage: 100
            verify: ["all_health_checks_pass"]

      # Health checks before re-enable
      pre_enable_checks:
        - "root_cause_identified"
        - "fix_deployed"
        - "staging_verified"
        - "oncall_approval"

      # Post-enable monitoring
      post_enable:
        duration: "30m"
        alert_sensitivity: "high"
        auto_disable_on_regression: true
```

### Post-Incident Review

```yaml
feature_flags:
  kill_switches:
    post_incident:
      # Required documentation
      required:
        - "incident_timeline"
        - "root_cause"
        - "resolution_steps"
        - "prevention_measures"

      # Template
      template: |
        ## Kill Switch Activation Report

        **Switch:** {{switch_name}}
        **Activated:** {{activation_time}}
        **Duration:** {{duration}}
        **Activated By:** {{user}}

        ### Reason
        {{reason}}

        ### Impact
        {{impact_description}}

        ### Root Cause
        {{root_cause}}

        ### Prevention
        {{prevention_measures}}
```

---

## Monitoring & Alerting

### Kill Switch Dashboard

```yaml
feature_flags:
  kill_switches:
    dashboard:
      # Current status
      status_panel:
        show: ["all_kill_switches"]
        highlight: ["disabled_switches"]

      # Recent activity
      activity:
        show_last: "24h"
        columns: ["switch", "action", "user", "time", "reason"]

      # Health metrics
      metrics:
        - "switches_currently_disabled"
        - "activations_last_24h"
        - "avg_disable_duration"
```

### Alerts

```yaml
feature_flags:
  kill_switches:
    alerts:
      # Switch activated
      on_disable:
        critical:
          notify: ["pagerduty", "#incidents"]
          message: "CRITICAL: Kill switch {{name}} DISABLED"
        standard:
          notify: ["#alerts"]

      # Switch re-enabled
      on_enable:
        notify: ["#alerts"]
        message: "Kill switch {{name}} re-enabled after {{duration}}"

      # Long duration alert
      prolonged_disable:
        threshold: "1h"
        notify: ["#incidents", "engineering-manager"]
        message: "Kill switch {{name}} disabled for {{duration}}"
```

---

## Commands

```bash
# List all kill switches
proagents killswitch list

# Check status
proagents killswitch status payments_enabled

# Disable (emergency)
proagents killswitch disable payments_enabled --reason "Payment provider outage"

# Enable
proagents killswitch enable payments_enabled --verify

# Gradual re-enable
proagents killswitch enable payments_enabled --gradual

# View history
proagents killswitch history payments_enabled --last 30d

# Run emergency runbook
proagents killswitch runbook payment_outage

# Test kill switch (dry run)
proagents killswitch test payments_enabled --dry-run
```

---

## Best Practices

1. **Test Regularly**: Verify kill switches work before you need them
2. **Document Dependencies**: Know what breaks when you flip a switch
3. **Graceful Degradation**: Always have fallback behavior defined
4. **Access Control**: Limit who can flip critical switches
5. **Audit Everything**: Log all kill switch activity
6. **Quick Recovery**: Plan how to re-enable safely
7. **Communicate**: Notify stakeholders when switches change
