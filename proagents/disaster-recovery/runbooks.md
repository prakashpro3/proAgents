# Disaster Recovery Runbooks

Step-by-step procedures for handling incidents and recovering from failures.

---

## Runbook Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Runbook Library                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CRITICAL                                                   │
│  ├── Production Down                                        │
│  ├── Data Breach Response                                   │
│  └── Complete System Failure                                │
│                                                             │
│  HIGH                                                       │
│  ├── Service Degradation                                    │
│  ├── Database Corruption                                    │
│  └── Deployment Rollback                                    │
│                                                             │
│  MEDIUM                                                     │
│  ├── Feature Rollback                                       │
│  ├── Configuration Recovery                                 │
│  └── Cache Invalidation                                     │
│                                                             │
│  LOW                                                        │
│  ├── Log Cleanup                                            │
│  └── Routine Maintenance                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Runbook Structure

### Standard Format

```yaml
runbooks:
  template:
    metadata:
      - name
      - severity
      - category
      - last_updated
      - owner

    sections:
      - title: "Overview"
        content: "Brief description of the incident type"

      - title: "Detection"
        content: "How to identify this incident"

      - title: "Impact Assessment"
        content: "Evaluate scope and severity"

      - title: "Response Steps"
        content: "Numbered action items"

      - title: "Verification"
        content: "Confirm resolution"

      - title: "Post-Incident"
        content: "Cleanup and documentation"
```

---

## Critical Runbooks

### Production Down

```markdown
# Runbook: Production Down

**Severity:** CRITICAL
**Category:** Availability
**Owner:** DevOps Team
**Last Updated:** 2024-01-15

## Overview
Complete production outage affecting all users.

## Detection
- Monitoring alerts triggered
- User reports of unavailability
- Health checks failing
- Error rate at 100%

## Impact Assessment
☐ Determine affected services
☐ Estimate user impact
☐ Check if data loss occurred
☐ Identify blast radius

## Response Steps

### 1. Acknowledge & Communicate (0-5 min)
☐ Acknowledge alert in monitoring system
☐ Update status page: "Investigating"
☐ Notify incident channel (#incident-response)
☐ Page on-call engineers if not already done

### 2. Initial Diagnosis (5-15 min)
☐ Check monitoring dashboards
☐ Review recent deployments
☐ Check infrastructure status (AWS/GCP console)
☐ Verify database connectivity
☐ Check external dependencies

### 3. Quick Recovery Attempt (15-30 min)
☐ If recent deployment: Initiate rollback
   ```bash
   proagents deploy rollback --env production
   ```
☐ If infrastructure: Scale up / restart services
☐ If database: Failover to replica
☐ If external: Enable fallback mode

### 4. Extended Recovery (30+ min)
☐ If rollback fails, deploy last known good
☐ If data issue, restore from backup
☐ If hardware, migrate to new infrastructure

### 5. Communication Updates
☐ Update status page every 15 minutes
☐ Notify stakeholders of progress
☐ Prepare customer communication if >30 min

## Verification
☐ Health checks passing
☐ Error rate normalized
☐ User traffic restored
☐ Monitoring green
☐ Test critical user flows

## Post-Incident
☐ Update status page: "Resolved"
☐ Notify stakeholders
☐ Create incident ticket
☐ Schedule post-mortem within 48 hours
☐ Document timeline and actions

## Escalation
- 15 min no progress → Escalate to Tech Lead
- 30 min no progress → Escalate to Director
- 60 min no progress → Escalate to CTO

## Contacts
- On-call DevOps: [pagerduty link]
- Infrastructure Team: #infrastructure
- Database Team: #database
```

### Data Breach Response

