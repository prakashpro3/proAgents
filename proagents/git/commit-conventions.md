# Git Commit Conventions

Standard commit message format for ProAgents projects.

---

## Conventional Commits

Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

---

## Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add login form` |
| `fix` | Bug fix | `fix(api): handle null response` |
| `docs` | Documentation | `docs(readme): update install steps` |
| `style` | Formatting (no code change) | `style: format with prettier` |
| `refactor` | Code change (no new feature/fix) | `refactor(user): simplify validation` |
| `perf` | Performance improvement | `perf(list): virtualize long lists` |
| `test` | Adding tests | `test(auth): add login tests` |
| `build` | Build system changes | `build: update webpack config` |
| `ci` | CI configuration | `ci: add github actions` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `revert` | Revert previous commit | `revert: revert "feat(auth)..."` |

---

## Scope

Scope indicates the affected area:
- Feature name: `auth`, `users`, `payments`
- Component: `button`, `modal`, `form`
- Module: `api`, `store`, `utils`

```
feat(auth): add password reset
fix(button): fix hover state
refactor(api): extract common headers
```

---

## Description

- Use imperative mood: "add" not "added"
- Don't capitalize first letter
- No period at the end
- Keep under 50 characters

```
✅ Good:
feat(auth): add login form validation
fix(api): handle timeout errors
docs: update contributing guide

❌ Bad:
feat(auth): Added login form validation.  (past tense, period)
fix: Fix bug                              (not descriptive)
FEAT: Add feature                         (caps)
```

---

## Body

Use for additional context:
- What changes were made
- Why the change was necessary
- Any implications

```
feat(cart): add quantity limit

Add maximum quantity limit of 99 items per product
to prevent inventory issues and improve UX.

Previously users could add unlimited quantities
which caused checkout failures.
```

---

## Footer

### Breaking Changes

```
feat(api): change response format

BREAKING CHANGE: API now returns data wrapped in `data` field.
Previously: { id, name }
Now: { data: { id, name } }
```

### Issue References

```
fix(login): prevent double submission

Fixes #123
Closes #456
Related to #789
```

### Co-authors

```
feat(dashboard): add analytics widget

Co-authored-by: Name <email@example.com>
Co-authored-by: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## Examples

### Simple Commit
```
feat(auth): add password strength indicator
```

### Commit with Body
```
fix(api): handle network timeout gracefully

Previously, network timeouts would cause the app to crash.
Now we catch timeout errors and show a user-friendly message
with a retry option.
```

### Breaking Change
```
refactor(api)!: update authentication endpoint

BREAKING CHANGE: Auth endpoint moved from /auth to /api/v2/auth.
Update all client configurations to use new endpoint.

Migration guide: docs/migration/auth-v2.md
```

### Full Commit
```
feat(payments): add stripe integration

Implement Stripe payment processing for checkout flow:
- Add Stripe SDK integration
- Create payment intent on server
- Handle payment confirmation
- Add webhook for payment events

Requires STRIPE_SECRET_KEY environment variable.

Closes #234
Co-authored-by: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## Commit Size

### Good Commits
- Single logical change
- Can be reverted independently
- Tests pass at each commit
- Clear purpose

### Avoid
- Multiple unrelated changes
- "WIP" commits in main branch
- Broken intermediate states
- Huge commits (> 500 lines)

---

## Commit Message Template

Create `.gitmessage`:
```
# <type>(<scope>): <description>
#
# Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
#
# Body: Explain what and why (not how)
#
# Footer: Breaking changes, issue references, co-authors
```

Configure git:
```bash
git config --global commit.template ~/.gitmessage
```

---

## Automation

### commitlint

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert'
    ]],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 72],
  },
};
```

### Husky Pre-commit

```bash
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:commit-feat` | Create feature commit |
| `pa:commit-fix` | Create fix commit |
| `pa:commit-docs` | Create docs commit |
| `pa:commit-refactor` | Create refactor commit |
