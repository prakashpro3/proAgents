# Metrics Collection

Application and infrastructure metrics for observability.

---

## Metric Types

| Type | Description | Example |
|------|-------------|---------|
| **Counter** | Cumulative value (only increases) | Total requests |
| **Gauge** | Current value (can go up/down) | Active connections |
| **Histogram** | Distribution of values | Request latency |
| **Summary** | Similar to histogram with percentiles | Response times |

---

## Configuration

### Basic Setup

```yaml
# proagents.config.yaml
monitoring:
  metrics:
    enabled: true

    # Metrics endpoint
    endpoint:
      path: "/metrics"
      port: 9090
      format: "prometheus"

    # Collection interval
    interval: "15s"

    # Labels applied to all metrics
    global_labels:
      service: "${SERVICE_NAME}"
      environment: "${NODE_ENV}"
      version: "${VERSION}"
```

### Metric Definitions

```yaml
monitoring:
  metrics:
    definitions:
      # HTTP metrics
      http:
        requests_total:
          type: "counter"
          description: "Total HTTP requests"
          labels: ["method", "path", "status"]

        request_duration_seconds:
          type: "histogram"
          description: "HTTP request duration"
          labels: ["method", "path"]
          buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]

        requests_in_flight:
          type: "gauge"
          description: "Current in-flight requests"

      # Business metrics
      business:
        orders_total:
          type: "counter"
          description: "Total orders placed"
          labels: ["status", "payment_method"]

        order_value:
          type: "histogram"
          description: "Order value distribution"
          buckets: [10, 25, 50, 100, 250, 500, 1000]

        active_users:
          type: "gauge"
          description: "Currently active users"
```

---

## Standard Metrics

### RED Metrics (Request, Error, Duration)

```yaml
monitoring:
  metrics:
    red:
      enabled: true

      request:
        name: "http_requests_total"
        labels: ["method", "endpoint", "status"]

      error:
        name: "http_errors_total"
        labels: ["method", "endpoint", "error_type"]

      duration:
        name: "http_request_duration_seconds"
        labels: ["method", "endpoint"]
        percentiles: [0.5, 0.9, 0.95, 0.99]
```

### USE Metrics (Utilization, Saturation, Errors)

```yaml
monitoring:
  metrics:
    use:
      enabled: true

      # CPU
      cpu:
        utilization: "process_cpu_seconds_total"
        saturation: "process_runnable_tasks"

      # Memory
      memory:
        utilization: "process_resident_memory_bytes"
        saturation: "process_heap_bytes"

      # Connections
      connections:
        utilization: "db_connections_active"
        saturation: "db_connections_waiting"
        errors: "db_connection_errors_total"
```

### Four Golden Signals

```yaml
monitoring:
  metrics:
    golden_signals:
      latency:
        metric: "http_request_duration_seconds"
        targets:
          p50: 0.1
          p95: 0.5
          p99: 1.0

      traffic:
        metric: "http_requests_total"
        rate_window: "1m"

      errors:
        metric: "http_errors_total"
        ratio: "http_errors_total / http_requests_total"
        target: "< 0.01"

      saturation:
        metrics:
          - "cpu_utilization"
          - "memory_utilization"
          - "connection_pool_utilization"
        target: "< 0.8"
```

---

## Code Integration

### JavaScript/TypeScript

```typescript
import { Metrics } from '@proagents/monitoring';

const metrics = new Metrics({
  prefix: 'myapp',
  defaultLabels: {
    service: 'api',
    environment: process.env.NODE_ENV,
  },
});

// Counter
const requestCounter = metrics.counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labels: ['method', 'path', 'status'],
});

// Histogram
const requestDuration = metrics.histogram({
  name: 'http_request_duration_seconds',
  help: 'Request duration in seconds',
  labels: ['method', 'path'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
});

// Gauge
const activeConnections = metrics.gauge({
  name: 'active_connections',
  help: 'Current active connections',
});

// Usage
app.use((req, res, next) => {
  const timer = requestDuration.startTimer({ method: req.method, path: req.path });

  res.on('finish', () => {
    timer();
    requestCounter.inc({ method: req.method, path: req.path, status: res.statusCode });
  });

  next();
});
```

### Express Middleware

