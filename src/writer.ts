// Herramientas de Node.js para crear carpetas y guardar archivos
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { Report } from './types.js';

// Función para guardar mi reporte final en un archivo en la computadora
export async function writeCateringReport(report: Report, outputPath?: string): Promise<string> {
  try {
    // Defino la carpeta donde voy a guardar el reporte (output/catering-report.json)
    const targetPath = outputPath || join(import.meta.dirname, '../output/catering-report.json');
    
    // Si la carpeta "output" no existe todavía, Node.js la crea por mí
    await mkdir(dirname(targetPath), { recursive: true });
    
    // Guardo el reporte ordenado en el archivo
    await writeFile(targetPath, JSON.stringify(report, null, 2), 'utf-8');
    
    // Devuelvo el camino o ruta donde quedó guardado
    return targetPath;
  } catch (error) {
    console.error('❌ Ocurrió un problema al guardar el reporte:', error);
    throw error;
  }
}
