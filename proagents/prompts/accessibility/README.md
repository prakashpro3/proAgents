# Accessibility Prompts

AI-assisted accessibility review and improvement for web applications.

---

## Overview

These prompts help ensure your application is accessible to all users, including those using assistive technologies. ProAgents integrates accessibility checks throughout the development workflow.

---

## Available Prompts

| Prompt | Use Case | When to Use |
|--------|----------|-------------|
| [wcag.md](./wcag.md) | WCAG compliance check | Before release, during reviews |
| [aria.md](./aria.md) | ARIA implementation | When building interactive components |
| [keyboard.md](./keyboard.md) | Keyboard navigation | For all interactive elements |

---

## Quick Commands

```bash
# Full accessibility audit
/a11y audit <component>

# Check WCAG compliance at specific level
/a11y wcag AA

# Review ARIA implementation
/a11y aria <component>

# Check keyboard navigation
/a11y keyboard <component>

# Fix specific accessibility issue
/a11y fix <issue>

# Generate accessibility tests
/a11y test <component>
```

---

## WCAG Compliance Levels

| Level | Description | Required For |
|-------|-------------|--------------|
| **A** | Minimum accessibility | Legal compliance baseline |
| **AA** | Industry standard | Most web applications, government sites |
| **AAA** | Enhanced accessibility | Maximum accessibility, specialized apps |

### Target Level Recommendation

Most projects should target **WCAG 2.1 AA** compliance:
- Required by many accessibility laws (ADA, Section 508)
- Covers most common accessibility needs
- Achievable with reasonable effort

---

## Integration with Workflow

### During Implementation (Phase 5)
- Prompts guide accessible component creation
- Real-time ARIA suggestions
- Keyboard handling reminders

### During Testing (Phase 6)
- Automated accessibility checks
- axe-core integration
- Screen reader testing guidance

### During Code Review (Phase 6.5)
- Accessibility-focused review checklist
- Common issue detection
- Fix suggestions

---

## Key Accessibility Areas

### 1. Perceivable
Users must be able to perceive the information:
- Text alternatives for images
- Captions for multimedia
- Sufficient color contrast
- Resizable text

### 2. Operable
Users must be able to operate the interface:
- Keyboard accessible
- No time limits or adjustable
- No seizure-inducing content
- Clear navigation

### 3. Understandable
Users must understand the content:
- Readable text
- Predictable behavior
- Input assistance

### 4. Robust
Content must work with assistive technologies:
- Valid HTML
- Proper ARIA usage
- Compatible with screen readers

---

## Common Accessibility Issues

| Issue | Impact | Quick Fix |
|-------|--------|-----------|
| Missing alt text | Screen readers skip images | Add descriptive `alt` |
| Low contrast | Hard to read | Increase contrast ratio |
| No focus indicator | Can't navigate by keyboard | Add `:focus` styles |
| Missing labels | Forms unusable | Add `<label>` elements |
| No skip links | Hard to navigate | Add skip to content link |

---

## Testing Tools

### Automated
- **axe-core**: Browser extension and library
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluator
- **jest-axe**: Accessibility testing in Jest

### Manual
- **Keyboard-only navigation**: Tab through everything
- **Screen readers**: VoiceOver, NVDA, JAWS
- **High contrast mode**: Test visibility
- **Zoom**: Test at 200% zoom

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/)
