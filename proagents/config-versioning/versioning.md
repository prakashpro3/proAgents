# Configuration Versioning

Track all configuration changes with full history.

---

## Version Structure

### Version Format

```
v{major}.{minor}.{patch}

Examples:
v1.0.0  - Initial configuration
v1.1.0  - Added new checkpoint
v1.1.1  - Fixed typo in rule
v2.0.0  - Breaking change to standards
```

### Version Metadata

```json
{
  "version": "v1.5.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "author": "developer@company.com",
  "reason": "Added stricter security rules",
  "files_changed": [
    "proagents.config.yaml",
    "rules/security-rules.yaml"
  ],
  "checksum": "sha256:abc123..."
}
```

---

## Creating Versions

### Automatic Versioning

Changes are automatically versioned when using CLI:

```bash
# Set config value (creates version)
proagents config set checkpoints.before_deployment true

# Output:
Configuration updated.
Version: v1.5.1
Reason: Updated checkpoints.before_deployment
```

### Manual Versioning

```bash
# Create version with message
proagents config commit --message "Added new security rules"

# Create version with specific version number
proagents config commit --version v2.0.0 --message "Breaking changes"
```

### Version on Edit

```yaml
config_versioning:
  auto_version:
    enabled: true
    on_save: true
    version_bump: "patch"  # auto, major, minor, patch
```

---

## Version History

### View History

```bash
# Show recent versions
proagents config history

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Configuration History                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ v1.5.1 (current)                                           │
│ ├── Date: Jan 15, 2024 10:30                              │
│ ├── Author: developer@company.com                         │
│ └── Reason: Updated checkpoint settings                   │
│                                                             │
│ v1.5.0                                                     │
│ ├── Date: Jan 14, 2024 15:45                              │
│ ├── Author: lead@company.com                              │
│ └── Reason: Added stricter security rules                 │
│                                                             │
│ v1.4.0                                                     │
│ ├── Date: Jan 10, 2024 09:00                              │
│ ├── Author: developer@company.com                         │
│ └── Reason: Configured test coverage targets              │
│                                                             │
│ Showing 3 of 15 versions. Use --all to see all.          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Filter History

```bash
# By date range
proagents config history --from 2024-01-01 --to 2024-01-31

# By author
proagents config history --author developer@company.com

# By file
proagents config history --file rules/security-rules.yaml
```

---

## Comparing Versions

### Diff Versions

```bash
# Compare with previous
proagents config diff

# Compare specific versions
proagents config diff v1.4.0 v1.5.0

# Compare with current
proagents config diff v1.4.0
```

### Diff Output

```diff
--- v1.4.0
+++ v1.5.0

proagents.config.yaml:
@@ -15,6 +15,9 @@
 checkpoints:
   after_analysis: true
-  before_deployment: false
+  before_deployment: true
+
+security:
+  require_review: true
+  scan_dependencies: true

rules/security-rules.yaml:
@@ -1,4 +1,8 @@
 rules:
   - id: no-secrets
     severity: error
+
+  - id: dependency-check
+    severity: warning
+    scan_on: commit
```

---

## Version Storage

### Storage Structure

```
.proagents/config-history/
├── index.json                    # Version index
├── versions/
│   ├── v1.5.1/
│   │   ├── metadata.json        # Version metadata
│   │   ├── proagents.config.yaml
│   │   └── rules/
│   │       └── security-rules.yaml
│   ├── v1.5.0/
│   │   └── ...
│   └── v1.4.0/
│       └── ...
└── changelog.md                  # Human-readable changelog
```

### Index File

```json
{
  "current_version": "v1.5.1",
  "versions": [
    {
      "version": "v1.5.1",
      "timestamp": "2024-01-15T10:30:00Z",
      "author": "developer@company.com",
      "path": "versions/v1.5.1"
    },
    {
      "version": "v1.5.0",
      "timestamp": "2024-01-14T15:45:00Z",
      "author": "lead@company.com",
      "path": "versions/v1.5.0"
    }
  ]
}
```

---

## Validation

### Pre-Apply Validation

```bash
# Validate current config
proagents config validate

# Validate specific version
proagents config validate --version v1.5.0

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Configuration Validation                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✅ Syntax: Valid YAML                                      │
│ ✅ Schema: Matches expected structure                      │
│ ✅ Rules: All rules have valid syntax                      │
│ ✅ References: All file references exist                   │
│ ⚠️ Warning: Deprecated option 'old_setting' used          │
│                                                             │
│ Validation: PASSED (with warnings)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Validation Rules

```yaml
config_versioning:
  validation:
    # Schema validation
    schema: true

    # Syntax check
    syntax: true

    # Check file references
    references: true

    # Check for deprecated options
    deprecation_warnings: true

    # Custom validators
    custom:
      - "validate_rule_ids_unique"
      - "validate_paths_exist"
```

---

## Export/Import

### Export Configuration

```bash
# Export current config
proagents config export > config-backup.yaml

# Export specific version
proagents config export --version v1.5.0 > config-v1.5.0.yaml

# Export with history
proagents config export --include-history > config-full.tar.gz
```

### Import Configuration

```bash
# Import and apply
proagents config import config-backup.yaml

# Import as new version
proagents config import config-backup.yaml --as-version v2.0.0

# Import and validate only
proagents config import config-backup.yaml --dry-run
```

---

## Hooks

### Pre-Change Hooks

```yaml
config_versioning:
  hooks:
    pre_change:
      - script: "validate-config.sh"
        blocking: true

      - script: "notify-team.sh"
        blocking: false
```

### Post-Change Hooks

```yaml
config_versioning:
  hooks:
    post_change:
      - script: "sync-to-remote.sh"
      - script: "update-documentation.sh"
```

---

## Best Practices

1. **Always Add Reason**: Document why changes were made
2. **Review Diffs**: Before applying, review changes
3. **Test First**: Validate in staging before production
4. **Backup Regularly**: Export config periodically
5. **Use Semantic Versioning**: Major for breaking changes
6. **Keep History Clean**: Remove very old versions
