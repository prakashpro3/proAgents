# Continuous Learning

Ongoing improvement through usage patterns, feedback, and corrections.

---

## Learning Loop

```
┌─────────────────────────────────────────────────────────────┐
│                  Continuous Learning Loop                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│       ┌─────────┐                                          │
│       │ Observe │◄─────────────────────────────┐           │
│       └────┬────┘                              │           │
│            │                                   │           │
│            ▼                                   │           │
│       ┌─────────┐                              │           │
│       │  Learn  │                              │           │
│       └────┬────┘                              │           │
│            │                                   │           │
│            ▼                                   │           │
│       ┌─────────┐                              │           │
│       │  Apply  │                              │           │
│       └────┬────┘                              │           │
│            │                                   │           │
│            ▼                                   │           │
│       ┌─────────┐                              │           │
│       │Feedback │──────────────────────────────┘           │
│       └─────────┘                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Learning Triggers

### Automatic Triggers

```yaml
learning:
  continuous:
    triggers:
      # Learn after each feature
      on_feature_complete:
        enabled: true
        learn:
          - patterns
          - corrections
          - timing

      # Learn from corrections
      on_user_correction:
        enabled: true
        weight: 2.0  # Higher weight for corrections

      # Learn from code reviews
      on_review_feedback:
        enabled: true
        weight: 1.5

      # Periodic full learning
      scheduled:
        enabled: true
        frequency: "weekly"
        day: "sunday"
        time: "02:00"
```

### Manual Triggers

```bash
# Trigger learning now
proagents learning train

# Learn from specific period
proagents learning train --since "30 days ago"

# Learn from specific feature
proagents learning train --feature user-auth

# Full retraining
proagents learning train --full
```

---

## Feedback Collection

### Implicit Feedback

Automatically captured signals:

```yaml
implicit_feedback:
  # Suggestion acceptance
  suggestion_accepted:
    signal: "positive"
    weight: 1.0

  # Suggestion rejected
  suggestion_rejected:
    signal: "negative"
    weight: 1.0

  # Suggestion modified
  suggestion_modified:
    signal: "partial"
    weight: 0.5
    capture: "modification"

  # Time to accept
  acceptance_time:
    quick: "< 5s"      # Strong positive
    normal: "5-30s"    # Neutral
    slow: "> 30s"      # Weak signal

  # Usage patterns
  usage:
    repeated_corrections: "negative"
    consistent_acceptance: "positive"
```

### Explicit Feedback

User-provided feedback:

```bash
# Rate last suggestion
proagents feedback --rating 5

# Explain correction
proagents feedback --correction "Use camelCase here, not snake_case"

# Report issue
proagents feedback --issue "Suggestion didn't follow our coding standards"
```

### Feedback UI

```
┌─────────────────────────────────────────────────────────────┐
│ How was this suggestion?                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [👍 Good]  [👎 Needs Work]  [💡 Partial]                   │
│                                                             │
│ What could be improved? (optional)                         │
│ ┌─────────────────────────────────────────────────────────┐│
│ │                                                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Submit]  [Skip]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Correction Learning

### Tracking Corrections

```json
{
  "correction_id": "corr_123",
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "naming",
  "context": {
    "file": "src/components/UserCard.tsx",
    "line": 15,
    "language": "typescript"
  },
  "original": {
    "suggestion": "user_data",
    "reasoning": "Variable naming"
  },
  "correction": {
    "value": "userData",
    "reason": "Use camelCase for variables"
  },
  "pattern_update": {
    "category": "naming.variables",
    "change": "Prefer camelCase",
    "confidence_delta": +0.05
  }
}
```

### Correction Patterns

```yaml
correction_patterns:
  # Track repeated corrections
  repeated_corrections:
    threshold: 3  # Same correction 3 times
    action: "auto_apply"
    confidence_boost: 0.2

  # Similar corrections
  similar_corrections:
    similarity_threshold: 0.8
    action: "suggest_pattern"
    notify: true

  # Conflicting corrections
  conflicting_corrections:
    action: "ask_for_clarification"
    notify: true
```

---

## Learning Metrics

### Track Improvement

