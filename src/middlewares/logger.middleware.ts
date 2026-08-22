// ============================================================================
// MIDDLEWARE DE LOGGING (SEMANA 04)
// ============================================================================
// Registra en consola cada petición HTTP que llega con su tiempo de respuesta.

import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const status = res.statusCode;

    // Emoticono según el status code para fácil lectura en consola
    const statusIcon = status >= 500 ? '💥' : status >= 400 ? '⚠️' : '✅';

    console.log(
      `[${timestamp}] ${statusIcon} ${req.method} ${req.originalUrl || req.url} ${status} - ${duration}ms`
    );
  });

  next();
}
