# Dashboards

Visualizing metrics and system health.

---

## Dashboard Types

| Type | Purpose | Audience |
|------|---------|----------|
| **Overview** | System health at a glance | Everyone |
| **Service** | Deep dive into a service | Engineers |
| **Business** | KPIs and metrics | Stakeholders |
| **Incident** | Real-time troubleshooting | On-call |
| **Capacity** | Resource planning | Platform team |

---

## Dashboard Configuration

### Overview Dashboard

```yaml
# proagents.config.yaml
monitoring:
  dashboards:
    overview:
      name: "System Overview"
      refresh: "30s"

      rows:
        - name: "Health Summary"
          panels:
            - type: "stat"
              title: "Services Healthy"
              query: "sum(up)"
              thresholds:
                - value: 0
                  color: "red"
                - value: 1
                  color: "green"

            - type: "stat"
              title: "Error Rate"
              query: "sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m]))"
              format: "percent"
              thresholds:
                - value: 0.01
                  color: "green"
                - value: 0.05
                  color: "yellow"
                - value: 0.1
                  color: "red"

            - type: "stat"
              title: "P99 Latency"
              query: "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))"
              format: "seconds"

        - name: "Traffic"
          panels:
            - type: "graph"
              title: "Request Rate"
              query: "sum(rate(http_requests_total[5m])) by (service)"
              legend: "{{ service }}"

            - type: "graph"
              title: "Error Rate by Service"
              query: "sum(rate(http_errors_total[5m])) by (service)"
              legend: "{{ service }}"
```

### Service Dashboard

```yaml
monitoring:
  dashboards:
    service:
      name: "Service Details"
      variables:
        - name: "service"
          type: "query"
          query: "label_values(up, service)"

      rows:
        - name: "Golden Signals"
          panels:
            - type: "graph"
              title: "Latency"
              queries:
                - label: "P50"
                  query: 'histogram_quantile(0.5, rate(http_request_duration_seconds_bucket{service="$service"}[5m]))'
                - label: "P95"
                  query: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service="$service"}[5m]))'
                - label: "P99"
                  query: 'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{service="$service"}[5m]))'

            - type: "graph"
              title: "Traffic"
              query: 'sum(rate(http_requests_total{service="$service"}[5m])) by (method)'

            - type: "graph"
              title: "Errors"
              query: 'sum(rate(http_errors_total{service="$service"}[5m])) by (status_code)'

            - type: "graph"
              title: "Saturation"
              queries:
                - label: "CPU"
                  query: 'avg(cpu_usage{service="$service"})'
                - label: "Memory"
                  query: 'avg(memory_usage{service="$service"})'

        - name: "Resources"
          panels:
            - type: "gauge"
              title: "CPU Usage"
              query: 'avg(cpu_usage{service="$service"})'
              max: 100

            - type: "gauge"
              title: "Memory Usage"
              query: 'avg(memory_usage{service="$service"})'
              max: 100

            - type: "graph"
              title: "Active Connections"
              query: 'sum(active_connections{service="$service"})'
```

---

## Panel Types

### Stat Panel

```yaml
monitoring:
  dashboards:
    panels:
      stat:
        - title: "Total Requests"
          query: "sum(http_requests_total)"
          format: "short"
          colorMode: "value"
          graphMode: "area"
          orientation: "auto"
```

### Graph Panel

```yaml
monitoring:
  dashboards:
    panels:
      graph:
        - title: "Request Rate"
          type: "timeseries"
          queries:
            - expr: "rate(http_requests_total[5m])"
              legendFormat: "{{ method }} {{ path }}"
          yAxis:
            label: "requests/sec"
            min: 0
          tooltip:
            mode: "all"
          legend:
            showLegend: true
            placement: "bottom"
```

### Table Panel

```yaml
monitoring:
  dashboards:
    panels:
      table:
        - title: "Top Endpoints by Latency"
          query: |
            topk(10,
              histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
            )
          columns:
            - name: "Endpoint"
              field: "path"
            - name: "P99 Latency"
              field: "Value"
              format: "duration"
            - name: "Request Rate"
              field: "rate"
              format: "short"
```

### Heatmap Panel

```yaml
monitoring:
  dashboards:
    panels:
      heatmap:
        - title: "Request Latency Distribution"
          query: "sum(rate(http_request_duration_seconds_bucket[5m])) by (le)"
          dataFormat: "heatmap"
          yAxis:
            unit: "seconds"
          colorScheme: "interpolateOrRd"
```

---

## Business Dashboards

### KPI Dashboard

