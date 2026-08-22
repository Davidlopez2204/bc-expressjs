# 📊 Rúbrica de Evaluación — Semana 04: Validación con Zod y Manejo Centralizado de Errores

**Estudiante:** David López (`Davidlopez2204`)  
**Dominio Asignado:** Servicio de Catering (`CateringService`)  
**Tecnologías:** Express 5, TypeScript 5.8, Zod 3.24, Node.js 22  

---

## 🎯 Criterios de Evaluación y Evidencias

### 1. Criterio de Conocimiento (Saber) — 30%

| Criterio | Descripción | Estado | Evidencia en el Código |
|----------|-------------|:------:|------------------------|
| **1.1 Concepto de Validación Declarativa** | Comprende la diferencia entre validación manual imperativa y esquemas declarativos con Zod. | ✅ Cumplido | [src/schemas/catering-services.schema.ts](file:///home/davidl/Documentos/express/src/schemas/catering-services.schema.ts) |
| **1.2 Inferencia de Tipos con Zod** | Uso de `z.infer<typeof schema>` como Single Source of Truth para evitar duplicación de tipos. | ✅ Cumplido | [src/types.ts](file:///home/davidl/Documentos/express/src/types.ts) |
| **1.3 Jerarquía de Errores y Códigos HTTP** | Entiende el uso de subclases de `Error` y asignación semántica de códigos HTTP (400, 404, 409, 500). | ✅ Cumplido | [src/errors/app-error.ts](file:///home/davidl/Documentos/express/src/errors/app-error.ts) |
| **1.4 Ciclo de Vida del Error en Express** | Comprende cómo viaja un error desde `next(err)` hasta el middleware global de 4 parámetros. | ✅ Cumplido | [GUIA_DE_ESTUDIO_SEMANA_04.md](file:///home/davidl/Documentos/express/GUIA_DE_ESTUDIO_SEMANA_04.md) |

---

### 2. Criterio de Desempeño (Saber Hacer) — 40%

| Criterio | Descripción | Estado | Evidencia en el Código |
|----------|-------------|:------:|------------------------|
| **2.1 Esquemas Zod Completos** | Esquemas para `POST` (creación), `PUT` (parcial), `:id` (parámetro numérico) y `query` (paginación). | ✅ Cumplido | `createCateringSchema`, `updateCateringSchema`, `idParamSchema`, `paginationQuerySchema` |
| **2.2 Middlewares de Validación Reutilizables** | Funciones de orden superior `validateBody`, `validateParams`, `validateQuery` que encapsulan `schema.safeParse()`. | ✅ Cumplido | [src/middlewares/validate.middleware.ts](file:///home/davidl/Documentos/express/src/middlewares/validate.middleware.ts) |
| **2.3 Controladores Delgados (*Thin Controllers*)** | Controladores sin lógica de validación manual; se limitan a extraer datos validados, invocar el servicio y responder. | ✅ Cumplido | [src/controllers/catering-services.controller.ts](file:///home/davidl/Documentos/express/src/controllers/catering-services.controller.ts) |
| **2.4 Manejador de Errores Centralizado** | Middleware global `(err, req, res, next)` que formatea errores de Zod, `AppError` y JSON mal formado. | ✅ Cumplido | [src/middlewares/error.middleware.ts](file:///home/davidl/Documentos/express/src/middlewares/error.middleware.ts) |
| **2.5 Handler 404 para Rutas Inexistentes** | Middleware que intercepta rutas no registradas y lanza `NotFoundError`. | ✅ Cumplido | `notFoundHandler` en `src/middlewares/error.middleware.ts` |
| **2.6 Pipeline Correcto de Express** | Orden correcto de middlewares: `express.json` → `logger` → `routes` → `404` → `errorHandler`. | ✅ Cumplido | [src/app.ts](file:///home/davidl/Documentos/express/src/app.ts) |

---

### 3. Criterio de Producto (Entregable) — 30%

| Criterio | Descripción | Estado | Evidencia |
|----------|-------------|:------:|-----------|
| **3.1 API REST Totalmente Funcional** | Todos los endpoints CRUD responden correctamente con códigos 200, 201, 204, 400 y 404. | ✅ Cumplido | Endpoints en `/api/v1/catering-services` |
| **3.2 Respuestas de Error Estandarizadas** | Formato uniforme en JSON para errores simples (`{ error, message }`) y errores de validación (`{ error, message, errors: [{ field, message }] }`). | ✅ Cumplido | Ver ejemplos en README.md |
| **3.3 Documentación de la API** | README completo con tabla de endpoints, contratos, payloads y comandos cURL de prueba. | ✅ Cumplido | [README.md](file:///home/davidl/Documentos/express/README.md) |
| **3.4 Guía de Estudio Pedagógica** | Guía de estudio explicando los conceptos de la semana con analogías claras y tono estudiantil. | ✅ Cumplido | [GUIA_DE_ESTUDIO_SEMANA_04.md](file:///home/davidl/Documentos/express/GUIA_DE_ESTUDIO_SEMANA_04.md) |

---

## 📈 Matriz de Calificación y Autoevaluación

| Sección | Puntaje Máximo | Puntaje Obtenido | Justificación |
|---------|:--------------:|:----------------:|---------------|
| **1. Conocimiento** | 30 pts | 30 pts | Dominio de Zod, tipos inferidos, errores HTTP y pipeline de Express. |
| **2. Desempeño** | 40 pts | 40 pts | Implementación limpia de esquemas, middlewares, errores y controladores delgados. |
| **3. Producto** | 30 pts | 30 pts | API robusta con validaciones activas, contratos uniformes y documentación completa. |
| **TOTAL** | **100 pts** | **100 pts** | **Excelente — Nivel de Logro Destacado** |
