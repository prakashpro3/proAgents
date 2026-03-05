# Slash Commands Reference

AI-platform slash commands for ProAgents workflow operations.

---

## Overview

Slash commands (`/command`) provide quick access to workflow operations when working with any AI platform (Claude, ChatGPT, Gemini, Copilot, etc.).

```
User types: /feature start "Add authentication"

AI responds: Starting feature "Add authentication"...
             Mode: Full Workflow
             Branch: feature/add-authentication

             Phase 1: Analysis - Ready to begin
```

---

## How Slash Commands Work

### Intelligent Hints

When you type `/`, available commands are displayed:

```
/  ← User types slash

┌─────────────────────────────────────┐
│ Available Commands:                 │
├─────────────────────────────────────┤
│ /init      - Initialize project    │
│ /feature   - Feature commands      │
│ /fix       - Bug fix commands      │
│ /doc       - Documentation         │
│ /qa        - Quality assurance     │
│ /test      - Testing               │
│ /deploy    - Deployment            │
│ /analyze   - Analysis              │
│ /commit    - Git commits           │
│ Type more to filter...             │
└─────────────────────────────────────┘
```

### Progressive Filtering

```
/d    →  Shows: /doc, /deploy, /doctor
/do   →  Shows: /doc, /doc-full, /doc-moderate, /doc-lite
/doc  →  Shows only documentation commands
```

---

## Command Reference

### Initialization & Setup

| Command | Description |
|---------|-------------|
| `/init` | Initialize ProAgents in project |
| `/setup` | Run setup wizard |
| `/config` | Configuration settings |
| `/help` | Show all commands |

**Examples:**
```
/init
/init --type fullstack
/config set checkpoints.before_deployment true
```

---

### Feature Development

| Command | Hints | Description |
|---------|-------|-------------|
| `/feature` | `/feature-start`, `/feature-status`, `/feature-pause`, `/feature-resume`, `/feature-complete`, `/feature-list` | Feature commands |
| `/feature-start` | - | Start new feature |
| `/feature-status` | - | Current feature status |
| `/feature-pause` | - | Pause current feature |
| `/feature-resume` | - | Resume paused feature |
| `/feature-complete` | - | Mark feature done |
| `/feature-list` | - | List all features |

**Examples:**
```
/feature-start "User authentication"
/feature-status
/feature-pause --note "Waiting for design review"
/feature-resume user-auth
/feature-complete
```

---

### Bug Fixing

| Command | Hints | Description |
|---------|-------|-------------|
| `/fix` | `/fix-quick`, `/fix-hotfix`, `/fix-bug` | Fix commands |
| `/fix-quick` | - | Quick bug fix mode |
| `/hotfix` | - | Emergency hotfix |
| `/fix-bug` | - | Standard bug fix |

**Examples:**
```
/fix "Login button not responding"
/fix-quick "Update config value"
/hotfix "Critical security issue"
```

---

### Quality Assurance

| Command | Hints | Description |
|---------|-------|-------------|
| `/qa` | `/qa-full`, `/qa-quick`, `/qa-security`, `/qa-perf` | QA commands |
| `/qa-full` | - | Full quality check |
| `/qa-quick` | - | Quick quality check |
| `/qa-security` | - | Security focused QA |
| `/qa-perf` | - | Performance focused QA |

**Examples:**
```
/qa
/qa-full
/qa-security
/qa-perf
```

---

### Testing

| Command | Hints | Description |
|---------|-------|-------------|
| `/test` | `/test-unit`, `/test-integration`, `/test-e2e`, `/test-all` | Test commands |
| `/test-unit` | - | Run unit tests |
| `/test-integration` | - | Run integration tests |
| `/test-e2e` | - | Run end-to-end tests |
| `/test-all` | - | Run all tests |
| `/test-affected` | - | Test affected files |
| `/test-coverage` | - | Run with coverage |

**Examples:**
```
/test
/test-all
/test-affected
/test-coverage
```

---

### Documentation

| Command | Hints | Description |
|---------|-------|-------------|
| `/doc` | `/doc-full`, `/doc-moderate`, `/doc-lite`, `/doc-module`, `/doc-file`, `/doc-api` | Doc commands |
| `/doc-full` | - | Full in-depth docs |
| `/doc-moderate` | - | Balanced docs |
| `/doc-lite` | - | Quick reference |
| `/doc-module` | - | Document specific module |
| `/doc-file` | - | Document specific file |
| `/doc-api` | - | API documentation |

**Examples:**
```
/doc
/doc-full
/doc-module auth
/doc-file src/services/AuthService.ts
```

---

### Analysis

| Command | Hints | Description |
|---------|-------|-------------|
| `/analyze` | `/analyze-full`, `/analyze-moderate`, `/analyze-lite`, `/analyze-module`, `/analyze-deps` | Analysis commands |
| `/analyze-full` | - | Deep codebase analysis |
| `/analyze-moderate` | - | Moderate analysis |
| `/analyze-lite` | - | Quick overview |
| `/analyze-deps` | - | Dependency analysis |
| `/analyze-security` | - | Security analysis |

**Examples:**
```
/analyze
/analyze-full
/analyze-module auth
/analyze-deps
```

---

### Git & Commits

| Command | Hints | Description |
|---------|-------|-------------|
| `/commit` | `/commit-feat`, `/commit-fix`, `/commit-docs`, `/commit-refactor` | Commit commands |
| `/commit-feat` | - | Feature commit |
| `/commit-fix` | - | Fix commit |
| `/commit-docs` | - | Documentation commit |
| `/commit-refactor` | - | Refactor commit |
| `/branch` | `/branch-feature`, `/branch-hotfix`, `/branch-release` | Branch commands |
| `/pr` | `/pr-create`, `/pr-update`, `/pr-merge` | PR commands |

