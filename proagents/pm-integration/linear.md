# Linear Integration

Modern, fast integration with Linear for agile development teams.

---

## Setup

### 1. Create API Key

1. Go to Linear Settings → API
2. Click "Create key"
3. Name it "ProAgents"
4. Copy the API key

### 2. Configure Connection

```yaml
# proagents.config.yaml

integrations:
  linear:
    enabled: true
    api_key_env: "LINEAR_API_KEY"

    # Team settings
    team_id: "TEAM-123"  # or team key
    default_project: "Backend"
```

### 3. Set Environment Variable

```bash
export LINEAR_API_KEY="lin_api_xxxxx"
```

### 4. Verify Connection

```bash
proagents pm connect linear
proagents pm status
```

---

## Configuration

```yaml
integrations:
  linear:
    enabled: true
    api_key_env: "LINEAR_API_KEY"

    # Team and project
    team_id: "TEAM-123"
    default_project: "Backend"

    # Issue defaults
    defaults:
      state: "Backlog"
      priority: 2  # 0=No priority, 1=Urgent, 2=High, 3=Medium, 4=Low

    # Label mapping
    labels:
      feature: "feature"
      bug: "bug"
      refactor: "improvement"
      proagents: "proagents-managed"
```

---

## State Mapping

Map ProAgents phases to Linear states:

```yaml
integrations:
  linear:
    state_mapping:
      # ProAgents phase: Linear state
      init: "Backlog"
      analysis: "In Progress"
      requirements: "In Progress"
      design: "In Progress"
      planning: "In Progress"
      implementation: "In Progress"
      testing: "In Review"
      review: "In Review"
      documentation: "In Review"
      deployment: "Done"
      deployed: "Done"

    # Custom states (if using custom workflow)
    custom_states:
      in_development: "state_uuid_1"
      in_qa: "state_uuid_2"
```

---

## Auto-Actions

### On Feature Start

```yaml
integrations:
  linear:
    on_feature_start:
      create_issue: true

      template:
        title: "{{feature_name}}"
        description: |
          ## Description
          {{feature_description}}

          ## Acceptance Criteria
          {{acceptance_criteria}}

          ---
          *Managed by ProAgents*

        labels:
          - "proagents"
          - "{{entry_mode}}"

        # Assign to current user
        assign_to_me: true
```

### On Phase Change

```yaml
integrations:
  linear:
    on_phase_change:
      update_state: true
      add_comment: true

      comment_template: |
        **Phase**: {{current_phase}}
        **Progress**: {{progress_percentage}}%

        {{phase_summary}}
```

### On PR Created

```yaml
integrations:
  linear:
    on_pr_created:
      # Linear auto-links PRs with issue ID in branch name
      add_comment: true

      comment_template: |
        PR opened: [{{pr_title}}]({{pr_url}})
```

### On Feature Complete

```yaml
integrations:
  linear:
    on_feature_complete:
      complete_issue: true
      add_comment: true

      comment_template: |
        **Completed**

        - Duration: {{total_duration}}
        - Test Coverage: {{test_coverage}}%
        - Files Changed: {{files_changed}}
```

---

## Cycle Integration

Integrate with Linear Cycles (Sprints):

```yaml
integrations:
  linear:
    cycles:
      # Assign to current cycle
      assign_to_current: true

      # Or specify cycle
      default_cycle: "cycle_uuid"

      # Create cycle if not exists
      auto_create: false
```

---

## Project Integration

```yaml
integrations:
  linear:
    projects:
      # Map feature types to projects
      mapping:
        frontend: "Frontend"
        backend: "Backend"
        mobile: "Mobile"
        infrastructure: "Infrastructure"

      # Default project
      default: "Backend"

      # Auto-detect from file paths
      auto_detect:
        enabled: true
        rules:
          - path: "src/web/**"
            project: "Frontend"
          - path: "src/api/**"
            project: "Backend"
          - path: "src/mobile/**"
            project: "Mobile"
```

---

## GraphQL Queries

Linear uses GraphQL. Custom queries:

```yaml
integrations:
  linear:
    queries:
      # Find my issues
      my_issues: |
        query {
          viewer {
            assignedIssues(first: 50) {
              nodes {
                id
                title
                state { name }
              }
            }
          }
        }

      # Find team issues
      team_issues: |
        query($teamId: String!) {
          team(id: $teamId) {
            issues(first: 100, filter: { state: { type: { eq: "started" } } }) {
              nodes {
                id
                title
                assignee { name }
              }
            }
          }
        }
```

---

## Bi-Directional Sync

Linear changes can trigger ProAgents actions:

```yaml
integrations:
  linear:
    bidirectional:
      enabled: true

      # When issue state changes in Linear
      on_state_change:
        # Update local feature status
        update_feature: true

        # State to action mapping
        actions:
          "Canceled": "pause_feature"
          "Done": "mark_complete"

      # When assigned in Linear
      on_assignment:
        notify_assignee: true
```

---

## Smart Linking

Auto-link issues by branch name:

```yaml
integrations:
  linear:
    smart_linking:
      enabled: true

      # Branch naming convention
      branch_pattern: "^(?:feature|fix)/([A-Z]+-\\d+)"

      # Auto-link on branch creation
      auto_link: true

      # Update issue when linked
      on_link:
        move_to_state: "In Progress"
        add_label: "in-development"
```

---

## Webhooks

Set up real-time sync:

```yaml
integrations:
  linear:
    webhooks:
      enabled: true
      endpoint: "/webhooks/linear"

      events:
        - "Issue"
        - "Comment"
        - "IssueLabel"

      # Webhook secret
      secret_env: "LINEAR_WEBHOOK_SECRET"
```

---

## Commands

```bash
# Link to existing issue
proagents pm link TEAM-123

# Create new issue
proagents pm create --title "Feature name"

# Sync current feature
proagents pm sync

# List team issues
proagents pm list --state "In Progress"

# Search issues
proagents pm search "authentication"
```

---

## Example Workflow

```
1. Start feature linked to Linear issue
   proagents feature start --link TEAM-456 "Implement OAuth"

2. Linear issue TEAM-456 moves to "In Progress"

3. Work through phases
   - Each phase change updates Linear comment

4. PR created
   - Linear auto-links PR (branch contains TEAM-456)

5. Feature completed
   - TEAM-456 moves to "Done"
   - Summary comment added
```

---

## Troubleshooting

### Connection Issues

```bash
# Test API connection
proagents pm test linear

# Check team access
proagents pm teams linear
```

### Common Errors

| Error | Solution |
|-------|----------|
| Invalid API key | Regenerate API key |
| Team not found | Check team ID/key |
| State not found | Verify state names match |
| Rate limited | Reduce sync frequency |

### Debug Mode

```bash
proagents pm sync --debug
```
