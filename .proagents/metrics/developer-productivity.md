# Developer Productivity Metrics

Track velocity, throughput, and efficiency across development workflows.

---

## Prompt Template

```
Analyze developer productivity metrics for this project:

Project: {project_name}
Period: {date_range}
Team Size: {team_size}

Available Data:
- Git commits: {commit_data}
- Feature completions: {feature_data}
- PR statistics: {pr_data}

Calculate and analyze:
1. Cycle time (start to completion)
2. Throughput (features per sprint)
3. Lead time (request to delivery)
4. Code review turnaround
5. First-time fix rate

Provide:
- Current metrics with trends
- Comparison to targets
- Bottleneck identification
- Improvement recommendations
```

---

## Key Metrics

### Cycle Time

Time from work started to work completed.

```yaml
cycle_time:
  measurement:
    start: "status:in_progress"
    end: "status:completed"

  breakdown:
    development: "in_progress → code_review"
    review: "code_review → approved"
    deployment: "approved → deployed"

  targets:
    small_feature: "< 2 days"
    medium_feature: "< 5 days"
    large_feature: "< 10 days"
```

**Collection:**
```typescript
interface CycleTimeMetric {
  featureId: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  breakdown: {
    development: number;
    review: number;
    testing: number;
    deployment: number;
  };
}

function calculateCycleTime(feature: Feature): CycleTimeMetric {
  const phases = feature.getPhaseTransitions();

  return {
    featureId: feature.id,
    startDate: phases.started,
    endDate: phases.completed,
    totalDays: daysBetween(phases.started, phases.completed),
    breakdown: {
      development: daysBetween(phases.started, phases.inReview),
      review: daysBetween(phases.inReview, phases.approved),
      testing: daysBetween(phases.approved, phases.tested),
      deployment: daysBetween(phases.tested, phases.completed),
    },
  };
}
```

---

### Throughput

Features or work items completed per time period.

```yaml
throughput:
  granularity: "weekly"

  categories:
    features: "type:feature"
    bugs: "type:bug"
    improvements: "type:improvement"

  weighting:
    small: 1
    medium: 2
    large: 5

  targets:
    per_developer_week: "2-4 story points"
    team_sprint: "based on capacity"
```

**Visualization:**
```
Throughput - Last 12 Weeks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 1:  ████████████░░░░░░░░ 12
Week 2:  ██████████░░░░░░░░░░ 10
Week 3:  ████████████████░░░░ 16
Week 4:  ██████████████░░░░░░ 14
Week 5:  ████████████░░░░░░░░ 12
...
Average: 13 story points/week
Trend:   ↑ 8% improvement
```

---

### Lead Time

Time from request/idea to production deployment.

```yaml
lead_time:
  phases:
    backlog: "Waiting in backlog"
    prioritized: "Scheduled for development"
    in_progress: "Active development"
    review: "Code review"
    testing: "QA/Testing"
    staging: "Staged for release"
    production: "Live"

  measurement:
    start: "issue_created"
    end: "deployed_to_production"

  targets:
    bug_fix: "< 3 days"
    feature: "< 2 weeks"
    epic: "< 1 month"
```

**Analysis:**
```typescript
interface LeadTimeAnalysis {
  averageLeadTime: number;
  medianLeadTime: number;
  percentile90: number;
  byPhase: Record<string, number>;
  bottlenecks: string[];
}

function analyzeLeadTime(features: Feature[]): LeadTimeAnalysis {
  const leadTimes = features.map(f => f.getLeadTime());

  return {
    averageLeadTime: average(leadTimes),
    medianLeadTime: median(leadTimes),
    percentile90: percentile(leadTimes, 90),
    byPhase: calculatePhaseAverages(features),
    bottlenecks: identifyBottlenecks(features),
  };
}
```

---

### Code Review Metrics

```yaml
code_review:
  metrics:
    turnaround_time: "Time to first review"
    review_cycles: "Number of review rounds"
    review_depth: "Comments per PR"
    approval_rate: "First-review approval rate"

  targets:
    turnaround: "< 4 hours"
    cycles: "< 2 rounds"
    approval_rate: "> 70%"
```

