# Code Review Checklist

Use this checklist before marking a feature as review-complete.

---

## 1. Code Quality

### General
- [ ] Code follows project conventions
- [ ] No commented-out code
- [ ] No console.log/debug statements
- [ ] No TODO comments without tickets
- [ ] Functions are reasonably sized (< 50 lines)
- [ ] No duplicate code

### Naming
- [ ] Variables have meaningful names
- [ ] Functions describe what they do
- [ ] Constants are UPPER_SNAKE_CASE
- [ ] No abbreviations without context

### Structure
- [ ] Single responsibility principle followed
- [ ] Proper separation of concerns
- [ ] No deep nesting (max 3-4 levels)
- [ ] Consistent code organization

---

## 2. Security

### Critical
- [ ] No hardcoded secrets or credentials
- [ ] No sensitive data in logs
- [ ] Input validation present
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (proper escaping)

### Authentication & Authorization
- [ ] Auth checks in place
- [ ] Role-based access enforced
- [ ] Session handling is secure

### Data
- [ ] Sensitive data encrypted
- [ ] PII handled properly
- [ ] GDPR compliance (if applicable)

---

## 3. Performance

### General
- [ ] No N+1 query problems
- [ ] Expensive operations are cached
- [ ] No unnecessary re-renders (React)
- [ ] Large lists are virtualized

### Database
- [ ] Indexes used appropriately
- [ ] Queries are optimized
- [ ] Batch operations where possible

### Frontend
- [ ] Images are optimized
- [ ] Lazy loading implemented
- [ ] Bundle size checked

---

## 4. Error Handling

- [ ] Errors are caught and handled
- [ ] User-friendly error messages
- [ ] Errors are logged appropriately
- [ ] Edge cases are handled
- [ ] Graceful degradation implemented

---

## 5. Testing

- [ ] Unit tests cover new code
- [ ] Integration tests for API changes
- [ ] Edge cases have tests
- [ ] Tests are meaningful (not just coverage)
- [ ] All tests pass

---

## 6. Documentation

- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] Public APIs are documented
- [ ] README updated (if needed)
- [ ] Changelog updated

---

## 7. Accessibility (Frontend)

- [ ] Semantic HTML used
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Screen reader tested

---

## 8. Type Safety (TypeScript)

- [ ] No `any` types
- [ ] Interfaces/types are defined
- [ ] Null/undefined handled
- [ ] Generics used appropriately

---

## 9. Git

- [ ] Commits are atomic
- [ ] Commit messages are clear
- [ ] No merge conflicts
- [ ] Branch is up to date with base

---

## 10. Final Checks

- [ ] Build succeeds
- [ ] Linter passes
- [ ] No new warnings
- [ ] Works in all environments
- [ ] Feature flag implemented (if needed)

---

## Review Decision

- [ ] **Approved** - Ready to merge
- [ ] **Approved with suggestions** - Minor changes recommended
- [ ] **Request changes** - Must fix before merge
- [ ] **Needs discussion** - Architectural concerns

**Reviewer Notes:**
[Add any notes or concerns here]
