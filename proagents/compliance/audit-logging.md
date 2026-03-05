# Audit Logging

Comprehensive audit logging for all development activities.

---

## Overview

Every action in ProAgents is logged with full context for compliance and security purposes.

```
┌─────────────────────────────────────────────────────────────┐
│                    Audit Log Flow                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Action Occurs ──► Log Entry Created ──► Verification      │
│        │                  │                    │            │
│        ▼                  ▼                    ▼            │
│  Context Capture    Cryptographic Sign    Immutable Store  │
│        │                  │                    │            │
│        └──────────────────┴────────────────────┘            │
│                           │                                 │
│                           ▼                                 │
│                    Audit Trail                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Log Entry Structure

### Standard Event Format

```json
{
  "id": "evt_abc123xyz",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "event_type": "code_change",
  "category": "development",
  "severity": "info",

  "actor": {
    "id": "user_123",
    "email": "developer@company.com",
    "name": "John Developer",
    "role": "developer"
  },

  "action": {
    "type": "file_modify",
    "description": "Modified authentication service"
  },

  "resource": {
    "type": "file",
    "path": "src/auth/AuthService.ts",
    "project": "main-app",
    "branch": "feature/user-auth"
  },

  "context": {
    "feature": "user-authentication",
    "phase": "implementation",
    "commit": "abc123def",
    "pr": "#456"
  },

  "metadata": {
    "ip_address": "192.168.1.100",
    "user_agent": "ProAgents/1.0",
    "session_id": "sess_xyz789",
    "request_id": "req_abc123"
  },

  "verification": {
    "hash": "sha256:abc123...",
    "signature": "sig_xyz789...",
    "chain_hash": "sha256:prev123..."
  }
}
```

---

## Event Types

### Code Change Events

| Event Type | Description | Severity |
|------------|-------------|----------|
| `file_create` | New file created | info |
| `file_modify` | File modified | info |
| `file_delete` | File deleted | warning |
| `file_rename` | File renamed | info |
| `commit_create` | Commit created | info |
| `branch_create` | Branch created | info |
| `branch_delete` | Branch deleted | warning |
| `merge` | Branch merged | info |
| `rebase` | Branch rebased | warning |

### Access Events

| Event Type | Description | Severity |
|------------|-------------|----------|
| `repo_access` | Repository accessed | info |
| `secrets_access` | Secrets accessed | warning |
| `prod_access` | Production accessed | warning |
| `admin_access` | Admin area accessed | warning |
| `login_success` | Successful login | info |
| `login_failure` | Failed login | warning |
| `logout` | User logged out | info |

### Deployment Events

| Event Type | Description | Severity |
|------------|-------------|----------|
| `deploy_start` | Deployment started | info |
| `deploy_complete` | Deployment completed | info |
| `deploy_failed` | Deployment failed | error |
| `rollback_start` | Rollback started | warning |
| `rollback_complete` | Rollback completed | warning |
| `config_change` | Configuration changed | warning |

### Security Events

| Event Type | Description | Severity |
|------------|-------------|----------|
| `vuln_detected` | Vulnerability detected | warning |
| `vuln_critical` | Critical vulnerability | critical |
| `permission_change` | Permission changed | warning |
| `permission_escalation` | Permission escalated | critical |
| `security_scan` | Security scan run | info |
| `secret_exposed` | Secret potentially exposed | critical |

### Administrative Events

| Event Type | Description | Severity |
|------------|-------------|----------|
| `user_create` | User created | info |
| `user_delete` | User deleted | warning |
| `role_change` | Role changed | warning |
| `policy_change` | Policy changed | warning |
| `config_change` | System config changed | warning |
| `audit_export` | Audit logs exported | info |

---

## Immutable Logging

### Hash Chain

Each log entry is cryptographically linked to the previous entry:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Event 1    │───►│  Event 2    │───►│  Event 3    │
│             │    │             │    │             │
│ hash: abc   │    │ hash: def   │    │ hash: ghi   │
│ prev: null  │◄───│ prev: abc   │◄───│ prev: def   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Tamper Detection

```bash
# Verify audit log integrity
proagents audit verify

# Output:
Verifying audit log integrity...
├── Total events: 10,234
├── Chain verified: ✅
├── Signatures valid: ✅
└── Integrity: PASS
```

### Cryptographic Signing

Each entry is signed with:
- SHA-256 hash of content
- Digital signature (if configured)
- Reference to previous hash (chain)

```yaml
verification:
  hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  signature: "RSA-SHA256:base64encodedSignature..."
  chain_hash: "sha256:previousEventHash..."
  verified_at: "2024-01-15T10:30:01.000Z"
