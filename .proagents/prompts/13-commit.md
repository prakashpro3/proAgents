# Smart Commit Workflow

Interactive commit with file selection, safety checks, and smart message generation.

---

## Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `pa:commit` | `pa:c` | Smart commit workflow |
| `pa:commit-config` | - | Configure pre-commit checks |

---

## pa:commit Workflow

### Step 1: Show Current State

```bash
git status --porcelain
git diff --stat
git diff --cached --stat
git branch --show-current
```

### Step 2: Present File Selection

```
═══════════════════════════════════════
SMART COMMIT

Current Changes:
  Staged (2):
    + src/auth/login.ts (+15, -3)
    + src/utils/hash.ts (+8, -0)

  Unstaged (3):
    - src/api/users.ts (+22, -5)
    - tests/auth.test.ts (+45, -0)
    - README.md (+3, -1)

Which files to commit?
  [1] Staged only (2 files)
  [2] Unstaged only (3 files)
  [3] All changes (5 files)
  [4] Select specific files

Choice: _
═══════════════════════════════════════
```

### Step 3: Ask for Exclusions

```
Exclude any files? (comma-separated paths or "none")
> _
```

### Step 4: Safety Checks

Run these checks in order. Stop at first warning.

#### 4a. Branch Check

If on `main` or `master`:

```
WARNING: You are on 'main' branch!

[1] Create new branch and commit there
[2] Continue on main (not recommended)
[3] Cancel
```

If user chooses [1], ask for branch name:
```
Branch name: fix/
> _
```

Then create branch: `git checkout -b [name]`

#### 4b. Sensitive File Check

Check selected files against patterns:
- `.env*`
- `credentials*`
- `secrets*`
- `*.pem`, `*.key`
- `id_rsa*`

If match found:
```
WARNING: Sensitive file detected!
  - .env.local (may contain secrets)
  - config/credentials.json

[1] Exclude these files and continue
[2] Commit anyway (not recommended)
[3] Cancel
```

#### 4c. Large File Check

Check if any file > 1MB (1048576 bytes):

```
WARNING: Large file detected!
  - assets/demo.mp4 (25.3 MB)

Consider using Git LFS for large files.

[1] Exclude and continue
[2] Commit anyway
[3] Cancel
```

### Step 5: Pre-commit Checks (if enabled)

Check `proagents.config.yaml` → `git.pre_commit.enabled`:

```bash
# If lint: true
npm run lint -- --fix

# If type_check: true
npm run type-check

# If test_affected: true
npm test -- --findRelatedTests [changed files]
```

If checks fail:
```
Pre-commit check failed:

  ESLint: 2 errors in src/api/users.ts
    Line 15: 'foo' is defined but never used
    Line 23: Missing semicolon

Options:
  [1] Fix and retry
  [2] Skip checks and commit anyway
  [3] Cancel

Choice: _
```

### Step 6: Generate Commit Message

Analyze diff and generate conventional commit:

```
═══════════════════════════════════════
SUGGESTED COMMIT MESSAGE

feat(auth): Add password hashing to login flow

- Add bcrypt validation in login.ts
- Create hash utility function

═══════════════════════════════════════

Options:
  [1] Use this message
  [2] Edit message
  [3] Write custom message
  [4] Cancel

Choice: _
```

If [2] Edit message:
- Show current message
- AI makes suggested edits based on user feedback

If [3] Custom message:
```
Enter commit message:
> _
```

### Step 7: Execute Commit

```bash
git add [selected files]
git commit -m "$(cat <<'EOF'
[commit message]
EOF
)"
```

Show result:
```
Committed: abc1234

  feat(auth): Add password hashing to login flow

  2 files changed, 23 insertions(+), 3 deletions(-)
```

### Step 8: Push Option

```
[1] Push now
[2] Done (push later)

Choice: _
```

If [1] Push:
```bash
git push
```

Show result:
```
Pushed to origin/feature/auth-improvements
```

---

## Commit Message Generation

### Type Detection

| Files Changed | Suggested Type |
|--------------|----------------|
| New files only | feat |
| Bug fix patterns | fix |
| Test files only | test |
| Docs/README only | docs |
| Config files | chore |
| Refactoring (no new features) | refactor |
| Formatting only | style |

### Scope Detection

| File Path | Scope |
|-----------|-------|
| src/auth/*, **/auth/** | auth |
| src/api/*, routes/* | api |
| src/components/*, **/ui/** | ui |
| src/services/* | services |
| src/utils/*, lib/* | utils |
| tests/*, **/*.test.* | test |
| src/database/*, **/models/** | database |
| docs/*, *.md (except README) | docs |

### Message Format

```
type(scope): Short description (max 72 chars)

- Bullet point for each significant change
- Keep bullets concise
- Focus on "what" not "how"

[Footer: Closes #123 or Refs #456]
```

### Examples

```
feat(auth): Add password hashing to login flow

- Add bcrypt validation in login handler
- Create hash utility function
- Add password strength validation

Closes #123
```

```
fix(api): Resolve timeout on large file uploads

- Increase timeout from 30s to 120s
- Add progress streaming for uploads > 10MB

Refs #456
```

---

## pa:commit-config Workflow

### Step 1: Read Current Config

```bash
cat proagents.config.yaml
```

Parse `git.pre_commit` and `git.safety` sections.

### Step 2: Show Current Settings

```
═══════════════════════════════════════
COMMIT CONFIGURATION

Pre-commit Checks:
  [1] All checks: ON
  [2] Lint: ON
  [3] Type check: ON
  [4] Test affected: OFF

Safety Warnings:
  [5] Main branch warning: ON
  [6] Sensitive file warning: ON
  [7] Large file warning: ON

  [8] Done

Toggle setting: _
═══════════════════════════════════════
```

### Step 3: Toggle Settings

After each selection, update display and continue until [8] Done.

### Step 4: Save and Confirm

Update `proagents.config.yaml` with new values:

```
Configuration updated:
  pre_commit.lint: true
  pre_commit.type_check: false
  safety.warn_main_branch: true

Changes saved to proagents.config.yaml
```

---

## Config Reference

```yaml
# In proagents.config.yaml

git:
  # Pre-commit checks
  pre_commit:
    enabled: true           # Master toggle
    lint: true              # Run linter
    type_check: true        # Run type checker
    test_affected: false    # Run tests for changed files

  # Safety warnings
  safety:
    warn_main_branch: true      # Warn if on main/master
    warn_sensitive_files: true  # Warn for .env, credentials
    warn_large_files: true      # Warn if file > threshold
    large_file_threshold: 1048576  # 1MB in bytes
    sensitive_patterns:
      - ".env*"
      - "credentials*"
      - "secrets*"
      - "*.pem"
      - "*.key"
      - "id_rsa*"
```

---

## Quick Reference

| Step | What Happens |
|------|--------------|
| 1 | Show staged/unstaged files |
| 2 | User selects which files |
| 3 | User excludes files (optional) |
| 4 | Safety checks (branch, sensitive, large) |
| 5 | Pre-commit checks (lint, types, tests) |
| 6 | Generate/edit commit message |
| 7 | Execute commit |
| 8 | Offer to push |
