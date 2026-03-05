# Performance Degradation Runbook

Response procedures for performance issues in production.

---

## Overview

This runbook provides systematic procedures for investigating and resolving performance degradation in production systems.

**When to use:**
- Response times are increasing
- Error rates are elevated
- System resources are constrained
- Users are reporting slowness
- Performance alerts are firing

---

## Prerequisites

- [ ] Access to APM/monitoring tools
- [ ] Access to infrastructure metrics
- [ ] Access to application logs
- [ ] Understanding of system architecture
- [ ] Baseline performance metrics

---

## Performance Thresholds

### Response Time Targets

| Endpoint Type | p50 Target | p95 Target | p99 Target |
|---------------|------------|------------|------------|
| API - Read | < 100ms | < 300ms | < 500ms |
| API - Write | < 200ms | < 500ms | < 1000ms |
| API - Complex | < 500ms | < 1000ms | < 2000ms |
| Page Load | < 1s | < 2s | < 3s |

### Resource Thresholds

| Resource | Warning | Critical |
|----------|---------|----------|
| CPU | > 70% | > 90% |
| Memory | > 80% | > 95% |
| Disk I/O | > 70% | > 90% |
| Network | > 60% | > 80% |
| DB Connections | > 70% | > 90% |

---

## Step 1: Initial Assessment

### 1.1 Confirm the Issue

```bash
# Check current latency
curl -w "Total: %{time_total}s\n" -o /dev/null -s https://api.example.com/health

# Compare to baseline
# Baseline p95: 150ms
# Current p95: 850ms ← Issue confirmed
```

### 1.2 Scope the Problem

```markdown
**Performance Issue Assessment**

| Question | Finding |
|----------|---------|
| What's affected? | API endpoints /users/* |
| When did it start? | 2024-01-15 14:30 UTC |
| User impact? | All users, 5x slower |
| Geographic? | Global |
| Intermittent? | Constant |
| Correlations? | Started after deployment v1.2.4 |
```

### 1.3 Quick Health Check

```bash
# Application health
curl -s https://api.example.com/health | jq

# Pod status
kubectl get pods -n production -l app=my-service

# Resource usage
kubectl top pods -n production -l app=my-service

# Recent events
kubectl get events -n production --sort-by='.lastTimestamp' | head -20
```

---

## Step 2: Identify the Bottleneck

### 2.1 Check Application Metrics

```bash
# In your APM tool, check:
# - Request rate (is traffic higher than normal?)
# - Latency by endpoint (which endpoints are slow?)
# - Error rate (are errors causing retries?)
# - Throughput (is processing rate dropping?)
```

**Key Questions:**
- Is latency high across all endpoints or specific ones?
- Did something change at the time of degradation?
- Is the traffic volume unusual?

### 2.2 Check Infrastructure Metrics

```bash
# CPU usage
kubectl top pods -n production

# Memory usage
kubectl exec -n production <pod> -- free -m

# Disk I/O
kubectl exec -n production <pod> -- iostat -x 1 5

# Network
kubectl exec -n production <pod> -- netstat -s | grep -i error
```

**Resource Bottleneck Indicators:**

| Resource | Symptom | Indicator |
|----------|---------|-----------|
| CPU | High latency, slow processing | CPU > 90%, load average high |
| Memory | OOM kills, GC pauses | Memory > 95%, frequent GC |
| Disk | Slow I/O operations | I/O wait high, disk queue |
| Network | Timeouts, connection errors | High latency, packet loss |

### 2.3 Check Database Metrics

```sql
-- Active connections (PostgreSQL)
SELECT count(*) FROM pg_stat_activity WHERE state != 'idle';

-- Long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC LIMIT 10;

-- Table statistics
SELECT schemaname, relname, seq_scan, idx_scan, n_live_tup
FROM pg_stat_user_tables
ORDER BY seq_scan DESC LIMIT 10;
```

### 2.4 Check External Dependencies

```bash
# External API latency
curl -w "DNS: %{time_namelookup}s, Connect: %{time_connect}s, Total: %{time_total}s\n" \
  -o /dev/null -s https://api.external-service.com/health

# Redis latency
redis-cli -h <redis-host> --latency

# Check dependency status pages
curl -s https://status.aws.amazon.com/data.json | jq
```

