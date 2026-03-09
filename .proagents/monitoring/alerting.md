# Alerting

Configuring alerts for monitoring and incident response.

---

## Alert Configuration

### Basic Alert Rules

```yaml
# proagents.config.yaml
monitoring:
  alerting:
    enabled: true

    rules:
      # High error rate
      - name: "HighErrorRate"
        expression: "error_rate > 0.05"
        duration: "5m"
        severity: "critical"
        summary: "Error rate above 5%"
        description: "Error rate is {{ $value | humanizePercentage }}"

      # Elevated latency
      - name: "HighLatency"
        expression: "http_request_duration_p99 > 2"
        duration: "10m"
        severity: "warning"
        summary: "P99 latency above 2 seconds"

      # Service down
      - name: "ServiceDown"
        expression: "up == 0"
        duration: "1m"
        severity: "critical"
        summary: "Service {{ $labels.service }} is down"
```

### Alert Severity Levels

```yaml
monitoring:
  alerting:
    severities:
      critical:
        description: "Immediate action required"
        color: "#FF0000"
        pagerduty_severity: "critical"
        response_time: "5m"

      warning:
        description: "Action required soon"
        color: "#FFA500"
        pagerduty_severity: "warning"
        response_time: "30m"

      info:
        description: "For awareness"
        color: "#0000FF"
        pagerduty_severity: "info"
        response_time: "24h"
```

---

## Alert Rules by Category

### Availability Alerts

```yaml
monitoring:
  alerting:
    rules:
      availability:
        # Service down
        - name: "ServiceDown"
          expression: "up == 0"
          duration: "1m"
          severity: "critical"
          labels:
            category: "availability"

        # Health check failing
        - name: "HealthCheckFailing"
          expression: "health_check_status != 1"
          duration: "2m"
          severity: "critical"

        # High error rate
        - name: "ErrorRateHigh"
          expression: |
            sum(rate(http_requests_total{status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))
            > 0.05
          duration: "5m"
          severity: "critical"
```

### Performance Alerts

```yaml
monitoring:
  alerting:
    rules:
      performance:
        # P99 latency
        - name: "HighP99Latency"
          expression: |
            histogram_quantile(0.99,
              rate(http_request_duration_seconds_bucket[5m])
            ) > 2
          duration: "10m"
          severity: "warning"

        # Slow database queries
        - name: "SlowDatabaseQueries"
          expression: |
            histogram_quantile(0.95,
              rate(db_query_duration_seconds_bucket[5m])
            ) > 1
          duration: "5m"
          severity: "warning"

        # High memory usage
        - name: "HighMemoryUsage"
          expression: |
            (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)
            /
            node_memory_MemTotal_bytes
            > 0.9
          duration: "5m"
          severity: "warning"
```

### Business Alerts

```yaml
monitoring:
  alerting:
    rules:
      business:
        # Order processing delay
        - name: "OrderProcessingDelay"
          expression: |
            avg(order_processing_duration_seconds) > 60
          duration: "10m"
          severity: "warning"
          summary: "Order processing taking longer than expected"

        # Payment failures
        - name: "HighPaymentFailureRate"
          expression: |
            sum(rate(payment_failures_total[5m]))
            /
            sum(rate(payment_attempts_total[5m]))
            > 0.1
          duration: "5m"
          severity: "critical"

        # Queue backup
        - name: "QueueBackup"
          expression: "queue_messages_pending > 10000"
          duration: "15m"
          severity: "warning"
```

### Security Alerts

```yaml
monitoring:
  alerting:
    rules:
      security:
        # High authentication failures
        - name: "HighAuthFailures"
          expression: |
            sum(rate(auth_failures_total[5m])) > 100
          duration: "2m"
          severity: "critical"
          labels:
            category: "security"

        # Unusual traffic pattern
        - name: "UnusualTrafficPattern"
          expression: |
            rate(http_requests_total[5m]) >
            avg_over_time(rate(http_requests_total[5m])[1d:]) * 3
          duration: "5m"
          severity: "warning"

        # Rate limit breaches
        - name: "RateLimitBreaches"
          expression: |
            sum(rate(rate_limit_exceeded_total[5m])) > 50
          duration: "5m"
          severity: "warning"
```

---

## Notification Channels

### Channel Configuration