```bash
proagents learning metrics

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Learning Metrics - Last 30 Days                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Suggestion Acceptance Rate:                                 │
│ ├── Week 1: 72%                                            │
│ ├── Week 2: 78%                                            │
│ ├── Week 3: 83%                                            │
│ └── Week 4: 87% ↑                                          │
│                                                             │
│ Correction Rate:                                            │
│ ├── Week 1: 28%                                            │
│ ├── Week 2: 22%                                            │
│ ├── Week 3: 17%                                            │
│ └── Week 4: 13% ↓                                          │
│                                                             │
│ Pattern Confidence Growth:                                  │
│ ├── Naming: +12%                                           │
│ ├── Components: +8%                                        │
│ ├── Testing: +15%                                          │
│ └── API Patterns: +6%                                      │
│                                                             │
│ Most Improved:                                              │
│ • Variable naming (was 65%, now 92%)                       │
│ • Test structure (was 70%, now 88%)                        │
│                                                             │
│ Needs Improvement:                                          │
│ • Error handling patterns (68%)                            │
│ • Documentation style (71%)                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Learning History

```bash
# View learning events
proagents learning history

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Learning History                                            │
├─────────────────────────────────────────────────────────────┤
│ Today:                                                      │
│ • 10:30 - Learned: camelCase for state variables           │
│ • 10:15 - Correction: Prefer useState over useRef          │
│ • 09:45 - Learned: Error boundary pattern                  │
│                                                             │
│ Yesterday:                                                  │
│ • 16:20 - Feature complete: Learned 5 new patterns         │
│ • 14:30 - Correction: API error handling style             │
│ • 11:00 - Learned: Test mock patterns                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Adaptive Behavior

### Checkpoint Adaptation

```yaml
adaptive:
  checkpoints:
    # Learn which checkpoints are typically skipped
    track_skips: true

    # After N skips, suggest disabling
    auto_suggest_disable: 5

    # Learn critical checkpoints
    track_failures_after_skip: true
```

### Verbosity Adaptation

```yaml
adaptive:
  verbosity:
    # Learn preferred detail level
    track_preferences: true

    # Adapt based on user behavior
    indicators:
      reads_full_output: "prefer_detailed"
      skips_to_code: "prefer_concise"
      asks_for_more: "increase_detail"
```

### Tool Usage Adaptation

```yaml
adaptive:
  tools:
    # Learn preferred tools
    track_tool_choices: true

    # Adapt suggestions
    examples:
      - if: "user always uses vitest"
        then: "suggest vitest for tests"
      - if: "user prefers axios"
        then: "use axios in examples"
```

---

## Learning Configuration

```yaml
# proagents.config.yaml

learning:
  continuous:
    enabled: true

    # Learning rate
    learning_rate: 0.1  # How quickly to adapt

    # Memory
    memory:
      short_term: "7d"   # Recent patterns
      long_term: "90d"   # Established patterns

    # Thresholds
    thresholds:
      min_occurrences: 3     # Before learning pattern
      min_confidence: 0.70   # Before applying pattern
      correction_weight: 2.0 # Weight of corrections

    # Limits
    limits:
      max_patterns: 1000
      max_corrections: 500
      max_feedback: 1000

    # Cleanup
    cleanup:
      remove_low_confidence: true
      threshold: 0.30
      after_days: 30
```

---

## Reset & Recovery

### Partial Reset

```bash
# Reset specific category
proagents learning reset --category naming

# Reset recent learning
proagents learning reset --since "7 days ago"

# Reset corrections only
proagents learning reset --corrections
```

### Full Reset

```bash
# Full learning reset
proagents learning reset --full

# Reset with backup
proagents learning reset --backup
```

### Restore from Backup

```bash
# List backups
proagents learning backups

# Restore specific backup
proagents learning restore --backup 2024-01-15
```

---

## Best Practices

1. **Be Consistent**: Consistent corrections lead to faster learning
2. **Provide Context**: Explain why when correcting
3. **Review Metrics**: Check learning progress weekly
4. **Prune Low Confidence**: Remove outdated patterns
5. **Back Up Regularly**: Before major changes
6. **Team Alignment**: Ensure team uses consistent corrections