```

---

## Log Storage

### Storage Structure

```
/proagents/.audit/
├── logs/
│   ├── 2024/
│   │   ├── 01/
│   │   │   ├── 2024-01-15.jsonl      # Daily log files
│   │   │   ├── 2024-01-15.sig        # Signatures
│   │   │   └── 2024-01-15.chain      # Chain hashes
│   │   └── 02/
│   └── index.json                     # Log index
├── archive/                           # Archived logs
└── exports/                           # Exported reports
```

### Log Format

Logs are stored in JSON Lines format (`.jsonl`):

```jsonl
{"id":"evt_001","timestamp":"2024-01-15T10:00:00Z","event_type":"file_create",...}
{"id":"evt_002","timestamp":"2024-01-15T10:01:00Z","event_type":"file_modify",...}
{"id":"evt_003","timestamp":"2024-01-15T10:02:00Z","event_type":"commit_create",...}
```

### Remote Storage

Configure remote storage for redundancy:

```yaml
audit:
  storage:
    local:
      enabled: true
      path: "./.audit"

    remote:
      enabled: true
      type: "s3"  # s3, gcs, azure-blob
      bucket: "company-audit-logs"
      region: "us-east-1"
      encryption: true

    # Backup strategy
    backup:
      enabled: true
      frequency: "daily"
      retention_days: 365
```

---

## Querying Audit Logs

### CLI Commands

```bash
# List recent events
proagents audit list

# Filter by type
proagents audit list --type code_change

# Filter by date range
proagents audit list --from 2024-01-01 --to 2024-01-31

# Filter by user
proagents audit list --actor developer@company.com

# Filter by resource
proagents audit list --resource "src/auth/**"

# Filter by severity
proagents audit list --severity critical

# Search in logs
proagents audit search "authentication"

# Export logs
proagents audit export --format json --output audit-export.json
```

### Query Examples

**All code changes in January:**
```bash
proagents audit list \
  --type code_change \
  --from 2024-01-01 \
  --to 2024-01-31
```

**Security events for specific file:**
```bash
proagents audit list \
  --category security \
  --resource "src/auth/AuthService.ts"
```

**All deployments by user:**
```bash
proagents audit list \
  --category deployment \
  --actor developer@company.com
```

---

## Real-time Monitoring

### Event Streaming

```yaml
audit:
  streaming:
    enabled: true
    destinations:
      - type: "webhook"
        url: "https://siem.company.com/events"
        events: ["security_*", "deploy_*"]

      - type: "slack"
        webhook: "https://hooks.slack.com/..."
        events: ["vuln_critical", "permission_escalation"]

      - type: "syslog"
        host: "syslog.company.com"
        port: 514
        events: ["*"]
```

### Alert Configuration

```yaml
audit:
  alerts:
    rules:
      - name: "Critical Security Event"
        condition: "severity == 'critical'"
        action: "notify_immediately"
        channels: ["slack", "email", "pagerduty"]

      - name: "Multiple Login Failures"
        condition: "event_type == 'login_failure' && count > 5"
        window: "5m"
        action: "notify_security"

      - name: "After Hours Deployment"
        condition: "category == 'deployment' && hour not in 9..18"
        action: "notify_oncall"
```

---

## Audit Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Audit Trail - Last 30 Days                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Event Summary:                                              │
│ ├── Total Events: 12,456                                   │
│ ├── Code Changes: 8,234                                    │
│ ├── Access Events: 3,127                                   │
│ ├── Deployments: 89                                        │
│ └── Security Events: 6                                     │
│                                                             │
│ By Severity:                                                │
│ ├── Info: 11,234                                           │
│ ├── Warning: 1,215                                         │
│ ├── Error: 5                                               │
│ └── Critical: 2                                            │
│                                                             │
│ Active Users: 12                                            │
│ Top Actor: dev@company.com (2,345 events)                  │
│                                                             │
│ Recent Critical Events:                                     │
│ • [Jan 15] Permission escalation attempt                   │
│ • [Jan 10] Critical vulnerability in lodash                │
│                                                             │
│ Integrity: ✅ Verified | Last check: 5 min ago             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

```yaml
# proagents.config.yaml

audit:
  enabled: true

  # What to log
  events:
    code_changes: true
    access_events: true
    deployments: true
    security_events: true
    admin_events: true

  # Immutability
  immutable: true
  hash_algorithm: "sha256"
  sign_entries: true

  # Storage
  storage:
    local:
      enabled: true
      path: "./.proagents/audit"
      max_size_mb: 1000

    remote:
      enabled: false

  # Detail level
  detail_level: "full"  # minimal, standard, full

  # Exclude patterns
  exclude:
    paths:
      - "node_modules/**"
      - "*.log"
    events:
      - "file_view"  # Too noisy

  # Performance
  async_logging: true
  batch_size: 100
  flush_interval_ms: 1000
```

---

## Best Practices

1. **Enable Immutability**: Always use hash chains in production
2. **Remote Backup**: Configure remote storage for audit logs
3. **Monitor Alerts**: Set up alerts for critical events
4. **Regular Verification**: Run integrity checks weekly
5. **Retention Compliance**: Set retention to match regulatory requirements
6. **Access Control**: Restrict who can view/export audit logs
7. **Test Recovery**: Periodically test log recovery from backups
