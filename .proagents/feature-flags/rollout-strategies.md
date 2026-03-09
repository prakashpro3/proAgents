# Rollout Strategies

Strategies for safely releasing features to users.

---

## Strategy Types

| Strategy | Risk Level | Use Case | Rollback Speed |
|----------|------------|----------|----------------|
| **Big Bang** | High | Low-risk changes | Instant |
| **Percentage** | Medium | Most features | Instant |
| **Canary** | Low | High-risk features | Instant |
| **Ring-Based** | Low | Enterprise features | Instant |
| **Geographic** | Medium | Regional features | Instant |

---

## Percentage-Based Rollout

### Configuration

```yaml
feature_flags:
  strategies:
    percentage_rollout:
      flag: "new_checkout"

      phases:
        - name: "Initial"
          percentage: 1
          duration: "24h"
          success_criteria:
            error_rate: "< 0.5%"
            conversion_rate: ">= baseline"

        - name: "Early Adopters"
          percentage: 10
          duration: "48h"
          success_criteria:
            error_rate: "< 0.3%"
            nps_score: ">= baseline"

        - name: "Quarter"
          percentage: 25
          duration: "72h"
          success_criteria:
            error_rate: "< 0.2%"

        - name: "Half"
          percentage: 50
          duration: "1w"
          success_criteria:
            error_rate: "< 0.1%"

        - name: "Full"
          percentage: 100
```

### Sticky Assignment

```yaml
feature_flags:
  strategies:
    percentage_rollout:
      flag: "new_ui"

      assignment:
        # Ensure same user gets same experience
        sticky: true
        seed: "new_ui_rollout"

        # Hash based on user ID
        hash_attribute: "user_id"

        # Fallback for anonymous users
        anonymous_handling: "session_based"
```

### Automatic Progression

```yaml
feature_flags:
  strategies:
    percentage_rollout:
      flag: "new_feature"

      automation:
        # Auto-progress if criteria met
        auto_progress: true

        # Auto-rollback if issues
        auto_rollback:
          enabled: true
          conditions:
            - "error_rate > 1%"
            - "p99_latency > 3x_baseline"
            - "conversion_drop > 10%"

        # Notifications
        notify_on_progress: ["#releases"]
        notify_on_rollback: ["#incidents", "oncall"]
```

---

## Canary Releases

### Canary Configuration

```yaml
feature_flags:
  strategies:
    canary:
      flag: "new_payment_processor"

      # Canary group selection
      canary_group:
        size: 100  # Fixed number of users
        selection: "random"
        sticky: true

        # Or percentage-based
        # percentage: 0.1

      # Success criteria
      monitoring:
        duration: "4h"
        metrics:
          - name: "error_rate"
            threshold: "< 0.1%"
          - name: "latency_p99"
            threshold: "< 500ms"
          - name: "success_rate"
            threshold: "> 99.9%"

      # Comparison
      comparison:
        baseline: "control_group"
        method: "statistical"
        confidence: 0.95
```

### Canary Analysis

```yaml
feature_flags:
  strategies:
    canary:
      analysis:
        # Real-time analysis
        frequency: "5m"

        # Metrics to compare
        compare:
          - metric: "request_success_rate"
            weight: 0.4
          - metric: "latency_p95"
            weight: 0.3
          - metric: "error_count"
            weight: 0.3

        # Scoring
        scoring:
          pass: ">= 95"
          marginal: ">= 80"
          fail: "< 80"

        # Actions
        actions:
          on_pass: "promote"
          on_marginal: "hold"
          on_fail: "rollback"
```

---

## Ring-Based Deployment

### Ring Definition

