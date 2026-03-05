# Node.js Backend API Workflow Example

A complete walkthrough of building an API feature using ProAgents workflow.

---

## Scenario

**Feature:** Add product inventory management API
**Project:** Existing Node.js + Express + TypeScript + PostgreSQL application

---

## Phase 0: Initialization

### Start Feature

```
User: /feature-start "Product Inventory API"
```

### Context Gathered

```markdown
Project: inventory-api
Type: Backend API (Node.js)
Branch: feature/product-inventory

Feature: Product Inventory API
- CRUD operations for products
- Inventory tracking (stock levels)
- Low stock alerts
```

---

## Phase 1: Codebase Analysis

### Analysis Results

```markdown
## Codebase Analysis Summary

### Tech Stack
- Node.js 20.x
- Express 4.x
- TypeScript 5.x
- PostgreSQL 15
- Prisma ORM
- Zod for validation
- Jest for testing

### Directory Structure
src/
├── controllers/        # Route handlers
├── services/           # Business logic
├── repositories/       # Data access
├── middlewares/        # Auth, validation, error handling
├── utils/              # Helpers
├── types/              # TypeScript types
├── routes/             # Route definitions
└── app.ts              # Express app

### Existing Patterns
- Repository pattern for data access
- Service layer for business logic
- Zod schemas for validation
- Custom error classes
- JWT authentication

### Database
- Existing tables: users, categories
- Prisma schema in prisma/schema.prisma
```

---

## Phase 2: Requirements

### API Requirements

```markdown
## Product Inventory API Requirements

### Endpoints
- POST /api/products - Create product
- GET /api/products - List products (with filters)
- GET /api/products/:id - Get product by ID
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product
- PATCH /api/products/:id/inventory - Update inventory

### Business Rules
- SKU must be unique
- Initial stock can be 0 or greater
- Low stock threshold configurable per product
- Track inventory changes (audit log)

### Authentication
- All endpoints require authentication
- Admin role for create/update/delete
- Read access for all authenticated users
```

---

## Phase 3: Database Design

### Schema Design

```sql
-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    last_restocked_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id)
);

-- Inventory audit log
CREATE TABLE inventory_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    change_type VARCHAR(20) NOT NULL, -- 'add', 'remove', 'adjust'
    quantity_change INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason TEXT,
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity, low_stock_threshold);
CREATE INDEX idx_audit_product ON inventory_audit(product_id);
```

---

## Phase 4: Implementation Plan

### File Plan

```markdown
## Files to Create

src/
├── modules/products/
│   ├── product.controller.ts
│   ├── product.service.ts
│   ├── product.repository.ts
│   ├── product.routes.ts
│   ├── product.validation.ts
│   ├── product.types.ts
│   └── __tests__/
│       ├── product.controller.test.ts
│       ├── product.service.test.ts
│       └── product.integration.test.ts
├── modules/inventory/
│   ├── inventory.controller.ts
│   ├── inventory.service.ts
│   ├── inventory.repository.ts
│   └── inventory.types.ts

prisma/
└── migrations/
    └── XXXX_add_products_inventory.sql

## Files to Modify
- src/routes/index.ts - Add product routes
- prisma/schema.prisma - Add models
```

---

## Phase 5: Implementation

### Step 1: Database Migration

```prisma
// prisma/schema.prisma - Add to existing schema

model Product {
  id          String     @id @default(uuid())
  sku         String     @unique
  name        String
  description String?
  price       Decimal    @db.Decimal(10, 2)
  categoryId  String?    @map("category_id")
  category    Category?  @relation(fields: [categoryId], references: [id])
  inventory   Inventory?
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  @@map("products")
}

model Inventory {
  id                String    @id @default(uuid())
  productId         String    @unique @map("product_id")
  product           Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity          Int       @default(0)
  lowStockThreshold Int       @default(10) @map("low_stock_threshold")
  lastRestockedAt   DateTime? @map("last_restocked_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  @@map("inventory")
}

model InventoryAudit {
  id               String   @id @default(uuid())
  productId        String   @map("product_id")
  changeType       String   @map("change_type")
  quantityChange   Int      @map("quantity_change")
  previousQuantity Int      @map("previous_quantity")
  newQuantity      Int      @map("new_quantity")
  reason           String?
  performedBy      String?  @map("performed_by")
  createdAt        DateTime @default(now()) @map("created_at")

  @@map("inventory_audit")
}
```

