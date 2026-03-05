# Git Branch Strategy

ProAgents follows a structured branching strategy for organized development.

---

## Branch Structure

```
main
  └── develop
       ├── feature/user-auth
       ├── feature/dashboard
       ├── feature/notifications
       ├── hotfix/login-fix
       └── release/v1.2.0
```

---

## Branch Types

### Main Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch for features |

### Supporting Branches

| Type | Prefix | Base | Merge To |
|------|--------|------|----------|
| Feature | `feature/` | develop | develop |
| Hotfix | `hotfix/` | main | main + develop |
| Release | `release/` | develop | main + develop |

---

## Branch Naming

### Features
```
feature/[feature-name]
feature/add-user-auth
feature/update-dashboard
```

### Bug Fixes
```
fix/[issue-description]
fix/login-validation
fix/api-timeout
```

### Hotfixes
```
hotfix/[critical-issue]
hotfix/security-patch
hotfix/payment-bug
```

### Releases
```
release/v[version]
release/v1.2.0
```

---

## Workflow

### Starting a Feature

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
```

Or use slash command:
```
/branch-feature "my-feature"
```

### Working on Feature

```bash
# Regular commits
git add .
git commit -m "feat(scope): description"

# Keep branch updated
git fetch origin
git rebase origin/develop
```

### Completing Feature

```bash
# Push branch
git push origin feature/my-feature

# Create PR to develop
# (Or use /pr-create)
```

### Hotfix

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Fix the issue
git commit -m "fix: critical issue"

# Merge to main AND develop
git checkout main
git merge hotfix/critical-fix
git checkout develop
git merge hotfix/critical-fix
```

---

## Slash Commands for Git

| Command | Action |
|---------|--------|
| `/branch-feature "name"` | Create feature branch |
| `/branch-hotfix "name"` | Create hotfix branch |
| `/branch-release "v1.0.0"` | Create release branch |
| `/commit-feat` | Feature commit |
| `/commit-fix` | Fix commit |
| `/pr-create` | Create pull request |

---

## Branch Protection Rules

### Main Branch
- Require pull request reviews (1+)
- Require status checks to pass
- No direct pushes

### Develop Branch
- Require pull request reviews
- Require status checks to pass

---

## Configuration

```yaml
# proagents.config.yaml
git:
  enabled: true
  branch_prefix: "feature/"
  default_base: "develop"
  require_pr: true
```
