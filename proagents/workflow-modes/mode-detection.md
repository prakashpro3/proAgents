# Mode Detection

Automatic detection of the appropriate workflow mode based on user input.

---

## Overview

ProAgents analyzes user requests to suggest the most appropriate workflow mode:

```
User Input → Analysis → Mode Suggestion → User Confirmation
```

---

## Detection Logic

### Input Analysis

```yaml
detection_process:
  step_1_keyword_analysis:
    bug_fix_keywords:
      - "fix"
      - "bug"
      - "broken"
      - "not working"
      - "issue"
      - "error"
      - "crash"
      - "failing"

    quick_change_keywords:
      - "update"
      - "change"
      - "config"
      - "url"
      - "typo"
      - "text"
      - "rename"

    full_workflow_keywords:
      - "add"
      - "implement"
      - "create"
      - "build"
      - "feature"
      - "refactor"
      - "redesign"

  step_2_complexity_analysis:
    simple:
      - "single file change"
      - "configuration only"
      - "text change"

    moderate:
      - "specific bug fix"
      - "isolated change"
      - "clear scope"

    complex:
      - "new functionality"
      - "multiple components"
      - "architectural impact"

  step_3_impact_analysis:
    low_impact:
      - "documentation"
      - "styling"
      - "config"

    medium_impact:
      - "business logic"
      - "UI components"
      - "api calls"

    high_impact:
      - "authentication"
      - "payment"
      - "database"
      - "security"
```

---

## Detection Examples

### Bug Fix Detection

```
User: "The login button doesn't work on mobile devices"

Analysis:
├── Keywords: "doesn't work" → bug indicator
├── Scope: Single component (login button)
├── Impact: Medium (auth-related but UI only)
└── Confidence: 92%

Suggestion: Bug Fix Mode
```

### Quick Change Detection

```
User: "Update the API URL from staging to production"

Analysis:
├── Keywords: "update", "URL" → config change
├── Scope: Configuration file
├── Impact: Low (config only)
└── Confidence: 95%

Suggestion: Quick Change Mode
```

### Full Workflow Detection

```
User: "Add user profile management with avatar upload"

Analysis:
├── Keywords: "add", "feature" → new functionality
├── Scope: Multiple components, storage, API
├── Impact: High (new feature)
└── Confidence: 98%

Suggestion: Full Workflow Mode
```

---

## Detection Patterns

### Pattern Matching Rules

```yaml
detection_patterns:
  # Bug Fix patterns
  bug_fix:
    - pattern: "(fix|resolve|repair) .+ (bug|issue|error)"
      confidence: 0.95

    - pattern: ".+ (not working|broken|failing)"
      confidence: 0.90

    - pattern: "(crash|error|exception) .+"
      confidence: 0.85

    - pattern: "why (is|does) .+ (not|fail)"
      confidence: 0.80

  # Quick Change patterns
  quick_change:
    - pattern: "(update|change|modify) .+ (config|url|endpoint)"
      confidence: 0.95

    - pattern: "fix typo in .+"
      confidence: 0.95

    - pattern: "(rename|replace) .+ to .+"
      confidence: 0.85
      condition: "single_file"

    - pattern: "change .+ text"
      confidence: 0.90

  # Full Workflow patterns
  full_workflow:
    - pattern: "(add|implement|create|build) .+ (feature|functionality)"
      confidence: 0.95

    - pattern: "(refactor|redesign|rewrite) .+"
      confidence: 0.90

    - pattern: "integrate .+ with .+"
      confidence: 0.85

    - pattern: "(new|complete) .+ system"
      confidence: 0.95
```

---

## AI-Assisted Detection

When pattern matching isn't conclusive, AI analysis is used:

```yaml
ai_detection:
  enabled: true
  use_when: "confidence < 0.8"

  analysis_prompt: |
    Analyze this development request and determine the appropriate
    workflow mode:

    Request: "{user_request}"

    Modes:
    1. Full Workflow - For new features, major changes
    2. Bug Fix - For fixing issues, errors
    3. Quick Change - For config updates, typos

    Consider:
    - Scope of change
    - Complexity
    - Risk level
    - Number of files likely affected

    Respond with: mode, confidence, reasoning
```

---

## Context-Aware Detection

### File Context

```yaml
file_context_hints:
  # If user mentions specific files
  config_files:
    patterns: ["*.config.*", "*.env*", "config/*"]
    suggests: "quick_change"
    confidence_boost: 0.15

  test_files:
    patterns: ["*.test.*", "*.spec.*", "__tests__/*"]
    suggests: "bug_fix"
    confidence_boost: 0.10

  component_files:
    patterns: ["*/components/*", "*.tsx"]
    suggests: "varies"
    check_keywords: true
```

### Git Context

```yaml
git_context_hints:
  # Current branch type
  branch_hints:
    - pattern: "fix/*"
      suggests: "bug_fix"

    - pattern: "hotfix/*"
      suggests: "quick_change"

    - pattern: "feature/*"
      suggests: "full_workflow"

  # Recent activity
  recent_commits:
    check_for: "related changes"
    suggests: "resume if found"
```

### Project Context

```yaml
project_context:
  # Area being modified
  critical_paths:
    - "src/auth/**"
    - "src/payment/**"
    - "src/security/**"
    action: "require_full_workflow_or_careful_review"

  # Low risk areas
  safe_paths:
    - "docs/**"
    - "README.md"
    - "*.config.js"
    action: "allow_quick_change"
```

---

## User Confirmation

After detection, confirm with user:

```
┌─────────────────────────────────────────────────────────────┐
│ Mode Detection                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Request: "Fix the login button not responding"              │
│                                                             │
│ Detected Mode: Bug Fix (Fast Track)                        │
│ Confidence: 92%                                             │
│                                                             │
│ Reasoning:                                                  │
│ • Contains "fix" keyword                                   │
│ • Describes specific issue                                  │
│ • Scope appears limited                                     │
│                                                             │
│ [Start Bug Fix] [Use Full Workflow] [Quick Change]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Override Detection

Users can always override:

```bash
# Force full workflow
pa:feature start "Fix login button" --mode full

# Force bug fix mode
pa:fix "Add new validation" --mode bug-fix

# Skip detection
pa:quick "Update config" --no-detect
```

---

## Configuration

```yaml
# proagents.config.yaml

mode_detection:
  enabled: true
  confidence_threshold: 0.75

  # When to ask user
  ask_user:
    when_confidence_below: 0.80
    always_for: ["critical_paths"]
    never_for: ["quick_changes"]

  # AI assistance
  ai_assist:
    enabled: true
    model: "fast"  # Use fast model for detection

  # Learning
  learn_from_choices: true
  adapt_to_user: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:detect [request]` | Test mode detection |
| `pa:mode suggest` | Get mode suggestion for current context |
| `pa:mode override [mode]` | Override detected mode |
