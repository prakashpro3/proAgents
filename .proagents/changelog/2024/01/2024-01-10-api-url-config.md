# Change: API URL Configuration Update

**Date:** 2024-01-10 09:30 UTC
**Mode:** Quick Change
**Author:** devops-1
**Branch:** chore/api-url-update
**Commit:** 123abc456def

---

## Summary

Updated API base URL to use new production endpoint.

---

## Details

### What Changed
- Updated `NEXT_PUBLIC_API_URL` default value
- Updated `.env.example` documentation

### Reason
Migration to new API infrastructure with improved latency.

### Files Modified
- `.env.example` (1 line)
- `src/config/api.ts` (1 line)

---

## Verification

- [x] Tested: API calls work with new URL
- [x] Verified: No breaking changes

---

## Search Tags

`config` `api` `infrastructure` `quick-change`
