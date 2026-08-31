// src/routes/menu-items.routes.ts — Rutas de MenuItem (anidadas)

import { Router } from 'express';
import * as ctrl from '../controllers/menu-items.controller';

const router = Router({ mergeParams: true });

router.get('/', ctrl.getByServiceId);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);

export default router;
