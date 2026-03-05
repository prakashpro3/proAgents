# Real-Time Synchronization

Synchronize state, changes, and context across collaboration participants.

---

## Sync Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Sync Architecture                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Participant A          Sync Server         Participant B   │
│  ┌─────────┐           ┌─────────┐         ┌─────────┐     │
│  │ Local   │◄─────────►│ Central │◄───────►│ Local   │     │
│  │ State   │           │ State   │         │ State   │     │
│  └─────────┘           └─────────┘         └─────────┘     │
│       │                     │                   │          │
│       ▼                     ▼                   ▼          │
│  ┌─────────┐           ┌─────────┐         ┌─────────┐     │
│  │ Changes │──────────►│ Merge   │◄────────│ Changes │     │
│  └─────────┘           └─────────┘         └─────────┘     │
│                             │                              │
│                             ▼                              │
│                      ┌───────────┐                         │
│                      │ Broadcast │                         │
│                      └───────────┘                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sync Configuration

### Basic Settings

```yaml
collaboration:
  sync:
    enabled: true

    # Sync mode
    mode: "realtime"  # realtime, polling, manual

    # What to sync
    include:
      - "file_changes"
      - "cursor_position"
      - "terminal_output"
      - "decisions"
      - "chat"

    # Conflict resolution
    conflicts:
      strategy: "last_writer_wins"
```

### Real-Time Settings

```yaml
collaboration:
  sync:
    realtime:
      # Connection
      protocol: "websocket"
      reconnect: true
      reconnect_interval: "5s"

      # Latency
      max_latency: "500ms"
      compress: true

      # Presence
      presence:
        enabled: true
        heartbeat: "30s"
```

---

## What Gets Synced

### File Changes

```yaml
sync:
  file_changes:
    enabled: true

    # Sync granularity
    granularity: "character"  # character, line, file

    # Debounce
    debounce: "100ms"

    # Exclude
    exclude:
      - "node_modules/**"
      - ".git/**"
      - "*.log"
```

### Cursor and Selection

```yaml
sync:
  cursor:
    enabled: true

    # Show other cursors
    show_remote_cursors: true

    # Cursor colors
    colors:
      - "#FF6B6B"  # Red
      - "#4ECDC4"  # Teal
      - "#45B7D1"  # Blue
      - "#96CEB4"  # Green

    # Selection highlighting
    show_selections: true
```

### Terminal Output

```yaml
sync:
  terminal:
    enabled: true

    # What to share
    share:
      - "output"
      - "errors"

    # Don't share
    exclude:
      - "secrets"
      - "credentials"
```

### Decisions and Context

```yaml
sync:
  decisions:
    enabled: true

    # Auto-log decisions
    auto_log: true

    # Decision types
    types:
      - "architecture"
      - "implementation"
      - "tradeoff"
      - "todo"
```

---

## Conflict Resolution

### Strategies

```yaml
sync:
  conflicts:
    # Default strategy
    default: "last_writer_wins"

    # Per-file strategies
    strategies:
      # Same line edit
      same_line:
        strategy: "last_writer_wins"

      # Same file, different lines
      different_lines:
        strategy: "merge"

      # Critical files
      "src/config/**":
        strategy: "prompt"
        prompt_timeout: "30s"
```

### Conflict UI

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Conflict Detected                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ File: src/services/AuthService.ts:45                       │
│                                                             │
│ Your version:                                               │
│   const token = await getToken();                          │
│                                                             │
│ Alice's version:                                           │
│   const token = await fetchAuthToken();                    │
│                                                             │
│ [Keep Yours]  [Keep Alice's]  [Merge]  [Discuss]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Presence Awareness

### Online Status

```yaml
sync:
  presence:
    enabled: true

    # Status options
    statuses:
      - "active"
      - "idle"
      - "away"
      - "busy"

    # Auto-status
    auto_status:
      idle_after: "5m"
      away_after: "15m"

    # Show in UI
    show:
      - "current_file"
      - "cursor_position"
      - "last_action"
```

### Presence Display

```
┌─────────────────────────────────────────────────────────────┐
│ Session Participants                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🟢 Alice (driver)                                          │
│    └── Editing: src/components/UserCard.tsx:42             │
│                                                             │
│ 🟢 Bob (navigator)                                          │
│    └── Viewing: src/components/UserCard.tsx                │
│                                                             │
│ 🟡 Charlie (observer) - idle                               │
│    └── Last active: 3 min ago                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sync Commands

```bash
# Check sync status
proagents collab sync-status

# Force sync
proagents collab sync

# Pause sync
proagents collab sync --pause

# Resume sync
proagents collab sync --resume

# View sync log
proagents collab sync-log
```

---

## Offline Handling

### Disconnection

```yaml
sync:
  offline:
    # Queue changes when offline
    queue_changes: true
    max_queue: 1000

    # On reconnect
    on_reconnect:
      action: "merge"
      notify: true

    # Conflict on reconnect
    reconnect_conflict:
      strategy: "prompt"
```

### Reconnection Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Reconnecting...                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Offline duration: 2 minutes                                 │
│ Queued changes: 15                                          │
│                                                             │
│ Syncing...                                                  │
│ ├── Your changes: 15 operations                            │
│ ├── Remote changes: 23 operations                          │
│ └── Merging...                                             │
│                                                             │
│ ✓ Sync complete. No conflicts.                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

```yaml
sync:
  performance:
    # Batching
    batch_interval: "50ms"
    max_batch_size: 100

    # Compression
    compress: true
    compression_threshold: "1KB"

    # Throttling
    throttle:
      cursor_updates: "100ms"
      file_changes: "200ms"

    # Binary diff for large files
    binary_diff:
      enabled: true
      threshold: "10KB"
```

---

## Best Practices

1. **Stable Connection**: Use reliable network for real-time sync
2. **Small Changes**: Commit frequently to reduce conflicts
3. **Communicate**: Announce before major changes
4. **File Locks**: Use locks for critical files
5. **Test Offline**: Ensure offline queue works
6. **Monitor Latency**: Check sync performance
