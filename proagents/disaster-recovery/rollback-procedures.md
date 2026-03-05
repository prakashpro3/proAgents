# Rollback Procedures

Detailed procedures for rolling back deployments and changes.

---

## Overview

Rollback procedures ensure rapid recovery when deployments cause issues.

```
┌─────────────────────────────────────────────────────────────┐
│                    Rollback Decision Flow                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Issue Detected                                             │
│        │                                                    │
│        ▼                                                    │
│  ┌─────────────┐                                           │
│  │ Assess      │                                           │
│  │ Severity    │                                           │
│  └─────────────┘                                           │
│        │                                                    │
│        ├────────► Critical ────► Immediate Rollback        │
│        │                                                    │
│        ├────────► High ────────► Prepare + Quick Rollback  │
│        │                                                    │
│        └────────► Medium ──────► Assess + Decide           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Rollback Types

### 1. Code Rollback

Revert application code to previous version.

```bash
# Quick rollback to previous version
proagents rollback production

# Rollback to specific version
proagents rollback production --to v2.3.1

# Rollback to specific commit
proagents rollback production --commit abc123
```

**Steps:**
1. Identify target version
2. Verify rollback compatibility
3. Deploy previous version
4. Verify health checks
5. Update monitoring

### 2. Database Rollback

Revert database changes.

```bash
# Rollback last migration
proagents db rollback --steps 1

# Rollback to specific migration
proagents db rollback --to migration_20240115

# Restore from backup
proagents db restore --backup backup_20240115_0900
```

**Steps:**
1. Stop incoming traffic
2. Create current backup
3. Execute rollback migration or restore
4. Verify data integrity
5. Resume traffic

### 3. Configuration Rollback

Revert configuration changes.

```bash
# Rollback config changes
proagents config rollback

# Rollback to specific config version
proagents config rollback --to config_20240115
```

### 4. Infrastructure Rollback

Revert infrastructure changes.

```bash
# Rollback infrastructure
proagents infra rollback

# Using Terraform
terraform apply -target=module.app -var="version=v2.3.1"
```

---

## Automated Rollback

### Trigger Configuration

```yaml
rollback:
  auto:
    enabled: true

    triggers:
      # Error rate trigger
      - type: "error_rate"
        threshold: 5           # % increase
        window: "5m"
        action: "auto_rollback"

      # Response time trigger
      - type: "response_time"
        threshold: 3           # x baseline
        window: "5m"
        action: "auto_rollback"

      # Health check trigger
      - type: "health_check"
        failures: 3
        action: "auto_rollback"

      # Custom metric trigger
      - type: "custom_metric"
        metric: "payment_success_rate"
        threshold: 95          # below this
        action: "alert_and_prepare"
```

### Rollback Actions

```yaml
rollback:
  actions:
    auto_rollback:
      steps:
        - "pause_traffic"
        - "deploy_previous_version"
        - "verify_health"
        - "resume_traffic"
        - "notify_team"

    alert_and_prepare:
      steps:
        - "send_alert"
        - "prepare_rollback"
        - "await_decision"
```

---

## Manual Rollback Procedures

### Code Rollback Runbook

```markdown
## Code Rollback Procedure

**Trigger:** [Description of issue]
**Severity:** [Critical/High/Medium]
**Estimated Time:** 5-10 minutes

### Pre-Rollback Checklist

☐ Issue confirmed and documented
☐ Incident channel created
☐ Stakeholders notified
☐ Previous version identified and verified

### Rollback Steps

1. **Prepare Rollback**
   ```bash
   proagents rollback prepare production
   ```
   - Verifies previous version
   - Checks deployment prerequisites

2. **Execute Rollback**
   ```bash
   proagents rollback production --confirm
   ```
   - Deploys previous version
   - Updates load balancer

3. **Verify Health**
   ```bash
   proagents dr verify
   ```
   - Checks all health endpoints
   - Verifies error rates normalized

4. **Post-Rollback**
   ☐ Update status page
   ☐ Notify stakeholders
   ☐ Document in incident log

### Verification

- [ ] Error rate below threshold
- [ ] Response time normalized
- [ ] All health checks passing
- [ ] No customer complaints

### If Rollback Fails

1. Escalate to on-call lead
2. Consider infrastructure failover
3. Engage vendor support if needed
```

### Database Rollback Runbook

```markdown
## Database Rollback Procedure

**Trigger:** Data corruption or migration failure
**Severity:** Critical
**Estimated Time:** 15-45 minutes

### Pre-Rollback Assessment

☐ Assess data impact scope
☐ Identify last known good state
☐ Calculate potential data loss
☐ Get approval for rollback

### Rollback Steps

1. **Stop Application Traffic**
   ```bash
   proagents traffic pause --all
   ```

