# Auto-Decision System

Eliminate AI questions during workflow execution through pre-configured decisions.

---

## The Problem

When AI asks questions during workflow:
```
AI: "Should I use REST or GraphQL for this API?"
    ↓
[FLOW BLOCKED - Waiting for user response]
    ↓
Automation broken!
```

## The Solution

Pre-configure all possible decisions so AI never needs to ask:
```
AI: Checks decision config → Uses pre-defined answer → Continues flow
    ↓
[NO INTERRUPTION]
    ↓
Automation continues!
```

---

## Automation Levels

### Level 1: Full Automation (No Interruptions)
```yaml
automation:
  level: "full"
  user_intervention: false

  behavior:
    unknown_decisions: "use_default"
    log_decisions: true
    review_after_completion: true
```
- AI makes ALL decisions using defaults
- Never asks questions
- Logs all decisions for post-review
- Best for: CI/CD pipelines, batch processing

### Level 2: Semi-Automation (Critical Only)
```yaml
automation:
  level: "semi"
  user_intervention: "critical_only"

  behavior:
    unknown_decisions: "use_default"
    pause_on:
      - "security_decisions"
      - "breaking_changes"
      - "deployment"
```
- Auto-decides routine questions
- Only pauses for critical decisions
- Best for: Daily development with safety checks

### Level 3: Guided (Checkpoints Only)
```yaml
automation:
  level: "guided"
  user_intervention: "checkpoints"

  behavior:
    auto_decide: true
    pause_at_checkpoints: true
```
- Auto-decides within phases
- Pauses at configured checkpoints
- Best for: New projects, learning the workflow

### Level 4: Manual (Ask Everything)
```yaml
automation:
  level: "manual"
  user_intervention: true
```
- Traditional mode
- AI asks for guidance
- Best for: Complex/sensitive projects

---

## Pre-Configured Decision Categories

### 1. Architecture Decisions

```yaml
decisions:
  architecture:
    # API Style
    api_style:
      default: "rest"
      options: ["rest", "graphql", "grpc", "trpc"]

    # State Management
    state_management:
      default: "zustand"
      options: ["zustand", "redux", "context", "jotai", "mobx"]

    # Styling Approach
    styling:
      default: "tailwind"
      options: ["tailwind", "css-modules", "styled-components", "scss"]

    # Database
    database:
      default: "postgresql"
      options: ["postgresql", "mysql", "mongodb", "sqlite"]

    # ORM
    orm:
      default: "prisma"
      options: ["prisma", "typeorm", "drizzle", "knex"]

    # Authentication
    auth_method:
      default: "jwt"
      options: ["jwt", "session", "oauth", "magic-link"]
```

### 2. Code Style Decisions

```yaml
decisions:
  code_style:
    # Component Style
    component_style:
      default: "functional"
      options: ["functional", "class"]

    # File Naming
    file_naming:
      components: "PascalCase"
      utilities: "camelCase"
      constants: "UPPER_SNAKE_CASE"

    # Export Style
    export_style:
      default: "named"
      options: ["named", "default", "barrel"]

    # Props Definition
    props_style:
      default: "interface"
      options: ["interface", "type"]
```

### 3. Testing Decisions

```yaml
decisions:
  testing:
    # Test Framework
    unit_framework:
      default: "vitest"
      options: ["vitest", "jest"]

    # E2E Framework
    e2e_framework:
      default: "playwright"
      options: ["playwright", "cypress"]

    # Coverage Threshold
    coverage_threshold:
      default: 80
      minimum: 60

    # Test Location
    test_location:
      default: "colocated"  # Next to source files
      options: ["colocated", "separate"]  # Or in /tests folder
```

### 4. Implementation Decisions

```yaml
decisions:
  implementation:
    # When multiple approaches exist
    approach_selection:
      default: "simplest"  # Choose simplest working solution
      options: ["simplest", "most_performant", "most_scalable"]

    # Error Handling
    error_handling:
      default: "try_catch"
      options: ["try_catch", "error_boundary", "result_type"]

    # Async Pattern
    async_pattern:
      default: "async_await"
      options: ["async_await", "promises", "callbacks"]

    # Null Handling
    null_handling:
      default: "optional_chaining"
      options: ["optional_chaining", "explicit_checks", "nullish_coalescing"]
```

### 5. Deployment Decisions

```yaml
decisions:
  deployment:
    # Environment
    target_environment:
      default: "staging"
      options: ["development", "staging", "production"]

    # Strategy
    deployment_strategy:
      default: "rolling"
      options: ["rolling", "blue_green", "canary"]

    # Auto Deploy
    auto_deploy:
      staging: true
      production: false  # Always require approval for prod
```

---

## Decision Rules Engine

Define rules for automatic decisions:

```yaml
decision_rules:
  # Rule: If creating API endpoint, use REST by default
  - condition: "creating_api_endpoint"
    decision: "api_style"
    value: "rest"
    unless: "graphql_already_used"

  # Rule: Match existing patterns in codebase
  - condition: "existing_pattern_found"
    action: "use_existing_pattern"
    priority: "high"

  # Rule: For new components, use project's component style
  - condition: "creating_component"
    decision: "component_style"
    value: "{{project.patterns.components.style}}"

  # Rule: Use TypeScript if project uses TypeScript
  - condition: "project_uses_typescript"
    decision: "language"
    value: "typescript"

  # Rule: For security-related code, add extra validation
  - condition: "security_related"
    action: "add_validation"
    requires_review: true
```

---

## Smart Defaults Based on Context

### Project Type Defaults

