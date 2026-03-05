# Database Migration Safety Checks

Ensure database migrations are safe before execution.

---

## Overview

Database migrations are high-risk operations. This guide provides:
- Pre-migration safety checks
- Risk assessment criteria
- Safe migration patterns
- Rollback verification

---

## Risk Assessment Matrix

| Operation | Risk Level | Requirements |
|-----------|------------|--------------|
| Add column (nullable) | Low | Auto-approve |
| Add column (NOT NULL with default) | Low | Auto-approve |
| Add column (NOT NULL, no default) | High | Backfill plan required |
| Add index | Medium | Performance review |
| Add unique constraint | High | Data validation first |
| Add foreign key | Medium | Data integrity check |
| Alter column type | High | Data compatibility check |
| Rename column | Medium | Application update required |
| Drop column | High | Deprecation period |
| Drop table | Critical | Multiple approvals |
| Drop index | Low | Performance impact review |
| Truncate table | Critical | Backup required |

---

## Pre-Migration Checklist

### Automated Checks

```yaml
safety_checks:
  pre_migration:
    - name: "Backup Exists"
      check: "Recent backup within 24 hours"
      required: true
      action: "Block if no backup"

    - name: "Schema Diff Analysis"
      check: "Generate and review schema diff"
      required: true
      action: "Show diff for review"

    - name: "Data Impact Assessment"
      check: "Estimate rows affected"
      required: true
      thresholds:
        low: "<1000 rows"
        medium: "1000-100000 rows"
        high: ">100000 rows"

    - name: "Lock Duration Estimate"
      check: "Estimate table lock time"
      required: true
      thresholds:
        safe: "<1 second"
        warning: "1-30 seconds"
        critical: ">30 seconds"

    - name: "Rollback Script Exists"
      check: "Down migration defined"
      required: true
      action: "Block if missing"

    - name: "Test Environment Validated"
      check: "Migration ran on staging"
      required: true
      action: "Block if not tested"
```

### Manual Review Checklist

```markdown
## Migration Safety Review

**Migration:** [Migration Name]
**Date:** [Date]
**Reviewer:** [Name]

### Pre-checks
- [ ] Migration tested on staging environment
- [ ] Data backup verified (< 24 hours old)
- [ ] Rollback script tested
- [ ] Application code compatible with both old and new schema
- [ ] Low traffic window scheduled (if required)

### Schema Changes Review
- [ ] All column additions have appropriate defaults
- [ ] No accidental column drops
- [ ] Indexes are necessary and optimized
- [ ] Foreign keys have proper cascading behavior

### Data Migration Review
- [ ] Data transformation logic is correct
- [ ] No data loss scenarios
- [ ] Performance tested with production-size data
- [ ] Timeout and retry handling in place

### Deployment Coordination
- [ ] Team notified of migration
- [ ] Monitoring dashboards ready
- [ ] Incident response plan documented
- [ ] Rollback trigger criteria defined
```

---

## Safe Migration Patterns

### 1. Adding NOT NULL Column

**Unsafe:**
```sql
-- ❌ This will fail if table has data
ALTER TABLE users ADD COLUMN status VARCHAR NOT NULL;
```

**Safe Pattern (3-Step):**
```sql
-- Step 1: Add nullable column
ALTER TABLE users ADD COLUMN status VARCHAR;

-- Step 2: Backfill data
UPDATE users SET status = 'active' WHERE status IS NULL;

-- Step 3: Add NOT NULL constraint
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
```

**Prisma Migration:**
```javascript
// migration.js
module.exports = {
  async up(db) {
    // Step 1: Add nullable
    await db.runSql(`
      ALTER TABLE users ADD COLUMN status VARCHAR
    `);

    // Step 2: Backfill
    await db.runSql(`
      UPDATE users SET status = 'active' WHERE status IS NULL
    `);

    // Step 3: Add constraint
    await db.runSql(`
      ALTER TABLE users ALTER COLUMN status SET NOT NULL
    `);
  },

  async down(db) {
    await db.runSql(`ALTER TABLE users DROP COLUMN status`);
  },
};
```

### 2. Renaming Columns

**Unsafe:**
```sql
-- ❌ Breaks running application
ALTER TABLE users RENAME COLUMN name TO full_name;
```

**Safe Pattern (Expand-Contract):**
```sql
-- Phase 1: Add new column (Deploy)
ALTER TABLE users ADD COLUMN full_name VARCHAR;
UPDATE users SET full_name = name;

-- Phase 2: Update application to use both columns
-- Application writes to BOTH name and full_name
-- Application reads from full_name

-- Phase 3: Drop old column (after verification)
ALTER TABLE users DROP COLUMN name;
```

### 3. Adding Unique Constraint

**Unsafe:**
```sql
-- ❌ Fails if duplicates exist
ALTER TABLE users ADD CONSTRAINT email_unique UNIQUE (email);
```

**Safe Pattern:**
```sql
-- Step 1: Check for duplicates
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Step 2: Resolve duplicates (business logic specific)
-- ... resolve duplicates ...

-- Step 3: Add constraint with validation
ALTER TABLE users
ADD CONSTRAINT email_unique UNIQUE (email)
NOT VALID;

-- Step 4: Validate separately (non-blocking)
ALTER TABLE users
VALIDATE CONSTRAINT email_unique;
```

### 4. Changing Column Type

**Unsafe:**
```sql
-- ❌ May lose data
ALTER TABLE orders ALTER COLUMN amount TYPE INTEGER;
```

