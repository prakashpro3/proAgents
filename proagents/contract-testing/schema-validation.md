# Schema Validation

Validate API contracts using JSON Schema and OpenAPI specifications.

---

## Overview

Schema validation ensures API requests and responses conform to defined schemas, providing contract assurance without full contract testing infrastructure.

---

## JSON Schema Validation

### Define Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://api.example.com/schemas/user.json",
  "title": "User",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique user identifier"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "role": {
      "type": "string",
      "enum": ["admin", "user", "guest"],
      "default": "user"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    }
  },
  "additionalProperties": false
}
```

### Validate in Tests

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import userSchema from './schemas/user.json';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(userSchema);

describe('User API', () => {
  it('returns valid user schema', async () => {
    const response = await fetch('/api/users/123');
    const user = await response.json();

    const valid = validate(user);

    if (!valid) {
      console.error('Validation errors:', validate.errors);
    }

    expect(valid).toBe(true);
  });
});
```

### Runtime Validation

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

// Compile schemas
const schemas = {
  user: ajv.compile(require('./schemas/user.json')),
  createUser: ajv.compile(require('./schemas/create-user.json')),
};

// Validation middleware
function validateBody(schemaName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validate = schemas[schemaName];

    if (!validate) {
      return res.status(500).json({ error: 'Unknown schema' });
    }

    if (!validate(req.body)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validate.errors,
      });
    }

    next();
  };
}

// Usage
app.post('/api/users', validateBody('createUser'), createUser);
```

---

## OpenAPI Validation

### Define OpenAPI Spec

```yaml
# openapi.yaml
openapi: 3.0.3
info:
  title: User API
  version: 1.0.0

paths:
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users:
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
        - email
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        email:
          type: string
          format: email
        role:
          type: string
          enum: [admin, user, guest]
        createdAt:
          type: string
          format: date-time

    CreateUser:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        email:
          type: string
          format: email
        role:
          type: string
          enum: [admin, user, guest]
          default: user

    Error:
      type: object
      required:
        - error
        - code
      properties:
        error:
          type: string
        code:
          type: string
```

### Validate with OpenAPI

```typescript
import OpenAPIValidator from 'express-openapi-validator';

// Add validation middleware
app.use(
  OpenAPIValidator.middleware({
    apiSpec: './openapi.yaml',
    validateRequests: true,
    validateResponses: true,
  })
);

// Error handler for validation errors
app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors,
    });
  }
  next(err);
});
```

### Test Against OpenAPI

```typescript
import { OpenAPIV3 } from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser';
import { createClient } from 'openapi-fetch';

describe('API Contract Tests', () => {
  let api: OpenAPIV3.Document;

  beforeAll(async () => {
    api = await SwaggerParser.validate('./openapi.yaml') as OpenAPIV3.Document;
  });

  it('GET /users/{id} matches spec', async () => {
    const response = await fetch('/api/users/123');
    const body = await response.json();

    // Validate response matches schema
    const schema = api.paths['/users/{id}']
      .get
      .responses['200']
      .content['application/json']
      .schema;

    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    expect(validate(body)).toBe(true);
  });
});
```

---

## Schema Testing Strategies

### 1. Snapshot Testing

```typescript
describe('API Schemas', () => {
  it('user schema matches snapshot', () => {
    const userSchema = require('./schemas/user.json');
    expect(userSchema).toMatchSnapshot();
  });

  it('openapi spec matches snapshot', async () => {
    const spec = await SwaggerParser.parse('./openapi.yaml');
    expect(spec).toMatchSnapshot();
  });
});
```

### 2. Breaking Change Detection

```typescript
import { diff } from 'json-diff';

describe('Schema Backward Compatibility', () => {
  it('new schema is backward compatible', () => {
    const oldSchema = require('./schemas/v1/user.json');
    const newSchema = require('./schemas/v2/user.json');

    // Check required fields not removed
    const oldRequired = new Set(oldSchema.required || []);
    const newRequired = new Set(newSchema.required || []);

    for (const field of oldRequired) {
      expect(newRequired.has(field)).toBe(true);
    }

    // Check no type changes in existing fields
    for (const [field, oldDef] of Object.entries(oldSchema.properties || {})) {
      if (newSchema.properties?.[field]) {
        expect(newSchema.properties[field].type).toBe(oldDef.type);
      }
    }
  });
});
```

### 3. Schema Fuzzing

```typescript
import jsf from 'json-schema-faker';

