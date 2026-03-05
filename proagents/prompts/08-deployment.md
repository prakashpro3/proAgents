# Deployment Prompts

Universal prompts for deployment preparation and execution.

---

## Quick Start

```
/deploy
```

Related commands:
- `pa:deploy-staging` - Deploy to staging
- `pa:deploy-prod` - Deploy to production
- `pa:deploy-check` - Pre-deployment checks

---

## Pre-Deployment

### Pre-Deployment Checklist

```
Run pre-deployment checklist for: [FEATURE/VERSION]

CODE READINESS:
□ All code reviewed and approved
□ All tests passing
□ No linting errors
□ Build succeeds
□ No console.logs or debug code

TESTING COMPLETE:
□ Unit tests pass
□ Integration tests pass
□ E2E tests pass (if applicable)
□ Manual testing completed
□ Cross-browser testing (frontend)
□ Mobile testing (frontend)

SECURITY:
□ Security scan completed
□ No vulnerabilities in dependencies
□ No hardcoded secrets
□ Authentication working
□ Authorization working

PERFORMANCE:
□ Bundle size acceptable
□ No performance regressions
□ Database queries optimized

DOCUMENTATION:
□ Code documentation complete
□ API documentation updated
□ Changelog updated
□ Release notes prepared

CONFIGURATION:
□ Environment variables documented
□ Secrets stored in vault
□ Config files reviewed
□ Feature flags configured

DATABASE:
□ Migrations tested
□ Rollback scripts ready
□ Backup taken
```

### Environment Verification

```
Verify environment for: [STAGING/PRODUCTION]

CHECK:
□ Environment variables set correctly
□ Database connection working
□ External services accessible
□ SSL certificates valid
□ DNS configured correctly
□ CDN configured (if applicable)
□ Monitoring configured
□ Logging configured
□ Alerts configured

RESOURCES:
□ Sufficient compute capacity
□ Sufficient storage
□ Scaling rules configured
□ Rate limits appropriate
```

---

## Deployment Strategies

### Blue-Green Deployment

```
Plan blue-green deployment for: [FEATURE]

SETUP:
1. Current production (Blue) running
2. Prepare new version (Green)
3. Deploy Green alongside Blue
4. Test Green with internal traffic
5. Switch traffic to Green
6. Monitor for issues
7. Keep Blue ready for rollback

STEPS:
1. Deploy new version to Green environment
2. Run smoke tests on Green
3. Switch load balancer to Green
4. Monitor error rates and latency
5. If issues: switch back to Blue
6. If stable: decommission Blue (or keep as backup)

CHECKLIST:
□ Green environment ready
□ Database compatible with both versions
□ Session handling works during switch
□ Health checks configured
```

### Canary Deployment

```
Plan canary deployment for: [FEATURE]

STRATEGY:
1. Deploy new version to small subset (canary)
2. Route small % of traffic to canary
3. Monitor canary metrics
4. Gradually increase traffic
5. Full rollout if metrics good

PHASES:
- Phase 1: 5% traffic to new version
- Phase 2: 25% traffic (if Phase 1 OK)
- Phase 3: 50% traffic (if Phase 2 OK)
- Phase 4: 100% traffic (full rollout)

METRICS TO MONITOR:
- Error rate
- Response time
- Conversion rate
- User complaints

ROLLBACK TRIGGER:
If any metric degrades > [X]%, rollback immediately
```

### Feature Flag Deployment

```
Plan feature flag deployment for: [FEATURE]

SETUP:
1. Wrap feature in feature flag
2. Deploy code to production (flag OFF)
3. Enable flag for internal users
4. Enable for beta users
5. Enable for all users
6. Remove flag after stable period

FLAG CONFIGURATION:
```json
{
  "feature-name": {
    "enabled": false,
    "allowlist": ["internal-users"],
    "percentage": 0
  }
}
```

ROLLOUT PLAN:
- Day 1: Internal users only
- Day 3: 10% of users
- Day 7: 50% of users
- Day 14: 100% of users
- Day 30: Remove flag
```

---

## Database Deployment

### Migration Deployment

```
Plan database migration for: [MIGRATION]

PRE-MIGRATION:
□ Backup database
□ Test migration on staging
□ Test with production data copy
□ Prepare rollback script
□ Schedule maintenance window

MIGRATION STEPS:
1. Announce maintenance (if downtime)
2. Stop writes (if needed)
3. Take backup
4. Run migration
5. Verify data integrity
6. Resume writes
7. Monitor for issues

MIGRATION SCRIPT:
[Include migration script]

ROLLBACK SCRIPT:
[Include rollback script]

VERIFICATION:
□ All data migrated correctly
□ No data loss
□ Indexes working
□ Foreign keys valid
□ Application works with new schema
```

### Zero-Downtime Migration

```
Plan zero-downtime migration for: [SCHEMA CHANGE]

STRATEGY: Expand-Contract Pattern

PHASE 1 - EXPAND:
1. Add new column/table (nullable)
2. Deploy code that writes to both old and new
3. Backfill existing data

PHASE 2 - MIGRATE:
1. Deploy code that reads from new
2. Verify all reads work
3. Continue writing to both

PHASE 3 - CONTRACT:
1. Deploy code that only writes to new
2. Remove old column/table
3. Remove compatibility code

TIMELINE:
- Phase 1: Deploy 1
- Wait: Monitor for issues
- Phase 2: Deploy 2
- Wait: Monitor for issues
- Phase 3: Deploy 3 (cleanup)
```

