# Quality Assessment

Comprehensive code quality analysis including complexity metrics, maintainability scores, and technical debt identification.

---

## Overview

Quality assessment provides:
- Objective code quality metrics
- Technical debt identification
- Maintainability analysis
- Best practice compliance
- Actionable improvement recommendations

---

## Assessment Categories

### 1. Code Complexity Analysis

```yaml
complexity_analysis:
  overall_score: 72  # out of 100

  metrics:
    cyclomatic_complexity:
      average: 4.2
      max: 18
      threshold: 10
      files_exceeding: 5

    cognitive_complexity:
      average: 6.8
      max: 32
      threshold: 15
      files_exceeding: 8

    nesting_depth:
      average: 2.1
      max: 5
      threshold: 4
      files_exceeding: 3

  high_complexity_files:
    - file: "src/services/orderService.ts"
      cyclomatic: 18
      cognitive: 32
      issue: "Complex order processing logic"
      recommendation: "Break into smaller functions"

    - file: "src/components/Dashboard.tsx"
      cyclomatic: 15
      cognitive: 28
      issue: "Too many conditional renders"
      recommendation: "Extract into sub-components"

    - file: "src/utils/dataTransform.ts"
      cyclomatic: 14
      cognitive: 24
      issue: "Multiple nested loops"
      recommendation: "Use functional approaches"

  complexity_distribution:
    low_1_5: 85  # 85% of files
    medium_6_10: 10
    high_11_15: 3
    very_high_16_plus: 2
```

**Complexity Visualization:**
```
Complexity Distribution
═══════════════════════

Low (1-5)      ████████████████████ 85%
Medium (6-10)  ████                 10%
High (11-15)   █                     3%
Very High (16+)▏                     2%
```

---

### 2. Maintainability Index

```yaml
maintainability:
  overall_score: 68  # out of 100 (>65 is good)

  factors:
    lines_of_code:
      total: 24500
      average_per_file: 156
      max_per_file: 580
      recommendation: "Split files >300 lines"

    comment_ratio:
      overall: 12%
      recommended: "10-20%"
      status: "Good"

    documentation_coverage:
      public_functions: 65%
      public_classes: 78%
      public_types: 45%
      recommendation: "Improve type documentation"

    test_coverage:
      statements: 78%
      branches: 65%
      functions: 82%
      lines: 79%
      recommendation: "Improve branch coverage"

  maintainability_by_module:
    - module: "auth"
      score: 82
      status: "Good"

    - module: "dashboard"
      score: 58
      status: "Needs attention"
      issues: ["High complexity", "Low test coverage"]

    - module: "user"
      score: 75
      status: "Good"

    - module: "payments"
      score: 45
      status: "Critical"
      issues: ["Very high complexity", "No tests", "Outdated patterns"]
```

---

### 3. Technical Debt Analysis

```yaml
technical_debt:
  total_estimated_hours: 120
  debt_ratio: 8.5%  # Debt / Total Dev Time

  categories:
    code_smells:
      count: 45
      hours: 35
      priority: "medium"
      items:
        - type: "Long Method"
          count: 12
          locations:
            - "orderService.processOrder()"
            - "dashboardService.generateReport()"
          fix_time: "2-4 hours each"

        - type: "Large Class"
          count: 5
          locations:
            - "src/services/ApiClient.ts (450 lines)"
            - "src/components/DataTable.tsx (380 lines)"
          fix_time: "4-6 hours each"

        - type: "Feature Envy"
          count: 8
          description: "Methods using other class data more than own"
          fix_time: "1-2 hours each"

    outdated_dependencies:
      count: 12
      hours: 8
      priority: "low"
      items:
        - "react-query v4 → v5 (breaking changes)"
        - "date-fns v2 → v3 (API changes)"

    missing_tests:
      count: 34  # untested critical paths
      hours: 40
      priority: "high"
      items:
        - "Payment processing - 0% coverage"
        - "Auth refresh flow - 20% coverage"
        - "Error boundaries - untested"

    deprecated_code:
      count: 15
      hours: 12
      priority: "low"
      items:
        - "Old API client still in use"
        - "Legacy form components"
        - "Deprecated hook patterns"

    security_issues:
      count: 3
      hours: 10
      priority: "critical"
      items:
        - "SQL query concatenation in 2 places"
        - "XSS vulnerability in markdown render"
        - "Missing input validation"

    documentation:
      count: 25
      hours: 15
      priority: "medium"
      items:
        - "API endpoints undocumented"
        - "Complex algorithms unexplained"
        - "Outdated README"

  debt_trend:
    last_month: 95 hours
    current: 120 hours
    trend: "increasing"
    recommendation: "Allocate 20% of sprint to debt reduction"
```

