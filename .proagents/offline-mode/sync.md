# Offline Sync

Synchronize work done offline when connectivity is restored.

---

## Sync Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Offline → Online Sync                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  OFFLINE                    ONLINE                          │
│  ┌──────────────┐           ┌──────────────┐               │
│  │ Local Queue  │           │ AI Services  │               │
│  │ ┌──────────┐ │           └──────────────┘               │
│  │ │ Task 1   │ │                 ↑                        │
│  │ │ Task 2   │ │    ──────▶     Sync                      │
│  │ │ Task 3   │ │                 ↓                        │
│  │ └──────────┘ │           ┌──────────────┐               │
│  └──────────────┘           │ PM Systems   │               │
│                             └──────────────┘               │
│  ┌──────────────┐                 ↓                        │
│  │ Local Cache  │           ┌──────────────┐               │
│  └──────────────┘   ◀────── │  Merge Back  │               │
│                             └──────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sync Configuration

### Basic Settings

```yaml
offline:
  sync:
    enabled: true

    # Auto-sync when online
    auto_sync_on_reconnect: true

    # Sync frequency when online
    background_sync_interval: "5m"

    # Conflict resolution
    conflict_strategy: "prompt"  # prompt, local_wins, remote_wins

    # Retry settings
    retry:
      max_attempts: 3
      backoff: "exponential"
      initial_delay: "1s"
```

### Connectivity Detection

```yaml
offline:
  connectivity:
    # How to detect online status
    detection_method: "hybrid"  # ping, fetch, hybrid

    # Endpoints to check
    check_endpoints:
      - "https://api.anthropic.com/health"
      - "https://api.openai.com/health"
      - "{{pm_integration.url}}/health"

    # Check frequency
    check_interval: "30s"

    # Timeout
    timeout: "5s"

    # Require multiple endpoints
    require_multiple: false
```

---

## Queue Sync

### Processing Queue

```yaml
offline:
  sync:
    queue:
      # Priority order
      priority_order:
        - "commits"          # Git operations first
        - "status_updates"   # PM system updates
        - "ai_requests"      # AI completions
        - "analytics"        # Analytics last

      # Batch processing
      batch_size: 10
      batch_delay: "1s"

      # Concurrent operations
      max_concurrent: 3
```

### Queue Processing

```
┌─────────────────────────────────────────────────────────────┐
│ Sync Queue Processing                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Connection Restored: 2 minutes ago                          │
│                                                             │
│ Queue Status:                                               │
│ ├── Total Items: 15                                        │
│ ├── Processed: 12 ✅                                        │
│ ├── Pending: 2 🔄                                          │
│ └── Failed: 1 ❌                                           │
│                                                             │
│ Current: Syncing PM status updates...                       │
│ [████████████░░░░░░░░] 60%                                 │
│                                                             │
│ Failed Items:                                               │
│ • AI request (auth-suggestions) - Retry in 30s             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Conflict Resolution

### Conflict Types

```yaml
offline:
  sync:
    conflicts:
      # File conflicts
      file_conflicts:
        detection: "hash_comparison"

        resolution:
          # If both modified
          both_modified: "merge_or_prompt"

          # If remote deleted
          remote_deleted: "keep_local"

          # If local deleted
          local_deleted: "prompt"

      # Status conflicts
      status_conflicts:
        # Feature status changed remotely
        feature_status:
          resolution: "remote_wins"
          notify: true

        # Issue updated
        pm_status:
          resolution: "merge"
          fields_to_merge:
            - "comments"
            - "attachments"
          fields_remote_wins:
            - "status"
            - "assignee"
```

### Conflict Resolution UI

```
┌─────────────────────────────────────────────────────────────┐
│ Sync Conflict Detected                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ File: src/auth/login.ts                                     │
│ Conflict Type: Both Modified                                │
│                                                             │
│ LOCAL VERSION:                    REMOTE VERSION:           │
│ ┌─────────────────────┐          ┌─────────────────────┐   │
│ │ function login() {  │          │ function login() {  │   │
│ │   // Local change   │          │   // Remote change  │   │
│ │   validateInput();  │          │   sanitizeInput();  │   │
│ │ }                   │          │ }                   │   │
│ └─────────────────────┘          └─────────────────────┘   │
│                                                             │
│ Modified locally: 2h ago                                    │
│ Modified remotely: 30m ago by alice@company.com             │
│                                                             │
│ [Keep Local] [Use Remote] [Merge] [View Diff]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Automatic Merge

```yaml
offline:
  sync:
    auto_merge:
      enabled: true

      # Safe to auto-merge
      safe_patterns:
        - "non_overlapping_changes"
        - "additive_changes_only"
        - "comment_changes"
        - "formatting_only"

      # Never auto-merge
      never_auto_merge:
        - "same_lines_modified"
        - "structural_changes"
        - "security_sensitive_files"
```

