import express, { Request, Response, NextFunction } from 'express';
import { cateringRouter } from './routes/catering-services.routes.js';

export const app = express();

// ============================================================================
// MIDDLEWARES REQUERIDOS (ORDEN ESTRICTO DE REGISTRO)
// ============================================================================

// 1. express.json() — Parseo del cuerpo de peticiones en formato JSON
app.use(express.json());

// 2. Logger personalizado — Registra Método, URL, Status HTTP y tiempo de respuesta
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, url } = req;

  // Escuchamos el evento 'finish' del objeto de respuesta para medir el tiempo real
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    console.log(`[${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms`);
  });

  next();
});

// Ruta raíz informativa
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'API REST Servicio de Catering',
    version: '1.0.0',
    documentation: '/api/v1/catering-services',
  });
});

// 3. Registro de Rutas API (Prefijo /api/v1/catering-services)
app.use('/api/v1/catering-services', cateringRouter);

// 4. Handler 404 — Captura cualquier ruta inexistente
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    message: `La ruta '${req.method} ${req.originalUrl}' no existe en este servidor API REST.`,
  });
});

// 5. Handler de Error Global (Middleware de 4 parámetros: err, req, res, next)
// Debe ir SIEMPRE al final de todos los app.use()
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error no controlado en la aplicación:', err.stack || err.message);

  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Ocurrió un error inesperado al procesar la solicitud.',
  });
});
