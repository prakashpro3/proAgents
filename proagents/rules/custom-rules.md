# Custom Rules Engine

Define comprehensive custom rules to enforce project-specific standards.

---

## Overview

The custom rules engine allows you to:
- Define any validation rules for your project
- Override ProAgents defaults completely
- Create framework-specific rules
- Enforce team conventions automatically
- Block non-compliant code from merging

---

## Rule Definition Structure

### Complete Rule Schema

```yaml
# proagents/rules/custom-rules.yaml

rules:
  - id: "unique-rule-id"
    name: "Human Readable Name"
    description: "What this rule enforces"
    type: "naming | structure | pattern | security | testing | custom"

    # What to check
    pattern: "regex pattern"              # For pattern-based rules
    condition: "condition expression"     # For conditional rules

    # Where to apply
    applies_to:
      files: ["**/*.tsx", "**/*.ts"]      # Glob patterns
      directories: ["src/components"]      # Specific directories
      exclude: ["**/*.test.ts"]           # Exclusions

    # Behavior
    severity: "error | warning | info | off"
    auto_fix: true                         # Can be auto-fixed?
    fix_template: "replacement template"   # How to fix

    # Messaging
    message: "Error message to display"
    documentation: "link or detailed explanation"

    # Dependencies
    requires: ["other-rule-id"]            # Must pass first
    conflicts_with: ["conflicting-rule"]   # Cannot be used together
```

---

## Rule Categories

### 1. Naming Rules

Enforce naming conventions across your codebase.

```yaml
naming_rules:
  # Component naming
  - id: "component-pascal-case"
    name: "Component PascalCase"
    type: "naming"
    pattern: "^[A-Z][a-zA-Z0-9]*$"
    applies_to:
      files: ["**/components/**/*.tsx"]
    target: "filename"  # filename | export | variable | function
    message: "Component files must be PascalCase (e.g., UserProfile.tsx)"
    severity: "error"

  # Hook naming
  - id: "hook-use-prefix"
    name: "Hook use Prefix"
    type: "naming"
    pattern: "^use[A-Z][a-zA-Z0-9]*$"
    applies_to:
      files: ["**/hooks/**/*.ts"]
    target: "export"
    message: "Hooks must start with 'use' (e.g., useAuth, useUserData)"
    severity: "error"

  # Service naming
  - id: "service-suffix"
    name: "Service Suffix"
    type: "naming"
    pattern: ".*Service$"
    applies_to:
      files: ["**/services/**/*.ts"]
    target: "export"
    message: "Services must end with 'Service' (e.g., AuthService)"
    severity: "warning"

  # Constant naming
  - id: "constants-upper-snake"
    name: "Constants UPPER_SNAKE_CASE"
    type: "naming"
    pattern: "^[A-Z][A-Z0-9_]*$"
    context: "const declaration at module level"
    message: "Module-level constants must be UPPER_SNAKE_CASE"
    severity: "warning"

  # Type/Interface naming
  - id: "type-prefix"
    name: "Type Naming Convention"
    type: "naming"
    pattern: "^(I[A-Z]|T[A-Z]|[A-Z])"
    applies_to:
      files: ["**/*.ts", "**/*.tsx"]
    target: "type_declaration"
    message: "Types should be PascalCase, optionally prefixed with I or T"
    severity: "info"
```

### 2. Structure Rules

Enforce file organization and import patterns.

```yaml
structure_rules:
  # Prevent deep nesting
  - id: "max-directory-depth"
    name: "Maximum Directory Depth"
    type: "structure"
    rule: "directory_depth"
    max_depth: 5
    applies_to:
      directories: ["src"]
    message: "Directory nesting should not exceed 5 levels"
    severity: "warning"

  # Enforce import boundaries
  - id: "no-cross-feature-imports"
    name: "No Cross-Feature Imports"
    type: "structure"
    rule: "import_boundary"
    boundaries:
      - from: "src/features/auth"
        cannot_import_from: ["src/features/payments", "src/features/admin"]
      - from: "src/features/*"
        can_only_import_from: ["src/shared", "src/lib", "same_feature"]
    message: "Features should not import from other features directly"
    severity: "error"

  # Enforce barrel exports
  - id: "barrel-exports"
    name: "Use Barrel Exports"
    type: "structure"
    rule: "barrel_exports"
    applies_to:
      directories: ["src/components", "src/hooks"]
    require_index: true
    message: "Directories must have index.ts barrel export"
    severity: "warning"

  # Prevent circular dependencies
  - id: "no-circular-deps"
    name: "No Circular Dependencies"
    type: "structure"
    rule: "circular_dependency"
    applies_to:
      files: ["src/**/*.ts"]
    message: "Circular dependencies are not allowed"
    severity: "error"

  # Component file structure
  - id: "component-structure"
    name: "Component File Structure"
    type: "structure"
    rule: "file_structure"
    applies_to:
      directories: ["src/components/*"]
    required_files:
      - "{ComponentName}.tsx"
      - "{ComponentName}.test.tsx"
      - "index.ts"
    optional_files:
      - "{ComponentName}.module.css"
      - "{ComponentName}.types.ts"
    message: "Components must have required files"
    severity: "warning"
```

