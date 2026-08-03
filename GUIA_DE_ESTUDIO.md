# 📘 Guía de Estudio Paso a Paso: Programación Backend con Node.js & TypeScript desde Cero

Esta guía está diseñada como un **manual de estudio práctico** para que puedas replicar y construir desde cero cualquier proyecto de procesamiento de datos en Node.js y TypeScript (ya sea para Catering, Biblioteca, Farmacia, Gimnasio, o cualquier otro dominio).

---

## 🧭 1. El Mapa del Proyecto (Estructura de Carpetas)

Cuando programas un backend en Node.js, siempre debes separar las responsabilidades en archivos limpios:

```text
mi-proyecto/
├── data/
│   └── datos.json         # 1. LA FUENTE: Los datos de entrada (Formato JSON)
├── output/
│   └── reporte.json       # 2. EL RESULTADO: La carpeta creada automáticamente con el resultado
├── src/
│   ├── types.ts           # 3. LOS MODELOS: Reglas de qué forma tienen los datos en TypeScript
│   ├── reader.ts          # 4. EL LECTOR: Abrir y leer el archivo JSON
│   ├── processor.ts       # 5. EL CEREBRO: Calcular promedios, filtros, mayor y menor precio
│   ├── writer.ts          # 6. EL ESCRITOR: Crear la carpeta output y guardar el reporte
│   └── index.ts           # 7. EL DIRECTOR: El archivo principal que ejecuta todo en orden
├── package.json           # Configuración de dependencias y comandos ejecutable
└── tsconfig.json          # Reglas del compilador de TypeScript
```

---

## 🛠️ 2. Guía Paso a Paso para Replicarlo a Mano

### PASO 1: Crear la Carpeta e Inicializar Node.js
Abre la terminal en una carpeta vacía e inicializa Node.js:

```bash
pnpm init
```

Esto crea el archivo `package.json`. Edítalo y agrégale `"type": "module"` y los comandos de ejecución:

```json
{
  "name": "mi-proyecto-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.8.0"
  }
}
```

Luego instala las herramientas de desarrollo:
```bash
pnpm install
```

---

### PASO 2: Configurar TypeScript (`tsconfig.json`)
Crea el archivo `tsconfig.json` en la raíz para indicarle a TypeScript que trabaje en modo estricto:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

---

### PASO 3: Crear los Datos (`data/catering.json`)
Crea la carpeta `data/` y un archivo `catering.json` con la lista de elementos en formato de arreglo JSON `[...]`:

```json
[
  {
    "id": "cat-001",
    "name": "Buffet Ejecutivo Premium",
    "category": "empresarial",
    "pricePerPerson": 35.50,
    "minGuests": 20,
    "includesStaff": true,
    "active": true
  }
]
```

---

### PASO 4: Definir los Tipos de Datos (`src/types.ts`)
En TypeScript siempre defines primero las "plantillas" (interfaces) de tus objetos para evitar errores:

```typescript
// Planteo la estructura de 1 paquete
export interface CateringPackage {
  id: string;
  name: string;
  category: string;
  pricePerPerson: number;
  minGuests: number;
  includesStaff: boolean;
  active: boolean;
}

// Planteo las cuentas finales que voy a calcular
export interface CateringSummary {
  totalPackages: number;
  activePackages: number;
  inactivePackages: number;
  averagePricePerPerson: number;
  mostExpensivePackage: CateringPackage | null;
  cheapestPackage: CateringPackage | null;
  categories: string[];
}

// Planteo el reporte completo
export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: CateringSummary;
  packages: CateringPackage[];
}
```

---

### PASO 5: Crear la Lectura de Archivos (`src/reader.ts`)
Para leer un archivo asíncronamente sin bloquear la aplicación, usamos `fs/promises`:

```typescript
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { CateringPackage } from './types.js';

export async function readCateringData(): Promise<CateringPackage[]> {
  try {
    // 1. Busco la ruta donde está mi JSON
    const targetPath = join(import.meta.dirname, '../data/catering.json');
    // 2. Leo el contenido como texto
    const data = await readFile(targetPath, 'utf-8');
    // 3. Convierto el texto a objetos de JavaScript
    return JSON.parse(data) as CateringPackage[];
  } catch (error) {
    console.error('Error al leer los datos:', error);
    throw error;
  }
}
```

