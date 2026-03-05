# Web Vitals Performance Guide

Monitor and optimize Core Web Vitals for better user experience.

---

## Core Web Vitals

### LCP - Largest Contentful Paint

**What:** Time until largest content element is visible
**Target:** < 2.5 seconds
**Measures:** Loading performance

### FID - First Input Delay

**What:** Time from first interaction to browser response
**Target:** < 100 milliseconds
**Measures:** Interactivity

### CLS - Cumulative Layout Shift

**What:** Visual stability (unexpected layout shifts)
**Target:** < 0.1
**Measures:** Visual stability

---

## Measuring Web Vitals

### Using web-vitals Library

```javascript
// Install
npm install web-vitals

// Usage
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
  // Send to analytics service
  analytics.track('Web Vitals', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,  // 'good', 'needs-improvement', 'poor'
    id: metric.id,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getFCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### React Integration

```javascript
// In React app
import { useEffect } from 'react';
import { getCLS, getFID, getLCP } from 'web-vitals';

function App() {
  useEffect(() => {
    getCLS(console.log);
    getFID(console.log);
    getLCP(console.log);
  }, []);

  return <MainApp />;
}

// Or in reportWebVitals.js (Create React App)
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
```

### Lighthouse

```bash
# CLI
npm install -g lighthouse
lighthouse https://example.com --output html --output-path report.html

# Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Generate report"
```

---

## Optimizing LCP

### Common LCP Elements

- `<img>` elements
- `<video>` poster images
- Elements with background-image
- Block-level text elements

### Optimization Techniques

#### 1. Optimize Images

```html
<!-- Use modern formats -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="...">
</picture>

<!-- Responsive images -->
<img
  srcset="small.jpg 300w,
          medium.jpg 600w,
          large.jpg 1200w"
  sizes="(max-width: 600px) 300px,
         (max-width: 1200px) 600px,
         1200px"
  src="medium.jpg"
  alt="..."
>

<!-- Preload LCP image -->
<link rel="preload" as="image" href="hero-image.webp">
```

#### 2. Optimize Server Response

```javascript
// Enable caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
});

// Use CDN
// Configure CDN for static assets

// Enable compression
const compression = require('compression');
app.use(compression());
```

#### 3. Preload Critical Resources

```html
<head>
  <!-- Preload critical CSS -->
  <link rel="preload" href="critical.css" as="style">

  <!-- Preload fonts -->
  <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Preconnect to origins -->
  <link rel="preconnect" href="https://api.example.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">
</head>
```

---

## Optimizing FID

### Optimization Techniques

#### 1. Break Up Long Tasks

```javascript
// BAD: Long blocking task
function processData(data) {
  // 1000ms of work
  data.forEach(item => heavyComputation(item));
}

// GOOD: Break into chunks
async function processData(data) {
  const chunks = chunkArray(data, 100);

  for (const chunk of chunks) {
    chunk.forEach(item => heavyComputation(item));
    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
```

#### 2. Use Web Workers

```javascript
// Heavy computation in worker
const worker = new Worker('worker.js');

worker.postMessage({ data: largeDataSet });
worker.onmessage = (event) => {
  console.log('Processed:', event.data);
};

// worker.js
self.onmessage = (event) => {
  const result = heavyComputation(event.data);
  self.postMessage(result);
};
```

#### 3. Defer Non-Critical JavaScript

```html
<!-- Defer non-critical scripts -->
<script src="analytics.js" defer></script>
<script src="non-critical.js" defer></script>

<!-- Async for independent scripts -->
<script src="independent.js" async></script>
```

#### 4. Lazy Load Components

```javascript
// React
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## Optimizing CLS

### Common Causes

1. Images without dimensions
2. Ads/embeds without reserved space
3. Dynamically injected content
4. Web fonts causing FOIT/FOUT

### Optimization Techniques

#### 1. Always Set Image Dimensions

```html
<!-- Always specify width and height -->
<img src="image.jpg" width="800" height="600" alt="...">

<!-- Or use aspect-ratio -->
<style>
  .image-container {
    aspect-ratio: 16 / 9;
  }
</style>
```

#### 2. Reserve Space for Dynamic Content

```css
/* Reserve space for ads */
.ad-container {
  min-height: 250px;
}

/* Skeleton for loading content */
.skeleton {
  min-height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
```

#### 3. Optimize Font Loading

```css
/* Use font-display */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}

/* Or use optional for non-critical fonts */
@font-face {
  font-family: 'NiceToHave';
  src: url('font.woff2') format('woff2');
  font-display: optional;
}
```

```html
<!-- Preload critical fonts -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

#### 4. Avoid Inserting Content Above Existing

```javascript
// BAD: Insert at top
container.prepend(newElement);

// GOOD: Insert below fold or with reserved space
reservedSpace.appendChild(newElement);
```

---

## Performance Budget

```javascript
// performance-budget.json
{
  "budgets": [
    {
      "resourceSizes": [
        { "resourceType": "script", "budget": 150 },
        { "resourceType": "image", "budget": 300 },
        { "resourceType": "stylesheet", "budget": 50 },
        { "resourceType": "total", "budget": 500 }
      ],
      "timings": [
        { "metric": "largest-contentful-paint", "budget": 2500 },
        { "metric": "first-input-delay", "budget": 100 },
        { "metric": "cumulative-layout-shift", "budget": 0.1 },
        { "metric": "time-to-interactive", "budget": 3500 }
      ]
    }
  ]
}
```

---

## Monitoring Dashboard

```markdown
# Web Vitals Dashboard

## Current Performance

| Metric | P75 Value | Target | Status |
|--------|-----------|--------|--------|
| LCP | 2.1s | < 2.5s | ✅ Good |
| FID | 80ms | < 100ms | ✅ Good |
| CLS | 0.15 | < 0.1 | ⚠️ Needs Improvement |
| FCP | 1.5s | < 1.8s | ✅ Good |
| TTFB | 300ms | < 600ms | ✅ Good |

## Trends (Last 30 Days)

LCP: ████████░░ Improved 15%
FID: ██████████ Stable
CLS: ██████░░░░ Degraded 5%

## Top Issues

1. CLS on product pages (0.2)
   - Cause: Images without dimensions
   - Fix: Add width/height attributes

2. LCP on homepage (2.8s)
   - Cause: Large hero image
   - Fix: Optimize and preload image
```

---

## CI/CD Integration

```yaml
# .github/workflows/performance.yml
name: Performance Check

on: pull_request

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://example.com/
            https://example.com/products
          budgetPath: ./performance-budget.json
          uploadArtifacts: true

      - name: Check Web Vitals
        run: |
          if [ "$LCP" -gt 2500 ]; then
            echo "LCP exceeds budget"
            exit 1
          fi
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:perf-vitals` | Check Web Vitals |
| `pa:perf-lcp` | Analyze LCP |
| `pa:perf-cls` | Analyze CLS |
| `pa:perf-fid` | Analyze FID |
| `pa:perf-report` | Generate performance report |
