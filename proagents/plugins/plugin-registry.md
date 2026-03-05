# Plugin Registry

Browse and discover ProAgents plugins.

---

## Official Plugins

### Integration Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| `@proagents/plugin-jira` | Jira issue tracking | `proagents plugin install @proagents/plugin-jira` |
| `@proagents/plugin-linear` | Linear issue tracking | `proagents plugin install @proagents/plugin-linear` |
| `@proagents/plugin-github` | GitHub integration | `proagents plugin install @proagents/plugin-github` |
| `@proagents/plugin-gitlab` | GitLab integration | `proagents plugin install @proagents/plugin-gitlab` |
| `@proagents/plugin-bitbucket` | Bitbucket integration | `proagents plugin install @proagents/plugin-bitbucket` |

### Notification Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| `@proagents/plugin-slack` | Slack notifications | `proagents plugin install @proagents/plugin-slack` |
| `@proagents/plugin-discord` | Discord notifications | `proagents plugin install @proagents/plugin-discord` |
| `@proagents/plugin-teams` | Microsoft Teams | `proagents plugin install @proagents/plugin-teams` |
| `@proagents/plugin-email` | Email notifications | `proagents plugin install @proagents/plugin-email` |

### Monitoring Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| `@proagents/plugin-sentry` | Sentry error tracking | `proagents plugin install @proagents/plugin-sentry` |
| `@proagents/plugin-datadog` | Datadog monitoring | `proagents plugin install @proagents/plugin-datadog` |
| `@proagents/plugin-newrelic` | New Relic APM | `proagents plugin install @proagents/plugin-newrelic` |
| `@proagents/plugin-grafana` | Grafana dashboards | `proagents plugin install @proagents/plugin-grafana` |

### Code Quality Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| `@proagents/plugin-sonarqube` | SonarQube analysis | `proagents plugin install @proagents/plugin-sonarqube` |
| `@proagents/plugin-codeclimate` | Code Climate | `proagents plugin install @proagents/plugin-codeclimate` |
| `@proagents/plugin-snyk` | Security scanning | `proagents plugin install @proagents/plugin-snyk` |

### CI/CD Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| `@proagents/plugin-jenkins` | Jenkins integration | `proagents plugin install @proagents/plugin-jenkins` |
| `@proagents/plugin-circleci` | CircleCI integration | `proagents plugin install @proagents/plugin-circleci` |
| `@proagents/plugin-vercel` | Vercel deployment | `proagents plugin install @proagents/plugin-vercel` |
| `@proagents/plugin-netlify` | Netlify deployment | `proagents plugin install @proagents/plugin-netlify` |

---

## Community Plugins

### Popular

| Plugin | Author | Description | Stars |
|--------|--------|-------------|-------|
| `proagents-plugin-notion` | @community | Notion integration | 250 |
| `proagents-plugin-figma` | @community | Figma design sync | 180 |
| `proagents-plugin-storybook` | @community | Storybook integration | 150 |
| `proagents-plugin-chromatic` | @community | Visual testing | 120 |

### Recently Updated

| Plugin | Author | Description | Updated |
|--------|--------|-------------|---------|
| `proagents-plugin-supabase` | @community | Supabase integration | 2 days ago |
| `proagents-plugin-prisma` | @community | Prisma helpers | 1 week ago |
| `proagents-plugin-tailwind` | @community | Tailwind utilities | 1 week ago |

---

## Plugin Details

### @proagents/plugin-jira

**Jira Integration Plugin**

Connect ProAgents with Jira for automatic issue tracking and synchronization.

**Features:**
- Auto-create Jira tickets on feature start
- Sync feature status with Jira workflow
- Link commits and PRs to tickets
- Time tracking integration
- Custom field mapping

**Configuration:**
```yaml
plugins:
  config:
    "@proagents/plugin-jira":
      baseUrl: "https://company.atlassian.net"
      email: "${JIRA_EMAIL}"
      apiToken: "${JIRA_API_TOKEN}"
      projectKey: "PROJ"
      issueType: "Story"
      customFields:
        team: "customfield_10001"
        sprint: "customfield_10002"
      statusMapping:
        analysis: "In Progress"
        implementation: "In Development"
        testing: "In Review"
        complete: "Done"
```

