# Communication Templates

Standard templates for team communication during development.

---

## Feature Development Notifications

### Feature Start Notification

```markdown
## 🚀 Feature Started

**Feature:** [Feature Name]
**Branch:** `feature/[branch-name]`
**Assigned:** @developer
**Started:** [Date]

### Summary
[Brief description of the feature]

### Scope
- [Key deliverable 1]
- [Key deliverable 2]
- [Key deliverable 3]

### Areas Affected
- Files: [list or "TBD after analysis"]
- Modules: [list affected modules]
- APIs: [list affected APIs]

### Dependencies
- Depends on: [other features/PRs]
- Blocks: [features waiting on this]

### Timeline
- Analysis: [date]
- Implementation: [date range]
- Review: [date]
- Target completion: [date]

### Notes
[Any additional context or considerations]

---
cc: @team-lead @relevant-stakeholders
```

### Feature Progress Update

```markdown
## 📊 Feature Progress Update

**Feature:** [Feature Name]
**Branch:** `feature/[branch-name]`
**Date:** [Date]

### Current Status
- **Phase:** [Implementation / Testing / Review]
- **Progress:** [X]%
- **On Track:** ✅ Yes / ⚠️ At Risk / ❌ Delayed

### Completed
- [x] [Completed item 1]
- [x] [Completed item 2]

### In Progress
- [ ] [Current work item]

### Remaining
- [ ] [Remaining item 1]
- [ ] [Remaining item 2]

### Blockers
- [Blocker description, if any]
- Waiting on: @person

### Changes from Plan
- [Any scope changes or pivots]

### Next Steps
1. [Next step 1]
2. [Next step 2]

---
cc: @team-lead
```

### Feature Complete Notification

```markdown
## ✅ Feature Complete

**Feature:** [Feature Name]
**Branch:** `feature/[branch-name]`
**PR:** #[PR number]
**Completed:** [Date]

### Summary
[Brief summary of what was delivered]

### What Was Built
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Files Changed
- Created: [X] files
- Modified: [X] files
- Deleted: [X] files

### Test Coverage
- Unit tests: [X] added
- Integration tests: [X] added
- Coverage: [X]%

### Documentation
- [Link to docs if applicable]

### Ready for Review
- [ ] Code review: @reviewer
- [ ] Design review: @designer (if applicable)
- [ ] QA review: @qa (if applicable)

### Deployment Notes
- [Any deployment considerations]
- [Environment variables needed]

---
cc: @team-lead @reviewers
```

---

## Code Review Communication

### Review Request

```markdown
## 👀 Review Request

**PR:** #[PR number]
**Feature:** [Feature Name]
**Author:** @developer

### Review Type
- [ ] Full review (new feature)
- [ ] Quick review (bug fix)
- [ ] Architecture review
- [ ] Security review

### Changes Summary
[Brief description of changes]

### Key Areas to Review
1. [Specific area 1] - [why it needs attention]
2. [Specific area 2] - [why it needs attention]

### Testing Done
- [x] Unit tests pass
- [x] Manual testing completed
- [x] [Other testing]

### Review Deadline
[Date] - [Reason if urgent]

### Context
[Any additional context reviewers need]

---
Requested reviewers: @reviewer1 @reviewer2
```

### Review Complete

```markdown
## ✅ Review Complete

**PR:** #[PR number]
**Reviewer:** @reviewer

### Decision
- ✅ Approved
- 🔄 Approved with suggestions
- ⚠️ Request changes

### Summary
[Brief summary of review findings]

### Comments
- **Blocking:** [X] items
- **Suggestions:** [X] items
- **Praise:** [X] items

### Key Feedback
1. [Most important feedback point]
2. [Second important point]

### Next Steps
- [ ] [Required action if changes requested]

---
cc: @developer
```

---

## Bug Reports

### Bug Report Template

