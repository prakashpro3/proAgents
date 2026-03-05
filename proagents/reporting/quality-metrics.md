# Quality Metrics

Track code quality, test coverage, and technical health.

---

## Overview

Quality metrics ensure code health and help prevent technical debt accumulation.

---

## Key Metrics

### Test Coverage

```
┌─────────────────────────────────────────────────────────────┐
│ Test Coverage by Project                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Project     │ Unit    │ Integration │ E2E    │ Overall    │
│ ────────────┼─────────┼─────────────┼────────┼─────────── │
│ frontend    │ 85%     │ 72%         │ 45%    │ 78%        │
│ backend     │ 92%     │ 78%         │ N/A    │ 88%        │
│ mobile      │ 75%     │ 60%         │ 30%    │ 65%        │
│ shared      │ 95%     │ 85%         │ N/A    │ 92%        │
│                                                             │
│ Workspace Average: 81%                                     │
│ Target: 80% ✅                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Code Quality Score

```yaml
quality_score:
  overall: 85
  breakdown:
    maintainability: 88
    reliability: 90
    security: 82
    performance: 80
    documentation: 75

  trend: "stable"
  vs_last_month: "+2"
```

### Technical Debt

```
┌─────────────────────────────────────────────────────────────┐
│ Technical Debt Overview                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Total Debt Items: 47                                       │
│                                                             │
│ By Priority:                                                │
│ ├── Critical: 2 ████                                       │
│ ├── High: 8 ████████████████                              │
│ ├── Medium: 22 ████████████████████████████████████████   │
│ └── Low: 15 ██████████████████████████████                │
│                                                             │
│ By Type:                                                    │
│ ├── Missing Tests: 18                                      │
│ ├── Code Smells: 12                                        │
│ ├── Documentation: 8                                       │
│ ├── Deprecated Code: 5                                     │
│ └── Security: 4                                            │
│                                                             │
│ Estimated Effort: 45 hours                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quality Reports

### Generate Report

```bash
# Full quality report
proagents report quality

# Coverage focused
proagents report quality --focus coverage

# Security focused
proagents report quality --focus security

# By project
proagents report quality --project frontend
```

### Report Output

```markdown
# Quality Report - January 2024

## Summary
- Overall Quality Score: 85/100 (↑ 2 from last month)
- Test Coverage: 81% (Target: 80%) ✅
- Technical Debt Items: 47 (↓ 5 from last month)
- Security Vulnerabilities: 0 critical, 2 medium

## Coverage Analysis

### By Project
| Project | Coverage | Target | Status |
|---------|----------|--------|--------|
| frontend | 78% | 80% | ⚠️ Below |
| backend | 88% | 85% | ✅ Above |
| mobile | 65% | 75% | ❌ Below |
| shared | 92% | 90% | ✅ Above |

### Coverage Gaps
1. `frontend/src/components/` - 15 untested components
2. `mobile/src/screens/` - 8 untested screens
3. `backend/src/utils/` - 5 untested utilities

## Code Quality

### Issues by Severity
- Critical: 2 (must fix immediately)
- High: 8 (fix this sprint)
- Medium: 22 (fix next sprint)
- Low: 15 (backlog)

### Top Issues
1. **Critical**: SQL injection risk in UserService.ts
2. **Critical**: Missing input validation in PaymentController
3. **High**: Duplicate code in auth modules

## Recommendations
1. Increase mobile test coverage (add 10% this sprint)
2. Fix critical security issues immediately
3. Dedicate 1 day/week to technical debt
```

---

## Metric Details

### Test Coverage Metrics

```yaml
coverage:
  metrics:
    line_coverage: 81%
    branch_coverage: 75%
    function_coverage: 88%

  by_type:
    unit: 85%
    integration: 72%
    e2e: 45%

  trends:
    vs_last_week: "+1%"
    vs_last_month: "+3%"
    vs_last_quarter: "+8%"

  gaps:
    - path: "src/components/complex"
      coverage: 45%
      importance: "high"

    - path: "src/utils/legacy"
      coverage: 30%
      importance: "medium"
```

### Code Review Metrics

```yaml
code_review:
  metrics:
    review_coverage: 98%  # PRs reviewed
    review_time: "4.2 hours"  # Average time to review
    comments_per_pr: 3.5
    approval_rate: 85%  # First-time approval

  by_reviewer:
    - name: "Senior Dev 1"
      reviews: 45
      avg_time: "3.1 hours"
      quality_score: 92

    - name: "Senior Dev 2"
      reviews: 38
      avg_time: "5.2 hours"
      quality_score: 88
```