**Commands:**
- `/jira link <ticket-id>` - Link feature to existing ticket
- `/jira status` - Show linked ticket status
- `/jira comment <message>` - Add comment to ticket

---

### @proagents/plugin-slack

**Slack Notification Plugin**

Send notifications to Slack channels for workflow events.

**Features:**
- Feature start/complete notifications
- Phase completion updates
- Error alerts
- Daily/weekly digests
- Interactive approvals

**Configuration:**
```yaml
plugins:
  config:
    "@proagents/plugin-slack":
      webhookUrl: "${SLACK_WEBHOOK_URL}"
      channel: "#development"
      notifications:
        featureStart: true
        phaseComplete: true
        errors: true
        dailyDigest: true
      mentions:
        errors: ["@oncall"]
      messageFormat: "rich"  # or "simple"
```

**Message Templates:**
```yaml
templates:
  featureStart: |
    :rocket: *Feature Started*
    > *{{feature.name}}*
    > Started by {{user.name}}
    > Branch: `{{feature.branch}}`

  phaseComplete: |
    :white_check_mark: *Phase Complete*
    > Feature: {{feature.name}}
    > Phase: {{phase.name}}
    > Duration: {{phase.duration}}
```

---

### @proagents/plugin-sonarqube

**SonarQube Code Quality Plugin**

Integrate SonarQube analysis into the development workflow.

**Features:**
- Automatic analysis on code changes
- Quality gate enforcement
- Issue tracking
- Coverage reporting
- Security hotspot detection

**Configuration:**
```yaml
plugins:
  config:
    "@proagents/plugin-sonarqube":
      serverUrl: "https://sonar.company.com"
      token: "${SONARQUBE_TOKEN}"
      projectKey: "my-project"
      qualityGate:
        enabled: true
        failOnGateFailure: true
      analysis:
        onPhase: ["implementation", "review"]
        excludes:
          - "**/*.test.ts"
          - "**/node_modules/**"
```

---

## Submitting Plugins

### Requirements

1. **Package Name**: Must include `proagents-plugin-` prefix
2. **Keywords**: Include `proagents` and `proagents-plugin`
3. **Documentation**: README with usage instructions
4. **Tests**: Minimum 80% coverage
5. **License**: Open source license (MIT, Apache 2.0, etc.)

### Submission Process

1. **Publish to npm**
   ```bash
   npm publish
   ```

2. **Submit to Registry**
   ```bash
   proagents plugin submit @myorg/proagents-plugin-example
   ```

3. **Review Process**
   - Automated security scan
   - Code review by maintainers
   - Testing in isolated environment

4. **Approval**
   - Listed in community plugins
   - Eligible for "verified" badge with additional review

### Verified Badge

Requirements for verified status:
- Active maintenance (updates within 6 months)
- Security best practices
- Comprehensive documentation
- Test coverage > 80%
- No critical vulnerabilities

---

## Search Plugins

```bash
# Search by keyword
proagents plugin search jira

# Search by category
proagents plugin search --category=integration

# Search by author
proagents plugin search --author=@proagents

# List all plugins
proagents plugin search --all
```

---

## Plugin Statistics

### Most Downloaded

1. `@proagents/plugin-github` - 50,000 downloads
2. `@proagents/plugin-slack` - 45,000 downloads
3. `@proagents/plugin-jira` - 40,000 downloads
4. `@proagents/plugin-sonarqube` - 25,000 downloads
5. `@proagents/plugin-sentry` - 20,000 downloads

### Highest Rated

1. `@proagents/plugin-linear` - 4.9/5
2. `@proagents/plugin-github` - 4.8/5
3. `@proagents/plugin-slack` - 4.8/5
4. `@proagents/plugin-vercel` - 4.7/5
5. `@proagents/plugin-datadog` - 4.7/5
