# Mode Switching

Switch between workflow modes during development.

---

## Overview

Sometimes you need to change modes mid-workflow:
- Bug fix turns out to be more complex
- Feature is simpler than expected
- Requirements change during development

---

## Switching Scenarios

### Upgrade: Bug Fix → Full Workflow

```
Started: Bug Fix Mode
Reason: "Fix login button"

During work:
├── Discovered: Issue requires auth flow redesign
├── Scope: Multiple components affected
├── Complexity: Higher than expected
└── Trigger: touches_security_code = true

Action: Suggest upgrade to Full Workflow
```

**How to Switch:**
```bash
# Manual switch
/mode switch full-workflow

# Accept suggestion
# When prompted: [Upgrade to Full Workflow?] → Yes
```

**What Happens:**
```yaml
upgrade_process:
  preserve:
    - "Current code changes"
    - "Context gathered"
    - "Files identified"

  add:
    - "Analysis phase (quick version)"
    - "Requirements documentation"
    - "Implementation planning"
    - "Full testing requirements"

  update:
    - "Feature tracking to full workflow"
    - "Checklist expanded"
```

---

### Downgrade: Full Workflow → Bug Fix

```
Started: Full Workflow
Reason: "Implement user preferences"

During work:
├── Analysis revealed: Simple feature
├── Scope: Single component
├── No design needed
└── Can be done quickly

Action: Suggest downgrade to Bug Fix
```

**How to Switch:**
```bash
# Manual switch
/mode switch bug-fix

# With confirmation
/mode switch bug-fix --confirm
```

**What Happens:**
```yaml
downgrade_process:
  preserve:
    - "Requirements gathered"
    - "Files identified"
    - "Context"

  skip:
    - "Full analysis (use quick scan)"
    - "Design phase"
    - "Extensive planning"

  still_require:
    - "Testing"
    - "Basic documentation"
    - "Code review"
```

---

### Quick Change → Bug Fix

```
Started: Quick Change
Reason: "Update API URL"

During work:
├── Found: URL change breaks functionality
├── Need: Additional code changes
└── Scope: Expanded

Action: Auto-upgrade to Bug Fix
```

---

## Automatic Mode Switching

### Auto-Upgrade Triggers

```yaml
auto_upgrade_triggers:
  # Bug Fix → Full Workflow
  bug_fix_to_full:
    conditions:
      - files_changed: "> 5"
      - duration: "> 3 hours"
      - touches:
          - "authentication"
          - "payment"
          - "database schema"
      - requires:
          - "new_api_endpoints"
          - "database_migration"
          - "ui_redesign"

    action: "suggest_upgrade"
    blocking: false

  # Quick Change → Bug Fix
  quick_to_bug_fix:
    conditions:
      - files_changed: "> 1"
      - code_logic_changed: true
      - tests_needed: true

    action: "auto_upgrade"
    blocking: false

  # Quick Change → Full Workflow
  quick_to_full:
    conditions:
      - complexity: "high"
      - multiple_features: true

    action: "suggest_upgrade"
    blocking: true
```

### Auto-Downgrade Suggestions

```yaml
auto_downgrade_suggestions:
  # Full Workflow → Bug Fix
  full_to_bug_fix:
    conditions:
      - analysis_shows: "simple_change"
      - files_affected: "< 3"
      - no_design_needed: true
      - time_estimate: "< 2 hours"

    action: "suggest_downgrade"
    user_choice: true

  # Full Workflow → Quick Change
  full_to_quick:
    conditions:
      - only_config_change: true
      - no_code_logic: true
      - single_file: true

    action: "suggest_downgrade"
    user_choice: true
```

---

## Switch Flow

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────────┐
│                    Mode Switch Process                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Trigger Detection                                       │
│     └── Manual request OR Auto-detected condition           │
│                                                             │
│  2. State Preservation                                      │
│     ├── Save current progress                               │
│     ├── Save gathered context                               │
│     └── Save any code changes                               │
│                                                             │
│  3. Mode Transition                                         │
│     ├── Update workflow mode                                │
│     ├── Recalculate phases                                  │
│     └── Update requirements                                 │
│                                                             │
│  4. Context Adaptation                                      │
│     ├── Add/remove phases as needed                         │
│     ├── Adjust checkpoints                                  │
│     └── Update documentation requirements                   │
│                                                             │
│  5. Continue Work                                           │
│     └── Resume from appropriate phase                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## State Preservation

### What Gets Preserved

```yaml
preserved_on_switch:
  always:
    - "code_changes"          # Any code written
    - "gathered_context"       # Codebase analysis
    - "identified_files"       # Files to modify
    - "user_decisions"         # Choices made
    - "time_spent"            # Tracking data

  upgrade_only:
    - "quick_analysis"         # Becomes input for full analysis
    - "fix_description"        # Becomes requirements input

  downgrade_only:
    - "full_analysis"          # Kept for reference
    - "requirements"           # Simplified but kept
```

### State File

```json
{
  "switch_event": {
    "from_mode": "bug_fix",
    "to_mode": "full_workflow",
    "timestamp": "2024-01-15T10:30:00Z",
    "reason": "Scope expanded beyond bug fix",
    "trigger": "manual"
  },
  "preserved_state": {
    "original_request": "Fix login button",
    "files_identified": ["src/auth/LoginForm.tsx"],
    "context_gathered": { },
    "code_changes": { },
    "time_spent_minutes": 45
  },
  "new_requirements": {
    "additional_phases": ["analysis", "design", "planning"],
    "new_checkpoints": ["after_design"],
    "expanded_testing": true
  }
}
```

---

## User Interface

### Switch Prompt

```
┌─────────────────────────────────────────────────────────────┐
│ Mode Switch Detected                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Current Mode: Bug Fix                                       │
│ Suggested Mode: Full Workflow                               │
│                                                             │
│ Reason: Change touches authentication code and requires     │
│ database modifications.                                      │
│                                                             │
│ What will change:                                           │
│ + Full codebase analysis                                    │
│ + Design phase added                                        │
│ + Implementation planning                                   │
│ + Comprehensive testing                                     │
│ + Full documentation                                        │
│                                                             │
│ What stays the same:                                        │
│ ✓ Your current code changes                                │
│ ✓ Context gathered so far                                  │
│ ✓ Files identified                                         │
│                                                             │
│ [Switch to Full Workflow] [Stay in Bug Fix] [Ask Me Later] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Commands

```bash
# Switch modes
/mode switch full-workflow
/mode switch bug-fix
/mode switch quick-change

# Check current mode
/mode current

# See switch history
/mode history

# Force mode (skip confirmation)
/mode switch full-workflow --force
```

---

## Configuration

```yaml
# proagents.config.yaml

mode_switching:
  enabled: true

  auto_upgrade:
    enabled: true
    triggers:
      - "files_exceed_threshold"
      - "touches_critical_code"
      - "duration_exceeded"
    require_confirmation: true

  auto_downgrade:
    enabled: true
    suggest_only: true  # Never auto-downgrade

  preserve_state:
    code_changes: true
    context: true
    time_tracking: true

  notifications:
    on_switch: true
    on_suggestion: true
```

---

## Best Practices

1. **Don't resist upgrades** - If the system suggests upgrading, it's usually right
2. **Preserve your work** - Switching always keeps your code changes
3. **Document the switch** - Note why mode was changed for future reference
4. **Complete current task** - Finish current subtask before switching if possible
5. **Review new requirements** - After upgrading, review what's now expected
