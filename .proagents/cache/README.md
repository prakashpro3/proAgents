# Analysis Cache

Cached codebase analysis data for improved performance.

---

## Overview

The cache system stores expensive analysis results to:
- Speed up subsequent operations
- Enable offline mode functionality
- Reduce AI API calls
- Provide historical comparison

---

## Cache Structure

```
cache/
├── README.md                    # This file
├── analysis-metadata.json       # Cache metadata and timestamps
├── structure.json               # Directory structure cache
├── conventions.json             # Code conventions cache
├── dependencies.json            # Dependency map cache
├── features.json                # Feature inventory cache
├── patterns.json                # Recognized patterns cache
└── schemas/                     # Schema definitions
    └── *.json
```

---

## Cache Lifecycle

### Creation
Cache is created/updated when:
- Running `pa:analyze` command
- Starting a new feature (incremental update)
- Manual cache refresh

### Invalidation
Cache is invalidated when:
- Cache age exceeds configured TTL (default: 24h)
- Significant file changes detected
- Manual invalidation requested
- Schema version mismatch

### Refresh Strategies
- **Full refresh**: Complete re-analysis
- **Incremental**: Update only changed files
- **Partial**: Refresh specific cache files

---

## Configuration

```yaml
# proagents.config.yaml

cache:
  enabled: true
  path: ".proagents/cache"

  ttl:
    structure: "24h"
    conventions: "7d"
    dependencies: "1h"
    features: "24h"
    patterns: "7d"

  max_size: "100MB"

  auto_refresh:
    on_file_change: true
    threshold: 10  # files changed
```

---

## Commands

```bash
# View cache status
proagents cache status

# Refresh cache
proagents cache refresh

# Clear specific cache
proagents cache clear structure

# Clear all cache
proagents cache clear --all

# Validate cache integrity
proagents cache validate
```

---

## Cache Files

See individual cache files for their structure:
- [analysis-metadata.json](./analysis-metadata.json)
- [structure.json](./structure.json)
- [conventions.json](./conventions.json)
- [dependencies.json](./dependencies.json)
- [features.json](./features.json)
- [patterns.json](./patterns.json)
