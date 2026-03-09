# Disaster Recovery Scenarios

Detailed walkthrough guides for handling common disaster scenarios.

---

## Overview

This document provides step-by-step procedures for recovering from various disaster scenarios. Each scenario includes detection methods, response procedures, and recovery steps.

---

## Scenario 1: Failed Deployment Rollback

### Situation

A new deployment causes critical errors in production.

### Indicators

- Error rate increases > 5%
- Response time > 3x baseline
- Health checks failing
- User complaints flooding in

### Step-by-Step Recovery

**1. Detection (Automated)**

```
┌─────────────────────────────────────────────────────────────┐
│ ALERT: Production Error Rate Spike                          │
├─────────────────────────────────────────────────────────────┤
│ Time: 2024-01-15 14:23:45 UTC                               │
│ Environment: production                                      │
│ Metric: error_rate                                          │
│ Current: 8.5%                                               │
│ Threshold: 5%                                               │
│ Recent Deploy: v2.3.1 (deployed 3 minutes ago)              │
│                                                             │
│ Auto-rollback: TRIGGERED                                    │
└─────────────────────────────────────────────────────────────┘
```

**2. Automatic Response**

If auto-rollback is enabled:

```bash
# ProAgents automatically executes:
proagents rollback production --to-previous

# Actions taken:
# 1. Current deployment paused
# 2. Previous version (v2.3.0) deployed
# 3. Health checks verified
# 4. Traffic switched
```

**3. Manual Response (if auto-rollback disabled)**

```bash
# Step 1: Assess the situation
proagents status production

# Step 2: Check recent deployments
proagents deploy history --limit 5

# Step 3: Initiate rollback
proagents rollback production --to v2.3.0

# Step 4: Verify recovery
proagents health production
```

**4. Post-Rollback Verification**

```bash
# Check health status
proagents health production --verbose

# Expected output:
# ✅ API responding (latency: 45ms)
# ✅ Database connections healthy
# ✅ Error rate: 0.1% (normal)
# ✅ All health checks passing

# Verify user-facing functionality
proagents test smoke --env production
```

**5. Communication**

```markdown
## Incident Update

**Status:** Resolved
**Time:** 2024-01-15 14:27 UTC
**Duration:** 4 minutes

### What Happened
Deployment v2.3.1 caused elevated error rates.

### Resolution
Automatic rollback to v2.3.0 completed successfully.

### Next Steps
- Root cause analysis in progress
- Fix will be deployed after testing
```

**6. Root Cause Analysis**

```bash
# Download deployment logs
proagents logs production --since "14:20" --until "14:27" > incident-logs.txt

# Check what changed
proagents diff v2.3.0 v2.3.1

# Review error patterns
proagents analyze errors --env production --timeframe "14:20-14:27"
```

### Prevention Checklist

- [ ] Add failing scenario to test suite
- [ ] Improve staging environment parity
- [ ] Review deployment gate criteria
- [ ] Update monitoring thresholds if needed

---

## Scenario 2: Database Corruption Recovery

### Situation

Database data becomes corrupted or inconsistent.

### Indicators

- Data validation errors
- Referential integrity failures
- Unexpected null values
- Application errors due to bad data

### Step-by-Step Recovery

**1. Detection**

```
┌─────────────────────────────────────────────────────────────┐
│ ALERT: Data Integrity Failure                               │
├─────────────────────────────────────────────────────────────┤
│ Time: 2024-01-15 10:45:12 UTC                               │
│ Type: Referential Integrity                                 │
│ Table: orders                                               │
│ Issue: 847 orphaned records (no matching user_id)          │
│ First occurrence: 2024-01-15 08:30:00 UTC                  │
└─────────────────────────────────────────────────────────────┘
```

**2. Immediate Actions**

```bash
# Step 1: Pause writes to affected tables (if critical)
proagents db pause-writes orders

# Step 2: Assess the scope
proagents db integrity-check orders

# Output:
# Checking table: orders
# ├── Row count: 45,832
# ├── Orphaned records: 847
# ├── First bad record: 2024-01-15 08:30:00
# └── Affected time range: 2.25 hours
```

