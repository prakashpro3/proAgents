# Getting Started with AI Training

Configure the learning system to improve ProAgents for your project.

---

## What Does AI Training Do?

The learning system helps ProAgents:

1. **Learn your patterns** - Naming conventions, code style, architecture
2. **Remember corrections** - Auto-apply fixes you've made before
3. **Adapt to preferences** - Skip checkpoints you always skip
4. **Improve suggestions** - Better code generation over time

---

## Quick Start

### Step 1: Enable Learning

```yaml
# proagents.config.yaml
learning:
  enabled: true
```

That's it! Learning starts automatically.

### Step 2: Use ProAgents Normally

As you work, the system learns:

```bash
pa:feature "Add user profile"
# → Learns feature naming patterns

pa:analyze
# → Learns project structure

/implement
# → Learns code patterns
```

### Step 3: Check Learning Progress

```bash
pa:learning status
```

Output:
```
Learning System Status
══════════════════════════════════════

Patterns Learned: 45
├── Naming conventions: 12 (high confidence)
├── Code style: 18 (high confidence)
├── Architecture: 8 (medium confidence)
└── Testing: 7 (learning)

Corrections Applied: 23
User Preferences: 8

Last Updated: 2 hours ago
```

---

## What Gets Learned

### 1. Code Patterns

```
✓ Component structure patterns
✓ Hook implementation patterns
✓ Service layer patterns
✓ Import ordering
✓ Error handling approaches
✓ Testing patterns
```

### 2. Naming Conventions

```
✓ File naming (PascalCase, kebab-case, etc.)
✓ Function naming
✓ Variable naming
✓ Type/Interface naming
✓ Test naming
```

### 3. User Preferences

```
✓ Checkpoint skipping patterns
✓ Documentation level preferences
✓ Review thoroughness
✓ Common corrections
```

### 4. Project Domain

```
✓ Business terminology
✓ Domain entities
✓ Specific patterns for your domain
```

---

## Configuration Options

### Basic Configuration

```yaml
learning:
  enabled: true
  track_preferences: true
  track_patterns: true
  track_corrections: true
```

### Advanced Configuration

```yaml
learning:
  enabled: true

  # What to learn
  tracking:
    preferences: true        # User checkpoint/workflow preferences
    patterns: true           # Code patterns and conventions
    corrections: true        # Manual corrections to AI output
    domain: true             # Domain-specific terminology

  # Auto-apply settings
  auto_apply:
    corrections: true        # Auto-apply learned corrections
    threshold: 3             # Apply after N occurrences

  # Privacy settings
  privacy:
    share_globally: false    # Keep learnings project-local
    anonymize: true          # Anonymize metrics
    exclude_secrets: true    # Never learn from secret values

  # Storage
  storage:
    location: ".proagents/.learning"
    max_size: "50MB"
    retention_days: 365

  # Performance
  performance:
    batch_updates: true
    update_frequency: "on_commit"  # on_commit, hourly, daily
```

---

## Teaching the System

### Explicit Teaching

You can explicitly teach patterns:

```bash
# Teach a naming convention
pa:learning teach "Components should use PascalCase with 'View' suffix"

# Teach a code pattern
pa:learning teach "Always use React Query for data fetching"

# Teach domain terminology
pa:learning teach "A 'Workspace' contains multiple 'Projects'"
```

### Correction Learning

When you correct AI output, the system learns:

**AI suggests:**
```typescript
const fetchData = async () => {
  const response = await fetch('/api/users');
  return response.json();
}
```

**You change to:**
```typescript
const fetchData = async () => {
  const response = await apiClient.get('/users');
  return response.data;
}
```

**System learns:**
```
Pattern: Use apiClient instead of fetch
Confidence: Low (1 occurrence)
```

After 3+ similar corrections:
```
Pattern: Use apiClient instead of fetch
Confidence: High
Auto-apply: Yes
```

---

## Training Data Sources

### Automatic Sources

| Source | What's Learned |
|--------|----------------|
| Codebase | Patterns, style, architecture |
| Git history | Change patterns, frequent edits |
| PR comments | Review feedback patterns |
| Corrections | User preferences |

### Manual Sources

```yaml
learning:
  sources:
    # Explicit documentation
    - path: "./docs/coding-standards.md"
      type: "documentation"
      weight: 1.0

    # Domain knowledge
    - path: "./docs/domain-model.md"
      type: "domain"
      weight: 0.8

    # Example code
    - path: "./examples/"
      type: "examples"
      weight: 0.9
```

---

## Learning Reports

### View Learning Summary

```bash
pa:learning report
```

Output:
```
┌─────────────────────────────────────────────────────────┐
│ Learning Report - January 2024                          │
├─────────────────────────────────────────────────────────┤
│ Patterns Learned: 45                                    │
│ Auto-corrections Applied: 23                            │
│ Checkpoints Auto-skipped: 36 (saved ~3 hrs)            │
│                                                         │
│ Top Improvements:                                       │
│ • Now auto-detects auth context (saved 15min/feature)  │
│ • Learned preferred test structure (fewer corrections) │
│ • Optimized checkpoint flow for this project           │
├─────────────────────────────────────────────────────────┤
│ Suggestions:                                            │
│ • Consider documenting the custom hook pattern         │
│ • Test coverage trending down (now 72%, was 80%)       │
└─────────────────────────────────────────────────────────┘
```

### View Specific Patterns

```bash
pa:learning patterns           # View all learned patterns
pa:learning patterns naming    # View naming patterns
pa:learning patterns testing   # View testing patterns
```

### View Corrections

```bash
pa:learning corrections        # View all auto-corrections
pa:learning corrections active # View active corrections
```

---

## Managing Learning Data

### Export Learning Data

```bash
pa:learning export --output ./learning-export.json
```

### Import Learning Data

```bash
pa:learning import ./learning-export.json
```

### Reset Learning

```bash
# Reset specific category
pa:learning reset patterns

# Reset all learning
pa:learning reset --all

# Reset with confirmation
pa:learning reset --all --confirm
```

### Disable Specific Learning

```bash
# Temporarily disable a learned pattern
pa:learning disable "Use apiClient instead of fetch"

# Re-enable
pa:learning enable "Use apiClient instead of fetch"
```

---

## Troubleshooting

### Learning Not Working

```bash
# Check status
pa:learning status

# Debug mode
pa:learning debug
```

### Wrong Pattern Learned

```bash
# Remove incorrect pattern
pa:learning remove "incorrect pattern"

# Or correct it
pa:learning correct "old pattern" --to "correct pattern"
```

### Performance Issues

```yaml
learning:
  performance:
    batch_updates: true
    update_frequency: "daily"  # Reduce frequency
    max_patterns: 100          # Limit stored patterns
```

---

## Best Practices

1. **Be consistent** - Consistent code leads to confident patterns
2. **Correct promptly** - Correct AI output to teach preferences
3. **Document standards** - Explicit docs help learning
4. **Review periodically** - Check learned patterns monthly
5. **Export before reset** - Backup learning data

---

## Next Steps

- [Configure IDE](./ide-setup.md)
- [Set up standards](../standards/)
- [Review AI training details](../ai-training/)
