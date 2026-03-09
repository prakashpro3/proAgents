# Monitoring Setup

Application monitoring, alerting, and observability.

---

## Overview

Comprehensive monitoring for application health, performance, and business metrics.

## Documentation

| Document | Description |
|----------|-------------|
| [Health Checks](./health-checks.md) | Endpoint health monitoring |
| [Metrics](./metrics.md) | Application metrics |
| [Alerting](./alerting.md) | Alert configuration |
| [Dashboards](./dashboards.md) | Visualization setup |

---

## Monitoring Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Application                                                │
│       │                                                     │
│       ├──▶ Metrics ──▶ Prometheus/DataDog                  │
│       │                      │                              │
│       ├──▶ Logs ────▶ ELK/CloudWatch                       │
│       │                      │                              │
│       └──▶ Traces ──▶ Jaeger/X-Ray                         │
│                              │                              │
│                              ▼                              │
│                       Dashboards                            │
│                       Alerting                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Health Checks

### Health Endpoint

```typescript
// src/routes/health.ts
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      externalApi: await checkExternalApi(),
    },
  };

  const isHealthy = Object.values(health.checks)
    .every(check => check.status === 'healthy');

  res.status(isHealthy ? 200 : 503).json(health);
});

async function checkDatabase() {
  try {
    await db.query('SELECT 1');
    return { status: 'healthy', latency: '5ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

### Health Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.2.3",
  "checks": {
    "database": { "status": "healthy", "latency": "5ms" },
    "redis": { "status": "healthy", "latency": "2ms" },
    "externalApi": { "status": "healthy", "latency": "150ms" }
  }
}
```

---

## Metrics

### Key Metrics

| Category | Metrics |
|----------|---------|
| **Requests** | Rate, latency, error rate |
| **Resources** | CPU, memory, disk, connections |
| **Business** | Users, orders, revenue |
| **Dependencies** | External API latency, availability |

### Prometheus Metrics

```typescript
import { Counter, Histogram, Gauge } from 'prom-client';

// Request counter
const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

// Response time histogram
const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'path'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Active connections gauge
const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Active database connections',
});

// Middleware to track metrics
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, path: req.path });

  res.on('finish', () => {
    httpRequests.inc({ method: req.method, path: req.path, status: res.statusCode });
    end();
  });

  next();
});
```

---

## Alerting

### Alert Configuration

```yaml
# proagents.config.yaml
monitoring:
  alerts:
    # High error rate
    - name: "high_error_rate"
      condition: "error_rate > 5%"
      duration: "5m"
      severity: "critical"
      channels: ["pagerduty", "slack:#alerts"]

    # High latency
    - name: "high_latency"
      condition: "p99_latency > 3s"
      duration: "10m"
      severity: "warning"
      channels: ["slack:#alerts"]

    # Service down
    - name: "service_down"
      condition: "health_check_failed"
      duration: "1m"
      severity: "critical"
      channels: ["pagerduty", "slack:#incidents"]

    # Low disk space
    - name: "low_disk"
      condition: "disk_usage > 85%"
      duration: "15m"
      severity: "warning"
      channels: ["slack:#ops"]
```

### Alert Channels

```yaml
monitoring:
  channels:
    slack:
      webhook_url_env: "SLACK_WEBHOOK_URL"

    pagerduty:
      api_key_env: "PAGERDUTY_API_KEY"
      service_id: "P123ABC"

    email:
      smtp_host: "smtp.example.com"
      recipients:
        - "oncall@example.com"
```

---

## Dashboards

### Key Dashboard Panels

```
┌─────────────────────────────────────────────────────────────┐
│ Application Dashboard                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│ │ Request Rate  │  │ Error Rate    │  │ P99 Latency   │   │
│ │   1,234/s     │  │    0.5%       │  │    250ms      │   │
│ │   ▲ 5%        │  │    ▼ 0.1%     │  │    ▼ 10ms     │   │
│ └───────────────┘  └───────────────┘  └───────────────┘   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Request Rate Over Time                                  ││
│ │ [Chart showing requests per second over 24 hours]       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Error Rate by Endpoint                                  ││
│ │ /api/users      ████░░░░░░ 2%                          ││
│ │ /api/orders     ██░░░░░░░░ 0.5%                        ││
│ │ /api/payments   ███░░░░░░░ 1%                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│ │ CPU Usage     │  │ Memory        │  │ DB Pool       │   │
│ │    45%        │  │   2.1 GB      │  │   12/20       │   │
│ └───────────────┘  └───────────────┘  └───────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Commands

```bash
# Check application health
proagents monitor health

# View current metrics
proagents monitor metrics

# Test alerting
proagents monitor test-alert high_error_rate

# View active alerts
proagents monitor alerts

# Export dashboard config
proagents monitor export-dashboard --format grafana
```

---

## Configuration

```yaml
# proagents.config.yaml
monitoring:
  enabled: true

  # Metrics
  metrics:
    enabled: true
    endpoint: "/metrics"
    provider: "prometheus"  # prometheus, datadog, cloudwatch

  # Health checks
  health:
    endpoint: "/health"
    interval: "30s"
    timeout: "10s"

  # Tracing
  tracing:
    enabled: true
    provider: "jaeger"
    sample_rate: 0.1  # 10% of requests

  # Uptime monitoring
  uptime:
    provider: "pingdom"
    check_interval: "1m"
    endpoints:
      - "https://api.example.com/health"
```

---

## Best Practices

1. **Monitor the Four Golden Signals**: Latency, traffic, errors, saturation
2. **Set Meaningful Alerts**: Actionable, not noisy
3. **Use Dashboards**: Visualize trends and patterns
4. **Track Business Metrics**: Not just technical metrics
5. **Implement Distributed Tracing**: For microservices
6. **Monitor Dependencies**: External services and databases
7. **Test Alerting**: Regularly verify alerts work
8. **Document Runbooks**: What to do when alerts fire
