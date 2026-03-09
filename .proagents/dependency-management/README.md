# Dependency Auto-Update System

Automated dependency updates with testing and safety checks.

---

## Overview

Keep dependencies up-to-date automatically while ensuring stability and security.

```
┌─────────────────────────────────────────────────────────────┐
│                Dependency Update Pipeline                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │  Scan   │──►│ Analyze │──►│  Test   │──►│  Apply  │    │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│       │             │             │             │          │
│       ▼             ▼             ▼             ▼          │
│  Find updates   Check risk    Run tests    Merge/PR       │
│  Check vulns    Compatibility  Verify      Notify         │
│                                                             │
│  Auto-merge: Patches with passing tests                    │
│  PR Review: Minor/Major updates                            │
│  Block: Security vulnerabilities                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Enable Auto-Updates

```yaml
# proagents.config.yaml

dependencies:
  auto_update:
    enabled: true
    schedule: "weekly"  # daily, weekly, monthly
```

### Run Manual Check

```bash
# Check for updates
proagents deps check

# Update all dependencies
proagents deps update

# Update specific package
proagents deps update lodash
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Auto-Detection** | Detects package managers automatically |
| **Security Scanning** | Checks for vulnerabilities |
| **Compatibility Check** | Analyzes breaking changes |
| **Test Verification** | Runs tests before applying |
| **Rollback Support** | Easy rollback if issues occur |
| **PR Creation** | Creates PRs for review |

---

## Documentation Files

| File | Description |
|------|-------------|
| [update-policies.md](./update-policies.md) | Update policies and rules |
| [security-scanning.md](./security-scanning.md) | Vulnerability scanning |
| [compatibility.md](./compatibility.md) | Breaking change detection |
| [automation.md](./automation.md) | CI/CD integration |

---

## Configuration

```yaml
# proagents.config.yaml

dependencies:
  auto_update:
    enabled: true
    schedule: "weekly"

    # Update policies by type
    policies:
      patch:
        auto_merge: true
        require_tests: true

      minor:
        auto_merge: false
        require_review: true
        require_tests: true

      major:
        auto_merge: false
        require_review: true
        require_manual_testing: true

    # Security updates
    security:
      auto_merge: true
      priority: "immediate"
      notify: ["security-team"]

    # Packages to ignore
    ignore:
      - "legacy-package"
      - "@internal/*"

    # Group updates
    groups:
      - name: "react"
        packages: ["react", "react-dom"]
        update_together: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents deps check` | Check for available updates |
| `proagents deps update` | Update dependencies |
| `proagents deps audit` | Security audit |
| `proagents deps outdated` | List outdated packages |
| `proagents deps rollback` | Rollback recent update |
| `proagents deps lock` | Lock specific versions |
