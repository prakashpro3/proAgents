# Feature Changelogs

One file per feature tracking all changes.

---

## Structure

```
features/
├── README.md           # This file
├── user-auth.md        # All changes to user-auth feature
├── payment-flow.md     # All changes to payment feature
└── dashboard.md        # All changes to dashboard feature
```

---

## File Format

Each feature changelog follows this format:

```markdown
# Feature: [Feature Name]

Created: YYYY-MM-DD
Status: [active | completed | paused]
Branch: feature/feature-name

---

## Changelog

### YYYY-MM-DD - [AI Platform]
**Phase:** implementation
**Changes:**
- Added login validation
- Created LoginForm component
**Files:**
- src/auth/login.ts (+50, -10)
- src/components/LoginForm.tsx (new)
**Decisions:**
- Used Formik for form handling
**Next:** Add password reset flow

---

### YYYY-MM-DD - [AI Platform]
...
```

---

## Auto-Creation

When AI runs `pa:feature "user-auth"`:
1. Creates `features/user-auth.md`
2. Initializes with template
3. Updates on every change

---

## Commands

| Command | Action |
|---------|--------|
| `pa:changelog` | Update root + feature changelog |
| `pa:changelog-feature X` | View feature X changelog |