```markdown
# Runbook: Data Breach Response

**Severity:** CRITICAL
**Category:** Security
**Owner:** Security Team
**Last Updated:** 2024-01-15

## Overview
Suspected or confirmed unauthorized access to user data.

## Detection
- Security alerts from monitoring
- Unusual access patterns detected
- External breach report
- Internal discovery

## Impact Assessment
☐ Identify compromised systems
☐ Determine data types affected
☐ Estimate number of users impacted
☐ Check for ongoing access

## Response Steps

### 1. Contain (IMMEDIATE)
☐ DO NOT shut down systems (preserve evidence)
☐ Revoke compromised credentials
☐ Block suspicious IP addresses
☐ Isolate affected systems if needed
☐ Enable enhanced logging

### 2. Notify
☐ Alert Security Team Lead
☐ Notify Legal department
☐ Inform executive leadership
☐ DO NOT communicate externally yet

### 3. Investigate
☐ Capture system state and logs
☐ Identify attack vector
☐ Determine extent of access
☐ Document timeline

### 4. Eradicate
☐ Remove attacker access
☐ Patch vulnerability
☐ Reset affected credentials
☐ Update security controls

### 5. Recover
☐ Restore from clean backups if needed
☐ Re-enable services with monitoring
☐ Verify no backdoors remain

### 6. Legal & Communication
☐ Work with Legal on disclosure requirements
☐ Prepare user notification (if required)
☐ Prepare PR statement
☐ File regulatory reports (GDPR, etc.)

## Evidence Preservation
☐ DO NOT modify logs
☐ Create forensic copies
☐ Document chain of custody
☐ Preserve all relevant artifacts

## Post-Incident
☐ Complete incident report
☐ Conduct thorough post-mortem
☐ Implement additional security measures
☐ Update security policies

## Regulatory Requirements
- GDPR: 72-hour notification
- CCPA: "Expedient" notification
- HIPAA: 60-day notification
```

---

## High Severity Runbooks

### Deployment Rollback

```markdown
# Runbook: Deployment Rollback

**Severity:** HIGH
**Category:** Deployment
**Owner:** DevOps Team
**Last Updated:** 2024-01-15

## Overview
Reverting a problematic deployment to previous stable version.

## Detection
- Elevated error rates post-deployment
- Performance degradation
- Critical bug reports
- Failed health checks

## Impact Assessment
☐ Identify affected features
☐ Measure error rate increase
☐ Check if data was corrupted
☐ Estimate user impact

## Response Steps

### 1. Decision to Rollback (0-5 min)
☐ Confirm rollback is appropriate
☐ Notify team in #deployments
☐ Verify rollback target version

### 2. Execute Rollback (5-15 min)

**Automatic Rollback:**
```bash
proagents deploy rollback --env production
```

**Manual Rollback:**
```bash
# Get previous version
git log --oneline -5

# Deploy specific version
proagents deploy --version <commit-hash> --env production
```

### 3. Database Rollback (if needed)
☐ Check if migrations ran
☐ Run reverse migrations
```bash
proagents db migrate:rollback --steps 1
```

### 4. Cache Invalidation
```bash
proagents cache clear --env production
```

### 5. Verification
☐ Health checks passing
☐ Error rates normalized
☐ Test affected features
☐ Verify data integrity

## Post-Rollback
☐ Update deployment status
☐ Notify team of rollback
☐ Create ticket for failed deployment
☐ Identify root cause
☐ Fix and re-test before next deploy

## Prevention
- Canary deployments
- Feature flags
- Comprehensive testing
- Staged rollouts
```

### Database Corruption

```markdown
# Runbook: Database Corruption

**Severity:** HIGH
**Category:** Data
**Owner:** Database Team
**Last Updated:** 2024-01-15

## Overview
Data integrity issues detected in production database.

## Detection
- Constraint violation errors
- Application errors reading data
- Monitoring alerts for data anomalies
- User reports of missing/incorrect data

## Response Steps

### 1. Assessment
☐ Identify affected tables
☐ Determine corruption scope
☐ Check backup availability
☐ Estimate data loss window

### 2. Isolate
☐ Enable read-only mode if safe
☐ Stop writes to affected tables
☐ Redirect traffic to read replica

### 3. Preserve Evidence
☐ Export affected data
☐ Capture table state
☐ Document timestamps

### 4. Recovery Options

**Option A: Point-in-Time Recovery**
```bash
# Restore to specific time
proagents db restore \
  --env production \
  --point-in-time "2024-01-15T10:30:00Z"
```

**Option B: Partial Recovery**
```bash
# Restore specific tables from backup
proagents db restore \
  --env production \
  --tables users,orders \
  --backup latest
```

**Option C: Manual Repair**
```sql
-- Fix specific records
-- Document all changes
```

### 5. Verification
☐ Run integrity checks
☐ Validate foreign keys
☐ Test application functionality
☐ Verify user data

## Post-Recovery
☐ Full database backup
☐ Document what was recovered/lost
☐ Notify affected users if needed
☐ Root cause analysis
```

