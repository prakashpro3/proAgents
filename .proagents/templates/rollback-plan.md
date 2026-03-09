# Rollback Plan Template

Detailed rollback procedures for deployments.

---

## Rollback Plan Header

```markdown
# Rollback Plan

**Feature/Release:** [Name]
**Version:** [Version being deployed]
**Previous Version:** [Version to rollback to]
**Date:** [YYYY-MM-DD]
**Prepared by:** @person

---
```

## Risk Assessment

```markdown
## Risk Assessment

### Rollback Complexity
- [ ] 🟢 Low - Simple code rollback
- [ ] 🟡 Medium - Code + config changes
- [ ] 🟠 High - Code + database changes
- [ ] 🔴 Critical - Data migrations involved

### Impact Analysis
| Component | Rollback Impact | Recovery Time |
|-----------|-----------------|---------------|
| Application | [impact] | [time] |
| Database | [impact] | [time] |
| Cache | [impact] | [time] |
| CDN | [impact] | [time] |
| External Services | [impact] | [time] |

### Data Considerations
- [ ] New data created after deployment
- [ ] Data format changes
- [ ] Data migrations performed
- [ ] External system dependencies

---
```

## Rollback Triggers

```markdown
## Rollback Triggers

### Automatic Triggers
Configure automatic rollback when:
```yaml
triggers:
  error_rate:
    threshold: 5%
    duration: 5m
    action: alert_and_prepare

  response_time:
    threshold: 200%_of_baseline
    duration: 5m
    action: alert_and_prepare

  health_check:
    failures: 3
    action: auto_rollback
```

### Manual Triggers
Initiate manual rollback when:
- [ ] Critical functionality broken
- [ ] Data corruption detected
- [ ] Security vulnerability discovered
- [ ] Severe performance degradation
- [ ] High volume of user complaints
- [ ] Business-critical process impacted

### Decision Matrix
| Issue Severity | User Impact | Action |
|---------------|-------------|--------|
| Critical | High | Immediate rollback |
| Critical | Low | Rollback within 15m |
| High | High | Rollback within 30m |
| High | Low | Fix forward or rollback |
| Medium | Any | Fix forward preferred |

---
```

## Rollback Procedures

```markdown
## Rollback Procedures

### Scenario 1: Application-Only Rollback
**When:** No database changes, just code

**Time estimate:** 5-10 minutes

**Steps:**
```bash
# 1. Identify previous stable version
git log --oneline -10

# 2. Kubernetes rollback
kubectl rollout undo deployment/app-name

# OR Docker rollback
docker-compose down
docker-compose up -d --no-build previous_tag

# OR Vercel rollback
vercel rollback [deployment-url]

# 3. Verify rollback
kubectl rollout status deployment/app-name
```

**Verification:**
- [ ] Health checks passing
- [ ] Smoke tests passing
- [ ] Error rate normalized

---

### Scenario 2: Application + Configuration Rollback
**When:** Environment variables or config changed

**Time estimate:** 10-15 minutes

**Steps:**
```bash
# 1. Rollback application
kubectl rollout undo deployment/app-name

# 2. Rollback config
kubectl apply -f config/previous-configmap.yaml

# 3. Restart pods to pick up config
kubectl rollout restart deployment/app-name

# 4. Verify
kubectl get pods -w
```

**Verification:**
- [ ] Config values correct
- [ ] Application functioning
- [ ] No config-related errors

---

### Scenario 3: Application + Database Rollback
**When:** Database migrations were applied

**Time estimate:** 30-60 minutes

**Steps:**
```bash
# 1. Enable maintenance mode
kubectl scale deployment/app-name --replicas=0

# 2. Restore database from pre-deployment backup
pg_restore -d database_name \
  -h hostname \
  -U username \
  backup_pre_deployment.dump

# 3. Run reverse migrations (if available)
npm run migrate:down -- --to=previous_version

# 4. Deploy previous application version
kubectl set image deployment/app-name \
  app=image:previous_tag

# 5. Scale back up
kubectl scale deployment/app-name --replicas=3

# 6. Disable maintenance mode
```

**Verification:**
- [ ] Database schema correct
- [ ] Data integrity verified
- [ ] Application working with database

---

### Scenario 4: Full System Rollback
**When:** Multiple services affected

**Time estimate:** 1-2 hours

**Steps:**
1. Activate incident response
2. Enable maintenance mode on all services
3. Stop all affected services
4. Restore each database from backup
5. Deploy previous versions of all services
6. Verify inter-service communication
7. Run full system tests
8. Disable maintenance mode

**Coordination:**
- Incident commander: @person
- Database team: @person
- Platform team: @person
- QA team: @person

---
```

## Post-Rollback Actions

```markdown
## Post-Rollback Actions

### Immediate (0-30 minutes)
- [ ] Verify system stability
- [ ] Monitor error rates
- [ ] Check critical user flows
- [ ] Update status page
- [ ] Notify stakeholders

### Short-term (30 min - 2 hours)
- [ ] Root cause analysis
- [ ] Document what went wrong
- [ ] Identify fix requirements
- [ ] Plan re-deployment strategy

### Follow-up
- [ ] Post-mortem meeting scheduled
- [ ] Fix developed and tested
- [ ] Additional tests added
- [ ] Deployment process improved
- [ ] Documentation updated

---
```

## Communication Templates

```markdown
## Communication Templates

### Rollback Initiated
```
Subject: [INCIDENT] Rollback Initiated - [Feature/Version]

Status: Rollback in progress

Issue: [Brief description of the issue]
Started: [Time]
ETA: [Estimated completion time]

Affected:
- [List affected services/features]

We are rolling back to version [X]. Updates will follow.

Incident Commander: @person
```

### Rollback Complete
```
Subject: [RESOLVED] Rollback Complete - [Feature/Version]

Status: Rollback successful

Summary:
- Issue detected: [Time]
- Rollback initiated: [Time]
- Rollback completed: [Time]
- Total downtime: [Duration]

Root cause: [Brief explanation]

Next steps:
- Post-mortem scheduled for [Date/Time]
- Fix ETA: [Estimate]

Apologies for any inconvenience caused.
```

### Post-Mortem Announcement
```
Subject: Post-Mortem - [Incident Date] [Brief Title]

Post-mortem document: [Link]
Meeting: [Date/Time]

Summary:
- What happened
- Impact
- Root cause
- Action items

All team members are encouraged to attend.
```

---
```

## Rollback Checklist

```markdown
## Quick Rollback Checklist

### Before Rollback
- [ ] Confirm rollback is necessary
- [ ] Identify version to rollback to
- [ ] Notify team of rollback
- [ ] Have backup plan ready

### During Rollback
- [ ] Execute rollback steps
- [ ] Monitor progress
- [ ] Communicate status updates

### After Rollback
- [ ] Verify system health
- [ ] Confirm fix in place
- [ ] Update status page
- [ ] Document incident
- [ ] Schedule post-mortem
```
