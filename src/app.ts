// ============================================================================
// APP — Configuración de Express, Middlewares y Pipeline (Semana 04)
// ============================================================================

import express, { Request, Response } from 'express';
import { cateringRouter } from './routes/catering-services.routes.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import {
  notFoundHandler,
  errorHandler,
} from './middlewares/error.middleware.js';

export const app = express();

// 1. Middleware para parsear cuerpos de peticiones en formato JSON
app.use(express.json());

// 2. Middleware de logging de peticiones con tiempo de respuesta
app.use(loggerMiddleware);

// 3. Ruta raíz informativa
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'API REST Servicio de Catering — Semana 04',
    version: '4.0.0',
    description: 'API REST con Arquitectura en Capas, Validación Zod y Manejo Centralizado de Errores',
    documentation: '/api/v1/catering-services',
    endpoints: {
      getAll: 'GET /api/v1/catering-services?page=1&limit=10',
      getById: 'GET /api/v1/catering-services/:id',
      create: 'POST /api/v1/catering-services',
      update: 'PUT /api/v1/catering-services/:id',
      delete: 'DELETE /api/v1/catering-services/:id',
    },
  });
});

// 4. Rutas principales de la API de catering
app.use('/api/v1/catering-services', cateringRouter);

// 5. Middleware 404 para atrapar cualquier ruta no definida
app.use(notFoundHandler);

// 6. Middleware global de manejo de errores (debe ser el ÚLTIMO middleware registrado)
app.use(errorHandler);
