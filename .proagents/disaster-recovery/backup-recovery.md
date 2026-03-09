# Backup & Recovery

Comprehensive backup strategies and recovery procedures.

---

## Overview

Regular backups ensure data can be recovered after any failure scenario.

```
┌─────────────────────────────────────────────────────────────┐
│                    Backup Strategy                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │  Continuous │    │   Daily     │    │   Weekly    │    │
│  │  Replication│    │   Backups   │    │   Backups   │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│        │                  │                  │             │
│        ▼                  ▼                  ▼             │
│  ┌─────────────────────────────────────────────────┐      │
│  │              Multi-Region Storage               │      │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐       │      │
│  │  │ Region A│  │ Region B│  │ Archive │       │      │
│  │  └─────────┘  └─────────┘  └─────────┘       │      │
│  └─────────────────────────────────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Backup Types

### 1. Database Backups

| Type | Frequency | Retention | Use Case |
|------|-----------|-----------|----------|
| Continuous | Real-time | 7 days | Point-in-time recovery |
| Full | Daily | 30 days | Major recovery |
| Weekly | Weekly | 90 days | Long-term recovery |
| Monthly | Monthly | 1 year | Compliance/Archive |

### 2. Application State

| Component | Frequency | Retention |
|-----------|-----------|-----------|
| Configuration | On change | 90 days |
| Secrets/Keys | On change | 90 days |
| Feature flags | On change | 30 days |

### 3. Code & Artifacts

| Component | Frequency | Retention |
|-----------|-----------|-----------|
| Git repository | Continuous | Indefinite |
| Build artifacts | On build | 30 days |
| Container images | On build | 90 days |

---

## Backup Configuration

### Basic Configuration

```yaml
# proagents.config.yaml

backup:
  enabled: true

  # Database backups
  database:
    type: "postgres"  # postgres, mysql, mongodb
    continuous:
      enabled: true
      retention_days: 7
    daily:
      enabled: true
      time: "02:00"
      retention_days: 30
    weekly:
      enabled: true
      day: "sunday"
      retention_days: 90

  # Application state
  application:
    config:
      on_change: true
      retention_days: 90
    secrets:
      on_change: true
      encryption: true

  # Storage destinations
  storage:
    primary:
      type: "s3"
      bucket: "company-backups"
      region: "us-east-1"
    secondary:
      type: "gcs"
      bucket: "company-backups-dr"
      region: "us-west1"

  # Encryption
  encryption:
    enabled: true
    algorithm: "AES-256"
    key_management: "aws-kms"

  # Verification
  verification:
    enabled: true
    frequency: "daily"
    test_restore: "weekly"
```

### Advanced Configuration

```yaml
backup:
  # Custom backup schedules
  schedules:
    - name: "production_db"
      type: "database"
      database: "production"
      continuous: true
      full_backup:
        cron: "0 2 * * *"
      retention:
        continuous: 7
        full: 30

    - name: "user_uploads"
      type: "files"
      path: "/uploads"
      incremental:
        cron: "0 * * * *"  # Hourly
      full:
        cron: "0 3 * * 0"  # Weekly Sunday
      retention:
        incremental: 7
        full: 90

  # Cross-region replication
  replication:
    enabled: true
    source: "us-east-1"
    destinations:
      - "us-west-2"
      - "eu-west-1"
    lag_threshold: "5m"
    alert_on_lag: true
```

---

## Backup Commands

### Create Backups

```bash
# Create manual backup
proagents backup create

# Create specific type
proagents backup create --type database
proagents backup create --type config
proagents backup create --type full

# Create with label
proagents backup create --label "pre-migration"
```

### List Backups

```bash
# List recent backups
proagents backup list

# List by type
proagents backup list --type database

# List by date range
proagents backup list --from 2024-01-01 --to 2024-01-31