**Debt Distribution:**
```
Technical Debt Breakdown
════════════════════════

Missing Tests     ████████████████     40h (33%)
Code Smells       ██████████████       35h (29%)
Documentation     ██████               15h (13%)
Deprecated Code   █████                12h (10%)
Security Issues   ████                 10h  (8%)
Dependencies      ███                   8h  (7%)
                                      ────────
                                      120h total
```

---

### 4. Code Smells Detection

```yaml
code_smells:
  total: 87

  by_severity:
    critical: 5
    major: 23
    minor: 59

  detected:
    - smell: "God Object"
      severity: "critical"
      location: "src/services/ApiClient.ts"
      description: "Class handling too many responsibilities"
      lines: 450
      methods: 35
      fix: "Split into domain-specific services"

    - smell: "Primitive Obsession"
      severity: "major"
      locations: 8
      description: "Using primitives instead of value objects"
      example: |
        // Bad
        function createUser(email: string, age: number, role: string)

        // Better
        function createUser(input: CreateUserInput)
      fix: "Create proper type/interface definitions"

    - smell: "Long Parameter List"
      severity: "major"
      count: 12
      threshold: 4
      example:
        file: "src/services/reportService.ts:45"
        params: 8
      fix: "Use parameter objects or builders"

    - smell: "Duplicate Code"
      severity: "major"
      duplicates: 15
      total_duplicated_lines: 340
      clusters:
        - files: ["UserForm.tsx", "ProfileForm.tsx", "SettingsForm.tsx"]
          similarity: 78%
          fix: "Extract shared form logic to hook"

        - files: ["userService.ts", "postService.ts", "commentService.ts"]
          similarity: 85%
          fix: "Create generic service factory"

    - smell: "Dead Code"
      severity: "minor"
      count: 23
      types:
        unreachable_code: 5
        unused_variables: 12
        unused_imports: 6
      fix: "Run ESLint auto-fix or remove manually"

    - smell: "Magic Numbers"
      severity: "minor"
      count: 34
      examples:
        - "if (retryCount > 3)"
        - "setTimeout(() => {}, 5000)"
        - "limit: 50"
      fix: "Extract to named constants"

    - smell: "Nested Callbacks"
      severity: "minor"
      count: 8
      max_depth: 5
      fix: "Use async/await or refactor to smaller functions"
```

---

### 5. Best Practices Compliance

```yaml
best_practices:
  overall_score: 74  # out of 100

  categories:
    typescript:
      score: 82
      checks:
        - rule: "Strict mode enabled"
          status: "pass"

        - rule: "No 'any' types"
          status: "fail"
          count: 12
          locations:
            - "src/lib/api.ts:34"
            - "src/utils/transform.ts:56"

        - rule: "Explicit return types"
          status: "partial"
          coverage: 78%

        - rule: "No type assertions"
          status: "partial"
          violations: 8

    react:
      score: 78
      checks:
        - rule: "No inline functions in JSX"
          status: "partial"
          violations: 15

        - rule: "Keys on list items"
          status: "pass"

        - rule: "useCallback for handlers passed to children"
          status: "partial"
          coverage: 65%

        - rule: "Error boundaries for pages"
          status: "fail"
          missing: 5

        - rule: "Suspense for lazy loading"
          status: "pass"

    security:
      score: 65
      checks:
        - rule: "No dangerouslySetInnerHTML"
          status: "fail"
          violations: 3

        - rule: "Input validation"
          status: "partial"
          coverage: 70%

        - rule: "HTTPS for API calls"
          status: "pass"

        - rule: "No hardcoded secrets"
          status: "pass"

        - rule: "Auth token handling"
          status: "pass"

    accessibility:
      score: 58
      checks:
        - rule: "Alt text on images"
          status: "partial"
          coverage: 45%

        - rule: "ARIA labels on interactive elements"
          status: "partial"
          coverage: 60%

        - rule: "Keyboard navigation"
          status: "fail"
          issues: 12

        - rule: "Color contrast"
          status: "partial"
          violations: 8
```