### Bug Metrics

```yaml
bugs:
  escape_rate: 5%  # Bugs found in production vs total
  mttr: "2.3 hours"  # Mean time to resolve

  by_severity:
    critical: 0
    high: 2
    medium: 8
    low: 15

  by_source:
    new_features: 60%
    regressions: 25%
    edge_cases: 15%

  trends:
    vs_last_month: "-20%"  # Improvement
```

---

## Quality Dashboards

### Code Quality Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Code Quality Dashboard                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Quality Score: 85/100                                      │
│ ████████████████████████████████████████░░░░░░░░░░         │
│                                                             │
│ Metrics:                                                    │
│ ├── Maintainability:  ████████░░ 88/100                   │
│ ├── Reliability:      █████████░ 90/100                   │
│ ├── Security:         ████████░░ 82/100                   │
│ ├── Performance:      ████████░░ 80/100                   │
│ └── Documentation:    ███████░░░ 75/100                   │
│                                                             │
│ Trends (Last 30 Days):                                     │
│ ├── Quality Score:    ↑ 2 points                          │
│ ├── Coverage:         ↑ 3%                                │
│ └── Tech Debt:        ↓ 5 items                           │
│                                                             │
│ Alerts:                                                     │
│ ⚠️ 2 critical issues need attention                        │
│ ⚠️ Mobile coverage below target                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Security Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Security Dashboard                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Security Score: 92/100                                     │
│                                                             │
│ Vulnerabilities:                                            │
│ ├── Critical: 0                                            │
│ ├── High: 2 (in progress)                                  │
│ ├── Medium: 5                                              │
│ └── Low: 12                                                │
│                                                             │
│ Dependency Security:                                        │
│ ├── Known vulnerabilities: 3                               │
│ ├── Outdated packages: 15                                  │
│ └── Last scan: 2 hours ago                                │
│                                                             │
│ OWASP Top 10 Compliance:                                   │
│ ├── A01 Access Control:    ✅ Pass                         │
│ ├── A02 Cryptography:      ✅ Pass                         │
│ ├── A03 Injection:         ⚠️ 1 issue                     │
│ ├── A04 Insecure Design:   ✅ Pass                         │
│ └── ...                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quality Targets

### Configuration

```yaml
quality:
  targets:
    coverage:
      unit: 85
      integration: 70
      e2e: 40
      overall: 80

    quality_score:
      minimum: 75
      target: 85
      stretch: 95

    code_review:
      review_time_hours: 8
      approval_rate: 80

    bugs:
      escape_rate: 5
      mttr_hours: 4

  alerts:
    - metric: coverage
      condition: "< 75%"
      action: "block_merge"

    - metric: quality_score
      condition: "< 70"
      action: "notify_lead"

    - metric: security_vulnerabilities
      condition: "critical > 0"
      action: "alert_security_team"
```

### Quality Gates

```yaml
quality_gates:
  pre_merge:
    - "coverage >= 80%"
    - "no_critical_issues"
    - "no_security_vulnerabilities"
    - "lint_passed"

  pre_deploy:
    - "all_tests_passed"
    - "security_scan_passed"
    - "performance_benchmark_passed"
```

---

## Improvement Tracking

### Quality Improvement Plan

```yaml
improvement_plan:
  q1_2024:
    goals:
      - metric: coverage
        current: 78
        target: 85
        actions:
          - "Add tests for legacy components"
          - "Require tests for all new code"

      - metric: tech_debt
        current: 52
        target: 30
        actions:
          - "Dedicate 20% time to debt"
          - "Include debt in feature estimates"

    milestones:
      - date: "2024-01-31"
        target: "Coverage to 80%"

      - date: "2024-02-28"
        target: "Tech debt to 40 items"

      - date: "2024-03-31"
        target: "Quality score to 90"
```

---

## Best Practices

1. **Set Realistic Targets**: Gradual improvement over perfection
2. **Automate Measurement**: Don't rely on manual tracking
3. **Act on Data**: Use metrics to drive decisions
4. **Balance Coverage**: Focus on critical paths
5. **Address Debt Regularly**: Prevent accumulation
6. **Review Trends**: Single measurements are noisy
