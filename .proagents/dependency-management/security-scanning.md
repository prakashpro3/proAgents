# Security Scanning

Automated vulnerability detection and remediation for dependencies.

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  Security Scanning Pipeline                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │  Scan   │──►│Evaluate │──►│ Notify  │──►│Remediate│    │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│       │             │             │             │          │
│       ▼             ▼             ▼             ▼          │
│  NPM Audit      Severity      Alerts       Auto-fix or    │
│  Snyk           Assessment    Tickets      PR for review  │
│  OWASP          Risk Score                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scanning Configuration

### Enable Scanning

```yaml
dependencies:
  security:
    enabled: true

    # Scan schedule
    schedule: "0 */6 * * *"  # Every 6 hours

    # Scan on these events
    scan_on:
      - "push"
      - "pr_open"
      - "dependency_update"
      - "schedule"

    # Scanners to use
    scanners:
      npm_audit: true
      snyk: true
      owasp_dependency_check: false
      github_advisories: true
```

### Scanner Configuration

```yaml
dependencies:
  security:
    scanners:
      # NPM Audit (built-in)
      npm_audit:
        enabled: true
        production_only: true  # Skip devDependencies

      # Snyk (requires API key)
      snyk:
        enabled: true
        api_key_env: "SNYK_API_KEY"
        severity_threshold: "medium"
        fail_on: "high"

      # GitHub Security Advisories
      github_advisories:
        enabled: true
        # Uses GITHUB_TOKEN automatically

      # OWASP Dependency Check
      owasp:
        enabled: false
        report_format: "HTML"
```

---

## Severity Levels

### Severity Classification

| Level | Description | Action |
|-------|-------------|--------|
| **Critical** | Actively exploited, RCE possible | Immediate fix required |
| **High** | Serious vulnerability | Fix within 24 hours |
| **Medium** | Moderate risk | Fix within 1 week |
| **Low** | Minor risk | Fix in next release |

### Actions by Severity

```yaml
dependencies:
  security:
    actions:
      critical:
        block_deploy: true
        auto_fix: true
        notify:
          - "slack:#security-alerts"
          - "pagerduty:security-oncall"
        create_ticket: true
        ticket_priority: "P1"

      high:
        block_deploy: true
        auto_fix: true
        notify:
          - "slack:#security-alerts"
        create_ticket: true
        ticket_priority: "P2"

      medium:
        block_deploy: false
        auto_fix: false
        create_pr: true
        notify:
          - "slack:#dependencies"

      low:
        block_deploy: false
        auto_fix: false
        batch: true  # Batch with regular updates
```

---

## Auto-Remediation

### Automatic Fixes

```yaml
dependencies:
  security:
    auto_remediation:
      enabled: true

      # Auto-fix if:
      conditions:
        - fix_available: true
        - breaking_change: false
        - tests_pass: true

      # For these severities
      severity: ["critical", "high"]

      # Create PR for review
      create_pr: true
      pr_template: |
        ## Security Update

        This PR fixes security vulnerabilities:

        {{#each vulnerabilities}}
        - **{{this.package}}**: {{this.severity}} - {{this.title}}
          - CVE: {{this.cve}}
          - Fixed in: {{this.fixed_version}}
        {{/each}}

        ### Testing
        - [ ] Unit tests pass
        - [ ] Integration tests pass
        - [ ] Manual testing completed
```

### Remediation Strategies

```yaml
dependencies:
  security:
    remediation:
      strategies:
        # Try upgrade first
        - type: "upgrade"
          priority: 1
          conditions:
            - "fix_available"
            - "semver_compatible"

        # Try patch if upgrade breaks
        - type: "patch"
          priority: 2
          conditions:
            - "patch_available"

        # Replace with alternative
        - type: "replace"
          priority: 3
          conditions:
            - "alternative_available"
          require_approval: true

        # Fallback: manual intervention
        - type: "manual"
          priority: 4
          notify: true
          create_ticket: true
```