**3. Identify the Cause**

```bash
# Check recent schema changes
proagents db migration-history --limit 10

# Check application deployments during timeframe
proagents deploy history --since "2024-01-15 08:00"

# Review relevant logs
proagents logs production --filter "orders" --since "08:00"
```

**4. Determine Recovery Strategy**

**Option A: Targeted Fix (Minimal Data Loss)**

```bash
# If corruption is limited and fixable
proagents db fix-integrity orders --strategy=soft

# This will:
# - Soft-delete orphaned records
# - Log all changes for audit
# - Keep data for potential recovery
```

**Option B: Point-in-Time Recovery**

```bash
# List available backups
proagents db backups --list

# Output:
# Available backups:
# ├── 2024-01-15 08:00:00 (2.5 hours ago) ← Before corruption
# ├── 2024-01-15 06:00:00 (4.5 hours ago)
# └── 2024-01-15 00:00:00 (10.5 hours ago)

# Restore to point before corruption
proagents db restore --to "2024-01-15 08:00:00" --tables orders

# This will:
# 1. Create staging restore
# 2. Validate data integrity
# 3. Present diff of changes
# 4. Ask for confirmation
# 5. Execute restore
```

**5. Data Reconciliation**

```bash
# Export data created after backup point
proagents db export orders --since "2024-01-15 08:00" > recent-orders.json

# Review and filter valid records
proagents db validate recent-orders.json --rules orders-validation

# Re-import valid records
proagents db import recent-orders-valid.json --table orders
```

**6. Verify Recovery**

```bash
# Run integrity checks
proagents db integrity-check orders --verbose

# Run application tests
proagents test integration --filter "orders"

# Monitor for errors
proagents monitor orders --duration 30m
```

**7. Resume Normal Operations**

```bash
# Resume writes
proagents db resume-writes orders

# Notify team
proagents notify team "Database recovery complete. Orders table restored."
```

### Recovery Checklist

- [ ] Identify root cause
- [ ] Verify backup integrity before restore
- [ ] Test restore in staging first
- [ ] Document data loss (if any)
- [ ] Update backup frequency if needed
- [ ] Add integrity checks to monitoring

---

## Scenario 3: Security Breach Response

### Situation

Suspected or confirmed security breach detected.

### Indicators

- Unusual access patterns
- Failed authentication spikes
- Unauthorized data access
- Suspicious API calls
- External notification of breach

### Step-by-Step Response

**1. Initial Detection**

```
┌─────────────────────────────────────────────────────────────┐
│ SECURITY ALERT: Potential Breach Detected                   │
├─────────────────────────────────────────────────────────────┤
│ Severity: CRITICAL                                          │
│ Time: 2024-01-15 03:15:22 UTC                               │
│                                                             │
│ Indicators:                                                 │
│ ├── 5000+ failed login attempts from single IP             │
│ ├── Successful admin login from unknown location           │
│ ├── Bulk data export triggered                             │
│ └── API rate limits bypassed                               │
│                                                             │
│ Immediate Action Required                                   │
└─────────────────────────────────────────────────────────────┘
```

**2. Immediate Containment**

```bash
# CRITICAL: Execute containment immediately

# Step 1: Rotate all secrets
proagents security rotate-secrets --all --immediate

# Step 2: Invalidate all sessions
proagents security invalidate-sessions --all

# Step 3: Block suspicious IPs
proagents security block-ip 203.0.113.100

# Step 4: Enable maintenance mode (if severe)
proagents maintenance on --message "Security update in progress"

# Step 5: Disable compromised accounts
proagents users disable --user admin@company.com --reason "security-incident"
```

**3. Assessment**

```bash
# Gather evidence (PRESERVE FOR FORENSICS)
proagents security audit-log export --since "2024-01-14" > audit-export.json

# Identify scope of breach
proagents security analyze-breach --start "2024-01-15 03:00"

# Output:
# Breach Analysis Report
# ─────────────────────
# Entry Point: Admin account compromise
# Method: Credential stuffing (password reuse)
# Access Level: Admin
# Data Accessed:
# ├── User table: 12,453 records viewed
# ├── Orders table: 5,232 records exported
# └── API keys: 3 keys accessed
# Duration: 47 minutes
```

