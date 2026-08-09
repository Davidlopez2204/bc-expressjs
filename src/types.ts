// ============================================================================
// TIPOS E INTERFACES — RECURSO PRINCIPAL: SERVICIO DE CATERING (SEMANA 02)
// ============================================================================

/**
 * Representa un servicio o banquete de catering disponible en la empresa.
 */
export interface CateringService {
  id: number;                 // Identificador único numérico (1, 2, 3...)
  name: string;               // Nombre del servicio (ej. "Buffet Ejecutivo Premium")
  category: string;           // Categoría ("Buffet", "Coffee Break", "Banquete", "Postres")
  pricePerPerson: number;     // Precio por persona (ej. 35.00 USD)
  minPeople: number;          // Mínimo de personas para contratarlo (ej. 20)
  isAvailable: boolean;       // Disponibilidad del servicio (true / false)
}

/**
 * DTO (Data Transfer Object) para crear un nuevo servicio de catering.
 */
export type CreateCateringServiceDto = Omit<CateringService, 'id'>;

/**
 * DTO para actualizar un servicio de catering existente.
 */
export type UpdateCateringServiceDto = Partial<CreateCateringServiceDto>;

// ============================================================================
// COMPATIBILIDAD SEMANA 01 (PROCESADOR CLI Y MOCK DATA)
// ============================================================================

export interface CateringPackage {
  id: string;
  name: string;
  category: string;
  pricePerPerson: number;
  minGuests: number;
  includesStaff: boolean;
  active: boolean;
}

export interface CateringSummary {
  totalPackages: number;
  activePackages: number;
  inactivePackages: number;
  averagePricePerPerson: number;
  mostExpensivePackage: CateringPackage | null;
  cheapestPackage: CateringPackage | null;
  categories: string[];
}

export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: CateringSummary;
  packages: CateringPackage[];
}
