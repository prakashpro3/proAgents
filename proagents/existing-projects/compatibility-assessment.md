# Compatibility Assessment

Assess your existing project's compatibility with ProAgents before adoption.

---

## Overview

The compatibility assessment:
- Analyzes your codebase non-invasively
- Identifies potential issues
- Recommends adoption strategy
- Generates configuration suggestions

---

## Running Assessment

```bash
# Full compatibility assessment
/assess-compatibility

# Quick assessment (faster, less detailed)
/assess-compatibility --quick

# Assessment with report
/assess-compatibility --report

# Assessment for specific areas
/assess-compatibility --focus patterns
/assess-compatibility --focus security
/assess-compatibility --focus testing
```

---

## Assessment Areas

### 1. Project Structure Assessment

```yaml
structure_assessment:
  checks:
    - name: "Directory organization"
      look_for:
        - "src/ or lib/ directory"
        - "tests/ or __tests__ directory"
        - "docs/ directory"
      score: "detected"

    - name: "Entry points"
      look_for:
        - "main entry (index, main, app)"
        - "API routes"
        - "Pages/views"

    - name: "Configuration files"
      look_for:
        - "package.json / requirements.txt"
        - "tsconfig.json / jsconfig.json"
        - "lint config"
        - "test config"

  output:
    structure_type: "feature-based | layer-based | mixed"
    completeness: "percentage"
    recommendations: []
```

**Sample Output:**
```
Structure Assessment
═══════════════════

Organization: Feature-based (75% confidence)
├── src/features/     ✅ Feature modules
├── src/components/   ✅ Shared components
├── src/lib/          ✅ Utilities
├── tests/            ⚠️ Partial (some features)
└── docs/             ❌ Missing

Completeness: 70%

Recommendations:
- Add tests/ structure to match src/
- Create docs/ for documentation
```

---

### 2. Code Pattern Assessment

```yaml
pattern_assessment:
  checks:
    - category: "Components"
      patterns_found:
        - name: "Functional components"
          usage: "85%"
          locations: ["src/components/*"]

        - name: "Class components"
          usage: "15%"
          locations: ["src/legacy/*"]
          status: "legacy"

    - category: "State Management"
      patterns_found:
        - name: "Redux"
          usage: "40%"
          locations: ["src/store/*"]

        - name: "Context API"
          usage: "35%"
          locations: ["src/contexts/*"]

        - name: "Zustand"
          usage: "25%"
          locations: ["src/features/*/store.ts"]
          status: "newest"

  consistency_score: 65  # Lower = more inconsistent
```

**Sample Output:**
```
Pattern Assessment
══════════════════

Pattern Consistency: 65/100 (Moderate)

Component Patterns:
├── Functional (85%) ← Primary
└── Class (15%) ← Legacy, migration recommended

State Management:
├── Redux (40%) ← Older code
├── Context (35%) ← Transition period
└── Zustand (25%) ← Newest, recommended to standardize

⚠️ Multiple patterns detected. Recommendations:
1. Designate Zustand as primary for new code
2. Create migration plan for Redux → Zustand
3. Mark class components for gradual migration
```

---

### 3. Convention Assessment

```yaml
convention_assessment:
  file_naming:
    detected_patterns:
      components: "PascalCase" # UserProfile.tsx
      hooks: "camelCase"       # useAuth.ts
      services: "mixed"        # userService.ts, api_client.ts
      utils: "kebab-case"      # format-date.ts

    consistency: 70%
    conflicts: ["services"]

  code_naming:
    detected_patterns:
      variables: "camelCase"
      constants: "mixed"  # UPPER_SNAKE and camelCase
      functions: "camelCase"
      classes: "PascalCase"

    consistency: 80%
    conflicts: ["constants"]

  import_style:
    detected:
      path_aliases: true  # @/components
      barrel_exports: "partial"
      order: "inconsistent"
```

