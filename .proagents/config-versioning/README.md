# Configuration Version Control

Track, version, and manage configuration changes.

---

## Overview

Configuration version control ensures all ProAgents configuration changes are tracked, reversible, and auditable.

```
┌─────────────────────────────────────────────────────────────┐
│                    Config Version Control                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Config Change ──► Validation ──► Version ──► Apply        │
│       │                            │                       │
│       ▼                            ▼                       │
│  Change Log                    History                     │
│       │                            │                       │
│       └────────────────────────────┘                       │
│                    │                                       │
│                    ▼                                       │
│              Rollback Available                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### View Config History

```bash
# Show config change history
proagents config history

# Show specific config file history
proagents config history --file proagents.config.yaml
```

### Rollback Config

```bash
# Rollback to previous version
proagents config rollback

# Rollback to specific version
proagents config rollback --to v2.3.0
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Version Tracking** | Every change creates a version |
| **Change Logging** | Reason and author recorded |
| **Diff Support** | Compare versions |
| **Rollback** | Revert to any previous version |
| **Validation** | Validate before applying |
| **Audit Trail** | Complete history for compliance |

---

## Documentation Files

| File | Description |
|------|-------------|
| [versioning.md](./versioning.md) | Version tracking details |
| [changelog.md](./changelog.md) | Config changelog |
| [rollback.md](./rollback.md) | Rollback procedures |

---

## Configuration

```yaml
# proagents.config.yaml

config_versioning:
  enabled: true

  # Track these config files
  tracked_files:
    - "proagents.config.yaml"
    - "standards/**/*.yaml"
    - "rules/**/*.yaml"

  # Version storage
  storage:
    path: ".proagents/config-history"
    max_versions: 100

  # Change requirements
  changes:
    require_reason: true
    require_approval: false
    validate_before_apply: true

  # Notifications
  notifications:
    on_change: true
    channels: ["slack:#config-changes"]
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents config history` | Show version history |
| `proagents config diff` | Compare versions |
| `proagents config rollback` | Revert to previous |
| `proagents config export` | Export configuration |
| `proagents config import` | Import configuration |
| `proagents config validate` | Validate configuration |
