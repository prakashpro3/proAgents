# Coordinated Deployments

Deploy multiple projects in the correct order with dependency awareness.

---

## Overview

Coordinated deployment ensures projects are deployed in the right order, respecting dependencies and maintaining system stability.

```
┌─────────────────────────────────────────────────────────────┐
│                  Deployment Pipeline                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: Libraries                                          │
│  ┌─────────────┐  ┌─────────────┐                         │
│  │shared-utils │  │             │                         │
│  └─────────────┘  └─────────────┘                         │
│        │                                                   │
│        ▼                                                   │
│  Step 2: Shared Components                                 │
│  ┌─────────────┐  ┌─────────────┐                         │
│  │  shared-ui  │  │             │                         │
│  └─────────────┘  └─────────────┘                         │
│        │                                                   │
│        ▼                                                   │
│  Step 3: Backend                                           │
│  ┌─────────────┐                                          │
│  │ api-gateway │                                          │
│  └─────────────┘                                          │
│        │                                                   │
│        ▼                                                   │
│  Step 4: Clients (Parallel)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   web-app   │  │ mobile-ios  │  │mobile-android│       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Configuration

### Basic Configuration

```yaml
# proagents.workspace.yaml

workspace:
  deployment:
    # Deployment order (respects dependencies automatically)
    order: auto  # or explicit list

    # Environments
    environments:
      staging:
        auto_deploy: true
        parallel_clients: true

      production:
        auto_deploy: false
        approval_required: true
        parallel_clients: false  # Deploy one at a time
```

### Advanced Configuration

```yaml
workspace:
  deployment:
    # Explicit deployment order
    order:
      - group: "foundation"
        projects: [shared-utils]
        parallel: false

      - group: "shared"
        projects: [shared-ui, api-gateway]
        parallel: true

      - group: "clients"
        projects: [web-app, mobile-ios, mobile-android]
        parallel: true

    # Environment-specific settings
    environments:
      staging:
        auto_deploy: true
        trigger:
          - push_to_develop
        health_check_timeout: 300
        rollback_on_failure: true

      production:
        auto_deploy: false
        trigger:
          - manual
          - release_tag
        approval:
          required: true
          approvers:
            - tech-lead
            - devops
        deployment_window:
          days: [monday, tuesday, wednesday, thursday]
          hours: "09:00-17:00"
          timezone: "America/New_York"
        canary:
          enabled: true
          percentage: 5
          duration: "15m"
        rollback_on_failure: true

    # Health checks
    health_checks:
      enabled: true
      timeout: 300  # seconds
      interval: 10

    # Notifications
    notifications:
      slack:
        channel: "#deployments"
        on: [start, success, failure, rollback]
```

---

## Deployment Commands

### Deploy All Projects

```bash
# Deploy to staging
proagents workspace deploy staging

# Deploy to production
proagents workspace deploy production

# Dry run
proagents workspace deploy staging --dry-run
```

### Deploy Specific Projects

```bash
# Deploy single project
proagents workspace deploy staging --project web-app

# Deploy with dependencies
proagents workspace deploy staging --project web-app --with-deps

# Deploy multiple projects
proagents workspace deploy staging --projects web-app,api-gateway
```

### Deployment Options

```bash
proagents workspace deploy production \
  --version v2.0.0 \
  --skip-tests \
  --canary 10 \
  --rollback-on-failure \
  --notify-slack
```

---

## Deployment Workflow

### Pre-Deployment

```yaml
deployment:
  pre_deploy:
    steps:
      - name: "Run tests"
        command: "proagents test --all"
        required: true

      - name: "Security scan"
        command: "proagents security scan"
        required: true

      - name: "Build all projects"
        command: "proagents workspace build --ordered"
        required: true

      - name: "Create backup"
        command: "proagents backup create --label pre-deploy"
        required: true
```

### Deployment Execution

```
┌─────────────────────────────────────────────────────────────┐
│ Deployment: staging                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Pre-Deploy Checks:                                          │
│ ✅ Tests passed                                             │
│ ✅ Security scan passed                                     │
│ ✅ Build completed                                          │
│ ✅ Backup created                                           │
│                                                             │
│ Deployment Progress:                                        │
│                                                             │
│ Step 1: Foundation                                          │
│ ├── shared-utils: ✅ Deployed (v1.2.3)                     │
│ │   └── Health check: ✅ Passed                            │
│                                                             │
│ Step 2: Shared                                              │
│ ├── shared-ui: ✅ Deployed (v2.0.1)                        │
│ │   └── Health check: ✅ Passed                            │
│ ├── api-gateway: 🔄 Deploying...                           │
│ │   └── Progress: 60%                                      │
│                                                             │
│ Step 3: Clients                                             │
│ ├── web-app: ⏳ Waiting                                    │
│ ├── mobile-ios: ⏳ Waiting                                 │
│ └── mobile-android: ⏳ Waiting                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Post-Deployment

```yaml
deployment:
  post_deploy:
    steps:
      - name: "Run smoke tests"
        command: "proagents test smoke"
        required: true

      - name: "Verify health"
        command: "proagents health check --all"
        required: true

      - name: "Update status page"
        command: "proagents status-page update"
        required: false

      - name: "Notify team"
        command: "proagents notify --channel deployments"
        required: false
```

