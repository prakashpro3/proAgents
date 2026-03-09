# Health Checks

Monitoring application and service health.

---

## Health Check Types

| Type | Purpose | Frequency | Timeout |
|------|---------|-----------|---------|
| **Liveness** | Is the service running? | 10s | 1s |
| **Readiness** | Can it accept traffic? | 5s | 3s |
| **Startup** | Has it finished initializing? | 5s | 30s |
| **Deep** | Are all dependencies healthy? | 30s | 10s |

---

## Configuration

### Basic Health Endpoints

```yaml
# proagents.config.yaml
monitoring:
  health_checks:
    enabled: true

    endpoints:
      # Simple liveness check
      liveness:
        path: "/health/live"
        method: "GET"
        success_codes: [200]

      # Readiness with dependencies
      readiness:
        path: "/health/ready"
        method: "GET"
        success_codes: [200]
        check_dependencies: true

      # Detailed health status
      deep:
        path: "/health"
        method: "GET"
        success_codes: [200]
        include_details: true
```

### Dependency Checks

```yaml
monitoring:
  health_checks:
    dependencies:
      # Database
      database:
        type: "postgres"
        connection_string_env: "DATABASE_URL"
        timeout: "3s"
        query: "SELECT 1"
        critical: true

      # Redis
      cache:
        type: "redis"
        url_env: "REDIS_URL"
        timeout: "1s"
        command: "PING"
        critical: true

      # External API
      payment_api:
        type: "http"
        url: "https://api.stripe.com/v1/health"
        timeout: "5s"
        expected_status: 200
        critical: false

      # Message queue
      message_queue:
        type: "rabbitmq"
        url_env: "RABBITMQ_URL"
        timeout: "2s"
        critical: true
```

---

## Health Response Format

### Simple Response

```json
{
  "status": "healthy"
}
```

### Detailed Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.2.3",
  "uptime": "3d 4h 25m",
  "checks": {
    "database": {
      "status": "healthy",
      "latency_ms": 5,
      "details": {
        "connections_active": 10,
        "connections_max": 50
      }
    },
    "cache": {
      "status": "healthy",
      "latency_ms": 1,
      "details": {
        "memory_used": "128MB",
        "hit_rate": "95%"
      }
    },
    "payment_api": {
      "status": "degraded",
      "latency_ms": 850,
      "message": "Elevated latency"
    }
  }
}
```

### Unhealthy Response

```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "checks": {
    "database": {
      "status": "unhealthy",
      "error": "Connection refused",
      "last_healthy": "2024-01-15T10:25:00Z"
    },
    "cache": {
      "status": "healthy"
    }
  }
}
```

---

## Kubernetes Integration

### Pod Health Probes

```yaml
monitoring:
  health_checks:
    kubernetes:
      # Liveness probe
      liveness_probe:
        http_get:
          path: "/health/live"
          port: 8080
        initial_delay_seconds: 10
        period_seconds: 10
        timeout_seconds: 1
        failure_threshold: 3

      # Readiness probe
      readiness_probe:
        http_get:
          path: "/health/ready"
          port: 8080
        initial_delay_seconds: 5
        period_seconds: 5
        timeout_seconds: 3
        failure_threshold: 3

      # Startup probe
      startup_probe:
        http_get:
          path: "/health/startup"
          port: 8080
        initial_delay_seconds: 0
        period_seconds: 5
        timeout_seconds: 30
        failure_threshold: 30
```

### Generated Kubernetes YAML

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: app
      livenessProbe:
        httpGet:
          path: /health/live
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 10
        timeoutSeconds: 1
        failureThreshold: 3

      readinessProbe:
        httpGet:
          path: /health/ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5
        timeoutSeconds: 3
        failureThreshold: 3

      startupProbe:
        httpGet:
          path: /health/startup
          port: 8080
        periodSeconds: 5
        failureThreshold: 30
```

---

## Custom Health Checks

### Application-Level Checks

