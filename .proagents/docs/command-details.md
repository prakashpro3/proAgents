# ProAgents Command Details

Detailed execution instructions for all `pa:` commands.

---

## CRITICAL: AI Must Execute All Commands

**NEVER tell user to do something. AI must DO it.**

### Commands That READ Data - AI Must Run:

| Command | AI Runs This |
|---------|--------------|
| `pa:history` | `grep -v "^#" .proagents/activity.log \| tail -30` |
| `pa:progress` | `cat .proagents/active-features/_index.json` |
| `pa:activity` | `cat .proagents/activity.log \| tail -20` |
| `pa:status` | `cat .proagents/active-features/_index.json` |
| `pa:context` | `cat .proagents/context.md` |
| `pa:decisions` | `cat .proagents/decisions.md` |
| `pa:errors` | `cat .proagents/errors.md` |
| `pa:feedback` | `cat .proagents/feedback.md` |
| `pa:handoff-read` | `cat .proagents/handoff.md` |
| `pa:config` | `cat proagents.config.yaml` |
| `pa:lock` | `cat .proagents/.lock 2>/dev/null` |
| `pa:feature-list` | `cat .proagents/active-features/_index.json` |
| `pa:todo` | `grep -rn "TODO\|FIXME" src/` |
| `pa:deps` | `cat package.json \| grep dependencies -A 50` |
| `pa:deps-outdated` | `npm outdated 2>/dev/null` |

### Commands That RUN Tools - AI Must Execute:

| Command | AI Runs This |
|---------|--------------|
| `pa:test` | `npm test` (or from config) |
| `pa:test-unit` | `npm run test:unit` |
| `pa:test-e2e` | `npm run test:e2e` |
| `pa:test-mobile` | Install Maestro if missing → Create tests → Run `maestro test` |
| `pa:lint` | `npm run lint` |
| `pa:qa` | `npm run lint && npm test` |
| `pa:coverage` | `npm run test:coverage` |
| `pa:logs` | `adb logcat -d '*:S' ReactNativeJS:V \| tail -100` |
| `pa:env-check` | `node -v && npm -v && git --version` |
| `pa:secrets-scan` | `grep -rn "password\|secret\|api_key" src/` |
| `pa:db-migrate` | `npm run db:migrate` (or from config) |

### Commands That GENERATE Files - AI Must Create:

**AI MUST create actual files, never just show templates or options.**

| Command | AI Creates | Location |
|---------|------------|----------|
| `pa:doc` | Full documentation | `./docs/*.md` |
| `pa:doc-api` | API documentation | `./docs/api/*.md` |
| `pa:doc-module X` | Module documentation | `./docs/modules/X.md` |
| `pa:doc-file X` | File documentation | `./docs/files/X.md` |
| `pa:changelog` | Updates changelog | `./CHANGELOG.md` |
| `pa:release` | Release notes | `./RELEASE_NOTES.md` |
| `pa:readme` | Updates README | `./README.md` |
| `pa:handoff` | Handoff notes | `.proagents/handoff.md` |
| `pa:generate-component` | Component file | Based on project structure |
| `pa:generate-test` | Test file | Based on project structure |

**Example - pa:doc execution:**
```bash
# AI creates directory structure
mkdir -p docs docs/api docs/modules docs/components

# AI analyzes code and creates doc files
# (AI writes actual content to each file)

# AI reports:
echo "Created: ./docs/README.md"
echo "Created: ./docs/api/endpoints.md"
echo "Total: 8 documentation files"
```

### Commands That LOG Activity - AI Must Append:

After EVERY pa: command, AI runs:
```bash
echo "[$(date '+%Y-%m-%d %H:%M')] [AI_NAME] [COMMAND] Result" >> .proagents/activity.log
```

---

## Feature Commands

### pa:feature "name"

Start a new feature workflow:

1. Create feature folder: `./.proagents/active-features/feature-[name]/`
2. Create `status.json`:
   ```json
   {
     "name": "feature-name",
     "started": "2024-03-06T15:00:00Z",
     "phase": "analysis",
     "progress": 0,
     "branch": "feature/feature-name"
   }
   ```
