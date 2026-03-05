# Metrics & KPIs

Track development productivity, code quality, and workflow effectiveness.

---

## Overview

ProAgents provides comprehensive metrics collection and KPI tracking to help teams understand their development velocity, code quality, and workflow effectiveness.

---

## Available Metrics

| Category | Document | Description |
|----------|----------|-------------|
| [Developer Productivity](./developer-productivity.md) | Velocity, cycle time, throughput | Track team and individual efficiency |
| [Code Quality KPIs](./code-quality-kpis.md) | Coverage, complexity, debt | Measure code health over time |
| [Deployment Metrics](./deployment-metrics.md) | DORA, frequency, stability | Track delivery performance |
| [Learning Effectiveness](./learning-effectiveness.md) | Adoption, improvement rates | Measure workflow optimization |

---

## Quick Start

### Enable Metrics Collection

```yaml
# proagents.config.yaml
metrics:
  enabled: true

  collection:
    developer_productivity: true
    code_quality: true
    deployment: true
    learning: true

  storage:
    type: "local"  # local, database, api
    path: ".proagents/metrics/"
    retention_days: 90

  reporting:
    schedule: "weekly"  # daily, weekly, monthly
    format: "markdown"  # markdown, json, html
    output: "./reports/"
```

---

## Dashboard Commands

```bash
# View current metrics dashboard
pa:metrics dashboard

# Generate weekly report
pa:metrics report --period weekly

# View specific category
pa:metrics productivity
pa:metrics quality
pa:metrics deployment

# Export metrics
pa:metrics export --format json --output ./metrics.json
```

---

## Metric Categories

### Developer Productivity Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Cycle Time | Time from start to completion | < 3 days |
| Throughput | Features completed per sprint | Consistent |
| Lead Time | Time from request to delivery | < 1 week |
| WIP | Work in progress count | < 3 per dev |

### Code Quality Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Test Coverage | Percentage of code tested | > 80% |
| Code Complexity | Cyclomatic complexity | < 10 |
| Tech Debt Ratio | Debt vs development time | < 5% |
| Duplication | Duplicated code percentage | < 3% |

### Deployment Metrics (DORA)

| Metric | Description | Elite Target |
|--------|-------------|--------------|
| Deployment Frequency | How often you deploy | Multiple/day |
| Lead Time for Changes | Commit to production | < 1 hour |
| Change Failure Rate | Deployments causing failure | < 5% |
| MTTR | Mean time to recovery | < 1 hour |

---

## Integration

### With CI/CD

```yaml
# .github/workflows/metrics.yml
- name: Collect ProAgents Metrics
  run: |
    proagents metrics collect \
      --coverage ./coverage/lcov.info \
      --tests ./test-results.xml \
      --commit ${{ github.sha }}
```

### With Dashboards

```yaml
# Export to external dashboards
metrics:
  export:
    grafana:
      enabled: true
      endpoint: "${GRAFANA_URL}"
    datadog:
      enabled: true
      api_key: "${DD_API_KEY}"
```

---

## Reports

### Weekly Summary Template

```markdown
## Development Metrics - Week {{week}}

### Productivity
- Features Completed: {{features_completed}}
- Average Cycle Time: {{avg_cycle_time}}
- Throughput Trend: {{throughput_trend}}

### Code Quality
- Test Coverage: {{coverage}}% ({{coverage_trend}})
- New Technical Debt: {{new_debt}}
- Debt Resolved: {{resolved_debt}}

### Deployment
- Deployments: {{deployment_count}}
- Success Rate: {{success_rate}}%
- Average Lead Time: {{avg_lead_time}}

### Highlights
{{#each highlights}}
- {{this}}
{{/each}}

### Action Items
{{#each actions}}
- [ ] {{this}}
{{/each}}
```

---

## Best Practices

1. **Focus on Trends**: Individual metrics matter less than trends over time
2. **Context Matters**: Compare metrics within similar project types
3. **Avoid Gaming**: Use metrics for improvement, not punishment
4. **Regular Review**: Schedule weekly metric reviews
5. **Team Ownership**: Let teams define their own targets
