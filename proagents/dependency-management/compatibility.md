# Breaking Change Detection

Detect and handle breaking changes in dependency updates.

---

## Detection Methods

### Semantic Version Analysis

```yaml
dependencies:
  compatibility:
    semver:
      # Major version = potential breaking changes
      major_update:
        assume_breaking: true
        require_review: true

      # Check actual changes
      analyze_changelog: true
      analyze_types: true
```

### Type Checking

```yaml
dependencies:
  compatibility:
    types:
      enabled: true

      # TypeScript type compatibility
      typescript:
        check_interfaces: true
        check_exports: true
        check_removed: true

      # Report level
      report:
        removed_exports: "error"
        changed_signatures: "warning"
        new_required_params: "error"
```

### API Analysis

```yaml
dependencies:
  compatibility:
    api:
      enabled: true

      checks:
        - removed_functions
        - changed_signatures
        - removed_exports
        - changed_return_types
        - new_required_parameters
```

---

## Compatibility Report

### Generate Report

```bash
proagents deps check-compatibility lodash@5.0.0

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Compatibility Report: lodash 4.17.21 → 5.0.0               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Breaking Changes Detected: 3                                │
│                                                             │
│ ❌ Removed Functions:                                       │
│ ├── _.pluck() - Use _.map() instead                        │
│ └── _.where() - Use _.filter() instead                     │
│                                                             │
│ ⚠️ Changed Signatures:                                      │
│ └── _.merge() - Now returns undefined for null inputs      │
│                                                             │
│ Your Usage:                                                 │
│ ├── _.pluck() used in: src/utils/data.ts:45               │
│ ├── _.where() used in: src/services/filter.ts:23          │
│ └── _.merge() used in: 5 files                             │
│                                                             │
│ Migration Effort: Medium                                    │
│ Estimated Changes: 8 files, ~20 lines                      │
│                                                             │
│ [View Migration Guide] [Skip Update] [Auto-Fix]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Impact Analysis

### Code Impact

```yaml
dependencies:
  compatibility:
    impact_analysis:
      enabled: true

      # Scan codebase for usage
      scan:
        - imports
        - function_calls
        - type_usage

      # Report affected files
      report_affected: true

      # Estimate effort
      estimate_effort: true
```

### Impact Report

```bash
proagents deps impact axios@2.0.0

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Impact Analysis: axios 1.6.0 → 2.0.0                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Files Affected: 12                                          │
│                                                             │
│ High Impact (requires changes):                            │
│ ├── src/services/api.ts                                    │
│ │   └── axios.create() signature changed                   │
│ ├── src/services/auth.ts                                   │
│ │   └── Interceptor API changed                            │
│ └── src/utils/http.ts                                      │
│     └── Error handling changed                             │
│                                                             │
│ Medium Impact (may require changes):                       │
│ ├── src/hooks/useApi.ts                                    │
│ └── src/components/DataFetcher.tsx                         │
│                                                             │
│ Low Impact (likely compatible):                            │
│ └── 7 files with basic usage                               │
│                                                             │
│ Total Effort: ~2-4 hours                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Migration Guides

### Auto-Generated Guide

```yaml
dependencies:
  compatibility:
    migration:
      # Generate migration guide
      auto_generate: true

      # Include code examples
      include_examples: true

      # Fetch from package docs
      fetch_official: true
```

### Migration Guide Output

```markdown
# Migration Guide: axios 1.x → 2.x

## Breaking Changes

### 1. Create Instance

**Before:**
```javascript
const instance = axios.create({
  baseURL: 'https://api.example.com'
});
```

**After:**
```javascript
const instance = axios.create({
  baseURL: 'https://api.example.com',
  adapter: 'fetch'  // New required option
});
```

### 2. Error Handling

**Before:**
```javascript
try {
  await axios.get('/api');
} catch (error) {
  console.log(error.response.data);
}
```

**After:**
```javascript
try {
  await axios.get('/api');
} catch (error) {
  console.log(error.data);  // Changed path
}
```

## Affected Files in Your Project

- `src/services/api.ts:15` - Update create() call
- `src/services/auth.ts:42` - Update interceptor
- `src/utils/http.ts:28` - Update error handling
```

---

## Auto-Migration

### Codemods

```yaml
dependencies:
  compatibility:
    codemods:
      enabled: true

      # Run official codemods
      official:
        enabled: true
        packages:
          - "react"
          - "next"

      # Custom codemods
      custom:
        - package: "lodash"
          codemod: "scripts/codemods/lodash-5.js"
```

### Run Migration

```bash
# Run codemod for package
proagents deps migrate lodash@5.0.0

# Dry run
proagents deps migrate lodash@5.0.0 --dry-run

# Specific files
proagents deps migrate lodash@5.0.0 --files "src/utils/**"
```

---

## Compatibility Matrix

### Track Compatibility

```yaml
dependencies:
  compatibility:
    matrix:
      # Track tested combinations
      track: true

      # Required versions
      required:
        node: ">=18.0.0"
        npm: ">=9.0.0"

      # Known compatible versions
      tested:
        - react: "18.x"
          react-dom: "18.x"
          typescript: "5.x"
```

### View Matrix

```bash
proagents deps compatibility-matrix

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Compatibility Matrix                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Package        │ Current │ Latest │ Compatible │ Status    │
│────────────────┼─────────┼────────┼────────────┼───────────│
│ react          │ 18.2.0  │ 19.0.0 │ ❌         │ Breaking  │
│ typescript     │ 5.2.0   │ 5.4.0  │ ✅         │ Safe      │
│ axios          │ 1.6.0   │ 2.0.0  │ ⚠️         │ Review    │
│ lodash         │ 4.17.21 │ 5.0.0  │ ❌         │ Breaking  │
│ tailwindcss    │ 3.3.0   │ 3.4.0  │ ✅         │ Safe      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Check Before Update**: Always run compatibility check
2. **Read Changelogs**: Review official breaking changes
3. **Test Thoroughly**: Run full test suite after updates
4. **Use Codemods**: Leverage official migration tools
5. **Staged Rollout**: Update in staging first
6. **Document Changes**: Record migration steps taken
