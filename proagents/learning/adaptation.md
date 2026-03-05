# Learning Adaptation

How ProAgents applies learned patterns to improve over time.

---

## Adaptation Types

### 1. Automatic Corrections

When the same correction is made 3+ times, apply automatically:

```yaml
auto_corrections:
  threshold: 3  # Apply after 3 similar corrections

  example:
    pattern: "AI suggests Redux"
    correction: "User chooses Zustand"
    occurrences: 5
    status: "auto_applied"
    action: "Now suggests Zustand by default"
```

**Adaptation Flow:**
```
Correction 1: "Use Zustand, not Redux" → Noted
Correction 2: "Use Zustand, not Redux" → Noted
Correction 3: "Use Zustand, not Redux" → AUTO-APPLY ENABLED
Future: AI automatically uses Zustand
```

---

### 2. Checkpoint Optimization

Learn which checkpoints user actually reviews:

```yaml
checkpoint_adaptation:
  # If user skips checkpoint >80% of time
  high_skip_rate:
    action: "suggest_disable"
    threshold: 0.8

  # If user always reviews carefully
  careful_review:
    action: "keep_enabled"
    indicators:
      - "review_time > 2min"
      - "makes_changes"

  current_optimization:
    after_requirements: "suggest_skip"  # 90% skip rate
    after_design: "keep"                # Always reviewed
    after_testing: "suggest_skip"       # 85% skip rate
    before_deployment: "keep"           # Always reviewed
```

---

### 3. Pattern Following

Automatically follow established codebase patterns:

```yaml
pattern_adaptation:
  # Component creation
  when: "creating_component"
  learned:
    location: "src/components/{category}/"
    structure: "folder-per-component"
    includes:
      - "{Name}.tsx"
      - "{Name}.test.tsx"
      - "index.ts"
    style: "functional with memo"
    props: "interface above component"

  # Service creation
  when: "creating_service"
  learned:
    location: "src/services/"
    naming: "{name}Service.ts"
    pattern: "object with methods"
    includes_types: true
```

---

### 4. Output Calibration

Adjust output based on user preferences:

```yaml
output_adaptation:
  verbosity:
    learned: "moderate"
    indicators:
      - "user rarely reads long explanations"
      - "prefers bullet points"
      - "wants code more than prose"

  code_style:
    learned:
      comments: "minimal"
      type_annotations: "comprehensive"
      error_handling: "always_include"

  communication:
    learned:
      announce_decisions: true
      explain_reasoning: "brief"
      suggest_alternatives: false
```

---

### 5. Decision Prediction

Predict decisions based on history:

```yaml
decision_prediction:
  # High confidence predictions
  high_confidence:
    - decision: "state_management"
      prediction: "zustand"
      confidence: 0.95
      basis: "100% historical choice"

    - decision: "styling"
      prediction: "tailwind"
      confidence: 0.92
      basis: "used in all features"

  # Medium confidence
  medium_confidence:
    - decision: "error_handling"
      prediction: "error_boundary"
      confidence: 0.70
      basis: "used in 70% of components"

  # Apply predictions
  application:
    high_confidence: "auto_apply"
    medium_confidence: "suggest_with_note"
    low_confidence: "present_options"
```

---

## Adaptation Rules

### Rule 1: Conservative Learning

```yaml
conservative_learning:
  # Don't learn from one-off decisions
  minimum_occurrences: 3

  # Decay old patterns
  pattern_decay:
    after_days: 90
    reduce_confidence_by: 0.1

  # Allow override
  user_can_override: true
```

### Rule 2: Context-Aware Application

```yaml
context_awareness:
  # Different contexts may have different patterns
  contexts:
    - context: "component"
      patterns: [...]
    - context: "service"
      patterns: [...]
    - context: "api"
      patterns: [...]

  # Match context before applying
  matching:
    use_file_location: true
    use_task_description: true
    use_existing_imports: true
```

### Rule 3: Reversible Adaptations

```yaml
reversibility:
  # All adaptations can be undone
  undo_commands:
    - "/learning-undo last"
    - "/learning-undo [adaptation-id]"
    - "/learning-disable [pattern]"

  # Reset to defaults
  reset:
    - "/learning-reset"
    - "Clears all learned patterns"
    - "Returns to default behavior"
```

---

## Adaptation Feedback Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                    Learning Feedback Loop                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User Action → Collect Data → Analyze Pattern → Apply Learning │
│        ↑                                              │         │
│        │                                              ↓         │
│        └──────────── Verify Outcome ←─────────────────┘         │
│                                                                 │
│   If outcome = positive → Reinforce pattern                    │
│   If outcome = negative → Reduce confidence                    │
│   If outcome = correction → Learn new pattern                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Adaptation Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ Learning Adaptations - Active                                   │
├─────────────────────────────────────────────────────────────────┤
│ Auto-Applied Corrections: 12                                    │
│ ├── State management: Zustand (5 corrections learned)          │
│ ├── Component style: Functional (3 corrections learned)        │
│ └── File naming: kebab-case (4 corrections learned)            │
├─────────────────────────────────────────────────────────────────┤
│ Checkpoint Optimizations:                                       │
│ ├── after_requirements: Suggested skip (90% skip rate)         │
│ └── after_design: Keep (always reviewed)                       │
├─────────────────────────────────────────────────────────────────┤
│ Pattern Following: 45 patterns learned                          │
│ ├── Component patterns: 15                                     │
│ ├── Service patterns: 10                                       │
│ ├── Test patterns: 12                                          │
│ └── Import patterns: 8                                         │
├─────────────────────────────────────────────────────────────────┤
│ Decision Predictions:                                           │
│ ├── High confidence: 8                                         │
│ ├── Medium confidence: 5                                       │
│ └── Learning: 3                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuration

```yaml
# proagents.config.yaml

learning:
  adaptation:
    # Enable auto-corrections
    auto_corrections:
      enabled: true
      threshold: 3

    # Checkpoint optimization
    checkpoint_optimization:
      enabled: true
      suggest_disable_threshold: 0.8

    # Pattern following
    pattern_following:
      enabled: true
      min_confidence: 0.7

    # Decision prediction
    decision_prediction:
      enabled: true
      auto_apply_threshold: 0.9

    # Safety
    safety:
      require_confirmation_for_new: false
      allow_override: true
      max_auto_corrections_per_session: 10
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/adaptation-status` | View current adaptations |
| `/adaptation-disable [id]` | Disable specific adaptation |
| `/adaptation-enable [id]` | Re-enable adaptation |
| `/adaptation-reset` | Reset all adaptations |
| `/adaptation-review` | Review pending adaptations |