3. Update `_index.json` to add feature to `active_features`
4. Create git branch if git enabled
5. Start analysis phase

### pa:feature-list

**AI reads and displays features:**

```bash
# AI executes:
cat .proagents/active-features/_index.json 2>/dev/null
ls .proagents/active-features/feature-*/status.json 2>/dev/null | while read f; do cat "$f"; done
```

Then formats:
```
Features
════════
Active (2):
  🔄 user-auth - implementation (60%)
  🔍 dashboard - analysis (20%)

Paused (1):
  ⏸ notifications - blocked on API

Completed (3):
  ✅ login-page, signup-form, forgot-password
```

### pa:feature-complete

1. Move feature from `active_features` to `completed_features` in `_index.json`
2. Update feature's `status.json` with completion timestamp
3. Generate changelog entry
4. Suggest PR creation if git enabled

### pa:fix "description"

Quick bug fix mode (bypasses full workflow):

1. Analyze the bug description
2. Search codebase for relevant code
3. Implement fix directly
4. Run relevant tests
5. Log fix in activity.log

---

## Workflow Phase Commands

### pa:analyze

1. Read `./.proagents/prompts/01-analysis.md`
2. Scan project structure
3. Identify:
   - Framework/tech stack
   - Code patterns
   - Dependencies
   - Architecture style
4. Cache results in `./.proagents/cache/`
5. Output analysis summary

### pa:requirements

1. Read `./.proagents/prompts/02-requirements.md`
2. If feature specified, focus on that feature
3. Document:
   - Functional requirements
   - Non-functional requirements
   - Acceptance criteria
4. Save to feature folder

### pa:design

1. Read `./.proagents/prompts/03-ui-design.md`
2. Create:
   - UI mockups/wireframes (if applicable)
   - Component structure
   - Architecture decisions
3. Document design decisions

### pa:plan

1. Read `./.proagents/prompts/04-planning.md`
2. Create implementation plan:
   - Files to create/modify
   - Order of implementation
   - Dependencies between tasks
   - Estimated complexity
3. Save plan to feature folder

### pa:implement

1. Read `./.proagents/prompts/05-implementation.md`
2. Follow the plan created in planning phase
3. Write code following project patterns
4. Create/update tests as you go
5. Update progress in status.json

### pa:test-mobile

**AI sets up and runs mobile E2E tests:**

1. Check if Maestro/Detox installed:
   ```bash
   maestro --version 2>/dev/null || echo "Not installed"
   ```

2. If NOT installed - INSTALL IT:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

3. If no test flows exist - CREATE THEM:
   ```bash
   mkdir -p .maestro
   # AI creates test flows based on the feature being tested
   ```

4. RUN the tests:
   ```bash
   maestro test .maestro/
   ```

5. Report results

**WRONG:** "E2E not configured, test manually..."
**CORRECT:** "Installing Maestro... Creating tests... Running..."

---

### pa:test

**AI runs tests and shows results:**

```bash
# AI executes (check config first):
npm test 2>&1
# OR from proagents.config.yaml testing.tools.unit.command
```

Then reports:
```
Test Results
════════════
✓ 45 passed
✗ 2 failed
○ 3 skipped

Failed:
• src/auth/login.test.ts:23 - Expected true, got false
• src/api/user.test.ts:45 - Timeout after 5000ms
```

**NEVER say "run npm test" - actually run it!**

### pa:review

1. Read `./.proagents/prompts/06.5-code-review.md`
2. Review all changes in current feature
3. Check:
   - Code quality
   - Test coverage
   - Security issues
   - Performance concerns
4. Generate review report

### pa:doc

**AI MUST create actual documentation files, not just show options.**

1. Read `./.proagents/prompts/07-documentation.md`
2. Analyze codebase structure
3. **CREATE** documentation files:

