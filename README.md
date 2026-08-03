#  Proyecto Semana 01 — Procesador de Servicio de Catering

Este proyecto es una herramienta de línea de comandos (CLI) construida con **Node.js, TypeScript y async/await** para procesar y analizar paquetes de servicio de catering.

---

##  Dominio Asignado: Servicio de Catering

El sistema trabaja con banquetes y paquetes de catering con los siguientes atributos:
- **`id`**: Identificador único del paquete (ej: `cat-001`).
- **`name`**: Nombre del menú (ej: *Buffet Ejecutivo Premium*, *Banquete Imperial de Boda*).
- **`category`**: Categoría del evento (*empresarial*, *boda*, *social*, *infantil*).
- **`pricePerPerson`**: Precio en USD por cada invitado.
- **`minGuests`**: Mínimo de invitados requeridos para la contratación.
- **`includesStaff`**: Indica si el servicio incluye meseros y personal de atención.
- **`active`**: Disponibilidad del paquete.

---

##  Tecnologías Utilizadas

- **Node.js 22+** (Modelo de I/O no bloqueante con `fs/promises`)
- **TypeScript 5.8+** (Configuración estricta con `strict: true`)
- **ES Modules (ESM)** (`import`/`export` nativo)
- **tsx** (Ejecutor TypeScript en tiempo de desarrollo)

---

##  Cómo Ejecutar el Proyecto

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Ejecutar en modo desarrollo
```bash
pnpm dev
```

### 3. Validar compilación de TypeScript (Rúbrica)
```bash
pnpm build
```

---

## 📁 Estructura del Código

```text
express/
├── data/
│   └── catering.json          # Archivo de datos de los paquetes de catering
├── output/
│   └── catering-report.json   # Reporte generado automáticamente
├── src/
│   ├── types.ts               # Definición de tipos e interfaces del dominio
│   ├── reader.ts              # Lectura de datos JSON con fs/promises
│   ├── processor.ts           # Cálculo de estadísticas y promedios
│   ├── writer.ts              # Escritura del reporte JSON en disco
│   └── index.ts               # Punto de entrada principal
├── package.json               # Configuración del proyecto y scripts
└── tsconfig.json              # Configuración estricta de TypeScript
```

---

## 📊 Resultado del Reporte Generado

El reporte se guarda automáticamente en `output/catering-report.json` e incluye:
- Total de paquetes analizados.
- Paquetes activos e inactivos.
- Precio promedio por persona.
- Paquete más destacado (mayor precio) y paquete más económico.
- Lista de categorías disponibles.
