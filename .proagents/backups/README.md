# Backups

This folder contains ProAgents backups created with `pa:backup`.

## Commands

- `pa:backup` - Create full backup
- `pa:backup-restore` - Restore from backup

## Backup Format

Backups are stored as timestamped folders or compressed archives:

```
backups/
├── 2024-03-06-150000/
│   ├── proagents.config.yaml
│   ├── context.md
│   ├── decisions.md
│   ├── feedback.md
│   ├── active-features/
│   └── ...
└── 2024-03-05-100000.tar.gz
```

## Retention

By default, the last 5 backups are kept. Configure in proagents.config.yaml:

```yaml
backup:
  retention: 5
  compress: true
```
