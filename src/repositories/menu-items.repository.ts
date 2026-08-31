// src/repositories/menu-items.repository.ts — Acceso a datos para MenuItem

import { prisma } from '../lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '../errors/AppError';
import { CreateMenuItemDto } from '../schemas/menu-items.schema';

// Obtener todos los ítems de un servicio
export async function findByServiceId(serviceId: string) {
  return prisma.menuItem.findMany({
    where: { cateringServiceId: serviceId },
    orderBy: { createdAt: 'desc' },
  });
}

// Buscar un ítem por ID
export async function findById(id: string) {
  return prisma.menuItem.findUnique({ where: { id } });
}

// Crear un ítem asociado a un servicio
export async function create(serviceId: string, data: CreateMenuItemDto) {
  return prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      cateringServiceId: serviceId,
    },
  });
}

// Eliminar un ítem (captura P2025)
export async function remove(id: string) {
  try {
    await prisma.menuItem.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Ítem de menú con ID ${id} no encontrado`);
    }
    throw err;
  }
}
