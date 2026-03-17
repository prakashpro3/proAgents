# AI Instructions for ProAgents

This project uses ProAgents - an AI-agnostic development workflow framework.

---

## ⚠️ MANDATORY: Auto-Sync on EVERY pa: Command

**BEFORE executing ANY `pa:` command, AI MUST run these steps FIRST:**

```bash
# STEP 1: Load context (REQUIRED - do this FIRST)
cat .proagents/worklog/_context.md 2>/dev/null
cat .proagents/changelog/_recent.md 2>/dev/null | head -30
tail -10 .proagents/activity.log 2>/dev/null
```

**This applies to ALL commands including:**
- `pa:fix "bug"` - Load context FIRST, then fix
- `pa:feature "name"` - Load context FIRST, then start feature
- `pa:test` - Load context FIRST, then run tests
- `pa:doc` - Load context FIRST, then generate docs
- **EVERY pa: command** - Load context FIRST

**AFTER executing ANY `pa:` command that changes files, AI MUST:**

```bash
# Update worklogs and changelogs
# 1. Prepend to .proagents/changelog/_recent.md
# 2. Update .proagents/worklog/_context.md
# 3. Update .proagents/changelog/modules/[module].md
# 4. Log to .proagents/activity.log
```

**Example flow for `pa:fix "login bug"`:**
```
1. AI reads _context.md, _recent.md, activity.log  ← AUTO-SYNC FIRST
2. AI analyzes and fixes the bug                    ← DO THE WORK
3. AI updates _recent.md with fix details           ← LOG THE CHANGE
4. AI updates _context.md with current state        ← UPDATE CONTEXT
5. AI logs to activity.log                          ← LOG ACTIVITY
```

**Note:** When updating `_recent.md` or `_context.md`, first read the corresponding `*.template.md` file to use the latest format. See "Using Template Reference Files" section below.

---

## CRITICAL PRINCIPLE: ALWAYS DO, NEVER JUST TELL

**ProAgents automates development. The AI must EXECUTE actions, not give instructions for users to follow.**

| WRONG (Passive) | RIGHT (Active) |
|-----------------|----------------|
| "To run tests: `npm test`" | Actually run `npm test` and show results |
| "Create tests in `__tests__/`" | Actually create the test files |
| "You can fix this by..." | Actually fix it |
| "Next steps: 1. Create..." | Do all steps automatically |

**Rules:**
1. **Execute, don't instruct** - Run commands, don't tell user to run them
2. **Create, don't suggest** - Write files, don't tell user to create them
3. **Fix, don't advise** - Fix issues directly, don't explain how to fix
4. **Complete the task** - Don't stop at giving "next steps"
5. **Only ask when truly needed** - Ambiguous requirements, destructive actions, or user preferences

**Exception:** Only give instructions when:
- Action requires credentials/secrets you don't have access to
- Action is destructive and needs explicit user confirmation
- Action is outside the project scope (external services, deployments)

---

## Multi-AI Environment

**Multiple AI tools may work on this project simultaneously. They do NOT share context.**

### AUTOMATIC Context Loading (EVERY pa: Command)

**On EVERY `pa:` command, AI MUST FIRST load context:**

```bash
# MANDATORY FIRST STEP - Run before ANY pa: command
cat .proagents/worklog/_context.md 2>/dev/null
cat .proagents/changelog/_recent.md 2>/dev/null | head -30
tail -10 .proagents/activity.log 2>/dev/null

# Also check for conflicts
cat .proagents/.active-files 2>/dev/null
```

**This is NOT optional. This is NOT just for "first command".**
**EVERY pa: command = Load context FIRST, then execute.**

**User does NOT need to type pa:sync - AI does it automatically on EVERY pa: command.**

### Before ANY `pa:` command:

1. **Auto-load context** - Read `worklog/_context.md` and `changelog/_recent.md`
2. **Check activity log** - `./.proagents/activity.log`
3. **Check feedback** - `./.proagents/feedback.md` (learn from past corrections!)
4. **Check watchlist** - `./.proagents/watchlist.yaml` (files requiring confirmation)
5. **Check file locks** - `./.proagents/.active-files`

### After ANY `pa:` command:

**MANDATORY: Log every command to `./.proagents/activity.log`**

AI must append to activity.log (create if not exists):
```
[TIMESTAMP] [AI:MODEL] [COMMAND] Result/Description
```

Example entries:
```
2024-03-06 15:10 [Claude:opus-4] [pa:feature] Started feature "user-auth"
2024-03-06 15:15 [Claude:opus-4] [pa:analyze] Analyzed codebase - found 45 files
2024-03-06 15:30 [Cursor:gpt-4] [pa:test] Ran 12 tests - all passed
2024-03-06 16:00 [Gemini:pro] [pa:logs] Captured 50 log entries, found 2 errors
```

**How to log (AI executes this after EVERY pa: command):**
```bash
echo "[$(date '+%Y-%m-%d %H:%M')] [Claude:opus-4] [pa:feature] Started user-auth" >> .proagents/activity.log
```

**CRITICAL:**
- Log AFTER the "--- Activity Log Start ---" marker
- Use YOUR AI platform name (Claude, Cursor, Gemini, etc.)
- Log EVERY pa: command, not just major ones

### Lock File

For major tasks, create `./.proagents/.lock`:
```yaml
locked_by: Claude
model: opus-4
task: "pa:feature user-auth"
expires: 2024-03-06T17:10:00
```

Check lock before starting. Delete when done.

---

## CRITICAL: Auto-Log Every Code Change

**AI MUST automatically log EVERY code change. This is NOT optional.**

### After EVERY file edit/create/delete:

AI immediately updates these files (no user prompt needed):

```
1. .proagents/changelog/_recent.md     ← Prepend change summary
2. .proagents/worklog/_context.md      ← Update current state
3. .proagents/changelog/features/X.md  ← If working on feature
4. .proagents/changelog/modules/X.md   ← Based on file path
```

### Using Template Reference Files

**IMPORTANT:** Template files (`*.template.md`, `*.template.json`) provide the latest format for user data files.

| User Data File (EDIT THIS) | Template Reference (READ ONLY) |
|----------------------------|-------------------------------|
| `changelog/_recent.md` | `changelog/_recent.template.md` |
| `worklog/_context.md` | `worklog/_context.template.md` |
| `worklog/ai-stats.json` | `worklog/ai-stats.template.json` |
| `active-features/_index.json` | `active-features/_index.template.json` |
| `.learning/global/user-preferences.json` | `.learning/global/user-preferences.template.json` |
| `.learning/global/common-patterns.json` | `.learning/global/common-patterns.template.json` |

