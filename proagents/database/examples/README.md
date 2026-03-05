# Database Migration Examples

Concrete migration examples for common database operations.

---

## Example Migrations

| Migration | Description | Risk Level |
|-----------|-------------|------------|
| [001-create-users](./001-create-users.sql) | Create users table | Low |
| [002-add-preferences](./002-add-preferences.sql) | Add column with default | Low |
| [003-add-index](./003-add-index.sql) | Add performance index | Medium |
| [004-rename-column](./004-rename-column.sql) | Rename existing column | Medium |
| [005-add-foreign-key](./005-add-foreign-key.sql) | Add relationship constraint | Medium |
| [006-data-migration](./006-data-migration.sql) | Transform existing data | High |
| [007-drop-column](./007-drop-column.sql) | Remove column safely | High |

---

## Using These Examples

### 1. Copy and Customize

```bash
# Copy template to your migrations folder
cp proagents/database/examples/001-create-users.sql \
   migrations/20240115_001_create_users.sql
```

### 2. Naming Convention

```
YYYYMMDD_NNN_description.sql

Example:
20240115_001_create_users.sql
20240115_002_add_user_email_index.sql
```

### 3. Required Structure

Every migration file must include:
- Header comment with metadata
- UP migration (forward)
- DOWN migration (rollback)
- Verification query

---

## Migration Template

```sql
-- Migration: [description]
-- Author: [name]
-- Date: [YYYY-MM-DD]
-- Risk Level: [Low|Medium|High|Critical]
-- Requires Approval: [Yes|No]
-- Estimated Duration: [time]

-- ============================================
-- UP MIGRATION
-- ============================================

-- [Your forward migration SQL here]

-- ============================================
-- DOWN MIGRATION (Rollback)
-- ============================================

-- [Your rollback SQL here]

-- ============================================
-- VERIFICATION
-- ============================================

-- [Query to verify migration succeeded]
```

---

## Risk Levels

| Level | Examples | Approval Required |
|-------|----------|------------------|
| **Low** | Add nullable column, create table | No |
| **Medium** | Add index, add constraint | Team lead |
| **High** | Data migration, drop column | Manager + DBA |
| **Critical** | Drop table, schema restructure | CTO + DBA |