**Sample Output:**
```
Convention Assessment
═════════════════════

File Naming: 70% consistent
├── Components: PascalCase ✅
├── Hooks: camelCase ✅
├── Services: MIXED ⚠️ (user_service.ts vs userService.ts)
└── Utils: kebab-case ✅

Code Naming: 80% consistent
├── Variables: camelCase ✅
├── Constants: MIXED ⚠️ (MAX_SIZE vs maxRetries)
└── Functions: camelCase ✅

Recommendations:
1. Standardize service naming to camelCase
2. Use UPPER_SNAKE_CASE for all constants
3. ProAgents will use your detected conventions
```

---

### 4. Testing Assessment

```yaml
testing_assessment:
  coverage:
    overall: 35%
    by_type:
      unit: 40%
      integration: 25%
      e2e: 10%

  test_framework:
    detected: "jest"
    config_found: true
    patterns:
      naming: "*.test.ts"
      location: "adjacent"  # Next to source files

  gaps:
    untested_critical:
      - "src/services/paymentService.ts"
      - "src/features/auth/authService.ts"
    untested_modules:
      - "src/features/reporting/*"

  quality:
    assertions_per_test: 2.5
    mock_usage: "moderate"
    flaky_tests: 3
```

**Sample Output:**
```
Testing Assessment
══════════════════

Overall Coverage: 35% ⚠️

Coverage Breakdown:
├── Unit Tests: 40%
├── Integration: 25%
└── E2E: 10%

Test Framework: Jest ✅
Test Pattern: *.test.ts (adjacent to source) ✅

⚠️ Critical Untested Code:
- paymentService.ts (0% coverage)
- authService.ts (15% coverage)

Recommendations:
1. ProAgents will require 80% coverage for NEW code
2. Existing code: coverage not required (tracked separately)
3. Consider adding tests for critical paths first
```

---

### 5. Dependency Assessment

```yaml
dependency_assessment:
  package_manager: "npm"

  dependencies:
    total: 145
    direct: 45
    dev: 28

  versions:
    outdated:
      - name: "react"
        current: "17.0.2"
        latest: "18.2.0"
        breaking: true

      - name: "axios"
        current: "0.21.0"
        latest: "1.6.0"
        breaking: false

    deprecated: 2
    eol: 1

  security:
    critical: 0
    high: 2
    moderate: 5

  circular_dependencies: 3
```

**Sample Output:**
```
Dependency Assessment
═════════════════════

Package Manager: npm
Dependencies: 145 total (45 direct, 28 dev)

Outdated Packages: 12
├── Major updates available: 3
├── Minor updates: 5
└── Patches: 4

⚠️ Notable Updates:
- react 17.0.2 → 18.2.0 (breaking changes)
- webpack 4.x → 5.x (breaking changes)

Security Vulnerabilities:
├── Critical: 0 ✅
├── High: 2 ⚠️
└── Moderate: 5

Circular Dependencies: 3 detected

Recommendations:
1. Fix high severity vulnerabilities
2. ProAgents will generate code compatible with your React version
3. Resolve circular dependencies gradually
```

---

### 6. Documentation Assessment

```yaml
documentation_assessment:
  readme:
    exists: true
    last_updated: "2023-06-15"
    completeness: 60%
    sections:
      installation: true
      usage: true
      api: false
      contributing: false

  code_documentation:
    jsdoc_usage: 25%
    typescript_types: 70%
    inline_comments: "sparse"

  additional_docs:
    - "docs/api.md" (outdated)
    - "docs/architecture.md" (missing)

  auto_generated:
    openapi: false
    storybook: false
    typedoc: false
```

**Sample Output:**
```
Documentation Assessment
════════════════════════

README.md: Exists (60% complete)
├── Installation ✅
├── Usage ✅
├── API Reference ❌
└── Contributing ❌

Code Documentation:
├── JSDoc: 25% ⚠️
├── TypeScript types: 70% ✅
└── Inline comments: Sparse

Missing Documentation:
- Architecture documentation
- API reference
- Component documentation

Recommendations:
1. ProAgents can generate missing docs from code
2. Consider adding JSDoc to public functions
3. Auto-generate API docs from TypeScript
```

