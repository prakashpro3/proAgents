# Secret Management

Secure handling of API keys, credentials, and sensitive data.

---

## Overview

Protect sensitive information throughout the development lifecycle.

## Documentation

| Document | Description |
|----------|-------------|
| [Secret Storage](./storage.md) | Where to store secrets |
| [Secret Rotation](./rotation.md) | Rotating credentials |
| [Access Control](./access-control.md) | Who can access secrets |
| [Scanning](./scanning.md) | Detecting leaked secrets |

---

## Secret Types

| Type | Examples | Storage |
|------|----------|---------|
| API Keys | Stripe, Twilio, OpenAI | Vault/SSM |
| Database | Connection strings, passwords | Vault/SSM |
| Authentication | JWT secrets, OAuth credentials | Vault/SSM |
| Infrastructure | AWS keys, SSH keys | Vault/SSM |
| Encryption | AES keys, certificates | Vault/HSM |

---

## Configuration

### Secret Sources

```yaml
# proagents.config.yaml
secrets:
  # Primary source
  provider: "aws-ssm"  # aws-ssm, vault, azure-keyvault, gcp-secrets

  # Provider config
  aws_ssm:
    region: "us-east-1"
    prefix: "/myapp/"

  # Fallback for development
  development:
    provider: "dotenv"
    file: ".env.local"
```

### Secret References

```yaml
# Reference secrets in config
database:
  url: "${secrets.DATABASE_URL}"

api:
  stripe_key: "${secrets.STRIPE_SECRET_KEY}"
```

---

## Secret Scanning

### Pre-Commit Scanning

```yaml
secrets:
  scanning:
    enabled: true

    # When to scan
    hooks:
      - "pre-commit"
      - "pre-push"

    # What to scan for
    patterns:
      - name: "AWS Access Key"
        pattern: "AKIA[0-9A-Z]{16}"

      - name: "Generic API Key"
        pattern: "api[_-]?key['\"]?\\s*[:=]\\s*['\"][a-zA-Z0-9]{32,}"

      - name: "Private Key"
        pattern: "-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----"

    # Block on detection
    block_commit: true
```

### Scanning Commands

```bash
# Scan for secrets
proagents secrets scan

# Scan specific files
proagents secrets scan src/

# Scan git history
proagents secrets scan --history

# Check if clean
proagents secrets check
```

---

## Secret Rotation

### Rotation Policy

```yaml
secrets:
  rotation:
    enabled: true

    policies:
      # Rotate database passwords monthly
      database:
        interval: "30d"
        auto_rotate: true

      # Rotate API keys quarterly
      api_keys:
        interval: "90d"
        auto_rotate: false
        notify_before: "7d"

      # Never auto-rotate these
      encryption_keys:
        auto_rotate: false
        manual_review: true
```

### Rotation Commands

```bash
# Check rotation status
proagents secrets rotation-status

# Rotate specific secret
proagents secrets rotate DATABASE_PASSWORD

# Schedule rotation
proagents secrets schedule-rotation API_KEY --date "2024-03-01"
```

---

## Access Control

### Permission Model

```yaml
secrets:
  access:
    roles:
      developer:
        read:
          - "development/*"
        write: []

      devops:
        read:
          - "development/*"
          - "staging/*"
          - "production/*"
        write:
          - "development/*"
          - "staging/*"

      admin:
        read: ["*"]
        write: ["*"]
```

### Audit Logging

```yaml
secrets:
  audit:
    enabled: true
    log_access: true
    log_changes: true

    # Where to send logs
    destinations:
      - "cloudwatch"
      - "splunk"
```

---

## Best Practices

### Do's

```
✅ Use secret managers (not env files in production)
✅ Rotate secrets regularly
✅ Audit secret access
✅ Use different secrets per environment
✅ Encrypt secrets at rest and in transit
✅ Limit secret access by role
✅ Scan for leaked secrets
```

### Don'ts

```
❌ Commit secrets to git
❌ Log secrets in application logs
❌ Share secrets via Slack/email
❌ Use same secrets across environments
❌ Store secrets in code comments
❌ Hardcode secrets in source code
```

---

## Emergency Procedures

### Secret Leak Response

```bash
# 1. Immediately revoke the leaked secret
proagents secrets revoke LEAKED_SECRET

# 2. Rotate to new value
proagents secrets rotate LEAKED_SECRET --emergency

# 3. Audit access
proagents secrets audit LEAKED_SECRET --since "24h"

# 4. Scan for exposure
proagents secrets scan --history
```

### Leak Response Checklist

- [ ] Revoke compromised secret immediately
- [ ] Generate new secret
- [ ] Update all services using the secret
- [ ] Check for unauthorized access
- [ ] Scan git history for exposure
- [ ] Document incident
- [ ] Review access controls

---

## Commands Reference

```bash
# List secrets (names only, not values)
proagents secrets list

# Get secret value (requires auth)
proagents secrets get DATABASE_URL

# Set secret
proagents secrets set API_KEY "value" --env production

# Delete secret
proagents secrets delete OLD_SECRET

# Sync secrets to environment
proagents secrets sync --env staging

# Export for backup (encrypted)
proagents secrets export --encrypt --output secrets.enc
```
