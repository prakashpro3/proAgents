# Log Aggregation

Centralizing logs from multiple sources for unified analysis.

---

## Architecture Overview

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Service A  │  │  Service B  │  │  Service C  │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       ▼                ▼                ▼
┌─────────────────────────────────────────────────┐
│              Log Shipper (Fluentd/Vector)       │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              Log Storage (Elasticsearch)        │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              Visualization (Kibana/Grafana)     │
└─────────────────────────────────────────────────┘
```

---

## Shipper Configuration

### Fluentd

```yaml
# proagents.config.yaml
logging:
  aggregation:
    shipper: "fluentd"

    fluentd:
      # Input sources
      sources:
        - type: "tail"
          path: "/var/log/app/*.log"
          tag: "app.*"
          format: "json"

        - type: "forward"
          port: 24224
          tag: "docker.*"

      # Processing
      filters:
        - match: "**"
          type: "record_transformer"
          record:
            hostname: "#{Socket.gethostname}"
            environment: "production"

      # Output
      output:
        type: "elasticsearch"
        host: "${ES_HOST}"
        port: 9200
        index_name: "logs"
        type_name: "_doc"
```

### Vector

```yaml
logging:
  aggregation:
    shipper: "vector"

    vector:
      # Sources
      sources:
        app_logs:
          type: "file"
          include:
            - "/var/log/app/*.log"
          read_from: "beginning"

        docker_logs:
          type: "docker_logs"

      # Transforms
      transforms:
        parse_json:
          type: "remap"
          inputs: ["app_logs"]
          source: |
            . = parse_json!(.message)

        add_metadata:
          type: "remap"
          inputs: ["parse_json"]
          source: |
            .environment = "production"
            .service = "my-app"

      # Sinks
      sinks:
        elasticsearch:
          type: "elasticsearch"
          inputs: ["add_metadata"]
          endpoints: ["${ES_ENDPOINT}"]
          index: "logs-%Y-%m-%d"
