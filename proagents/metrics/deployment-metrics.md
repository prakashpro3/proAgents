# Deployment Metrics

Track delivery performance using DORA metrics and deployment analytics.

---

## Prompt Template

```
Analyze deployment metrics for this project:

Project: {project_name}
Period: {date_range}
Environment: {environment}

Available Data:
- Deployments: {deployment_history}
- Incidents: {incident_data}
- Release notes: {release_data}

Calculate DORA metrics:
1. Deployment Frequency
2. Lead Time for Changes
3. Change Failure Rate
4. Mean Time to Recovery (MTTR)

Also analyze:
- Deployment success rate
- Rollback frequency
- Environment stability
- Release quality trends

Provide:
- Current performance level (Elite/High/Medium/Low)
- Trend analysis
- Bottleneck identification
- Improvement recommendations
```

---

## DORA Metrics

### Deployment Frequency

How often code is deployed to production.

```yaml
deployment_frequency:
  calculation: "deployments_per_period"

  performance_levels:
    elite: "multiple_per_day"
    high: "daily_to_weekly"
    medium: "weekly_to_monthly"
    low: "monthly_or_less"

  tracking:
    environment: "production"
    exclude:
      - "config_only"
      - "rollback"
```

**Collection:**
```typescript
interface DeploymentFrequency {
  period: string;
  totalDeployments: number;
  frequency: 'multiple_per_day' | 'daily' | 'weekly' | 'monthly' | 'less_frequent';
  performanceLevel: 'elite' | 'high' | 'medium' | 'low';
  byDay: Map<string, number>;
  trend: 'improving' | 'stable' | 'degrading';
}

async function calculateDeploymentFrequency(
  deployments: Deployment[],
  periodDays: number
): Promise<DeploymentFrequency> {
  const avgPerDay = deployments.length / periodDays;

  let frequency: string;
  let level: string;

  if (avgPerDay > 1) {
    frequency = 'multiple_per_day';
    level = 'elite';
  } else if (avgPerDay >= 1/7) {
    frequency = 'daily_to_weekly';
    level = 'high';
  } else if (avgPerDay >= 1/30) {
    frequency = 'weekly_to_monthly';
    level = 'medium';
  } else {
    frequency = 'less_frequent';
    level = 'low';
  }

  return {
    period: `${periodDays} days`,
    totalDeployments: deployments.length,
    frequency,
    performanceLevel: level,
    byDay: groupDeploymentsByDay(deployments),
    trend: calculateTrend(deployments),
  };
}
```

**Dashboard:**
```
Deployment Frequency - Last 30 Days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Deployments: 47
Average: 1.6 per day

Performance: ELITE ⭐

Distribution:
Mon: ████████░░ 8
Tue: ██████████ 10
Wed: ███████░░░ 7
Thu: █████████░ 9
Fri: ████████░░ 8
Sat: ██░░░░░░░░ 2
Sun: ███░░░░░░░ 3

Trend: ↑ +15% vs previous period
```

---

### Lead Time for Changes

Time from commit to production deployment.

```yaml
lead_time:
  calculation: "commit_to_production"

  performance_levels:
    elite: "< 1 hour"
    high: "1 day - 1 week"
    medium: "1 week - 1 month"
    low: "> 1 month"

  breakdown:
    coding: "commit → PR opened"
    review: "PR opened → PR merged"
    staging: "PR merged → staging deploy"
    production: "staging deploy → production deploy"
```

**Analysis:**
```typescript
interface LeadTimeMetrics {
  average: Duration;
  median: Duration;
  percentile90: Duration;
  performanceLevel: 'elite' | 'high' | 'medium' | 'low';
  breakdown: {
    coding: Duration;
    review: Duration;
    staging: Duration;
    production: Duration;
  };
  bottleneck: string;
  trend: 'improving' | 'stable' | 'degrading';
}

function analyzeLeadTime(changes: Change[]): LeadTimeMetrics {
  const leadTimes = changes.map(c => c.productionTime - c.commitTime);

  return {
    average: average(leadTimes),
    median: median(leadTimes),
    percentile90: percentile(leadTimes, 90),
    performanceLevel: classifyLeadTime(median(leadTimes)),
    breakdown: calculateBreakdown(changes),
    bottleneck: identifyBottleneck(changes),
    trend: calculateTrend(changes),
  };
}
```