**How to use:**
1. **Read the template FIRST** before creating/updating user data files
2. **Apply the template format** to user data (structure, fields, sections)
3. **NEVER modify template files** - they are READ ONLY (updated by framework)

**Why templates exist:**
- Templates get updated when ProAgents upgrades (new fields, better structure)
- User data files are preserved during upgrades (your content stays safe)
- AI always has access to the latest format by reading templates

**Common mistake to avoid:**
```
WRONG: Edit _recent.template.md directly
RIGHT: Read _recent.template.md, then edit _recent.md using that format
```

---

### Auto-Log Format for _recent.md:

After editing `src/auth/login.ts`, AI prepends to `_recent.md`:

```markdown
### [DATE] - Code Change
**Module:** auth
**AI:** [Platform] ([model])
**Files:** src/auth/login.ts (+15, -3)
**Summary:** Added email validation to login function

---
```

### Module Detection (Auto):

| File Path Changed | Update This Changelog |
|-------------------|----------------------|
| `src/api/*`, `routes/*` | `changelog/modules/api.md` |
| `src/auth/*` | `changelog/modules/auth.md` |
| `src/components/*` | `changelog/modules/ui.md` |
| `src/services/*` | `changelog/modules/services.md` |
| `src/utils/*`, `lib/*` | `changelog/modules/utils.md` |
| `tests/*`, `*.test.*` | `changelog/modules/tests.md` |
| `src/database/*`, `models/*` | `changelog/modules/database.md` |

### Example - AI Edits a File:

```
User: Fix the login validation bug

AI: [Reads file, makes edit to src/auth/login.ts]

AI: [AUTOMATICALLY does these updates - no user prompt:]

1. Prepends to .proagents/changelog/_recent.md:
   ### 2024-03-11 - Bug Fix
   **Module:** auth
   **AI:** Claude (opus-4)
   **Files:** src/auth/login.ts (+5, -2)
   **Summary:** Fixed null check in email validation

2. Updates .proagents/changelog/modules/auth.md (creates if not exists)

3. Updates .proagents/worklog/_context.md with latest change

AI: "Fixed the login validation bug in src/auth/login.ts"
```

### Log Rollbacks & Corrections Too:

When removing or correcting previous changes, also log:

```markdown
### YYYY-MM-DD - Rollback/Correction
**Module:** auth
**AI:** Claude (opus-4)
**Files:** src/auth/login.ts (-20 lines removed)
**Summary:** Reverted email validation - caused login failures
**Reason:** Previous change broke existing functionality

---
```

### WRONG vs RIGHT:

| WRONG | RIGHT |
|-------|-------|
| Edit file → Tell user "done" | Edit file → Update changelogs → Tell user "done" |
| Wait for pa:changelog command | Auto-update after every change |
| Only log at session end | Log immediately after each change |
| Undo changes silently | Log rollback with reason |

---

## Smart Context Features (AUTO)

### 1. Quick Summary (Top of _context.md)

After EVERY change, AI regenerates Quick Summary (max 5 lines):

```
## Quick Summary
Last: Claude fixed login bug #123 (2 hrs ago)
Active: user-auth feature (70%)
Pending: 2 tasks
Tests: ✓ Passing
```

### 2. Context Changed Alert

On first pa: command, check if another AI worked:

```bash
# AI compares last session vs _recent.md
LAST_AI=$(grep "Last AI:" .proagents/worklog/_context.md | cut -d: -f2)
RECENT_AI=$(head -20 .proagents/changelog/_recent.md | grep "AI:" | head -1)
```

If different AI made changes, show:
```
⚠️ CONTEXT CHANGED
Gemini made 3 changes 1 hour ago:
- Fixed API endpoint
- Updated auth flow
Review before continuing? [Y/n]
```

### 3. Test Status Auto-Update

After ANY test command, update _context.md:

```
## Test Status
Status: ✓ 45 passing | ✗ 2 failing
Last Run: 2024-03-11 15:30
Failing: auth.test.ts (line 45)
```

### 4. Feature Progress Auto-Calculate

```
## Feature Progress
Feature: user-auth
Progress: ████████░░ 80%
Completed: 8/10 tasks
```

Calculate: (completed tasks / total tasks) × 100

### 5. Auto-Archive Old Logs (7+ days)

```bash
mkdir -p .proagents/worklog/archive
# Move files older than 7 days
find .proagents/worklog -maxdepth 1 -name "2*.md" -mtime +7 -exec mv {} .proagents/worklog/archive/ \;
```

### 6. AI Performance Stats

Update `worklog/ai-stats.json` after each session:

```json
{
  "Claude": { "sessions": 15, "tasks": 45, "reverts": 2 }
}
```

---

## Cross-AI Session Tracking (AUTOMATIC)

**All session tracking is AUTOMATIC. User does NOT need to run these commands manually.**

### Automatic Behavior:

| What | When | User Action Needed |
|------|------|-------------------|
| Load context | First pa: command | **None** - Auto |
| Log changes | After each edit | **None** - Auto |
| Update _context.md | After each edit | **None** - Auto |
| Check conflicts | Before editing files | **None** - Auto |
| Update Quick Summary | After each edit | **None** - Auto |
| Context changed alert | First pa: command | **None** - Auto |
| Update test status | After tests | **None** - Auto |
| Update AI stats | After session | **None** - Auto |

### On First pa: Command (Auto-Sync):

AI automatically reads context (no manual pa:sync needed):
```bash
cat .proagents/worklog/_context.md        # Current state
cat .proagents/changelog/_recent.md       # Recent changes
tail -10 .proagents/activity.log          # Recent commands
cat .proagents/.active-files 2>/dev/null  # Check file locks
```

### During Work (Auto-Log):

After ANY code modification, AI must update:

1. **Session Log** (`worklog/YYYY-MM-DD-[ai]-[num].md`)
   - Tasks completed
   - Files changed
   - Decisions made

2. **Feature Changelog** (`changelog/features/[name].md`)
   - If working on a feature

3. **Module Changelog** (`changelog/modules/[name].md`)
   - Based on file paths modified

### On Session End (pa:session-end):

AI updates:
```bash
# 1. Update context summary
# Edit .proagents/worklog/_context.md with current state

# 2. Update recent changes
# Prepend to .proagents/changelog/_recent.md

# 3. Finalize session log with "Next Steps"

# 4. Log to activity.log
echo "[$(date '+%Y-%m-%d %H:%M')] [AI:model] [pa:session-end] Session complete" >> .proagents/activity.log
```

### Module Auto-Detection:

| File Path | Module Changelog |
|-----------|------------------|
| `src/api/*` | `modules/api.md` |
| `src/auth/*` | `modules/auth.md` |
| `src/components/*` | `modules/ui.md` |
| `src/services/*` | `modules/services.md` |
| `tests/*` | `modules/tests.md` |

### Conflict Check (Before Editing):

Before modifying any file, AI checks if another AI recently changed it:

```bash
grep "src/auth/login.ts" .proagents/changelog/_recent.md
```

If found, warn user:
```
⚠️ File src/auth/login.ts was modified by Gemini 2 hours ago.
Review changes before editing? [Y/n]
```

### File-Level Lock:

When editing files, track them:

```bash
# On edit start:
echo "src/auth/login.ts|Claude|$(date -Iseconds)" >> .proagents/.active-files

# On session end - clear your locks:
grep -v "|Claude|" .proagents/.active-files > /tmp/af && mv /tmp/af .proagents/.active-files
```

### Validation on pa:sync:

AI checks if previous session logged properly:

```bash
# Compare git changes vs logged changes
git diff --name-only HEAD~3 2>/dev/null | wc -l  # Files changed
grep -c "Files:" .proagents/changelog/_recent.md  # Files logged
```

If mismatch, warn:
```
⚠️ Previous session may have unlogged changes. Check git log.
```

### Issue Linking:

Auto-detect issue numbers from user input and include in changelog:

```markdown
### 2024-03-11 - Bug Fix
**Issue:** #123
**Module:** auth
**Files:** src/auth/login.ts
**Summary:** Fixed validation bug
**Closes:** #123
```

---

## Command Quick Reference

### Aliases
| Alias | Command |
|-------|---------|
| `pa:f` | `pa:feature` |
| `pa:s` | `pa:status` |
| `pa:h` | `pa:help` |
| `pa:d` | `pa:doc` |
| `pa:t` | `pa:test` |
| `pa:q` | `pa:qa` |
| `pa:a` | `pa:analyze` |
| `pa:r` | `pa:requirements` |
| `pa:p` | `pa:plan` |
| `pa:i` | `pa:implement` |
| `pa:rev` | `pa:review` |
| `pa:dbg` | `pa:debug` |
| `pa:l` | `pa:logs` |

### Core Commands
| Command | Action |
|---------|--------|
| `pa:help` | Show all commands |
| `pa:status` | Show current progress |
| `pa:feature "name"` | Start new feature |
| `pa:fix "bug"` | Quick bug fix |
| `pa:project-setup` | Interactive project setup wizard |
| `pa:setup` | Alias for pa:project-setup |
| `pa:rnd` | Research & Development workflow |
| `pa:research` | Alias for pa:rnd |
| `pa:feature-list` | List all features |
| `pa:feature-complete` | Mark feature complete |

### Workflow Phases
| Command | Action |
|---------|--------|
| `pa:analyze` | Codebase analysis |
| `pa:requirements` | Gather requirements |
| `pa:design` | UI/architecture design |
| `pa:plan` | Create implementation plan |
| `pa:implement` | Execute implementation |
| `pa:test` | Run tests |
| `pa:review` | Code review |
| `pa:doc` | Generate documentation |
| `pa:deploy` | Deployment preparation |

### Testing
| Command | Action |
|---------|--------|
| `pa:test` | Run all tests |
| `pa:test-unit` | Unit tests only |
| `pa:test-e2e` | E2E tests only |
| `pa:test-coverage` | Run with coverage |
| `pa:test-watch` | Watch mode |

### Documentation
| Command | Action |
|---------|--------|
| `pa:doc` | **Create** docs in `./docs/` |
| `pa:doc-api` | **Create** API docs in `./docs/api/` |
| `pa:doc-module X` | **Create** `./docs/modules/X.md` |
| `pa:doc-component` | **Create** component docs |
| `pa:doc-readme` | **Update** `./README.md` |
| `pa:release` | **Create** `./RELEASE_NOTES.md` |
| `pa:changelog` | **Update** `./CHANGELOG.md` |

### Quality & Review
| Command | Action |
|---------|--------|
| `pa:qa` | Full QA checks |
| `pa:qa-security` | Security audit |
| `pa:qa-performance` | Performance check |
| `pa:review` | Code review |
| `pa:lint` | Run linters |

### Debug & Logs
| Command | Action |
|---------|--------|
| `pa:debug` | Start debug session |
| `pa:debug-add` | Add debug logs to code |
| `pa:debug-add "file"` | Add logs to specific file |
| `pa:debug-trace "func"` | Add entry/exit logs to function |
| `pa:debug-var "var"` | Track variable changes |
| `pa:debug-api` | Add API request/response logging |
| `pa:debug-state` | Add state change logging |
| `pa:debug-error` | Add error boundary logging |
| `pa:debug-web` | Web console debugging |
| `pa:debug-rn` | React Native debugging |
| `pa:debug-android` | Android native (logcat) |
| `pa:debug-ios` | iOS native debugging |
| `pa:logs` | View recent logs |
| `pa:logs-filter "term"` | Filter logs by term |
| `pa:debug-clean` | Remove all debug statements |

### Collaboration
| Command | Action |
|---------|--------|
| `pa:activity` | **Show ALL AI platforms activity** (not just yours!) |
| `pa:lock` | Show lock status |
| `pa:handoff` | Create handoff notes |
| `pa:feedback "text"` | Log feedback for AI learning |
| `pa:decision "title"` | Log architectural decision |
| `pa:learn "pattern"` | Teach AI a pattern → `.learning/patterns.json` |
| `pa:forget "pattern"` | Remove learned pattern |
| `pa:learning` | Show learning report (patterns, corrections, stats) |

### Cross-AI Continuity (CRITICAL)
| Command | Action |
|---------|--------|
| `pa:sync` | **Run FIRST** - Load project context |
| `pa:resume` | Quick resume - shows last session + next action |
| `pa:session-start` | Begin new work session |
| `pa:session-end` | Finalize session, update logs |
| `pa:conflict-check` | Check if files modified by other AI |
| `pa:history` | View command history |
| `pa:progress` | View feature progress |
| `pa:changelog` | Update all changelogs |
| `pa:changelog --from-git` | Auto-populate from git commits |
| `pa:changelog-feature X` | View feature changelog |
| `pa:changelog-module X` | View module changelog |
| `pa:error "desc"` | Log error and solution |

### Configuration
| Command | Action |
|---------|--------|
| `pa:config` | Show config |
| `pa:checkpoint` | Pause for approval |
| `pa:skip-checkpoint` | Skip checkpoint |

