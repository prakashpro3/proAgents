# Database Management

Schema migrations, safety checks, and rollback procedures.

---

## Overview

Safe database changes with version control, validation, and rollback capabilities.

## Documentation

| Document | Description |
|----------|-------------|
| [Migration Workflow](./migration-workflow.md) | Creating and running migrations |
| [Safety Checks](./safety-checks.md) | Pre-migration validation |
| [Rollback Scripts](./rollback-scripts.md) | Reverting database changes |
| [Examples](./examples/) | Concrete migration examples |

## Examples

Ready-to-use migration templates:

| Example | Description | Risk |
|---------|-------------|------|
| [001-create-users](./examples/001-create-users.sql) | Create table with indexes | Low |
| [002-add-preferences](./examples/002-add-preferences.sql) | Add JSONB column | Low |
| [003-add-index](./examples/003-add-index.sql) | Add performance index | Medium |
| [004-rename-column](./examples/004-rename-column.sql) | Rename column safely | Medium |
| [005-add-foreign-key](./examples/005-add-foreign-key.sql) | Add relationships | Medium |
| [006-data-migration](./examples/006-data-migration.sql) | Transform data | High |
| [007-drop-column](./examples/007-drop-column.sql) | Remove column | High |

## Quick Start

```bash
# Create a new migration
proagents db migration create "add_user_preferences"

# Run pending migrations
proagents db migrate

# Rollback last migration
proagents db rollback

# Check migration status
proagents db status
```

## Safety Features

- **Dry Run**: Preview changes before applying
- **Backup**: Automatic backup before migrations
- **Validation**: Check for breaking changes
- **Rollback Scripts**: Every migration has a rollback

## Configuration

```yaml
# proagents.config.yaml
database:
  migrations:
    directory: "./migrations"
    backup_before: true
    require_rollback: true

  safety:
    block_destructive: true
    require_approval_for:
      - "drop_table"
      - "drop_column"
```
