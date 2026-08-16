# 📖 Guía de Estudio — Semana 03: Arquitectura en Capas

## ¿Qué hice esta semana?

Tomé la API de la semana 02 (que tenía todo mezclado en pocos archivos) y la organicé en **4 capas separadas**, donde cada parte tiene un trabajo específico.

---

## Las 4 Capas (de afuera hacia adentro)

### 1. Routes — El mapa
Solo dice "si te piden esto, mándalo a esta función". No hace nada más.

```ts
cateringRouter.get('/', controller.getAll);
cateringRouter.get('/:id', controller.getById);
```

### 2. Controllers — El mesero
Recibe lo que pide el cliente (request), se lo pasa al cocinero (service), y regresa la respuesta. **Solo 3 pasos**: extraer → llamar → responder.

```ts
export async function getById(req, res, next) {
  const id = Number(req.params.id);         // 1. Extraer
  const result = await service.findById(id); // 2. Llamar
  res.json({ data: result });                // 3. Responder
}
```

### 3. Services — El cocinero
Aquí va la lógica del negocio. NO conoce nada de Express (sin req, res, next). Hace los cálculos, la paginación, y decide qué pasa.

```ts
export async function findAll(params) {
  const all = await repo.findAll();
  const start = (params.page - 1) * params.limit;
  const data = all.slice(start, start + params.limit);
  return { data, total: all.length, page: params.page, limit: params.limit };
}
```

### 4. Repositories — La bodega
Es el ÚNICO lugar donde se tocan los datos. Hoy es un array en memoria, pero mañana puede ser PostgreSQL y solo hay que cambiar aquí.

```ts
export async function findAll(): Promise<CateringService[]> {
  return [...store]; // Copia defensiva
}
```

---

## DTOs (Data Transfer Objects)

Son los "moldes" que definen qué datos entran y salen de la API:

- **`CreateCateringServiceDto`** = `Omit<CateringService, 'id' | 'createdAt'>` → Para crear (sin id ni fecha)
- **`UpdateCateringServiceDto`** = `Partial<CreateCateringServiceDto>` → Para actualizar (todo opcional)

---

## Contratos de Respuesta

Todas las respuestas siguen un formato consistente:

| Situación | Formato |
|-----------|---------|
| Lista paginada | `{ data: [...], total, page, limit }` |
| Un elemento | `{ data: {...} }` |
| Error | `{ error: "Not Found", message: "..." }` |

---

## ¿Por qué los métodos del repository son `async`?

Aunque hoy no hacen nada asíncrono (es un array en memoria), cuando conectemos una base de datos real en la semana 05, todas las consultas serán `async`. Si los definimos así desde ahora, no tenemos que cambiar las firmas después.

---

## ¿Qué es una copia defensiva?

Cuando hago `return [...store]` en vez de `return store`, estoy devolviendo una **copia** del array. Así, si alguien modifica lo que le devolví, no afecta mis datos originales.

---

## Paginación

Permite traer los datos por partes en vez de todos juntos:

```
GET /api/v1/catering-services?page=1&limit=2
```

El service corta el array usando `slice`:
```ts
const start = (page - 1) * limit;  // página 1, limit 2 → start = 0
const data = all.slice(start, start + limit); // [0, 2)
```
