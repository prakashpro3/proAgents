# Code Review Report Template

Document code review findings and decisions.

---

## Report Header

```markdown
# Code Review Report

**PR/MR:** #[number]
**Feature:** [Feature name]
**Author:** @developer
**Reviewer:** @reviewer
**Date:** [YYYY-MM-DD]
**Review Type:** [Full / Incremental / Security / Performance]

---
```

## Review Summary

```markdown
## Summary

### Verdict
- [ ] ✅ Approved
- [ ] ✅ Approved with minor suggestions
- [ ] ⚠️ Approved with required changes
- [ ] ❌ Changes requested

### Overall Assessment
[1-2 sentence summary of the overall code quality and implementation]

### Statistics
| Metric | Count |
|--------|-------|
| Files reviewed | [X] |
| Lines added | +[X] |
| Lines removed | -[X] |
| Comments made | [X] |
| Blocking issues | [X] |
| Suggestions | [X] |

---
```

## Detailed Findings

```markdown
## Findings

### 🔴 Blocking Issues
Issues that must be fixed before merge.

#### Issue 1: [Title]
**File:** `path/to/file.ts`
**Line:** [X]-[Y]

**Description:**
[Detailed description of the issue]

**Suggested Fix:**
```typescript
// Suggested code or approach
```

**Impact:**
- [ ] Security risk
- [ ] Performance issue
- [ ] Bug potential
- [ ] Breaking change

---

### 🟡 Should Fix
Important issues that should be addressed.

#### Issue 1: [Title]
**File:** `path/to/file.ts`
**Line:** [X]

**Description:**
[Description]

**Suggestion:**
[How to fix]

---

### 💡 Suggestions
Optional improvements for consideration.

#### Suggestion 1: [Title]
**File:** `path/to/file.ts`

**Current:**
```typescript
// Current implementation
```

**Suggested:**
```typescript
// Better implementation
```

**Benefit:** [Why this is better]

---

### ✅ Highlights
Well-done areas worth noting.

- [Positive observation 1]
- [Positive observation 2]

---
```

## Review Categories

```markdown
## Category Reviews

### Code Quality
| Aspect | Rating | Notes |
|--------|--------|-------|
| Readability | ⭐⭐⭐⭐⭐ | [notes] |
| Maintainability | ⭐⭐⭐⭐☆ | [notes] |
| Complexity | ⭐⭐⭐⭐⭐ | [notes] |
| DRY Principle | ⭐⭐⭐⭐☆ | [notes] |

### Testing
| Aspect | Status | Notes |
|--------|--------|-------|
| Unit tests present | ✅/❌ | [notes] |
| Tests are meaningful | ✅/❌ | [notes] |
| Edge cases covered | ✅/❌ | [notes] |
| Mocking appropriate | ✅/❌ | [notes] |

### Security
| Check | Status | Notes |
|-------|--------|-------|
| Input validation | ✅/⚠️/❌ | [notes] |
| Auth/authz correct | ✅/⚠️/❌ | [notes] |
| No secrets exposed | ✅/❌ | [notes] |
| SQL injection safe | ✅/N/A | [notes] |
| XSS prevention | ✅/N/A | [notes] |

### Performance
| Check | Status | Notes |
|-------|--------|-------|
| No obvious N+1 | ✅/⚠️/❌ | [notes] |
| Proper caching | ✅/⚠️/N/A | [notes] |
| Bundle size impact | ✅/⚠️ | [notes] |
| Memory leaks | ✅/⚠️ | [notes] |

### Documentation
| Check | Status | Notes |
|-------|--------|-------|
| Code comments | ✅/⚠️/❌ | [notes] |
| JSDoc/TypeDoc | ✅/⚠️/N/A | [notes] |
| README updated | ✅/N/A | [notes] |
| API docs updated | ✅/N/A | [notes] |

---
```

## Architectural Review

```markdown
## Architecture Review

### Patterns & Conventions
- [ ] Follows project architecture
- [ ] Consistent with existing patterns
- [ ] Proper separation of concerns
- [ ] No unnecessary coupling

### Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes documented
- [ ] Migration path provided

### Dependencies
- [ ] New dependencies justified
- [ ] Dependencies are maintained
- [ ] No security vulnerabilities
- [ ] License compatible

---
```

## Action Items

```markdown
## Action Items

### Required Before Merge
- [ ] [Action item 1]
- [ ] [Action item 2]

### Recommended
- [ ] [Optional action 1]
- [ ] [Optional action 2]

### Follow-up (can be done later)
- [ ] [Future improvement 1]
- [ ] [Future improvement 2]

---
```

## Discussion Points

```markdown
## Discussion Points

### Questions for Author
1. [Question about implementation choice]
2. [Question about behavior]

### Design Discussions
1. [Topic to discuss]
   - Author's approach: [description]
   - Alternative considered: [description]
   - Recommendation: [suggestion]

---
```

## Sign-off

```markdown
## Sign-off

**Reviewed by:** @reviewer
**Date:** [YYYY-MM-DD]
**Time spent:** [X] hours

### Review Notes
[Any final notes about the review process]

### Recommended Reviewers for Related Areas
- @person - [expertise area]
- @person - [expertise area]

---

**Next Steps:**
1. Address blocking issues
2. Consider suggestions
3. Request re-review when ready
```
