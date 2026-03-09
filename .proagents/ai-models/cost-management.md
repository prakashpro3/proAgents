# Cost Management

Manage and optimize AI model costs.

---

## Overview

Track and control AI usage costs to stay within budget.

```
┌─────────────────────────────────────────────────────────────┐
│                    Cost Management                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Usage Tracking ──► Cost Calculation ──► Budget Control    │
│        │                  │                   │             │
│        ▼                  ▼                   ▼             │
│  Token Counting      Rate Application     Alerts/Limits    │
│  Request Logging     Provider Totals      Fallback Logic   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Cost Configuration

### Budget Limits

```yaml
ai:
  cost:
    # Daily spending limit
    daily_limit: 50.00

    # Weekly limit
    weekly_limit: 250.00

    # Monthly limit
    monthly_limit: 1000.00

    # Alert thresholds (percentage of limit)
    alerts:
      - threshold: 50
        action: "notify"
      - threshold: 80
        action: "notify"
      - threshold: 100
        action: "block_or_fallback"

    # On limit reached
    on_limit:
      action: "fallback"  # or "block"
      fallback_model: "claude-3-haiku"
```

### Per-Team Budgets

```yaml
ai:
  cost:
    team_budgets:
      frontend:
        daily: 20.00
        monthly: 400.00

      backend:
        daily: 25.00
        monthly: 500.00

      mobile:
        daily: 15.00
        monthly: 300.00
```

---

## Pricing Reference

### Claude Models (Anthropic)

| Model | Input (/1M tokens) | Output (/1M tokens) |
|-------|-------------------|---------------------|
| Opus | $15.00 | $75.00 |
| Sonnet | $3.00 | $15.00 |
| Haiku | $0.25 | $1.25 |

### GPT Models (OpenAI)

| Model | Input (/1M tokens) | Output (/1M tokens) |
|-------|-------------------|---------------------|
| GPT-4 Turbo | $10.00 | $30.00 |
| GPT-4 | $30.00 | $60.00 |
| GPT-3.5 | $0.50 | $1.50 |

### Gemini Models (Google)

| Model | Input (/1M tokens) | Output (/1M tokens) |
|-------|-------------------|---------------------|
| Gemini Pro | $0.50 | $1.50 |
| Gemini Ultra | $7.00 | $21.00 |

---

## Usage Tracking

### View Current Usage

```bash
# Show today's usage
proagents ai usage

# Show weekly usage
proagents ai usage --period week

# Show by project
proagents ai usage --by project

# Show by model
proagents ai usage --by model
```

### Usage Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ AI Usage - January 2024                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Today's Spend: $12.45 / $50.00                             │
│ ████████████░░░░░░░░░░░░░░ 25%                             │
│                                                             │
│ This Month: $234.56 / $1000.00                             │
│ ████████░░░░░░░░░░░░░░░░░░ 23%                             │
│                                                             │
│ By Model:                                                   │
│ ├── claude-3-sonnet: $156.78 (67%)                        │
│ ├── claude-3-opus: $45.23 (19%)                           │
│ ├── claude-3-haiku: $18.90 (8%)                           │
│ └── gpt-4: $13.65 (6%)                                    │
│                                                             │
│ By Task:                                                    │
│ ├── Code Analysis: $89.45                                  │
│ ├── Code Generation: $78.34                                │
│ ├── Documentation: $34.56                                  │
│ └── Quick Tasks: $32.21                                   │
│                                                             │
│ Tokens Used:                                                │
│ ├── Input: 2.3M tokens                                    │
│ └── Output: 890K tokens                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Cost Optimization

### Smart Model Selection

```yaml
ai:
  optimization:
    # Use cheaper models for simple tasks
    auto_downgrade:
      enabled: true
      rules:
        - task_type: "simple"
          prefer: "haiku"
        - task_type: "medium"
          prefer: "sonnet"
        - task_type: "complex"
          prefer: "opus"

    # Estimate before execution
    estimate_first: true
    confirm_expensive: true  # Confirm if > $1
