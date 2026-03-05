# Git Rollback Procedures

Safe and effective rollback strategies using Git.

---

## Overview

This guide covers rollback procedures for:
- Code rollbacks
- Release rollbacks
- Emergency hotfixes
- Database-coordinated rollbacks

---

## Rollback Types

### 1. Quick Rollback (Last Commit)

**When:** Single bad commit needs reverting

```bash
# Revert the last commit (creates new commit)
git revert HEAD

# Revert without auto-commit (review first)
git revert HEAD --no-commit
git diff --staged  # Review changes
git commit -m "Revert: [original commit message]"
```

**Best for:** Small changes, bug fixes gone wrong

---

### 2. Feature Rollback (Multiple Commits)

**When:** Entire feature needs reverting

```bash
# Find where feature started
git log --oneline --graph

# Revert range of commits (oldest to newest)
git revert --no-commit abc123..def456
git commit -m "Revert: feature-name due to [reason]"

# OR revert a merge commit
git revert -m 1 <merge-commit-hash>
```

**Example:**
```bash
# Feature was merged in commit abc123
git revert -m 1 abc123

# Message
Revert: Merge feature/user-auth

Reason: Authentication causing 500 errors in production
Ticket: ISSUE-456
```

---

### 3. Release Rollback (Version Tag)

**When:** Entire release needs reverting

```bash
# Current: v1.2.0 (broken)
# Target: v1.1.0 (last stable)

# Option A: Reset to previous tag (CAREFUL - destructive)
git reset --hard v1.1.0
git push --force origin main  # Requires permissions

# Option B: Revert all commits since last release (safe)
git revert --no-commit v1.1.0..v1.2.0
git commit -m "Revert: v1.2.0 release - rolling back to v1.1.0"
git tag v1.2.1
git push origin main --tags
```

**Best for:** Major release issues

---

### 4. Emergency Hotfix

**When:** Critical fix needed immediately

```bash
# Start from production tag
git checkout v1.2.0
git checkout -b hotfix/critical-fix

# Make minimal fix
# ... edit files ...

git add .
git commit -m "hotfix: Critical fix for [issue]"

# Create new tag
git tag v1.2.1

# Merge back to main
git checkout main
git merge hotfix/critical-fix

# Push everything
git push origin main --tags
```

---

## Rollback Decision Tree

```
Problem Detected
       │
       ▼
┌──────────────────┐
│ Can quick fix?   │──Yes──▶ Deploy hotfix
└──────────────────┘
       │ No
       ▼
┌──────────────────┐
│ Single commit?   │──Yes──▶ git revert HEAD
└──────────────────┘
       │ No
       ▼
┌──────────────────┐
│ Feature merge?   │──Yes──▶ git revert -m 1 <merge>
└──────────────────┘
       │ No
       ▼
┌──────────────────┐
│ Multiple commits │──Yes──▶ git revert <range>
└──────────────────┘
       │ No
       ▼
┌──────────────────┐
│ Full release?    │──Yes──▶ Revert to previous tag
└──────────────────┘
```

---

## Rollback Checklist

### Before Rollback
```markdown
- [ ] Confirm the issue requires rollback (not fixable quickly)
- [ ] Identify exact commits/release to roll back
- [ ] Notify stakeholders (team, support, customers if needed)
- [ ] Check for database migrations that need reverting
- [ ] Prepare rollback script/commands
- [ ] Ensure access to deployment pipeline
```

### During Rollback
```markdown
- [ ] Put application in maintenance mode (if applicable)
- [ ] Execute Git rollback commands
- [ ] Revert any database migrations
- [ ] Deploy rolled-back code
- [ ] Verify application health checks
- [ ] Test critical paths manually
```

### After Rollback
```markdown
- [ ] Monitor error rates and performance
- [ ] Communicate completion to stakeholders
- [ ] Create incident report
- [ ] Schedule post-mortem
- [ ] Plan proper fix for original issue
```

---

## Database-Coordinated Rollback

When rollback involves database changes:

```bash
# 1. Put app in maintenance mode
./scripts/maintenance-mode on

# 2. Run database rollback
npm run db:migrate:down
# OR
npx prisma migrate reset --to <migration-name>

# 3. Verify database state
npm run db:verify

# 4. Git rollback
git revert <commits>

# 5. Deploy rolled-back code
./scripts/deploy

# 6. Exit maintenance mode
./scripts/maintenance-mode off

# 7. Verify application
curl -f https://api.example.com/health
```

