# Rollback Prompts

Universal prompts for rollback planning and execution.

---

## Quick Start

```
pa:rollback
```

Related commands:
- `pa:rollback-quick` - Quick rollback to previous version
- `pa:rollback-full` - Full rollback with database revert

---

## Rollback Planning

### Create Rollback Plan

```
Create rollback plan for: [DEPLOYMENT/FEATURE]

ROLLBACK TRIGGERS:
Define when to rollback:
□ Error rate exceeds [X]%
□ Response time exceeds [X]ms
□ Critical functionality broken
□ Data corruption detected
□ Security vulnerability discovered

ROLLBACK TYPE:
□ Code only (no DB changes)
□ Code + DB migration revert
□ Full system restore

ROLLBACK STEPS:
1. [Step 1]
2. [Step 2]
3. [Step 3]

VERIFICATION:
- [ ] System health restored
- [ ] Error rate normalized
- [ ] Key features working

COMMUNICATION:
- [ ] Team notified
- [ ] Stakeholders informed
- [ ] Status page updated
```

### Rollback Decision Matrix

```
Determine rollback approach:

SCENARIO: [Describe what's happening]

SEVERITY ASSESSMENT:
| Factor | Level | Notes |
|--------|-------|-------|
| User Impact | [High/Med/Low] | [description] |
| Data Risk | [High/Med/Low] | [description] |
| Business Impact | [High/Med/Low] | [description] |
| Fix Complexity | [High/Med/Low] | [description] |

DECISION MATRIX:
| Severity | Response |
|----------|----------|
| Critical (any High + High) | Immediate rollback |
| Major (any High) | Rollback within 15 min |
| Moderate (multiple Med) | Evaluate fix vs rollback |
| Minor (Low) | Hot fix forward |

RECOMMENDED ACTION: [Rollback / Hot fix / Monitor]
```

---

## Rollback Execution

### Quick Rollback (Code Only)

```
Execute quick rollback for: [SERVICE]

PREREQUISITES:
□ Previous version tagged/available
□ No database schema changes
□ Previous version known to work

STEPS:
1. Notify team: "Initiating rollback of [service]"
2. Stop current deployment (if in progress)
3. Deploy previous version:
   ```bash
   # Example commands
   git checkout [previous-tag]
   [deployment command] --version [previous]
   ```
4. Verify health checks pass
5. Monitor error rates
6. Confirm rollback success

VERIFICATION:
□ Health checks passing
□ Error rate decreasing
□ Key functionality working
□ No new errors in logs

POST-ROLLBACK:
□ Update status page
□ Notify stakeholders
□ Create incident ticket
□ Schedule post-mortem
```

### Full Rollback (With Database)

```
Execute full rollback for: [SERVICE]

⚠️ WARNING: This includes database rollback

PREREQUISITES:
□ Database backup available
□ Rollback migration scripts tested
□ Downtime window approved (if needed)
□ Team on standby

STEPS:

1. PREPARE:
   □ Notify users of maintenance (if downtime)
   □ Stop incoming traffic/writes
   □ Take current database snapshot

2. DATABASE ROLLBACK:
   ```bash
   # Run rollback migration
   [migration rollback command]

   # OR restore from backup
   [backup restore command]
   ```

3. CODE ROLLBACK:
   ```bash
   # Deploy previous version
   [deployment command] --version [previous]
   ```

4. VERIFY:
   □ Database integrity checks pass
   □ Application connects successfully
   □ Test critical database operations
   □ Verify no data loss

5. RESTORE TRAFFIC:
   □ Enable incoming traffic
   □ Monitor closely for 30 min

POST-ROLLBACK:
□ Verify all data accessible
□ Check for data inconsistencies
□ Document any data loss
□ Notify all stakeholders
```

### Emergency Rollback

```
🚨 EMERGENCY ROLLBACK for: [SERVICE]

IMMEDIATE ACTIONS (within 5 minutes):
1. Assess: Is this truly an emergency?
   - Production down
   - Data corruption occurring
   - Security breach active

2. Notify: Alert on-call and leadership
   ```
   @oncall @team-lead EMERGENCY: Rolling back [service]
   Reason: [brief reason]
   ```

3. Execute fastest rollback:
   ```bash
   # Option A: Revert deployment
   [quickest rollback command]

   # Option B: Feature flag off
   [feature flag disable command]

   # Option C: Traffic routing
   [route to previous version command]
   ```

4. Verify production is stable

5. Then investigate root cause

ESCALATION PATH:
- 0-5 min: On-call engineer acts
- 5-15 min: Team lead involved
- 15+ min: Director notified
- 30+ min: Executive briefing
```

---

## Rollback Procedures by Type

### Frontend Rollback

```
Rollback frontend deployment:

STEPS:
1. Deploy previous bundle version:
   ```bash
   # Revert to previous CDN version
   [cdn rollback command]

   # Or deploy previous build
   [deployment command] --version [previous]
   ```

2. Clear CDN cache:
   ```bash
   [cache invalidation command]
   ```

3. Verify:
   □ Pages load correctly
   □ Assets loading from previous version
   □ No console errors
   □ Key user flows work

TIME TO RECOVERY: ~5 minutes
```

### Backend API Rollback

```
Rollback backend API deployment:

STEPS:
1. Deploy previous version:
   ```bash
   # Kubernetes example
   kubectl rollout undo deployment/[service-name]

   # Or specific version
   kubectl set image deployment/[service-name] \
     container=[image]:[previous-version]
   ```

2. Verify:
   □ Health endpoints responding
   □ API endpoints functional
   □ Database connections healthy
   □ External integrations working

3. Monitor:
   - Error rate
   - Response times
   - Request throughput

TIME TO RECOVERY: ~10 minutes
```