> **💡 Consejo**: Al importar archivos locales en Node.js ESM, **siempre** debes poner `.js` al final (`from './types.js'`).

---

### PASO 6: El Procesador de Cuentas y Estadísticas (`src/processor.ts`)
En este archivo calculamos los totales, promedios y elementos destacados:

```typescript
import type { CateringPackage, CateringSummary, Report } from './types.js';

export function processCateringData(packages: CateringPackage[], categoryFilter?: string): Report {
  // 1. Filtrar si piden una categoría
  const filtered = categoryFilter 
    ? packages.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase())
    : packages;

  // 2. Contar activos e inactivos
  const activePackages = filtered.filter(p => p.active);
  const inactivePackages = filtered.filter(p => !p.active);

  // 3. Calcular precio promedio (sumar todos y dividir entre la cantidad)
  const totalPrice = filtered.reduce((acc, p) => acc + p.pricePerPerson, 0);
  const averagePrice = filtered.length > 0 ? totalPrice / filtered.length : 0;

  // 4. Ordenar de mayor a menor precio
  const sorted = [...filtered].sort((a, b) => b.pricePerPerson - a.pricePerPerson);
  const mostExpensivePackage = sorted[0] || null;
  const cheapestPackage = sorted[sorted.length - 1] || null;

  // 5. Categorías únicas
  const categories = Array.from(new Set(packages.map(p => p.category)));

  const summary: CateringSummary = {
    totalPackages: filtered.length,
    activePackages: activePackages.length,
    inactivePackages: inactivePackages.length,
    averagePricePerPerson: Number(averagePrice.toFixed(2)),
    mostExpensivePackage,
    cheapestPackage,
    categories
  };

  return {
    generatedAt: new Date().toISOString(),
    appliedFilter: categoryFilter || null,
    summary,
    packages: filtered
  };
}
```

---

### PASO 7: Guardar el Reporte (`src/writer.ts`)
Creamos la función que guarda la respuesta en la carpeta `output/`:

```typescript
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { Report } from './types.js';

export async function writeCateringReport(report: Report): Promise<string> {
  try {
    const targetPath = join(import.meta.dirname, '../output/catering-report.json');
    // Si la carpeta no existe, la crea automáticamente
    await mkdir(dirname(targetPath), { recursive: true });
    // Guarda el JSON con formato bonito (espaciado de 2)
    await writeFile(targetPath, JSON.stringify(report, null, 2), 'utf-8');
    return targetPath;
  } catch (error) {
    console.error('Error al guardar el reporte:', error);
    throw error;
  }
}
```

---

### PASO 8: Conectar Todo en el Punto de Entrada (`src/index.ts`)
Este archivo une los tres pasos: **Leer -> Procesar -> Guardar**.

```typescript
import { readCateringData } from './reader.js';
import { processCateringData } from './processor.js';
import { writeCateringReport } from './writer.js';

async function main() {
  console.log('🚀 Iniciando proceso...');

  try {
    // 1. Leer
    const rawData = await readCateringData();
    // 2. Procesar
    const report = processCateringData(rawData);
    // 3. Guardar
    const savedPath = await writeCateringReport(report);

    console.log(`✅ ¡Reporte generado exitosamente en: ${savedPath}`);
  } catch (error) {
    console.error('❌ Falló la ejecución:', error);
    process.exit(1);
  }
}

main();
```

---

## ⚡ 3. Resumen de Comandos Rápidos

| Lo que quieres hacer | Comando a ejecutar en terminal |
| :--- | :--- |
| **Correr tu programa** | `pnpm dev` |
| **Comprobar si TypeScript tiene errores** | `pnpm build` |
| **Crear una rama nueva en Git** | `git checkout -b nombre-rama` |
| **Guardar cambios en Git** | `git add .` <br> `git commit -m "feat: mi mensaje"` |
| **Subir a GitHub** | `git push -u origin nombre-rama` |
