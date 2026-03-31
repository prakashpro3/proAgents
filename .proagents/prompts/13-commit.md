# Smart Commit Workflow

Interactive commit with file selection, safety checks, and smart message generation.

---

## CRITICAL RULES - READ FIRST

```
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!                                                        !!
!!  THIS IS AN INTERACTIVE COMMAND                        !!
!!                                                        !!
!!  YOU MUST ASK USER AND WAIT FOR RESPONSE AT EACH STEP  !!
!!                                                        !!
!!  DO NOT:                                               !!
!!  - Skip steps                                          !!
!!  - Assume user choices                                 !!
!!  - Commit without explicit user confirmation           !!
!!  - Modify config without user selection                !!
!!                                                        !!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
```

---

## Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `pa:commit` | `pa:c` | Smart commit workflow |
| `pa:commit-config` | - | Configure pre-commit checks |

---

# pa:commit Workflow

## Step 1: Show Current State and ASK

First, run these commands silently:
```bash
git status --porcelain
git diff --stat
git diff --cached --stat
git branch --show-current
```

Then DISPLAY this to user and WAIT for their choice:

```
═══════════════════════════════════════
SMART COMMIT

Current Branch: [branch name]

Staged Files:
  [list staged files with +/- lines]

Unstaged Files:
  [list unstaged files with +/- lines]

Untracked Files:
  [list new files]

Which files do you want to commit?

  1. Staged only
  2. Unstaged only
  3. All changes
  4. Let me select specific files

Enter choice (1-4):
═══════════════════════════════════════
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

---

## Step 1b: Handle "Select Specific Files" (Option 4)

**ONLY if user chose option 4**, show numbered list of ALL files:

```
═══════════════════════════════════════
SELECT FILES TO COMMIT

  1. AGENTS.md (+1, -1)
  2. CLAUDE.md (+1, -1)
  3. docs/releases/v0.0.1.md (+4, -1)
  4. ios/IQAuditor.xcodeproj/project.pbxproj (+16, -10)
  5. android/app/release/app-release.aab (new, 97MB)

Enter file numbers to INCLUDE (comma-separated):
Example: 1,2,3 or 1-3 or all

═══════════════════════════════════════
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

After user provides numbers, those are the ONLY files to commit.
**SKIP Step 2** (exclusions) since user already selected specific files.
Proceed directly to Step 3 (Safety Checks).

---

## Step 2: Ask About Exclusions

**SKIP this step if user chose option 4 in Step 1.**

Only for options 1, 2, or 3, ASK:

```
Any files to EXCLUDE from this commit?

Enter file paths (comma-separated) or "none":
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

---

## Step 3: Safety Checks

### 3a. Branch Check

If current branch is `main` or `master`, STOP and ASK:

```
WARNING: You are committing to 'main' branch!

What do you want to do?

  1. Create a new branch first
  2. Continue on main anyway
  3. Cancel

Enter choice (1-3):
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

If user chose 1, ASK for branch name:
```
Enter new branch name (e.g., fix/bug-name):
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

### 3b. Sensitive File Check

Check if any selected file matches:
- `.env*`
- `credentials*`, `secrets*`
- `*.pem`, `*.key`, `id_rsa*`

If found, STOP and ASK:

```
WARNING: Sensitive file(s) detected!

  - .env.local
  - config/secrets.json

These files may contain secrets. What do you want to do?

  1. Exclude these files and continue
  2. Commit anyway (not recommended)
  3. Cancel

Enter choice (1-3):
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

### 3c. Large File Check

Check if any file > 1MB. If found, STOP and ASK:

```
WARNING: Large file detected!

  - assets/video.mp4 (15.2 MB)

Large files can slow down your repository.

  1. Exclude this file
  2. Commit anyway
  3. Cancel

Enter choice (1-3):
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

---

## Step 4: Generate Message and ASK

Analyze the diff and generate a commit message. Then SHOW and ASK:

```
═══════════════════════════════════════
SUGGESTED COMMIT MESSAGE

