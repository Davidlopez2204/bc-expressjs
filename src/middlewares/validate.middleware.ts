// ============================================================================
// MIDDLEWARE DE VALIDACIÓN CON ZOD (SEMANA 04)
// ============================================================================
// Intercepta la petición ANTES de que llegue al controlador y valida
// que los datos cumplan con el esquema. Si no cumplen, no deja pasar la petición.

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError, FieldError } from '../errors/app-error.js';

// Convierte un ZodError en una lista amigable de errores por campo
function formatZodErrors(error: ZodError): FieldError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.') || 'root',
    message: err.message,
  }));
}

// Valida el BODY de la petición (POST, PUT, PATCH)
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = formatZodErrors(result.error);
      return next(new ValidationError('Datos del cuerpo (body) inválidos', fieldErrors));
    }

    // Reemplazamos req.body con los datos parseados y tipados por Zod
    req.body = result.data;
    next();
  };
}

// Valida los PARÁMETROS de ruta (ej: /:id)
export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const fieldErrors = formatZodErrors(result.error);
      return next(new ValidationError('Parámetros de ruta inválidos', fieldErrors));
    }

    // Actualizamos req.params con los valores convertidos (ej: id convertido a number)
    req.params = result.data as Record<string, string>;
    next();
  };
}

// Valida los QUERY PARAMETERS (ej: ?page=1&limit=10)
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const fieldErrors = formatZodErrors(result.error);
      return next(new ValidationError('Parámetros de consulta (query) inválidos', fieldErrors));
    }

    // Actualizamos req.query con los valores parseados con sus valores por defecto
    req.query = result.data as Record<string, any>;
    next();
  };
}