---

### 6. Performance Issues

```yaml
performance_issues:
  total: 18

  detected:
    - issue: "Unnecessary Re-renders"
      severity: "high"
      count: 8
      examples:
        - component: "DataTable"
          cause: "New object created in render"
          fix: "useMemo for computed values"

        - component: "UserList"
          cause: "Inline arrow functions"
          fix: "useCallback for handlers"

    - issue: "Large Bundle Imports"
      severity: "medium"
      count: 5
      examples:
        - import: "import _ from 'lodash'"
          size: "70KB"
          fix: "import { debounce } from 'lodash-es'"

        - import: "import * as Icons from 'lucide-react'"
          size: "150KB"
          fix: "Import individual icons"

    - issue: "Missing Lazy Loading"
      severity: "medium"
      count: 3
      routes:
        - "/admin/*"
        - "/reports/*"
        - "/settings/advanced"
      fix: "Use React.lazy() or Next.js dynamic imports"

    - issue: "N+1 Queries"
      severity: "high"
      locations:
        - "src/pages/api/posts/[id].ts"
        - "src/services/orderService.ts"
      fix: "Use eager loading or DataLoader pattern"

    - issue: "Unoptimized Images"
      severity: "low"
      count: 12
      fix: "Use next/image with proper sizing"
```

---

### 7. Security Assessment

```yaml
security_assessment:
  overall_score: 72  # out of 100
  critical_issues: 0
  high_issues: 2
  medium_issues: 5
  low_issues: 12

  owasp_top_10:
    - category: "A01: Broken Access Control"
      status: "pass"
      notes: "Proper auth middleware in place"

    - category: "A02: Cryptographic Failures"
      status: "pass"
      notes: "Passwords hashed with bcrypt"

    - category: "A03: Injection"
      status: "warning"
      issues:
        - "2 places with string concatenation in SQL"
        - "1 eval() usage in legacy code"

    - category: "A04: Insecure Design"
      status: "pass"

    - category: "A05: Security Misconfiguration"
      status: "warning"
      issues:
        - "CORS allows all origins in development"
        - "Debug mode enabled in some areas"

    - category: "A06: Vulnerable Components"
      status: "pass"
      notes: "No critical vulnerabilities in dependencies"

    - category: "A07: Auth Failures"
      status: "pass"
      notes: "Proper session management"

    - category: "A08: Data Integrity Failures"
      status: "pass"

    - category: "A09: Logging Failures"
      status: "warning"
      issues:
        - "Some endpoints lack audit logging"

    - category: "A10: SSRF"
      status: "pass"

  secrets_scan:
    hardcoded_secrets: 0
    .env_in_repo: false
    credentials_exposed: 0
```

---

### 8. Test Quality Analysis

