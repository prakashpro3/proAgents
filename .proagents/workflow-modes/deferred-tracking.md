# Deferred Phase Tracking

Track phases that were skipped and need attention later.

---

## Overview

When using Bug Fix or Quick Change modes, some phases are skipped:
- Full analysis
- Design documentation
- Comprehensive testing
- Complete documentation

Deferred tracking ensures these don't become forgotten technical debt.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                  Deferred Phase Tracking                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Detect Skipped Phase                                    │
│     └── Track what was skipped and why                      │
│                                                             │
│  2. Create Deferred Task                                    │
│     ├── What needs to be done                               │
│     ├── Priority level                                      │
│     └── Deadline (if any)                                   │
│                                                             │
│  3. Track as Technical Debt                                 │
│     ├── Add to debt registry                                │
│     └── Include in reports                                  │
│                                                             │
│  4. Remind & Follow-up                                      │
│     ├── Periodic reminders                                  │
│     └── Include in retrospectives                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Deferred Items by Mode

### Bug Fix Mode - Deferred Items

```yaml
bug_fix_deferred:
  always_deferred:
    - phase: "full_analysis"
      create_task: "Review surrounding code for similar issues"
      priority: "low"
      deadline: "next_sprint"

    - phase: "comprehensive_documentation"
      create_task: "Add documentation for the fix"
      priority: "medium"
      deadline: "within_week"

  conditionally_deferred:
    - phase: "integration_tests"
      condition: "only_unit_tests_added"
      create_task: "Add integration tests for affected flow"
      priority: "medium"

    - phase: "refactoring"
      condition: "quick_fix_applied"
      create_task: "Refactor for proper solution"
      priority: "low"
      add_to_backlog: true
```

### Quick Change Mode - Deferred Items

```yaml
quick_change_deferred:
  always_deferred:
    - phase: "testing"
      create_task: "Add tests for changed configuration"
      priority: "low"
      condition: "if_testable"

    - phase: "documentation"
      create_task: "Update documentation if needed"
      priority: "low"

  if_user_chose_to_skip:
    - phase: "verification"
      create_task: "Verify change in staging"
      priority: "high"
      deadline: "before_deploy"
```

---

## Deferred Task Structure

```json
{
  "deferred_tasks": [
    {
      "id": "DEF-001",
      "created_at": "2024-01-15T10:30:00Z",
      "feature": "login-fix-2024-01-15",
      "original_mode": "bug_fix",
      "skipped_phase": "comprehensive_testing",
      "task": {
        "title": "Add integration tests for login flow",
        "description": "Bug fix added unit tests only. Integration tests needed to verify full flow.",
        "type": "testing",
        "priority": "medium",
        "estimated_effort": "2 hours"
      },
      "context": {
        "files_affected": [
          "src/auth/LoginForm.tsx",
          "src/auth/authService.ts"
        ],
        "related_commit": "abc123",
        "related_pr": "#456"
      },
      "tracking": {
        "status": "pending",
        "deadline": "2024-01-22",
        "assigned_to": null,
        "reminders_sent": 0
      }
    }
  ]
}
```

---

## Automatic Task Creation

### Post-Completion Tasks

After completing work in a fast-track mode:

```yaml
post_completion:
  bug_fix:
    auto_create:
      - task: "Review fix for edge cases"
        condition: "always"
        priority: "medium"
        deadline: "next_sprint"

      - task: "Add missing tests"
        condition: "test_coverage_below_80"
        priority: "high"
        deadline: "within_week"

      - task: "Document the fix"
        condition: "no_documentation_added"
        priority: "low"
        deadline: "within_2_weeks"

      - task: "Check for similar issues elsewhere"
        condition: "pattern_based_fix"
        priority: "medium"
        deadline: "within_week"

  quick_change:
    auto_create:
      - task: "Verify in production"
        condition: "config_change"
        priority: "high"
        deadline: "after_deploy"

      - task: "Update related documentation"
        condition: "always"
        priority: "low"
        deadline: "within_week"
```

---

## Integration with Technical Debt

Deferred items automatically become technical debt:

```yaml
debt_integration:
  auto_create_debt_item: true

  mapping:
    skipped_tests:
      debt_type: "missing_tests"
      severity: "medium"

    skipped_documentation:
      debt_type: "missing_documentation"
      severity: "low"

    quick_fix_applied:
      debt_type: "needs_refactoring"
      severity: "low"

    skipped_analysis:
      debt_type: "unverified_impact"
      severity: "medium"
```