---

## Data Sync

### Feature Data

```yaml
offline:
  sync:
    data:
      features:
        # What to sync
        sync_fields:
          - "status"
          - "phase"
          - "progress"
          - "notes"
          - "attachments"

        # Sync direction
        direction: "bidirectional"

        # Conflict handling
        conflicts:
          status: "remote_wins"
          notes: "merge"
          attachments: "keep_both"
```

### Analysis Cache

```yaml
offline:
  sync:
    cache:
      # Update analysis cache
      refresh_analysis: true
      refresh_if_stale: "1d"

      # Update pattern cache
      refresh_patterns: true

      # Download new resources
      download_updates:
        - "dependency_vulnerabilities"
        - "security_advisories"
        - "documentation_updates"
```

---

## PM System Sync

### Issue Sync

```yaml
offline:
  sync:
    pm_integration:
      # Sync pending updates
      sync_pending_updates: true

      # Create queued issues
      create_queued_issues: true

      # Update comments
      sync_comments: true

      # Conflict handling
      conflicts:
        issue_status:
          resolution: "remote_wins"
          log_conflict: true

        issue_fields:
          resolution: "merge"
          fields:
            description: "local_wins"
            labels: "union"
            comments: "append"
```

### Sync Report

```
┌─────────────────────────────────────────────────────────────┐
│ PM System Sync Complete                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Jira Sync:                                                  │
│ ├── Issues created: 2                                      │
│ ├── Issues updated: 5                                      │
│ ├── Comments synced: 12                                    │
│ └── Conflicts resolved: 1 (remote status won)              │
│                                                             │
│ GitHub Sync:                                                │
│ ├── Commits pushed: 8                                      │
│ ├── PRs updated: 1                                         │
│ └── Comments synced: 4                                     │
│                                                             │
│ Linear Sync:                                                │
│ └── No pending changes                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## AI Request Sync

### Queued AI Requests

```yaml
offline:
  sync:
    ai_requests:
      # Process queued requests
      process_queue: true

      # Priority
      priority_order:
        - "blocking_requests"     # User waiting
        - "code_completion"       # Active development
        - "analysis_requests"     # Background
        - "documentation"         # Low priority

      # Timeout handling
      expired_requests:
        max_age: "24h"
        action: "discard_with_notification"

      # Result delivery
      deliver_results:
        notification: true
        update_cache: true
```

### AI Sync Status

```
┌─────────────────────────────────────────────────────────────┐
│ AI Request Sync                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Queued Requests: 5                                          │
│                                                             │
│ Processing:                                                 │
│ ├── auth-code-review (blocking)          [████████░░] 80%  │
│ ├── test-suggestions (code_completion)   [░░░░░░░░░░] 0%   │
│ └── api-docs-gen (documentation)         [░░░░░░░░░░] 0%   │
│                                                             │
│ Completed (offline):                                        │
│ ├── login-fix-suggestions                ✅ Results ready  │
│ └── component-analysis                   ✅ Results ready  │
│                                                             │
│ [View Results] [Prioritize] [Cancel Pending]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sync Commands

### Manual Sync

```bash
# Full sync
proagents sync

# Sync specific type
proagents sync --type pm
proagents sync --type git
proagents sync --type ai

# Force sync (ignore conflicts)
proagents sync --force

# Dry run
proagents sync --dry-run

# View queue
proagents sync queue

# Resolve conflicts
proagents sync conflicts
```

### Sync Status

```bash
# Check sync status
proagents sync status

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Sync Status                                                 │
├─────────────────────────────────────────────────────────────┤
│ Connection: Online ✅                                        │
│ Last sync: 5 minutes ago                                    │
│                                                             │
│ Pending:                                                    │
│ • 0 git operations                                         │
│ • 2 PM updates                                             │
│ • 1 AI request                                             │
│                                                             │
│ Conflicts: 0                                                │
│ Errors: 0                                                   │
│                                                             │
│ Next auto-sync: 4 minutes                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Notifications

### Sync Notifications

```yaml
offline:
  sync:
    notifications:
      # Notify on sync complete
      on_complete:
        enabled: true
        summary: true

      # Notify on conflicts
      on_conflict:
        enabled: true
        require_action: true

      # Notify on errors
      on_error:
        enabled: true
        include_retry_info: true

      # Channels
      channels:
        - "desktop"
        - "cli"
```

---

## Best Practices

1. **Sync Regularly**: Don't let queue grow too large
2. **Review Conflicts**: Don't blindly accept resolutions
3. **Monitor Failed Items**: Address sync failures promptly
4. **Prioritize Correctly**: Ensure blocking items sync first
5. **Backup Before Sync**: Keep local backup of important work
6. **Test Connectivity**: Verify stable connection before large syncs
