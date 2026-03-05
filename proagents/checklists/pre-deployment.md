# Pre-Deployment Checklist

Complete this checklist before deploying to any environment.

---

## 1. Code Readiness

- [ ] All code reviewed and approved
- [ ] All tests passing
- [ ] No linting errors
- [ ] Build succeeds

---

## 2. Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Cross-browser testing (frontend)
- [ ] Mobile responsive testing (frontend)

---

## 3. Security

- [ ] Security scan completed
- [ ] No vulnerabilities in dependencies
- [ ] No hardcoded secrets
- [ ] Authentication working
- [ ] Authorization working
- [ ] HTTPS enforced

---

## 4. Performance

- [ ] Bundle size acceptable
- [ ] No performance regressions
- [ ] Database queries optimized
- [ ] Caching implemented (if needed)

---

## 5. Documentation

- [ ] Code documentation complete
- [ ] API documentation updated
- [ ] README updated
- [ ] Changelog updated
- [ ] Migration guide (if breaking changes)

---

## 6. Configuration

- [ ] Environment variables documented
- [ ] Secrets stored in vault
- [ ] Config files reviewed
- [ ] Feature flags configured

---

## 7. Database

- [ ] Migrations tested on copy of production
- [ ] Rollback scripts ready
- [ ] Database backup taken
- [ ] Data integrity verified

---

## 8. Infrastructure

- [ ] Infrastructure changes reviewed
- [ ] Scaling configured
- [ ] Monitoring setup
- [ ] Alerts configured
- [ ] Logging configured

---

## 9. Rollback Plan

- [ ] Rollback procedure documented
- [ ] Rollback tested
- [ ] Previous version tagged
- [ ] Team knows rollback procedure

---

## 10. Communication

- [ ] Stakeholders notified
- [ ] Release notes prepared
- [ ] Support team briefed
- [ ] Downtime communicated (if any)

---

## 11. Final Checks

### Staging Deployment
- [ ] Deployed to staging
- [ ] Smoke tests pass
- [ ] Stakeholder approval

### Production Deployment
- [ ] Staging verified
- [ ] Production approval received
- [ ] Deployment window confirmed
- [ ] On-call team ready

---

## Approval

| Role | Name | Date | Approved |
|------|------|------|----------|
| Developer | | | [ ] |
| Tech Lead | | | [ ] |
| QA | | | [ ] |
| DevOps | | | [ ] |

---

## Deployment Notes

[Add any deployment-specific notes here]
