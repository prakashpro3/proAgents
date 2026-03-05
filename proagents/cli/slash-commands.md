# ProAgents Commands Reference

AI-platform commands for ProAgents workflow operations.

---

## Overview

ProAgents commands (`pa:command`) provide quick access to workflow operations when working with any AI platform (Claude, ChatGPT, Gemini, Copilot, etc.).

```
User types: pa:feature "Add authentication"

AI responds: Starting feature "Add authentication"...
             Mode: Full Workflow
             Branch: feature/add-authentication

             Phase 1: Analysis - Ready to begin
```

---

## How Commands Work

### Intelligent Hints

When you type `pa:`, available commands are displayed:

```
pa:  ← User types prefix

┌─────────────────────────────────────┐
│ Available Commands:                 │
├─────────────────────────────────────┤
│ pa:init      - Initialize project   │
│ pa:feature   - Feature commands     │
│ pa:fix       - Bug fix commands     │
│ pa:doc       - Documentation        │
│ pa:qa        - Quality assurance    │
│ pa:test      - Testing              │
│ pa:deploy    - Deployment           │
│ pa:analyze   - Analysis             │
│ pa:commit    - Git commits          │
│ Type more to filter...              │
└─────────────────────────────────────┘
```

### Progressive Filtering

```
pa:d    →  Shows: pa:doc, pa:deploy, pa:doctor
pa:do   →  Shows: pa:doc, pa:doc-full, pa:doc-moderate, pa:doc-lite
pa:doc  →  Shows only documentation commands
```

---

## Command Reference

### Initialization & Setup

| Command | Description |
|---------|-------------|
| `pa:init` | Initialize ProAgents in project |
| `pa:setup` | Run setup wizard |
| `pa:config` | Configuration settings |
| `pa:help` | Show all commands |

**Examples:**
```
pa:init
pa:init --type fullstack
pa:config set checkpoints.before_deployment true
```

---

### Feature Development

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:feature` | `pa:feature-status`, `pa:feature-pause`, `pa:feature-resume`, `pa:feature-complete`, `pa:feature-list` | Feature commands |
| `pa:feature` | - | Start new feature |
| `pa:feature-status` | - | Current feature status |
| `pa:feature-pause` | - | Pause current feature |
| `pa:feature-resume` | - | Resume paused feature |
| `pa:feature-complete` | - | Mark feature done |
| `pa:feature-list` | - | List all features |

**Examples:**
```
pa:feature "User authentication"
pa:feature-status
pa:feature-pause --note "Waiting for design review"
pa:feature-resume user-auth
pa:feature-complete
```

---

### Bug Fixing

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:fix` | `pa:fix-quick`, `pa:hotfix`, `pa:fix-bug` | Fix commands |
| `pa:fix-quick` | - | Quick bug fix mode |
| `pa:hotfix` | - | Emergency hotfix |
| `pa:fix-bug` | - | Standard bug fix |

**Examples:**
```
pa:fix "Login button not responding"
pa:fix-quick "Update config value"
pa:hotfix "Critical security issue"
```

---

### Quality Assurance

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:qa` | `pa:qa-full`, `pa:qa-quick`, `pa:qa-security`, `pa:qa-perf` | QA commands |
| `pa:qa-full` | - | Full quality check |
| `pa:qa-quick` | - | Quick quality check |
| `pa:qa-security` | - | Security focused QA |
| `pa:qa-perf` | - | Performance focused QA |

**Examples:**
```
pa:qa
pa:qa-full
pa:qa-security
pa:qa-perf
```

---

### Testing

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:test` | `pa:test-unit`, `pa:test-integration`, `pa:test-e2e`, `pa:test-all` | Test commands |
| `pa:test-unit` | - | Run unit tests |
| `pa:test-integration` | - | Run integration tests |
| `pa:test-e2e` | - | Run end-to-end tests |
| `pa:test-all` | - | Run all tests |
| `pa:test-affected` | - | Test affected files |
| `pa:test-coverage` | - | Run with coverage |

