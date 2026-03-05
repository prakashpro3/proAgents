# Code Quality KPIs

Measure and track code health, maintainability, and technical debt.

---

## Prompt Template

```
Analyze code quality metrics for this codebase:

Project: {project_name}
Language: {language}
Path: {code_path}

Analyze and report on:
1. Test coverage (line, branch, function)
2. Code complexity (cyclomatic, cognitive)
3. Technical debt estimation
4. Code duplication
5. Dependency health
6. Security vulnerabilities

Compare against:
- Previous period: {previous_metrics}
- Industry standards: {benchmarks}
- Team targets: {targets}

Provide:
- Current quality score
- Trend analysis
- Critical issues
- Improvement priorities
```

---

## Key Metrics

### Test Coverage

```yaml
test_coverage:
  types:
    line_coverage: "Lines executed by tests"
    branch_coverage: "Decision branches covered"
    function_coverage: "Functions called by tests"
    statement_coverage: "Statements executed"

  targets:
    minimum: 70%
    recommended: 80%
    critical_paths: 95%

  exclusions:
    - "**/*.test.ts"
    - "**/mocks/**"
    - "**/types/**"
```

**Collection:**
```typescript
interface CoverageMetrics {
  lines: { covered: number; total: number; percentage: number };
  branches: { covered: number; total: number; percentage: number };
  functions: { covered: number; total: number; percentage: number };
  statements: { covered: number; total: number; percentage: number };
  byFile: Map<string, FileCoverage>;
  uncoveredFiles: string[];
}

async function collectCoverage(coverageFile: string): Promise<CoverageMetrics> {
  const coverage = await parseCoverageReport(coverageFile);

  return {
    lines: calculateLineCoverage(coverage),
    branches: calculateBranchCoverage(coverage),
    functions: calculateFunctionCoverage(coverage),
    statements: calculateStatementCoverage(coverage),
    byFile: mapByFile(coverage),
    uncoveredFiles: findUncoveredFiles(coverage),
  };
}
```

**Dashboard:**
```
Test Coverage Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall:    82.3% ████████░░ ✅

By Type:
Lines:      84.1% ████████░░ ✅
Branches:   76.5% ███████░░░ ⚠️
Functions:  89.2% █████████░ ✅
Statements: 83.8% ████████░░ ✅

Lowest Coverage:
- src/utils/parser.ts: 45%
- src/api/legacy.ts: 52%
- src/services/payment.ts: 61%
```

---

### Code Complexity

```yaml
complexity:
  metrics:
    cyclomatic: "Number of decision paths"
    cognitive: "Mental effort to understand"
    halstead: "Vocabulary and volume"

  thresholds:
    cyclomatic:
      low: "1-5"
      medium: "6-10"
      high: "11-20"
      very_high: ">20"

    cognitive:
      low: "1-5"
      medium: "6-15"
      high: "16-25"
      very_high: ">25"

  targets:
    average_cyclomatic: "< 10"
    max_cyclomatic: "< 20"
    average_cognitive: "< 15"
```

**Analysis:**
```typescript
interface ComplexityAnalysis {
  averageCyclomatic: number;
  maxCyclomatic: { value: number; file: string; function: string };
  averageCognitive: number;
  distribution: {
    low: number;
    medium: number;
    high: number;
    veryHigh: number;
  };
  hotspots: ComplexityHotspot[];
}

interface ComplexityHotspot {
  file: string;
  function: string;
  cyclomatic: number;
  cognitive: number;
  recommendation: string;
}
```

**Report:**
```
Complexity Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Average Cyclomatic: 7.2 ✅ (target: <10)
Average Cognitive:  12.4 ✅ (target: <15)

Distribution:
Low (1-5):      45% ████████████████░░░░
Medium (6-10):  35% ██████████████░░░░░░
High (11-20):   15% ██████░░░░░░░░░░░░░░
Very High (>20): 5% ██░░░░░░░░░░░░░░░░░░

Hotspots (needs refactoring):
1. processOrder() - CC: 28, Cog: 35
   → Split into smaller functions
2. validateInput() - CC: 22, Cog: 28
   → Extract validation rules
3. parseConfig() - CC: 19, Cog: 24
   → Use strategy pattern
```

---

### Technical Debt

```yaml
technical_debt:
  calculation:
    method: "time_to_fix"  # time_to_fix, sqale, custom

  categories:
    code_smells: 0.5  # hours per issue
    bugs: 2.0
    vulnerabilities: 4.0
    duplications: 0.25
    complexity: 1.0

  thresholds:
    ratio:
      A: "< 5%"
      B: "5-10%"
      C: "10-20%"
      D: "20-50%"
      E: "> 50%"
```

**Tracking:**
```typescript
interface TechnicalDebt {
  totalHours: number;
  totalDays: number;
  ratio: number;  // debt / development time
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  byCategory: {
    codeSmells: number;
    bugs: number;
    vulnerabilities: number;
    duplications: number;
    complexity: number;
  };
  trend: 'improving' | 'stable' | 'degrading';
  newDebt: number;
  resolvedDebt: number;
}
```