### History & Progress
| Command | Action |
|---------|--------|
| `pa:history` | Show command history (read activity.log) |
| `pa:progress` | Show feature progress |
| `pa:activity` | **Show ALL AI platforms activity** (cross-AI visibility) |

---

## How to Execute Commands

When user types a `pa:` command:

1. **Read the prompt file** from `./.proagents/prompts/`
2. **Follow the workflow** defined in that prompt
3. **Use project config** from `proagents.config.yaml`

### Prompt File Mapping
| Command | Prompt File |
|---------|-------------|
| `pa:feature` | `./prompts/00-init.md` |
| `pa:analyze` | `./prompts/01-analysis.md` |
| `pa:requirements` | `./prompts/02-requirements.md` |
| `pa:design` | `./prompts/03-ui-design.md` |
| `pa:plan` | `./prompts/04-planning.md` |
| `pa:implement` | `./prompts/05-implementation.md` |
| `pa:test` | `./prompts/06-testing.md` |
| `pa:review` | `./prompts/06.5-code-review.md` |
| `pa:doc` | `./prompts/07-documentation.md` |
| `pa:deploy` | `./prompts/08-deployment.md` |
| `pa:fix` | `./workflow-modes/entry-modes.md` |
| `pa:debug` | `./prompts/10-debug-logs.md` |
| `pa:logs` | `./prompts/10-debug-logs.md` |
| `pa:sync` | `./prompts/11-session-tracking.md` |
| `pa:session-start` | `./prompts/11-session-tracking.md` |
| `pa:session-end` | `./prompts/11-session-tracking.md` |
| `pa:changelog` | `./prompts/11-session-tracking.md` + `./prompts/07-documentation.md` |
| `pa:project-setup` | `./prompts/00-project-setup.md` |
| `pa:setup` | `./prompts/00-project-setup.md` |
| `pa:rnd` | `./prompts/12-rnd.md` |
| `pa:research` | `./prompts/12-rnd.md` |
| `pa:rnd-compare` | `./prompts/12-rnd.md` |
| `pa:rnd-poc` | `./prompts/12-rnd.md` |
| `pa:rnd-explore` | `./prompts/12-rnd.md` |

---

## pa:help Execution

**Show comprehensive help with examples and categories.**

**Command variations:**
```
pa:help                        # Full help with examples
pa:help <command>              # Detailed help for specific command
pa:help --quick                # Quick reference only
pa:help --examples             # Show more examples
```

**Output format:**
```
ProAgents Help
══════════════════════════════════════════════════════════

🚀 Quick Start Examples
───────────────────────
  pa:feature "user authentication"    Start a new feature
  pa:fix "login button not working"   Quick bug fix
  pa:status                           Check current progress
  pa:resume                           Continue where you left off

📋 Common Workflows
───────────────────
  Feature Development:
    pa:feature → pa:analyze → pa:design → pa:implement → pa:test → pa:deploy

  Bug Fix (fast track):
    pa:fix "description" → auto-analyze → fix → test → done

  Returning to Work:
    pa:sync → pa:resume → continue working

📂 Commands by Category
───────────────────────

  Core Commands:
    pa:feature "name"     Start new feature with full workflow
    pa:fix "bug"          Quick bug fix mode
    pa:project-setup      Interactive project setup wizard
    pa:rnd                Research & Development workflow
    pa:status             Show current progress (enhanced)
    pa:help               Show this help

  Workflow Phases:
    pa:analyze            Deep codebase analysis
    pa:requirements       Gather requirements
    pa:design             UI/Architecture design
    pa:plan               Create implementation plan
    pa:implement          Execute implementation
    pa:test               Create and run tests
    pa:review             Code review workflow
    pa:doc                Generate documentation
    pa:deploy             Deployment preparation

  Progress & History:
    pa:progress           Visual progress (all features)
    pa:status             Detailed status (current feature)
    pa:activity           All AI activity with filters
    pa:history            Command history with stats

  Cross-AI Collaboration:
    pa:sync               Load context + visual diff
    pa:resume             Quick resume with next action
    pa:handoff            Create handoff notes
    pa:conflict-check     Check for conflicts

  Learning & Tracking:
    pa:feedback "text"    Log feedback for AI learning
    pa:decision "title"   Log architectural decision
    pa:error "desc"       Log error and solution
    pa:learn "pattern"    Teach AI a pattern
    pa:forget "pattern"   Remove learned pattern
    pa:learning           Show learning report

💡 Tips
───────
  • Use aliases: pa:f (feature), pa:s (status), pa:h (help)
  • AI auto-syncs on every command - no manual sync needed
  • Changes are auto-logged to changelog

Type "pa:help <command>" for detailed help on a specific command.
Example: pa:help feature
```

**For specific command help (pa:help feature):**
```
pa:feature - Start New Feature
══════════════════════════════════════════════════════════

Usage:
  pa:feature "feature name"
  pa:feature "user authentication"

What it does:
  1. Creates feature folder in .proagents/active-features/
  2. Analyzes codebase for relevant files
  3. Guides through full workflow phases
  4. Tracks progress and tasks

Workflow phases:
  Analysis → Requirements → Design → Planning →
  Implementation → Testing → Review → Documentation → Deployment

Options:
  pa:feature "name" --fast      Skip optional phases
  pa:feature "name" --no-tests  Skip test generation

Related commands:
  pa:feature-list       List all features
  pa:feature-complete   Mark feature as complete
  pa:status             Check feature status
```

---

## pa:history Execution

**AI MUST read and display the actual log file content.**

**Command variations:**
```
pa:history                     # All recent history (default)
pa:history --today             # Today's commands only
pa:history --ai Claude         # Filter by AI platform
pa:history --command pa:fix    # Filter by command type
pa:history --search "auth"     # Search in descriptions
pa:history --stats             # Show command statistics
```

**Steps:**
1. Read `./.proagents/activity.log`
2. Filter based on options (if provided)
3. Display entries with grouping and icons
4. NEVER say "no commands yet" without reading the file

```bash
# AI runs this:
grep -v "^#" .proagents/activity.log | grep -v "^$" | grep -v "Activity Log Start" | tail -50
```

**Enhanced output format:**
```
Command History
══════════════════════════════════════════════════════════

Today (12 commands)
───────────────────
[16:00] [Gemini]  ✅ pa:test - 12 tests passed
[15:30] [Cursor]  🐛 pa:fix - Fixed login validation
[15:15] [Claude]  🔍 pa:analyze - Analyzed 45 files
[15:10] [Claude]  ✨ pa:feature - Started "user-auth"

Yesterday (8 commands)
──────────────────────
[18:00] [ChatGPT] 📝 pa:doc - Updated README
[16:30] [Claude]  🔨 pa:implement - Created UserService

──────────────────────────────────────────────────────────
Stats: 20 commands | 4 AIs | Most used: pa:implement (6)
```

