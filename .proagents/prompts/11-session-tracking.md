# Session Tracking & Cross-AI Continuity

Commands for maintaining context across AI platforms.

---

## CRITICAL: Auto-Log Every Code Change

**AI MUST automatically log EVERY code change IMMEDIATELY after making it.**

This is NOT optional. Do NOT wait for user to ask.

### After EVERY file edit/create/delete, AI does:

```
1. Prepend to .proagents/changelog/_recent.md
2. Update .proagents/worklog/_context.md
3. Update .proagents/changelog/modules/[module].md
4. Update .proagents/changelog/features/[feature].md (if on feature)
```

### Auto-Detect Module from File Path:

| File Path | Module |
|-----------|--------|
| `src/api/*`, `routes/*` | api |
| `src/auth/*` | auth |
| `src/components/*` | ui |
| `src/services/*` | services |
| `src/utils/*`, `lib/*` | utils |
| `tests/*` | tests |
| `src/database/*` | database |

### Example Flow:

```
User: Fix the login bug

AI: [Reads src/auth/login.ts]
AI: [Edits file - fixes bug]
AI: [IMMEDIATELY updates changelogs:]
    - Prepends to changelog/_recent.md
    - Updates changelog/modules/auth.md
    - Updates worklog/_context.md
AI: "Fixed the login bug in src/auth/login.ts"
```

### _recent.md Entry Format:

```markdown
### YYYY-MM-DD - [Change Type]
**Module:** [auto-detected]
**AI:** [Platform] ([model])
**Files:** path/file.ts (+lines, -lines)
**Summary:** Brief description

---
```

### Module Changelog Entry Format:

```markdown
### YYYY-MM-DD - [AI Platform]
**Context:** [Feature name or "Bug fix" or "Enhancement"]
**Files:** path/file.ts (+lines, -lines)
**Changes:** What was changed
```

---

## Commands

| Command | Action |
|---------|--------|
| `pa:sync` | Load context (run FIRST) |
| `pa:session-start` | Begin work session |
| `pa:session-end` | End session, finalize logs |
| `pa:handoff` | Create detailed handoff |

---

## pa:sync - Load Project Context

**Run this FIRST when starting work on any AI platform.**

### AI Workflow:

```bash
# 1. Read context summary
cat .proagents/worklog/_context.md

# 2. Read recent changes
cat .proagents/changelog/_recent.md

# 3. Read latest session logs (last 2)
ls -t .proagents/worklog/*.md | head -3 | xargs cat

# 4. Check active features
cat .proagents/active-features/_index.json

# 5. Read activity log
tail -20 .proagents/activity.log
```

### AI Response Format:

```
## Project Context Loaded

### Active Work
- Feature: user-auth (70% complete)
- Last worked: 2024-03-11 by Claude

### Recent Changes
1. Added JWT validation (Claude, Mar 11)
2. Fixed login bug (Gemini, Mar 10)

### Pending Tasks
- [ ] Complete email verification
- [ ] Add unit tests

### Ready to Continue
What would you like me to work on?
```

---

## pa:session-start - Begin Work Session

Creates a new session log file.

### AI Workflow:

```bash
# Generate session filename
DATE=$(date '+%Y-%m-%d')
AI_NAME="claude"  # or gemini, chatgpt, etc.
SESSION_NUM="001" # increment if exists

# Create session file
FILENAME=".proagents/worklog/${DATE}-${AI_NAME}-${SESSION_NUM}.md"
```

### Session File Template:

```markdown
# Work Session: [DATE]-[AI]-[SESSION]

**AI Platform:** [Platform] ([Model])
**Started:** [Timestamp]
**Duration:** [In progress]

---

## Summary

[To be filled at session end]

---

## Tasks Completed

[Log each task as completed]

---

## Decisions Made

| Decision | Reason |
|----------|--------|

---

## Files Changed

| File | Action | Lines |
|------|--------|-------|

---

## Next Steps (For Next AI)

[To be filled at session end]
```

---

## pa:session-end - Finalize Session

Updates all tracking files.

### AI Workflow:

1. **Update session log** with summary and next steps
2. **Update `_context.md`** with current state
3. **Update `_recent.md`** with changes
4. **Update feature changelog** if working on feature
5. **Update module changelog** for each module touched
6. **Log to activity.log**

### Context Update Template:

```markdown
# Current Project Context

Last Updated: [NOW]
Last AI: [Platform] ([Model])

---

## Active Work

- **Feature:** [name] ([phase], [%] complete)
  - Last: [what was done]
  - Next: [what needs doing]

---

## Recent Changes

### [TODAY]
- [Change 1] - [AI]
- [Change 2] - [AI]

### [YESTERDAY]
- [Change 3] - [AI]

---

## Pending Items

1. [ ] [Item from last session's "Next Steps"]
2. [ ] [Item 2]
```

---

## pa:handoff - Detailed Handoff Notes

For major context switches or end of feature.

### Creates: `.proagents/handoff.md`

