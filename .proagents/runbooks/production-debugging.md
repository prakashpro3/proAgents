# Production Debugging Runbook

Systematic approach to debugging issues in production environments.

---

## Overview

This runbook provides techniques for safely debugging production systems while minimizing risk and impact to users.

**When to use:**
- Investigating production bugs
- Performance issues in production
- Intermittent failures
- Data inconsistencies

---

## Prerequisites

- [ ] Read-only production access
- [ ] Access to logging systems
- [ ] Access to APM/tracing tools
- [ ] Understanding of system architecture
- [ ] Incident channel for communication

---

## Safety First

### Production Debugging Rules

1. **Never modify production data directly**
2. **Use read-only queries when possible**
3. **Always have a rollback plan**
4. **Document all actions**
5. **Communicate with the team**
6. **Consider user impact**

### Before You Start

```bash
# Ensure you're in read-only mode if possible
export READONLY_MODE=true

# Verify which environment you're connected to
echo $ENVIRONMENT  # Should show "production"

# Alert the team
pa:debug start --reason "Investigating ticket #1234"
```

---

## Step 1: Gather Context

### 1.1 Understand the Issue

```markdown
**Issue Context**
- **Reported by**: [User/Alert/Team]
- **First occurrence**: [DateTime]
- **Frequency**: [Constant/Intermittent/Periodic]
- **Affected users**: [Specific users/All users/Percentage]
- **Affected feature**: [Feature name]
- **Error message**: [Exact error if available]
- **Steps to reproduce**: [If known]
```

### 1.2 Check Recent Changes

```bash
# Recent deployments
kubectl rollout history deployment/<service> -n production

# Git log for the service
git log --oneline --since="7 days ago" -- src/<service>

# Config changes
kubectl diff -f production-config.yaml

# Feature flag changes
curl -s https://flags.example.com/api/changes?since=7d | jq
```

### 1.3 Check System Health

```bash
# Service health
curl -s https://api.example.com/health | jq

# Resource usage
kubectl top pods -n production -l app=<service>

# Recent events
kubectl get events -n production --sort-by='.lastTimestamp'
```

---

## Step 2: Log Analysis

### 2.1 Find Relevant Logs

```bash
# Application logs - recent errors
kubectl logs -n production -l app=<service> --tail=1000 | grep -i error

# Specific time window
kubectl logs -n production <pod> --since-time="2024-01-15T14:00:00Z"

# Using log aggregation (Datadog example)
# Query: service:<service> status:error @http.status_code:>499
```

### 2.2 Log Search Patterns

**Common Error Patterns:**
```bash
# Connection errors
grep -E "(connection refused|timeout|ECONNRESET)" logs.txt

# Authentication errors
grep -E "(unauthorized|forbidden|401|403)" logs.txt

# Database errors
grep -E "(deadlock|constraint violation|duplicate key)" logs.txt

# Memory issues
grep -E "(out of memory|heap|OOM)" logs.txt
```

### 2.3 Correlate Logs

```bash
# Find request ID/trace ID in error
grep "error" logs.txt | grep -oE "trace_id=\w+"

# Follow the trace across services
# In Datadog: @trace_id:<trace_id>
# In Jaeger: Search by trace ID
```

### 2.4 Log Analysis Template

```markdown
**Log Analysis Findings**

**Error Pattern**: Database connection timeout
**First Seen**: 2024-01-15 14:32:15 UTC
**Frequency**: ~50/minute
**Sample Error**:
```
[ERROR] [2024-01-15T14:32:15Z] DatabaseError: Connection timeout after 30s
  at ConnectionPool.acquire (db.js:142)
  at UserService.getUser (user-service.js:56)
```

**Correlation**: Errors started after deployment v1.2.4
**Hypothesis**: New query in v1.2.4 is too slow
```

---

## Step 3: Tracing & APM

### 3.1 Find Slow/Failed Requests

```bash
# In APM tool, search for:
# - Status: error
# - Duration: > 5s
# - Service: <your-service>
# - Time range: When issue occurred
```

### 3.2 Analyze Traces

**What to look for:**
- Which span is taking longest?
- Are there error spans?
- Database queries - count and duration
- External API calls - duration and status
- Memory/CPU during request

### 3.3 Compare Good vs Bad Requests

```markdown
**Request Comparison**

| Aspect | Good Request | Bad Request |
|--------|--------------|-------------|
| Duration | 120ms | 32,000ms |
| DB Queries | 3 | 47 |
| External Calls | 1 | 1 |
| Error | None | Timeout |
| User Type | Regular | Premium |
| Data Size | Small | Large |

**Finding**: Premium users with large data trigger N+1 query
```

---

## Step 4: Database Investigation

### 4.1 Check Database Performance

```sql
-- Active queries (PostgreSQL)
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Slow query log
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;

-- Lock contention
SELECT * FROM pg_locks WHERE NOT granted;
```

### 4.2 Analyze Slow Queries

```sql
-- Explain problematic query
EXPLAIN ANALYZE
SELECT * FROM users
WHERE created_at > '2024-01-01'
AND status = 'active';

-- Check for missing indexes
SELECT schemaname, tablename, attname, null_frac, n_distinct
FROM pg_stats
WHERE tablename = 'users';
```

### 4.3 Check Connection Pool