```yaml
test_quality:
  coverage:
    statements: 78%
    branches: 65%
    functions: 82%
    lines: 79%

  test_health:
    total_tests: 342
    passing: 338
    failing: 2
    skipped: 2

    flaky_tests: 3
    slow_tests: 8  # > 5 seconds

  test_patterns:
    unit_tests: 245
    integration_tests: 67
    e2e_tests: 30

  uncovered_critical_paths:
    - path: "Payment processing"
      coverage: 0%
      risk: "critical"

    - path: "Auth token refresh"
      coverage: 20%
      risk: "high"

    - path: "Error recovery flows"
      coverage: 15%
      risk: "high"

  test_quality_issues:
    - issue: "Tests without assertions"
      count: 5
      severity: "major"

    - issue: "Tests with implementation details"
      count: 12
      severity: "minor"
      description: "Testing internal state instead of behavior"

    - issue: "Missing edge case tests"
      count: 34
      severity: "medium"

    - issue: "Snapshot test overuse"
      count: 25
      severity: "minor"
      recommendation: "Replace with specific assertions"
```

---

## Quality Report

```markdown
# Code Quality Report

## Project: MyApp
## Analyzed: 2024-01-15

---

## Executive Summary

| Metric | Score | Status |
|--------|-------|--------|
| Overall Quality | 72/100 | Good |
| Maintainability | 68/100 | Acceptable |
| Technical Debt | 120 hours | Attention Needed |
| Test Coverage | 78% | Good |
| Security | 72/100 | Good |

---

## Quality Scores by Module

| Module | Quality | Maintainability | Tech Debt | Tests |
|--------|---------|-----------------|-----------|-------|
| auth | 82 | 85 | 8h | 92% |
| user | 75 | 78 | 12h | 85% |
| dashboard | 58 | 55 | 35h | 65% |
| payments | 45 | 40 | 45h | 20% |

---

## Critical Issues (Fix Immediately)

1. **Security: SQL Injection Risk**
   - Location: `orderService.ts:156`
   - Fix: Use parameterized queries

2. **Security: XSS in Markdown**
   - Location: `MarkdownRenderer.tsx`
   - Fix: Sanitize HTML output

3. **Missing Payment Tests**
   - Coverage: 0%
   - Fix: Add unit and integration tests

---

## High Priority Issues

1. Reduce complexity in `orderService.ts` (CC: 18)
2. Add error boundaries to all pages (5 missing)
3. Fix auth token refresh coverage (20%)
4. Address 3 circular dependencies

---

## Recommendations

### Short-term (This Sprint)
- Fix security issues
- Add error boundaries
- Address critical code smells

### Medium-term (This Month)
- Increase payments module coverage to 80%
- Refactor dashboard module
- Update outdated dependencies

### Long-term (This Quarter)
- Reduce tech debt to <80 hours
- Achieve 85% overall coverage
- Complete accessibility audit

---

## Trend Analysis

```
Quality Score Over Time
═══════════════════════

Oct:  ████████████████████░░░░ 68
Nov:  ██████████████████████░░ 70
Dec:  ███████████████████████░ 72
Jan:  ████████████████████████ 74 (projected)
```

Quality improving at ~2 points/month. Target: 80 by Q2.
```

---

## Configuration

```yaml
# proagents.config.yaml

reverse_engineering:
  quality_assessment:
    enabled: true

    analyze:
      - complexity
      - maintainability
      - technical_debt
      - code_smells
      - best_practices
      - performance
      - security
      - test_quality

    thresholds:
      cyclomatic_complexity: 10
      cognitive_complexity: 15
      max_file_lines: 300
      min_test_coverage: 80
      min_quality_score: 70

    report:
      format: "markdown"
      include_trends: true
      include_recommendations: true
      include_severity: true

    ignore:
      paths:
        - "**/*.test.ts"
        - "**/*.spec.ts"
        - "scripts/"
      rules:
        - "max-lines"  # For certain files
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:re-quality` | Full quality assessment |
| `pa:re-quality --complexity` | Complexity analysis only |
| `pa:re-quality --debt` | Technical debt analysis |
| `pa:re-quality --smells` | Code smell detection |
| `pa:re-quality --security` | Security assessment |
| `pa:re-quality --tests` | Test quality analysis |
| `pa:re-quality --module [name]` | Analyze specific module |
| `pa:re-quality --trends` | Show quality trends |
| `pa:re-quality --report` | Generate full report |
