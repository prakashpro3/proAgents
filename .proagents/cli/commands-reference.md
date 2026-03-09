# CLI Commands Reference

Complete reference for all ProAgents CLI commands.

---

## Core Commands

### `proagents init`

Initialize ProAgents in a project.

```bash
proagents init [options]

Options:
  --type <type>        Project type (web-frontend, fullstack, mobile, backend)
  --template <name>    Use specific template
  --force              Overwrite existing configuration
  --minimal            Minimal setup (config only)
```

**Examples:**
```bash
# Interactive initialization
proagents init

# Specify project type
proagents init --type fullstack

# Use template
proagents init --template nextjs

# Minimal setup
proagents init --minimal
```

---

### `proagents status`

Show current workflow status.

```bash
proagents status [options]

Options:
  --all                Show all features (active, paused, completed)
  --feature <name>     Show specific feature status
  --json               Output as JSON
  --verbose            Detailed status
```

**Examples:**
```bash
# Current feature status
proagents status

# All features
proagents status --all

# Specific feature
proagents status --feature user-auth
```

**Output:**
```
┌─────────────────────────────────────────────────────────────┐
│ ProAgents Status                                            │
├─────────────────────────────────────────────────────────────┤
│ Current Feature: user-authentication                        │
│ Mode: Full Workflow                                         │
│ Phase: Implementation (5/9)                                 │
│ Progress: 60%                                               │
├─────────────────────────────────────────────────────────────┤
│ Files Modified: 8                                           │
│ Tests: 12 passing, 0 failing                               │
│ Time Elapsed: 2h 15m                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### `proagents help`

Show help information.

```bash
proagents help [command]

Arguments:
  command              Command to get help for
```

**Examples:**
```bash
# General help
proagents help

# Feature command help
proagents help feature

# Analyze command help
proagents help analyze
```

---

### `proagents doctor`

Check system health and configuration.

```bash
proagents doctor [options]

Options:
  --fix                Auto-fix issues where possible
  --check-conflicts    Check for command conflicts
  --verbose            Detailed output
```

**Output:**
```
┌─────────────────────────────────────────────────────────────┐
│ ProAgents Health Check                                      │
├─────────────────────────────────────────────────────────────┤
│ ✅ CLI Version: 1.0.0                                       │
│ ✅ Node.js: v18.17.0                                        │
│ ✅ Git: v2.40.0                                             │
│ ✅ Configuration: Valid                                     │
│ ⚠️  Missing optional: Figma API token                       │
│ ✅ Workspace: Initialized                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Commands

### `proagents feature start`

Start a new feature development.

```bash
proagents feature start <name> [options]

Arguments:
  name                 Feature name or description

Options:
  --mode <mode>        Workflow mode (full, bug-fix, quick)
  --branch <name>      Custom branch name
  --from <branch>      Base branch (default: develop)
  --checkpoint <level> Checkpoint level (all, critical, none)
  --skip-analysis      Skip codebase analysis
  --no-branch          Don't create git branch
```

**Examples:**
```bash
# Start with auto-detected mode
proagents feature start "Add user profile page"

# Force full workflow
proagents feature start "Add payment integration" --mode full

# Custom branch
proagents feature start "Login fix" --branch hotfix/login-fix

# Skip analysis (use cached)
proagents feature start "Quick update" --skip-analysis
```

---

### `proagents feature status`

Show current feature status.

```bash
proagents feature status [name] [options]

Arguments:
  name                 Feature name (optional, defaults to current)

Options:
  --json               Output as JSON
  --verbose            Detailed status
```

---

### `proagents feature list`

List all features.

```bash
proagents feature list [options]

Options:
  --active             Show only active features
  --completed          Show only completed features
  --paused             Show only paused features
  --json               Output as JSON
```

**Output:**
```
┌─────────────────────────────────────────────────────────────┐
│ Features                                                    │
├─────────────────────────────────────────────────────────────┤
│ Active:                                                     │
│ • user-authentication (Phase 5/9, 60%)                     │
│ • dashboard (Phase 3/9, 30%)                               │
├─────────────────────────────────────────────────────────────┤
│ Paused:                                                     │
│ • notifications (Phase 2/9) - Waiting for API             │
├─────────────────────────────────────────────────────────────┤
│ Completed (Last 7 days):                                   │
│ • user-settings (Jan 15)                                   │
│ • profile-page (Jan 12)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### `proagents feature pause`

Pause current feature.

```bash
proagents feature pause [name] [options]

Arguments:
  name                 Feature name (optional)

Options:
  --note <text>        Add pause note
  --reason <reason>    Reason for pausing
```

**Examples:**
```bash
# Pause current feature
proagents feature pause

# Pause with note
proagents feature pause --note "Waiting for design review"

# Pause specific feature
proagents feature pause dashboard --reason "dependency-blocked"
```

---

### `proagents feature resume`

Resume a paused feature.

```bash
proagents feature resume [name] [options]

Arguments:
  name                 Feature name (optional, defaults to last paused)

