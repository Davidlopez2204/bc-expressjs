// src/controllers/menu-items.controller.ts — Capa HTTP para MenuItem

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/menu-items.service';
import { createMenuItemSchema } from '../schemas/menu-items.schema';

// GET /api/v1/catering-services/:serviceId/menu-items
export async function getByServiceId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await service.listItems(req.params['serviceId']!);
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/catering-services/:serviceId/menu-items
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createMenuItemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: 'error', message: parsed.error.errors.map(e => e.message).join(', ') });
      return;
    }
    const created = await service.createItem(req.params['serviceId']!, parsed.data);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/catering-services/:serviceId/menu-items/:id
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await service.deleteItem(req.params['serviceId']!, req.params['id']!);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
