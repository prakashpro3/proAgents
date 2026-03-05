# Data Retention Policies

Configure data retention for compliance and operational needs.

---

## Overview

Retention policies ensure data is kept for required periods and properly disposed of when no longer needed.

```
┌─────────────────────────────────────────────────────────────┐
│                  Retention Lifecycle                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Data Created ──► Active Storage ──► Archive ──► Deletion  │
│       │               │                │            │       │
│       ▼               ▼                ▼            ▼       │
│  Log Entry      Hot Storage       Cold Storage    Purge     │
│                (0-90 days)       (90+ days)    (End of      │
│                                                retention)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Retention Periods by Type

### Default Retention Schedule

| Data Type | Retention Period | Compliance Requirement |
|-----------|------------------|----------------------|
| Security Events | 7 years | SOC 2, HIPAA |
| Code Changes | 5 years | SOC 2, PCI-DSS |
| Deployment Logs | 3 years | SOC 2 |
| Access Logs | 1 year | GDPR, PCI-DSS |
| Feature Tracking | 2 years | Internal |
| Analysis Cache | 90 days | Internal |
| Temporary Files | 7 days | Internal |

### By Compliance Framework

**SOC 2:**
| Data Category | Minimum Retention |
|---------------|-------------------|
| Access control evidence | 1 year |
| Change management records | 1 year |
| Security incident logs | 3 years |
| Audit evidence | 3 years |

**GDPR:**
| Data Category | Maximum Retention |
|---------------|-------------------|
| Personal data | As needed + legitimate interest |
| Consent records | Duration of consent + 3 years |
| Data subject requests | 3 years |
| Processing records | Ongoing + 1 year |

**HIPAA:**
| Data Category | Minimum Retention |
|---------------|-------------------|
| PHI access logs | 6 years |
| Security documentation | 6 years |
| Risk assessments | 6 years |
| Training records | 6 years |

**PCI-DSS:**
| Data Category | Minimum Retention |
|---------------|-------------------|
| Audit trails | 1 year (3 months immediately available) |
| Security event logs | 1 year |
| Incident response | 1 year |

---

## Configuration

### Basic Configuration

```yaml
# proagents.config.yaml

retention:
  enabled: true

  # Default retention (in days)
  defaults:
    security_events: 2555    # 7 years
    code_changes: 1825       # 5 years
    deployments: 1095        # 3 years
    access_logs: 365         # 1 year
    feature_data: 730        # 2 years
    cache: 90
    temp: 7

  # Automatic cleanup
  auto_cleanup:
    enabled: true
    schedule: "0 2 * * *"    # 2 AM daily
    dry_run_first: true
```

### Advanced Configuration

```yaml
retention:
  enabled: true

  # Custom retention by data type
  policies:
    # Security events
    - name: "security_critical"
      match:
        event_type: ["vuln_critical", "permission_escalation", "secret_exposed"]
      retention_days: 2555
      storage_class: "cold"
      encryption: true

    # Code changes
    - name: "code_changes"
      match:
        category: "code_change"
      retention_days: 1825
      archive_after_days: 365
      storage_class: "standard"

    # Access logs
    - name: "access_logs"
      match:
        category: "access"
      retention_days: 365
      storage_class: "standard"

    # Feature data
    - name: "active_features"
      match:
        type: "feature_tracking"
        status: "active"
      retention_days: null   # Keep while active
      archive_on_complete: true

    # Temporary data
    - name: "temp_files"
      match:
        type: "temporary"
      retention_days: 7
      no_archive: true

  # Storage classes
  storage_classes:
    hot:
      max_age_days: 90
      location: "local"
    standard:
      max_age_days: 365
      location: "local"
    cold:
      min_age_days: 365
      location: "s3-glacier"

  # Archive settings
  archive:
    enabled: true
    destination: "s3://company-archive"
    compression: true
    encryption: true
```

---

## Retention Rules

### Rule Syntax

```yaml
retention:
  policies:
    - name: "policy_name"

      # Match criteria (all must match)
      match:
        category: "category_name"
        event_type: ["type1", "type2"]
        severity: "critical"
        path: "src/auth/**"
        custom:
          field: "value"

      # Retention settings
      retention_days: 365        # Days to keep
      archive_after_days: 90     # Days before archive
      storage_class: "standard"  # Storage tier
      encryption: true           # Encrypt at rest

      # Deletion settings
      deletion:
        method: "secure"         # standard, secure
        verification: true       # Verify deletion
        notify: true             # Notify on deletion
```

### Rule Priority

Rules are evaluated in order. First match wins:

```yaml
policies:
  # Most specific first
  - name: "critical_security"
    match:
      event_type: "vuln_critical"
    retention_days: 2555

  # General security
  - name: "security_events"
    match:
      category: "security"
    retention_days: 1825

  # Catch-all
  - name: "default"
    match: {}
    retention_days: 365
