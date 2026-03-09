# Notion Integration

Database and documentation integration with Notion.

---

## Setup

### 1. Create Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create new integration
3. Copy the Internal Integration Token
4. Share your database with the integration

### 2. Configure Connection

```yaml
# proagents.config.yaml

integrations:
  notion:
    enabled: true
    token_env: "NOTION_TOKEN"

    # Database settings
    databases:
      features: "database-id-for-features"
      documentation: "database-id-for-docs"
      changelog: "database-id-for-changelog"
```

### 3. Set Environment Variable

```bash
export NOTION_TOKEN="secret_xxx..."
```

### 4. Verify Connection

```bash
proagents pm connect notion
proagents pm status
```

---

## Database Schema

### Features Database

```yaml
integrations:
  notion:
    databases:
      features:
        id: "your-database-id"

        # Property mapping
        properties:
          title: "Name"              # Title property
          status: "Status"           # Select property
          phase: "Phase"             # Select property
          assignee: "Assignee"       # Person property
          branch: "Branch"           # Text property
          pr_link: "PR"              # URL property
          start_date: "Start Date"   # Date property
          due_date: "Due Date"       # Date property
          tags: "Tags"               # Multi-select property

        # Status options
        status_mapping:
          init: "Not Started"
          analysis: "In Progress"
          implementation: "In Progress"
          testing: "Testing"
          review: "Review"
          deployed: "Done"
```

### Documentation Database

```yaml
integrations:
  notion:
    databases:
      documentation:
        id: "docs-database-id"

        properties:
          title: "Title"
          type: "Type"           # Feature Doc, API Doc, etc.
          feature: "Feature"     # Relation to features
          status: "Status"
          last_updated: "Last Updated"
```

---

## Auto-Sync Features

### On Feature Start

```yaml
integrations:
  notion:
    on_feature_start:
      # Create page in features database
      create_page:
        database: "features"
        properties:
          Name: "{{feature_name}}"
          Status: "In Progress"
          Phase: "Analysis"
          Assignee: "{{user}}"
          "Start Date": "{{today}}"
          Tags: ["proagents", "{{entry_mode}}"]

      # Create documentation page
      create_doc:
        database: "documentation"
        template: "feature-doc-template"
```

### On Phase Change

```yaml
integrations:
  notion:
    on_phase_change:
      update_page:
        properties:
          Phase: "{{current_phase}}"

      # Add to page content
      append_block:
        type: "callout"
        content: |
          **Phase Update**: {{previous_phase}} → {{current_phase}}
          {{phase_summary}}
```

### On Feature Complete

```yaml
integrations:
  notion:
    on_feature_complete:
      update_page:
        properties:
          Status: "Done"
          Phase: "Deployed"

      # Update documentation
      update_doc:
        add_section: "Implementation Details"
        content: "{{implementation_summary}}"

      # Add to changelog
      add_changelog:
        database: "changelog"
        properties:
          Title: "{{feature_name}} Released"
          Date: "{{today}}"
          Type: "Feature"
```

---

## Documentation Sync

### Sync Project Docs to Notion

```yaml
integrations:
  notion:
    documentation_sync:
      enabled: true

      # Sync these docs to Notion
      sync_paths:
        - source: "docs/architecture.md"
          notion_page: "Architecture"

        - source: "docs/api/*.md"
          notion_database: "documentation"
          type: "API Doc"

      # Sync frequency
      frequency: "on_change"  # or "daily", "manual"
```

### Sync Notion to Local

```yaml
integrations:
  notion:
    documentation_sync:
      # Pull from Notion
      pull:
        enabled: true
        pages:
          - notion_page: "Design Guidelines"
            local_path: "docs/design-guidelines.md"
```

---

## Queries and Filters

### Query Features

```bash
# List features by status
proagents pm list --status "In Progress"

# Query with filter
proagents pm query --filter "Phase equals Testing"
```

### Filter Configuration

```yaml
integrations:
  notion:
    queries:
      my_features:
        database: "features"
        filter:
          property: "Assignee"
          people:
            contains: "{{user_id}}"

      active_features:
        database: "features"
        filter:
          and:
            - property: "Status"
              select:
                does_not_equal: "Done"
            - property: "Tags"
              multi_select:
                contains: "proagents"
```

---

## Commands

```bash
# Link to existing page
proagents pm link --page "page-id"

# Create feature page
proagents pm create --title "Feature name"

# Update status
proagents pm update --status "In Review"

# Sync documentation
proagents pm sync-docs

# Query features
proagents pm query --filter "Status = In Progress"
```

---

## Best Practices

1. **Use Templates**: Create Notion templates for consistency
2. **Relations**: Link features to documentation pages
3. **Views**: Create filtered views for different needs
4. **Automation**: Use Notion automations alongside ProAgents
5. **Backup**: Notion changes are tracked, but keep local backups