**Dashboard:**
```
Code Review Performance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avg Turnaround:    3.2 hours ✅
Avg Cycles:        1.8 rounds ✅
First-Pass Rate:   72% ✅
Review Coverage:   95% ✅

Top Reviewers (This Week):
1. @alice - 12 reviews, 2.1h avg
2. @bob   - 8 reviews, 3.5h avg
3. @carol - 7 reviews, 4.2h avg
```

---

### Work in Progress (WIP)

```yaml
wip:
  limits:
    per_developer: 2
    per_team: "team_size * 1.5"

  tracking:
    in_progress: "status:in_progress"
    blocked: "status:blocked"
    in_review: "status:review"

  alerts:
    wip_exceeded: "warning"
    blocked_item_age: "24 hours"
```

**Monitoring:**
```
WIP Status - Team Alpha
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Developer    In Progress   Limit   Status
@alice       2            2       ✅ At limit
@bob         3            2       ⚠️ Over limit
@carol       1            2       ✅ Under limit

Blocked Items (3):
- FEAT-123: Waiting for API (2 days) ⚠️
- BUG-456: Needs clarification (1 day)
- FEAT-789: Dependency blocked (3 days) ⚠️
```

---

## Collection Methods

### Git-Based Collection

```typescript
async function collectGitMetrics(repo: string): Promise<GitMetrics> {
  const commits = await getCommits(repo, { since: '30 days ago' });
  const prs = await getPullRequests(repo, { state: 'all' });

  return {
    commitFrequency: calculateCommitFrequency(commits),
    prMergeTime: calculatePRMergeTime(prs),
    authorDistribution: calculateAuthorDistribution(commits),
    fileChurnRate: calculateFileChurn(commits),
  };
}
```

### Issue Tracker Integration

```typescript
async function collectIssueMetrics(project: string): Promise<IssueMetrics> {
  const issues = await getIssues(project, { period: '30 days' });

  return {
    createdCount: issues.filter(i => i.isNew).length,
    resolvedCount: issues.filter(i => i.isResolved).length,
    averageResolutionTime: calculateAvgResolution(issues),
    byCategory: groupByCategory(issues),
    byPriority: groupByPriority(issues),
  };
}
```

---

## Reporting

### Weekly Productivity Report

```markdown
# Developer Productivity Report
**Period:** {{start_date}} - {{end_date}}
**Team:** {{team_name}}

## Summary
| Metric | Current | Previous | Change |
|--------|---------|----------|--------|
| Cycle Time | {{cycle_time}} | {{prev_cycle_time}} | {{cycle_change}} |
| Throughput | {{throughput}} | {{prev_throughput}} | {{throughput_change}} |
| WIP Avg | {{wip_avg}} | {{prev_wip}} | {{wip_change}} |

## Highlights
{{#each highlights}}
- {{this}}
{{/each}}

## Bottlenecks Identified
{{#each bottlenecks}}
- **{{this.area}}**: {{this.description}}
  - Impact: {{this.impact}}
  - Recommendation: {{this.recommendation}}
{{/each}}

## Individual Metrics
| Developer | Completed | Cycle Time | Reviews |
|-----------|-----------|------------|---------|
{{#each developers}}
| {{this.name}} | {{this.completed}} | {{this.cycleTime}} | {{this.reviews}} |
{{/each}}
```

---

## Improvement Strategies

### Reducing Cycle Time

1. **Smaller Work Items**: Break features into smaller deliverables
2. **Pair Programming**: Reduce review bottlenecks
3. **CI/CD Optimization**: Faster feedback loops
4. **Clear Requirements**: Reduce rework

### Increasing Throughput

1. **Reduce WIP**: Focus on completion over starting
2. **Remove Blockers**: Proactive dependency management
3. **Automation**: Reduce manual tasks
4. **Documentation**: Reduce knowledge bottlenecks

### Improving Lead Time

1. **Backlog Grooming**: Ready-to-start items
2. **Fast Prioritization**: Quick decision making
3. **Parallel Workflows**: Overlap where possible
4. **Continuous Deployment**: Reduce release batching

---

## Commands

```bash
# View productivity dashboard
pa:metrics productivity

# Analyze specific period
pa:metrics productivity --from 2024-01-01 --to 2024-01-31

# Compare periods
pa:metrics productivity --compare "this-sprint" "last-sprint"

# Export data
pa:metrics productivity --export json

# View individual metrics
pa:metrics productivity --developer @alice
```
