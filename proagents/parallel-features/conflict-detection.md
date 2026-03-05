# Parallel Feature Conflict Detection

Detect and resolve conflicts when developing multiple features simultaneously.

---

## Overview

When working on multiple features in parallel, conflicts can occur when:
- Same files are modified
- Same components are changed
- Database schema changes overlap
- API contracts conflict

---

## Conflict Types

### File-Level Conflicts

**Detection:**
```
Feature A modifies: [file1.ts, file2.ts, file3.ts]
Feature B modifies: [file2.ts, file4.ts]

⚠️ CONFLICT: file2.ts
```

**Risk Levels:**
| Scenario | Risk | Action |
|----------|------|--------|
| Same file, different sections | Low | Proceed with caution |
| Same file, same section | Medium | Coordinate changes |
| Same function/component | High | Sequential development |

### Semantic Conflicts

Beyond file-level, detect:
- State management conflicts
- API contract changes
- Type definition conflicts
- Route conflicts

---

## Conflict Detection Process

### 1. Pre-Development Check

Before starting a new feature:

```
/conflict-check "feature-name"

Output:
Feature: user-profile
Files to modify: [UserCard.tsx, userService.ts, User.ts]

Checking against active features...

⚠️ Potential Conflicts:
- Feature 'user-settings' also modifies UserCard.tsx
  Risk: MEDIUM (same component, different sections)

- Feature 'auth-refresh' modifies userService.ts
  Risk: LOW (different functions)

Recommendation: Coordinate with user-settings feature owner
```

### 2. During Development

Track file modifications:

```json
{
  "feature": "user-profile",
  "files_modified": [
    {
      "path": "src/components/UserCard.tsx",
      "sections": ["header", "avatar"],
      "last_modified": "2024-01-15T10:30:00Z"
    }
  ],
  "conflicts_detected": [],
  "last_check": "2024-01-15T10:30:00Z"
}
```

### 3. Pre-Merge Check

```
/conflict-check-merge "feature-name"

Checking feature-user-profile for merge conflicts...

Files with potential conflicts:
- UserCard.tsx: Modified by both feature-user-profile and feature-user-settings
  → Review needed before merge

API changes:
- No conflicting API changes detected

Database changes:
- No conflicting schema changes

Recommended merge order:
1. feature-user-settings (PR #123)
2. feature-user-profile (this feature)
```

---

## Resolution Strategies

### Strategy 1: Rebase and Resolve

```bash
# Update your branch with latest from develop
git fetch origin
git rebase origin/develop

# Resolve conflicts file by file
# For each conflict:
# 1. Review both changes
# 2. Combine or choose appropriate version
# 3. Test the result

git add .
git rebase --continue
```

### Strategy 2: Feature Flag Isolation

```javascript
// Both features can merge, but only one active
if (featureFlags.userProfile) {
  return <NewUserProfile />;
} else if (featureFlags.userSettings) {
  return <UserSettings />;
} else {
  return <LegacyProfile />;
}
```

### Strategy 3: Component Decomposition

If two features need same component:
1. Extract shared logic to new component
2. Each feature uses shared + own additions
3. Reduces direct conflicts

### Strategy 4: Coordinated Development

```markdown
## Coordination Agreement

Features: user-profile, user-settings
Shared File: UserCard.tsx

Agreement:
- user-profile: Modifies header and avatar sections
- user-settings: Modifies footer and settings button
- Neither touches: card body

Review: Both must review each other's PRs for this file
```

---

## Conflict Status Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ Parallel Feature Conflict Status                        │
├─────────────────────────────────────────────────────────┤
│ Active Features: 3                                      │
├─────────────────────────────────────────────────────────┤
│ Feature             │ Files │ Conflicts │ Status        │
├─────────────────────┼───────┼───────────┼───────────────┤
│ user-profile        │ 8     │ 1         │ ⚠️ Medium     │
│ user-settings       │ 5     │ 1         │ ⚠️ Medium     │
│ dashboard-redesign  │ 12    │ 0         │ ✅ Clear      │
├─────────────────────────────────────────────────────────┤
│ Conflict Details:                                       │
│ UserCard.tsx: user-profile ↔ user-settings             │
│ Recommended: Coordinate before merge                    │
└─────────────────────────────────────────────────────────┘
```

---

## Configuration

```yaml
# proagents.config.yaml
parallel_features:
  conflict_detection:
    enabled: true
    check_on:
      - feature_start
      - file_save
      - pre_commit
      - pre_merge

    risk_thresholds:
      same_file_different_sections: "low"
      same_file_same_section: "medium"
      same_function: "high"
      api_contract_change: "high"
      schema_change: "high"

    alerts:
      notify_on: "medium"
      block_on: "high"
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/conflict-check` | Check for conflicts |
| `/conflict-status` | Show conflict status |
| `/conflict-resolve` | Help resolve conflicts |
