# Override System

Complete control over ProAgents defaults through the override system.

---

## Overview

The override system allows you to:
- Replace any ProAgents default with your own
- Extend defaults with additional rules
- Disable features you don't need
- Create project-specific configurations
- Share configurations across projects

---

## Override Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    Override Priority                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Inline Comments         (highest priority)              │
│     // @proagents-ignore rule-id                            │
│                                                             │
│  2. File-Level Config                                       │
│     /* @proagents-config {...} */                           │
│                                                             │
│  3. Directory-Level Config                                  │
│     .proagentsrc in directory                               │
│                                                             │
│  4. Project Config                                          │
│     proagents.config.yaml                                   │
│                                                             │
│  5. Extended Configs                                        │
│     extends: ["@company/standards"]                         │
│                                                             │
│  6. ProAgents Defaults      (lowest priority)               │
│     Built-in defaults                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration Structure

### Main Configuration File

```yaml
# proagents.config.yaml

# Extend other configurations
extends:
  - "@company/base-config"        # npm package
  - "./shared-standards.yaml"      # Local file
  - "https://url/to/config.yaml"   # Remote URL

# Project identification
project:
  name: "My Project"
  type: "fullstack"
  framework: "nextjs"

# Override sections
overrides:
  # Completely replace defaults
  replace:
    - "workflow.phases"
    - "standards.naming"

  # Extend defaults
  extend:
    - "rules"
    - "architecture"

  # Disable features
  disable:
    - "security.scanning"
    - "changelog.auto_generate"

# Section-specific configurations
workflow: { }
standards: { }
rules: { }
architecture: { }
git: { }
testing: { }
documentation: { }
```

---

## Override Types

### 1. Replace Override

Completely replaces ProAgents defaults with your values.

```yaml
# proagents.config.yaml

overrides:
  replace:
    - "workflow.phases"
    - "standards.naming"

# Your replacement values
workflow:
  phases:
    # Only these phases will be used
    - name: "init"
      enabled: true
    - name: "implement"
      enabled: true
    - name: "test"
      enabled: true
    - name: "deploy"
      enabled: true
    # Removed: analysis, requirements, design, review, documentation

standards:
  naming:
    # Your naming conventions replace defaults
    components: "kebab-case"      # Override PascalCase
    hooks: "snake_case"           # Override camelCase
    services: "UPPER_CASE"        # Custom
```

### 2. Extend Override

Adds to ProAgents defaults without removing them.

```yaml
# proagents.config.yaml

overrides:
  extend:
    - "rules"
    - "checkpoints"

rules:
  # These are added to default rules
  custom_rules:
    - id: "my-custom-rule"
      # ...

checkpoints:
  # Added checkpoint
  custom:
    - name: "Security Sign-off"
      after_phase: "implementation"
      required: true
```

### 3. Disable Override

Turns off specific ProAgents features.

```yaml
# proagents.config.yaml

overrides:
  disable:
    - "security.dependency_scanning"
    - "parallel_features"
    - "learning"
    - "changelog.auto_generate"

# Or disable entire sections
disabled_sections:
  - "performance_monitoring"
  - "cost_estimation"
```

### 4. Modify Override

Changes specific values within defaults.

```yaml
# proagents.config.yaml

overrides:
  modify:
    workflow.checkpoints.after_implementation: false
    testing.coverage_threshold: 60
    rules.severity.no-any-type: "warning"
```

---

## Section Overrides

### Workflow Overrides

```yaml
workflow:
  # Override phase configuration
  phases:
    analysis:
      enabled: true
      depth: "moderate"       # full | moderate | lite
      timeout: 300            # seconds

    requirements:
      enabled: false          # Skip this phase

    implementation:
      enabled: true
      checkpoints:
        before: false
        after: true

  # Override checkpoints
  checkpoints:
    all_optional: true        # No required checkpoints
    custom:
      - name: "Manager Approval"
        before_phase: "deployment"
        required: true

  # Override entry modes
  entry_modes:
    default: "bug_fix"        # Start in bug fix mode
    allow_skip_to_implementation: true
```

### Standards Overrides