**4. Eradication**

```bash
# Patch the vulnerability
proagents security patch --cve CVE-2024-XXXX

# Remove malicious access
proagents security revoke-access --all-suspicious

# Reset affected credentials
proagents security reset-credentials --scope compromised

# Update security controls
proagents security enhance --force-mfa --password-policy strict
```

**5. Recovery**

```bash
# Restore from clean backup (if necessary)
proagents dr restore --from "2024-01-14 00:00" --verify-clean

# Re-enable services gradually
proagents maintenance off --gradual

# Monitor for recurring attacks
proagents security monitor --enhanced --duration 7d
```

**6. Communication**

```markdown
## Security Incident Notification

**Date:** January 15, 2024
**Severity:** High
**Status:** Contained and Remediated

### What Happened
Unauthorized access to admin account detected and contained.

### Data Affected
User profile information (names, emails) may have been accessed.
No payment or password data was compromised.

### Actions Taken
1. All user sessions invalidated
2. Compromised account disabled
3. All secrets rotated
4. Enhanced monitoring enabled

### User Actions Required
- Reset your password
- Review account activity
- Enable two-factor authentication

### Questions
Contact security@company.com
```

**7. Post-Incident**

```bash
# Generate incident report
proagents security incident-report generate

# Schedule post-mortem
proagents calendar create "Security Incident Post-Mortem" --invite security-team

# Update security documentation
proagents docs update security/incident-response.md
```

### Security Checklist

- [ ] Preserve evidence for forensics
- [ ] Contain the breach
- [ ] Identify entry point and method
- [ ] Assess data exposure
- [ ] Notify affected parties (legal requirement)
- [ ] Report to authorities if required
- [ ] Implement additional controls
- [ ] Conduct post-mortem
- [ ] Update incident response procedures

---

## Scenario 4: Infrastructure Failure

### Situation

Cloud provider outage or infrastructure failure.

### Indicators

- Multiple services unreachable
- Cloud provider status page shows issues
- All health checks failing
- Unable to SSH/access infrastructure

### Step-by-Step Recovery

**1. Detection**

```
┌─────────────────────────────────────────────────────────────┐
│ ALERT: Infrastructure Failure                               │
├─────────────────────────────────────────────────────────────┤
│ Time: 2024-01-15 11:30:00 UTC                               │
│ Region: us-east-1                                           │
│ Provider: AWS                                               │
│                                                             │
│ Affected Services:                                          │
│ ├── EC2: Degraded                                          │
│ ├── RDS: Unavailable                                       │
│ ├── ElastiCache: Unavailable                               │
│ └── S3: Operational                                        │
│                                                             │
│ DR Site Status: us-west-2 - HEALTHY                        │
└─────────────────────────────────────────────────────────────┘
```

**2. Immediate Actions**

```bash
# Step 1: Verify the outage
proagents health all --verbose

# Step 2: Check provider status
proagents infra provider-status

# Step 3: Assess DR site readiness
proagents dr status us-west-2
```

**3. Activate Failover**

```bash
# Option A: Automatic failover (if configured)
# System automatically detects and triggers failover

# Option B: Manual failover
proagents dr failover --to us-west-2

# This will:
# 1. Verify DR site health
# 2. Promote read replica to primary
# 3. Update DNS to point to DR site
# 4. Verify all services operational
# 5. Send notification
```

**4. DNS Failover**

```bash
# Update DNS to point to DR region
proagents dns failover --to us-west-2

# Verify DNS propagation
proagents dns check --record api.company.com

# Expected output:
# DNS Status: api.company.com
# ├── Old IP: 54.23.xx.xx (us-east-1)
# ├── New IP: 35.87.xx.xx (us-west-2)
# ├── TTL: 60 seconds
# └── Propagation: 85% complete
```

**5. Verify DR Site Operations**