```

---

## Data Lifecycle Management

### Lifecycle Stages

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Lifecycle                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Stage 1: Active (0-90 days)                               │
│  ├── Fast access                                           │
│  ├── Hot storage                                           │
│  └── Full detail                                           │
│                                                             │
│  Stage 2: Standard (90-365 days)                           │
│  ├── Normal access                                         │
│  ├── Standard storage                                      │
│  └── Full detail                                           │
│                                                             │
│  Stage 3: Archive (365+ days)                              │
│  ├── Slow access                                           │
│  ├── Cold storage                                          │
│  └── Compressed                                            │
│                                                             │
│  Stage 4: Deletion (End of retention)                      │
│  ├── Secure deletion                                       │
│  ├── Verification                                          │
│  └── Audit log                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Automatic Transitions

```yaml
lifecycle:
  transitions:
    - from: "active"
      to: "standard"
      after_days: 90

    - from: "standard"
      to: "archive"
      after_days: 365
      actions:
        - compress: true
        - move_to_cold_storage: true

    - from: "archive"
      to: "deletion"
      after_days: 2555  # End of retention
      actions:
        - secure_delete: true
        - verify_deletion: true
        - log_deletion: true
```

---

## Deletion Procedures

### Secure Deletion

```yaml
deletion:
  # Standard deletion
  standard:
    method: "delete"
    verify: false

  # Secure deletion (for compliance)
  secure:
    method: "overwrite"
    passes: 3              # Number of overwrites
    verify: true
    certificate: true      # Generate deletion certificate
```

### Deletion Verification

```bash
# Preview what will be deleted
proagents retention preview-deletion

# Run deletion (dry run)
proagents retention cleanup --dry-run

# Run deletion
proagents retention cleanup

# Verify deletion
proagents retention verify-deletion --date 2024-01-15
```

### Deletion Certificate

For compliance, generate deletion certificates:

```json
{
  "certificate_id": "del_cert_abc123",
  "issued_at": "2024-01-15T10:00:00Z",
  "data_deleted": {
    "type": "access_logs",
    "date_range": "2022-01-01 to 2022-12-31",
    "record_count": 45678,
    "storage_location": "s3://archive/2022/"
  },
  "deletion_method": "secure_overwrite_3pass",
  "verification": {
    "verified": true,
    "verified_at": "2024-01-15T10:05:00Z",
    "verifier": "system"
  },
  "signature": "sha256:abc123..."
}
```

---

## Legal Holds

### Implementing Legal Hold

When litigation requires data preservation:

```yaml
legal_holds:
  - id: "hold_001"
    name: "Case #12345"
    created_at: "2024-01-15"
    created_by: "legal@company.com"

    # Scope
    scope:
      date_range:
        from: "2023-01-01"
        to: "2023-12-31"
      categories:
        - "code_changes"
        - "deployments"
      users:
        - "developer@company.com"
      paths:
        - "src/payment/**"

    # Settings
    settings:
      suspend_deletion: true
      notify_on_access: true
      export_required: true
```

### Legal Hold Commands

```bash
# Create legal hold
proagents retention hold create --name "Case #12345" --scope ./hold-scope.yaml

# List legal holds
proagents retention hold list

# Release legal hold
proagents retention hold release hold_001 --reason "Case closed"
```

---

## Reporting

### Retention Report

```bash
# Generate retention report
proagents retention report

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Data Retention Report                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Current Storage:                                            │
│ ├── Active (hot): 2.3 GB                                   │
│ ├── Standard: 15.6 GB                                      │
│ └── Archive (cold): 89.2 GB                                │
│                                                             │
│ By Category:                                                │
│ ├── Security Events: 45.2 GB (7 year retention)            │
│ ├── Code Changes: 32.1 GB (5 year retention)               │
│ ├── Deployments: 18.4 GB (3 year retention)                │
│ └── Access Logs: 11.4 GB (1 year retention)                │
│                                                             │
│ Upcoming Deletions:                                         │
│ ├── Next 30 days: 1.2 GB (access logs from 2023-01)        │
│ ├── Next 90 days: 3.4 GB                                   │
│ └── Next year: 12.8 GB                                     │
│                                                             │
│ Legal Holds: 1 active                                       │
│                                                             │
│ Compliance Status:                                          │
│ ├── SOC 2: ✅ Meeting retention requirements               │
│ ├── GDPR: ✅ Within limits                                 │
│ └── PCI-DSS: ✅ Compliant                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Compliance Verification

```bash
# Verify retention meets compliance
proagents retention verify --framework soc2 --framework gdpr
```

---

## Best Practices

1. **Document Policies**: Keep retention policies in version control
2. **Regular Reviews**: Review retention annually
3. **Test Deletion**: Verify secure deletion works correctly
4. **Monitor Storage**: Track storage growth trends
5. **Plan Ahead**: Budget for long-term storage costs
6. **Legal Coordination**: Coordinate holds with legal team
7. **Automate**: Use automatic lifecycle management
8. **Verify**: Regularly verify retention compliance