### 3. Code Pattern Rules

Detect, require, or forbid specific code patterns.

```yaml
pattern_rules:
  # Forbidden patterns
  - id: "no-console-log"
    name: "No Console.log"
    type: "pattern"
    pattern: "console\\.log\\("
    action: "forbid"
    applies_to:
      files: ["src/**/*.ts", "src/**/*.tsx"]
      exclude: ["**/*.test.ts", "**/*.spec.ts"]
    message: "Remove console.log statements before committing"
    severity: "warning"
    auto_fix: true
    fix_template: ""  # Remove the line

  - id: "no-any-type"
    name: "No Any Type"
    type: "pattern"
    pattern: ":\\s*any\\b"
    action: "forbid"
    applies_to:
      files: ["src/**/*.ts"]
      exclude: ["src/types/vendor.d.ts"]
    message: "Avoid using 'any' type. Use proper typing or 'unknown'"
    severity: "warning"

  - id: "no-hardcoded-strings"
    name: "No Hardcoded UI Strings"
    type: "pattern"
    pattern: ">['\"][^{][^'\"]+['\"]<"
    action: "forbid"
    applies_to:
      files: ["src/components/**/*.tsx"]
    message: "Use i18n for UI strings instead of hardcoding"
    severity: "warning"

  # Required patterns
  - id: "require-error-boundary"
    name: "Require Error Boundary"
    type: "pattern"
    pattern: "<ErrorBoundary>"
    action: "require"
    applies_to:
      files: ["src/pages/**/*.tsx"]
    message: "Page components must be wrapped in ErrorBoundary"
    severity: "error"

  - id: "require-memo-large-components"
    name: "Memo Large Components"
    type: "pattern"
    condition: "component_lines > 100"
    pattern: "memo\\("
    action: "require"
    message: "Large components (>100 lines) should use memo()"
    severity: "info"

  # Pattern with context
  - id: "async-error-handling"
    name: "Async Error Handling"
    type: "pattern"
    pattern: "await\\s+[^;]+;"
    requires_nearby: "try|catch|.catch"
    applies_to:
      files: ["src/**/*.ts"]
    message: "Async operations should have error handling"
    severity: "warning"
```

### 4. Security Rules

Enforce security best practices.

```yaml
security_rules:
  # Dangerous functions
  - id: "no-eval"
    name: "No Eval"
    type: "security"
    pattern: "\\beval\\s*\\("
    severity: "error"
    message: "eval() is a security risk. Use safer alternatives."
    owasp: "A03:2021-Injection"

  - id: "no-innerhtml"
    name: "No innerHTML"
    type: "security"
    pattern: "\\.innerHTML\\s*="
    severity: "error"
    message: "innerHTML can lead to XSS. Use textContent or sanitize input."
    owasp: "A03:2021-Injection"

  - id: "no-dangerously-set-html"
    name: "No dangerouslySetInnerHTML"
    type: "security"
    pattern: "dangerouslySetInnerHTML"
    severity: "warning"
    message: "dangerouslySetInnerHTML can lead to XSS. Ensure content is sanitized."
    documentation: "https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html"

  # Secrets detection
  - id: "no-hardcoded-secrets"
    name: "No Hardcoded Secrets"
    type: "security"
    patterns:
      - "api[_-]?key\\s*[:=]\\s*['\"][^'\"]+['\"]"
      - "password\\s*[:=]\\s*['\"][^'\"]+['\"]"
      - "secret\\s*[:=]\\s*['\"][^'\"]+['\"]"
      - "token\\s*[:=]\\s*['\"][^'\"]+['\"]"
    case_insensitive: true
    severity: "error"
    message: "Never hardcode secrets. Use environment variables."

  # SQL injection
  - id: "no-string-sql"
    name: "No String Concatenation in SQL"
    type: "security"
    pattern: "(query|execute)\\s*\\([^)]*\\+[^)]*\\)"
    severity: "error"
    message: "Use parameterized queries to prevent SQL injection"
    owasp: "A03:2021-Injection"

  # URL validation
  - id: "validate-urls"
    name: "Validate External URLs"
    type: "security"
    pattern: "window\\.location\\s*=|location\\.href\\s*="
    severity: "warning"
    message: "Validate URLs before redirecting to prevent open redirect vulnerabilities"
```

