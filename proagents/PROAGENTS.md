# ProAgents Commands

Execute these commands when user types them (prefix: `pa:`):

## Quick Aliases
`pa:f` → feature | `pa:s` → status | `pa:h` → help | `pa:d` → doc | `pa:t` → test | `pa:q` → qa

> **Multi-AI Note:** Multiple AIs may work on this project. Always read `./proagents/activity.log` before executing commands, and log your actions after completing them.

## Commands

| Command | What to Do |
|---------|------------|
| `pa:help` | Show this command table |
| `pa:feature "name"` | Create `./proagents/active-features/feature-[name]/`, analyze codebase, implement feature |
| `pa:fix "description"` | Find bug, fix it, update `./CHANGELOG.md` |
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

## Key Files to Read

| File | Purpose |
|------|---------|
| `./proagents/context.md` | Persistent project context (READ FIRST!) |
| `./proagents/feedback.md` | Past corrections - don't repeat mistakes |
| `./proagents/watchlist.yaml` | Files requiring confirmation before changes |
| `./proagents/errors.md` | Past errors and solutions |
| `./proagents/decisions.md` | Architectural decisions and reasoning |

## Feature Workflow

`pa:feature` follows these phases:
1. **Init** → Create tracking files
2. **Analysis** → Understand existing code
3. **Requirements** → Define what to build
4. **Design** → Plan architecture
5. **Implementation** → Write code
6. **Testing** → Create tests
7. **Review** → Quality check
8. **Documentation** → Update docs
9. **Deploy** → Prepare release

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
