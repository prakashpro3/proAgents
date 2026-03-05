# Changelog System

Automated change documentation for all modifications.

---

## Overview

The changelog system ensures every change is documented, regardless of workflow mode:
- Full features get comprehensive documentation
- Bug fixes get standard documentation
- Quick changes get minimal documentation

---

## Directory Structure

```
/proagents/changelog/
├── README.md                 # This file
├── CHANGELOG.md              # Aggregated changelog
├── entry-template.md         # Template for entries
└── 2024/                     # Year-based organization
    ├── 01/                   # Month
    │   ├── 2024-01-15-user-auth.md
    │   ├── 2024-01-16-login-bugfix.md
    │   └── 2024-01-16-config-update.md
    └── 02/
        └── ...
```

---

## Documentation Levels

### Full Workflow (Comprehensive)

```yaml
level: comprehensive
includes:
  - Feature summary
  - Requirements link
  - Design decisions
  - Implementation details
  - Test coverage
  - Security review
  - Performance impact
  - Deployment notes
  - Rollback plan
```

### Bug Fix (Standard)

```yaml
level: standard
includes:
  - Issue description
  - Root cause
  - Fix description
  - Files modified
  - Testing performed
  - Verification steps
```

### Quick Change (Minimal)

```yaml
level: minimal
includes:
  - What changed
  - Why
  - Files modified
  - Verification
```

---

## Auto-Generated Entries

Changes are automatically captured:

```yaml
auto_capture:
  git_integration:
    - commit_hash
    - commit_message
    - branch_name
    - author
    - files_changed
    - diff_summary

  context_capture:
    - feature_id (if applicable)
    - issue_id (if applicable)
    - workflow_mode
    - phase_completed
    - test_results

  timestamps:
    - started_at
    - completed_at
    - duration
```

---

## Changelog Entry Format

### Header

```markdown
# Change: [Title]

**Date:** 2024-01-15 14:30 UTC
**Mode:** Full Workflow | Bug Fix | Quick Change
**Author:** developer@example.com
**Branch:** feature/user-authentication
**Commit:** abc123def456
**Feature ID:** FEAT-123 (if applicable)
**Issue ID:** BUG-456 (if applicable)
```

### Body (varies by level)

See `entry-template.md` for detailed templates.

---

## Aggregated CHANGELOG.md

Auto-generated summary:

```markdown
# Changelog

All notable changes to this project.

## [Unreleased]

### Added
- User authentication system (#123)
- Dashboard widgets (#125)

### Fixed
- Login redirect loop (#456)
- Session timeout handling (#458)

### Changed
- Updated API response format (#127)

---

## [1.2.0] - 2024-01-15

### Added
- New feature X
- New feature Y

### Fixed
- Bug fix A
- Bug fix B

...
```

---

## Search & Query

### Search by Keyword

```bash
# Search all changelogs
pa:changelog search "authentication"

# Results:
- 2024-01-15: User authentication system
- 2024-01-10: Auth token refresh fix
- 2024-01-05: Authentication provider update
```

### Filter by Date

```bash
# Last 7 days
pa:changelog --since "7 days ago"

# Specific date range
pa:changelog --from "2024-01-01" --to "2024-01-15"
```

### Filter by Type

```bash
# Only features
pa:changelog --type feature

# Only bug fixes
pa:changelog --type bugfix

# Only quick changes
pa:changelog --type quick
```

### Filter by Author

```bash
pa:changelog --author "developer@example.com"
```

---

## Git Integration

### Automatic Entry on Commit

```yaml
# proagents.config.yaml
changelog:
  auto_create:
    on_commit: true
    on_merge: true
    on_release: true

  git_hooks:
    post_commit: true
    post_merge: true
```

### Commit Message Extraction

```
Commit: feat(auth): add login functionality

Extracted:
- Type: feature
- Scope: auth
- Description: add login functionality
```

---

## Release Notes Generation

```bash
# Generate release notes
pa:changelog release 1.2.0

# Output:
# Release Notes - v1.2.0

## Highlights
- User authentication system
- Dashboard redesign

## Features
- [#123] User login/logout
- [#125] Dashboard widgets
- [#127] API improvements

## Bug Fixes
- [#456] Fixed login redirect
- [#458] Fixed session timeout

## Breaking Changes
- API response format changed (see migration guide)

## Contributors
- @developer1 (5 commits)
- @developer2 (3 commits)
```

---

## Configuration

```yaml
# proagents.config.yaml

changelog:
  enabled: true

  auto_generate:
    on_feature_complete: true
    on_bug_fix: true
    on_quick_change: true

  levels:
    full_workflow: "comprehensive"
    bug_fix: "standard"
    quick_change: "minimal"

  aggregation:
    generate_changelog_md: true
    format: "keep-a-changelog"
    include_unreleased: true

  git_integration:
    link_commits: true
    link_issues: true
    link_prs: true

  search:
    indexed: true
    full_text: true

  notifications:
    on_release: ["slack", "email"]

  output:
    directory: "proagents/changelog"
    year_month_structure: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:changelog` | View recent changes |
| `pa:changelog --today` | Today's changes |
| `pa:changelog --week` | This week's changes |
| `pa:changelog search [query]` | Search changelogs |
| `pa:changelog create` | Create new entry |
| `pa:changelog release [version]` | Generate release notes |
| `pa:changelog export` | Export changelog |
