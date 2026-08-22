// ============================================================================
// ROUTES — Rutas de la API con Middlewares de Validación (Semana 04)
// ============================================================================
// Aquí conectamos cada ruta HTTP con sus middlewares de validación Zod
// y el controlador correspondiente.

import { Router } from 'express';
import * as controller from '../controllers/catering-services.controller.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares/validate.middleware.js';
import {
  createCateringSchema,
  updateCateringSchema,
  idParamSchema,
  paginationQuerySchema,
} from '../schemas/catering-services.schema.js';

export const cateringRouter = Router();

// GET /api/v1/catering-services?page=1&limit=10 (Valida query params de paginación)
cateringRouter.get(
  '/',
  validateQuery(paginationQuerySchema),
  controller.getAll
);

// GET /api/v1/catering-services/:id (Valida que :id sea un entero positivo)
cateringRouter.get(
  '/:id',
  validateParams(idParamSchema),
  controller.getById
);

// POST /api/v1/catering-services (Valida el body completo con Zod)
cateringRouter.post(
  '/',
  validateBody(createCateringSchema),
  controller.create
);

// PUT /api/v1/catering-services/:id (Valida :id y el body parcial con Zod)
cateringRouter.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateCateringSchema),
  controller.update
);

// DELETE /api/v1/catering-services/:id (Valida que :id sea un entero positivo)
cateringRouter.delete(
  '/:id',
  validateParams(idParamSchema),
  controller.remove
);