**Examples:**
```
pa:test
pa:test-all
pa:test-affected
pa:test-coverage
```

---

### Documentation

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:doc` | `pa:doc-full`, `pa:doc-moderate`, `pa:doc-lite`, `pa:doc-module`, `pa:doc-file`, `pa:doc-api` | Doc commands |
| `pa:doc-full` | - | Full in-depth docs |
| `pa:doc-moderate` | - | Balanced docs |
| `pa:doc-lite` | - | Quick reference |
| `pa:doc-module` | - | Document specific module |
| `pa:doc-file` | - | Document specific file |
| `pa:doc-api` | - | API documentation |

**Examples:**
```
pa:doc
pa:doc-full
pa:doc-module auth
pa:doc-file src/services/AuthService.ts
```

---

### Analysis

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:analyze` | `pa:analyze-full`, `pa:analyze-moderate`, `pa:analyze-lite`, `pa:analyze-module`, `pa:analyze-deps` | Analysis commands |
| `pa:analyze-full` | - | Deep codebase analysis |
| `pa:analyze-moderate` | - | Moderate analysis |
| `pa:analyze-lite` | - | Quick overview |
| `pa:analyze-deps` | - | Dependency analysis |
| `pa:analyze-security` | - | Security analysis |

**Examples:**
```
pa:analyze
pa:analyze-full
pa:analyze-module auth
pa:analyze-deps
```

---

### Git & Commits

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:commit` | `pa:commit-feat`, `pa:commit-fix`, `pa:commit-docs`, `pa:commit-refactor` | Commit commands |
| `pa:commit-feat` | - | Feature commit |
| `pa:commit-fix` | - | Fix commit |
| `pa:commit-docs` | - | Documentation commit |
| `pa:commit-refactor` | - | Refactor commit |
| `pa:branch` | `pa:branch-feature`, `pa:branch-hotfix`, `pa:branch-release` | Branch commands |
| `pa:pr` | `pa:pr-create`, `pa:pr-update`, `pa:pr-merge` | PR commands |

**Examples:**
```
pa:commit "Add login validation"
pa:commit-feat "Add user authentication"
pa:commit-fix "Fix token expiration"
pa:branch-feature user-dashboard
pa:pr-create
```

---

### Deployment

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:deploy` | `pa:deploy-staging`, `pa:deploy-prod`, `pa:deploy-check` | Deploy commands |
| `pa:deploy-staging` | - | Deploy to staging |
| `pa:deploy-prod` | - | Deploy to production |
| `pa:deploy-check` | - | Pre-deployment check |
| `pa:rollback` | `pa:rollback-quick`, `pa:rollback-full` | Rollback commands |

**Examples:**
```
pa:deploy-staging
pa:deploy-prod
pa:deploy-check
pa:rollback production
pa:rollback-quick
```

---

### Reports

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:report` | `pa:report-velocity`, `pa:report-quality`, `pa:report-coverage`, `pa:report-security` | Report commands |
| `pa:report-velocity` | - | Development speed |
| `pa:report-quality` | - | Code quality |
| `pa:report-coverage` | - | Test coverage |
| `pa:report-security` | - | Security status |

**Examples:**
```
pa:report
pa:report-velocity --period week
pa:report-quality
pa:report-coverage
```

---

### Collaboration

| Command | Hints | Description |
|---------|-------|-------------|
| `pa:collab` | `pa:collab-start`, `pa:collab-join`, `pa:collab-leave` | Collaboration |
| `pa:collab-start` | - | Start session |
| `pa:collab-join` | - | Join session |
| `pa:collab-leave` | - | Leave session |
| `pa:collab-invite` | - | Invite collaborator |

**Examples:**
```
pa:collab-start --feature user-auth
pa:collab-join session-123
pa:collab-invite dev@email.com
```

---

### Status & Utilities

| Command | Description |
|---------|-------------|
| `pa:status` | Show workflow status |
| `pa:mode` | Show/change workflow mode |
| `pa:phase` | Show/change current phase |
| `pa:doctor` | Health check |
| `pa:clean` | Clean temporary files |
| `pa:version` | Show version |

**Examples:**
```
pa:status
pa:status --all
pa:mode bug-fix
pa:phase implementation
pa:doctor
```

---

## Context-Aware Commands

Commands adapt to your current context:

### During Feature Development

```
pa:  →  Prioritizes: pa:feature-status, pa:test, pa:commit

