# Velocity Metrics

Track development speed and delivery throughput.

---

## Overview

Velocity metrics help understand how fast your team delivers value and identify bottlenecks.

---

## Key Metrics

### Features Per Period

```
┌─────────────────────────────────────────────────────────────┐
│ Features Completed - Last 4 Weeks                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Week 1:  ████████████████ 8                               │
│  Week 2:  ██████████████████████ 11                        │
│  Week 3:  ████████████████████ 10                          │
│  Week 4:  ██████████████████████████ 13                    │
│                                                             │
│  Average: 10.5 features/week                               │
│  Trend: ↑ 15% improvement                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cycle Time

Time from feature start to completion:

```yaml
cycle_time:
  current_average: "3.2 days"
  trend: "improving"

  by_phase:
    analysis: "0.5 days"
    requirements: "0.3 days"
    design: "0.4 days"
    implementation: "1.2 days"
    testing: "0.5 days"
    review: "0.2 days"
    deployment: "0.1 days"

  by_complexity:
    low: "1.5 days"
    medium: "3.0 days"
    high: "5.5 days"
```

### Lead Time

Time from feature request to production:

```yaml
lead_time:
  current_average: "5.8 days"

  breakdown:
    waiting: "1.5 days"   # In backlog
    active: "3.2 days"    # In development
    review: "0.8 days"    # In review
    deploy: "0.3 days"    # To production
```

### Throughput

```
┌─────────────────────────────────────────────────────────────┐
│ Weekly Throughput                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Features:   ████████████████████ 10                        │
│ Bug Fixes:  ████████████████████████████████ 18           │
│ Quick:      ████████ 4                                     │
│                                                             │
│ Total Deliveries: 32                                       │
│ Deployment Frequency: 4.5/day                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Velocity Report

### Generate Report

```bash
# Weekly velocity report
proagents report velocity --period week

# Monthly velocity report
proagents report velocity --period month

# Custom date range
proagents report velocity --from 2024-01-01 --to 2024-01-31
```

### Report Output

```markdown
# Velocity Report - Week 3, 2024

## Summary
- Features Completed: 12 (↑ 20% from last week)
- Bug Fixes: 15
- Quick Changes: 8
- Total Deliveries: 35

## Cycle Time
- Average: 3.1 days (↓ 0.3 days improvement)
- Fastest: 0.5 days (config update)
- Slowest: 8.2 days (payment integration)

## By Team Member
| Developer | Features | Bug Fixes | Avg Cycle Time |
|-----------|----------|-----------|----------------|
| Dev 1     | 4        | 3         | 2.8 days       |
| Dev 2     | 3        | 5         | 3.2 days       |
| Dev 3     | 5        | 7         | 3.0 days       |

## Bottlenecks Identified
1. Code review taking 25% longer than target
2. Testing phase delays on complex features

## Recommendations
1. Add second reviewer for faster reviews
2. Improve test infrastructure
```

---

## Tracking Configuration

### Metric Collection

```yaml
reporting:
  velocity:
    metrics:
      - features_completed
      - bug_fixes
      - cycle_time
      - lead_time
      - throughput
      - deployment_frequency

    track_by:
      - team
      - developer
      - project
      - complexity

    periods:
      - daily
      - weekly
      - monthly
      - quarterly
```

### Targets and Thresholds

```yaml
velocity:
  targets:
    cycle_time:
      low_complexity: "2 days"
      medium_complexity: "4 days"
      high_complexity: "8 days"

    features_per_week:
      minimum: 5
      target: 10
      stretch: 15

    deployment_frequency:
      minimum: "1/day"
      target: "3/day"

  alerts:
    - metric: cycle_time
      condition: "> 5 days"
      action: notify_lead

    - metric: features_per_week
      condition: "< 5"
      action: schedule_retrospective
```

---

## Trend Analysis

### Velocity Trends

```
┌─────────────────────────────────────────────────────────────┐
│ Velocity Trend - Last 12 Weeks                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Features │                                     ●          │
│  /Week    │                           ●    ●              │
│           │              ●    ●   ●                        │
│    15  ── │         ●                                      │
│           │    ●                                           │
│    10  ── │ ●                                              │
│           │                                                 │
│     5  ── │                                                 │
│           └────────────────────────────────────────────────│
│             W1  W2  W3  W4  W5  W6  W7  W8  W9  W10 W11 W12│
│                                                             │
│  Trend: ↑ 25% improvement over 12 weeks                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Predictive Analysis

```yaml
predictions:
  next_week:
    features: "11-13"
    confidence: 85%

  quarter_end:
    features: "140-160"
    on_track: true

  risk_factors:
    - "Holiday week may reduce by 30%"
    - "New team member ramping up"
```

---

## Phase Analysis

### Time per Phase

```
┌─────────────────────────────────────────────────────────────┐
│ Average Time per Phase                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Analysis:       ████ 0.5 days (target: 0.5)              │
│  Requirements:   ███ 0.3 days (target: 0.5)               │
│  Design:         ████ 0.4 days (target: 0.5)              │
│  Implementation: ████████████ 1.2 days (target: 1.0) ⚠️   │
│  Testing:        █████ 0.5 days (target: 0.5)             │
│  Review:         ████ 0.4 days (target: 0.3) ⚠️           │
│  Documentation:  ██ 0.2 days (target: 0.3)                │
│  Deployment:     █ 0.1 days (target: 0.2)                 │
│                                                             │
│  Total: 3.6 days (target: 3.8 days) ✅                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Bottleneck Detection

```yaml
bottlenecks:
  detected:
    - phase: implementation
      delay: "0.2 days over target"
      frequency: "60% of features"
      cause: "Complex integrations"
      recommendation: "Break into smaller tasks"

    - phase: review
      delay: "0.1 days over target"
      frequency: "40% of features"
      cause: "Reviewer availability"
      recommendation: "Add backup reviewers"
```

---

## Comparison Reports

### Team Comparison

```bash
proagents report velocity --compare teams
```

```
┌─────────────────────────────────────────────────────────────┐
│ Team Velocity Comparison                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Team        │ Features │ Cycle Time │ Quality │ Score      │
│ ────────────┼──────────┼────────────┼─────────┼───────     │
│ Frontend    │ 15       │ 2.8 days   │ 92%     │ ████████   │
│ Backend     │ 12       │ 3.5 days   │ 88%     │ ███████    │
│ Mobile      │ 8        │ 4.2 days   │ 85%     │ ██████     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Period Comparison

```bash
proagents report velocity --compare periods
```

```
┌─────────────────────────────────────────────────────────────┐
│ Period Comparison: Q4 2023 vs Q1 2024                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Metric              │ Q4 2023  │ Q1 2024  │ Change        │
│ ────────────────────┼──────────┼──────────┼────────────── │
│ Features/Week       │ 8.5      │ 11.2     │ ↑ 32%        │
│ Cycle Time          │ 4.2 days │ 3.1 days │ ↓ 26%        │
│ Deployment Freq     │ 2.1/day  │ 3.8/day  │ ↑ 81%        │
│ Bug Escape Rate     │ 8%       │ 5%       │ ↓ 38%        │
│                                                             │
│ Overall Improvement: 34%                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Track Consistently**: Measure the same metrics over time
2. **Focus on Trends**: Single data points are less meaningful
3. **Context Matters**: Consider holidays, team changes
4. **Don't Game Metrics**: Quality over quantity
5. **Share Results**: Make metrics visible to the team
6. **Act on Insights**: Use data to drive improvements
