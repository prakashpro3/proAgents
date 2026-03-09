# GitHub Issues Integration

Native integration with GitHub Issues and Projects.

---

## Setup

### 1. Authentication

GitHub integration uses your existing GitHub authentication:

```yaml
# proagents.config.yaml

integrations:
  github:
    enabled: true
    # Uses GITHUB_TOKEN or gh CLI authentication

    # Repository
    owner: "your-org"
    repo: "your-repo"

    # Optional: GitHub Projects
    project_number: 1  # Project board number
```

### 2. Verify Connection

```bash
proagents pm connect github
proagents pm status
```

---

## Issue Configuration

### Label Mapping

```yaml
integrations:
  github:
    labels:
      # Entry mode labels
      feature: "enhancement"
      bug_fix: "bug"
      quick_change: "quick-fix"
      refactor: "refactor"

      # Phase labels
      phases:
        analysis: "phase:analysis"
        implementation: "phase:implementation"
        testing: "phase:testing"
        review: "phase:review"

      # ProAgents label
      managed: "proagents-managed"
```

### Issue Template

```yaml
integrations:
  github:
    issue_template:
      title: "{{feature_name}}"
      body: |
        ## Description
        {{feature_description}}

        ## Acceptance Criteria
        {{acceptance_criteria}}

        ## Tasks
        - [ ] Analysis complete
        - [ ] Implementation complete
        - [ ] Tests passing
        - [ ] Code reviewed

        ---
        *Managed by ProAgents*

      labels:
        - "enhancement"
        - "proagents-managed"

      assignees:
        - "{{github_username}}"
```

---

## Auto-Actions

### On Feature Start

```yaml
integrations:
  github:
    on_feature_start:
      # Create or link issue
      action: "create_or_link"

      # If creating new issue
      create:
        title: "{{feature_name}}"
        body: "{{issue_template}}"
        labels: ["enhancement", "proagents-managed"]
        assignees: ["{{user}}"]

      # Add to project board
      add_to_project: true
      project_column: "In Progress"
```

### On Phase Change

```yaml
integrations:
  github:
    on_phase_change:
      # Update labels
      update_labels:
        remove: ["phase:*"]  # Remove old phase label
        add: ["phase:{{current_phase}}"]

      # Add comment
      add_comment: |
        **Phase Update**: {{current_phase}}

        {{phase_summary}}

      # Move in project
      move_in_project:
        column: "{{phase_to_column}}"
```

### On PR Created

```yaml
integrations:
  github:
    on_pr_created:
      # Link PR to issue
      link_to_issue: true

      # Add comment to issue
      add_comment: |
        PR created: #{{pr_number}}

      # Update project
      move_in_project:
        column: "In Review"
```

### On Feature Complete

```yaml
integrations:
  github:
    on_feature_complete:
      # Close issue
      close_issue: true

      # Add final comment
      add_comment: |
        **Feature Completed**

        - Duration: {{total_duration}}
        - PR: #{{pr_number}}
        - Test Coverage: {{test_coverage}}%

      # Move in project
      move_in_project:
        column: "Done"
```

---

## GitHub Projects Integration

### Project Board Setup

```yaml
integrations:
  github:
    projects:
      enabled: true
      project_number: 1

      # Column mapping
      columns:
        backlog: "Backlog"
        in_progress: "In Progress"
        review: "In Review"
        done: "Done"

      # Custom fields (Projects V2)
      fields:
        phase:
          name: "Phase"
          type: "single_select"
        priority:
          name: "Priority"
          type: "single_select"
```

### Auto-Move Cards

```yaml
integrations:
  github:
    projects:
      auto_move:
        # Move on issue events
        on_issue_opened: "Backlog"
        on_issue_assigned: "In Progress"
        on_pr_opened: "In Review"
        on_pr_merged: "Done"
        on_issue_closed: "Done"
```

---

## Smart Linking

### Branch to Issue

```yaml
integrations:
  github:
    smart_linking:
      # Extract issue number from branch name
      branch_pattern: "^(?:feature|fix)/(?:GH-)?(\d+)"

      # Auto-link PR to issue
      auto_link_pr: true

      # Close issue on PR merge
      close_on_merge: true
```

### Commit Messages

```yaml
integrations:
  github:
    commits:
      # Reference issue in commits
      template: "{{message}}\n\nRefs: #{{issue_number}}"

      # Close keywords
      close_keywords: ["fixes", "closes", "resolves"]
```

---

## Commands

```bash
# Link to existing issue
proagents pm link --issue 123

# Create new issue
proagents pm create --title "Feature name"

# Update issue
proagents pm update --labels "phase:testing"

# Close issue
proagents pm close --issue 123

# List issues
proagents pm list --state open --label "proagents-managed"

# Move in project
proagents pm move --column "In Review"
```

---

## GitHub CLI Integration

ProAgents uses `gh` CLI when available:

```bash
# Authenticate
gh auth login

# ProAgents uses gh for:
# - Creating issues
# - Creating PRs
# - Managing projects
# - Querying issues
```

---

## Best Practices

1. **Use Labels**: Consistent labeling for filtering
2. **Link Everything**: Connect issues, PRs, and commits
3. **Project Boards**: Use for visual tracking
4. **Templates**: Create issue templates for consistency
5. **Automation**: Combine with GitHub Actions