```bash
# AI runs:
mkdir -p docs docs/api docs/modules docs/components

# Then AI CREATES these files:
# - ./docs/README.md (project overview)
# - ./docs/api/*.md (API documentation)
# - ./docs/modules/*.md (module docs)
# - ./docs/components/*.md (component docs)
```

4. Sub-commands:
   - `pa:doc-api` → Creates `./docs/api/*.md`
   - `pa:doc-module auth` → Creates `./docs/modules/auth.md`
   - `pa:doc-file src/api.ts` → Creates doc for that file
   - `pa:doc-readme` → Updates `./README.md`
   - `pa:changelog` → Updates `./CHANGELOG.md`
   - `pa:release` → Creates `./RELEASE_NOTES.md`

5. **Output:**
```
Documentation generated:
✓ ./docs/README.md
✓ ./docs/api/endpoints.md
✓ ./docs/modules/auth.md
...
Total: 12 files created
```

### pa:deploy

1. Read `./.proagents/prompts/08-deployment.md`
2. Run pre-deployment checks
3. Create deployment checklist
4. Generate release notes if needed

---

## Documentation Commands

### pa:release

Generate release notes:

1. Read recent commits/changes
2. Categorize changes (features, fixes, breaking)
3. Generate formatted release notes
4. Save to `./RELEASE_NOTES.md`

### pa:changelog

**AI updates ALL changelog files for cross-AI continuity.**

1. Update `./CHANGELOG.md` (public changelog)
2. Prepend to `.proagents/changelog/_recent.md` (last 10 changes)
3. Update feature changelog if working on a feature
4. Update module changelog based on files modified

```bash
# AI workflow:
# 1. Identify what changed
# 2. Determine feature/module from context

# 3. Update root changelog
# Edit ./CHANGELOG.md

# 4. Prepend to recent changes
# Edit .proagents/changelog/_recent.md

# 5. Update feature changelog (if applicable)
# Edit .proagents/changelog/features/[feature-name].md

# 6. Update module changelog (auto-detect from paths)
# Edit .proagents/changelog/modules/[module].md
```

### pa:changelog-feature [name]

View/update specific feature changelog:
```bash
cat .proagents/changelog/features/[name].md
```

### pa:changelog-module [name]

View/update specific module changelog:
```bash
cat .proagents/changelog/modules/[name].md
```

---

## Cross-AI Continuity Commands

### pa:sync

**Run FIRST when starting work on any AI platform.**

AI reads context files to understand current state:

```bash
# AI executes:
cat .proagents/worklog/_context.md
cat .proagents/changelog/_recent.md
ls -t .proagents/worklog/*.md | head -3 | xargs cat
cat .proagents/active-features/_index.json
tail -20 .proagents/activity.log
```

Then reports:
```
Project Context Loaded!

Active Work:
- Feature: user-auth (70% complete)
- Last: JWT validation added by Claude

Recent Changes:
1. Added login validation (Claude, Mar 11)
2. Fixed API endpoint (Gemini, Mar 10)

Pending:
- [ ] Complete email verification
- [ ] Add unit tests

Ready to continue. What would you like to work on?
```

### pa:session-start

Begin a new work session:

```bash
# AI creates session log
DATE=$(date '+%Y-%m-%d')
# Creates: .proagents/worklog/YYYY-MM-DD-[ai]-001.md
```

### pa:session-end

Finalize session and update all tracking:

```bash
# AI updates:
# 1. Session log with summary and next steps
# 2. .proagents/worklog/_context.md
# 3. .proagents/changelog/_recent.md
# 4. Feature/module changelogs
# 5. activity.log
```

Output:
```
Session Complete!
- Duration: 45 min
- Tasks: 3 completed
- Files: 5 modified

Updated:
✓ worklog/_context.md
✓ worklog/2024-03-11-claude-001.md
✓ changelog/features/user-auth.md
✓ changelog/_recent.md
✓ activity.log

Next AI can continue from: [next steps listed]
```

### pa:resume

