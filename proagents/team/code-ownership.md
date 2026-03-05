# Code Ownership Guide

Define and manage code ownership for effective collaboration.

---

## Overview

Code ownership helps:
- Ensure quality through accountability
- Route PRs to right reviewers
- Maintain consistent standards per area
- Enable faster decision making

---

## CODEOWNERS File

### Setup

Create `.github/CODEOWNERS` file:

```
# CODEOWNERS file

# Default owners (required reviewers for all PRs)
*                       @tech-lead

# Frontend
/src/components/        @frontend-team
/src/pages/             @frontend-team
/src/styles/            @frontend-team @design-team

# Backend API
/api/                   @backend-team
/src/services/          @backend-team

# Database
/migrations/            @backend-team @dba-team
/prisma/                @backend-team @dba-team

# Infrastructure
/.github/               @devops-team
/terraform/             @devops-team
/docker/                @devops-team
Dockerfile              @devops-team

# Authentication/Security
/src/auth/              @security-team @backend-team
/src/middleware/auth*   @security-team

# Documentation
*.md                    @docs-team
/docs/                  @docs-team

# Configuration
package.json            @tech-lead
tsconfig.json           @tech-lead
.env.example            @devops-team

# Tests
/tests/                 @qa-team
/__tests__/             @qa-team
*.test.ts               @qa-team
*.spec.ts               @qa-team

# Critical paths (multiple approvers)
/src/payments/          @backend-team @security-team @tech-lead
```

### Rules

- Later rules override earlier ones
- Use `@username` or `@org/team`
- Each owner must approve
- Empty pattern matches all files

---

## Ownership Responsibilities

### Code Owner Duties

| Responsibility | Description |
|---------------|-------------|
| Review PRs | Review all PRs to owned area within SLA |
| Maintain Quality | Ensure code meets standards |
| Documentation | Keep docs for owned area current |
| On-call | Be available for issues in owned area |
| Mentoring | Help others understand the code |

### Review SLAs

| PR Size | Review Time |
|---------|-------------|
| Small (< 100 lines) | 4 hours |
| Medium (100-500 lines) | 1 business day |
| Large (> 500 lines) | 2 business days |
| Critical (security/breaking) | 2 hours |

---

## Ownership Matrix

### By Feature Area

| Area | Primary Owner | Secondary | Escalation |
|------|---------------|-----------|------------|
| Authentication | @auth-lead | @backend-team | @security-team |
| User Management | @user-lead | @backend-team | @tech-lead |
| Payments | @payment-lead | @backend-team | @finance-team |
| Dashboard | @frontend-lead | @frontend-team | @tech-lead |
| API Gateway | @api-lead | @backend-team | @tech-lead |
| Mobile App | @mobile-lead | @mobile-team | @tech-lead |

### By Service

| Service | Team | Owner | Backup |
|---------|------|-------|--------|
| web-frontend | Frontend | @alice | @bob |
| api-gateway | Backend | @carol | @dave |
| user-service | Backend | @eve | @frank |
| payment-service | Backend | @grace | @henry |
| mobile-app | Mobile | @iris | @jack |

---

## Assigning Ownership

### New Code

When creating new modules:

1. Identify appropriate team/owner
2. Add to CODEOWNERS file
3. Document ownership in README
4. Set up monitoring alerts

```markdown
<!-- Module README.md -->
# User Service

## Ownership

| Role | Contact |
|------|---------|
| Owner | @user-team |
| Primary Contact | @alice |
| Escalation | @tech-lead |

## On-call Rotation
- Week 1: @alice
- Week 2: @bob
- Week 3: @carol
```

### Transferring Ownership

```markdown
## Ownership Transfer Checklist

**From:** @current-owner
**To:** @new-owner
**Area:** /src/feature/

- [ ] Knowledge transfer sessions completed
- [ ] Documentation reviewed and updated
- [ ] Access permissions updated
- [ ] CODEOWNERS file updated
- [ ] On-call rotation updated
- [ ] Alerts/monitoring updated
- [ ] Team notified
```

---

## PR Review Process

### Automatic Assignment

GitHub automatically assigns reviewers based on CODEOWNERS:

```yaml
# .github/workflows/assign-reviewers.yml
name: Auto Assign Reviewers

on:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Assign reviewers
        uses: kentaro-m/auto-assign-action@v1.2.4
        with:
          configuration-path: '.github/auto-assign.yml'
```

### Review Requirements

```yaml
# Branch protection rules
main:
  required_reviews: 2
  require_code_owner_reviews: true
  dismiss_stale_reviews: true
  require_review_from_maintainers: true
```

---

## Conflict Resolution

### When Owners Disagree

1. **Discussion** - Owners discuss in PR comments
2. **Sync Meeting** - Schedule quick call if needed
3. **Escalation** - Tech lead makes final decision
4. **Documentation** - Document decision rationale

### Ownership Disputes

| Scenario | Resolution |
|----------|------------|
| Unclear ownership | Tech lead decides |
| Overlapping areas | Define boundaries, update CODEOWNERS |
| Abandoned ownership | Reassign with knowledge transfer |
| New team structure | Update all ownership docs |

---

## Metrics

### Ownership Health

```markdown
## Code Ownership Report

### Coverage
- Total files: 1,234
- Files with owners: 1,200 (97%)
- Orphaned files: 34 (3%)

### Review Performance (Last 30 Days)
| Team | Avg Review Time | Reviews Completed |
|------|-----------------|-------------------|
| Frontend | 6 hours | 45 |
| Backend | 8 hours | 62 |
| Mobile | 12 hours | 23 |

### Areas Needing Attention
- /src/legacy/ - No owner assigned
- /src/utils/ - Owner on leave, need backup
```

---

## Best Practices

1. **Clear Boundaries** - Define ownership precisely
2. **Backup Owners** - Always have secondary owner
3. **Regular Review** - Review ownership quarterly
4. **Documentation** - Keep ownership docs current
5. **Knowledge Sharing** - Avoid single point of failure
6. **Responsive** - Meet review SLAs
7. **Collaborative** - Work with other owners on overlap

---

## Configuration

```yaml
# proagents.config.yaml
ownership:
  enabled: true
  file: ".github/CODEOWNERS"

  review_sla:
    small: "4h"
    medium: "1d"
    large: "2d"
    critical: "2h"

  alerts:
    stale_review: true
    orphaned_code: true
    ownership_gaps: true

  reporting:
    frequency: "weekly"
    notify: ["tech-lead@company.com"]
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/owner [path]` | Show owner for path |
| `/ownership-report` | Generate ownership report |
| `/assign-owner` | Assign ownership |
