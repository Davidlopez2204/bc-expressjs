// ============================================================================
// ERRORES PERSONALIZADOS (SEMANA 04)
// ============================================================================
// Crear clases de error nos permite saber exactamente qué tipo de fallo ocurrió
// y qué código de estado HTTP corresponde devolver al cliente.

// Clase base para todos los errores operativos de nuestra aplicación
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = this.constructor.name;

    // Mantiene la traza de la pila limpia en V8
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error 404: Cuando el recurso solicitado no existe
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

// Error 400: Petición incorrecta o datos inválidos
export class BadRequestError extends AppError {
  constructor(message = 'Petición inválida') {
    super(message, 400);
  }
}

// Detalle de un error de campo (usado por Zod)
export interface FieldError {
  field: string;
  message: string;
}

// Error 400 específico para fallos de validación con lista de campos
export class ValidationError extends AppError {
  public readonly errors: FieldError[];

  constructor(message = 'Error de validación en los datos enviados', errors: FieldError[] = []) {
    super(message, 400);
    this.errors = errors;
  }
}

// Error 409: Conflicto con el estado actual del recurso
export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el recurso existente') {
    super(message, 409);
  }
}
