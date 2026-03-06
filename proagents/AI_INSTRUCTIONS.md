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

### Code Generation
| Command | Action |
|---------|--------|
| `pa:generate` | Show generation options |
| `pa:generate-component "name"` | Generate React/Vue component |
| `pa:generate-api "name"` | Generate API endpoint |
| `pa:generate-test "file"` | Generate test file for module |
| `pa:generate-hook "name"` | Generate custom hook |
| `pa:generate-service "name"` | Generate service class |

**How to execute Code Generation commands:**

For `pa:generate-component`:
1. Read project type and patterns from `./proagents/cache/patterns.json`
2. Use template from `./proagents/scaffolding/` matching project type
3. Apply project naming conventions
4. Create component file with:
   - Component code
   - Types/interfaces
   - Basic styles (if applicable)
   - Test file (optional)
5. Save to appropriate directory based on project structure

For `pa:generate-api`:
1. Detect API framework (Express, Next.js, NestJS, etc.)
2. Use appropriate template
3. Generate:
   - Route handler
   - Input validation
   - Error handling
   - Types
4. Add to routes index if applicable

For `pa:generate-test`:
1. Read the source file
2. Detect testing framework (Jest, Vitest, etc.)
3. Generate test file with:
   - Import statements
   - Describe blocks
   - Test cases for each function
   - Mock setup
4. Save alongside source or in tests/ folder

### Refactoring
| Command | Action |
|---------|--------|
| `pa:refactor` | Analyze and suggest refactoring |
| `pa:refactor "file"` | Refactor specific file |
| `pa:rename "old" "new"` | Rename symbol across codebase |
| `pa:extract "name"` | Extract function/component |
| `pa:cleanup` | Remove dead code, unused imports |
| `pa:cleanup-imports` | Clean up imports only |

**How to execute Refactoring commands:**

For `pa:refactor`:
1. Analyze codebase for:
   - Long functions (>50 lines)
   - Deep nesting (>3 levels)
   - Duplicate code
   - Complex conditionals
   - God classes/components
2. Prioritize by impact
3. Suggest specific refactoring for each issue
4. Offer to apply refactoring

For `pa:rename`:
1. Find all occurrences of symbol
2. Check for naming conflicts
3. Show preview of changes
4. Apply rename across all files
5. Update imports/exports

For `pa:cleanup`:
1. Find unused imports
2. Find unused variables
3. Find dead code (unreachable)
4. Find unused exports
5. Show list and offer to remove
6. Log changes to activity.log

### Time Tracking
| Command | Action |
|---------|--------|
| `pa:time-start` | Start time tracking |
| `pa:time-start "task"` | Start tracking specific task |
| `pa:time-stop` | Stop current time tracking |
| `pa:time-pause` | Pause time tracking |
| `pa:time-report` | Show time report |
| `pa:time-report "feature"` | Report for specific feature |

**How to execute Time Tracking commands:**

For `pa:time-start`:
1. Create/update `./proagents/time-tracking.json`:
   ```json
   {
     "current": {
       "task": "feature-user-auth",
       "started": "2024-03-06T15:00:00Z",
       "status": "running"
     },
     "entries": []
   }
   ```
2. Log to activity.log

For `pa:time-stop`:
1. Read current tracking
2. Calculate duration
3. Add to entries array:
   ```json
   {
     "task": "feature-user-auth",
     "started": "2024-03-06T15:00:00Z",
     "ended": "2024-03-06T17:30:00Z",
     "duration_minutes": 150,
     "ai": "Claude:opus-4"
   }
   ```
4. Clear current tracking

For `pa:time-report`:
1. Read all entries from time-tracking.json
2. Group by task/feature
3. Calculate totals
4. Display report:
   ```
   Time Report
   ═══════════
   Feature: user-auth
   Total: 5h 30m
   Sessions: 3

   Feature: dashboard
   Total: 2h 15m
   Sessions: 2
   ```

### Environment & Setup
| Command | Action |
|---------|--------|
| `pa:env-check` | Verify environment setup |
| `pa:env-setup` | Setup development environment |
| `pa:env-diff` | Compare environments |
| `pa:secrets-scan` | Scan for exposed secrets |
| `pa:secrets-check` | Verify required secrets exist |

**How to execute Environment commands:**

For `pa:env-check`:
1. Check for required files (.env, .env.local, etc.)
2. Verify Node/Python/etc. version matches
3. Check for required dependencies
4. Verify database connection (if applicable)
5. Check for required environment variables
6. Report status:
   ```
   Environment Check
   ═════════════════
   ✓ Node.js v18.17.0 (required: >=18)
   ✓ npm v9.6.0
   ✓ .env.local exists
   ⚠ DATABASE_URL not set
   ✗ Redis not running
   ```

For `pa:secrets-scan`:
1. Scan codebase for patterns:
   - API keys (sk_, pk_, api_key, etc.)
   - Passwords in code
   - Private keys
   - Connection strings
2. Check .gitignore for sensitive files
3. Report findings with file locations
4. Suggest fixes (move to .env, etc.)

### Database Commands
| Command | Action |
|---------|--------|
| `pa:db-migrate` | Run database migrations |
| `pa:db-migrate-create "name"` | Create new migration |
| `pa:db-seed` | Seed database with test data |
| `pa:db-reset` | Reset database |
| `pa:db-status` | Show migration status |

**How to execute Database commands:**

For `pa:db-migrate`:
1. Detect ORM (Prisma, TypeORM, Sequelize, Drizzle, etc.)
2. Run appropriate migrate command:
   - Prisma: `npx prisma migrate dev`
   - TypeORM: `npm run typeorm migration:run`
3. Report results

For `pa:db-seed`:
1. Find seed files (prisma/seed.ts, seeds/, etc.)
2. Run seed command
3. Report inserted records

For `pa:db-reset`:
1. Warn user about data loss
2. Require confirmation
3. Drop and recreate database
4. Run migrations
5. Optionally run seeds

### Accessibility & Performance
| Command | Action |
|---------|--------|
| `pa:a11y` | Run accessibility audit |
| `pa:a11y "url"` | Audit specific page |
| `pa:lighthouse` | Run Lighthouse audit |
| `pa:lighthouse "url"` | Audit specific URL |
| `pa:perf` | Performance analysis |
| `pa:perf-bundle` | Bundle size analysis |

**How to execute A11y & Performance commands:**

