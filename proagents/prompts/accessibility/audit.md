# Accessibility Audit

Comprehensive accessibility review for components.

---

## Prompt Template

```
Review this component for accessibility:

{code}

Check for:
1. Semantic HTML usage
2. ARIA attributes
3. Keyboard navigation
4. Focus management
5. Color contrast
6. Screen reader compatibility
7. Form accessibility
8. Error handling
9. Dynamic content announcements
10. Touch target sizes

Provide:
- Issues found (with WCAG references)
- Severity levels
- Fixed code examples
- Testing recommendations
```

---

## Audit Checklist

### Semantic HTML

```typescript
// ❌ Bad: Non-semantic
<div onClick={handleClick}>Click me</div>
<div class="heading">Title</div>
<div class="list">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ✅ Good: Semantic
<button onClick={handleClick}>Click me</button>
<h1>Title</h1>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### ARIA Attributes

```typescript
// ❌ Missing ARIA
<div onClick={toggleMenu}>Menu</div>
<div>{isLoading ? 'Loading...' : content}</div>

// ✅ With ARIA
<button
  onClick={toggleMenu}
  aria-expanded={isOpen}
  aria-haspopup="true"
  aria-controls="menu-list"
>
  Menu
</button>

<div
  role="status"
  aria-live="polite"
  aria-busy={isLoading}
>
  {isLoading ? 'Loading...' : content}
</div>
```

### Keyboard Navigation

```typescript
// ❌ Not keyboard accessible
<div onClick={handleSelect} className="option">
  Option 1
</div>

// ✅ Keyboard accessible
<div
  role="option"
  tabIndex={0}
  onClick={handleSelect}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleSelect();
    }
  }}
  aria-selected={isSelected}
>
  Option 1
</div>
```

### Focus Management

```typescript
// ❌ No focus management
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return <div className="modal">{children}</div>;
}

// ✅ Proper focus management
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  // Trap focus in modal
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab') {
      // Focus trap logic
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
```

### Form Accessibility

```typescript
// ❌ Inaccessible form
<input placeholder="Enter email" />
<span className="error">Invalid email</span>

// ✅ Accessible form
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email address
  </span>
)}
```

### Images and Media

```typescript
// ❌ Missing alt text
<img src="/logo.png" />
<img src="/decorative-border.png" alt="decorative border" />

// ✅ Proper alt text
<img src="/logo.png" alt="Company Name" />
<img src="/decorative-border.png" alt="" role="presentation" />
```

---

## Common Issues

| Issue | WCAG | Severity | Fix |
|-------|------|----------|-----|
| Missing alt text | 1.1.1 | Critical | Add descriptive alt |
| No focus visible | 2.4.7 | High | Add focus styles |
| Low contrast | 1.4.3 | High | Increase contrast |
| No keyboard access | 2.1.1 | Critical | Add keyboard handlers |
| Missing form labels | 1.3.1 | High | Add label elements |
| No skip links | 2.4.1 | Medium | Add skip navigation |

---

## Testing Tools

```bash
# Run accessibility audit
pa:a11y audit ./src/components/Button.tsx

# Check specific WCAG criteria
pa:a11y check 1.4.3  # Color contrast

# Generate a11y tests
pa:a11y test-gen ./src/components/Form.tsx
```

---

## Automated Testing

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```
