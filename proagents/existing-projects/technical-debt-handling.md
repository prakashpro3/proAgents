# Technical Debt Handling

Manage and reduce technical debt during ProAgents adoption.

---

## Overview

Technical debt in existing projects includes:
- Low test coverage
- Security vulnerabilities
- Outdated dependencies
- Missing documentation
- Inconsistent patterns
- Code quality issues

ProAgents helps track and gradually reduce debt without blocking progress.

---

## Technical Debt Categories

```
┌─────────────────────────────────────────────────────────────┐
│                   Technical Debt Inventory                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Testing Debt          Documentation Debt                   │
│  ─────────────         ──────────────────                   │
│  • Low coverage        • Missing README                     │
│  • Missing tests       • Outdated docs                      │
│  • Flaky tests         • No API docs                        │
│  • No E2E tests        • No architecture docs               │
│                                                             │
│  Code Quality Debt     Security Debt                        │
│  ─────────────────     ─────────────                        │
│  • Code smells         • Vulnerabilities                    │
│  • High complexity     • Outdated deps                      │
│  • Duplication         • Hardcoded secrets                  │
│  • Poor naming         • Missing auth checks                │
│                                                             │
│  Pattern Debt          Infrastructure Debt                  │
│  ────────────          ──────────────────                   │
│  • Multiple patterns   • No CI/CD                           │
│  • Legacy code         • Manual deployments                 │
│  • Inconsistency       • No monitoring                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Debt Assessment

### Running Assessment

```bash
# Full technical debt assessment
pa:debt-assess

# Assess specific category
pa:debt-assess --category testing
pa:debt-assess --category security
pa:debt-assess --category patterns

# Quick assessment
pa:debt-assess --quick
```

### Assessment Output

```yaml
technical_debt_assessment:
  date: "2024-01-15"
  overall_score: 45  # 0-100 (lower = more debt)

  categories:
    testing:
      score: 35
      issues:
        - type: "low_coverage"
          severity: "high"
          details: "Overall coverage 35%, target 80%"
          files_affected: 234

        - type: "missing_tests"
          severity: "high"
          details: "Critical paths untested"
          paths:
            - "src/services/paymentService.ts"
            - "src/services/authService.ts"

        - type: "flaky_tests"
          severity: "medium"
          count: 5

    security:
      score: 60
      issues:
        - type: "vulnerable_dependencies"
          severity: "high"
          count: 3

        - type: "hardcoded_secrets"
          severity: "critical"
          files: 2

    documentation:
      score: 40
      issues:
        - type: "outdated_readme"
          severity: "medium"
          last_updated: "2022-06-15"

        - type: "missing_api_docs"
          severity: "medium"
          endpoints_undocumented: 45

    code_quality:
      score: 55
      issues:
        - type: "high_complexity"
          severity: "medium"
          files: 12

        - type: "code_duplication"
          severity: "low"
          percentage: 8

    patterns:
      score: 50
      issues:
        - type: "inconsistent_patterns"
          severity: "medium"
          patterns: ["redux", "zustand", "context"]
```

---

## Debt Tracking

### Debt Registry

```yaml
# proagents/debt/registry.yaml

debt_items:
  - id: "DEBT-001"
    category: "testing"
    type: "low_coverage"
    created: "2024-01-15"
    severity: "high"
    status: "open"
    description: "Payment service has 0% test coverage"
    location: "src/services/paymentService.ts"
    estimated_effort: "4 hours"
    assigned_to: null
    target_date: null

  - id: "DEBT-002"
    category: "security"
    type: "hardcoded_secret"
    created: "2024-01-15"
    severity: "critical"
    status: "in_progress"
    description: "API key hardcoded in config"
    location: "src/config/api.ts:15"
    estimated_effort: "1 hour"
    assigned_to: "dev-1"
    target_date: "2024-01-20"

  - id: "DEBT-003"
    category: "patterns"
    type: "legacy_code"
    created: "2024-01-15"
    severity: "low"
    status: "open"
    description: "Class components in admin module"
    location: "src/admin/**"
    estimated_effort: "8 hours"
    assigned_to: null
    target_date: null
