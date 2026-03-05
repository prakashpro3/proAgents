# Runtime Performance Metrics

Monitor and measure application performance during execution.

---

## Overview

Runtime metrics help:
- Identify performance bottlenecks
- Track performance over time
- Alert on degradation
- Guide optimization efforts

---

## Key Metrics Categories

### 1. Response Time Metrics

```yaml
response_time:
  targets:
    p50: 100ms    # 50th percentile (median)
    p95: 300ms    # 95th percentile
    p99: 500ms    # 99th percentile
    max: 2000ms   # Maximum acceptable

  by_endpoint:
    "/api/users":
      p50: 45ms
      p95: 120ms
      p99: 250ms
      status: "healthy"

    "/api/users/:id":
      p50: 35ms
      p95: 80ms
      p99: 150ms
      status: "healthy"

    "/api/reports/generate":
      p50: 1200ms
      p95: 3500ms
      p99: 8000ms
      status: "needs_optimization"

  alerts:
    warning_threshold: "p95 > 500ms"
    critical_threshold: "p99 > 2000ms"
```

### 2. Throughput Metrics

```yaml
throughput:
  requests_per_second:
    current: 450
    peak: 1200
    target: 1000

  by_endpoint:
    "/api/users": 150 rps
    "/api/auth/login": 50 rps
    "/api/posts": 200 rps

  capacity:
    current_utilization: 45%
    headroom: 55%
    estimated_max: 1000 rps
```

### 3. Error Rate Metrics

```yaml
error_rates:
  overall: 0.5%
  target: "<1%"

  by_type:
    "4xx": 0.3%
    "5xx": 0.2%

  by_endpoint:
    "/api/users":
      error_rate: 0.1%
      status: "healthy"

    "/api/payments":
      error_rate: 1.5%
      status: "needs_attention"
      top_errors:
        - "Payment gateway timeout": 45%
        - "Invalid card": 30%
        - "Internal error": 25%

  alerts:
    warning: ">1%"
    critical: ">5%"
```

### 4. Resource Utilization

```yaml
resources:
  cpu:
    average: 35%
    peak: 75%
    target: "<70%"

  memory:
    used: "2.1GB"
    available: "4GB"
    utilization: 52%
    heap_used: "1.8GB"
    heap_limit: "3GB"

  connections:
    database:
      active: 25
      idle: 5
      max: 100
      utilization: 25%

    redis:
      active: 10
      max: 50
      utilization: 20%

  event_loop:
    lag: "2ms"
    target: "<10ms"
    status: "healthy"
```

---

## Monitoring Implementation

### 1. Node.js Performance Monitoring

```typescript
// src/lib/metrics.ts
import { performance, PerformanceObserver } from 'perf_hooks';
import { Counter, Histogram, Gauge, Registry } from 'prom-client';

// Create metrics registry
const register = new Registry();

// HTTP request duration histogram
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Request counter
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Active connections gauge
const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register],
});

// Error counter
const errorsTotal = new Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'route'],
  registers: [register],
});

// Middleware for Express
export function metricsMiddleware(req, res, next) {
  const start = performance.now();

  res.on('finish', () => {
    const duration = (performance.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration
    );

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    if (res.statusCode >= 400) {
      errorsTotal.inc({
        type: res.statusCode >= 500 ? 'server' : 'client',
        route,
      });
    }
  });

  next();
}

export { register, httpRequestDuration, httpRequestsTotal, activeConnections };
```

### 2. Database Query Monitoring

```typescript
// src/lib/db-metrics.ts
import { Histogram, Counter } from 'prom-client';

const queryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
});

const slowQueries = new Counter({
  name: 'db_slow_queries_total',
  help: 'Number of slow queries (>100ms)',
  labelNames: ['operation', 'table'],
});

// Prisma middleware for query monitoring
export const prismaMetrics = {
  async $use(params, next) {
    const start = performance.now();
    const result = await next(params);
    const duration = (performance.now() - start) / 1000;

    queryDuration.observe(
      { operation: params.action, table: params.model },
      duration
    );

    if (duration > 0.1) {
      slowQueries.inc({ operation: params.action, table: params.model });
      console.warn(`Slow query: ${params.model}.${params.action} took ${duration}s`);
    }

    return result;
  },
};
```

### 3. Memory Monitoring

