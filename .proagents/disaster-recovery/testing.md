# Disaster Recovery Testing

Validate your recovery procedures before you need them.

---

## Testing Types

| Type | Frequency | Scope | Impact |
|------|-----------|-------|--------|
| **Tabletop Exercise** | Monthly | Discussion-based | None |
| **Component Test** | Weekly | Single service | Minimal |
| **Partial Failover** | Monthly | Multiple services | Low |
| **Full DR Test** | Quarterly | Complete system | Medium |
| **Chaos Engineering** | Continuous | Random failures | Variable |

---

## Tabletop Exercises

### Scenario Planning

```yaml
# proagents.config.yaml
disaster_recovery:
  testing:
    tabletop:
      scenarios:
        - name: "Database Corruption"
          description: "Primary database becomes corrupted during peak hours"
          participants: ["DBA", "Backend Lead", "SRE"]
          duration: "1h"
          questions:
            - "How do we detect the corruption?"
            - "What's our RTO for database recovery?"
            - "How do we communicate to users?"
            - "What data might we lose?"

        - name: "Cloud Region Outage"
          description: "Primary cloud region becomes unavailable"
          participants: ["SRE", "Platform Lead", "Engineering Manager"]
          duration: "2h"
          questions:
            - "How quickly can we failover to secondary region?"
            - "What services are region-dependent?"
            - "How do we handle data synchronization?"

        - name: "Security Breach"
          description: "Unauthorized access detected in production"
          participants: ["Security Team", "SRE", "CTO"]
          duration: "2h"
          questions:
            - "How do we isolate affected systems?"
            - "What's our communication plan?"
            - "How do we preserve evidence?"
```

### Exercise Template

```markdown
## Tabletop Exercise: [Scenario Name]

**Date:** [YYYY-MM-DD]
**Participants:** [List]
**Facilitator:** [Name]

### Scenario
[Detailed scenario description]

### Timeline
| Time | Event | Expected Response |
|------|-------|-------------------|
| T+0 | Incident detected | Alert triggers |
| T+5m | Initial assessment | Oncall responds |
| T+15m | Escalation decision | Team assembled |
| T+30m | Recovery initiated | Rollback/failover |
| T+60m | Verification | Health checks pass |

### Discussion Points
1. [Question 1]
   - Response: [Team's answer]
   - Gap identified: [Any issues found]

### Action Items
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

### Lessons Learned
[Summary of findings]
```

---

## Component Testing

### Single Service Rollback

```yaml
disaster_recovery:
  testing:
    component:
      # Test individual service rollback
      service_rollback:
        schedule: "weekly"
        environment: "staging"
        services:
          - name: "api-gateway"
            test_steps:
              - deploy_test_version
              - verify_degradation
              - trigger_rollback
              - verify_recovery

          - name: "auth-service"
            test_steps:
              - deploy_test_version
              - verify_auth_fails
              - trigger_rollback
              - verify_auth_works
```

### Database Recovery Test

```yaml
disaster_recovery:
  testing:
    component:
      database_recovery:
        schedule: "weekly"
        environment: "staging"
        steps:
          - create_backup
          - simulate_corruption
          - restore_from_backup
          - verify_data_integrity
          - measure_recovery_time

        acceptance_criteria:
          recovery_time: "< 30m"
          data_loss: "< 5m of transactions"
```

---

## Partial Failover Testing

### Multi-Service Failover

```yaml
disaster_recovery:
  testing:
    partial_failover:
      schedule: "monthly"
      environment: "staging"

      scenarios:
        - name: "Backend Cluster Failure"
          services: ["api", "worker", "scheduler"]
          steps:
            - mark_cluster_unhealthy
            - verify_traffic_shifts
            - verify_secondary_handles_load
            - restore_primary
            - verify_traffic_returns

        - name: "Database Failover"
          components: ["primary-db"]
          steps:
            - promote_replica
            - update_connection_strings
            - verify_write_capability
            - demote_old_primary
            - resync_data
```

### Failover Metrics

```yaml
disaster_recovery:
  testing:
    metrics:
      # Track during tests
      measure:
        - name: "failover_time"
          description: "Time from trigger to recovery"
          target: "< 5m"

        - name: "data_loss_window"
          description: "Time of unrecoverable transactions"
          target: "< 30s"

        - name: "error_spike_duration"
          description: "Duration of elevated errors"
          target: "< 2m"

        - name: "full_recovery_time"
          description: "Time to return to normal operations"
          target: "< 15m"
```

---

## Full DR Testing

### Complete System Failover