### 5. Testing Rules

Ensure adequate testing practices.

```yaml
testing_rules:
  # Coverage requirements
  - id: "min-coverage"
    name: "Minimum Test Coverage"
    type: "testing"
    rule: "coverage"
    thresholds:
      statements: 80
      branches: 75
      functions: 80
      lines: 80
    applies_to:
      files: ["src/**/*.ts"]
      exclude: ["src/**/*.d.ts", "src/**/*.test.ts"]
    severity: "error"
    message: "Test coverage must meet minimum thresholds"

  # Test file existence
  - id: "require-tests"
    name: "Require Test Files"
    type: "testing"
    rule: "test_existence"
    applies_to:
      files: ["src/components/**/*.tsx", "src/services/**/*.ts"]
    test_pattern: "{filename}.test.{ext}"
    message: "Each component/service must have a corresponding test file"
    severity: "warning"

  # Test structure
  - id: "test-describe-blocks"
    name: "Test Describe Blocks"
    type: "testing"
    pattern: "describe\\s*\\(['\"]"
    action: "require"
    applies_to:
      files: ["**/*.test.ts", "**/*.spec.ts"]
    message: "Tests should be organized in describe blocks"
    severity: "info"

  # Assertion requirements
  - id: "meaningful-assertions"
    name: "Meaningful Assertions"
    type: "testing"
    rule: "assertion_count"
    minimum_assertions_per_test: 1
    message: "Each test must have at least one assertion"
    severity: "error"
```

### 6. Custom Domain Rules

Create rules specific to your domain.

```yaml
custom_rules:
  # E-commerce example
  - id: "price-formatting"
    name: "Price Formatting"
    type: "custom"
    condition: "variable_name contains 'price' or 'cost' or 'amount'"
    requires_function: "formatCurrency"
    message: "Monetary values must use formatCurrency() for display"
    severity: "warning"

  # API response handling
  - id: "api-error-handling"
    name: "API Error Handling"
    type: "custom"
    pattern: "fetch\\(|axios\\."
    requires_pattern: "\\.catch\\(|try\\s*\\{|handleError"
    message: "API calls must have error handling"
    severity: "error"

  # Analytics tracking
  - id: "button-analytics"
    name: "Button Analytics Tracking"
    type: "custom"
    condition: "<Button onClick"
    requires_pattern: "track(Click|Event)|analytics\\."
    applies_to:
      files: ["src/components/**/*.tsx"]
    message: "Button clicks should be tracked for analytics"
    severity: "info"

  # Accessibility
  - id: "img-alt-text"
    name: "Image Alt Text"
    type: "custom"
    pattern: "<img\\s+(?![^>]*alt=)"
    severity: "error"
    message: "Images must have alt text for accessibility"

  - id: "form-labels"
    name: "Form Input Labels"
    type: "custom"
    pattern: "<input(?![^>]*(aria-label|aria-labelledby|id=['\"][^'\"]+['\"][^>]*<label[^>]*for))"
    severity: "error"
    message: "Form inputs must have associated labels"
```

---

## Override System

### Override Hierarchy

```
Priority (highest to lowest):
1. Inline comments (// @proagents-ignore rule-id)
2. File-level overrides
3. Directory-level overrides
4. Project configuration
5. ProAgents defaults
```

### Inline Overrides

```typescript
// Ignore next line
// @proagents-ignore no-console-log
console.log("Debugging");

// Ignore specific rule for block
/* @proagents-disable no-any-type */
const data: any = externalLibrary.getData();
/* @proagents-enable no-any-type */

// Ignore with reason (recommended)
// @proagents-ignore no-hardcoded-strings -- Legacy code, will be fixed in TICKET-123
```

### File-Level Overrides

```yaml
# At top of file: proagents.yaml
rules:
  no-console-log: "off"
  min-coverage:
    threshold: 50  # Lower for this file
```

Or in the file itself:
```typescript
/* @proagents-file-config
rules:
  no-any-type: warning
*/
```

### Directory-Level Overrides

```yaml
# proagents/rules/overrides.yaml

directory_overrides:
  - path: "src/legacy/**"
    rules:
      no-any-type: "off"
      min-coverage: "off"
      component-pascal-case: "warning"
    reason: "Legacy code, gradual migration"

  - path: "src/generated/**"
    rules:
      all: "off"
    reason: "Auto-generated code"

  - path: "src/vendor/**"
    rules:
      all: "off"
    reason: "Third-party code"

  - path: "**/*.test.ts"
    rules:
      no-console-log: "off"
      no-any-type: "warning"
```

### Project-Level Configuration

