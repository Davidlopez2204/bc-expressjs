// ===================================================
// LO QUE NECESITO PARA MI NEGOCIO DE CATERING
// ===================================================

// La plantilla con los datos de cada menú o paquete de catering
export interface CateringPackage {
  id: string;             // Código del menú (ejemplo: "cat-001")
  name: string;           // Nombre de la comida o banquete
  category: 'empresarial' | 'boda' | 'social' | 'infantil' | string; // Tipo de evento
  pricePerPerson: number; // Cuánto cuesta por cada invitado
  minGuests: number;      // Mínimo de personas para contratarlo
  includesStaff: boolean; // ¿Incluye meseros? (sí o no)
  active: boolean;        // ¿Está disponible actualmente?
}

// Las cuentas y estadísticas que voy a calcular
export interface CateringSummary {
  totalPackages: number;                   // Cuántos banquetes hay en total
  activePackages: number;                  // Cuántos están disponibles
  inactivePackages: number;                // Cuántos no están disponibles
  averagePricePerPerson: number;           // Precio promedio por persona
  mostExpensivePackage: CateringPackage | null; // El paquete más caro
  cheapestPackage: CateringPackage | null;      // El paquete más barato
  categories: string[];                    // Todas las categorías que tengo
}

// El reporte final que voy a guardar
export interface Report {
  generatedAt: string;         // Hora y fecha en que hice la cuenta
  appliedFilter: string | null; // Si busque una categoría específica
  summary: CateringSummary;    // El resumen con todos los totales
  packages: CateringPackage[]; // Lista con los banquetes
}
