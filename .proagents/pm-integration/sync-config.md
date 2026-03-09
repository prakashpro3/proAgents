# Synchronization Configuration

Configure how ProAgents syncs with project management platforms.

---

## Sync Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Sync Architecture                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ProAgents                         PM Platform              │
│  ┌─────────┐                      ┌─────────┐              │
│  │ Feature │ ──── Push ────────►  │  Issue  │              │
│  │  State  │ ◄─── Pull ─────────  │  State  │              │
│  └─────────┘                      └─────────┘              │
│       │                                │                    │
│       │         ┌─────────┐           │                    │
│       └────────►│  Sync   │◄──────────┘                    │
│                 │ Engine  │                                 │
│                 └─────────┘                                 │
│                      │                                      │
│              ┌───────┴───────┐                             │
│              │ Conflict      │                             │
│              │ Resolution    │                             │
│              └───────────────┘                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sync Modes

### Push Mode (ProAgents → PM)

ProAgents pushes changes to PM platform:

```yaml
integrations:
  sync:
    mode: "push"

    # What to push
    push:
      feature_start: true
      phase_changes: true
      pr_creation: true
      feature_complete: true
      comments: true
      time_tracking: true

    # When to push
    triggers:
      on_event: true      # Push on each event
      on_commit: false    # Push on git commit
      scheduled: false    # Push on schedule
```

### Pull Mode (PM → ProAgents)

ProAgents pulls changes from PM platform:

```yaml
integrations:
  sync:
    mode: "pull"

    # What to pull
    pull:
      new_issues: true
      status_changes: true
      assignments: true
      comments: true
      priority_changes: true

    # When to pull
    schedule: "*/5 * * * *"  # Every 5 minutes
```

### Bi-Directional Mode

Full two-way sync:

```yaml
integrations:
  sync:
    mode: "bidirectional"

    # Conflict resolution
    conflicts:
      strategy: "pm_wins"  # pm_wins, proagents_wins, manual, latest_wins

      # Manual resolution
      manual:
        notify: true
        timeout: "1h"
        default_action: "pm_wins"
```

---

## Sync Events

### Feature Lifecycle Events

```yaml
integrations:
  sync:
    events:
      # Feature started
      feature_start:
        action: "create_or_link"
        fields:
          - title
          - description
          - assignee
          - labels

      # Phase changed
      phase_change:
        action: "update_status"
        add_comment: true
        fields:
          - status
          - custom_phase_field

      # PR created
      pr_created:
        action: "link_pr"
        add_comment: true
        fields:
          - pr_url
          - branch_name

      # Feature completed
      feature_complete:
        action: "close_issue"
        add_comment: true
        fields:
          - resolution
          - time_spent
          - summary
```

### Custom Events

```yaml
integrations:
  sync:
    custom_events:
      # Sync on test completion
      tests_passed:
        action: "add_comment"
        template: "All tests passed. Coverage: {{coverage}}%"

      # Sync on security scan
      security_scan_complete:
        action: "update_field"
        field: "security_status"
        value: "{{scan_result}}"

      # Sync on deployment
      deployed:
        action: "add_comment"
        template: |
          Deployed to {{environment}}
          URL: {{deployment_url}}
```

---

## Field Mapping

### Standard Fields

```yaml
integrations:
  sync:
    field_mapping:
      # ProAgents field: PM field
      standard:
        feature_name: "title"
        feature_description: "description"
        current_phase: "status"
        assignee: "assignee"
        priority: "priority"
        labels: "labels"
        due_date: "due_date"
        estimate: "estimate"
```

### Custom Fields

```yaml
integrations:
  sync:
    field_mapping:
      custom:
        # Map to custom fields
        branch_name:
          jira: "customfield_10001"
          linear: "custom_field_branch"

        test_coverage:
          jira: "customfield_10002"
          linear: "custom_field_coverage"

        pr_link:
          jira: "customfield_10003"
          linear: "custom_field_pr"

        deployment_url:
          jira: "customfield_10004"
          linear: "custom_field_deploy"
```

### Field Transformations

```yaml
integrations:
  sync:
    field_mapping:
      transformations:
        # Transform phase to status
        current_phase:
          transform: "status_map"
          map:
            init: "To Do"
            analysis: "In Progress"
            implementation: "In Development"
            testing: "In QA"
            deployed: "Done"

        # Transform priority
        priority:
          transform: "priority_map"
          map:
            critical: 1
            high: 2
            medium: 3
            low: 4

        # Custom transformation
        estimate:
          transform: "function"
          function: |
            (value) => {
              // Convert hours to story points
              return Math.ceil(value / 4);
            }
```

---

## Conflict Resolution

### Resolution Strategies

