# Learning Data Collection

What data ProAgents collects to improve over time.

---

## Overview

ProAgents learns from your development patterns to provide better suggestions and reduce friction over time.

---

## Data Categories

### 1. User Preferences

**What's Collected:**
```yaml
preferences:
  # Checkpoint preferences
  checkpoints:
    usually_skips: ["after_requirements", "after_testing"]
    always_reviews: ["after_design", "before_deployment"]
    skip_rate_by_phase:
      analysis: 0.2
      requirements: 0.8
      design: 0.1

  # Detail level
  output_preferences:
    verbosity: "moderate"  # concise | moderate | detailed
    code_comments: "minimal"
    documentation_depth: "moderate"

  # Review patterns
  review_behavior:
    average_review_time: "5min"
    usually_accepts_first_suggestion: true
    common_modifications: ["naming", "structure"]
```

**How It's Used:**
- Skip unnecessary checkpoints automatically
- Adjust output verbosity
- Pre-modify suggestions based on patterns

---

### 2. Correction History

**What's Collected:**
```yaml
corrections:
  - id: "corr_001"
    timestamp: "2024-01-15T10:30:00Z"
    original_suggestion: "Use Redux for state management"
    user_correction: "Use Zustand instead"
    context: "new_feature"
    frequency: 3  # How many times this correction happened

  - id: "corr_002"
    timestamp: "2024-01-16T14:00:00Z"
    original_suggestion: "Create class component"
    user_correction: "Use functional component"
    context: "component_creation"
    frequency: 5
```

**How It's Used:**
- After 3 similar corrections → Auto-apply
- Prevent repeated mistakes
- Learn user's preferred approaches

---

### 3. Project Patterns

**What's Collected:**
```yaml
project_patterns:
  # File structure
  structure:
    components_location: "src/components/"
    services_location: "src/services/"
    hooks_location: "src/hooks/"
    pattern_confidence: 0.95

  # Naming conventions
  naming:
    components: "PascalCase"
    hooks: "useCamelCase"
    services: "camelCaseService"
    files:
      components: "PascalCase.tsx"
      utilities: "camelCase.ts"
    pattern_confidence: 0.92

  # Code patterns
  code_style:
    component_style: "functional"
    state_management: "zustand"
    data_fetching: "react-query"
    styling: "tailwind"
    pattern_confidence: 0.98

  # Import patterns
  imports:
    style: "named"
    order: ["react", "third-party", "local", "styles"]
    use_aliases: true
    alias_prefix: "@/"
```

**How It's Used:**
- Generate code matching existing patterns
- Place files in correct locations
- Follow established conventions

---

### 4. Decision History

**What's Collected:**
```yaml
decisions:
  - decision_id: "dec_001"
    type: "architecture"
    question: "API style selection"
    chosen: "rest"
    alternatives: ["graphql", "grpc"]
    context: "user_service"
    outcome: "successful"  # successful | needed_revision | failed

  - decision_id: "dec_002"
    type: "implementation"
    question: "Error handling approach"
    chosen: "error-boundary"
    alternatives: ["try-catch", "result-type"]
    context: "component"
    outcome: "successful"
```

**How It's Used:**
- Recommend previously successful decisions
- Avoid approaches that needed revision
- Build decision confidence scores

---

### 5. Time Metrics

**What's Collected:**
```yaml
time_metrics:
  # Phase durations
  phases:
    analysis:
      average: "15min"
      min: "5min"
      max: "45min"
    implementation:
      average: "2hrs"
      min: "30min"
      max: "8hrs"

  # Feature completion
  features:
    average_completion: "4hrs"
    by_complexity:
      simple: "1hr"
      medium: "3hrs"
      complex: "8hrs"

  # Review times
  review:
    average_checkpoint_review: "5min"
    pr_review_time: "30min"
```

**How It's Used:**
- Better task estimation
- Identify bottleneck phases
- Optimize workflow suggestions

---

### 6. Error Patterns

**What's Collected:**
```yaml
errors:
  # Common errors
  - pattern: "import_path_error"
    frequency: 12
    usual_cause: "wrong_alias"
    usual_fix: "use @/ prefix"

  - pattern: "type_mismatch"
    frequency: 8
    usual_cause: "optional_property"
    usual_fix: "add undefined check"

  # Build failures
  build_failures:
    - type: "typescript_error"
      frequency: 5
      common_fixes: ["add_types", "fix_imports"]

    - type: "test_failure"
      frequency: 3
      common_fixes: ["update_mocks", "fix_assertions"]
```

**How It's Used:**
- Proactively prevent common errors
- Suggest fixes based on history
- Improve code generation accuracy

---

## Storage Structure

```
.proagents/learning/
├── global/                      # Cross-project learnings
│   ├── user-preferences.json
│   └── common-corrections.json
│
└── projects/
    └── [project-hash]/
        ├── patterns.json        # Project-specific patterns
        ├── decisions.json       # Decision history
        ├── corrections.json     # Corrections in this project
        ├── metrics.json         # Time and performance metrics
        └── errors.json          # Error patterns
```

---

## Privacy & Data Control

### What's NOT Collected
- Source code content
- Credentials or secrets
- Personal identifiable information
- Third-party API keys

### Data Stays Local
```yaml
privacy:
  data_location: "local"  # All data stays on your machine
  share_anonymized: false  # No cloud sharing by default
  retention: "project_lifetime"
```

### User Controls
```yaml
learning:
  # Enable/disable specific tracking
  track_preferences: true
  track_patterns: true
  track_corrections: true
  track_metrics: true
  track_errors: true

  # Reset options
  reset_commands:
    - "/learning-reset all"      # Reset everything
    - "/learning-reset project"  # Reset current project
    - "/learning-reset patterns" # Reset patterns only
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/learning-status` | Show learning statistics |
| `/learning-patterns` | View learned patterns |
| `/learning-corrections` | View correction history |
| `/learning-reset` | Reset learning data |
| `/learning-export` | Export learning data |