---

## Rollback Scripts

### Automated Rollback Script

```bash
#!/bin/bash
# rollback.sh

set -e

# Configuration
ROLLBACK_TARGET="${1:-HEAD~1}"
ENVIRONMENT="${2:-staging}"

echo "=== Starting Rollback ==="
echo "Target: $ROLLBACK_TARGET"
echo "Environment: $ENVIRONMENT"

# Confirm
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Create rollback branch
BRANCH="rollback/$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BRANCH"

# Perform rollback
if [[ "$ROLLBACK_TARGET" == v* ]]; then
    # Tag-based rollback
    CURRENT_TAG=$(git describe --tags --abbrev=0)
    git revert --no-commit "$ROLLBACK_TARGET..$CURRENT_TAG"
else
    # Commit-based rollback
    git revert --no-commit "$ROLLBACK_TARGET"
fi

# Commit rollback
git commit -m "Rollback to $ROLLBACK_TARGET

Environment: $ENVIRONMENT
Reason: Emergency rollback
Date: $(date)
"

# Push
git push origin "$BRANCH"

# Create PR (using GitHub CLI)
gh pr create \
    --title "ROLLBACK: Revert to $ROLLBACK_TARGET" \
    --body "## Emergency Rollback

Target: $ROLLBACK_TARGET
Environment: $ENVIRONMENT
Time: $(date)

### Checklist
- [ ] Database rollback completed (if applicable)
- [ ] Smoke tests passed
- [ ] Stakeholders notified
" \
    --label "rollback,urgent"

echo "=== Rollback PR Created ==="
echo "Please review and merge to deploy"
```

---

## Recovery Scenarios

### Scenario 1: Accidental Force Push

```bash
# Find the previous HEAD in reflog
git reflog show origin/main

# Output:
# abc1234 origin/main@{0}: update by push --force
# xyz5678 origin/main@{1}: update by push  <-- This is what we want

# Restore
git checkout main
git reset --hard xyz5678
git push --force origin main

# Notify team
echo "Main branch restored to xyz5678. Please re-pull."
```

### Scenario 2: Merged Wrong Branch

```bash
# Revert the merge commit
git revert -m 1 <merge-commit-hash>

# Push the revert
git push origin main

# Note: If you need to re-merge later
git checkout feature-branch
git revert <revert-commit-hash>  # Undo the revert
git checkout main
git merge feature-branch
```

### Scenario 3: Lost Commits

```bash
# Check reflog for lost commits
git reflog

# Find the commit
git show abc1234

# Recover it
git cherry-pick abc1234

# Or create branch from it
git checkout -b recovered-commits abc1234
```

---

## Rollback Communication Template

```markdown
## Rollback Notification

**Status:** 🔄 Rollback In Progress / ✅ Rollback Complete

**Time:** [UTC timestamp]
**Environment:** [Production/Staging]
**Duration:** [Expected/Actual duration]

### What Happened
[Brief description of the issue that caused rollback]

### Impact
- [Affected features/services]
- [User impact description]

### Actions Taken
1. [Action 1]
2. [Action 2]
3. [Action 3]

### Current Status
- Application: [Healthy/Degraded/Down]
- Error rate: [X%]
- Response time: [Xms]

### Next Steps
- [ ] Complete root cause analysis
- [ ] Schedule fix implementation
- [ ] Post-mortem meeting

### Contact
[On-call engineer name/contact]
```

---

## Configuration

```yaml
# proagents.config.yaml

git:
  rollback:
    auto_create_backup_branch: true
    require_confirmation: true
    notify_on_rollback: true

    notifications:
      slack_channel: "#deployments"
      email: ["oncall@company.com"]

    protection:
      require_approval_for_production: true
      max_commits_without_confirmation: 5

    scripts:
      pre_rollback: "./scripts/pre-rollback.sh"
      post_rollback: "./scripts/post-rollback.sh"
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:rollback` | Start rollback wizard |
| `pa:rollback --last` | Revert last commit |
| `pa:rollback --to [tag]` | Rollback to specific tag |
| `pa:rollback --commits [n]` | Revert last n commits |
| `pa:rollback --dry-run` | Preview rollback changes |
| `pa:rollback --status` | Check current rollback status |
