// ============================================================================
// SERVICE — Aquí va la lógica de mi negocio (sin nada de Express)
// ============================================================================

import { CateringService, CreateCateringServiceDto, UpdateCateringServiceDto, PaginatedResponse, PaginationParams } from '../types.js';
import * as repo from '../repositories/catering-services.repository.js';

// Traer todos los servicios con paginación
export async function findAll(params: PaginationParams): Promise<PaginatedResponse<CateringService>> {
  const { page, limit } = params;
  const all = await repo.findAll();

  // Calculo desde dónde cortar el array para la página que me piden
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return { data, total: all.length, page, limit };
}

// Buscar un servicio por ID
export async function findById(id: number): Promise<CateringService | undefined> {
  return repo.findById(id);
}

// Crear un servicio nuevo
export async function create(dto: CreateCateringServiceDto): Promise<CateringService> {
  return repo.create(dto);
}

// Actualizar un servicio existente
export async function update(id: number, dto: UpdateCateringServiceDto): Promise<CateringService | undefined> {
  const exists = await repo.findById(id);
  if (!exists) return undefined;

  return repo.update(id, dto);
}

// Eliminar un servicio
export async function remove(id: number): Promise<boolean> {
  const exists = await repo.findById(id);
  if (!exists) return false;

  return repo.remove(id);
}