### Database Rollback

```
Rollback database migration:

⚠️ HIGH RISK - Proceed carefully

ASSESS:
- Is migration reversible?
- Is data loss acceptable?
- Do we have backup?

OPTION A - Migration Revert (if reversible):
```bash
# Run down migration
[migration down command]

# Verify schema
[schema verification command]
```

OPTION B - Backup Restore (if needed):
```bash
# Stop application writes
[stop writes command]

# Restore from backup
[backup restore command]

# Verify data
[data verification command]

# Resume writes
[resume writes command]
```

VERIFICATION:
□ Schema matches expected state
□ Data integrity verified
□ No orphaned records
□ Application works with schema

TIME TO RECOVERY: 30 min - 2 hours (depending on data size)
```

---

## Rollback Verification

### Verify Rollback Success

```
Verify rollback success for: [SERVICE]

HEALTH CHECKS:
□ /health returns 200
□ /health/ready returns healthy
□ All dependencies connected

FUNCTIONALITY:
□ Login/auth working
□ Core feature 1 working
□ Core feature 2 working
□ Critical API endpoints responding

METRICS (compare to before issue):
| Metric | Before | After Rollback | Status |
|--------|--------|----------------|--------|
| Error rate | [X]% | [Y]% | [✓/✗] |
| Latency P50 | [X]ms | [Y]ms | [✓/✗] |
| Latency P99 | [X]ms | [Y]ms | [✓/✗] |
| Throughput | [X]rps | [Y]rps | [✓/✗] |

LOGS:
□ No new error patterns
□ No stack traces
□ Normal log volume

USER IMPACT:
□ User reports decreasing
□ Support tickets normal
□ Social media quiet
```

---

## Post-Rollback

### Post-Rollback Actions

```
After successful rollback:

IMMEDIATE (within 1 hour):
□ Confirm system stable
□ Update status page: "Resolved"
□ Notify stakeholders of rollback
□ Document timeline of events

SHORT-TERM (within 24 hours):
□ Root cause analysis started
□ Create incident ticket
□ Identify what went wrong
□ Plan corrective actions

FOLLOW-UP (within 1 week):
□ Post-mortem meeting scheduled
□ Post-mortem document created
□ Action items assigned
□ Prevention measures identified
□ Process improvements proposed
```

### Incident Documentation

```
Document rollback incident:

# Incident Report: [Title]

**Date:** [Date]
**Duration:** [Start time] - [End time]
**Severity:** [Critical/Major/Minor]
**Services Affected:** [List]

## Summary
[Brief description of what happened]

## Timeline
- [Time]: [Event]
- [Time]: [Event]
- [Time]: Rollback initiated
- [Time]: Rollback complete
- [Time]: Service restored

## Impact
- Users affected: [number/percentage]
- Revenue impact: [if applicable]
- Data impact: [none/some/significant]

## Root Cause
[What caused the issue]

## Resolution
[How it was resolved]

## Action Items
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

## Lessons Learned
- [Lesson 1]
- [Lesson 2]

## Prevention
[How to prevent this in future]
```

### Post-Mortem Template

```
Schedule post-mortem for: [INCIDENT]

# Post-Mortem: [Incident Title]

## Attendees
- [Names]

## What Happened
[Detailed description]

## Timeline
[Detailed timeline]

## Root Cause Analysis
### What went wrong?
[Analysis]

### Why did it go wrong?
[5 Whys analysis]

### Why wasn't it caught earlier?
[Analysis]

## What Went Well
- [Positive 1]
- [Positive 2]

## What Went Poorly
- [Issue 1]
- [Issue 2]

## Action Items
| Action | Owner | Priority | Due Date |
|--------|-------|----------|----------|
| [Action] | [Name] | [P1/P2/P3] | [Date] |

## Process Improvements
- [Improvement 1]
- [Improvement 2]
```

---

## Rollback Testing

### Test Rollback Procedure

```
Test rollback procedure for: [SERVICE]

PURPOSE:
Verify rollback works before you need it

TEST STEPS:
1. Deploy current version to test environment
2. Deploy new version (simulating release)
3. Simulate failure (or just test rollback)
4. Execute rollback procedure
5. Verify system returns to previous state
6. Document any issues

TEST CHECKLIST:
□ Rollback command works
□ Previous version accessible
□ Health checks pass after rollback
□ Data integrity maintained
□ Procedure documented
□ Time to recovery measured

FREQUENCY:
- Test rollback monthly
- Test after any deployment process changes
- Test after infrastructure changes
```

---

## Rollback Checklist

```
Rollback checklist:

BEFORE ROLLBACK:
□ Confirmed issue warrants rollback
□ Team notified
□ Previous version identified
□ Rollback procedure ready

DURING ROLLBACK:
□ Executing documented steps
□ Monitoring progress
□ Watching for new errors
□ Ready to escalate if needed

AFTER ROLLBACK:
□ System stable
□ Health checks pass
□ Metrics normalized
□ Users can use system
□ Stakeholders notified
□ Incident documented
□ Post-mortem scheduled
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `pa:rollback` | Show rollback options |
| `pa:rollback-quick` | Quick code-only rollback |
| `pa:rollback-full` | Full rollback with DB |
| `pa:rollback-plan` | Create rollback plan |
| `pa:rollback-verify` | Verify rollback success |
| `pa:rollback-test` | Test rollback procedure |
| `pa:incident-doc` | Document incident |
| `pa:post-mortem` | Create post-mortem |
