// ============================================================================
// CONTROLLER — Recibo la petición, llamo al service, y respondo
// ============================================================================
// Regla: cada función hace solo 3 cosas:
//   1. Extraer datos del request
//   2. Llamar al service
//   3. Enviar la respuesta

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/catering-services.service.js';
import { CreateCateringServiceDto, UpdateCateringServiceDto } from '../types.js';

// GET /api/v1/catering-services?page=1&limit=10
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await service.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/catering-services/:id
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Bad Request', message: 'El ID debe ser un número válido' });
      return;
    }

    const cateringService = await service.findById(id);

    if (!cateringService) {
      res.status(404).json({ error: 'Not Found', message: `No se encontró el servicio con ID ${id}` });
      return;
    }

    res.json({ data: cateringService });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/catering-services
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, category, pricePerPerson, minPeople, isAvailable } = req.body;

    // Verifico que me manden los campos obligatorios
    if (!name || !category || pricePerPerson === undefined || minPeople === undefined) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Faltan campos obligatorios: name, category, pricePerPerson, minPeople',
      });
      return;
    }

    const dto: CreateCateringServiceDto = {
      name,
      category,
      pricePerPerson: Number(pricePerPerson),
      minPeople: Number(minPeople),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    };

    const created = await service.create(dto);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/catering-services/:id
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Bad Request', message: 'El ID debe ser un número válido' });
      return;
    }

    const dto: UpdateCateringServiceDto = req.body;
    const updated = await service.update(id, dto);

    if (!updated) {
      res.status(404).json({ error: 'Not Found', message: `No se encontró el servicio con ID ${id} para actualizar` });
      return;
    }

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/catering-services/:id
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Bad Request', message: 'El ID debe ser un número válido' });
      return;
    }

    const deleted = await service.remove(id);

    if (!deleted) {
      res.status(404).json({ error: 'Not Found', message: `No se encontró el servicio con ID ${id} para eliminar` });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
