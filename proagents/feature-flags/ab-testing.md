# A/B Testing

Statistical experimentation with feature flags.

---

## Experiment Setup

### Basic A/B Test

```yaml
feature_flags:
  experiments:
    checkout_button_color:
      description: "Test impact of checkout button color on conversion"
      type: "ab_test"

      # Variations
      variations:
        - name: "control"
          value: "blue"
          weight: 50

        - name: "treatment"
          value: "green"
          weight: 50

      # Target metrics
      primary_metric: "checkout_conversion_rate"
      secondary_metrics:
        - "time_to_checkout"
        - "cart_abandonment_rate"

      # Traffic allocation
      allocation:
        percentage: 100  # 100% of eligible users
        sticky: true     # Consistent experience
```

### Multi-Variant Test

```yaml
feature_flags:
  experiments:
    pricing_page_layout:
      type: "multivariate"

      variations:
        - name: "control"
          value: { layout: "standard", cta: "Subscribe" }
          weight: 25

        - name: "variant_a"
          value: { layout: "comparison", cta: "Subscribe" }
          weight: 25

        - name: "variant_b"
          value: { layout: "standard", cta: "Start Free Trial" }
          weight: 25

        - name: "variant_c"
          value: { layout: "comparison", cta: "Start Free Trial" }
          weight: 25

      primary_metric: "plan_selection_rate"
```

---

## Statistical Configuration

### Sample Size Calculation

```yaml
feature_flags:
  experiments:
    new_onboarding:
      statistics:
        # Minimum detectable effect
        mde: 5%  # Detect 5% improvement

        # Statistical significance
        significance_level: 0.05  # 95% confidence

        # Statistical power
        power: 0.8  # 80% power

        # Baseline conversion
        baseline_rate: 10%

        # Calculated sample size
        # (automatically computed or manually set)
        min_sample_per_variation: 3150
```

### Analysis Method

```yaml
feature_flags:
  experiments:
    checkout_flow:
      statistics:
        # Analysis method
        method: "frequentist"  # or "bayesian"

        # Frequentist settings
        frequentist:
          test_type: "two_tailed"
          correction: "bonferroni"  # For multiple comparisons

        # Bayesian settings
        bayesian:
          prior: "uniform"
          credible_interval: 0.95
          rope: [-0.01, 0.01]  # Region of practical equivalence
```

### Sequential Testing

```yaml
feature_flags:
  experiments:
    landing_page:
      statistics:
        # Allow early stopping
        sequential_testing:
          enabled: true
          method: "always_valid_inference"

          # Peek schedule
          analysis_schedule: "daily"

          # Early stopping rules
          stop_for_winner:
            confidence: 0.99
            min_runtime: "7d"

          stop_for_futility:
            probability_to_beat_baseline: 0.05
```

---

## Metric Configuration

### Primary Metrics

```yaml
feature_flags:
  experiments:
    new_feature:
      metrics:
        primary:
          name: "conversion_rate"
          type: "proportion"
          numerator: "completed_signups"
          denominator: "landing_page_views"

          # Guardrails
          guardrails:
            min_improvement: -5%  # Don't ship if worse than -5%
```

### Secondary Metrics

```yaml
feature_flags:
  experiments:
    new_feature:
      metrics:
        secondary:
          - name: "revenue_per_user"
            type: "mean"
            metric: "total_revenue"
            per: "user"

          - name: "session_duration"
            type: "mean"
            metric: "session_length_seconds"

          - name: "feature_adoption"
            type: "proportion"
            event: "feature_used"
```

### Guardrail Metrics

```yaml
feature_flags:
  experiments:
    new_feature:
      metrics:
        guardrails:
          - name: "error_rate"
            type: "proportion"
            threshold: "+1%"  # Don't increase errors by more than 1%
            action: "stop_experiment"

          - name: "page_load_time"
            type: "mean"
            threshold: "+500ms"
            action: "alert"

          - name: "crash_rate"
            type: "proportion"
            threshold: "+0.1%"
            action: "stop_experiment"
```

