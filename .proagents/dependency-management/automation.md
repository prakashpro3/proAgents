# Dependency Update Automation

Automate dependency updates in CI/CD pipelines.

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/dependencies.yml
name: Dependency Updates

on:
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday
  workflow_dispatch:

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check for updates
        id: check
        run: |
          proagents deps check --ci --output updates.json

      - name: Run updates
        if: steps.check.outputs.has_updates == 'true'
        run: |
          proagents deps update --ci

      - name: Run tests
        run: npm test

      - name: Create PR
        if: success()
        run: |
          proagents deps create-pr \
            --title "chore(deps): weekly dependency updates" \
            --body-file updates.json
```

### GitLab CI

```yaml
# .gitlab-ci.yml
dependency-update:
  stage: maintenance
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
  script:
    - proagents deps check --ci
    - proagents deps update --ci
    - npm test
  after_script:
    - proagents deps create-mr
```

---

## Automation Configuration

### Update Schedule

```yaml
dependencies:
  automation:
    schedule:
      # Check frequency
      check: "0 6 * * *"  # Daily at 6 AM

      # Update frequency by type
      apply:
        patch: "0 2 * * *"     # Daily at 2 AM
        minor: "0 2 * * 1"     # Weekly Monday
        major: "manual"        # Manual only

    # Time windows
    windows:
      allowed:
        - days: ["mon", "tue", "wed", "thu"]
          hours: "02:00-06:00"
      blocked:
        - reason: "Release freeze"
          dates: "2024-03-01 to 2024-03-15"
```

### Automated Actions

```yaml
dependencies:
  automation:
    actions:
      # On update available
      on_update_available:
        - check_compatibility
        - run_security_scan

      # On patch update
      on_patch:
        - run_tests
        - auto_merge_if_passing
        - notify_on_failure

      # On minor update
      on_minor:
        - run_tests
        - create_pr
        - request_review

      # On major update
      on_major:
        - run_compatibility_check
        - generate_migration_guide
        - create_pr
        - require_approval
```

---

## PR Management

### Auto-Create PRs

```yaml
dependencies:
  automation:
    pull_requests:
      enabled: true

      # Branch naming
      branch_format: "deps/{{update_type}}-{{date}}"

      # PR template
      title: "chore(deps): {{summary}}"
      body_template: |
        ## Dependency Updates

        This PR updates the following dependencies:

        {{#each updates}}
        ### {{this.name}}: {{this.from}} → {{this.to}}

        - Type: {{this.type}}
        - Changelog: {{this.changelog_url}}
        {{#if this.breaking_changes}}
        - ⚠️ Breaking changes detected
        {{/if}}
        {{/each}}

        ## Checks
        - [ ] Tests passing
        - [ ] No breaking changes
        - [ ] Security scan clean

      # Labels
      labels:
        - "dependencies"
        - "automated"

      # Reviewers
      reviewers:
        - "@team/maintainers"
```

### Auto-Merge

```yaml
dependencies:
  automation:
    auto_merge:
      enabled: true

      # Conditions
      conditions:
        - all_checks_pass: true
        - no_breaking_changes: true
        - security_scan_clean: true

      # Wait time
      wait_before_merge: "1h"

      # Merge method
      method: "squash"

      # Only for
      types:
        - "patch"
```

---

## Testing Automation

### Test Pipeline

```yaml
dependencies:
  automation:
    testing:
      # Test stages
      stages:
        - name: "unit"
          command: "npm test"
          required: true

        - name: "integration"
          command: "npm run test:integration"
          required: true
          for_types: ["minor", "major"]

        - name: "e2e"
          command: "npm run test:e2e"
          required: false
          for_types: ["major"]

      # Retry on failure
      retry:
        enabled: true
        max_attempts: 3

      # Timeout
      timeout: "30m"
```

### Test Matrix

```yaml
dependencies:
  automation:
    testing:
      matrix:
        # Test across Node versions
        node_versions:
          - "18"
          - "20"
          - "22"

        # Test across OS
        os:
          - "ubuntu-latest"
          - "macos-latest"
```

---

## Rollback Automation

### Auto-Rollback

```yaml
dependencies:
  automation:
    rollback:
      # Auto-rollback on failure
      on_failure:
        enabled: true
        triggers:
          - "tests_failed"
          - "build_failed"
          - "deploy_failed"

      # Create rollback PR
      create_pr: true

      # Notify
      notify:
        - "slack:#dependencies"
```

### Rollback Commands

```bash
# Rollback last update
proagents deps rollback

# Rollback specific package
proagents deps rollback axios

# Rollback to specific version
proagents deps rollback axios@1.5.0
```

---

## Notifications

### Notification Configuration

```yaml
dependencies:
  automation:
    notifications:
      # On update available
      on_available:
        channels: ["slack:#deps"]
        summary: true

      # On PR created
      on_pr_created:
        channels: ["slack:#deps"]
        mention_reviewers: true

      # On auto-merge
      on_auto_merge:
        channels: ["slack:#deps"]

      # On failure
      on_failure:
        channels: ["slack:#deps-alerts"]
        priority: "high"
```

---

## Monitoring

### Update Metrics

```bash
proagents deps metrics

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Dependency Update Metrics - Last 30 Days                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Updates Processed: 45                                       │
│ ├── Patches: 32 (auto-merged: 28)                         │
│ ├── Minor: 10 (merged: 8, pending: 2)                     │
│ └── Major: 3 (merged: 1, blocked: 2)                      │
│                                                             │
│ Success Rate: 93%                                           │
│ Average PR Time: 4.2 hours                                 │
│                                                             │
│ Security Updates: 5 (all applied)                          │
│                                                             │
│ Blocked Updates:                                            │
│ ├── react 19.0.0 - Breaking changes                       │
│ └── webpack 6.0.0 - Requires migration                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Start Conservative**: Enable auto-merge for patches only
2. **Test Thoroughly**: Run full test suite before merge
3. **Monitor Metrics**: Track success rates and issues
4. **Review Majors**: Always manually review major updates
5. **Have Rollback Plan**: Auto-rollback on failures
6. **Notify Team**: Keep team informed of updates