describe('Schema Fuzzing', () => {
  it('handles random valid inputs', async () => {
    const createUserSchema = require('./schemas/create-user.json');

    // Generate random valid input
    const randomUser = jsf.generate(createUserSchema);

    // Should not throw
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(randomUser),
    });

    // Should accept valid input
    expect(response.status).toBe(201);
  });
});
```

---

## Schema Evolution

### Versioning Strategies

```yaml
# Option 1: Path versioning
paths:
  /v1/users:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserV1'

  /v2/users:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserV2'

# Option 2: Content negotiation
paths:
  /users:
    get:
      responses:
        '200':
          content:
            application/vnd.api.v1+json:
              schema:
                $ref: '#/components/schemas/UserV1'
            application/vnd.api.v2+json:
              schema:
                $ref: '#/components/schemas/UserV2'
```

### Migration Guide Generation

```typescript
function generateMigrationGuide(oldSchema: Schema, newSchema: Schema): string {
  const changes: string[] = [];

  // Find new required fields
  const newRequired = newSchema.required.filter(
    f => !oldSchema.required.includes(f)
  );

  if (newRequired.length > 0) {
    changes.push(`New required fields: ${newRequired.join(', ')}`);
  }

  // Find removed fields
  const removedFields = Object.keys(oldSchema.properties).filter(
    f => !(f in newSchema.properties)
  );

  if (removedFields.length > 0) {
    changes.push(`Removed fields: ${removedFields.join(', ')}`);
  }

  // Find type changes
  for (const [field, def] of Object.entries(newSchema.properties)) {
    if (oldSchema.properties[field]?.type !== def.type) {
      changes.push(`Type change: ${field} (${oldSchema.properties[field]?.type} → ${def.type})`);
    }
  }

  return changes.join('\n');
}
```

---

## Integration with Zod

### Define Schema with Zod

```typescript
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Define schema with Zod
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
  createdAt: z.string().datetime(),
});

const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true });

// Type inference
type User = z.infer<typeof UserSchema>;
type CreateUser = z.infer<typeof CreateUserSchema>;

// Convert to JSON Schema
const userJsonSchema = zodToJsonSchema(UserSchema);

// Validation
function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}

// Safe validation
function safeValidateUser(data: unknown): { success: boolean; data?: User; error?: z.ZodError } {
  const result = UserSchema.safeParse(data);
  return result;
}
```

### Express Middleware with Zod

```typescript
import { z, ZodSchema } from 'zod';

function validate<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
}

// Usage
app.post('/api/users', validate(CreateUserSchema), createUser);
```

---

## Commands

```bash
# Validate schema files
pa:schema validate ./schemas/

# Generate JSON Schema from TypeScript
pa:schema generate --from types.ts --out schemas/

# Compare schemas for breaking changes
pa:schema diff ./old-schema.json ./new-schema.json

# Generate TypeScript from JSON Schema
pa:schema to-typescript ./schemas/user.json

# Validate OpenAPI spec
pa:schema openapi validate ./openapi.yaml

# Generate mock data from schema
pa:schema mock ./schemas/user.json
```

---

## Configuration

```yaml
# proagents.config.yaml
schema_validation:
  enabled: true

  json_schema:
    draft: "2020-12"
    strict: true
    additional_properties: false

  openapi:
    validate_requests: true
    validate_responses: true
    spec_path: "./openapi.yaml"

  zod:
    strict: true
    coerce: false

  ci:
    check_breaking_changes: true
    fail_on_breaking: true
    generate_migration_guide: true
```

---

## Best Practices

1. **Single source of truth**: Define schemas once, generate others
2. **Version schemas**: Track schema changes in git
3. **Detect breaking changes**: Fail CI on incompatible changes
4. **Generate types**: Create TypeScript types from schemas
5. **Validate early**: Validate at API boundaries
6. **Document schemas**: Include descriptions and examples
7. **Use strict mode**: Disallow additional properties by default