---

### 7. Git & Workflow Assessment

```yaml
git_assessment:
  branch_strategy:
    detected: "github-flow"
    main_branch: "main"
    feature_prefix: "feature/"
    uses_develop: false

  commit_convention:
    detected: "custom"
    pattern: "[TICKET-123] Message"
    conventional_commits: false

  pr_workflow:
    required_reviews: 2
    codeowners: true
    templates: true
    required_checks: ["lint", "test", "build"]

  active_branches: 8
  stale_branches: 15
```

**Sample Output:**
```
Git & Workflow Assessment
═════════════════════════

Branch Strategy: GitHub Flow
├── Main branch: main
├── Feature prefix: feature/
└── Development branch: None (direct to main)

Commit Convention: Custom
├── Pattern: [TICKET-123] Message
└── Conventional Commits: No

⚠️ ProAgents default uses Conventional Commits
   Will adapt to your pattern: [TICKET] Message

PR Workflow:
├── Required reviews: 2 ✅
├── CODEOWNERS: Yes ✅
├── PR template: Yes ✅
└── CI checks: lint, test, build ✅

Active branches: 8
Stale branches: 15 (consider cleanup)
```

---

## Compatibility Score

```
╔════════════════════════════════════════════════════════════╗
║              COMPATIBILITY ASSESSMENT REPORT                ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Overall Compatibility Score: 72/100                       ║
║  Adoption Difficulty: MODERATE                             ║
║  Recommended Strategy: Gradual Adoption                    ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║  Category Scores                                           ║
║  ─────────────────────────────────────────────────────── ║
║  Structure       ████████░░  80/100                       ║
║  Patterns        ██████░░░░  65/100                       ║
║  Conventions     ███████░░░  75/100                       ║
║  Testing         ███░░░░░░░  35/100                       ║
║  Dependencies    ████████░░  80/100                       ║
║  Documentation   ██████░░░░  60/100                       ║
║  Git/Workflow    █████████░  90/100                       ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║  Key Issues to Address                                     ║
║  ─────────────────────────────────────────────────────── ║
║  1. Low test coverage (35%)                               ║
║  2. Inconsistent state management patterns                 ║
║  3. Missing documentation                                  ║
║                                                            ║
║  Quick Wins                                                ║
║  ─────────────────────────────────────────────────────── ║
║  1. ProAgents can auto-generate missing docs              ║
║  2. Conventions will be auto-detected                      ║
║  3. Git workflow is already compatible                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Generated Configuration

Based on assessment, ProAgents generates suggested configuration:

```yaml
# proagents.config.yaml (generated for your project)

# Project detected as: React + TypeScript web app
project:
  type: "web-frontend"
  framework: "react"
  language: "typescript"

# Adapted to your conventions
conventions:
  files:
    components: "PascalCase"  # Detected
    hooks: "camelCase"        # Detected
    services: "camelCase"     # Standardized from mixed
  code:
    variables: "camelCase"
    constants: "UPPER_SNAKE_CASE"  # Standardized

# State management
patterns:
  state_management:
    primary: "zustand"      # Newest detected
    legacy: ["redux", "context"]
    migration_mode: true

# Testing adapted to your setup
testing:
  framework: "jest"
  pattern: "*.test.ts"
  coverage:
    new_code: 80%
    existing_code: "not_required"

# Git adapted to your workflow
git:
  branch_prefix: "feature/"
  commit_convention: "custom"
  commit_pattern: "[{TICKET}] {message}"

# Gradual adoption settings
adoption:
  mode: "gradual"
  start_with: "new_features_only"
  existing_features: "grandfathered"
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:assess-compatibility` | Run full assessment |
| `pa:assess-compatibility --quick` | Quick assessment |
| `pa:assess-compatibility --report` | Generate report |
| `pa:assess-compatibility --config` | Generate config |
| `pa:assess-compatibility --focus [area]` | Focus on specific area |
