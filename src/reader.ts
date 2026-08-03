// Herramientas de Node.js para buscar y leer archivos
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { CateringPackage } from './types.js';

// Función para abrir y leer el archivo donde están mis paquetes de catering
export async function readCateringData(filePath?: string): Promise<CateringPackage[]> {
  try {
    // Busco la ubicación de mi archivo data/catering.json
    const targetPath = filePath || join(import.meta.dirname, '../data/catering.json');
    
    // Leo el texto del archivo
    const data = await readFile(targetPath, 'utf-8');
    
    // Convierto el texto en una lista de banquetes para usarlos en el programa
    return JSON.parse(data) as CateringPackage[];
  } catch (error) {
    // Si no encuentra el archivo o algo sale mal, me avisa en pantalla
    console.error('❌ Ocurrió un problema al leer el archivo de catering:', error);
    throw error;
  }
}
