# Sprints

This folder contains sprint tracking files.

## Commands

- `pa:sprint-start` - Start a new sprint
- `pa:sprint-end` - End sprint with summary
- `pa:sprint-status` - Show current sprint status
- `pa:velocity` - Show velocity metrics

## File Structure

```
sprints/
├── sprint-1.json           # Sprint data
├── sprint-1-summary.md     # Sprint summary (generated on end)
├── sprint-2.json
└── sprint-2-summary.md
```

## Sprint File Format

```json
{
  "sprint_number": 1,
  "name": "Sprint 1",
  "start_date": "2024-03-01",
  "end_date": "2024-03-15",
  "status": "active",
  "goals": [
    "Complete user authentication",
    "Add dashboard UI"
  ],
  "features": [
    {
      "name": "user-auth",
      "status": "completed",
      "points": 8
    },
    {
      "name": "dashboard",
      "status": "in_progress",
      "points": 5
    }
  ],
  "metrics": {
    "planned_points": 13,
    "completed_points": 8,
    "velocity": 8
  }
}
```

## Velocity Tracking

Velocity is calculated as the average story points completed per sprint.
Use `pa:velocity` to see trends over time.
