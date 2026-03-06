# ProAgents Commands

Execute these commands when user types them (prefix: `pa:`):

## Quick Aliases
`pa:f` → feature | `pa:s` → status | `pa:h` → help | `pa:d` → doc | `pa:t` → test | `pa:q` → qa | `pa:a` → analyze | `pa:r` → requirements | `pa:p` → plan | `pa:i` → implement

> **Multi-AI Note:** Multiple AIs may work on this project. Always read `./proagents/activity.log` before executing commands, and log your actions after completing them.

## Commands

| Command | What to Do |
|---------|------------|
| `pa:help` | Show this command table |
| `pa:feature "name"` | Create `./proagents/active-features/feature-[name]/`, analyze codebase, implement feature |
| `pa:fix "description"` | Find bug, fix it, update `./CHANGELOG.md` |
| `pa:analyze` | Deep codebase analysis → `./proagents/cache/` |
| `pa:requirements` | Gather requirements → `./proagents/active-features/` |
| `pa:design` | UI/Architecture design phase |
| `pa:plan` | Create implementation plan |
| `pa:implement` | Execute implementation phase |
| `pa:status` | Read `./proagents/active-features/*/status.json`, show progress |
| `pa:qa` | Check code quality, run tests, report issues |
| `pa:test` | Create/run tests for current work |
| `pa:doc` | Generate documentation |
| `pa:release` | Generate release notes → `./RELEASE_NOTES.md` |
| `pa:changelog` | Update `./CHANGELOG.md` |
| `pa:ai-list` | Read config, show installed AI platforms |
| `pa:ai-add` | Show platform options, create AI instruction files |
| `pa:ai-remove` | Show installed platforms, remove selected files |
| `pa:ai-sync` | Sync config with existing files (fix mismatches) |
| `pa:activity` | Show recent AI activity from `./proagents/activity.log` |
| `pa:lock` | Show lock status, check if another AI is working |
| `pa:lock-release` | Release your lock after completing work |
| `pa:handoff` | Create handoff notes → `./proagents/handoff.md` |
| `pa:handoff-read` | Read handoff notes before starting work |
| `pa:session-end` | Generate session summary → `./proagents/sessions/` |
| `pa:decision "title"` | Log architectural decision → `./proagents/decisions.md` |
| `pa:error "desc"` | Log error & solution → `./proagents/errors.md` |
| `pa:feedback "desc"` | Log feedback for AI learning → `./proagents/feedback.md` |
| `pa:standup` | Generate daily standup summary |
| `pa:tech-debt` | Scan for technical debt |

## Navigation & Flow

| Command | What to Do |
|---------|------------|
| `pa:next` | Show next step in current workflow |
| `pa:resume` | Resume paused feature from last checkpoint |
| `pa:skip` | Skip current phase, move to next |
| `pa:back` | Go back to previous phase |
| `pa:progress` | Show visual progress bar |

## Context & History

| Command | What to Do |
|---------|------------|
| `pa:context` | View project context |
| `pa:diff` | Show changes since last session |
| `pa:history` | Show command history with results |
| `pa:checkpoint` | Create snapshot/restore point |
| `pa:undo` | Undo last AI action (git revert) |

## Sprint & Estimation

| Command | What to Do |
|---------|------------|
| `pa:sprint-start` | Start new sprint → `./proagents/sprints/` |
| `pa:sprint-end` | End sprint with summary |
| `pa:estimate` | Estimate task complexity (S/M/L/XL) |
| `pa:velocity` | Show velocity metrics |

## Integration

| Command | What to Do |
|---------|------------|
| `pa:github` | GitHub commands (issue, PR) |
| `pa:github-pr` | Create pull request |
| `pa:jira` | Sync with Jira ticket |
| `pa:notify` | Send notification (Slack/email) |

## Code Quality

| Command | What to Do |
|---------|------------|
| `pa:metrics` | Show code quality metrics |
| `pa:coverage` | Show test coverage report |
| `pa:deps` | Analyze dependencies |
| `pa:deps-outdated` | Find outdated packages |
| `pa:deps-security` | Security scan dependencies |

## Code Generation

| Command | What to Do |
|---------|------------|
| `pa:generate` | Show generation options |
| `pa:generate-component "name"` | Generate component from template |
| `pa:generate-api "name"` | Generate API endpoint |
| `pa:generate-test "file"` | Generate test file |

## Refactoring

| Command | What to Do |
|---------|------------|
| `pa:refactor` | Suggest refactoring opportunities |
| `pa:rename "old" "new"` | Rename across codebase |
| `pa:extract "name"` | Extract function/component |
| `pa:cleanup` | Remove dead code, unused imports |

## Time Tracking

| Command | What to Do |
|---------|------------|
| `pa:time-start` | Start tracking → `./proagents/time-tracking.json` |
| `pa:time-stop` | Stop tracking, save duration |
| `pa:time-report` | Show time report by feature |

## Environment & Setup

| Command | What to Do |
|---------|------------|
| `pa:env-check` | Verify environment setup |
| `pa:env-setup` | Setup dev environment |
| `pa:secrets-scan` | Scan for exposed secrets |

## Database

| Command | What to Do |
|---------|------------|
| `pa:db-migrate` | Run database migrations |
| `pa:db-seed` | Seed with test data |
| `pa:db-reset` | Reset database (caution!) |

## Accessibility & Performance

| Command | What to Do |
|---------|------------|
| `pa:a11y` | Run accessibility audit |
| `pa:lighthouse` | Run Lighthouse audit |
| `pa:perf` | Performance analysis |

## Export & Backup

