# Configuration Rollback

Restore previous configuration versions.

---

## Rollback Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Config Rollback Flow                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Config (v1.5.1)                                   │
│       │                                                     │
│       │  Issue detected                                     │
│       ▼                                                     │
│  ┌─────────────┐                                           │
│  │   Rollback  │                                           │
│  │   Command   │                                           │
│  └──────┬──────┘                                           │
│         │                                                   │
│    ┌────┴────┐                                             │
│    ▼         ▼                                             │
│  [Previous] [Specific]                                      │
│  (v1.5.0)   (v1.4.0)                                       │
│    │         │                                             │
│    └────┬────┘                                             │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │  Validate   │                                           │
│  └──────┬──────┘                                           │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │   Apply     │                                           │
│  └──────┬──────┘                                           │
│         │                                                   │
│         ▼                                                   │
│  Config restored to v1.5.0                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Rollback Commands

### Quick Rollback

```bash
# Rollback to previous version
proagents config rollback

# Rollback to specific version
proagents config rollback --to v1.5.0

# Rollback specific file
proagents config rollback --file rules/security-rules.yaml

# Preview rollback (dry run)
proagents config rollback --dry-run
```

### Rollback Output

```
┌─────────────────────────────────────────────────────────────┐
│ Configuration Rollback                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Rolling back: v1.5.1 → v1.5.0                              │
│                                                             │
│ Files to restore:                                           │
│ ├── proagents.config.yaml                                  │
│ └── rules/security-rules.yaml                              │
│                                                             │
│ Changes to revert:                                          │
│ ├── checkpoints.before_deployment: true → false            │
│ └── security.require_review: true → false                  │
│                                                             │
│ [Confirm Rollback]  [Cancel]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Rollback Configuration

### Rollback Settings

```yaml
config_versioning:
  rollback:
    # Require confirmation
    require_confirmation: true

    # Create backup before rollback
    backup_current: true

    # Validate after rollback
    validate_after: true

    # Notify on rollback
    notify:
      enabled: true
      channels: ["slack:#config-changes"]

    # Audit
    audit:
      enabled: true
      require_reason: true
```

### Rollback Permissions

```yaml
config_versioning:
  rollback:
    permissions:
      # Who can rollback
      allowed_users:
        - "@team/tech-leads"
        - "@team/devops"

      # Require approval for old versions
      approval_required:
        versions_back: 5  # Need approval for > 5 versions back

      # Emergency rollback
      emergency:
        enabled: true
        bypass_approval: true
        notify: ["@team/managers"]
```

---

## Partial Rollback

### Rollback Specific Files

```bash
# Rollback single file
proagents config rollback --file proagents.config.yaml --to v1.5.0

# Rollback multiple files
proagents config rollback --files "rules/*.yaml" --to v1.5.0

# Rollback specific setting
proagents config rollback --setting checkpoints.before_deployment
```

### Selective Restore

```yaml
# Restore specific sections
proagents config restore --section checkpoints --from v1.5.0

# Restore keeping current values
proagents config restore --merge --from v1.5.0
```

---

## Rollback Validation

### Pre-Rollback Checks

```yaml
config_versioning:
  rollback:
    validation:
      # Check before rollback
      pre_checks:
        - "syntax_valid"
        - "schema_valid"
        - "no_breaking_changes"

      # Block if checks fail
      block_on_failure: true
```

### Post-Rollback Verification

```bash
# After rollback, verify
proagents config validate

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Post-Rollback Validation                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✅ Syntax: Valid YAML                                      │
│ ✅ Schema: Matches expected structure                      │
│ ✅ Rules: All rules valid                                  │
│ ✅ References: All files exist                             │
│                                                             │
│ Rollback successful. Configuration is valid.               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Rollback History

### View Rollback Log

```bash
proagents config rollback-history

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Rollback History                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Jan 15, 2024 10:30                                         │
│ ├── From: v1.5.1 → To: v1.5.0                             │
│ ├── User: alice@company.com                                │
│ ├── Reason: Security rule caused build failures           │
│ └── Files: rules/security-rules.yaml                       │
│                                                             │
│ Jan 10, 2024 15:45                                         │
│ ├── From: v1.4.2 → To: v1.4.0                             │
│ ├── User: bob@company.com                                  │
│ ├── Reason: Checkpoint changes broke CI                    │
│ └── Files: proagents.config.yaml                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Emergency Rollback

### Quick Emergency Restore

```bash
# Emergency rollback (skip confirmations)
proagents config rollback --emergency --to v1.5.0

# Requires emergency permissions
# Automatically notifies team
# Creates detailed audit log
```

### Emergency Configuration

```yaml
config_versioning:
  rollback:
    emergency:
      enabled: true

      # Skip normal approvals
      bypass_approval: true

      # Still require
      require_reason: true
      require_audit: true

      # Notify immediately
      notify:
        - "slack:#incidents"
        - "pagerduty:config-oncall"

      # Auto-create incident
      create_incident: true
```

---

## Best Practices

1. **Test in Staging**: Rollback in staging first if possible
2. **Document Reason**: Always explain why rollback is needed
3. **Verify After**: Run validation after rollback
4. **Notify Team**: Ensure team knows about config changes
5. **Keep History**: Maintain rollback history for auditing
6. **Plan Forward**: After rollback, plan proper fix
