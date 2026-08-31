// src/services/menu-items.service.ts — Lógica de negocio para MenuItem

import * as menuItemRepo from '../repositories/menu-items.repository';
import * as cateringRepo from '../repositories/catering-services.repository';
import { AppError } from '../errors/AppError';
import { CreateMenuItemDto } from '../schemas/menu-items.schema';

// Listar ítems de un servicio
export async function listItems(serviceId: string) {
  const service = await cateringRepo.findById(serviceId);
  if (!service) {
    throw new AppError(404, `Servicio de catering con ID ${serviceId} no encontrado`);
  }

  return menuItemRepo.findByServiceId(serviceId);
}

// Crear un ítem en un servicio
export async function createItem(serviceId: string, data: CreateMenuItemDto) {
  const service = await cateringRepo.findById(serviceId);
  if (!service) {
    throw new AppError(404, `Servicio de catering con ID ${serviceId} no encontrado`);
  }

  return menuItemRepo.create(serviceId, data);
}

// Eliminar un ítem
export async function deleteItem(serviceId: string, id: string) {
  const service = await cateringRepo.findById(serviceId);
  if (!service) {
    throw new AppError(404, `Servicio de catering con ID ${serviceId} no encontrado`);
  }

  const item = await menuItemRepo.findById(id);
  if (!item || item.cateringServiceId !== serviceId) {
    throw new AppError(404, `Ítem de menú con ID ${id} no encontrado en el servicio ${serviceId}`);
  }

  return menuItemRepo.remove(id);
}
