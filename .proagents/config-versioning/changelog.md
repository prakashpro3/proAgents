# Configuration Changelog

Track and document configuration changes over time.

---

## Changelog Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Config Changelog                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Every config change generates a changelog entry:          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ v1.5.1 - January 15, 2024                           │   │
│  │                                                     │   │
│  │ Changed:                                            │   │
│  │ • checkpoints.before_deployment: false → true       │   │
│  │                                                     │   │
│  │ Added:                                              │   │
│  │ • security.require_review: true                     │   │
│  │ • security.scan_dependencies: true                  │   │
│  │                                                     │   │
│  │ Reason: Stricter security requirements              │   │
│  │ Author: alice@company.com                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Changelog Configuration

### Auto-Generation

```yaml
config_versioning:
  changelog:
    enabled: true

    # Auto-generate on changes
    auto_generate: true

    # Output location
    output:
      file: ".proagents/config-history/changelog.md"
      format: "markdown"  # markdown, json, yaml

    # What to include
    include:
      - version
      - timestamp
      - author
      - reason
      - changes
      - files_affected
```

### Changelog Format

```yaml
config_versioning:
  changelog:
    format:
      # Markdown template
      template: |
        ## {{version}} - {{date}}

        **Author:** {{author}}
        **Reason:** {{reason}}

        ### Changes
        {{#each changes}}
        - `{{this.path}}`: {{this.old}} → {{this.new}}
        {{/each}}

        ### Files Modified
        {{#each files}}
        - {{this}}
        {{/each}}

        ---
```

---

## Viewing Changelog

### Command Line

```bash
# View recent changes
proagents config changelog

# View specific version
proagents config changelog --version v1.5.0

# View changes between versions
proagents config changelog --from v1.4.0 --to v1.5.0

# Export changelog
proagents config changelog --export changelog.md
```

### Changelog Output

```
┌─────────────────────────────────────────────────────────────┐
│ Configuration Changelog                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ## v1.5.1 - January 15, 2024 10:30                         │
│                                                             │
│ **Author:** alice@company.com                              │
│ **Reason:** Added stricter security rules                  │
│                                                             │
│ ### Changes                                                 │
│ - `checkpoints.before_deployment`: false → true            │
│ - `security.require_review`: (new) true                    │
│ - `security.scan_dependencies`: (new) true                 │
│                                                             │
│ ### Files Modified                                          │
│ - proagents.config.yaml                                    │
│ - rules/security-rules.yaml                                │
│                                                             │
│ ---                                                         │
│                                                             │
│ ## v1.5.0 - January 14, 2024 15:45                         │
│                                                             │
│ **Author:** bob@company.com                                │
│ **Reason:** Configured test coverage targets               │
│                                                             │
│ ### Changes                                                 │
│ - `testing.coverage.minimum`: 70 → 80                      │
│ - `testing.coverage.fail_under`: (new) true                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Change Categories

### Categorize Changes

```yaml
config_versioning:
  changelog:
    categories:
      added:
        label: "Added"
        description: "New configuration options"
        emoji: "✨"

      changed:
        label: "Changed"
        description: "Modified existing options"
        emoji: "🔄"

      removed:
        label: "Removed"
        description: "Removed configuration options"
        emoji: "🗑️"

      deprecated:
        label: "Deprecated"
        description: "Options marked for removal"
        emoji: "⚠️"

      security:
        label: "Security"
        description: "Security-related changes"
        emoji: "🔒"
```

### Categorized Output

```markdown
## v1.5.1 - January 15, 2024

### ✨ Added
- `security.require_review`: Enable security review requirement
- `security.scan_dependencies`: Enable dependency scanning

### 🔄 Changed
- `checkpoints.before_deployment`: Now required by default

### 🔒 Security
- Added mandatory security review for production deployments
```

---

## Changelog Annotations

### Add Context

```yaml
# When making changes, add context
config_versioning:
  annotations:
    enabled: true

    # Require reason for changes
    require_reason: true

    # Optional fields
    optional:
      - ticket_id
      - related_pr
      - documentation_link
```

### Annotated Entry

```markdown
## v1.5.1 - January 15, 2024

**Author:** alice@company.com
**Reason:** Stricter security requirements per SOC 2 audit
**Ticket:** SEC-123
**PR:** #456
**Documentation:** https://docs.company.com/security-config

### Changes
...
```

---

## Search and Filter

### Search Changelog

```bash
# Search by keyword
proagents config changelog --search "security"

# Filter by author
proagents config changelog --author "alice@company.com"

# Filter by date range
proagents config changelog --from "2024-01-01" --to "2024-01-31"

# Filter by file
proagents config changelog --file "rules/security-rules.yaml"
```

---

## Integration

### Slack Notifications

```yaml
config_versioning:
  changelog:
    notifications:
      on_change:
        channels: ["slack:#config-changes"]
        template: |
          *Config Update: {{version}}*

          Author: {{author}}
          Reason: {{reason}}

          Changes: {{change_count}}
          {{#each changes}}
          • `{{this.path}}`: {{this.summary}}
          {{/each}}
```

### Git Integration

```yaml
config_versioning:
  changelog:
    git:
      # Commit changelog updates
      auto_commit: true
      commit_message: "chore: update config changelog for {{version}}"

      # Tag releases
      tag_versions: true
      tag_prefix: "config-"
```

---

## Best Practices

1. **Always Add Reason**: Explain why changes were made
2. **Link to Tickets**: Reference related issues/tickets
3. **Review Regularly**: Check changelog for patterns
4. **Categorize Changes**: Use consistent categories
5. **Export for Audits**: Generate reports when needed
6. **Notify Team**: Keep team informed of changes