**With --stats option:**
```
Command Statistics
══════════════════════════════════════════════════════════

By Command:
  pa:implement   ████████████████  12
  pa:fix         ████████          6
  pa:test        ██████            4
  pa:analyze     ████              3

By AI Platform:
  Claude         ████████████████  14
  Cursor         ████████          7
  Gemini         ████              3
  ChatGPT        ██                1

By Day:
  Today          ████████████████  12
  Yesterday      ████████          8
  Earlier        ████              5
```

---

## pa:progress Execution

**AI MUST read feature status from actual files.**

1. Read `./.proagents/active-features/_index.json`
2. Read each feature's `status.json`
3. Read `./.proagents/activity.log` for last AI info
4. Calculate progress and display enhanced output

```bash
# AI runs this:
cat .proagents/active-features/_index.json
cat .proagents/active-features/feature-*/status.json
cat .proagents/activity.log | tail -50
```

**Output format (enhanced):**
```
Feature Progress
════════════════════════════════════════════════════════════

user-auth       ████████████████░░░░  80%  (8/10 tasks)  3d  Claude
                └─ Analysis ✓ → Requirements ✓ → Design ✓ → Implementation ✓ → Testing ● → Review ○

dashboard       ████████░░░░░░░░░░░░  40%  (4/10 tasks)  5d  Cursor
                └─ Analysis ✓ → Requirements ✓ → Design ● → Implementation ○ → Testing ○ → Review ○

notifications   ██░░░░░░░░░░░░░░░░░░  10%  (1/10 tasks)  1d  ChatGPT
                └─ Analysis ● → Requirements ○ → Design ○ → Implementation ○ → Testing ○ → Review ○

────────────────────────────────────────────────────────────
Summary: 3 active | 5 completed | Avg: 4.2 days/feature
```

**Legend:**
- `✓` = Phase completed
- `●` = Current phase (in progress)
- `○` = Phase not started
- `(8/10 tasks)` = Completed tasks / Total tasks
- `3d` = Days since feature started
- `Claude` = Last AI that worked on this feature

**If no features exist:**
```
Feature Progress
════════════════════════════════════════════════════════════

No active features.

Start one with: pa:feature "feature name"
```

---

## pa:status Execution

**IMPORTANT:** Show REAL data only, never example data.

**Steps:**
1. Read `./.proagents/active-features/_index.json`
2. Read current feature's `status.json`
3. Run: `git status` and `git log --oneline -5`
4. Read `./.proagents/activity.log | tail -20`
5. Display enhanced status

**If no features:**
```
Project Status
══════════════════════════════════════════════════════════

No active features.

Start with:
  → pa:feature "feature name"
  → pa:fix "bug description"
```

**If has features (enhanced output):**
```
Project Status
══════════════════════════════════════════════════════════

Feature: user-auth                          Branch: feature/user-auth
Phase: Implementation (4/6)                 Started: 3d ago
Progress: ████████████░░░░░░░░ 60%          Time: ~4.5h

Tasks: 3/5 completed
  ✓ Create auth service
  ✓ Add login endpoint
  ✓ Add register endpoint
  → Implement JWT tokens (in progress)
  ○ Add password reset

Files: 8 modified (+245, -32)    Tests: 12 ✓ | 2 ✗ | 80% cov
Contributors: Claude (60%), Cursor (40%)

──────────────────────────────────────────────────────────
Next: Complete JWT token implementation
```

**Status indicators:**
- `✓` = Task completed
- `→` = In progress
- `○` = Not started
- `⚠️ BLOCKED:` = Show if blockers exist

**Summary line (for multiple features):**
```
──────────────────────────────────────────────────────────
Summary: 2 active | 1 paused | 5 completed
```

---

## pa:activity Execution

**CRITICAL: Show ALL AI platforms, not just your own!**

The purpose of `pa:activity` is cross-AI visibility. Users need to see what ALL AIs have done.

**Command variations:**
```
pa:activity                    # All recent activity (default)
pa:activity --today            # Today's activity only
pa:activity --ai Claude        # Filter by AI platform
pa:activity --command pa:fix   # Filter by command type
pa:activity --files            # Show files changed per action
```

**Steps:**
1. Run: `cat .proagents/activity.log | tail -50`
2. Display ALL entries (Claude, Cursor, ChatGPT, Gemini, Copilot, etc.)
3. Group by time period (Today, Yesterday, Earlier)
4. Add action icons based on command type
5. Show summary with action count per platform

**Action icons:**
| Command | Icon | Description |
|---------|------|-------------|
| `pa:feature` | ✨ | New feature |
| `pa:fix` | 🐛 | Bug fix |
| `pa:test` | ✅ | Testing |
| `pa:doc` | 📝 | Documentation |
| `pa:implement` | 🔨 | Implementation |
| `pa:analyze` | 🔍 | Analysis |
| `pa:design` | 🎨 | Design |
| `pa:review` | 👀 | Code review |
| `pa:deploy` | 🚀 | Deployment |

**Output format (enhanced):**
```
Recent Activity (All AI Platforms)
══════════════════════════════════════════════════════════

Today (5 actions)
─────────────────
[16:00] [Claude]  ✨ pa:feature - Started user-auth
        └─ 2 files: feature.json, status.json
[15:30] [Cursor]  🐛 pa:fix - Fixed login validation bug
        └─ 1 file: auth.service.ts (+12, -3)
[15:00] [Gemini]  ✅ pa:test - 12 tests passed, 2 failing
[14:30] [Claude]  🔨 pa:implement - Created UserService
        └─ 3 files: user.service.ts, user.controller.ts, user.module.ts
[14:00] [ChatGPT] 🔍 pa:analyze - Analyzed auth module

Yesterday (8 actions)
─────────────────────
[18:00] [Claude]  🎨 pa:design - Created component diagram
[16:30] [Cursor]  📝 pa:doc - Updated API documentation
...

──────────────────────────────────────────────────────────
Summary: 13 actions | 4 AIs active | Last 48h
  Claude: 5 | Cursor: 4 | Gemini: 2 | ChatGPT: 2
```

**IMPORTANT:**
- Show ALL platforms in the log, not just yours
- This enables cross-AI collaboration
- Users switch between AIs and need full visibility
- Group by time for better readability
- Show files changed when available (from changelog)

---

## pa:deploy Execution

**Show interactive deployment checklist with real-time status.**