---

## Reminder System

### Automated Reminders

```yaml
reminders:
  # When to remind
  schedule:
    high_priority:
      - "after_1_day"
      - "after_3_days"
      - "on_deadline"

    medium_priority:
      - "after_1_week"
      - "on_deadline"

    low_priority:
      - "after_2_weeks"
      - "on_deadline"

  # How to remind
  channels:
    - "in_app_notification"
    - "slack_dm"
    - "daily_standup_mention"

  # Escalation
  escalate:
    after_missed_deadline: true
    escalate_to: "tech_lead"
```

### Reminder Content

```
┌─────────────────────────────────────────────────────────────┐
│ Deferred Task Reminder                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ From: login-fix-2024-01-15 (Bug Fix)                       │
│                                                             │
│ Task: Add integration tests for login flow                  │
│ Priority: Medium                                            │
│ Deadline: Jan 22, 2024 (3 days remaining)                  │
│                                                             │
│ Context:                                                    │
│ You fixed the login button issue but only added unit tests.│
│ Integration tests are needed to verify the full login flow.│
│                                                             │
│ Files: src/auth/LoginForm.tsx, src/auth/authService.ts     │
│                                                             │
│ [Start Task] [Snooze 1 Day] [Mark Complete] [Reassign]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Deferred Tasks Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                  Deferred Tasks Dashboard                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Total Deferred: 12                                         │
│  ├── Testing: 5                                            │
│  ├── Documentation: 4                                      │
│  ├── Refactoring: 2                                        │
│  └── Review: 1                                             │
│                                                             │
│  By Priority:                                               │
│  ├── High: 2 (overdue: 1) 🔴                              │
│  ├── Medium: 6                                             │
│  └── Low: 4                                                │
│                                                             │
│  Upcoming Deadlines:                                        │
│  ├── Today: 1 - "Verify config in production"             │
│  ├── This Week: 3                                          │
│  └── Next Week: 4                                          │
│                                                             │
│  From Recent Work:                                          │
│  ├── login-fix: 2 tasks                                    │
│  ├── api-update: 1 task                                    │
│  └── config-change: 1 task                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Completing Deferred Tasks

### Marking Complete

```bash
# Mark task complete
pa:deferred complete DEF-001

# Complete with details
pa:deferred complete DEF-001 --commit abc123 --notes "Added 5 integration tests"

# Bulk complete
pa:deferred complete DEF-001 DEF-002 DEF-003
```

### Closing Without Completing

```bash
# Close as won't do
pa:deferred close DEF-001 --reason "No longer applicable after refactor"

# Close as duplicate
pa:deferred close DEF-001 --duplicate DEF-005
```

---

## Reports

### Weekly Deferred Tasks Report

```markdown
# Deferred Tasks Report - Week 3, 2024

## Summary
- New deferred tasks: 5
- Completed: 8
- Overdue: 2
- Total outstanding: 12

## Completed This Week
| Task | From | Completed By |
|------|------|--------------|
| Add login tests | login-fix | @dev1 |
| Update API docs | api-update | @dev2 |

## Overdue
| Task | From | Days Overdue | Assigned |
|------|------|--------------|----------|
| Verify config | config-fix | 2 | @dev1 |
| Add error handling | error-fix | 1 | unassigned |

## Upcoming
| Task | From | Due | Priority |
|------|------|-----|----------|
| Add integration tests | auth-fix | Jan 22 | Medium |
```

---

## Configuration

```yaml
# proagents.config.yaml

deferred_tracking:
  enabled: true

  auto_create:
    for_bug_fix: true
    for_quick_change: true

  tasks:
    default_priority: "medium"
    default_deadline_days: 14

  reminders:
    enabled: true
    channels: ["in_app", "slack"]
    frequency: "smart"  # Based on priority and deadline

  debt_integration:
    enabled: true
    auto_create_debt_items: true

  reporting:
    weekly_report: true
    include_in_retrospective: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:deferred list` | List all deferred tasks |
| `pa:deferred show [id]` | Show task details |
| `pa:deferred complete [id]` | Mark task complete |
| `pa:deferred close [id]` | Close without completing |
| `pa:deferred assign [id] [user]` | Assign task |
| `pa:deferred report` | Generate report |