---

## Step 3: Common Performance Issues

### 3.1 High CPU Usage

**Symptoms:**
- Response times increasing
- CPU > 90%
- Application feels sluggish

**Investigation:**
```bash
# Find CPU-intensive processes
kubectl exec -n production <pod> -- top -bn1 | head -15

# Profile the application
# Node.js: --prof flag or APM profiler
# Java: jstack, async-profiler
```

**Quick Fixes:**
```bash
# Scale horizontally
kubectl scale deployment/my-service -n production --replicas=10

# If single endpoint is problematic, add rate limiting
# Or disable CPU-intensive features temporarily
```

### 3.2 Memory Pressure

**Symptoms:**
- OOM kills
- GC pauses
- Slow response times
- Memory > 90%

**Investigation:**
```bash
# Memory usage
kubectl exec -n production <pod> -- free -m

# GC statistics (Node.js)
# Check APM for GC pause times

# Heap analysis
kubectl exec -n production <pod> -- \
  node --heapsnapshot-signal=SIGUSR2 -e "..."
```

**Quick Fixes:**
```bash
# Restart pods (temporary)
kubectl rollout restart deployment/my-service -n production

# Increase memory limits
kubectl set resources deployment/my-service -n production \
  --limits=memory=2Gi
```

### 3.3 Database Bottleneck

**Symptoms:**
- Slow queries
- High connection count
- Database CPU/memory high

**Investigation:**
```sql
-- Slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC LIMIT 10;

-- Missing indexes
SELECT schemaname, relname, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_scan DESC;

-- Lock contention
SELECT * FROM pg_locks WHERE NOT granted;
```

**Quick Fixes:**
```sql
-- Kill long-running queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE duration > interval '5 minutes'
AND state != 'idle';

-- Add missing index (carefully)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

### 3.4 Network Issues

**Symptoms:**
- Timeouts
- Connection errors
- High latency to dependencies

**Investigation:**
```bash
# DNS resolution
kubectl exec -n production <pod> -- nslookup api.example.com

# Connectivity test
kubectl exec -n production <pod> -- \
  curl -w "Connect: %{time_connect}s, Total: %{time_total}s\n" \
  -o /dev/null -s https://api.external.com

# Check for packet loss
kubectl exec -n production <pod> -- ping -c 10 database.internal
```

**Quick Fixes:**
```bash
# Restart DNS cache
kubectl rollout restart deployment/coredns -n kube-system

# Increase connection timeouts
# Update application configuration
```

### 3.5 Traffic Spike

**Symptoms:**
- Sudden traffic increase
- All resources elevated
- Started at specific time

**Investigation:**
```bash
# Check traffic patterns
# In APM: request count over time

# Identify traffic source
# Check user agents, IPs, referrers

# Is it legitimate traffic?
# Marketing campaign? Viral event? Attack?
```

**Quick Fixes:**
```bash
# Scale up
kubectl scale deployment/my-service -n production --replicas=20

# Enable rate limiting
# Configure WAF rules if attack

# Enable caching
# Add CDN, increase cache TTL
```

---

## Step 4: Apply Mitigation

### 4.1 Quick Mitigations

| Issue | Mitigation | Command |
|-------|------------|---------|
| High load | Scale up | `kubectl scale deployment/app --replicas=10` |
| Memory leak | Restart pods | `kubectl rollout restart deployment/app` |
| Bad deployment | Rollback | `kubectl rollout undo deployment/app` |
| Slow endpoint | Disable feature | Feature flag or config change |
| DB overload | Connection limits | Update pool configuration |
| External dependency | Circuit breaker | Enable fallback |

### 4.2 Scaling Options

```bash
# Horizontal scaling
kubectl scale deployment/my-service -n production --replicas=15

# Vertical scaling (if limits allow)
kubectl set resources deployment/my-service -n production \
  --limits=cpu=2,memory=4Gi

# Auto-scaling
kubectl apply -f - <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-service-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-service
  minReplicas: 5
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
EOF
```

### 4.3 Traffic Management

```bash
# Rate limiting
kubectl apply -f rate-limit-config.yaml