For `pa:a11y`:
1. Check for a11y tools (axe, pa11y, etc.)
2. Run audit on pages/components
3. Report issues by severity:
   ```
   Accessibility Audit
   ═══════════════════
   Critical: 2
   Serious: 5
   Moderate: 12
   Minor: 8

   Top Issues:
   • Missing alt text on images (5 instances)
   • Low color contrast (3 instances)
   • Missing form labels (2 instances)
   ```
4. Link to WCAG guidelines for each issue

For `pa:lighthouse`:
1. Check if Lighthouse is available
2. Run audit (provide command or use API)
3. Parse results
4. Display scores:
   ```
   Lighthouse Scores
   ═════════════════
   Performance:    85 ████████░░
   Accessibility:  92 █████████░
   Best Practices: 100 ██████████
   SEO:            90 █████████░
   ```

For `pa:perf`:
1. Analyze:
   - Bundle sizes
   - Load times
   - Render performance
   - Memory usage patterns
2. Identify bottlenecks
3. Suggest optimizations

### Export & Backup
| Command | Action |
|---------|--------|
| `pa:export` | Export ProAgents config and data |
| `pa:export-config` | Export only configuration |
| `pa:import` | Import from export file |
| `pa:backup` | Create full backup |
| `pa:backup-restore` | Restore from backup |

**How to execute Export & Backup commands:**

For `pa:export`:
1. Gather all ProAgents data:
   - proagents.config.yaml
   - context.md
   - decisions.md
   - feedback.md
   - active-features/
   - learned patterns
2. Create export file: `proagents-export-YYYY-MM-DD.json`
3. Optionally encrypt sensitive data

For `pa:import`:
1. Read export file
2. Validate format
3. Merge or replace existing data
4. Report what was imported

For `pa:backup`:
1. Create timestamped backup of entire proagents/ folder
2. Save to `./proagents/backups/` or specified location
3. Compress if large
4. Maintain rolling backups (keep last N)

### Learning & AI
| Command | Action |
|---------|--------|
| `pa:learn "pattern"` | Teach AI a new pattern |
| `pa:learn-from "file"` | Learn patterns from file |
| `pa:forget "pattern"` | Remove learned pattern |
| `pa:suggestions` | Show AI suggestions for project |
| `pa:suggestions-apply` | Apply a suggestion |

**How to execute Learning commands:**

For `pa:learn`:
1. Parse the pattern description
2. Add to `./proagents/.learning/`:
   ```json
   {
     "pattern": "Always use React Query for API calls",
     "type": "preference",
     "added": "2024-03-06",
     "added_by": "user",
     "applies_to": ["api", "data-fetching"]
   }
   ```
3. Confirm pattern learned

For `pa:forget`:
1. Find matching pattern
2. Remove from learning data
3. Confirm removal

For `pa:suggestions`:
1. Analyze project state
2. Check learned patterns
3. Generate suggestions:
   ```
   AI Suggestions
   ══════════════
   1. [Code Quality] Consider adding error boundaries to page components
   2. [Performance] Bundle size increased 15% - review new dependencies
   3. [Testing] Test coverage dropped below 80% in src/utils/
   4. [Security] 2 dependencies have known vulnerabilities
   ```
4. Offer to apply each suggestion

### API & Documentation Generation
| Command | Action |
|---------|--------|
| `pa:api-docs` | Generate OpenAPI/Swagger documentation |
| `pa:api-docs "path"` | Generate docs for specific API path |
| `pa:storybook` | Generate Storybook stories for components |
| `pa:storybook "component"` | Generate story for specific component |
| `pa:readme` | Auto-generate/update README.md |
| `pa:readme-section "name"` | Update specific README section |
| `pa:types` | Generate TypeScript types/interfaces |
| `pa:types "file"` | Generate types for specific file |

**How to execute API & Documentation commands:**

For `pa:api-docs`:
1. Detect API framework (Express, Next.js, NestJS, FastAPI, etc.)
2. Scan route files for endpoints
3. Extract:
   - HTTP methods and paths
   - Request/response types
   - Query/path parameters
   - Authentication requirements
4. Generate OpenAPI 3.0 spec:
   ```yaml
   openapi: 3.0.0
   info:
     title: API Documentation
     version: 1.0.0
   paths:
     /api/users:
       get:
         summary: List all users
         responses:
           '200':
             description: Success
   ```
5. Save to `./docs/openapi.yaml` or `./swagger.json`
6. Optionally generate HTML documentation

For `pa:storybook`:
1. Find React/Vue/Angular components
2. Analyze component props/interfaces
3. Generate story file with:
   - Default story
   - Variant stories for different props
   - Interactive controls
