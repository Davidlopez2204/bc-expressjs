// ============================================================================
// ESQUEMAS DE VALIDACIÓN CON ZOD (SEMANA 04)
// ============================================================================
// Aquí definimos los contratos y reglas que deben cumplir los datos que
// entran a nuestra API (body, params, query).

import { z } from 'zod';

// Categorías permitidas en el sistema de catering
export const CATERING_CATEGORIES = [
  'Buffet',
  'Coffee Break',
  'Banquete',
  'Postres',
  'Cocktail',
] as const;

// 1. Esquema para CREAR un nuevo servicio de catering (POST /api/v1/catering-services)
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

// 2. Esquema para ACTUALIZAR un servicio (PUT /api/v1/catering-services/:id)
// Todos los campos son opcionales, pero al menos uno debe enviarse
export const updateCateringSchema = createCateringSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });

// 3. Esquema para validar el parámetro de ruta :id (/api/v1/catering-services/:id)
export const idParamSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'El ID es obligatorio',
      invalid_type_error: 'El ID debe ser un número válido',
    })
    .int('El ID debe ser un número entero')
    .positive('El ID debe ser un número positivo mayor a 0'),
});

// 4. Esquema para validar los query parameters de paginación (?page=1&limit=10)
export const paginationQuerySchema = z.object({
  page: z.coerce
    .number({
      invalid_type_error: 'La página debe ser un número',
    })
    .int('La página debe ser un entero')
    .positive('La página debe ser mayor a 0')
    .optional()
    .default(1),

  limit: z.coerce
    .number({
      invalid_type_error: 'El límite debe ser un número',
    })
    .int('El límite debe ser un entero')
    .positive('El límite debe ser mayor a 0')
    .max(100, 'El límite máximo permitido por página es 100')
    .optional()
    .default(10),
});
