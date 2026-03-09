# Task Routing

Route tasks to the most appropriate AI model based on complexity, type, and cost.

---

## Routing Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Task Routing Pipeline                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Incoming Task                                              │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────┐                                           │
│  │  Analyzer   │ ── Complexity, Type, Context              │
│  └─────────────┘                                           │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────┐      ┌─────────────────────────────────┐  │
│  │   Router    │ ───▶ │ Simple → Haiku/GPT-3.5          │  │
│  └─────────────┘      │ Medium → Sonnet/GPT-4           │  │
│       │               │ Complex → Opus/GPT-4-Turbo      │  │
│       │               └─────────────────────────────────┘  │
│       ▼                                                     │
│  ┌─────────────┐                                           │
│  │  Selected   │                                           │
│  │   Model     │                                           │
│  └─────────────┘                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Routing Configuration

### Basic Setup

```yaml
ai:
  routing:
    enabled: true

    # Default model
    default: "claude-3-sonnet"

    # Routing strategy
    strategy: "smart"  # smart, cost_optimized, quality_first
```

### Task Type Routing

```yaml
ai:
  routing:
    by_task_type:
      # Code analysis
      code_analysis:
        default: "claude-3-opus"
        reason: "Best for deep code understanding"

      # Code generation
      code_generation:
        simple: "claude-3-haiku"
        moderate: "claude-3-sonnet"
        complex: "claude-3-opus"

      # Code review
      code_review:
        default: "claude-3-sonnet"
        security_review: "claude-3-opus"

      # Documentation
      documentation:
        default: "claude-3-sonnet"
        api_docs: "claude-3-sonnet"
        quick_comments: "claude-3-haiku"

      # Bug fixing
      bug_fix:
        simple: "claude-3-haiku"
        complex: "claude-3-sonnet"
        critical: "claude-3-opus"

      # Testing
      test_generation:
        unit_tests: "claude-3-sonnet"
        integration_tests: "claude-3-opus"

      # Refactoring
      refactoring:
        simple: "claude-3-sonnet"
        architectural: "claude-3-opus"
```

---

## Complexity Detection

### Complexity Indicators

```yaml
ai:
  routing:
    complexity:
      # Low complexity indicators
      low:
        - "single_file_change"
        - "documentation_only"
        - "config_change"
        - "simple_fix"
        - "formatting"
        - "less_than_20_lines"

      # Medium complexity indicators
      medium:
        - "multiple_files"
        - "new_component"
        - "api_integration"
        - "moderate_logic"
        - "20_to_100_lines"

      # High complexity indicators
      high:
        - "architectural_change"
        - "cross_module"
        - "security_related"
        - "performance_critical"
        - "more_than_100_lines"
        - "complex_algorithms"
        - "state_management"
```

### Context-Based Routing

```yaml
ai:
  routing:
    by_context:
      # File patterns
      file_patterns:
        "src/auth/**":
          model: "claude-3-opus"
          reason: "Security-sensitive code"

        "src/payments/**":
          model: "claude-3-opus"
          reason: "Financial code requires high accuracy"

        "*.test.*":
          model: "claude-3-sonnet"
          reason: "Test files are moderately complex"

        "docs/**":
          model: "claude-3-haiku"
          reason: "Documentation is straightforward"

      # Project phase
      by_phase:
        analysis:
          model: "claude-3-opus"
          reason: "Deep analysis needs best model"

        implementation:
          model: "claude-3-sonnet"
          reason: "Balance of speed and quality"

        documentation:
          model: "claude-3-haiku"
          reason: "Fast for documentation tasks"
```

---

## Cost Optimization

### Cost-Based Routing

```yaml
ai:
  routing:
    cost_optimization:
      enabled: true

      # Daily budget
      daily_budget: 50.00

      # Cost thresholds
      thresholds:
        # Use cheaper model when budget is low
        budget_low:
          percentage: 80  # 80% of budget used
          downgrade_to: "claude-3-haiku"
          except:
            - "security_review"
            - "critical_bugs"

        budget_critical:
          percentage: 95
          downgrade_to: "claude-3-haiku"
          except:
            - "blocking_tasks"

      # Cost per task type
      max_cost_per_task:
        simple_fix: 0.10
        code_review: 0.50
        feature_implementation: 2.00
        full_analysis: 5.00
```

### Model Cost Tracking

```
┌─────────────────────────────────────────────────────────────┐
│ AI Cost Dashboard - Today                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Budget: $50.00 | Used: $32.50 (65%) | Remaining: $17.50    │
│ [████████████████████░░░░░░░░░░] 65%                       │
│                                                             │
│ By Model:                                                   │
│ ├── Opus:   $18.00 (12 requests)                           │
│ ├── Sonnet: $12.50 (45 requests)                           │
│ └── Haiku:  $2.00 (120 requests)                           │
│                                                             │
│ By Task Type:                                               │
│ ├── Code Analysis:  $15.00                                 │
│ ├── Code Review:    $8.00                                  │
│ ├── Implementation: $6.50                                  │
│ └── Documentation:  $3.00                                  │
│                                                             │
│ Routing Decisions:                                          │
│ ├── Upgraded to Opus: 5 (complexity)                       │
│ ├── Downgraded to Haiku: 8 (cost)                         │
│ └── Default Sonnet: 32                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quality-First Routing

### Quality Priority

```yaml
ai:
  routing:
    quality_first:
      enabled: true

      # Always use best model for these
      always_use_best:
        - task_type: "security_review"
        - task_type: "architecture_decisions"
        - file_pattern: "src/core/**"
        - tag: "critical"

      # Quality metrics to consider
      metrics:
        # If previous response quality was low
        retry_with_better:
          enabled: true
          threshold: 0.7  # Quality score
          upgrade_to: "next_tier"

        # Track model performance
        track_accuracy: true
        adjust_routing: true