# Output:
┌────────────────────────────────────────────────────────────┐
│ Backups                                                    │
├────────────────────────────────────────────────────────────┤
│ ID          │ Type     │ Date       │ Size   │ Status    │
├─────────────┼──────────┼────────────┼────────┼───────────┤
│ bkp_001     │ full     │ 2024-01-15 │ 2.3 GB │ ✅ Verified│
│ bkp_002     │ database │ 2024-01-15 │ 1.8 GB │ ✅ Verified│
│ bkp_003     │ config   │ 2024-01-15 │ 45 MB  │ ✅ Verified│
└────────────────────────────────────────────────────────────┘
```

### Verify Backups

```bash
# Verify backup integrity
proagents backup verify bkp_001

# Verify all recent backups
proagents backup verify --all

# Test restore (without applying)
proagents backup test-restore bkp_001
```

---

## Recovery Procedures

### Point-in-Time Recovery

Restore database to specific time:

```bash
# Restore to specific time
proagents db restore --point-in-time "2024-01-15 09:30:00"

# Preview what will be restored
proagents db restore --point-in-time "2024-01-15 09:30:00" --dry-run
```

**Procedure:**
1. Stop application traffic
2. Create current backup (safety)
3. Apply point-in-time restore
4. Verify data integrity
5. Resume traffic

### Full Backup Restore

Restore from complete backup:

```bash
# Restore from backup
proagents backup restore bkp_001

# Restore specific component
proagents backup restore bkp_001 --component database

# Restore to different environment
proagents backup restore bkp_001 --target staging
```

**Procedure:**
1. Verify backup integrity
2. Stop services
3. Restore backup
4. Update configuration if needed
5. Start services
6. Verify functionality

### File Recovery

Recover specific files or directories:

```bash
# Restore specific file
proagents backup restore-file bkp_001 --path "/uploads/user_123/"

# Restore to different location
proagents backup restore-file bkp_001 --path "/uploads/" --dest "/restored/"
```

---

## Recovery Runbooks

### Database Recovery Runbook

```markdown
## Database Recovery Procedure

**Scenario:** Database corruption or accidental data deletion
**RTO:** 30 minutes
**RPO:** 15 minutes

### Assessment

1. Identify scope of data loss/corruption
2. Determine recovery point (most recent valid state)
3. Calculate potential data loss

### Recovery Steps

1. **Stop Application Traffic**
   ```bash
   proagents traffic pause --all
   ```

2. **Create Safety Backup**
   ```bash
   proagents backup create --type emergency --label "pre-recovery"
   ```

3. **Identify Recovery Point**
   ```bash
   proagents backup list --type database --last 24h
   ```

4. **Perform Recovery**

   Option A: Point-in-Time
   ```bash
   proagents db restore --point-in-time "2024-01-15 09:30:00"
   ```

   Option B: Full Backup
   ```bash
   proagents backup restore bkp_001 --component database
   ```

5. **Verify Data**
   ```bash
   proagents db verify --checksum
   proagents db verify --row-count
   ```

6. **Resume Traffic**
   ```bash
   proagents traffic resume
   ```

### Post-Recovery

☐ Document timeline and data loss
☐ Notify affected users if applicable
☐ Update incident report
☐ Review backup procedures
```

### Full System Recovery Runbook

```markdown
## Full System Recovery Procedure

**Scenario:** Complete system failure requiring full restore
**RTO:** 1 hour
**RPO:** 1 hour

### Pre-Recovery

1. Activate incident response
2. Set up DR communication channel
3. Verify backup availability

### Recovery Steps

1. **Infrastructure**
   ```bash
   # Provision infrastructure (if needed)
   proagents infra provision --config dr-config.yaml
   ```

2. **Database**
   ```bash
   proagents backup restore latest --component database
   ```

3. **Application**
   ```bash
   proagents backup restore latest --component application
   ```

4. **Configuration**
   ```bash
   proagents backup restore latest --component config
   ```

5. **Secrets**
   ```bash
   proagents backup restore latest --component secrets
   ```