```typescript
// src/lib/memory-metrics.ts
import { Gauge } from 'prom-client';

const memoryUsage = new Gauge({
  name: 'nodejs_memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['type'],
});

const eventLoopLag = new Gauge({
  name: 'nodejs_eventloop_lag_seconds',
  help: 'Event loop lag in seconds',
});

// Collect memory metrics every 10 seconds
setInterval(() => {
  const mem = process.memoryUsage();
  memoryUsage.set({ type: 'heapUsed' }, mem.heapUsed);
  memoryUsage.set({ type: 'heapTotal' }, mem.heapTotal);
  memoryUsage.set({ type: 'rss' }, mem.rss);
  memoryUsage.set({ type: 'external' }, mem.external);
}, 10000);

// Measure event loop lag
let lastCheck = process.hrtime.bigint();
setInterval(() => {
  const now = process.hrtime.bigint();
  const lag = Number(now - lastCheck) / 1e9 - 0.1; // Subtract expected 100ms
  eventLoopLag.set(Math.max(0, lag));
  lastCheck = now;
}, 100);
```

---

## Metrics Dashboard

```yaml
dashboard:
  overview:
    - metric: "Request Rate"
      value: "450 req/s"
      trend: "+5%"
      status: "healthy"

    - metric: "Error Rate"
      value: "0.5%"
      trend: "-10%"
      status: "healthy"

    - metric: "P95 Latency"
      value: "120ms"
      trend: "+15ms"
      status: "warning"

    - metric: "CPU Usage"
      value: "35%"
      trend: "stable"
      status: "healthy"

  charts:
    - name: "Request Latency Distribution"
      type: "histogram"
      data: "http_request_duration_seconds"

    - name: "Requests Over Time"
      type: "line"
      data: "rate(http_requests_total[5m])"

    - name: "Error Rate"
      type: "line"
      data: "rate(errors_total[5m])"

    - name: "Memory Usage"
      type: "area"
      data: "nodejs_memory_usage_bytes"
```

**Visual Dashboard:**
```
┌─────────────────────────────────────────────────────────────┐
│                    Performance Dashboard                     │
├──────────────────┬──────────────────┬──────────────────────┤
│   Request Rate   │    Error Rate    │    P95 Latency       │
│    450 req/s     │      0.5%        │      120ms           │
│     ↑ +5%        │     ↓ -10%       │     ↑ +15ms          │
│      ✅          │       ✅          │       ⚠️             │
├──────────────────┴──────────────────┴──────────────────────┤
│                                                             │
│  Request Latency (last hour)                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    ╭──╮      ╭─╮                                    │   │
│  │   ╭╯  ╰╮    ╭╯ ╰╮    ╭──╮                          │   │
│  │──╯     ╰────╯   ╰────╯  ╰──────────────────────    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Slowest Endpoints                    Error Distribution   │
│  ┌───────────────────────┐           ┌──────────────────┐ │
│  │ /api/reports  1200ms  │           │ 4xx ████████ 60% │ │
│  │ /api/search    450ms  │           │ 5xx ████     40% │ │
│  │ /api/export    380ms  │           └──────────────────┘ │
│  └───────────────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Alerting Rules

```yaml
# prometheus/alerts.yml
groups:
  - name: performance
    rules:
      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "P95 latency is above 500ms"

      - alert: HighErrorRate
        expr: rate(errors_total[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate"
          description: "Error rate is above 5%"

      - alert: HighMemoryUsage
        expr: nodejs_memory_usage_bytes{type="heapUsed"} / nodejs_memory_usage_bytes{type="heapTotal"} > 0.9
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Heap usage is above 90%"

      - alert: SlowQueries
        expr: rate(db_slow_queries_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow database queries"
          description: "More than 10 slow queries per minute"
```

---

## Performance Baseline

```yaml
baseline:
  established: "2024-01-01"
  environment: "production"

  metrics:
    response_time:
      p50: 45ms
      p95: 120ms
      p99: 250ms

    throughput:
      average: 400 rps
      peak: 1000 rps

    error_rate: 0.3%

    resources:
      cpu_average: 30%
      memory_average: 50%

  comparison:
    current_vs_baseline:
      response_time_p95: "+8%" # 120ms → 130ms
      throughput: "+12%"       # 400 → 450 rps
      error_rate: "+67%"       # 0.3% → 0.5%
```

---

## Configuration

```yaml
# proagents.config.yaml

performance:
  runtime_metrics:
    enabled: true

    collect:
      - response_time
      - throughput
      - error_rate
      - cpu_usage
      - memory_usage
      - database_queries
      - event_loop_lag

    endpoints:
      metrics: "/metrics"         # Prometheus format
      health: "/health"

    targets:
      response_time_p95: 300ms
      error_rate: 1%
      cpu_usage: 70%

    alerting:
      enabled: true
      channels:
        - slack
        - pagerduty
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/perf-metrics` | View current metrics |
| `/perf-metrics --endpoint [path]` | Metrics for specific endpoint |
| `/perf-metrics --baseline` | Compare to baseline |
| `/perf-metrics --slow` | List slow endpoints |
| `/perf-metrics --alerts` | View active alerts |