```markdown
## 🐛 Bug Report

**Title:** [Brief description]
**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
**Found in:** [Environment/Version]
**Reported by:** @reporter
**Date:** [Date]

### Description
[Detailed description of the bug]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots/Videos
[Attach if applicable]

### Environment
- Browser/Device: [details]
- OS: [details]
- Version: [app version]

### Logs
```
[Relevant error logs]
```

### Impact
- Users affected: [estimate]
- Workaround available: Yes/No

### Related
- Related issues: #[issue numbers]
- Related PRs: #[PR numbers]

---
Assigned: @developer
Priority: [Priority level]
```

### Bug Fix Notification

```markdown
## 🔧 Bug Fixed

**Bug:** #[Issue number] - [Title]
**PR:** #[PR number]
**Fixed by:** @developer
**Fixed in:** [Version/Branch]

### Root Cause
[Explanation of why the bug occurred]

### Solution
[Brief explanation of the fix]

### Files Changed
- [File 1]: [What changed]
- [File 2]: [What changed]

### Testing
- [x] Bug no longer reproducible
- [x] Related functionality tested
- [x] Regression tests added

### Deployment
- [ ] Deployed to staging
- [ ] Ready for production

### Verification Steps
1. [How to verify the fix]
2. [Step 2]

---
cc: @reporter @qa
```

---

## Deployment Communication

### Deployment Notification

```markdown
## 🚢 Deployment Notification

**Environment:** [Staging / Production]
**Version:** [Version number]
**Date/Time:** [Date and time]
**Deployed by:** @deployer

### Changes Included
- [Feature 1] (#PR)
- [Feature 2] (#PR)
- [Bug fix 1] (#PR)

### Deployment Checklist
- [x] All tests passing
- [x] Code review approved
- [x] Staging tested
- [x] Rollback plan ready

### Breaking Changes
- [List any breaking changes]
- Migration required: Yes/No

### Action Required
- [ ] [Any manual steps needed]
- [ ] [Configuration changes]

### Monitoring
- Dashboard: [link]
- Alerts: [configured]

### Rollback Plan
[How to rollback if issues found]

---
cc: @team @on-call
```

### Incident Notification

```markdown
## 🚨 Incident Alert

**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium
**Status:** Investigating / Identified / Monitoring / Resolved
**Started:** [Time]
**Duration:** [Ongoing / X minutes]

### Impact
- Affected: [What's affected]
- Users impacted: [Estimate]
- Error rate: [X]%

### Summary
[Brief description of the incident]

### Timeline
- [Time]: [Event]
- [Time]: [Event]
- [Time]: [Event]

### Current Actions
- [Action being taken]
- [Action being taken]

### Incident Commander
@person

### Updates
Next update in: [X] minutes

---
cc: @on-call @leadership
```

---

## Handoff Communication

### Work Handoff

```markdown
## 🔄 Work Handoff

**From:** @current-developer
**To:** @next-developer
**Feature/Task:** [Name]
**Date:** [Date]

### Current Status
- Branch: `[branch-name]`
- Phase: [Phase]
- Progress: [X]%

### What's Done
- [x] [Completed item 1]
- [x] [Completed item 2]

### What's Remaining
- [ ] [Remaining item 1]
- [ ] [Remaining item 2]

### Key Context
- [Important decision made and why]
- [Known issue to be aware of]
- [Design consideration]

### Files to Focus On
- `[file1.ts]` - [what's there]
- `[file2.ts]` - [what's there]

### Blockers/Dependencies
- [Any blockers]
- Waiting on: [items/people]

### Resources
- Design: [link]
- Requirements: [link]
- Related PRs: #[numbers]

### Questions?
[Best way to reach for questions]

---
cc: @team-lead
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/notify-start` | Send feature start notification |
| `/notify-update` | Send progress update |
| `/notify-complete` | Send completion notification |
| `/notify-deploy` | Send deployment notification |
| `/handoff` | Generate handoff document |
