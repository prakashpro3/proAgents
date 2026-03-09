# Metrics Queries

SQL and API queries for dashboard metrics.

---

## Overview

These queries can be used to populate ProAgents dashboards. Adapt them to your database schema and API structure.

---

## Feature Metrics

### Features Completed (Count)

```sql
-- PostgreSQL
SELECT COUNT(*) as count
FROM features
WHERE status = 'completed'
  AND completed_at >= NOW() - INTERVAL '30 days';
```

```typescript
// API Endpoint
app.get('/api/metrics/features/completed', async (req, res) => {
  const { timeRange = '30d' } = req.query;
  const days = parseInt(timeRange);

  const count = await db.feature.count({
    where: {
      status: 'completed',
      completedAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    },
  });

  const previousCount = await db.feature.count({
    where: {
      status: 'completed',
      completedAt: {
        gte: new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000),
        lt: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    },
  });

  const change = previousCount > 0
    ? ((count - previousCount) / previousCount) * 100
    : 0;

  res.json({ value: count, change: Math.round(change) });
});
```

### Average Feature Completion Time

```sql
SELECT AVG(
  EXTRACT(EPOCH FROM (completed_at - created_at)) / 86400
) as avg_days
FROM features
WHERE status = 'completed'
  AND completed_at >= NOW() - INTERVAL '30 days';
```

```typescript
// API Endpoint
app.get('/api/metrics/features/avg-time', async (req, res) => {
  const features = await db.feature.findMany({
    where: {
      status: 'completed',
      completedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    select: { createdAt: true, completedAt: true },
  });

  const totalDays = features.reduce((sum, f) => {
    const days = (f.completedAt.getTime() - f.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return sum + days;
  }, 0);

  const avgDays = features.length > 0 ? totalDays / features.length : 0;
  res.json({ value: Math.round(avgDays * 10) / 10 });
});
```

### Features by Phase

```sql
SELECT phase, COUNT(*) as count
FROM features
WHERE status = 'active'
GROUP BY phase
ORDER BY count DESC;
```

```typescript
// API Endpoint
app.get('/api/metrics/features/by-phase', async (req, res) => {
  const result = await db.feature.groupBy({
    by: ['phase'],
    where: { status: 'active' },
    _count: { phase: true },
  });

  const data = result.reduce((acc, r) => {
    acc[r.phase] = r._count.phase;
    return acc;
  }, {} as Record<string, number>);

  res.json(data);
});
```

---

## Bug Metrics

### Bugs Fixed (Count)

```sql
SELECT COUNT(*) as count
FROM bugs
WHERE status = 'fixed'
  AND fixed_at >= NOW() - INTERVAL '30 days';
```

### Average Bug Fix Time

```sql
SELECT AVG(
  EXTRACT(EPOCH FROM (fixed_at - created_at)) / 3600
) as avg_hours
FROM bugs
WHERE status = 'fixed'
  AND fixed_at >= NOW() - INTERVAL '30 days';
```

### Bugs by Severity

```sql
SELECT severity, COUNT(*) as count
FROM bugs
WHERE status = 'open'
GROUP BY severity
ORDER BY
  CASE severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END;
```

---

## Quality Metrics

### Test Coverage

```sql
-- From latest coverage report
SELECT coverage_percentage
FROM coverage_reports
ORDER BY created_at DESC
LIMIT 1;
```

```typescript
// API Endpoint (reads from coverage file)
app.get('/api/metrics/quality/coverage', async (req, res) => {
  try {
    const coverageFile = await fs.readFile('./coverage/coverage-summary.json', 'utf-8');
    const coverage = JSON.parse(coverageFile);
    const percentage = coverage.total.lines.pct;
    res.json({ value: percentage });
  } catch {
    res.json({ value: 0, error: 'Coverage report not found' });
  }
});
```

### Lint Errors

```sql
SELECT COUNT(*) as count
FROM lint_reports
WHERE created_at >= NOW() - INTERVAL '24 hours'
  AND severity = 'error';
```

### Technical Debt Items

```sql
SELECT COUNT(*) as count
FROM technical_debt
WHERE status = 'open';
```

---

## Team Metrics

### Team Contributions

```sql
SELECT
  u.name as developer,
  COUNT(DISTINCT f.id) FILTER (WHERE f.status = 'completed') as features,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'fixed') as bugs,
  COUNT(DISTINCT r.id) as reviews
FROM users u
LEFT JOIN features f ON f.assignee_id = u.id
  AND f.completed_at >= NOW() - INTERVAL '30 days'
LEFT JOIN bugs b ON b.assignee_id = u.id
  AND b.fixed_at >= NOW() - INTERVAL '30 days'
LEFT JOIN reviews r ON r.reviewer_id = u.id
  AND r.created_at >= NOW() - INTERVAL '30 days'
WHERE u.role = 'developer'
GROUP BY u.id, u.name
ORDER BY features DESC;
```

