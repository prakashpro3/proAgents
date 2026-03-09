# Disaster Recovery Automation

Automated triggers and procedures for system recovery.

---

## Automated Rollback Triggers

### Trigger Configuration

```yaml
# proagents.config.yaml
disaster_recovery:
  automation:
    enabled: true

    triggers:
      # Error rate trigger
      - name: "high_error_rate"
        condition: "error_rate > 5%"
        window: "5m"
        action: "auto_rollback"
        severity: "critical"

      # Response time trigger
      - name: "slow_response"
        condition: "p99_latency > 3000ms"
        window: "10m"
        action: "alert_and_prepare"
        severity: "high"

      # Health check failure
      - name: "health_check_failure"
        condition: "health_check_failures > 3"
        window: "2m"
        action: "auto_rollback"
        severity: "critical"

      # Memory/CPU threshold
      - name: "resource_exhaustion"
        condition: "memory_usage > 95% OR cpu_usage > 90%"
        window: "5m"
        action: "scale_then_rollback"
        severity: "high"
```

### Action Definitions

```yaml
disaster_recovery:
  actions:
    auto_rollback:
      steps:
        - pause_deployments
        - notify_oncall
        - rollback_to_last_stable
        - verify_health
        - resume_deployments
      timeout: "15m"

    alert_and_prepare:
      steps:
        - notify_oncall
        - prepare_rollback
        - monitor_closely
      timeout: "30m"

    scale_then_rollback:
      steps:
        - attempt_scale_up
        - wait: "5m"
        - check_if_resolved
        - rollback_if_still_failing
      timeout: "20m"
```

---

## Rollback Automation Scripts

### Pre-Deployment Snapshot

```yaml
disaster_recovery:
  pre_deployment:
    # Create automatic snapshots
    snapshots:
      enabled: true

      # What to snapshot
      targets:
        - type: "database"
          name: "primary-db"
          method: "pg_dump"

        - type: "configuration"
          paths:
            - "/etc/app/"
            - "./config/"

        - type: "container_image"
          registry: "${REGISTRY_URL}"

    # Retention
    retention:
      count: 5
      duration: "7d"
```

### Automated Rollback Script

```yaml
disaster_recovery:
  rollback:
    # Automatic rollback procedure
    procedure:
      - step: "identify_stable_version"
        action: |
          # Find last known good deployment
          STABLE_VERSION=$(git tag --list 'v*-stable' | tail -1)

      - step: "notify_team"
        action: |
          # Send alerts
          proagents notify --channel slack --message "Initiating rollback to ${STABLE_VERSION}"

      - step: "pause_traffic"
        action: |
          # Drain connections
          kubectl scale deployment/app --replicas=0

      - step: "restore_database"
        condition: "if database_changed"
        action: |
          # Restore from snapshot
          pg_restore --clean --dbname=${DATABASE_URL} ${SNAPSHOT_PATH}

      - step: "deploy_previous_version"
        action: |
          # Deploy stable version
          kubectl set image deployment/app app=${REGISTRY}:${STABLE_VERSION}
          kubectl rollout status deployment/app

      - step: "verify_health"
        action: |
          # Run health checks
          proagents health check --retries 5 --interval 10s

      - step: "restore_traffic"
        action: |
          # Resume traffic
          kubectl scale deployment/app --replicas=${NORMAL_REPLICAS}

      - step: "post_rollback_notification"
        action: |
          # Notify completion
          proagents notify --channel all --message "Rollback complete"
```

---

## Health Monitoring Integration

### Health Check Configuration

```yaml
disaster_recovery:
  health_monitoring:
    # Endpoints to check
    endpoints:
      - url: "/health"
        method: "GET"
        expected_status: 200
        timeout: "5s"
        interval: "30s"

      - url: "/health/db"
        method: "GET"
        expected_status: 200
        timeout: "10s"
        interval: "60s"

      - url: "/health/redis"
        method: "GET"
        expected_status: 200
        timeout: "5s"
        interval: "30s"

    # Failure thresholds
    thresholds:
      consecutive_failures: 3
      failure_window: "5m"
      recovery_threshold: 5  # Consecutive successes to mark healthy
```

