# Feature Tracking System

Track multiple features simultaneously with clear status visibility.

---

## Overview

The tracking system provides:
- Real-time feature status
- Progress tracking per phase
- Resource allocation visibility
- Blocker identification
- Timeline management

---

## Tracking Structure

### Feature Directory

```
/proagents/active-features/
├── _index.json                    # Master index
├── _dashboard.md                  # Human-readable dashboard
├── feature-user-auth/
│   ├── status.json                # Machine-readable status
│   ├── status.md                  # Human-readable status
│   ├── requirements.md            # Requirements document
│   ├── design.md                  # Design document
│   ├── implementation-plan.md     # Implementation plan
│   ├── files-modified.json        # Files touched by feature
│   ├── dependencies.json          # Feature dependencies
│   └── timeline.json              # Phase timeline
├── feature-dashboard/
│   └── ...
└── feature-notifications/
    └── ...
```

---

## Master Index

```json
// _index.json
{
  "last_updated": "2024-01-15T14:30:00Z",
  "active_features": [
    {
      "id": "feature-user-auth",
      "name": "User Authentication",
      "status": "in_progress",
      "current_phase": "implementation",
      "phase_progress": 60,
      "branch": "feature/user-auth",
      "assignee": "developer-1",
      "started": "2024-01-10T09:00:00Z",
      "estimated_completion": "2024-01-20",
      "blockers": [],
      "priority": "high"
    },
    {
      "id": "feature-dashboard",
      "name": "User Dashboard",
      "status": "blocked",
      "current_phase": "implementation",
      "phase_progress": 30,
      "branch": "feature/dashboard",
      "assignee": "developer-2",
      "started": "2024-01-12T09:00:00Z",
      "blockers": ["Waiting for user-auth API"],
      "priority": "medium"
    }
  ],
  "completed_features": [
    {
      "id": "feature-login-page",
      "name": "Login Page",
      "completed": "2024-01-08",
      "branch": "feature/login-page",
      "merged_to": "main"
    }
  ],
  "paused_features": []
}
```

---

## Feature Status

```json
// feature-user-auth/status.json
{
  "id": "feature-user-auth",
  "name": "User Authentication",
  "description": "Implement user login, registration, and session management",

  "status": "in_progress",
  "priority": "high",
  "assignee": "developer-1",

  "branch": {
    "name": "feature/user-auth",
    "base": "develop",
    "commits": 15,
    "behind_base": 2
  },

  "phases": {
    "init": { "status": "completed", "completed_at": "2024-01-10T10:00:00Z" },
    "analysis": { "status": "completed", "completed_at": "2024-01-10T12:00:00Z" },
    "requirements": { "status": "completed", "completed_at": "2024-01-10T14:00:00Z" },
    "design": { "status": "completed", "completed_at": "2024-01-11T12:00:00Z" },
    "planning": { "status": "completed", "completed_at": "2024-01-11T16:00:00Z" },
    "implementation": { "status": "in_progress", "progress": 60 },
    "testing": { "status": "pending" },
    "review": { "status": "pending" },
    "documentation": { "status": "pending" },
    "deployment": { "status": "pending" }
  },

  "current_task": "Implementing password reset flow",

  "timeline": {
    "started": "2024-01-10T09:00:00Z",
    "estimated_completion": "2024-01-20T17:00:00Z",
    "actual_hours": 24,
    "estimated_remaining_hours": 16
  },

  "files_modified": [
    "src/features/auth/components/LoginForm.tsx",
    "src/features/auth/hooks/useAuth.ts",
    "src/features/auth/services/authService.ts",
    "src/lib/api.ts"
  ],

  "dependencies": {
    "depends_on": [],
    "blocks": ["feature-dashboard", "feature-notifications"]
  },

  "blockers": [],
  "risks": [
    {
      "description": "OAuth provider integration may take longer",
      "impact": "medium",
      "mitigation": "Start with email/password first"
    }
  ],

  "notes": [
    {
      "date": "2024-01-12",
      "author": "developer-1",
      "content": "Decided to use JWT instead of sessions"
    }
  ]
}
```

---

## Human-Readable Status

```markdown
<!-- feature-user-auth/status.md -->
# Feature: User Authentication

## Quick Status

| Attribute | Value |
|-----------|-------|
| **Status** | 🔄 In Progress |
| **Phase** | Implementation (60%) |
| **Assignee** | developer-1 |
| **Branch** | feature/user-auth |
| **Started** | 2024-01-10 |
| **ETA** | 2024-01-20 |

## Phase Progress

```
✅ Init          ██████████ 100%
✅ Analysis      ██████████ 100%
✅ Requirements  ██████████ 100%
✅ Design        ██████████ 100%
✅ Planning      ██████████ 100%
🔄 Implementation ██████░░░░ 60%
⏳ Testing       ░░░░░░░░░░ 0%
⏳ Review        ░░░░░░░░░░ 0%
⏳ Documentation ░░░░░░░░░░ 0%
⏳ Deployment    ░░░░░░░░░░ 0%
```

## Current Task
Implementing password reset flow

## Files Modified
- `src/features/auth/components/LoginForm.tsx`
- `src/features/auth/hooks/useAuth.ts`
- `src/features/auth/services/authService.ts`
- `src/lib/api.ts`

## Blockers
None

## Dependencies
- **Blocks:** feature-dashboard, feature-notifications
- **Depends on:** None

## Timeline
- Started: 2024-01-10
- Actual hours: 24h
- Remaining: ~16h
- On track: ✅ Yes

## Notes
- 2024-01-12: Decided to use JWT instead of sessions
```

