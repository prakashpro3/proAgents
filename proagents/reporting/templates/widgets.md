# Dashboard Widget Configuration Guide

Complete reference for configuring ProAgents dashboard widgets.

---

## Available Widget Types

| Type | Description | Use Case |
|------|-------------|----------|
| `stat` | Single metric with optional comparison | KPIs, counts |
| `gauge` | Circular progress indicator | Coverage, completion % |
| `line` | Time-series line chart | Trends, velocity |
| `pie` | Distribution pie chart | Breakdowns, categories |
| `table` | Tabular data display | Rankings, lists |
| `timeline` | Progress timeline | Feature progress |
| `feed` | Activity feed | Recent events |

---

## Widget Configuration Schema

### Common Properties

All widgets share these properties:

```json
{
  "id": "unique-widget-id",
  "type": "stat | gauge | line | pie | table | timeline | feed",
  "title": "Widget Title",
  "position": {
    "x": 0,      // Grid column (0-11)
    "y": 0,      // Grid row
    "w": 3,      // Width in columns
    "h": 2       // Height in rows
  },
  "config": {
    // Type-specific configuration
  }
}
```

---

## Stat Widget

Displays a single metric with optional period comparison.

### Configuration

```json
{
  "type": "stat",
  "title": "Features Completed",
  "config": {
    "metric": "features.completed.count",
    "timeRange": "30d",
    "comparison": "previous_period",
    "format": "number",
    "color": "green",
    "suffix": "",
    "prefix": ""
  }
}
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `metric` | string | Data source metric key |
| `timeRange` | string | Time range (7d, 30d, 90d, 1y) |
| `comparison` | string | `previous_period` or `null` |
| `format` | string | `number`, `percentage`, `duration`, `currency` |
| `color` | string | CSS color or theme color name |
| `suffix` | string | Text after value (e.g., "days") |
| `prefix` | string | Text before value (e.g., "$") |

### Example Configurations

```json
// Feature count
{
  "metric": "features.completed.count",
  "format": "number",
  "comparison": "previous_period"
}

// Average time
{
  "metric": "features.avg_completion_time",
  "format": "duration",
  "suffix": "days"
}

// Revenue
{
  "metric": "revenue.total",
  "format": "currency",
  "prefix": "$"
}
```

---

## Gauge Widget

Circular progress indicator with thresholds.

### Configuration

```json
{
  "type": "gauge",
  "title": "Test Coverage",
  "config": {
    "metric": "quality.test_coverage",
    "min": 0,
    "max": 100,
    "thresholds": [
      { "value": 60, "color": "red" },
      { "value": 80, "color": "yellow" },
      { "value": 100, "color": "green" }
    ],
    "showValue": true,
    "showTarget": true,
    "target": 80
  }
}
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `metric` | string | Data source metric key |
| `min` | number | Minimum value |
| `max` | number | Maximum value |
| `thresholds` | array | Color thresholds |
| `showValue` | boolean | Display current value |
| `showTarget` | boolean | Display target line |
| `target` | number | Target value |

---

## Line Widget

Time-series chart for trend visualization.

### Configuration

```json
{
  "type": "line",
  "title": "Velocity Trend",
  "config": {
    "metrics": [
      { "id": "features", "label": "Features", "color": "#3B82F6" },
      { "id": "bugs", "label": "Bug Fixes", "color": "#10B981" }
    ],
    "timeRange": "90d",
    "granularity": "week",
    "showTrend": true,
    "showLegend": true,
    "showGrid": true,
    "stacked": false,
    "fill": false
  }
}
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `metrics` | array | List of metrics to display |
| `timeRange` | string | Time range |
| `granularity` | string | `day`, `week`, `month` |
| `showTrend` | boolean | Show trend line |
| `showLegend` | boolean | Show legend |
| `showGrid` | boolean | Show grid lines |
| `stacked` | boolean | Stack multiple series |
| `fill` | boolean | Fill area under line |

### Metric Object

```json
{
  "id": "metric_id",
  "label": "Display Name",
  "color": "#HEX",
  "type": "line | bar",
  "yAxis": "left | right"
}
```

---

## Pie Widget

Distribution/breakdown visualization.

### Configuration

```json
{
  "type": "pie",
  "title": "Features by Phase",
  "config": {
    "metric": "features.by_phase",
    "colors": {
      "analysis": "#3B82F6",
      "implementation": "#10B981",
      "testing": "#F59E0B",
      "review": "#8B5CF6",
      "deployment": "#EC4899"
    },
    "showLegend": true,
    "showLabels": true,
    "showPercentages": true,
    "donut": false,
    "donutWidth": 60
  }
}
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `metric` | string | Data source metric key |
| `colors` | object | Color map for segments |
| `showLegend` | boolean | Show legend |
| `showLabels` | boolean | Show segment labels |
| `showPercentages` | boolean | Show percentage values |
| `donut` | boolean | Render as donut chart |
| `donutWidth` | number | Donut ring width (if donut) |