**Quick resume for returning AI - loads context and shows next action.**

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
Last Session: 2024-03-11 by Claude (opus-4)
Duration: 45 min

What Was Done:
- Added JWT validation
- Fixed login bug
- Updated API docs

Pending Tasks:
1. [ ] Complete email verification
2. [ ] Add unit tests for auth

Files Recently Modified:
- src/auth/login.ts (2 hours ago)
- src/auth/validate.ts (2 hours ago)

Suggested Next Action:
→ Continue with "Complete email verification"

Ready to proceed?
```

### pa:conflict-check

**Check if files you're about to modify were changed by another AI.**

AI runs before editing any file:

```bash
# Check recent changes to files
cat .proagents/changelog/_recent.md | grep -A2 "Files:"
cat .proagents/worklog/_context.md | grep -A5 "Recent Changes"
```

Output if conflict detected:
```
⚠️ CONFLICT WARNING
═══════════════════
File: src/auth/login.ts
Last modified: 2 hours ago by Gemini (1.5-pro)
Changes: Added email validation

Options:
1. Review changes first (recommended)
2. Proceed with caution
3. Coordinate with previous AI's work

Your action?
```

### Validation Reminder

**AI checks if previous session logged changes properly.**

On `pa:sync`, AI also checks:

```bash
# Compare git changes vs changelog entries
git diff --name-only HEAD~3 > /tmp/git_changes.txt
grep -o "src/[^ ]*" .proagents/changelog/_recent.md > /tmp/logged_changes.txt

# If git has changes not in changelog:
echo "⚠️ Warning: Some changes may not be logged"
```

Output if missing logs:
```
⚠️ LOGGING VALIDATION
═════════════════════
Git shows 5 files changed since last session.
Changelog shows 2 files logged.

Missing from changelog:
- src/utils/helpers.ts
- src/api/endpoints.ts
- tests/auth.test.ts

Previous AI may have forgotten to log. Consider adding entries.
```

---

## Issue/Fix Linking

**Link changes to issue numbers in changelogs.**

Format for _recent.md:
```markdown
### YYYY-MM-DD - Bug Fix
**Issue:** #123
**Module:** auth
**AI:** Claude (opus-4)
**Files:** src/auth/login.ts (+5, -2)
**Summary:** Fixed null check in email validation
**Closes:** #123

---
```

AI auto-detects issue numbers from:
- User message: "fix issue #123" or "closes #456"
- Branch name: `fix/123-login-bug`
- Commit message: `Fixes #123`

---

## File-Level Lock Tracking

**Track which files each AI is actively editing.**

When AI starts editing a file:

```bash
# Add to .proagents/.active-files
echo "src/auth/login.ts|Claude|opus-4|$(date -Iseconds)" >> .proagents/.active-files
```

Before editing any file, AI checks:
```bash
grep "src/auth/login.ts" .proagents/.active-files
```

If file is locked by another AI:
```
⚠️ FILE IN USE
══════════════
File: src/auth/login.ts
Locked by: Gemini (1.5-pro)
Since: 10 minutes ago

Options:
1. Wait and retry
2. Edit different file
3. Force proceed (may cause conflicts)
```

On session end, AI clears its file locks:
```bash
grep -v "|Claude|" .proagents/.active-files > /tmp/active && mv /tmp/active .proagents/.active-files
```

---

## Git Commit Integration

**Auto-populate changelog from git commits.**

### pa:changelog --from-git

AI parses recent commits and updates changelog:

```bash
# Get recent commits
git log --oneline --since="24 hours ago" --format="%h|%s|%an"
```

For each commit, AI:
1. Extracts files changed: `git show --name-only HASH`
2. Detects module from file paths
3. Extracts issue numbers from message
4. Prepends to `_recent.md`

Example auto-generated entry:
```markdown
### 2024-03-11 - Commit abc123
**Module:** auth (auto-detected)
**Author:** Developer
**Files:** src/auth/login.ts, src/auth/validate.ts
**Summary:** Add JWT token validation
**Commit:** abc123
**Issues:** #123, #124

---
```

