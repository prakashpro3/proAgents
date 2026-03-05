# Contract Testing

Ensure API contracts between services remain compatible.

---

## Overview

Contract testing verifies that API interactions between services conform to agreed-upon contracts, catching integration issues early without requiring full end-to-end testing.

---

## What is Contract Testing?

Contract testing validates that:
- **Consumers** correctly call providers
- **Providers** return expected responses
- **Both sides** agree on the contract

```
┌──────────────┐                    ┌──────────────┐
│   Consumer   │ ←── Contract ───→ │   Provider   │
│  (Frontend)  │                    │  (Backend)   │
└──────────────┘                    └──────────────┘
       │                                   │
       ▼                                   ▼
   Consumer Tests                   Provider Tests
   verify request                   verify response
   matches contract                 matches contract
```

---

## Quick Start

### Install Pact

```bash
# Node.js
npm install --save-dev @pact-foundation/pact

# Or use Pact standalone
curl -LO https://github.com/pact-foundation/pact-ruby-standalone/releases/latest/download/pact-2.0.0-osx.tar.gz
```

### Consumer Test

```typescript
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

const provider = new PactV3({
  consumer: 'Frontend',
  provider: 'UserService',
});

describe('User API', () => {
  it('gets user by ID', async () => {
    await provider
      .given('user exists')
      .uponReceiving('a request for user')
      .withRequest({
        method: 'GET',
        path: '/users/123',
      })
      .willRespondWith({
        status: 200,
        body: {
          id: MatchersV3.string('123'),
          name: MatchersV3.string('John'),
          email: MatchersV3.email(),
        },
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/users/123`);
        const user = await response.json();
        expect(user.name).toBe('John');
      });
  });
});
```

### Provider Test

```typescript
import { Verifier } from '@pact-foundation/pact';

describe('User Service Provider', () => {
  it('validates the contract', async () => {
    await new Verifier({
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: ['./pacts/frontend-userservice.json'],
      stateHandlers: {
        'user exists': async () => {
          await db.users.create({ id: '123', name: 'John' });
        },
      },
    }).verifyProvider();
  });
});
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Contract Testing Guide](./contract-testing.md) | Complete contract testing guide |
| [Pact Integration](./pact-integration.md) | Using Pact for contract testing |
| [Schema Validation](./schema-validation.md) | JSON Schema and OpenAPI validation |

---

## Contract Testing vs Other Testing

| Type | Purpose | When to Use |
|------|---------|-------------|
| **Unit Tests** | Test individual components | Always |
| **Contract Tests** | Test API agreements | Service boundaries |
| **Integration Tests** | Test real interactions | Critical paths |
| **E2E Tests** | Test full workflows | Key user journeys |

---

## Benefits

- **Catch breaking changes early** - Before deployment
- **Decouple teams** - Test independently
- **Faster feedback** - No need for running all services
- **Living documentation** - Contracts serve as specs
- **Prevent regression** - Automated verification

---

## Commands

```bash
# Run consumer tests
/contract test consumer

# Run provider tests
/contract test provider

# Publish contracts
/contract publish

# Verify contracts
/contract verify

# Generate contract documentation
/contract docs
```

---

## Configuration

```yaml
# proagents.config.yaml
contract_testing:
  enabled: true
  tool: "pact"

  broker:
    url: "${PACT_BROKER_URL}"
    token: "${PACT_BROKER_TOKEN}"

  consumer:
    output_dir: "./pacts"

  provider:
    pact_urls:
      - "${PACT_BROKER_URL}/pacts/provider/UserService/latest"

  ci:
    can_i_deploy: true
    publish_on_success: true
```

---

## CI/CD Integration

```yaml
# .github/workflows/contract.yml
name: Contract Tests

on: [push, pull_request]

jobs:
  consumer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:contract:consumer
      - run: npm run pact:publish

  provider:
    runs-on: ubuntu-latest
    needs: consumer
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:contract:provider

  can-i-deploy:
    runs-on: ubuntu-latest
    needs: [consumer, provider]
    steps:
      - run: pact-broker can-i-deploy --pacticipant Frontend --latest
```

---

## Best Practices

1. **Consumer-driven** - Consumers define what they need
2. **Minimal contracts** - Only include what's used
3. **Use matchers** - Don't hardcode values
4. **Version contracts** - Track changes over time
5. **Automate publishing** - Integrate with CI/CD
6. **Can-I-Deploy** - Block deployments on failures
