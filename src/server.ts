import { app } from './app.js';

// Puerto configurable por variable de entorno o puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Arrancamos el servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor Express ejecutándose en el puerto ${PORT}`);
  console.log(`📍 Endpoint base: http://localhost:${PORT}/api/v1/catering-services`);
  console.log(`====================================================`);
});

// ============================================================================
// GRACEFUL SHUTDOWN (Cierre limpio del servidor)
// ============================================================================

const gracefulShutdown = (signal: string) => {
  console.log(`\n🛑 Recibida señal de cierre (${signal}). Cerrando servidor de forma limpia...`);
  
  server.close(() => {
    console.log('✅ Servidor HTTP cerrado correctamente. Sin conexiones pendientes.');
    process.exit(0);
  });

  // Si en 10 segundos no se han cerrado las conexiones, forzamos la salida
  setTimeout(() => {
    console.error('⚠️ Forzando el cierre del proceso tras 10 segundos.');
    process.exit(1);
  }, 10000);
};

// Capturamos Ctrl+C en la terminal (SIGINT)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Capturamos la señal de terminación del sistema (SIGTERM)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
