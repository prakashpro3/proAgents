# Workflow Guardrails

Automatic safeguards to ensure quality regardless of workflow mode.

---

## Overview

Guardrails are automatic checks that:
- Prevent risky changes from bypassing review
- Auto-upgrade modes when needed
- Ensure minimum quality standards
- Protect critical code paths

---

## Guardrail Categories

### 1. Scope Guardrails

Prevent scope creep and ensure appropriate mode is used.

```yaml
scope_guardrails:
  # File count limits
  file_limits:
    quick_change:
      max_files: 1
      action: "upgrade_to_bug_fix"

    bug_fix:
      max_files: 5
      action: "suggest_upgrade_to_full"
      blocking: false

  # Line count limits
  line_limits:
    quick_change:
      max_lines_changed: 20
      action: "upgrade_to_bug_fix"

    bug_fix:
      max_lines_changed: 200
      action: "suggest_upgrade_to_full"

  # Time limits
  time_limits:
    quick_change:
      max_duration: "15 minutes"
      action: "prompt_for_upgrade"

    bug_fix:
      max_duration: "3 hours"
      action: "suggest_upgrade_to_full"
```

---

### 2. Critical Path Guardrails

Extra protection for sensitive code areas.

```yaml
critical_path_guardrails:
  # Define critical paths
  critical_paths:
    authentication:
      paths:
        - "src/auth/**"
        - "src/login/**"
        - "**/auth*"
      requirements:
        mode: "full_workflow OR bug_fix with review"
        testing: "required"
        security_scan: "required"
        reviewer: "security_team"

    payment:
      paths:
        - "src/payment/**"
        - "src/billing/**"
        - "**/stripe*"
        - "**/paypal*"
      requirements:
        mode: "full_workflow"
        testing: "comprehensive"
        security_scan: "required"
        reviewer: "payment_team"
        pci_compliance: true

    database:
      paths:
        - "src/db/**"
        - "**/migrations/**"
        - "**/schema*"
      requirements:
        mode: "full_workflow"
        backup_required: true
        rollback_script: "required"
        dba_review: true

    security:
      paths:
        - "src/security/**"
        - "**/crypto*"
        - "**/encryption*"
      requirements:
        mode: "full_workflow"
        security_review: "mandatory"
        penetration_test: "recommended"
```

### Actions for Critical Paths

```yaml
critical_path_actions:
  on_quick_change:
    action: "block"
    message: "Quick changes not allowed in critical paths"
    suggestion: "Use bug fix mode with security review"

  on_bug_fix:
    action: "add_requirements"
    add:
      - "security_scan"
      - "mandatory_review"
      - "comprehensive_testing"

  on_full_workflow:
    action: "add_checkpoints"
    add:
      - "security_checkpoint_after_implementation"
      - "mandatory_review_before_merge"
```

---

### 3. Quality Guardrails

Ensure minimum quality standards are met.

```yaml
quality_guardrails:
  # Testing requirements
  testing:
    quick_change:
      require_existing_tests_pass: true
      new_tests_required: false

    bug_fix:
      require_existing_tests_pass: true
      new_tests_required: true
      minimum_test_for_fix: true

    full_workflow:
      require_existing_tests_pass: true
      new_tests_required: true
      coverage_threshold: 80
      integration_tests: "recommended"

  # Code quality
  code_quality:
    all_modes:
      linting: "required"
      formatting: "required"
      no_new_warnings: true

    bug_fix:
      complexity_check: true
      no_new_tech_debt: true

    full_workflow:
      architecture_review: true
      pattern_compliance: true

  # Security
  security:
    all_modes:
      no_secrets_in_code: "blocking"
      dependency_vulnerabilities: "warning"

    bug_fix:
      security_scan: "if_touching_auth"

    full_workflow:
      security_scan: "required"
      owasp_check: true
```

---

### 4. Auto-Upgrade Triggers

Conditions that automatically trigger mode upgrades.

