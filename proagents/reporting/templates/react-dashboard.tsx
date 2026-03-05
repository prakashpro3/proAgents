/**
 * ProAgents Dashboard Component
 *
 * A customizable dashboard for displaying development metrics.
 * Uses the dashboard-config.json schema for configuration.
 */

import React, { useEffect, useState, useMemo } from 'react';

// Types
interface DashboardConfig {
  dashboard: {
    id: string;
    name: string;
    description: string;
    refreshInterval: number;
    theme: 'light' | 'dark' | 'auto';
  };
  layout: {
    columns: number;
    rowHeight: number;
    margin: [number, number];
  };
  widgets: Widget[];
  dataSources: Record<string, DataSource>;
  filters: Filter[];
}

interface Widget {
  id: string;
  type: 'stat' | 'gauge' | 'line' | 'pie' | 'table' | 'timeline' | 'feed';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
}

interface DataSource {
  type: 'api' | 'websocket' | 'static';
  endpoint: string;
  method?: string;
}

interface Filter {
  id: string;
  type: 'date-range' | 'select' | 'text';
  label: string;
  default?: string;
  options?: string[];
}

// Dashboard Component
export const ProAgentsDashboard: React.FC<{ config: DashboardConfig }> = ({
  config,
}) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize filters with defaults
  useEffect(() => {
    const initialFilters: Record<string, any> = {};
    config.filters.forEach((filter) => {
      if (filter.default) {
        initialFilters[filter.id] = filter.default;
      }
    });
    setFilters(initialFilters);
  }, [config.filters]);

  // Fetch data from data sources
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const results: Record<string, any> = {};

        for (const [key, source] of Object.entries(config.dataSources)) {
          if (source.type === 'api') {
            const response = await fetch(source.endpoint, {
              method: source.method || 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
            results[key] = await response.json();
          }
        }

        setData(results);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up refresh interval
    const interval = setInterval(fetchData, config.dashboard.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [config.dataSources, config.dashboard.refreshInterval, filters]);

  // Calculate grid styles
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${config.layout.columns}, 1fr)`,
    gap: `${config.layout.margin[0]}px`,
    padding: `${config.layout.margin[1]}px`,
  }), [config.layout]);

  if (loading && Object.keys(data).length === 0) {
    return <DashboardSkeleton config={config} />;
  }

  if (error) {
    return <DashboardError message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="proagents-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>{config.dashboard.name}</h1>
          <p>{config.dashboard.description}</p>
        </div>
        <div className="dashboard-filters">
          {config.filters.map((filter) => (
            <FilterControl
              key={filter.id}
              filter={filter}
              value={filters[filter.id]}
              onChange={(value) => setFilters({ ...filters, [filter.id]: value })}
            />
          ))}
        </div>
      </header>

      {/* Widget Grid */}
      <div className="dashboard-grid" style={gridStyle}>
        {config.widgets.map((widget) => (
          <WidgetContainer
            key={widget.id}
            widget={widget}
            data={data}
            rowHeight={config.layout.rowHeight}
          />
        ))}
      </div>
    </div>
  );
};

// Widget Container
const WidgetContainer: React.FC<{
  widget: Widget;
  data: Record<string, any>;
  rowHeight: number;
}> = ({ widget, data, rowHeight }) => {
  const style = {
    gridColumn: `span ${widget.position.w}`,
    gridRow: `span ${widget.position.h}`,
    minHeight: `${widget.position.h * rowHeight}px`,
  };

  const WidgetComponent = getWidgetComponent(widget.type);

  return (
    <div className="widget-container" style={style}>
      <div className="widget-header">
        <h3>{widget.title}</h3>
      </div>
      <div className="widget-content">
        <WidgetComponent widget={widget} data={data} />
      </div>
    </div>
  );
};

// Widget Components
const StatWidget: React.FC<{ widget: Widget; data: Record<string, any> }> = ({
  widget,
  data,
}) => {
  const value = data[widget.config.metric]?.value ?? 0;
  const change = data[widget.config.metric]?.change ?? 0;

  return (
    <div className="stat-widget">
      <div className="stat-value" style={{ color: widget.config.color }}>
        {formatValue(value, widget.config.format)}
      </div>
      {widget.config.comparison && (
        <div className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs previous period
        </div>
      )}
    </div>
  );
};

const GaugeWidget: React.FC<{ widget: Widget; data: Record<string, any> }> = ({
  widget,
  data,
}) => {
  const value = data[widget.config.metric]?.value ?? 0;
  const { min, max, thresholds } = widget.config;
  const percentage = ((value - min) / (max - min)) * 100;

  const color = thresholds.reduce((acc: string, t: { value: number; color: string }) => {
    return value >= t.value ? t.color : acc;
  }, thresholds[0].color);

  return (
    <div className="gauge-widget">
      <svg viewBox="0 0 100 60" className="gauge-svg">
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${percentage * 1.26} 126`}
        />
      </svg>
      <div className="gauge-value">{value}%</div>
    </div>
  );
};

