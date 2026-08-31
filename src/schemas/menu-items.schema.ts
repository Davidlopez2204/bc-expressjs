// src/schemas/menu-items.schema.ts — Validación Zod para MenuItem

import { z } from 'zod';

// Esquema para CREAR un nuevo ítem de menú
export const createMenuItemSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del ítem es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),

  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede exceder los 500 caracteres')
    .optional()
    .nullable(),
});

// Tipo inferido
export type CreateMenuItemDto = z.infer<typeof createMenuItemSchema>;
