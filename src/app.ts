// ============================================================================
// APP — Configuración de Express y middlewares
// ============================================================================

import express, { Request, Response, NextFunction } from 'express';
import { cateringRouter } from './routes/catering-services.routes.js';
import { ErrorResponse } from './types.js';

export const app = express();

// 1. Parseo del body en JSON
app.use(express.json());

// 2. Logger personalizado — muestra cada petición que llega
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Ruta raíz informativa
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'API REST Servicio de Catering',
    version: '2.0.0',
    documentation: '/api/v1/catering-services',
  });
});

// 3. Rutas de la API
app.use('/api/v1/catering-services', cateringRouter);

// 4. Handler 404 — cuando la ruta no existe
app.use((req: Request, res: Response) => {
  const response: ErrorResponse = {
    error: 'Not Found',
    message: `La ruta '${req.method} ${req.originalUrl}' no existe en este servidor.`,
  };
  res.status(404).json(response);
});

// 5. Handler de errores global — atrapa cualquier error no controlado
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err.message);

  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: err.message || 'Ocurrió un error inesperado.',
  };
  res.status(500).json(response);
});
