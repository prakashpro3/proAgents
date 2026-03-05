# Troubleshooting Guide

Solutions to common ProAgents issues and problems.

---

## Quick Diagnostics

Run the diagnostic command to identify issues:

```bash
proagents doctor

# Output:
# ProAgents Health Check
# ═══════════════════════════════════════
#
# Configuration:
# ✅ proagents.config.yaml found
# ✅ Configuration valid
# ⚠️  Missing optional: pm_integration
#
# AI Services:
# ✅ API key configured
# ✅ Connection successful
# ✅ Response time: 245ms
#
# Git Integration:
# ✅ Git repository detected
# ✅ Remote configured
# ⚠️  Uncommitted changes (3 files)
#
# Cache:
# ✅ Cache directory exists
# ✅ Analysis cache valid (2 hours old)
# ℹ️  Cache size: 12.3 MB
#
# Overall Status: HEALTHY (with warnings)
```

---

## Common Issues

### 1. Configuration Issues

#### Problem: "Configuration file not found"

**Symptoms:**
```
Error: proagents.config.yaml not found
```

**Solutions:**

```bash
# Option 1: Initialize ProAgents
proagents init

# Option 2: Create minimal config
cat > proagents.config.yaml << 'EOF'
project:
  name: "My Project"
  type: "fullstack"

workflow:
  default_mode: "full"
EOF

# Option 3: Specify config path
proagents --config ./path/to/config.yaml status
```

---

#### Problem: "Invalid configuration"

**Symptoms:**
```
Error: Invalid configuration
- checkpoints.after_analysis: expected boolean, got string
```

**Solutions:**

```bash
# Validate configuration
proagents config validate

# Fix common issues
# Wrong:
checkpoints:
  after_analysis: "yes"

# Correct:
checkpoints:
  after_analysis: true
```

**Common YAML mistakes:**
```yaml
# Wrong: Using tabs
project:
	name: "Test"  # TAB character

# Correct: Using spaces
project:
  name: "Test"  # 2 spaces

# Wrong: Missing quotes with special characters
project:
  name: Project: The Beginning

# Correct: Quote strings with colons
project:
  name: "Project: The Beginning"
```

---

### 2. AI Service Issues

#### Problem: "API key not configured"

**Symptoms:**
```
Error: AI service not configured
Please set your API key
```

**Solutions:**

```bash
# Option 1: Environment variable
export PROAGENTS_API_KEY="your-api-key"

# Option 2: Config file
# proagents.config.yaml
ai:
  api_key: "${PROAGENTS_API_KEY}"  # Reference env var

# Option 3: Credentials file
echo "your-api-key" > ~/.proagents/credentials
chmod 600 ~/.proagents/credentials

# Verify
proagents config verify-ai
```

---

#### Problem: "AI service timeout"

**Symptoms:**
```
Error: Request timeout after 30000ms
```

**Solutions:**

```bash
# Increase timeout
proagents config set ai.timeout 60000

# Or in config:
ai:
  timeout: 60000  # 60 seconds

# Check network
proagents doctor --check-network

# Use offline mode temporarily
proagents offline enable
```

---

#### Problem: "Rate limit exceeded"

**Symptoms:**
```
Error: Rate limit exceeded. Retry after 60 seconds.
```

**Solutions:**

```bash
# Wait and retry
sleep 60 && proagents retry

# Reduce request frequency
ai:
  rate_limit:
    requests_per_minute: 20  # Lower if needed

# Enable request caching
ai:
  cache:
    enabled: true
    ttl: 3600  # 1 hour
```

---

### 3. Git Integration Issues

#### Problem: "Not a git repository"

**Symptoms:**
```
Error: Not a git repository
Git integration features disabled
```

**Solutions:**

```bash
# Initialize git
git init

# Or disable git integration
git:
  enabled: false

# Or specify git directory
git:
  path: "../.git"  # If in subdirectory
```

---

#### Problem: "Git authentication failed"

**Symptoms:**
```
Error: Authentication failed for 'https://github.com/...'
```

**Solutions:**

```bash
# Option 1: Use SSH
git remote set-url origin git@github.com:user/repo.git

# Option 2: Store credentials
git config credential.helper store

# Option 3: Use token
git remote set-url origin https://TOKEN@github.com/user/repo.git

# Test authentication
proagents git test
```

