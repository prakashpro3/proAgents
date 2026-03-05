# Node.js (Backend/API) Scaffold

Project structure and configuration for Node.js backend applications.

---

## Directory Structure

```
project-root/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   └── index.ts
│   │
│   ├── services/            # Business logic
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   └── index.ts
│   │
│   ├── models/              # Data models (Prisma/TypeORM)
│   │   ├── user.model.ts
│   │   └── index.ts
│   │
│   ├── routes/              # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── index.ts
│   │
│   ├── validators/          # Request validation (Zod)
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   └── index.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── express.d.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── config/              # Configuration
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── index.ts
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
│
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
│
├── tests/                   # Test files
│   ├── setup.ts
│   ├── utils.ts
│   ├── unit/
│   └── integration/
│
├── docs/                    # API documentation
│   └── openapi.yaml
│
├── scripts/                 # Utility scripts
│   ├── seed.ts
│   └── migrate.ts
│
├── .husky/                  # Git hooks
│
├── proagents/               # ProAgents configuration
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── jest.config.js
├── eslint.config.js
├── prettier.config.js
└── proagents.config.yaml
```

---

## Configuration Files

### package.json
```json
{
  "name": "{{project-name}}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "prepare": "husky install"
  },
  "dependencies": {
    "express": "^4.18.0",
    "@prisma/client": "^5.7.0",
    "zod": "^3.22.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.0",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.0",
    "winston": "^3.11.0",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.10.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/cors": "^2.8.0",
    "@types/morgan": "^1.9.0",
    "typescript": "^5.3.0",
    "tsx": "^4.6.0",
    "prisma": "^5.7.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "supertest": "^6.3.0",
    "@types/supertest": "^6.0.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "@commitlint/cli": "^18.4.0",
    "@commitlint/config-conventional": "^18.4.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@controllers/*": ["src/controllers/*"],
      "@services/*": ["src/services/*"],
      "@models/*": ["src/models/*"],
      "@routes/*": ["src/routes/*"],
      "@middleware/*": ["src/middleware/*"],
      "@validators/*": ["src/validators/*"],
      "@utils/*": ["src/utils/*"],
      "@config/*": ["src/config/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  USER
  ADMIN
}
```

---

## Starter Files

### src/server.ts
```typescript
import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});
```

### src/app.ts
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { routes } from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
```

### src/routes/index.ts
```typescript
import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { userRoutes } from './user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export { router as routes };
```

### src/routes/auth.routes.ts
```typescript
import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middleware/validation.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export { router as authRoutes };
```

### src/controllers/authController.ts
```typescript
import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refresh(req.body.refreshToken);
      sendSuccess(res, result, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.body.refreshToken);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  },
};
```

### src/validators/auth.validator.ts
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
```

### src/middleware/error.middleware.ts
```typescript
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
```

### src/config/env.ts
```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export const env = envSchema.parse(process.env);
```

---

## ProAgents Configuration

### proagents.config.yaml (Node.js-specific)
```yaml
project:
  name: "{{project-name}}"
  type: "backend"
  framework: "express"
  language: "typescript"
  api_style: "rest"

phases:
  analysis:
    enabled: true
    focus:
      - "route-structure"
      - "middleware-patterns"
      - "database-models"
  ui_design:
    enabled: false
  api_design:
    enabled: true
    specification: "openapi"
  database:
    enabled: true
    orm: "prisma"
  testing:
    coverage_target: 80
    types: ["unit", "integration"]
    load_testing: true

patterns:
  architecture: "layered"  # or clean, hexagonal
  controllers:
    style: "object-methods"
    async_handlers: true
  services:
    dependency_injection: false
  validation:
    library: "zod"
  error_handling:
    custom_errors: true
    centralized: true
  logging:
    library: "winston"
    format: "json"

testing:
  framework: "jest"
  http_client: "supertest"
  database: "test-containers"  # or in-memory

deployment:
  target: "docker"
  orchestration: "docker-compose"  # or kubernetes
  ci_cd: "github-actions"

documentation:
  api_docs: "openapi"
  auto_generate: true
```

---

## API Route Template

When creating new routes:

```
src/
├── routes/resource.routes.ts
├── controllers/resourceController.ts
├── services/resourceService.ts
├── validators/resource.validator.ts
└── models/resource.model.ts (if needed)
```

### Route File Template
```typescript
import { Router } from 'express';
import { resourceController } from '../controllers/resourceController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  createResourceSchema,
  updateResourceSchema,
} from '../validators/resource.validator.js';

const router = Router();

// Public routes
router.get('/', resourceController.getAll);
router.get('/:id', resourceController.getById);

// Protected routes
router.use(authMiddleware);
router.post('/', validate(createResourceSchema), resourceController.create);
router.put('/:id', validate(updateResourceSchema), resourceController.update);
router.delete('/:id', resourceController.delete);

export { router as resourceRoutes };
```

---

## Slash Commands (Node.js-specific)

| Command | Description |
|---------|-------------|
| `/route [name]` | Generate new route + controller + service |
| `/controller [name]` | Generate controller |
| `/service [name]` | Generate service |
| `/middleware [name]` | Generate middleware |
| `/validator [name]` | Generate Zod validator |
| `/model [name]` | Generate Prisma model |
| `/migrate` | Run database migrations |
| `/seed` | Run database seeding |
| `/docs` | Generate OpenAPI docs |
