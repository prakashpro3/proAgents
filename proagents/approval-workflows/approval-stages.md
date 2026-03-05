# Approval Stages

Define and configure multi-stage approval workflows.

---

## Stage Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Approval Pipeline                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌────────┐  │
│  │  Stage 1 │──▶│  Stage 2 │──▶│  Stage 3 │──▶│ Deploy │  │
│  │  Review  │   │ Security │   │ Manager  │   │        │  │
│  └──────────┘   └──────────┘   └──────────┘   └────────┘  │
│                                                             │
│  Each stage can have:                                       │
│  • Required approvers                                       │
│  • Auto-approval rules                                      │
│  • Timeout settings                                         │
│  • Escalation paths                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Stage Configuration

### Defining Stages

```yaml
approvals:
  stages:
    # Stage 1: Code Review
    - name: "code_review"
      display_name: "Code Review"
      order: 1

      # Who can approve
      approvers:
        roles: ["senior_developer", "tech_lead"]
        teams: ["core-team"]
        minimum_approvals: 1

      # Conditions
      conditions:
        applies_to:
          - "all_features"
          - "all_bug_fixes"

      # Timing
      timeout: "24h"
      reminder_after: "4h"

    # Stage 2: Security Review
    - name: "security_review"
      display_name: "Security Review"
      order: 2

      approvers:
        roles: ["security_engineer"]
        teams: ["security-team"]
        minimum_approvals: 1

      conditions:
        applies_when:
          - "touches_auth_code"
          - "touches_payment_code"
          - "modifies_user_data"
          - "adds_dependencies"

      # Skip if not applicable
      skip_if_not_applicable: true

    # Stage 3: Manager Approval
    - name: "manager_approval"
      display_name: "Manager Approval"
      order: 3

      approvers:
        roles: ["engineering_manager", "director"]
        minimum_approvals: 1

      conditions:
        applies_when:
          - "production_deployment"
          - "breaking_change"
          - "large_feature"
```

---

## Stage Types

### Sequential Stages

```yaml
approvals:
  flow: "sequential"  # Stages must complete in order

  stages:
    - name: "review"
      order: 1
      # Must complete before stage 2

    - name: "security"
      order: 2
      depends_on: ["review"]

    - name: "manager"
      order: 3
      depends_on: ["security"]
```

### Parallel Stages

```yaml
approvals:
  flow: "parallel"  # Some stages can run simultaneously

  stages:
    - name: "code_review"
      order: 1
      parallel_group: "technical"

    - name: "security_review"
      order: 1
      parallel_group: "technical"
      # Runs in parallel with code_review

    - name: "manager_approval"
      order: 2
      depends_on: ["code_review", "security_review"]
      # Runs after both parallel stages complete
```

### Conditional Stages

```yaml
approvals:
  stages:
    - name: "legal_review"
      display_name: "Legal Review"

      # Only applies under certain conditions
      conditional: true

      applies_when:
        any:
          - "changes_terms_of_service"
          - "changes_privacy_policy"
          - "adds_third_party_integration"

        file_patterns:
          - "src/legal/**"
          - "docs/legal/**"
          - "content/policies/**"

      # If conditions not met, skip stage
      skip_if_not_applicable: true
```

---

## Approver Rules

### Role-Based Approvers

```yaml
approvals:
  stages:
    - name: "technical_review"
      approvers:
        # Require specific roles
        roles:
          - "senior_developer"
          - "tech_lead"
          - "architect"

        # Minimum approvals needed
        minimum_approvals: 2

        # All must approve
        require_all: false

        # Cannot approve own changes
        exclude_author: true
```

### Team-Based Approvers

```yaml
approvals:
  stages:
    - name: "team_review"
      approvers:
        teams:
          - name: "frontend-team"
            applies_to: "src/frontend/**"
          - name: "backend-team"
            applies_to: "src/backend/**"
          - name: "devops-team"
            applies_to: "infrastructure/**"

        # At least one from applicable team
        minimum_approvals: 1
```

### Individual Approvers

```yaml
approvals:
  stages:
    - name: "architect_review"
      approvers:
        individuals:
          - "alice@company.com"
          - "bob@company.com"

        # Require specific person
        require_specific:
          - user: "alice@company.com"
            when: "architecture_change"
```

### CODEOWNERS Integration

```yaml
approvals:
  stages:
    - name: "codeowner_review"
      approvers:
        # Use CODEOWNERS file
        from_codeowners: true

        # Require codeowner approval
        codeowner_required: true

        # Additional approvers
        additional_roles:
          - "tech_lead"
```

---

## Auto-Approval Rules

### Automatic Approvals

