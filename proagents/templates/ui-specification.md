# UI Specification: [Feature/Component Name]

**Created:** [YYYY-MM-DD]
**Designer:** [Name]
**Developer:** [Name]
**Version:** [X.X]

---

## Overview

### Description
[Brief description of the UI element/feature being specified]

### Purpose
[Why this UI exists and what user need it addresses]

### Design Reference
- Figma: [link]
- Prototype: [link]
- Design System: [link]

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #3B82F6 | Primary buttons, links |
| `--color-primary-hover` | #2563EB | Primary hover states |
| `--color-secondary` | #10B981 | Secondary elements |
| `--color-background` | #FFFFFF | Page background |
| `--color-surface` | #F9FAFB | Card backgrounds |
| `--color-text` | #1F2937 | Primary text |
| `--color-text-muted` | #6B7280 | Secondary text |
| `--color-border` | #E5E7EB | Borders |
| `--color-error` | #EF4444 | Error states |
| `--color-success` | #10B981 | Success states |
| `--color-warning` | #F59E0B | Warning states |

### Typography

| Token | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| `--text-heading-1` | Inter | 32px | 700 | 1.2 |
| `--text-heading-2` | Inter | 24px | 600 | 1.3 |
| `--text-heading-3` | Inter | 20px | 600 | 1.4 |
| `--text-body` | Inter | 16px | 400 | 1.5 |
| `--text-body-small` | Inter | 14px | 400 | 1.5 |
| `--text-caption` | Inter | 12px | 400 | 1.4 |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing |
| `--space-2` | 8px | Component internal |
| `--space-3` | 12px | Small gaps |
| `--space-4` | 16px | Standard spacing |
| `--space-5` | 20px | Medium spacing |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Large spacing |
| `--space-10` | 40px | Extra large |
| `--space-12` | 48px | Page sections |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Modals |
| `--radius-full` | 9999px | Pills, avatars |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `--shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Cards |
| `--shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Dropdowns |
| `--shadow-xl` | 0 20px 25px rgba(0,0,0,0.15) | Modals |

---

## Component Specifications

### [Component Name]

#### Visual Design

**Layout:**
```
┌─────────────────────────────────┐
│  [Icon]  Title                  │
│          Subtitle text here     │
├─────────────────────────────────┤
│                                 │
│  Content area                   │
│                                 │
├─────────────────────────────────┤
│  [Secondary]       [Primary]    │
└─────────────────────────────────┘
```

**Dimensions:**
| Property | Value |
|----------|-------|
| Width | 100% (max: 400px) |
| Min Height | 200px |
| Padding | 24px |
| Border Radius | 12px |

**Colors:**
| Element | Color Token |
|---------|-------------|
| Background | `--color-surface` |
| Border | `--color-border` |
| Title | `--color-text` |
| Subtitle | `--color-text-muted` |

#### Props Interface

```typescript
interface ComponentNameProps {
  /** Main title text */
  title: string;

  /** Optional subtitle */
  subtitle?: string;

  /** Icon to display (optional) */
  icon?: React.ReactNode;

  /** Primary action handler */
  onPrimaryAction: () => void;

  /** Primary action label */
  primaryLabel?: string;

  /** Secondary action handler (optional) */
  onSecondaryAction?: () => void;

  /** Secondary action label */
  secondaryLabel?: string;

  /** Component content */
  children: React.ReactNode;

  /** Additional CSS class */
  className?: string;
}
```

#### States

**Default State:**
- Background: `--color-surface`
- Border: 1px solid `--color-border`
- Shadow: `--shadow-md`

**Hover State:**
- Shadow: `--shadow-lg`
- Transition: 200ms ease-out

**Focus State:**
- Border: 2px solid `--color-primary`
- Outline: none

**Disabled State:**
- Opacity: 0.5
- Pointer-events: none

**Loading State:**
- Content replaced with skeleton/spinner
- Actions disabled

**Error State:**
- Border: 1px solid `--color-error`
- Error message displayed below

#### Variants

| Variant | Description | Visual Difference |
|---------|-------------|-------------------|
| default | Standard card | As specified above |
| elevated | Higher elevation | Larger shadow |
| outlined | No shadow | Border only |
| filled | Colored background | Primary background |

---

## Page Layout

### Page Structure

