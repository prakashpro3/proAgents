# Coexistence Mode

Run ProAgents alongside existing workflows without disruption.

---

## Overview

Coexistence mode allows:
- ProAgents and existing tools to work together
- Gradual feature adoption
- No disruption to current processes
- Team to continue normal work

---

## Coexistence Principles

```
┌─────────────────────────────────────────────────────────────┐
│                  Coexistence Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Existing Workflow          ProAgents Layer               │
│   ─────────────────          ──────────────                │
│                                                             │
│   ┌─────────────┐            ┌─────────────┐               │
│   │  Git Flow   │◄──────────▶│  Tracking   │               │
│   └─────────────┘            └─────────────┘               │
│          │                          │                       │
│          ▼                          ▼                       │
│   ┌─────────────┐            ┌─────────────┐               │
│   │  CI/CD      │◄──────────▶│  Analysis   │               │
│   └─────────────┘            └─────────────┘               │
│          │                          │                       │
│          ▼                          ▼                       │
│   ┌─────────────┐            ┌─────────────┐               │
│   │  PR Review  │◄──────────▶│  Doc Gen    │               │
│   └─────────────┘            └─────────────┘               │
│                                                             │
│   Existing workflow continues     ProAgents adds value     │
│   unchanged                       without blocking          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### 1. Git Integration (Non-Blocking)

```yaml
git_integration:
  mode: "observe"  # observe | extend | replace

  observe:
    # ProAgents watches but doesn't enforce
    track_commits: true
    track_branches: true
    enforce_conventions: false

    actions:
      on_commit:
        - "Log change"
        - "Update tracking (if feature tracked)"
      on_branch_create:
        - "Detect if feature branch"
        - "Suggest tracking (don't require)"

  extend:
    # Add ProAgents checks alongside existing
    pre_commit:
      add_hook: true
      fail_on_error: false  # Warn only
    commit_msg:
      validate: true
      fail_on_error: false  # Warn only

  replace:
    # Full control (Phase 4 only)
    enforce_all: true
```

### 2. CI/CD Integration

```yaml
cicd_integration:
  mode: "extend"

  existing_pipeline:
    preserve: true
    modify: false

  proagents_jobs:
    add_to_existing: true
    as_separate_workflow: true
    allow_failure: true  # Don't block deploys

  jobs:
    - name: "proagents-analysis"
      trigger: "on_pr"
      blocking: false
      output: "comment_on_pr"

    - name: "proagents-docs"
      trigger: "on_merge"
      blocking: false
      output: "update_docs_folder"
```

**Example GitHub Actions Addition:**
```yaml
# .github/workflows/proagents.yml (separate workflow)
name: ProAgents Analysis

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  analyze:
    runs-on: ubuntu-latest
    continue-on-error: true  # Don't block PR

    steps:
      - uses: actions/checkout@v4

      - name: Run ProAgents Analysis
        run: npx proagents analyze --pr

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            // Add analysis as PR comment
```

### 3. Code Review Integration

```yaml
review_integration:
  mode: "supplement"

  existing_process:
    required_reviewers: 2  # Keep existing
    codeowners: true       # Keep existing
    checks: ["lint", "test"] # Keep existing

  proagents_addition:
    auto_comment: true
    sections:
      - "Files changed analysis"
      - "Pattern compliance"
      - "Documentation coverage"
      - "Suggestions"

    blocking: false  # Don't block approval
    as_review: false # As comment, not review
```

---

## Feature Coexistence

### Tracked vs Untracked Features

```yaml
feature_coexistence:
  tracked:
    # Features using ProAgents
    directory: "proagents/active-features/"
    workflow: "full"
    tracking: true

  untracked:
    # Features not using ProAgents
    workflow: "existing"
    tracking: false
    interference: "none"

  detection:
    tracked_indicators:
      - "Has status.json in proagents/active-features/"
      - "Branch matches tracked feature"

    untracked_behavior:
      - "Don't show in ProAgents dashboard"
      - "Don't enforce phases"
      - "Don't require documentation"
```

### Parallel Work

```yaml
parallel_work:
  scenario: "Some work tracked, some not"

  developer_a:
    feature: "feature-user-auth"
    mode: "proagents"
    tracking: true

  developer_b:
    feature: "feature-legacy-fix"
    mode: "existing"
    tracking: false

  no_conflict:
    - "Each follows their workflow"
    - "ProAgents doesn't interfere with untracked"
    - "Git operations work normally"
```

---

## Tool Coexistence

### Linting & Formatting

```yaml
linting_coexistence:
  existing:
    eslint: true
    prettier: true
    config: ".eslintrc.js"

  proagents:
    mode: "use_existing"
    additional_rules: false  # Don't add rules
    security_rules:
      add: true
      separate_config: true  # Don't modify existing

  result:
    - "Existing lint rules unchanged"
    - "ProAgents security rules in separate config"
    - "Both run, neither blocks"