---

## Quality Commands

### pa:qa

**AI runs ALL checks and reports:**

```bash
# AI executes each:
npm run lint 2>&1
npm test 2>&1
npm run test:coverage 2>&1
npm audit 2>&1
```

Then reports:
```
QA Report
═════════
Lint: ✓ No issues
Tests: ✓ 45/45 passed
Coverage: 82% (target: 80%) ✓
Security: 0 vulnerabilities ✓

Overall: PASSED
```

**NEVER say "run these commands" - run them!**

### pa:qa-security

Security-focused audit:

1. Check for common vulnerabilities (OWASP)
2. Scan dependencies for known issues
3. Review auth/permissions code
4. Generate security report

### pa:lint

**AI runs linter and shows results:**

```bash
# AI executes:
npm run lint 2>&1
# If errors, auto-fix:
npm run lint -- --fix 2>&1
```

Then reports:
```
Lint Results
════════════
✓ 120 files checked
✗ 3 errors found
⚠ 5 warnings

Auto-fixed: 2 errors
Remaining: 1 error in src/utils/helper.ts:45

Fixing remaining issue...
[AI edits the file to fix]
```

**NEVER say "run npm run lint" - run it!**

---

## Collaboration Commands

### pa:handoff

**AI creates handoff file:**

```bash
# AI creates .proagents/handoff.md with content
```

### pa:handoff-read

**AI reads and displays handoff:**

```bash
# AI executes:
cat .proagents/handoff.md 2>/dev/null || echo "No handoff notes"
```

Then displays the content to continue where previous AI left off.

### pa:handoff (write)

Create handoff notes for other AIs:

1. Summarize current work status
2. List completed items
3. List in-progress items
4. Document blockers
5. Save to `./.proagents/handoff.md`

### pa:feedback "description"

Log feedback for AI learning:

1. Append to `./.proagents/feedback.md`:
   ```markdown
   ## [DATE] Feedback
   **Type:** correction/preference/pattern
   **Description:** [user's feedback]
   **Action:** [what should be done differently]
   ```
2. Apply learning to current work

### pa:decisions

**AI reads and displays all decisions:**

```bash
# AI executes:
cat .proagents/decisions.md 2>/dev/null || echo "No decisions logged"
```

### pa:errors

**AI reads and displays error history:**

```bash
# AI executes:
cat .proagents/errors.md 2>/dev/null || echo "No errors logged"
```

### pa:context

**AI reads project context:**

```bash
# AI executes:
cat .proagents/context.md 2>/dev/null
```

This should be read at START of every session!

### pa:feedback

**AI reads feedback/corrections:**

```bash
# AI executes:
cat .proagents/feedback.md 2>/dev/null || echo "No feedback"
```

Learn from these to avoid repeating mistakes!

### pa:decision "title"

Log architectural decision:

1. Create ADR in `./.proagents/adr/`
2. Document:
   - Context
   - Decision
   - Consequences
3. Reference in current feature

### pa:activity

**AI runs and displays:**

```bash
# AI executes:
cat .proagents/activity.log | grep -v "^#" | tail -20
```

Then formats output:
```
Recent Activity
═══════════════
[2024-03-06 16:00] [Gemini] pa:test - 12 tests passed
[2024-03-06 15:45] [Claude] pa:implement - Created UserService
```

---

## Configuration Commands

### pa:config

**AI reads and displays config:**

```bash
# AI executes:
cat proagents.config.yaml
```

Then formats:
```
ProAgents Configuration
═══════════════════════
Project: my-app (nextjs)

Platforms: claude, cursor, copilot

Testing:
  Framework: vitest
  Coverage: 80%

Git:
  Enabled: true
  Branch prefix: feature/
```

### pa:checkpoint

Pause for user approval:

1. Summarize completed work
2. Show next steps
3. Wait for user confirmation
4. Log checkpoint in activity

### pa:skip-checkpoint

Skip the current checkpoint and continue.

---

