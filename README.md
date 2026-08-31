# 🍽️ Proyecto Semana 05 — PostgreSQL + Prisma ORM

API REST profesional para un **Servicio de Catering** construida con **Express 5 + TypeScript**, evolucionada de almacenamiento en memoria a **PostgreSQL** con **Prisma ORM**, incluyendo **relaciones 1:N**, **migraciones**, **seed** y **manejo de errores Prisma**.

---

## 📌 Dominio: Servicio de Catering

### Recurso principal: `CateringService`

| Campo | Tipo DB | Validación (Zod) | Descripción |
|-------|---------|------------------|-------------|
| `id` | `Int @id` | Autoincremental | Identificador único |
| `name` | `String @unique` | `min(3).max(100).trim()` | Nombre del menú o paquete |
| `category` | `String` | `enum('Buffet', 'Coffee Break', 'Banquete', 'Postres', 'Cocktail')` | Categoría del servicio |
| `pricePerPerson` | `Float` | `positive().max(10000)` | Precio en USD por comensal |
| `minPeople` | `Int` | `int().min(1)` | Cantidad mínima de invitados |
| `isAvailable` | `Boolean` | `boolean().optional().default(true)` | Disponibilidad del servicio |
| `createdAt` | `DateTime` | Automático (`@default(now())`) | Fecha de registro |
| `menuItems` | `MenuItem[]` | Relación 1:N | Ítems del menú asociados |

### Recurso secundario: `MenuItem` (Relación 1:N)

| Campo | Tipo DB | Validación (Zod) | Descripción |
|-------|---------|------------------|-------------|
| `id` | `Int @id` | Autoincremental | Identificador único |
| `name` | `String` | `min(2).max(100).trim()` | Nombre del ítem |
| `description` | `String?` | `max(500).optional()` | Descripción del ítem |
| `cateringServiceId` | `Int` (FK) | Automático | Referencia al servicio padre |
| `createdAt` | `DateTime` | Automático (`@default(now())`) | Fecha de creación |

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
[ services ] ── (P2025/P2002) ──────────────┤
   ⬇                                        │
[ repositories (Prisma Client) ]             │
   ⬇                                        │
[ PostgreSQL ]                               │
                                            ▼
                              [ notFoundHandler / errorHandler (Global) ]
