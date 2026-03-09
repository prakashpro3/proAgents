# Environment Setup

Guide to setting up and configuring different environments.

---

## Environment Types

| Environment | Purpose | Data | Access |
|-------------|---------|------|--------|
| **Local** | Developer workstation | Mock/seed data | Individual |
| **Development** | Shared development | Synthetic data | Team |
| **Staging** | Pre-production testing | Production-like | Team + QA |
| **Production** | Live system | Real data | Restricted |

---

## Local Environment Setup

### Prerequisites

```bash
# Required tools
node --version    # >= 18.x
npm --version     # >= 9.x
docker --version  # >= 24.x
git --version     # >= 2.x
```

### Quick Start

```bash
# Clone repository
git clone ${REPO_URL}
cd project

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start local services
docker-compose up -d

# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Start development server
npm run dev
```

### Local Environment File

```bash
# .env.local
NODE_ENV=development

# Application
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/app_dev

# Redis
REDIS_URL=redis://localhost:6379

# Auth (development keys)
JWT_SECRET=dev-secret-key-change-in-production
SESSION_SECRET=dev-session-secret

# External Services (use mocks)
USE_MOCK_SERVICES=true
MOCK_PAYMENT_GATEWAY=true

# Debug
DEBUG=app:*
LOG_LEVEL=debug
```

### Docker Compose for Local

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: app_dev
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI

volumes:
  postgres_data:
```

---

## Development Environment Setup

### Cloud Development Environment

```yaml
# proagents.config.yaml
environments:
  development:
    type: "cloud"
    provider: "aws"  # or gcp, azure

    infrastructure:
      compute:
        type: "ecs-fargate"
        cpu: 256
        memory: 512

      database:
        type: "rds-postgres"
        instance: "db.t3.micro"
        storage: 20

      cache:
        type: "elasticache-redis"
        node_type: "cache.t3.micro"

    networking:
      vpc: "dev-vpc"
      subnets: ["dev-subnet-1", "dev-subnet-2"]
```

### Development Environment Variables

```bash
# .env.development
NODE_ENV=development

# Application
APP_URL=https://dev.app.example.com
API_URL=https://dev-api.app.example.com

# Database (from secrets manager)
DATABASE_URL=${aws:secretsmanager:dev/database/url}

# External Services
STRIPE_API_KEY=${aws:secretsmanager:dev/stripe/key}
SENDGRID_API_KEY=${aws:secretsmanager:dev/sendgrid/key}

# Feature Flags
FEATURE_FLAGS_ENV=development
ENABLE_DEBUG_ENDPOINTS=true
```

### Development Access

```yaml
environments:
  development:
    access:
      allowed_roles: ["developer", "reviewer", "admin"]
      vpn_required: false
      ip_whitelist: ["office-ip-range"]

    monitoring:
      log_level: "debug"
      metrics_enabled: true
      error_tracking: true
```

---

## Staging Environment Setup

### Staging Configuration

```yaml
environments:
  staging:
    type: "cloud"
    provider: "aws"

    infrastructure:
      compute:
        type: "ecs-fargate"
        cpu: 512
        memory: 1024
        replicas: 2

      database:
        type: "rds-postgres"
        instance: "db.t3.small"
        storage: 50
        multi_az: false

      cache:
        type: "elasticache-redis"
        node_type: "cache.t3.small"

    # Mirror production settings
    settings:
      ssl_enabled: true
      rate_limiting: true
      cdn_enabled: true
```

### Staging Data Strategy

```yaml
environments:
  staging:
    data:
      strategy: "production_subset"

      # Anonymize production data
      anonymization:
        enabled: true
        rules:
          - table: "users"
            fields:
              email: "faker.email"
              name: "faker.name"
              phone: "mask"

          - table: "payments"
            fields:
              card_number: "mask"
              cvv: "remove"

      # Refresh schedule
      refresh:
        schedule: "weekly"
        day: "sunday"
        time: "02:00"
```

### Staging Environment Variables

```bash
# .env.staging
NODE_ENV=staging

# Application
APP_URL=https://staging.app.example.com
API_URL=https://staging-api.app.example.com

# Database
DATABASE_URL=${aws:secretsmanager:staging/database/url}

# External Services (sandbox/test accounts)
STRIPE_API_KEY=${aws:secretsmanager:staging/stripe/key}
STRIPE_WEBHOOK_SECRET=${aws:secretsmanager:staging/stripe/webhook}

# Feature Flags
FEATURE_FLAGS_ENV=staging
ENABLE_DEBUG_ENDPOINTS=false

# Monitoring
SENTRY_DSN=${aws:secretsmanager:staging/sentry/dsn}
DATADOG_API_KEY=${aws:secretsmanager:staging/datadog/key}
```

---

## Production Environment Setup

### Production Infrastructure

```yaml
environments:
  production:
    type: "cloud"
    provider: "aws"
    region: "us-east-1"

    infrastructure:
      compute:
        type: "ecs-fargate"
        cpu: 1024
        memory: 2048
        replicas:
          min: 3
          max: 10
        autoscaling:
          cpu_threshold: 70
          memory_threshold: 80

      database:
        type: "rds-postgres"
        instance: "db.r5.large"
        storage: 500
        multi_az: true
        read_replicas: 2
        backup_retention: 30

      cache:
        type: "elasticache-redis"
        node_type: "cache.r5.large"
        cluster_mode: true
        replicas: 2

    # High availability
    ha:
      multi_region: true
      dr_region: "us-west-2"
      failover_mode: "automatic"

    # Security
    security:
      waf_enabled: true
      ddos_protection: true
      encryption_at_rest: true
      encryption_in_transit: true
```

### Production Access Controls

```yaml
environments:
  production:
    access:
      allowed_roles: ["deployer", "admin"]
      vpn_required: true
      mfa_required: true
      ip_whitelist: ["vpn-exit-ips"]

      # Audit all access
      audit:
        enabled: true
        log_all_commands: true
        retention: "2 years"

    # Deployment controls
    deployment:
      require_approval: true
      approvers: ["tech-lead", "sre"]
      deployment_window:
        days: ["tuesday", "wednesday", "thursday"]
        hours: ["10:00", "16:00"]
        timezone: "America/New_York"
```

---

## Environment Setup Commands

```bash
# Setup new environment
proagents env setup development

# Verify environment configuration
proagents env verify staging

# Sync environment variables
proagents env sync --from development --to staging

# Show environment status
proagents env status production

# Compare environments
proagents env diff staging production

# Export environment config
proagents env export staging > staging-config.yaml
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Database connection failed | Wrong credentials | Verify DATABASE_URL |
| Service unavailable | Container not running | Check docker-compose logs |
| SSL errors | Certificate mismatch | Update certificates |
| Slow performance | Resource limits | Increase CPU/memory |

### Health Checks

```bash
# Check all services
proagents env health development

# Check specific service
proagents env health staging --service api

# Detailed diagnostics
proagents env diagnose production
```

---

## Best Practices

1. **Parity**: Keep environments as similar as possible
2. **Secrets**: Never commit secrets to version control
3. **Infrastructure as Code**: Version control all configurations
4. **Documentation**: Document environment-specific quirks
5. **Access Control**: Restrict production access
6. **Monitoring**: Monitor all environments, not just production