```yaml
monitoring:
  alerting:
    channels:
      # Slack
      slack:
        webhook_url_env: "SLACK_WEBHOOK_URL"
        default_channel: "#alerts"
        severity_channels:
          critical: "#incidents"
          warning: "#alerts"
          info: "#monitoring"

      # PagerDuty
      pagerduty:
        api_key_env: "PAGERDUTY_API_KEY"
        service_key_env: "PAGERDUTY_SERVICE_KEY"
        severity_mapping:
          critical: "critical"
          warning: "warning"

      # Email
      email:
        smtp:
          host: "smtp.company.com"
          port: 587
          from: "alerts@company.com"
        recipients:
          critical: ["oncall@company.com"]
          warning: ["engineering@company.com"]

      # Opsgenie
      opsgenie:
        api_key_env: "OPSGENIE_API_KEY"
        priority_mapping:
          critical: "P1"
          warning: "P3"
```

### Routing Rules

```yaml
monitoring:
  alerting:
    routing:
      # Default route
      default:
        channels: ["slack"]
        repeat_interval: "4h"

      # Route by severity
      routes:
        - match:
            severity: "critical"
          channels: ["pagerduty", "slack"]
          repeat_interval: "1h"

        - match:
            severity: "warning"
          channels: ["slack", "email"]
          repeat_interval: "4h"

        # Route by category
        - match:
            category: "security"
          channels: ["pagerduty", "slack"]
          additional_recipients:
            slack: "#security-alerts"

        # Route by service
        - match:
            service: "payments"
          channels: ["pagerduty"]
          escalation_policy: "payments-oncall"
```

---

## Alert Lifecycle

### Alert States

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Inactive │───▶│ Pending  │───▶│  Firing  │
└──────────┘    └──────────┘    └──────────┘
      ▲               │               │
      │               ▼               │
      │         (duration not        │
      │          reached)            │
      │                              │
      └──────────────────────────────┘
              (condition cleared)
```

### Inhibition Rules

```yaml
monitoring:
  alerting:
    inhibition:
      # Suppress warnings when critical firing
      - source:
          severity: "critical"
        target:
          severity: "warning"
        equal: ["service"]

      # Suppress downstream when upstream failing
      - source:
          alertname: "DatabaseDown"
        target:
          alertname: "HighErrorRate"
```

### Silencing

```yaml
monitoring:
  alerting:
    silencing:
      # Maintenance windows
      scheduled:
        - name: "Weekly Maintenance"
          matchers:
            service: "api"
          schedule:
            day_of_week: "sunday"
            start: "02:00"
            end: "04:00"
            timezone: "America/New_York"

      # Manual silences
      api:
        enabled: true
        path: "/_admin/silences"
        auth_required: true
```

---

## Alert Templates

### Notification Templates

```yaml
monitoring:
  alerting:
    templates:
      slack:
        firing: |
          :red_circle: *ALERT: {{ .AlertName }}*
          Severity: {{ .Severity }}
          Summary: {{ .Summary }}
          Service: {{ .Labels.service }}
          {{ if .Description }}
          Details: {{ .Description }}
          {{ end }}
          <{{ .DashboardURL }}|View Dashboard>

        resolved: |
          :large_green_circle: *RESOLVED: {{ .AlertName }}*
          Duration: {{ .Duration }}
          Service: {{ .Labels.service }}

      pagerduty:
        title: "[{{ .Severity | upper }}] {{ .AlertName }}"
        body: |
          {{ .Summary }}

          Service: {{ .Labels.service }}
          Environment: {{ .Labels.environment }}

          {{ .Description }}
```

---

## Escalation

### Escalation Policies

```yaml
monitoring:
  alerting:
    escalation:
      policies:
        default:
          - wait: "5m"
            notify: ["primary-oncall"]
          - wait: "15m"
            notify: ["secondary-oncall"]
          - wait: "30m"
            notify: ["engineering-manager"]
          - wait: "1h"
            notify: ["vp-engineering"]

        payments:
          - wait: "2m"
            notify: ["payments-oncall"]
          - wait: "10m"
            notify: ["payments-lead", "engineering-manager"]
```

---

## Commands

```bash
# List active alerts
proagents alerts list

# View alert details
proagents alerts show HighErrorRate

# Silence alert
proagents alerts silence HighErrorRate --duration 1h --reason "Deploying fix"

# Remove silence
proagents alerts unsilence HighErrorRate

# Test alert rule
proagents alerts test --rule HighErrorRate

# View alert history
proagents alerts history --last 7d

# Check alerting configuration
proagents alerts validate
```

---

## Best Practices

1. **Alert on Symptoms**: Alert on user-facing issues, not causes
2. **Actionable Alerts**: Every alert should have a clear action
3. **Avoid Alert Fatigue**: Tune thresholds to reduce noise
4. **Include Context**: Add runbook links and relevant details
5. **Use Inhibition**: Prevent alert cascades
6. **Test Alerts**: Regularly verify alerts work correctly
7. **Document Runbooks**: Link each alert to a runbook