```

### Debt Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                   Technical Debt Dashboard                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Total Debt Items: 45                                       │
│  ├── Critical: 2 🔴                                        │
│  ├── High: 12 🟠                                           │
│  ├── Medium: 18 🟡                                         │
│  └── Low: 13 🟢                                            │
│                                                             │
│  Status:                                                    │
│  ├── Open: 35                                              │
│  ├── In Progress: 7                                        │
│  └── Resolved (this month): 8                              │
│                                                             │
│  By Category:                                               │
│  Testing ████████████░░░░░░░░ 12                           │
│  Security ██████░░░░░░░░░░░░░░ 6                           │
│  Documentation ████████░░░░░░░░░░░░ 8                      │
│  Code Quality ██████████░░░░░░░░░░ 10                      │
│  Patterns ██████████░░░░░░░░░░ 9                           │
│                                                             │
│  Trend: ↓ 15% from last month                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Debt Reduction Strategies

### Strategy 1: Touch-and-Fix

```yaml
touch_and_fix:
  description: "Fix debt when you touch related code"

  trigger: "Developer modifies a file"

  actions:
    - check_debt_items_for_file
    - suggest_fixes
    - track_if_skipped

  example:
    scenario: "Developer modifies paymentService.ts"
    debt_found: "No tests for this file"
    suggestion: "Add tests while you're here? (30 min estimated)"
    options:
      - "Add tests now"
      - "Create debt ticket for later"
      - "Skip (not recommended)"

  configuration:
    enforce: false  # Suggest, don't block
    track_skips: true
    max_additional_time: "30%"  # Don't suggest if > 30% extra work
```

### Strategy 2: Dedicated Sprints

```yaml
dedicated_sprints:
  description: "Allocate time specifically for debt reduction"

  allocation:
    - option: "20% of each sprint"
      suitable_for: "Continuous improvement"

    - option: "Full debt sprint monthly"
      suitable_for: "Larger items"

    - option: "Quarterly debt week"
      suitable_for: "Major refactoring"

  prioritization:
    - "Critical security issues first"
    - "High-impact items second"
    - "Quick wins (< 1 hour) third"
    - "Low priority last"

  tracking:
    sprint_goal: "Reduce debt score by 5 points"
    metrics:
      - "Items resolved"
      - "Debt score change"
      - "Coverage improvement"
```

### Strategy 3: New Code Standards

```yaml
new_code_standards:
  description: "Prevent new debt, fix old gradually"

  for_new_code:
    testing:
      coverage_minimum: 80%
      required_tests: ["unit", "integration"]
      enforce: true

    documentation:
      required: true
      minimum: ["function_docs", "readme_update"]

    code_quality:
      max_complexity: 10
      no_code_smells: true

  for_existing_code:
    testing:
      required: false
      suggest_on_touch: true

    documentation:
      required: false
      auto_generate: true

    code_quality:
      required: false
      track_issues: true
```

---

## Handling Specific Debt Types

### Testing Debt

```yaml
testing_debt:
  assessment:
    current_coverage: 35%
    target_coverage: 80%
    gap: 45%

  strategy:
    phase_1:
      name: "Critical paths"
      focus:
        - "Payment processing"
        - "Authentication"
        - "Core business logic"
      target: "+15% coverage"

    phase_2:
      name: "High-traffic code"
      focus:
        - "Most modified files"
        - "Bug-prone areas"
      target: "+15% coverage"

    phase_3:
      name: "Everything else"
      focus:
        - "Remaining code"
      target: "+15% coverage"

  tools:
    - name: "Coverage report"
      command: "pa:test-coverage"
    - name: "Untested code finder"
      command: "pa:find-untested"
    - name: "Test generator"
      command: "pa:generate-tests [file]"

  configuration:
    block_pr_below: null  # Don't block existing
    require_for_new: 80%
    report_in_pr: true
```

### Security Debt

```yaml
security_debt:
  priority: "HIGHEST"

  immediate_actions:
    critical:
      - "Remove hardcoded secrets"
      - "Patch critical vulnerabilities"
      timeline: "24 hours"

    high:
      - "Update vulnerable dependencies"
      - "Fix authentication gaps"
      timeline: "1 week"

  process:
    1_scan: "pa:security-scan"
    2_prioritize: "Critical → High → Medium → Low"
    3_fix: "Dedicated security sprint if needed"
    4_verify: "pa:security-scan --verify"

  automation:
    dependency_scanning: "daily"
    secret_detection: "pre-commit"
    vulnerability_alerts: true

  configuration:
    block_critical: true
    block_high: false
    report_all: true
```

### Documentation Debt

```yaml
documentation_debt:
  assessment:
    readme: "outdated"
    api_docs: "50% coverage"
    code_docs: "25% coverage"

  strategy:
    auto_generate:
      enabled: true
      scope: ["api", "components", "functions"]
      output: "proagents/docs/"

    manual_priority:
      - "Architecture decisions"
      - "Setup guide"
      - "Contribution guide"

  commands:
    - name: "Generate all docs"
      command: "pa:doc-full"
    - name: "Update README"
      command: "pa:doc-readme"
    - name: "API documentation"
      command: "pa:doc-api"

  configuration:
    auto_update: true
    mark_generated: true
    require_for_new_code: true