# Traffic shifting (reduce load on affected service)
kubectl apply -f traffic-shift.yaml

# Enable caching
kubectl set env deployment/my-service CACHE_ENABLED=true
```

---

## Step 5: Verify Resolution

### 5.1 Check Metrics

```bash
# Response times (should decrease)
# Monitor APM dashboard

# Error rates (should normalize)
# Check error rate graphs

# Resource usage (should stabilize)
kubectl top pods -n production -l app=my-service

# User impact (should resolve)
# Check support channels, user reports
```

### 5.2 Confirm Resolution

```markdown
**Resolution Verification**

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| p95 Latency | 850ms | 145ms | < 300ms |
| Error Rate | 5.2% | 0.1% | < 0.5% |
| CPU Usage | 95% | 45% | < 70% |
| Memory | 92% | 68% | < 80% |

**Status**: ✅ Resolved
```

---

## Step 6: Root Cause Analysis

### 6.1 Investigate Trigger

```bash
# Recent deployments
kubectl rollout history deployment/my-service -n production

# Config changes
git log --since="24 hours ago" -- config/

# Traffic patterns
# Check APM for traffic source

# External factors
# Check dependency status pages
```

### 6.2 Document Findings

```markdown
# Performance Incident Report

## Summary
API latency increased 5x due to N+1 query introduced in v1.2.4.

## Timeline
- 14:30 - Deployment v1.2.4 completed
- 14:45 - Performance alerts fired
- 15:00 - Root cause identified
- 15:15 - Rolled back to v1.2.3
- 15:20 - Performance restored

## Root Cause
New feature in v1.2.4 introduced N+1 query pattern:
- Before: 1 query per request
- After: 1 + N queries (N = items count)

For users with 100 items, latency increased from 100ms to 800ms.

## Impact
- Duration: 50 minutes
- Users affected: All users
- Severity: Medium

## Action Items
- [ ] Fix N+1 query (due: tomorrow)
- [ ] Add query count monitoring (due: this week)
- [ ] Add performance tests to CI (due: next sprint)
```

---

## Performance Commands

```bash
# Start performance investigation
/perf investigate --service my-service

# Quick metrics check
/perf status

# Generate performance report
/perf report --period "last-24h"

# Scale service
/perf scale my-service --replicas 10

# Enable performance mode
/perf optimize --enable-cache --enable-compression
```

---

## Monitoring Dashboard Checklist

### During Investigation

- [ ] Request latency (p50, p95, p99)
- [ ] Request rate / throughput
- [ ] Error rate
- [ ] CPU utilization
- [ ] Memory utilization
- [ ] Database connections
- [ ] Database query times
- [ ] External API latency
- [ ] Network I/O
- [ ] Disk I/O

### After Resolution

- [ ] Metrics returned to baseline
- [ ] No error spikes
- [ ] Resources stabilized
- [ ] User complaints resolved

---

## Escalation

### When to Escalate

- Unable to identify root cause after 30 minutes
- Mitigation attempts not working
- Impact is severe and growing
- Need infrastructure changes
- Requires database expert

### Escalation Contacts

| Role | Contact | When |
|------|---------|------|
| Platform Team | @platform-oncall | Infrastructure issues |
| DBA Team | @dba-oncall | Database issues |
| Architecture | @arch-team | Design issues |
| Cloud Provider | Support ticket | Cloud service issues |

---

## Prevention

### Performance Testing

```yaml
# CI/CD performance gate
- name: Performance Test
  run: |
    npm run test:performance
    if [ $(cat perf-results.json | jq '.p95') -gt 300 ]; then
      echo "P95 latency exceeds 300ms threshold"
      exit 1
    fi
```

### Monitoring Alerts

```yaml
# Alert configuration
alerts:
  - name: high_latency
    condition: p95_latency > 300ms
    for: 5m
    severity: warning

  - name: critical_latency
    condition: p95_latency > 1000ms
    for: 2m
    severity: critical
```

### Capacity Planning

- Regular load testing
- Capacity reviews quarterly
- Auto-scaling policies
- Resource budgets per service