---

## Deployment Execution

### Staging Deployment

```
Deploy to staging: [VERSION/FEATURE]

STEPS:
1. Pull latest code
2. Run build
3. Run tests
4. Deploy to staging
5. Run smoke tests
6. Verify functionality
7. Get stakeholder approval

COMMANDS:
```bash
# Build
npm run build

# Deploy to staging
[deployment command]

# Run smoke tests
npm run test:smoke:staging

# Verify
curl https://staging.example.com/health
```
```

### Production Deployment

```
Deploy to production: [VERSION/FEATURE]

PRE-DEPLOY:
□ Staging verified and approved
□ All checklist items complete
□ Deployment window confirmed
□ On-call team notified
□ Rollback plan ready

DEPLOY STEPS:
1. Tag release in git
2. Trigger deployment pipeline
3. Monitor deployment progress
4. Run smoke tests
5. Verify health checks
6. Monitor metrics for 30 min
7. Announce deployment complete

COMMANDS:
```bash
# Tag release
git tag -a v[VERSION] -m "Release [VERSION]"
git push origin v[VERSION]

# Trigger deploy (example)
[deployment command]

# Verify
curl https://api.example.com/health

# Monitor
[monitoring command/URL]
```

POST-DEPLOY:
□ Verify health checks pass
□ Check error rates
□ Check response times
□ Verify key functionality
□ Update status page
□ Notify stakeholders
```

---

## Monitoring

### Post-Deployment Monitoring

```
Monitor deployment of: [VERSION]

IMMEDIATE (0-30 min):
□ Error rate < baseline
□ Response time < baseline
□ No critical alerts
□ Health checks pass
□ Key flows working

SHORT-TERM (30 min - 4 hours):
□ Error rate stable
□ No degradation trend
□ User complaints checked
□ Support tickets reviewed

METRICS TO WATCH:
| Metric | Baseline | Threshold | Current |
|--------|----------|-----------|---------|
| Error rate | [X]% | [Y]% | [?]% |
| P50 latency | [X]ms | [Y]ms | [?]ms |
| P99 latency | [X]ms | [Y]ms | [?]ms |
| Requests/sec | [X] | [Y] | [?] |

ALERT RULES:
- Error rate > [X]% → Alert
- Latency > [X]ms → Alert
- 5xx errors > [X]/min → Alert
```

### Health Check Setup

```
Configure health checks for: [SERVICE]

ENDPOINTS:
- `/health` - Basic liveness check
- `/health/ready` - Readiness check
- `/health/live` - Liveness check

HEALTH CHECK IMPLEMENTATION:
```javascript
// Basic health check
GET /health
Response: { "status": "ok", "timestamp": "..." }

// Readiness check (checks dependencies)
GET /health/ready
Response: {
  "status": "ok",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "external_api": "ok"
  }
}

// Liveness check (is process alive)
GET /health/live
Response: { "status": "ok" }
```

LOAD BALANCER CONFIG:
- Health check path: /health
- Interval: 30 seconds
- Timeout: 10 seconds
- Unhealthy threshold: 3
- Healthy threshold: 2
```

---

## Deployment Documentation

### Deployment Runbook

```
Create deployment runbook for: [SERVICE]

# Deployment Runbook: [Service Name]

## Prerequisites
- [ ] Access to deployment system
- [ ] Access to monitoring
- [ ] On-call contact info

## Pre-Deployment
1. Check for ongoing incidents
2. Verify staging is green
3. Notify team in #deployments

## Deployment Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Verification
1. Check [monitoring dashboard URL]
2. Verify [specific functionality]
3. Check [specific metric]

## Rollback Steps
1. [Rollback step 1]
2. [Rollback step 2]
3. [Rollback step 3]

## Contacts
- On-call: [contact]
- Escalation: [contact]
- Service owner: [contact]
```

### Release Notes

```
Generate release notes for: [VERSION]

# Release Notes: v[VERSION]

**Release Date:** [DATE]

## Highlights
- [Key feature 1]
- [Key feature 2]

## New Features
- **[Feature Name]**: [Description]
- **[Feature Name]**: [Description]

## Improvements
- [Improvement 1]
- [Improvement 2]

## Bug Fixes
- Fixed [issue description]
- Fixed [issue description]

## Breaking Changes
- [Breaking change description]
- Migration steps: [link]

## Known Issues
- [Known issue 1]

## Upgrade Instructions
1. [Step 1]
2. [Step 2]

## Contributors
- [@contributor1]
- [@contributor2]
```

---

## Deployment Checklist

```
Final deployment checklist:

BEFORE:
□ Code reviewed and merged
□ All tests passing
□ Staging verified
□ Stakeholder approval
□ Documentation updated
□ Rollback plan ready
□ Team notified

DURING:
□ Deployment initiated
□ Watching for errors
□ Health checks monitored
□ Key metrics watched

AFTER:
□ Smoke tests passed
□ Metrics stable
□ No new errors
□ Stakeholders notified
□ Documentation updated
□ Release tagged
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `pa:deploy` | Show deployment options |
| `pa:deploy-staging` | Deploy to staging |
| `pa:deploy-prod` | Deploy to production |
| `pa:deploy-check` | Pre-deployment checklist |
| `pa:deploy-monitor` | Post-deploy monitoring |
| `pa:deploy-runbook` | Generate deployment runbook |
| `pa:release-notes` | Generate release notes |