```yaml
# Automatically set based on /init selection
project_type_defaults:
  web-frontend:
    api_style: null  # No API
    state_management: "zustand"
    styling: "tailwind"
    testing: "vitest"

  fullstack:
    api_style: "rest"
    state_management: "react-query"
    orm: "prisma"
    auth: "next-auth"

  mobile:
    navigation: "react-navigation"
    state_management: "zustand"
    storage: "async-storage"

  backend:
    api_style: "rest"
    orm: "prisma"
    validation: "zod"
    auth: "jwt"
```

### Codebase Analysis Defaults

```yaml
# Learn from existing codebase
analysis_based_defaults:
  enabled: true

  learn_from:
    - existing_patterns
    - naming_conventions
    - file_structure
    - dependency_choices

  apply_to:
    - new_components
    - new_services
    - new_tests
```

---

## Question Bypass Strategies

### Strategy 1: Pre-Answer Common Questions

```yaml
common_questions:
  "Should I create a new component or modify existing?":
    rule: "If similar component exists with >70% match, modify. Otherwise create new."
    auto_answer: true

  "Which folder should this go in?":
    rule: "Follow existing project structure patterns."
    auto_answer: true

  "Should I add tests for this?":
    rule: "Always yes, follow testing.test_location config."
    auto_answer: true

  "What should I name this?":
    rule: "Follow naming conventions from decisions.code_style."
    auto_answer: true

  "Should I refactor this while I'm here?":
    rule: "No, stick to the requested task only."
    auto_answer: true
```

### Strategy 2: Decision Inference

```yaml
inference_rules:
  # Infer from task description
  - pattern: "add.*api.*endpoint"
    infer:
      api_style: "match_existing_or_default"
      add_validation: true
      add_tests: true

  # Infer from file location
  - pattern: "src/components/*"
    infer:
      type: "component"
      style: "project_component_style"
      test_location: "colocated"

  # Infer from similar existing code
  - pattern: "similar_code_exists"
    infer:
      follow_existing_pattern: true
```

### Strategy 3: Fallback Chain

```yaml
fallback_chain:
  # When decision needed, try in order:
  1. Check explicit config (decisions.yaml)
  2. Check project type defaults
  3. Check codebase analysis results
  4. Check inference rules
  5. Use global defaults
  6. If still unknown:
     - If automation=full: Use safest default
     - If automation=semi: Queue for review
     - If automation=guided: Pause and ask
```

---

## Decision Logging

All auto-decisions are logged for review:

```yaml
decision_log:
  enabled: true
  location: ".proagents/decisions/"

  log_format:
    timestamp: true
    decision_type: true
    rule_applied: true
    value_chosen: true
    alternatives: true
    confidence: true
```

### Sample Decision Log

```json
{
  "session": "2024-01-15-feature-auth",
  "decisions": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "question": "Which state management to use?",
      "decision": "zustand",
      "rule_applied": "project_type_defaults.web-frontend.state_management",
      "confidence": "high",
      "alternatives": ["redux", "context", "jotai"]
    },
    {
      "timestamp": "2024-01-15T10:32:00Z",
      "question": "Where to place AuthService?",
      "decision": "src/services/authService.ts",
      "rule_applied": "codebase_analysis.existing_pattern",
      "confidence": "high",
      "alternatives": []
    },
    {
      "timestamp": "2024-01-15T10:35:00Z",
      "question": "Add error boundary?",
      "decision": "yes",
      "rule_applied": "common_questions.error_handling",
      "confidence": "medium",
      "alternatives": ["no", "custom_error_handler"]
    }
  ],
  "summary": {
    "total_decisions": 15,
    "auto_resolved": 15,
    "user_intervention": 0,
    "confidence_breakdown": {
      "high": 12,
      "medium": 3,
      "low": 0
    }
  }
}
```

---

## Post-Execution Review

After automated workflow completes:

```
┌─────────────────────────────────────────────────────────┐
│ Workflow Complete - Decision Review                     │
├─────────────────────────────────────────────────────────┤
│ Feature: user-authentication                            │
│ Duration: 45 minutes                                    │
│ Automation Level: Full                                  │
├─────────────────────────────────────────────────────────┤
│ Decisions Made: 23                                      │
│ ├── High Confidence: 18                                │
│ ├── Medium Confidence: 4                               │
│ └── Low Confidence: 1 ⚠️                               │
├─────────────────────────────────────────────────────────┤
│ Low Confidence Decision:                                │
│ • Used REST for user-preferences endpoint              │
│   Reason: No clear pattern, used default               │
│   Action: Review if GraphQL would be better            │
├─────────────────────────────────────────────────────────┤
│ [View Full Log] [Approve All] [Review Flagged]         │
└─────────────────────────────────────────────────────────┘
```

---

## Configuration Example

### Full Automation Config

```yaml
# proagents.config.yaml

automation:
  level: "full"
  user_intervention: false

  # Pre-configured decisions
  decisions:
    architecture:
      api_style: "rest"
      state_management: "zustand"
      styling: "tailwind"
      database: "postgresql"
      orm: "prisma"

    code_style:
      component_style: "functional"
      export_style: "named"

    testing:
      framework: "vitest"
      coverage: 80

    implementation:
      approach: "simplest"
      error_handling: "try_catch"

  # Behavior
  behavior:
    unknown_decisions: "use_safest_default"
    log_all_decisions: true
    review_after_completion: true

  # Safety
  safety:
    pause_on_security: false  # Set true for extra safety
    pause_on_breaking: false
    pause_on_deployment: false
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:auto-config` | Configure automation settings |
| `pa:auto-level [level]` | Set automation level |
| `pa:decisions` | View/edit pre-configured decisions |
| `pa:decision-log` | View decision log |
| `pa:review-decisions` | Review flagged decisions |