[type]([scope]): [description]

- [bullet point 1]
- [bullet point 2]

═══════════════════════════════════════

What do you want to do?

  1. Use this message
  2. Edit this message (tell me what to change)
  3. I'll write my own message
  4. Cancel

Enter choice (1-4):
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

If user chose 2:
```
What would you like to change in the message?
```
**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

If user chose 3:
```
Enter your commit message:
```
**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

---

## Step 5: Confirm Before Commit

Before executing, show summary and ASK:

```
═══════════════════════════════════════
COMMIT SUMMARY

Files to commit:
  - file1.ts
  - file2.ts

Message:
  feat(auth): Add password validation

Proceed with commit?

  1. Yes, commit now
  2. No, cancel

Enter choice (1-2):
═══════════════════════════════════════
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

---

## Step 6: Execute and Ask About Push

Only after user confirms, execute:
```bash
git add [selected files]
git commit -m "[message]"
```

Then show result and ASK:

```
Commit successful! [commit hash]

  [commit message]

  [X] files changed, [+] insertions, [-] deletions

Do you want to push now?

  1. Yes, push to remote
  2. No, I'll push later

Enter choice (1-2):
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

---

# pa:commit-config Workflow

## CRITICAL: This is INTERACTIVE

```
DO NOT modify config without asking user!
DO NOT assume which settings to change!
SHOW current settings and ASK what to toggle!
```

## Step 1: Read and Display Current Config

Read `proagents.config.yaml` and DISPLAY:

```
═══════════════════════════════════════
COMMIT CONFIGURATION

Current Settings:

Pre-commit Checks:
  1. [ON/OFF] Lint check
  2. [ON/OFF] Type check
  3. [ON/OFF] Test affected files

Safety Warnings:
  4. [ON/OFF] Warn on main/master branch
  5. [ON/OFF] Warn on sensitive files
  6. [ON/OFF] Warn on large files (>1MB)

  7. Save and exit

Which setting do you want to toggle? (1-7):
═══════════════════════════════════════
```

**>>> STOP HERE. WAIT FOR USER TO RESPOND. <<<**

## Step 2: Toggle and Show Updated

After user selects a number (1-6), toggle that setting and show updated list again.

Repeat until user selects 7 (Save and exit).

## Step 3: Save and Confirm

When user selects 7:

```
Saving configuration...

Updated settings:
  - lint: true -> false
  - type_check: true (unchanged)

Configuration saved to proagents.config.yaml
```

---

# Commit Message Rules

## Types

| Type | When to use |
|------|-------------|
| feat | New feature or functionality |
| fix | Bug fix |
| refactor | Code restructuring (no new feature) |
| docs | Documentation only |
| test | Adding or updating tests |
| chore | Maintenance, dependencies |
| style | Formatting, whitespace |

## Scope Detection

| File Path | Scope |
|-----------|-------|
| src/auth/* | auth |
| src/api/*, routes/* | api |
| src/components/* | ui |
| src/services/* | services |
| src/utils/*, lib/* | utils |
| tests/* | test |

## Format

```
type(scope): Short description (max 72 chars)

- Bullet point for each change
- Keep it concise
```

---

# Config Reference

```yaml
git:
  pre_commit:
    enabled: true
    lint: true
    type_check: true
    test_affected: false
  safety:
    warn_main_branch: true
    warn_sensitive_files: true
    warn_large_files: true
    large_file_threshold: 1048576
    sensitive_patterns:
      - ".env*"
      - "credentials*"
      - "secrets*"
      - "*.pem"
      - "*.key"
```

---

# Summary

| Step | Action | Requires User Input? |
|------|--------|---------------------|
| 1 | Show files | YES - which files |
| 2 | Exclusions | YES - any to exclude |
| 3 | Safety checks | YES - if warnings |
| 4 | Commit message | YES - use/edit/custom |
| 5 | Confirm | YES - proceed? |
| 6 | Push option | YES - push now? |
