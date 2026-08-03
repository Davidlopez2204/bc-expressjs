import type { CateringPackage, CateringSummary, Report } from './types.js';

// Aquí saco todas las cuentas y totales de mi servicio de catering
export function processCateringData(
  packages: CateringPackage[],
  categoryFilter?: string
): Report {
  // 1. Si pedí buscar una categoría (ej: bodas), me quedo solo con esos banquetes
  const filtered = categoryFilter
    ? packages.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase())
    : packages;

  // 2. Cuento cuáles están disponibles (activos) y cuáles no
  const activePackages = filtered.filter(p => p.active);
  const inactivePackages = filtered.filter(p => !p.active);

  // 3. Sumo todos los precios por persona y divido para sacar el precio promedio
  const totalPrice = filtered.reduce((acc, p) => acc + p.pricePerPerson, 0);
  const averagePrice = filtered.length > 0 ? totalPrice / filtered.length : 0;

  // 4. Ordeno de mayor a menor precio para saber cuál es el menú más caro y el más barato
  const sortedByPrice = [...filtered].sort((a, b) => b.pricePerPerson - a.pricePerPerson);
  const mostExpensivePackage = sortedByPrice[0] || null;
  const cheapestPackage = sortedByPrice[sortedByPrice.length - 1] || null;

  // 5. Agrupo los nombres de las categorías que tengo sin repetirlos
  const categories = Array.from(new Set(packages.map(p => p.category)));

  // 6. Guardo todos los totales calculados en un resumen
  const summary: CateringSummary = {
    totalPackages: filtered.length,
    activePackages: activePackages.length,
    inactivePackages: inactivePackages.length,
    averagePricePerPerson: Number(averagePrice.toFixed(2)),
    mostExpensivePackage,
    cheapestPackage,
    categories,
  };

  // 7. Devuelvo la información lista con la fecha y hora de la consulta
  return {
    generatedAt: new Date().toISOString(),
    appliedFilter: categoryFilter || null,
    summary,
    packages: filtered,
  };
}
