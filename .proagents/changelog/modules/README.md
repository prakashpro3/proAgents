# Module Changelogs

Track changes by code module/component.

---

## Structure

```
modules/
├── README.md       # This file
├── api.md          # All API changes
├── auth.md         # All auth module changes
├── ui.md           # All UI component changes
└── database.md     # All database changes
```

---

## File Format

```markdown
# Module: [Module Name]

Path: src/[module]/
Type: [api | service | component | utility]

---

## Changelog

### YYYY-MM-DD - [AI Platform]
**Context:** [Feature or Fix name]
**Changes:**
- Added rate limiting middleware
- Updated error responses
**Files:**
- src/api/middleware/rateLimit.ts (new)
- src/api/errors.ts (+20, -5)

---
```

---

## Auto-Detection

AI automatically detects module from file path:
- `src/api/*` → modules/api.md
- `src/auth/*` → modules/auth.md
- `src/components/*` → modules/ui.md
- `src/services/*` → modules/services.md
- `src/utils/*` → modules/utils.md

---

## Commands

| Command | Action |
|---------|--------|
| `pa:changelog-module X` | View module X changelog |
| `pa:modules` | List all modules with change counts |
