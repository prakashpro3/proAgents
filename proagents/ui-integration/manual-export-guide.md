# Manual Design Export Guide

Export designs from any tool and integrate with ProAgents workflow.

---

## Supported Design Tools

Any design tool that can export images/assets:
- Adobe XD
- Sketch
- InVision
- Framer
- Canva
- Affinity Designer
- Any other design software

---

## Export Formats

### Recommended Formats

| Format | Use Case | Quality |
|--------|----------|---------|
| PNG | UI screenshots, full pages | High |
| SVG | Icons, illustrations, logos | Vector (scalable) |
| PDF | Multi-page designs, specs | High |
| JPG | Photos, backgrounds | Medium-High |

### Export Settings

**For UI Screenshots (PNG):**
```
Resolution: 2x (Retina)
Background: Include
Format: PNG-24
Color Profile: sRGB
```

**For Icons (SVG):**
```
Format: SVG
Outline strokes: Yes
Flatten transforms: Yes
Minify: Optional
```

**For Assets (Images):**
```
Export at: 1x, 2x, 3x
Format: PNG or WebP
Naming: descriptive-name@2x.png
```

---

## Export Workflow

### Step 1: Organize Your Design

Before exporting:
- [ ] Group related elements
- [ ] Name layers clearly
- [ ] Separate components
- [ ] Mark interactive elements
- [ ] Note different states (hover, active, disabled)

### Step 2: Export Screens

**Full Page Exports:**
1. Select entire frame/artboard
2. Export as PNG at 2x resolution
3. Name: `page-name.png`

**Component Exports:**
1. Select individual component
2. Export as PNG at 2x
3. Name: `component-name.png`

### Step 3: Export Assets

**Icons:**
```
icons/
├── icon-home.svg
├── icon-user.svg
├── icon-settings.svg
└── icon-search.svg
```

**Images:**
```
images/
├── hero-image.png
├── hero-image@2x.png
├── avatar-placeholder.png
└── background-pattern.png
```

### Step 4: Document Design Specs

Create a specs document with:

```markdown
# Design Specifications

## Colors
- Primary: #3B82F6
- Secondary: #10B981
- Background: #FFFFFF
- Text: #1F2937
- Error: #EF4444

## Typography
- Heading 1: Inter Bold 32px
- Heading 2: Inter SemiBold 24px
- Body: Inter Regular 16px
- Caption: Inter Regular 12px

## Spacing
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px

## Border Radius
- Small: 4px
- Medium: 8px
- Large: 16px
- Full: 9999px
```

---

## Providing Exports to AI

### Usage

```
pa:design-export

AI: "Please provide the exported design files."
User: [Provides file paths or uploads images]
```

### What to Provide

**Minimum Required:**
1. Screen exports (PNG)
2. Color palette (list or image)

**Recommended:**
1. Screen exports
2. Component exports
3. Design specs document
4. Asset files (icons, images)

**Ideal:**
1. All of the above
2. Interaction notes
3. Responsive breakpoints
4. Animation specifications

---

## AI Analysis Process

When you provide exports, AI will:

### 1. Visual Layout Analysis
```
Identifies:
- Page sections (header, content, footer, sidebar)
- Grid structure
- Spacing patterns
- Alignment rules
```

### 2. Component Detection
```
Recognizes:
- Buttons (primary, secondary, text)
- Input fields
- Cards
- Lists
- Navigation elements
- Modals/dialogs
```

### 3. Color Extraction
```
Extracts:
- Dominant colors
- Background colors
- Text colors
- Accent colors
- Suggests semantic names
```

### 4. Typography Estimation
```
Identifies:
- Heading levels
- Body text
- Relative sizes
- Font weights
```

### 5. Interaction Inference
```
Infers from visual cues:
- Clickable elements
- Form inputs
- Navigation links
- State variations
```

---

## Design-to-Code Output

After analysis, AI generates:

### Component List
```markdown
## Identified Components

1. **Header**
   - Logo
   - Navigation menu
   - User avatar dropdown

2. **Hero Section**
   - Headline
   - Subheadline
   - CTA button
   - Hero image

3. **Feature Cards**
   - Icon
   - Title
   - Description
   - Learn more link
```

### Style Tokens
```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "text": "#1F2937"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "heading1": "32px bold",
    "body": "16px regular"
  },
  "spacing": {
    "unit": "8px",
    "scale": [0, 4, 8, 16, 24, 32, 48, 64]
  }
}
```

### Implementation Plan
```markdown
## Implementation Order

1. Setup design tokens (colors, typography, spacing)
2. Create base components (Button, Input, Card)
3. Build layout components (Header, Footer, Container)
4. Implement page sections
5. Add interactions and animations
```

---

## Best Practices

### Naming Convention
```
Use descriptive, consistent names:

Good:
- login-page.png
- button-primary-default.png
- button-primary-hover.png
- card-feature.png

Bad:
- Screen Shot 2024-01-15.png
- final_v2_revised.png
- untitled.png
```

### Organization
```
exports/
├── pages/
│   ├── 01-home.png
│   ├── 02-login.png
│   └── 03-dashboard.png
├── components/
│   ├── button-variants.png
│   ├── form-elements.png
│   └── cards.png
├── assets/
│   ├── icons/
│   └── images/
└── specs/
    └── design-specs.md
```

### Quality Tips

1. **High Resolution** - Export at 2x for clarity
2. **Include States** - Show hover, active, disabled states
3. **Show Context** - Include surrounding elements for spacing reference
4. **Annotate** - Add notes for unclear interactions
5. **Version Control** - Date or version your exports

---

## Troubleshooting

**Blurry Exports:**
- Increase export resolution to 2x or 3x
- Use PNG instead of JPG for UI elements

**Colors Look Different:**
- Ensure sRGB color profile
- Check monitor calibration

**Missing Elements:**
- Verify all layers are visible before export
- Check layer visibility toggles

**Large File Sizes:**
- Use JPG for photos (quality 80-90%)
- Compress PNGs with tools like TinyPNG
- Use SVG for icons and illustrations

---

## Integration with Workflow

```
1. Export designs from your tool
2. Run: pa:design-export
3. Provide exported files
4. Review AI analysis
5. Confirm component mapping
6. Proceed to implementation planning
```
