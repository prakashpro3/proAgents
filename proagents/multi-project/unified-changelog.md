# Unified Changelog

Aggregating changes across multiple projects in a monorepo or workspace.

---

## Overview

When working with multiple related projects, a unified changelog provides:
- Single source of truth for all changes
- Cross-project change correlation
- Coordinated release notes
- Timeline of workspace evolution

---

## Configuration

### Workspace Setup

```yaml
# proagents.workspace.yaml
multi_project:
  unified_changelog:
    enabled: true

    # Output location
    output:
      path: "./CHANGELOG.md"
      format: "markdown"

    # Archive by date
    archive:
      enabled: true
      path: "./changelog/"
      structure: "year/month"

    # Projects to include
    projects:
      - name: "frontend"
        path: "./projects/frontend"
        prefix: "[Frontend]"

      - name: "backend"
        path: "./projects/backend"
        prefix: "[Backend]"

      - name: "mobile"
        path: "./projects/mobile"
        prefix: "[Mobile]"

      - name: "shared"
        path: "./packages/shared"
        prefix: "[Shared]"
```

### Entry Configuration

```yaml
multi_project:
  unified_changelog:
    entries:
      # Entry format
      format: |
        ## {{date}} - {{title}}

        **Projects:** {{projects}}
        **Authors:** {{authors}}

        ### Changes
        {{changes}}

        ### Related
        {{#if tickets}}
        - Tickets: {{tickets}}
        {{/if}}
        {{#if prs}}
        - Pull Requests: {{prs}}
        {{/if}}

      # Categories
      categories:
        - name: "Features"
          prefix: "feat"
          icon: "rocket"

        - name: "Bug Fixes"
          prefix: "fix"
          icon: "bug"

        - name: "Performance"
          prefix: "perf"
          icon: "zap"

        - name: "Security"
          prefix: "security"
          icon: "shield"

        - name: "Dependencies"
          prefix: "deps"
          icon: "package"
```

---

## Changelog Structure

### Directory Layout

```
/workspace/
├── CHANGELOG.md                    # Current changelog
├── changelog/
│   ├── 2024/
│   │   ├── 01/
│   │   │   ├── 2024-01-15-user-auth.md
│   │   │   ├── 2024-01-18-dashboard.md
│   │   │   └── 2024-01-20-payment-fix.md
│   │   └── 02/
│   │       └── ...
│   └── ARCHIVE.md                  # Archived summaries
└── proagents.workspace.yaml
```

### Entry Template

```markdown
# Change: User Authentication System

**Date:** 2024-01-15
**Type:** Feature
**Projects:** [Backend, Frontend]
**Authors:** @developer1, @developer2

## Summary
Implemented complete user authentication system with OAuth support.

## Changes by Project

### Backend
- Added authentication middleware
- Implemented JWT token management
- Created user session endpoints
- Added OAuth provider integrations

### Frontend
- Created login/signup forms
- Added authentication context
- Implemented protected routes
- Added session persistence

## Related
- **Tickets:** AUTH-123, AUTH-124
- **Pull Requests:** #456, #457
- **Documentation:** [Auth Guide](/docs/auth.md)

## Migration Notes
- Run database migration: `npm run migrate`
- Update environment variables: `JWT_SECRET`, `OAUTH_CLIENT_ID`

## Tags
authentication, oauth, security, user-management
```

---

## Automated Generation

### From Git Commits

```yaml
multi_project:
  unified_changelog:
    automation:
      git:
        enabled: true

        # Parse conventional commits
        parse_commits: true

        # Extract from commit messages
        extract:
          type: "prefix"        # feat:, fix:, etc.
          scope: "parentheses"  # (frontend), (api)
          ticket: "pattern"     # JIRA-123, #456

        # Group by
        group_by: "date"        # or "version", "project"

        # Include merge commits
        include_merges: false
```

### From Pull Requests

```yaml
multi_project:
  unified_changelog:
    automation:
      pull_requests:
        enabled: true

        # Extract from PR
        extract:
          title: true
          body: true
          labels: true
          linked_issues: true

        # Label to category mapping
        label_mapping:
          "type: feature": "Features"
          "type: bug": "Bug Fixes"
          "type: security": "Security"

        # Required labels to include
        require_labels:
          - "changelog"
```

### CI Integration