```typescript
import { metricsMiddleware, metricsEndpoint } from '@proagents/monitoring/express';

// Auto-instrument all routes
app.use(metricsMiddleware({
  // Normalize paths
  normalizePath: (path) => path.replace(/\/\d+/g, '/:id'),

  // Skip certain paths
  skip: ['/health', '/metrics'],

  // Custom labels
  customLabels: (req, res) => ({
    user_type: req.user?.type || 'anonymous',
  }),
}));

// Expose metrics endpoint
app.get('/metrics', metricsEndpoint());
```

---

## Custom Metrics

### Business Metrics

```yaml
monitoring:
  metrics:
    custom:
      # Revenue tracking
      revenue_total:
        type: "counter"
        description: "Total revenue in cents"
        labels: ["currency", "product_category"]

      # User engagement
      feature_usage:
        type: "counter"
        description: "Feature usage count"
        labels: ["feature", "user_tier"]

      # SLA metrics
      sla_compliance:
        type: "gauge"
        description: "SLA compliance percentage"
        labels: ["service", "metric"]
```

### Application-Specific Metrics

```typescript
// Order processing metrics
const orderMetrics = {
  ordersCreated: metrics.counter({
    name: 'orders_created_total',
    labels: ['payment_method', 'shipping_type'],
  }),

  orderValue: metrics.histogram({
    name: 'order_value_dollars',
    buckets: [10, 50, 100, 500, 1000, 5000],
  }),

  orderProcessingTime: metrics.histogram({
    name: 'order_processing_seconds',
    buckets: [1, 5, 10, 30, 60, 120],
  }),

  pendingOrders: metrics.gauge({
    name: 'pending_orders',
  }),
};

// Usage
async function processOrder(order) {
  const timer = orderMetrics.orderProcessingTime.startTimer();

  try {
    await fulfillOrder(order);
    orderMetrics.ordersCreated.inc({
      payment_method: order.paymentMethod,
      shipping_type: order.shippingType,
    });
    orderMetrics.orderValue.observe(order.total);
  } finally {
    timer();
    orderMetrics.pendingOrders.dec();
  }
}
```

---

## Metric Backends

### Prometheus

```yaml
monitoring:
  metrics:
    backend: "prometheus"

    prometheus:
      # Push gateway (optional)
      push_gateway:
        url: "http://pushgateway:9091"
        job: "myapp"
        push_interval: "15s"

      # Scrape config (for reference)
      scrape_config:
        scrape_interval: "15s"
        scrape_timeout: "10s"
```

### Datadog

```yaml
monitoring:
  metrics:
    backend: "datadog"

    datadog:
      api_key_env: "DD_API_KEY"
      app_key_env: "DD_APP_KEY"

      # Default tags
      tags:
        - "env:production"
        - "service:api"

      # Histogram aggregations
      histogram:
        aggregates: ["avg", "count", "max", "min", "sum"]
        percentiles: [0.5, 0.75, 0.95, 0.99]
```

### CloudWatch

```yaml
monitoring:
  metrics:
    backend: "cloudwatch"

    cloudwatch:
      region: "us-east-1"
      namespace: "MyApp"

      # Dimensions
      dimensions:
        Environment: "production"
        Service: "api"

      # Resolution
      storage_resolution: 60  # 1 minute
```

---

## Aggregation & Queries

### Common Queries

```yaml
monitoring:
  metrics:
    queries:
      # Request rate
      request_rate: |
        rate(http_requests_total[5m])

      # Error rate
      error_rate: |
        rate(http_errors_total[5m]) / rate(http_requests_total[5m])

      # P99 latency
      p99_latency: |
        histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

      # Active users (cardinality)
      active_users: |
        count(count by (user_id) (http_requests_total[1h]))
```

---

## Commands

```bash
# View current metrics
proagents metrics list

# Query specific metric
proagents metrics query http_requests_total

# Export metrics
proagents metrics export --format prometheus > metrics.txt

# Test metrics endpoint
proagents metrics test

# Generate metric documentation
proagents metrics docs
```

---

## Best Practices

1. **Use Standard Names**: Follow naming conventions (e.g., Prometheus)
2. **Label Carefully**: High cardinality labels are expensive
3. **Histogram Over Summary**: Histograms are more flexible
4. **Include Units**: Add units to metric names (e.g., `_seconds`, `_bytes`)
5. **Document Metrics**: Add descriptions and usage examples
6. **Alert on Symptoms**: Alert on user-facing metrics first