```typescript
// API Endpoint
app.get('/api/metrics/team/contributions', async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const users = await db.user.findMany({
    where: { role: 'developer' },
    include: {
      features: {
        where: { status: 'completed', completedAt: { gte: thirtyDaysAgo } },
      },
      bugs: {
        where: { status: 'fixed', fixedAt: { gte: thirtyDaysAgo } },
      },
      reviews: {
        where: { createdAt: { gte: thirtyDaysAgo } },
      },
    },
  });

  const contributions = users.map((u) => ({
    developer: u.name,
    features: u.features.length,
    bugs: u.bugs.length,
    reviews: u.reviews.length,
  }));

  res.json(contributions.sort((a, b) => b.features - a.features));
});
```

---

## Velocity Metrics

### Weekly Velocity

```sql
SELECT
  DATE_TRUNC('week', completed_at) as week,
  COUNT(*) FILTER (WHERE type = 'feature') as features,
  COUNT(*) FILTER (WHERE type = 'bug') as bugs
FROM (
  SELECT 'feature' as type, completed_at FROM features WHERE status = 'completed'
  UNION ALL
  SELECT 'bug' as type, fixed_at as completed_at FROM bugs WHERE status = 'fixed'
) combined
WHERE completed_at >= NOW() - INTERVAL '90 days'
GROUP BY week
ORDER BY week;
```

```typescript
// API Endpoint
app.get('/api/metrics/velocity', async (req, res) => {
  const { timeRange = '90d', granularity = 'week' } = req.query;

  // Get features and bugs grouped by week
  const features = await db.$queryRaw`
    SELECT DATE_TRUNC('week', completed_at) as week, COUNT(*) as count
    FROM features
    WHERE status = 'completed'
      AND completed_at >= NOW() - INTERVAL '90 days'
    GROUP BY week
    ORDER BY week
  `;

  const bugs = await db.$queryRaw`
    SELECT DATE_TRUNC('week', fixed_at) as week, COUNT(*) as count
    FROM bugs
    WHERE status = 'fixed'
      AND fixed_at >= NOW() - INTERVAL '90 days'
    GROUP BY week
    ORDER BY week
  `;

  res.json({ features, bugs });
});
```

---

## Deployment Metrics

### Deployments Count

```sql
SELECT
  environment,
  COUNT(*) as deployments,
  COUNT(*) FILTER (WHERE status = 'success') as successful,
  COUNT(*) FILTER (WHERE status = 'failed') as failed
FROM deployments
WHERE deployed_at >= NOW() - INTERVAL '30 days'
GROUP BY environment;
```

### Deployment Frequency

```sql
SELECT
  DATE_TRUNC('day', deployed_at) as day,
  COUNT(*) as count
FROM deployments
WHERE environment = 'production'
  AND deployed_at >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;
```

### Mean Time to Recovery (MTTR)

```sql
SELECT AVG(
  EXTRACT(EPOCH FROM (resolved_at - detected_at)) / 60
) as avg_minutes
FROM incidents
WHERE resolved_at IS NOT NULL
  AND resolved_at >= NOW() - INTERVAL '90 days';
```

---

## Activity Feed

### Recent Activity

```sql
SELECT
  'feature_complete' as type,
  CONCAT('Feature completed: ', name) as message,
  completed_at as timestamp
FROM features
WHERE status = 'completed'
  AND completed_at >= NOW() - INTERVAL '7 days'

UNION ALL

SELECT
  'deployment' as type,
  CONCAT('Deployed to ', environment) as message,
  deployed_at as timestamp
FROM deployments
WHERE deployed_at >= NOW() - INTERVAL '7 days'

UNION ALL

SELECT
  'pr_merged' as type,
  CONCAT('PR merged: ', title) as message,
  merged_at as timestamp
FROM pull_requests
WHERE merged_at >= NOW() - INTERVAL '7 days'

ORDER BY timestamp DESC
LIMIT 20;
```

```typescript
// API Endpoint
app.get('/api/activity/feed', async (req, res) => {
  const { limit = 20 } = req.query;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [features, deployments, prs] = await Promise.all([
    db.feature.findMany({
      where: { status: 'completed', completedAt: { gte: sevenDaysAgo } },
      select: { name: true, completedAt: true },
    }),
    db.deployment.findMany({
      where: { deployedAt: { gte: sevenDaysAgo } },
      select: { environment: true, deployedAt: true },
    }),
    db.pullRequest.findMany({
      where: { mergedAt: { gte: sevenDaysAgo } },
      select: { title: true, mergedAt: true },
    }),
  ]);

  const activities = [
    ...features.map((f) => ({
      type: 'feature_complete',
      message: `Feature completed: ${f.name}`,
      timestamp: f.completedAt,
    })),
    ...deployments.map((d) => ({
      type: 'deployment',
      message: `Deployed to ${d.environment}`,
      timestamp: d.deployedAt,
    })),
    ...prs.map((p) => ({
      type: 'pr_merged',
      message: `PR merged: ${p.title}`,
      timestamp: p.mergedAt,
    })),
  ];

  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  res.json(activities.slice(0, parseInt(limit as string)));
});
```