```bash
# Run health checks on DR site
proagents health all --env us-west-2

# Run smoke tests
proagents test smoke --env us-west-2

# Monitor traffic shift
proagents monitor traffic --compare-regions
```

**6. Communicate to Users**

```markdown
## Service Status Update

**Status:** Partial Outage - Failover in Progress
**Time:** January 15, 2024 11:30 UTC

### What's Happening
Our primary cloud region is experiencing issues. We are failing over to our backup region.

### Current Status
- API: Operational (via backup region)
- Web App: Operational
- Mobile App: May require restart

### Expected Resolution
Full service should be restored within 15 minutes.

### Updates
We will post updates every 15 minutes until resolved.
```

**7. Monitor Primary Region Recovery**

```bash
# Watch for primary region recovery
proagents infra monitor us-east-1 --alert-on-recovery

# When recovered, plan failback
proagents dr plan-failback --from us-west-2 --to us-east-1
```

**8. Failback to Primary**

```bash
# Once primary region is stable
proagents dr failback --to us-east-1 --gradual

# This will:
# 1. Sync any new data from DR site
# 2. Gradually shift traffic back
# 3. Verify primary site health
# 4. Update DNS
# 5. Demote DR database back to replica
```

### Infrastructure Checklist

- [ ] Verify backup region health
- [ ] Execute failover procedure
- [ ] Update DNS
- [ ] Verify all services operational
- [ ] Communicate to users
- [ ] Monitor primary region recovery
- [ ] Plan and execute failback
- [ ] Document lessons learned

---

## Scenario 5: Accidental Data Deletion

### Situation

Critical data accidentally deleted from production.

### Indicators

- User reports missing data
- Application errors due to missing records
- Audit log shows delete operations
- Database record counts unexpectedly low

### Step-by-Step Recovery

**1. Detection**

```
User Report: "All my orders from last month are gone!"

# Verify the issue
proagents db query "SELECT COUNT(*) FROM orders WHERE created_at > '2024-01-01'"

# Result: 0 (should be ~50,000)
```

**2. Stop the Bleeding**

```bash
# Immediately prevent further deletes
proagents db pause-writes orders

# Or restrict to read-only
proagents db read-only orders
```

**3. Identify What Was Deleted**

```bash
# Check audit logs
proagents audit query --table orders --operation DELETE --since "24h"

# Output:
# Audit Log: orders table
# ─────────────────────────
# Time: 2024-01-15 09:15:23
# User: developer@company.com
# Operation: DELETE
# Query: DELETE FROM orders WHERE status = 'pending'
# Rows affected: 48,234
# Source: Admin panel
```

**4. Identify Available Recovery Points**

```bash
# List available backups
proagents db backups list --table orders

# Check point-in-time recovery window
proagents db pitr-status

# Output:
# Point-in-Time Recovery Status
# ─────────────────────────────
# Earliest recovery point: 2024-01-08 00:00:00
# Latest recovery point: 2024-01-15 09:15:00
# Recommended recovery point: 2024-01-15 09:14:00 (1 min before deletion)
```

**5. Execute Recovery**

**Option A: Point-in-Time Recovery (PITR)**

```bash
# Restore to point before deletion
proagents db restore-pitr --to "2024-01-15 09:14:00" --table orders --preview

# Preview shows:
# Records to restore: 48,234
# Time range: 2024-01-01 to 2024-01-15 09:14
# Conflicts: 0

# Execute the restore
proagents db restore-pitr --to "2024-01-15 09:14:00" --table orders --execute
```

**Option B: Backup Restore**

```bash
# Restore from last backup
proagents db restore --backup "2024-01-15-06-00" --table orders --merge

# Merge will:
# - Restore deleted records
# - Keep records created after backup
# - Handle conflicts (prompt for resolution)
```

**6. Verify Recovery**

```bash
# Check record counts
proagents db query "SELECT COUNT(*) FROM orders WHERE created_at > '2024-01-01'"

# Verify data integrity
proagents db integrity-check orders

# Run application tests
proagents test integration --filter orders
```

**7. Resume Normal Operations**

```bash
# Resume write operations
proagents db resume-writes orders

# Notify affected users
proagents notify users "Your data has been restored."
```