**Command variations:**
```
pa:deploy                      # Full deployment workflow
pa:deploy-check                # Pre-deployment checklist only
pa:deploy-staging              # Deploy to staging
pa:deploy-prod                 # Deploy to production
```

**Steps:**
1. Read `./.proagents/prompts/08-deployment.md`
2. Run pre-deployment checks (tests, lint, build)
3. Display interactive checklist with real-time status
4. Guide through deployment steps
5. Show post-deployment verification

**Output format (enhanced checklist):**
```
Deployment Checklist
═══════════════════════════════════════════════════════════

📋 Pre-Deployment
─────────────────
  ✓ All tests passing                    12/12 tests
  ✓ No linting errors                    0 errors
  ✓ Build successful                     2.3s
  ✓ No console.log statements            cleaned
  ○ Version bumped                       pending
  ○ Changelog updated                    pending

🔒 Security
───────────
  ✓ No hardcoded secrets                 scanned
  ✓ Dependencies audited                 0 vulnerabilities
  ○ Security review approved             awaiting

📦 Build & Assets
─────────────────
  ✓ Bundle size acceptable               245kb (limit: 300kb)
  ✓ Assets optimized                     images compressed
  ○ Source maps generated                pending

📝 Documentation
────────────────
  ✓ README updated                       current
  ○ API docs updated                     pending
  ○ Release notes prepared               pending

🚀 Ready to Deploy?
───────────────────
Status: 8/14 checks passed

Blockers:
  ⚠️ Version not bumped - run: npm version patch
  ⚠️ Changelog needs update - run: pa:changelog
  ⚠️ Security review pending

Run "pa:deploy --fix" to auto-fix resolvable issues.
```

**During deployment:**
```
Deploying to Staging
═══════════════════════════════════════════════════════════

[1/5] Building application...        ✓ Complete (2.3s)
[2/5] Running migrations...          ✓ Complete (0.5s)
[3/5] Deploying to staging...        ● In progress...
[4/5] Running smoke tests...         ○ Pending
[5/5] Verifying health checks...     ○ Pending

Progress: ██████████░░░░░░░░░░ 50%
```

**Post-deployment verification:**
```
Post-Deployment Verification
═══════════════════════════════════════════════════════════

🏥 Health Checks
────────────────
  ✓ API responding                       200 OK (45ms)
  ✓ Database connected                   healthy
  ✓ Cache working                        redis OK
  ✓ External services                    all reachable

📊 Metrics (last 5 min)
───────────────────────
  Error rate:     0.1%  (baseline: 0.2%)   ✓ OK
  Response time:  120ms (baseline: 150ms)  ✓ OK
  Requests/sec:   450   (baseline: 400)    ✓ OK

🔍 Smoke Tests
──────────────
  ✓ Homepage loads                       200ms
  ✓ Login works                          passed
  ✓ API endpoints responding             12/12 OK
  ✓ Critical flows working               all passed

══════════════════════════════════════════════════════════
✅ Deployment Successful!

Next steps:
  • Monitor metrics for 30 min
  • Check error logs: pa:logs --errors
  • If issues, rollback: pa:rollback
```

**Rollback available:**
```
⚠️ Issues Detected - Rollback Available
═══════════════════════════════════════════════════════════

Problem: Error rate increased to 5% (threshold: 2%)

Options:
  [1] Rollback to previous version (v1.2.3)
  [2] Investigate and fix forward
  [3] Disable feature flag only

Rollback command: pa:rollback --to v1.2.3
```

**Legend:**
- `✓` = Check passed
- `●` = In progress
- `○` = Pending
- `✗` = Failed
- `⚠️` = Warning/Blocker

---

## pa:test Execution

**Run tests with enhanced coverage visualization.**

**Command variations:**
```
pa:test                        # Run all tests with coverage
pa:test-unit                   # Unit tests only
pa:test-e2e                    # E2E tests only
pa:test-watch                  # Watch mode
pa:test "file"                 # Test specific file
```

**Steps:**
1. Read `./.proagents/prompts/06-testing.md`
2. Detect test framework (Jest, Vitest, Mocha, etc.)
3. Run tests with coverage
4. Display enhanced results with visualization
5. Update `.proagents/worklog/_context.md` with test status

**Output format (enhanced):**
```
Test Results
═══════════════════════════════════════════════════════════

Summary: 45 passed | 2 failed | 3 skipped            2.3s

Coverage
────────
Overall:      ████████████████░░░░  78%  (target: 80%)

By Module:
  src/auth/       ████████████████████  95%  ✓
  src/api/        ████████████████░░░░  80%  ✓
  src/services/   ██████████████░░░░░░  72%  ⚠️
  src/utils/      ██████████░░░░░░░░░░  52%  ✗ below target

Failing Tests
─────────────
  ✗ auth.test.ts:45
    └─ login validation: expected true, got false

  ✗ api.test.ts:102
    └─ user endpoint: timeout after 5000ms

Slow Tests (>1s)
────────────────
  ⚠️ e2e/checkout.test.ts          3.2s
  ⚠️ integration/api.test.ts       1.8s

═══════════════════════════════════════════════════════════
Next: Fix failing tests or run "pa:test --update-snapshots"
```

**If all tests pass:**
```
Test Results
═══════════════════════════════════════════════════════════

✅ All 47 tests passed!                              1.8s

Coverage: ████████████████░░░░ 82% (target: 80%) ✓

═══════════════════════════════════════════════════════════
Ready for: pa:review or pa:deploy
```

---

## pa:qa Execution

**Show quality dashboard with all metrics.**

**Command variations:**
```
pa:qa                          # Full quality dashboard
pa:qa-security                 # Security audit only
pa:qa-performance              # Performance check only
pa:qa-lint                     # Lint check only
```

**Steps:**
1. Run linter (ESLint, etc.)
2. Run security scan (npm audit, etc.)
3. Check test coverage
4. Analyze bundle size
5. Check documentation coverage
6. Display unified dashboard

**Output format (quality dashboard):**
```
Code Quality Dashboard
═══════════════════════════════════════════════════════════

Overall Score: ████████████████░░░░ 85% (Good)

🔒 Security
───────────
  Status:         ✓ No vulnerabilities
  Dependencies:   142 packages scanned
  Secrets:        ✓ No hardcoded secrets found
  Last audit:     2 hours ago

📏 Linting
──────────
  Errors:         0 ✓
  Warnings:       3 ⚠️
    └─ unused variable (2), missing return type (1)
  Auto-fixable:   2

🧪 Test Coverage
────────────────
  Coverage:       ████████████████░░░░ 78%
  Target:         80%
  Status:         ⚠️ 2% below target
  Untested:       src/utils/helpers.ts, src/api/legacy.ts

📦 Bundle Size
──────────────
  Current:        245kb
  Limit:          300kb
  Status:         ✓ Within limit
  Largest:        react-dom (42kb), lodash (24kb)

📝 Documentation
────────────────
  Documented:     ████████████░░░░░░░░ 60%
  Missing:        15 functions, 3 components
  README:         ✓ Up to date

🔄 Code Complexity
──────────────────
  Average:        8.2 (Good)
  High (>15):     2 functions
    └─ processPayment() = 18, validateForm() = 16

═══════════════════════════════════════════════════════════
Issues: 3 warnings | Suggestions: Run "pa:qa --fix" for auto-fixes
```