**Examples:**
```
/commit "Add login validation"
/commit-feat "Add user authentication"
/commit-fix "Fix token expiration"
/branch-feature user-dashboard
/pr-create
```

---

### Deployment

| Command | Hints | Description |
|---------|-------|-------------|
| `/deploy` | `/deploy-staging`, `/deploy-prod`, `/deploy-check` | Deploy commands |
| `/deploy-staging` | - | Deploy to staging |
| `/deploy-prod` | - | Deploy to production |
| `/deploy-check` | - | Pre-deployment check |
| `/rollback` | `/rollback-quick`, `/rollback-full` | Rollback commands |

**Examples:**
```
/deploy-staging
/deploy-prod
/deploy-check
/rollback production
/rollback-quick
```

---

### Reports

| Command | Hints | Description |
|---------|-------|-------------|
| `/report` | `/report-velocity`, `/report-quality`, `/report-coverage`, `/report-security` | Report commands |
| `/report-velocity` | - | Development speed |
| `/report-quality` | - | Code quality |
| `/report-coverage` | - | Test coverage |
| `/report-security` | - | Security status |

**Examples:**
```
/report
/report-velocity --period week
/report-quality
/report-coverage
```

---

### Collaboration

| Command | Hints | Description |
|---------|-------|-------------|
| `/collab` | `/collab-start`, `/collab-join`, `/collab-leave` | Collaboration |
| `/collab-start` | - | Start session |
| `/collab-join` | - | Join session |
| `/collab-leave` | - | Leave session |
| `/collab-invite` | - | Invite collaborator |

**Examples:**
```
/collab-start --feature user-auth
/collab-join session-123
/collab-invite dev@email.com
```

---

### Status & Utilities

| Command | Description |
|---------|-------------|
| `/status` | Show workflow status |
| `/mode` | Show/change workflow mode |
| `/phase` | Show/change current phase |
| `/doctor` | Health check |
| `/clean` | Clean temporary files |
| `/version` | Show version |

**Examples:**
```
/status
/status --all
/mode bug-fix
/phase implementation
/doctor
```

---

## Context-Aware Commands

Commands adapt to your current context:

### During Feature Development

```
/  →  Prioritizes: /feature-status, /test, /commit

Available:
• /feature-status   - Check progress
• /test-affected    - Test changes
• /commit           - Commit changes
• /phase-next       - Move to next phase
```

### After Tests Pass

```
/  →  Suggests: /deploy, /pr-create

Available:
• /deploy-staging   - Deploy to staging
• /pr-create        - Create pull request
• /doc-update       - Update documentation
```

### In Bug Fix Mode

```
/  →  Prioritizes: /fix-complete, /test, /commit-fix

Available:
• /test-affected    - Test fix
• /commit-fix       - Commit fix
• /fix-complete     - Complete bug fix
```

---

## Command Chaining

### Sequential Commands

```
/test && /deploy
# Run tests, then deploy if tests pass

/qa && /deploy || /rollback
# QA check, deploy if pass, rollback if fail
```

### Pipeline Commands

```
/test → /doc → /commit → /pr-create
# Full sequence from test to PR
```

---

## Custom Slash Commands

Define your own commands in config:

```yaml
# proagents.config.yaml
custom_commands:
  "/ship":
    description: "Full deployment workflow"
    hints: ["/ship-staging", "/ship-prod"]
    steps:
      - "/test-all"
      - "/qa-full"
      - "/deploy-prod"

  "/morning":
    description: "Daily start routine"
    steps:
      - "/status"
      - "/feature-list"

  "/friday":
    description: "End of week"
    steps:
      - "/doc-moderate"
      - "/report-velocity"

  "/ci":
    description: "CI pipeline"
    steps:
      - "/lint"
      - "/test-all"
      - "/qa-security"
```

**Using Custom Commands:**
```
/ship-staging
/morning
/ci
```

---

## AI Platform Support

### Claude (Claude Code)

Native support for all slash commands:
```
/feature-start "Add authentication"
```

### ChatGPT

Enable via Custom Instructions or GPTs:
```
When user types /command, interpret as ProAgents workflow command
```

### GitHub Copilot

Via Custom Commands configuration:
```json
{
  "commands": {
    "/pa": "proagents"
  }
}
```

### Cursor IDE

Native command support in Cursor settings.

---

## Command Arguments

### Positional Arguments

```
/feature-start "Feature Name"
/doc-module auth
/commit-fix "Fix login bug"
```

### Named Arguments

```
/feature-start "Auth" --mode full --branch custom-branch
/deploy staging --skip-tests
/test --coverage --verbose
```

### Flags

```
/qa --full
/test --watch
/deploy --dry-run
```

---

## Quick Reference

### Most Used Commands

```
/feature-start "name"  →  Start new feature
/status               →  Check status
/test                 →  Run tests
/qa                   →  Quality check
/commit               →  Create commit
/pr-create            →  Create PR
/deploy-staging       →  Deploy to staging
```

### Feature Workflow

```
/feature-start "name"  →  Begin
/analyze              →  Analyze codebase
/test                 →  Run tests
/doc                  →  Generate docs
/feature-complete     →  Finish
/pr-create            →  Create PR
```

### Bug Fix Workflow

```
/fix "description"    →  Start fix
/test-affected        →  Test changes
/commit-fix           →  Commit
/pr-create --draft    →  Create draft PR
```
