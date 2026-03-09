# WCAG Compliance Check Prompt

Check component or page for WCAG 2.1 compliance.

---

## Prompt Template

```markdown
## WCAG Compliance Check

Please check the following code for WCAG 2.1 {{level}} compliance:

```{{language}}
{{code}}
```

### Check For:

**Perceivable (WCAG 1.x)**
- [ ] Text alternatives for non-text content (1.1)
- [ ] Captions and alternatives for multimedia (1.2)
- [ ] Content adaptable to different presentations (1.3)
- [ ] Distinguishable content (color, contrast) (1.4)

**Operable (WCAG 2.x)**
- [ ] Keyboard accessible (2.1)
- [ ] Enough time to read and use content (2.2)
- [ ] No content that causes seizures (2.3)
- [ ] Navigable with clear wayfinding (2.4)
- [ ] Input modalities beyond keyboard (2.5)

**Understandable (WCAG 3.x)**
- [ ] Readable text content (3.1)
- [ ] Predictable operation (3.2)
- [ ] Input assistance for forms (3.3)

**Robust (WCAG 4.x)**
- [ ] Compatible with assistive technologies (4.1)

### Output Format:
For each finding, provide:
1. WCAG criterion violated (e.g., "1.1.1 Non-text Content")
2. Level (A, AA, or AAA)
3. Issue description
4. Code location
5. Remediation suggestion
6. Code fix (if applicable)
```

---

## Usage Examples

### Check Component for AA Compliance

```markdown
pa:a11y wcag AA

Check this button component for WCAG AA compliance:

```tsx
export const Button = ({ children, onClick }) => (
  <div onClick={onClick} style={{ backgroundColor: '#777', color: '#999' }}>
    {children}
  </div>
);
```
```

### Expected Output

```markdown
## WCAG Compliance Report

### Violations Found: 3

#### 1. WCAG 1.4.3 Contrast (Minimum) - Level AA
**Issue:** Insufficient color contrast between text (#999) and background (#777)
**Ratio:** 1.63:1 (Required: 4.5:1 for normal text)
**Location:** Button component styles
**Fix:**
```tsx
style={{ backgroundColor: '#777', color: '#fff' }}
// or
style={{ backgroundColor: '#333', color: '#fff' }}
```

#### 2. WCAG 2.1.1 Keyboard - Level A
**Issue:** `<div>` with onClick is not keyboard accessible
**Location:** Button component
**Fix:**
```tsx
<button onClick={onClick}>
  {children}
</button>
```

#### 3. WCAG 4.1.2 Name, Role, Value - Level A
**Issue:** Using `<div>` instead of semantic `<button>` element
**Location:** Button component
**Fix:** Use native `<button>` element or add `role="button"` with keyboard handlers

### Recommended Fixed Code

```tsx
export const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{ backgroundColor: '#333', color: '#fff' }}
  >
    {children}
  </button>
);
```
```

---

## WCAG Quick Reference

### Level A (Minimum)
Must pass for basic accessibility:
- 1.1.1 Non-text Content
- 1.3.1 Info and Relationships
- 1.4.1 Use of Color
- 2.1.1 Keyboard
- 2.4.1 Bypass Blocks
- 4.1.1 Parsing
- 4.1.2 Name, Role, Value

### Level AA (Standard)
Required for most compliance:
- 1.4.3 Contrast (Minimum) - 4.5:1
- 1.4.4 Resize Text
- 2.4.6 Headings and Labels
- 2.4.7 Focus Visible
- 3.1.2 Language of Parts
- 3.2.3 Consistent Navigation

### Level AAA (Enhanced)
Best practice:
- 1.4.6 Contrast (Enhanced) - 7:1
- 2.4.9 Link Purpose
- 3.1.5 Reading Level
- 3.2.5 Change on Request

---

## Automated Checks

```typescript
// These can be automated with tools
const automatedChecks = [
  'color-contrast',
  'image-alt',
  'label',
  'link-name',
  'list',
  'listitem',
  'meta-viewport',
  'valid-lang'
];

// These require manual review
const manualChecks = [
  'meaningful-alt-text',
  'logical-tab-order',
  'consistent-navigation',
  'error-prevention'
];
```

---

## Integration with Testing

```typescript
// vitest + @axe-core/react
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no WCAG violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
