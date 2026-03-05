# Offline Mode

Work without AI connectivity using cached intelligence and local operations.

---

## Overview

Offline mode enables continued development when AI services are unavailable.

```
┌─────────────────────────────────────────────────────────────┐
│                    Offline Mode Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Online Mode                      Offline Mode              │
│  ┌─────────────┐                 ┌─────────────┐           │
│  │     AI      │                 │   Local     │           │
│  │  Services   │                 │   Cache     │           │
│  └──────┬──────┘                 └──────┬──────┘           │
│         │                               │                   │
│         ▼                               ▼                   │
│  ┌─────────────┐                 ┌─────────────┐           │
│  │  Full AI    │    Switch To    │  Cached     │           │
│  │ Capabilities│ ◄────────────► │ Operations  │           │
│  └─────────────┘                 └─────────────┘           │
│                                                             │
│  Offline Capabilities:                                      │
│  ✅ Cached codebase analysis                               │
│  ✅ Template generation                                    │
│  ✅ Standards validation                                   │
│  ✅ Git operations                                         │
│  ✅ Local testing                                          │
│  ✅ Changelog documentation                                │
│  ❌ New code generation                                    │
│  ❌ Complex refactoring                                    │
│  ❌ Design interpretation                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Check Offline Readiness

```bash
# Check what's cached and available offline
proagents offline status

# Pre-cache for offline work
proagents offline prepare
```

### Enable Offline Mode

```bash
# Manually switch to offline mode
proagents offline enable

# Auto-detect and switch
proagents config set offline.auto_detect true
```

---

## Features

| Feature | Online | Offline |
|---------|--------|---------|
| Codebase Analysis | Full | Cached |
| Code Generation | ✅ | ❌ |
| Standards Validation | ✅ | ✅ |
| Template Generation | ✅ | ✅ |
| Git Operations | ✅ | ✅ |
| Testing | ✅ | ✅ |
| Documentation | ✅ | ✅ (templates) |
| Complex Refactoring | ✅ | ❌ |
| Code Review | Full AI | Checklist-based |

---

## Documentation Files

| File | Description |
|------|-------------|
| [caching.md](./caching.md) | Cache management |
| [offline-operations.md](./offline-operations.md) | Available operations |
| [sync.md](./sync.md) | Online/offline sync |

---

## Configuration

```yaml
# proagents.config.yaml

offline:
  enabled: true

  # Auto-detect connectivity
  auto_detect:
    enabled: true
    check_interval: "30s"
    fallback_after: "3 failures"

  # Caching
  cache:
    enabled: true
    path: ".proagents/cache"
    max_size: "500MB"

    # What to cache
    include:
      - "analysis"
      - "patterns"
      - "templates"
      - "standards"
      - "glossary"

  # Queue for when back online
  queue:
    enabled: true
    max_items: 100

  # Notifications
  notifications:
    on_offline: true
    on_online: true
    channels: ["terminal"]
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents offline status` | Check offline readiness |
| `proagents offline prepare` | Pre-cache for offline |
| `proagents offline enable` | Switch to offline mode |
| `proagents offline disable` | Return to online mode |
| `proagents offline queue` | View queued operations |
| `proagents offline sync` | Sync when back online |
