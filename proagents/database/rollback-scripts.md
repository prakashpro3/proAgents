# Database Rollback Scripts

Templates and procedures for database rollbacks.

---

## Overview

Database rollback scripts are essential for:
- Recovering from failed migrations
- Reverting problematic schema changes
- Emergency recovery procedures

---

## Rollback Script Structure

### Basic Rollback Template

```sql
-- migrations/20240115_add_user_status.down.sql
-- Rollback: Add user status column

-- Description: Removes the status column from users table
-- Original migration: 20240115_add_user_status.up.sql
-- Author: Developer Name
-- Date: 2024-01-15

-- Pre-rollback checks
DO $$
BEGIN
  -- Verify column exists before dropping
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'status'
  ) THEN
    RAISE EXCEPTION 'Column users.status does not exist - nothing to rollback';
  END IF;
END $$;

-- Start transaction
BEGIN;

-- Perform rollback
ALTER TABLE users DROP COLUMN IF EXISTS status;

-- Verify rollback
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'status'
  ) THEN
    RAISE EXCEPTION 'Rollback failed - column still exists';
  END IF;
END $$;

COMMIT;
```

### Prisma Rollback Migration

```javascript
// prisma/migrations/20240115_add_user_status/migration.js
module.exports = {
  // Forward migration
  async up(prisma) {
    await prisma.$executeRaw`
      ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active'
    `;
  },

  // Rollback migration
  async down(prisma) {
    // Pre-rollback: Backup data if needed
    const backupData = await prisma.$queryRaw`
      SELECT id, status FROM users WHERE status != 'active'
    `;

    console.log('Backing up non-default status values:', backupData.length);

    // Perform rollback
    await prisma.$executeRaw`
      ALTER TABLE users DROP COLUMN IF EXISTS status
    `;
  },
};
```

---

## Rollback Scenarios

### Scenario 1: Simple Column Drop

```sql
-- UP: Added email_verified column
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;

-- DOWN: Remove email_verified column
BEGIN;

-- Save data for potential restore
CREATE TABLE IF NOT EXISTS _rollback_users_email_verified AS
SELECT id, email_verified FROM users WHERE email_verified = true;

-- Remove column
ALTER TABLE users DROP COLUMN email_verified;

COMMIT;
```

### Scenario 2: Column Rename Rollback

```sql
-- UP: Renamed name to full_name
-- (Expand phase already applied)

-- DOWN: Revert to original column name
BEGIN;

-- Copy data back
UPDATE users SET name = full_name WHERE name IS NULL OR name != full_name;

-- Drop new column
ALTER TABLE users DROP COLUMN full_name;

-- Ensure original column has correct constraint
ALTER TABLE users ALTER COLUMN name SET NOT NULL;

COMMIT;
```

### Scenario 3: Data Type Change Rollback

```sql
-- UP: Changed amount from DECIMAL to INTEGER (cents)
-- DOWN: Revert to DECIMAL

BEGIN;

-- Add back the decimal column
ALTER TABLE orders ADD COLUMN amount_decimal DECIMAL(10,2);

-- Restore data
UPDATE orders SET amount_decimal = amount / 100.0;

-- Drop integer column
ALTER TABLE orders DROP COLUMN amount;

-- Rename back
ALTER TABLE orders RENAME COLUMN amount_decimal TO amount;

COMMIT;
```

### Scenario 4: Constraint Removal Rollback

```sql
-- UP: Added unique constraint on email
-- DOWN: Remove unique constraint

BEGIN;

-- Remove constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique;

-- Note: Duplicates may now be possible
-- Consider whether to allow this

COMMIT;
```

### Scenario 5: Table Drop Rollback (with backup)

```sql
-- UP: Dropped legacy_logs table
-- DOWN: Restore from backup

BEGIN;

-- Recreate table structure
CREATE TABLE legacy_logs (
  id SERIAL PRIMARY KEY,
  message TEXT,
  level VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Restore from backup table (if exists)
INSERT INTO legacy_logs
SELECT * FROM _backup_legacy_logs;

-- Drop backup table
DROP TABLE IF EXISTS _backup_legacy_logs;

COMMIT;
```

### Scenario 6: Index Removal Rollback

```sql
-- UP: Added index for performance
-- DOWN: Remove index (if needed)

-- Non-blocking removal
DROP INDEX CONCURRENTLY IF EXISTS idx_users_email_created;
```

---

## Automated Rollback Script Generator

```typescript
// scripts/generate-rollback.ts
import fs from 'fs';
import path from 'path';

interface MigrationAnalysis {
  type: 'add_column' | 'drop_column' | 'add_index' | 'create_table' | 'alter_table' | 'unknown';
  table: string;
  column?: string;
  details: Record<string, any>;
}

function analyzeMigration(sql: string): MigrationAnalysis[] {
  const operations: MigrationAnalysis[] = [];

  // Add column detection
  const addColumnMatch = sql.match(/ALTER TABLE (\w+) ADD COLUMN (\w+) ([^;]+)/gi);
  if (addColumnMatch) {
    addColumnMatch.forEach(match => {
      const parts = match.match(/ALTER TABLE (\w+) ADD COLUMN (\w+) (.+)/i);
      if (parts) {
        operations.push({
          type: 'add_column',
          table: parts[1],
          column: parts[2],
          details: { definition: parts[3] },
        });
      }
    });
  }

  // Create table detection
  const createTableMatch = sql.match(/CREATE TABLE (\w+)/gi);
  if (createTableMatch) {
    createTableMatch.forEach(match => {
      const parts = match.match(/CREATE TABLE (\w+)/i);
      if (parts) {
        operations.push({
          type: 'create_table',
          table: parts[1],
          details: {},
        });
      }
    });
  }

  return operations;
}

function generateRollback(operations: MigrationAnalysis[]): string {
  let rollback = `-- Auto-generated rollback script