2. **Create Safety Backup**
   ```bash
   proagents db backup create --type emergency
   ```

3. **Choose Rollback Method**

   **Option A: Migration Rollback**
   ```bash
   proagents db rollback --steps 1
   ```

   **Option B: Point-in-Time Restore**
   ```bash
   proagents db restore --point-in-time "2024-01-15 09:00:00"
   ```

   **Option C: Full Backup Restore**
   ```bash
   proagents db restore --backup backup_id
   ```

4. **Verify Data Integrity**
   ```bash
   proagents db verify --checksum
   ```

5. **Resume Traffic**
   ```bash
   proagents traffic resume
   ```

### Verification

- [ ] Data integrity verified
- [ ] Application functional
- [ ] No data corruption
- [ ] Audit log updated

### Data Loss Assessment

Document any data loss:
- Time window affected: [Start - End]
- Records potentially lost: [Count]
- Recovery options: [Description]
```

---

## Rollback by Component

### Frontend Rollback

```bash
# Rollback frontend
proagents rollback frontend

# Steps executed:
# 1. Switch CDN to previous build
# 2. Invalidate cache
# 3. Verify static assets
```

**Time Target:** < 5 minutes

### Backend API Rollback

```bash
# Rollback backend
proagents rollback backend

# Steps executed:
# 1. Deploy previous container image
# 2. Wait for health checks
# 3. Drain old instances
```

**Time Target:** < 10 minutes

### Database Rollback

```bash
# Rollback database migration
proagents rollback database

# Steps executed:
# 1. Pause writes
# 2. Run reverse migration
# 3. Verify schema
# 4. Resume writes
```

**Time Target:** < 30 minutes

### Full System Rollback

```bash
# Full system rollback
proagents rollback --all

# Order of operations:
# 1. Pause all traffic
# 2. Rollback database (if needed)
# 3. Rollback backend
# 4. Rollback frontend
# 5. Resume traffic
```

**Time Target:** < 1 hour

---

## Rollback Verification

### Health Checks

```bash
# Run comprehensive health check
proagents dr verify

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Post-Rollback Verification                                  │
├─────────────────────────────────────────────────────────────┤
│ ✅ Frontend: Serving v2.3.0                                │
│ ✅ Backend: Healthy, v3.4.1                                │
│ ✅ Database: Connected, schema verified                    │
│ ✅ Cache: Operational                                      │
│ ✅ Error Rate: 0.1% (normal)                               │
│ ✅ Response Time: 150ms (normal)                           │
└─────────────────────────────────────────────────────────────┘
```

### Smoke Tests

```bash
# Run smoke tests
proagents test smoke

# Critical paths:
# - User login
# - Core functionality
# - Payment flow (if applicable)
```

---

## Rollback Prevention

### Pre-Deployment Checks

```yaml
deployment:
  pre_checks:
    - "database_backup_exists"
    - "previous_version_available"
    - "rollback_script_tested"
    - "monitoring_configured"
```

### Canary Deployments

```yaml
deployment:
  strategy: "canary"
  canary:
    percentage: 5
    duration: "15m"
    auto_rollback:
      error_threshold: 2
```

### Feature Flags

```yaml
features:
  new_checkout:
    enabled: false  # Can disable without deployment
    rollout:
      percentage: 0
```

---

## Post-Rollback Actions

### Immediate (Within 15 minutes)

1. ☐ Verify system stability
2. ☐ Update status page
3. ☐ Notify stakeholders
4. ☐ Document timeline

### Short-term (Within 24 hours)

1. ☐ Root cause analysis
2. ☐ Create fix plan
3. ☐ Update runbooks if needed
4. ☐ Schedule post-mortem

### Long-term (Within 1 week)

1. ☐ Complete post-mortem
2. ☐ Implement preventive measures
3. ☐ Update deployment procedures
4. ☐ Re-deploy fixed version

---

## Configuration

```yaml
# proagents.config.yaml

rollback:
  # Enable automatic rollback
  auto_enabled: true

  # Rollback strategies by environment
  environments:
    production:
      strategy: "blue_green"
      auto_rollback: true
      approval_required: false  # For auto-rollback
      manual_approval: true     # For manual rollback

    staging:
      strategy: "rolling"
      auto_rollback: true
      approval_required: false

  # Rollback triggers
  triggers:
    error_rate:
      threshold: 5
      window: "5m"

    response_time:
      threshold: 3
      window: "5m"

    health_check:
      failures: 3

  # Notifications
  notifications:
    on_auto_rollback:
      - "slack:#incidents"
      - "pagerduty"
    on_manual_rollback:
      - "slack:#deployments"
    on_success:
      - "slack:#deployments"
```