```yaml
# GitHub Actions
multi_project:
  unified_changelog:
    ci:
      # Generate on release
      on_release:
        enabled: true
        action: "generate"

      # Update on merge to main
      on_merge:
        enabled: true
        action: "add_entry"
        branch: "main"

      # Validate changelog in PR
      on_pr:
        enabled: true
        action: "validate"
        require_entry: true
```

---

## Cross-Project Correlation

### Related Changes

```yaml
multi_project:
  unified_changelog:
    correlation:
      # Link related changes
      linking:
        enabled: true

        # Match by
        match_by:
          - "ticket_number"
          - "pr_reference"
          - "branch_name"
          - "time_window"

        # Time window for related changes
        time_window: "24h"

      # Show dependencies
      dependencies:
        show: true
        format: |
          **Depends on:** {{dependencies}}
          **Blocks:** {{blocked_by}}
```

### Coordinated Releases

```yaml
multi_project:
  unified_changelog:
    releases:
      # Coordinated release notes
      coordinated:
        enabled: true

        # Release format
        format: |
          # Release {{version}} - {{date}}

          ## Projects Released
          {{#each projects}}
          - {{name}}: {{version}}
          {{/each}}

          ## Combined Changes
          {{changes_by_category}}

          ## Upgrade Guide
          {{upgrade_notes}}

      # Version strategies
      versioning:
        strategy: "independent"  # or "synchronized"
        sync_on_breaking: true
```

---

## Filtering & Views

### Project-Specific View

```yaml
multi_project:
  unified_changelog:
    views:
      # Filter by project
      by_project:
        enabled: true
        generate_separate: true
        output: "./projects/{{project}}/CHANGELOG.md"

      # Filter by category
      by_category:
        enabled: true
        categories:
          - "security"
          - "breaking-changes"
```

### Time-Based Views

```yaml
multi_project:
  unified_changelog:
    views:
      # Weekly digest
      weekly:
        enabled: true
        output: "./changelog/weekly/{{year}}-W{{week}}.md"

      # Monthly summary
      monthly:
        enabled: true
        output: "./changelog/monthly/{{year}}-{{month}}.md"

      # Release notes
      releases:
        enabled: true
        output: "./releases/{{version}}.md"
```

---

## Search & Query

### Searchable Index

```yaml
multi_project:
  unified_changelog:
    search:
      enabled: true

      # Index configuration
      index:
        fields:
          - "title"
          - "description"
          - "tags"
          - "authors"
          - "projects"

      # Full-text search
      full_text: true

      # Facets
      facets:
        - "project"
        - "type"
        - "author"
        - "date"
```

### Query Examples

```bash
# Search by keyword
proagents changelog search "authentication"

# Filter by project
proagents changelog query --project backend --since 2024-01-01

# Filter by author
proagents changelog query --author developer1

# Filter by type
proagents changelog query --type feature --project frontend

# Export filtered results
proagents changelog export --query "security" --format json
```

---

## Notifications

### Change Notifications

```yaml
multi_project:
  unified_changelog:
    notifications:
      # On new entry
      on_entry:
        channels:
          - slack: "#releases"

        template: |
          *New Change Added*
          {{title}}
          Projects: {{projects}}
          Author: {{author}}
          <{{url}}|View Details>

      # Weekly digest
      weekly_digest:
        enabled: true
        schedule: "monday 9am"
        channels:
          - email: "engineering@company.com"
          - slack: "#engineering"
```

---

## Commands

```bash
# Generate changelog
proagents changelog generate

# Add entry manually
proagents changelog add --title "New Feature" --project frontend --type feat

# View recent changes
proagents changelog show --last 10

# Search changelog
proagents changelog search "authentication"

# Generate release notes
proagents changelog release --version 1.2.0

# Validate changelog format
proagents changelog validate

# Export to different format
proagents changelog export --format json > changelog.json

# Sync with git history
proagents changelog sync --from v1.0.0 --to HEAD
```

---

## Best Practices

1. **Consistent Format**: Use templates for uniform entries
2. **Meaningful Titles**: Clear, concise change descriptions
3. **Cross-Reference**: Link related changes and tickets
4. **Categorize**: Group changes by type for easy scanning
5. **Automate**: Generate from commits/PRs when possible
6. **Archive**: Keep historical records accessible
7. **Notify**: Keep stakeholders informed of changes
