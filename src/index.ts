// Traigo las tres partes de mi programa (leer, calcular y guardar)
import { readCateringData } from './reader.js';
import { processCateringData } from './processor.js';
import { writeCateringReport } from './writer.js';

// Función principal que ejecuta todo el proceso de inicio a fin
async function main() {
  console.log('🍽️  === SISTEMA DE PROCESAMIENTO DE CATERING ===\n');

  try {
    // Paso 1: Leo los datos de mis banquetes desde el archivo
    console.log('1. Leyendo datos de catering...');
    const rawData = await readCateringData();
    console.log(`   ✓ ${rawData.length} paquetes cargados.`);

    // Paso 2: Hago las cuentas del promedio, el más caro y el más barato
    console.log('\n2. Procesando métricas del servicio...');
    const report = processCateringData(rawData);

    // Muestro el resultado en la pantalla
    console.log('   ----------------------------------------');
    console.log(`   • Total Paquetes: ${report.summary.totalPackages}`);
    console.log(`   • Precio Promedio / Persona: $${report.summary.averagePricePerPerson}`);
    console.log(`   • Paquete Destacado: ${report.summary.mostExpensivePackage?.name} ($${report.summary.mostExpensivePackage?.pricePerPerson}/pers)`);
    console.log(`   • Paquete Económico: ${report.summary.cheapestPackage?.name} ($${report.summary.cheapestPackage?.pricePerPerson}/pers)`);
    console.log('   ----------------------------------------\n');

    // Paso 3: Guardo el resumen en un archivo para entregarlo
    console.log('3. Guardando reporte en archivo JSON...');
    const savedPath = await writeCateringReport(report);
    console.log(`   ✓ Reporte generado exitosamente en: ${savedPath}`);

  } catch (error) {
    // Si ocurre un fallo, me muestra un mensaje claro en la pantalla
    console.error('\n ❌ Ocurrió un error en la ejecución:', error);
    process.exit(1);
  }
}

// Inicio la ejecución del programa
main();
