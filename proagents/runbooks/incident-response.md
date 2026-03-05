# Incident Response Runbook

Step-by-step guide for handling production incidents.

---

## Overview

This runbook provides a structured approach to responding to production incidents, from initial detection through resolution and post-mortem.

**When to use:**
- Production service is down or degraded
- Users are reporting issues
- Monitoring alerts have fired
- Security incident detected

---

## Prerequisites

- [ ] Access to production monitoring (Datadog, New Relic, etc.)
- [ ] Access to production logs (CloudWatch, ELK, etc.)
- [ ] Access to deployment tools (kubectl, AWS console, etc.)
- [ ] Access to communication channels (Slack, PagerDuty)
- [ ] On-call contact list available

---

## Severity Assessment

### Determine Severity Level

| Criteria | SEV1 | SEV2 | SEV3 | SEV4 |
|----------|------|------|------|------|
| User Impact | All users | Many users | Some users | Few users |
| Feature Impact | Core features | Major feature | Minor feature | Edge case |
| Revenue Impact | Significant | Moderate | Minimal | None |
| Data Risk | Data loss/breach | Data at risk | No data risk | No data risk |

### Response Times

| Severity | Acknowledge | Update Frequency | Resolution Target |
|----------|-------------|------------------|-------------------|
| SEV1 | 5 min | Every 15 min | 1 hour |
| SEV2 | 15 min | Every 30 min | 4 hours |
| SEV3 | 1 hour | Every 2 hours | 24 hours |
| SEV4 | 4 hours | Daily | 1 week |

---

## Step 1: Acknowledge & Assess

**Time Target: 5-15 minutes**

### 1.1 Acknowledge the Alert

```bash
# If using PagerDuty
pd incident acknowledge --id <incident-id>

# Or via Slack
pa:incident acknowledge
```

### 1.2 Initial Assessment

```bash
# Check service status
kubectl get pods -n <namespace>
kubectl get deployments -n <namespace>

# Check recent deployments
kubectl rollout history deployment/<service-name> -n <namespace>

# Quick health check
curl -s https://api.example.com/health | jq
```

### 1.3 Determine Severity

Based on assessment, classify the incident:

```bash
# Update incident severity
pa:incident severity set SEV2 --reason "Auth service affecting 30% of users"
```

### 1.4 Notify Stakeholders

```markdown
**Incident Update**
- **Status**: Investigating
- **Severity**: SEV2
- **Impact**: Login failures for ~30% of users
- **Started**: 14:32 UTC
- **Investigating**: @oncall-engineer
- **Next Update**: 15:00 UTC
```

---

## Step 2: Investigate

**Time Target: 15-30 minutes**

### 2.1 Check Monitoring Dashboards

```bash
# Key metrics to check:
# - Error rates
# - Latency (p50, p95, p99)
# - Traffic volume
# - Resource utilization (CPU, memory)
# - Database connections
# - External dependency status
```

### 2.2 Review Logs

```bash
# Recent error logs
kubectl logs -n <namespace> -l app=<service> --tail=500 | grep -i error

# Specific time window
kubectl logs -n <namespace> <pod-name> --since=30m

# Using log aggregation
# In Datadog: service:<name> status:error
# In CloudWatch: filter pattern "ERROR"
```

### 2.3 Check Recent Changes

```bash
# Recent deployments
kubectl rollout history deployment/<service> -n <namespace>

# Git commits in last 24h
git log --since="24 hours ago" --oneline

# Config changes
kubectl diff -f <config.yaml>
```

### 2.4 Check Dependencies

```bash
# Database connectivity
psql -h <db-host> -c "SELECT 1"

# Redis connectivity
redis-cli -h <redis-host> ping

# External API status
curl -s https://status.external-api.com/api/v1/status | jq
```

### 2.5 Document Findings

```markdown
**Investigation Update**
- **Root Cause Hypothesis**: Database connection pool exhaustion
- **Evidence**:
  - Connection pool at 100%
  - DB queries timing out
  - Spike in traffic at 14:30
- **Next Steps**: Increase pool size, identify query causing issue
```

---

## Step 3: Mitigate

**Goal: Restore service as quickly as possible**

### 3.1 Quick Mitigation Options

**Option A: Rollback**
```bash
# Rollback to previous version
kubectl rollout undo deployment/<service> -n <namespace>

# Or to specific revision
kubectl rollout undo deployment/<service> -n <namespace> --to-revision=<N>

# Verify rollback
kubectl rollout status deployment/<service> -n <namespace>
```

**Option B: Scale Up**
```bash
# Increase replicas
kubectl scale deployment/<service> -n <namespace> --replicas=10

# Or apply HPA
kubectl apply -f hpa.yaml
```

**Option C: Feature Flag**
```bash
# Disable problematic feature
curl -X POST https://flags.example.com/api/flags/<flag-name>/disable
```

**Option D: Traffic Shift**
```bash
# Route traffic away from problematic service
# Update load balancer or service mesh
kubectl apply -f traffic-shift.yaml
```

**Option E: Restart**
```bash
# Rolling restart
kubectl rollout restart deployment/<service> -n <namespace>

# Force restart (downtime)
kubectl delete pods -n <namespace> -l app=<service>
```

### 3.2 Verify Mitigation

