# Performance Monitoring

Bundle analysis, runtime metrics, and load testing.

---

## Overview

Track and optimize application performance throughout development.

## Documentation

| Document | Description |
|----------|-------------|
| [Bundle Analysis](./bundle-analysis.md) | JavaScript bundle size optimization |
| [Web Vitals](./web-vitals.md) | Core Web Vitals monitoring |
| [Runtime Metrics](./runtime-metrics.md) | Application performance metrics |
| [Load Testing](./load-testing.md) | Stress testing and benchmarks |

## Quick Start

```bash
# Analyze bundle size
proagents perf bundle

# Check Web Vitals
proagents perf vitals

# Run load test
proagents perf load-test --users 100
```

## Key Metrics

| Metric | Target | Tool |
|--------|--------|------|
| FCP | < 1.8s | Lighthouse |
| LCP | < 2.5s | Core Web Vitals |
| CLS | < 0.1 | Core Web Vitals |
| Bundle Size | < 200KB | webpack-bundle-analyzer |

## Configuration

```yaml
# proagents.config.yaml
performance:
  bundle:
    max_size: "200KB"
    warn_at: "150KB"

  vitals:
    fcp_target: 1800
    lcp_target: 2500
    cls_target: 0.1

  regression:
    block_on_regression: true
    threshold: 10  # percent
```
