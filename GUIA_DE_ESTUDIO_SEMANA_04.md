# 📖 Guía de Estudio — Semana 04: Validación con Zod y Manejo Centralizado de Errores

## ¿Qué aprendí esta semana?

En la semana 03 aprendí a separar el código en **4 capas** (Routes, Controllers, Services, Repositories). Pero había un problema: en los controladores teníamos un montón de código repetitivo haciendo validaciones a mano con `if (!name) ...` o `isNaN(id)`, y los errores estaban dispersos por todos lados.

Esta semana 04 di el siguiente salto de calidad:
1. **Validación declarativa con Zod**: Ya no escribo validaciones manuales. Creo un esquema (el contrato) y Zod valida todo automáticamente.
2. **Middlewares de validación**: Interceptan la petición *antes* de que llegue al controlador. Si los datos están mal, el controlador ni siquiera se ejecuta.
3. **Controladores delgados (*Thin Controllers*)**: Los controladores quedaron súper limpios (extraer → llamar al servicio → responder).
4. **Clases de error personalizadas**: Creé `AppError`, `NotFoundError`, `ValidationError`, etc. para saber exactamente qué falló y qué status HTTP responder.
5. **Manejo Centralizado de Errores**: Un único middleware global de 4 parámetros `(err, req, res, next)` que atrapa todos los errores y devuelve respuestas en formato JSON uniforme.

---

## 🛡️ 1. ¿Por qué usar Zod en vez de validar a mano?

### Antes (Semana 03 - Manual y frágil):
```ts
if (!name || !category || pricePerPerson === undefined || minPeople === undefined) {
  res.status(400).json({ error: 'Faltan campos obligatorios' });
  return;
}
if (typeof pricePerPerson !== 'number' || pricePerPerson <= 0) { ... }
```
*Problemas*: Código largo, difícil de mantener, mensajes de error inconsistentes y propenso a olvidos.

### Ahora (Semana 04 - Declarativo con Zod):
```ts
export const createCateringSchema = z.object({
  name: z.string().trim().min(3).max(100),
  category: z.enum(['Buffet', 'Coffee Break', 'Banquete', 'Postres', 'Cocktail']),
  pricePerPerson: z.number().positive().max(10000),
  minPeople: z.number().int().min(1),
  isAvailable: z.boolean().optional().default(true),
});
```
*Ventajas*:
- Valida tipos, rangos, strings vacíos y valores por defecto en una sola definición.
- **Single Source of Truth**: Con `z.infer<typeof createCateringSchema>` obtengo automáticamente el tipo TypeScript sin escribirlo dos veces.

---

## 🚪 2. El Middleware de Validación (El Guardia en la Puerta)

Un middleware de validación actúa como un guardia: revisa los datos de la petición. Si cumplen el esquema, deja pasar (`next()`); si no, frena la petición y manda un error 400 con la lista exacta de campos que fallaron.

```ts
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(new ValidationError('Datos del cuerpo (body) inválidos', fieldErrors));
    }

    req.body = result.data; // Datos limpios y tipados
    next();
  };
}
```

---

## 🏷️ 3. Clases de Error Personalizadas

Para no lanzar simples strings ni `new Error('algo falló')`, creamos una jerarquía de errores que heredan de `Error`:

```text
Error (nativo de JS)
  └── AppError (clase base con statusCode e isOperational)
        ├── NotFoundError (404)
        ├── BadRequestError (400)
        ├── ValidationError (400 + array de errores de campo)
        └── ConflictError (409)
```

### Ejemplo en el Service:
Cuando el servicio no encuentra un elemento, simplemente lanza el error:
```ts
export async function findById(id: number) {
  const service = await repo.findById(id);
  if (!service) {
    throw new NotFoundError(`No se encontró el servicio con ID ${id}`);
  }
  return service;
}
```

---

## 🎯 4. El Middleware Global de Errores (Los 4 Parámetros Mágicos)

En Express, una función con **exactamente 4 parámetros** `(err, req, res, next)` es reconocida como el **Manejador de Errores Global**:

```ts
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Si es error de validación
  if (err instanceof ValidationError) {
    res.status(400).json({
      error: err.name,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // 2. Si es un error operativo conocido (404, 400, etc.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  // 3. Error inesperado (500)
  console.error('💥 [Error Inesperado]:', err);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'Ocurrió un error inesperado en el servidor.',
  });
}
```

> **Regla de oro de Express**: El `errorHandler` debe colocarse **siempre al final** de `app.ts`, después de todas las rutas y del handler 404.

---

## 🔄 5. Flujo Completo de una Petición

### Caso A: Petición Válida (`POST /api/v1/catering-services`)
1. Petición entra a Express.
2. `express.json()` parsea el body a objeto JS.
3. `loggerMiddleware` inicia el contador de tiempo.
4. `validateBody(createCateringSchema)` ejecuta `safeParse(req.body)`. Como es válido, llama `next()`.
5. El Controller recibe datos limpios y llama a `service.create(req.body)`.
6. El Service guarda en el Repository y devuelve el objeto creado.
7. El Controller responde `201 Created` con `{ data: created }`.

### Caso B: Petición Inválida (`POST /api/v1/catering-services` con precio negativo)
1. `validateBody` ejecuta `safeParse(req.body)`.
2. Zod detecta que `pricePerPerson` es negativo.
3. El middleware genera un `ValidationError` con `[{ field: "pricePerPerson", message: "El precio por persona debe ser mayor a 0" }]`.
4. Llama a `next(error)`.
5. Express se salta todos los middlewares normales y salta directo al `errorHandler`.
6. `errorHandler` responde `400 Bad Request` con el JSON de error estructurado.

---

## 📋 Resumen de Contratos de Respuesta de Error

| Código | Error | Formato de Respuesta |
|--------|-------|----------------------|
| **400** | Datos inválidos (Zod) | `{"error": "ValidationError", "message": "...", "errors": [{"field": "...", "message": "..."}]}` |
| **400** | JSON mal formado | `{"error": "BadRequestError", "message": "El cuerpo contiene un JSON mal formado..."}` |
| **404** | ID no encontrado | `{"error": "NotFoundError", "message": "No se encontró el servicio con ID 99"}` |
| **404** | Ruta inexistente | `{"error": "NotFoundError", "message": "La ruta 'GET /ruta-falsa' no existe..."}` |
| **500** | Error no controlado | `{"error": "InternalServerError", "message": "Ocurrió un error inesperado..."}` |