**Safe Pattern:**
```sql
-- Step 1: Add new column
ALTER TABLE orders ADD COLUMN amount_cents INTEGER;

-- Step 2: Migrate data
UPDATE orders SET amount_cents = CAST(amount * 100 AS INTEGER);

-- Step 3: Verify data
SELECT COUNT(*) FROM orders
WHERE amount_cents != CAST(amount * 100 AS INTEGER);

-- Step 4: Switch application to new column
-- Step 5: Drop old column (after verification period)
ALTER TABLE orders DROP COLUMN amount;

-- Step 6: Rename (optional)
ALTER TABLE orders RENAME COLUMN amount_cents TO amount;
```

### 5. Adding Index Without Blocking

```sql
-- ❌ Blocks writes
CREATE INDEX idx_users_email ON users(email);

-- ✅ Non-blocking (PostgreSQL)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

---

## Lock Duration Analysis

### Check Current Locks

```sql
-- PostgreSQL: View active locks
SELECT
  l.relation::regclass AS table,
  l.mode,
  l.granted,
  a.application_name,
  a.query
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE l.relation IS NOT NULL;
```

### Estimate Lock Duration

```javascript
// scripts/estimate-lock-duration.js

async function estimateLockDuration(migration) {
  const analysis = {
    operations: [],
    estimatedDuration: 0,
    risk: 'low',
  };

  // Parse migration to identify operations
  if (migration.includes('ALTER TABLE') && migration.includes('ADD COLUMN')) {
    analysis.operations.push({
      type: 'add_column',
      lockType: 'ACCESS EXCLUSIVE',
      estimatedSeconds: 0.1, // Very fast
    });
  }

  if (migration.includes('CREATE INDEX') && !migration.includes('CONCURRENTLY')) {
    const rowCount = await getTableRowCount(extractTableName(migration));
    analysis.operations.push({
      type: 'create_index',
      lockType: 'SHARE',
      estimatedSeconds: rowCount / 10000, // Rough estimate
    });
  }

  if (migration.includes('DROP COLUMN')) {
    analysis.operations.push({
      type: 'drop_column',
      lockType: 'ACCESS EXCLUSIVE',
      estimatedSeconds: 0.5,
    });
  }

  // Calculate total
  analysis.estimatedDuration = analysis.operations.reduce(
    (sum, op) => sum + op.estimatedSeconds, 0
  );

  // Assess risk
  if (analysis.estimatedDuration > 30) {
    analysis.risk = 'critical';
  } else if (analysis.estimatedDuration > 5) {
    analysis.risk = 'high';
  } else if (analysis.estimatedDuration > 1) {
    analysis.risk = 'medium';
  }

  return analysis;
}
```

---

## Automated Safety Script

```bash
#!/bin/bash
# scripts/migration-safety-check.sh

set -e

MIGRATION_FILE=$1
DB_URL=${DATABASE_URL}

echo "=== Migration Safety Check ==="
echo "Migration: $MIGRATION_FILE"
echo ""

# Check 1: Backup exists
echo "Checking backup..."
LATEST_BACKUP=$(aws s3 ls s3://backups/db/ --recursive | sort | tail -n 1)
BACKUP_AGE=$(($(date +%s) - $(date -d "$(echo $LATEST_BACKUP | awk '{print $1" "$2}')" +%s)))

if [ $BACKUP_AGE -gt 86400 ]; then
  echo "❌ ERROR: Latest backup is more than 24 hours old"
  exit 1
fi
echo "✅ Backup exists (age: ${BACKUP_AGE}s)"

# Check 2: Rollback script exists
DOWN_MIGRATION="${MIGRATION_FILE%.up.sql}.down.sql"
if [ ! -f "$DOWN_MIGRATION" ]; then
  echo "❌ ERROR: No rollback script found: $DOWN_MIGRATION"
  exit 1
fi
echo "✅ Rollback script exists"

# Check 3: Schema diff
echo ""
echo "Schema Changes:"
echo "───────────────"
psql $DB_URL -c "\d" > /tmp/before_schema.txt
# Show diff preview (dry run)

# Check 4: Dangerous operations
echo ""
echo "Dangerous Operations Check:"
if grep -i "DROP TABLE" "$MIGRATION_FILE"; then
  echo "⚠️  WARNING: DROP TABLE detected - requires manual approval"
fi
if grep -i "DROP COLUMN" "$MIGRATION_FILE"; then
  echo "⚠️  WARNING: DROP COLUMN detected - requires manual approval"
fi
if grep -i "TRUNCATE" "$MIGRATION_FILE"; then
  echo "⚠️  WARNING: TRUNCATE detected - requires manual approval"
fi

# Check 5: Row count for affected tables
echo ""
echo "Affected Tables:"
TABLES=$(grep -oP "(?<=ALTER TABLE |UPDATE |DELETE FROM )[\w_]+" "$MIGRATION_FILE" | sort -u)
for TABLE in $TABLES; do
  COUNT=$(psql $DB_URL -t -c "SELECT COUNT(*) FROM $TABLE" 2>/dev/null || echo "N/A")
  echo "  $TABLE: $COUNT rows"
done

echo ""
echo "=== Safety Check Complete ==="
```

---

## Configuration

```yaml
# proagents.config.yaml

database:
  safety_checks:
    enabled: true

    require:
      backup_check: true
      rollback_script: true
      staging_test: true
      schema_diff_review: true

    thresholds:
      max_lock_duration_seconds: 5
      max_rows_affected: 100000
      max_tables_modified: 3

    auto_approve:
      - "add_nullable_column"
      - "add_index_concurrent"
      - "drop_index"

    require_approval:
      - "drop_column"
      - "drop_table"
      - "alter_column_type"
      - "add_not_null"

    blocked_operations:
      - "truncate_production"
      - "drop_database"
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/db-check` | Run safety checks on pending migrations |
| `/db-check --migration [name]` | Check specific migration |
| `/db-check --dry-run` | Preview changes without running |
| `/db-diff` | Show schema diff |
| `/db-locks` | Show active database locks |
