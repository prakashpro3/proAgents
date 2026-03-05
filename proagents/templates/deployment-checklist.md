# Deployment Checklist Template

Pre-deployment and deployment checklist.

---

## Deployment Information

```markdown
# Deployment Checklist

**Environment:** [ ] Staging  [ ] Production
**Version:** [Version number]
**Date:** [YYYY-MM-DD]
**Time:** [HH:MM UTC]
**Deployer:** @person

---
```

## Pre-Deployment Checklist

```markdown
## Pre-Deployment

### Code Quality
- [ ] All code merged to deployment branch
- [ ] All automated tests passing
- [ ] Code review approved
- [ ] No known critical bugs
- [ ] Linting passes
- [ ] Type checking passes

### Testing
- [ ] Unit tests pass (coverage: __%)
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed on staging
- [ ] Cross-browser testing completed (if applicable)
- [ ] Mobile testing completed (if applicable)
- [ ] Performance testing completed

### Security
- [ ] Security scan completed (no critical/high vulnerabilities)
- [ ] Dependencies audited
- [ ] Secrets removed from code
- [ ] Access controls verified
- [ ] API authentication verified

### Documentation
- [ ] Release notes prepared
- [ ] API documentation updated
- [ ] User documentation updated
- [ ] Deployment notes documented
- [ ] Breaking changes documented

### Database
- [ ] Migration scripts tested
- [ ] Migration scripts reviewed
- [ ] Database backup scheduled/completed
- [ ] Rollback scripts prepared
- [ ] Data migration verified (if applicable)

### Configuration
- [ ] Environment variables verified
- [ ] Feature flags configured
- [ ] Third-party service configs updated
- [ ] DNS changes prepared (if applicable)
- [ ] CDN cache strategy planned

### Infrastructure
- [ ] Server capacity verified
- [ ] Load balancer configured
- [ ] Auto-scaling rules set
- [ ] SSL certificates valid
- [ ] Monitoring dashboards ready

### Communication
- [ ] Team notified of deployment window
- [ ] Stakeholders informed
- [ ] Support team briefed
- [ ] Status page prepared (if applicable)

---
```

## Deployment Execution

```markdown
## Deployment Steps

### Step 1: Pre-Deployment Preparation
- [ ] Notify team deployment is starting
- [ ] Put system in maintenance mode (if applicable)
- [ ] Create final database backup
- [ ] Verify backup completed successfully
- [ ] Record pre-deployment metrics

**Start time:** ___________

### Step 2: Database Migrations
- [ ] Run migration dry-run
- [ ] Execute migrations
- [ ] Verify migration success
- [ ] Check data integrity

**Migration time:** ___________

### Step 3: Application Deployment
- [ ] Deploy to first instance/region
- [ ] Health check passes
- [ ] Smoke tests pass
- [ ] Deploy to remaining instances
- [ ] Verify all instances healthy

**Deployment time:** ___________

### Step 4: Cache & CDN
- [ ] Clear application cache
- [ ] Invalidate CDN cache
- [ ] Warm critical caches (if applicable)

### Step 5: Verification
- [ ] Production smoke tests pass
- [ ] Key user flows working
- [ ] Monitoring shows healthy metrics
- [ ] Error rates normal
- [ ] Performance metrics acceptable

**Verification time:** ___________

### Step 6: Post-Deployment
- [ ] Remove maintenance mode
- [ ] Notify team deployment complete
- [ ] Update status page
- [ ] Monitor for 30 minutes

**End time:** ___________
**Total duration:** ___________

---
```

## Rollback Plan

```markdown
## Rollback Plan

### Rollback Triggers
Initiate rollback if any of the following occur:
- [ ] Error rate increases >5% above baseline
- [ ] Response time increases >50% above baseline
- [ ] Critical functionality broken
- [ ] Data corruption detected
- [ ] Security vulnerability discovered

### Rollback Steps

#### Option A: Quick Rollback (Code Only)
1. [ ] Revert to previous container/build
   ```bash
   # Example command
   kubectl rollout undo deployment/app
   ```
2. [ ] Verify health checks pass
3. [ ] Verify key functionality working
4. [ ] Notify team of rollback

**Estimated time:** 5-10 minutes

#### Option B: Full Rollback (Code + Database)
1. [ ] Put system in maintenance mode
2. [ ] Stop application
3. [ ] Restore database from backup
   ```bash
   # Example command
   pg_restore -d database backup_file
   ```
4. [ ] Deploy previous application version
5. [ ] Run verification tests
6. [ ] Remove maintenance mode
7. [ ] Notify team of rollback

**Estimated time:** 30-60 minutes

### Rollback Communication Template
```
Subject: [ROLLBACK] Production Deployment [Version]

A rollback has been initiated for [version] deployment.

Reason: [Brief reason]
Started: [Time]
ETA for completion: [Time]

We will provide updates every [X] minutes.
```

---
```

## Post-Deployment Monitoring

```markdown
## Post-Deployment Monitoring

### Immediate (0-30 minutes)
- [ ] Error rates within normal range
- [ ] Response times within normal range
- [ ] CPU/Memory usage normal
- [ ] Database connections normal
- [ ] No spike in support tickets

### Short-term (30 min - 2 hours)
- [ ] User activity levels normal
- [ ] Business metrics on track
- [ ] No regression in conversion rates
- [ ] External services functioning

### Metrics to Watch
| Metric | Baseline | Threshold | Current |
|--------|----------|-----------|---------|
| Error rate | __% | <__% | |
| P95 latency | __ms | <__ms | |
| Success rate | __% | >__% | |
| CPU usage | __% | <__% | |
| Memory usage | __% | <__% | |
| Active users | __ | >__ | |

### Dashboards to Monitor
- [ ] [Dashboard name]: [URL]
- [ ] [Dashboard name]: [URL]
- [ ] [Dashboard name]: [URL]

### On-Call Contacts
- Primary: @person - [phone]
- Secondary: @person - [phone]
- Escalation: @person - [phone]

---
```

## Sign-off

```markdown
## Deployment Sign-off

### Deployment Summary
- **Started:** [Time]
- **Completed:** [Time]
- **Duration:** [Duration]
- **Status:** [ ] Success  [ ] Partial  [ ] Rollback

### Issues Encountered
| Issue | Resolution | Time to Resolve |
|-------|------------|-----------------|
| [Issue] | [Resolution] | [Time] |

### Metrics Comparison
| Metric | Pre-Deploy | Post-Deploy | Change |
|--------|------------|-------------|--------|
| Response time | __ms | __ms | _% |
| Error rate | __% | __% | _% |
| Throughput | __/s | __/s | _% |

### Sign-offs
- [ ] Deployer: @person
- [ ] On-call: @person
- [ ] Tech Lead: @person (if required)

### Notes
[Any notes about the deployment]

### Follow-up Items
- [ ] [Follow-up task 1]
- [ ] [Follow-up task 2]
```
