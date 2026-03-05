# Changelog Entry Template

Every change should be documented. Use this template.

---

## Entry Format

```markdown
# Change: [Title]

**Date:** [YYYY-MM-DD HH:MM]
**Mode:** [Full Workflow | Bug Fix | Quick Change]
**Author:** [name]
**Branch:** [branch-name]
**Commit:** [commit-hash]

## Summary
[1-2 sentence description of what changed]

## Details
[Based on mode - see below]

## Verification
- [ ] Tested: [Yes/No + details]
- [ ] Reviewed: [Yes/No + by whom]

## Related
- Issues: [links]
- PRs: [links]

## Tags
[keywords for search]
```

---

## Mode-Specific Details

### Full Workflow Mode

```markdown
## Details

### Requirements
[Link to requirements document or summary]

### Design
[Link to design spec or summary]

### Implementation
- Files created: [list]
- Files modified: [list]
- Key changes: [summary]

### Tests
- Unit tests: [count] added
- Integration tests: [count] added
- Coverage: [percentage]

### Breaking Changes
[List any breaking changes]

### Migration
[Steps to migrate if needed]
```

### Bug Fix Mode

```markdown
## Details

### Issue
[What was broken - symptoms]

### Root Cause
[Why it happened]

### Fix
[What was changed to fix it]

### Files Modified
- [file1]: [change description]
- [file2]: [change description]

### Regression Risk
[Low/Medium/High] - [explanation]
```

### Quick Change Mode

```markdown
## Details

### What Changed
[Brief description]

### Reason
[Why this change was needed]

### Files Modified
- [file]: [change]

### Impact
[None/Minimal]
```

---

## Examples

### Feature Entry

```markdown
# Change: Add User Profile Page

**Date:** 2024-01-15 14:30
**Mode:** Full Workflow
**Author:** @developer
**Branch:** feature/user-profile
**Commit:** abc123

## Summary
Added user profile page with view and edit functionality.

## Details

### Requirements
See: docs/requirements/user-profile.md

### Implementation
- Created ProfilePage component
- Added edit modal with form validation
- Integrated with user API
- Added React Query hooks

### Tests
- Unit tests: 15 added
- Integration tests: 5 added
- Coverage: 85%

## Verification
- [x] Tested: Manual + automated tests
- [x] Reviewed: @tech-lead

## Related
- Issue: #123
- PR: #456

## Tags
user, profile, feature, react
```

### Bug Fix Entry

```markdown
# Change: Fix Login Button Double Submit

**Date:** 2024-01-16 10:15
**Mode:** Bug Fix
**Author:** @developer
**Branch:** fix/login-double-submit
**Commit:** def456

## Summary
Fixed issue where login button could be clicked multiple times.

## Details

### Issue
Users could click login button rapidly, causing multiple API calls
and sometimes creating duplicate sessions.

### Root Cause
Missing loading state and button disable during API call.

### Fix
- Added isLoading state to track submission
- Disabled button while loading
- Added loading spinner feedback

### Files Modified
- src/components/LoginForm.tsx: Added loading state and disable logic

### Regression Risk
Low - isolated to login form

## Verification
- [x] Tested: Manual testing, cannot reproduce
- [x] Reviewed: @frontend-lead

## Related
- Issue: #789

## Tags
login, bug, ui, auth
```

### Quick Change Entry

```markdown
# Change: Update API Base URL

**Date:** 2024-01-16 16:00
**Mode:** Quick Change
**Author:** @devops
**Branch:** config/api-url
**Commit:** ghi789

## Summary
Updated API base URL to new production endpoint.

## Details

### What Changed
Changed API_BASE_URL from api.old.com to api.new.com

### Reason
Infrastructure migration to new domain

### Files Modified
- .env.production: Updated API_BASE_URL

### Impact
None - same API, new domain

## Verification
- [x] Tested: Health check passes
- [x] Reviewed: @devops-lead

## Tags
config, api, infrastructure
```

---

## File Structure

```
/proagents/changelog/
├── 2024/
│   ├── 01/
│   │   ├── 2024-01-15-user-profile.md
│   │   ├── 2024-01-16-login-fix.md
│   │   └── 2024-01-16-api-url.md
│   └── 02/
├── CHANGELOG.md          # Aggregated summary
└── entry-template.md     # This template
```

---

## Aggregated CHANGELOG.md

```markdown
# Changelog

All notable changes to this project.

## [1.2.0] - 2024-01-16

### Added
- User profile page with edit functionality (#456)

### Fixed
- Login button double submit issue (#789)

### Changed
- API base URL for production migration

## [1.1.0] - 2024-01-10
...
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/changelog-add` | Add changelog entry |
| `/changelog-view` | View recent changes |
| `/changelog-search` | Search changelog |
