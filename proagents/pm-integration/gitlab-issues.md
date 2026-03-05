# GitLab Issues Integration

Connect ProAgents with GitLab for issue tracking and merge request management.

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  GitLab Integration                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ProAgents ←──────────→ GitLab API                         │
│                                                             │
│  ┌─────────────┐      ┌─────────────┐                      │
│  │  Features   │ ───▶ │   Issues    │                      │
│  └─────────────┘      └─────────────┘                      │
│                                                             │
│  ┌─────────────┐      ┌─────────────┐                      │
│  │   Commits   │ ───▶ │   Commits   │                      │
│  └─────────────┘      └─────────────┘                      │
│                                                             │
│  ┌─────────────┐      ┌─────────────┐                      │
│  │   Deploy    │ ───▶ │     MRs     │                      │
│  └─────────────┘      └─────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

### API Setup

```yaml
pm_integration:
  gitlab:
    enabled: true

    # GitLab connection
    url: "https://gitlab.com"  # or self-hosted
    api_version: "v4"

    # Authentication
    auth:
      type: "token"  # token, oauth
      token_env: "GITLAB_TOKEN"
      # Required scopes: api, read_repository, write_repository

    # Project settings
    project:
      id: "12345678"  # or "group/project"
      default_branch: "main"
```

### Issue Configuration

```yaml
pm_integration:
  gitlab:
    issues:
      # Labels
      labels:
        feature: "feature"
        bug: "bug"
        enhancement: "enhancement"
        proagents: "proagents-managed"

      # Milestones
      milestones:
        link_to_sprint: true
        create_if_missing: false

      # Weights
      use_weights: true
      weight_mapping:
        small: 1
        medium: 3
        large: 5
        xlarge: 8

      # Assignees
      auto_assign: true
      assignee_field: "assignee_ids"
```

---

## Feature Sync

### Creating Issues

```yaml
# When feature starts
on_feature_start:
  gitlab:
    create_issue:
      title: "{{feature.name}}"
      description: |
        ## Feature Description
        {{feature.description}}

        ## Requirements
        {{feature.requirements}}

        ## Acceptance Criteria
        {{feature.acceptance_criteria}}

        ---
        *Managed by ProAgents*

      labels:
        - "{{feature.type}}"
        - "proagents-managed"

      milestone: "{{sprint.current}}"
      weight: "{{feature.estimated_weight}}"
      assignee_ids: ["{{developer.gitlab_id}}"]
```

### Issue Templates

```yaml
pm_integration:
  gitlab:
    templates:
      feature: |
        ## Summary
        {{summary}}

        ## User Story
        As a {{user_type}}, I want {{goal}} so that {{benefit}}.

        ## Acceptance Criteria
        {{#each criteria}}
        - [ ] {{this}}
        {{/each}}

        ## Technical Notes
        {{technical_notes}}

        ## Design
        {{#if design_link}}
        [View Design]({{design_link}})
        {{/if}}

        /label ~feature ~proagents-managed
        /milestone %"{{milestone}}"

      bug: |
        ## Bug Description
        {{description}}

        ## Steps to Reproduce
        {{#each steps}}
        {{@index}}. {{this}}
        {{/each}}

        ## Expected Behavior
        {{expected}}

        ## Actual Behavior
        {{actual}}

        ## Environment
        - Browser: {{environment.browser}}
        - OS: {{environment.os}}

        /label ~bug ~proagents-managed
        /severity {{severity}}
```

---

## Merge Requests

### Auto-Create MRs

```yaml
pm_integration:
  gitlab:
    merge_requests:
      auto_create: true

      # MR settings
      template: |
        ## Summary
        {{feature.summary}}

        ## Changes
        {{#each changes}}
        - {{this}}
        {{/each}}

        ## Related Issues
        Closes #{{issue.iid}}

        ## Checklist
        - [ ] Tests added
        - [ ] Documentation updated
        - [ ] Code reviewed

        ---
        *Created by ProAgents*

      # MR options
      options:
        remove_source_branch: true
        squash: true
        allow_collaboration: true

      # Labels
      labels:
        - "proagents"
        - "{{feature.type}}"

      # Reviewers
      reviewers:
        auto_assign: true
        from_codeowners: true
```

### MR Status Updates

```yaml
pm_integration:
  gitlab:
    merge_requests:
      status_updates:
        # Add notes on phase changes
        on_phase_change: true

        # Pipeline status
        track_pipeline: true

        # Approval status
        track_approvals: true
```

---

## GitLab CI Integration

### Pipeline Triggers