```

### Performance Tracking

```yaml
ai:
  routing:
    performance:
      # Track response quality
      track_quality: true

      # Adjust routing based on results
      adaptive_routing:
        enabled: true

        # If model consistently underperforms
        downgrade_threshold: 0.6
        upgrade_threshold: 0.9

        # Learning period
        evaluation_window: 100  # requests
```

---

## Fallback Chains

### Fallback Configuration

```yaml
ai:
  routing:
    fallbacks:
      # Primary fallback chain
      chain:
        - "claude-3-opus"
        - "claude-3-sonnet"
        - "gpt-4-turbo"
        - "claude-3-haiku"
        - "gpt-3.5-turbo"

      # When to fallback
      triggers:
        - "rate_limit"
        - "model_unavailable"
        - "timeout"
        - "error"

      # Retry settings
      retry:
        max_attempts: 3
        delay: "2s"
        backoff: "exponential"

      # Alert on fallback
      notify:
        on_fallback: true
        on_last_resort: true
```

### Fallback Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Fallback Flow                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Request                                                    │
│     │                                                       │
│     ▼                                                       │
│  Claude Opus ──[Rate Limited]──▶ Claude Sonnet             │
│                                        │                    │
│                                        ▼                    │
│                               [Timeout]──▶ GPT-4            │
│                                              │              │
│                                              ▼              │
│                                      [Success] ✅           │
│                                                             │
│  Log: "Fallback: Opus → Sonnet → GPT-4 (success)"          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Custom Routing Rules

### Rule Definition

```yaml
ai:
  routing:
    custom_rules:
      # Rule 1: Security-critical
      - name: "security_critical"
        priority: 1
        conditions:
          any:
            - file_pattern: "src/auth/**"
            - file_pattern: "src/security/**"
            - contains: ["password", "token", "secret", "credential"]
        route_to: "claude-3-opus"
        reason: "Security-sensitive code"

      # Rule 2: Quick fixes
      - name: "quick_fixes"
        priority: 2
        conditions:
          all:
            - task_type: "bug_fix"
            - files_changed: "<= 2"
            - lines_changed: "<= 20"
        route_to: "claude-3-haiku"
        reason: "Simple fix, fast model"

      # Rule 3: New features
      - name: "new_features"
        priority: 3
        conditions:
          all:
            - task_type: "feature"
            - complexity: ">= medium"
        route_to: "claude-3-sonnet"
        reason: "Balance of quality and speed"
```

---

## Routing API

### Programmatic Routing

```typescript
// Request with routing hints
const response = await proagents.ai.request({
  task: "Review this authentication code",
  context: {
    files: ["src/auth/login.ts"],
    type: "security_review"
  },
  routing: {
    prefer: "quality",      // quality, speed, cost
    minModel: "sonnet",     // Minimum model tier
    maxCost: 1.00,          // Maximum cost
    timeout: 30000          // Timeout in ms
  }
});
```

### Routing Override

```bash
# Force specific model
proagents review --model opus

# Cost-optimized routing
proagents analyze --routing cost

# Quality-first routing
proagents review --routing quality

# View routing decision
proagents debug-routing "Review auth code"
```

---

## Routing Logs

### Decision Logging

```yaml
ai:
  routing:
    logging:
      enabled: true

      # What to log
      log:
        - decision
        - reason
        - cost
        - latency
        - fallbacks

      # Storage
      storage:
        path: ".proagents/routing-logs/"
        retention: "30d"
```

### Log Example

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "task_id": "task-123",
  "task_type": "code_review",
  "context": {
    "files": ["src/auth/login.ts"],
    "complexity": "high",
    "lines": 150
  },
  "routing_decision": {
    "selected_model": "claude-3-opus",
    "reason": "Security-sensitive file + high complexity",
    "rules_matched": ["security_critical", "high_complexity"],
    "cost_estimate": 0.45
  },
  "actual": {
    "model_used": "claude-3-opus",
    "latency_ms": 2500,
    "tokens_in": 1200,
    "tokens_out": 800,
    "actual_cost": 0.42,
    "quality_score": 0.95
  }
}
```

---

## Best Practices

1. **Start Conservative**: Use higher-tier models initially, optimize later
2. **Monitor Costs**: Track spending per task type
3. **Quality Metrics**: Measure and track response quality
4. **Context Matters**: Consider file sensitivity in routing
5. **Fallbacks Ready**: Always have fallback chain configured
6. **Review Logs**: Periodically review routing decisions
