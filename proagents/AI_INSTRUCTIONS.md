# AI Instructions for ProAgents

This project uses ProAgents - an AI-agnostic development workflow framework.

## CRITICAL: Multi-AI Environment

**Multiple AI tools may work on this project simultaneously (Claude, Cursor, Gemini, Copilot, etc.). They do NOT share context.**

### Before executing ANY `pa:` command:

1. **Read fresh state from files** - Never rely on previous knowledge
2. **Read project context** - Read `./proagents/context.md` for persistent project knowledge
3. **Check the activity log** - Read `./proagents/activity.log` to see recent AI actions
4. **Key files to check:**
   - `./proagents/context.md` - Persistent project context (READ FIRST!)
   - `./proagents/activity.log` - Recent AI activity
   - `./proagents/watchlist.yaml` - Files requiring confirmation before changes
   - `./proagents/proagents.config.yaml` - Project and platform config
   - `./proagents/active-features/` - Active feature status
   - `./CHANGELOG.md` - Recent changes
   - `./proagents/feedback.md` - Past corrections and preferences (LEARN FROM THESE!)

### AI Feedback & Learning

Before starting work, check `./proagents/feedback.md` for:
- **Corrections**: Mistakes other AIs made - don't repeat them!
- **Preferences**: How the user/team prefers things done
- **Patterns**: What worked well in this project

When you receive feedback or correction from the user:
1. Log it in `./proagents/feedback.md` using `pa:feedback`
2. Apply the learning to your current work
3. Avoid making the same mistake again

### File Watch List

Before modifying ANY file, check `./proagents/watchlist.yaml`:

- **critical**: Ask user for confirmation before modifying
- **review_required**: Warn user and explain changes before modifying
- **never_modify**: NEVER modify these files/patterns

If a file matches a pattern, inform the user:
> "This file is on the watch list (critical). Do you want me to proceed with the changes?"
4. **If you detect conflicts or outdated state:**
   - Inform the user: "I notice [X] may have changed since my last context. Let me refresh..."
   - Re-read the relevant files before proceeding

### After completing ANY `pa:` command:

**ALWAYS log your activity** to `./proagents/activity.log`:

```
[TIMESTAMP] [AI_PLATFORM:MODEL] [COMMAND] Description
```

Example entries:
```
2024-03-06 15:10 [Claude:opus-4] [pa:feature] Started feature "user-auth"
2024-03-06 15:12 [Cursor:gpt-4o] [pa:fix] Fixed login button bug in src/auth/login.ts
2024-03-06 15:15 [Gemini:1.5-pro] [pa:doc] Updated API documentation
2024-03-06 15:20 [Claude:sonnet-4] [pa:feature] Completed feature "user-auth"
2024-03-06 15:25 [Copilot:gpt-4o] [pa:test] Added unit tests for auth module
```

**Include your model name** (e.g., opus-4, sonnet-4, gpt-4o, gemini-1.5-pro).
Keep log entries concise (one line). Other AIs will read this to understand recent changes.

### Command History

Also log commands to `./proagents/history.log` with their results:

```
[TIMESTAMP] [AI:MODEL] COMMAND → RESULT
```

Example:
```
2024-03-06 15:10 [Claude:opus-4] pa:feature "user-auth" → Started
2024-03-06 15:30 [Claude:opus-4] pa:feature "user-auth" → Completed
2024-03-06 15:35 [Cursor:gpt-4o] pa:test → 15 passed, 2 failed
2024-03-06 15:40 [Claude:sonnet-4] pa:fix "login bug" → Fixed
```

This helps track what commands were run and their outcomes.

### Lock File for Active Work

When starting a major task (feature, large fix, refactoring), create a lock file at `./proagents/.lock`:

```yaml
locked_by: Claude        # Your AI platform
model: opus-4            # Your model name
started: 2024-03-06T15:10:00
task: "pa:feature user-auth"
description: "Implementing user authentication with JWT"
files:
  - src/auth/*
  - src/api/auth.ts
expires: 2024-03-06T17:10:00  # Auto-expires after 2 hours
```

