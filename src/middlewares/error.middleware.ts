// ============================================================================
// MIDDLEWARES DE MANEJO DE ERRORES (SEMANA 04)
// ============================================================================
// Centralizan la captura y el formato de todas las respuestas de error.

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, NotFoundError, ValidationError } from '../errors/app-error.js';

// 1. Handler para rutas 404 que no existen en el servidor
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const error = new NotFoundError(
    `La ruta '${req.method} ${req.originalUrl}' no existe en este servidor.`
  );
  next(error);
}

// 2. Handler global de errores (debe tener exactamente 4 parámetros)
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // A) Error de validación con lista de campos (nuestra clase ValidationError)
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // B) Si un ZodError llegara directamente sin envolver
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Error de validación en los datos enviados',
      errors: err.errors.map((e) => ({
        field: e.path.join('.') || 'root',
        message: e.message,
      })),
    });
    return;
  }

  // C) Otros errores conocidos de nuestra aplicación (AppError, NotFoundError, BadRequestError, etc.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  // D) Error cuando el cliente envía un JSON con sintaxis rota
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      error: 'BadRequestError',
      message: 'El cuerpo de la petición contiene un JSON mal formado o con sintaxis inválida.',
    });
    return;
  }

  // E) Error inesperado / Bug no controlado (500)
  console.error('💥 [Error Inesperado]:', err);

  res.status(500).json({
    error: 'InternalServerError',
    message: 'Ocurrió un error inesperado en el servidor.',
  });
}
