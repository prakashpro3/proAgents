# Troubleshooting AI Service Issues

Solutions for AI service connectivity, response, and quality issues.

---

## Connection Issues

### Cannot Connect to AI Service

**Symptoms:**
```
Error: Failed to connect to AI service
ECONNREFUSED / ETIMEDOUT
```

**Diagnostic Steps:**

```bash
# 1. Check network connectivity
proagents doctor --check-network

# 2. Test AI endpoint directly
proagents ai test

# 3. Check firewall/proxy settings
curl -I https://api.anthropic.com/v1/health
```

**Solutions:**

```yaml
# Configure proxy if needed
ai:
  proxy:
    http: "http://proxy.company.com:8080"
    https: "http://proxy.company.com:8080"

# Configure custom endpoint
ai:
  endpoint: "https://custom-api.company.com/v1"

# Allow specific domains in firewall
# - api.anthropic.com
# - api.openai.com
```

---

### SSL/TLS Certificate Errors

**Symptoms:**
```
Error: UNABLE_TO_VERIFY_LEAF_SIGNATURE
Error: CERT_HAS_EXPIRED
```

**Solutions:**

```bash
# Update CA certificates
# macOS
brew install ca-certificates

# Linux
sudo apt update && sudo apt install ca-certificates

# Use custom CA bundle
ai:
  ssl:
    ca_file: "/path/to/ca-bundle.crt"
    verify: true

# Temporary workaround (NOT recommended for production)
ai:
  ssl:
    verify: false  # Security risk!
```

---

## Authentication Issues

### Invalid API Key

**Symptoms:**
```
Error: 401 Unauthorized
Message: Invalid API key
```

**Solutions:**

```bash
# Verify API key format
# Claude: sk-ant-api...
# OpenAI: sk-...

# Check environment variable
echo $PROAGENTS_API_KEY

# Test key directly
proagents ai verify-key

# Re-enter key
proagents config set-secret ai.api_key
```

---

### API Key Expired or Revoked

**Symptoms:**
```
Error: 401 Unauthorized
Message: API key has been revoked
```

**Solutions:**

1. Generate new API key from provider dashboard
2. Update configuration:

```bash
# Update key
proagents config set-secret ai.api_key

# Or update environment variable
export PROAGENTS_API_KEY="new-key-here"
```

---

## Rate Limiting

### Rate Limit Exceeded

**Symptoms:**
```
Error: 429 Too Many Requests
Retry-After: 60
```

**Solutions:**

```yaml
# Configure rate limiting
ai:
  rate_limit:
    requests_per_minute: 30  # Reduce from default
    tokens_per_minute: 40000
    retry_on_limit: true
    max_retries: 3
    backoff_multiplier: 2

# Enable request batching
ai:
  batching:
    enabled: true
    max_batch_size: 5
    batch_delay_ms: 1000

# Use response caching
ai:
  cache:
    enabled: true
    ttl: 3600  # Cache responses for 1 hour
    cache_similar: true
```

---

### Quota Exceeded

**Symptoms:**
```
Error: 403 Forbidden
Message: Monthly quota exceeded
```

**Solutions:**

1. Check usage in provider dashboard
2. Upgrade plan or wait for reset
3. Switch to backup provider:

```yaml
ai:
  fallback:
    enabled: true
    providers:
      - name: "claude"
        priority: 1
      - name: "gpt-4"
        priority: 2
      - name: "local-model"
        priority: 3
```

---

## Response Issues

### Timeout Errors

**Symptoms:**
```
Error: Request timeout after 30000ms
```

**Solutions:**

```yaml
# Increase timeout
ai:
  timeout:
    connect: 10000    # Connection timeout (10s)
    response: 120000  # Response timeout (2 min)

# For long operations, use async
proagents analyze --async

# Enable streaming for large responses
ai:
  streaming: true
```

---

### Incomplete Responses

**Symptoms:**
- Response cut off mid-sentence
- Missing code blocks
- Truncated output

**Solutions:**

```yaml
# Increase max tokens
ai:
  max_tokens: 4096  # Increase limit

# Use chunked processing
ai:
  chunking:
    enabled: true
    max_chunk_size: 2000
    overlap: 200

# Request continuation
proagents ai continue  # Continue from last response
```

---

### Empty or Invalid Responses

**Symptoms:**
```
Error: Empty response received
Error: Invalid JSON in response
```

**Solutions:**

```bash
# Enable debug mode
proagents --debug ai test

# Check response format
ai:
  response_format: "json"
  validate_response: true

# Retry with different parameters
proagents ai retry --temperature 0.7

# Report issue if persistent
proagents ai report-issue
```

---

## Quality Issues

### Poor Code Generation Quality

**Symptoms:**
- Generated code doesn't follow project patterns
- Inconsistent naming conventions
- Missing error handling

**Solutions:**

```yaml
# Improve context provision
ai:
  context:
    include_patterns: true
    include_examples: true
    max_context_files: 10

# Enhance system prompt
ai:
  system_prompt_additions:
    - "Follow the existing code patterns in this project"
    - "Use TypeScript with strict type checking"
    - "Include error handling in all functions"

# Use project-specific training
learning:
  enabled: true
  track_corrections: true
  auto_apply_corrections: true
```

