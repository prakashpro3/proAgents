# Approval Configuration

Configure approval workflows, stages, and requirements.

---

## Basic Configuration

### Enable Approvals

```yaml
approvals:
  enabled: true

  # Global settings
  settings:
    allow_self_approval: false
    require_different_approver: true
    approval_valid_for: "7d"  # Re-approve after 7 days
```

### Approval Levels

```yaml
approvals:
  levels:
    # Level 1: Peer review
    peer:
      approvers: ["@team/developers"]
      min_approvals: 1

    # Level 2: Tech lead
    tech_lead:
      approvers: ["@team/tech-leads"]
      min_approvals: 1

    # Level 3: Manager
    manager:
      approvers: ["@team/managers"]
      min_approvals: 1

    # Level 4: Executive
    executive:
      approvers: ["@team/executives"]
      min_approvals: 1
```

---

## Context-Based Approvals

### By Change Type

```yaml
approvals:
  by_change_type:
    # Feature additions
    feature:
      required: true
      levels: ["peer", "tech_lead"]

    # Bug fixes
    bug_fix:
      required: true
      levels: ["peer"]

    # Hotfixes
    hotfix:
      required: true
      levels: ["tech_lead"]
      expedited: true

    # Refactoring
    refactor:
      required: true
      levels: ["peer", "tech_lead"]

    # Documentation
    documentation:
      required: false
```

### By Risk Level

```yaml
approvals:
  by_risk:
    low:
      levels: ["peer"]
      min_approvals: 1

    medium:
      levels: ["peer", "tech_lead"]
      min_approvals: 2

    high:
      levels: ["peer", "tech_lead", "manager"]
      min_approvals: 3

    critical:
      levels: ["tech_lead", "manager", "executive"]
      min_approvals: 3
      require_all_levels: true
```

### By Affected Area

```yaml
approvals:
  by_area:
    # Security-sensitive code
    "src/auth/**":
      levels: ["security_team", "tech_lead"]
      required: true

    # Payment processing
    "src/payments/**":
      levels: ["tech_lead", "compliance"]
      required: true

    # Database migrations
    "migrations/**":
      levels: ["dba", "tech_lead"]
      required: true

    # Infrastructure
    "infrastructure/**":
      levels: ["devops", "tech_lead"]
      required: true
```

---

## Deployment Approvals

### Environment-Based

```yaml
approvals:
  deployment:
    development:
      required: false

    staging:
      required: true
      levels: ["peer"]
      auto_approve_after: "2h"  # Auto-approve if no response

    production:
      required: true
      levels: ["tech_lead", "devops"]
      min_approvals: 2
      business_hours_only: true
      blackout_windows:
        - "friday 17:00 - monday 09:00"
        - "december 20 - january 3"
```

### Deployment Gates

```yaml
approvals:
  deployment:
    gates:
      # Before staging
      pre_staging:
        checks:
          - "all_tests_pass"
          - "security_scan_clean"
        approvals: []

      # Before production
      pre_production:
        checks:
          - "staging_verified"
          - "performance_ok"
        approvals:
          - level: "tech_lead"
          - level: "devops"
```

---

## Approver Configuration

### Define Approvers

```yaml
approvals:
  approvers:
    # By role
    roles:
      tech_lead:
        users: ["alice", "bob"]
        slack_group: "@tech-leads"

      security_team:
        users: ["charlie", "diana"]
        slack_group: "@security"

      devops:
        users: ["eve", "frank"]
        slack_group: "@devops"

    # By team
    teams:
      frontend:
        leads: ["alice"]
        members: ["george", "helen"]

      backend:
        leads: ["bob"]
        members: ["ivan", "julia"]
```

### Approver Rules

```yaml
approvals:
  approver_rules:
    # Cannot approve own changes
    no_self_approval: true

    # Different approver for each level
    unique_approvers: true

    # Fallback if primary unavailable
    fallback:
      enabled: true
      after: "4h"
      fallback_to: "manager"

    # Delegation
    delegation:
      enabled: true
      max_duration: "14d"
```

---

## Conditional Approvals

### Smart Approval Rules

```yaml
approvals:
  conditions:
    # Skip approval for small changes
    - name: "small_change"
      condition: "files_changed <= 3 AND lines_changed <= 50"
      action: "skip_peer_review"

    # Extra approval for large changes
    - name: "large_change"
      condition: "files_changed > 20 OR lines_changed > 500"
      action: "require_manager_approval"

    # Security review for auth changes
    - name: "security_sensitive"
      condition: "path_matches('**/auth/**') OR path_matches('**/security/**')"
      action: "require_security_review"

    # DBA review for schema changes
    - name: "database_change"
      condition: "path_matches('**/migrations/**')"
      action: "require_dba_approval"
```

---

## Approval Expiration

```yaml
approvals:
  expiration:
    # Approval valid duration
    valid_for: "7d"

    # Re-approval triggers
    require_reapproval_on:
      - "new_commits"
      - "base_branch_update"
      - "scope_change"

    # Grace period
    grace_period: "1h"  # Don't invalidate for commits within 1h
```

---

## Notifications

```yaml
approvals:
  notifications:
    # Request submitted
    on_request:
      channels: ["slack:#approvals"]
      mention_approvers: true
      template: |
        *Approval Requested*
        Feature: {{feature_name}}
        Requested by: {{requester}}
        Approvers needed: {{approvers}}

    # Reminder
    reminder:
      after: ["4h", "24h"]
      channels: ["slack:#approvals", "email"]

    # Approved
    on_approval:
      channels: ["slack:#approvals"]
      notify_requester: true

    # Rejected
    on_rejection:
      channels: ["slack:#approvals"]
      notify_requester: true
      require_reason: true
```

---

## Best Practices

1. **Keep Levels Minimal**: Don't over-complicate approval chains
2. **Set Timeouts**: Avoid blocking on unresponsive approvers
3. **Enable Fallbacks**: Always have backup approvers
4. **Document Requirements**: Make approval criteria clear
5. **Automate Where Possible**: Use conditions to skip unnecessary approvals
6. **Audit Regularly**: Review approval history for process improvement
