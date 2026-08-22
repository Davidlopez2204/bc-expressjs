// ============================================================================
// SERVICE — Lógica de Negocio (Semana 04)
// ============================================================================
// No sabe nada de Express (no usa req, res, next).
// Cuando un recurso no existe, lanza un `NotFoundError` que el middleware de
// errores se encarga de capturar y responder con 404.

import {
  CateringService,
  CreateCateringServiceDto,
  UpdateCateringServiceDto,
  PaginatedResponse,
  PaginationParams,
} from '../types.js';
import * as repo from '../repositories/catering-services.repository.js';
import { NotFoundError } from '../errors/app-error.js';

// Listar servicios con paginación
export async function findAll(
  params: PaginationParams
): Promise<PaginatedResponse<CateringService>> {
  const { page, limit } = params;
  const all = await repo.findAll();

  const total = all.length;
  const totalPages = Math.ceil(total / limit) || 1;

  // Calculamos el índice inicial para recortar la lista
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

// Buscar un servicio por su ID (lanza NotFoundError si no existe)
export async function findById(id: number): Promise<CateringService> {
  const service = await repo.findById(id);

  if (!service) {
    throw new NotFoundError(`No se encontró el servicio de catering con ID ${id}`);
  }

  return service;
}

// Crear un nuevo servicio
export async function create(dto: CreateCateringServiceDto): Promise<CateringService> {
  return repo.create(dto);
}

// Actualizar un servicio existente (lanza NotFoundError si no existe)
export async function update(
  id: number,
  dto: UpdateCateringServiceDto
): Promise<CateringService> {
  // Verificamos primero si existe
  const exists = await repo.findById(id);
  if (!exists) {
    throw new NotFoundError(
      `No se encontró el servicio de catering con ID ${id} para actualizar`
    );
  }

  const updated = await repo.update(id, dto);
  if (!updated) {
    throw new NotFoundError(
      `No se pudo actualizar el servicio de catering con ID ${id}`
    );
  }

  return updated;
}

// Eliminar un servicio por ID (lanza NotFoundError si no existe)
export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) {
    throw new NotFoundError(
      `No se encontró el servicio de catering con ID ${id} para eliminar`
    );
  }

  await repo.remove(id);
}