```yaml
monitoring:
  health_checks:
    custom:
      # Memory usage
      memory:
        type: "resource"
        threshold:
          warning: "80%"
          critical: "95%"

      # Disk space
      disk:
        type: "resource"
        path: "/data"
        threshold:
          warning: "80%"
          critical: "95%"

      # Queue depth
      queue_depth:
        type: "metric"
        metric: "queue.messages.count"
        threshold:
          warning: 1000
          critical: 5000

      # Error rate
      error_rate:
        type: "metric"
        metric: "http.errors.rate"
        window: "5m"
        threshold:
          warning: "1%"
          critical: "5%"
```

### Code Implementation

```typescript
import { HealthChecker, HealthStatus } from '@proagents/monitoring';

const healthChecker = new HealthChecker();

// Add database check
healthChecker.addCheck('database', async () => {
  try {
    const start = Date.now();
    await db.query('SELECT 1');
    return {
      status: HealthStatus.HEALTHY,
      latency_ms: Date.now() - start,
    };
  } catch (error) {
    return {
      status: HealthStatus.UNHEALTHY,
      error: error.message,
    };
  }
});

// Add custom business logic check
healthChecker.addCheck('order_processing', async () => {
  const pendingOrders = await getStaleOrders();
  if (pendingOrders > 100) {
    return {
      status: HealthStatus.DEGRADED,
      message: `${pendingOrders} orders pending`,
    };
  }
  return { status: HealthStatus.HEALTHY };
});

// Express endpoint
app.get('/health', async (req, res) => {
  const health = await healthChecker.check();
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

## Health Check Aggregation

### Service Mesh Health

```yaml
monitoring:
  health_checks:
    aggregation:
      # Aggregate health from multiple services
      services:
        - name: "api-gateway"
          url: "http://api-gateway:8080/health"
          weight: 1.0

        - name: "auth-service"
          url: "http://auth-service:8080/health"
          weight: 1.0
          critical: true

        - name: "user-service"
          url: "http://user-service:8080/health"
          weight: 0.8

      # Aggregation rules
      rules:
        healthy: "all_critical_healthy AND healthy_percentage >= 80"
        degraded: "all_critical_healthy AND healthy_percentage >= 50"
        unhealthy: "any_critical_unhealthy OR healthy_percentage < 50"
```

### Dashboard Health Summary

```yaml
monitoring:
  health_checks:
    dashboard:
      # Overall system health
      system_health:
        endpoint: "/health/system"
        components:
          - "api"
          - "database"
          - "cache"
          - "queue"

      # Per-environment health
      environments:
        production:
          services: ["api-prod", "worker-prod"]
        staging:
          services: ["api-staging", "worker-staging"]
```

---

## Alerting on Health

### Health-Based Alerts

```yaml
monitoring:
  health_checks:
    alerts:
      # Service unhealthy
      - name: "Service Unhealthy"
        condition: "status == unhealthy"
        duration: "1m"
        severity: "critical"
        notify: ["pagerduty", "#incidents"]

      # Service degraded
      - name: "Service Degraded"
        condition: "status == degraded"
        duration: "5m"
        severity: "warning"
        notify: ["#alerts"]

      # Dependency failing
      - name: "Database Unhealthy"
        condition: "checks.database.status == unhealthy"
        duration: "30s"
        severity: "critical"
        notify: ["pagerduty", "#database-alerts"]
```

---

## Commands

```bash
# Check health
proagents health check

# Check specific service
proagents health check --service api

# Check all dependencies
proagents health check --deep

# View health history
proagents health history --last 24h

# Test health endpoints
proagents health test --endpoint /health/ready

# Generate Kubernetes probes
proagents health generate-k8s
```

---

## Best Practices

1. **Fast Liveness**: Keep liveness checks simple and fast
2. **Meaningful Readiness**: Include dependency checks in readiness
3. **Appropriate Timeouts**: Set realistic timeouts for each check
4. **Graceful Degradation**: Report degraded status, not just healthy/unhealthy
5. **Don't Over-Check**: Balance thoroughness with performance
6. **Include Context**: Add details to help diagnose issues
7. **Version the Response**: Include app version in health response
