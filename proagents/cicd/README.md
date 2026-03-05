# CI/CD Pipeline Templates

Pre-configured continuous integration and deployment pipelines.

---

## Overview

Ready-to-use CI/CD templates for popular platforms, integrated with ProAgents workflow.

## Documentation

| Document | Description |
|----------|-------------|
| [GitHub Actions](./github-actions.md) | GitHub CI/CD templates |
| [GitLab CI](./gitlab-ci.md) | GitLab pipeline templates |
| [Jenkins](./jenkins.md) | Jenkins pipeline templates |
| [Azure DevOps](./azure-devops.md) | Azure Pipelines templates |

---

## Quick Start

```bash
# Generate CI/CD config for your platform
proagents cicd init github-actions

# Validate pipeline config
proagents cicd validate

# Test pipeline locally
proagents cicd test
```

---

## GitHub Actions Template

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Security scan
        run: npx proagents security scan --ci

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
```

---

## GitLab CI Template

```yaml
# .gitlab-ci.yml
stages:
  - test
  - security
  - build
  - deploy

variables:
  NODE_VERSION: "20"

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm test -- --coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

security:
  stage: security
  script:
    - npx proagents security scan --ci
  allow_failure: false

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:staging:
  stage: deploy
  script:
    - npx proagents deploy --env staging
  environment:
    name: staging
  only:
    - develop

deploy:production:
  stage: deploy
  script:
    - npx proagents deploy --env production
  environment:
    name: production
  when: manual
  only:
    - main
```

---

## Pipeline Stages

### Standard Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────┐   ┌──────────┐   ┌───────┐   ┌────────┐       │
│  │  Test  │──▶│ Security │──▶│ Build │──▶│ Deploy │       │
│  └────────┘   └──────────┘   └───────┘   └────────┘       │
│       │            │             │            │            │
│       ▼            ▼             ▼            ▼            │
│    Lint         Scan         Compile     Staging          │
│    Unit         Audit        Bundle      Production       │
│    Coverage     SAST         Artifacts                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Stage Configuration

```yaml
# proagents.config.yaml
cicd:
  stages:
    test:
      parallel: true
      jobs:
        - lint
        - unit_tests
        - integration_tests

    security:
      required: true
      jobs:
        - dependency_audit
        - sast_scan
        - secret_scan

    build:
      jobs:
        - compile
        - bundle
        - docker_build

    deploy:
      environments:
        staging:
          auto_deploy: true
          branch: "develop"

        production:
          auto_deploy: false
          branch: "main"
          require_approval: true
```

---

## Branch Strategies

### GitFlow

```yaml
cicd:
  branching:
    strategy: "gitflow"

    branches:
      main:
        deploy_to: "production"
        protected: true

      develop:
        deploy_to: "staging"

      "feature/*":
        run_tests: true
        deploy_to: "preview"

      "hotfix/*":
        run_tests: true
        deploy_to: "staging"
```

### Trunk-Based

```yaml
cicd:
  branching:
    strategy: "trunk"

    branches:
      main:
        deploy_to: "production"
        require_pr: true

      "feature/*":
        run_tests: true
        preview_deploy: true
```

---

## Caching

### Dependency Caching

```yaml
# GitHub Actions
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# GitLab CI
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
```

---

## Notifications

```yaml
cicd:
  notifications:
    on_success:
      channels: ["slack:#deployments"]

    on_failure:
      channels: ["slack:#alerts"]
      mention: ["@oncall"]

    on_approval_needed:
      channels: ["slack:#deployments"]
```

---

## Commands

```bash
# Initialize CI/CD config
proagents cicd init [platform]

# Validate config
proagents cicd validate

# Run pipeline locally
proagents cicd run

# View pipeline status
proagents cicd status

# Trigger deployment
proagents cicd deploy staging
```

---

## Best Practices

1. **Fail Fast**: Run quick checks first
2. **Parallelize**: Run independent jobs in parallel
3. **Cache Dependencies**: Speed up builds
4. **Pin Versions**: Use specific tool versions
5. **Secure Secrets**: Never expose in logs
6. **Require Reviews**: For production deployments
7. **Monitor Pipelines**: Track build times and failures
