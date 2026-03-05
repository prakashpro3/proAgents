# AI Model Selection & Management

Configure and manage AI models for different tasks.

---

## Overview

ProAgents is AI-agnostic and supports multiple AI providers. Configure which models to use for different tasks to optimize cost, speed, and quality.

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Model Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Task ──► Model Router ──► Selected Model ──► Response     │
│               │                                             │
│               ├── Task Type Detection                       │
│               ├── Cost Optimization                         │
│               ├── Fallback Handling                         │
│               └── Rate Limiting                             │
│                                                             │
│  Supported Providers:                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │ Claude  │ │ OpenAI  │ │ Gemini  │ │ Others  │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Configure Default Model

```yaml
# proagents.config.yaml

ai:
  default_provider: "anthropic"
  default_model: "claude-3-sonnet"
```

### Use Different Models

```bash
# Use specific model for a task
proagents analyze --model claude-3-opus

# Use fast model for quick tasks
proagents quick "Fix typo" --model claude-3-haiku
```

---

## Supported Providers

| Provider | Models | Best For |
|----------|--------|----------|
| **Anthropic** | Claude 3 Opus, Sonnet, Haiku | Code analysis, planning |
| **OpenAI** | GPT-4, GPT-4 Turbo, GPT-3.5 | General tasks, docs |
| **Google** | Gemini Pro, Gemini Ultra | Research, analysis |
| **Cohere** | Command, Command Light | Summarization |
| **Local** | Ollama, LM Studio | Privacy, offline |

---

## Documentation Files

| File | Description |
|------|-------------|
| [model-config.md](./model-config.md) | Model configuration |
| [task-routing.md](./task-routing.md) | Task-based model selection |
| [cost-management.md](./cost-management.md) | Cost optimization |
| [fallbacks.md](./fallbacks.md) | Fallback strategies |

---

## Configuration

```yaml
# proagents.config.yaml

ai:
  # Default settings
  default_provider: "anthropic"
  default_model: "claude-3-sonnet"

  # Provider configurations
  providers:
    anthropic:
      api_key: "${ANTHROPIC_API_KEY}"
      models:
        - claude-3-opus
        - claude-3-sonnet
        - claude-3-haiku

    openai:
      api_key: "${OPENAI_API_KEY}"
      models:
        - gpt-4-turbo
        - gpt-4
        - gpt-3.5-turbo

    google:
      api_key: "${GOOGLE_API_KEY}"
      models:
        - gemini-pro
        - gemini-ultra

  # Task-specific models
  task_routing:
    code_analysis: "claude-3-opus"
    code_generation: "claude-3-sonnet"
    quick_tasks: "claude-3-haiku"
    documentation: "gpt-4"

  # Cost management
  cost:
    daily_limit: 50.00
    alert_threshold: 40.00
    fallback_on_limit: true

  # Fallback chain
  fallback:
    primary: "claude-3-sonnet"
    secondary: "gpt-4"
    tertiary: "gemini-pro"
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents ai status` | Show AI configuration status |
| `proagents ai models` | List available models |
| `proagents ai usage` | Show usage and costs |
| `proagents ai test` | Test model connectivity |
