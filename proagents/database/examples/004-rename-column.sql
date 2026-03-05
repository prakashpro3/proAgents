-- Migration: Rename column from 'name' to 'display_name'
-- Author: ProAgents
-- Date: 2024-01-18
-- Risk Level: Medium
-- Requires Approval: Team Lead
-- Estimated Duration: < 1 second (metadata only)

-- Description:
-- Renames the 'name' column to 'display_name' for clarity.
-- Column rename is a metadata-only operation in PostgreSQL,
-- but requires application code updates.
--
-- IMPORTANT: Coordinate this migration with application deployment.
-- Consider using the expand-contract pattern for zero-downtime.

-- ============================================
-- EXPAND-CONTRACT PATTERN (Zero Downtime)
-- ============================================

-- Phase 1: EXPAND - Add new column (this migration)
-- Phase 2: MIGRATE - Update application to write to both columns
-- Phase 3: BACKFILL - Copy data from old to new column
-- Phase 4: CONTRACT - Update application to read from new column only
-- Phase 5: CLEANUP - Drop old column (separate migration)

-- ============================================
-- UP MIGRATION (Simple approach - requires brief downtime)
-- ============================================

-- Option A: Direct rename (brief lock, simple)
ALTER TABLE users
RENAME COLUMN name TO display_name;

-- Update any views that reference this column
-- (Example if you have views)
-- CREATE OR REPLACE VIEW user_profiles AS
-- SELECT id, display_name, email FROM users;

-- ============================================
-- UP MIGRATION (Zero-downtime approach)
-- ============================================

-- -- Step 1: Add new column
-- ALTER TABLE users ADD COLUMN display_name VARCHAR(100);
--
-- -- Step 2: Create trigger to sync columns during transition
-- CREATE OR REPLACE FUNCTION sync_name_columns()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
--         IF NEW.display_name IS NULL AND NEW.name IS NOT NULL THEN
--             NEW.display_name = NEW.name;
--         ELSIF NEW.name IS NULL AND NEW.display_name IS NOT NULL THEN
--             NEW.name = NEW.display_name;
--         END IF;
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER trigger_sync_name_columns
--     BEFORE INSERT OR UPDATE ON users
--     FOR EACH ROW
--     EXECUTE FUNCTION sync_name_columns();
--
-- -- Step 3: Backfill existing data
-- UPDATE users SET display_name = name WHERE display_name IS NULL;
--
-- -- Step 4: After application updated, drop trigger and old column
-- DROP TRIGGER IF EXISTS trigger_sync_name_columns ON users;
-- DROP FUNCTION IF EXISTS sync_name_columns();
-- ALTER TABLE users DROP COLUMN name;

-- ============================================
-- DOWN MIGRATION (Rollback)
-- ============================================

-- Option A: Simple rollback
ALTER TABLE users
RENAME COLUMN display_name TO name;

-- Option B: Zero-downtime rollback (reverse the expand)
-- ALTER TABLE users DROP COLUMN display_name;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check column was renamed
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('name', 'display_name');

-- Verify no broken views
SELECT viewname
FROM pg_views
WHERE definition LIKE '%users.name%';

-- Check for broken functions/procedures
SELECT proname
FROM pg_proc
WHERE prosrc LIKE '%users.name%';

-- ============================================
-- APPLICATION CODE UPDATES REQUIRED
-- ============================================

-- Before migration:
-- const user = await db.user.findUnique({ where: { id } });
-- console.log(user.name);

-- After migration:
-- const user = await db.user.findUnique({ where: { id } });
-- console.log(user.display_name);  // Updated field name

-- ORM model update (Prisma example):
-- model User {
--   id           String   @id @default(uuid())
--   display_name String?  @map("display_name")  // Updated from "name"
--   email        String   @unique
-- }
