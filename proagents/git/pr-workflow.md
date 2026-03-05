# Pull Request Workflow

Standard workflow for creating and reviewing pull requests.

---

## Creating a Pull Request

### Step 1: Prepare Branch

```bash
# Ensure branch is up to date
git fetch origin
git rebase origin/develop

# Push branch
git push origin feature/my-feature -u
```

### Step 2: Create PR

Using GitHub CLI:
```bash
gh pr create --title "feat(scope): description" --body "$(cat <<'EOF'
## Summary
Brief description of changes.

## Changes
- Change 1
- Change 2

## Test Plan
- [ ] Unit tests added
- [ ] Manual testing completed

## Screenshots
(if applicable)

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## PR Title Format

Follow commit conventions:
```
<type>(<scope>): <description>

Examples:
feat(auth): add password reset flow
fix(api): handle null response in user service
docs(readme): update installation instructions
```

---

## PR Description Template

```markdown
## Summary
[Brief description of what this PR does]

## Related Issue
Fixes #[issue number]

## Changes
- [Change 1]
- [Change 2]
- [Change 3]

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Test Plan
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots
[If applicable, add screenshots]

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No new warnings

## Notes for Reviewers
[Any additional context for reviewers]
```

---

## Review Process

### For Authors

1. **Self-Review First**
   - Review your own diff
   - Check for obvious issues
   - Ensure tests pass

2. **Request Reviews**
   - Add appropriate reviewers
   - CODEOWNERS auto-assigns owners

3. **Respond to Feedback**
   - Address all comments
   - Explain decisions if disagreeing
   - Mark resolved when addressed

4. **Keep Updated**
   - Rebase if base branch updated
   - Resolve merge conflicts promptly

### For Reviewers

1. **Timely Review**
   - Review within SLA (see code-ownership.md)
   - Don't let PRs go stale

2. **Review Checklist**
   - Code correctness
   - Code style
   - Test coverage
   - Documentation
   - Security
   - Performance

3. **Provide Constructive Feedback**
   - Be specific
   - Explain why
   - Suggest alternatives
   - Distinguish blocking vs non-blocking

4. **Approve or Request Changes**
   - Approve if ready
   - Request changes with clear items
   - Comment if just suggestions

---

## Review Comment Conventions

### Blocking (Must Fix)
```
🔴 **Blocking:** This could cause [issue].
Suggested fix: [suggestion]
```

### Should Fix (Important)
```
🟡 **Important:** Consider [change].
Reason: [explanation]
```

### Suggestion (Optional)
```
💡 **Suggestion:** You might want to [improvement].
```

### Question
```
❓ **Question:** Why did you choose [approach]?
```

### Praise
```
✅ **Nice!** This is a clean solution.
```

---

## Merge Requirements

### Required Checks
- [ ] CI passes (tests, lint, build)
- [ ] Required reviewers approved
- [ ] No merge conflicts
- [ ] Branch up to date

### Merge Strategies

**Squash and Merge (Recommended)**
- For feature branches
- Creates clean history
- Single commit per feature

**Rebase and Merge**
- For clean commit history
- Preserves individual commits
- Use when commits are atomic

**Merge Commit**
- For long-running branches
- Preserves full history
- Shows merge point

---

## After Merge

1. **Delete Branch**
   ```bash
   git branch -d feature/my-feature
   git push origin --delete feature/my-feature
   ```

2. **Update Local**
   ```bash
   git checkout develop
   git pull origin develop
   ```

3. **Verify Deployment**
   - Check CI/CD pipeline
   - Verify staging deployment
   - Monitor for issues

---

## Handling Feedback

### If Changes Requested

```bash
# Make changes
git add .
git commit -m "address review feedback"
git push origin feature/my-feature

# Or amend if single change
git add .
git commit --amend
git push --force-with-lease
```

### If Conflicts Arise

```bash
# Update from base
git fetch origin
git rebase origin/develop

# Resolve conflicts
# ... resolve in editor ...

git add .
git rebase --continue
git push --force-with-lease
```

---

## PR Size Guidelines

| Size | Lines Changed | Review Time |
|------|---------------|-------------|
| Small | < 100 | < 30 min |
| Medium | 100-500 | 1-2 hours |
| Large | > 500 | Consider splitting |

### Tips for Smaller PRs
- Break features into increments
- Separate refactoring from features
- Use feature flags for partial work
- Create dependent PRs

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:pr-create` | Create pull request |
| `pa:pr-update` | Update PR description |
| `pa:pr-merge` | Merge pull request |
| `pa:pr-review` | Request review |
