# Secret Scanning

Detecting exposed secrets in code and configurations.

---

## Scanning Types

| Type | When | Purpose |
|------|------|---------|
| **Pre-commit** | Before commit | Prevent secrets from entering repo |
| **CI/CD** | On push/PR | Catch secrets that slip through |
| **Repository** | Scheduled | Find historical secrets |
| **Runtime** | Continuous | Detect secrets in logs/outputs |

---

## Configuration

### Basic Setup

```yaml
# proagents.config.yaml
secrets:
  scanning:
    enabled: true

    # Scan stages
    stages:
      pre_commit: true
      ci_cd: true
      repository: true
      runtime: true

    # Patterns to detect
    patterns:
      builtin:
        - "aws_access_key"
        - "aws_secret_key"
        - "github_token"
        - "slack_webhook"
        - "stripe_api_key"
        - "google_api_key"
        - "jwt_token"
        - "private_key"
        - "password_in_url"

    # Actions on detection
    actions:
      pre_commit:
        block: true
        message: "Potential secret detected. Please remove before committing."

      ci_cd:
        fail_build: true
        notify: ["security@company.com"]

      repository:
        create_issue: true
        notify: ["security@company.com"]
```

### Custom Patterns

```yaml
secrets:
  scanning:
    custom_patterns:
      # Company-specific patterns
      - name: "internal_api_key"
        pattern: 'MYCOMPANY_[A-Z0-9]{32}'
        description: "Internal API key"
        severity: "high"

      - name: "database_connection"
        pattern: '(mysql|postgres|mongodb)://[^:]+:[^@]+@'
        description: "Database connection string with credentials"
        severity: "critical"

      - name: "internal_token"
        pattern: 'int_[a-zA-Z0-9]{40}'
        description: "Internal service token"
        severity: "high"

    # Entropy-based detection
    entropy:
      enabled: true
      min_length: 20
      threshold: 4.5  # Shannon entropy threshold
```

---

## Pre-commit Scanning

### Git Hooks

```yaml
secrets:
  scanning:
    pre_commit:
      enabled: true

      # Hook configuration
      hook:
        type: "pre-commit"
        tool: "gitleaks"

      # Files to scan
      include:
        - "**/*.ts"
        - "**/*.js"
        - "**/*.json"
        - "**/*.yaml"
        - "**/*.yml"
        - "**/*.env*"

      # Files to skip
      exclude:
        - "node_modules/**"
        - "*.test.ts"
        - "**/*.min.js"

      # Allow specific patterns
      allowlist:
        - pattern: "EXAMPLE_API_KEY"
          reason: "Documentation example"
        - path: "docs/examples/**"
          reason: "Example files"
```

### Pre-commit Config

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  - repo: local
    hooks:
      - id: proagents-secret-scan
        name: ProAgents Secret Scan
        entry: proagents secrets scan --staged
        language: system
        pass_filenames: false
```

---

## CI/CD Scanning

### GitHub Actions

```yaml
# .github/workflows/security.yml
name: Secret Scanning

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Run TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

      - name: ProAgents Secret Scan
        run: |
          npx proagents secrets scan --ci
        env:
          PROAGENTS_FAIL_ON_SECRETS: true
```

### GitLab CI

```yaml
# .gitlab-ci.yml
secret_scan:
  stage: security
  image: zricethezav/gitleaks:latest
  script:
    - gitleaks detect --source . --verbose
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

---

## Repository Scanning

### Full History Scan

```yaml
secrets:
  scanning:
    repository:
      # Schedule
      schedule: "0 2 * * *"  # Daily at 2 AM

      # Scan options
      options:
        full_history: true
        include_branches: ["main", "develop"]
        depth: 0  # All commits

      # Reporting
      report:
        format: "sarif"
        output: "secret-scan-report.sarif"
        upload_to: "github-security"

      # On finding
      on_finding:
        severity_high:
          - create_issue: true
          - notify: ["security-team"]
          - block_deploy: true

        severity_medium:
          - create_issue: true
          - notify: ["tech-leads"]

        severity_low:
          - log_only: true
```

### Remediation Workflow

