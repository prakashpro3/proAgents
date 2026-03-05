# Project Management Integrations

Detailed guides for integrating ProAgents with project management tools.

---

## Supported Tools

| Tool | Status | Configuration |
|------|--------|---------------|
| [Jira](#jira) | Full Support | [jira.yaml](../../config/integrations/jira.yaml) |
| [Linear](#linear) | Full Support | [linear.yaml](../../config/integrations/linear.yaml) |
| [GitHub Issues](#github-issues) | Full Support | [github.yaml](../../config/integrations/github.yaml) |
| [GitLab Issues](#gitlab-issues) | Full Support | Via GitLab API |
| [Asana](#asana) | Supported | Custom config |
| [Trello](#trello) | Supported | Custom config |
| [Notion](#notion) | Supported | [notion.yaml](../../config/integrations/notion.yaml) |

---

## Jira

### Setup

1. **Get API Token**
   - Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Create new API token
   - Save securely

2. **Configure ProAgents**

```yaml
# proagents.config.yaml
integrations:
  jira:
    enabled: true
    base_url: "https://your-org.atlassian.net"
    project_key: "PROJ"

    # Feature sync
    auto_create_issues: true
    auto_update_status: true

    # Status mapping
    transition_mapping:
      analysis_complete: "In Progress"
      implementation_complete: "In Review"
      deployed: "Done"
```

3. **Set Environment Variables**

```bash
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

### Features

- **Auto-create issues** when features start
- **Status sync** as workflow progresses
- **Link PRs** to Jira issues
- **Time logging** for phases

### Detailed Config

See [config/integrations/jira.yaml](../../config/integrations/jira.yaml) for full options.

---

## Linear

### Setup

1. **Get API Key**
   - Linear Settings → API → Personal API keys
   - Create new key

2. **Configure ProAgents**

```yaml
# proagents.config.yaml
integrations:
  linear:
    enabled: true
    team_id: "TEAM-123"

    auto_link_prs: true
    sync_status: true
```

3. **Set Environment Variables**

```bash
LINEAR_API_KEY=your-api-key
```

### Features

- **Bi-directional sync** with Linear issues
- **Auto-link PRs** to issues
- **Label management** based on workflow phase
- **Priority mapping**

### Detailed Config

See [config/integrations/linear.yaml](../../config/integrations/linear.yaml) for full options.

---

## GitHub Issues

### Setup

1. **Get Personal Access Token**
   - GitHub Settings → Developer settings → Personal access tokens
   - Create token with `repo` scope

2. **Configure ProAgents**

```yaml
# proagents.config.yaml
integrations:
  github:
    enabled: true

    issues:
      auto_create: true
      auto_close: true
      labels_from_workflow: true

    pull_requests:
      auto_create: true
      template: true
```

3. **Set Environment Variables**

```bash
GITHUB_TOKEN=your-token
```

### Features

- **Issue creation** for features
- **Auto-close issues** on deployment
- **PR templates** from workflow
- **Label automation**

### Detailed Config

See [config/integrations/github.yaml](../../config/integrations/github.yaml) for full options.

---

## GitLab Issues

### Setup

Similar to GitHub, using GitLab API tokens.

```yaml
integrations:
  gitlab:
    enabled: true
    project_id: "12345"
    auto_create_issues: true
```

```bash
GITLAB_TOKEN=your-token
GITLAB_URL=https://gitlab.com  # or self-hosted URL
```

---

## Asana

### Setup

```yaml
integrations:
  asana:
    enabled: true
    workspace_id: "your-workspace-id"
    project_id: "your-project-id"
```

```bash
ASANA_ACCESS_TOKEN=your-token
```

### Features

- Task creation and tracking
- Section-based status management
- Due date synchronization

---

## Trello

### Setup

```yaml
integrations:
  trello:
    enabled: true
    board_id: "your-board-id"

    list_mapping:
      backlog: "Backlog"
      in_progress: "In Progress"
      review: "Review"
      done: "Done"
```

```bash
TRELLO_API_KEY=your-key
TRELLO_TOKEN=your-token
```

### Features

- Card creation for features
- List-based status tracking
- Label automation

---

## Notion

### Setup

1. **Create Integration**
   - [Notion Integrations](https://www.notion.so/my-integrations)
   - Create new integration
   - Share database with integration

2. **Configure ProAgents**

```yaml
integrations:
  notion:
    enabled: true
    database_id: "your-database-id"
    sync_documentation: true
```

3. **Set Environment Variables**

```bash
NOTION_API_KEY=your-integration-token
```

### Features

- **Database sync** for features
- **Documentation sync** to Notion pages
- **Status property** updates
- **Rich content** support

### Detailed Config

See [config/integrations/notion.yaml](../../config/integrations/notion.yaml) for full options.

---

## Common Patterns

### Status Synchronization

All PM tools follow similar status mapping:

| ProAgents Phase | Typical PM Status |
|-----------------|-------------------|
| Analysis | Backlog / To Do |
| Design | In Progress |
| Implementation | In Progress |
| Testing | In Review |
| Deployed | Done |

### Environment Variables

Best practices for credentials:

```bash
# .env.local (not committed)
JIRA_API_TOKEN=xxx
LINEAR_API_KEY=xxx
GITHUB_TOKEN=xxx

# Or use secrets manager
# AWS Secrets Manager, HashiCorp Vault, etc.
```

### Webhooks

For real-time updates, configure webhooks:

```yaml
webhooks:
  enabled: true
  events:
    - feature_started
    - feature_completed
    - deployment_success
    - deployment_failure
```

---

## Troubleshooting

### Connection Issues

1. Verify API credentials
2. Check network/firewall
3. Ensure correct base URL
4. Verify permissions

### Sync Issues

1. Check status mapping configuration
2. Verify project/board IDs
3. Check webhook delivery
4. Review error logs

### Rate Limiting

Most APIs have rate limits:
- Jira: 100 requests/minute
- Linear: 1000 requests/hour
- GitHub: 5000 requests/hour

ProAgents handles rate limiting automatically.

---

## Related Resources

- [Getting Started with PM Integration](../../getting-started/pm-integration.md)
- [Configuration Reference](../../config/README.md)
- [Sync Configuration](../../pm-integration/)
