# 📖 Guía de Estudio — Semana 05: PostgreSQL + Prisma ORM

## ¿Qué aprendí esta semana?

En la semana 04 aprendí a validar datos con Zod y a centralizar el manejo de errores. Pero había un problema fundamental: **los datos vivían en un array en memoria**. Cada vez que reiniciaba el servidor, todo se perdía.

Esta semana 05 di el salto a la persistencia real:
1. **PostgreSQL**: Una base de datos relacional real para almacenar datos de forma permanente.
2. **Prisma ORM**: Un intermediario entre mi código TypeScript y la base de datos que genera tipos automáticos.
3. **Migraciones**: Versionamiento del esquema de la base de datos (como Git para las tablas).
4. **Relaciones**: Un `CateringService` tiene muchos `MenuItem` (relación uno-a-muchos con `@relation`).
5. **Errores de Prisma**: Manejo de códigos como `P2025` (no encontrado) y `P2002` (duplicado).
6. **Docker**: Contenedor para correr PostgreSQL sin instalar nada en mi máquina.

---

## 🗄️ 1. ¿Por qué una base de datos real?

### Antes (Semana 04 — Array en memoria):
```ts
const store: CateringService[] = [
  { id: 1, name: 'Buffet Ejecutivo', ... },
  { id: 2, name: 'Coffee Break', ... },
];
```
*Problemas*: Los datos se perdían al reiniciar, no había búsqueda eficiente, no había integridad referencial.

### Ahora (Semana 05 — PostgreSQL):
Los datos viven en tablas de una base de datos relacional. Sobreviven reinicios, soportan consultas complejas y garantizan integridad de los datos.

---

## 🔧 2. ¿Qué es Prisma ORM?

Prisma es un **Object-Relational Mapping (ORM)** que actúa como un traductor entre nuestro código TypeScript y la base de datos SQL.

```text
Mi código TypeScript
       ⬇
[ Prisma Client ]  ← genera tipos automáticos desde schema.prisma
       ⬇
   Consultas SQL
       ⬇
[ PostgreSQL ]
```

### Las 3 piezas de Prisma:
1. **`schema.prisma`**: Archivo donde defino los modelos (tablas), tipos y relaciones.
2. **Prisma Migrate**: Herramienta que genera y ejecuta las migraciones SQL.
3. **Prisma Client**: Librería auto-generada con métodos tipados para hacer CRUD.

---

## 📐 3. El Schema de Prisma (El Contrato con la Base de Datos)

```prisma
model CateringService {
  id             Int        @id @default(autoincrement())
  name           String     @unique
  category       String
  pricePerPerson Float
  minPeople      Int
  isAvailable    Boolean    @default(true)
  createdAt      DateTime   @default(now()) @map("created_at")

  menuItems MenuItem[]  // Relación 1:N

  @@map("catering_services")  // Nombre de la tabla en PostgreSQL
}
```

| Decorador | Significado |
|-----------|-------------|
| `@id` | Llave primaria |
| `@default(autoincrement())` | Se autoincrementa automáticamente |
| `@unique` | No puede haber dos registros con el mismo valor |
| `@default(now())` | Valor por defecto: la fecha actual |
| `@map("nombre")` | Nombre de la columna en la BD (snake_case) |
| `@@map("nombre")` | Nombre de la tabla en la BD (snake_case) |

---

## 🔗 4. Relaciones (Uno-a-Muchos)

Un `CateringService` tiene muchos `MenuItem` (1:N):

```prisma
model CateringService {
  // ... campos ...
  menuItems MenuItem[]   // ← Lado "uno" (tiene muchos)
}

model MenuItem {
  // ... campos ...
  cateringServiceId Int              @map("catering_service_id")
  cateringService   CateringService  @relation(fields: [cateringServiceId], references: [id], onDelete: Cascade)
  // ↑ Lado "muchos" (pertenece a uno)
}
```

### ¿Qué es `onDelete: Cascade`?
Si elimino un `CateringService`, automáticamente se eliminan todos sus `MenuItem` asociados. No quedan huérfanos.

### ¿Cómo traigo los datos relacionados?
Con `include`:
```ts
const service = await prisma.cateringService.findUnique({
  where: { id: 1 },
  include: { menuItems: true },  // ← Trae los ítems del menú junto con el servicio
});
```

---

## 🔄 5. Migraciones (Git para la Base de Datos)

Las migraciones son archivos SQL que Prisma genera automáticamente cuando cambio el `schema.prisma`:

```bash
npx prisma migrate dev --name init
```

Esto hace 3 cosas:
1. Compara mi `schema.prisma` con el estado actual de la BD
2. Genera un archivo SQL con los cambios (`prisma/migrations/...`)
3. Ejecuta ese SQL en la base de datos

