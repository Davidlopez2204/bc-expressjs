// src/middlewares/notFound.ts — Handler para rutas 404

import { Request, Response } from 'express';

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ status: 'error', message: `Route ${req.method} ${req.path} not found` });
}
