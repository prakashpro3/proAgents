# Error Tracker

> Log errors encountered during development and their solutions.
> This helps AIs avoid repeating the same mistakes and find solutions faster.

## How to Log Errors

Use `pa:error "description"` or add manually when you encounter and solve an error.

---

## Error Log

<!-- Add new errors below this line, newest first -->

### [TEMPLATE] Example Error
**Date:** 2024-03-06
**Logged by:** Claude (opus-4)
**Error:**
```
TypeError: Cannot read property 'map' of undefined
```
**File:** src/components/UserList.tsx:42
**Cause:** API returned null instead of empty array when no users exist
**Solution:**
```typescript
// Before
users.map(user => ...)

// After
(users || []).map(user => ...)
```
**Prevention:** Always provide default values for arrays from API responses

---