```

### Testing

```yaml
testing_coexistence:
  existing:
    framework: "jest"
    config: "jest.config.js"
    coverage_threshold: 60%

  proagents:
    mode: "extend"
    new_code_threshold: 80%  # Higher for new code
    existing_code_threshold: null  # Don't enforce

  result:
    - "Existing tests run as normal"
    - "New code has higher requirements"
    - "No changes to existing test setup"
```

### Documentation

```yaml
documentation_coexistence:
  existing:
    readme: true
    wiki: "confluence"
    api_docs: "swagger"

  proagents:
    mode: "supplement"
    generate_to: "proagents/docs/"  # Separate location
    link_to_existing: true

  result:
    - "Existing docs unchanged"
    - "ProAgents docs in separate location"
    - "Links between both"
```

---

## Gradual Transition

### Level 1: Observe Only

```yaml
level_1:
  name: "Observe Only"

  proagents_does:
    - "Analyze codebase"
    - "Generate reports"
    - "Track patterns"

  proagents_does_not:
    - "Block any operations"
    - "Modify any files"
    - "Change any workflows"

  team_impact: "Zero"
```

### Level 2: Suggest

```yaml
level_2:
  name: "Suggest"

  proagents_does:
    - "All of Level 1"
    - "Suggest improvements"
    - "Comment on PRs"
    - "Generate documentation"

  proagents_does_not:
    - "Block operations"
    - "Enforce rules"
    - "Require tracking"

  team_impact: "Minimal (optional suggestions)"
```

### Level 3: Assist

```yaml
level_3:
  name: "Assist"

  proagents_does:
    - "All of Level 2"
    - "Track opted-in features"
    - "Enforce rules for new code"
    - "Generate required docs"

  proagents_does_not:
    - "Enforce on existing code"
    - "Block untracked work"

  team_impact: "Moderate (for tracked work)"
```

### Level 4: Full

```yaml
level_4:
  name: "Full Integration"

  proagents_does:
    - "Track all new features"
    - "Enforce all rules"
    - "Require documentation"
    - "Block non-compliant code"

  exceptions:
    - "Hotfixes"
    - "Legacy maintenance"
    - "Explicitly exempted paths"

  team_impact: "Full (standard process)"
```

---

## Conflict Resolution

### When Tools Conflict

```yaml
conflict_scenarios:
  scenario_1:
    conflict: "ESLint rule vs ProAgents suggestion"
    resolution: "ESLint wins (existing takes precedence)"
    action: "ProAgents adapts"

  scenario_2:
    conflict: "Commit hook failure"
    resolution: "Provide bypass option"
    action: "PROAGENTS_SKIP=1 git commit"

  scenario_3:
    conflict: "CI job failure"
    resolution: "ProAgents jobs are non-blocking"
    action: "Allow merge anyway"

  scenario_4:
    conflict: "Different branch naming"
    resolution: "ProAgents adapts to existing"
    action: "Detect and use existing convention"
```

### Escape Hatches

```yaml
escape_hatches:
  skip_commit_hook:
    command: "PROAGENTS_SKIP=1 git commit"
    when: "Hook causing issues"

  skip_analysis:
    command: "/proagents disable --temp"
    when: "Need to move fast"

  exempt_file:
    method: "Add to .proagentsignore"
    when: "File should be excluded"

  exempt_feature:
    method: "/feature exempt [name]"
    when: "Feature shouldn't be tracked"
```

---

## Configuration

```yaml
# proagents.config.yaml

coexistence:
  enabled: true
  level: "observe"  # observe | suggest | assist | full

  interference:
    blocking: false
    modifying: false
    enforcing: false

  integration:
    git:
      mode: "observe"
    cicd:
      mode: "extend"
      blocking: false
    review:
      mode: "supplement"
    linting:
      mode: "use_existing"
    testing:
      mode: "extend"

  escape_hatches:
    enabled: true
    log_usage: true

  transition:
    current_level: 1
    target_level: 4
    advance_trigger: "manual"  # manual | time | metrics
```

---

## Monitoring Coexistence

```yaml
coexistence_metrics:
  tracked:
    - "Features tracked vs untracked"
    - "ProAgents suggestions accepted"
    - "Escape hatch usage"
    - "Tool conflicts"
    - "Team adoption rate"

  dashboard:
    features_tracked: "5/12 (42%)"
    suggestions_accepted: "78%"
    escape_hatches_used: "3 this week"
    conflicts: "0"
    adoption_trend: "increasing"
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/coexist-status` | View coexistence status |
| `/coexist-level [1-4]` | Set coexistence level |
| `/coexist-exempt [path]` | Exempt path from ProAgents |
| `/coexist-conflicts` | View any conflicts |
| `/proagents disable --temp` | Temporarily disable |