-- Generated: ${new Date().toISOString()}
-- Review carefully before executing

BEGIN;

`;

  operations.reverse().forEach(op => {
    switch (op.type) {
      case 'add_column':
        rollback += `-- Rollback: Remove column ${op.column} from ${op.table}
ALTER TABLE ${op.table} DROP COLUMN IF EXISTS ${op.column};

`;
        break;

      case 'create_table':
        rollback += `-- Rollback: Drop table ${op.table}
-- WARNING: This will delete all data in the table!
DROP TABLE IF EXISTS ${op.table};

`;
        break;

      default:
        rollback += `-- TODO: Manual rollback required for operation type: ${op.type}

`;
    }
  });

  rollback += `COMMIT;
`;

  return rollback;
}

// Main
const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Usage: ts-node generate-rollback.ts <migration-file>');
  process.exit(1);
}

const sql = fs.readFileSync(migrationFile, 'utf-8');
const operations = analyzeMigration(sql);
const rollback = generateRollback(operations);

const rollbackFile = migrationFile.replace('.up.sql', '.down.sql');
fs.writeFileSync(rollbackFile, rollback);
console.log(`Generated rollback: ${rollbackFile}`);
```

---

## Emergency Rollback Procedure

```bash
#!/bin/bash
# scripts/emergency-rollback.sh

set -e

# Configuration
DB_URL=${DATABASE_URL}
MIGRATION=$1
SKIP_CONFIRMATION=${2:-false}

echo "╔══════════════════════════════════════════════════╗"
echo "║         EMERGENCY DATABASE ROLLBACK              ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Target: $MIGRATION"
echo "Database: $(echo $DB_URL | sed 's/:[^@]*@/@/')"
echo ""

# Check rollback script exists
ROLLBACK_FILE="migrations/${MIGRATION}.down.sql"
if [ ! -f "$ROLLBACK_FILE" ]; then
  echo "❌ ERROR: Rollback script not found: $ROLLBACK_FILE"
  exit 1
fi

# Show rollback script content
echo "Rollback Script Content:"
echo "────────────────────────"
cat "$ROLLBACK_FILE"
echo ""
echo "────────────────────────"

# Confirmation
if [ "$SKIP_CONFIRMATION" != "true" ]; then
  read -p "⚠️  Execute this rollback? (type 'ROLLBACK' to confirm): " CONFIRM
  if [ "$CONFIRM" != "ROLLBACK" ]; then
    echo "Rollback cancelled."
    exit 1
  fi
fi

# Create pre-rollback backup
echo ""
echo "Creating pre-rollback backup..."
BACKUP_FILE="/tmp/pre_rollback_$(date +%Y%m%d_%H%M%S).sql"
pg_dump $DB_URL > "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"

# Execute rollback
echo ""
echo "Executing rollback..."
psql $DB_URL -f "$ROLLBACK_FILE"

# Verify rollback
echo ""
echo "Verifying rollback..."
# Add verification queries here

echo ""
echo "✅ Rollback completed successfully"
echo ""
echo "Next steps:"
echo "1. Verify application functionality"
echo "2. Monitor error rates"
echo "3. Notify team of rollback"
echo "4. Plan for proper fix"
```

---

## Rollback Testing

### Pre-deployment Rollback Test

```yaml
# .github/workflows/test-rollback.yml
name: Test Migrations and Rollbacks

on:
  pull_request:
    paths:
      - 'prisma/migrations/**'
      - 'migrations/**'

jobs:
  test-migrations:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations UP
        run: npm run db:migrate

      - name: Seed test data
        run: npm run db:seed

      - name: Run migrations DOWN
        run: npm run db:migrate:down

      - name: Run migrations UP again
        run: npm run db:migrate

      - name: Verify data integrity
        run: npm run db:verify
```

---

## Configuration

```yaml
# proagents.config.yaml

database:
  rollback:
    require_script: true
    auto_generate: true

    backup:
      before_rollback: true
      retention_days: 30

    verification:
      run_after_rollback: true
      check_data_integrity: true

    notifications:
      on_rollback: ["slack", "email"]
      channels:
        slack: "#db-alerts"
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:db-rollback` | Interactive rollback wizard |
| `pa:db-rollback --last` | Rollback last migration |
| `pa:db-rollback --to [version]` | Rollback to specific version |
| `pa:db-rollback --dry-run` | Preview rollback changes |
| `pa:db-rollback --generate [migration]` | Generate rollback script |
