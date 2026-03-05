# Database Migration Workflow

Safe and reliable database schema changes.

---

## Overview

Database migrations should be:
- **Versioned** - Track all changes
- **Reversible** - Always have rollback
- **Tested** - Verify before production
- **Documented** - Clear change history

---

## Migration File Structure

```
/migrations/
├── 001_initial_schema.sql
├── 002_add_users_table.sql
├── 003_add_user_email_index.sql
├── 004_add_preferences_column.sql
├── rollback/
│   ├── 001_rollback.sql
│   ├── 002_rollback.sql
│   ├── 003_rollback.sql
│   └── 004_rollback.sql
└── seeds/
    ├── development.sql
    └── test.sql
```

---

## Migration Naming Convention

```
[VERSION]_[ACTION]_[DESCRIPTION].sql

Examples:
001_create_users_table.sql
002_add_email_to_users.sql
003_create_orders_table.sql
004_add_index_on_users_email.sql
005_alter_users_add_preferences.sql
006_drop_legacy_table.sql
```

---

## Creating Migrations

### New Table

```sql
-- migrations/001_create_users_table.sql

-- Up Migration
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Record migration
INSERT INTO schema_migrations (version, applied_at)
VALUES ('001', NOW());
```

```sql
-- migrations/rollback/001_rollback.sql

-- Down Migration
DROP TABLE IF EXISTS users;

DELETE FROM schema_migrations WHERE version = '001';
```

### Add Column

```sql
-- migrations/002_add_user_preferences.sql

-- Up Migration
ALTER TABLE users
ADD COLUMN preferences JSONB DEFAULT '{}';

INSERT INTO schema_migrations (version, applied_at)
VALUES ('002', NOW());
```

```sql
-- migrations/rollback/002_rollback.sql

-- Down Migration
ALTER TABLE users
DROP COLUMN IF EXISTS preferences;

DELETE FROM schema_migrations WHERE version = '002';
```

### Add Index

```sql
-- migrations/003_add_created_at_index.sql

-- Up Migration (CONCURRENTLY for zero-downtime)
CREATE INDEX CONCURRENTLY idx_users_created_at
ON users(created_at);

INSERT INTO schema_migrations (version, applied_at)
VALUES ('003', NOW());
```

```sql
-- migrations/rollback/003_rollback.sql

-- Down Migration
DROP INDEX IF EXISTS idx_users_created_at;

DELETE FROM schema_migrations WHERE version = '003';
```

### Data Migration

```sql
-- migrations/004_backfill_user_status.sql

-- Up Migration
-- First, add the column
ALTER TABLE users ADD COLUMN status VARCHAR(20);

-- Then, backfill existing data
UPDATE users SET status = 'active' WHERE status IS NULL;

-- Finally, add constraint
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'active';

INSERT INTO schema_migrations (version, applied_at)
VALUES ('004', NOW());
```

---

## Migration Safety Rules

### Risk Assessment

| Change Type | Risk Level | Approach |
|-------------|------------|----------|
| Add table | Low | Standard migration |
| Add column (nullable) | Low | Standard migration |
| Add column (NOT NULL) | Medium | Add nullable → backfill → add constraint |
| Add index | Low-Medium | Use CONCURRENTLY |
| Drop column | Medium | Verify no dependencies |
| Drop table | High | Multiple approvals |
| Rename column | High | Expand-contract pattern |
| Change data type | High | Create new column, migrate |

### Safety Checklist

```markdown
## Migration Safety Checklist

- [ ] Reviewed by DBA or senior dev
- [ ] Tested on copy of production data
- [ ] Rollback script created and tested
- [ ] Estimated execution time acceptable
- [ ] Lock time acceptable (for ALTER)
- [ ] Disk space sufficient
- [ ] Backup taken before execution
- [ ] Monitoring alerts configured
- [ ] Rollback procedure documented
```

---

## Zero-Downtime Migrations

### Expand-Contract Pattern

For breaking changes (rename, type change):

**Phase 1: Expand**
```sql
-- Add new column
ALTER TABLE users ADD COLUMN email_new VARCHAR(255);

-- Copy existing data
UPDATE users SET email_new = email;

-- Add constraint
ALTER TABLE users ALTER COLUMN email_new SET NOT NULL;
CREATE UNIQUE INDEX idx_users_email_new ON users(email_new);
```

**Phase 2: Migrate Application**
```javascript
// Update app to write to both columns
user.email = value;
user.email_new = value;

// Then update to read from new column
const email = user.email_new;
```

