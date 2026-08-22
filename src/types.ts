// ============================================================================
// TIPOS — SERVICIO DE CATERING (SEMANA 04)
// ============================================================================
// Tipos TypeScript e interfaces inferidas desde los esquemas Zod.

import { z } from 'zod';
import {
  createCateringSchema,
  updateCateringSchema,
  paginationQuerySchema,
  idParamSchema,
  CATERING_CATEGORIES,
} from './schemas/catering-services.schema.js';
import { FieldError } from './errors/app-error.js';

// Tipo de las categorías válidas
export type CateringCategory = (typeof CATERING_CATEGORIES)[number];

// Modelo principal: lo que representa un servicio de catering en el sistema
export interface CateringService {
  id: number;
  name: string;
  category: CateringCategory;
  pricePerPerson: number;
  minPeople: number;
  isAvailable: boolean;
  createdAt: string;
}

// DTOs inferidos automáticamente a partir de los esquemas Zod (Single Source of Truth)
export type CreateCateringServiceDto = z.infer<typeof createCateringSchema>;
export type UpdateCateringServiceDto = z.infer<typeof updateCateringSchema>;
export type PaginationParams = z.infer<typeof paginationQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;

// Contrato cuando la API responde con un solo elemento
export interface SingleResponse<T> {
  data: T;
}

// Contrato cuando la API responde con una lista paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Contrato estándar para respuestas de error simples
export interface ErrorResponse {
  error: string;
  message: string;
}

// Contrato para respuestas de error de validación detalladas
export interface ValidationErrorResponse extends ErrorResponse {
  errors: FieldError[];
}