**Report:**
```
Lead Time for Changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Average:     4.2 hours
Median:      2.8 hours
90th %ile:  12.5 hours

Performance: ELITE ⭐ (< 1 day)

Breakdown:
Coding:     ██████░░░░ 1.2h (28%)
Review:     ████████░░ 1.8h (43%)
Staging:    ███░░░░░░░ 0.6h (14%)
Production: ███░░░░░░░ 0.6h (14%)

Bottleneck: Code Review (43% of time)
Recommendation: Consider pair programming
               or faster review cycles
```

---

### Change Failure Rate

Percentage of deployments causing failures.

```yaml
change_failure_rate:
  calculation: "failures / total_deployments"

  failure_types:
    rollback: "Required immediate rollback"
    hotfix: "Required hotfix within 24h"
    incident: "Caused production incident"

  performance_levels:
    elite: "< 5%"
    high: "5-10%"
    medium: "10-15%"
    low: "> 15%"
```

**Tracking:**
```typescript
interface ChangeFailureRate {
  totalDeployments: number;
  failedDeployments: number;
  rate: number;
  performanceLevel: 'elite' | 'high' | 'medium' | 'low';
  byType: {
    rollbacks: number;
    hotfixes: number;
    incidents: number;
  };
  recentFailures: FailedDeployment[];
  trend: 'improving' | 'stable' | 'degrading';
}

interface FailedDeployment {
  id: string;
  date: Date;
  type: 'rollback' | 'hotfix' | 'incident';
  description: string;
  rootCause: string;
  resolution: string;
  timeToRecover: Duration;
}
```

**Dashboard:**
```
Change Failure Rate - Last 30 Days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Deployments: 47
Failed Deployments: 2
Failure Rate: 4.3%

Performance: ELITE ⭐ (< 5%)

By Type:
Rollbacks:  1 (2.1%)
Hotfixes:   1 (2.1%)
Incidents:  0 (0%)

Recent Failures:
1. 2024-01-15: Rollback - Payment API timeout
   Root Cause: Missing connection pool config
   Recovery: 12 minutes

2. 2024-01-08: Hotfix - Auth redirect issue
   Root Cause: Missing redirect URL
   Recovery: 45 minutes

Trend: ↓ Improving (-2% vs previous period)
```

---

### Mean Time to Recovery (MTTR)

How long it takes to recover from failures.

```yaml
mttr:
  calculation: "incident_start_to_resolution"

  performance_levels:
    elite: "< 1 hour"
    high: "< 1 day"
    medium: "1 day - 1 week"
    low: "> 1 week"

  tracking:
    start: "incident_detected"
    end: "service_restored"

  breakdown:
    detection: "Issue detected"
    diagnosis: "Root cause identified"
    fix: "Fix implemented"
    verification: "Fix verified"
```

**Analysis:**
```typescript
interface MTTRMetrics {
  average: Duration;
  median: Duration;
  performanceLevel: 'elite' | 'high' | 'medium' | 'low';
  breakdown: {
    detection: Duration;
    diagnosis: Duration;
    fix: Duration;
    verification: Duration;
  };
  byIncidentType: Map<string, Duration>;
  trend: 'improving' | 'stable' | 'degrading';
}
```

