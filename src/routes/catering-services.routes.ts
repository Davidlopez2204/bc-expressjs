import { Router, Request, Response } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  removeService,
} from '../store.js';
import { CreateCateringServiceDto, UpdateCateringServiceDto } from '../types.js';

export const cateringRouter = Router();

// ============================================================================
// 1. GET /api/v1/catering-services — Listar todos los servicios
// Status: 200 OK
// ============================================================================
cateringRouter.get('/', (_req: Request, res: Response) => {
  const services = getAllServices();
  res.status(200).json({
    success: true,
    data: services,
    count: services.length,
  });
});

// ============================================================================
// 2. GET /api/v1/catering-services/:id — Obtener un servicio por ID
// Status: 200 OK / 404 Not Found
// ============================================================================
cateringRouter.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      error: 'El ID enviado debe ser un número válido',
    });
  }

  const service = getServiceById(id);
  if (!service) {
    return res.status(404).json({
      error: `No se encontró ningún servicio de catering con el ID ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

// ============================================================================
// 3. POST /api/v1/catering-services — Crear un nuevo servicio
// Status: 201 Created / 400 Bad Request
// ============================================================================
cateringRouter.post('/', (req: Request, res: Response) => {
  const { name, category, pricePerPerson, minPeople, isAvailable } = req.body;

  // Validación básica del cuerpo de la petición
  if (!name || !category || pricePerPerson === undefined || minPeople === undefined) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: name, category, pricePerPerson, minPeople',
    });
  }

  const newServiceData: CreateCateringServiceDto = {
    name,
    category,
    pricePerPerson: Number(pricePerPerson),
    minPeople: Number(minPeople),
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
  };

  const createdService = createService(newServiceData);
  res.status(201).json({
    success: true,
    message: 'Servicio de catering creado exitosamente',
    data: createdService,
  });
});

// ============================================================================
// 4. PUT /api/v1/catering-services/:id — Actualizar un servicio por ID
// Status: 200 OK / 404 Not Found
// ============================================================================
cateringRouter.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      error: 'El ID enviado debe ser un número válido',
    });
  }

  const updateData: UpdateCateringServiceDto = req.body;
  const updatedService = updateService(id, updateData);

  if (!updatedService) {
    return res.status(404).json({
      error: `No se encontró ningún servicio de catering con el ID ${id} para actualizar`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Servicio de catering actualizado exitosamente',
    data: updatedService,
  });
});

// ============================================================================
// 5. DELETE /api/v1/catering-services/:id — Eliminar un servicio por ID
// Status: 204 No Content / 404 Not Found
// ============================================================================
cateringRouter.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      error: 'El ID enviado debe ser un número válido',
    });
  }

  const wasDeleted = removeService(id);
  if (!wasDeleted) {
    return res.status(404).json({
      error: `No se encontró ningún servicio de catering con el ID ${id} para eliminar`,
    });
  }

  // De acuerdo a las especificaciones REST, DELETE exitoso retorna status 204 sin cuerpo
  res.status(204).send();
});