```yaml
auto_upgrade_triggers:
  # From Quick Change
  quick_to_bug_fix:
    triggers:
      - condition: "files_changed > 1"
        action: "auto_upgrade"
        blocking: true

      - condition: "logic_changed"
        action: "auto_upgrade"
        blocking: true

      - condition: "tests_would_fail"
        action: "auto_upgrade"
        blocking: true

  # From Bug Fix
  bug_fix_to_full:
    triggers:
      - condition: "files_changed > 5"
        action: "suggest_upgrade"
        blocking: false

      - condition: "new_api_endpoints"
        action: "suggest_upgrade"
        blocking: false

      - condition: "database_changes"
        action: "require_upgrade"
        blocking: true

      - condition: "breaking_api_change"
        action: "require_upgrade"
        blocking: true

      - condition: "touches_critical_path"
        action: "add_requirements"
        add: ["security_review", "comprehensive_tests"]

      - condition: "duration > 3_hours"
        action: "prompt_upgrade"
        blocking: false
```

---

### 5. Blocking Guardrails

Hard stops that cannot be bypassed without explicit override.

```yaml
blocking_guardrails:
  # Cannot proceed without
  hard_blocks:
    - condition: "secrets_in_code"
      message: "Secrets detected in code. Remove before proceeding."
      bypass: "not_allowed"

    - condition: "critical_vulnerability"
      message: "Critical security vulnerability detected."
      bypass: "security_lead_only"

    - condition: "failing_tests_in_modified_files"
      message: "Tests failing in modified files."
      bypass: "with_justification"

    - condition: "production_data_access"
      message: "Code accesses production data directly."
      bypass: "not_allowed"

  # Warning but allowed to proceed
  soft_blocks:
    - condition: "deprecated_api_usage"
      message: "Using deprecated API. Consider updating."
      bypass: "acknowledge"

    - condition: "missing_error_handling"
      message: "Missing error handling detected."
      bypass: "acknowledge"
```

---

## Guardrail Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    Guardrail Status                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Mode: Bug Fix                                      │
│  Files Changed: 3 / 5 (limit)                              │
│  Time Elapsed: 45 min / 3 hr (limit)                       │
│                                                             │
│  Guardrails:                                                │
│  ├── Scope: ✅ Within limits                               │
│  ├── Critical Path: ⚠️ Touching auth code                  │
│  ├── Quality: ✅ All checks passing                        │
│  ├── Security: ✅ No issues                                │
│  └── Testing: ✅ Tests required and present                │
│                                                             │
│  Actions Required:                                          │
│  • Security review needed (touching auth)                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Bypass Procedures

For exceptional cases, guardrails can be bypassed:

```yaml
bypass_procedures:
  # Levels of bypass authority
  authority_levels:
    developer:
      can_bypass:
        - "soft_blocks"
        - "time_warnings"
      requires: "justification_comment"

    tech_lead:
      can_bypass:
        - "soft_blocks"
        - "scope_warnings"
        - "upgrade_suggestions"
      requires: "approval_comment"

    security_lead:
      can_bypass:
        - "security_warnings"
        - "critical_path_blocks"
      requires: "security_review_ticket"

    admin:
      can_bypass: "all"
      requires: "audit_log_entry"

  # Cannot be bypassed
  non_bypassable:
    - "secrets_in_code"
    - "production_data_access"
    - "critical_vulnerabilities"
```

### Bypass Command

```bash
# Bypass with justification
pa:guardrail bypass scope_warning --reason "One-time migration script"

# Request bypass approval
pa:guardrail request-bypass critical_path --approver tech_lead
```

---

## Configuration

```yaml
# proagents.config.yaml

guardrails:
  enabled: true

  scope:
    enabled: true
    strict: false  # Suggestions vs hard limits

  critical_paths:
    enabled: true
    paths:
      - path: "src/auth/**"
        level: "high"
      - path: "src/payment/**"
        level: "critical"

  quality:
    enabled: true
    testing_required: true
    linting_required: true

  auto_upgrade:
    enabled: true
    suggest_only: false  # Auto-upgrade vs suggest

  blocking:
    enabled: true
    allow_bypass: true
    require_justification: true

  notifications:
    on_trigger: true
    on_bypass: true
    on_block: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:guardrails status` | Show current guardrail status |
| `pa:guardrails check` | Run all guardrail checks |
| `pa:guardrails bypass [id]` | Bypass specific guardrail |
| `pa:guardrails history` | Show bypass history |