```yaml
# proagents.config.yaml

rules:
  enabled: true
  config_file: "proagents/rules/custom-rules.yaml"

  # Override default severity
  severity_overrides:
    no-any-type: "error"      # Make stricter
    no-console-log: "warning" # Make lenient

  # Completely disable rules
  disabled_rules:
    - "some-rule-id"

  # Add additional rules
  additional_rules:
    - "./team-rules.yaml"
    - "@company/shared-rules"
```

---

## Conditional Rules

### Based on File Context

```yaml
conditional_rules:
  - id: "strict-in-core"
    name: "Strict Rules in Core"
    base_rule: "no-any-type"
    conditions:
      - when:
          path_matches: "src/core/**"
        then:
          severity: "error"
      - when:
          path_matches: "src/features/**"
        then:
          severity: "warning"
      - when:
          path_matches: "src/experimental/**"
        then:
          severity: "off"
```

### Based on Git Context

```yaml
conditional_rules:
  - id: "stricter-on-main"
    conditions:
      - when:
          branch: "main"
        then:
          fail_on_warning: true
      - when:
          branch: "feature/*"
        then:
          fail_on_warning: false
```

### Based on Environment

```yaml
conditional_rules:
  - id: "ci-strictness"
    conditions:
      - when:
          environment: "ci"
        then:
          all_warnings_as_errors: true
      - when:
          environment: "local"
        then:
          all_warnings_as_errors: false
```

---

## Rule Composition

### Combining Rules

```yaml
composed_rules:
  - id: "strict-component-rules"
    name: "Strict Component Rules"
    compose:
      - component-pascal-case
      - require-error-boundary
      - component-structure
      - require-tests
    applies_to:
      directories: ["src/components"]
    severity: "error"

  - id: "lenient-utility-rules"
    name: "Lenient Utility Rules"
    compose:
      - no-any-type
      - no-console-log
    severity: "warning"
    applies_to:
      directories: ["src/utils"]
```

### Rule Groups

```yaml
rule_groups:
  security:
    description: "All security-related rules"
    rules:
      - no-eval
      - no-innerhtml
      - no-hardcoded-secrets
      - no-string-sql
    enable_all: true
    severity: "error"

  performance:
    description: "Performance optimization rules"
    rules:
      - require-memo-large-components
      - no-inline-styles
      - lazy-load-images
    enable_all: true
    severity: "warning"

  accessibility:
    description: "Accessibility rules"
    rules:
      - img-alt-text
      - form-labels
      - aria-attributes
    enable_all: true
    severity: "error"
```

---

## Custom Rule Functions

For complex validation, define custom functions:

```yaml
custom_functions:
  - id: "validate-api-response"
    name: "Validate API Response Typing"
    type: "function"
    language: "javascript"
    code: |
      function validate(fileContent, ast) {
        const apiCalls = ast.findAll('CallExpression', {
          callee: /fetch|axios/
        });

        const issues = [];
        for (const call of apiCalls) {
          if (!hasTypeAssertion(call)) {
            issues.push({
              line: call.loc.start.line,
              message: 'API response should be typed'
            });
          }
        }
        return issues;
      }
    severity: "warning"
```

---

## Integration

### Pre-commit Hook

```yaml
# .husky/pre-commit
proagents rules-check --staged-only --fail-on-error
```

### CI/CD

```yaml
# .github/workflows/rules.yml
- name: Run ProAgents Rules
  run: proagents rules-check --ci --report-format=github
```

### IDE Integration

```yaml
# .vscode/settings.json
{
  "proagents.rules.enabled": true,
  "proagents.rules.showInlineWarnings": true,
  "proagents.rules.autoFix": true
}
```

---

## Reporting

### Rule Violations Report

```
┌─────────────────────────────────────────────────────────────┐
│                    Rule Violations Report                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Total Violations: 45                                       │
│  ├── Errors: 12 (must fix)                                 │
│  ├── Warnings: 28 (should fix)                             │
│  └── Info: 5 (consider)                                    │
│                                                             │
│  By Rule:                                                   │
│  ├── no-any-type: 15                                       │
│  ├── component-pascal-case: 8                              │
│  ├── require-tests: 7                                      │
│  └── other: 15                                             │
│                                                             │
│  Files with most violations:                                │
│  ├── src/legacy/OldComponent.tsx: 12                       │
│  ├── src/utils/helpers.ts: 8                               │
│  └── src/services/api.ts: 5                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:rules-check` | Run all rule validations |
| `pa:rules-check --fix` | Auto-fix violations |
| `pa:rules-list` | List all active rules |
| `pa:rules-add` | Interactive rule creation |
| `pa:rules-disable [id]` | Disable a rule |
| `pa:rules-explain [id]` | Explain what a rule does |
| `pa:rules-report` | Generate violations report |
