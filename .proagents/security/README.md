# Security

Vulnerability scanning, OWASP compliance, and security best practices.

---

## Overview

Integrated security checks throughout the development lifecycle.

## Documentation

| Document | Description |
|----------|-------------|
| [Vulnerability Scanning](./vulnerability-scanning.md) | Dependency and code scanning |
| [OWASP Checklist](./owasp-checklist.md) | OWASP Top 10 compliance |
| [SAST Guide](./sast-guide.md) | Static Application Security Testing |
| [Security Report Template](./security-report-template.md) | Security report format |

## Quick Start

```bash
# Run security scan
proagents security scan

# Check OWASP compliance
proagents security owasp

# Scan dependencies
proagents security deps
```

## Security Checks

| Check | When | Severity |
|-------|------|----------|
| Dependency vulnerabilities | Every build | Block on critical |
| Hardcoded secrets | Pre-commit | Block always |
| OWASP Top 10 | Pre-deployment | Block on high |
| SAST scan | PR review | Warn on medium |

## Configuration

```yaml
# proagents.config.yaml
security:
  scanning:
    enabled: true
    schedule: "on_commit"

  vulnerabilities:
    block_on: "high"
    auto_fix_patches: true

  secrets:
    scan_enabled: true
    block_commit: true
```

## OWASP Top 10 Coverage

- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection
- A04: Insecure Design
- A05: Security Misconfiguration
- A06: Vulnerable Components
- A07: Authentication Failures
- A08: Data Integrity Failures
- A09: Logging Failures
- A10: SSRF
