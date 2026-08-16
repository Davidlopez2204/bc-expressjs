// ============================================================================
// ROUTES — Solo conecto la URL con la función del controller
// ============================================================================

import { Router } from 'express';
import * as controller from '../controllers/catering-services.controller.js';

export const cateringRouter = Router();

cateringRouter.get('/', controller.getAll);
cateringRouter.get('/:id', controller.getById);
cateringRouter.post('/', controller.create);
cateringRouter.put('/:id', controller.update);
cateringRouter.delete('/:id', controller.remove);
