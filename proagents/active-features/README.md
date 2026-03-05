# Active Features Tracking

Track parallel feature development and manage conflicts.

---

## Overview

This directory tracks all features currently in development. It enables:

- Parallel feature development
- Conflict detection
- Dependency management
- Progress tracking

---

## Directory Structure

```
active-features/
├── README.md                    # This file
├── _index.json                  # Master list of features (auto-generated)
├── feature-user-auth/           # Example feature directory
│   ├── status.json             # Machine-readable status
│   ├── status.md               # Human-readable status
│   ├── requirements.md         # Feature requirements
│   ├── design.md               # Design decisions
│   ├── files-modified.json     # Files this feature touches
│   └── dependencies.json       # Dependencies on other features
└── feature-dashboard/           # Another feature
    └── ...
```

---

## Feature Index (_index.json)

```json
{
  "active_features": [
    {
      "id": "feature-user-auth",
      "name": "User Authentication",
      "branch": "feature/user-auth",
      "current_phase": "implementation",
      "progress": 60,
      "started": "2024-01-15T10:00:00Z",
      "assignee": "developer-1",
      "blockers": []
    }
  ],
  "completed_features": [],
  "blocked_features": []
}
```

---

## Feature Status (status.json)

```json
{
  "feature_id": "feature-user-auth",
  "name": "User Authentication",
  "branch": "feature/user-auth",
  "status": "in_progress",
  "phase": "implementation",
  "phase_progress": 60,
  "started": "2024-01-15T10:00:00Z",
  "last_updated": "2024-01-16T14:30:00Z",
  "phases_completed": [
    "analysis",
    "requirements",
    "design",
    "planning"
  ],
  "files_created": 8,
  "files_modified": 3,
  "tests_added": 12
}
```

---

## Conflict Detection

Files that multiple features modify are tracked:

```json
// files-modified.json
{
  "feature_id": "feature-user-auth",
  "files": [
    {
      "path": "src/components/Header.tsx",
      "sections": ["navigation", "user-menu"],
      "last_modified": "2024-01-16T10:00:00Z"
    }
  ]
}
```

When conflicts are detected:

```
⚠️ CONFLICT DETECTED

Files modified by multiple features:
- src/components/Header.tsx
  - feature-user-auth (navigation section)
  - feature-dashboard (navigation section)

Recommendation: Coordinate before merge
```

---

## Usage

### Start Feature Tracking

When you run `pa:feature "Feature Name"`:
1. Directory created: `active-features/feature-name/`
2. Status files initialized
3. Added to `_index.json`

### Check Conflicts

```
pa:conflict-check
```

Shows any file conflicts with other active features.

### View Status

```
pa:feature-status
```

Shows current feature progress and any blockers.

### Complete Feature

When feature is done:
1. Moved to `completed_features` in index
2. Files archived (optional)
3. Conflict tracking removed

---

## .gitignore Recommendation

```gitignore
# In your project .gitignore
proagents/active-features/_index.json
proagents/active-features/*/status.json
proagents/active-features/*/files-modified.json

# Keep these (optional)
# proagents/active-features/*/requirements.md
# proagents/active-features/*/design.md
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:feature` | Start new feature tracking |
| `pa:feature-status` | View current status |
| `pa:feature-list` | List all active features |
| `pa:conflict-check` | Check for conflicts |
| `pa:feature-complete` | Mark feature complete |
