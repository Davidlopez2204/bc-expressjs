# 🍽️ Proyecto Bootcamp — Servicio de Catering (Express 5 + TypeScript)

Este repositorio contiene la entrega del bootcamp adaptada al dominio asignado: **Servicio de Catering**.

---

## 📌 Dominio Asignado: Servicio de Catering

Recurso principal: `CateringService`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | Identificador único autoincremental |
| `name` | `string` | Nombre del menú o banquete (ej. *Buffet Ejecutivo Premium*) |
| `category` | `string` | Categoría (*Buffet*, *Coffee Break*, *Banquete*, *Postres*) |
| `pricePerPerson` | `number` | Precio en USD por invitado |
| `minPeople` | `number` | Mínimo de personas requeridas |
| `isAvailable` | `boolean` | Disponibilidad del servicio |

---

## 🚀 Semana 02 — Servidor Express con CRUD Completo

### 🛠️ Tecnologías Utilizadas
- **Express 5**
- **TypeScript 5.8+** (Modo estricto `strict: true`)
- **ES Modules (ESM)**
- **tsx watch** (Hot reload en desarrollo)

### 🗂️ Estructura del Proyecto
```text
express/
├── src/
│   ├── types.ts                        # Interfaz CateringService y DTOs
│   ├── store.ts                        # Store en memoria (5 métodos CRUD)
│   ├── routes/
│   │   └── catering-services.routes.ts  # 5 Endpoints REST
│   ├── app.ts                          # App Express + Middlewares + Handlers
│   └── server.ts                       # Entrypoint + Graceful Shutdown (SIGINT/SIGTERM)
├── GUIA_DE_ESTUDIO_SEMANA_02.md        # Guía mental paso a paso
├── package.json
└── tsconfig.json
```

---

## 📡 Endpoints de la API REST (`/api/v1/catering-services`)

| Método | Ruta | Descripción | HTTP Status |
|--------|------|-------------|-------------|
| **GET** | `/api/v1/catering-services` | Listar todos los servicios | `200 OK` |
| **GET** | `/api/v1/catering-services/:id` | Obtener un servicio por ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/v1/catering-services` | Crear un nuevo servicio | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/v1/catering-services/:id` | Actualizar un servicio por ID | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/v1/catering-services/:id` | Eliminar un servicio por ID | `204 No Content` / `404 Not Found` |

---

## ⚙️ Middlewares Registrados (Orden Estricto)
1. **`express.json()`** — Parsing del body en JSON.
2. **Logger personalizado** — Registra fecha, Método HTTP, URL, Status Code y tiempo de respuesta en milisegundos.
3. **Router de rutas** — Sub-rutas `/api/v1/catering-services`.
4. **Handler 404** — Captura de rutas no registradas.
5. **Global Error Handler** — Middleware de 4 parámetros `(err, req, res, next)` para captura de excepciones no controladas.

---

## 🧪 Cómo Ejecutar y Probar

### 1. Iniciar el Servidor
```bash
npm run dev
```

### 2. Probar Endpoints con cURL

```bash
# Listar servicios
curl http://localhost:3000/api/v1/catering-services

# Obtener por ID
curl http://localhost:3000/api/v1/catering-services/1

# Crear nuevo servicio
curl -X POST http://localhost:3000/api/v1/catering-services \
  -H "Content-Type: application/json" \
  -d '{"name":"Buffet Criollo VIP","category":"Buffet","pricePerPerson":32.0,"minPeople":20,"isAvailable":true}'

# Actualizar servicio por ID
curl -X PUT http://localhost:3000/api/v1/catering-services/1 \
  -H "Content-Type: application/json" \
  -d '{"pricePerPerson":40.0}'

# Eliminar servicio por ID
curl -X DELETE http://localhost:3000/api/v1/catering-services/1
```
