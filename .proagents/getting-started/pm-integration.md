# Getting Started with PM Tool Integration

Connect ProAgents to your project management tools for seamless workflow tracking.

---

## Supported Tools

| Tool | Features |
|------|----------|
| **Jira** | Issues, sprints, status sync |
| **Linear** | Issues, cycles, bi-directional sync |
| **Trello** | Cards, boards, labels |
| **GitHub Issues** | Full integration with PRs |
| **GitLab Issues** | Full integration with MRs |
| **Asana** | Tasks, projects, sections |
| **Notion** | Database sync, documentation |

---

## Quick Setup

### Step 1: Choose Your Tool

```bash
pa:pm setup
```

Select from the interactive menu, or specify directly:

```bash
pa:pm setup jira
pa:pm setup linear
pa:pm setup github
```

### Step 2: Authenticate

#### Jira

```yaml
# proagents.config.yaml
integrations:
  jira:
    enabled: true
    base_url: "https://your-company.atlassian.net"
    email: "${JIRA_EMAIL}"
    api_token: "${JIRA_API_TOKEN}"
    project_key: "PROJ"
```

Get your API token: https://id.atlassian.com/manage-profile/security/api-tokens

#### Linear

```yaml
integrations:
  linear:
    enabled: true
    api_key: "${LINEAR_API_KEY}"
    team_id: "TEAM-123"
```

Get your API key: Linear Settings → API → Personal API Keys

#### GitHub Issues

```yaml
integrations:
  github:
    enabled: true
    token: "${GITHUB_TOKEN}"
    owner: "your-org"
    repo: "your-repo"
```

### Step 3: Test Connection

```bash
pa:pm test
```

Expected output:
```
✓ Connected to Jira
✓ Project PROJ found
✓ Can create issues
✓ Can read issues
✓ Integration ready!
```

---

## Basic Usage

### Create Issue from Feature

When you start a feature:
```bash
pa:feature "Add user authentication"
```

ProAgents automatically:
1. Creates an issue in your PM tool
2. Links it to the feature branch
3. Updates status as you progress

### Sync Status

```bash
pa:pm sync
```

Updates your PM tool with current feature status.

### Link Existing Issue

```bash
pa:feature "Add auth" --issue PROJ-123
```

---

## Configuration Options

### Jira Configuration

```yaml
integrations:
  jira:
    enabled: true
    base_url: "https://your-company.atlassian.net"
    email: "${JIRA_EMAIL}"
    api_token: "${JIRA_API_TOKEN}"
    project_key: "PROJ"

    # Auto-create issues
    auto_create_issues: true

    # Status mapping
    status_mapping:
      analysis: "To Do"
      implementation: "In Progress"
      review: "In Review"
      testing: "Testing"
      completed: "Done"

    # Issue type mapping
    issue_types:
      feature: "Story"
      bug: "Bug"
      task: "Task"

    # Fields to sync
    sync_fields:
      - summary
      - description
      - status
      - assignee
      - labels

    # Transitions
    transitions:
      to_in_progress: "Start Progress"
      to_review: "Request Review"
      to_done: "Mark Complete"
```

### Linear Configuration

```yaml
integrations:
  linear:
    enabled: true
    api_key: "${LINEAR_API_KEY}"
    team_id: "TEAM-123"

    # Bi-directional sync
    bi_directional: true

    # Status mapping
    status_mapping:
      analysis: "Backlog"
      implementation: "In Progress"
      review: "In Review"
      completed: "Done"

    # Labels
    auto_labels:
      - "proagents"

    # Cycle assignment
    assign_to_current_cycle: true
```

### GitHub Issues Configuration

```yaml
integrations:
  github:
    enabled: true
    token: "${GITHUB_TOKEN}"
    owner: "your-org"
    repo: "your-repo"

    # Auto-create issues
    auto_create: true

    # Labels
    default_labels:
      - "feature"
      - "proagents"

    # Link PRs
    auto_link_pr: true

    # Close on merge
    close_on_merge: true

    # Issue templates
    templates:
      feature: ".github/ISSUE_TEMPLATE/feature.md"
      bug: ".github/ISSUE_TEMPLATE/bug.md"
```

---

## Workflow Integration

### Feature Lifecycle

```
┌─────────────────┐
│ pa:feature  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Create Issue    │────▶│ PM Tool         │
│ (Jira/Linear)   │     │ Issue Created   │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Implementation  │────▶│ Status: In      │
│ Phase           │     │ Progress        │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Create PR       │────▶│ PR Linked to    │
│                 │     │ Issue           │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Merge PR        │────▶│ Issue Closed    │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

### Bug Fix Integration

```bash
pa:fix "Login button broken" --issue BUG-456
```

ProAgents:
1. Links to existing bug
2. Updates status to "In Progress"
3. Creates branch from issue
4. Updates issue on completion

---

## Commands

```bash
# Setup
pa:pm setup [tool]           # Initialize PM integration

# Status
pa:pm status                  # Show integration status
pa:pm test                    # Test connection

# Sync
pa:pm sync                    # Sync current feature
pa:pm sync-all                # Sync all active features

# Issues
pa:pm create "Title"          # Create new issue
pa:pm link ISSUE-123          # Link current feature to issue
pa:pm unlink                  # Unlink current feature

# Queries
pa:pm issues                  # List assigned issues
pa:pm search "query"          # Search issues
```

---

## Troubleshooting

### Authentication Failed

```bash
# Re-authenticate
pa:pm auth

# Test with debug output
pa:pm test --debug
```

### Status Not Syncing

1. Check status mapping in config
2. Verify transition names match your workflow
3. Check permissions on the PM tool

### Rate Limiting

```yaml
integrations:
  jira:
    rate_limit:
      requests_per_minute: 30
      retry_on_limit: true
```

---

## Next Steps

- [Set up AI Training](./ai-training-setup.md)
- [Configure IDE](./ide-setup.md)
- [Review PM integration details](../integrations/pm/)
