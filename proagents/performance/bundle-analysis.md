# Bundle Analysis Guide

Analyze and optimize your application bundle size.

---

## Overview

Bundle analysis helps identify:
- Large dependencies
- Unused code (dead code)
- Duplicate modules
- Optimization opportunities

---

## Analysis Tools

### webpack-bundle-analyzer

```bash
# Install
npm install --save-dev webpack-bundle-analyzer

# Add to webpack config
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
    })
  ]
};

# Or run as CLI
npx webpack-bundle-analyzer stats.json
```

### source-map-explorer

```bash
# Install
npm install --save-dev source-map-explorer

# Generate source maps and analyze
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### bundlephobia

Check package sizes before installing:
- Visit: https://bundlephobia.com/
- Search for package name
- See minified + gzipped size
- See download time estimates

---

## Bundle Size Budgets

### Recommended Budgets

| Category | Target | Warning | Error |
|----------|--------|---------|-------|
| Initial JS | < 100KB | > 150KB | > 200KB |
| Initial CSS | < 50KB | > 75KB | > 100KB |
| Total Initial | < 150KB | > 250KB | > 350KB |
| Per-route chunk | < 50KB | > 75KB | > 100KB |
| Image | < 100KB | > 200KB | > 500KB |

### Configure Bundle Budgets

```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxEntrypointSize: 250000,  // 250KB
    maxAssetSize: 100000,        // 100KB
    hints: 'warning',
    assetFilter: (assetFilename) => {
      return !/\.map$/.test(assetFilename);
    }
  }
};

// For Next.js - next.config.js
module.exports = {
  experimental: {
    bundlePagesExternals: true,
  }
};
```

### CI Budget Check

```yaml
# GitHub Actions
- name: Check bundle size
  run: |
    npm run build
    BUNDLE_SIZE=$(du -sb build/static/js | cut -f1)
    if [ $BUNDLE_SIZE -gt 250000 ]; then
      echo "Bundle too large: $BUNDLE_SIZE bytes"
      exit 1
    fi
```

---

## Common Issues & Fixes

### 1. Large Dependencies

**Problem:** Single large library bloating bundle

```bash
# Identify large packages
npx source-map-explorer build/static/js/main.*.js

# Common culprits:
# - moment.js (~300KB) → use date-fns (~20KB)
# - lodash (~70KB) → use lodash-es + tree shaking
# - charts (~200KB) → lazy load
```

**Fix: Replace with lighter alternatives**

| Heavy | Light Alternative | Savings |
|-------|------------------|---------|
| moment | date-fns | ~280KB |
| lodash | lodash-es | ~50KB |
| axios | ky, fetch | ~15KB |
| uuid | nanoid | ~10KB |
| classnames | clsx | ~5KB |

### 2. No Tree Shaking

**Problem:** Importing entire library

```javascript
// BAD: Imports entire lodash
import _ from 'lodash';
_.map(arr, fn);

// GOOD: Import only what you need
import map from 'lodash/map';
map(arr, fn);

// BETTER: Use native
arr.map(fn);
```

### 3. Duplicate Dependencies

**Problem:** Same package multiple versions

```bash
# Check for duplicates
npm ls lodash
npm dedupe
```

### 4. No Code Splitting

**Problem:** Single large bundle

```javascript
// BAD: Import everything at once
import Dashboard from './Dashboard';
import Settings from './Settings';
import Analytics from './Analytics';

// GOOD: Dynamic imports
const Dashboard = React.lazy(() => import('./Dashboard'));
const Settings = React.lazy(() => import('./Settings'));
const Analytics = React.lazy(() => import('./Analytics'));
```

### 5. Including Dev Dependencies

**Problem:** Development code in production

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,  // Tree shaking
    minimize: true,
  }
};

// Remove console.log in production
plugins: [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
]
```

---

## Optimization Techniques

### 1. Code Splitting

```javascript
// Route-based splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. Dynamic Imports

```javascript
// Load heavy library on demand
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};

// In component
useEffect(() => {
  if (showChart) {
    loadChart().then(Chart => {
      // Use Chart
    });
  }
}, [showChart]);
```

### 3. Tree Shaking

```javascript
// package.json - mark as side-effect free
{
  "sideEffects": false
}

// Or specify files with side effects
{
  "sideEffects": ["*.css", "*.scss"]
}
```

### 4. Compression

```javascript
// webpack.config.js
const CompressionPlugin = require('compression-webpack-plugin');

plugins: [
  new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8,
  })
]
```

### 5. External CDN

```javascript
// webpack.config.js
module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  }
};

// Load from CDN in HTML
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
```

---

## Monitoring Bundle Size

### Track Over Time

```bash
# Generate size report
npx bundlesize

# Compare with previous build
npx bundlewatch
```

### Bundle Size Check Action

```yaml
# .github/workflows/bundle.yml
name: Bundle Size

on: pull_request

jobs:
  bundle:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build
        run: npm ci && npm run build

      - name: Analyze bundle
        uses: preactjs/compressed-size-action@v2
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          pattern: "./build/static/js/*.js"
```

---

## Bundle Analysis Report

```markdown
# Bundle Analysis Report

**Date:** [YYYY-MM-DD]
**Build:** [build-id]

## Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total JS | 250KB | 180KB | -28% |
| Main chunk | 150KB | 100KB | -33% |
| Vendor chunk | 100KB | 80KB | -20% |
| CSS | 45KB | 40KB | -11% |

## Largest Dependencies

| Package | Size | % of Bundle |
|---------|------|-------------|
| react-dom | 40KB | 22% |
| lodash | 25KB | 14% |
| axios | 15KB | 8% |

## Recommendations

1. [ ] Replace lodash with native methods
2. [ ] Lazy load Chart component
3. [ ] Enable gzip compression
4. [ ] Add route-based code splitting
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:bundle-analyze` | Analyze bundle |
| `pa:bundle-report` | Generate report |
| `pa:bundle-optimize` | Optimization suggestions |
