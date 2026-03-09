# Pact Integration

Using Pact for consumer-driven contract testing.

---

## Overview

Pact is the most popular contract testing tool, enabling consumer-driven contract testing between services.

---

## Installation

### Node.js

```bash
npm install --save-dev @pact-foundation/pact
```

### Other Languages

```bash
# Ruby
gem install pact

# Python
pip install pact-python

# Go
go get github.com/pact-foundation/pact-go

# JVM
implementation 'au.com.dius.pact.consumer:junit5:4.5.0'
```

---

## Consumer Testing

### Basic Setup

```typescript
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { UserClient } from '../src/clients/user-client';

const provider = new PactV3({
  consumer: 'WebApp',
  provider: 'UserService',
  dir: './pacts',
  logLevel: 'info',
});

describe('UserClient', () => {
  describe('getUser', () => {
    it('returns user when found', async () => {
      // Arrange: Define the expected interaction
      await provider
        .given('a user with ID 123 exists')
        .uponReceiving('a request to get user 123')
        .withRequest({
          method: 'GET',
          path: '/api/users/123',
          headers: {
            Accept: 'application/json',
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            id: MatchersV3.string('123'),
            name: MatchersV3.string('John Doe'),
            email: MatchersV3.email('john@example.com'),
            createdAt: MatchersV3.datetime('yyyy-MM-dd\'T\'HH:mm:ss.SSSXXX'),
          },
        })
        .executeTest(async (mockServer) => {
          // Act: Call the client against mock server
          const client = new UserClient(mockServer.url);
          const user = await client.getUser('123');

          // Assert: Verify the response
          expect(user.id).toBe('123');
          expect(user.name).toBe('John Doe');
        });
    });

    it('returns 404 when user not found', async () => {
      await provider
        .given('no user exists with ID 999')
        .uponReceiving('a request for non-existent user')
        .withRequest({
          method: 'GET',
          path: '/api/users/999',
        })
        .willRespondWith({
          status: 404,
          body: {
            error: MatchersV3.string('User not found'),
            code: 'USER_NOT_FOUND',
          },
        })
        .executeTest(async (mockServer) => {
          const client = new UserClient(mockServer.url);

          await expect(client.getUser('999')).rejects.toThrow('User not found');
        });
    });
  });

  describe('createUser', () => {
    it('creates a new user', async () => {
      const newUser = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      await provider
        .uponReceiving('a request to create a user')
        .withRequest({
          method: 'POST',
          path: '/api/users',
          headers: {
            'Content-Type': 'application/json',
          },
          body: newUser,
        })
        .willRespondWith({
          status: 201,
          body: {
            id: MatchersV3.uuid(),
            ...newUser,
            createdAt: MatchersV3.datetime(),
          },
        })
        .executeTest(async (mockServer) => {
          const client = new UserClient(mockServer.url);
          const created = await client.createUser(newUser);

          expect(created.name).toBe('Jane Doe');
          expect(created.id).toBeDefined();
        });
    });
  });
});
```

### Using Matchers

```typescript
import { MatchersV3 as M } from '@pact-foundation/pact';

// String matchers
M.string('example')           // Any string, example value shown
M.regex(/^[A-Z]{3}$/, 'ABC')  // Regex match

// Number matchers
M.number(42)                  // Any number
M.integer(42)                 // Any integer
M.decimal(3.14)               // Any decimal

// Boolean
M.boolean(true)               // Any boolean

// Special formats
M.email('test@example.com')   // Valid email format
M.uuid()                      // Valid UUID
M.datetime()                  // ISO datetime
M.date('2024-01-15')          // Date format
M.time('14:30:00')            // Time format
M.ipv4Address()               // IPv4 address

// Collections
M.eachLike({ id: M.string() })  // Array with at least one element
M.atLeastOneLike({ id: M.string() }, 3)  // At least 3 elements

// Objects
M.like({                      // Match structure, not values
  id: M.string(),
  name: M.string(),
})

// Nullable
M.nullValue()                 // Null value
M.or(M.string(), M.nullValue())  // String or null
```

### Request/Response Examples

```typescript
// Query parameters
.withRequest({
  method: 'GET',
  path: '/api/users',
  query: {
    page: '1',
    limit: '10',
    sort: 'name',
  },
})

// Headers
.withRequest({
  method: 'GET',
  path: '/api/users',
  headers: {
    Authorization: MatchersV3.regex(/^Bearer .+$/, 'Bearer token123'),
    'X-Request-ID': MatchersV3.uuid(),
  },
})

// Array response
.willRespondWith({
  status: 200,
  body: {
    data: MatchersV3.eachLike({
      id: MatchersV3.string(),
      name: MatchersV3.string(),
    }),
    pagination: {
      page: MatchersV3.integer(1),
      total: MatchersV3.integer(100),
    },
  },
})
```

---

## Provider Verification

### Basic Verification