4. Save to `*.stories.tsx` alongside component:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Button } from './Button';

   const meta: Meta<typeof Button> = {
     component: Button,
     title: 'Components/Button',
   };
   export default meta;

   export const Primary: StoryObj<typeof Button> = {
     args: { variant: 'primary', children: 'Click me' },
   };
   ```

For `pa:readme`:
1. Analyze project structure
2. Detect:
   - Project type and framework
   - Available scripts (npm scripts)
   - Dependencies
   - Existing documentation
3. Generate/update README with:
   - Project title and description
   - Installation instructions
   - Usage examples
   - Available commands
   - Contributing guidelines
4. Preserve existing custom sections

For `pa:types`:
1. Analyze source file or API responses
2. Infer TypeScript types:
   - From JavaScript usage patterns
   - From JSON data structures
   - From API responses
3. Generate interface/type definitions:
   ```typescript
   interface User {
     id: string;
     name: string;
     email: string;
     createdAt: Date;
   }
   ```
4. Save to `types/` folder or alongside source

### Git Advanced
| Command | Action |
|---------|--------|
| `pa:branch` | Branch management (list, info) |
| `pa:branch-create "name"` | Create new branch |
| `pa:branch-clean` | Clean up merged/stale branches |
| `pa:merge` | Smart merge with conflict preview |
| `pa:merge "branch"` | Merge specific branch |
| `pa:conflict` | Resolve merge conflicts with AI |
| `pa:conflict "file"` | Resolve conflicts in specific file |
| `pa:changelog-gen` | Auto-generate changelog from commits |
| `pa:changelog-gen "version"` | Generate for specific version |

**How to execute Git Advanced commands:**

For `pa:branch`:
1. Run `git branch -a` to list all branches
2. Show current branch with `git branch --show-current`
3. Display branch info:
   ```
   Branches
   ════════
   Current: feature/user-auth

   Local:
   • main (2 days ago)
   • develop (1 hour ago)
   • feature/user-auth * (current)
   • feature/dashboard (5 days ago, stale)

   Remote:
   • origin/main
   • origin/develop
   ```

For `pa:branch-clean`:
1. Find merged branches: `git branch --merged`
2. Find stale branches (no commits in 30+ days)
3. Show list and ask for confirmation
4. Delete selected branches
5. Optionally prune remote tracking branches

For `pa:merge`:
1. Show current branch and target
2. Preview changes: `git diff branch...HEAD`
3. Check for conflicts: `git merge --no-commit --no-ff branch`
4. If conflicts exist, list conflicting files
5. If clean, proceed with merge
6. Create merge commit with descriptive message

For `pa:conflict`:
1. List conflicting files: `git diff --name-only --diff-filter=U`
2. For each file:
   - Show conflict markers
   - Analyze both versions
   - Suggest resolution based on:
     - Code context
     - Which change is more recent
     - What each change accomplishes
3. Apply resolution and mark as resolved
4. Stage resolved files

For `pa:changelog-gen`:
1. Get commits since last tag: `git log $(git describe --tags --abbrev=0)..HEAD`
2. Parse conventional commits
3. Group by type (feat, fix, docs, etc.)
4. Generate changelog:
   ```markdown
   ## [1.2.0] - 2024-03-06

   ### Added
   - User authentication with JWT (#123)
   - Dashboard component (#125)

   ### Fixed
   - Login button styling (#124)

   ### Changed
   - Updated dependencies (#126)
   ```
5. Prepend to CHANGELOG.md

### Search & Code Navigation
| Command | Action |
|---------|--------|
| `pa:find "pattern"` | Find code patterns/usage |
| `pa:find-usage "symbol"` | Find all usages of symbol |
| `pa:find-definition "symbol"` | Find definition of symbol |
| `pa:todo` | Find and list all TODOs |
| `pa:todo-add "message"` | Add TODO at current location |
| `pa:fixme` | Find FIXMEs and critical issues |
| `pa:unused` | Find unused code/exports |
| `pa:unused-deps` | Find unused dependencies |

**How to execute Search commands:**

For `pa:find`:
1. Search codebase for pattern using grep/ripgrep
2. Support regex patterns
3. Show results with context:
   ```
   Search Results: "useAuth"
   ═══════════════════════════

   src/hooks/useAuth.ts:5
   │ export function useAuth() {

   src/pages/Login.tsx:12
   │ const { login, logout } = useAuth();

   src/components/Navbar.tsx:8
   │ const { user } = useAuth();

   Found 3 matches in 3 files
   ```

For `pa:todo`:
1. Search for TODO, FIXME, HACK, XXX comments
2. Parse priority markers (TODO(high):, TODO:, etc.)
3. Group by priority and file:
   ```
   TODOs Found: 15
   ═══════════════

   High Priority:
   • src/auth/jwt.ts:45 - TODO(high): Add token refresh
   • src/api/users.ts:78 - FIXME: SQL injection risk

   Medium Priority:
   • src/utils/date.ts:12 - TODO: Handle timezone

   Low Priority:
   • src/components/Button.tsx:5 - TODO: Add loading state
   ```

For `pa:fixme`:
1. Search for FIXME, BUG, HACK, XXX, SECURITY
2. Prioritize by keyword severity
3. Show with context and age (when added via git blame)
4. Suggest fixes where possible

For `pa:unused`:
1. Analyze exports and imports
2. Find:
   - Exported but never imported
   - Defined but never used
   - Dead code (unreachable)
3. Report with confidence level:
   ```
   Unused Code Analysis
   ═══════════════════

   Definitely Unused:
   • src/utils/old-helper.ts - entire file (no imports)
   • src/types/legacy.ts:LegacyUser - type never used

   Possibly Unused:
   • src/api/deprecated.ts:oldEndpoint - only test imports
   ```

For `pa:unused-deps`:
1. Read package.json dependencies
2. Search codebase for imports
3. Find packages never imported:
   ```
   Unused Dependencies
   ═══════════════════

   dependencies:
   • lodash - never imported
   • moment - never imported (consider date-fns)

   devDependencies:
   • @types/node - used
   ```

### Code Analysis
| Command | Action |
|---------|--------|
| `pa:complexity` | Cyclomatic complexity analysis |
| `pa:complexity "file"` | Analyze specific file |
| `pa:duplication` | Find duplicate code blocks |
| `pa:duplication "threshold"` | Set minimum lines threshold |
| `pa:hotspots` | Find frequently changed files |
| `pa:hotspots "days"` | Analyze over specific period |

**How to execute Code Analysis commands:**

For `pa:complexity`:
1. Analyze functions/methods for:
   - Cyclomatic complexity (if/else, switch, loops)
   - Cognitive complexity
   - Nesting depth
   - Parameter count
2. Report high complexity areas:
   ```
   Complexity Report
   ═════════════════

   High Complexity (>10):
   • src/utils/parser.ts:parseData() - complexity: 15
     ↳ 8 if statements, 3 loops, max depth: 4
     ↳ Suggestion: Split into smaller functions

   • src/api/handler.ts:processRequest() - complexity: 12
     ↳ Large switch statement (10 cases)
     ↳ Suggestion: Use strategy pattern

   Medium Complexity (5-10):
   • src/auth/validate.ts:validateUser() - complexity: 7
   ```

For `pa:duplication`:
1. Find duplicate code blocks (default: 6+ lines)
2. Calculate similarity percentage
3. Report duplicates:
   ```
   Code Duplication Report
   ═══════════════════════

   Duplicate #1 (98% similar, 15 lines):
   • src/api/users.ts:45-60
   • src/api/posts.ts:32-47
   ↳ Suggestion: Extract to shared utility

   Duplicate #2 (100% identical, 8 lines):
   • src/components/Card.tsx:12-20
   • src/components/Panel.tsx:8-16
   ↳ Suggestion: Create shared component

   Total: 5 duplicate blocks, ~120 duplicated lines
   ```

For `pa:hotspots`:
1. Analyze git history for frequently changed files
2. Correlate with bug fixes
3. Identify risky areas:
   ```
   Code Hotspots (Last 30 Days)
   ════════════════════════════

   Most Changed:
   1. src/api/auth.ts - 45 changes, 12 bug fixes
      ↳ High churn + bugs = refactoring candidate

   2. src/utils/helpers.ts - 32 changes, 3 bug fixes
      ↳ Frequently modified utility

   3. src/components/Form.tsx - 28 changes, 8 bug fixes
      ↳ Complex component, consider splitting
   ```

### Testing Advanced
| Command | Action |
|---------|--------|
| `pa:test-e2e` | Create/run E2E tests |
| `pa:test-e2e "flow"` | E2E test for specific flow |
| `pa:test-unit` | Generate unit tests |
| `pa:test-unit "file"` | Generate tests for file |
| `pa:mock` | Generate mocks/stubs |
| `pa:mock "module"` | Mock specific module |
| `pa:snapshot` | Snapshot testing management |
| `pa:snapshot-update` | Update snapshots |

**How to execute Testing Advanced commands:**

For `pa:test-e2e`:
1. Detect E2E framework (Playwright, Cypress, etc.)
2. Analyze user flows in the app
3. Generate E2E test:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('User Authentication', () => {
     test('should login successfully', async ({ page }) => {
       await page.goto('/login');
       await page.fill('[name="email"]', 'test@example.com');
       await page.fill('[name="password"]', 'password123');
       await page.click('button[type="submit"]');
       await expect(page).toHaveURL('/dashboard');
     });

     test('should show error for invalid credentials', async ({ page }) => {
       await page.goto('/login');
       await page.fill('[name="email"]', 'wrong@example.com');
       await page.fill('[name="password"]', 'wrong');
       await page.click('button[type="submit"]');
       await expect(page.locator('.error')).toBeVisible();
     });
   });
   ```

For `pa:test-unit`:
1. Read source file
2. Identify functions/methods to test
3. Generate comprehensive test file:
   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   import { calculateTotal, formatPrice } from './pricing';

   describe('calculateTotal', () => {
     it('should calculate total with tax', () => {
       expect(calculateTotal(100, 0.1)).toBe(110);
     });

     it('should handle zero amount', () => {
       expect(calculateTotal(0, 0.1)).toBe(0);
     });

     it('should throw for negative amounts', () => {
       expect(() => calculateTotal(-100, 0.1)).toThrow();
     });
   });
   ```

For `pa:mock`:
1. Analyze module dependencies
2. Generate mock implementations:
   ```typescript
   // mocks/api.ts
   import { vi } from 'vitest';

   export const mockApi = {
     getUsers: vi.fn().mockResolvedValue([
       { id: '1', name: 'Test User' }
     ]),
     createUser: vi.fn().mockResolvedValue({ id: '2' }),
     deleteUser: vi.fn().mockResolvedValue(true),
   };

   vi.mock('../api', () => mockApi);
   ```
3. Include type-safe mocks with TypeScript

For `pa:snapshot`:
1. Find existing snapshots
2. Show status:
   ```
   Snapshot Status
   ═══════════════

   Total: 45 snapshots in 12 files

   Outdated (need update):
   • Button.test.tsx - 3 snapshots
   • Card.test.tsx - 1 snapshot

   Obsolete (no matching test):
   • OldComponent.test.tsx.snap - entire file

   Commands:
   • pa:snapshot-update - Update outdated
   • pa:snapshot-clean - Remove obsolete
   ```

### DevOps & Infrastructure
| Command | Action |
|---------|--------|
| `pa:docker` | Docker commands overview |
| `pa:docker-build` | Build Docker image |
| `pa:docker-compose` | Docker Compose operations |
| `pa:ci` | CI/CD pipeline status/management |
| `pa:ci-run` | Trigger CI pipeline |
| `pa:deploy-preview` | Deploy to preview environment |
| `pa:deploy-preview-url` | Get preview deployment URL |

**How to execute DevOps commands:**

For `pa:docker`:
1. Check for Dockerfile and docker-compose.yml
2. Show available commands:
   ```
   Docker Status
   ═════════════

   Dockerfile: ✓ Found
   docker-compose.yml: ✓ Found

   Services:
   • app - Node.js application
   • db - PostgreSQL
   • redis - Redis cache

   Commands:
   • pa:docker-build - Build images
   • pa:docker-compose up - Start services
   • pa:docker-compose down - Stop services
   ```

For `pa:docker-build`:
1. Read Dockerfile
2. Suggest optimizations if needed
3. Build image with appropriate tags
4. Report build status and size

For `pa:ci`:
1. Detect CI system (GitHub Actions, GitLab CI, etc.)
2. Show pipeline status:
   ```
   CI/CD Status
   ════════════

   Platform: GitHub Actions

   Recent Workflows:
   ✓ Build & Test (main) - 2m ago - passed
   ✓ Deploy Preview (PR #123) - 15m ago - passed
   ✗ Security Scan (main) - 1h ago - failed
     ↳ 2 vulnerabilities found

   Current:
   ● Build & Test (feature/auth) - running (1m 30s)
   ```

For `pa:deploy-preview`:
1. Detect preview deployment platform (Vercel, Netlify, etc.)
2. Trigger preview deployment
3. Wait for deployment URL
4. Return preview URL:
   ```
   Preview Deployment
   ══════════════════

   Branch: feature/user-auth
   Status: Deploying...

   ✓ Building... done (45s)
   ✓ Deploying... done (30s)

   Preview URL: https://my-app-user-auth-123.vercel.app
   ```

### Release Management
| Command | Action |
|---------|--------|
| `pa:version` | Show current version |
| `pa:version-bump "type"` | Bump version (major/minor/patch) |
| `pa:tag` | Create git tag for release |
| `pa:tag "version"` | Create specific version tag |
| `pa:publish` | Publish package to registry |
| `pa:publish-dry` | Dry run of publish |

**How to execute Release commands:**

For `pa:version`:
1. Read version from package.json or equivalent
2. Show version info:
   ```
   Version Info
   ════════════

   Current: 1.2.3
   Last Release: 1.2.2 (2024-03-01)

   Unreleased Changes:
   • 5 features
   • 3 bug fixes
   • 2 breaking changes

   Suggested Next:
   • Major (2.0.0) - has breaking changes
   • Minor (1.3.0) - new features
   • Patch (1.2.4) - bug fixes only
   ```

For `pa:version-bump`:
1. Determine bump type (major/minor/patch)
2. Update version in:
   - package.json
   - package-lock.json
   - Other version files
3. Update CHANGELOG.md with new version
4. Show changes:
   ```
   Version Bump: 1.2.3 → 1.3.0
   ═══════════════════════════

   Updated files:
   • package.json
   • package-lock.json
   • CHANGELOG.md

   Next steps:
   • pa:tag 1.3.0 - Create release tag
   • pa:publish - Publish to npm
   ```

For `pa:tag`:
1. Create annotated git tag
2. Include release notes in tag message
3. Optionally push to remote:
   ```
   Created Tag: v1.3.0
   ═══════════════════

   Tag: v1.3.0
   Message: Release 1.3.0 - User Authentication

   Included:
   • feat: Add user authentication
   • feat: Add password reset
   • fix: Login validation

   Push to remote? (git push origin v1.3.0)
   ```

For `pa:publish`:
1. Run pre-publish checks:
   - Tests pass
   - Build succeeds
   - No uncommitted changes
   - Version is tagged
2. Show publish preview
3. Publish to registry:
   ```
   Publishing: mypackage@1.3.0
   ═══════════════════════════

   Pre-checks:
   ✓ Tests passing
   ✓ Build successful
   ✓ Clean working directory
   ✓ Version tagged (v1.3.0)

   Publishing to npm...
   ✓ Published successfully!

   https://www.npmjs.com/package/mypackage
   ```

### Code Review & PR
| Command | Action |
|---------|--------|
| `pa:review-request` | Request code review from team |
| `pa:review-request "user"` | Request review from specific user |
| `pa:review-comments` | Show PR review comments |
| `pa:review-comments "pr"` | Comments for specific PR |
| `pa:review-approve` | Approve current PR |
| `pa:review-approve "pr"` | Approve specific PR |

**How to execute Code Review commands:**

For `pa:review-request`:
1. Detect current branch and PR status
2. If no PR exists, suggest creating one first
3. Get team members from config or git history
4. Request review:
   ```
   Review Request
   ══════════════

   PR: #123 - Add user authentication
   Branch: feature/user-auth

   Requesting review from:
   • @tech-lead (suggested - code owner)
   • @senior-dev (suggested - recent contributor)

   Select reviewers or type username:
   > @tech-lead, @qa-engineer

   ✓ Review requested from 2 reviewers
   ```

For `pa:review-comments`:
1. Get PR comments from GitHub/GitLab
2. Group by file and status:
   ```
   PR Review Comments
   ══════════════════

   PR #123: Add user authentication
   Status: Changes requested (2 pending)

   src/auth/login.ts:
   ├─ Line 45 [PENDING] @tech-lead:
   │  "Consider using bcrypt instead of md5 for hashing"
   │
   └─ Line 78 [RESOLVED] @qa-engineer:
      "Add error handling for network failures"

   src/api/users.ts:
   └─ Line 12 [PENDING] @tech-lead:
      "Missing input validation"

   Actions:
   • Reply to comment: pa:review-reply "comment-id" "response"
   • Resolve comment: pa:review-resolve "comment-id"
   ```

For `pa:review-approve`:
1. Check all required checks pass
2. Verify no pending comments
3. Approve PR:
   ```
   PR Approval
   ═══════════

   PR #123: Add user authentication

   Checks:
   ✓ Tests passing
   ✓ Build successful
   ✓ No conflicts
   ⚠ 1 pending comment (optional)

   Approve anyway? [y/N]

   ✓ PR approved!
   Ready to merge.
   ```

### Architecture
| Command | Action |
|---------|--------|
| `pa:architecture` | Show architecture overview |
| `pa:architecture "module"` | Architecture for specific module |
| `pa:architecture-diagram` | Generate architecture diagram |
| `pa:architecture-export` | Export architecture docs |

**How to execute Architecture commands:**

For `pa:architecture`:
1. Analyze project structure
2. Identify architectural patterns
3. Generate overview:
   ```
   Architecture Overview
   ═════════════════════

   Project: my-app
   Type: Full-stack Next.js
   Pattern: Clean Architecture + Feature-based

   Layers:
   ┌─────────────────────────────────────────┐
   │  Presentation (app/, components/)       │
   │  ┌───────────────────────────────────┐  │
   │  │  Application (services/, hooks/)  │  │
   │  │  ┌─────────────────────────────┐  │  │
   │  │  │  Domain (types/, entities/) │  │  │
   │  │  └─────────────────────────────┘  │  │
   │  └───────────────────────────────────┘  │
   └─────────────────────────────────────────┘

   Key Components:
   • API Routes: /app/api/* (15 endpoints)
   • Pages: /app/* (12 pages)
   • Components: /components/* (45 components)
   • Services: /services/* (8 services)

   Dependencies:
   • Database: PostgreSQL via Prisma
   • Auth: NextAuth.js with JWT
   • State: Zustand + React Query
   • Styling: Tailwind CSS

   Patterns Detected:
   • Repository Pattern (services/)
   • Factory Pattern (components/forms/)
   • Singleton (lib/prisma.ts)
   ```

For `pa:architecture-diagram`:
1. Generate Mermaid diagram from codebase
2. Show component relationships:
   ```mermaid
   graph TB
     subgraph Presentation
       Pages[Pages]
       Components[Components]
     end

     subgraph Application
       Services[Services]
       Hooks[Hooks]
     end

     subgraph Infrastructure
       API[API Routes]
       DB[(Database)]
     end

     Pages --> Components
     Pages --> Hooks
     Hooks --> Services
     Services --> API
     API --> DB
   ```
3. Save to `./docs/architecture.md`

### API Testing
| Command | Action |
|---------|--------|
| `pa:api-test` | Test API endpoints |
| `pa:api-test "endpoint"` | Test specific endpoint |
| `pa:curl` | Generate curl commands |
| `pa:curl "endpoint"` | Curl for specific endpoint |
| `pa:postman` | Generate Postman collection |
| `pa:postman-export` | Export to Postman file |

**How to execute API Testing commands:**

For `pa:api-test`:
1. Discover API endpoints from routes
2. Generate and run tests:
   ```
   API Test Results
   ════════════════

   Testing: /api/*
   Environment: development (localhost:3000)

   GET /api/users
   ├─ Status: 200 OK ✓
   ├─ Time: 45ms
   └─ Response: Array[10 items]

   POST /api/users
   ├─ Status: 201 Created ✓
   ├─ Time: 120ms
   └─ Response: { id: "123", name: "Test" }

   GET /api/users/:id
   ├─ Status: 200 OK ✓
   ├─ Time: 32ms
   └─ Response: { id: "1", name: "John" }

   DELETE /api/users/:id
   ├─ Status: 401 Unauthorized ✗
   ├─ Time: 15ms
   └─ Error: Missing auth token

   Summary: 3/4 passed (75%)
   ```

For `pa:curl`:
1. Analyze API routes and generate curl commands:
   ```
   Generated Curl Commands
   ═══════════════════════

   # List users
   curl -X GET http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN"

   # Create user
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"name": "John", "email": "john@example.com"}'

   # Get user by ID
   curl -X GET http://localhost:3000/api/users/123 \
     -H "Authorization: Bearer $TOKEN"

   Saved to: ./docs/curl-commands.sh
   ```

For `pa:postman`:
1. Scan API routes and extract endpoints
2. Generate Postman collection:
   ```
   Postman Collection Generated
   ════════════════════════════

   Collection: my-app API
   Endpoints: 15

   Folders:
   ├─ Auth (3 endpoints)
   │  ├─ POST /api/auth/login
   │  ├─ POST /api/auth/register
   │  └─ POST /api/auth/logout
   ├─ Users (5 endpoints)
   │  ├─ GET /api/users
   │  ├─ POST /api/users
   │  ├─ GET /api/users/:id
   │  ├─ PUT /api/users/:id
   │  └─ DELETE /api/users/:id
   └─ Posts (7 endpoints)
      └─ ...

   Saved to: ./docs/postman-collection.json

   Import: File > Import in Postman
   ```

### Health & Monitoring
| Command | Action |
|---------|--------|
| `pa:health` | Project health check |
| `pa:health-full` | Comprehensive health report |
| `pa:monitor` | Show monitoring status |
| `pa:monitor "service"` | Monitor specific service |
| `pa:uptime` | Service uptime check |

**How to execute Health & Monitoring commands:**

For `pa:health`:
1. Check various project health indicators:
   ```
   Project Health Check
   ════════════════════

   Overall: 85% Healthy ████████░░

   Code Quality:
   ✓ Linting: No errors
   ✓ Type checking: No errors
   ⚠ Test coverage: 72% (target: 80%)
   ✓ No security vulnerabilities

   Dependencies:
   ✓ All dependencies installed
   ⚠ 3 outdated packages
   ✓ No security advisories

   Configuration:
   ✓ Environment variables set
   ✓ Config files valid
   ⚠ Missing .env.example

   Git Status:
   ✓ Clean working directory
   ✓ Up to date with remote
   ✓ No merge conflicts

   Performance:
   ✓ Bundle size: 245KB (limit: 500KB)
   ✓ Build time: 12s
   ⚠ Lighthouse score: 78 (target: 90)

   Issues Found: 4
   • Test coverage below 80%
   • 3 outdated packages
   • Missing .env.example
   • Lighthouse score below target
   ```

For `pa:monitor`:
1. Check running services and status:
   ```
   Service Monitor
   ═══════════════

   Services:
   ┌────────────────┬──────────┬─────────┬────────────┐
   │ Service        │ Status   │ Uptime  │ Health     │
   ├────────────────┼──────────┼─────────┼────────────┤
   │ App (Next.js)  │ Running  │ 2h 15m  │ Healthy    │
   │ Database       │ Running  │ 5d 3h   │ Healthy    │
   │ Redis Cache    │ Running  │ 5d 3h   │ Healthy    │
   │ Worker         │ Stopped  │ -       │ ⚠ Down     │
   └────────────────┴──────────┴─────────┴────────────┘

   Recent Events:
   • 10:30 - App restarted (deployment)
   • 09:15 - Worker stopped (manual)
   • Yesterday - Database backup completed

   Alerts:
   ⚠ Worker service is not running
   ```

For `pa:uptime`:
1. Check endpoint availability:
   ```
   Uptime Check
   ════════════

   Checking endpoints...

   Production (https://myapp.com):
   ├─ / (homepage): 200 OK (125ms) ✓
   ├─ /api/health: 200 OK (45ms) ✓
   ├─ /api/users: 200 OK (89ms) ✓
   └─ /dashboard: 200 OK (156ms) ✓

   Staging (https://staging.myapp.com):
   ├─ / (homepage): 200 OK (145ms) ✓
   └─ /api/health: 200 OK (52ms) ✓

   All endpoints responding ✓
   Average response time: 102ms
   ```

### Quick Actions
| Command | Action |
|---------|--------|
| `pa:quick` | Show quick actions menu |
| `pa:quick "action"` | Execute quick action |
| `pa:alias` | Manage command aliases |
| `pa:alias-add "name" "command"` | Add new alias |
| `pa:alias-remove "name"` | Remove alias |

**How to execute Quick Actions commands:**

For `pa:quick`:
1. Show context-aware quick actions:
   ```
   Quick Actions
   ═════════════

   Based on current context (feature/user-auth):

   Development:
   [1] Run tests for current feature
   [2] Check code coverage
   [3] Lint and fix

   Git:
   [4] Commit all changes
   [5] Push to remote
   [6] Create PR

   Quality:
   [7] Run full QA check
   [8] Security scan
   [9] Performance audit

   Documentation:
   [10] Update docs for changes

   Select action (1-10) or type command:
   > 6

   Creating PR...
   ```

For `pa:alias`:
1. List and manage command aliases:
   ```
   Command Aliases
   ═══════════════

   Current Aliases:
   ┌──────────┬───────────────────────────┐
   │ Alias    │ Command                   │
   ├──────────┼───────────────────────────┤
   │ pa:c     │ pa:commit                 │
   │ pa:pr    │ pa:github-pr              │
   │ pa:cov   │ pa:coverage               │
   │ pa:sec   │ pa:security-scan          │
   │ pa:up    │ pa:deps-outdated          │
   └──────────┴───────────────────────────┘

   Add alias: pa:alias-add "name" "command"
   Remove: pa:alias-remove "name"

   Built-in aliases cannot be modified:
   pa:f, pa:s, pa:h, pa:d, pa:t, pa:q, pa:a, pa:r, pa:p, pa:i
   ```

For `pa:alias-add`:
1. Add custom alias:
   ```
   Adding Alias
   ════════════

   Alias: pa:ship
   Command: pa:test && pa:build && pa:deploy

   ✓ Alias created!

   Usage: pa:ship
   Runs: pa:test && pa:build && pa:deploy
   ```

### Mobile Test Suite (React Native / Mobile Apps)
| Command | Action |
|---------|--------|
| `pa:test-mobile` | Run full mobile test suite |
| `pa:test-mobile "feature"` | Test specific feature |
| `pa:test-visual` | Visual/design comparison testing |
| `pa:test-auto-fix` | Auto-fix failing tests |
| `pa:test-loop` | Test → Fix → Retest loop until success |
| `pa:compare-figma` | Compare UI against Figma design |
| `pa:compare-image "path"` | Compare UI against image/sketch |
| `pa:screenshot` | Take app screenshots for comparison |

**How to execute Mobile Test Suite commands:**

For `pa:test-mobile`:
1. Run comprehensive mobile test suite:
   ```
   Mobile Test Suite
   ═════════════════

   Running full test suite for: feature/user-auth

   Phase 1: Unit Tests
   ───────────────────
   ✓ AuthService.login() - 5 tests passed
   ✓ AuthService.logout() - 3 tests passed
   ✓ TokenManager - 8 tests passed
   ✓ UserStore - 12 tests passed

   Phase 2: Component Tests
   ────────────────────────
   ✓ LoginScreen - renders correctly
   ✓ LoginScreen - validates email format
   ✓ LoginScreen - shows error on invalid credentials
   ✓ SignupScreen - all fields required
   ✓ ProfileScreen - displays user data

   Phase 3: Integration Tests
   ──────────────────────────
   ✓ Login flow end-to-end
   ✓ Token refresh on expiry
   ✓ Logout clears all data
   ✗ FAILED: Password reset flow
     → Error: Reset email not sent

   Phase 4: E2E Tests (Maestro/Detox)
   ──────────────────────────────────
   ✓ User can login with valid credentials
   ✓ User sees error with invalid password
   ✗ FAILED: User can reset password
     → Button not found: "Send Reset Email"

   Phase 5: Visual Tests
   ─────────────────────
   ✓ LoginScreen matches design
   ✗ FAILED: SignupScreen has visual differences
     → Button color: expected #007AFF, got #0066CC
     → Font size: expected 16px, got 14px

   ══════════════════════════════════════════
   RESULTS: 35/38 tests passed (3 failed)
   ══════════════════════════════════════════

   Failed Tests:
   1. Integration: Password reset flow
   2. E2E: User can reset password
   3. Visual: SignupScreen design mismatch

   Run `pa:test-auto-fix` to automatically fix these issues.
   ```

2. Generate detailed test report at `./proagents/test-reports/mobile-{timestamp}.md`

For `pa:test-visual`:
1. Take screenshots of all screens/components
2. Compare against design references:
   ```
   Visual Design Testing
   ═════════════════════

   Comparing app UI against design references...

   Design Source: ./designs/ (Figma exports)

   Screen: LoginScreen
   ───────────────────
   ✓ Layout matches design
   ✓ Colors match design tokens
   ✓ Typography correct
   ✓ Spacing/padding correct
   ✓ Button styles match

   Screen: SignupScreen
   ────────────────────
   ✗ MISMATCH DETECTED

   Differences found:
   ┌─────────────────┬──────────────┬──────────────┐
   │ Element         │ Expected     │ Actual       │
   ├─────────────────┼──────────────┼──────────────┤
   │ Submit Button   │ #007AFF      │ #0066CC      │
   │ Title Font      │ 24px Bold    │ 22px Regular │
   │ Input Height    │ 48px         │ 44px         │
   │ Bottom Margin   │ 16px         │ 12px         │
   └─────────────────┴──────────────┴──────────────┘

   Screenshot saved: ./proagents/test-reports/visual/signup-diff.png

   Screen: ProfileScreen
   ─────────────────────
   ✓ All elements match design

   ══════════════════════════════════════════
   VISUAL TEST RESULTS: 2/3 screens passed
   ══════════════════════════════════════════

   Run `pa:test-auto-fix` to fix visual issues automatically.
   ```

For `pa:test-auto-fix`:
1. Analyze failing tests
2. Identify root cause
3. Generate and apply fixes:
   ```
   Auto-Fix Mode
   ═════════════

   Analyzing 3 failing tests...

   Fix 1: Password reset flow
   ──────────────────────────
   Root Cause: API endpoint missing in AuthService

   Applying fix to: src/services/AuthService.ts
   + async resetPassword(email: string): Promise<void> {
   +   const response = await api.post('/auth/reset-password', { email });
   +   if (!response.ok) throw new Error('Reset failed');
   + }

   ✓ Fix applied

   Fix 2: Reset button not found
   ─────────────────────────────
   Root Cause: Button testID missing

   Applying fix to: src/screens/ResetPasswordScreen.tsx
   - <Button title="Send Reset Email" onPress={handleReset} />
   + <Button
   +   testID="send-reset-email-button"
   +   title="Send Reset Email"
   +   onPress={handleReset}
   + />

   ✓ Fix applied

   Fix 3: SignupScreen visual mismatch
   ────────────────────────────────────
   Root Cause: Style values don't match design tokens

   Applying fix to: src/screens/SignupScreen.styles.ts
   - submitButton: { backgroundColor: '#0066CC' }
   + submitButton: { backgroundColor: '#007AFF' }

   - title: { fontSize: 22, fontWeight: 'normal' }
   + title: { fontSize: 24, fontWeight: 'bold' }

   - input: { height: 44, marginBottom: 12 }
   + input: { height: 48, marginBottom: 16 }

   ✓ Fix applied

   ══════════════════════════════════════════
   AUTO-FIX COMPLETE: 3/3 issues fixed
   ══════════════════════════════════════════

   Running verification tests...
   ```

For `pa:test-loop`:
1. Run complete Test → Fix → Retest cycle:
   ```
   Test Loop Mode
   ══════════════

   Starting automated test-fix-retest cycle...
   Max iterations: 5

   ┌─────────────────────────────────────────────────────┐
   │ ITERATION 1                                         │
   ├─────────────────────────────────────────────────────┤
   │ Running tests...                                    │
   │ Results: 35/38 passed (3 failed)                   │
   │                                                     │
   │ Analyzing failures...                               │
   │ Applying auto-fixes...                              │
   │ Fixes applied: 3                                    │
   └─────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────┐
   │ ITERATION 2                                         │
   ├─────────────────────────────────────────────────────┤
   │ Running tests...                                    │
   │ Results: 37/38 passed (1 failed)                   │
   │                                                     │
   │ Analyzing failures...                               │
   │ New issue: TypeScript type error after fix         │
   │ Applying auto-fixes...                              │
   │ Fixes applied: 1                                    │
   └─────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────┐
   │ ITERATION 3                                         │
   ├─────────────────────────────────────────────────────┤
   │ Running tests...                                    │
   │ Results: 38/38 passed (0 failed)                   │
   │                                                     │
   │ ✓ ALL TESTS PASSING!                               │
   └─────────────────────────────────────────────────────┘

   ══════════════════════════════════════════════════════
   TEST LOOP COMPLETE
   ══════════════════════════════════════════════════════

   Summary:
   ────────
   Iterations: 3
   Initial failures: 3
   Fixes applied: 4
   Final status: ALL PASSING ✓

   Files modified:
   • src/services/AuthService.ts
   • src/screens/ResetPasswordScreen.tsx
   • src/screens/SignupScreen.styles.ts
   • src/types/auth.ts

   Test report: ./proagents/test-reports/test-loop-{timestamp}.md

   Ready for commit? (y/n)
   ```

For `pa:compare-figma`:
1. Connect to Figma API or use exported frames
2. Extract design specifications
3. Compare with actual app:
   ```
   Figma Design Comparison
   ═══════════════════════

   Design Source: [Figma Link or ./designs/figma-export/]

   Extracting design tokens from Figma...
   ✓ Colors extracted
   ✓ Typography extracted
   ✓ Spacing system extracted
   ✓ Component specs extracted

   Comparing: LoginScreen
   ──────────────────────

   Layout Comparison:
   ┌────────────────────┬────────────────────┐
   │   Figma Design     │   App Screenshot   │
   │   ┌──────────┐     │   ┌──────────┐     │
   │   │  Logo    │     │   │  Logo    │ ✓   │
   │   ├──────────┤     │   ├──────────┤     │
   │   │  Email   │     │   │  Email   │ ✓   │
   │   │  Input   │     │   │  Input   │     │
   │   ├──────────┤     │   ├──────────┤     │
   │   │ Password │     │   │ Password │ ✓   │
   │   │  Input   │     │   │  Input   │     │
   │   ├──────────┤     │   ├──────────┤     │
   │   │  Login   │     │   │  Login   │ ✗   │
   │   │  Button  │     │   │  Button  │     │
   │   └──────────┘     │   └──────────┘     │
   └────────────────────┴────────────────────┘

   Detailed Comparison:
   ┌───────────────┬─────────────┬─────────────┬────────┐
   │ Element       │ Figma       │ App         │ Status │
   ├───────────────┼─────────────┼─────────────┼────────┤
   │ Logo Size     │ 120x40      │ 120x40      │ ✓      │
   │ Input Height  │ 48px        │ 48px        │ ✓      │
   │ Input Border  │ 1px #E0E0E0 │ 1px #E0E0E0 │ ✓      │
   │ Button Color  │ #007AFF     │ #0056B3     │ ✗      │
   │ Button Radius │ 8px         │ 4px         │ ✗      │
   │ Button Height │ 52px        │ 48px        │ ✗      │
   │ Vertical Gap  │ 16px        │ 12px        │ ✗      │
   └───────────────┴─────────────┴─────────────┴────────┘

   Issues Found: 4

   Auto-fix available? Yes
   Run `pa:test-auto-fix` to apply design corrections.
   ```

For `pa:compare-image "path"`:
1. Load reference image (sketch, screenshot, mockup)
2. Use visual comparison:
   ```
   Image Comparison
   ════════════════

   Reference: ./designs/sketch-login.png
   App Screen: LoginScreen

   Analyzing reference image...
   ✓ Detected UI elements
   ✓ Extracted layout structure
   ✓ Identified colors and typography

   Taking app screenshot...
   ✓ Screenshot captured

   Visual Diff Analysis:
   ─────────────────────

   Overall Match: 87%

   Differences Detected:

   1. Header Section (Region: 0,0 to 375,100)
      • Logo position: slightly lower than reference
      • Background: matches ✓

   2. Form Section (Region: 0,100 to 375,350)
      • Input fields: match ✓
      • Labels: font slightly smaller
      • Spacing: compressed by ~4px

   3. Button Section (Region: 0,350 to 375,450)
      • Color: differs by 15% (darker in app)
      • Corner radius: sharper in app
      • Shadow: missing in app

   Diff image saved: ./proagents/test-reports/visual/login-diff-overlay.png

   ┌─────────────────────────────────────────────┐
   │ [Reference]        │ [App]        │ [Diff] │
   │ Expected design    │ Actual app   │ Δ      │
   └─────────────────────────────────────────────┘

   Suggested fixes generated.
   Run `pa:test-auto-fix` to apply.
   ```

For `pa:screenshot`:
1. Capture screenshots of all app screens:
   ```
   Screenshot Capture
   ══════════════════

   Detecting available screens...

   Found 12 screens in navigation:

   Capturing screenshots...

   ✓ LoginScreen → ./proagents/screenshots/LoginScreen.png
   ✓ SignupScreen → ./proagents/screenshots/SignupScreen.png
   ✓ HomeScreen → ./proagents/screenshots/HomeScreen.png
   ✓ ProfileScreen → ./proagents/screenshots/ProfileScreen.png
   ✓ SettingsScreen → ./proagents/screenshots/SettingsScreen.png
   ✓ NotificationsScreen → ./proagents/screenshots/NotificationsScreen.png
   ... (6 more)

   Component screenshots:
   ✓ Button variants → ./proagents/screenshots/components/Button.png
   ✓ Input variants → ./proagents/screenshots/components/Input.png
   ✓ Card variants → ./proagents/screenshots/components/Card.png

   ══════════════════════════════════════════
   Screenshots saved: 15 images
   Location: ./proagents/screenshots/
   ══════════════════════════════════════════

   Use these for:
   • Visual regression testing
   • Design comparison with `pa:compare-image`
   • Documentation
   ```

**Mobile Test Configuration:**
Add to `proagents.config.yaml`:
```yaml
mobile_testing:
  platform: react-native  # or flutter, native

  test_frameworks:
    unit: jest
    component: "@testing-library/react-native"
    e2e: maestro  # or detox, appium

  visual_testing:
    enabled: true
    design_source: figma  # or ./designs/
    figma_file_id: "your-figma-file-id"  # if using Figma
    threshold: 0.95  # 95% match required

  auto_fix:
    enabled: true
    max_iterations: 5
    require_approval: false  # true = ask before applying fixes

  screenshot:
    output_dir: ./proagents/screenshots
    devices:
      - iPhone 14 Pro
      - Pixel 7

  test_on:
    feature_complete: true  # auto-run tests when feature done
    bug_fix: true  # auto-run tests after bug fix
    pre_commit: false  # run before git commit
```

**Test Report Structure:**
```
./proagents/test-reports/
├── mobile-2024-03-06-1500.md      # Full test report
├── visual/
│   ├── LoginScreen-diff.png       # Visual diff images
│   ├── SignupScreen-diff.png
│   └── comparison-report.md
├── coverage/
│   └── coverage-report.html       # Test coverage
└── auto-fix-log.md                # Log of all auto-fixes
```

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