```bash
# Check service health
curl -s https://api.example.com/health | jq

# Check error rates (should decrease)
# Monitor dashboards for improvement

# Check user-facing functionality
# Run smoke tests
```

### 3.3 Communicate Progress

```markdown
**Incident Update**
- **Status**: Mitigating
- **Severity**: SEV2
- **Action Taken**: Rolled back to version 1.2.3
- **Current Status**: Error rate decreasing
- **ETA for Resolution**: 15 minutes
- **Next Update**: 15:30 UTC
```

---

## Step 4: Resolve

**Goal: Confirm service is fully restored**

### 4.1 Verify Resolution

```bash
# All health checks passing
curl -s https://api.example.com/health | jq

# Error rates back to normal
# Check monitoring dashboards

# User reports resolved
# Check support channels

# Run integration tests
npm run test:integration
```

### 4.2 Document Resolution

```markdown
**Resolution Summary**
- **Root Cause**: Database connection pool exhaustion due to slow queries
- **Mitigation**: Rolled back to v1.2.3, increased pool size
- **Fix Applied**: Reverted problematic query change
- **Service Restored**: 15:45 UTC
- **Total Duration**: 1 hour 13 minutes
```

### 4.3 Close Incident

```bash
# Close in PagerDuty
pd incident resolve --id <incident-id>

# Final Slack update
pa:incident close --resolution "Rolled back problematic change, service restored"
```

### 4.4 Final Communication

```markdown
**Incident Resolved**

**Summary**: Login failures affecting ~30% of users

**Timeline**:
- 14:32 - Issue detected
- 14:40 - Investigation started
- 15:10 - Root cause identified
- 15:20 - Rollback initiated
- 15:45 - Service restored

**Impact**:
- Duration: 1 hour 13 minutes
- Users affected: ~5,000
- Failed logins: ~2,000

**Next Steps**:
- Post-mortem scheduled for tomorrow 10:00 AM
- Fix being developed for proper release
```

---

## Step 5: Post-Incident

**Complete within 24-48 hours**

### 5.1 Create Post-Mortem

```markdown
# Post-Mortem: INC-2024-0115

## Summary
On January 15, 2024, users experienced login failures for approximately 1 hour
due to database connection pool exhaustion.

## Timeline
- 14:30 - Traffic spike from marketing campaign
- 14:32 - Monitoring alerts fired
- 14:40 - On-call engineer acknowledged
- 15:10 - Root cause identified as connection pool exhaustion
- 15:20 - Rollback initiated
- 15:45 - Service fully restored

## Root Cause
A query optimization in v1.2.4 inadvertently increased query duration by 3x,
causing connections to be held longer. Combined with traffic spike, this
exhausted the connection pool.

## Impact
- 5,000 users affected
- 2,000 failed login attempts
- No data loss

## What Went Well
- Alerts fired promptly
- Quick rollback restored service
- Good communication throughout

## What Went Wrong
- Query change not load tested
- Connection pool monitoring didn't alert early enough

## Action Items
- [ ] Add load testing to CI/CD (owner: @dev-lead, due: Jan 22)
- [ ] Improve connection pool monitoring (owner: @sre-team, due: Jan 20)
- [ ] Review database query guidelines (owner: @tech-lead, due: Jan 25)
```

### 5.2 Update Runbooks

If this incident revealed gaps in procedures:

```bash
# Create PR to update runbook
git checkout -b update/incident-runbook-connection-pool
# Edit runbook
git commit -m "Add connection pool troubleshooting steps"
```

### 5.3 Follow Up on Action Items

```bash
# Track action items
pa:incident action-items list --incident INC-2024-0115

# Update status
pa:incident action-items update <item-id> --status complete
```

---

## Escalation Paths

### When to Escalate

- Cannot identify root cause within 30 minutes
- Mitigation attempts are not working
- Incident is spreading or worsening
- Need access or expertise you don't have
- Customer communication needed

### Escalation Contacts

| Role | Contact | When |
|------|---------|------|
| Engineering Lead | @eng-lead | Technical escalation |
| SRE Team | #sre-oncall | Infrastructure issues |
| Security Team | @security-oncall | Security incidents |
| Customer Success | @cs-lead | Customer communication |
| Executive | @cto | SEV1 incidents |

### Escalation Template

```markdown
**Escalation Request**

**Incident**: INC-2024-0115
**Current Status**: Unable to identify root cause
**Duration**: 45 minutes
**Impact**: 30% of users unable to login

**What's Been Tried**:
- Checked recent deployments (no changes)
- Reviewed logs (no obvious errors)
- Restarted services (no improvement)

**Help Needed**:
- Database expertise to analyze slow queries
- Access to production database metrics

**Contact**: @oncall-engineer in #incidents
```

---

## Commands Reference

```bash
# Start incident
pa:incident start --severity SEV2 --description "Login failures"

# Update status
pa:incident update --status investigating --message "Checking logs"

# Change severity
pa:incident severity set SEV1 --reason "Complete outage"

# Add timeline entry
pa:incident timeline add "Identified root cause: DB connection exhaustion"

# Escalate
pa:incident escalate --to @sre-team --reason "Need database access"

# Resolve
pa:incident resolve --summary "Rolled back to v1.2.3"

# Generate post-mortem
pa:incident postmortem generate
```
