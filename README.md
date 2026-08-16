# 🍽️ Proyecto Semana 03 — API REST con Arquitectura en Capas

API REST para un **Servicio de Catering** construida con **Express 5 + TypeScript**, organizada en **4 capas** separadas: routes, controllers, services y repositories.

---

## 📌 Dominio: Servicio de Catering

Recurso principal: `CateringService`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | Identificador único autoincremental |
| `name` | `string` | Nombre del menú o banquete |
| `category` | `string` | Categoría (*Buffet*, *Coffee Break*, *Banquete*, *Postres*) |
| `pricePerPerson` | `number` | Precio en USD por invitado |
| `minPeople` | `number` | Mínimo de personas requeridas |
| `isAvailable` | `boolean` | Disponibilidad del servicio |
| `createdAt` | `string` | Fecha de creación (ISO 8601) |

---

## 🏗️ Arquitectura en 4 Capas

```
routes → controllers → services → repositories → [Store en memoria]
```

```text
src/
├── types.ts                                    # Interfaces, DTOs y contratos de respuesta
├── repositories/
│   └── catering-services.repository.ts         # Acceso a datos (único punto que toca el store)
├── services/
│   └── catering-services.service.ts            # Lógica de negocio + paginación
├── controllers/
│   └── catering-services.controller.ts         # Thin controller (extraer → service → responder)
├── routes/
│   └── catering-services.routes.ts             # Solo mapeo URL → controller
├── app.ts                                      # Configuración Express + middlewares
└── server.ts                                   # Punto de entrada + graceful shutdown
```

---

## 📡 Endpoints de la API REST

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| **GET** | `/api/v1/catering-services?page=1&limit=5` | Listar con paginación | `200 OK` |
| **GET** | `/api/v1/catering-services/:id` | Obtener por ID | `200 OK` / `404` |
| **POST** | `/api/v1/catering-services` | Crear nuevo servicio | `201 Created` / `400` |
| **PUT** | `/api/v1/catering-services/:id` | Actualizar por ID | `200 OK` / `404` |
| **DELETE** | `/api/v1/catering-services/:id` | Eliminar por ID | `204 No Content` / `404` |

### Contratos de Respuesta

```json
// GET con paginación → 200
{ "data": [...], "total": 4, "page": 1, "limit": 10 }

// GET por ID → 200
{ "data": { "id": 1, "name": "Buffet Ejecutivo Premium", ... } }

// POST → 201
{ "data": { "id": 5, "name": "Nuevo servicio", ... } }

// Error → 404
{ "error": "Not Found", "message": "No se encontró el servicio con ID 99" }
```

---

## 🛠️ Tecnologías

- **Express 5** + **TypeScript 5.8** (modo estricto)
- **ES Modules** (import/export nativo)
- **tsx watch** (hot reload en desarrollo)

---

## ⚙️ Cómo Ejecutar

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Ejecutar en modo desarrollo
```bash
pnpm dev
```

### 3. Verificar compilación TypeScript
```bash
pnpm build
```

---

## 🧪 Probar con cURL

```bash
# Listar servicios (con paginación)
curl http://localhost:3000/api/v1/catering-services?page=1&limit=2

# Obtener por ID
curl http://localhost:3000/api/v1/catering-services/1

# Crear nuevo servicio
curl -X POST http://localhost:3000/api/v1/catering-services \
  -H "Content-Type: application/json" \
  -d '{"name":"Buffet Criollo VIP","category":"Buffet","pricePerPerson":32.0,"minPeople":20,"isAvailable":true}'

# Actualizar servicio
curl -X PUT http://localhost:3000/api/v1/catering-services/1 \
  -H "Content-Type: application/json" \
  -d '{"pricePerPerson":40.0}'

# Eliminar servicio
curl -X DELETE http://localhost:3000/api/v1/catering-services/1
```