| Command | What to Do |
|---------|------------|
| `pa:export` | Export config/data → JSON file |
| `pa:import` | Import from export file |
| `pa:backup` | Backup proagents folder |

## Learning & AI

| Command | What to Do |
|---------|------------|
| `pa:learn "pattern"` | Teach AI a pattern |
| `pa:forget "pattern"` | Remove learned pattern |
| `pa:suggestions` | Show AI suggestions |

## API & Documentation

| Command | What to Do |
|---------|------------|
| `pa:api-docs` | Generate OpenAPI/Swagger documentation |
| `pa:storybook` | Generate Storybook stories |
| `pa:readme` | Auto-generate/update README.md |
| `pa:types` | Generate TypeScript types/interfaces |

## Git Advanced

| Command | What to Do |
|---------|------------|
| `pa:branch` | Branch management (list, create, clean) |
| `pa:merge` | Smart merge with conflict preview |
| `pa:conflict` | Resolve merge conflicts with AI |
| `pa:changelog-gen` | Auto-generate changelog from commits |

## Search & Navigation

| Command | What to Do |
|---------|------------|
| `pa:find "pattern"` | Find code patterns/usage |
| `pa:todo` | Find and list all TODOs in code |
| `pa:fixme` | Find FIXMEs and critical issues |
| `pa:unused` | Find unused code/exports |
| `pa:unused-deps` | Find unused dependencies |

## Code Analysis

| Command | What to Do |
|---------|------------|
| `pa:complexity` | Cyclomatic complexity analysis |
| `pa:duplication` | Find duplicate code blocks |
| `pa:hotspots` | Find frequently changed files |

## Testing Advanced

| Command | What to Do |
|---------|------------|
| `pa:test-e2e` | Create/run E2E tests |
| `pa:test-unit` | Generate unit tests |
| `pa:mock` | Generate mocks/stubs |
| `pa:snapshot` | Snapshot testing management |

## DevOps & Infrastructure

| Command | What to Do |
|---------|------------|
| `pa:docker` | Docker commands (build, compose) |
| `pa:ci` | CI/CD pipeline status/management |
| `pa:deploy-preview` | Deploy to preview environment |

## Release Management

| Command | What to Do |
|---------|------------|
| `pa:version` | Show/bump version |
| `pa:tag` | Create git tag for release |
| `pa:publish` | Publish package to registry |

## Code Review & PR

| Command | What to Do |
|---------|------------|
| `pa:review-request` | Request code review from team |
| `pa:review-comments` | Show PR review comments |
| `pa:review-approve` | Approve current PR |

## Architecture

| Command | What to Do |
|---------|------------|
| `pa:architecture` | Show architecture overview |
| `pa:architecture-diagram` | Generate architecture diagram (Mermaid) |
| `pa:architecture-export` | Export diagram (SVG/PNG) |

## API Testing

| Command | What to Do |
|---------|------------|
| `pa:api-test` | Test API endpoints |
| `pa:curl` | Generate curl commands for endpoints |
| `pa:postman` | Generate Postman collection |

## Health & Monitoring

| Command | What to Do |
|---------|------------|
| `pa:health` | Project health check |
| `pa:monitor` | Show monitoring status |
| `pa:uptime` | Service uptime check |

## Quick Actions

| Command | What to Do |
|---------|------------|
| `pa:quick` | Show quick actions menu |
| `pa:alias` | Manage command aliases |
| `pa:alias-add` | Add custom alias |
| `pa:alias-remove` | Remove custom alias |

## Mobile Test Suite (React Native)

| Command | What to Do |
|---------|------------|
| `pa:test-mobile` | Run full mobile test suite (unit, component, E2E, visual) |
| `pa:test-mobile "feature"` | Test specific feature only |
| `pa:test-visual` | Visual/design comparison testing |
| `pa:test-auto-fix` | Auto-fix failing tests |
| `pa:test-loop` | Test → Fix → Retest loop until all pass |
| `pa:compare-figma` | Compare UI against Figma design |
| `pa:compare-image "path"` | Compare UI against image/sketch |
| `pa:screenshot` | Take app screenshots for comparison |

## Key Files to Read

| File | Purpose |
|------|---------|
| `./proagents/context.md` | Persistent project context (READ FIRST!) |
| `./proagents/feedback.md` | Past corrections - don't repeat mistakes |
| `./proagents/watchlist.yaml` | Files requiring confirmation before changes |
| `./proagents/errors.md` | Past errors and solutions |
| `./proagents/decisions.md` | Architectural decisions and reasoning |

## Feature Workflow

`pa:feature` runs all phases, or run individually:

| Phase | Command | Action |
|-------|---------|--------|
| 1. Init | `pa:feature "name"` | Create tracking files |
| 2. Analysis | `pa:analyze` | Understand existing code |
| 3. Requirements | `pa:requirements` | Define what to build |
| 4. Design | `pa:design` | Plan UI/architecture |
| 5. Planning | `pa:plan` | Create implementation plan |
| 6. Implementation | `pa:implement` | Write code |
| 7. Testing | `pa:test` | Create/run tests |
| 8. Review | `pa:review` | Quality check |
| 9. Documentation | `pa:doc` | Update docs |
| 10. Deployment | `pa:deploy` | Prepare release |

## Save Locations

| Document | Location |
|----------|----------|
| Changelog | `./CHANGELOG.md` |
| Release Notes | `./RELEASE_NOTES.md` |
| Feature Status | `./proagents/active-features/` |

## Examples

```
User: pa:feature "add user login"
→ Create feature, analyze codebase, guide implementation

User: pa:fix "submit button not working"
→ Find issue, fix it, update changelog

User: pa:status
→ Show active features and progress

User: pa:help
→ Show all available commands
```