```yaml
standards:
  # Override all naming conventions
  naming:
    files:
      components: "PascalCase"
      hooks: "camelCase"
      services: "camelCase"
      utils: "kebab-case"
      constants: "UPPER_SNAKE_CASE"
      types: "PascalCase"

    code:
      variables: "camelCase"
      functions: "camelCase"
      classes: "PascalCase"
      interfaces: "IPascalCase"
      types: "TPascalCase"

  # Override code style
  code_style:
    indentation: "tabs"
    indent_size: 4
    quotes: "single"
    semicolons: true
    trailing_commas: "all"
    max_line_length: 120

  # Override import style
  imports:
    order:
      - "react"
      - "external"
      - "internal"
      - "relative"
      - "styles"
    newline_between_groups: true
    sort_alphabetically: true
```

### Rules Overrides

```yaml
rules:
  # Disable default rules
  disabled:
    - "no-any-type"
    - "require-jsdoc"

  # Modify rule severity
  severity_overrides:
    no-console-log: "off"
    max-complexity: "warning"
    require-tests: "error"

  # Add custom rules
  custom:
    - id: "company-rule-1"
      # ...

  # Override rule behavior
  behavior:
    fail_on_error: true
    fail_on_warning: false
    auto_fix: true
```

### Architecture Overrides

```yaml
architecture:
  # Replace default architecture
  type: "custom"

  # Override structure
  structure:
    root: "src"
    directories:
      # Your custom structure
      ui:
        path: "ui"
        contains: ["pages", "components"]
      logic:
        path: "logic"
        contains: ["services", "hooks"]
      data:
        path: "data"
        contains: ["api", "store"]

  # Override patterns
  patterns:
    state_management: "mobx"      # Override zustand
    api_client: "fetch"           # Override axios
    styling: "emotion"            # Override tailwind
```

### Git Overrides

```yaml
git:
  # Override branch strategy
  branch:
    main: "master"                # Not "main"
    develop: "development"
    feature_prefix: "feat/"
    bugfix_prefix: "fix/"
    release_prefix: "release/"

  # Override commit conventions
  commits:
    convention: "custom"
    pattern: "[{TICKET}] {type}: {message}"
    types:
      - "feature"
      - "bugfix"
      - "hotfix"
      - "docs"

  # Override PR workflow
  pull_requests:
    template: ".github/PR_TEMPLATE.md"
    require_issue_link: true
    auto_assign_reviewers: true
```

### Testing Overrides

```yaml
testing:
  # Override coverage requirements
  coverage:
    global: 60                    # Override 80
    new_code: 80
    critical_paths: 95

  # Override test patterns
  patterns:
    unit:
      suffix: ".spec.ts"          # Override .test.ts
      location: "__tests__"       # Override adjacent
    integration:
      suffix: ".int.ts"
      location: "tests/integration"

  # Override frameworks
  frameworks:
    unit: "vitest"                # Override jest
    e2e: "playwright"             # Override cypress
```

---

## File-Level Overrides

### In Source Files

```typescript
// At the top of a file
/* @proagents-config
rules:
  no-any-type: off
  max-complexity: 20
standards:
  naming:
    variables: snake_case
*/

// File-specific rules apply only to this file
```

### Using Comments

```typescript
// Disable for next line
// @proagents-ignore no-console-log
console.log("Debug");

// Disable for block
/* @proagents-disable no-any-type */
const data: any = getData();
const result: any = process(data);
/* @proagents-enable no-any-type */

// Disable with reason (recommended)
// @proagents-ignore no-hardcoded-strings -- Will be i18n'd in TICKET-456
const message = "Hello World";

// Disable entire file
/* @proagents-disable-file */
```

---

## Directory-Level Overrides

### Using .proagentsrc

```yaml
# src/legacy/.proagentsrc

# Override rules for this directory
rules:
  no-any-type: "off"
  no-class-components: "off"
  require-tests: "warning"

# Override standards
standards:
  naming:
    files: "any"  # No naming enforcement

# Reason for overrides
reason: "Legacy code, pending migration"
```

### Using proagents.local.yaml

```yaml
# src/experimental/proagents.local.yaml

# Experimental directory has lenient rules
overrides:
  all_rules: "warning"  # Nothing blocks
  testing:
    required: false

note: "Experimental features, rules relaxed"
```

---

## Extending Configurations

### From npm Packages

```yaml
# proagents.config.yaml

extends:
  - "@company/proagents-config"     # Company-wide config
  - "@team/frontend-standards"       # Team-specific

# Your overrides applied on top
overrides:
  modify:
    rules.severity.some-rule: "error"
```

### From Files

