# Learning Data Schemas

JSON Schema definitions for the ProAgents learning system data files.

---

## Schema Files

| Schema | Purpose |
|--------|---------|
| `user-preferences-schema.json` | User checkpoint and workflow preferences |
| `patterns-schema.json` | Global code patterns and anti-patterns |
| `project-patterns-schema.json` | Project-specific patterns and conventions |
| `corrections-schema.json` | User corrections to AI suggestions |
| `metrics-schema.json` | Development time and quality metrics |
| `feedback-schema.json` | User feedback on AI assistance |

---

## Data Structure

```
.learning/
├── global/                      # Cross-project learnings
│   ├── user-preferences.json    # User workflow preferences
│   └── common-patterns.json     # Common code patterns
│
├── projects/                    # Per-project learnings
│   └── {project-id}/
│       ├── patterns.json        # Project-specific patterns
│       ├── corrections.json     # User corrections
│       ├── metrics.json         # Performance metrics
│       └── feedback.json        # User feedback
│
└── schemas/                     # Schema definitions
    └── *.json
```

---

## Validation

All learning data files are validated against their schemas on:
- Load
- Save
- Sync

Invalid data is logged and quarantined for review.
