# Environment Promotion

Moving code and configuration safely between environments.

---

## Promotion Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Development │ ─▶ │   Staging    │ ─▶ │  Production  │
└──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │
   Auto Deploy        Manual Gate         Approval Gate
   On PR Merge        + Tests Pass        + Change Window
```

---

## Promotion Rules

### Configuration

```yaml
# proagents.config.yaml
promotion:
  # Development → Staging
  development_to_staging:
    trigger: "automatic"
    conditions:
      - "all_tests_pass"
      - "no_critical_security_issues"
    notifications:
      - slack: "#deployments"

  # Staging → Production
  staging_to_production:
    trigger: "manual"
    conditions:
      - "all_tests_pass"
      - "security_scan_pass"
      - "performance_baseline_met"
      - "staging_soak_time >= 4h"
    approvals:
      required: 2
      approvers:
        - role: "tech-lead"
        - role: "sre"
    change_window:
      days: ["tuesday", "wednesday", "thursday"]
      hours: ["10:00", "16:00"]
      timezone: "America/New_York"
    notifications:
      - slack: "#prod-deployments"
      - email: "engineering@company.com"
```

---

## Promotion Gates

### Quality Gates

```yaml
promotion:
  gates:
    quality:
      # Test requirements
      tests:
        unit_coverage: ">= 80%"
        integration_tests: "pass"
        e2e_tests: "pass"

      # Code quality
      code_quality:
        linting: "no_errors"
        type_check: "pass"
        complexity: "<= 15"

      # Security
      security:
        vulnerability_scan: "no_critical"
        dependency_audit: "no_high"
        secrets_scan: "no_findings"
```

### Performance Gates

```yaml
promotion:
  gates:
    performance:
      # Response times
      latency:
        p50: "<= 100ms"
        p95: "<= 300ms"
        p99: "<= 500ms"

      # Throughput
      throughput:
        min_rps: 1000

      # Resources
      resources:
        memory_increase: "<= 10%"
        cpu_increase: "<= 15%"

      # Bundle size (for frontend)
      bundle:
        size_increase: "<= 5%"
```

### Stability Gates

```yaml
promotion:
  gates:
    stability:
      # Soak time in staging
      soak_time:
        minimum: "4h"
        error_rate: "< 0.1%"

      # Canary requirements
      canary:
        duration: "1h"
        traffic_percentage: 10
        success_rate: ">= 99.5%"
```

---

## Promotion Strategies

### Direct Promotion

```yaml
promotion:
  strategies:
    direct:
      description: "Immediate full deployment"
      use_when: "low_risk_changes"

      steps:
        - deploy_to_target
        - run_smoke_tests
        - verify_health
        - update_traffic
```

### Canary Promotion

```yaml
promotion:
  strategies:
    canary:
      description: "Gradual traffic shift"
      use_when: "medium_risk_changes"

      phases:
        - percentage: 5
          duration: "15m"
          evaluation:
            - "error_rate < 1%"
            - "latency_p99 < 500ms"

        - percentage: 25
          duration: "30m"
          evaluation:
            - "error_rate < 0.5%"
            - "latency_p99 < 400ms"

        - percentage: 50
          duration: "1h"
          evaluation:
            - "error_rate < 0.1%"

        - percentage: 100
          evaluation:
            - "error_rate < 0.1%"
            - "no_user_complaints"
```

### Blue-Green Promotion

```yaml
promotion:
  strategies:
    blue_green:
      description: "Full parallel deployment with instant switch"
      use_when: "high_risk_changes"

      steps:
        - deploy_to_green
        - run_full_test_suite
        - warm_up_caches
        - switch_traffic
        - monitor: "15m"
        - decommission_blue_or_rollback
```

### Rolling Promotion

```yaml
promotion:
  strategies:
    rolling:
      description: "Incremental instance replacement"
      use_when: "standard_deployments"

      configuration:
        max_unavailable: 1
        max_surge: 1
        health_check_grace_period: "30s"

      steps:
        - replace_instance
        - wait_healthy
        - repeat_until_complete