```yaml
# proagents.config.yaml

extends:
  - "./configs/base.yaml"
  - "./configs/frontend.yaml"
  - "./configs/strict.yaml"

# Merged in order, later configs override earlier
```

### From URLs

```yaml
# proagents.config.yaml

extends:
  - "https://company.com/configs/standard.yaml"
  - "https://github.com/org/repo/config.yaml"

# Cached locally, refreshed periodically
```

### Creating Shareable Configs

```yaml
# my-company-config/index.yaml

# Base configuration for all company projects
name: "Company ProAgents Config"
version: "1.0.0"

standards:
  naming:
    # Company naming standards
    components: "PascalCase"
    hooks: "use{Name}"

rules:
  custom:
    - id: "company-logging"
      pattern: "console\\.log"
      severity: "error"
      message: "Use company logger instead"

architecture:
  type: "feature-based"
  # Company architecture standards

# Allow projects to override
overridable:
  - "testing.coverage"
  - "workflow.checkpoints"

# Lock certain settings
locked:
  - "security.rules"
  - "git.commit.sign"
```

---

## Override Validation

### Checking Override Conflicts

```bash
# Validate configuration
pa:config validate

# Output:
Configuration Validation
========================
✅ Syntax valid
✅ No conflicting overrides
⚠️  Warning: 'no-any-type' disabled - consider 'warning' instead
✅ All referenced files exist
```

### Override Report

```
┌─────────────────────────────────────────────────────────────┐
│                    Override Summary                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Configuration Sources (in priority order):                 │
│  1. proagents.config.yaml (project)                        │
│  2. @company/base-config (extended)                        │
│  3. ProAgents defaults                                      │
│                                                             │
│  Active Overrides:                                          │
│  ├── Replaced: 3 sections                                  │
│  │   └── workflow.phases, standards.naming, git.commits    │
│  ├── Extended: 2 sections                                  │
│  │   └── rules, architecture                               │
│  ├── Modified: 12 values                                   │
│  │   └── testing.coverage, rules.severity.* (5), ...       │
│  └── Disabled: 4 features                                  │
│       └── changelog, learning, cost_estimation, ...         │
│                                                             │
│  File-Level Overrides:                                      │
│  ├── src/legacy/: 15 files with .proagentsrc               │
│  └── src/generated/: disabled completely                   │
│                                                             │
│  Inline Overrides:                                          │
│  └── 23 @proagents-ignore comments across 18 files         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Common Override Patterns

### Minimal ProAgents

```yaml
# Use ProAgents with minimal features
overrides:
  replace:
    - "workflow"
  disable:
    - "parallel_features"
    - "learning"
    - "changelog"
    - "security"
    - "performance"
    - "cost"
    - "team"

workflow:
  phases:
    - implementation
    - testing
  checkpoints:
    all: false
```

### Strict Mode

```yaml
# Maximum strictness
overrides:
  modify:
    rules.fail_on_warning: true
    testing.coverage.minimum: 95
    security.block_on_any_issue: true
    workflow.require_all_phases: true

rules:
  severity_overrides:
    "*": "error"  # All rules are errors
```

### Legacy Project Mode

```yaml
# Relaxed for legacy projects
overrides:
  disable:
    - "rules.strict"
    - "architecture.enforcement"

rules:
  severity_overrides:
    "*": "warning"  # Nothing blocks

testing:
  coverage:
    required: false

workflow:
  checkpoints:
    all_optional: true
```

### New Project Mode

```yaml
# Full features for new projects
overrides:
  extend:
    - "rules.strict"
    - "security.full"
    - "testing.comprehensive"

workflow:
  phases:
    all: true
  checkpoints:
    required:
      - "after_design"
      - "after_testing"
      - "before_deployment"
```

---

## Configuration

```yaml
# proagents.config.yaml

override_system:
  enabled: true

  validation:
    on_load: true
    strict: false  # Allow unknown keys

  inheritance:
    allow_extends: true
    max_depth: 5  # Max extension chain

  file_overrides:
    allow_inline: true
    allow_directory: true

  logging:
    log_overrides: true
    log_inheritance: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:config view` | View current configuration |
| `pa:config validate` | Validate configuration |
| `pa:config overrides` | Show active overrides |
| `pa:config diff` | Compare with defaults |
| `pa:config export` | Export current config |
| `pa:config reset [section]` | Reset to defaults |