```markdown
# Project Handoff

Date: [NOW]
From: [Current AI Platform]
To: Any AI

---

## Current State

### Completed
- [List all completed work]

### In Progress
- [Current work with exact state]

### Not Started
- [Planned but not begun]

---

## Key Decisions Made

| Decision | Reason | Date |
|----------|--------|------|
| [Decision] | [Why] | [When] |

---

## Known Issues

1. [Issue description]
   - Status: [open/investigating]
   - Notes: [Any context]

---

## Architecture Notes

[Any important architecture decisions or patterns]

---

## File Map

Key files and their purposes:
- `src/auth/` - Authentication logic
- `src/api/` - API endpoints

---

## How to Continue

1. Run `pa:sync` to load context
2. Check `worklog/_context.md` for current state
3. Review recent session logs
4. Continue from "In Progress" items

---

## Commands History

Last 10 commands:
[From activity.log]
```

---

## pa:resume - Quick Resume

Fast context loading for returning AI:

```bash
# AI executes:
cat .proagents/worklog/_context.md
cat .proagents/changelog/_recent.md
ls -t .proagents/worklog/*.md 2>/dev/null | head -2 | tail -1 | xargs cat
tail -10 .proagents/activity.log
```

Output:
```
Resume Context
══════════════
Last Session: 2024-03-11 by Claude
Duration: 45 min

What Was Done:
- Added JWT validation
- Fixed login bug

Pending Tasks:
1. [ ] Complete email verification

Suggested Next Action:
→ Continue with email verification
```

---

## pa:conflict-check - Check File Conflicts

Before editing files, check if another AI modified them:

```bash
grep "Files:.*login.ts" .proagents/changelog/_recent.md
```

If conflict:
```
⚠️ CONFLICT WARNING
File: src/auth/login.ts
Last modified: 2 hours ago by Gemini

Review changes first? [Y/n]
```

---

## pa:changelog --from-git

Auto-populate changelog from git commits:

```bash
git log --oneline --since="24 hours ago"
```

AI parses each commit, detects module from files, extracts issue numbers, and prepends to `_recent.md`.

---

## Issue Linking

Auto-detect issue numbers from:
- User message: "fix #123"
- Branch: `fix/123-bug`
- Commit: `Fixes #123`

Include in changelog:
```markdown
### 2024-03-11 - Bug Fix
**Issue:** #123
**Closes:** #123
```

---

## File-Level Lock

Track files being edited:

```bash
# On edit:
echo "file.ts|Claude|$(date)" >> .proagents/.active-files

# On session end:
grep -v "|Claude|" .proagents/.active-files > /tmp/af && mv /tmp/af .proagents/.active-files
```

---

## Validation Reminder

On pa:sync, check if previous session logged properly:

```bash
# If git shows more changes than changelog:
echo "⚠️ Previous session may have unlogged changes"
```

---

## Automatic Tracking Rules

### After pa:feature "name":
```bash
# Create feature changelog
touch .proagents/changelog/features/[name].md

# Create feature tracking
mkdir -p .proagents/active-features/feature-[name]

# Update _index.json
# Update _context.md
```

### After pa:fix "issue":
```bash
# Log to _recent.md
# Update relevant module changelog
# Update _context.md
```

### After ANY code change:
```bash
# 1. Identify module from file path
# 2. Update module changelog
# 3. Update session log
# 4. Update _context.md (if significant)
```

---

## Module Auto-Detection

| File Path Pattern | Module |
|------------------|--------|
| `src/api/*`, `routes/*` | api |
| `src/auth/*`, `**/auth/**` | auth |
| `src/components/*`, `**/ui/**` | ui |
| `src/services/*` | services |
| `src/utils/*`, `lib/*` | utils |
| `src/database/*`, `**/models/**` | database |
| `tests/*`, `**/*.test.*` | tests |

---

## Example Session Flow

```
User: pa:sync

AI: [Reads context files]
    Project Context Loaded!
    - Active: user-auth feature (70%)
    - Last: JWT validation added
    - Next: Email verification

User: Continue with email verification

AI: [Works on task]
    [Creates/updates code]
    [Updates session log]
    [Updates feature changelog]

User: pa:session-end

AI: [Finalizes session]
    Session Complete!
    - Duration: 45 min
    - Tasks: 2 completed
    - Files: 4 modified
    - Next AI can continue from: [next steps]

    Updated:
    ✓ worklog/_context.md
    ✓ worklog/2024-03-11-claude-001.md
    ✓ changelog/features/user-auth.md
    ✓ changelog/_recent.md
    ✓ activity.log
```

---

## File Locations

| File | Purpose |
|------|---------|
| `worklog/_context.md` | Quick context for any AI |
| `worklog/[session].md` | Detailed session logs |
| `changelog/_recent.md` | Last 10 changes |
| `changelog/features/*.md` | Per-feature history |
| `changelog/modules/*.md` | Per-module history |
| `active-features/_index.json` | Feature status |
| `activity.log` | Command history |
| `handoff.md` | Major handoff notes |