**Before starting major work:**
1. Check if `./proagents/.lock` exists
2. If locked by another AI, inform user: "Project is locked by [AI] working on [task]. Wait or ask user to override."
3. If lock is expired (past `expires` time), you may delete it and proceed

**After completing work:**
1. Delete the `./proagents/.lock` file
2. Log completion in activity.log

### Conflict Detection

Before modifying any file, check for potential conflicts:

1. **Read activity.log** - See if another AI recently modified the same file
2. **Check lock file** - See if another AI is working on related files
3. **Look for patterns** like:
   ```
   2024-03-06 15:10 [Cursor:gpt-4o] Modified src/auth/login.ts
   ```

**If you detect a potential conflict:**

Warn the user:
> "I notice [Other AI] modified `src/auth/login.ts` 10 minutes ago.
> There may be uncommitted changes. Should I:
> 1. Proceed anyway (may overwrite their changes)
> 2. Wait and check with them first
> 3. Show me the recent changes to this file"

**After modifying files, always log:**
```
[TIMESTAMP] [AI:MODEL] [MODIFIED] file1.ts, file2.ts
```

This helps other AIs detect conflicts.

**Lock commands:**
| Command | Action |
|---------|--------|
| `pa:lock` | Show current lock status |
| `pa:lock-release` | Release lock (if you hold it) |
| `pa:lock-override` | Force release lock (requires user confirmation) |

### Handoff Notes

When ending a session or switching to another AI, create handoff notes at `./proagents/handoff.md`:

**For `pa:handoff`** - Create/update handoff notes:
```markdown
# AI Handoff Notes
Updated: 2024-03-06 15:30 by Claude (opus-4)

## Current Status
- **Working on:** User authentication feature
- **Phase:** Implementation (5 of 9)
- **Branch:** feature/user-auth

## Completed
- [x] Login UI component
- [x] JWT token generation
- [x] Password hashing setup

## In Progress
- [ ] Password reset flow (50% done)
- [ ] Email verification endpoint

## Blocked / Needs Attention
- Need API endpoint for sending emails (waiting on backend team)
- Rate limiting not yet implemented

## Files Modified
- src/auth/login.tsx
- src/auth/jwt.ts
- src/api/auth.ts

## Next Steps
1. Complete password reset flow
2. Add email verification
3. Write tests for auth module

## Notes for Next AI
- Using bcrypt for password hashing (see src/auth/hash.ts)
- JWT secret is in .env.local
- Test user: test@example.com / password123
```

**For `pa:handoff-read`** - Read and summarize current handoff notes before starting work.

### Session Summary

**For `pa:session-end`** - Generate and save a session summary to `./proagents/sessions/`:

```markdown
# Session Summary
Date: 2024-03-06 15:00-17:30
AI: Claude (opus-4)

## What Was Done
- Implemented user authentication feature
- Fixed 3 bugs in login flow
- Added unit tests for auth module

## Files Modified
- src/auth/login.tsx (created)
- src/auth/jwt.ts (created)
- src/api/auth.ts (modified)
- tests/auth.test.ts (created)

## Commands Executed
- pa:feature "user-auth" → Completed
- pa:test → 15 passed, 0 failed
- pa:doc → Updated API docs

## Issues Encountered
- Rate limiting not yet implemented (deferred)

## Next Session Should
1. Implement rate limiting
2. Add password reset flow
3. Write integration tests
```

Save to: `./proagents/sessions/YYYY-MM-DD-HHMMSS.md`

## Command Recognition

When the user types commands starting with `pa:`, recognize and execute them.

### Quick Aliases
| Alias | Expands To |
|-------|------------|
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

### Initialization
| Command | Action |
|---------|--------|
| `pa:init` | Initialize ProAgents in project |
| `pa:help` | Show all available commands |
| `pa:status` | Show current progress |

