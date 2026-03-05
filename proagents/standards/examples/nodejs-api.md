# Node.js API Project Standards

Complete standards example for Node.js backend/API projects.

---

## Naming Conventions

### Files and Folders

| Type | Convention | Example |
|------|-----------|---------|
| Controllers | camelCase + `.controller` | `user.controller.ts` |
| Services | camelCase + `.service` | `user.service.ts` |
| Models | camelCase + `.model` | `user.model.ts` |
| Repositories | camelCase + `.repository` | `user.repository.ts` |
| Middleware | camelCase + `.middleware` | `auth.middleware.ts` |
| Routes | camelCase + `.routes` | `user.routes.ts` |
| Tests | Same + `.test` or `.spec` | `user.service.test.ts` |
| Types | camelCase + `.types` | `user.types.ts` |

### Code Elements

```typescript
// Classes - PascalCase
class UserService {}
class AuthMiddleware {}

// Functions - camelCase
function validateEmail() {}
const createUser = async () => {}

// Constants - UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const DEFAULT_PAGE_SIZE = 20;

// Environment variables - UPPER_SNAKE_CASE
process.env.DATABASE_URL
process.env.JWT_SECRET

// Interfaces/Types - PascalCase
interface UserCreateDTO {}
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Route parameters - camelCase
req.params.userId
req.query.pageSize
```

---

## Directory Structure

```
src/
├── index.ts                # Application entry point
├── app.ts                  # Express app setup
├── server.ts               # Server startup
│
├── config/                 # Configuration
│   ├── index.ts
│   ├── database.ts
│   ├── auth.ts
│   └── env.ts
│
├── modules/                # Feature modules
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.model.ts
│   │   ├── user.routes.ts
│   │   ├── user.types.ts
│   │   ├── user.validation.ts
│   │   ├── __tests__/
│   │   │   ├── user.service.test.ts
│   │   │   └── user.controller.test.ts
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.middleware.ts
│   │   └── ...
│   │
│   └── orders/
│       └── ...
│
├── shared/                 # Shared utilities
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   ├── logging.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/
│   │   ├── errors.ts
│   │   ├── logger.ts
│   │   └── helpers.ts
│   └── types/
│       ├── express.d.ts
│       └── common.ts
│
├── database/               # Database
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── seeds/
│
└── tests/                  # Integration tests
    ├── setup.ts
    └── integration/
```

---

## Controller Pattern

```typescript
// user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './user.types';
import { HttpStatus } from '@/shared/constants';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const users = await this.userService.findAll({
        page: Number(page),
        limit: Number(limit),
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: 'User not found',
        });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateUserDTO = req.body;
      const user = await this.userService.create(dto);
      res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: UpdateUserDTO = req.body;
      const user = await this.userService.update(req.params.id, dto);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.delete(req.params.id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}
```

---

## Service Pattern

```typescript
// user.service.ts
import { UserRepository } from './user.repository';
import { CreateUserDTO, UpdateUserDTO, User, PaginatedResult } from './user.types';
import { NotFoundError, ConflictError } from '@/shared/errors';
import { hashPassword } from '@/shared/utils';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(options: PaginationOptions): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(options);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(dto: CreateUserDTO): Promise<User> {
    // Check for existing user
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(dto.password);

    return this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async update(id: string, dto: UpdateUserDTO): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.userRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepository.delete(id);
  }
}
```

---

## Repository Pattern

```typescript
// user.repository.ts
import { PrismaClient } from '@prisma/client';
import { User, CreateUserDTO, UpdateUserDTO, PaginatedResult } from './user.types';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
```

---

## Routes Pattern

```typescript
// user.routes.ts
import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { prisma } from '@/database';
import { authenticate, authorize } from '@/shared/middleware';
import { validate } from '@/shared/middleware/validation';
import { createUserSchema, updateUserSchema } from './user.validation';

const router = Router();

// Dependency injection
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
router.get('/', authenticate, userController.getAll.bind(userController));

router.get('/:id', authenticate, userController.getById.bind(userController));

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createUserSchema),
  userController.create.bind(userController)
);

router.put(
  '/:id',
  authenticate,
  validate(updateUserSchema),
  userController.update.bind(userController)
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  userController.delete.bind(userController)
);

export { router as userRoutes };
```

---

## Error Handling

```typescript
// shared/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation failed',
    public errors: Record<string, string[]> = {}
  ) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

```typescript
// shared/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/shared/errors';
import { logger } from '@/shared/utils/logger';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error instanceof ValidationError && { errors: error.errors }),
      },
    });
  }

  // Unexpected error
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
```

---

## Validation (Zod)

```typescript
// user.validation.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['user', 'admin']).optional().default('user'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>['body'];
export type UpdateUserDTO = z.infer<typeof updateUserSchema>['body'];
```

---

## Testing Pattern

```typescript
// user.service.test.ts
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { ConflictError, NotFoundError } from '@/shared/errors';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    userService = new UserService(mockRepository);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = { email: 'test@example.com', password: 'Password123', name: 'Test' };
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({ id: '1', ...dto });

      const result = await userService.create(dto);

      expect(result).toHaveProperty('id');
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictError if email exists', async () => {
      const dto = { email: 'existing@example.com', password: 'Password123', name: 'Test' };
      mockRepository.findByEmail.mockResolvedValue({ id: '1', email: dto.email });

      await expect(userService.create(dto)).rejects.toThrow(ConflictError);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test' };
      mockRepository.findById.mockResolvedValue(user);

      const result = await userService.findById('1');

      expect(result).toEqual(user);
    });

    it('should return null if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await userService.findById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
```

---

## Environment Configuration

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```
