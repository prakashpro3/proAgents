# Recent Changes - Template Reference

> This is the FORMAT REFERENCE for `_recent.md`.
> AI should read this template when creating/updating `_recent.md`.
> DO NOT modify this file - it gets updated with ProAgents upgrades.

---

## Expected Structure

```markdown
# Recent Changes

> Last 10 changes across all features/modules.
> Auto-updated by AI after each code change.

---

## Latest Changes

### YYYY-MM-DD - [Change Type]
**Module:** [auto-detected from file path]
**AI:** [Platform] ([model])
**Files:** path/to/file.ts (+lines, -lines)
**Summary:** Brief description of change

---
```

## Entry Format

Each entry should include:

| Field | Description | Example |
|-------|-------------|---------|
| Date | ISO format | `2024-03-13` |
| Change Type | bug-fix, feature, refactor, docs | `bug-fix` |
| Module | Auto-detected from path | `auth`, `api`, `ui` |
| AI | Platform and model | `Claude (opus-4)` |
| Files | Changed files with line counts | `src/auth.ts (+15, -3)` |
| Summary | Brief description | `Fixed login timeout issue` |

## Auto-Update Rules

1. **Prepend** new entries (newest first)
2. **Keep only last 10** entries
3. **Auto-detect module** from file path:
   - `src/api/*` → api
   - `src/auth/*` → auth
   - `src/components/*` → ui
4. **Update after every file edit**