---

### Inconsistent Responses

**Symptoms:**
- Different answers for same question
- Varying code style
- Unpredictable behavior

**Solutions:**

```yaml
# Reduce temperature for consistency
ai:
  temperature: 0.3  # Lower = more deterministic

# Use same model consistently
ai:
  model: "claude-3-sonnet"
  pin_version: true

# Enable response caching
ai:
  cache:
    enabled: true
    cache_key_includes:
      - "prompt"
      - "context"
      - "model"
```

---

### Hallucinations / Incorrect Information

**Symptoms:**
- References to non-existent files
- Made-up function names
- Incorrect API usage

**Solutions:**

```yaml
# Require source verification
ai:
  verification:
    check_file_exists: true
    validate_imports: true
    verify_api_calls: true

# Reduce creativity
ai:
  temperature: 0.2
  top_p: 0.9

# Use retrieval augmentation
ai:
  rag:
    enabled: true
    index_codebase: true
    search_docs: true
```

---

## Model-Specific Issues

### Claude-Specific

```yaml
# Claude configuration
ai:
  provider: "anthropic"
  model: "claude-3-opus"

  # Claude-specific options
  claude:
    # Use extended thinking for complex tasks
    thinking_enabled: true

    # Handle context limits
    max_context: 100000
    auto_summarize: true
```

**Common Claude Issues:**
- Very long responses: Set `max_tokens`
- Context too long: Enable `auto_summarize`
- Slow responses: Use smaller model (Sonnet/Haiku)

---

### GPT-Specific

```yaml
# GPT configuration
ai:
  provider: "openai"
  model: "gpt-4-turbo"

  # GPT-specific options
  openai:
    organization_id: "org-xxx"

    # Function calling
    functions_enabled: true

    # Response format
    json_mode: true
```

**Common GPT Issues:**
- Token limits: Use GPT-4 Turbo (128k context)
- Rate limits: Implement exponential backoff
- Cost management: Use GPT-3.5 for simple tasks

---

## Debugging

### Enable Debug Logging

```bash
# Command line
proagents --debug analyze

# Environment variable
export PROAGENTS_DEBUG=true

# Configuration
debug:
  ai:
    log_requests: true
    log_responses: true
    log_tokens: true
```

### View Request/Response

```bash
# View last AI interaction
proagents ai history --last

# Output:
# Request:
# ────────
# Model: claude-3-sonnet
# Tokens: 1,234 input
# Prompt: [truncated]
#
# Response:
# ─────────
# Tokens: 567 output
# Time: 2.3s
# Content: [truncated]
#
# View full: proagents ai history --last --full
```

### Test AI Connection

```bash
# Basic test
proagents ai test

# Detailed test
proagents ai test --verbose

# Output:
# AI Service Test
# ───────────────
# Provider: Anthropic
# Model: claude-3-sonnet
# Endpoint: https://api.anthropic.com
#
# Connection: ✅ OK (145ms)
# Authentication: ✅ OK
# Simple Query: ✅ OK (1.2s)
# Code Generation: ✅ OK (2.8s)
# Context Handling: ✅ OK (1.5s)
#
# All tests passed
```

---

## Recovery Procedures

### Switch to Backup Provider

```bash
# Manual switch
proagents ai switch gpt-4

# Auto-failover
ai:
  failover:
    enabled: true
    trigger: "3 consecutive failures"
    providers:
      - "claude-3-sonnet"
      - "gpt-4"
      - "claude-3-haiku"
```

### Use Offline Mode

```bash
# Enable offline mode
proagents offline enable

# Operations available offline:
# - Cached analysis
# - Template generation
# - Standards validation
# - Local testing
# - Git operations
```

### Clear AI Cache

```bash
# Clear response cache
proagents cache clear ai

# Clear all AI-related data
proagents cache clear --ai-all

# Reset and rebuild
proagents ai reset
proagents analyze --force
```

---

## Prevention

### Health Monitoring

```yaml
# Configure health checks
monitoring:
  ai:
    health_check_interval: 60  # seconds
    alert_on_degradation: true
    alert_channels: ["slack"]

    thresholds:
      response_time_warning: 5000   # 5s
      response_time_critical: 30000  # 30s
      error_rate_warning: 0.05       # 5%
      error_rate_critical: 0.15      # 15%
```

### Graceful Degradation

```yaml
# Configure fallback behavior
ai:
  graceful_degradation:
    enabled: true

    on_failure:
      - action: "retry"
        attempts: 3
        backoff: "exponential"

      - action: "switch_model"
        fallback: "claude-3-haiku"

      - action: "offline_mode"
        preserve_queue: true

      - action: "notify_user"
        message: "AI service unavailable, using cached data"
```

---

## Related Documentation

- [AI Models Configuration](../ai-models/README.md)
- [Offline Mode](../offline-mode/README.md)
- [Caching Guide](../offline-mode/caching.md)