```

### Code Quality Debt

```yaml
code_quality_debt:
  assessment:
    complexity:
      high_complexity_files: 12
      average_complexity: 15
      target: 10

    duplication:
      percentage: 8%
      target: 3%

    code_smells:
      count: 45
      categories: ["long_methods", "large_classes", "deep_nesting"]

  strategy:
    refactoring:
      approach: "gradual"
      trigger: "when_touched"

    tools:
      - name: "Complexity report"
        command: "pa:quality-complexity"
      - name: "Duplication finder"
        command: "pa:quality-duplicates"
      - name: "Code smell detector"
        command: "pa:quality-smells"

  configuration:
    block_new_smells: true
    suggest_refactoring: true
    max_complexity_new_code: 10
```

---

## Debt Prevention

### Pre-commit Checks

```yaml
pre_commit:
  checks:
    - name: "No hardcoded secrets"
      tool: "detect-secrets"
      block: true

    - name: "Tests for new code"
      tool: "coverage-check"
      block: false
      warn: true

    - name: "Complexity check"
      tool: "complexity-check"
      threshold: 15
      block: false

    - name: "Lint check"
      tool: "eslint"
      block: true
```

### PR Checks

```yaml
pr_checks:
  required:
    - name: "No new security issues"
      tool: "security-scan"

    - name: "Coverage not decreased"
      tool: "coverage-compare"

  informational:
    - name: "New debt items"
      tool: "debt-scan"
      display: "pr_comment"

    - name: "Quality metrics"
      tool: "quality-report"
      display: "pr_comment"
```

### Continuous Monitoring

```yaml
continuous_monitoring:
  daily:
    - "Dependency vulnerability scan"
    - "Secret detection"

  weekly:
    - "Full debt assessment"
    - "Quality trend report"

  monthly:
    - "Debt reduction progress report"
    - "Priority reassessment"
```

---

## Reporting

### Debt Trends Report

```
┌─────────────────────────────────────────────────────────────┐
│               Technical Debt Trends - Q1 2024               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Debt Score (0-100, higher is better)                       │
│                                                             │
│  100│                                                       │
│   80│                                    ╱────              │
│   60│                        ╱──────────╱                   │
│   40│            ╱──────────╱                               │
│   20│  ─────────╱                                           │
│    0│                                                       │
│     └────────────────────────────────────────────           │
│      Jan   Feb   Mar   Apr   May   Jun                      │
│                                                             │
│  Items Resolved:                                            │
│  Jan: 5 │ Feb: 8 │ Mar: 12 │ Apr: 15 │ May: 10 │ Jun: 8    │
│                                                             │
│  Coverage:                                                  │
│  Jan: 35% │ Feb: 42% │ Mar: 55% │ Apr: 62% │ May: 70%      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Sprint Report

```markdown
# Debt Reduction Sprint Report

## Sprint: 2024-W03

### Goals
- [ ] Resolve 5 high-priority items
- [x] Increase coverage by 5%
- [x] Fix all critical security issues

### Resolved Items
| ID | Category | Description | Effort |
|----|----------|-------------|--------|
| DEBT-002 | Security | Hardcoded API key | 1h |
| DEBT-005 | Testing | Payment tests | 4h |
| DEBT-008 | Docs | Update README | 2h |

### Metrics
- Debt score: 45 → 52 (+7)
- Coverage: 35% → 42% (+7%)
- Items resolved: 8
- Items added: 3 (net: -5)

### Blockers
- DEBT-010 blocked by external dependency update

### Next Sprint
- Focus on remaining security items
- Continue coverage improvement
```

---

## Configuration

```yaml
# proagents.config.yaml

technical_debt:
  tracking:
    enabled: true
    registry_path: "proagents/debt/registry.yaml"

  assessment:
    run_on_init: true
    run_weekly: true

  thresholds:
    critical_block: true
    high_warn: true
    medium_track: true
    low_track: true

  reduction:
    strategy: "touch_and_fix"
    sprint_allocation: 20%
    suggest_fixes: true

  prevention:
    new_code_standards: true
    block_new_debt: false  # Suggest, don't block

  reporting:
    weekly_report: true
    pr_comments: true
    dashboard: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:debt-assess` | Run debt assessment |
| `pa:debt-status` | View debt dashboard |
| `pa:debt-list` | List all debt items |
| `pa:debt-add` | Add debt item manually |
| `pa:debt-resolve [id]` | Mark item as resolved |
| `pa:debt-report` | Generate debt report |
| `pa:debt-trends` | View debt trends |
