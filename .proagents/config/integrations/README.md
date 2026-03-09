# Integration Configurations

Configuration examples for integrating ProAgents with external tools.

---

## Available Integrations

| Integration | Purpose | Config File |
|-------------|---------|-------------|
| Jira | Issue tracking, sprint management | `jira.yaml` |
| Linear | Modern issue tracking | `linear.yaml` |
| GitHub | Repository, PRs, Issues | `github.yaml` |
| Slack | Team notifications | `slack.yaml` |
| Notion | Documentation sync | `notion.yaml` |

---

## Setup Process

1. **Copy the example config** to your `proagents.config.yaml`
2. **Set environment variables** for API keys (never commit secrets)
3. **Test the integration** with `pa:integration test <name>`

---

## Environment Variables

Create a `.env` file (gitignored) with your credentials:

```bash
# .env
JIRA_API_TOKEN=your-token
JIRA_EMAIL=your-email@company.com
LINEAR_API_KEY=lin_api_xxx
GITHUB_TOKEN=ghp_xxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
NOTION_API_KEY=secret_xxx
```

---

## Testing Integrations

```bash
# Test single integration
proagents integration test jira

# Test all integrations
proagents integration test --all

# Check connection status
proagents integration status
```

---

## Common Issues

### Authentication Failures
- Verify API tokens are correct
- Check token permissions/scopes
- Ensure tokens haven't expired

### Connection Issues
- Check network/firewall settings
- Verify base URLs are correct
- Check for VPN requirements