---

#### Problem: "Merge conflicts"

**Symptoms:**
```
Error: Cannot proceed - unresolved merge conflicts
Files: src/component.tsx, src/service.ts
```

**Solutions:**

```bash
# View conflicts
proagents git conflicts

# Resolve manually
git status
# Edit conflicted files
git add <resolved-files>
git commit

# Or abort and restart
git merge --abort
proagents feature resume
```

---

### 4. Workflow Issues

#### Problem: "Feature already in progress"

**Symptoms:**
```
Error: Feature 'user-auth' is already in progress
Cannot start new feature
```

**Solutions:**

```bash
# Check current feature status
proagents status

# Option 1: Resume current feature
proagents feature resume

# Option 2: Complete or abandon current feature
proagents feature complete
# or
proagents feature abandon --confirm

# Option 3: Start parallel feature (if enabled)
proagents feature start "new-feature" --parallel
```

---

#### Problem: "Phase cannot be skipped"

**Symptoms:**
```
Error: Phase 'testing' cannot be skipped
Required by project configuration
```

**Solutions:**

```bash
# Check why it's required
proagents phase info testing

# Option 1: Complete the phase
proagents phase run testing

# Option 2: Override with justification
proagents phase skip testing --reason "Manual testing completed externally"

# Option 3: Update configuration (if appropriate)
workflow:
  phases:
    testing:
      required: false
```

---

#### Problem: "Checkpoint approval required"

**Symptoms:**
```
Waiting for approval at checkpoint: before_deployment
Approvers: @tech-lead, @devops
```

**Solutions:**

```bash
# Check approval status
proagents approval status

# Request approval
proagents approval request

# For emergencies
proagents approval bypass --reason "Critical hotfix" --incident INC-123

# Skip checkpoint (if configured)
proagents checkpoint skip before_deployment --auto
```

---

### 5. Cache Issues

#### Problem: "Stale cache data"

**Symptoms:**
- AI suggestions don't match current code
- Analysis shows deleted files
- Outdated patterns recommended

**Solutions:**

```bash
# Refresh cache
proagents cache refresh

# Clear specific cache
proagents cache clear analysis

# Clear all cache
proagents cache clear --all

# Rebuild analysis
proagents analyze --force
```

---

#### Problem: "Cache corruption"

**Symptoms:**
```
Error: Cache integrity check failed
Corrupted: .proagents/cache/analysis.json
```

**Solutions:**

```bash
# Repair cache
proagents cache repair

# Or clear and rebuild
proagents cache clear --all
proagents analyze

# Prevent future issues
cache:
  integrity_check: true
  backup: true
```

---

### 6. Integration Issues

#### Problem: "PM tool connection failed"

**Symptoms:**
```
Error: Failed to connect to Jira
Status: 401 Unauthorized
```

**Solutions:**

```bash
# Verify credentials
proagents pm test

# Re-authenticate
proagents pm auth

# Check API token permissions
# Jira: Project read/write, Issue create/update
# Linear: Team access, Issue management

# Update configuration
integrations:
  jira:
    api_token: "${JIRA_API_TOKEN}"
    email: "your-email@company.com"
```

---

#### Problem: "Webhook delivery failed"

**Symptoms:**
```
Warning: Webhook delivery failed
URL: https://api.example.com/webhook
Status: 500
```

**Solutions:**

```bash
# Check webhook status
proagents webhooks status

# Test webhook manually
proagents webhooks test https://api.example.com/webhook

# View delivery logs
proagents webhooks logs --last 10

# Retry failed deliveries
proagents webhooks retry --failed

# Update webhook URL if needed
webhooks:
  endpoints:
    - url: "https://new-api.example.com/webhook"
```

---

### 7. Performance Issues

#### Problem: "Slow analysis"

**Symptoms:**
- Analysis takes > 5 minutes
- System becomes unresponsive

**Solutions:**

```bash
# Use lighter analysis
proagents analyze --depth lite

# Exclude large directories
analysis:
  exclude:
    - "node_modules"
    - "dist"
    - ".git"
    - "*.log"
    - "coverage"

# Enable incremental analysis
analysis:
  incremental: true

# Increase resources
analysis:
  parallel: true
  max_workers: 4
```

---

