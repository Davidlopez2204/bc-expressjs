# 📘 GUÍA Y MÉTODO DE ESTUDIO — SEMANA 02: EXPRESS 5 CON TYPESCRIPT
> **Dominio:** Servicio de Catering (`catering-services`)  
> **Objetivo:** Comprender la arquitectura de un servidor web con Express 5, la cadena de middlewares, los status codes de HTTP y las operaciones CRUD sobre recursos.

---

## 🧠 1. El Método Mental de Arquitectura Express (5 Pasos)

Para construir o mantener cualquier servidor Express en TypeScript, sigue siempre esta secuencia:

```text
[Paso 1: Types] ➡️ [Paso 2: Store] ➡️ [Paso 3: Routes] ➡️ [Paso 4: App] ➡️ [Paso 5: Server]
  (types.ts)       (store.ts)       (routes/*.ts)        (app.ts)         (server.ts)
```

1. **Types (`src/types.ts`)**: Define el modelo del recurso (`CateringService`) y sus DTOs de creación y edición.
2. **Store (`src/store.ts`)**: Encapsula las operaciones de base de datos o almacenamiento en memoria (`getAll`, `getById`, `create`, `update`, `remove`).
3. **Routes (`src/routes/catering-services.routes.ts`)**: Conecta cada verbo HTTP (`GET`, `POST`, `PUT`, `DELETE`) con las funciones del store y retorna la respuesta adecuada.
4. **App (`src/app.ts`)**: Registra en orden estricto los middlewares globales (JSON, Logger, Rutas, 404 Handler y Error Handler).
5. **Server (`src/server.ts`)**: Levanta el servidor en el puerto e implementa el *Graceful Shutdown* (`SIGINT` / `SIGTERM`).

---

## 🛠️ 2. Código Explicado Componente por Componente

### 📄 Archivo 1: `src/types.ts`
```typescript
// Modelo principal del recurso
export interface CateringService {
  id: number;                 // ID único autoincremental
  name: string;               // Nombre del servicio
  category: string;           // Categoría ("Buffet", "Coffee Break", "Banquete", "Postres")
  pricePerPerson: number;     // Precio por persona
  minPeople: number;          // Mínimo de personas
  isAvailable: boolean;       // Disponibilidad
}

// DTO para la creación (omitimos el ID porque el servidor lo genera)
export type CreateCateringServiceDto = Omit<CateringService, 'id'>;

// DTO para la actualización (todos los campos son opcionales)
export type UpdateCateringServiceDto = Partial<CreateCateringServiceDto>;
```

---

### 📄 Archivo 2: `src/store.ts`
```typescript
import { CateringService, CreateCateringServiceDto, UpdateCateringServiceDto } from './types.js';

const servicesStore: CateringService[] = [ /* datos iniciales */ ];
let currentId = servicesStore.length + 1;

export const getAllServices = (): CateringService[] => [...servicesStore];

export const getServiceById = (id: number): CateringService | undefined => 
  servicesStore.find(s => s.id === id);

export const createService = (data: CreateCateringServiceDto): CateringService => {
  const newService = { id: currentId++, ...data };
  servicesStore.push(newService);
  return newService;
};

export const updateService = (id: number, data: UpdateCateringServiceDto) => {
  const index = servicesStore.findIndex(s => s.id === id);
  if (index === -1) return undefined;
  servicesStore[index] = { ...servicesStore[index], ...data };
  return servicesStore[index];
};

export const removeService = (id: number): boolean => {
  const index = servicesStore.findIndex(s => s.id === id);
  if (index === -1) return false;
  servicesStore.splice(index, 1);
  return true;
};
```

---

### 📄 Archivo 3: `src/routes/catering-services.routes.ts`
```typescript
import { Router } from 'express';
import { getAllServices, getServiceById, createService, updateService, removeService } from '../store.js';

export const cateringRouter = Router();

// GET /api/v1/catering-services (200 OK)
cateringRouter.get('/', (_req, res) => {
  res.status(200).json({ success: true, data: getAllServices() });
});

// GET /api/v1/catering-services/:id (200 OK / 404 Not Found)
cateringRouter.get('/:id', (req, res) => {
  const service = getServiceById(Number(req.params.id));
  if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });
  res.status(200).json({ success: true, data: service });
});

// POST /api/v1/catering-services (201 Created)
cateringRouter.post('/', (req, res) => {
  const created = createService(req.body);
  res.status(201).json({ success: true, data: created });
});

// PUT /api/v1/catering-services/:id (200 OK / 404 Not Found)
cateringRouter.put('/:id', (req, res) => {
  const updated = updateService(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ error: 'Servicio no encontrado' });
  res.status(200).json({ success: true, data: updated });
});

// DELETE /api/v1/catering-services/:id (204 No Content / 404 Not Found)
cateringRouter.delete('/:id', (req, res) => {
  const removed = removeService(Number(req.params.id));
  if (!removed) return res.status(404).json({ error: 'Servicio no encontrado' });
  res.status(204).send();
});
```

---

### 📄 Archivo 4: `src/app.ts`
```typescript
import express from 'express';
import { cateringRouter } from './routes/catering-services.routes.js';

export const app = express();

// 1. Parser JSON
app.use(express.json());

// 2. Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

// 3. Rutas de la API
app.use('/api/v1/catering-services', cateringRouter);

// 4. Handler 404 (Rutas inexistentes)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.originalUrl });
});

// 5. Global Error Handler (4 parámetros)
app.use((err: Error, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});
```

---

### 📄 Archivo 5: `src/server.ts`
```typescript
import { app } from './app.js';

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});

// Graceful Shutdown
const shutdown = (signal: string) => {
  console.log(`🛑 Cerrando por ${signal}...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
```

---

## ⚡ 3. Comandos para Ejecutar y Probar la API

### Iniciar el Servidor en Desarrollo
```bash
npm run dev
```

### Probar los 5 Endpoints con cURL

```bash
# 1. GET ALL
curl http://localhost:3000/api/v1/catering-services

# 2. GET BY ID
curl http://localhost:3000/api/v1/catering-services/1

# 3. POST (Crear)
curl -X POST http://localhost:3000/api/v1/catering-services \
  -H "Content-Type: application/json" \
  -d '{"name":"Buffet Típico","category":"Buffet","pricePerPerson":28.0,"minPeople":20,"isAvailable":true}'

# 4. PUT (Actualizar)
curl -X PUT http://localhost:3000/api/v1/catering-services/1 \
  -H "Content-Type: application/json" \
  -d '{"pricePerPerson":40.0}'

# 5. DELETE (Eliminar)
curl -X DELETE http://localhost:3000/api/v1/catering-services/1
```
