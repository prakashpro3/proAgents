# Environment Management

Configure and manage development, staging, and production environments.

---

## Overview

Consistent environment configuration across development, staging, and production.

## Documentation

| Document | Description |
|----------|-------------|
| [Environment Setup](./setup.md) | Setting up environments |
| [Configuration](./configuration.md) | Environment-specific config |
| [Promotion](./promotion.md) | Promoting between environments |

---

## Environment Types

### Standard Environments

| Environment | Purpose | Data |
|-------------|---------|------|
| `development` | Local development | Mock/seed data |
| `staging` | Pre-production testing | Production-like |
| `production` | Live users | Real data |

### Optional Environments

| Environment | Purpose |
|-------------|---------|
| `test` | Automated testing |
| `preview` | PR previews |
| `sandbox` | Experimentation |

---

## Configuration

### Environment Files

```
your-project/
├── .env                    # Shared defaults
├── .env.development        # Development overrides
├── .env.staging            # Staging overrides
├── .env.production         # Production overrides
└── .env.local              # Local overrides (gitignored)
```

### ProAgents Config

```yaml
# proagents.config.yaml
environments:
  default: "development"

  development:
    api_url: "http://localhost:3000"
    debug: true
    mocks: true

  staging:
    api_url: "https://staging-api.example.com"
    debug: true
    mocks: false

  production:
    api_url: "https://api.example.com"
    debug: false
    mocks: false
```

---

## Environment Variables

### Variable Categories

```yaml
environments:
  variables:
    # Public (safe to expose)
    public:
      - "API_URL"
      - "APP_NAME"
      - "FEATURE_FLAGS"

    # Private (server-only)
    private:
      - "DATABASE_URL"
      - "API_KEY"
      - "JWT_SECRET"

    # Sensitive (encrypted)
    sensitive:
      - "AWS_SECRET_KEY"
      - "STRIPE_SECRET"
```

### Validation

```yaml
environments:
  validation:
    required:
      all:
        - "API_URL"
        - "NODE_ENV"
      production:
        - "DATABASE_URL"
        - "REDIS_URL"

    format:
      API_URL: "url"
      PORT: "number"
      DEBUG: "boolean"
```

---

## Commands

```bash
# Check current environment
proagents env current

# List all environments
proagents env list

# Switch environment
proagents env use staging

# Validate environment
proagents env validate

# Compare environments
proagents env diff staging production

# Export environment
proagents env export staging --output .env.staging
```

---

## Environment Promotion

### Promotion Flow

```
development → staging → production
     ↓           ↓          ↓
   Test        QA       Release
```

### Promotion Configuration

```yaml
environments:
  promotion:
    development_to_staging:
      requires:
        - "all_tests_pass"
        - "code_review_approved"

    staging_to_production:
      requires:
        - "all_tests_pass"
        - "qa_approved"
        - "security_scan_clean"

      approval:
        required: true
        approvers: ["tech_lead", "product_manager"]
```

### Promote Command

```bash
# Promote to staging
proagents env promote staging

# Promote to production (with approval)
proagents env promote production --request-approval
```

---

## Environment Parity

### Keeping Environments in Sync

```yaml
environments:
  parity:
    # Sync these between environments
    sync:
      - "database_schema"
      - "feature_flags"
      - "config_structure"

    # Detect drift
    drift_detection:
      enabled: true
      schedule: "daily"
      notify: "#devops"
```

### Drift Report

```
┌─────────────────────────────────────────────────────────────┐
│ Environment Drift Report                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Comparing: staging ↔ production                             │
│                                                             │
│ Schema Differences:                                         │
│ ├── Missing in prod: users.preferences (column)            │
│ └── Extra in prod: legacy_table (table)                    │
│                                                             │
│ Config Differences:                                         │
│ ├── FEATURE_X: staging=true, prod=false                    │
│ └── MAX_CONNECTIONS: staging=10, prod=100                  │
│                                                             │
│ Recommendation: Run migrations before next deploy           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Parity**: Keep environments as similar as possible
2. **Never Share Secrets**: Different secrets per environment
3. **Validate Early**: Check env vars on startup
4. **Document Requirements**: List required variables
5. **Use Defaults Wisely**: Safe defaults for development
6. **Protect Production**: Require approvals for prod changes
7. **Monitor Drift**: Regularly check for differences
