# ProAgents Slash Commands Reference

## How Slash Commands Work

Type `/` to see available commands. As you type more, hints filter to show related commands.

```
/     -> Shows all categories
/d    -> Shows: /doc, /deploy, /doctor
/doc  -> Shows: /doc-full, /doc-moderate, /doc-lite...
```

---

## Complete Command Reference

### Initialization & Setup

| Command | Description |
|---------|-------------|
| `/init` | Initialize ProAgents in this project |
| `/setup` | Run interactive setup wizard |
| `/config` | Show/edit configuration |
| `/help` | Show all available commands |
| `/status` | Show workflow status |
| `/version` | Show ProAgents version |
| `/doctor` | Run health check |

---

### Feature Development

| Command | Description |
|---------|-------------|
| `/feature` | Show feature commands |
| `/feature-start "name"` | Start new feature |
| `/feature-status` | Current feature status |
| `/feature-pause` | Pause current feature |
| `/feature-resume` | Resume paused feature |
| `/feature-complete` | Mark feature complete |
| `/feature-list` | List all features |

**Usage:**
```
/feature-start "Add user authentication"
```

---

### Bug Fixing

| Command | Description |
|---------|-------------|
| `/fix` | Show fix commands |
| `/fix-quick "description"` | Quick bug fix mode |
| `/hotfix "description"` | Emergency hotfix |
| `/fix-upgrade` | Upgrade to full workflow |

**Usage:**
```
/fix-quick "Login button not working"
```

---

### Quality Assurance

| Command | Description |
|---------|-------------|
| `/qa` | Show QA commands |
| `/qa-full` | Full quality check |
| `/qa-quick` | Quick quality check |
| `/qa-security` | Security focused QA |
| `/qa-perf` | Performance focused QA |

---

### Testing

| Command | Description |
|---------|-------------|
| `/test` | Show test commands |
| `/test-unit` | Run unit tests |
| `/test-integration` | Run integration tests |
| `/test-e2e` | Run end-to-end tests |
| `/test-all` | Run all tests |
| `/test-coverage` | Show coverage report |

---

### Documentation

| Command | Description |
|---------|-------------|
| `/doc` | Show documentation commands |
| `/doc-full` | Full in-depth documentation |
| `/doc-moderate` | Balanced documentation |
| `/doc-lite` | Quick reference |
| `/doc-module [name]` | Document specific module |
| `/doc-file [path]` | Document specific file |
| `/doc-api` | API documentation |

**Usage:**
```
/doc-full
/doc-module auth
/doc-file ./src/services/AuthService.ts
```

---

### Analysis

| Command | Description |
|---------|-------------|
| `/analyze` | Show analysis commands |
| `/analyze-full` | Deep codebase analysis |
| `/analyze-moderate` | Moderate analysis |
| `/analyze-lite` | Quick overview |
| `/analyze-module [name]` | Analyze specific module |
| `/analyze-deps` | Dependency analysis |

---

### Git & Commits

| Command | Description |
|---------|-------------|
| `/commit` | Show commit commands |
| `/commit-feat` | Feature commit |
| `/commit-fix` | Fix commit |
| `/commit-docs` | Documentation commit |
| `/commit-refactor` | Refactoring commit |
| `/branch` | Show branch commands |
| `/branch-feature` | Create feature branch |
| `/branch-hotfix` | Create hotfix branch |
| `/pr` | Show PR commands |
| `/pr-create` | Create pull request |
| `/pr-update` | Update pull request |

---

### Deployment

| Command | Description |
|---------|-------------|
| `/deploy` | Show deploy commands |
| `/deploy-staging` | Deploy to staging |
| `/deploy-prod` | Deploy to production |
| `/deploy-check` | Pre-deployment check |
| `/rollback` | Show rollback commands |
| `/rollback-quick` | Quick rollback |
| `/rollback-full` | Full rollback procedure |

---

### Reports

| Command | Description |
|---------|-------------|
| `/report` | Show report commands |
| `/report-velocity` | Development velocity |
| `/report-quality` | Code quality metrics |
| `/report-coverage` | Test coverage |
| `/report-security` | Security report |
| `/report-deps` | Dependency status |

---

### Collaboration

| Command | Description |
|---------|-------------|
| `/collab` | Show collaboration commands |
| `/collab-start` | Start collaboration session |
| `/collab-join [id]` | Join existing session |
| `/collab-leave` | Leave current session |

---

## Custom Commands

Define your own commands in `proagents.config.yaml`:

```yaml
custom_commands:
  "/ship":
    description: "Full deployment workflow"
    steps:
      - "/test-all"
      - "/qa-full"
      - "/deploy-prod"

  "/morning":
    description: "Daily start routine"
    steps:
      - "/status"
      - "/feature-list"
```

---

## Command Chaining

Run multiple commands:
```
/test && /deploy
/qa && /deploy || /rollback
```

---

## Context-Aware Hints

Hints change based on context:

- **In feature development:** Prioritizes `/feature-status`, `/test`, `/commit`
- **In bug fix mode:** Prioritizes `/fix-complete`, `/test`, `/commit-fix`
- **After tests pass:** Suggests `/deploy`, `/pr-create`
