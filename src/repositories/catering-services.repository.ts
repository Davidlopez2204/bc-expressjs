// ============================================================================
// REPOSITORY — Acceso a datos en memoria (Simulación de Base de Datos)
// ============================================================================
// Es el ÚNICO lugar donde se lee y modifica el array `store`.

import {
  CateringService,
  CreateCateringServiceDto,
  UpdateCateringServiceDto,
} from '../types.js';

// Base de datos en memoria con datos iniciales
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

// Contador de autoincremento para IDs
let nextId = 5;

// Obtener todos los servicios (copia defensiva)
export async function findAll(): Promise<CateringService[]> {
  return [...store];
}

// Buscar un servicio por ID
export async function findById(id: number): Promise<CateringService | undefined> {
  return store.find((service) => service.id === id);
}

// Guardar un nuevo servicio
export async function create(dto: CreateCateringServiceDto): Promise<CateringService> {
  const newService: CateringService = {
    id: nextId++,
    name: dto.name,
    category: dto.category,
    pricePerPerson: dto.pricePerPerson,
    minPeople: dto.minPeople,
    isAvailable: dto.isAvailable ?? true,
    createdAt: new Date().toISOString(),
  };

  store.push(newService);
  return { ...newService };
}

// Actualizar un servicio existente
export async function update(
  id: number,
  dto: UpdateCateringServiceDto
): Promise<CateringService | undefined> {
  const index = store.findIndex((service) => service.id === id);
  if (index === -1) return undefined;

  store[index] = {
    ...store[index],
    ...dto,
  };

  return { ...store[index] };
}

// Eliminar un servicio por su ID
export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((service) => service.id === id);
  if (index === -1) return false;

  store.splice(index, 1);
  return true;
}