```
┌──────────────────────────────────────────────┐
│ Header (64px)                                │
├──────────────────────────────────────────────┤
│                                              │
│ Main Content                                 │
│ ┌──────────┐  ┌──────────────────────────┐  │
│ │          │  │                          │  │
│ │ Sidebar  │  │  Content Area            │  │
│ │ (240px)  │  │  (flex: 1)               │  │
│ │          │  │                          │  │
│ └──────────┘  └──────────────────────────┘  │
│                                              │
├──────────────────────────────────────────────┤
│ Footer (48px)                                │
└──────────────────────────────────────────────┘
```

### Grid System

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile (<640px) | 4 | 16px | 16px |
| Tablet (640-1024px) | 8 | 24px | 32px |
| Desktop (>1024px) | 12 | 24px | 48px |

---

## Responsive Behavior

### Mobile (< 640px)

```
┌────────────────────┐
│ Header             │
├────────────────────┤
│                    │
│ Content            │
│ (full width)       │
│                    │
├────────────────────┤
│ Bottom Nav         │
└────────────────────┘
```

**Changes:**
- Sidebar becomes bottom navigation
- Cards stack vertically
- Touch targets minimum 44px

### Tablet (640px - 1024px)

```
┌──────────────────────────┐
│ Header                   │
├──────────────────────────┤
│         │                │
│ Side    │  Content       │
│ (200px) │  (flex: 1)     │
│         │                │
└──────────────────────────┘
```

**Changes:**
- Collapsed sidebar (icons only)
- 2-column grid for cards

### Desktop (> 1024px)

**Changes:**
- Full sidebar expanded
- 3-4 column grid for cards
- Hover states enabled

---

## Interactions

### Click/Tap

| Element | Action | Feedback |
|---------|--------|----------|
| Primary Button | Submit form | Scale 0.98, color darken |
| Card | Navigate | Elevation increase |
| Link | Navigate | Underline, color change |

### Hover (Desktop)

| Element | Effect | Transition |
|---------|--------|------------|
| Button | Background darken | 150ms ease |
| Card | Shadow increase | 200ms ease |
| Link | Underline | immediate |
| Icon | Scale 1.1 | 150ms ease |

### Focus

| Element | Indicator |
|---------|-----------|
| All interactive | 2px primary outline, 2px offset |
| Input | Border color change |
| Button | Outline + slight scale |

### Loading States

| Scenario | Indicator |
|----------|-----------|
| Page load | Full page spinner |
| Section load | Skeleton placeholders |
| Button action | Button spinner + disabled |
| Inline action | Small spinner |

---

## Animations

### Transitions

| Property | Duration | Easing |
|----------|----------|--------|
| Color | 150ms | ease |
| Background | 150ms | ease |
| Transform | 200ms | ease-out |
| Opacity | 200ms | ease |
| Shadow | 200ms | ease |

### Entry Animations

| Element | Animation |
|---------|-----------|
| Modal | Fade in + scale from 0.95 |
| Dropdown | Fade in + slide down 8px |
| Toast | Slide in from right |
| Page | Fade in |

### Exit Animations

| Element | Animation |
|---------|-----------|
| Modal | Fade out + scale to 0.95 |
| Dropdown | Fade out + slide up 8px |
| Toast | Slide out to right |

---

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move to next focusable |
| Shift+Tab | Move to previous focusable |
| Enter | Activate button/link |
| Space | Toggle checkbox, activate button |
| Escape | Close modal/dropdown |
| Arrow keys | Navigate within component |

### ARIA Requirements

| Element | ARIA Attribute |
|---------|----------------|
| Modal | role="dialog", aria-modal="true" |
| Button | aria-label (if icon-only) |
| Alert | role="alert" |
| Progress | aria-valuenow, aria-valuemax |
| Tabs | role="tablist", role="tab" |

### Color Contrast

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components | 3:1 |

---

## Assets

### Icons

| Icon | Name | Usage |
|------|------|-------|
| [icon] | icon-close | Close buttons, dismiss |
| [icon] | icon-check | Success, selected |
| [icon] | icon-alert | Warnings, errors |
| [icon] | icon-info | Information |
| [icon] | icon-arrow-right | Navigation |

### Images

| Image | Format | Sizes |
|-------|--------|-------|
| Hero image | WebP | 1x, 2x |
| Thumbnails | WebP | 150x150, 300x300 |
| Avatars | PNG | 32x32, 64x64, 128x128 |

---

## Implementation Notes

### CSS Approach

[Describe CSS methodology: CSS Modules, Styled Components, Tailwind, etc.]

### Component Library

[Reference to existing components that can be used/extended]

### Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

---

## Approval

| Role | Name | Date | Approved |
|------|------|------|----------|
| Design | | | [ ] |
| Frontend | | | [ ] |
| Product | | | [ ] |

---

*Generated by ProAgents*
