# Log Levels

Understanding and configuring log severity levels.

---

## Standard Log Levels

| Level | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `TRACE` | 10 | Most detailed | Development debugging |
| `DEBUG` | 20 | Diagnostic info | Development/staging |
| `INFO` | 30 | Normal operations | Production events |
| `WARN` | 40 | Potential issues | Recoverable problems |
| `ERROR` | 50 | Errors requiring attention | Failed operations |
| `FATAL` | 60 | Critical failures | Application crashes |

---

## Level Configuration

### Environment-Based Levels

```yaml
# proagents.config.yaml
logging:
  levels:
    # Default level
    default: "info"

    # Environment overrides
    environments:
      development:
        default: "debug"
        modules:
          database: "trace"
          http: "debug"

      staging:
        default: "info"
        modules:
          database: "debug"

      production:
        default: "warn"
        modules:
          security: "info"  # Always log security events
          audit: "info"     # Always log audit events
```

### Module-Specific Levels

```yaml
logging:
  levels:
    modules:
      # Application modules
      auth:
        level: "info"
        include_trace_id: true

      payments:
        level: "info"
        include_user_id: true

      # Framework modules
      http:
        level: "warn"
        exclude_paths: ["/health", "/metrics"]

      database:
        level: "warn"
        slow_query_threshold: "1000ms"
        log_slow_queries: "info"

      cache:
        level: "warn"
        log_misses: false
```

---

## Level Descriptions

### TRACE

```yaml
# When to use TRACE
# - Entering/exiting functions
# - Variable values during iteration
# - Detailed algorithm steps

# Example
logging:
  trace:
    use_for:
      - "function_entry_exit"
      - "loop_iterations"
      - "algorithm_steps"

    # Typically disabled in production
    enabled_in:
      - "development"

# Code example
logger.trace("Entering processOrder", { orderId, items: items.length });
logger.trace("Processing item", { index: i, item });
logger.trace("Exiting processOrder", { result });
```

### DEBUG

```yaml
# When to use DEBUG
# - Request/response details
# - Configuration loaded
# - State changes

logging:
  debug:
    use_for:
      - "request_details"
      - "configuration"
      - "state_changes"

    enabled_in:
      - "development"
      - "staging"

# Code example
logger.debug("Processing request", { method, path, headers });
logger.debug("Configuration loaded", { config });
logger.debug("State changed", { from: oldState, to: newState });
```

### INFO

```yaml
# When to use INFO
# - Application start/stop
# - User actions completed
# - Scheduled jobs executed

logging:
  info:
    use_for:
      - "application_lifecycle"
      - "user_actions"
      - "scheduled_jobs"
      - "significant_operations"

    enabled_in:
      - "development"
      - "staging"
      - "production"

# Code example
logger.info("Application started", { version, environment });
logger.info("User registered", { userId, plan });
logger.info("Daily report generated", { recordCount });
```

### WARN

```yaml
# When to use WARN
# - Deprecated API usage
# - Retry attempts
# - Approaching limits

logging:
  warn:
    use_for:
      - "deprecation_warnings"
      - "retry_attempts"
      - "threshold_approaches"
      - "fallback_activation"

    enabled_in:
      - "all"

# Code example
logger.warn("API deprecated, use v2", { endpoint, replacementEndpoint });
logger.warn("Retry attempt", { attempt: 2, maxAttempts: 3 });
logger.warn("Rate limit approaching", { current: 90, limit: 100 });
```

### ERROR

```yaml
# When to use ERROR
# - Exceptions caught
# - Failed operations
# - Invalid data

logging:
  error:
    use_for:
      - "exceptions"
      - "failed_operations"
      - "invalid_data"
      - "integration_failures"

    enabled_in:
      - "all"

    # Always include
    include:
      - "stack_trace"
      - "error_code"
      - "request_id"

# Code example
logger.error("Payment processing failed", {
  error: err.message,
  stack: err.stack,
  orderId,
  paymentMethod
});
```

### FATAL

```yaml
# When to use FATAL
# - Unrecoverable errors
# - Application crash
# - Critical system failure

logging:
  fatal:
    use_for:
      - "unrecoverable_errors"
      - "application_crash"
      - "critical_failures"

    enabled_in:
      - "all"

    # Alert immediately
    alert:
      enabled: true
      channels: ["pagerduty", "#critical"]

# Code example
logger.fatal("Database connection pool exhausted", {
  error: err.message,
  action: "Application shutting down"
});
process.exit(1);
```

---

## Dynamic Level Changes

### Runtime Level Adjustment

```yaml
logging:
  dynamic:
    # Allow runtime changes
    enabled: true

    # API endpoint
    api:
      enabled: true
      path: "/_admin/logging"
      auth_required: true

    # Temporary level changes
    temporary:
      enabled: true
      max_duration: "1h"
      auto_revert: true
```

### Commands

```bash
# Change log level at runtime
proagents logging set-level debug

# Change for specific module
proagents logging set-level trace --module database

# Temporary debug mode
proagents logging debug --duration 30m

# View current levels
proagents logging levels

# Reset to defaults
proagents logging reset
```

---

## Level Filtering

### Output Filtering

```yaml
logging:
  filtering:
    # By level
    outputs:
      console:
        min_level: "debug"

      file:
        min_level: "info"

      remote:
        min_level: "warn"

    # By module
    module_filters:
      # Only errors from noisy module
      "third-party-lib":
        max_level: "error"

      # Debug for specific module
      "my-feature":
        min_level: "debug"
```

### Sampling

```yaml
logging:
  sampling:
    # Sample debug logs in production
    rules:
      - level: "debug"
        environment: "production"
        sample_rate: 0.01  # 1%

      - level: "trace"
        environment: "production"
        sample_rate: 0  # Never

      - level: "info"
        environment: "production"
        sample_rate: 1  # Always
```

---

## Best Practices

### Level Selection Guide

```
┌──────────────────────────────────────────────────────────┐
│ What are you logging?                                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Application crash/critical failure    → FATAL           │
│ Error that needs attention            → ERROR           │
│ Something might be wrong              → WARN            │
│ Normal operation milestone            → INFO            │
│ Helpful for debugging                 → DEBUG           │
│ Very detailed tracing                 → TRACE           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Guidelines

1. **Production Default**: Use WARN or INFO
2. **Don't Over-Log**: Too many logs obscure important ones
3. **Be Consistent**: Same events should have same levels
4. **Include Context**: Add relevant data at appropriate levels
5. **Security**: Never log sensitive data at any level
6. **Performance**: High-volume events should be DEBUG/TRACE