### Feature Development
| Command | Action |
|---------|--------|
| `pa:feature "name"` | Start new feature workflow |
| `pa:feature-start "name"` | Start new feature |
| `pa:feature-status` | Check feature status |
| `pa:feature-list` | List all features |
| `pa:feature-complete` | Mark feature complete |
| `pa:fix "description"` | Quick bug fix mode |

### Workflow Phase Commands
Run individual phases of the development workflow:

| Command | Phase | Action |
|---------|-------|--------|
| `pa:analyze` | Analysis | Deep codebase analysis - structure, patterns, dependencies |
| `pa:analyze-full` | Analysis | Comprehensive analysis with full depth |
| `pa:analyze-quick` | Analysis | Quick overview analysis |
| `pa:requirements` | Requirements | Gather and document feature requirements |
| `pa:requirements "feature"` | Requirements | Requirements for specific feature |
| `pa:design` | Design | UI/UX and architecture design |
| `pa:design-ui` | Design | Focus on UI/UX design |
| `pa:design-arch` | Design | Focus on architecture design |
| `pa:plan` | Planning | Create implementation plan |
| `pa:plan "feature"` | Planning | Plan specific feature implementation |
| `pa:implement` | Implementation | Execute implementation phase |
| `pa:implement-continue` | Implementation | Continue paused implementation |

**How to execute Workflow Phase commands:**

For `pa:analyze`:
1. Read `./proagents/prompts/01-analysis.md` for analysis workflow
2. Scan project structure, dependencies, patterns
3. Cache results in `./proagents/cache/`
4. Output analysis report

For `pa:requirements`:
1. Read `./proagents/prompts/02-requirements.md`
2. If feature name provided, create `./proagents/active-features/feature-{name}/requirements.md`
3. Gather user stories, acceptance criteria, constraints
4. Output requirements document

For `pa:design`:
1. Read `./proagents/prompts/03-ui-design.md`
2. Check for design inputs (Figma, sketches, exports)
3. Create component specifications
4. Output design document

For `pa:plan`:
1. Read `./proagents/prompts/04-planning.md`
2. Create implementation plan with task breakdown
3. Identify dependencies and risks
4. Save to `./proagents/active-features/feature-{name}/implementation-plan.md`

For `pa:implement`:
1. Read `./proagents/prompts/05-implementation.md`
2. Follow existing project patterns
3. Implement code changes
4. Log progress to activity.log

### Documentation Commands
| Command | Action |
|---------|--------|
| `pa:doc` | Show documentation options |
| `pa:doc-full` | Generate full project documentation |
| `pa:doc-moderate` | Generate balanced documentation |
| `pa:doc-lite` | Generate quick reference |
| `pa:doc-module [name]` | Document specific module |
| `pa:doc-file [path]` | Document specific file |
| `pa:doc-api` | Generate API documentation |
| `pa:readme` | Generate/update README |
| `pa:changelog` | Update CHANGELOG.md |
| `pa:release` | Generate release notes |
| `pa:release [version]` | Version-specific release notes |

### Quality & Testing
| Command | Action |
|---------|--------|
| `pa:qa` | Run quality assurance checks |
| `pa:test` | Run test workflow |
| `pa:review` | Code review workflow |

### Deployment
| Command | Action |
|---------|--------|
| `pa:deploy` | Deployment preparation |
| `pa:rollback` | Rollback procedures |

### Navigation & Flow
| Command | Action |
|---------|--------|
| `pa:next` | Show next step in current workflow |
| `pa:resume` | Resume paused feature from where left off |
| `pa:skip` | Skip current phase, move to next |
| `pa:back` | Go back to previous phase |
| `pa:progress` | Show visual progress bar for current feature |

**How to execute Navigation commands:**

For `pa:next`:
1. Read `./proagents/active-features/*/status.json` to find current feature
2. Identify current phase from status
3. Show what the next step/phase is
4. Provide guidance for the next action

For `pa:resume`:
1. Read `./proagents/active-features/` to find paused features
2. Read feature's `status.json` for last phase and progress
3. Read `./proagents/handoff.md` for context
4. Continue from where it was left off