### ¿Por qué es importante?
Es como hacer `git commit` pero para la estructura de la base de datos. Puedo ver el historial de cambios y reproducirlo en otras máquinas.

---

## 🌱 6. Seed (Datos Iniciales)

El seed es un script que llena la base de datos con datos iniciales para desarrollo:

```ts
// prisma/seed.ts
const buffet = await prisma.cateringService.create({
  data: {
    name: 'Buffet Ejecutivo Premium',
    category: 'Buffet',
    pricePerPerson: 35.0,
    minPeople: 20,
    menuItems: {
      create: [
        { name: 'Ensalada César', description: 'Lechuga romana con crutones' },
        { name: 'Pollo al Horno', description: 'Pollo con hierbas finas' },
      ],
    },
  },
});
```

Se ejecuta con: `npx prisma db seed`

---

## ⚡ 7. CRUD con Prisma Client

### Antes (Semana 04 — Array en memoria):
```ts
export async function findAll(): Promise<CateringService[]> {
  return [...store];  // Copia del array
}
```

### Ahora (Semana 05 — Prisma Client):
```ts
export async function findAll(skip: number, take: number) {
  const [data, total] = await Promise.all([
    prisma.cateringService.findMany({
      skip,           // Paginación: saltar N registros
      take,           // Paginación: tomar N registros
      orderBy: { id: 'asc' },
      include: { menuItems: true },  // Traer relación
    }),
    prisma.cateringService.count(),  // Total para calcular páginas
  ]);
  return { data, total };
}
```

> **Nota clave**: Solo el Repository cambió internamente. La firma del método es similar, así que el Service y el Controller apenas necesitaron ajustes.

---

## 🛡️ 8. Manejo de Errores de Prisma

Prisma lanza errores con códigos específicos que debemos capturar en el Service:

| Código | Significado | Nuestra respuesta |
|--------|-------------|-------------------|
| `P2025` | Registro no encontrado (update/delete a ID inexistente) | `NotFoundError` (404) |
| `P2002` | Violación de constraint unique (nombre duplicado) | `ConflictError` (409) |

### Ejemplo en el Service:
```ts
export async function create(dto: CreateCateringServiceDto) {
  try {
    return await repo.create(dto);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`Ya existe un servicio con el nombre '${dto.name}'`);
    }
    throw err;
  }
}
```

---

## 🐳 9. Docker para PostgreSQL

En vez de instalar PostgreSQL en mi máquina, uso Docker Compose:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: catering_user
      POSTGRES_PASSWORD: catering_pass
      POSTGRES_DB: catering_db
```

```bash
docker compose up -d    # Levanta PostgreSQL en background
docker compose down     # Detiene y elimina el contenedor
```

---

## 🔄 10. Flujo Completo de Setup

```text
1. docker compose up -d          → Levanta PostgreSQL
2. pnpm install                  → Instala dependencias (incluye Prisma)
3. npx prisma migrate dev        → Crea las tablas en la BD
4. npx prisma db seed            → Llena con datos iniciales
5. pnpm dev                      → Arranca el servidor Express
```

---

## 🏗️ 11. El Principio de Sustitución en Acción

La gran demostración de la semana: **solo la capa Repository cambió de implementación** (de array a Prisma), pero las capas Service, Controller y Routes quedaron casi intactas.

Esto es exactamente lo que anticipamos en la semana 03:
> *"cuando conectemos una base de datos real en la semana 05, todas las consultas serán async. Si los definimos así desde ahora, no tenemos que cambiar las firmas después."*

```text
        Semana 04                    Semana 05
    ┌─────────────┐            ┌─────────────┐
    │   Routes    │     =      │   Routes    │  ← Sin cambios
    │ Controllers │     =      │ Controllers │  ← Sin cambios
    │  Services   │     ≈      │  Services   │  ← +manejo P2025/P2002
    │ Repository  │     ≠      │ Repository  │  ← Array → Prisma Client
    │  [Array]    │            │ [PostgreSQL] │
    └─────────────┘            └─────────────┘
```

---

## 📋 Resumen de Conceptos Clave

| Concepto | Descripción |
|----------|-------------|
| **PostgreSQL** | Base de datos relacional con tablas, columnas, FK |
| **Prisma ORM** | Traductor TypeScript ↔ SQL con tipos automáticos |
| **schema.prisma** | Define modelos, tipos, relaciones y restricciones |
| **Migraciones** | Versionamiento del esquema de la BD |
| **Seed** | Script para llenar la BD con datos iniciales |
| **@relation** | Define relaciones 1:N o N:M entre modelos |
| **include** | Eager loading de relaciones en consultas |
| **P2025** | Error Prisma: registro no encontrado |
| **P2002** | Error Prisma: violación de unique constraint |
| **Docker Compose** | Contenedor para correr PostgreSQL sin instalar |
