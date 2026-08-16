// ============================================================================
// SERVER — Punto de entrada, arranca el servidor
// ============================================================================

import { app } from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api/v1/catering-services`);
  console.log(`====================================================`);
});

// Cierre limpio del servidor
const gracefulShutdown = (signal: string) => {
  console.log(`\n🛑 Señal ${signal} recibida. Cerrando servidor...`);

  server.close(() => {
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️ Forzando cierre después de 10 segundos.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
