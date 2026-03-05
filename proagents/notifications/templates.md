# Notification Templates

Customize notification message formats.

---

## Template System

### Template Location

```
/proagents/
├── notifications/
│   └── templates/
│       ├── slack/
│       │   ├── feature-completed.json
│       │   ├── deploy-failed.json
│       │   └── approval-needed.json
│       ├── email/
│       │   ├── feature-completed.html
│       │   └── weekly-digest.html
│       └── default/
│           └── generic.md
```

### Template Variables

All templates have access to:

```yaml
# Event data
event:
  type: "feature.completed"
  timestamp: "2024-01-15T14:30:00Z"

# Feature data
feature:
  id: "feat-123"
  name: "User Authentication"
  branch: "feature/user-auth"
  duration: 240

# Project data
project:
  name: "my-project"
  environment: "production"

# User data
user:
  name: "John Doe"
  email: "john@company.com"
```

---

## Slack Templates

### Block Template

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "{{title}}"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "{{message}}"
      }
    },
    {{#if fields}}
    {
      "type": "section",
      "fields": [
        {{#each fields}}
        {
          "type": "mrkdwn",
          "text": "*{{this.label}}:*\n{{this.value}}"
        }{{#unless @last}},{{/unless}}
        {{/each}}
      ]
    },
    {{/if}}
    {{#if actions}}
    {
      "type": "actions",
      "elements": [
        {{#each actions}}
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "{{this.label}}"
          },
          "url": "{{this.url}}"
        }{{#unless @last}},{{/unless}}
        {{/each}}
      ]
    }
    {{/if}}
  ]
}
```

### Feature Completed Template

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Feature Completed"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Feature *{{feature.name}}* has been completed!"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Branch:*\n`{{feature.branch}}`"
        },
        {
          "type": "mrkdwn",
          "text": "*Duration:*\n{{formatDuration feature.duration}}"
        },
        {
          "type": "mrkdwn",
          "text": "*Files Changed:*\n{{feature.files_changed}}"
        },
        {
          "type": "mrkdwn",
          "text": "*Test Coverage:*\n{{feature.coverage}}%"
        }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {"type": "plain_text", "text": "View PR"},
          "url": "{{feature.pr_url}}",
          "style": "primary"
        },
        {
          "type": "button",
          "text": {"type": "plain_text", "text": "View Docs"},
          "url": "{{feature.docs_url}}"
        }
      ]
    }
  ]
}
```

---

## Email Templates

### HTML Template

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
    .header { background: #2563eb; color: white; padding: 20px; }
    .content { padding: 20px; }
    .footer { background: #f3f4f6; padding: 10px; text-align: center; }
    .button { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{title}}</h1>
    </div>
    <div class="content">
      <p>{{message}}</p>

      {{#if fields}}
      <div class="fields">
        {{#each fields}}
        <div class="field">
          <span class="label">{{this.label}}:</span>
          <span>{{this.value}}</span>
        </div>
        {{/each}}
      </div>
      {{/if}}

      {{#if actions}}
      <div class="actions" style="margin-top: 20px;">
        {{#each actions}}
        <a href="{{this.url}}" class="button">{{this.label}}</a>
        {{/each}}
      </div>
      {{/if}}
    </div>
    <div class="footer">
      <p>Sent by ProAgents | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
```

### Weekly Digest Template

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* styles */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Weekly Development Digest</h1>
      <p>{{formatDate digest.start_date}} - {{formatDate digest.end_date}}</p>
    </div>

    <div class="content">
      <h2>Summary</h2>
      <div class="stats">
        <div class="stat">
          <span class="number">{{digest.features_completed}}</span>
          <span class="label">Features Completed</span>
        </div>
        <div class="stat">
          <span class="number">{{digest.bugs_fixed}}</span>
          <span class="label">Bugs Fixed</span>
        </div>
        <div class="stat">
          <span class="number">{{digest.deployments}}</span>
          <span class="label">Deployments</span>
        </div>
      </div>

      {{#if digest.features}}
      <h2>Completed Features</h2>
      <ul>
        {{#each digest.features}}
        <li>
          <strong>{{this.name}}</strong>
          <p>{{this.summary}}</p>
        </li>
        {{/each}}
      </ul>
      {{/if}}

      {{#if digest.highlights}}
      <h2>Highlights</h2>
      <ul>
        {{#each digest.highlights}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      {{/if}}
    </div>
  </div>
</body>
</html>
```

---

## Template Helpers

### Built-in Helpers

```yaml
# Date formatting
{{formatDate timestamp}}                    # Jan 15, 2024
{{formatDate timestamp "YYYY-MM-DD"}}      # 2024-01-15
{{formatDate timestamp "relative"}}         # 2 hours ago

# Duration formatting
{{formatDuration minutes}}                  # 4h 30m
{{formatDuration seconds "seconds"}}        # 2m 15s

# Number formatting
{{formatNumber value}}                      # 1,234
{{formatPercent value}}                     # 85.5%

# Conditional
{{#if condition}}...{{/if}}
{{#unless condition}}...{{/unless}}
{{#eq value "test"}}...{{/eq}}

# Loops
{{#each items}}{{this}}{{/each}}

# String helpers
{{uppercase text}}
{{lowercase text}}
{{truncate text 50}}

# Code formatting
{{code snippet}}                            # Inline code
{{codeblock snippet "javascript"}}          # Code block
```

### Custom Helpers

```yaml
# proagents.config.yaml
notifications:
  templates:
    helpers:
      - name: "statusEmoji"
        script: |
          function(status) {
            const emojis = {
              success: '',
              failure: '',
              warning: '',
              info: ''
            };
            return emojis[status] || '';
          }

      - name: "priortyColor"
        script: |
          function(priority) {
            const colors = {
              critical: '#dc2626',
              high: '#f97316',
              normal: '#2563eb',
              low: '#6b7280'
            };
            return colors[priority] || colors.normal;
          }
```

---

## Template Configuration

### Default Templates

```yaml
notifications:
  templates:
    # Use built-in templates
    use_defaults: true

    # Override specific templates
    overrides:
      feature.completed: "./templatespa:feature-completed.json"
      deploy.failed: "./templates/deploy-failed.json"

    # Template directory
    directory: "./proagents/notifications/templates"
```

### Per-Channel Templates

```yaml
notifications:
  templates:
    channels:
      slack:
        feature.completed: "./templates/slackpa:feature-completed.json"
        deploy.failed: "./templates/slack/deploy-failed.json"

      email:
        feature.completed: "./templates/emailpa:feature-completed.html"
        weekly_digest: "./templates/email/weekly-digest.html"

      # Discord uses default templates
      discord: null
```

---

## Template Preview

### Preview Command

```bash
# Preview template with sample data
proagents notifications template preview feature.completed

# Preview with custom data
proagents notifications template preview feature.completed \
  --data '{"feature": {"name": "Test Feature"}}'

# Preview for specific channel
proagents notifications template preview feature.completed --channel slack
```

### Preview Output

```
┌─────────────────────────────────────────────────────────────┐
│ Template Preview: feature.completed (Slack)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ╔═══════════════════════════════════════════════════════╗  │
│ ║  Feature Completed                                     ║  │
│ ╠═══════════════════════════════════════════════════════╣  │
│ ║  Feature *User Authentication* has been completed!    ║  │
│ ║                                                        ║  │
│ ║  Branch:         Duration:                            ║  │
│ ║  `feature/auth`  4h 30m                               ║  │
│ ║                                                        ║  │
│ ║  Files Changed:  Coverage:                            ║  │
│ ║  15              85.5%                                ║  │
│ ║                                                        ║  │
│ ║  [View PR] [View Docs]                                ║  │
│ ╚═══════════════════════════════════════════════════════╝  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Keep It Concise**: Short, actionable messages
2. **Include Actions**: Add relevant buttons/links
3. **Use Formatting**: Make important info stand out
4. **Be Consistent**: Same style across templates
5. **Test Templates**: Preview before deploying
6. **Version Control**: Track template changes