### Step 2: Types

```typescript
// src/modules/products/product.types.ts
export interface CreateProductDto {
  sku: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  initialStock?: number;
  lowStockThreshold?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductWithInventory {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string | null;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    isLowStock: boolean;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Step 3: Validation

```typescript
// src/modules/products/product.validation.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    sku: z.string().min(1).max(50),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    price: z.number().positive(),
    categoryId: z.string().uuid().optional(),
    initialStock: z.number().int().min(0).default(0),
    lowStockThreshold: z.number().int().min(0).default(10),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().uuid().nullable().optional(),
  }),
});

export const updateInventorySchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    quantity: z.number().int(),
    reason: z.string().optional(),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    categoryId: z.string().uuid().optional(),
    search: z.string().optional(),
    lowStock: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});
```

### Step 4: Repository

```typescript
// src/modules/products/product.repository.ts
import { PrismaClient, Product, Inventory } from '@prisma/client';
import type { CreateProductDto, UpdateProductDto, ProductFilters } from './product.types';

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        inventory: {
          create: {
            quantity: data.initialStock ?? 0,
            lowStockThreshold: data.lowStockThreshold ?? 10,
          },
        },
      },
      include: { inventory: true },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { inventory: true, category: true },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { sku },
    });
  }

  async findMany(filters: ProductFilters) {
    const { categoryId, search, lowStock, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(lowStock && {
        inventory: {
          quantity: { lte: this.prisma.inventory.fields.lowStockThreshold },
        },
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { inventory: true, category: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: { inventory: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async updateInventory(
    productId: string,
    quantityChange: number,
    reason?: string,
    performedBy?: string
  ): Promise<Inventory> {
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.inventory.findUnique({
        where: { productId },
      });

      if (!current) {
        throw new Error('Inventory not found');
      }

      const newQuantity = current.quantity + quantityChange;

      if (newQuantity < 0) {
        throw new Error('Insufficient inventory');
      }

      // Update inventory
      const updated = await tx.inventory.update({
        where: { productId },
        data: {
          quantity: newQuantity,
          lastRestockedAt: quantityChange > 0 ? new Date() : undefined,
        },
      });

      // Create audit log
      await tx.inventoryAudit.create({
        data: {
          productId,
          changeType: quantityChange > 0 ? 'add' : 'remove',
          quantityChange,
          previousQuantity: current.quantity,
          newQuantity,
          reason,
          performedBy,
        },
      });

      return updated;
    });
  }
}
```

### Step 5: Service

```typescript
// src/modules/products/product.service.ts
import { ProductRepository } from './product.repository';
import type { CreateProductDto, UpdateProductDto, ProductFilters } from './product.types';
import { NotFoundError, ConflictError, ValidationError } from '@/utils/errors';

export class ProductService {
  constructor(private repository: ProductRepository) {}

  async createProduct(data: CreateProductDto) {
    // Check SKU uniqueness
    const existing = await this.repository.findBySku(data.sku);
    if (existing) {
      throw new ConflictError(`Product with SKU ${data.sku} already exists`);
    }

    return this.repository.create(data);
  }

  async getProduct(id: string) {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    return this.formatProduct(product);
  }

  async listProducts(filters: ProductFilters) {
    const result = await this.repository.findMany(filters);
    return {
      data: result.products.map(this.formatProduct),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    return this.repository.update(id, data);
  }

  async deleteProduct(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }

  async updateInventory(
    productId: string,
    quantityChange: number,
    reason?: string,
    performedBy?: string
  ) {
    const product = await this.repository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }

    return this.repository.updateInventory(
      productId,
      quantityChange,
      reason,
      performedBy
    );
  }

  private formatProduct(product: any) {
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      categoryId: product.categoryId,
      category: product.category,
      inventory: product.inventory
        ? {
            quantity: product.inventory.quantity,
            lowStockThreshold: product.inventory.lowStockThreshold,
            isLowStock:
              product.inventory.quantity <= product.inventory.lowStockThreshold,
          }
        : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
```

### Step 6: Controller

```typescript
// src/modules/products/product.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';

export class ProductController {
  constructor(private service: ProductService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.createProduct(req.body);
      res.status(201).json({ data: product });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.getProduct(req.params.id);
      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.listProducts(req.query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.updateProduct(req.params.id, req.body);
      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  updateInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventory = await this.service.updateInventory(
        req.params.id,
        req.body.quantity,
        req.body.reason,
        req.user?.id
      );
      res.json({ data: inventory });
    } catch (error) {
      next(error);
    }
  };
}
```

### Step 7: Routes

```typescript
// src/modules/products/product.routes.ts
import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { prisma } from '@/lib/prisma';
import { authenticate, authorize } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import {
  createProductSchema,
  updateProductSchema,
  updateInventorySchema,
  listProductsSchema,
} from './product.validation';

const router = Router();

// Setup dependencies
const repository = new ProductRepository(prisma);
const service = new ProductService(repository);
const controller = new ProductController(service);

// Routes
router.get(
  '/',
  authenticate,
  validate(listProductsSchema),
  controller.list
);

router.get(
  '/:id',
  authenticate,
  controller.getById
);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createProductSchema),
  controller.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateProductSchema),
  controller.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  controller.delete
);

router.patch(
  '/:id/inventory',
  authenticate,
  authorize('admin'),
  validate(updateInventorySchema),
  controller.updateInventory
);

export { router as productRoutes };
```

---

## Phase 6: Testing

### Unit Tests

```typescript
// src/modules/products/__tests__/product.service.test.ts
import { ProductService } from '../product.service';
import { ProductRepository } from '../product.repository';
import { NotFoundError, ConflictError } from '@/utils/errors';

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateInventory: jest.fn(),
    } as any;
    service = new ProductService(repository);
  });

  describe('createProduct', () => {
    it('should create product with unique SKU', async () => {
      repository.findBySku.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        id: '1',
        sku: 'TEST-001',
        name: 'Test Product',
      } as any);

      const result = await service.createProduct({
        sku: 'TEST-001',
        name: 'Test Product',
        price: 99.99,
      });

      expect(result.sku).toBe('TEST-001');
    });

    it('should throw ConflictError for duplicate SKU', async () => {
      repository.findBySku.mockResolvedValue({ id: '1' } as any);

      await expect(
        service.createProduct({
          sku: 'EXISTING',
          name: 'Test',
          price: 99.99,
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('getProduct', () => {
    it('should return product by ID', async () => {
      repository.findById.mockResolvedValue({
        id: '1',
        name: 'Product',
        inventory: { quantity: 10, lowStockThreshold: 5 },
      } as any);

      const result = await service.getProduct('1');

      expect(result.inventory?.isLowStock).toBe(false);
    });

    it('should throw NotFoundError for missing product', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getProduct('999')).rejects.toThrow(NotFoundError);
    });
  });
});
```

### Integration Tests

```typescript
// src/modules/products/__tests__/product.integration.test.ts
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createTestUser, getAuthToken } from '@/test/helpers';

describe('Product API', () => {
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const user = await createTestUser({ role: 'user' });
    const admin = await createTestUser({ role: 'admin' });
    authToken = getAuthToken(user);
    adminToken = getAuthToken(admin);
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/products', () => {
    it('should create product as admin', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sku: 'TEST-001',
          name: 'Test Product',
          price: 99.99,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.sku).toBe('TEST-001');
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sku: 'TEST-002',
          name: 'Test',
          price: 50,
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/products', () => {
    it('should list products with pagination', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.meta).toHaveProperty('total');
    });
  });
});
```

---

## Phase 8: Deployment

### Migration Command

```bash
npx prisma migrate deploy
```

### Git Commit

```bash
git commit -m "feat(products): add product inventory management API

- Add products and inventory tables
- Add CRUD endpoints for products
- Add inventory update with audit logging
- Add low stock filtering
- Add Zod validation
- Add unit and integration tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

This example demonstrated building a complete Node.js backend API feature with:

- Database schema design with Prisma
- Layered architecture (controller → service → repository)
- Input validation with Zod
- Transaction support for inventory updates
- Audit logging
- Unit and integration testing
- Proper error handling
