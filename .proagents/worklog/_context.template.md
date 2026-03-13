# Current Project Context - Template Reference

> This is the FORMAT REFERENCE for `_context.md`.
> AI should read this template when creating/updating `_context.md`.
> DO NOT modify this file - it gets updated with ProAgents upgrades.

---

## Expected Structure

```markdown
# Current Project Context

> **For AI Assistants:** Read this file first to understand current state.
> **Auto-updated** after each code change.

Last Updated: [ISO timestamp]
Last AI: [Platform (model)]

---

## Quick Summary
<!-- AI auto-generates - keep under 5 lines -->
```
Last: [Last action]
Active: [Feature name or "No active features"]
Pending: [N] tasks
Tests: [Passing/Failing/Unknown]
Status: [Current status]
```

---

## Test Status
<!-- AI updates after running tests -->
```
Status: [Passing/Failing/Unknown]
Last Run: [Timestamp]
Failing: [Test names or "None"]
```

---

## Feature Progress
<!-- AI auto-calculates -->
```
[Feature name]: [X]% ([done]/[total] tasks)
```

---

## Active Work
[Current active features or tasks]

---

## Recent Changes
[Last 3-5 changes]

---

## Pending Items
[Outstanding tasks]

---

## Quick Stats
| Metric | Value |
|--------|-------|
| Active Features | [N] |
| Completed Today | [N] |
| Open Issues | [N] |
```

## Auto-Update Rules

1. **Update `Last Updated`** with current timestamp
2. **Update `Last AI`** with current platform
3. **Keep Quick Summary under 5 lines**
4. **Update Test Status after test runs**
5. **Update Recent Changes with last 3-5 items**
6. **Calculate Feature Progress from active-features/**
