# Code Metrics

This folder contains code quality metrics and reports.

## Commands

- `pa:metrics` - Show current code quality metrics
- `pa:metrics-history` - Show metrics over time
- `pa:coverage` - Show test coverage report
- `pa:coverage-diff` - Show coverage changes

## Files

```
metrics/
├── latest.json         # Most recent metrics snapshot
├── history/            # Historical metrics
│   ├── 2024-03-01.json
│   └── 2024-03-15.json
└── README.md
```

## Metrics Format

```json
{
  "timestamp": "2024-03-06T15:00:00Z",
  "generated_by": "Claude:opus-4",
  "summary": {
    "total_files": 45,
    "total_lines": 12500,
    "languages": {
      "typescript": 10200,
      "javascript": 1500,
      "css": 800
    }
  },
  "quality": {
    "complexity": {
      "average": 4.2,
      "max": 15,
      "high_complexity_files": ["src/utils/parser.ts"]
    },
    "duplication": {
      "percentage": 3.5,
      "duplicated_blocks": 12
    }
  },
  "coverage": {
    "overall": 82,
    "by_module": {
      "src/auth": 95,
      "src/api": 78,
      "src/utils": 65
    }
  }
}
```

## Thresholds

Default thresholds (customize in proagents.config.yaml):

| Metric | Warning | Error |
|--------|---------|-------|
| Coverage | < 70% | < 50% |
| Complexity | > 10 | > 20 |
| File size | > 300 lines | > 500 lines |
| Duplication | > 5% | > 10% |