```yaml
pm_integration:
  gitlab:
    ci:
      # Trigger pipelines
      trigger_on:
        - feature_complete
        - tests_pass
        - pre_deployment

      # Variables
      variables:
        PROAGENTS_FEATURE: "{{feature.id}}"
        PROAGENTS_PHASE: "{{phase.current}}"

      # Wait for pipeline
      wait_for_pipeline: true
      timeout: "30m"
```

### Pipeline Status Tracking

```yaml
pm_integration:
  gitlab:
    ci:
      status_tracking:
        # Update feature status based on pipeline
        on_success: "pipeline_passed"
        on_failure: "pipeline_failed"

        # Notifications
        notify_on_failure: true
        notify_channel: "slack:#dev"
```

---

## Labels & Milestones

### Label Management

```yaml
pm_integration:
  gitlab:
    labels:
      # Sync labels
      sync_on_start: true

      # Required labels
      required:
        - name: "proagents-managed"
          color: "#428BCA"
          description: "Managed by ProAgents workflow"

        - name: "phase::analysis"
          color: "#7F8C8D"
        - name: "phase::implementation"
          color: "#3498DB"
        - name: "phase::testing"
          color: "#9B59B6"
        - name: "phase::review"
          color: "#E67E22"
        - name: "phase::complete"
          color: "#27AE60"

      # Phase label updates
      update_phase_labels: true
```

### Milestone Integration

```yaml
pm_integration:
  gitlab:
    milestones:
      # Sprint milestones
      sprint_format: "Sprint {{number}} - {{start_date}}"

      # Auto-assign to current sprint
      auto_assign_sprint: true

      # Release milestones
      release_milestone_prefix: "Release"
```

---

## Boards Integration

### Board Configuration

```yaml
pm_integration:
  gitlab:
    boards:
      # Use boards for feature tracking
      enabled: true

      # Board mapping
      board_name: "ProAgents Board"

      # List mapping
      lists:
        - label: "phase::analysis"
          name: "Analysis"
        - label: "phase::implementation"
          name: "In Progress"
        - label: "phase::testing"
          name: "Testing"
        - label: "phase::review"
          name: "Review"
        - label: "phase::complete"
          name: "Done"

      # Auto-move on phase change
      auto_move: true
```

---

## Webhooks

### GitLab to ProAgents

```yaml
pm_integration:
  gitlab:
    webhooks:
      # Receive events
      endpoint: "/webhooks/gitlab"
      secret_token_env: "GITLAB_WEBHOOK_SECRET"

      # Handle events
      events:
        issue:
          - action: "update"
            trigger: "sync_feature_status"
          - action: "close"
            trigger: "mark_complete"

        merge_request:
          - action: "merge"
            trigger: "on_mr_merged"
          - action: "close"
            trigger: "on_mr_closed"

        pipeline:
          - status: "success"
            trigger: "pipeline_passed"
          - status: "failed"
            trigger: "pipeline_failed"
```

---

## API Operations

### Issue Operations

```bash
# Create issue
proagents gitlab issue create \
  --title "Feature name" \
  --description "Description" \
  --labels "feature,proagents"

# Update issue
proagents gitlab issue update 123 \
  --add-label "phase::implementation"

# Close issue
proagents gitlab issue close 123 \
  --comment "Completed via ProAgents"

# Link MR to issue
proagents gitlab issue link 123 --mr 456
```

### MR Operations

```bash
# Create MR
proagents gitlab mr create \
  --source "feature/user-auth" \
  --target "main" \
  --title "Add user authentication"

# Approve MR
proagents gitlab mr approve 456

# Merge MR
proagents gitlab mr merge 456 --squash
```

---

## Sync Status

```
┌─────────────────────────────────────────────────────────────┐
│ GitLab Sync Status                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Last Sync: 2 minutes ago                                    │
│ Status: Connected ✅                                        │
│                                                             │
│ Issues:                                                     │
│ ├── Synced: 45                                             │
│ ├── Pending: 2                                             │
│ └── Errors: 0                                              │
│                                                             │
│ Merge Requests:                                             │
│ ├── Open: 3                                                │
│ ├── Merged Today: 5                                        │
│ └── Awaiting Review: 2                                     │
│                                                             │
│ Pipelines:                                                  │
│ ├── Running: 1                                             │
│ ├── Passed: 12                                             │
│ └── Failed: 0                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Use Labels**: Leverage GitLab labels for status tracking
2. **Link Issues**: Always link MRs to issues
3. **Pipeline Integration**: Use CI/CD for automated testing
4. **Milestones**: Organize work with milestones
5. **Code Review**: Require approvals before merging
6. **Branch Protection**: Protect main branch