---

## Medium Severity Runbooks

### Feature Rollback

```markdown
# Runbook: Feature Rollback

**Severity:** MEDIUM
**Category:** Feature
**Owner:** Development Team
**Last Updated:** 2024-01-15

## Overview
Disable a specific feature without full deployment rollback.

## Response Steps

### 1. Identify Feature Flag
```bash
proagents feature list
```

### 2. Disable Feature
```bash
proagents feature disable <feature-name> --env production
```

### 3. Verify
☐ Feature is hidden/disabled
☐ No errors from disabled code
☐ Other features unaffected

### 4. Cleanup
☐ Clear related cache
☐ Notify team
☐ Create fix ticket

## Post-Rollback
☐ Identify root cause
☐ Fix and test
☐ Plan re-enable strategy
```

### Configuration Recovery

```markdown
# Runbook: Configuration Recovery

**Severity:** MEDIUM
**Category:** Configuration
**Owner:** DevOps Team
**Last Updated:** 2024-01-15

## Overview
Recover from misconfiguration causing issues.

## Response Steps

### 1. Identify Bad Config
```bash
proagents config diff --env production
```

### 2. Rollback Config
```bash
proagents config rollback --env production
```

### 3. Or Restore Specific Version
```bash
proagents config restore --version v1.2.3 --env production
```

### 4. Verify
☐ Services healthy
☐ Config values correct
☐ No errors in logs

## Post-Recovery
☐ Document what went wrong
☐ Add config validation
☐ Update change process
```

---

## Runbook Commands

### Execute Runbook

```bash
# List available runbooks
proagents runbook list

# View runbook
proagents runbook show production-down

# Execute with logging
proagents runbook execute production-down \
  --incident INC-123 \
  --log

# Interactive mode (prompts for each step)
proagents runbook execute deployment-rollback --interactive
```

### Runbook Status

```
┌─────────────────────────────────────────────────────────────┐
│ Runbook Execution: deployment-rollback                      │
│ Incident: INC-456                                           │
│ Started: 5 minutes ago                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Steps:                                                      │
│ ✅ 1. Decision to Rollback                 (2 min)         │
│ ✅ 2. Execute Rollback                     (3 min)         │
│ 🔄 3. Database Rollback                    (in progress)   │
│ ⏳ 4. Cache Invalidation                   (pending)       │
│ ⏳ 5. Verification                         (pending)       │
│                                                             │
│ Progress: [████████░░░░░░░░░░░░] 40%                       │
│                                                             │
│ [Skip Step] [Add Note] [Escalate]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Custom Runbooks

### Creating Runbooks

```yaml
# .proagents/runbooks/custom-recovery.yaml
name: "custom-service-recovery"
severity: "high"
category: "custom"
owner: "platform-team"

overview: |
  Recovery procedure for custom service outages.

detection:
  - "Service health check failures"
  - "Error rate > 5%"
  - "Response time > 5s"

steps:
  - name: "Acknowledge"
    duration: "2m"
    actions:
      - "Acknowledge alert"
      - "Notify #platform-team"

  - name: "Diagnose"
    duration: "5m"
    actions:
      - "Check service logs"
      - "Verify dependencies"
    commands:
      - "kubectl logs -l app=custom-service"
      - "proagents health check custom-service"

  - name: "Recover"
    duration: "10m"
    options:
      - name: "Restart Service"
        command: "kubectl rollout restart deployment/custom-service"
      - name: "Scale Up"
        command: "kubectl scale deployment/custom-service --replicas=5"
      - name: "Rollback"
        command: "proagents deploy rollback custom-service"

  - name: "Verify"
    duration: "5m"
    checks:
      - "Health check passes"
      - "Error rate normal"
      - "Response time normal"

escalation:
  - after: "15m"
    to: "tech-lead"
  - after: "30m"
    to: "director"
```

---

## Best Practices

1. **Keep Runbooks Updated**: Review and update quarterly
2. **Practice Regularly**: Run drills using runbooks
3. **Document Everything**: Log all actions during incidents
4. **Automate Where Possible**: Script repetitive steps
5. **Version Control**: Track runbook changes
6. **Clear Ownership**: Each runbook should have an owner
7. **Escalation Paths**: Always include escalation procedures
8. **Post-Incident Updates**: Update runbooks after incidents