## History & Progress Commands

### pa:history

**AI MUST read the actual activity.log file and display contents.**

1. Run: `cat .proagents/activity.log | tail -30`
2. Parse and format entries
3. Display most recent first
4. NEVER say "no commands yet" without reading the file first

**Wrong behavior:**
```
"No commands recorded yet"  ← Without reading file!
```

**Correct behavior:**
```
Reading .proagents/activity.log...

Command History
═══════════════
[2024-03-06 16:00] [Gemini] pa:logs - Captured 50 entries
[2024-03-06 15:30] [Cursor] pa:test - 12 tests passed
```

### pa:progress

**AI MUST read feature status files and calculate progress.**

1. Run: `cat .proagents/active-features/_index.json`
2. Read each feature's status.json
3. Calculate progress percentage
4. Show visual progress bar

### pa:activity

**AI MUST read and display activity.log:**

1. Run: `cat .proagents/activity.log | tail -20`
2. Show recent AI activity
3. Highlight actions by different AI platforms

---

## Session Commands

### pa:session-end

Generate session summary:

1. List all changes made
2. List files modified
3. List commands executed
4. Document any issues
5. Save to session history

### pa:lock

**AI reads and displays lock status:**

```bash
# AI executes:
cat .proagents/.lock 2>/dev/null || echo "No lock file"
```

Then reports:
```
Lock Status
═══════════
Locked by: Claude (opus-4)
Task: pa:feature user-auth
Started: 2024-03-06 15:00
Expires: 2024-03-06 17:00

Or if no lock:
No active lock. Safe to proceed.
```

### pa:lock-release

Release lock if you hold it:

1. Verify you hold the lock
2. Delete `./.proagents/.lock`
3. Log release in activity

---

## Debug & Log Commands

**CRITICAL: AI must RUN log commands itself, never tell user to "check the logs".**

### pa:debug

Start a debug session:

1. Detect project platform (Web, React Native, Android, iOS)
2. Identify the issue from user description
3. **RUN log capture commands:**
   - React Native: `adb logcat -d *:S ReactNativeJS:V | tail -200`
   - Android: `adb logcat -d -s AppTag:D | tail -200`
   - iOS: `xcrun simctl spawn booted log show --last 5m`
4. **ANALYZE** the captured output
5. **REPORT** findings and implement fix

### pa:debug-add

Add debug logs throughout code:

1. Detect platform (Web/RN/Android/iOS)
2. Analyze code structure
3. Add appropriate logging:
   - Function entry/exit with params
   - Variable state changes
   - API calls and responses
   - Error conditions
4. Mark all logs with `// DEBUG:START` and `// DEBUG:END`
5. Use platform-appropriate syntax:
   - JS/TS: `console.log('[DEBUG]', ...)`
   - Android: `Log.d("DEBUG", ...)`
   - iOS: `print("[DEBUG]", ...)`

### pa:debug-trace "function"

Add detailed tracing to specific function:

1. Find function in codebase
2. Add entry log with all parameters
3. Add timing measurement
4. Add exit log with return value
5. Wrap in try-catch with error logging

### pa:debug-var "variable"

Track all changes to a variable:

1. Find variable declaration
2. Add change tracking (willSet/didSet, proxy, setter)
3. Log old value → new value
4. Include stack trace for debugging

### pa:debug-api

Add API request/response logging:

1. Find all API/fetch calls
2. Add request logging (method, url, body)
3. Add response logging (status, data, timing)
4. Add error logging with full details

### pa:debug-state

Add state change logging:

1. Find state management code
2. Add logging for state changes:
   - React: useState, useReducer, Redux, Zustand
   - Android: ViewModel, LiveData, StateFlow
   - iOS: @State, @Published, ObservableObject
3. Log before/after values

### pa:debug-error

Add comprehensive error logging:

1. Wrap risky code in try-catch
2. Add error boundaries (React)
3. Log error message, stack, context
4. Add breadcrumb trail

### pa:debug-web

Web/browser debugging:

1. Check browser console for errors
2. Inspect network requests
3. Review console.log statements
4. Check for debugger statements
5. Analyze stack traces

### pa:debug-rn

React Native debugging:

1. Check Metro bundler logs
2. Use Flipper or Reactotron
3. View device logs via ADB (Android) or Console.app (iOS)
4. Check `__DEV__` conditional logs
5. Analyze red screen errors

### pa:debug-android

Android native debugging:

1. Run `adb logcat` with appropriate filters
2. Filter by tag: `adb logcat -s MyApp:D`
3. Filter by priority: `adb logcat *:E` (errors only)
4. Check for crashes in Logcat
5. Use Android Studio Logcat panel

### pa:debug-ios

iOS native debugging:

1. Use Xcode console (Cmd+Shift+C)
2. Check Console.app with device selected
3. Filter by subsystem/category with os_log
4. Run `xcrun simctl spawn booted log stream`
5. Check crash logs in Organizer

### pa:logs

**AI runs log commands and shows output:**

1. Detect platform
2. Run appropriate command:
   - RN: `adb logcat -d *:S ReactNativeJS:V | tail -100`
   - Android: `adb logcat -d | tail -100`
   - iOS: `xcrun simctl spawn booted log show --last 2m`
3. Parse and display results
4. Highlight errors and warnings

### pa:logs-filter "term"

**AI runs filtered log command:**

1. Run: `adb logcat -d | grep -i "term"` (or platform equivalent)
2. Parse output
3. Show matching entries with context
4. Analyze patterns in matches

### pa:logs-clear

Clear debug logs:

- Web: Clear browser console
- React Native: Restart Metro bundler
- Android: `adb logcat -c`
- iOS: Clear in Console.app

### pa:debug-clean

Remove debug statements before production:

1. Find all debug statements:
   - `console.log`, `console.debug`, `debugger` (JS)
   - `Log.d`, `Log.v`, `System.out` (Android)
   - `print`, `debugPrint`, `NSLog` (iOS)
2. List found statements with file:line
3. Offer to remove or comment out
4. Verify no production-breaking changes

---

## Undo Commands

### pa:undo-last

**Quick undo of last AI's changes - revert to before last AI session.**

AI workflow:

```bash
# 1. Read AI stats to find last AI
cat .proagents/worklog/ai-stats.json

# 2. Find last session log
ls -t .proagents/worklog/*.md | head -2 | tail -1

# 3. Read session to find files changed
# Extract "Files Changed" section

# 4. Check git for those files
git log --oneline -5 -- [files]

# 5. Show user what will be reverted
```

Output:
```
Undo Last AI's Changes
══════════════════════
Last AI: Gemini (1.5-pro)
Session: 2024-03-11 14:30
Duration: 45 min

Files Modified:
- src/auth/login.ts (+23, -5)
- src/auth/validate.ts (+15, -2)
- tests/auth.test.ts (new file)

Commits to revert:
- abc123: Add login validation
- def456: Add auth tests

Options:
1. Revert all changes (git revert)
2. Revert specific files only
3. View changes first (git diff)
4. Cancel

Your choice?
```

After user confirms:
```bash
# Revert commits
git revert --no-commit abc123 def456
git commit -m "Revert: Undo Gemini session 2024-03-11

Reverted changes from session 2024-03-11-gemini-001.md

Co-Authored-By: [Current AI]"

# Update stats
# Increment "reverts" counter in ai-stats.json
```

**Safety checks:**
- Never revert if uncommitted changes exist
- Warn if files modified by multiple AIs
- Always show diff before revert
- Update ai-stats.json with revert count

### pa:undo-file "path"

**Undo changes to a specific file.**

```bash
# Find last commit that modified this file
git log --oneline -1 -- [path]

# Show the change
git diff HEAD~1 -- [path]

# Offer revert options
```

### pa:undo-commit "hash"

**Undo a specific commit.**

```bash
git revert [hash] --no-commit
git commit -m "Revert: [original message]"
```