### Metric-Based Triggers

```yaml
disaster_recovery:
  metrics:
    sources:
      - name: "prometheus"
        url: "${PROMETHEUS_URL}"

      - name: "datadog"
        api_key_env: "DD_API_KEY"

    # Metric conditions
    conditions:
      - metric: "http_request_duration_seconds_p99"
        threshold: 3
        comparison: ">"
        action: "alert"

      - metric: "http_requests_total{status=~'5..'}"
        threshold: 100
        window: "5m"
        comparison: ">"
        action: "rollback"

      - metric: "up"
        threshold: 0
        comparison: "=="
        action: "immediate_rollback"
```

---

## Notification Automation

### Alert Routing

```yaml
disaster_recovery:
  notifications:
    routing:
      critical:
        channels:
          - slack: "#incidents"
          - pagerduty: "primary-oncall"
          - email: "oncall@company.com"
        escalation_after: "5m"

      high:
        channels:
          - slack: "#alerts"
          - email: "engineering@company.com"
        escalation_after: "15m"

      medium:
        channels:
          - slack: "#monitoring"
        escalation_after: "30m"

    # Escalation chain
    escalation:
      - level: 1
        target: "primary-oncall"
        timeout: "5m"

      - level: 2
        target: "secondary-oncall"
        timeout: "10m"

      - level: 3
        target: "engineering-manager"
        timeout: "15m"
```

### Incident Templates

```yaml
disaster_recovery:
  notifications:
    templates:
      rollback_initiated:
        title: "Automated Rollback Initiated"
        body: |
          **Trigger:** {{trigger_name}}
          **Condition:** {{trigger_condition}}
          **Current Version:** {{current_version}}
          **Rolling back to:** {{target_version}}
          **Status:** In Progress

      rollback_complete:
        title: "Rollback Complete"
        body: |
          **Duration:** {{duration}}
          **Final Version:** {{deployed_version}}
          **Health Status:** {{health_status}}

      rollback_failed:
        title: "Rollback FAILED - Manual Intervention Required"
        body: |
          **Error:** {{error_message}}
          **Last Successful Step:** {{last_step}}
          **Recommended Action:** {{recommended_action}}
```

---

## Recovery Verification

### Post-Rollback Checks

```yaml
disaster_recovery:
  verification:
    # Automated checks after rollback
    checks:
      - name: "api_health"
        command: "curl -f ${API_URL}/health"
        retries: 5
        interval: "10s"

      - name: "database_connectivity"
        command: "pg_isready -h ${DB_HOST}"
        retries: 3
        interval: "5s"

      - name: "critical_paths"
        command: "proagents test smoke --env production"
        timeout: "5m"

      - name: "error_rate_normalized"
        metric: "error_rate < 1%"
        wait: "5m"

    # On verification failure
    on_failure:
      - notify: "critical"
      - create_incident: true
      - escalate_immediately: true
```

---

## Commands

```bash
# Test rollback automation
proagents dr test-rollback --dry-run

# Trigger manual rollback
proagents dr rollback --version v1.2.3

# View rollback history
proagents dr history --last 10

# Check current health triggers
proagents dr triggers status

# Disable automation temporarily
proagents dr automation disable --duration 1h --reason "Planned maintenance"
```

---

## Best Practices

1. **Test Regularly**: Run rollback drills monthly
2. **Fast Detection**: Set aggressive monitoring thresholds
3. **Clear Runbooks**: Document manual steps for automation failures
4. **Notification Fatigue**: Tune alerts to reduce false positives
5. **Post-Mortems**: Review every automated rollback
6. **Version Everything**: Ensure all components are version-controlled
