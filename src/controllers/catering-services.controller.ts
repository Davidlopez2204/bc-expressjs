// src/controllers/catering-services.controller.ts — Capa HTTP

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/catering-services.service';
import { createCateringSchema, updateCateringSchema } from '../schemas/catering-services.schema';

// GET /api/v1/catering-services?page=1&limit=10
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query['limit']) || 10));
    const result = await service.listServices(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/catering-services/:id
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cateringService = await service.getService(req.params['id']!);
    res.json({ data: cateringService });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/catering-services
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createCateringSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: 'error', message: parsed.error.errors.map(e => e.message).join(', ') });
      return;
    }
    const created = await service.createService(parsed.data);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/catering-services/:id
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = updateCateringSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: 'error', message: parsed.error.errors.map(e => e.message).join(', ') });
      return;
    }
    const updated = await service.updateService(req.params['id']!, parsed.data);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/catering-services/:id
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await service.deleteService(req.params['id']!);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
