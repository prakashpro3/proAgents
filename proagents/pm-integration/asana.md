# Asana Integration

Task management integration with Asana for cross-functional teams.

---

## Setup

### 1. Create Personal Access Token

1. Go to [Asana Developer Console](https://app.asana.com/0/developer-console)
2. Create a Personal Access Token
3. Copy the token

### 2. Configure Connection

```yaml
# proagents.config.yaml

integrations:
  asana:
    enabled: true
    token_env: "ASANA_TOKEN"

    # Workspace and project
    workspace_gid: "your-workspace-gid"
    project_gid: "your-project-gid"

    # Optional: Team
    team_gid: "your-team-gid"
```

### 3. Set Environment Variable

```bash
export ASANA_TOKEN="your-personal-access-token"
```

### 4. Verify Connection

```bash
proagents pm connect asana
proagents pm status
```

---

## Section Mapping

Map ProAgents phases to Asana sections:

```yaml
integrations:
  asana:
    sections:
      # Section mapping
      mapping:
        backlog: "Backlog"
        in_progress: "In Progress"
        review: "In Review"
        done: "Done"

      # Phase to section
      phase_mapping:
        init: "Backlog"
        analysis: "In Progress"
        implementation: "In Progress"
        testing: "In Review"
        review: "In Review"
        deployed: "Done"
```

---

## Task Configuration

### Task Template

```yaml
integrations:
  asana:
    task_template:
      name: "{{feature_name}}"

      notes: |
        ## Description
        {{feature_description}}

        ## Acceptance Criteria
        {{acceptance_criteria}}

        ---
        Managed by ProAgents

      # Custom fields
      custom_fields:
        - name: "Phase"
          value: "{{current_phase}}"
        - name: "Type"
          value: "Feature"
        - name: "Branch"
          value: "{{branch_name}}"

      # Tags
      tags:
        - "proagents"
        - "{{entry_mode}}"

      # Due date
      due_on: "{{due_date}}"

      # Assignee
      assignee: "{{asana_user_gid}}"
```

### Subtasks

```yaml
integrations:
  asana:
    subtasks:
      enabled: true
      template:
        - name: "Analysis complete"
          completed: false
        - name: "Implementation complete"
          completed: false
        - name: "Tests passing"
          completed: false
        - name: "Code reviewed"
          completed: false
        - name: "Documentation updated"
          completed: false
```

---

## Auto-Actions

### On Feature Start

```yaml
integrations:
  asana:
    on_feature_start:
      action: "create_task"

      task:
        name: "{{feature_name}}"
        notes: "{{task_template}}"
        section: "In Progress"
        assignee: "{{user}}"
        tags: ["proagents"]

      # Create subtasks
      create_subtasks: true
```

### On Phase Change

```yaml
integrations:
  asana:
    on_phase_change:
      # Move to appropriate section
      move_section: true

      # Update custom field
      update_field:
        name: "Phase"
        value: "{{current_phase}}"

      # Add comment (story)
      add_comment: |
        **Phase Update**: {{current_phase}}
        {{phase_summary}}

      # Update subtask if applicable
      complete_subtask: "{{completed_subtask}}"
```

### On Feature Complete

```yaml
integrations:
  asana:
    on_feature_complete:
      # Move to done
      move_section: "Done"

      # Complete task
      complete_task: true

      # Add final comment
      add_comment: |
        **Completed**

        - Duration: {{total_duration}}
        - PR: {{pr_link}}
        - Coverage: {{test_coverage}}%

      # Complete remaining subtasks
      complete_all_subtasks: true
```

---

## Portfolio Integration

### Project Portfolios

```yaml
integrations:
  asana:
    portfolios:
      enabled: true
      portfolio_gid: "portfolio-gid"

      # Status updates
      status_updates:
        frequency: "weekly"
        include:
          - features_completed
          - features_in_progress
          - blockers
```

### Goals Integration

```yaml
integrations:
  asana:
    goals:
      enabled: true

      # Link features to goals
      goal_mapping:
        - feature_type: "user_growth"
          goal_gid: "goal-1"
        - feature_type: "performance"
          goal_gid: "goal-2"
```

---

## Custom Fields

### Define Custom Fields

```yaml
integrations:
  asana:
    custom_fields:
      phase:
        gid: "field-gid-1"
        type: "enum"
        options:
          - "Analysis"
          - "Implementation"
          - "Testing"
          - "Review"
          - "Done"

      type:
        gid: "field-gid-2"
        type: "enum"
        options:
          - "Feature"
          - "Bug Fix"
          - "Refactor"

      branch:
        gid: "field-gid-3"
        type: "text"

      pr_link:
        gid: "field-gid-4"
        type: "text"

      test_coverage:
        gid: "field-gid-5"
        type: "number"
```

---

## Commands

```bash
# Link to existing task
proagents pm link --task "task-gid"

# Create new task
proagents pm create --title "Feature name"

# Update task
proagents pm update --section "In Review"

# Complete task
proagents pm complete

# Add comment
proagents pm comment "Status update"

# List tasks
proagents pm list --section "In Progress"
```

---

## Webhooks

### Configure Webhooks

```yaml
integrations:
  asana:
    webhooks:
      enabled: true
      endpoint: "/webhooks/asana"

      # Events to listen for
      events:
        - "changed"
        - "added"
        - "removed"

      # Actions
      actions:
        on_task_completed:
          action: "mark_feature_complete"

        on_task_assigned:
          action: "notify_assignee"
```

---

## Best Practices

1. **Use Sections**: Organize by workflow stage
2. **Custom Fields**: Track phase and metadata
3. **Subtasks**: Break down into trackable items
4. **Tags**: Categorize for filtering
5. **Dependencies**: Link related tasks
6. **Portfolios**: Roll up to project level