```yaml
approvals:
  stages:
    - name: "code_review"

      auto_approve:
        enabled: true

        conditions:
          all:
            - "all_tests_pass"
            - "no_security_issues"
            - "no_breaking_changes"
            - "coverage_meets_threshold"

          any:
            - "documentation_only"
            - "config_change_only"
            - "test_files_only"

        # File pattern rules
        file_patterns:
          auto_approve:
            - "*.md"
            - "docs/**"
            - "*.test.ts"

          never_auto_approve:
            - "src/auth/**"
            - "src/payments/**"
            - "*.env*"
```

### Bot Approvals

```yaml
approvals:
  stages:
    - name: "automated_checks"

      bot_approvals:
        enabled: true

        bots:
          - name: "security-scanner"
            approves_when: "no_vulnerabilities"

          - name: "coverage-bot"
            approves_when: "coverage >= 80%"

          - name: "lint-bot"
            approves_when: "no_lint_errors"
```

---

## Timing & Escalation

### Timeout Configuration

```yaml
approvals:
  stages:
    - name: "code_review"

      timing:
        # Maximum time for stage
        timeout: "24h"

        # Reminder before timeout
        reminder_at:
          - "4h"
          - "12h"
          - "20h"

        # Business hours only
        business_hours_only: true
        business_hours:
          start: "09:00"
          end: "18:00"
          timezone: "America/New_York"
          days: ["mon", "tue", "wed", "thu", "fri"]
```

### Escalation Rules

```yaml
approvals:
  stages:
    - name: "manager_approval"

      escalation:
        enabled: true

        levels:
          - after: "24h"
            escalate_to: ["director"]
            action: "notify"

          - after: "48h"
            escalate_to: ["vp_engineering"]
            action: "notify"

          - after: "72h"
            escalate_to: ["cto"]
            action: "auto_approve_with_audit"

        # Escalation message
        message: |
          Approval pending for {{feature.name}}
          Awaiting since: {{pending_since}}
          Original approvers: {{original_approvers}}
```

---

## Stage Actions

### Pre-Stage Actions

```yaml
approvals:
  stages:
    - name: "security_review"

      pre_actions:
        - type: "run_scan"
          command: "security-scan"
          must_pass: true

        - type: "generate_report"
          template: "security-report"

        - type: "notify"
          channel: "security-team"
          message: "Security review required for {{feature.name}}"
```

### Post-Stage Actions

```yaml
approvals:
  stages:
    - name: "code_review"

      post_actions:
        on_approve:
          - type: "update_status"
            status: "review_complete"
          - type: "notify"
            message: "Code review approved"

        on_reject:
          - type: "update_status"
            status: "changes_requested"
          - type: "notify"
            message: "Changes requested in code review"
          - type: "assign_back"
            to: "author"
```

---

## Rejection Handling

### Rejection Flow

```yaml
approvals:
  stages:
    - name: "code_review"

      rejection:
        # Require reason
        require_reason: true

        # Actions on rejection
        actions:
          - notify_author: true
          - reset_stage: true
          - create_task: true

        # Re-review after changes
        re_review:
          required: true
          same_reviewer: "preferred"

        # Maximum rejections
        max_rejections: 3
        on_max_rejections: "escalate_to_manager"
```

### Rejection Reasons

```yaml
approvals:
  rejection_reasons:
    predefined:
      - id: "code_quality"
        label: "Code quality issues"
      - id: "missing_tests"
        label: "Missing or inadequate tests"
      - id: "security_concern"
        label: "Security concerns"
      - id: "architecture"
        label: "Architecture concerns"
      - id: "documentation"
        label: "Missing documentation"
      - id: "other"
        label: "Other (please specify)"

    require_comment: true
```

---

## Stage Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Feature: user-authentication                                │
│ Status: Awaiting Approval                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Stage 1: Code Review                                        │
│ Status: ✅ Approved                                          │
│ Approved by: alice@company.com (2h ago)                     │
│                                                             │
│ Stage 2: Security Review                                    │
│ Status: 🔄 Pending                                          │
│ Awaiting: security-team                                     │
│ Time remaining: 22h                                         │
│                                                             │
│ Stage 3: Manager Approval                                   │
│ Status: ⏳ Waiting for previous stage                        │
│                                                             │
│ [Remind] [Escalate] [Skip (requires justification)]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Minimize Stages**: Only add necessary approval stages
2. **Clear Criteria**: Define when each stage applies
3. **Reasonable Timeouts**: Set realistic time limits
4. **Auto-Approve When Possible**: Reduce manual overhead
5. **Escalation Paths**: Always have escalation defined
6. **Track Metrics**: Monitor approval times and bottlenecks