---

## Table Widget

Tabular data display with sorting.

### Configuration

```json
{
  "type": "table",
  "title": "Team Contributions",
  "config": {
    "dataSource": "team.contributions",
    "columns": [
      { "field": "developer", "label": "Developer", "align": "left" },
      { "field": "features", "label": "Features", "align": "right", "sortable": true },
      { "field": "bugs", "label": "Bugs Fixed", "align": "right", "sortable": true },
      { "field": "reviews", "label": "Reviews", "align": "right", "sortable": true }
    ],
    "sortBy": "features",
    "sortOrder": "desc",
    "limit": 10,
    "showPagination": false,
    "highlightTop": 3,
    "rowHeight": "compact"
  }
}
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `dataSource` | string | Data source key |
| `columns` | array | Column definitions |
| `sortBy` | string | Default sort column |
| `sortOrder` | string | `asc` or `desc` |
| `limit` | number | Maximum rows |
| `showPagination` | boolean | Show pagination |
| `highlightTop` | number | Highlight top N rows |
| `rowHeight` | string | `compact`, `normal`, `relaxed` |

### Column Object

```json
{
  "field": "field_name",
  "label": "Display Label",
  "align": "left | center | right",
  "sortable": true,
  "width": "100px",
  "format": "number | date | currency"
}
```

---

## Timeline Widget

Feature/task progress timeline.

### Configuration

```json
{
  "type": "timeline",
  "title": "Feature Progress",
  "config": {
    "dataSource": "features.active",
    "groupBy": "status",
    "showMilestones": true,
    "fields": ["name", "phase", "progress", "assignee"],
    "showProgress": true,
    "colorBy": "status",
    "colors": {
      "in_progress": "#3B82F6",
      "blocked": "#EF4444",
      "review": "#F59E0B",
      "done": "#10B981"
    }
  }
}
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `dataSource` | string | Data source key |
| `groupBy` | string | Grouping field |
| `showMilestones` | boolean | Show milestone markers |
| `fields` | array | Fields to display |
| `showProgress` | boolean | Show progress bars |
| `colorBy` | string | Field for coloring |
| `colors` | object | Color map |

---

## Feed Widget

Activity/event feed.

### Configuration

```json
{
  "type": "feed",
  "title": "Recent Activity",
  "config": {
    "dataSource": "activity.feed",
    "limit": 10,
    "showTimestamp": true,
    "showActor": true,
    "showIcon": true,
    "eventTypes": ["feature_complete", "deployment", "pr_merged"],
    "groupByDate": false,
    "dateFormat": "relative",
    "iconMap": {
      "feature_complete": "✅",
      "deployment": "🚀",
      "pr_merged": "🔀",
      "bug_fixed": "🐛"
    }
  }
}
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `dataSource` | string | Data source key |
| `limit` | number | Maximum items |
| `showTimestamp` | boolean | Show timestamps |
| `showActor` | boolean | Show who performed action |
| `showIcon` | boolean | Show event icons |
| `eventTypes` | array | Filter to specific types |
| `groupByDate` | boolean | Group by date |
| `dateFormat` | string | `relative` or date format |
| `iconMap` | object | Event type to icon mapping |

---

## Custom Widget

For specialized visualizations.

### Configuration

```json
{
  "type": "custom",
  "title": "Custom Widget",
  "config": {
    "component": "CustomWidgetComponent",
    "props": {
      "customProp1": "value1",
      "customProp2": "value2"
    }
  }
}
```

---

## Data Sources

Widgets reference data sources defined in the dashboard config:

```json
{
  "dataSources": {
    "features.completed.count": {
      "type": "api",
      "endpoint": "/api/metrics/features/completed",
      "method": "GET",
      "refresh": 300
    },
    "activity.feed": {
      "type": "websocket",
      "endpoint": "wss://api.example.com/activity"
    },
    "static.data": {
      "type": "static",
      "data": { "value": 42 }
    }
  }
}
```

---

## Layout Grid

The dashboard uses a 12-column grid system:

```
┌─────────────────────────────────────────────────────────┐
│ 0   1   2   3   4   5   6   7   8   9   10  11         │
├─────────────────────────────────────────────────────────┤
│ [  Widget w=3  ] [  Widget w=3  ] [  Widget w=3  ] ... │
│ [              Widget w=6               ] [     ]       │
│ [                     Widget w=12                     ] │
└─────────────────────────────────────────────────────────┘
```

Position widgets using `x`, `y`, `w`, `h`:
- `x`: Starting column (0-11)
- `y`: Starting row
- `w`: Width in columns (1-12)
- `h`: Height in rows
