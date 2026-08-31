// src/schemas/catering-services.schema.ts — Validación Zod para CateringService

import { z } from 'zod';

export const CATERING_CATEGORIES = [
  'Buffet',
  'Coffee Break',
  'Banquete',
  'Postres',
  'Cocktail',
] as const;

// Esquema para CREAR un nuevo servicio de catering
export const createCateringSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),

  category: z.enum(CATERING_CATEGORIES, {
    errorMap: () => ({
      message: `Categoría inválida. Opciones válidas: ${CATERING_CATEGORIES.join(', ')}`,
    }),
  }),

  pricePerPerson: z
    .number({
      required_error: 'El precio por persona es obligatorio',
      invalid_type_error: 'El precio por persona debe ser un número',
    })
    .positive('El precio por persona debe ser mayor a 0')
    .max(10000, 'El precio por persona no puede superar 10000 USD'),

  minPeople: z
    .number({
      required_error: 'El mínimo de personas es obligatorio',
      invalid_type_error: 'El mínimo de personas debe ser un número',
    })
    .int('El mínimo de personas debe ser un número entero')
    .min(1, 'El mínimo de personas debe ser al menos 1'),

  isAvailable: z
    .boolean({
      invalid_type_error: 'El campo isAvailable debe ser booleano (true o false)',
    })
    .optional()
    .default(true),
});

// Esquema para ACTUALIZAR (todos opcionales)
export const updateCateringSchema = createCateringSchema.partial();

// Tipos inferidos
export type CreateCateringDto = z.infer<typeof createCateringSchema>;
export type UpdateCateringDto = z.infer<typeof updateCateringSchema>;