**8. Prevent Recurrence**

```bash
# Add safeguards
proagents db add-safeguard orders --prevent-bulk-delete --threshold 100

# Update permissions
proagents db permissions update --user developer --revoke DELETE

# Add confirmation requirement
proagents config set database.require_confirmation_for_deletes true
```

### Data Deletion Prevention Checklist

- [ ] Implement soft deletes
- [ ] Require confirmation for bulk deletes
- [ ] Limit delete permissions
- [ ] Enable detailed audit logging
- [ ] Test backup restoration regularly
- [ ] Document recovery procedures

---

## Scenario 6: Third-Party Service Outage

### Situation

A critical third-party service (payment provider, auth service, etc.) becomes unavailable.

### Indicators

- API calls to service failing
- Timeouts on external requests
- Provider status page shows issues
- User reports of failed operations

### Step-by-Step Response

**1. Detection**

```
┌─────────────────────────────────────────────────────────────┐
│ ALERT: Third-Party Service Failure                          │
├─────────────────────────────────────────────────────────────┤
│ Service: Stripe Payment Gateway                             │
│ Status: Unavailable                                         │
│ Error: Connection timeout after 30s                         │
│ First failure: 2024-01-15 15:00:00 UTC                     │
│ Failure rate: 100%                                          │
└─────────────────────────────────────────────────────────────┘
```

**2. Verify the Outage**

```bash
# Check service status
proagents integrations status stripe

# Check provider status page
proagents integrations provider-status stripe

# Verify it's not our issue
proagents health check --external-deps
```

**3. Activate Fallback (if available)**

```bash
# Switch to backup provider
proagents integrations failover payments --to braintree

# Or enable degraded mode
proagents mode degraded --feature payments

# Queue operations for later
proagents queue enable payment-operations
```

**4. User Communication**

```bash
# Display maintenance message
proagents ui banner set "Payment processing temporarily unavailable. Orders will be processed shortly."

# Send notification
proagents notify affected-users --template payment-delay
```

**5. Monitor for Recovery**

```bash
# Watch for service recovery
proagents integrations monitor stripe --alert-on-recovery

# Track queued operations
proagents queue status payment-operations
```

**6. Resume Normal Operations**

```bash
# When service recovers
proagents integrations restore payments --from stripe

# Process queued operations
proagents queue process payment-operations

# Remove user notification
proagents ui banner clear
```

### Third-Party Resilience Checklist

- [ ] Implement circuit breakers
- [ ] Have backup providers when possible
- [ ] Queue operations for offline processing
- [ ] Communicate proactively to users
- [ ] Monitor provider status pages
- [ ] Document fallback procedures

---

## Quick Reference: Recovery Decision Tree

```
Issue Detected
     │
     ├─→ Deployment Related?
     │         │
     │         └─→ Rollback to previous version
     │
     ├─→ Data Corruption?
     │         │
     │         ├─→ Limited scope → Targeted fix
     │         └─→ Large scope → Point-in-time restore
     │
     ├─→ Security Incident?
     │         │
     │         └─→ Contain → Assess → Eradicate → Recover
     │
     ├─→ Infrastructure Failure?
     │         │
     │         └─→ Failover to DR site
     │
     ├─→ Data Deletion?
     │         │
     │         └─→ Restore from backup/PITR
     │
     └─→ Third-Party Outage?
               │
               └─→ Enable fallback/degraded mode
```

---

## Recovery Time Summary

| Scenario | Target Time | Automated | Manual |
|----------|-------------|-----------|--------|
| Failed Deployment | < 5 min | Yes | Yes |
| Database Corruption | < 30 min | Partial | Yes |
| Security Breach | < 2 hours | Partial | Yes |
| Infrastructure Failure | < 15 min | Yes | Yes |
| Data Deletion | < 30 min | Partial | Yes |
| Third-Party Outage | < 5 min | Yes | Yes |

---

## Next Steps

- [Automation Configuration](./automation.md)
- [Testing Procedures](./testing.md)
- [Incident Response Runbook](./incident-response.md)