```yaml
integrations:
  sync:
    conflicts:
      # Default strategy
      default_strategy: "latest_wins"

      # Per-field strategies
      field_strategies:
        status: "pm_wins"      # PM status takes precedence
        description: "merge"   # Merge descriptions
        labels: "union"        # Combine all labels
        assignee: "proagents_wins"  # ProAgents assignee wins

      # Strategies explained:
      # - pm_wins: PM platform value wins
      # - proagents_wins: ProAgents value wins
      # - latest_wins: Most recent change wins
      # - merge: Attempt to merge values
      # - union: Combine values (for arrays)
      # - manual: Require manual resolution
```

### Conflict Notification

```yaml
integrations:
  sync:
    conflicts:
      notification:
        enabled: true
        channels:
          - "slack:#dev-sync"
          - "email:team@company.com"

        template: |
          **Sync Conflict Detected**

          Feature: {{feature_name}}
          Issue: {{issue_id}}
          Field: {{field_name}}

          ProAgents value: {{proagents_value}}
          PM value: {{pm_value}}

          Resolution: {{resolution_strategy}}
```

### Manual Resolution

```yaml
integrations:
  sync:
    conflicts:
      manual_resolution:
        enabled: true

        # UI for resolution
        ui: "cli"  # cli, web, notification

        # Timeout for manual resolution
        timeout: "4h"

        # Action on timeout
        timeout_action: "pm_wins"
```

---

## Sync Schedule

### Real-Time Sync

```yaml
integrations:
  sync:
    realtime:
      enabled: true

      # Use webhooks when available
      webhooks: true

      # Fallback polling interval
      fallback_interval: "30s"
```

### Scheduled Sync

```yaml
integrations:
  sync:
    schedule:
      enabled: true

      # Full sync schedule
      full_sync: "0 */6 * * *"  # Every 6 hours

      # Incremental sync schedule
      incremental_sync: "*/5 * * * *"  # Every 5 minutes

      # Sync on specific events
      on_events:
        - "git_push"
        - "pr_merge"
```

### Manual Sync

```bash
# Sync current feature
proagents pm sync

# Sync all features
proagents pm sync --all

# Sync specific feature
proagents pm sync --feature user-auth

# Force full sync (ignore cache)
proagents pm sync --force
```

---

## Sync Filtering

### Include/Exclude Filters

```yaml
integrations:
  sync:
    filters:
      # Only sync these issue types
      include_types:
        - "Story"
        - "Bug"
        - "Task"

      # Exclude these
      exclude_types:
        - "Epic"
        - "Initiative"

      # Only sync issues with these labels
      include_labels:
        - "proagents"
        - "automated"

      # Exclude issues with these labels
      exclude_labels:
        - "manual-only"
        - "no-sync"

      # Only sync issues assigned to team
      team_only: true
```

### Project Filters

```yaml
integrations:
  sync:
    filters:
      # Only sync from these projects
      projects:
        - "Backend"
        - "Frontend"

      # Exclude these projects
      exclude_projects:
        - "Archive"
        - "Experimental"
```

---

## Error Handling

### Retry Configuration

```yaml
integrations:
  sync:
    error_handling:
      # Retry on failure
      retry:
        enabled: true
        max_attempts: 3
        backoff: "exponential"  # linear, exponential, fixed
        initial_delay: "1s"
        max_delay: "1m"

      # On persistent failure
      on_failure:
        action: "queue"  # queue, skip, alert
        notify: true
```

### Error Notifications

```yaml
integrations:
  sync:
    error_handling:
      notifications:
        enabled: true

        # Notify on these errors
        on:
          - "connection_failed"
          - "auth_failed"
          - "rate_limited"
          - "sync_conflict"

        channels:
          - "slack:#dev-alerts"
```

---

## Sync Status & Monitoring

### View Sync Status

```bash
# Show sync status
proagents pm sync-status

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Sync Status                                                 │
├─────────────────────────────────────────────────────────────┤
│ Platform: Jira                                              │
│ Mode: Bidirectional                                         │
│ Last Sync: 2 minutes ago                                    │
│ Status: Healthy                                             │
├─────────────────────────────────────────────────────────────┤
│ Synced Features: 12                                         │
│ Pending Changes: 0                                          │
│ Conflicts: 0                                                │
├─────────────────────────────────────────────────────────────┤
│ Recent Activity:                                            │
│ • PROJ-123: Status updated (1 min ago)                     │
│ • PROJ-456: Comment added (5 min ago)                      │
│ • PROJ-789: PR linked (10 min ago)                         │
└─────────────────────────────────────────────────────────────┘
```

### Sync Logs

```bash
# View sync logs
proagents pm logs

# View errors only
proagents pm logs --errors

# Export logs
proagents pm logs --export sync-log.json
```

---

## Best Practices

1. **Start with Push Mode**: Begin with one-way sync, then enable bidirectional
2. **Use Webhooks**: Enable webhooks for real-time sync when available
3. **Define Clear Mappings**: Map fields explicitly to avoid confusion
4. **Handle Conflicts**: Choose appropriate conflict resolution strategies
5. **Monitor Sync Health**: Regularly check sync status and logs
6. **Test Before Production**: Test sync configuration in staging first
7. **Document Mappings**: Keep field mappings documented for team reference
