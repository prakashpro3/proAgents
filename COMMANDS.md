# ProAgents Command Reference

Complete reference for CLI and AI (`pa:`) commands. For quick start, see [README.md](README.md).

---

## Table of Contents

### CLI Commands
- [Initialization](#initialization)
- [Features & Fixes](#features--fixes)
- [Maintenance](#maintenance)
- [Release Notes](#release-notes)
- [Updating ProAgents](#updating-proagents)
- [AI Platforms](#ai-platforms)
- [Configuration](#configuration)
- [Statistics & Monitoring](#statistics--monitoring)
- [Changelog Management](#changelog-management)
- [Backup & Restore](#backup--restore)
- [Shell Completions](#shell-completions)
- [Quick File Access](#quick-file-access)

### AI Commands (pa:)
- [Quick Aliases](#quick-aliases)
- [Core Commands](#core-commands)
- [Workflow Phase Commands](#workflow-phase-commands)
- [Documentation](#documentation)
- [Quality & Testing](#quality--testing)
- [Cross-AI Continuity](#cross-ai-continuity)
- [Learning & Tracking](#learning--tracking)
- [Navigation & Flow](#navigation--flow)
- [Context & History](#context--history)
- [Sprint & Estimation](#sprint--estimation)
- [Code Quality](#code-quality)
- [Code Generation](#code-generation)
- [Refactoring](#refactoring)
- [Debug & Logs](#debug--logs)
- [Testing Advanced](#testing-advanced)
- [Platform-Specific Test Suites](#platform-specific-test-suites)
- [Custom Commands](#custom-commands)

---

## CLI Commands

Run these in your terminal:

### Initialization

```bash
npx proagents init                    # Initialize in project
```

### Features & Fixes

```bash
proagents feature start "name"        # Start a new feature
proagents feature status              # Check feature status
proagents fix "bug description"       # Quick bug fix mode
```

### Maintenance

```bash
proagents doctor                      # Health check installation
proagents doctor --full               # Extended checks (branches, logs, features)
proagents status                      # Show ProAgents status
proagents version                     # Show detailed version info
```

### Release Notes

```bash
proagents release                     # Interactive release note generator
proagents release -t detailed         # Full comprehensive notes
proagents release -t short            # Quick summary
proagents release -t client           # Business-focused, non-technical
proagents release -t developer        # Technical details for devs
proagents release -t hotfix           # Urgent patch notes
proagents release -t prerelease       # Beta/RC notes
proagents release --include fixes     # Only include bug fixes
proagents release --include features  # Only include features
proagents release --append -o FILE    # Append to existing notes
proagents release --bump              # Suggest version bump
proagents release --module auth       # Filter by module name
proagents release --changelog         # Update CHANGELOG.md
proagents release --tag               # Create git tag
proagents release --json              # JSON output for CI/CD
```

### Updating ProAgents

```bash
npx proagents init                    # Smart update (recommended)
proagents upgrade                     # Full replace (use with caution)
```

| Command | What It Does | When to Use |
|---------|--------------|-------------|
| `npx proagents init` | Updates framework, merges config, preserves your work | Regular updates |
| `proagents upgrade` | Removes everything, installs fresh | Complete reset |

**What's preserved with `init`:**
- `active-features/` - Your work in progress
- `changelog/` - Your change history
- `worklog/` - Your work context
- `.learning/` - Learned patterns
- `proagents.config.yaml` - Your values kept, new options merged

### AI Platforms

```bash
proagents ai list                     # List installed AI platforms
proagents ai add                      # Add more platforms
proagents ai remove                   # Remove platforms
```

### Configuration

```bash
proagents config show                 # Show current config
proagents config setup                # Interactive config wizard
proagents config export               # Export config for sharing
proagents config import <file>        # Import config from file
```

### Statistics & Monitoring

```bash
proagents stats                       # Show project & AI usage stats
proagents stats --json                # JSON output for scripting
```

### Changelog Management

```bash
proagents changelog view              # View recent changelog entries
proagents changelog add "entry"       # Add new changelog entry
proagents changelog list              # List available changelogs
proagents changelog export            # Export to CHANGELOG.md
proagents changelog git               # View git history as changelog
```

### Backup & Restore

```bash
proagents restore <backup.json>       # Restore from uninstall backup
```

### Shell Completions

```bash
proagents completion bash             # Generate bash completions
proagents completion zsh              # Generate zsh completions
proagents completion fish             # Generate fish completions
```

### Quick File Access

```bash
proagents open                        # Show available shortcuts
proagents open config                 # Open proagents.config.yaml
proagents open changelog              # Open recent changelog
proagents open activity               # Open activity log
proagents open context                # Open worklog context
```

### Other

```bash
proagents docs                        # Open documentation
proagents commands                    # Show all commands
proagents uninstall                   # Remove ProAgents
```

---

# AI Commands (pa:)

Type these in any AI assistant (Claude, ChatGPT, Gemini, Cursor, etc.)

---

## Quick Aliases

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
| `pa:rev` | `pa:review` |
| `pa:dbg` | `pa:debug` |
| `pa:l` | `pa:logs` |

---

## Core Commands

| Command | Description |
|---------|-------------|
| `pa:feature "name"` | Start new feature workflow (all phases) |
| `pa:fix "description"` | Quick bug fix mode |
| `pa:status` | Show current progress |
| `pa:help` | Show all commands |

---

## Project Setup

| Command | Description |
|---------|-------------|
| `pa:project-setup` | Interactive setup wizard (new or existing projects) |
| `pa:setup` | Alias for pa:project-setup |
| `pa:setup --preset [name]` | Use quick preset (mobile-mvp, saas, etc.) |
| `pa:setup --analyze` | Analyze existing project only |
| `pa:setup --resume` | Resume interrupted setup |
| `pa:setup --clear-progress` | Clear saved progress and start fresh |

**Features:**
- Quick Presets - Instant setup for common stacks (Mobile MVP, SaaS, E-commerce, etc.)
- Idea-First Mode - Describe your idea, AI suggests tech stack with comparison table
- Full Automation - Installs packages, creates folders, generates docs
- Resume Support - Auto-saves progress, resume if interrupted
- Merge Strategy - Updates existing docs without overwriting custom content
- Works for both new projects and existing codebases

---

## Research & Development

| Command | Description |
|---------|-------------|
| `pa:rnd` | Interactive R&D workflow (compare, prototype, explore) |
| `pa:research` | Alias for pa:rnd |
| `pa:rnd-compare` | Direct to comparison mode |
| `pa:rnd-poc` | Direct to prototype mode |
| `pa:rnd-explore` | Direct to exploration mode |
| `pa:rnd --quick` | Quick 5-minute research |
| `pa:rnd --resume` | Resume interrupted session |
| `pa:rnd --clear` | Clear saved progress |

**Features:**
- Compare Options - Side-by-side library/framework comparisons with weighted scoring
- Build POC - Quick proof-of-concept in isolated `./poc/` folder
- Explore Solutions - Research and document findings
- Web Search - Verify latest package stats (stars, downloads, releases)
- Cost Estimator - Monthly costs at different user scales
- Deprecation Alerts - Warn about deprecated/insecure packages
- Comparison Tables - Visual side-by-side with recommendations
- Past Decision Recall - Surface previous decisions on similar topics
- Scope Guard - Alert when research drifts off-topic
- Resume Support - Auto-saves progress
- Tags & Categories - Organize research by topic
- Archive System - Auto-archive old research after 6 months
- Review Reminders - Set reminder to revisit decisions
- Next Phase Integration - After RND, trigger pa:feature or pa:plan

**Outputs:**
- Comparison docs: `docs/research/comparisons/`
- Research findings: `docs/research/findings/`
- Research index: `docs/research/INDEX.md`
- Bookmarks: `docs/research/BOOKMARKS.md`
- POC code: `./poc/[name]/`

---

## Workflow Phase Commands

| Command | Phase | Description |
|---------|-------|-------------|
| `pa:analyze` | Analysis | Deep codebase analysis |
| `pa:requirements` | Requirements | Gather feature requirements |
| `pa:design` | Design | UI/Architecture design |
| `pa:plan` | Planning | Create implementation plan |
| `pa:implement` | Implementation | Execute code changes |
| `pa:test` | Testing | Create and run tests |
| `pa:review` | Review | Code review workflow |
| `pa:doc` | Documentation | Generate documentation |
| `pa:deploy` | Deployment | Deployment preparation |

---

## Documentation

| Command | Description |
|---------|-------------|
| `pa:doc` | Generate documentation |
| `pa:changelog` | Update CHANGELOG.md |
| `pa:release` | Generate release notes |

---

## Quality & Testing

| Command | Description |
|---------|-------------|
| `pa:qa` | Run quality assurance checks |
| `pa:rollback` | Rollback procedures |

---

## Cross-AI Continuity

| Command | Description |
|---------|-------------|
| `pa:sync` | **Run first** - Load project context |
| `pa:resume` | Quick resume - shows last session + next action |
| `pa:session-start` | Begin new work session |
| `pa:session-end` | Finalize session, update logs |
| `pa:conflict-check` | Check if files modified by other AI |
| `pa:undo-last` | Undo last AI's entire session (revert all changes) |
| `pa:undo-file "path"` | Undo changes to specific file |
| `pa:changelog` | Update all changelogs |
| `pa:changelog --from-git` | Auto-populate from git commits |
| `pa:changelog-feature X` | View feature changelog |
| `pa:changelog-module X` | View module changelog |
| `pa:history` | View command history |
| `pa:activity` | Show recent AI activity |
| `pa:handoff` | Create handoff notes |

---

## Learning & Tracking

| Command | Description |
|---------|-------------|
| `pa:decision "title"` | Log architectural decision |
| `pa:decisions` | Show all decisions |
| `pa:error "description"` | Log error and solution |
| `pa:errors` | Search past errors |
| `pa:feedback "description"` | Log feedback for AI learning |

---

## AI Platform Management

| Command | Description |
|---------|-------------|
| `pa:ai-list` | List installed AI platforms |
| `pa:ai-add` | Add more AI platforms |
| `pa:ai-sync` | Sync config with files |

---

## Navigation & Flow

| Command | Description |
|---------|-------------|
| `pa:next` | Show next step in workflow |
| `pa:resume` | Resume paused feature |
| `pa:skip` | Skip current phase |
| `pa:back` | Go to previous phase |
| `pa:progress` | Show visual progress bar |

---

## Context & History

| Command | Description |
|---------|-------------|
| `pa:context` | View project context |
| `pa:diff` | Show changes since last session |
| `pa:history` | Show command history |
| `pa:checkpoint` | Create restore point |
| `pa:undo` | Undo last action |

---

## Sprint & Estimation

| Command | Description |
|---------|-------------|
| `pa:sprint-start` | Start new sprint |
| `pa:sprint-end` | End sprint with summary |
| `pa:estimate` | Estimate task complexity |
| `pa:velocity` | Show velocity metrics |

---

## Integration

| Command | Description |
|---------|-------------|
| `pa:github` | GitHub integration |
| `pa:github-pr` | Create pull request |
| `pa:jira` | Sync with Jira |
| `pa:notify` | Send notification |

---

## Code Quality

| Command | Description |
|---------|-------------|
| `pa:metrics` | Code quality metrics |
| `pa:coverage` | Test coverage report |
| `pa:deps` | Analyze dependencies |
| `pa:deps-outdated` | Find outdated packages |
| `pa:deps-security` | Security scan |

---

## Code Generation

| Command | Description |
|---------|-------------|
| `pa:generate` | Show generation options |
| `pa:generate-component` | Generate component |
| `pa:generate-api` | Generate API endpoint |
| `pa:generate-test` | Generate test file |

---

## Refactoring

| Command | Description |
|---------|-------------|
| `pa:refactor` | Suggest refactoring |
| `pa:rename` | Rename across codebase |
| `pa:extract` | Extract function/component |
| `pa:cleanup` | Remove dead code |

---

## Time Tracking

| Command | Description |
|---------|-------------|
| `pa:time-start` | Start time tracking |
| `pa:time-stop` | Stop tracking |
| `pa:time-report` | Show time report |

---

## Environment & Database

| Command | Description |
|---------|-------------|
| `pa:env-check` | Verify environment |
| `pa:secrets-scan` | Scan for secrets |
| `pa:db-migrate` | Run migrations |
| `pa:db-seed` | Seed database |

---

## Accessibility & Performance

| Command | Description |
|---------|-------------|
| `pa:a11y` | Accessibility audit |
| `pa:lighthouse` | Lighthouse audit |
| `pa:perf` | Performance analysis |

---

## Export & Learning

| Command | Description |
|---------|-------------|
| `pa:export` | Export config/data |
| `pa:import` | Import data |
| `pa:backup` | Backup proagents |
| `pa:learn` | Teach AI a pattern |
| `pa:suggestions` | Show AI suggestions |

---

## API & Documentation

| Command | Description |
|---------|-------------|
| `pa:api-docs` | Generate OpenAPI/Swagger docs |
| `pa:storybook` | Generate Storybook stories |
| `pa:readme` | Auto-generate/update README |
| `pa:types` | Generate TypeScript types |

---

## Git Advanced

| Command | Description |
|---------|-------------|
| `pa:branch` | Branch management |
| `pa:merge` | Smart merge with conflict preview |
| `pa:conflict` | Resolve merge conflicts with AI |
| `pa:changelog-gen` | Auto-generate changelog |

---

## Search & Code Navigation

| Command | Description |
|---------|-------------|
| `pa:find` | Find code patterns/usage |
| `pa:todo` | Find all TODOs in code |
| `pa:fixme` | Find FIXMEs and critical issues |
| `pa:unused` | Find unused code/exports |

---

## Code Analysis

| Command | Description |
|---------|-------------|
| `pa:complexity` | Cyclomatic complexity analysis |
| `pa:duplication` | Find duplicate code blocks |
| `pa:hotspots` | Find frequently changed files |

---

## Debug & Logs

| Command | Description |
|---------|-------------|
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

---

## Testing Advanced

| Command | Description |
|---------|-------------|
| `pa:test-e2e` | Create/run E2E tests |
| `pa:test-unit` | Generate unit tests |
| `pa:mock` | Generate mocks/stubs |
| `pa:snapshot` | Snapshot testing management |

---

## DevOps & Infrastructure

| Command | Description |
|---------|-------------|
| `pa:docker` | Docker commands |
| `pa:ci` | CI/CD pipeline management |
| `pa:deploy-preview` | Deploy preview environment |

---

## Release Management

| Command | Description |
|---------|-------------|
| `pa:version` | Show/bump version |
| `pa:tag` | Create git tag |
| `pa:publish` | Publish package to registry |

---

## Code Review & PR

| Command | Description |
|---------|-------------|
| `pa:review-request` | Request code review from team |
| `pa:review-comments` | Show PR review comments |
| `pa:review-approve` | Approve current PR |

---

## Architecture

| Command | Description |
|---------|-------------|
| `pa:architecture` | Show architecture overview |
| `pa:architecture-diagram` | Generate diagram (Mermaid) |
| `pa:architecture-export` | Export diagram (SVG/PNG) |

---

## API Testing

| Command | Description |
|---------|-------------|
| `pa:api-test` | Test API endpoints |
| `pa:curl` | Generate curl commands |
| `pa:postman` | Generate Postman collection |

---

## Health & Monitoring

| Command | Description |
|---------|-------------|
| `pa:health` | Project health check |
| `pa:monitor` | Show monitoring status |
| `pa:uptime` | Service uptime check |

---

## Quick Actions

| Command | Description |
|---------|-------------|
| `pa:quick` | Show quick actions menu |
| `pa:alias` | Manage command aliases |
| `pa:alias-add` | Add custom alias |
| `pa:alias-remove` | Remove custom alias |

---

## Platform-Specific Test Suites

**Fully automated**: Auto-install tools, run tests, auto-fix failures, loop until all pass.

| Command | Description |
|---------|-------------|
| `pa:test-mobile` | Full mobile test suite (React Native, Android, iOS, Flutter) |
| `pa:test-web` | Full web test suite (React/Next.js/Vue) |
| `pa:test-api` | Full API test suite (Node.js/Python) |
| `pa:test-visual` | Visual/design comparison testing |
| `pa:test-auto-fix` | Auto-fix failing tests |
| `pa:test-loop` | Test -> Fix -> Retest until all pass |
| `pa:compare-figma` | Compare UI against Figma design |
| `pa:compare-image` | Compare UI against image/sketch |
| `pa:screenshot` | Capture app screenshots |

**What these commands do:**
- Check required tools -> Auto-install if missing
- Run all tests (unit, integration, e2e)
- Auto-fix failures (no confirmation needed)
- Loop until all pass or fix is impossible

---

## Custom Commands

| Command | Description |
|---------|-------------|
| `pa:standup` | Generate daily standup |
| `pa:tech-debt` | Scan for technical debt |
| `pa:security-scan` | Run security checklist |

Define your own in `./.proagents/custom-commands.yaml`