Available:
• pa:feature-status   - Check progress
• pa:test-affected    - Test changes
• pa:commit           - Commit changes
• pa:phase-next       - Move to next phase
```

### After Tests Pass

```
pa:  →  Suggests: pa:deploy, pa:pr-create

Available:
• pa:deploy-staging   - Deploy to staging
• pa:pr-create        - Create pull request
• pa:doc-update       - Update documentation
```

### In Bug Fix Mode

```
pa:  →  Prioritizes: pa:fix-complete, pa:test, pa:commit-fix

Available:
• pa:test-affected    - Test fix
• pa:commit-fix       - Commit fix
• pa:fix-complete     - Complete bug fix
```

---

## Command Chaining

### Sequential Commands

```
pa:test && pa:deploy
# Run tests, then deploy if tests pass

pa:qa && pa:deploy || pa:rollback
# QA check, deploy if pass, rollback if fail
```

### Pipeline Commands

```
pa:test → pa:doc → pa:commit → pa:pr-create
# Full sequence from test to PR
```

---

## Custom Commands

Define your own commands in config:

```yaml
# proagents.config.yaml
custom_commands:
  "pa:ship":
    description: "Full deployment workflow"
    hints: ["pa:ship-staging", "pa:ship-prod"]
    steps:
      - "pa:test-all"
      - "pa:qa-full"
      - "pa:deploy-prod"

  "pa:morning":
    description: "Daily start routine"
    steps:
      - "pa:status"
      - "pa:feature-list"

  "pa:friday":
    description: "End of week"
    steps:
      - "pa:doc-moderate"
      - "pa:report-velocity"

  "pa:ci":
    description: "CI pipeline"
    steps:
      - "pa:lint"
      - "pa:test-all"
      - "pa:qa-security"
```

**Using Custom Commands:**
```
pa:ship-staging
pa:morning
pa:ci
```

---

## AI Platform Support

### Claude (Claude Code)

Native support for all pa: commands:
```
pa:feature "Add authentication"
```

### ChatGPT

Enable via Custom Instructions or GPTs:
```
When user types pa:command, interpret as ProAgents workflow command
```

### GitHub Copilot

Via Custom Commands configuration:
```json
{
  "commands": {
    "pa:": "proagents"
  }
}
```

### Cursor IDE

Native command support in Cursor settings.

---

## Command Arguments

### Positional Arguments

```
pa:feature "Feature Name"
pa:doc-module auth
pa:commit-fix "Fix login bug"
```

### Named Arguments

```
pa:feature "Auth" --mode full --branch custom-branch
pa:deploy staging --skip-tests
pa:test --coverage --verbose
```

### Flags

```
pa:qa --full
pa:test --watch
pa:deploy --dry-run
```

---

## Quick Reference

### Most Used Commands

```
pa:feature "name"     →  Start new feature
pa:status             →  Check status
pa:test               →  Run tests
pa:qa                 →  Quality check
pa:commit             →  Create commit
pa:pr-create          →  Create PR
pa:deploy-staging     →  Deploy to staging
```

### Feature Workflow

```
pa:feature "name"     →  Begin
pa:analyze            →  Analyze codebase
pa:test               →  Run tests
pa:doc                →  Generate docs
pa:feature-complete   →  Finish
pa:pr-create          →  Create PR
```

### Bug Fix Workflow

```
pa:fix "description"  →  Start fix
pa:test-affected      →  Test changes
pa:commit-fix         →  Commit
pa:pr-create --draft  →  Create draft PR
```