```bash
# Application connection pool stats
curl -s http://localhost:9090/metrics | grep db_pool

# Database connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'mydb';

# Connection states
SELECT state, count(*) FROM pg_stat_activity
WHERE datname = 'mydb' GROUP BY state;
```

---

## Step 5: Memory & CPU Analysis

### 5.1 Check Resource Usage

```bash
# Pod resource usage
kubectl top pods -n production -l app=<service>

# Detailed container stats
kubectl exec -n production <pod> -- top -bn1

# Memory breakdown
kubectl exec -n production <pod> -- cat /proc/meminfo
```

### 5.2 Memory Leak Detection

```bash
# Heap dump (Node.js)
kubectl exec -n production <pod> -- \
  node --heapsnapshot-signal=SIGUSR2 -e "process.kill(process.pid, 'SIGUSR2')"

# Memory over time
# Check APM/monitoring for memory growth pattern
```

### 5.3 CPU Profiling

```bash
# CPU profile (Node.js)
kubectl exec -n production <pod> -- \
  node --prof app.js

# Flame graphs
# Use APM continuous profiling or
# kubectl exec -n production <pod> -- perf record -F 99 -p $(pgrep node)
```

---

## Step 6: Network Analysis

### 6.1 Check Network Connectivity

```bash
# DNS resolution
kubectl exec -n production <pod> -- nslookup api.external-service.com

# TCP connectivity
kubectl exec -n production <pod> -- nc -zv database.internal 5432

# Latency to dependencies
kubectl exec -n production <pod> -- curl -w "%{time_total}" -o /dev/null -s https://api.external.com
```

### 6.2 Network Issues

```bash
# Check for connection timeouts
netstat -an | grep -c TIME_WAIT
netstat -an | grep -c ESTABLISHED

# DNS issues
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=100

# Service mesh issues (if using Istio)
kubectl logs -n production <pod> -c istio-proxy --tail=100
```

---

## Step 7: Reproduce Safely

### 7.1 Local Reproduction

```bash
# Pull production data (anonymized) to local
./scripts/sync-test-data.sh --anonymize

# Run with production config (read-only)
ENVIRONMENT=prod-replica npm run start:debug

# Reproduce the scenario
curl -X POST http://localhost:3000/api/problematic-endpoint \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-123"}'
```

### 7.2 Staging Reproduction

```bash
# Deploy same version to staging
kubectl set image deployment/my-service \
  my-service=my-registry/my-service:v1.2.4 \
  -n staging

# Replay production traffic (if available)
./scripts/replay-traffic.sh --source production --target staging
```

### 7.3 Debug Endpoints (if available)

```bash
# Enable debug mode for specific user (feature flag)
curl -X POST https://flags.example.com/api/flags/debug-mode \
  -d '{"users": ["problem-user-id"]}'

# Use debug endpoints
curl -s https://api.example.com/debug/user/problem-user-id/state | jq
```

---

## Step 8: Document & Fix

### 8.1 Document Findings

```markdown
# Debug Session: TICKET-1234

## Summary
Premium users experiencing timeouts when loading dashboard.

## Root Cause
N+1 query in `getDashboardData()` - for users with 100+ items,
generates 100+ queries instead of batch loading.

## Evidence
- Traces show 100+ DB queries for affected requests
- All queries are identical SELECT on items table
- Works fine for users with < 20 items

## Code Location
`src/services/dashboard.js:142` - Loop calling single-item fetch

## Fix
Replace loop with batch query using WHERE id IN (...)

## Test Plan
1. Unit test with 100+ items
2. Load test on staging
3. Monitor after deploy
```

### 8.2 Create Fix

```bash
# Create fix branch
git checkout -b fix/dashboard-n-plus-one

# Make changes
# ... edit code ...

# Test locally
npm run test
npm run test:integration

# Create PR
gh pr create --title "Fix N+1 query in dashboard loading"
```

### 8.3 Verify Fix

```bash
# After deploying fix:

# Check error rate (should decrease)
# Monitor: error rate for dashboard endpoint

# Check latency (should improve)
# Monitor: p99 latency for dashboard endpoint

# Check DB queries (should decrease)
# Trace comparison: before vs after
```

---

## Debug Commands Reference

```bash
# Start debug session
pa:debug start --ticket TICKET-1234

# Log findings
pa:debug log "Found N+1 query in dashboard loading"

# Share findings
pa:debug share --channel #engineering

# End session
pa:debug end --summary "Root cause: N+1 query, fix deployed"
```

---

## Tools Reference

### Log Analysis
- **Datadog Logs**: `service:<name> status:error`
- **CloudWatch**: Filter patterns, Insights queries
- **ELK Stack**: Kibana query DSL

### Tracing
- **Datadog APM**: Service map, traces, profiles
- **Jaeger**: Distributed tracing
- **X-Ray**: AWS service tracing

### Database
- **pgAdmin/psql**: PostgreSQL
- **MySQL Workbench**: MySQL
- **Compass**: MongoDB

### Profiling
- **Node.js**: `--inspect`, Chrome DevTools
- **Python**: cProfile, py-spy
- **Go**: pprof

---

## When to Stop

**Stop debugging and escalate when:**
- Issue is causing significant user impact
- You've spent 30+ minutes without progress
- You need access you don't have
- The fix requires expertise you don't have
- It's outside business hours and can wait

**Escalation path:**
1. Team lead / Senior engineer
2. Service owner
3. Platform/SRE team
4. External support (DB vendor, cloud provider)