**Phase 3: Contract**
```sql
-- Remove old column (after app fully migrated)
ALTER TABLE users DROP COLUMN email;

-- Rename new column (optional)
ALTER TABLE users RENAME COLUMN email_new TO email;
```

### Adding NOT NULL Column

```sql
-- Step 1: Add nullable column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Step 2: Backfill in batches
DO $$
DECLARE
    batch_size INT := 1000;
    total_rows INT;
BEGIN
    SELECT COUNT(*) INTO total_rows FROM users WHERE phone IS NULL;

    WHILE total_rows > 0 LOOP
        UPDATE users
        SET phone = 'unknown'
        WHERE id IN (
            SELECT id FROM users WHERE phone IS NULL LIMIT batch_size
        );

        SELECT COUNT(*) INTO total_rows FROM users WHERE phone IS NULL;
        COMMIT;
    END LOOP;
END $$;

-- Step 3: Add constraint
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
ALTER TABLE users ALTER COLUMN phone SET DEFAULT 'unknown';
```

---

## Running Migrations

### Development

```bash
# Using a migration tool (example: migrate)
migrate -path ./migrations -database "postgres://..." up

# Rollback last migration
migrate -path ./migrations -database "postgres://..." down 1

# Go to specific version
migrate -path ./migrations -database "postgres://..." goto 3
```

### Staging

```bash
# Always take backup first
pg_dump -h staging-db -d myapp > backup_$(date +%Y%m%d).sql

# Run migrations
migrate -path ./migrations -database "$STAGING_DB_URL" up

# Verify
psql -h staging-db -d myapp -c "SELECT * FROM schema_migrations;"
```

### Production

```markdown
## Production Migration Checklist

### Before
- [ ] Migration tested on staging
- [ ] Migration tested on production data copy
- [ ] Backup completed
- [ ] Rollback script ready
- [ ] Maintenance window scheduled (if needed)
- [ ] Team notified
- [ ] Monitoring dashboard open

### Execute
- [ ] Run migration
- [ ] Monitor for errors
- [ ] Check query performance
- [ ] Verify application works

### After
- [ ] Confirm success
- [ ] Update documentation
- [ ] Notify team
```

---

## ORM Migrations

### Prisma

```javascript
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
}
```

```bash
# Create migration
npx prisma migrate dev --name add_users_table

# Apply to production
npx prisma migrate deploy

# Reset (development only)
npx prisma migrate reset
```

### TypeORM

```typescript
// migrations/1234567890-CreateUsersTable.ts
export class CreateUsersTable1234567890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) NOT NULL UNIQUE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE users`);
    }
}
```

```bash
# Generate migration
npm run typeorm migration:generate -- -n CreateUsersTable

# Run migrations
npm run typeorm migration:run

# Revert
npm run typeorm migration:revert
```

### Knex

```javascript
// migrations/001_create_users.js
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('email').notNullable().unique();
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
```

```bash
# Run migrations
npx knex migrate:latest

# Rollback
npx knex migrate:rollback
```

---

## Migration Testing

```markdown
## Migration Test Plan

### Unit Test
- [ ] Up migration syntax valid
- [ ] Down migration syntax valid
- [ ] Migration is idempotent

### Integration Test
- [ ] Run on empty database
- [ ] Run on database with existing data
- [ ] Rollback works correctly
- [ ] Application works after migration

### Performance Test
- [ ] Measure execution time
- [ ] Check lock duration
- [ ] Monitor resource usage
```

### Test Script

```bash
#!/bin/bash
# test-migration.sh

# Setup test database
createdb test_migrations

# Run all migrations
migrate -path ./migrations -database "postgres://localhost/test_migrations" up

# Run tests
npm run test:db

# Rollback all
migrate -path ./migrations -database "postgres://localhost/test_migrations" down -all

# Cleanup
dropdb test_migrations
```

---

## Configuration

```yaml
# proagents.config.yaml
database:
  migrations:
    path: "./migrations"
    tool: "migrate"  # migrate, prisma, typeorm, knex

    safety:
      require_rollback: true
      require_review: true
      auto_backup: true
      test_on_copy: true

    risk_levels:
      drop_table: "high"
      drop_column: "medium"
      add_index: "low"
      add_column: "low"

    approvals:
      high_risk: ["dba", "tech-lead"]
      medium_risk: ["senior-dev"]
      low_risk: ["any-dev"]
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:migration-create [name]` | Create new migration |
| `pa:migration-run` | Run pending migrations |
| `pa:migration-rollback` | Rollback last migration |
| `pa:migration-status` | Show migration status |
| `pa:migration-test` | Test migration |