**Dashboard:**
```
Technical Debt Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Debt:    24.5 days
Debt Ratio:    8.2% (Grade: B)
Trend:         ↓ Improving (-12% this month)

By Category:
Code Smells:   12.0 days ████████████░░░░░░░░
Complexity:     6.5 days ██████░░░░░░░░░░░░░░
Duplications:   3.0 days ███░░░░░░░░░░░░░░░░░
Bugs:           2.5 days ██░░░░░░░░░░░░░░░░░░
Vulnerabilities: 0.5 days ░░░░░░░░░░░░░░░░░░░░

This Period:
New Debt Added:    3.2 days
Debt Resolved:     5.8 days
Net Change:       -2.6 days ✅
```

---

### Code Duplication

```yaml
duplication:
  thresholds:
    acceptable: "< 3%"
    concerning: "3-5%"
    problematic: "> 5%"

  detection:
    min_lines: 6
    min_tokens: 50
    ignore_imports: true
    ignore_comments: true

  exclusions:
    - "**/*.test.ts"
    - "**/generated/**"
```

**Analysis:**
```
Code Duplication Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Duplication Rate: 2.8% ✅

Top Duplicated Blocks:
1. Error handling pattern (12 occurrences)
   Files: api/*.ts
   Lines: 15-28
   → Extract to shared utility

2. Validation logic (8 occurrences)
   Files: services/*.ts
   Lines: 45-62
   → Create validation decorator

3. API response formatting (6 occurrences)
   Files: controllers/*.ts
   Lines: 10-18
   → Use response middleware
```

---

### Dependency Health

```yaml
dependencies:
  metrics:
    outdated_count: "Dependencies behind latest"
    vulnerable_count: "Dependencies with CVEs"
    unused_count: "Imported but not used"
    direct_vs_transitive: "Direct dependency ratio"

  thresholds:
    outdated_warning: 5
    outdated_critical: 15
    vulnerable_any: "critical"

  scanning:
    schedule: "daily"
    sources:
      - "npm audit"
      - "snyk"
      - "github advisories"
```

**Report:**
```
Dependency Health Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Dependencies: 145 (42 direct, 103 transitive)

Status:
Up to Date:    128 (88%)
Minor Behind:   12 (8%)
Major Behind:    5 (3%)

Security:
Vulnerabilities: 2
├─ Critical: 0
├─ High:     1 ⚠️ (lodash - prototype pollution)
├─ Medium:   1
└─ Low:      0

Recommendations:
1. npm update lodash@4.17.21 (security fix)
2. npm update react@18.2.1 (minor update)
3. npm update typescript@5.3.0 (minor update)
```

---

## Quality Score

### Composite Quality Index

```typescript
interface QualityScore {
  overall: number;  // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    coverage: { score: number; weight: 0.25 };
    complexity: { score: number; weight: 0.20 };
    duplication: { score: number; weight: 0.15 };
    technicalDebt: { score: number; weight: 0.20 };
    dependencies: { score: number; weight: 0.10 };
    security: { score: number; weight: 0.10 };
  };
  trend: 'improving' | 'stable' | 'degrading';
}

function calculateQualityScore(metrics: CodeMetrics): QualityScore {
  const breakdown = {
    coverage: { score: scoreCoverage(metrics.coverage), weight: 0.25 },
    complexity: { score: scoreComplexity(metrics.complexity), weight: 0.20 },
    duplication: { score: scoreDuplication(metrics.duplication), weight: 0.15 },
    technicalDebt: { score: scoreDebt(metrics.debt), weight: 0.20 },
    dependencies: { score: scoreDependencies(metrics.deps), weight: 0.10 },
    security: { score: scoreSecurity(metrics.vulnerabilities), weight: 0.10 },
  };

  const overall = Object.values(breakdown).reduce(
    (sum, item) => sum + item.score * item.weight,
    0
  );

  return {
    overall,
    grade: getGrade(overall),
    breakdown,
    trend: calculateTrend(metrics.history),
  };
}
```

**Dashboard:**
```
Code Quality Score
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Score: 78/100 (Grade: B)
Trend: ↑ Improving (+5 from last month)

Breakdown:
Coverage (25%):      82/100 ████████░░
Complexity (20%):    75/100 ███████░░░
Duplication (15%):   88/100 █████████░
Tech Debt (20%):     72/100 ███████░░░
Dependencies (10%):  85/100 ████████░░
Security (10%):      70/100 ███████░░░

Top Improvement Areas:
1. Reduce tech debt in legacy modules
2. Add tests to payment service
3. Simplify order processing logic
```

---

## Commands

```bash
# View quality dashboard
/metrics quality

# Detailed coverage report
/metrics coverage --detailed

# Complexity hotspots
/metrics complexity --hotspots

# Technical debt breakdown
/metrics debt --by-category

# Dependency audit
/metrics dependencies --audit

# Generate quality report
/metrics quality --report --format pdf
```

---

## Configuration

```yaml
# proagents.config.yaml
metrics:
  code_quality:
    enabled: true

    coverage:
      tool: "jest"  # jest, nyc, istanbul
      report_path: "./coverage/lcov.info"
      minimum: 80

    complexity:
      tool: "eslint"  # eslint, sonar
      max_cyclomatic: 15
      max_cognitive: 20

    duplication:
      tool: "jscpd"
      threshold: 3

    debt:
      calculation: "sonar"
      target_ratio: 5

    dependencies:
      audit_tool: "npm"
      block_on_critical: true
```
