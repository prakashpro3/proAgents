# UI Design Integration Prompts

Universal prompts for integrating UI designs into development workflow.

---

## Quick Start

Choose your design input method:

| Method | Command | When to Use |
|--------|---------|-------------|
| Figma | `pa:design-figma` | Have Figma file access |
| Export | `pa:design-export` | Have exported images/PDFs |
| Sketch | `pa:design-sketch` | Have hand-drawn wireframes |

---

## Method 1: Figma Integration

### Extract Design from Figma

```
/design-figma

I have a Figma design for "[FEATURE_NAME]":
URL: [FIGMA_URL or FILE_ID]

Please extract:
1. Design tokens (colors, typography, spacing)
2. Component specifications
3. Layout structure
4. Assets list
5. Responsive breakpoints
```

### Figma Token Extraction

```
From the Figma design, extract and document:

COLORS:
- Primary colors with semantic names
- Secondary/accent colors
- Neutral colors (grays)
- Semantic colors (success, error, warning, info)

TYPOGRAPHY:
- Font families used
- Size scale (heading, body, caption)
- Weight variations
- Line heights

SPACING:
- Spacing scale values
- Common padding/margin patterns
- Grid/gap values

EFFECTS:
- Shadow definitions
- Border radius values
- Opacity levels
```

### Figma Component Mapping

```
For each component in the Figma design:

1. IDENTIFY component name and variants
2. LIST all properties (props)
3. DOCUMENT all states (default, hover, active, disabled, loading)
4. MAP to existing project components (if any)
5. FLAG new components needed
6. NOTE any animations or transitions
```

---

## Method 2: Design Export Analysis

### Analyze Exported Designs

```
/design-export

I have exported design files for "[FEATURE_NAME]":
[Provide file paths or describe uploads]

Please analyze:
1. Page/screen layout structure
2. Component identification
3. Color palette extraction
4. Typography estimation
5. Spacing patterns
6. Interactive element identification
```

### Design Analysis Request

```
Analyze these design exports:

FILES PROVIDED:
- [file1.png] - [description]
- [file2.png] - [description]

ANALYSIS NEEDED:
1. Identify all UI components
2. Map visual hierarchy
3. Extract color values
4. Estimate typography specs
5. Note layout patterns
6. Identify reusable elements
7. Map component relationships
```

### Component Specification from Export

```
Based on the exported design, create specifications for:

COMPONENT: [Component Name]

Visual Specification:
- Dimensions (width, height, or responsive rules)
- Colors (background, text, border)
- Typography (font, size, weight)
- Spacing (padding, margin)
- Border (width, style, radius)
- Shadow (if any)

States:
- Default appearance
- Hover state changes
- Active/pressed state
- Disabled state
- Loading state (if applicable)

Props Interface:
- Required props
- Optional props
- Event handlers

Accessibility:
- ARIA attributes needed
- Keyboard navigation
- Focus states
```

---

## Method 3: Sketch Interpretation

### Interpret Hand-drawn Sketch

```
/design-sketch

I have a sketch/wireframe for "[FEATURE_NAME]":
[Provide image path or describe sketch]

Please interpret:
1. Layout structure
2. Component identification
3. User flow (if multiple screens)
4. Interaction points
5. Content areas
```

### Sketch to Wireframe

```
Convert this sketch to a structured wireframe:

SKETCH: [image/description]

Output needed:
1. Clean wireframe description
2. Component list with hierarchy
3. Layout specifications
4. Content placeholders
5. Interaction annotations
```

### Clarify Sketch Elements

```
For this sketch element: [description/reference]

Please clarify:
1. What type of UI element is this?
2. What content should it display?
3. What interactions does it support?
4. How does it relate to surrounding elements?
5. What states might it have?
```

---

## Design Token Generation

### Create Design Token File

```
Based on the design analysis, generate design tokens:

FORMAT: [CSS Variables / JSON / JavaScript / Tailwind Config]

Include:
1. Color tokens (with semantic naming)
2. Typography tokens
3. Spacing scale
4. Border radius values
5. Shadow definitions
6. Breakpoint values
7. Animation/transition values
```

### CSS Variables Output

```css
/* Generate CSS custom properties like: */
:root {
  /* Colors */
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --color-secondary: #10B981;
  /* ... */

  /* Typography */
  --font-family-base: 'Inter', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  /* ... */

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  /* ... */
}
```

### Tailwind Config Output

