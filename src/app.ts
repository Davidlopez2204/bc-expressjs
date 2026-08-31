// src/app.ts — Configuración de la aplicación Express

import express from 'express';
import cateringRouter from './routes/catering-services.routes';
import menuItemsRouter from './routes/menu-items.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas del recurso principal
app.use('/api/v1/catering-services', cateringRouter);

// Rutas anidadas de ítems del menú
app.use('/api/v1/catering-services/:serviceId/menu-items', menuItemsRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