For `pa:skip`:
1. Read current feature status
2. Mark current phase as "skipped" in status.json
3. Move to next phase
4. Log skip reason to activity.log
5. Warn if skipping critical phase (testing, review)

For `pa:back`:
1. Read current feature status
2. Move to previous phase
3. Update status.json
4. Reload context from previous phase

For `pa:progress`:
1. Read `./proagents/active-features/*/status.json`
2. Calculate percentage complete (current_phase / total_phases)
3. Display visual progress bar:
   ```
   Feature: user-auth
   Phase: 5/10 (Implementation)
   Progress: [████████░░░░░░░░░░░░] 50%

   ✓ Init → ✓ Analysis → ✓ Requirements → ✓ Design → ● Implementation → ○ Testing → ○ Review → ○ Docs → ○ Deploy
   ```

### Context & History
| Command | Action |
|---------|--------|
| `pa:context` | Quick view/edit project context |
| `pa:context-edit` | Edit project context interactively |
| `pa:diff` | Show what changed since last session |
| `pa:history` | Show command history with results |
| `pa:checkpoint` | Create a snapshot/restore point |
| `pa:checkpoint-restore` | Restore from a checkpoint |
| `pa:undo` | Undo last AI action using git |

**How to execute Context & History commands:**

For `pa:context`:
1. Read `./proagents/context.md`
2. Display current project context summary
3. Show last updated timestamp

For `pa:diff`:
1. Read `./proagents/activity.log` for last session timestamp
2. Run `git diff` from that point
3. Summarize changes by file/module
4. Highlight significant changes

For `pa:history`:
1. Read `./proagents/history.log`
2. Show recent commands with their results
3. Format: `[timestamp] command → result`

For `pa:checkpoint`:
1. Create git commit with message "checkpoint: [description]"
2. Save checkpoint info to `./proagents/checkpoints.json`:
   ```json
   {
     "checkpoints": [
       {
         "id": "cp-001",
         "timestamp": "2024-03-06T15:00:00Z",
         "commit": "abc123",
         "description": "Before auth refactor",
         "feature": "user-auth",
         "phase": "implementation"
       }
     ]
   }
   ```
3. Log to activity.log

For `pa:undo`:
1. Read last action from `./proagents/activity.log`
2. If file changes, run `git checkout` to revert
3. If multiple files, offer selective undo
4. Update activity.log with undo entry

### Sprint & Project Management
| Command | Action |
|---------|--------|
| `pa:sprint-start` | Start a new sprint |
| `pa:sprint-end` | End sprint with summary |
| `pa:sprint-status` | Show current sprint status |
| `pa:estimate` | Estimate task complexity |
| `pa:estimate "task"` | Estimate specific task |
| `pa:velocity` | Show team velocity metrics |

**How to execute Sprint commands:**

For `pa:sprint-start`:
1. Create `./proagents/sprints/sprint-{number}.json`:
   ```json
   {
     "sprint_number": 1,
     "start_date": "2024-03-06",
     "end_date": "2024-03-20",
     "goals": [],
     "features": [],
     "status": "active"
   }
   ```
2. Ask for sprint goals
3. Link active features to sprint

For `pa:sprint-end`:
1. Read current sprint file
2. Calculate metrics (completed features, velocity)
3. Generate sprint summary → `./proagents/sprints/sprint-{n}-summary.md`
4. Archive sprint

For `pa:estimate`:
1. Analyze task/feature complexity
2. Consider: code changes, files affected, dependencies, testing needs
3. Provide estimate in story points or T-shirt sizes (S/M/L/XL)
4. Save estimate to feature status.json

For `pa:velocity`:
1. Read completed sprints from `./proagents/sprints/`
2. Calculate average story points per sprint
3. Show velocity chart/trend

### Integration Commands
| Command | Action |
|---------|--------|
| `pa:github` | GitHub integration commands |
| `pa:github-issue` | Create GitHub issue from current work |
| `pa:github-pr` | Create pull request |
| `pa:jira` | Jira integration commands |
| `pa:jira-sync` | Sync with Jira ticket |
| `pa:notify` | Send notification |
| `pa:notify-slack` | Send Slack notification |
| `pa:notify-email` | Send email notification |

