# User Preferences Learning

Track and learn individual user preferences for personalized AI assistance.

---

## Preference Categories

### Communication Style

```yaml
user_preferences:
  communication:
    # Detail level
    verbosity:
      learned: "concise"  # concise, balanced, detailed
      confidence: 0.89

    # Explanation style
    explanations:
      prefer_examples: true
      prefer_analogies: false
      code_first: true

    # Response format
    format:
      prefer_markdown: true
      prefer_code_blocks: true
      prefer_bullet_points: true
```

### Coding Preferences

```yaml
user_preferences:
  coding:
    # Language preferences
    languages:
      primary: "typescript"
      frameworks: ["react", "nextjs"]

    # Style preferences
    style:
      prefer_functional: true
      prefer_immutable: true
      prefer_explicit_types: true

    # Patterns
    patterns:
      prefer_hooks: true
      prefer_composition: true
      avoid_class_components: true
```

### Workflow Preferences

```yaml
user_preferences:
  workflow:
    # Checkpoints
    checkpoints:
      usually_skips: ["after_requirements"]
      always_reviews: ["after_design", "before_deployment"]

    # Approvals
    approvals:
      prefers_quick_approval: false
      detail_level: "high"

    # Output
    output:
      prefers_file_output: false
      prefers_inline_code: true
```

---

## Learning Process

### Implicit Learning

```yaml
preference_learning:
  implicit:
    # Learn from behavior
    signals:
      # Verbosity preference
      - signal: "user_scrolls_past_explanation"
        learn: "prefers_concise"
        weight: 0.3

      - signal: "user_asks_for_more_detail"
        learn: "prefers_detailed"
        weight: 0.5

      # Code style
      - signal: "user_modifies_to_functional"
        learn: "prefers_functional"
        weight: 0.7

      # Format preference
      - signal: "user_copies_code_block"
        learn: "prefers_code_blocks"
        weight: 0.2
```

### Explicit Learning

```bash
# Set preference explicitly
proagents preferences set verbosity concise

# Answer preference questions
proagents preferences setup

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Preference Setup                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ How detailed should explanations be?                       │
│ [1] Concise - Just the essentials                          │
│ [2] Balanced - Key details with context                    │
│ [3] Detailed - Full explanations                           │
│                                                             │
│ > 1                                                         │
│                                                             │
│ Do you prefer code examples over written explanations?     │
│ [Y/N] > Y                                                   │
│                                                             │
│ ✓ Preferences saved                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Preference Storage

### Storage Location

```
.proagents/user-preferences/
├── preferences.json       # Main preferences
├── history.json          # Preference change history
└── learning.json         # Learning signals
```

### Preference File

```json
{
  "user_id": "user_abc123",
  "preferences": {
    "communication": {
      "verbosity": {
        "value": "concise",
        "source": "explicit",
        "confidence": 1.0,
        "set_at": "2024-01-15T10:00:00Z"
      },
      "code_first": {
        "value": true,
        "source": "learned",
        "confidence": 0.85,
        "learned_at": "2024-01-10T15:30:00Z"
      }
    },
    "coding": {
      "prefer_functional": {
        "value": true,
        "source": "learned",
        "confidence": 0.92
      }
    }
  },
  "last_updated": "2024-01-15T10:30:00Z"
}
```

---

## Applying Preferences

### Automatic Application

```yaml
preference_learning:
  application:
    # Confidence threshold
    apply_when_confidence: 0.70

    # Override user's explicit settings?
    learned_overrides_explicit: false

    # Per-category application
    categories:
      communication:
        auto_apply: true
      coding:
        auto_apply: true
        confirm_first: false
      workflow:
        auto_apply: true
```

### Example Application

```
Without Preferences:
AI: "Here's a detailed explanation of how React hooks work..."
    [500 words of explanation]
    [code example]

With Learned Preferences (concise, code_first):
AI: "Here's how to use the hook:"
    [code example]
    "Key points: [brief bullet points]"
```

---

## Preference Commands

```bash
# View current preferences
proagents preferences show

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Your Preferences                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Communication:                                              │
│ ├── Verbosity: Concise (explicit)                          │
│ ├── Code first: Yes (learned, 85%)                         │
│ └── Format: Markdown with code blocks                      │
│                                                             │
│ Coding:                                                     │
│ ├── Style: Functional (learned, 92%)                       │
│ ├── Types: Explicit TypeScript                             │
│ └── Patterns: Hooks, composition                           │
│                                                             │
│ Workflow:                                                   │
│ ├── Skip checkpoints: after_requirements                   │
│ └── Always review: design, deployment                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

# Reset preferences
proagents preferences reset

# Reset specific category
proagents preferences reset --category coding

# Export preferences
proagents preferences export > my-preferences.json

# Import preferences
proagents preferences import my-preferences.json
```

---

## Team Preferences

### Shared Defaults

```yaml
# Team-level preferences
team_preferences:
  defaults:
    verbosity: "balanced"
    code_style: "functional"

  # Allow individual override
  allow_override: true

  # Share learning across team
  share_learning: false
```

### New User Defaults

```yaml
preference_learning:
  new_users:
    # Start with team defaults
    use_team_defaults: true

    # Or start fresh
    start_fresh: false

    # Prompt for initial setup
    prompt_setup: true
```

---

## Privacy

### Privacy Settings

```yaml
preference_learning:
  privacy:
    # What to store
    store:
      explicit_preferences: true
      learned_preferences: true
      learning_signals: false  # Don't store raw signals

    # Anonymization
    anonymize: true

    # Retention
    retention: "1y"

    # Export/delete
    allow_export: true
    allow_delete: true
```

### Delete Preferences

```bash
# Delete all preferences
proagents preferences delete --all

# Delete specific category
proagents preferences delete --category communication

# GDPR export
proagents preferences export --gdpr
```

---

## Best Practices

1. **Start Explicit**: Set key preferences explicitly
2. **Let It Learn**: Allow learning for fine-tuning
3. **Review Periodically**: Check learned preferences
4. **Reset If Wrong**: Reset if preferences drift
5. **Team Alignment**: Consider team defaults
6. **Privacy First**: Review privacy settings