```

### Filebeat

```yaml
logging:
  aggregation:
    shipper: "filebeat"

    filebeat:
      inputs:
        - type: log
          enabled: true
          paths:
            - /var/log/app/*.log
          json:
            keys_under_root: true
            add_error_key: true

      processors:
        - add_host_metadata: ~
        - add_cloud_metadata: ~
        - add_docker_metadata: ~

      output:
        elasticsearch:
          hosts: ["${ES_HOST}:9200"]
          index: "logs-%{+yyyy.MM.dd}"
```

---

## Storage Configuration

### Elasticsearch

```yaml
logging:
  aggregation:
    storage: "elasticsearch"

    elasticsearch:
      # Cluster configuration
      cluster:
        hosts:
          - "es-node-1:9200"
          - "es-node-2:9200"
          - "es-node-3:9200"

      # Index settings
      index:
        prefix: "logs"
        date_format: "%Y.%m.%d"
        shards: 3
        replicas: 1

      # Index lifecycle management
      ilm:
        enabled: true
        policy:
          hot:
            max_age: "7d"
            max_size: "50gb"
          warm:
            min_age: "7d"
            shrink:
              number_of_shards: 1
          cold:
            min_age: "30d"
          delete:
            min_age: "90d"

      # Template
      template:
        mappings:
          dynamic_templates:
            - strings:
                match_mapping_type: "string"
                mapping:
                  type: "keyword"
                  ignore_above: 1024
```

### Loki

```yaml
logging:
  aggregation:
    storage: "loki"

    loki:
      url: "http://loki:3100"

      # Labels
      labels:
        job: "app-logs"
        environment: "production"

      # Tenant
      tenant_id: "default"

      # Retention
      retention:
        period: "720h"  # 30 days
```

---

## Cloud Services

### AWS CloudWatch

```yaml
logging:
  aggregation:
    provider: "aws"

    cloudwatch:
      region: "us-east-1"
      log_group: "/app/production"

      # Log streams
      stream_prefix: "${SERVICE_NAME}"

      # Retention
      retention_days: 30

      # Metric filters
      metric_filters:
        - name: "ErrorCount"
          pattern: '{ $.level = "error" }'
          metric:
            namespace: "App/Logs"
            name: "ErrorCount"
            value: 1
```

### Google Cloud Logging

```yaml
logging:
  aggregation:
    provider: "gcp"

    cloud_logging:
      project_id: "${GCP_PROJECT_ID}"

      # Log name
      log_name: "app-logs"

      # Resource
      resource:
        type: "gce_instance"
        labels:
          project_id: "${GCP_PROJECT_ID}"
          zone: "${GCP_ZONE}"
          instance_id: "${INSTANCE_ID}"

      # Exclusions
      exclusions:
        - name: "health-checks"
          filter: 'httpRequest.requestUrl="/health"'
```

### Azure Monitor

```yaml
logging:
  aggregation:
    provider: "azure"

    azure_monitor:
      workspace_id: "${WORKSPACE_ID}"
      shared_key: "${SHARED_KEY}"

      # Custom log type
      log_type: "AppLogs"

      # Time field
      time_field: "@timestamp"
```

---

## Log Processing

### Parsing Rules

```yaml
logging:
  aggregation:
    processing:
      parsing:
        # JSON parsing
        json:
          enabled: true
          keys_under_root: true

        # Grok patterns
        grok:
          patterns:
            CUSTOM_LOG: '%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}'

        # Multiline
        multiline:
          pattern: '^\d{4}-\d{2}-\d{2}'
          negate: true
          match: "after"
```

### Enrichment

```yaml
logging:
  aggregation:
    processing:
      enrichment:
        # Add geo data
        geoip:
          enabled: true
          source_field: "client_ip"
          target_field: "geo"

        # Add user agent parsing
        user_agent:
          enabled: true
          source_field: "http.user_agent"
          target_field: "user_agent"

        # DNS lookup
        dns:
          enabled: false  # Can be slow
```

### Filtering

```yaml
logging:
  aggregation:
    processing:
      filtering:
        # Drop health checks
        drop:
          - condition: 'http.path == "/health"'
          - condition: 'http.path == "/metrics"'

        # Sample verbose logs
        sample:
          - condition: 'level == "debug"'
            rate: 0.1  # Keep 10%

        # Redact sensitive data
        redact:
          - field: "user.email"
            pattern: '(?<=.{3}).(?=.*@)'
            replacement: "*"
```

---

## Querying & Analysis

### Query Examples

```yaml
# Kibana / Elasticsearch queries
logging:
  queries:
    examples:
      # Errors in last hour
      recent_errors: |
        level:error AND @timestamp:[now-1h TO now]

      # Specific user activity
      user_activity: |
        user.id:"user-123" AND event.type:*

      # Slow requests
      slow_requests: |
        http.duration_ms:>1000

      # Error trends
      error_trends: |
        level:error | stats count() by service.name
```

### Saved Searches

```yaml
logging:
  aggregation:
    saved_searches:
      - name: "Production Errors"
        query: "level:error AND environment:production"
        columns: ["@timestamp", "service.name", "message", "error.message"]
        sort: [{"@timestamp": "desc"}]

      - name: "Auth Failures"
        query: 'event.type:"auth.failure"'
        columns: ["@timestamp", "user.email", "error.message", "geo.country"]
```

---

## Alerting

### Alert Rules

```yaml
logging:
  aggregation:
    alerts:
      - name: "High Error Rate"
        query: "level:error"
        condition:
          type: "count"
          threshold: 100
          window: "5m"
        actions:
          - type: "slack"
            channel: "#alerts"
          - type: "pagerduty"
            severity: "critical"

      - name: "Security Event"
        query: 'event.category:"security"'
        condition:
          type: "any"
        actions:
          - type: "email"
            to: ["security@company.com"]
```

---

## Commands

```bash
# Query logs
proagents logs query --filter 'level:error' --last 1h

# Stream logs
proagents logs stream --filter 'service.name:api'

# Export logs
proagents logs export --from 2024-01-01 --to 2024-01-02 --output logs.json

# Check aggregation health
proagents logs health

# View storage stats
proagents logs stats
```

---

## Best Practices

1. **Structured First**: Use JSON logging from the source
2. **Add Metadata**: Include service, version, environment
3. **Index Strategy**: Plan your index naming and lifecycle
4. **Retention Policy**: Define how long to keep logs
5. **Sampling**: Sample verbose logs to reduce costs
6. **Alerting**: Set up alerts for critical patterns
