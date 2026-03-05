# Document Templates

Output templates for each workflow phase.

---

## Overview

Standardized templates for all workflow outputs ensuring consistency.

## Available Templates

| Template | Phase | Description |
|----------|-------|-------------|
| [Codebase Analysis Report](./codebase-analysis-report.md) | Analysis | Project structure and patterns |
| [Feature Requirements](./feature-requirements.md) | Requirements | User stories, acceptance criteria |
| [UI Specification](./ui-specification.md) | Design | Component specs from designs |
| [Implementation Plan](./implementation-plan.md) | Planning | Task breakdown, architecture |
| [Test Plan](./test-plan.md) | Testing | Test strategy and coverage |
| [Code Review Report](./code-review-report.md) | Review | Review findings, suggestions |
| [Feature Status](./feature-status.md) | Tracking | Progress and status updates |
| [Deployment Checklist](./deployment-checklist.md) | Deployment | Pre-deploy verification |
| [Rollback Plan](./rollback-plan.md) | Rollback | Recovery procedures |

## Usage

Templates are automatically used by the workflow, or generate manually:

```bash
# Generate specific template
proagents template generate test-plan

# Export filled template
proagents template export implementation-plan --output plan.md
```

## Customization

Override templates in your project:

```
your-project/
└── .proagents/
    └── templates/
        └── feature-requirements.md  # Your custom version
```

## Template Variables

Templates support variables:

```markdown
# Feature: {{feature.name}}

**Status:** {{feature.status}}
**Started:** {{feature.start_date}}
```
