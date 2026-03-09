# Environment Configuration

Managing configuration across different environments.

---

## Configuration Hierarchy

```
┌─────────────────────────────────────────┐
│           Default Config                │ (lowest priority)
├─────────────────────────────────────────┤
│        Environment Config               │
├─────────────────────────────────────────┤
│         Secret Manager                  │
├─────────────────────────────────────────┤
│       Environment Variables             │ (highest priority)
└─────────────────────────────────────────┘
```

---

## Configuration Files

### File Structure

```
/config/
├── default.yaml           # Base configuration
├── development.yaml       # Development overrides
├── staging.yaml           # Staging overrides
├── production.yaml        # Production overrides
└── local.yaml             # Local overrides (gitignored)
```

### Default Configuration

```yaml
# config/default.yaml
app:
  name: "MyApp"
  version: "${npm_package_version}"
  port: 3000

api:
  timeout: 30000
  retries: 3
  retry_delay: 1000

database:
  pool:
    min: 2
    max: 10
  timeout: 5000

cache:
  ttl: 3600
  prefix: "app:"

logging:
  level: "info"
  format: "json"

features:
  rate_limiting: true
  caching: true
  compression: true
```

### Environment-Specific Overrides

```yaml
# config/development.yaml
app:
  port: 3001

database:
  pool:
    max: 5

logging:
  level: "debug"
  format: "pretty"

features:
  mock_external_services: true
  debug_endpoints: true
```

```yaml
# config/production.yaml
app:
  port: 8080

database:
  pool:
    min: 5
    max: 50

cache:
  ttl: 7200

features:
  rate_limiting: true
  strict_ssl: true
  hsts: true
```

---

## Environment Variables

### Variable Naming Convention

```bash
# Application settings
APP_NAME=MyApp
APP_PORT=3000
APP_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=appuser
DB_PASSWORD=secret

# External services
REDIS_URL=redis://localhost:6379
STRIPE_API_KEY=sk_live_xxx
SENDGRID_API_KEY=SG.xxx

# Feature flags
FEATURE_NEW_UI=true
FEATURE_BETA_API=false
```

### Environment Variable Loading

```yaml
# proagents.config.yaml
configuration:
  env_loading:
    # Load order
    order:
      - ".env"                    # Base env file
      - ".env.${NODE_ENV}"        # Environment-specific
      - ".env.local"              # Local overrides (gitignored)

    # Variable expansion
    expand_variables: true

    # Required variables
    required:
      - "DATABASE_URL"
      - "JWT_SECRET"
      - "APP_ENV"

    # Validation
    validate:
      APP_PORT:
        type: "number"
        min: 1024
        max: 65535

      APP_ENV:
        enum: ["development", "staging", "production"]

      LOG_LEVEL:
        enum: ["debug", "info", "warn", "error"]
```

---

## Secret Management Integration

### AWS Secrets Manager

```yaml
configuration:
  secrets:
    provider: "aws-secrets-manager"

    # Secret mappings
    mappings:
      DATABASE_URL: "myapp/${env}/database/url"
      JWT_SECRET: "myapp/${env}/auth/jwt-secret"
      STRIPE_KEY: "myapp/${env}/payments/stripe-key"

    # Caching
    cache:
      enabled: true
      ttl: 300  # 5 minutes

    # Auto-refresh
    refresh:
      enabled: true
      interval: 3600  # 1 hour
```

### HashiCorp Vault

```yaml
configuration:
  secrets:
    provider: "vault"
    address: "https://vault.company.com"
    auth_method: "kubernetes"

    mappings:
      DATABASE_URL: "secret/data/myapp/${env}/database"
      API_KEYS: "secret/data/myapp/${env}/api-keys"

    # Dynamic secrets
    dynamic:
      database:
        role: "myapp-${env}"
        ttl: "1h"
```

### Environment-Specific Secrets

```yaml
configuration:
  secrets:
    environments:
      development:
        prefix: "dev/"
        allow_local_override: true

      staging:
        prefix: "staging/"
        allow_local_override: false

      production:
        prefix: "prod/"
        allow_local_override: false
        require_approval: true
```

---

## Configuration Validation

### Schema Definition

```yaml
# config/schema.yaml
$schema: "http://json-schema.org/draft-07/schema#"
type: object
required:
  - app
  - database

properties:
  app:
    type: object
    required: [name, port]
    properties:
      name:
        type: string
        minLength: 1
      port:
        type: integer
        minimum: 1024
        maximum: 65535

  database:
    type: object
    required: [pool]
    properties:
      pool:
        type: object
        properties:
          min:
            type: integer
            minimum: 1
          max:
            type: integer
            minimum: 1
```

### Validation Commands

```bash
# Validate configuration
proagents config validate

# Validate specific environment
proagents config validate --env production

# Show resolved configuration
proagents config show --env staging

# Check for sensitive values
proagents config audit
```

---

## Configuration Access Patterns

### Application Code

```typescript
// config/index.ts
import { loadConfig } from '@proagents/config';

const config = loadConfig({
  env: process.env.NODE_ENV,
  secretsProvider: 'aws-secrets-manager',
});

export default config;

// Usage
import config from './config';

const dbConnection = createConnection({
  host: config.get('database.host'),
  port: config.get('database.port'),
  username: config.get('database.user'),
  password: config.getSecret('database.password'),
});
```

### Type-Safe Configuration

```typescript
// config/types.ts
interface AppConfig {
  app: {
    name: string;
    port: number;
    env: 'development' | 'staging' | 'production';
  };
  database: {
    host: string;
    port: number;
    name: string;
    pool: {
      min: number;
      max: number;
    };
  };
  features: {
    rateLimiting: boolean;
    caching: boolean;
  };
}

// config/index.ts
const config = loadConfig<AppConfig>({ ... });

// Type-safe access
config.app.port;  // number
config.features.rateLimiting;  // boolean
```

---

## Configuration Changes

### Change Tracking

```yaml
configuration:
  versioning:
    enabled: true

    # Track all changes
    track:
      - config_changes
      - secret_rotations
      - env_var_updates

    # Audit log
    audit:
      destination: "cloudwatch"
      retention: "2 years"
```

### Safe Configuration Updates

```bash
# Preview configuration change
proagents config set app.port 8080 --dry-run

# Apply with approval
proagents config set app.port 8080 --require-approval

# Rollback configuration
proagents config rollback --to v1.2.3

# View change history
proagents config history --last 10
```

---

## Commands

```bash
# Show configuration
proagents config show
proagents config show --env production

# Get specific value
proagents config get database.pool.max

# Set configuration
proagents config set logging.level debug

# Compare environments
proagents config diff staging production

# Export configuration
proagents config export --env staging > staging-config.yaml

# Import configuration
proagents config import staging-config.yaml --env staging

# Validate all configs
proagents config validate --all
```

---

## Best Practices

1. **Never Commit Secrets**: Use secret managers for sensitive data
2. **Environment Parity**: Keep configs similar across environments
3. **Validate Early**: Fail fast on invalid configuration
4. **Type Safety**: Use typed configuration access
5. **Audit Changes**: Track all configuration modifications
6. **Document Differences**: Explain why environments differ
7. **Default Sensibly**: Provide safe defaults for all values