6. **Verification**
   ```bash
   proagents dr verify --full
   proagents test smoke
   ```

7. **Traffic Cutover**
   ```bash
   proagents traffic switch --to dr-site
   ```

### Post-Recovery

☐ All services healthy
☐ Data integrity verified
☐ Monitoring active
☐ Stakeholders notified
```

---

## Backup Verification

### Automated Verification

```yaml
backup:
  verification:
    # Integrity checks
    integrity:
      enabled: true
      frequency: "daily"
      checksum: true

    # Test restores
    test_restore:
      enabled: true
      frequency: "weekly"
      target: "dr-test-env"
      cleanup_after: true

    # Alerts
    alerts:
      on_failure: true
      on_checksum_mismatch: true
      on_test_restore_fail: true
```

### Manual Verification

```bash
# Verify backup integrity
proagents backup verify bkp_001

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Backup Verification: bkp_001                                │
├─────────────────────────────────────────────────────────────┤
│ ✅ File integrity: Passed                                  │
│ ✅ Checksum verification: Passed                           │
│ ✅ Encryption validation: Passed                           │
│ ✅ Metadata consistency: Passed                            │
│                                                             │
│ Size: 2.3 GB                                               │
│ Created: 2024-01-15 02:00:00 UTC                          │
│ Components: database, config, uploads                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Backup Storage

### Multi-Region Storage

```yaml
storage:
  regions:
    primary:
      provider: "aws"
      region: "us-east-1"
      bucket: "company-backups-primary"
      storage_class: "STANDARD"

    secondary:
      provider: "gcs"
      region: "us-west1"
      bucket: "company-backups-secondary"
      storage_class: "NEARLINE"

    archive:
      provider: "aws"
      region: "us-east-1"
      bucket: "company-backups-archive"
      storage_class: "GLACIER"

  replication:
    enabled: true
    async: true
    verify_replication: true
```

### Storage Lifecycle

```yaml
storage:
  lifecycle:
    rules:
      - name: "move_to_infrequent"
        transition_after_days: 30
        to_storage_class: "STANDARD_IA"

      - name: "move_to_glacier"
        transition_after_days: 90
        to_storage_class: "GLACIER"

      - name: "delete_expired"
        delete_after_days: 365
```

---

## Backup Monitoring

### Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Backup Status Dashboard                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Last 24 Hours:                                             │
│ ├── Backups Created: 4                                     │
│ ├── Backups Verified: 4                                    │
│ └── Failures: 0                                            │
│                                                             │
│ Storage Usage:                                              │
│ ├── Primary (us-east-1): 156 GB                           │
│ ├── Secondary (us-west1): 156 GB                          │
│ └── Archive: 2.3 TB                                        │
│                                                             │
│ Recovery Points:                                            │
│ ├── Continuous: Available (2 min ago)                      │
│ ├── Daily: Jan 15, 02:00                                  │
│ └── Weekly: Jan 14, 03:00                                 │
│                                                             │
│ Alerts: None                                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Alerts

```yaml
backup:
  alerts:
    - name: "backup_failed"
      condition: "backup_status == 'failed'"
      severity: "critical"
      channels: ["pagerduty", "slack"]

    - name: "backup_late"
      condition: "backup_age > 25h"
      severity: "warning"
      channels: ["slack"]

    - name: "verification_failed"
      condition: "verification_status == 'failed'"
      severity: "critical"
      channels: ["pagerduty"]

    - name: "storage_full"
      condition: "storage_usage > 90%"
      severity: "warning"
      channels: ["slack"]
```

---

## Best Practices

1. **3-2-1 Rule**: 3 copies, 2 different media, 1 offsite
2. **Regular Testing**: Test restores weekly
3. **Encryption**: Always encrypt backups at rest
4. **Verification**: Verify backups automatically
5. **Documentation**: Keep recovery runbooks updated
6. **Monitoring**: Alert on backup failures
7. **Retention**: Balance cost with recovery needs
8. **Access Control**: Restrict backup access