---

## Rollback Procedures

### Automatic Rollback

```yaml
deployment:
  rollback:
    auto:
      enabled: true
      triggers:
        - health_check_failure
        - error_rate_spike
        - response_time_degradation

    strategy: "reverse_order"  # Rollback in reverse deployment order
```

### Manual Rollback

```bash
# Rollback entire deployment
proagents workspace rollback staging

# Rollback specific project
proagents workspace rollback staging --project api-gateway

# Rollback to specific version
proagents workspace rollback staging --to v1.9.0
```

### Rollback Order

```
Deployment Order:        Rollback Order:
1. shared-utils          4. web-app, mobile-*
2. shared-ui            3. api-gateway
3. api-gateway          2. shared-ui
4. web-app, mobile-*    1. shared-utils
```

---

## Canary Deployments

### Configuration

```yaml
deployment:
  canary:
    enabled: true
    stages:
      - percentage: 5
        duration: "10m"
        auto_promote: true
        rollback_threshold:
          error_rate: 2

      - percentage: 25
        duration: "15m"
        auto_promote: true
        rollback_threshold:
          error_rate: 1

      - percentage: 50
        duration: "30m"
        auto_promote: false  # Require manual promotion

      - percentage: 100
        # Full deployment
```

### Canary Commands

```bash
# Start canary deployment
proagents workspace deploy production --canary

# Check canary status
proagents workspace canary status

# Promote canary
proagents workspace canary promote

# Abort canary
proagents workspace canary abort
```

---

## Blue-Green Deployments

### Configuration

```yaml
deployment:
  strategy: "blue-green"

  blue_green:
    # Health check before switch
    verify_before_switch: true

    # Keep old environment running
    keep_old_duration: "1h"

    # Switch mechanism
    switch_method: "load_balancer"  # or dns, container
```

### Blue-Green Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Blue-Green Deployment                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Current (Blue): v1.9.0 ──────► Traffic                     │
│                                                             │
│ 1. Deploy to Green                                          │
│    New (Green): v2.0.0                                      │
│                                                             │
│ 2. Verify Green                                             │
│    ✅ Health checks passed                                 │
│    ✅ Smoke tests passed                                   │
│                                                             │
│ 3. Switch Traffic                                           │
│    Blue: v1.9.0 (standby)                                  │
│    Green: v2.0.0 ──────────► Traffic                       │
│                                                             │
│ 4. Cleanup (after 1h)                                      │
│    Remove Blue environment                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Approvals

### Approval Configuration

```yaml
deployment:
  environments:
    production:
      approval:
        required: true
        min_approvers: 2
        approvers:
          - group: "tech-leads"
            required: true
          - group: "devops"
            required: true
          - group: "product"
            required: false

        timeout: "24h"
        reminder: "4h"
```

### Approval Workflow

```bash
# Request approval
proagents workspace deploy production --request-approval

# View pending approvals
proagents workspace approvals list

# Approve deployment
proagents workspace approve deploy-123

# Reject deployment
proagents workspace reject deploy-123 --reason "Not ready"
```

### Approval Notification

```
🔔 Deployment Approval Requested

Deployment: production v2.0.0
Requested by: developer@company.com
Projects: shared-ui, api-gateway, web-app

Changes:
• shared-ui: 5 commits, 12 files
• api-gateway: 3 commits, 8 files
• web-app: 7 commits, 15 files

[Approve] [Reject] [View Changes]
```

---

## Monitoring Deployments

### Deployment Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Deployment Monitor                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Current Deployment: production v2.0.0                       │
│ Status: In Progress                                         │
│ Started: 10:30 AM (15 minutes ago)                         │
│                                                             │
│ Progress:                                                   │
│ ████████████░░░░░░░░ 60%                                   │
│                                                             │
│ Metrics:                                                    │
│ • Error Rate: 0.1% (normal)                                │
│ • Response Time: 150ms (normal)                            │
│ • Traffic: 1,234 req/min                                   │
│                                                             │
│ Stages:                                                     │
│ ✅ Pre-deploy checks                                       │
│ ✅ Deploy: shared-utils                                    │
│ ✅ Deploy: shared-ui                                       │
│ 🔄 Deploy: api-gateway (in progress)                       │
│ ⏳ Deploy: clients                                         │
│ ⏳ Post-deploy verification                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Real-time Alerts

```yaml
deployment:
  alerts:
    - type: "error_rate"
      threshold: 5
      action: "pause_and_notify"

    - type: "deployment_stuck"
      timeout: "15m"
      action: "notify"

    - type: "health_check_failure"
      consecutive: 3
      action: "rollback"
```

---

## Best Practices

1. **Test Before Deploy**: Always run tests before deployment
2. **Deploy to Staging First**: Never deploy directly to production
3. **Use Canary**: Gradually roll out changes
4. **Monitor Closely**: Watch metrics during deployment
5. **Have Rollback Plan**: Always be ready to rollback
6. **Document Changes**: Keep deployment changelog
7. **Communicate**: Notify teams before/after deployment
8. **Schedule Wisely**: Deploy during low-traffic periods
