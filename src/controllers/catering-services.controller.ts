// ============================================================================
// CONTROLLER — Controlador Delgado (Thin Controller - Semana 04)
// ============================================================================
// Como la validación ahora vive en los middlewares de Zod, los controladores
// son súper limpios y hacen únicamente 3 pasos:
//   1. Extraer los datos ya validados (req.body, req.params, req.query)
//   2. Llamar al service
//   3. Enviar la respuesta HTTP con el status adecuado

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/catering-services.service.js';
import {
  CreateCateringServiceDto,
  UpdateCateringServiceDto,
  PaginationParams,
} from '../types.js';

// GET /api/v1/catering-services?page=1&limit=10
export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const params = req.query as unknown as PaginationParams;
    const result = await service.findAll(params);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/catering-services/:id
export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const cateringService = await service.findById(id);
    res.status(200).json({ data: cateringService });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/catering-services
export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto = req.body as CreateCateringServiceDto;
    const created = await service.create(dto);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/catering-services/:id
export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const dto = req.body as UpdateCateringServiceDto;
    const updated = await service.update(id, dto);
    res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/catering-services/:id
export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    await service.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