```yaml
secrets:
  scanning:
    remediation:
      # Automatic issue creation
      create_issue:
        enabled: true
        template: |
          ## Secret Detected

          **Type:** {{secret_type}}
          **File:** {{file_path}}
          **Line:** {{line_number}}
          **Commit:** {{commit_hash}}
          **Author:** {{commit_author}}

          ### Required Actions
          1. Rotate the exposed secret immediately
          2. Remove the secret from git history
          3. Update the secret in secrets manager
          4. Verify no unauthorized access occurred

          ### Commands
          ```bash
          # Remove from history
          git filter-branch --force --index-filter \
            "git rm --cached --ignore-unmatch {{file_path}}" \
            --prune-empty --tag-name-filter cat -- --all

          # Or use BFG
          bfg --replace-text secrets.txt
          ```

        labels:
          - "security"
          - "secret-exposure"
          - "priority:high"

        assignees:
          - "{{commit_author}}"
          - "@security-team"
```

---

## Runtime Scanning

### Log Scanning

```yaml
secrets:
  scanning:
    runtime:
      logs:
        enabled: true

        # Scan log output
        sources:
          - stdout
          - stderr
          - log_files

        # Patterns to detect
        patterns:
          - "password"
          - "secret"
          - "token"
          - "api_key"
          - "private_key"

        # Actions
        on_detection:
          - redact_in_output: true
          - alert: ["security-team"]
          - metric: "secret_in_log_detected"
```

### Implementation

```typescript
// scanning/runtime.ts
import { secretPatterns } from './patterns';

export function scanForSecrets(text: string): SecretFinding[] {
  const findings: SecretFinding[] = [];

  for (const pattern of secretPatterns) {
    const matches = text.matchAll(pattern.regex);
    for (const match of matches) {
      findings.push({
        type: pattern.name,
        value: mask(match[0]),
        position: match.index,
        severity: pattern.severity,
      });
    }
  }

  return findings;
}

// Logger wrapper that scans output
export function createSecurLogger(baseLogger: Logger): Logger {
  return {
    log: (level: string, message: string, data?: object) => {
      const combined = JSON.stringify({ message, data });
      const findings = scanForSecrets(combined);

      if (findings.length > 0) {
        alertSecurityTeam(findings);
        // Redact and log warning
        const redacted = redactSecrets(combined, findings);
        baseLogger.warn('Potential secret in log output detected', {
          original_redacted: redacted,
          findings: findings.map(f => ({ type: f.type, severity: f.severity })),
        });
      } else {
        baseLogger.log(level, message, data);
      }
    },
  };
}
```

---

## Detection Patterns

### Common Secret Patterns

```yaml
secrets:
  scanning:
    patterns:
      # AWS
      aws_access_key:
        pattern: '(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}'
        severity: "critical"

      aws_secret_key:
        pattern: '(?i)aws(.{0,20})?(?-i)['\''"][0-9a-zA-Z\/+]{40}['\''"]'
        severity: "critical"

      # GitHub
      github_token:
        pattern: '(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,}'
        severity: "critical"

      # Stripe
      stripe_key:
        pattern: '(?:sk|pk)_(test|live)_[0-9a-zA-Z]{24,}'
        severity: "critical"

      # Generic
      private_key:
        pattern: '-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----'
        severity: "critical"

      password_in_url:
        pattern: '://[^:]+:[^@]+@'
        severity: "high"

      jwt_token:
        pattern: 'eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*'
        severity: "high"
```

---

## Reporting

### Report Format

```json
{
  "scan_id": "scan-abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "repository": "myorg/myrepo",
  "branch": "main",
  "findings": [
    {
      "type": "aws_access_key",
      "severity": "critical",
      "file": "config/aws.js",
      "line": 15,
      "commit": "abc123",
      "author": "developer@company.com",
      "date": "2024-01-10T09:00:00Z",
      "snippet": "const AWS_KEY = 'AKIA**************';"
    }
  ],
  "summary": {
    "total_findings": 1,
    "critical": 1,
    "high": 0,
    "medium": 0,
    "low": 0
  }
}
```

---

## Commands

```bash
# Scan staged files
proagents secrets scan --staged

# Scan entire repository
proagents secrets scan --full-history

# Scan specific path
proagents secrets scan ./src

# Generate report
proagents secrets scan --report sarif > report.sarif

# Test patterns
proagents secrets test-pattern "AKIA1234567890ABCDEF"

# List detected secret types
proagents secrets patterns list

# Add custom pattern
proagents secrets patterns add --name "my_token" --pattern "MTK_[a-z0-9]{32}"
```

---

## Best Practices

1. **Shift Left**: Scan before commit, not just in CI
2. **Full History**: Periodically scan complete git history
3. **Custom Patterns**: Add patterns for your specific secrets
4. **Allowlists**: Document and review allowlisted patterns
5. **Immediate Response**: Rotate exposed secrets immediately
6. **Education**: Train developers on secret hygiene
7. **Runtime Scanning**: Monitor logs for accidental exposure