```typescript
import { Verifier } from '@pact-foundation/pact';

describe('UserService Provider', () => {
  // Start your real service before tests
  beforeAll(async () => {
    await startServer(3000);
  });

  afterAll(async () => {
    await stopServer();
  });

  it('validates the contract', async () => {
    const verifier = new Verifier({
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: [
        './pacts/webapp-userservice.json',
      ],
      stateHandlers: {
        'a user with ID 123 exists': async () => {
          // Set up the required state
          await db.users.create({
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
          });
        },
        'no user exists with ID 999': async () => {
          // Ensure user doesn't exist
          await db.users.deleteAll();
        },
      },
    });

    await verifier.verifyProvider();
  });
});
```

### State Handlers

```typescript
const stateHandlers = {
  // Simple state
  'user exists': async () => {
    await db.users.create({ id: '123', name: 'Test User' });
  },

  // State with parameters
  'user exists': async (params: { userId: string }) => {
    await db.users.create({ id: params.userId, name: 'Test User' });
  },

  // State teardown
  'user exists': {
    setup: async () => {
      await db.users.create({ id: '123', name: 'Test User' });
    },
    teardown: async () => {
      await db.users.delete('123');
    },
  },

  // No-op state
  'default state': async () => {
    // Nothing to set up
  },
};
```

### Using Pact Broker

```typescript
const verifier = new Verifier({
  providerBaseUrl: 'http://localhost:3000',

  // Use Pact Broker
  pactBrokerUrl: 'https://your-broker.pactflow.io',
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  provider: 'UserService',

  // Which pacts to verify
  consumerVersionSelectors: [
    { mainBranch: true },        // Main branch
    { deployedOrReleased: true }, // Deployed versions
    { matchingBranch: true },     // Same branch as provider
  ],

  // Publish verification results
  publishVerificationResult: true,
  providerVersion: process.env.GIT_COMMIT,
  providerVersionBranch: process.env.GIT_BRANCH,

  stateHandlers,
});
```

---

## Pact Broker

### Publishing Contracts

```typescript
import { Publisher } from '@pact-foundation/pact';

const publisher = new Publisher({
  pactBroker: 'https://your-broker.pactflow.io',
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  pactFilesOrDirs: ['./pacts'],
  consumerVersion: process.env.GIT_COMMIT,
  branch: process.env.GIT_BRANCH,
  tags: ['main'],
});

await publisher.publish();
```

### Can-I-Deploy

```bash
# Check if consumer can deploy
pact-broker can-i-deploy \
  --pacticipant WebApp \
  --version $GIT_COMMIT \
  --to-environment production

# Check if provider can deploy
pact-broker can-i-deploy \
  --pacticipant UserService \
  --version $GIT_COMMIT \
  --to-environment production
```

### Recording Deployments

```bash
# Record deployment to environment
pact-broker record-deployment \
  --pacticipant UserService \
  --version $GIT_COMMIT \
  --environment production
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Contract Tests

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  consumer-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run consumer contract tests
        run: npm run test:contract:consumer

      - name: Publish pacts
        if: github.ref == 'refs/heads/main'
        run: |
          npm run pact:publish
        env:
          PACT_BROKER_URL: ${{ secrets.PACT_BROKER_URL }}
          PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
          GIT_COMMIT: ${{ github.sha }}
          GIT_BRANCH: ${{ github.ref_name }}

  provider-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Start provider service
        run: npm run start:test &
        env:
          PORT: 3000

      - name: Run provider verification
        run: npm run test:contract:provider
        env:
          PACT_BROKER_URL: ${{ secrets.PACT_BROKER_URL }}
          PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}

  can-i-deploy:
    runs-on: ubuntu-latest
    needs: [consumer-tests, provider-tests]
    steps:
      - name: Can I Deploy
        run: |
          docker run --rm \
            pactfoundation/pact-cli:latest \
            broker can-i-deploy \
            --pacticipant ${{ github.event.repository.name }} \
            --version ${{ github.sha }} \
            --to-environment production \
            --broker-base-url ${{ secrets.PACT_BROKER_URL }} \
            --broker-token ${{ secrets.PACT_BROKER_TOKEN }}
```

---

## Commands Reference

```bash
# Consumer tests
npm run test:contract:consumer

# Provider verification
npm run test:contract:provider

# Publish pacts
npm run pact:publish

# Can-I-Deploy check
pact-broker can-i-deploy \
  --pacticipant MyApp \
  --version $(git rev-parse HEAD) \
  --to production

# Record deployment
pact-broker record-deployment \
  --pacticipant MyApp \
  --version $(git rev-parse HEAD) \
  --environment production

# Create webhook
pact-broker create-or-update-webhook \
  --uuid my-webhook \
  --url https://api.example.com/pact-changed \
  --contract-content-changed
```

---

## Best Practices

1. **Consumer-first**: Write consumer tests before implementing provider
2. **Minimal contracts**: Only include fields you actually use
3. **Use matchers**: Don't hardcode exact values
4. **Meaningful states**: Make state names descriptive
5. **Clean state**: Reset database between tests
6. **Version properly**: Use git commit SHA for versions
7. **Automate publishing**: Publish contracts in CI
8. **Block deployments**: Use can-i-deploy as gate
