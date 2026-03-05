# Figma Integration Guide

Integrate Figma designs into your development workflow.

---

## Methods of Integration

### 1. Figma API (Automated)
Direct API integration for automatic extraction.

### 2. Figma Export (Manual)
Export designs and let AI analyze them.

### 3. Figma Dev Mode
Use Figma's built-in developer handoff.

---

## Method 1: Figma API Integration

### Setup

1. Get your Figma API token:
   - Go to Figma → Settings → Personal Access Tokens
   - Generate a new token

2. Configure ProAgents:
```yaml
# proagents.config.yaml
integrations:
  figma:
    enabled: true
    api_token: "${FIGMA_TOKEN}"  # Use env variable
    file_id: "your-file-id"
```

### Usage

```
/design-figma "https://figma.com/file/xxx/Design"
```

### What Gets Extracted

**Design Tokens:**
```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "text": "#1F2937"
  },
  "typography": {
    "heading1": {
      "fontFamily": "Inter",
      "fontSize": "32px",
      "fontWeight": "700",
      "lineHeight": "1.2"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "16px"
  }
}
```

**Components:**
- Component names and variants
- Component properties (props)
- Component states
- Auto-layout settings

**Assets:**
- Icons (exported as SVG)
- Images (with @2x, @3x versions)

---

## Method 2: Figma Export

### Export Steps

1. Select frames/pages to export
2. Export as PNG, PDF, or SVG
3. Provide exports to AI

### Usage

```
/design-export

AI: "Please provide the exported design files."
User: [Uploads images or provides paths]
```

### AI Analysis

The AI will:
1. Parse visual layout
2. Identify components
3. Extract color palette
4. Estimate typography
5. Map to code components

---

## Method 3: Figma Dev Mode

Use Figma's native developer features:

1. Open Figma Dev Mode
2. Select component
3. Copy CSS/code
4. Provide to AI

```
/design

User: "Here's the CSS from Figma Dev Mode:
[paste CSS]"
```

---

## Design-to-Code Mapping

### Figma to React

| Figma Concept | React Equivalent |
|---------------|------------------|
| Frame | `<div>` or component |
| Auto Layout (row) | `display: flex` |
| Auto Layout (column) | `display: flex; flex-direction: column` |
| Text | `<p>`, `<span>`, `<h1>` |
| Rectangle | `<div>` with styles |
| Component | React Component |
| Variant | Component props |

### Figma to React Native

| Figma Concept | React Native |
|---------------|--------------|
| Frame | `<View>` |
| Auto Layout | `flexDirection` |
| Text | `<Text>` |
| Component | Component |

---

## Component Specification

For each component extracted:

```markdown
## Component: Button

### Variants
- Primary, Secondary, Ghost
- Small, Medium, Large
- With Icon, Without Icon

### Props
- variant: 'primary' | 'secondary' | 'ghost'
- size: 'sm' | 'md' | 'lg'
- icon?: ReactNode
- disabled?: boolean
- onClick: () => void

### States
- Default
- Hover
- Active
- Disabled

### Styles
- Border Radius: 8px
- Padding: 12px 24px
- Font: Inter 500 14px
```

---

## Best Practices

1. **Organize Figma file** - Use clear naming for frames/components
2. **Use Auto Layout** - Makes responsive code easier
3. **Create components** - For reusable elements
4. **Use styles** - For consistent colors/typography
5. **Add descriptions** - Help AI understand intent

---

## Troubleshooting

**API Rate Limits:**
- Figma has rate limits
- Cache extracted data
- Don't extract on every request

**Complex Designs:**
- Break into smaller sections
- Extract iteratively
- Verify AI interpretation

**Missing Fonts:**
- Specify fallback fonts
- Use system fonts when possible