---

## pa:review Execution

**Show code review checklist for current changes.**

**Command variations:**
```
pa:review                      # Review current changes
pa:review --staged             # Review staged files only
pa:review --pr                 # PR review mode
```

**Steps:**
1. Read `./.proagents/prompts/06.5-code-review.md`
2. Get list of changed files (git diff)
3. Analyze code for common issues
4. Display interactive checklist
5. Highlight issues that need attention

**Output format (review checklist):**
```
Code Review Checklist
═══════════════════════════════════════════════════════════

Files Changed: 8 (+342, -89)
──────────────────────────────

📋 Code Quality
───────────────
  ✓ No console.log statements           cleaned
  ✓ No debugger statements              cleaned
  ✓ No commented-out code               cleaned
  ✓ No TODO without issue number        checked
  ⚠️ Complex function detected           see below

🔒 Security
───────────
  ✓ No hardcoded credentials            scanned
  ✓ Input validation present            checked
  ✓ No SQL injection risks              analyzed
  ○ Auth checks on new endpoints        needs review

🧪 Testing
──────────
  ✓ Tests added for new functions       4 new tests
  ⚠️ Test coverage decreased            -3% (78% → 75%)
  ○ Edge cases covered                  needs review

📝 Documentation
────────────────
  ✓ JSDoc on public functions           present
  ○ README update needed                new feature
  ○ API docs update needed              new endpoint

🎨 Style & Conventions
──────────────────────
  ✓ Follows naming conventions          checked
  ✓ Consistent formatting               prettier OK
  ✓ Import order correct                sorted

⚠️ Attention Required
─────────────────────
  src/services/payment.ts:45
    └─ Cyclomatic complexity: 18 (max: 15)
    └─ Consider breaking into smaller functions

  src/api/users.ts:102
    └─ Missing error handling for async call

═══════════════════════════════════════════════════════════
Status: 12/16 checks passed | 2 warnings | 2 need review

Ready to commit? Address warnings first or run "pa:review --approve"
```

---

## pa:fix Execution

**Fix bugs with before/after diff and affected tests.**

**Steps:**
1. Read `./.proagents/workflow-modes/entry-modes.md`
2. Load context and recent changes
3. Analyze the bug description
4. Find and fix the issue
5. Show before/after diff
6. Identify affected tests
7. Run affected tests
8. Update changelogs

**Output format (bug fix summary):**
```
Bug Fix Summary
═══════════════════════════════════════════════════════════

🐛 Issue: Login validation not checking email format

📁 File: src/auth/login.ts

📝 Changes
──────────
Line 45:
  Before: if (email) {
  After:  if (email && email.includes('@')) {

Line 52:
  Before: return { success: true }
  After:  return { success: true, validated: true }

Diff: +3 lines, -1 line

🧪 Affected Tests
─────────────────
  → auth.test.ts (3 tests affected)
  → validation.test.ts (2 tests affected)

Running affected tests...
  ✓ auth.test.ts                 5/5 passed
  ✓ validation.test.ts           4/4 passed

📋 Related
──────────
  Issue: #123 (if detected from description)
  Similar fixes: login.ts (2 weeks ago)

═══════════════════════════════════════════════════════════
✅ Fix applied and verified!

Changelog updated: .proagents/changelog/_recent.md
Next: pa:test (full suite) or pa:commit
```

**If fix causes test failures:**
```
Bug Fix Summary
═══════════════════════════════════════════════════════════

🐛 Issue: Login validation not checking email format

📁 File: src/auth/login.ts
...

🧪 Affected Tests
─────────────────
  ✗ auth.test.ts                 3/5 passed, 2 failed
    └─ test "allows empty email" now fails (expected behavior?)
    └─ test "validates email" now fails (needs update)

⚠️ Fix applied but tests failing!

Options:
  [1] Update tests to match new behavior
  [2] Revert fix and investigate
  [3] Keep fix, mark tests as TODO

Run "pa:fix --update-tests" to auto-update test expectations
```

---

## pa:standup Execution

**Generate daily standup summary automatically.**

**Command variations:**
```
pa:standup                     # Today's standup
pa:standup --yesterday         # What was done yesterday
pa:standup --week              # Weekly summary
pa:standup --team              # All AI activity (team view)
```

**Steps:**
1. Read `.proagents/activity.log` for recent activity
2. Read `.proagents/changelog/_recent.md` for changes
3. Read current feature status from `active-features/`
4. Identify blockers from context
5. Generate formatted standup

**Output format:**
```
Daily Standup - March 13, 2026
═══════════════════════════════════════════════════════════

👤 Your Session (Claude)
────────────────────────

✅ Yesterday / Last Session:
  • Completed JWT token implementation
  • Fixed 2 login validation bugs (#123, #124)
  • Added 8 unit tests for auth module
  • Updated API documentation

📋 Today / Current:
  • Password reset feature (in progress - 40%)
    └─ Next: Email template integration
  • API rate limiting implementation
  • Review PR #45 (user dashboard)

🚧 Blockers:
  • None currently

📊 Stats:
  Files changed: 12 | Tests: +8 | Coverage: 78% → 82%

──────────────────────────────────────────────────────────

👥 Team Activity (All AIs) - Last 24h
─────────────────────────────────────
  Claude:   5 tasks  │ auth module, API docs
  Cursor:   3 tasks  │ UI components, styling
  Gemini:   2 tasks  │ database optimization

═══════════════════════════════════════════════════════════
Active Features: user-auth (80%), dashboard (40%)
```

**Weekly summary (pa:standup --week):**
```
Weekly Summary - Week of March 10, 2026
═══════════════════════════════════════════════════════════

📈 Progress
───────────
  Features completed:    2
  Features in progress:  3
  Bugs fixed:           8
  Tests added:          24

📊 By AI Platform
─────────────────
  Claude    ████████████████░░░░  45%  (18 tasks)
  Cursor    ████████████░░░░░░░░  32%  (13 tasks)
  Gemini    ████████░░░░░░░░░░░░  23%  (9 tasks)

✅ Completed
────────────
  • User authentication feature
  • Dashboard redesign
  • 8 bug fixes

🚀 Shipped
──────────
  • v1.2.0 deployed to production (March 12)

📋 Next Week
────────────
  • Password reset feature
  • Payment integration
  • Performance optimization

═══════════════════════════════════════════════════════════
Total: 40 tasks | 156 files changed | Coverage: 75% → 82%
```