```javascript
// Generate Tailwind config extension like:
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3B82F6', hover: '#2563EB' },
        secondary: { DEFAULT: '#10B981' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // ...
    }
  }
}
```

---

## Component Specification

### Full Component Spec

```
Create detailed specification for: [COMPONENT_NAME]

OVERVIEW:
- Purpose and use cases
- When to use vs. alternatives

VISUAL DESIGN:
- Layout structure
- Styling specifications
- Responsive behavior

PROPS INTERFACE:
- Prop name, type, required, default, description
- Event handler signatures

STATES & VARIANTS:
- All visual states
- All functional variants
- Combinations possible

ACCESSIBILITY:
- ARIA requirements
- Keyboard interactions
- Screen reader behavior

USAGE EXAMPLES:
- Basic usage
- Common variations
- Edge cases
```

### Component Variants

```
Document variants for: [COMPONENT_NAME]

VARIANT 1: [Name]
- When to use
- Visual differences
- Prop values

VARIANT 2: [Name]
- When to use
- Visual differences
- Prop values

COMBINATION MATRIX:
| Size | Color | State | Visual |
|------|-------|-------|--------|
| sm | primary | default | [desc] |
| md | secondary | hover | [desc] |
```

---

## Responsive Design

### Document Responsive Behavior

```
Document responsive behavior for: [SCREEN/COMPONENT]

BREAKPOINTS:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

MOBILE LAYOUT:
- Component arrangement
- Hidden/shown elements
- Touch considerations

TABLET LAYOUT:
- Adjustments from mobile
- Orientation handling

DESKTOP LAYOUT:
- Full layout description
- Hover states
- Advanced features
```

### Responsive Component Specs

```
For [COMPONENT_NAME], define responsive rules:

MOBILE (< 640px):
- Layout: [stack/row/grid]
- Size adjustments
- Hidden elements
- Touch targets (min 44px)

TABLET (640px - 1024px):
- Layout changes
- Size adjustments

DESKTOP (> 1024px):
- Full layout
- Hover states
- Size specifications
```

---

## Design Handoff Document

### Generate Handoff Doc

```
Generate a design handoff document for: [FEATURE_NAME]

Include sections:
1. Overview & context
2. Screen inventory
3. Component library
4. Design tokens
5. Responsive specifications
6. Interaction specifications
7. Asset list
8. Implementation notes
```

### Implementation Ready Spec

```markdown
# Design Handoff: [Feature Name]

## Overview
[Brief description]

## Screens
1. [Screen 1] - [description]
2. [Screen 2] - [description]

## Components
| Component | Variants | States | Notes |
|-----------|----------|--------|-------|
| [name] | [list] | [list] | [notes] |

## Design Tokens
[Token definitions]

## Interactions
| Element | Trigger | Action | Animation |
|---------|---------|--------|-----------|
| [elem] | [click] | [action] | [ease-out 200ms] |

## Assets
- Icons: [list]
- Images: [list]
- Fonts: [list]

## Notes
- [Implementation notes]
- [Known limitations]
```

---

## Validation Prompts

### Design-Code Alignment Check

```
Verify implementation matches design:

DESIGN SPEC: [reference]
IMPLEMENTATION: [code/screenshot]

Check for:
□ Colors match exactly
□ Typography matches
□ Spacing is correct
□ Responsive behavior works
□ States implemented correctly
□ Interactions work as designed
□ Accessibility implemented
```

### Design QA Checklist

```
Design QA for: [FEATURE_NAME]

Visual Accuracy:
□ Colors match design tokens
□ Typography matches specs
□ Spacing follows design system
□ Icons/images correct

Interaction Fidelity:
□ Hover states implemented
□ Click/tap feedback correct
□ Animations match specs
□ Loading states present

Responsive:
□ Mobile layout correct
□ Tablet layout correct
□ Desktop layout correct
□ Breakpoint transitions smooth

Accessibility:
□ Focus states visible
□ Color contrast sufficient
□ Touch targets adequate
□ Screen reader tested
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `pa:design-figma` | Extract from Figma design |
| `pa:design-export` | Analyze exported images |
| `pa:design-sketch` | Interpret hand-drawn sketch |
| `pa:design-tokens` | Generate design tokens |
| `pa:component-spec` | Create component specification |
| `pa:responsive-spec` | Document responsive behavior |
| `pa:design-handoff` | Generate handoff document |
