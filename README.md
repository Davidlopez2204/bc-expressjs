# 🍽️ Proyecto Semana 04 — Validación con Zod y Manejo Centralizado de Errores

API REST profesional para un **Servicio de Catering** construida con **Express 5 + TypeScript**, incorporando **validación declarativa con Zod**, **middlewares reutilizables**, **clases de error personalizadas** y un **manejador global de errores**.

---

## 📌 Dominio: Servicio de Catering

Recurso principal: `CateringService`

| Campo | Tipo | Validación (Zod) | Descripción |
|-------|------|------------------|-------------|
| `id` | `number` | Autoincremental / `int().positive()` | Identificador único |
| `name` | `string` | `min(3).max(100).trim()` | Nombre del menú o paquete |
| `category` | `string` | `enum('Buffet', 'Coffee Break', 'Banquete', 'Postres', 'Cocktail')` | Categoría del servicio |
| `pricePerPerson` | `number` | `positive().max(10000)` | Precio en USD por comensal |
| `minPeople` | `number` | `int().min(1)` | Cantidad mínima de invitados |
| `isAvailable` | `boolean` | `boolean().optional().default(true)` | Disponibilidad del servicio |
| `createdAt` | `string` | ISO 8601 (automático) | Fecha de registro |

---

## 🏗️ Arquitectura y Estructura del Proyecto

```
Cliente HTTP 
   ⬇
[ express.json() ] 
   ⬇
[ loggerMiddleware ] 
   ⬇
[ validateMiddleware (Zod) ] ── (si falla) ──┐
   ⬇                                        │
[ routes ]                                   │
   ⬇                                        │
[ controllers (Thin) ]                       │
   ⬇                                        │
[ services ] ── (si no existe) ──────────────┤
   ⬇                                        │
[ repositories ]                             │
   ⬇                                        │
[ Store en memoria ]                         │
                                            ▼
                              [ notFoundHandler / errorHandler (Global) ]
```

```text
src/
├── errors/
│   └── app-error.ts                      # Clases: AppError, NotFoundError, ValidationError, etc.
├── schemas/
│   └── catering-services.schema.ts       # Esquemas de validación Zod (Single Source of Truth)
├── middlewares/
│   ├── validate.middleware.ts            # Middlewares de validación para body, params y query
│   ├── error.middleware.ts               # Handler 404 y errorHandler global de 4 parámetros
│   └── logger.middleware.ts              # Logger HTTP con tiempos de respuesta
├── repositories/
│   └── catering-services.repository.ts   # Acceso a datos en memoria (copia defensiva)
├── services/
│   └── catering-services.service.ts      # Lógica de negocio y control con NotFoundError
├── controllers/
│   └── catering-services.controller.ts   # Thin controller (recibe datos validados y responde)
├── routes/
│   └── catering-services.routes.ts       # Enrutamiento con middlewares de validación
├── types.ts                              # Tipos e interfaces inferidos de Zod
├── app.ts                                # Pipeline de Express y registro de middlewares
└── server.ts                             # Arranque del servidor y graceful shutdown
```

---

## 📡 Endpoints de la API REST

| Método | Ruta | Validación Zod | Status Esperados |
|--------|------|----------------|------------------|
| **GET** | `/api/v1/catering-services?page=1&limit=10` | `page >= 1`, `1 <= limit <= 100` | `200 OK` / `400 Bad Request` |
| **GET** | `/api/v1/catering-services/:id` | `id` entero positivo | `200 OK` / `400 Bad Request` / `404 Not Found` |
| **POST** | `/api/v1/catering-services` | `name`, `category`, `pricePerPerson`, `minPeople` | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/v1/catering-services/:id` | `id` válido + al menos 1 campo en body | `200 OK` / `400 Bad Request` / `404 Not Found` |
| **DELETE** | `/api/v1/catering-services/:id` | `id` entero positivo | `204 No Content` / `400 Bad Request` / `404 Not Found` |

---

## 📋 Formatos de Respuesta

### 1. Respuesta Exitosa — Lista Paginada (`200 OK`)
```json
{
  "data": [
    {
      "id": 1,
      "name": "Buffet Ejecutivo Premium",
      "category": "Buffet",
      "pricePerPerson": 35.0,
      "minPeople": 20,
      "isAvailable": true,
      "createdAt": "2026-08-22T18:00:00.000Z"
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 2. Error de Validación Zod (`400 Bad Request`)
```json
{
  "error": "ValidationError",
  "message": "Datos del cuerpo (body) inválidos",
  "errors": [
    {
      "field": "pricePerPerson",
      "message": "El precio por persona debe ser mayor a 0"
    },
    {
      "field": "category",
      "message": "Categoría inválida. Opciones válidas: Buffet, Coffee Break, Banquete, Postres, Cocktail"
    }
  ]
}
```

### 3. Recurso no encontrado (`404 Not Found`)
```json
{
  "error": "NotFoundError",
  "message": "No se encontró el servicio de catering con ID 99"
}
```

---

## ⚙️ Cómo Ejecutar el Proyecto

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Ejecutar en modo desarrollo con recarga automática
```bash
pnpm dev
```

### 3. Compilar TypeScript para producción
```bash
pnpm build
```

---

## 🧪 Pruebas con cURL

### 🟢 Casos Exitosos (Happy Path)

```bash
# 1. Listar servicios con paginación
curl "http://localhost:3000/api/v1/catering-services?page=1&limit=2"

# 2. Obtener un servicio por ID
curl http://localhost:3000/api/v1/catering-services/1

# 3. Crear un nuevo servicio de catering
curl -X POST http://localhost:3000/api/v1/catering-services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cocktail Sunset & Tapas",
    "category": "Cocktail",
    "pricePerPerson": 28.5,
    "minPeople": 15,
    "isAvailable": true
  }'

# 4. Actualizar precio de un servicio
curl -X PUT http://localhost:3000/api/v1/catering-services/1 \
  -H "Content-Type: application/json" \
  -d '{"pricePerPerson": 38.0}'

# 5. Eliminar un servicio
curl -X DELETE http://localhost:3000/api/v1/catering-services/4
```

---

### 🔴 Casos de Error y Validación (Probando Zod y Error Handler)

```bash
# 1. Error de validación: precio negativo y categoría inválida (400)
curl -X POST http://localhost:3000/api/v1/catering-services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Menu Prueba",
    "category": "ComidaRapida",
    "pricePerPerson": -10,
    "minPeople": 0
  }'

# 2. Error de parámetro ID no numérico (400)
curl http://localhost:3000/api/v1/catering-services/abc

# 3. Error de ID que no existe (404)
curl http://localhost:3000/api/v1/catering-services/999

# 4. Error de PUT sin campos (400)
curl -X PUT http://localhost:3000/api/v1/catering-services/1 \
  -H "Content-Type: application/json" \
  -d '{}'

# 5. Error de ruta inexistente (404)
curl http://localhost:3000/api/v1/ruta-que-no-existe
```

---

## 📚 Documentación de Estudio

- [Guía de Estudio — Semana 04](file:///home/davidl/Documentos/express/GUIA_DE_ESTUDIO_SEMANA_04.md)
- [Rúbrica de Evaluación y Evidencias](file:///home/davidl/Documentos/express/RUBRICA_SEMANA_04.md)
