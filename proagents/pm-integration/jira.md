# Jira Integration

Full integration with Atlassian Jira for enterprise project management.

---

## Setup

### 1. Create API Token

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Name it "ProAgents Integration"
4. Copy the token

### 2. Configure Connection

```yaml
# proagents.config.yaml

integrations:
  jira:
    enabled: true
    base_url: "https://your-company.atlassian.net"
    email: "your-email@company.com"
    # API token stored in environment variable
    api_token_env: "JIRA_API_TOKEN"

    # Project settings
    project_key: "PROJ"
    default_issue_type: "Story"
```

### 3. Set Environment Variable

```bash
export JIRA_API_TOKEN="your-api-token"
```

### 4. Verify Connection

```bash
proagents pm connect jira
proagents pm status
```

---

## Issue Type Mapping

```yaml
integrations:
  jira:
    issue_types:
      feature: "Story"
      bug_fix: "Bug"
      quick_change: "Task"
      refactor: "Technical Debt"
      documentation: "Documentation"

    # Priority mapping
    priorities:
      critical: "Highest"
      high: "High"
      medium: "Medium"
      low: "Low"
```

---

## Workflow Status Mapping

Map ProAgents phases to Jira workflow statuses:

```yaml
integrations:
  jira:
    status_mapping:
      # ProAgents phase: Jira status
      init: "To Do"
      analysis: "In Progress"
      requirements: "In Progress"
      design: "In Progress"
      planning: "In Progress"
      implementation: "In Development"
      testing: "In QA"
      review: "Code Review"
      documentation: "Documentation"
      deployment: "Ready for Release"
      deployed: "Done"

    # Transition IDs (optional, for custom workflows)
    transitions:
      start: "21"
      in_development: "31"
      in_qa: "41"
      done: "51"
```

---

## Field Mapping

Map ProAgents data to Jira fields:

```yaml
integrations:
  jira:
    field_mapping:
      # Standard fields
      feature_name: "summary"
      description: "description"
      assignee: "assignee"

      # Custom fields
      branch_name: "customfield_10001"
      pr_link: "customfield_10002"
      test_coverage: "customfield_10003"

      # Labels
      auto_labels:
        - "proagents-managed"
        - "{{project_type}}"
```

---

## Auto-Actions

### On Feature Start

```yaml
integrations:
  jira:
    on_feature_start:
      action: "create_or_link"

      # If issue doesn't exist, create it
      create:
        issue_type: "Story"
        summary: "{{feature_name}}"
        description: |
          ## Feature Description
          {{feature_description}}

          ## Acceptance Criteria
          {{acceptance_criteria}}

          ---
          *Created by ProAgents*

        labels:
          - "proagents"
          - "{{entry_mode}}"

        components:
          - "{{affected_module}}"
```

### On Phase Change

```yaml
integrations:
  jira:
    on_phase_change:
      update_status: true
      add_comment: true

      comment_template: |
        **Phase Update**: {{previous_phase}} → {{current_phase}}

        {{#if phase_summary}}
        **Summary**: {{phase_summary}}
        {{/if}}

        **Progress**: {{progress_percentage}}%
```

### On PR Created

```yaml
integrations:
  jira:
    on_pr_created:
      link_pr: true
      update_field: "customfield_10002"  # PR link field
      add_comment: true

      comment_template: |
        **Pull Request Created**

        PR: [{{pr_title}}]({{pr_url}})
        Branch: `{{branch_name}}`

        {{#if pr_description}}
        {{pr_description}}
        {{/if}}
```

### On Feature Complete

```yaml
integrations:
  jira:
    on_feature_complete:
      transition_to: "Done"
      add_comment: true

      comment_template: |
        **Feature Completed**

        - Duration: {{total_duration}}
        - Commits: {{commit_count}}
        - Test Coverage: {{test_coverage}}%

        **Summary**:
        {{completion_summary}}
```

---

## JQL Queries

Use JQL to find and link issues:

```yaml
integrations:
  jira:
    queries:
      # Find open issues for current project
      open_issues: "project = {{project_key}} AND status != Done"

      # Find issues for current feature
      feature_issues: "project = {{project_key}} AND labels = {{feature_name}}"

      # Find bugs to fix
      open_bugs: "project = {{project_key}} AND type = Bug AND status = Open"
```

---

## Smart Linking

ProAgents can automatically find and link related issues:

```yaml
integrations:
  jira:
    smart_linking:
      enabled: true

      # Search strategies
      strategies:
        - type: "branch_name"
          pattern: "PROJ-\\d+"  # Extract issue key from branch

        - type: "commit_message"
          pattern: "PROJ-\\d+"  # Extract from commits

        - type: "feature_name"
          search: "summary ~ '{{feature_name}}'"
```

---

## Bulk Operations

### Import Issues

```bash
# Import issues as features
proagents pm import --source jira --query "project = PROJ AND type = Story AND status = 'To Do'"
```

### Sync All

```bash
# Sync all active features with Jira
proagents pm sync --all
```

### Export Report

```bash
# Export feature report to Jira
proagents pm export-report --to jira --issue PROJ-123
```

---

## Webhooks (Optional)

Set up webhooks for real-time sync:

```yaml
integrations:
  jira:
    webhooks:
      enabled: true
      endpoint: "/webhooks/jira"

      events:
        - "issue_updated"
        - "issue_assigned"
        - "comment_created"

      # Secret for webhook verification
      secret_env: "JIRA_WEBHOOK_SECRET"
```

---

## Example Workflow

```
1. Developer: proagents feature start "Add user preferences"
   └── ProAgents creates PROJ-456 in Jira

2. Analysis phase completes
   └── PROJ-456 status → "In Progress"
   └── Comment added with analysis summary

3. Implementation starts
   └── PROJ-456 status → "In Development"
   └── Branch name added to custom field

4. PR created
   └── PR link added to PROJ-456
   └── Comment with PR details

5. Feature deployed
   └── PROJ-456 status → "Done"
   └── Final summary comment added
```

---

## Troubleshooting

### Connection Issues

```bash
# Test connection
proagents pm test jira

# Verbose mode
proagents pm connect jira --verbose
```

### Common Errors

| Error | Solution |
|-------|----------|
| 401 Unauthorized | Check API token and email |
| 404 Project not found | Verify project key |
| Transition failed | Check workflow permissions |
| Field not found | Verify custom field IDs |

### Debug Mode

```bash
# Enable debug logging
proagents pm sync --debug
```
