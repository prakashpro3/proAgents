# ProAgents Commands Reference

## How Commands Work

Type `pa:` to see available commands. As you type more, hints filter to show related commands.

```
pa:     -> Shows all categories
pa:d    -> Shows: pa:doc, pa:deploy, pa:doctor
pa:doc  -> Shows: pa:doc-full, pa:doc-moderate, pa:doc-lite...
```

---

## Complete Command Reference

### Initialization & Setup

| Command | Description |
|---------|-------------|
| `pa:init` | Initialize ProAgents in this project |
| `pa:setup` | Run interactive setup wizard |
| `pa:config` | Show/edit configuration |
| `pa:help` | Show all available commands |
| `pa:status` | Show workflow status |
| `pa:version` | Show ProAgents version |
| `pa:doctor` | Run health check |

---

### Feature Development

| Command | Description |
|---------|-------------|
| `pa:feature` | Show feature commands |
| `pa:feature "name"` | Start new feature |
| `pa:feature-status` | Current feature status |
| `pa:feature-pause` | Pause current feature |
| `pa:feature-resume` | Resume paused feature |
| `pa:feature-complete` | Mark feature complete |
| `pa:feature-list` | List all features |

**Usage:**
```
pa:feature "Add user authentication"
```

---

### Bug Fixing

| Command | Description |
|---------|-------------|
| `pa:fix` | Show fix commands |
| `pa:fix-quick "description"` | Quick bug fix mode |
| `pa:hotfix "description"` | Emergency hotfix |
| `pa:fix-upgrade` | Upgrade to full workflow |

**Usage:**
```
pa:fix-quick "Login button not working"
```

---

### Quality Assurance

| Command | Description |
|---------|-------------|
| `pa:qa` | Show QA commands |
| `pa:qa-full` | Full quality check |
| `pa:qa-quick` | Quick quality check |
| `pa:qa-security` | Security focused QA |
| `pa:qa-perf` | Performance focused QA |

---

### Testing

| Command | Description |
|---------|-------------|
| `pa:test` | Show test commands |
| `pa:test-unit` | Run unit tests |
| `pa:test-integration` | Run integration tests |
| `pa:test-e2e` | Run end-to-end tests |
| `pa:test-all` | Run all tests |
| `pa:test-coverage` | Show coverage report |

---

### Documentation

| Command | Description |
|---------|-------------|
| `pa:doc` | Show documentation commands |
| `pa:doc-full` | Full in-depth documentation |
| `pa:doc-moderate` | Balanced documentation |
| `pa:doc-lite` | Quick reference |
| `pa:doc-module [name]` | Document specific module |
| `pa:doc-file [path]` | Document specific file |
| `pa:doc-api` | API documentation |

**Usage:**
```
pa:doc-full
pa:doc-module auth
pa:doc-file ./src/services/AuthService.ts
```

---

### Analysis

| Command | Description |
|---------|-------------|
| `pa:analyze` | Show analysis commands |
| `pa:analyze-full` | Deep codebase analysis |
| `pa:analyze-moderate` | Moderate analysis |
| `pa:analyze-lite` | Quick overview |
| `pa:analyze-module [name]` | Analyze specific module |
| `pa:analyze-deps` | Dependency analysis |

---

### Git & Commits

| Command | Description |
|---------|-------------|
| `pa:commit` | Show commit commands |
| `pa:commit-feat` | Feature commit |
| `pa:commit-fix` | Fix commit |
| `pa:commit-docs` | Documentation commit |
| `pa:commit-refactor` | Refactoring commit |
| `pa:branch` | Show branch commands |
| `pa:branch-feature` | Create feature branch |
| `pa:branch-hotfix` | Create hotfix branch |
| `pa:pr` | Show PR commands |
| `pa:pr-create` | Create pull request |
| `pa:pr-update` | Update pull request |

---

### Deployment

| Command | Description |
|---------|-------------|
| `pa:deploy` | Show deploy commands |
| `pa:deploy-staging` | Deploy to staging |
| `pa:deploy-prod` | Deploy to production |
| `pa:deploy-check` | Pre-deployment check |
| `pa:rollback` | Show rollback commands |
| `pa:rollback-quick` | Quick rollback |
| `pa:rollback-full` | Full rollback procedure |

---

### Reports

| Command | Description |
|---------|-------------|
| `pa:report` | Show report commands |
| `pa:report-velocity` | Development velocity |
| `pa:report-quality` | Code quality metrics |
| `pa:report-coverage` | Test coverage |
| `pa:report-security` | Security report |
| `pa:report-deps` | Dependency status |

---

### Collaboration

| Command | Description |
|---------|-------------|
| `pa:collab` | Show collaboration commands |
| `pa:collab-start` | Start collaboration session |
| `pa:collab-join [id]` | Join existing session |
| `pa:collab-leave` | Leave current session |

---

## Custom Commands

Define your own commands in `proagents.config.yaml`:

```yaml
custom_commands:
  "pa:ship":
    description: "Full deployment workflow"
    steps:
      - "pa:test-all"
      - "pa:qa-full"
      - "pa:deploy-prod"

  "pa:morning":
    description: "Daily start routine"
    steps:
      - "pa:status"
      - "pa:feature-list"
```

---

## Command Chaining

Run multiple commands:
```
pa:test && pa:deploy
pa:qa && pa:deploy || pa:rollback
```

---

## Context-Aware Hints

Hints change based on context:

- **In feature development:** Prioritizes `pa:feature-status`, `pa:test`, `pa:commit`
- **In bug fix mode:** Prioritizes `pa:fix-complete`, `pa:test`, `pa:commit-fix`
- **After tests pass:** Suggests `pa:deploy`, `pa:pr-create`