```yaml
disaster_recovery:
  testing:
    full_dr:
      schedule: "quarterly"
      notification_lead_time: "1 week"

      phases:
        - name: "Preparation"
          duration: "1 day"
          tasks:
            - notify_stakeholders
            - verify_backup_integrity
            - prepare_runbooks
            - brief_team

        - name: "Failover"
          duration: "4 hours"
          tasks:
            - initiate_failover
            - verify_all_services
            - test_critical_flows
            - measure_performance

        - name: "Operation"
          duration: "4 hours"
          tasks:
            - run_on_dr_site
            - monitor_for_issues
            - handle_any_incidents
            - document_findings

        - name: "Failback"
          duration: "4 hours"
          tasks:
            - initiate_failback
            - resync_data
            - verify_primary
            - restore_normal_operations

        - name: "Review"
          duration: "1 day"
          tasks:
            - analyze_metrics
            - document_issues
            - update_runbooks
            - plan_improvements
```

### DR Test Report Template

```markdown
## Full DR Test Report

**Date:** [YYYY-MM-DD]
**Duration:** [X hours]
**Participants:** [List]

### Objectives
- [ ] Complete failover to DR site
- [ ] Operate on DR site for [X hours]
- [ ] Failback to primary site
- [ ] Meet RTO/RPO targets

### Results Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Failover Time | 15m | 12m | Pass |
| Data Loss | 0 | 0 | Pass |
| Error Rate During Failover | < 5% | 3.2% | Pass |
| Failback Time | 30m | 45m | Fail |

### Issues Encountered

#### Issue 1: [Title]
- **Severity:** [High/Medium/Low]
- **Description:** [Details]
- **Impact:** [Effect on test]
- **Resolution:** [How it was handled]
- **Follow-up:** [Action item]

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

### Sign-off
- [ ] Engineering Lead: ________
- [ ] SRE Lead: ________
- [ ] Security: ________
```

---

## Chaos Engineering

### Chaos Configuration

```yaml
disaster_recovery:
  testing:
    chaos:
      enabled: true
      environment: "staging"  # Never in production without controls

      experiments:
        - name: "pod_failure"
          type: "kubernetes"
          action: "kill_pod"
          target:
            selector: "app=api"
            count: 1
          schedule: "random"
          window: "business_hours"

        - name: "network_latency"
          type: "network"
          action: "add_latency"
          parameters:
            latency: "500ms"
            duration: "5m"
          target: "api-to-database"

        - name: "resource_stress"
          type: "resource"
          action: "cpu_stress"
          parameters:
            load: "80%"
            duration: "10m"
          target: "worker-nodes"
```

### Chaos Guardrails

```yaml
disaster_recovery:
  testing:
    chaos:
      guardrails:
        # Stop conditions
        abort_conditions:
          - "error_rate > 10%"
          - "p99_latency > 5s"
          - "health_check_failing"

        # Blast radius limits
        limits:
          max_affected_pods: 2
          max_affected_nodes: 1
          max_duration: "30m"

        # Excluded resources
        excluded:
          - "production-*"
          - "critical-*"
          - "database-primary"

        # Notification on experiment
        notify:
          before: ["#chaos-engineering"]
          on_abort: ["#incidents", "oncall"]
```

---

## Automated DR Testing

### Scheduled Tests

```yaml
disaster_recovery:
  testing:
    automation:
      # Automated test schedule
      schedule:
        - name: "backup_verification"
          cron: "0 2 * * *"  # Daily at 2 AM
          test: "verify_backup_integrity"

        - name: "restore_test"
          cron: "0 3 * * 0"  # Weekly on Sunday
          test: "restore_to_test_env"

        - name: "failover_drill"
          cron: "0 4 1 * *"  # Monthly on 1st
          test: "staging_failover"

      # Reporting
      reports:
        destination: "s3://dr-reports/"
        notify: ["engineering@company.com"]
        on_failure: ["oncall@company.com"]
```

---

## Commands

```bash
# Run tabletop exercise
proagents dr test tabletop --scenario "database-corruption"

# Test component rollback
proagents dr test component --service api --env staging

# Run partial failover test
proagents dr test failover --scope partial --env staging

# Schedule full DR test
proagents dr test schedule --type full --date 2024-03-15

# Run chaos experiment
proagents dr chaos run --experiment pod_failure --duration 5m

# View test history
proagents dr test history --last 30d

# Generate DR test report
proagents dr test report --date 2024-01-15
```

---

## Best Practices

1. **Start Small**: Begin with tabletop exercises before live tests
2. **Regular Schedule**: Test consistently, not just before audits
3. **Document Everything**: Capture findings and improvements
4. **Include Everyone**: Involve all relevant teams
5. **Fix Issues**: Address gaps found during testing
6. **Measure Improvement**: Track metrics over time
7. **Chaos Carefully**: Start chaos engineering in non-production
