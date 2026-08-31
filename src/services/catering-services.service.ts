// src/services/catering-services.service.ts — Lógica de negocio

import * as repo from '../repositories/catering-services.repository';
import { AppError } from '../errors/AppError';
import { CreateCateringDto, UpdateCateringDto } from '../schemas/catering-services.schema';

// Listar servicios con paginación
export async function listServices(page: number, limit: number) {
  return repo.findAll(page, limit);
}

// Obtener un servicio por ID (lanza 404 si no existe)
export async function getService(id: string) {
  const service = await repo.findById(id);

  if (!service) {
    throw new AppError(404, `Servicio de catering con ID ${id} no encontrado`);
  }

  return service;
}

// Crear un nuevo servicio
export async function createService(data: CreateCateringDto) {
  return repo.create(data);
}

// Actualizar un servicio existente
export async function updateService(id: string, data: UpdateCateringDto) {
  return repo.update(id, data);
}

// Eliminar un servicio
export async function deleteService(id: string) {
  return repo.remove(id);
}
