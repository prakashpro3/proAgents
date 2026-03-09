# Model Configuration

Configure AI models and providers for your workflow.

---

## Provider Setup

### Anthropic (Claude)

```yaml
ai:
  providers:
    anthropic:
      api_key: "${ANTHROPIC_API_KEY}"
      base_url: "https://api.anthropic.com"  # Optional

      models:
        claude-3-opus:
          max_tokens: 4096
          temperature: 0.7
          context_window: 200000

        claude-3-sonnet:
          max_tokens: 4096
          temperature: 0.7
          context_window: 200000

        claude-3-haiku:
          max_tokens: 4096
          temperature: 0.7
          context_window: 200000

      rate_limits:
        requests_per_minute: 50
        tokens_per_minute: 100000
```

### OpenAI (GPT)

```yaml
ai:
  providers:
    openai:
      api_key: "${OPENAI_API_KEY}"
      organization: "${OPENAI_ORG}"  # Optional

      models:
        gpt-4-turbo:
          max_tokens: 4096
          temperature: 0.7
          context_window: 128000

        gpt-4:
          max_tokens: 8192
          temperature: 0.7
          context_window: 8192

        gpt-3.5-turbo:
          max_tokens: 4096
          temperature: 0.7
          context_window: 16384

      rate_limits:
        requests_per_minute: 60
        tokens_per_minute: 90000
```

### Google (Gemini)

```yaml
ai:
  providers:
    google:
      api_key: "${GOOGLE_API_KEY}"
      project_id: "${GOOGLE_PROJECT}"  # For Vertex AI

      models:
        gemini-pro:
          max_tokens: 2048
          temperature: 0.7
          context_window: 32000

        gemini-ultra:
          max_tokens: 8192
          temperature: 0.7
          context_window: 32000
```

### Local Models (Ollama)

```yaml
ai:
  providers:
    ollama:
      base_url: "http://localhost:11434"

      models:
        llama2:
          context_window: 4096
          temperature: 0.7

        codellama:
          context_window: 16384
          temperature: 0.5

        mistral:
          context_window: 8192
          temperature: 0.7
```

---

## Model Selection

### Default Model

```yaml
ai:
  default_provider: "anthropic"
  default_model: "claude-3-sonnet"
```

### Per-Task Models

```yaml
ai:
  task_routing:
    # Complex analysis
    code_analysis:
      model: "claude-3-opus"
      reason: "Best for deep code understanding"

    # Code generation
    code_generation:
      model: "claude-3-sonnet"
      reason: "Good balance of speed and quality"

    # Quick tasks
    quick_tasks:
      model: "claude-3-haiku"
      reason: "Fast for simple tasks"

    # Documentation
    documentation:
      model: "gpt-4"
      reason: "Good at technical writing"

    # Tests
    test_generation:
      model: "claude-3-sonnet"
      reason: "Understands code context well"
```

---

## Model Parameters

### Temperature

Controls randomness/creativity:

```yaml
models:
  # Creative tasks (docs, names)
  creative:
    temperature: 0.9

  # Balanced tasks (code)
  balanced:
    temperature: 0.7

  # Deterministic tasks (analysis)
  precise:
    temperature: 0.3
```

### Max Tokens

Control response length:

```yaml
models:
  # Short responses
  short:
    max_tokens: 1024

  # Standard responses
  standard:
    max_tokens: 4096

  # Long responses
  long:
    max_tokens: 8192
```

### System Prompts

```yaml
ai:
  system_prompts:
    code_analysis: |
      You are an expert code analyst. Analyze the provided code
      for patterns, issues, and improvements.

    code_generation: |
      You are a senior developer. Write clean, well-documented
      code following the project's conventions.

    documentation: |
      You are a technical writer. Write clear, concise
      documentation for developers.
```

---

## Model Comparison

### Claude Models

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| Opus | Slow | Excellent | $$$ | Complex analysis |
| Sonnet | Medium | Very Good | $$ | General development |
| Haiku | Fast | Good | $ | Quick tasks |

### OpenAI Models

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| GPT-4 Turbo | Fast | Excellent | $$ | Large context tasks |
| GPT-4 | Medium | Excellent | $$$ | Complex reasoning |
| GPT-3.5 | Fast | Good | $ | Simple tasks |

### Selection Guide

```
Task Complexity → Model Selection

Simple (config, typos)    → Haiku / GPT-3.5
Medium (bug fixes, small) → Sonnet / GPT-4 Turbo
Complex (architecture)    → Opus / GPT-4
```

---

## Testing Models

### Connectivity Test

```bash
# Test all configured providers
proagents ai test

# Test specific provider
proagents ai test --provider anthropic

# Test specific model
proagents ai test --model claude-3-opus
```

### Output

```
┌─────────────────────────────────────────────────────────────┐
│ AI Model Test Results                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Anthropic:                                                  │
│ ├── claude-3-opus: ✅ Connected (latency: 450ms)           │
│ ├── claude-3-sonnet: ✅ Connected (latency: 280ms)         │
│ └── claude-3-haiku: ✅ Connected (latency: 120ms)          │
│                                                             │
│ OpenAI:                                                     │
│ ├── gpt-4-turbo: ✅ Connected (latency: 380ms)             │
│ ├── gpt-4: ✅ Connected (latency: 520ms)                   │
│ └── gpt-3.5-turbo: ✅ Connected (latency: 150ms)           │
│                                                             │
│ Google:                                                     │
│ └── gemini-pro: ❌ API key invalid                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_ORG` | OpenAI organization ID |
| `GOOGLE_API_KEY` | Google AI API key |
| `PROAGENTS_DEFAULT_MODEL` | Override default model |

### Secure Key Storage

```bash
# Use system keychain
proagents ai config --set-key anthropic --secure

# Use environment file
# .env.local (gitignored)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

---

## Best Practices

1. **Start with Sonnet/GPT-4**: Good balance for most tasks
2. **Use Haiku for Speed**: Quick operations, simple fixes
3. **Reserve Opus for Complex**: Deep analysis, architecture
4. **Set Cost Limits**: Prevent unexpected charges
5. **Test Regularly**: Ensure API keys are valid
6. **Use Environment Variables**: Never commit API keys
