# Handoff Protocol Guide

Guidelines for handing off work between developers.

---

## Overview

Handoffs occur when:
- Developer goes on leave
- Task reassignment
- Shift change (global teams)
- Role change
- Project phase transition

---

## Handoff Types

### 1. Planned Handoff

Scheduled transfer with preparation time.
- Vacation coverage
- Project transitions
- Team restructuring

### 2. Emergency Handoff

Unplanned transfer requiring quick action.
- Sick leave
- Urgent reassignment
- Personal emergency

### 3. Partial Handoff

Sharing work without full transfer.
- Collaboration
- Knowledge sharing
- Temporary coverage

---

## Handoff Checklist

### Before Handoff

```markdown
## Pre-Handoff Checklist

**Handoff Type:** [Planned / Emergency / Partial]
**From:** @current-dev
**To:** @receiving-dev
**Date:** [YYYY-MM-DD]
**Duration:** [Temporary / Permanent]

### Preparation
- [ ] Identify all active work items
- [ ] Document current status of each
- [ ] Update all task trackers
- [ ] Commit and push all code
- [ ] Create work-in-progress branches
- [ ] Write handoff document
- [ ] Schedule handoff meeting
- [ ] Update calendar/availability
```

### During Handoff

```markdown
### Handoff Meeting
- [ ] Walk through active tasks
- [ ] Review codebase areas
- [ ] Explain ongoing issues
- [ ] Share context and decisions
- [ ] Introduce to stakeholders
- [ ] Transfer access/credentials (if needed)
- [ ] Answer questions
- [ ] Agree on check-in schedule
```

### After Handoff

```markdown
### Post-Handoff
- [ ] Receiving dev has all access
- [ ] Team notified of change
- [ ] Stakeholders informed
- [ ] Documentation updated
- [ ] First check-in scheduled
- [ ] Emergency contact shared
```

---

## Handoff Document Template

```markdown
# Work Handoff Document

**Date:** [YYYY-MM-DD]
**From:** [Name] (@username)
**To:** [Name] (@username)
**Return Date:** [Date or Permanent]

---

## Contact Information

### During Handoff Period
- Emergency contact: [phone/email]
- Available times: [if any]
- Escalation path: [manager/tech-lead]

---

## Active Work Items

### In Progress

#### 1. [Feature/Task Name]
- **Status:** [X% complete]
- **Branch:** `feature/branch-name`
- **PR:** [link if exists]
- **Priority:** [High/Medium/Low]
- **Deadline:** [date]
- **Description:** [what it is]
- **Current State:** [where you left off]
- **Next Steps:**
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- **Blockers:** [any blockers]
- **Key Files:**
  - `/src/feature/file.ts` - [description]
  - `/src/feature/another.ts` - [description]
- **Related Docs:** [links]
- **Stakeholders:** @person1, @person2
- **Notes:** [important context]

#### 2. [Another Task]
...

### Pending (Not Started)

| Task | Priority | Deadline | Notes |
|------|----------|----------|-------|
| [Task 1] | High | [date] | [notes] |
| [Task 2] | Medium | [date] | [notes] |

### On Hold

| Task | Reason | Resume When |
|------|--------|-------------|
| [Task] | [reason] | [condition] |

---

## Ongoing Responsibilities

### Daily Tasks
- [ ] [Task 1] - [frequency/time]
- [ ] [Task 2] - [frequency/time]

### Weekly Tasks
- [ ] [Task 1] - [day/time]
- [ ] [Task 2] - [day/time]

### Meetings to Attend
| Meeting | Time | Role | Notes |
|---------|------|------|-------|
| [Meeting] | [time] | [role] | [notes] |

---

## Key Context

### Recent Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| [Decision] | [Why] | [Date] |

### Known Issues
| Issue | Impact | Workaround |
|-------|--------|------------|
| [Issue] | [Impact] | [Workaround] |

### Important Relationships
| Person | Role | Context |
|--------|------|---------|
| @person | [role] | [relationship context] |

---

## Access & Credentials

### Required Access
- [ ] GitHub repo access
- [ ] Jira/Project board
- [ ] Slack channels: #channel1, #channel2
- [ ] AWS/Cloud console
- [ ] Database access

### Shared Credentials
⚠️ **Never include actual credentials here**
- Secret location: [vault path]
- Access request: [process]

---

## Documentation Links

- Project README: [link]
- Architecture docs: [link]
- API documentation: [link]
- Runbooks: [link]

---

## Emergency Procedures

### If Something Breaks
1. [Step 1]
2. [Step 2]
3. Escalate to: @manager, @tech-lead

### Critical Contacts
| Area | Contact | Phone |
|------|---------|-------|
| [Area] | @person | [if emergency] |

---

## Questions & Answers

**Q: [Anticipated question]?**
A: [Answer]

**Q: [Another question]?**
A: [Answer]

---

## Acknowledgment

**Handoff Completed:**
- [ ] From: @current-dev (Date: ________)
- [ ] To: @receiving-dev (Date: ________)
```

---

## Quick Handoff (Emergency)

For urgent handoffs with minimal prep time:

```markdown
# Emergency Handoff

**From:** @dev  **To:** @backup  **Date:** [now]

## Immediate Priorities
1. [Most critical task] - [status] - [next step]
2. [Second priority] - [status] - [next step]
3. [Third priority] - [status] - [next step]

## Current Branches
- `feature/xyz` - In progress, needs [X]
- `fix/abc` - Ready for review

## Blockers
- [Blocker 1] - Contact @person

## Today's Meetings
- [Time] - [Meeting] - [Action needed]

## Emergency Contact
[Phone number] - only if critical

## More Details
I'll send full handoff doc ASAP / Check [location]
```

---

## Best Practices

### For Handing Off

1. **Document continuously** - Don't wait for handoff
2. **Commit frequently** - Push WIP to branches
3. **Use descriptive commits** - Future context
4. **Update tickets** - Keep tracker current
5. **Write for others** - Assume no context
6. **Face-to-face when possible** - Video if remote

### For Receiving

1. **Ask questions** - Don't assume
2. **Take notes** - Document answers
3. **Verify access** - Test before handoff ends
4. **Start small** - Begin with context-building tasks
5. **Check in regularly** - Especially first few days
6. **Update docs** - Fix anything unclear

---

## Handoff Meeting Agenda

```markdown
## Handoff Meeting

**Duration:** 1-2 hours
**Attendees:** @from-dev, @to-dev, [@manager optional]

### Agenda

1. **Overview** (10 min)
   - Current role/responsibilities
   - Team structure
   - Key stakeholders

2. **Active Work** (30-45 min)
   - Walk through each active task
   - Show code and branches
   - Explain decisions and context

3. **Codebase Tour** (15-20 min)
   - Key directories
   - Important files
   - Common patterns

4. **Processes** (10 min)
   - Daily/weekly routines
   - Meeting schedule
   - Communication norms

5. **Access Verification** (10 min)
   - Test all access
   - Verify permissions

6. **Q&A** (15 min)
   - Open questions
   - Clarifications

7. **Next Steps** (5 min)
   - First tasks for receiver
   - Check-in schedule
```

---

## Configuration

```yaml
# proagents.config.yaml
handoff:
  templates:
    full: "templates/handoff-full.md"
    emergency: "templates/handoff-emergency.md"

  requirements:
    planned:
      notice_days: 5
      documentation: true
      meeting: true

    emergency:
      quick_doc: true
      async_ok: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:handoff-create` | Create handoff document |
| `pa:handoff-emergency` | Quick emergency handoff |
| `pa:handoff-checklist` | Show handoff checklist |