---

## Targeting & Segmentation

### User Segments

```yaml
feature_flags:
  experiments:
    premium_feature:
      targeting:
        # Include segments
        include:
          - segment: "paying_users"
          - segment: "active_last_30d"

        # Exclude segments
        exclude:
          - segment: "internal_users"
          - segment: "api_only_users"

        # Geographic targeting
        geo:
          include: ["US", "CA", "UK"]
```

### Segment Analysis

```yaml
feature_flags:
  experiments:
    new_feature:
      analysis:
        segments:
          - name: "plan_type"
            values: ["free", "pro", "enterprise"]

          - name: "platform"
            values: ["web", "ios", "android"]

          - name: "cohort"
            values: ["new_users", "existing_users"]

        # Interaction effects
        interactions:
          enabled: true
          max_depth: 2
```

---

## Experiment Lifecycle

### State Machine

```yaml
feature_flags:
  experiments:
    lifecycle:
      states:
        draft:
          transitions: ["review"]

        review:
          transitions: ["approved", "rejected"]
          requires: ["data_scientist_approval"]

        approved:
          transitions: ["running"]
          auto_start: false

        running:
          transitions: ["paused", "stopped", "completed"]

        paused:
          transitions: ["running", "stopped"]

        stopped:
          transitions: []
          reason_required: true

        completed:
          transitions: ["archived"]
          requires: ["results_documented"]
```

### Duration Limits

```yaml
feature_flags:
  experiments:
    new_feature:
      duration:
        # Minimum runtime
        min: "7d"

        # Maximum runtime
        max: "30d"

        # Auto-stop on max
        auto_stop_on_max: true

        # Warning before max
        warn_before_max: "3d"
```

---

## Results & Reporting

### Results Dashboard

```yaml
feature_flags:
  experiments:
    reporting:
      dashboard:
        sections:
          - name: "Summary"
            metrics: ["primary_metric", "confidence"]

          - name: "Variations"
            show: ["conversion_rate", "sample_size", "ci_95"]

          - name: "Trends"
            charts: ["daily_conversion", "cumulative_lift"]

          - name: "Segments"
            breakdown: ["platform", "plan_type"]
```

### Report Template

```markdown
## Experiment Report: {{experiment_name}}

**Duration:** {{start_date}} - {{end_date}}
**Total Users:** {{total_users}}
**Status:** {{status}}

### Summary
{{primary_metric}} for treatment vs control:
- **Lift:** {{lift}}% ({{ci_lower}}% to {{ci_upper}}%)
- **Statistical Significance:** {{p_value}}
- **Confidence:** {{confidence}}%

### Recommendation
{{recommendation}}

### Variation Performance
| Variation | Users | Conversions | Rate | vs Control |
|-----------|-------|-------------|------|------------|
{{#each variations}}
| {{name}} | {{users}} | {{conversions}} | {{rate}}% | {{lift}}% |
{{/each}}

### Segment Analysis
{{segment_analysis}}

### Next Steps
{{next_steps}}
```

---

## Commands

```bash
# Create experiment
proagents experiment create checkout_button --type ab

# Start experiment
proagents experiment start checkout_button

# Check status
proagents experiment status checkout_button

# View results
proagents experiment results checkout_button

# Pause experiment
proagents experiment pause checkout_button

# Stop experiment
proagents experiment stop checkout_button --reason "Reached significance"

# Ship winning variation
proagents experiment ship checkout_button --variation treatment

# Generate report
proagents experiment report checkout_button --format pdf
```

---

## Best Practices

1. **Hypothesis First**: Define what you're testing and why
2. **One Change**: Test one thing at a time
3. **Sufficient Power**: Calculate sample size before starting
4. **Run to Completion**: Don't peek and stop early
5. **Guard Rails**: Always monitor guardrail metrics
6. **Document Results**: Record learnings regardless of outcome
7. **Follow Up**: Ship or iterate based on results
