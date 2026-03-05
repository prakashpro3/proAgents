# ProAgents Commands

Execute these commands when user types them:

## Commands

| Command | What to Do |
|---------|------------|
| `/help` | Show this command table |
| `/feature-start "name"` | Create `./proagents/active-features/feature-[name]/`, analyze codebase, implement feature |
| `/fix "description"` | Find bug, fix it, update `./CHANGELOG.md` |
| `/status` | Read `./proagents/active-features/*/status.json`, show progress |
| `/qa` | Check code quality, run tests, report issues |
| `/test` | Create/run tests for current work |
| `/doc` | Generate documentation |
| `/doc-release` | Generate release notes → `./RELEASE_NOTES.md` |
| `/doc-changelog` | Update `./CHANGELOG.md` |

## Feature Workflow

`/feature-start` follows these phases:
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
User: /feature-start "add user login"
→ Create feature, analyze codebase, guide implementation

User: /fix "submit button not working"
→ Find issue, fix it, update changelog

User: /status
→ Show active features and progress
```