Options:
  --from-phase <phase> Resume from specific phase
  --refresh            Refresh codebase analysis
```

**Examples:**
```bash
# Resume last paused
proagents feature resume

# Resume specific feature
proagents feature resume dashboard

# Resume from earlier phase
proagents feature resume --from-phase analysis
```

---

### `proagents feature complete`

Mark feature as complete.

```bash
proagents feature complete [name] [options]

Arguments:
  name                 Feature name (optional)

Options:
  --skip-checks        Skip completion checks
  --archive            Archive feature files
```

---

## Bug Fix Commands

### `proagents fix`

Start bug fix mode.

```bash
proagents fix <description> [options]

Arguments:
  description          Bug description

Options:
  --issue <id>         Link to issue/ticket
  --priority <level>   Priority (low, medium, high, critical)
  --files <files>      Specific files to fix
  --upgrade            Upgrade to full workflow if needed
```

**Examples:**
```bash
# Simple bug fix
proagents fix "Login button not responding"

# With issue reference
proagents fix "Auth token expiring early" --issue PROJ-123

# Critical priority
proagents fix "Security vulnerability in auth" --priority critical

# Specific files
proagents fix "Button styling issue" --files "src/components/Button.tsx"
```

---

### `proagents hotfix`

Emergency hotfix for production issues.

```bash
proagents hotfix <description> [options]

Arguments:
  description          Issue description

Options:
  --issue <id>         Link to issue/ticket
  --from <branch>      Branch to hotfix from (default: main)
  --skip-tests         Skip tests (not recommended)
```

**Examples:**
```bash
# Production hotfix
proagents hotfix "Critical auth bypass"

# From specific branch
proagents hotfix "Payment failure" --from release/v2.0
```

---

## Analysis Commands

### `proagents analyze`

Analyze codebase.

```bash
proagents analyze [path] [options]

Arguments:
  path                 Path to analyze (optional, defaults to project root)

Options:
  --depth <level>      Analysis depth (full, moderate, lite)
  --focus <areas>      Focus areas (structure, patterns, dependencies)
  --output <file>      Output file path
  --refresh            Force refresh (ignore cache)
  --module <name>      Analyze specific module
```

**Examples:**
```bash
# Full project analysis
proagents analyze

# Moderate depth
proagents analyze --depth moderate

# Specific path
proagents analyze ./src/auth --depth full

# Focus on patterns
proagents analyze --focus patterns,dependencies

# Output to file
proagents analyze --output analysis-report.md
```

---

## Testing Commands

### `proagents test`

Run tests.

```bash
proagents test [pattern] [options]

Arguments:
  pattern              Test file pattern (optional)

Options:
  --unit               Run unit tests only
  --integration        Run integration tests only
  --e2e                Run e2e tests only
  --all                Run all tests
  --coverage           Generate coverage report
  --affected           Test only affected files
  --watch              Watch mode
  --verbose            Verbose output
```

**Examples:**
```bash
# Run all tests
proagents test

# Unit tests only
proagents test --unit

# With coverage
proagents test --coverage

# Affected files only
proagents test --affected

# Specific pattern
proagents test "auth/**/*.test.ts"

# Watch mode
proagents test --watch
```

---

## Documentation Commands

### `proagents docs`

Generate documentation.

```bash
proagents docs [path] [options]

Arguments:
  path                 Path to document (optional)

Options:
  --mode <mode>        Documentation depth (full, moderate, lite)
  --scope <scope>      Scope (project, module, folder, file)
  --format <format>    Output format (markdown, html, pdf)
  --output <dir>       Output directory
  --update-only        Update existing docs only
```

**Examples:**
```bash
# Full project docs
proagents docs

# Moderate depth
proagents docs --mode moderate

# Specific module
proagents docs --scope module auth

# Specific file
proagents docs --scope file ./src/services/AuthService.ts

# Output as HTML
proagents docs --format html --output ./docs-html
```

---

## Quality Assurance Commands

### `proagents qa`

Run quality assurance checks.

```bash
proagents qa [options]

Options:
  --full               Full QA check
  --quick              Quick QA check
  --security           Security focused
  --performance        Performance focused
  --fix                Auto-fix issues
```

**Examples:**
```bash
# Full QA
proagents qa --full

# Quick check
proagents qa --quick

# Security scan
proagents qa --security

# Auto-fix
proagents qa --quick --fix
```

---

### `proagents lint`

Run linting.

```bash
proagents lint [path] [options]

Arguments:
  path                 Path to lint (optional)

Options:
  --fix                Auto-fix issues
  --strict             Strict mode (warnings as errors)
```

---

### `proagents security`

Run security scan.

```bash
proagents security [options]

Options:
  --full               Full security audit
  --dependencies       Scan dependencies only
  --code               Scan code only
  --owasp              OWASP compliance check
```

---

## Git Commands

### `proagents commit`

Create a commit.

```bash
proagents commit [message] [options]

Arguments:
  message              Commit message (optional, auto-generated if not provided)

