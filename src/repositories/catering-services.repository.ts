// src/repositories/catering-services.repository.ts — Acceso a datos con Prisma

import { prisma } from '../lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '../errors/AppError';
import { CreateCateringDto, UpdateCateringDto } from '../schemas/catering-services.schema';

// Listar con paginación e incluir menuItems
export async function findAll(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const data = await prisma.cateringService.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { menuItems: true },
  });

  const total = await prisma.cateringService.count();

  return { data, total, page, limit };
}

// Buscar por ID (incluye menuItems)
export async function findById(id: string) {
  return prisma.cateringService.findUnique({
    where: { id },
    include: { menuItems: true },
  });
}

// Crear un nuevo servicio (captura P2002)
export async function create(data: CreateCateringDto) {
  try {
    return await prisma.cateringService.create({ data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, `Ya existe un servicio de catering con el nombre '${data.name}'`);
    }
    throw err;
  }
}

// Actualizar un servicio (captura P2025 y P2002)
export async function update(id: string, data: UpdateCateringDto) {
  try {
    return await prisma.cateringService.update({ where: { id }, data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw new AppError(404, `Servicio de catering con ID ${id} no encontrado`);
      }
      if (err.code === 'P2002') {
        throw new AppError(409, 'Ya existe un servicio de catering con ese nombre');
      }
    }
    throw err;
  }
}

// Eliminar un servicio (captura P2025)
export async function remove(id: string) {
  try {
    await prisma.cateringService.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Servicio de catering con ID ${id} no encontrado`);
    }
    throw err;
  }
}
