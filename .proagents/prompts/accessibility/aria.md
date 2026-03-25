# ARIA Implementation Prompt

Guide for implementing ARIA attributes correctly.

---

## Prompt Template

```markdown
## ARIA Implementation Review

Review the following component for correct ARIA implementation:

```{{language}}
{{code}}
```

### Check For:

**First Rule of ARIA: Don't Use ARIA**
- [ ] Can native HTML elements provide the same semantics?
- [ ] Is ARIA actually needed here?

**ARIA Roles**
- [ ] Role matches the component's purpose
- [ ] Role is valid for the element type
- [ ] Required states/properties are included

**ARIA States and Properties**
- [ ] States update dynamically with component state
- [ ] Properties are correctly specified
- [ ] Values are valid for the attribute

**ARIA Relationships**
- [ ] aria-labelledby references exist
- [ ] aria-describedby references exist
- [ ] aria-controls references exist
- [ ] aria-owns relationships are correct

### Output Format:
1. ARIA usage assessment (needed/not needed)
2. Issues found
3. Correct implementation
4. Code examples
```

---

## Common ARIA Patterns

### Modal Dialog

```tsx
// Correct ARIA for modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Delete</h2>
  <p id="modal-description">
    Are you sure you want to delete this item?
  </p>
  <button onClick={onConfirm}>Delete</button>
  <button onClick={onCancel}>Cancel</button>
</div>
```

### Expandable Section

```tsx
// Correct ARIA for accordion/expandable
<div>
  <button
    aria-expanded={isExpanded}
    aria-controls="section-content"
    onClick={toggle}
  >
    Section Title
  </button>
  <div
    id="section-content"
    hidden={!isExpanded}
  >
    Section content...
  </div>
</div>
```

### Tab Panel

```tsx
// Correct ARIA for tabs
<div role="tablist" aria-label="Settings">
  <button
    role="tab"
    id="tab-1"
    aria-selected={activeTab === 0}
    aria-controls="panel-1"
  >
    General
  </button>
  <button
    role="tab"
    id="tab-2"
    aria-selected={activeTab === 1}
    aria-controls="panel-2"
  >
    Security
  </button>
</div>

<div
  role="tabpanel"
  id="panel-1"
  aria-labelledby="tab-1"
  hidden={activeTab !== 0}
>
  General settings content...
</div>
```

### Loading State

```tsx
// Correct ARIA for loading
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? (
    <span role="status">Loading...</span>
  ) : (
    <DataTable data={data} />
  )}
</div>
```

### Form Error

```tsx
// Correct ARIA for form validation
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
  />
  {error && (
    <span id="email-error" role="alert">
      {error}
    </span>
  )}
</div>
```

---

## ARIA Role Categories

### Widget Roles
| Role | Use For |
|------|---------|
| `button` | Clickable element (prefer `<button>`) |
| `checkbox` | Boolean input (prefer `<input type="checkbox">`) |
| `combobox` | Autocomplete input |
| `dialog` | Modal window |
| `menu` | Dropdown/context menu |
| `menuitem` | Item in menu |
| `slider` | Range input |
| `tab` | Tab in tablist |
| `tabpanel` | Content for tab |

### Document Structure Roles
| Role | Use For |
|------|---------|
| `article` | Self-contained content |
| `heading` | Section heading |
| `list` | List of items |
| `listitem` | Item in list |
| `table` | Data table |

### Landmark Roles
| Role | HTML Equivalent |
|------|-----------------|
| `banner` | `<header>` |
| `navigation` | `<nav>` |
| `main` | `<main>` |
| `region` | `<section>` with label |
| `contentinfo` | `<footer>` |

---

## Common Mistakes

### 1. Redundant ARIA

```tsx
// ❌ Bad - redundant
<button role="button">Click me</button>
<nav role="navigation">...</nav>

// ✅ Good - native semantics
<button>Click me</button>
<nav>...</nav>
```

### 2. Missing Required Properties

```tsx
// ❌ Bad - missing aria-controls
<button aria-expanded={open}>Toggle</button>

// ✅ Good - complete
<button
  aria-expanded={open}
  aria-controls="panel-id"
>
  Toggle
</button>
```

### 3. Invalid Role/Element Combinations

```tsx
// ❌ Bad - button role on non-focusable
<div role="button">Click me</div>

// ✅ Good - proper implementation
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
>
  Click me
</div>

// ✅ Better - use native element
<button onClick={handleClick}>Click me</button>
```

### 4. Static ARIA for Dynamic Content

```tsx
// ❌ Bad - static aria-expanded
<button aria-expanded="true">Menu</button>

// ✅ Good - dynamic state
<button aria-expanded={isMenuOpen}>Menu</button>
```

---

## Testing ARIA

```typescript
// Testing with @testing-library
it('should have correct ARIA attributes', () => {
  render(<Accordion />);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(button);

  expect(button).toHaveAttribute('aria-expanded', 'true');
});

// Testing accessible name
it('should have accessible name', () => {
  render(<Button aria-label="Close dialog">×</Button>);

  expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
});
```