---

## Dashboard View

```markdown
<!-- _dashboard.md -->
# ProAgents Feature Dashboard

**Last Updated:** 2024-01-15 14:30 UTC

## Active Features: 3 / 5 (max)

### 🔄 In Progress

| Feature | Phase | Progress | Assignee | ETA | Status |
|---------|-------|----------|----------|-----|--------|
| User Auth | Implementation | 60% | dev-1 | Jan 20 | ✅ On track |
| Dashboard | Implementation | 30% | dev-2 | Jan 25 | ⚠️ Blocked |
| Settings | Design | 80% | dev-3 | Jan 22 | ✅ On track |

### ⏸️ Blocked

| Feature | Blocked By | Since |
|---------|------------|-------|
| Dashboard | Waiting for User Auth API | 2 days |

### ✅ Recently Completed

| Feature | Completed | Merged |
|---------|-----------|--------|
| Login Page | Jan 8 | ✅ |
| Footer | Jan 5 | ✅ |

---

## Dependency Graph

```
user-auth ─────┬──▶ dashboard ──▶ notifications
               │
               └──▶ settings
```

## Conflict Alerts

⚠️ **1 potential conflict detected:**
- `src/lib/api.ts` modified by both `user-auth` and `dashboard`

## Recommended Actions

1. Merge `user-auth` first to unblock `dashboard`
2. Review potential conflict in `api.ts`
3. Consider starting `notifications` after `dashboard` unblocked
```

---

## Progress Tracking

### Phase Completion

```typescript
// Update phase status
async function updatePhaseStatus(
  featureId: string,
  phase: string,
  status: 'completed' | 'in_progress' | 'pending',
  progress?: number
) {
  const statusFile = `active-features/${featureId}/status.json`;
  const featureStatus = await readJSON(statusFile);

  featureStatus.phases[phase] = {
    status,
    progress,
    ...(status === 'completed' && { completed_at: new Date().toISOString() }),
  };

  // Update current phase
  if (status === 'in_progress') {
    featureStatus.current_phase = phase;
  }

  await writeJSON(statusFile, featureStatus);
  await updateIndex();
  await generateDashboard();
}
```

### Time Tracking

```yaml
time_tracking:
  feature_id: "feature-user-auth"

  by_phase:
    init: { hours: 0.5 }
    analysis: { hours: 2 }
    requirements: { hours: 1.5 }
    design: { hours: 4 }
    planning: { hours: 2 }
    implementation: { hours: 16, in_progress: true }
    testing: { hours: 0, estimated: 6 }
    review: { hours: 0, estimated: 2 }
    documentation: { hours: 0, estimated: 2 }
    deployment: { hours: 0, estimated: 1 }

  totals:
    actual: 26
    estimated_remaining: 11
    original_estimate: 40
    variance: "-3 hours"
```

---

## Notifications

```yaml
notifications:
  triggers:
    - event: "phase_completed"
      notify: ["assignee", "team_lead"]
      channel: "slack"

    - event: "blocker_added"
      notify: ["assignee", "blocking_feature_owner"]
      channel: "slack"
      priority: "high"

    - event: "behind_schedule"
      notify: ["assignee", "team_lead"]
      channel: "email"

    - event: "ready_for_review"
      notify: ["reviewers"]
      channel: "slack"

  templates:
    phase_completed: |
      ✅ Feature "{{feature_name}}" completed phase: {{phase}}
      Progress: {{overall_progress}}%

    blocker_added: |
      ⚠️ Feature "{{feature_name}}" is now blocked
      Blocker: {{blocker_description}}
      Blocked by: {{blocking_feature}}
```

---

## Configuration

```yaml
# proagents.config.yaml

tracking:
  enabled: true

  features:
    max_concurrent: 5
    require_assignee: true
    require_estimate: true

  phases:
    track_time: true
    require_completion: true

  dashboard:
    auto_generate: true
    refresh_interval: "5m"

  notifications:
    enabled: true
    channels: ["slack"]

  reporting:
    daily_summary: true
    weekly_report: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:feature-status` | View all features status |
| `pa:feature-status [id]` | View specific feature |
| `pa:feature-update [id]` | Update feature status |
| `pa:feature-block [id]` | Mark feature as blocked |
| `pa:feature-unblock [id]` | Remove blocker |
| `pa:feature-dashboard` | View dashboard |