---

## Self-Learning System

**ProAgents learns from user interactions. AI MUST read and write learning data.**

### Learning Data Location

```
.proagents/.learning/
├── global/                      # Cross-project preferences
│   ├── user-preferences.json    # Checkpoint & workflow preferences
│   └── common-patterns.json     # Common code patterns
│
└── projects/                    # Per-project learnings
    └── {project-id}/
        ├── patterns.json        # Project-specific code patterns
        ├── corrections.json     # User corrections to AI output
        ├── metrics.json         # Performance metrics
        └── feedback.json        # User feedback
```

### On Session Start - Load Learning Data

**AI MUST read learning data at start of session:**

```bash
# Load user preferences
cat .proagents/.learning/global/user-preferences.json 2>/dev/null

# Load project patterns
cat .proagents/.learning/projects/*/patterns.json 2>/dev/null

# Load past corrections (DON'T REPEAT THESE MISTAKES!)
cat .proagents/.learning/projects/*/corrections.json 2>/dev/null
```

### Apply Learned Patterns

**Before generating code, check learned patterns:**

```json
// From user-preferences.json
{
  "code_preferences": {
    "naming_style": { "components": "PascalCase" },
    "patterns": { "state_management": "zustand" }
  }
}
```

**AI should say:**
```
"I see this project uses PascalCase for components and Zustand for state.
 I'll follow those patterns."
```

### When to Write Learning Data

**1. User Corrects AI Output**

When user modifies AI-generated code, log to `corrections.json`:

```json
{
  "corrections": [
    {
      "timestamp": "2024-03-13T10:30:00Z",
      "ai": "Claude",
      "type": "naming",
      "original": "getData",
      "corrected": "fetchUserData",
      "context": "User prefers descriptive function names",
      "occurrences": 1
    }
  ]
}
```

**2. User Skips/Reviews Checkpoints**

Track checkpoint preferences in `user-preferences.json`:

```json
{
  "checkpoint_preferences": {
    "usually_skips": ["after_requirements"],
    "always_reviews": ["before_deployment"]
  }
}
```

**3. User Provides Explicit Feedback**

When user says "that's wrong" or corrects approach, log to `feedback.json`:

```json
{
  "feedback": [
    {
      "timestamp": "2024-03-13T10:30:00Z",
      "type": "correction",
      "context": "API call pattern",
      "feedback": "Always use try-catch for API calls",
      "applied": true
    }
  ]
}
```

### pa:learn Command

**User can explicitly teach AI a pattern:**

```
pa:learn "Always use async/await instead of .then()"
pa:learn "Components go in src/components/, not src/ui/"
pa:learn "Use date-fns, not moment.js"
```

**AI logs to patterns.json:**
```json
{
  "learned_patterns": [
    {
      "timestamp": "2024-03-13T10:30:00Z",
      "pattern": "Always use async/await instead of .then()",
      "source": "explicit",
      "confidence": 1.0
    }
  ]
}
```

### pa:forget Command

**User can remove a learned pattern:**

```
pa:forget "Use moment.js for dates"
```

**AI removes from patterns.json and confirms.**

### Auto-Apply Rules

| Correction Count | Action |
|------------------|--------|
| 1-2 times | Remember but don't auto-apply |
| 3-4 times | Warn: "Should I always do this?" |
| 5+ times | Auto-apply without asking |

### Example: Learning in Action

**Session 1:**
```
User: Fix the login function
AI: [generates code with getData()]
User: [changes getData() to fetchUserData()]
AI: [logs correction to corrections.json]
```

**Session 2 (same or different AI):**
```
AI: [reads corrections.json]
AI: "I see you prefer descriptive names like fetchUserData.
     I'll use that pattern."
AI: [generates code with fetchUserData()]
```

### Learning Report (pa:learning)

```
pa:learning
```

**Output:**
```
Learning Report
═══════════════════════════════════════════════════════════

📊 Summary
──────────
  Patterns learned:     12
  Corrections logged:   8
  Auto-apply rules:     3

🎯 Top Patterns
───────────────
  • Naming: Use descriptive function names (5 corrections)
  • State: Use Zustand for state management
  • API: Always use try-catch for API calls
  • Testing: Use describe/it pattern for tests

⚠️ Recent Corrections
─────────────────────
  • getData → fetchUserData (3 times)
  • Component → src/components/ not src/ui/

✅ Auto-Apply Rules (5+ corrections)
────────────────────────────────────
  • Use PascalCase for components
  • Use camelCase for functions
  • Add error handling to API calls

═══════════════════════════════════════════════════════════
```

### CRITICAL: Don't Repeat Mistakes

**Before generating code, AI MUST check:**

1. `corrections.json` - Don't make same mistakes
2. `feedback.json` - Follow user feedback
3. `patterns.json` - Use learned patterns

**Example check:**
```bash
# Check if similar code was corrected before
grep -i "getData" .proagents/.learning/projects/*/corrections.json
```

If found, apply the correction pattern automatically.

---

## Detailed Documentation

For detailed instructions, read these files:

| Topic | File |
|-------|------|
| Command details | `./.proagents/docs/command-details.md` |
| Workflow guide | `./.proagents/WORKFLOW.md` |
| Testing config | `./.proagents/docs/testing.md` |
| Quick reference | `./.proagents/PROAGENTS.md` |

Or ask user: "Should I read the detailed docs for [topic]?"

---

## Key Files

| File | Purpose |
|------|---------|
| `context.md` | Persistent project context |
| `activity.log` | Recent AI activity |
| `feedback.md` | Past corrections (learn from these!) |
| `watchlist.yaml` | Files requiring confirmation |
| `proagents.config.yaml` | Project config |
| `active-features/_index.json` | Feature status |
| `.learning/global/user-preferences.json` | User workflow preferences |
| `.learning/projects/*/patterns.json` | Learned code patterns |
| `.learning/projects/*/corrections.json` | Past corrections (DON'T REPEAT!) |

---

## Important

- Always check `./.proagents/` folder for project-specific configurations
- Preserve user's `proagents.config.yaml` settings
- Follow existing code patterns found in the project
- Log all activity for other AIs to see
- Learn from feedback.md - don't repeat past mistakes