```

```text
src/
├── config/
│   └── prisma.ts                        # Instancia singleton de PrismaClient
├── errors/
│   └── app-error.ts                     # Clases: AppError, NotFoundError, ConflictError, etc.
├── schemas/
│   ├── catering-services.schema.ts      # Esquemas Zod para CateringService
│   └── menu-items.schema.ts             # Esquemas Zod para MenuItem
├── middlewares/
│   ├── validate.middleware.ts           # Middlewares de validación (body, params, query)
│   ├── error.middleware.ts              # Handler 404 + errorHandler (incluye Prisma P2025/P2002)
│   └── logger.middleware.ts             # Logger HTTP con tiempos de respuesta
├── repositories/
│   ├── catering-services.repository.ts  # Queries Prisma para CateringService
│   └── menu-items.repository.ts         # Queries Prisma para MenuItem
├── services/
│   ├── catering-services.service.ts     # Lógica de negocio + manejo errores Prisma
│   └── menu-items.service.ts            # Lógica de negocio para MenuItems
├── controllers/
│   ├── catering-services.controller.ts  # Thin controller para CateringService
│   └── menu-items.controller.ts         # Thin controller para MenuItem
├── routes/
│   ├── catering-services.routes.ts      # Rutas CRUD de CateringService
│   └── menu-items.routes.ts             # Rutas anidadas de MenuItem (mergeParams)
├── types.ts                             # Tipos: Prisma + DTOs Zod + contratos de respuesta
├── app.ts                               # Pipeline de Express y registro de middlewares
└── server.ts                            # Arranque del servidor y graceful shutdown con Prisma
prisma/
├── schema.prisma                        # Modelos, relaciones y configuración de BD
└── seed.ts                              # Datos iniciales (4 servicios + menú ítems)
```

---

## 📡 Endpoints de la API REST

### CateringService

| Método | Ruta | Validación Zod | Status Esperados |
|--------|------|----------------|------------------|
| **GET** | `/api/v1/catering-services?page=1&limit=10` | `page >= 1`, `1 <= limit <= 100` | `200 OK` / `400` |
| **GET** | `/api/v1/catering-services/:id` | `id` entero positivo | `200 OK` / `400` / `404` |
| **POST** | `/api/v1/catering-services` | Body completo | `201 Created` / `400` / `409` |
| **PUT** | `/api/v1/catering-services/:id` | `id` + al menos 1 campo | `200 OK` / `400` / `404` / `409` |
| **DELETE** | `/api/v1/catering-services/:id` | `id` entero positivo | `204 No Content` / `400` / `404` |

### MenuItem (rutas anidadas)

| Método | Ruta | Validación Zod | Status Esperados |
|--------|------|----------------|------------------|
| **GET** | `/api/v1/catering-services/:serviceId/menu-items` | `serviceId` entero positivo | `200 OK` / `400` / `404` |
| **POST** | `/api/v1/catering-services/:serviceId/menu-items` | `serviceId` + body | `201 Created` / `400` / `404` |
| **DELETE** | `/api/v1/catering-services/:serviceId/menu-items/:id` | `serviceId` + `id` | `204 No Content` / `400` / `404` |

---

## 📋 Formatos de Respuesta

### 1. Respuesta Exitosa — Lista Paginada con Relación (`200 OK`)
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
      "createdAt": "2026-08-30T18:00:00.000Z",
      "menuItems": [
        { "id": 1, "name": "Ensalada César", "description": "Lechuga romana, crutones y aderezo césar", "createdAt": "2026-08-30T18:00:00.000Z" },
        { "id": 2, "name": "Pollo al Horno", "description": "Pollo marinado con hierbas finas", "createdAt": "2026-08-30T18:00:00.000Z" }
      ]
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 2. Error de Conflicto — Unique Constraint P2002 (`409 Conflict`)
```json
{
  "error": "ConflictError",
  "message": "Ya existe un servicio de catering con el nombre 'Buffet Ejecutivo Premium'"
}
```

### 3. Recurso no encontrado — P2025 (`404 Not Found`)
```json
{
  "error": "NotFoundError",
  "message": "No se encontró el servicio de catering con ID 99"
}
```

---

## ⚙️ Cómo Ejecutar el Proyecto

### 1. Requisitos previos
- **Node.js 22+** y **pnpm**
- **Docker** y **Docker Compose** (para PostgreSQL)

### 2. Levantar la base de datos con Docker
```bash
docker compose up -d
```

### 3. Instalar dependencias
```bash
pnpm install
```

### 4. Ejecutar migraciones y seed
```bash
pnpm db:setup
```

### 5. Ejecutar en modo desarrollo
```bash
pnpm dev
```

### 6. Explorar la base de datos con Prisma Studio (opcional)
```bash
pnpm prisma:studio
```

---

## 🧪 Pruebas con cURL

### 🟢 Casos Exitosos (Happy Path)

```bash
# 1. Listar servicios con paginación (incluye menuItems)
curl "http://localhost:3000/api/v1/catering-services?page=1&limit=2"

# 2. Obtener un servicio por ID (con sus menuItems)
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

# 5. Eliminar un servicio (cascade elimina sus menuItems)
curl -X DELETE http://localhost:3000/api/v1/catering-services/4

# 6. Listar ítems de menú de un servicio
curl http://localhost:3000/api/v1/catering-services/1/menu-items

# 7. Agregar un ítem al menú de un servicio
curl -X POST http://localhost:3000/api/v1/catering-services/1/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sopa de Tomate",
    "description": "Sopa cremosa de tomate con albahaca fresca"
  }'

# 8. Eliminar un ítem del menú
curl -X DELETE http://localhost:3000/api/v1/catering-services/1/menu-items/1
```

---

### 🔴 Casos de Error (Probando Prisma + Error Handler)

```bash
# 1. Error de conflicto: nombre duplicado (409 — P2002)
curl -X POST http://localhost:3000/api/v1/catering-services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Buffet Ejecutivo Premium",
    "category": "Buffet",
    "pricePerPerson": 30.0,
    "minPeople": 10
  }'

# 2. Error 404: ID que no existe (P2025)
curl http://localhost:3000/api/v1/catering-services/999

# 3. Error de validación Zod: precio negativo (400)
curl -X POST http://localhost:3000/api/v1/catering-services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Menu Prueba",
    "category": "ComidaRapida",
    "pricePerPerson": -10,
    "minPeople": 0
  }'

# 4. Error 404: agregar ítem a servicio inexistente
curl -X POST http://localhost:3000/api/v1/catering-services/999/menu-items \
  -H "Content-Type: application/json" \
  -d '{"name": "Ítem Fantasma"}'

# 5. Error de ruta inexistente (404)
curl http://localhost:3000/api/v1/ruta-que-no-existe
```

---

## 📚 Documentación de Estudio

- [Guía de Estudio — Semana 05](file:///home/davidl/Documentos/express/GUIA_DE_ESTUDIO_SEMANA_05.md)
- [Rúbrica de Evaluación y Evidencias](file:///home/davidl/Documentos/express/RUBRICA_SEMANA_05.md)
