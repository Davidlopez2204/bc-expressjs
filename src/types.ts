// ============================================================================
// TIPOS — SERVICIO DE CATERING (SEMANA 03)
// ============================================================================

// Lo que representa un servicio de catering en mi sistema
export interface CateringService {
  id: number;
  name: string;
  category: string;
  pricePerPerson: number;
  minPeople: number;
  isAvailable: boolean;
  createdAt: string;
}

// Para crear un servicio nuevo (sin id ni fecha, esos los pone el servidor)
export type CreateCateringServiceDto = Omit<CateringService, 'id' | 'createdAt'>;

// Para actualizar un servicio (todos los campos son opcionales)
export type UpdateCateringServiceDto = Partial<CreateCateringServiceDto>;

// Respuesta cuando devuelvo UN solo elemento
export interface SingleResponse<T> {
  data: T;
}

// Respuesta cuando devuelvo una LISTA con paginación
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Respuesta cuando hay un error
export interface ErrorResponse {
  error: string;
  message: string;
}

// Los parámetros de paginación que me llegan por query string
export interface PaginationParams {
  page: number;
  limit: number;
}