**How to execute Integration commands:**

For `pa:github-issue`:
1. Read current feature/bug context
2. Generate issue title and body
3. Show preview and ask for confirmation
4. Provide `gh issue create` command or API call

For `pa:github-pr`:
1. Read current feature context
2. Generate PR title and description
3. Include: summary, changes, test plan
4. Provide `gh pr create` command

For `pa:jira-sync`:
1. Read Jira config from `proagents.config.yaml`
2. Find linked ticket (from feature name or config)
3. Update ticket status based on feature phase
4. Add comment with progress

For `pa:notify`:
1. Read notification config from `proagents.config.yaml`
2. Generate notification message based on context
3. Send via configured channel (Slack webhook, email, etc.)

### Code Quality Commands
| Command | Action |
|---------|--------|
| `pa:metrics` | Show code quality metrics |
| `pa:metrics-history` | Show metrics over time |
| `pa:coverage` | Show test coverage report |
| `pa:coverage-diff` | Show coverage changes |
| `pa:deps` | Analyze dependencies |
| `pa:deps-outdated` | Find outdated dependencies |
| `pa:deps-security` | Security scan dependencies |

**How to execute Code Quality commands:**

For `pa:metrics`:
1. Analyze codebase for:
   - Lines of code (by language)
   - Cyclomatic complexity
   - Code duplication
   - Function/file sizes
2. Save to `./proagents/metrics/latest.json`
3. Display summary with warnings for issues

For `pa:coverage`:
1. Check for coverage reports (coverage/, .nyc_output/, etc.)
2. Parse coverage data
3. Display summary:
   ```
   Test Coverage Report
   ═══════════════════
   Overall: 82% ✓

   By Module:
   • src/auth/     95% ████████████████████ ✓
   • src/api/      78% ███████████████░░░░░
   • src/utils/    65% █████████████░░░░░░░ ⚠
   ```

For `pa:deps`:
1. Read package.json / requirements.txt
2. Analyze dependency tree
3. Identify:
   - Direct vs transitive deps
   - Duplicate packages
   - Large dependencies
   - Outdated versions

For `pa:deps-security`:
1. Run `npm audit` or equivalent
2. Parse security advisories
3. Categorize by severity
4. Suggest fixes

### AI Platform Management
| Command | Action |
|---------|--------|
| `pa:ai-list` | List installed AI platforms |
| `pa:ai-add` | Add more AI platforms |
| `pa:ai-remove` | Remove AI platforms from config |
| `pa:ai-sync` | Sync config with existing files |

**How to execute AI Platform commands:**

For `pa:ai-list`:
- Read `./proagents/proagents.config.yaml` and show the `platforms` array
- Show which AI instruction files exist in project root

For `pa:ai-add`:
1. Show available platforms to user:
   | Platform | File Created |
   |----------|--------------|
   | Claude Code | CLAUDE.md |
   | Cursor | .cursorrules |
   | Windsurf | .windsurfrules |
   | GitHub Copilot | .github/copilot-instructions.md |
   | ChatGPT | CHATGPT.md |
   | Gemini | GEMINI.md |
   | Bolt | BOLT.md |
   | Lovable | LOVABLE.md |
   | Replit | REPLIT.md |
   | Kiro | KIRO.md |
   | Groq | GROQ.md |
   | AntiGravity | ANTIGRAVITY.md |

2. Ask user which platforms to add
3. For each selected platform:
   - Copy content from `./proagents/{PLATFORM}.md` (e.g., `./proagents/CLAUDE.md`)
   - If target file exists, wrap new content with markers and append:
     ```
     <!-- PROAGENTS:START -->
     {content from proagents folder}
     <!-- PROAGENTS:END -->
     ```
   - If target file doesn't exist, create it with the content wrapped in markers
4. Update `./proagents/proagents.config.yaml` to add platform to `platforms` array

