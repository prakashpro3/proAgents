# AI Instructions for ProAgents

This project uses ProAgents - an AI-agnostic development workflow framework.

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

### Before ANY `pa:` command:

1. **Read project context** - `./.proagents/context.md`
2. **Check activity log** - `./.proagents/activity.log`
3. **Check feedback** - `./.proagents/feedback.md` (learn from past corrections!)
4. **Check watchlist** - `./.proagents/watchlist.yaml` (files requiring confirmation)

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
| `pa:activity` | Show AI activity log |
| `pa:lock` | Show lock status |
| `pa:handoff` | Create handoff notes |
| `pa:feedback "text"` | Log feedback for AI learning |
| `pa:decision "title"` | Log architectural decision |
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
| `pa:activity` | Show recent AI activity |

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

---

## pa:history Execution

**AI MUST read and display the actual log file content.**

1. Read `./.proagents/activity.log`
2. Filter out header lines (lines starting with #)
3. Display entries (most recent first)
4. NEVER say "no commands yet" without reading the file

```bash
# AI runs this:
grep -v "^#" .proagents/activity.log | grep -v "^$" | grep -v "Activity Log Start" | tail -30
```

If no entries found after filtering, show:
```
No pa: commands logged yet.
Run some commands, then try pa:history again.
```

**Output format:**
```
Command History
═══════════════
[2024-03-06 16:00] [Gemini] pa:logs - Captured 50 entries
[2024-03-06 15:30] [Cursor] pa:test - 12 tests passed
[2024-03-06 15:15] [Claude] pa:analyze - Analyzed 45 files
[2024-03-06 15:10] [Claude] pa:feature - Started "user-auth"
```

---

## pa:progress Execution

**AI MUST read feature status from actual files.**

1. Read `./.proagents/active-features/_index.json`
2. Read each feature's `status.json`
3. Calculate and display progress

```bash
# AI runs this:
cat .proagents/active-features/_index.json
cat .proagents/active-features/feature-*/status.json
```

**Output format:**
```
Feature Progress
════════════════
user-auth [████████░░] 80%
  Phase: testing
  Last: Ran 12 unit tests

dashboard [████░░░░░░] 40%
  Phase: implementation
  Last: Created 3 components
```

---

## pa:status Execution

**IMPORTANT:** Show REAL data only, never example data.

1. Read `./.proagents/active-features/_index.json`
2. If empty:
   ```
   Project Status
   ══════════════
   No features tracked.

   Start with:
   → pa:feature "name"
   → pa:fix "bug"
   ```
3. If has features:
   ```
   Project Status
   ══════════════

   Active: [count]
   • [name] - [phase] ([progress]%)

   Paused: [count]
   Completed: [count]
   ```

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

---

## Important

- Always check `./.proagents/` folder for project-specific configurations
- Preserve user's `proagents.config.yaml` settings
- Follow existing code patterns found in the project
- Log all activity for other AIs to see
- Learn from feedback.md - don't repeat past mistakes
