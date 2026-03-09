# Reporting & Analytics Dashboard

Track development metrics, team productivity, and project health.

---

## Overview

ProAgents provides comprehensive reporting and analytics to track development progress and identify areas for improvement.

```
┌─────────────────────────────────────────────────────────────┐
│                    Analytics Dashboard                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Velocity     │  │    Quality      │                  │
│  │  ████████░░ 80% │  │  ████████░░ 85% │                  │
│  │  Features/Week  │  │  Test Coverage  │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Efficiency    │  │    Team         │                  │
│  │  ████████░░ 75% │  │  ████████░░ 90% │                  │
│  │  Phase Time     │  │  Collaboration  │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Generate Reports

```bash
# Generate velocity report
proagents report velocity

# Generate quality report
proagents report quality

# Generate all reports
proagents report all
```

### View Dashboard

```bash
# Open dashboard in browser
proagents dashboard

# Generate static dashboard
proagents dashboard export --format html
```

---

## Report Types

| Report | Description | Frequency |
|--------|-------------|-----------|
| **Velocity** | Development speed and throughput | Weekly |
| **Quality** | Code quality and test coverage | Weekly |
| **Team** | Team activity and collaboration | Weekly |
| **Features** | Feature completion and status | Daily |
| **Security** | Security vulnerabilities and fixes | Weekly |
| **Dependencies** | Dependency health and updates | Weekly |

---

## Documentation Files

| File | Description |
|------|-------------|
| [velocity-metrics.md](./velocity-metrics.md) | Velocity tracking and metrics |
| [quality-metrics.md](./quality-metrics.md) | Code quality metrics |
| [dashboards.md](./dashboards.md) | Dashboard configuration |
| [exports.md](./exports.md) | Report export options |

---

## Key Metrics

### Development Velocity

- Features completed per week
- Average time per phase
- Cycle time (start to deploy)
- Lead time (idea to deploy)

### Code Quality

- Test coverage percentage
- Code review completion rate
- Bug escape rate
- Technical debt score

### Team Performance

- Features per developer
- Review turnaround time
- Collaboration score
- Knowledge sharing

---

## Configuration

```yaml
# proagents.config.yaml

reporting:
  enabled: true

  # Automatic reports
  schedules:
    - report: velocity
      frequency: weekly
      day: monday
      recipients: [team@company.com]

    - report: quality
      frequency: weekly
      day: friday
      recipients: [tech-lead@company.com]

  # Dashboard settings
  dashboard:
    refresh_interval: "5m"
    default_period: "30d"

  # Metrics collection
  metrics:
    velocity: true
    quality: true
    team: true
    security: true

  # Export settings
  export:
    formats: [pdf, html, json]
    include_charts: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents report velocity` | Generate velocity report |
| `proagents report quality` | Generate quality report |
| `proagents report team` | Generate team report |
| `proagents report all` | Generate all reports |
| `proagents dashboard` | Open live dashboard |
| `proagents metrics` | Show current metrics |