**Report:**
```
Mean Time to Recovery
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Average MTTR:  28 minutes
Median MTTR:   22 minutes

Performance: ELITE ⭐ (< 1 hour)

Recovery Breakdown:
Detection:    ███░░░░░░░ 5 min (18%)
Diagnosis:    █████░░░░░ 10 min (36%)
Fix:          ████░░░░░░ 8 min (29%)
Verification: ████░░░░░░ 5 min (18%)

By Incident Type:
API Issues:      18 min
Database:        35 min
Infrastructure:  42 min
Auth/Security:   25 min

Trend: ↓ Improving (-15% vs previous period)
```

---

## DORA Performance Summary

```
DORA Metrics Summary - Q1 2024
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Metric                 Value           Level
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deployment Frequency   1.6/day         ELITE ⭐
Lead Time for Changes  2.8 hours       ELITE ⭐
Change Failure Rate    4.3%            ELITE ⭐
MTTR                   22 minutes      ELITE ⭐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Performance: ELITE ⭐

Comparison to Industry:
You are performing better than 95% of organizations.

Key Strengths:
- Fast deployment cadence
- Quick recovery from issues
- Low failure rate

Areas for Improvement:
- Reduce code review time
- Automate more staging tests
```

---

## Additional Deployment Metrics

### Deployment Success Rate

```yaml
deployment_success:
  metrics:
    success_rate: "successful / total"
    first_time_success: "no retries needed"
    rollback_rate: "rollbacks / total"

  targets:
    success_rate: "> 98%"
    first_time_success: "> 95%"
    rollback_rate: "< 2%"
```

### Environment Stability

```yaml
environment_stability:
  metrics:
    uptime: "percentage available"
    incident_frequency: "incidents per period"
    degradation_time: "time in degraded state"

  by_environment:
    production:
      sla: "99.9%"
      monitoring: "continuous"
    staging:
      sla: "99%"
      monitoring: "business_hours"
```

### Release Quality

```yaml
release_quality:
  metrics:
    bugs_per_release: "bugs found post-deploy"
    customer_impact: "users affected by issues"
    security_issues: "vulnerabilities introduced"

  tracking:
    window: "7 days post release"
    severity_weighting: true
```

---

## Collection & Integration

### CI/CD Integration

```yaml
# .github/workflows/deploy.yml
- name: Record Deployment
  run: |
    proagents metrics deployment record \
      --environment production \
      --commit ${{ github.sha }} \
      --status success \
      --duration ${{ steps.deploy.outputs.duration }}
```

### Incident Tracking

```yaml
# proagents.config.yaml
metrics:
  deployment:
    incident_sources:
      - pagerduty
      - opsgenie
      - datadog

    auto_correlate: true
    track_resolution: true
```

---

## Commands

```bash
# View DORA dashboard
pa:metrics dora

# Deployment frequency
pa:metrics deployments --frequency

# Lead time analysis
pa:metrics deployments --lead-time

# Failure rate
pa:metrics deployments --failures

# MTTR analysis
pa:metrics deployments --mttr

# Generate DORA report
pa:metrics dora --report --period quarterly
```

---

## Improvement Strategies

### Improving Deployment Frequency

1. **Smaller Batches**: Deploy smaller changes more often
2. **Feature Flags**: Decouple deployment from release
3. **Automated Testing**: Reduce manual testing gates
4. **Trunk-Based Development**: Reduce branch complexity

### Reducing Lead Time

1. **CI/CD Optimization**: Faster pipelines
2. **Parallel Testing**: Run tests concurrently
3. **Auto-Deployment**: Automatic staging deploys
4. **Fast Reviews**: Smaller PRs, faster reviews

### Lowering Failure Rate

1. **Better Testing**: Comprehensive test coverage
2. **Canary Releases**: Gradual rollouts
3. **Feature Flags**: Quick disable capability
4. **Pre-Deploy Checks**: Automated quality gates

### Reducing MTTR

1. **Better Monitoring**: Faster detection
2. **Runbooks**: Standard recovery procedures
3. **Automated Rollback**: Quick reversion
4. **On-Call Training**: Prepared responders
