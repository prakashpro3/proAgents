# Load Testing Guide

Comprehensive load testing strategies and implementation.

---

## Overview

Load testing ensures your application can handle expected (and unexpected) traffic. This guide covers:
- Load testing types
- Tool selection and setup
- Test scenario design
- Result analysis

---

## Load Testing Types

### 1. Smoke Test
Quick validation that system works under minimal load.

```yaml
smoke_test:
  duration: "1m"
  users: 1-5
  purpose: "Verify system is functional"
  when: "Before every deployment"
```

### 2. Load Test
Assess performance under expected normal conditions.

```yaml
load_test:
  duration: "10-30m"
  users: "Expected average"
  purpose: "Verify performance targets met"
  when: "Before releases"
```

### 3. Stress Test
Find the breaking point of the system.

```yaml
stress_test:
  duration: "Until failure"
  users: "Gradually increase"
  purpose: "Find system limits"
  when: "Quarterly or major changes"
```

### 4. Spike Test
Handle sudden traffic spikes.

```yaml
spike_test:
  duration: "5-10m"
  users: "10x normal suddenly"
  purpose: "Test auto-scaling and recovery"
  when: "Before marketing campaigns"
```

### 5. Soak Test
Extended duration testing for memory leaks.

```yaml
soak_test:
  duration: "4-24 hours"
  users: "Normal load"
  purpose: "Find memory leaks, connection issues"
  when: "Monthly"
```

---

## K6 Load Testing

### Installation

```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Basic Load Test

```javascript
// tests/load/basic.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% under 500ms
    http_req_failed: ['rate<0.01'],    // Less than 1% failures
  },
};

