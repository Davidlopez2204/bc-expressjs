# 📊 Rúbrica de Evaluación — Semana 05: PostgreSQL + Prisma ORM

**Estudiante:** David López (`Davidlopez2204`)  
**Dominio Asignado:** Servicio de Catering (`CateringService`)  
**Tecnologías:** Express 5, TypeScript 5.8, Zod 3.24, Prisma ORM 6.x, PostgreSQL 16, Docker, Node.js 22  

---

## 🎯 Criterios de Evaluación y Evidencias

### 1. Criterio de Conocimiento (Saber) — 30%

| Criterio | Descripción | Estado | Evidencia en el Código |
|----------|-------------|:------:|------------------------|
| **1.1 Modelo Relacional** | Comprende tablas, columnas, tipos, llaves primarias y foráneas en PostgreSQL. | ✅ Cumplido | [prisma/schema.prisma](file:///home/davidl/Documentos/express/prisma/schema.prisma) — Modelos con `@id`, `@unique`, `@relation`, FK |
| **1.2 Concepto de ORM** | Entiende qué es un ORM y cómo Prisma traduce TypeScript a SQL con tipos auto-generados. | ✅ Cumplido | [GUIA_DE_ESTUDIO_SEMANA_05.md](file:///home/davidl/Documentos/express/GUIA_DE_ESTUDIO_SEMANA_05.md) — Sección 2 |
| **1.3 Migraciones** | Comprende el concepto de migraciones como versionamiento del esquema de la BD. | ✅ Cumplido | Carpeta `prisma/migrations/` generada con `prisma migrate dev` |
| **1.4 Relaciones 1:N** | Entiende relaciones uno-a-muchos, FK, `@relation`, `include` y `onDelete: Cascade`. | ✅ Cumplido | [GUIA_DE_ESTUDIO_SEMANA_05.md](file:///home/davidl/Documentos/express/GUIA_DE_ESTUDIO_SEMANA_05.md) — Sección 4 |
| **1.5 Errores Prisma** | Conoce los códigos P2025 (Not Found) y P2002 (Unique Constraint) y su manejo. | ✅ Cumplido | [src/services/catering-services.service.ts](file:///home/davidl/Documentos/express/src/services/catering-services.service.ts) |

---

### 2. Criterio de Desempeño (Saber Hacer) — 40%

| Criterio | Descripción | Estado | Evidencia en el Código |
|----------|-------------|:------:|------------------------|
| **2.1 Schema Prisma Completo** | Modelos `CateringService` y `MenuItem` con tipos correctos, `@unique`, `@default`, `@@map`. | ✅ Cumplido | [prisma/schema.prisma](file:///home/davidl/Documentos/express/prisma/schema.prisma) |
| **2.2 Relación @relation** | Relación 1:N definida con `@relation(fields, references)` y `onDelete: Cascade`. | ✅ Cumplido | `MenuItem.cateringService` en schema.prisma |
| **2.3 Repository con Prisma Client** | Repository refactorizado de array en memoria a queries Prisma (`findMany`, `findUnique`, `create`, `update`, `delete`). | ✅ Cumplido | [src/repositories/catering-services.repository.ts](file:///home/davidl/Documentos/express/src/repositories/catering-services.repository.ts) |
| **2.4 Paginación con Prisma** | Uso de `skip`, `take`, `orderBy` y `count()` para paginación eficiente en BD. | ✅ Cumplido | Método `findAll()` en repository con `Promise.all` |
| **2.5 Include para Relaciones** | Uso de `include: { menuItems: true }` en consultas para traer datos relacionados. | ✅ Cumplido | `findAll()` y `findById()` en catering repository |
| **2.6 Manejo P2025 y P2002** | Service captura `PrismaClientKnownRequestError` y lo transforma en `NotFoundError`/`ConflictError`. | ✅ Cumplido | [src/services/catering-services.service.ts](file:///home/davidl/Documentos/express/src/services/catering-services.service.ts) |
| **2.7 Seed de Datos** | Script de seed que crea servicios con `menuItems.create` (creación anidada). | ✅ Cumplido | [prisma/seed.ts](file:///home/davidl/Documentos/express/prisma/seed.ts) |
| **2.8 Docker Compose** | PostgreSQL containerizado con `docker-compose.yml`, volumen persistente. | ✅ Cumplido | [docker-compose.yml](file:///home/davidl/Documentos/express/docker-compose.yml) |
| **2.9 Graceful Shutdown** | `prisma.$disconnect()` invocado al cerrar el servidor. | ✅ Cumplido | [src/server.ts](file:///home/davidl/Documentos/express/src/server.ts) |

---

### 3. Criterio de Producto (Entregable) — 30%

| Criterio | Descripción | Estado | Evidencia |
|----------|-------------|:------:|-----------|
| **3.1 API CRUD Funcional con PostgreSQL** | Todos los endpoints CRUD responden correctamente conectados a PostgreSQL real. | ✅ Cumplido | 8 endpoints en `/api/v1/catering-services` |
| **3.2 Relación 1:N Funcional** | Endpoints de MenuItem funcionan correctamente anidados bajo CateringService. | ✅ Cumplido | `/api/v1/catering-services/:serviceId/menu-items` |
| **3.3 Errores Controlados** | P2025 → 404, P2002 → 409, validación Zod → 400, con formato JSON uniforme. | ✅ Cumplido | Ver cURL de errores en README.md |
| **3.4 Datos Persisten** | Los datos sobreviven reinicios del servidor (están en PostgreSQL, no en memoria). | ✅ Cumplido | Verificable reiniciando `pnpm dev` |
| **3.5 Documentación Completa** | README con setup, endpoints, contratos, cURL. Guía de estudio pedagógica. | ✅ Cumplido | [README.md](file:///home/davidl/Documentos/express/README.md) |
| **3.6 Guía de Estudio** | Explicación de conceptos con analogías, comparación antes/después, tono estudiantil. | ✅ Cumplido | [GUIA_DE_ESTUDIO_SEMANA_05.md](file:///home/davidl/Documentos/express/GUIA_DE_ESTUDIO_SEMANA_05.md) |

---

## 📈 Matriz de Calificación y Autoevaluación

| Sección | Puntaje Máximo | Puntaje Obtenido | Justificación |
|---------|:--------------:|:----------------:|---------------|
| **1. Conocimiento** | 30 pts | 30 pts | Dominio de modelo relacional, ORM, migraciones, relaciones y errores Prisma. |
| **2. Desempeño** | 40 pts | 40 pts | Schema Prisma completo, repository con Client, paginación, include, P2025/P2002, seed, Docker. |
| **3. Producto** | 30 pts | 30 pts | API robusta con PostgreSQL, relación 1:N funcional, errores controlados, documentación completa. |
| **TOTAL** | **100 pts** | **100 pts** | **Excelente — Nivel de Logro Destacado** |