```yaml
feature_flags:
  strategies:
    ring_based:
      flag: "enterprise_feature"

      rings:
        - name: "Ring 0 - Internal"
          description: "Internal employees"
          targeting:
            attribute: "email"
            contains: "@company.com"
          wait_time: "24h"

        - name: "Ring 1 - Beta Users"
          description: "Opted-in beta testers"
          targeting:
            attribute: "beta_program"
            equals: true
          wait_time: "48h"

        - name: "Ring 2 - Early Adopters"
          description: "Power users, low-risk accounts"
          targeting:
            attribute: "account_tier"
            in: ["professional", "business"]
          percentage: 10
          wait_time: "1w"

        - name: "Ring 3 - General Availability"
          description: "All remaining users"
          targeting:
            all: true
```

### Ring Progression

```yaml
feature_flags:
  strategies:
    ring_based:
      progression:
        # Manual vs automatic
        mode: "manual"  # or "automatic"

        # Approval for each ring
        approvals:
          ring_2: ["tech-lead"]
          ring_3: ["tech-lead", "product-manager"]

        # Criteria to progress
        criteria:
          - "no_critical_bugs"
          - "positive_feedback > 80%"
          - "wait_time_elapsed"
```

---

## Geographic Rollout

### Region-Based Release

```yaml
feature_flags:
  strategies:
    geographic:
      flag: "new_pricing"

      regions:
        - name: "pilot"
          countries: ["NZ"]  # Start small
          percentage: 100
          start_date: "2024-01-15"

        - name: "apac"
          countries: ["AU", "SG", "JP"]
          percentage: 50
          start_date: "2024-01-22"

        - name: "europe"
          countries: ["UK", "DE", "FR"]
          percentage: 25
          start_date: "2024-02-01"

        - name: "americas"
          countries: ["US", "CA"]
          percentage: 10
          start_date: "2024-02-15"

      # Timezone considerations
      timezone_aware: true
      business_hours_only: false
```

### Regulatory Compliance

```yaml
feature_flags:
  strategies:
    geographic:
      flag: "ai_features"

      # Compliance restrictions
      compliance:
        # GDPR regions
        gdpr:
          countries: ["EU"]
          requires:
            - "consent_captured"
            - "data_processing_agreement"

        # CCPA
        ccpa:
          regions: ["California"]
          requires:
            - "opt_out_available"
```

---

## Rollout Monitoring

### Metrics Dashboard

```yaml
feature_flags:
  monitoring:
    dashboard:
      # Key metrics
      metrics:
        - name: "Rollout Progress"
          type: "gauge"
          source: "flag_percentage"

        - name: "Error Rate Comparison"
          type: "comparison"
          treatment: "new_feature_enabled"
          control: "new_feature_disabled"

        - name: "Performance Impact"
          type: "timeseries"
          metrics: ["latency_p50", "latency_p95", "latency_p99"]

        - name: "User Feedback"
          type: "sentiment"
          source: "support_tickets"
```

### Alerting

```yaml
feature_flags:
  monitoring:
    alerts:
      - name: "High Error Rate"
        condition: "error_rate > baseline * 2"
        severity: "critical"
        action: "auto_rollback"

      - name: "Degraded Performance"
        condition: "latency_p95 > baseline * 1.5"
        severity: "warning"
        action: "pause_rollout"

      - name: "Negative Feedback Spike"
        condition: "negative_feedback > 10/hour"
        severity: "warning"
        action: "notify"
```

---

## Commands

```bash
# Start rollout
proagents rollout start new_checkout --strategy percentage

# Progress to next phase
proagents rollout progress new_checkout

# Check rollout status
proagents rollout status new_checkout

# Pause rollout
proagents rollout pause new_checkout

# Resume rollout
proagents rollout resume new_checkout

# Rollback
proagents rollout rollback new_checkout

# View rollout history
proagents rollout history new_checkout

# Compare metrics
proagents rollout compare new_checkout --metrics error_rate,latency
```

---

## Best Practices

1. **Start Small**: Begin with 1% or internal users
2. **Define Success**: Clear metrics before starting
3. **Monitor Closely**: Watch metrics during each phase
4. **Automate Rollback**: Set up automatic rollback triggers
5. **Document Progress**: Keep records of each phase
6. **Communicate**: Keep stakeholders informed of progress