```

---

## Approval Workflow

### Approval Configuration

```yaml
promotion:
  approvals:
    staging_to_production:
      # Required approvers
      required:
        count: 2
        from:
          - role: "tech-lead"
          - role: "sre"
          - team: "security"

      # Timeout
      timeout: "24h"
      escalation_after: "4h"

      # Auto-approval conditions
      auto_approve_if:
        - "change_type == 'config_only'"
        - "change_type == 'rollback'"
        - "emergency_flag == true AND approved_by_manager"
```

### Approval Request Template

```yaml
promotion:
  approvals:
    request_template:
      title: "Promotion: ${source_env} → ${target_env}"
      body: |
        ## Change Summary
        **Version:** ${version}
        **Commits:** ${commit_count}
        **Authors:** ${authors}

        ## Changes
        ${change_summary}

        ## Test Results
        - Unit Tests: ${unit_test_status}
        - Integration: ${integration_test_status}
        - Security Scan: ${security_scan_status}

        ## Risk Assessment
        - Risk Level: ${risk_level}
        - Rollback Plan: ${rollback_plan}

        ## Checklist
        - [ ] Reviewed changes
        - [ ] Verified test results
        - [ ] Confirmed rollback plan
```

---

## Promotion Notifications

### Notification Configuration

```yaml
promotion:
  notifications:
    # Before promotion
    pre_promotion:
      channels:
        - slack: "#deployments"
        - email: "team@company.com"
      message: "🚀 Starting promotion: ${source} → ${target}"

    # Success
    promotion_success:
      channels:
        - slack: "#deployments"
      message: "✅ Promotion complete: ${version} deployed to ${target}"

    # Failure
    promotion_failure:
      channels:
        - slack: "#incidents"
        - pagerduty: "deployments"
      message: "❌ Promotion failed: ${error_message}"

    # Rollback
    rollback:
      channels:
        - slack: "#incidents"
        - email: "engineering@company.com"
      message: "⚠️ Rollback initiated: ${reason}"
```

---

## Promotion History

### Tracking

```yaml
promotion:
  history:
    # What to track
    capture:
      - version
      - commits
      - authors
      - approvers
      - duration
      - test_results
      - metrics_snapshot

    # Storage
    storage:
      type: "database"
      retention: "1 year"

    # Reports
    reports:
      - type: "weekly_summary"
        schedule: "monday 9am"
        recipients: ["engineering@company.com"]
```

### Viewing History

```bash
# View promotion history
proagents promote history

# View specific promotion
proagents promote show <promotion-id>

# Compare promotions
proagents promote diff <id1> <id2>
```

---

## Commands

```bash
# Check promotion readiness
proagents promote check --from staging --to production

# Start promotion
proagents promote start --from staging --to production

# View promotion status
proagents promote status

# Cancel promotion
proagents promote cancel

# Request approval
proagents promote request-approval --from staging --to production

# Approve promotion
proagents promote approve <promotion-id>

# Reject promotion
proagents promote reject <promotion-id> --reason "Failed security review"

# Emergency promotion (bypasses normal gates)
proagents promote emergency --from staging --to production \
  --reason "Critical security fix" \
  --approved-by manager@company.com
```

---

## Promotion Checklist

### Pre-Promotion

- [ ] All tests passing
- [ ] Security scan complete
- [ ] Performance baseline met
- [ ] Change documented
- [ ] Rollback plan ready
- [ ] Monitoring alerts configured

### During Promotion

- [ ] Monitor error rates
- [ ] Watch latency metrics
- [ ] Check health endpoints
- [ ] Monitor resource usage
- [ ] Watch for user complaints

### Post-Promotion

- [ ] Verify all services healthy
- [ ] Run smoke tests
- [ ] Update status page
- [ ] Notify stakeholders
- [ ] Document any issues
- [ ] Schedule post-mortem if needed

---

## Best Practices

1. **Automate Gates**: Don't rely on manual checks
2. **Small Changes**: Promote frequently with small changes
3. **Clear Rollback**: Always have a tested rollback plan
4. **Monitor Closely**: Watch metrics during and after promotion
5. **Document Everything**: Track all promotions and outcomes
6. **Learn from Failures**: Post-mortem every failed promotion
