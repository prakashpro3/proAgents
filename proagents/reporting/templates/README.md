# Dashboard Templates

Ready-to-use templates for building ProAgents dashboards.

---

## Available Templates

| Template | Description | Format |
|----------|-------------|--------|
| [dashboard-config.json](./dashboard-config.json) | Dashboard configuration schema | JSON |
| [react-dashboard.tsx](./react-dashboard.tsx) | React dashboard component | TSX |
| [metrics-queries.md](./metrics-queries.md) | SQL/API queries for metrics | Markdown |
| [widgets.md](./widgets.md) | Widget configuration guide | Markdown |

---

## Quick Start

### 1. Copy Configuration

```bash
cp proagents/reporting/templates/dashboard-config.json \
   your-project/dashboard-config.json
```

### 2. Customize Metrics

Edit the configuration to include your desired metrics and widgets.

### 3. Use React Component

```tsx
import { ProAgentsDashboard } from './ProAgentsDashboard';
import config from './dashboard-config.json';

function App() {
  return <ProAgentsDashboard config={config} />;
}
```

---

## Dashboard Types

### Development Velocity Dashboard
Track feature completion, bug fixes, and team productivity.

### Code Quality Dashboard
Monitor test coverage, lint errors, and technical debt.

### Deployment Dashboard
Track deployments, rollbacks, and environment health.

### Team Activity Dashboard
Monitor PR reviews, code ownership, and collaboration.
