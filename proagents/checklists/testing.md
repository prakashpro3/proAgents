# Testing Checklist

Comprehensive testing checklist for features.

---

## Unit Tests

### Components

- [ ] Renders without crashing
- [ ] Renders with required props
- [ ] Renders with all props
- [ ] Handles missing optional props
- [ ] Click handlers work
- [ ] Input changes handled
- [ ] Displays loading state
- [ ] Displays error state
- [ ] Displays empty state

### Functions

- [ ] Returns expected output for valid input
- [ ] Handles empty input
- [ ] Handles null/undefined
- [ ] Handles edge cases
- [ ] Throws for invalid input
- [ ] Performance is acceptable

### Hooks

- [ ] Returns expected initial values
- [ ] Updates on dependency changes
- [ ] Side effects work correctly
- [ ] Cleanup on unmount
- [ ] Handles errors gracefully

---

## Integration Tests

- [ ] Component interactions work
- [ ] Data flows correctly
- [ ] State updates propagate
- [ ] API calls succeed
- [ ] Error handling works
- [ ] Navigation works

---

## API Tests

- [ ] Successful request returns correct data
- [ ] Invalid input returns 400
- [ ] Unauthorized returns 401
- [ ] Forbidden returns 403
- [ ] Not found returns 404
- [ ] Server errors return 500
- [ ] Request validation works
- [ ] Response format correct

---

## E2E Tests

- [ ] Happy path works
- [ ] User can complete primary flow
- [ ] Error scenarios handled
- [ ] Form validation works
- [ ] Navigation works
- [ ] Data persists correctly

---

## Cross-Browser

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

---

## Responsive

- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large (1440px)

---

## Accessibility

- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast
- [ ] Focus indicators
- [ ] Form labels
- [ ] Error announcements

---

## Performance

- [ ] Load time acceptable
- [ ] No memory leaks
- [ ] No excessive re-renders
- [ ] Large data sets handled

---

## Coverage

- [ ] Statements: ____%
- [ ] Branches: ____%
- [ ] Functions: ____%
- [ ] Lines: ____%
- [ ] Meets threshold: [ ]
