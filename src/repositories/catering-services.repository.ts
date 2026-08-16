// ============================================================================
// REPOSITORY — Aquí guardo y busco los datos de catering (como si fuera la BD)
// ============================================================================

import { CateringService, CreateCateringServiceDto, UpdateCateringServiceDto } from '../types.js';

// Mi "base de datos" en memoria con servicios de ejemplo
const store: CateringService[] = [
  {
    id: 1,
    name: 'Buffet Ejecutivo Premium',
    category: 'Buffet',
    pricePerPerson: 35.0,
    minPeople: 20,
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Coffee Break Empresarial',
    category: 'Coffee Break',
    pricePerPerson: 15.5,
    minPeople: 15,
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Banquete de Gala y Bodas',
    category: 'Banquete',
    pricePerPerson: 65.0,
    minPeople: 50,
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Estación de Postres y Repostería',
    category: 'Postres',
    pricePerPerson: 18.0,
    minPeople: 25,
    isAvailable: false,
    createdAt: new Date().toISOString(),
  },
];

// Contador para que cada servicio nuevo tenga un ID diferente
let nextId = 5;

// Traer todos los servicios (devuelvo una copia para no modificar el original)
export async function findAll(): Promise<CateringService[]> {
  return [...store];
}

// Buscar un servicio por su ID
export async function findById(id: number): Promise<CateringService | undefined> {
  return store.find((service) => service.id === id);
}

// Crear un servicio nuevo y guardarlo
export async function create(dto: CreateCateringServiceDto): Promise<CateringService> {
  const newService: CateringService = {
    id: nextId++,
    ...dto,
    createdAt: new Date().toISOString(),
  };
  store.push(newService);
  return { ...newService };
}

// Actualizar un servicio que ya existe
export async function update(id: number, dto: UpdateCateringServiceDto): Promise<CateringService | undefined> {
  const index = store.findIndex((service) => service.id === id);
  if (index === -1) return undefined;

  store[index] = { ...store[index], ...dto };
  return { ...store[index] };
}

// Eliminar un servicio por su ID
export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((service) => service.id === id);
  if (index === -1) return false;

  store.splice(index, 1);
  return true;
}
