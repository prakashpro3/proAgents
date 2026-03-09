# AI Feedback Log

> Track corrections and feedback to help AIs learn from mistakes.
> When an AI makes a mistake or user provides correction, log it here.

## How to Log Feedback

Use `pa:feedback "description"` or add manually.

Types:
- **correction**: AI did something wrong, here's the fix
- **preference**: User prefers things done a certain way
- **praise**: AI did something well (reinforcement)

---

## Feedback Log

<!-- Add new feedback below, newest first -->

### [TEMPLATE] Example Correction
**Date:** 2024-03-06
**Type:** correction
**AI:** Claude (opus-4)
**Context:** AI generated a React component
**Issue:** Used class components instead of functional components
**Correction:** This project uses functional components with hooks only. Never use class components.
**Apply to:** All React components in this project

---

### [TEMPLATE] Example Preference
**Date:** 2024-03-06
**Type:** preference
**AI:** Cursor (gpt-4o)
**Context:** Code style
**Preference:** Always use explicit return types in TypeScript functions
**Example:**
```typescript
// Don't do this
const add = (a: number, b: number) => a + b;

// Do this
const add = (a: number, b: number): number => a + b;
```
**Apply to:** All TypeScript files

---

