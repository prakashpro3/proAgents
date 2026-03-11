# Work Session Logs

Cross-AI continuity through session-based tracking.

---

## Purpose

When multiple AI platforms work on the same project, they need shared context. This directory maintains:

1. **`_context.md`** - Quick summary for any AI starting fresh
2. **Session logs** - Detailed record of each work session
3. **Continuity** - Next AI knows exactly where to continue

---

## Session Log Format

Each session creates: `YYYY-MM-DD-[ai]-[session].md`

Example: `2024-03-11-claude-001.md`

```markdown
# Work Session: 2024-03-11-claude-001

**AI Platform:** Claude (opus-4)
**Started:** 2024-03-11 10:30
**Duration:** 45 minutes

---

## Summary

Brief description of what was accomplished.

---

## Tasks Completed

### 1. [Task Name]
- **Status:** Completed
- **Files Modified:**
  - `src/auth/login.ts` - Added validation
  - `src/components/LoginForm.tsx` - UI update
- **Changes:** Description of changes
- **Tests:** Added 3 unit tests

### 2. [Task Name]
...

---

## Decisions Made

| Decision | Reason | Alternatives Considered |
|----------|--------|------------------------|
| Used JWT | Industry standard | Session cookies |
| zxcvbn lib | Lightweight, accurate | custom regex |

---

## Issues Encountered

- Issue: API rate limiting
- Resolution: Added retry logic with backoff

---

## Next Steps (For Next AI)

1. [ ] Connect password meter to signup form
2. [ ] Add unit tests for validation
3. [ ] Update API documentation

---

## Files Changed Summary

| File | Action | Lines |
|------|--------|-------|
| src/auth/login.ts | Modified | +25, -5 |
| src/components/LoginForm.tsx | Modified | +40, -10 |
| tests/auth.test.ts | Created | +80 |
```

---

## Auto-Update Rules

After EVERY pa: command that modifies code, AI must:

1. **Update `_context.md`** with current state
2. **Create/update session log** for the day
3. **Log to `activity.log`** (command only)

---

## Commands

| Command | Action |
|---------|--------|
| `pa:sync` | Load context, read recent worklogs |
| `pa:session-start` | Begin new work session |
| `pa:session-end` | Finalize session, update context |
| `pa:handoff` | Create detailed handoff notes |

---

## Best Practices

1. **Always run `pa:sync` first** when starting work
2. **Log decisions** - Future AI needs to know WHY
3. **List next steps** - Make continuation easy
4. **Be specific** - File names, line numbers, exact changes