```yaml
monitoring:
  dashboards:
    business_kpis:
      name: "Business KPIs"
      refresh: "1m"

      rows:
        - name: "Revenue"
          panels:
            - type: "stat"
              title: "Revenue Today"
              query: "sum(increase(revenue_total[24h]))"
              format: "currency"

            - type: "graph"
              title: "Revenue Over Time"
              query: "sum(increase(revenue_total[1h]))"
              interval: "1h"

        - name: "Users"
          panels:
            - type: "stat"
              title: "Active Users"
              query: "count(count by (user_id) (http_requests_total[1h]))"

            - type: "graph"
              title: "New Signups"
              query: "increase(user_signups_total[1h])"

        - name: "Orders"
          panels:
            - type: "stat"
              title: "Orders Today"
              query: "sum(increase(orders_total[24h]))"

            - type: "graph"
              title: "Order Value Distribution"
              query: "histogram_quantile(0.5, order_value_bucket)"
```

### Conversion Funnel

```yaml
monitoring:
  dashboards:
    conversion_funnel:
      name: "Conversion Funnel"

      rows:
        - name: "Funnel"
          panels:
            - type: "bargauge"
              title: "Conversion Stages"
              queries:
                - label: "Page Views"
                  query: "sum(page_views_total)"
                - label: "Add to Cart"
                  query: "sum(cart_additions_total)"
                - label: "Checkout Started"
                  query: "sum(checkout_started_total)"
                - label: "Order Completed"
                  query: "sum(orders_completed_total)"
              orientation: "horizontal"
```

---

## Incident Dashboard

### Real-Time Troubleshooting

```yaml
monitoring:
  dashboards:
    incident:
      name: "Incident Response"
      refresh: "5s"

      variables:
        - name: "timeRange"
          type: "interval"
          values: ["5m", "15m", "1h", "6h"]
          default: "15m"

      rows:
        - name: "Current State"
          height: "200px"
          panels:
            - type: "alertlist"
              title: "Active Alerts"
              filter:
                severity: ["critical", "warning"]

            - type: "logs"
              title: "Recent Errors"
              query: "level:error"
              limit: 50

        - name: "Impact"
          panels:
            - type: "graph"
              title: "Error Rate (Last $timeRange)"
              query: "rate(http_errors_total[$timeRange])"

            - type: "graph"
              title: "Latency Impact"
              queries:
                - label: "Current P99"
                  query: "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[$timeRange]))"
                - label: "Baseline P99"
                  query: "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[24h]))"

        - name: "Dependencies"
          panels:
            - type: "table"
              title: "Dependency Health"
              query: "health_check_status"
              columns:
                - name: "Dependency"
                - name: "Status"
                - name: "Latency"
```

---

## Dashboard Templates

### Grafana JSON Template

```yaml
monitoring:
  dashboards:
    export:
      format: "grafana"

      # Dashboard as code
      generate:
        enabled: true
        output_dir: "./dashboards"

      # Template variables
      templates:
        datasource: "Prometheus"
        refresh: "30s"
        time_range: "6h"
```

### Dashboard as Code

```yaml
monitoring:
  dashboards:
    as_code:
      enabled: true

      # Source of truth
      source: "./dashboards/*.yaml"

      # Sync to Grafana
      sync:
        enabled: true
        grafana_url: "https://grafana.company.com"
        api_key_env: "GRAFANA_API_KEY"
        folder: "ProAgents"

      # CI validation
      validate:
        enabled: true
        check_queries: true
```

---

## Access Control

### Dashboard Permissions

```yaml
monitoring:
  dashboards:
    permissions:
      # Public dashboards
      public:
        - "system-overview"
        - "api-status"

      # Team-specific
      teams:
        engineering:
          - "service-*"
          - "incident-*"
        product:
          - "business-*"
          - "kpi-*"
        management:
          - "*"

      # Edit permissions
      editors:
        - role: "admin"
        - team: "platform"
```

---

## Commands

```bash
# List dashboards
proagents dashboards list

# Generate dashboard
proagents dashboards generate --type service --service api

# Sync to Grafana
proagents dashboards sync

# Export dashboard
proagents dashboards export system-overview --format json

# Import dashboard
proagents dashboards import dashboard.json

# Validate dashboards
proagents dashboards validate
```

---

## Best Practices

1. **Start Simple**: Don't overload dashboards with panels
2. **Use Variables**: Make dashboards reusable with variables
3. **Consistent Layout**: Use similar layouts across dashboards
4. **Add Context**: Include annotations for deployments/incidents
5. **Mobile Friendly**: Test dashboards on smaller screens
6. **Document Dashboards**: Add descriptions to panels
7. **Version Control**: Store dashboards as code