const LineWidget: React.FC<{ widget: Widget; data: Record<string, any> }> = ({
  widget,
  data,
}) => {
  // Simplified line chart - in production, use a library like Recharts
  return (
    <div className="line-widget">
      <div className="chart-placeholder">
        📈 Line Chart: {widget.config.metrics.map((m: any) => m.label).join(', ')}
      </div>
      <div className="chart-legend">
        {widget.config.metrics.map((m: any) => (
          <span key={m.id} style={{ color: m.color }}>
            ● {m.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const PieWidget: React.FC<{ widget: Widget; data: Record<string, any> }> = ({
  widget,
  data,
}) => {
  return (
    <div className="pie-widget">
      <div className="chart-placeholder">🥧 Pie Chart</div>
      <div className="pie-legend">
        {Object.entries(widget.config.colors || {}).map(([key, color]) => (
          <span key={key} style={{ color: color as string }}>
            ● {key}
          </span>
        ))}
      </div>
    </div>
  );
};

const TableWidget: React.FC<{ widget: Widget; data: Record<string, any> }> = ({
  widget,
  data,
}) => {
  const rows = data[widget.config.dataSource] ?? [];

  return (
    <div className="table-widget">
      <table>
        <thead>
          <tr>
            {widget.config.columns.map((col: any) => (
              <th key={col.field} style={{ textAlign: col.align || 'left' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, widget.config.limit).map((row: any, i: number) => (
            <tr key={i}>
              {widget.config.columns.map((col: any) => (
                <td key={col.field} style={{ textAlign: col.align || 'left' }}>
                  {row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TimelineWidget: React.FC<{ widget: Widget; data: Record<string, any> }> = ({
  widget,
  data,
}) => {
  const items = data[widget.config.dataSource] ?? [];

  return (
    <div className="timeline-widget">
      {items.map((item: any, i: number) => (
        <div key={i} className="timeline-item">
          <div className="timeline-marker" />
          <div className="timeline-content">
            <strong>{item.name}</strong>
            <span className="timeline-phase">{item.phase}</span>
            <div className="timeline-progress">
              <div
                className="progress-bar"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FeedWidget: React.FC<{ widget: Widget; data: Record<string, any> }> = ({
  widget,
  data,
}) => {
  const items = data[widget.config.dataSource] ?? [];

  return (
    <div className="feed-widget">
      {items.slice(0, widget.config.limit).map((item: any, i: number) => (
        <div key={i} className="feed-item">
          <span className="feed-icon">{getEventIcon(item.type)}</span>
          <span className="feed-message">{item.message}</span>
          {widget.config.showTimestamp && (
            <span className="feed-time">{formatRelativeTime(item.timestamp)}</span>
          )}
        </div>
      ))}
    </div>
  );
};

// Filter Control
const FilterControl: React.FC<{
  filter: Filter;
  value: any;
  onChange: (value: any) => void;
}> = ({ filter, value, onChange }) => {
  switch (filter.type) {
    case 'date-range':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="filter-select"
        >
          {filter.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case 'select':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All {filter.label}</option>
          {filter.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    default:
      return null;
  }
};

// Helper Components
const DashboardSkeleton: React.FC<{ config: DashboardConfig }> = ({ config }) => (
  <div className="dashboard-skeleton">
    <div className="skeleton-header" />
    <div className="skeleton-grid">
      {config.widgets.map((w) => (
        <div key={w.id} className="skeleton-widget" />
      ))}
    </div>
  </div>
);

const DashboardError: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="dashboard-error">
    <p>{message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
);

// Utilities
function getWidgetComponent(type: string) {
  const components: Record<string, React.FC<any>> = {
    stat: StatWidget,
    gauge: GaugeWidget,
    line: LineWidget,
    pie: PieWidget,
    table: TableWidget,
    timeline: TimelineWidget,
    feed: FeedWidget,
  };
  return components[type] || (() => <div>Unknown widget type</div>);
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case 'number':
      return value.toLocaleString();
    case 'duration':
      return value.toFixed(1);
    case 'percentage':
      return `${value}%`;
    default:
      return String(value);
  }
}

function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    feature_complete: '✅',
    deployment: '🚀',
    pr_merged: '🔀',
    bug_fixed: '🐛',
    test_passed: '✓',
  };
  return icons[type] || '•';
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// CSS (include in your stylesheet)
export const dashboardStyles = `
.proagents-dashboard {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg-primary, #f9fafb);
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: var(--bg-secondary, white);
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.dashboard-title h1 {
  margin: 0;
  font-size: 24px;
}

.dashboard-title p {
  margin: 4px 0 0;
  color: var(--text-secondary, #6b7280);
}

.dashboard-filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 6px;
  background: white;
}

.widget-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.widget-header {
  padding: 16px;
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.widget-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
}

.widget-content {
  padding: 16px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
}

.stat-change {
  font-size: 14px;
  margin-top: 8px;
}

.stat-change.positive { color: #10b981; }
.stat-change.negative { color: #ef4444; }
`;
