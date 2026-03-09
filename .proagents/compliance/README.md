# Audit Trail & Compliance

Complete audit logging and compliance features for regulated environments.

---

## Overview

ProAgents provides comprehensive audit logging and compliance features for organizations requiring regulatory compliance (SOC 2, GDPR, HIPAA, PCI-DSS).

```
┌─────────────────────────────────────────────────────────────┐
│                    Compliance System                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Audit Logging ──────────────────────────────────────────  │
│  ├── All code changes tracked                              │
│  ├── All access logged                                     │
│  ├── All deployments recorded                              │
│  └── All approvals documented                              │
│                                                             │
│  Compliance Features ────────────────────────────────────  │
│  ├── Immutable audit logs                                  │
│  ├── Retention policies                                    │
│  ├── Access control tracking                               │
│  └── Compliance reports                                    │
│                                                             │
│  Supported Standards ────────────────────────────────────  │
│  ├── SOC 2 Type II                                         │
│  ├── GDPR                                                  │
│  ├── HIPAA                                                 │
│  ├── PCI-DSS                                               │
│  └── ISO 27001                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Enable Compliance Mode

```yaml
# proagents.config.yaml

compliance:
  enabled: true
  level: "standard"  # basic, standard, strict

  frameworks:
    - "soc2"
    - "gdpr"
```

### View Audit Trail

```bash
# View recent audit events
proagents audit list

# View specific event
proagents audit show event-123

# Generate compliance report
proagents compliance report --framework soc2
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Immutable Logs** | Write-once audit logs with cryptographic verification |
| **Complete Tracking** | All changes, access, and actions logged |
| **Retention Policies** | Configurable data retention by event type |
| **Access Control** | Track all access to code and systems |
| **Compliance Reports** | Generate reports for auditors |
| **Evidence Collection** | Automated evidence gathering |

---

## Documentation Files

| File | Description |
|------|-------------|
| [audit-logging.md](./audit-logging.md) | Audit log structure and events |
| [compliance-frameworks.md](./compliance-frameworks.md) | Supported compliance frameworks |
| [retention-policies.md](./retention-policies.md) | Data retention configuration |
| [reports.md](./reports.md) | Compliance report generation |
| [access-control.md](./access-control.md) | Access tracking and control |

---

## Audit Event Types

### Code Changes
- File modifications
- Commits and merges
- Branch operations
- PR activity

### Access Events
- Repository access
- Secrets access
- Production access
- Admin operations

### Deployment Events
- Staging deployments
- Production deployments
- Rollbacks
- Configuration changes

### Security Events
- Failed login attempts
- Permission changes
- Security scan results
- Vulnerability findings

---

## Compliance Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Compliance Dashboard                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Frameworks:                                                 │
│ ├── SOC 2: ✅ Compliant (Last audit: Jan 15)               │
│ ├── GDPR: ✅ Compliant                                      │
│ └── PCI-DSS: ⚠️ Review needed (2 items)                    │
│                                                             │
│ Audit Events (Last 30 days):                               │
│ ├── Total: 1,234                                           │
│ ├── Code Changes: 892                                      │
│ ├── Access Events: 297                                     │
│ └── Deployments: 45                                        │
│                                                             │
│ Pending Actions:                                            │
│ ├── 2 access reviews due                                   │
│ └── 1 policy update required                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

```yaml
# proagents.config.yaml

compliance:
  enabled: true

  # Compliance level
  level: "strict"  # basic, standard, strict

  # Active frameworks
  frameworks:
    - "soc2"
    - "gdpr"
    - "hipaa"

  # Audit settings
  audit:
    enabled: true
    immutable: true
    signed: true  # Cryptographic signing

  # Retention (days)
  retention:
    security_events: 2555  # 7 years
    code_changes: 1825     # 5 years
    deployments: 1095      # 3 years
    access_logs: 365       # 1 year

  # Notifications
  alerts:
    compliance_violation: true
    retention_expiry: true
    access_anomaly: true

  # Reports
  reports:
    auto_generate: true
    schedule: "monthly"
    recipients:
      - "compliance@company.com"
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents audit list` | List audit events |
| `proagents audit show <id>` | Show event details |
| `proagents audit export` | Export audit logs |
| `proagents compliance status` | Show compliance status |
| `proagents compliance report` | Generate compliance report |
| `proagents compliance check` | Run compliance check |
