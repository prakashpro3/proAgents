# UI Integration

Design-to-code integration from Figma, exports, or sketches.

---

## Overview

Transform designs into implementation specifications automatically.

## Documentation

| Document | Description |
|----------|-------------|
| [Figma Guide](./figma-guide.md) | Figma API integration |
| [Manual Export Guide](./manual-export-guide.md) | Working with design exports |
| [Sketch Interpretation](./sketch-interpretation.md) | AI interpretation of wireframes |

## Supported Sources

| Source | Method | Quality |
|--------|--------|---------|
| Figma | API integration | Highest (exact specs) |
| Sketch/XD | Export files | High |
| PNG/PDF | AI analysis | Medium |
| Hand sketches | AI interpretation | Basic |

## Quick Start

### Figma Integration

```bash
# Connect Figma file
proagents ui figma connect "https://figma.com/file/..."

# Extract design tokens
proagents ui figma tokens

# Generate component specs
proagents ui figma components
```

### Manual Export

```bash
# Analyze design export
proagents ui analyze ./designs/homepage.png

# Generate specs
proagents ui generate-specs
```

## Configuration

```yaml
# proagents.config.yaml
ui_integration:
  figma:
    enabled: true
    api_token_env: "FIGMA_TOKEN"

  extraction:
    design_tokens: true
    components: true
    assets: true

  output:
    tokens_file: "src/styles/tokens.ts"
    specs_dir: "docs/ui-specs/"
```

## Output

- Design tokens (colors, typography, spacing)
- Component specifications
- Asset exports (icons, images)
- Implementation guidelines
