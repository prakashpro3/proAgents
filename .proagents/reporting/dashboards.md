# Dashboards

Configure and customize analytics dashboards.

---

## Overview

Dashboards provide real-time visibility into development metrics and project health.

---

## Dashboard Types

### Executive Dashboard

High-level overview for leadership:

```
┌─────────────────────────────────────────────────────────────┐
│ Executive Dashboard - January 2024                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Key Metrics                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ Velocity    │ │ Quality     │ │ On Time     │            │
│ │    ↑ 15%    │ │   85/100    │ │    92%      │            │
│ │ vs last mo  │ │   score     │ │  delivery   │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                             │
│ Feature Delivery                                            │
│ ├── Completed: 42                                          │
│ ├── In Progress: 8                                         │
│ └── Blocked: 2                                             │
│                                                             │
│ Health                                                      │
│ ├── Production: ✅ Healthy                                 │
│ ├── Security: ✅ No critical issues                        │
│ └── Compliance: ✅ All frameworks met                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Team Dashboard

Detailed view for development team:

```
┌─────────────────────────────────────────────────────────────┐
│ Team Dashboard                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Active Features                                             │
│ ├── user-auth: Phase 6/9 (Testing) - Dev1                 │
│ ├── dashboard: Phase 4/9 (Planning) - Dev2                │
│ └── notifications: Phase 3/9 (Design) - Dev3              │
│                                                             │
│ Today's Activity                                            │
│ ├── Commits: 23                                            │
│ ├── PRs Opened: 5                                          │
│ ├── PRs Merged: 7                                          │
│ └── Reviews Completed: 12                                  │
│                                                             │
│ Build Status                                                │
│ ├── frontend: ✅ Passing (2 min ago)                       │
│ ├── backend: ✅ Passing (5 min ago)                        │
│ └── mobile: ⚠️ Warning (flaky test)                        │
│                                                             │
│ Upcoming                                                    │
│ ├── PR Review: auth-fix (assigned to you)                 │
│ ├── Deployment: staging at 2pm                            │
│ └── Meeting: Sprint review at 4pm                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Project Dashboard

Project-specific metrics:

```
┌─────────────────────────────────────────────────────────────┐
│ Project: Frontend App                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Health Score: 87/100                                       │
│ ████████████████████████████████████░░░░                   │
│                                                             │
│ Metrics                                                     │
│ ├── Test Coverage: 78% (target: 80%)                      │
│ ├── Bundle Size: 245kb (limit: 300kb)                     │
│ ├── Tech Debt: 15 items                                   │
│ └── Dependencies: 3 outdated                              │
│                                                             │
│ Recent Changes                                              │
│ ├── Jan 15: Added new auth flow (+3 components)           │
│ ├── Jan 14: Fixed memory leak in dashboard                │
│ └── Jan 13: Updated React to v18.2                        │
│                                                             │
│ Performance                                                 │
│ ├── LCP: 1.8s (good)                                      │
│ ├── FID: 45ms (good)                                      │
│ └── CLS: 0.05 (good)                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Dashboard Configuration

### Basic Configuration

```yaml
# proagents.config.yaml

dashboards:
  enabled: true

  # Default dashboard
  default: "team"

  # Refresh interval
  refresh: "5m"

  # Available dashboards
  types:
    executive:
      enabled: true
      access: ["managers", "leads"]

    team:
      enabled: true
      access: ["all"]

    project:
      enabled: true
      access: ["all"]
```

### Custom Dashboards

```yaml
dashboards:
  custom:
    - name: "Security Overview"
      id: "security"
      layout:
        - row: 1
          widgets:
            - type: "score"
              metric: "security_score"
              size: "medium"
            - type: "counter"
              metric: "vulnerabilities"
              size: "medium"

        - row: 2
          widgets:
            - type: "list"
              metric: "recent_security_events"
              size: "large"

        - row: 3
          widgets:
            - type: "chart"
              metric: "vulnerability_trend"
              chart_type: "line"
              size: "large"
```

### Widget Types

| Widget | Description | Use Case |
|--------|-------------|----------|
| `score` | Single metric with gauge | Quality score, health score |
| `counter` | Number with trend | Features completed, issues |
| `chart` | Line, bar, pie charts | Trends over time |
| `list` | Ordered list | Recent activity, top items |
| `table` | Data table | Detailed metrics |
| `status` | Status indicators | System health, builds |
| `progress` | Progress bars | Feature progress, coverage |

---

## Accessing Dashboards

### CLI Access

```bash
# Open dashboard in browser
proagents dashboard

# Open specific dashboard
proagents dashboard --type executive

# Show dashboard in terminal
proagents dashboard --terminal

# Export dashboard
proagents dashboard export --format html --output dashboard.html
```

### Web Dashboard

```bash
# Start dashboard server
proagents dashboard serve

# Access at http://localhost:3030

# With authentication
proagents dashboard serve --auth
```

### IDE Integration

VS Code extension provides dashboard panel in sidebar.

---

## Real-Time Updates

### WebSocket Updates

```yaml
dashboards:
  realtime:
    enabled: true
    protocol: "websocket"
    update_interval: "10s"

    subscriptions:
      - "build_status"
      - "deployment_status"
      - "test_results"
      - "pr_activity"
```

### Notification Integration

```yaml
dashboards:
  notifications:
    desktop: true
    sound: false

    triggers:
      - event: "build_failed"
        notify: true
        priority: "high"

      - event: "deployment_complete"
        notify: true
        priority: "normal"
```

---

## Sharing Dashboards

### Scheduled Reports

```yaml
dashboards:
  reports:
    - name: "Weekly Executive Summary"
      dashboard: "executive"
      schedule: "monday 9am"
      format: "pdf"
      recipients:
        - "leadership@company.com"

    - name: "Daily Team Status"
      dashboard: "team"
      schedule: "daily 9am"
      format: "slack"
      channel: "#dev-team"
```

### Export Options

```bash
# Export as PDF
proagents dashboard export --format pdf

# Export as HTML (interactive)
proagents dashboard export --format html

# Export as PNG (snapshot)
proagents dashboard export --format png

# Export data as JSON
proagents dashboard export --format json
```

### Embedding

```html
<!-- Embed dashboard in internal tools -->
<iframe
  src="https://proagents.company.com/dashboard/team?embed=true"
  width="100%"
  height="600"
></iframe>
```

---

## Dashboard Customization

### Themes

```yaml
dashboards:
  theme:
    mode: "dark"  # light, dark, auto
    colors:
      primary: "#3b82f6"
      success: "#22c55e"
      warning: "#f59e0b"
      error: "#ef4444"
```

### Layout Customization

```yaml
dashboards:
  layout:
    columns: 3
    row_height: 200
    gap: 16

    responsive:
      mobile:
        columns: 1
      tablet:
        columns: 2
```

### Personal Preferences

```yaml
# ~/.proagents/dashboard-prefs.yaml

preferences:
  default_dashboard: "team"
  default_period: "7d"
  favorite_metrics:
    - "velocity"
    - "coverage"
    - "pr_cycle_time"
  collapsed_sections:
    - "compliance"
```

---

## Best Practices

1. **Keep It Simple**: Focus on actionable metrics
2. **Right Audience**: Different dashboards for different roles
3. **Update Frequently**: Stale data is useless
4. **Enable Alerts**: Get notified of important changes
5. **Review Regularly**: Ensure dashboards remain relevant
6. **Share Widely**: Make metrics visible to the team
