# GitLab CI Templates

Ready-to-use GitLab CI/CD pipeline configurations.

---

## Complete Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - test
  - security
  - build
  - deploy

variables:
  NODE_VERSION: "20"
  npm_config_cache: "$CI_PROJECT_DIR/.npm"

# Cache configuration
.node_cache: &node_cache
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - .npm/
      - node_modules/
    policy: pull-push

# Base template
.node_template: &node_template
  image: node:${NODE_VERSION}
  <<: *node_cache
  before_script:
    - npm ci --cache .npm --prefer-offline

# ============ VALIDATE STAGE ============
lint:
  stage: validate
  <<: *node_template
  script:
    - npm run lint
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

typecheck:
  stage: validate
  <<: *node_template
  script:
    - npm run type-check
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# ============ TEST STAGE ============
unit_tests:
  stage: test
  <<: *node_template
  script:
    - npm run test:unit -- --coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
      junit: junit.xml
    paths:
      - coverage/
    expire_in: 1 week

integration_tests:
  stage: test
  <<: *node_template
  services:
    - postgres:15
    - redis:7
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    DATABASE_URL: "postgresql://test:test@postgres:5432/test_db"
    REDIS_URL: "redis://redis:6379"
  script:
    - npm run test:integration

# ============ SECURITY STAGE ============
dependency_scan:
  stage: security
  <<: *node_template
  script:
    - npm audit --audit-level=high
  allow_failure: true

sast:
  stage: security
  image:
    name: "semgrep/semgrep"
    entrypoint: [""]
  script:
    - semgrep --config auto --json -o semgrep-report.json .
  artifacts:
    reports:
      sast: semgrep-report.json

secret_detection:
  stage: security
  image: trufflesecurity/trufflehog:latest
  script:
    - trufflehog git file://. --only-verified

# ============ BUILD STAGE ============
build:
  stage: build
  <<: *node_template
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

docker_build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# ============ DEPLOY STAGE ============
deploy_staging:
  stage: deploy
  image: alpine:latest
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK_STAGING
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"

deploy_production:
  stage: deploy
  image: alpine:latest
  environment:
    name: production
    url: https://example.com
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK_PRODUCTION
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual
  needs:
    - build
    - unit_tests
    - integration_tests
```

---

## Merge Request Pipeline

```yaml
# Optimized for merge requests
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

mr_checks:
  stage: validate
  script:
    - |
      # Check MR title format
      if [[ ! "$CI_MERGE_REQUEST_TITLE" =~ ^(feat|fix|docs|style|refactor|test|chore)\(.+\):.+ ]]; then
        echo "MR title must follow conventional commits format"
        exit 1
      fi
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

---

## Environment-Specific Variables

```yaml
# Per-environment configuration
.staging_vars: &staging_vars
  variables:
    ENVIRONMENT: staging
    API_URL: https://api-staging.example.com

.production_vars: &production_vars
  variables:
    ENVIRONMENT: production
    API_URL: https://api.example.com

deploy_staging:
  <<: *staging_vars
  # ... rest of config

deploy_production:
  <<: *production_vars
  # ... rest of config
```

---

## Scheduled Pipelines

```yaml
# Scheduled jobs
dependency_update:
  stage: validate
  script:
    - npx proagents deps check --ci
    - npx proagents deps update --create-mr
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
      variables:
        SCHEDULE_TYPE: "dependency_update"

nightly_security_scan:
  stage: security
  script:
    - npm audit
    - npx snyk test
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
      variables:
        SCHEDULE_TYPE: "security_scan"
```

---

## Include External Templates

```yaml
include:
  # GitLab templates
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml

  # Local templates
  - local: .gitlab/ci/test.yml
  - local: .gitlab/ci/deploy.yml

  # Remote templates
  - remote: https://example.com/ci-templates/node.yml
```

---

## Best Practices

1. **Use Caching**: Cache npm dependencies
2. **Parallel Jobs**: Run independent jobs in parallel
3. **Use Artifacts**: Pass data between stages
4. **Environment Protection**: Use protected environments
5. **Include Templates**: DRY with includes
6. **Rules Over Only/Except**: Use `rules:` for conditional jobs
