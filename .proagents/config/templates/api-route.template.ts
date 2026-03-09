/**
 * {{routeName}} API Route Template
 *
 * Copy this file and customize for your project.
 * Variables available:
 * - {{routeName}} - Route name (e.g., users, products)
 * - {{RouteName}} - PascalCase name
 * - {{description}} - Route description
 */

// Express example - adapt for your framework (Next.js, Fastify, etc.)
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const router = Router();

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const create{{RouteName}}Schema = z.object({
  // Define your create schema
  name: z.string().min(1).max(255),
});

const update{{RouteName}}Schema = z.object({
  // Define your update schema
  name: z.string().min(1).max(255).optional(),
});

const query{{RouteName}}Schema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
});

// ==========================================
// ROUTES
// ==========================================

/**
 * GET /{{routeName}}
 * List all {{routeName}}
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = query{{RouteName}}Schema.parse(req.query);

    // TODO: Implement list logic
    const items: unknown[] = [];
    const total = 0;

    res.json({
      data: items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /{{routeName}}/:id
 * Get single {{routeName}} by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // TODO: Implement get by ID logic
    const item = null;

    if (!item) {
      return res.status(404).json({
        error: 'Not Found',
        message: '{{RouteName}} not found',
      });
    }

    res.json({ data: item });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /{{routeName}}
 * Create new {{routeName}}
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = create{{RouteName}}Schema.parse(req.body);

    // TODO: Implement create logic
    const created = { id: 'new-id', ...data };

    res.status(201).json({ data: created });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /{{routeName}}/:id
 * Update existing {{routeName}}
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = update{{RouteName}}Schema.parse(req.body);

    // TODO: Implement update logic
    const updated = { id, ...data };

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /{{routeName}}/:id
 * Delete {{routeName}}
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // TODO: Implement delete logic

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