#### Problem: "High memory usage"

**Symptoms:**
- System slowdown
- Out of memory errors

**Solutions:**

```bash
# Limit memory usage
performance:
  memory_limit: "512MB"

# Reduce cache size
cache:
  max_size: "100MB"

# Process in batches
analysis:
  batch_size: 50

# Clear unnecessary data
proagents cache clear --old
proagents cleanup
```

---

### 8. Security Issues

#### Problem: "Secret detected in code"

**Symptoms:**
```
Error: Potential secret detected
File: src/config.ts:15
Pattern: API key
```

**Solutions:**

```bash
# Review the detection
proagents security show-finding FILE:LINE

# If false positive, add to allowlist
security:
  allowlist:
    - pattern: "EXAMPLE_API_KEY"
      reason: "Test/example value"

# If real secret, remove it
# 1. Remove from code
# 2. Rotate the secret
# 3. Add to .env file
# 4. Update .gitignore
```

---

#### Problem: "Vulnerable dependency"

**Symptoms:**
```
Security Alert: 3 vulnerabilities found
- lodash@4.17.20: Prototype pollution (HIGH)
- axios@0.21.0: SSRF vulnerability (MEDIUM)
```

**Solutions:**

```bash
# View details
proagents security vulnerabilities

# Auto-fix where possible
proagents security fix --auto

# Update specific package
npm update lodash

# If can't update, add exception
security:
  exceptions:
    - package: "legacy-lib"
      reason: "No update available, mitigated by..."
      expires: "2024-06-01"
```

---

## Error Reference

### Error Codes

| Code | Category | Description |
|------|----------|-------------|
| PA001 | Config | Configuration file not found |
| PA002 | Config | Invalid configuration syntax |
| PA003 | Config | Missing required field |
| PA010 | AI | API key not configured |
| PA011 | AI | AI service unreachable |
| PA012 | AI | Rate limit exceeded |
| PA013 | AI | Request timeout |
| PA020 | Git | Not a git repository |
| PA021 | Git | Authentication failed |
| PA022 | Git | Merge conflict |
| PA030 | Workflow | Feature already in progress |
| PA031 | Workflow | Phase cannot be skipped |
| PA032 | Workflow | Approval required |
| PA040 | Cache | Cache corrupted |
| PA041 | Cache | Cache expired |
| PA050 | Integration | Connection failed |
| PA051 | Integration | Authentication error |
| PA060 | Security | Secret detected |
| PA061 | Security | Vulnerability found |

### Getting More Information

```bash
# Get detailed error info
proagents error PA012

# Output:
# Error: PA012 - Rate limit exceeded
# ─────────────────────────────────
# Description: Too many requests to AI service
#
# Common Causes:
# - Rapid successive requests
# - Large analysis operations
# - Multiple concurrent sessions
#
# Solutions:
# 1. Wait 60 seconds and retry
# 2. Reduce request frequency in config
# 3. Enable response caching
#
# Documentation: docs.proagents.dev/errors/PA012
```

---

## Getting Help

### Self-Service

```bash
# Built-in help
proagents help
proagents help <command>

# Documentation
proagents docs open

# Search documentation
proagents docs search "authentication"
```

### Community Support

- **GitHub Issues**: Report bugs and feature requests
- **Discord**: Community chat and support
- **Stack Overflow**: Tag with `proagents`

### Filing a Bug Report

```bash
# Generate diagnostic report
proagents doctor --report > diagnostic.txt

# Include:
# 1. Diagnostic report
# 2. Steps to reproduce
# 3. Expected vs actual behavior
# 4. Configuration (sanitized)
```

---

## Preventive Measures

### Regular Maintenance

```bash
# Weekly health check
proagents doctor

# Monthly cache cleanup
proagents cache clear --old

# Quarterly config review
proagents config audit
```

### Best Practices

1. **Keep ProAgents updated** - `proagents update`
2. **Regular backups** - Back up `.proagents/` directory
3. **Monitor warnings** - Don't ignore yellow warnings
4. **Test changes** - Test config changes in dev first
5. **Document customizations** - Keep notes on custom configs

---

## Next Steps

- [Configuration Reference](../config/README.md)
- [CLI Commands](../cli/commands-reference.md)
- [Workflow Guide](../WORKFLOW.md)
