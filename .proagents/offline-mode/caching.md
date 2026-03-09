# Offline Caching

Manage cached data for offline operations.

---

## Cache Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cache Structure                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  .proagents/cache/                                          │
│  ├── analysis/           # Codebase analysis               │
│  │   ├── structure.json                                    │
│  │   ├── patterns.json                                     │
│  │   └── dependencies.json                                 │
│  ├── templates/          # Code templates                  │
│  │   ├── components/                                       │
│  │   └── tests/                                            │
│  ├── standards/          # Project standards               │
│  │   ├── rules.json                                        │
│  │   └── conventions.json                                  │
│  ├── glossary/           # Domain knowledge                │
│  │   └── terms.json                                        │
│  └── metadata.json       # Cache metadata                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Cache Configuration

### Basic Settings

```yaml
offline:
  cache:
    enabled: true
    path: ".proagents/cache"
    max_size: "500MB"

    # Automatic caching
    auto_cache:
      enabled: true
      on_analysis: true      # Cache analysis results
      on_success: true       # Cache successful operations
      frequency: "daily"     # Full refresh frequency
```

### What to Cache

```yaml
offline:
  cache:
    include:
      # Analysis data
      - type: "analysis"
        ttl: "7d"
        priority: "high"

      # Learned patterns
      - type: "patterns"
        ttl: "30d"
        priority: "high"

      # Templates
      - type: "templates"
        ttl: "30d"
        priority: "medium"

      # Standards and rules
      - type: "standards"
        ttl: "7d"
        priority: "high"

      # Domain glossary
      - type: "glossary"
        ttl: "30d"
        priority: "medium"

      # Recent AI responses
      - type: "responses"
        ttl: "1d"
        max_items: 100
        priority: "low"

    exclude:
      - "*.env"
      - "**/secrets/**"
      - "**/credentials/**"
```

---

## Cache Operations

### Pre-Cache for Offline Work

```bash
# Prepare comprehensive cache
proagents offline prepare

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Preparing Offline Cache                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✓ Codebase analysis cached (2.3 MB)                        │
│ ✓ Learned patterns cached (456 KB)                         │
│ ✓ Templates cached (128 files, 1.8 MB)                     │
│ ✓ Standards cached (34 KB)                                 │
│ ✓ Domain glossary cached (89 KB)                           │
│                                                             │
│ Total cache size: 4.7 MB                                   │
│ Estimated offline capability: 85%                          │
│                                                             │
│ Missing for full offline:                                   │
│ • Complex code generation (requires AI)                    │
│ • Natural language processing (requires AI)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### View Cache Status

```bash
proagents offline cache-status

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Cache Status                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Total Size: 4.7 MB / 500 MB (1%)                           │
│ Last Updated: 2 hours ago                                   │
│                                                             │
│ Components:                                                 │
│ ├── Analysis:   2.3 MB  (fresh, 2h old)                   │
│ ├── Patterns:   456 KB  (fresh, 1d old)                   │
│ ├── Templates:  1.8 MB  (fresh, 5d old)                   │
│ ├── Standards:  34 KB   (fresh, 2h old)                   │
│ └── Glossary:   89 KB   (fresh, 3d old)                   │
│                                                             │
│ Cache Health: Good                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Clear Cache

```bash
# Clear all cache
proagents offline cache-clear

# Clear specific type
proagents offline cache-clear --type analysis

# Clear expired only
proagents offline cache-clear --expired
```

---

## Cache Invalidation

### Automatic Invalidation

```yaml
offline:
  cache:
    invalidation:
      # Invalidate on file changes
      on_file_change:
        analysis: true
        patterns: true

      # Invalidate on config changes
      on_config_change:
        standards: true

      # Time-based expiration
      ttl:
        analysis: "7d"
        patterns: "30d"
        templates: "30d"
        standards: "7d"
```

### Manual Invalidation

```bash
# Invalidate specific cache
proagents offline invalidate --type analysis

# Invalidate for specific files
proagents offline invalidate --files "src/auth/**"

# Force refresh
proagents offline refresh
```

---

## Incremental Caching

### Smart Updates

```yaml
offline:
  cache:
    incremental:
      enabled: true

      # Only cache changed files
      track_changes: true

      # Merge with existing cache
      merge_strategy: "update"  # update, replace

      # Compression
      compress: true
      compression_level: 6
```

### Change Detection

```bash
# Show what needs caching
proagents offline changes

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Cache Changes Needed                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Modified since last cache:                                  │
│ ├── src/components/UserProfile.tsx                         │
│ ├── src/services/AuthService.ts                            │
│ └── src/utils/validation.ts                                │
│                                                             │
│ Cache impact:                                               │
│ • Analysis: Needs update (3 files changed)                 │
│ • Patterns: Needs update (new pattern detected)            │
│                                                             │
│ Run 'proagents offline prepare --incremental' to update    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Cache Storage

### Local Storage

```yaml
offline:
  cache:
    storage:
      type: "local"
      path: ".proagents/cache"

      # Encryption
      encrypt: false

      # Compression
      compress: true
```

### Shared Cache

```yaml
offline:
  cache:
    storage:
      type: "shared"
      path: "/shared/proagents-cache"

      # Team sharing
      share_with_team: true
      sync_frequency: "hourly"

      # Access control
      read_only: false
```

---

## Cache Optimization

### Size Management

```yaml
offline:
  cache:
    optimization:
      # Maximum cache size
      max_size: "500MB"

      # Cleanup policy
      cleanup:
        when: "size > 80%"
        strategy: "lru"  # Least recently used
        keep_minimum: ["analysis", "standards"]

      # Compression
      compress_old:
        after: "7d"
        level: 9
```

### Priority-Based Retention

```yaml
offline:
  cache:
    retention:
      priorities:
        high:
          - "analysis"
          - "standards"
        medium:
          - "patterns"
          - "templates"
        low:
          - "responses"

      # Evict low priority first
      eviction_order: ["low", "medium", "high"]
```

---

## Best Practices

1. **Regular Updates**: Run `prepare` daily for fresh cache
2. **Monitor Size**: Keep cache under limit to avoid issues
3. **Incremental Updates**: Use incremental caching for efficiency
4. **Test Offline**: Periodically test offline mode works
5. **Secure Cache**: Enable encryption for sensitive projects
6. **Clean Up**: Remove expired cache regularly
