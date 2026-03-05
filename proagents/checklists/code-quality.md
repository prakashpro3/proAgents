# Code Quality Checklist

Use this checklist during development and before code review.

---

## Code Correctness

- [ ] Logic is correct and handles all cases
- [ ] Edge cases are handled properly
- [ ] No obvious bugs or errors
- [ ] Code meets all requirements
- [ ] No hardcoded values (use constants/config)

---

## Code Style

- [ ] Follows project naming conventions
- [ ] Consistent formatting (linter passes)
- [ ] No unnecessary comments
- [ ] No commented-out code
- [ ] No console.log or debug statements
- [ ] No TODO comments (or tracked in issues)
- [ ] Imports organized properly

---

## TypeScript/Types

- [ ] Proper types used (no `any`)
- [ ] Interfaces/types well-defined
- [ ] Generic types where appropriate
- [ ] Strict null checks handled
- [ ] Function signatures are typed
- [ ] Return types are explicit

---

## Functions & Methods

- [ ] Functions have single responsibility
- [ ] Functions are not too long (< 50 lines)
- [ ] Parameter count is reasonable (< 4)
- [ ] No deeply nested logic (< 3 levels)
- [ ] Pure functions where possible
- [ ] Side effects are clear and documented

---

## Error Handling

- [ ] Errors are caught and handled
- [ ] Error messages are helpful
- [ ] Errors don't expose sensitive info
- [ ] Async errors handled (try/catch)
- [ ] Error boundaries for UI components
- [ ] Graceful degradation where appropriate

---

## Security

- [ ] Input is validated/sanitized
- [ ] No SQL/command injection risks
- [ ] No XSS vulnerabilities
- [ ] Authentication checked where needed
- [ ] Authorization enforced
- [ ] No hardcoded secrets
- [ ] Sensitive data not logged

---

## Performance

- [ ] No unnecessary re-renders (React)
- [ ] Expensive operations memoized
- [ ] No memory leaks
- [ ] Large lists are virtualized
- [ ] Images optimized
- [ ] Lazy loading where appropriate
- [ ] No N+1 queries

---

## Testing

- [ ] Unit tests written
- [ ] Tests cover happy path
- [ ] Tests cover edge cases
- [ ] Tests cover error cases
- [ ] Tests are meaningful (not just coverage)
- [ ] Tests are not flaky
- [ ] Test coverage meets threshold

---

## Documentation

- [ ] Public APIs documented
- [ ] Complex logic has comments
- [ ] README updated if needed
- [ ] API docs updated if needed
- [ ] Types serve as documentation

---

## Accessibility (UI)

- [ ] Semantic HTML used
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast sufficient
- [ ] Form labels associated
- [ ] Error messages accessible

---

## Git & PR

- [ ] Commit messages are clear
- [ ] Commits are atomic
- [ ] Branch is up to date with base
- [ ] No merge conflicts
- [ ] PR description is complete
- [ ] Linked to issue/ticket

---

## Final Check

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] No linting errors/warnings
- [ ] Self-review completed
- [ ] Ready for peer review