```

### Caching

```yaml
ai:
  caching:
    enabled: true
    ttl: "24h"

    # Cache identical requests
    request_cache: true

    # Cache code analysis
    analysis_cache: true
    analysis_ttl: "7d"
```

### Token Optimization

```yaml
ai:
  optimization:
    # Compress context when possible
    compress_context: true

    # Truncate long files
    max_file_tokens: 10000

    # Summarize instead of full context
    use_summaries: true
```

---

## Cost Alerts

### Configuration

```yaml
ai:
  alerts:
    cost:
      - name: "Daily 50%"
        condition: "daily_spend >= daily_limit * 0.5"
        channels: ["slack"]

      - name: "Daily 80%"
        condition: "daily_spend >= daily_limit * 0.8"
        channels: ["slack", "email"]

      - name: "Daily Limit"
        condition: "daily_spend >= daily_limit"
        channels: ["slack", "email", "sms"]
        action: "fallback_to_cheaper"

      - name: "Monthly 90%"
        condition: "monthly_spend >= monthly_limit * 0.9"
        channels: ["email"]
        action: "notify_admin"
```

### Alert Example

```
🔔 AI Cost Alert

Daily spend has reached 80% of limit.

Current: $40.12 / $50.00
Remaining: $9.88

Top Consumers:
• Code analysis: $18.45
• Feature implementation: $12.34

Recommendation: Consider using Haiku for remaining tasks today.

[View Details] [Adjust Limit]
```

---

## Cost Reports

### Generate Report

```bash
# Monthly cost report
proagents ai report --period month

# Export to CSV
proagents ai report --format csv --output costs.csv
```

### Report Contents

```markdown
# AI Cost Report - January 2024

## Summary
- Total Spend: $845.67
- Budget: $1000.00
- Remaining: $154.33

## By Provider
| Provider | Spend | % of Total |
|----------|-------|------------|
| Anthropic | $678.45 | 80% |
| OpenAI | $134.22 | 16% |
| Google | $33.00 | 4% |

## By Model
| Model | Requests | Tokens | Cost |
|-------|----------|--------|------|
| claude-3-sonnet | 1,234 | 4.5M | $456.78 |
| claude-3-opus | 89 | 890K | $178.90 |
| claude-3-haiku | 567 | 1.2M | $42.77 |

## By Team
| Team | Spend | Budget | Status |
|------|-------|--------|--------|
| Frontend | $312.45 | $400 | ✅ |
| Backend | $398.22 | $500 | ✅ |
| Mobile | $135.00 | $300 | ✅ |

## Trends
- Daily average: $28.19
- Peak day: Jan 15 ($67.89)
- Lowest day: Jan 1 ($3.45)

## Recommendations
1. Consider caching repeated analysis requests
2. Use Haiku for config/quick changes
3. Team Backend approaching limit - review usage
```

---

## Budget Actions

### On Budget Exceeded

```yaml
ai:
  cost:
    on_limit_exceeded:
      # Options: block, fallback, notify_only, emergency_only
      action: "fallback"

      fallback_chain:
        - "claude-3-haiku"
        - "gpt-3.5-turbo"

      emergency_override:
        enabled: true
        requires: "admin_approval"
        max_additional: 20.00
```

### Manual Controls

```bash
# Pause AI usage
proagents ai pause

# Resume AI usage
proagents ai resume

# Emergency override (with approval)
proagents ai override --reason "Critical production fix"
```

---

## Best Practices

1. **Set Conservative Limits**: Start low, increase as needed
2. **Enable Alerts Early**: Get notified at 50%
3. **Use Right-Sized Models**: Don't use Opus for simple tasks
4. **Enable Caching**: Avoid duplicate requests
5. **Review Weekly**: Check usage patterns
6. **Optimize Prompts**: Reduce token usage
7. **Train Team**: Make team aware of costs
