# ProAgents Commands

Execute these commands when user types them (prefix: `pa:`):

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
| `pa:ai-list` | Show configured AI platforms from config |
| `pa:ai-add` | Tell user to run `npx proagents ai add` |
| `pa:ai-remove` | Tell user to run `npx proagents ai remove` |

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
