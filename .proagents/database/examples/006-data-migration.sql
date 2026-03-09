-- Migration: Migrate user roles from string to normalized table
-- Author: ProAgents
-- Date: 2024-01-20
-- Risk Level: High
-- Requires Approval: Manager + DBA
-- Estimated Duration: 5-30 minutes depending on data volume

-- Description:
-- Transforms the denormalized 'role' enum column into a normalized
-- many-to-many relationship with a roles table. This allows users
-- to have multiple roles.
--
-- CRITICAL: This is a data migration. Test thoroughly on staging first.
-- Create backup before running in production.

-- ============================================
-- PRE-FLIGHT CHECKS
-- ============================================

-- Create backup table
CREATE TABLE users_backup_20240120 AS SELECT * FROM users;

-- Verify backup
SELECT COUNT(*) FROM users_backup_20240120;

-- Check current role distribution
SELECT role, COUNT(*) as count
FROM users
GROUP BY role
ORDER BY count DESC;

-- ============================================
-- UP MIGRATION
-- ============================================

-- Step 1: Create roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Step 2: Create junction table for many-to-many
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);

-- Create indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Step 3: Populate roles table from existing enum values
INSERT INTO roles (name, description, permissions) VALUES
    ('admin', 'Full system access', '["read", "write", "delete", "admin"]'::jsonb),
    ('developer', 'Development access', '["read", "write", "deploy"]'::jsonb),
    ('viewer', 'Read-only access', '["read"]'::jsonb),
    ('guest', 'Limited guest access', '["read_public"]'::jsonb);

-- Step 4: Migrate existing user roles to junction table
INSERT INTO user_roles (user_id, role_id, granted_at)
SELECT
    u.id as user_id,
    r.id as role_id,
    u.created_at as granted_at
FROM users u
JOIN roles r ON r.name = u.role::text
WHERE u.deleted_at IS NULL;

-- Step 5: Verify migration counts match
DO $$
DECLARE
    original_count INTEGER;
    migrated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO original_count
    FROM users WHERE deleted_at IS NULL;

    SELECT COUNT(DISTINCT user_id) INTO migrated_count
    FROM user_roles;

    IF original_count != migrated_count THEN
        RAISE EXCEPTION 'Migration count mismatch: % vs %',
            original_count, migrated_count;
    END IF;

    RAISE NOTICE 'Migration verified: % users migrated', migrated_count;
END $$;

-- Step 6: Create view for backward compatibility
CREATE VIEW user_primary_role AS
SELECT
    u.id as user_id,
    r.name as role,
    r.id as role_id
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE ur.granted_at = (
    SELECT MIN(granted_at)
    FROM user_roles
    WHERE user_id = u.id
);

-- Step 7: Drop old role column (after application updated)
-- IMPORTANT: Only run this after verifying application works with new schema
-- ALTER TABLE users DROP COLUMN role;
-- DROP TYPE IF EXISTS user_role;

-- ============================================
-- DOWN MIGRATION (Rollback)
-- ============================================

-- Step 1: Restore role column if dropped
-- ALTER TABLE users ADD COLUMN role user_role;

-- Step 2: Restore data from junction table
UPDATE users u
SET role = (
    SELECT r.name::user_role
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = u.id
    ORDER BY ur.granted_at
    LIMIT 1
);

-- Step 3: Drop new tables
DROP VIEW IF EXISTS user_primary_role;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;

-- Step 4: Restore from backup if needed
-- DROP TABLE users;
-- ALTER TABLE users_backup_20240120 RENAME TO users;

-- ============================================
-- VERIFICATION
-- ============================================

-- Compare counts
SELECT
    (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) as total_users,
    (SELECT COUNT(DISTINCT user_id) FROM user_roles) as users_with_roles,
    (SELECT COUNT(*) FROM user_roles) as total_assignments;

-- Check role distribution matches original
SELECT r.name, COUNT(ur.user_id) as user_count
FROM roles r
LEFT JOIN user_roles ur ON ur.role_id = r.id
GROUP BY r.name
ORDER BY user_count DESC;

-- Verify no orphaned records
SELECT COUNT(*) as orphaned
FROM user_roles ur
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = ur.user_id);

-- Test backward compatibility view
SELECT * FROM user_primary_role LIMIT 5;

-- ============================================
-- CLEANUP (Run after verification period)
-- ============================================

-- Drop backup table
-- DROP TABLE IF EXISTS users_backup_20240120;

-- Drop old column and enum
-- ALTER TABLE users DROP COLUMN IF EXISTS role;
-- DROP TYPE IF EXISTS user_role;

-- ============================================
-- APPLICATION CODE UPDATES
-- ============================================

-- Old query:
-- SELECT * FROM users WHERE role = 'admin';

-- New query:
-- SELECT u.*
-- FROM users u
-- JOIN user_roles ur ON ur.user_id = u.id
-- JOIN roles r ON r.id = ur.role_id
-- WHERE r.name = 'admin';

-- Or using the view for backward compatibility:
-- SELECT u.*
-- FROM users u
-- JOIN user_primary_role upr ON upr.user_id = u.id
-- WHERE upr.role = 'admin';