---

## Vulnerability Database

### Sources

```yaml
dependencies:
  security:
    vulnerability_sources:
      # Primary sources
      - source: "npm_advisory"
        enabled: true
        update_frequency: "realtime"

      - source: "github_advisory"
        enabled: true
        update_frequency: "hourly"

      - source: "nvd"
        enabled: true
        update_frequency: "daily"

      - source: "snyk"
        enabled: true
        update_frequency: "realtime"

      # Custom advisory source
      - source: "internal"
        url: "https://security.company.com/advisories"
        enabled: true
```

### Ignore Rules

```yaml
dependencies:
  security:
    ignore:
      # Ignore specific vulnerability
      - id: "GHSA-xxxx-xxxx-xxxx"
        reason: "False positive, not exploitable in our context"
        expires: "2024-06-01"
        approved_by: "security-team"

      # Ignore package for dev-only
      - package: "jest"
        scope: "devDependencies"
        reason: "Dev-only, not in production bundle"

      # Ignore low severity for specific package
      - package: "lodash"
        severity: ["low"]
        reason: "Low impact, will update in next sprint"
        expires: "2024-02-01"
```

---

## Reporting

### Security Report

```bash
proagents deps audit

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Security Audit Report                                       │
├─────────────────────────────────────────────────────────────┤
│ Scanned: 245 packages                                       │
│ Vulnerabilities Found: 4                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Critical (1):                                               │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ lodash < 4.17.21                                        ││
│ │ Prototype Pollution                                      ││
│ │ CVE: CVE-2021-23337                                     ││
│ │ Fix: Upgrade to 4.17.21                                 ││
│ │ Status: Auto-fix available                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ High (1):                                                   │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ axios < 1.3.4                                           ││
│ │ Server-Side Request Forgery                             ││
│ │ CVE: CVE-2023-45857                                     ││
│ │ Fix: Upgrade to 1.3.4                                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Medium (2):                                                 │
│ • json5 < 2.2.2 - Prototype Pollution                      │
│ • minimatch < 3.0.5 - ReDoS                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Actions:                                                    │
│ • Run 'proagents deps fix' to auto-fix 3 vulnerabilities  │
│ • 1 vulnerability requires manual review                   │
└─────────────────────────────────────────────────────────────┘
```

### Compliance Report

```bash
proagents deps audit --compliance

# Generates report for:
# - SOC 2 compliance
# - OWASP Top 10 coverage
# - License compliance
# - Supply chain security
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 6 * * *'

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Security Scan
        run: proagents deps audit --ci

      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.json
```

### Block Merge on Vulnerabilities

```yaml
dependencies:
  security:
    ci:
      # Block PR merge if vulnerabilities found
      block_on:
        severity: ["critical", "high"]

      # Allow with exceptions
      allow_with_exception:
        severity: ["medium", "low"]
        require_approval: true
        approvers: ["@security-team"]
```

---

## Notifications

### Alert Configuration

```yaml
dependencies:
  security:
    notifications:
      # New vulnerability detected
      on_vulnerability:
        channels:
          critical: ["pagerduty", "slack:#security"]
          high: ["slack:#security"]
          medium: ["slack:#dependencies"]

        include:
          - severity
          - affected_packages
          - fix_available
          - cve_details

      # Auto-fix applied
      on_auto_fix:
        channels: ["slack:#dependencies"]

      # Manual action required
      on_manual_required:
        channels: ["slack:#security", "email:security@company.com"]
```

---

## Best Practices

1. **Scan Frequently**: At least daily for production dependencies
2. **Act on Critical/High**: Fix within SLA
3. **Review Ignores**: Periodically review ignored vulnerabilities
4. **Monitor Supply Chain**: Watch for compromised packages
5. **Keep Scanners Updated**: Use latest vulnerability databases
6. **Document Exceptions**: Always document why vulnerabilities are ignored
7. **Integrate in CI/CD**: Block insecure code from merging
