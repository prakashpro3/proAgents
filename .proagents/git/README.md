# Git Integration

Branch strategy, commit conventions, and PR workflows.

---

## Overview

Integrated Git workflows for consistent version control practices.

## Documentation

| Document | Description |
|----------|-------------|
| [Branch Strategy](./branch-strategy.md) | Branch naming and flow |
| [Commit Conventions](./commit-conventions.md) | Conventional commits, message format |
| [PR Workflow](./pr-workflow.md) | Pull request process |
| [Rollback Procedures](./rollback-procedures.md) | Git-based rollback |

## Quick Start

```bash
# Create feature branch
proagents git branch "user-auth"

# Commit with convention
proagents git commit "feat(auth): add login form"

# Create pull request
proagents git pr create
```

## Branch Strategy

```
main
  └── develop
       ├── feature/user-auth
       ├── feature/dashboard
       └── bugfix/login-error
```

## Configuration

```yaml
# proagents.config.yaml
git:
  enabled: true
  branch_prefix: "feature/"
  commit_convention: "conventional"
  require_pr: true

  branch_protection:
    main:
      require_review: true
      require_tests: true
```

## Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance |
