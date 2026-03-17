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

---

## Flow Context
<!-- Tracks command chain for seamless transitions between pa: commands -->
```
Current Flow: [command chain, e.g., "rnd → feature → plan"]
Last Command: [last pa: command run]
Decision: [key decision made, if any]
Context: [relevant context to carry forward]
Next Suggested: [suggested next command]
Data: [JSON data to pass to next command]
```

### Flow Context Rules

1. **Write after completion** - Each command writes its output to Flow Context
2. **Read on start** - Commands check Flow Context for relevant prior decisions
3. **Offer continuation** - If Flow Context has Next Suggested, offer to run it
4. **Clear on explicit start** - When user starts fresh workflow, clear Flow Context
5. **Preserve data** - JSON data carries structured info (tech stack, decisions, etc.)

### Example Flow

```markdown
## Flow Context
```
Current Flow: rnd → feature
Last Command: pa:rnd-compare
Decision: Zustand for state management
Context: E-commerce cart with complex state
Next Suggested: pa:feature "cart state management"
Data: {"tech": "zustand", "use_case": "cart", "research_doc": "docs/research/comparisons/state-management-2024-03-17.md"}
```
```

When pa:feature starts, it reads this and says:
```
📋 Continuing from R&D...

You recently decided on Zustand for cart state management.
Research: docs/research/comparisons/state-management-2024-03-17.md

Start feature with this context? (yes/no/different)
```

---

## Auto-Update Rules

1. **Update `Last Updated`** with current timestamp
2. **Update `Last AI`** with current platform
3. **Keep Quick Summary under 5 lines**
4. **Update Test Status after test runs**
5. **Update Recent Changes with last 3-5 items**
6. **Calculate Feature Progress from active-features/**
