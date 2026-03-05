# Automation

Configure AI behavior and automated decision-making in the workflow.

---

## Overview

Control how the AI makes decisions, handles ambiguity, and automates routine tasks.

## Documentation

| Document | Description |
|----------|-------------|
| [Auto Decisions](./auto-decisions.md) | Configure automatic decision-making |
| [AI Behavior Rules](./ai-behavior-rules.md) | Define AI behavior constraints |
| [AI Prompt Injection](./ai-prompt-injection.md) | Custom context injection for AI |

## Quick Start

```yaml
# proagents.config.yaml
automation:
  auto_decisions:
    enabled: true
    confidence_threshold: 0.8

  behavior:
    ask_before_destructive: true
    prefer_existing_patterns: true
```

## Key Features

- **Auto-Decisions**: Let AI make routine decisions automatically
- **Behavior Rules**: Define constraints for AI actions
- **Context Injection**: Add project-specific context to AI prompts
- **Confidence Thresholds**: Control when AI asks vs decides
