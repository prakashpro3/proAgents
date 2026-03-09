# Update Policies

Configure how different types of updates are handled.

---

## Update Types

### Semantic Versioning

```
Major.Minor.Patch
  │     │     │
  │     │     └── Bug fixes (safe, auto-merge)
  │     └──────── New features (review recommended)
  └────────────── Breaking changes (manual review required)
```

### Policy by Update Type

```yaml
dependencies:
  policies:
    # Patch updates (x.x.PATCH)
    patch:
      description: "Bug fixes and security patches"
      auto_merge: true
      require_tests: true
      require_review: false
      max_batch: 10  # Max patches per update

    # Minor updates (x.MINOR.x)
    minor:
      description: "New features, backwards compatible"
      auto_merge: false
      require_tests: true
      require_review: true
      create_pr: true
      reviewers: ["@team/dependencies"]

    # Major updates (MAJOR.x.x)
    major:
      description: "Breaking changes"
      auto_merge: false
      require_tests: true
      require_review: true
      require_manual_testing: true
      create_pr: true
      reviewers: ["@team/tech-leads"]
      changelog_review: true
```

---

## Package-Specific Policies

### Override for Specific Packages

```yaml
dependencies:
  package_policies:
    # TypeScript - allow minor updates
    typescript:
      minor:
        auto_merge: true  # Override default

    # React - group with react-dom
    react:
      group_with: ["react-dom", "@types/react"]
      major:
        require_migration_guide: true

    # Database drivers - extra caution
    pg:
      minor:
        require_review: true
        require_staging_test: true
      major:
        require_dba_review: true

    # Internal packages - always update
    "@company/*":
      patch:
        auto_merge: true
      minor:
        auto_merge: true
```

### Lock Specific Versions

```yaml
dependencies:
  locked:
    # Never update these
    - package: "legacy-api-client"
      version: "2.3.4"
      reason: "Breaking changes in 3.x incompatible with our API"
      until: "2024-06-01"  # Optional expiry

    - package: "node-sass"
      version: "7.0.0"
      reason: "Migrating to dart-sass, no point updating"
```

---

## Update Scheduling

### Schedule Configuration

```yaml
dependencies:
  schedule:
    # When to check for updates
    check: "0 6 * * 1"  # Every Monday at 6am

    # When to apply auto-merged updates
    apply: "0 2 * * 2"  # Every Tuesday at 2am

    # Security updates
    security:
      check: "0 */6 * * *"  # Every 6 hours
      apply: "immediate"    # Apply immediately if auto-merge
```

### Time Windows

```yaml
dependencies:
  schedule:
    # Only update during these windows
    allowed_windows:
      - days: ["monday", "tuesday", "wednesday"]
        hours: "02:00-06:00"

    # Never update during
    blackout_windows:
      - name: "Release freeze"
        start: "2024-03-01"
        end: "2024-03-15"

      - name: "Holiday"
        recurring: "december 20-january 5"
```

---

## Update Grouping

### Group Related Packages

```yaml
dependencies:
  groups:
    # React ecosystem
    - name: "react-ecosystem"
      packages:
        - "react"
        - "react-dom"
        - "@types/react"
        - "@types/react-dom"
      update_together: true
      strategy: "latest_compatible"

    # Testing libraries
    - name: "testing"
      packages:
        - "jest"
        - "@types/jest"
        - "ts-jest"
      update_together: true

    # ESLint plugins
    - name: "eslint"
      pattern: "eslint-*"
      update_together: true
      max_batch: 5

    # All TypeScript types
    - name: "types"
      pattern: "@types/*"
      update_together: false
      auto_merge: true
```

---

## Approval Workflows

### Review Requirements

```yaml
dependencies:
  approvals:
    # Default reviewers
    default_reviewers:
      - "@team/developers"

    # By update type
    by_type:
      major:
        required_approvals: 2
        reviewers:
          - "@team/tech-leads"
          - "@team/security"

      minor:
        required_approvals: 1
        reviewers:
          - "@team/developers"

    # By package category
    by_category:
      security:
        required_approvals: 2
        reviewers:
          - "@team/security"

      database:
        reviewers:
          - "@team/dba"
```

### Approval Escalation

```yaml
dependencies:
  approvals:
    escalation:
      # If not approved within time
      timeout: "48h"
      action: "escalate"
      escalate_to: "@team/tech-leads"

      # Reminder schedule
      reminders:
        - after: "24h"
          message: "Dependency update PR needs review"
        - after: "36h"
          message: "Urgent: Dependency update blocking"
```

---

## Testing Requirements

### Test Configuration

```yaml
dependencies:
  testing:
    # Always run these
    always_run:
      - "npm test"
      - "npm run lint"
      - "npm run type-check"

    # For minor/major updates
    extended:
      - "npm run test:integration"
      - "npm run test:e2e"

    # For specific packages
    package_specific:
      react:
        - "npm run test:components"
      prisma:
        - "npm run test:db"
        - "npm run migrate:check"

    # Require passing
    require_passing:
      patch: ["unit"]
      minor: ["unit", "integration"]
      major: ["unit", "integration", "e2e"]
```

### Staging Deployment

```yaml
dependencies:
  testing:
    staging:
      # Deploy to staging for major updates
      required_for: ["major"]

      # Staging environment
      environment: "staging"

      # Smoke test after deploy
      smoke_test: "npm run test:smoke"

      # Manual approval after staging
      require_approval: true
      approval_timeout: "4h"
```

---

## Notification Configuration

```yaml
dependencies:
  notifications:
    # Update available
    on_update_available:
      channels: ["slack:#dependencies"]
      include:
        - security_advisories
        - changelog_summary

    # Auto-merged
    on_auto_merge:
      channels: ["slack:#dependencies"]
      summary: true

    # PR created
    on_pr_created:
      channels: ["slack:#pr-reviews"]
      mention_reviewers: true

    # Failed update
    on_failure:
      channels: ["slack:#dev-alerts"]
      include:
        - error_details
        - test_output
        - rollback_instructions
```

---

## Update Reports

### Weekly Summary

```
┌─────────────────────────────────────────────────────────────┐
│ Dependency Update Report - Week 3, January 2024            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Updates Processed: 23                                       │
│ ├── Auto-merged: 18 (patches)                              │
│ ├── PRs Created: 4 (minor)                                 │
│ └── Blocked: 1 (breaking change)                           │
│                                                             │
│ Security Updates: 2                                         │
│ ├── lodash: Fixed prototype pollution (auto-merged)        │
│ └── axios: Fixed SSRF vulnerability (auto-merged)          │
│                                                             │
│ Pending Review:                                             │
│ • react 18.2.0 → 18.3.0 (PR #234)                         │
│ • typescript 5.2.0 → 5.3.0 (PR #235)                      │
│                                                             │
│ Failed Updates:                                             │
│ • jest 29.0.0 → 30.0.0 (breaking: test runner API)        │
│   Action needed: Review migration guide                     │
│                                                             │
│ Next Scheduled: Monday, Jan 22 at 6:00 AM                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Start Conservative**: Begin with manual reviews, enable auto-merge gradually
2. **Group Related Packages**: Update ecosystems together
3. **Test Thoroughly**: Higher update type = more tests
4. **Review Changelogs**: Especially for minor/major updates
5. **Schedule Wisely**: Update during low-traffic periods
6. **Monitor After Updates**: Watch for issues post-update
7. **Document Locks**: Explain why packages are locked
