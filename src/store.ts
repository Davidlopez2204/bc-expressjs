import { CateringService, CreateCateringServiceDto, UpdateCateringServiceDto } from './types.js';

// ============================================================================
// STORE EN MEMORIA — SIMULA UNA BASE DE DATOS TEMPORAL PARA CATERING
// ============================================================================

// Base de datos inicial en memoria con datos de ejemplo reales
const servicesStore: CateringService[] = [
  {
    id: 1,
    name: 'Buffet Ejecutivo Premium',
    category: 'Buffet',
    pricePerPerson: 35.0,
    minPeople: 20,
    isAvailable: true,
  },
  {
    id: 2,
    name: 'Coffee Break Empresarial',
    category: 'Coffee Break',
    pricePerPerson: 15.5,
    minPeople: 15,
    isAvailable: true,
  },
  {
    id: 3,
    name: 'Banquete de Gala y Bodas',
    category: 'Banquete',
    pricePerPerson: 65.0,
    minPeople: 50,
    isAvailable: true,
  },
  {
    id: 4,
    name: 'Estación de Postres y Repostería',
    category: 'Postres',
    pricePerPerson: 18.0,
    minPeople: 25,
    isAvailable: false,
  },
];

// Contador para generar IDs numéricos autoincrementales
let currentId = servicesStore.length + 1;

/**
 * 1. Obtiene todos los servicios de catering almacenados.
 */
export const getAllServices = (): CateringService[] => {
  return [...servicesStore];
};

/**
 * 2. Busca un servicio de catering por su ID.
 */
export const getServiceById = (id: number): CateringService | undefined => {
  return servicesStore.find((service) => service.id === id);
};

/**
 * 3. Crea y guarda un nuevo servicio de catering.
 */
export const createService = (data: CreateCateringServiceDto): CateringService => {
  const newService: CateringService = {
    id: currentId++,
    ...data,
  };
  servicesStore.push(newService);
  return newService;
};

/**
 * 4. Actualiza un servicio de catering existente por su ID.
 */
export const updateService = (
  id: number,
  data: UpdateCateringServiceDto
): CateringService | undefined => {
  const index = servicesStore.findIndex((service) => service.id === id);
  if (index === -1) {
    return undefined;
  }

  // Combinamos los datos anteriores con los nuevos datos actualizados
  servicesStore[index] = {
    ...servicesStore[index],
    ...data,
  };

  return servicesStore[index];
};

/**
 * 5. Elimina un servicio de catering por su ID.
 */
export const removeService = (id: number): boolean => {
  const index = servicesStore.findIndex((service) => service.id === id);
  if (index === -1) {
    return false;
  }

  servicesStore.splice(index, 1);
  return true;
};