export default function () {
  const res = http.get('https://api.example.com/users');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### API Flow Test

```javascript
// tests/load/user-flow.js
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Load test data
const users = new SharedArray('users', function () {
  return JSON.parse(open('./test-users.json'));
});

export const options = {
  scenarios: {
    user_flow: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    'http_req_duration{name:login}': ['p(95)<1000'],
    'http_req_duration{name:get_profile}': ['p(95)<500'],
    'http_req_duration{name:list_posts}': ['p(95)<800'],
    http_req_failed: ['rate<0.02'],
  },
};

const BASE_URL = 'https://api.example.com';

export default function () {
  const user = users[Math.floor(Math.random() * users.length)];

  group('User Authentication Flow', function () {
    // Login
    const loginRes = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({
        email: user.email,
        password: user.password,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'login' },
      }
    );

    check(loginRes, {
      'login successful': (r) => r.status === 200,
      'has token': (r) => r.json('token') !== undefined,
    });

    const token = loginRes.json('token');
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    sleep(1);

    // Get Profile
    const profileRes = http.get(`${BASE_URL}/users/me`, {
      headers: authHeaders,
      tags: { name: 'get_profile' },
    });

    check(profileRes, {
      'profile loaded': (r) => r.status === 200,
    });

    sleep(0.5);

    // List Posts
    const postsRes = http.get(`${BASE_URL}/posts?limit=10`, {
      headers: authHeaders,
      tags: { name: 'list_posts' },
    });

    check(postsRes, {
      'posts loaded': (r) => r.status === 200,
      'has posts': (r) => r.json('data').length > 0,
    });

    sleep(2);
  });
}
```

### Spike Test

```javascript
// tests/load/spike.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },    // Normal load
    { duration: '10s', target: 500 },  // Spike!
    { duration: '3m', target: 500 },   // Stay at spike
    { duration: '10s', target: 50 },   // Scale down
    { duration: '2m', target: 50 },    // Recovery
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<3000'], // Even during spike
    http_req_failed: ['rate<0.1'],     // Allow some failures during spike
  },
};

export default function () {
  const res = http.get('https://api.example.com/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(0.5);
}
```

### Soak Test

```javascript
// tests/load/soak.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 100 },    // Ramp up
    { duration: '4h', target: 100 },    // Sustained load for 4 hours
    { duration: '5m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://api.example.com/users');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

---

## Artillery Load Testing

### Installation

```bash
npm install -g artillery
```

### Basic Test Config

```yaml
# tests/load/artillery.yml
config:
  target: "https://api.example.com"
  phases:
    - duration: 120
      arrivalRate: 10
      rampTo: 50
      name: "Ramp up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 50
      rampTo: 0
      name: "Ramp down"

  defaults:
    headers:
      Content-Type: "application/json"

scenarios:
  - name: "User Flow"
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "{{ $randomString(8) }}@test.com"
            password: "testpassword"
          capture:
            - json: "$.token"
              as: "token"

      - get:
          url: "/users/me"
          headers:
            Authorization: "Bearer {{ token }}"
          expect:
            - statusCode: 200

      - get:
          url: "/posts"
          headers:
            Authorization: "Bearer {{ token }}"
          expect:
            - statusCode: 200
```

### Run Artillery

```bash
# Run test
artillery run tests/load/artillery.yml

# Run with report
artillery run tests/load/artillery.yml --output report.json

# Generate HTML report
artillery report report.json --output report.html
```

---

## Test Scenarios

### Scenario 1: E-commerce Checkout Flow

```javascript
// tests/load/checkout.js
export default function () {
  group('E-commerce Checkout', function () {
    // Browse products
    http.get(`${BASE_URL}/products`);
    sleep(2);

    // View product
    http.get(`${BASE_URL}/products/123`);
    sleep(1);

    // Add to cart
    http.post(`${BASE_URL}/cart/items`, JSON.stringify({
      productId: '123',
      quantity: 1,
    }), { headers: authHeaders });
    sleep(0.5);

    // Checkout
    http.post(`${BASE_URL}/checkout`, JSON.stringify({
      cartId: 'cart-123',
      paymentMethod: 'card',
    }), { headers: authHeaders });
    sleep(1);
  });
}
```

### Scenario 2: Real-time API

```javascript
// tests/load/websocket.js
import ws from 'k6/ws';
import { check } from 'k6';

export default function () {
  const url = 'wss://api.example.com/realtime';

  const res = ws.connect(url, {}, function (socket) {
    socket.on('open', () => {
      socket.send(JSON.stringify({ type: 'subscribe', channel: 'updates' }));
    });

    socket.on('message', (data) => {
      const msg = JSON.parse(data);
      check(msg, {
        'message received': (m) => m.type !== undefined,
      });
    });

    socket.setTimeout(function () {
      socket.close();
    }, 30000);
  });

  check(res, { 'connected': (r) => r && r.status === 101 });
}
```

---

## Results Analysis

### Understanding K6 Output

```
          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: basic.js
     output: -

  scenarios: (100.00%) 1 scenario, 100 max VUs, 9m30s max duration
           ✓ default: Up to 100 looping VUs for 9m0s

  ✓ status is 200
  ✓ response time < 500ms

  checks.........................: 100.00% ✓ 54000 ✗ 0
  data_received..................: 12 MB   22 kB/s
  data_sent......................: 4.3 MB  7.8 kB/s
  http_req_blocked...............: avg=1.2ms   min=0s     med=0s     p(95)=0s    p(99)=0s
  http_req_connecting............: avg=500µs   min=0s     med=0s     p(95)=0s    p(99)=0s
  ✓ http_req_duration............: avg=45ms    min=12ms   med=38ms   p(95)=89ms  p(99)=120ms
  http_req_receiving.............: avg=500µs   min=0s     med=0s     p(95)=1ms   p(99)=2ms
  http_req_sending...............: avg=100µs   min=0s     med=0s     p(95)=0s    p(99)=1ms
  http_req_waiting...............: avg=44ms    min=12ms   med=37ms   p(95)=88ms  p(99)=119ms
  http_reqs......................: 54000   100/s
  iteration_duration.............: avg=1.04s   min=1.01s  med=1.03s  p(95)=1.09s p(99)=1.12s
  iterations.....................: 54000   100/s
  vus............................: 100     min=1  max=100
  vus_max........................: 100     min=100 max=100
```

### Key Metrics Interpretation

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| `http_req_duration p(95)` | <200ms | 200-500ms | >500ms |
| `http_req_failed` | <1% | 1-5% | >5% |
| `iterations` | Meets target | 10% below | >20% below |
| `checks` | 100% | 95-99% | <95% |

---

## Load Test Report Template

```markdown
# Load Test Report

## Test Information
- **Date:** [Date]
- **Environment:** [staging/production]
- **Duration:** [Duration]
- **Test Type:** [Load/Stress/Spike/Soak]

## Summary

| Metric | Target | Result | Status |
|--------|--------|--------|--------|
| Max Users | 100 | 100 | ✅ |
| P95 Latency | <500ms | 89ms | ✅ |
| Error Rate | <1% | 0.1% | ✅ |
| Throughput | 100 rps | 120 rps | ✅ |

## Detailed Results

### Response Time
- P50: 38ms
- P95: 89ms
- P99: 120ms
- Max: 250ms

### Throughput
- Requests/sec: 120
- Total requests: 54,000

### Errors
- Total: 54 (0.1%)
- 5xx: 0
- Timeouts: 54

## Bottlenecks Identified

1. **Database connection pool**
   - Saturated at 80 concurrent users
   - Recommendation: Increase pool size

2. **Memory usage**
   - Peaked at 85% during max load
   - Recommendation: Add memory or optimize

## Recommendations

1. Increase database pool from 10 to 25
2. Add response caching for `/api/products`
3. Consider horizontal scaling for >200 users

## Appendix

[Attach detailed test output and graphs]
```

---

## Configuration

```yaml
# proagents.config.yaml

performance:
  load_testing:
    enabled: true
    tool: "k6"

    default_thresholds:
      http_req_duration_p95: 500ms
      http_req_failed: 1%

    environments:
      staging:
        base_url: "https://staging.example.com"
        max_users: 100

      production:
        base_url: "https://api.example.com"
        max_users: 500  # Higher limit

    schedule:
      smoke: "on_deploy"
      load: "weekly"
      stress: "monthly"
      soak: "monthly"
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:load-test` | Run default load test |
| `pa:load-test --smoke` | Run smoke test |
| `pa:load-test --stress` | Run stress test |
| `pa:load-test --spike` | Run spike test |
| `pa:load-test --soak` | Run soak test |
| `pa:load-test --report` | Generate test report |