Options:
  --type <type>        Commit type (feat, fix, docs, refactor, test, chore)
  --scope <scope>      Commit scope
  --breaking           Mark as breaking change
  --staged             Commit staged files only
  --all                Stage and commit all changes
```

**Examples:**
```bash
# Auto-generate message
proagents commit

# With message
proagents commit "Add login validation"

# Feature commit
proagents commit --type feat "Add user authentication"

# With scope
proagents commit --type fix --scope auth "Fix token expiration"
```

---

### `proagents branch`

Branch operations.

```bash
proagents branch <action> [name] [options]

Actions:
  create               Create new branch
  switch               Switch to branch
  delete               Delete branch
  list                 List branches

Options:
  --type <type>        Branch type (feature, hotfix, release)
  --from <branch>      Base branch
```

**Examples:**
```bash
# Create feature branch
proagents branch create user-auth --type feature

# Switch branch
proagents branch switch feature/user-auth

# List branches
proagents branch list
```

---

### `proagents pr`

Pull request operations.

```bash
proagents pr <action> [options]

Actions:
  create               Create PR
  update               Update PR
  merge                Merge PR
  status               PR status

Options:
  --title <title>      PR title
  --body <body>        PR body
  --draft              Create as draft
  --reviewers <users>  Add reviewers
  --labels <labels>    Add labels
```

**Examples:**
```bash
# Create PR
proagents pr create

# Create with details
proagents pr create --title "Add authentication" --draft

# Add reviewers
proagents pr create --reviewers "user1,user2"

# Check status
proagents pr status
```

---

## Deployment Commands

### `proagents deploy`

Deploy application.

```bash
proagents deploy [environment] [options]

Arguments:
  environment          Target environment (staging, production)

Options:
  --skip-tests         Skip tests before deploy
  --skip-build         Skip build step
  --dry-run            Simulate deployment
  --tag <tag>          Deploy specific tag
  --rollback-on-fail   Auto-rollback on failure
```

**Examples:**
```bash
# Deploy to staging
proagents deploy staging

# Deploy to production
proagents deploy production

# Dry run
proagents deploy production --dry-run

# With auto-rollback
proagents deploy production --rollback-on-fail
```

---

### `proagents rollback`

Rollback deployment.

```bash
proagents rollback [environment] [options]

Arguments:
  environment          Target environment

Options:
  --to <version>       Rollback to specific version
  --quick              Quick rollback (skip confirmations)
  --confirm            Skip confirmation prompt
```

**Examples:**
```bash
# Rollback production
proagents rollback production

# Rollback to specific version
proagents rollback production --to v2.3.1

# Quick rollback
proagents rollback production --quick
```

---

## Configuration Commands

### `proagents config`

Configuration management.

```bash
proagents config <action> [key] [value] [options]

Actions:
  get                  Get config value
  set                  Set config value
  list                 List all config
  edit                 Open config in editor
  validate             Validate configuration
  reset                Reset to defaults
  export               Export configuration
  import               Import configuration

Options:
  --global             Global configuration
  --local              Local (project) configuration
```

**Examples:**
```bash
# Get value
proagents config get checkpoints.before_deployment

# Set value
proagents config set checkpoints.before_deployment true

# List all
proagents config list

# Validate
proagents config validate

# Export
proagents config export > backup.yaml

# Import
proagents config import backup.yaml
```

---

## Report Commands

### `proagents report`

Generate reports.

```bash
proagents report <type> [options]

Types:
  velocity             Development velocity
  quality              Code quality
  coverage             Test coverage
  security             Security status
  dependencies         Dependency status
  activity             Team activity

Options:
  --period <period>    Time period (week, month, quarter)
  --format <format>    Output format (text, json, pdf, html)
  --output <file>      Output file
```

**Examples:**
```bash
# Velocity report
proagents report velocity

# Quality report (monthly)
proagents report quality --period month

# Output as PDF
proagents report velocity --format pdf --output report.pdf
```

---

## Collaboration Commands

### `proagents collab`

Real-time collaboration.

```bash
proagents collab <action> [session-id] [options]

Actions:
  start                Start collaboration session
  join                 Join existing session
  leave                Leave session
  status               Session status
  invite               Invite collaborator

Options:
  --feature <name>     Feature to collaborate on
  --role <role>        Your role (primary, reviewer, observer)
```

**Examples:**
```bash
# Start session
proagents collab start --feature user-auth

# Join session
proagents collab join abc123

# Invite
proagents collab invite user@email.com
```

---

## Utility Commands

### `proagents clean`

Clean up temporary files.

```bash
proagents clean [options]

Options:
  --cache              Clean analysis cache
  --features           Clean completed features
  --all                Clean everything
  --dry-run            Show what would be cleaned
```

---

### `proagents upgrade`

Upgrade ProAgents CLI.

```bash
proagents upgrade [options]

Options:
  --check              Check for updates only
  --beta               Include beta versions
```

---

### `proagents version`

Show version information.

```bash
proagents version [options]

Options:
  --json               Output as JSON
  --verbose            Show all version info
```
