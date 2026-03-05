# Complete Contract Testing Guide

A comprehensive guide to implementing contract testing in your projects.

---

## Table of Contents

1. [Introduction](#introduction)
2. [When to Use Contract Testing](#when-to-use-contract-testing)
3. [Consumer-Driven Contracts](#consumer-driven-contracts)
4. [Writing Consumer Tests](#writing-consumer-tests)
5. [Writing Provider Tests](#writing-provider-tests)
6. [Contract Versioning](#contract-versioning)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

Contract testing verifies that two services (consumer and provider) can communicate correctly by testing them against a shared "contract" - an agreement about what requests look like and what responses are expected.

### Why Contract Testing?

```
Traditional Integration Testing:
┌──────────┐      ┌──────────┐      ┌──────────┐
│ Service A │ ───→ │ Service B │ ───→ │ Service C │
└──────────┘      └──────────┘      └──────────┘
     All services must be running. Slow. Flaky.

Contract Testing:
┌──────────┐                         ┌──────────┐
│ Service A │ ←── Contract JSON ───→ │ Service B │
└──────────┘                         └──────────┘
  Tests against                      Tests against
  mock server                        real contract

     Services test independently. Fast. Reliable.
```

### Key Concepts

| Term | Definition |
|------|------------|
| **Consumer** | Service that makes API requests |
| **Provider** | Service that handles API requests |
| **Contract** | JSON file describing expected interactions |
| **Pact** | Most popular contract testing framework |
| **Broker** | Central server storing contracts |

---

## When to Use Contract Testing

### Good Candidates

- **Microservices** communicating via HTTP/REST
- **Frontend-Backend** API interactions
- **Mobile-Backend** API interactions
- **Service-to-Service** internal APIs
- **Third-Party API** integrations (if you control the mock)

### Not Ideal For

- **Databases** - Use migration testing instead
- **Message Queues** - Use different patterns (Pact supports async)
- **UI Testing** - Use E2E tests
- **Internal Functions** - Use unit tests

### Decision Tree

```
Is it an API boundary between services?
├── Yes → Do you control both sides?
│         ├── Yes → Contract Testing ✓
│         └── No  → Schema Validation / Mocks
└── No  → Unit or Integration Tests
```

---

## Consumer-Driven Contracts

In CDC, **consumers define the contract** based on what they actually need.

### Why Consumer-Driven?

1. **No over-fetching** - Contract only includes used fields
2. **Consumer needs are explicit** - Provider knows what's important
3. **Changes are visible** - Breaking changes are caught immediately

### Workflow

```
1. Consumer writes test
        │
        ▼
2. Consumer test generates contract (pact.json)
        │
        ▼
3. Contract published to broker
        │
        ▼
4. Provider pulls contract
        │
        ▼
5. Provider verifies against contract
        │
        ▼
6. Both sides pass → Safe to deploy
```

---

## Writing Consumer Tests

### Step 1: Set Up Pact

```typescript
// consumer/pact.setup.ts
import { PactV3 } from '@pact-foundation/pact';
import path from 'path';

export const provider = new PactV3({
  consumer: 'WebApp',
  provider: 'UserService',
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'warn',
});
```

### Step 2: Define Interactions

```typescript
// consumer/tests/user.pact.test.ts
import { MatchersV3 } from '@pact-foundation/pact';
import { provider } from '../pact.setup';
import { UserService } from '../services/UserService';

const { eachLike, string, integer, email, datetime } = MatchersV3;

describe('User API Consumer Tests', () => {
  // Test: Get user by ID
  describe('GET /users/:id', () => {
    it('returns user when user exists', async () => {
      // Arrange: Define the expected interaction
      await provider
        .given('user with ID 123 exists')
        .uponReceiving('a request to get user 123')
        .withRequest({
          method: 'GET',
          path: '/api/users/123',
          headers: {
            Accept: 'application/json',
            Authorization: string('Bearer token'),
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            id: string('123'),
            email: email('user@example.com'),
            name: string('John Doe'),
            createdAt: datetime("2024-01-01T00:00:00.000Z"),
          },
        });

      // Act & Assert: Run your actual code
      await provider.executeTest(async (mockServer) => {
        const userService = new UserService(mockServer.url);
        const user = await userService.getUser('123');

        expect(user.id).toBe('123');
        expect(user.name).toBeDefined();
      });
    });

    it('returns 404 when user does not exist', async () => {
      await provider
        .given('user with ID 999 does not exist')
        .uponReceiving('a request for non-existent user')
        .withRequest({
          method: 'GET',
          path: '/api/users/999',
          headers: {
            Accept: 'application/json',
          },
        })
        .willRespondWith({
          status: 404,
          body: {
            error: string('Not Found'),
            message: string('User not found'),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const userService = new UserService(mockServer.url);
        await expect(userService.getUser('999')).rejects.toThrow('User not found');
      });
    });
  });

  // Test: Create user
  describe('POST /users', () => {
    it('creates a new user', async () => {
      await provider
        .given('no user with email test@example.com exists')
        .uponReceiving('a request to create user')
        .withRequest({
          method: 'POST',
          path: '/api/users',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            email: 'test@example.com',
            name: 'Test User',
            password: string('password123'),
          },
        })
        .willRespondWith({
          status: 201,
          body: {
            id: string(),
            email: email('test@example.com'),
            name: string('Test User'),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const userService = new UserService(mockServer.url);
        const user = await userService.createUser({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
        });

        expect(user.id).toBeDefined();
        expect(user.email).toBe('test@example.com');
      });
    });
  });

  // Test: List users
  describe('GET /users', () => {
    it('returns paginated list of users', async () => {
      await provider
        .given('multiple users exist')
        .uponReceiving('a request to list users')
        .withRequest({
          method: 'GET',
          path: '/api/users',
          query: {
            page: '1',
            limit: '10',
          },
        })
        .willRespondWith({
          status: 200,
          body: {
            data: eachLike({
              id: string('user-1'),
              email: email(),
              name: string('User Name'),
            }),
            meta: {
              page: integer(1),
              limit: integer(10),
              total: integer(25),
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const userService = new UserService(mockServer.url);
        const result = await userService.listUsers({ page: 1, limit: 10 });

        expect(result.data.length).toBeGreaterThan(0);
        expect(result.meta.page).toBe(1);
      });
    });
  });
});
```

### Step 3: Run Consumer Tests

```bash
# Run consumer tests (generates pact files)
npm run test:contract:consumer

# Output: pacts/webapp-userservice.json
```

---

## Writing Provider Tests

### Step 1: Set Up Verifier

```typescript
// provider/tests/pact.verify.test.ts
import { Verifier } from '@pact-foundation/pact';
import { app } from '../app';

describe('User Service Provider Verification', () => {
  let server: any;

  beforeAll(async () => {
    // Start your actual server
    server = app.listen(3001);
  });

  afterAll(async () => {
    server.close();
  });

  it('validates the expectations of WebApp', async () => {
    const verifier = new Verifier({
      providerBaseUrl: 'http://localhost:3001',

      // Option 1: Local pact files
      pactUrls: [
        './pacts/webapp-userservice.json',
      ],

      // Option 2: Pact Broker
      // pactBrokerUrl: process.env.PACT_BROKER_URL,
      // pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      // provider: 'UserService',
      // consumerVersionSelectors: [
      //   { latest: true },
      // ],

      // State handlers - set up test data for each state
      stateHandlers: {
        'user with ID 123 exists': async () => {
          await db.users.create({
            id: '123',
            email: 'user@example.com',
            name: 'John Doe',
            createdAt: new Date('2024-01-01'),
          });
        },

        'user with ID 999 does not exist': async () => {
          await db.users.deleteMany({ id: '999' });
        },

        'no user with email test@example.com exists': async () => {
          await db.users.deleteMany({ email: 'test@example.com' });
        },

        'multiple users exist': async () => {
          await db.users.createMany([
            { id: 'user-1', email: 'user1@example.com', name: 'User 1' },
            { id: 'user-2', email: 'user2@example.com', name: 'User 2' },
            { id: 'user-3', email: 'user3@example.com', name: 'User 3' },
          ]);
        },
      },

      // Clean up after each test
      beforeEach: async () => {
        await db.users.deleteMany({});
      },

      // Request filters (e.g., add auth)
      requestFilter: (req, res, next) => {
        // Add any necessary headers
        req.headers['authorization'] = 'Bearer test-token';
        next();
      },

      // Enable verbose logging
      logLevel: 'info',

      // Publish verification results
      publishVerificationResult: process.env.CI === 'true',
      providerVersion: process.env.GIT_COMMIT || '1.0.0',
    });

    await verifier.verifyProvider();
  });
});
```

### Step 2: Run Provider Tests

```bash
# Run provider verification
npm run test:contract:provider

# Output shows each interaction verified
```

---

## Contract Versioning

### Using Pact Broker

```bash
# Publish consumer contract
pact-broker publish ./pacts \
  --consumer-app-version $(git rev-parse HEAD) \
  --branch $(git branch --show-current) \
  --broker-base-url $PACT_BROKER_URL \
  --broker-token $PACT_BROKER_TOKEN

# Verify provider
pact-broker verify \
  --provider UserService \
  --provider-app-version $(git rev-parse HEAD) \
  --broker-base-url $PACT_BROKER_URL \
  --broker-token $PACT_BROKER_TOKEN

# Can I deploy?
pact-broker can-i-deploy \
  --pacticipant WebApp \
  --version $(git rev-parse HEAD) \
  --to-environment production
```

### Version Selectors

```typescript
// Provider test configuration
{
  consumerVersionSelectors: [
    { mainBranch: true },           // Test against main branch
    { deployedOrReleased: true },   // Test against deployed versions
    { matchingBranch: true },       // Test against same branch
  ],
}
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/contract-tests.yml
name: Contract Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  PACT_BROKER_URL: ${{ secrets.PACT_BROKER_URL }}
  PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}

jobs:
  consumer-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run consumer contract tests
        run: npm run test:contract:consumer

      - name: Publish contracts
        if: github.ref == 'refs/heads/main'
        run: |
          npx pact-broker publish ./pacts \
            --consumer-app-version ${{ github.sha }} \
            --branch ${{ github.ref_name }}

  provider-tests:
    runs-on: ubuntu-latest
    needs: consumer-tests
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm ci

      - name: Run provider verification
        run: npm run test:contract:provider
        env:
          GIT_COMMIT: ${{ github.sha }}
          CI: true

  can-i-deploy:
    runs-on: ubuntu-latest
    needs: [consumer-tests, provider-tests]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Can I deploy?
        run: |
          npx pact-broker can-i-deploy \
            --pacticipant WebApp \
            --version ${{ github.sha }} \
            --to-environment production
```

---

## Troubleshooting

### Common Issues

#### 1. "No matching interaction found"

**Cause:** Request doesn't match any defined interaction.

**Solution:**
```typescript
// Check exact path, method, headers match
.withRequest({
  method: 'GET',                    // Exact method
  path: '/api/users/123',           // Exact path (no trailing slash)
  headers: {
    Accept: 'application/json',     // Required headers
  },
})
```

#### 2. "State handler not found"

**Cause:** Provider test missing state handler.

**Solution:**
```typescript
stateHandlers: {
  'user exists': async () => {
    // This string must EXACTLY match the .given() in consumer
  },
}
```

#### 3. "Response body mismatch"

**Cause:** Provider returns different structure than expected.

**Solution:**
- Use flexible matchers instead of exact values
- Check for extra fields in response
- Verify data types match

```typescript
// Consumer: Use matchers
body: {
  id: string(),           // Any string
  count: integer(),       // Any integer
  items: eachLike({}),    // Array with at least one item
}
```

#### 4. "Verification failed - missing fields"

**Cause:** Provider response missing required fields.

**Solution:**
- Ensure provider returns all fields in contract
- Check conditional fields are included

### Debugging Tips

```typescript
// Enable verbose logging
const provider = new PactV3({
  logLevel: 'debug',
});

// Log actual requests/responses
const verifier = new Verifier({
  logLevel: 'debug',
  verbose: true,
});
```

### Pact Broker UI

The Pact Broker provides a web UI showing:
- All contracts
- Verification status
- Can-I-Deploy matrix
- Integration graph

---

## Best Practices Checklist

- [ ] Consumer tests generate contracts (not hand-written)
- [ ] Use matchers instead of exact values
- [ ] Keep contracts minimal (only what's used)
- [ ] Version contracts with git commits
- [ ] Run contract tests in CI/CD
- [ ] Block deployments on contract failures
- [ ] Clean up test data between verifications
- [ ] Document state requirements clearly
