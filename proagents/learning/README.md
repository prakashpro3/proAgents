# ProAgents Self-Learning System

ProAgents learns from your usage and adapts to your project and preferences over time.

## How It Works

### 1. What Gets Learned

**User Preferences:**
- Which checkpoints you usually skip
- Which ones you always review
- Your preferred detail level
- Common corrections you make

**Project Patterns:**
- Code conventions (naming, formatting)
- Architecture patterns
- State management approach
- API patterns
- Testing patterns

**Feature History:**
- Completed features and their outcomes
- Issues encountered and resolutions
- Time spent on each phase

### 2. Learning Storage

```
/proagents/.learning/
├── global/                    # Cross-project learnings
│   └── user-preferences.json
└── projects/                  # Per-project learnings
    └── [project-hash]/
        ├── patterns.json
        ├── corrections.json
        └── metrics.json
```

### 3. How Learnings Are Applied

**Automatic Behavior:**
- Skip checkpoints you usually skip
- Apply corrections you've made 3+ times
- Follow code patterns from existing codebase
- Use preferred naming conventions

**Example:**

*Before learning:*
```
AI: "What state management should we use?"
User: "Use Zustand"
```

*After learning:*
```
AI: "I see this project uses Zustand for state management.
     I'll follow that pattern."
```

## Configuration

```yaml
# proagents.config.yaml
learning:
  enabled: true
  track_preferences: true
  track_patterns: true
  track_corrections: true
  auto_apply_corrections: true
  auto_adjust_checkpoints: true
```

## Feedback Collection

### Implicit Feedback
- Modifications to AI output
- Skipped phases/checkpoints
- Time spent reviewing

### Explicit Feedback
At end of each feature:
```
"How was this workflow?"
[Good] [Needs improvement] [Suggestions]
```

## Privacy

- All learning data is stored locally
- Nothing is sent to external servers
- You can delete learning data at any time:
  ```
  rm -rf /proagents/.learning/
  ```

## Resetting Learnings

```bash
# Reset all learnings
proagents learning reset

# Reset specific category
proagents learning reset --preferences
proagents learning reset --patterns
```

## Learning Reports

View what's been learned:

```bash
proagents learning report
```

Output:
```
ProAgents Learning Report
=========================
Patterns Learned: 45
Auto-corrections: 23
Checkpoints optimized: 12

Top Patterns:
- Component naming: PascalCase
- State management: Zustand
- API calls: React Query
```

## Files

- [data-collection.md](./data-collection.md) - What data is collected
- [adaptation.md](./adaptation.md) - How learnings are applied
- [reports.md](./reports.md) - Learning report formats
- [implementation-guide.md](./implementation-guide.md) - Technical implementation guide