For `pa:ai-remove`:
1. Read `./proagents/proagents.config.yaml` to get current platforms
2. Show list and ask which to remove
3. For each selected:
   - Remove the PROAGENTS section (between markers) from the file, OR delete the file if it only contains ProAgents content
   - Update config to remove from `platforms` array

For `pa:ai-sync`:
1. Scan project root for AI instruction files
2. Read current config from `./proagents/proagents.config.yaml`
3. Compare and show differences:
   - Files that exist but not in config
   - Config entries that don't have matching files
4. Ask user: "Add missing files to config?" or "Remove orphan config entries?"
5. Update config to match actual files

**Platform ID to File Mapping:**
| Platform ID | File |
|-------------|------|
| claude | CLAUDE.md |
| cursor | .cursorrules |
| windsurf | .windsurfrules |
| copilot | .github/copilot-instructions.md |
| chatgpt | CHATGPT.md |
| gemini | GEMINI.md |
| bolt | BOLT.md |
| lovable | LOVABLE.md |
| replit | REPLIT.md |
| kiro | KIRO.md |
| groq | GROQ.md |
| antigravity | ANTIGRAVITY.md |

### Configuration
| Command | Action |
|---------|--------|
| `pa:config` | Show current configuration |
| `pa:config-list` | List all configurable options |
| `pa:config-show` | Show current config values |
| `pa:config-set K V` | Set a config value |
| `pa:config-get K` | Get a config value |
| `pa:config-setup` | Interactive config wizard |
| `pa:config-customize` | Copy templates to customize |

### Custom Commands

Check `./proagents/custom-commands.yaml` for project-specific commands.

Built-in custom commands:
| Command | Action |
|---------|--------|
| `pa:standup` | Generate daily standup summary |
| `pa:sprint-review` | Generate sprint review |
| `pa:tech-debt` | Scan and document technical debt |
| `pa:security-scan` | Run security checklist |

Users can add their own commands in `custom-commands.yaml`.

### Utilities
| Command | Action |
|---------|--------|
| `pa:uninstall` | Remove ProAgents from project |

### Collaboration (Multi-AI)
| Command | Action |
|---------|--------|
| `pa:activity` | Show recent AI activity log |
| `pa:lock` | Show current lock status |
| `pa:lock-release` | Release lock (if you hold it) |
| `pa:lock-override` | Force release lock (requires user confirmation) |
| `pa:handoff` | Create handoff notes for other AIs |
| `pa:handoff-read` | Read latest handoff notes |
| `pa:session-end` | Generate session summary before ending |
| `pa:session-history` | Show recent session summaries |
| `pa:decision "title"` | Log an architectural/technical decision |
| `pa:decisions` | Show all logged decisions |
| `pa:error "description"` | Log an error and its solution |
| `pa:errors` | Show logged errors (search for solutions) |
| `pa:feedback "description"` | Log feedback/correction for AI learning |
| `pa:feedback-list` | Show all feedback (learn from past corrections) |

## How to Execute Commands

When user types a `pa:` command:

1. **Read the corresponding prompt file** from `./proagents/prompts/`
2. **Follow the workflow** defined in that prompt
3. **Use project context** from `./proagents/` folder

### Prompt File Mapping
- `pa:feature` → `./proagents/prompts/00-init.md` + workflow
- `pa:fix` → `./proagents/workflow-modes/entry-modes.md` (Bug Fix section)
- `pa:doc*` → `./proagents/prompts/07-documentation.md`
- `pa:qa` → `./proagents/checklists/code-quality.md`
- `pa:test` → `./proagents/prompts/06-testing.md`
- `pa:deploy` → `./proagents/prompts/08-deployment.md`
- `pa:release` → `./proagents/prompts/07-documentation.md` (Release Notes section)

## Workflow Reference

Full workflow documentation: `./proagents/WORKFLOW.md`
Quick command reference: `./proagents/PROAGENTS.md`

## Important

- Always check `./proagents/` folder for project-specific configurations
- Preserve user's `proagents.config.yaml` settings
- Follow existing code patterns found in the project
