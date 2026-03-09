# Real-Time Collaboration

Enable multiple developers to work together on features.

---

## Overview

Real-time collaboration allows team members to work together on the same feature with shared context and synchronized progress.

```
┌─────────────────────────────────────────────────────────────┐
│                    Collaboration Session                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Developer 1 ──────┐                                       │
│                    │                                       │
│  Developer 2 ──────┼───► Shared Session ───► Feature      │
│                    │         │                             │
│  Reviewer ─────────┘         │                             │
│                              ▼                             │
│                    ┌─────────────────┐                     │
│                    │ Synchronized:   │                     │
│                    │ • Context       │                     │
│                    │ • Progress      │                     │
│                    │ • Decisions     │                     │
│                    │ • Changes       │                     │
│                    └─────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Start a Session

```bash
# Start collaboration session
proagents collab start --feature user-auth

# Output:
Session started: sess_abc123
Share this link: https://proagents.io/collab/sess_abc123
```

### Join a Session

```bash
# Join by session ID
proagents collab join sess_abc123

# Join by link
proagents collab join https://proagents.io/collab/sess_abc123
```

---

## Collaboration Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Pair Programming** | Two developers, one feature | Complex implementation |
| **Mob Programming** | Whole team, one feature | Knowledge sharing |
| **Review Mode** | Developer + reviewer | Code review |
| **Observer Mode** | Watch without editing | Training, oversight |

---

## Features

| Feature | Description |
|---------|-------------|
| **Shared Context** | Everyone sees the same codebase state |
| **Real-Time Sync** | Changes broadcast instantly |
| **Role-Based Access** | Different permissions per role |
| **Chat Integration** | In-session communication |
| **Decision Logging** | Track all decisions made |

---

## Documentation Files

| File | Description |
|------|-------------|
| [sessions.md](./sessions.md) | Session management |
| [roles.md](./roles.md) | Collaboration roles |
| [sync.md](./sync.md) | Synchronization details |

---

## Configuration

```yaml
# proagents.config.yaml

collaboration:
  enabled: true

  # Default session settings
  sessions:
    max_participants: 5
    idle_timeout: "30m"
    auto_save_interval: "5m"

  # Roles
  roles:
    driver:
      can_edit: true
      can_execute: true

    navigator:
      can_edit: false
      can_suggest: true

    observer:
      can_edit: false
      can_suggest: false

  # Communication
  chat:
    enabled: true
    voice: false  # Requires external tool

  # Sync settings
  sync:
    realtime: true
    conflict_resolution: "last_writer_wins"
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents collab start` | Start new session |
| `proagents collab join` | Join existing session |
| `proagents collab leave` | Leave current session |
| `proagents collab status` | Show session status |
| `proagents collab invite` | Invite participant |
| `proagents collab kick` | Remove participant |
