import { Router } from 'express';
import {
  createRol,
  deleteRol,
  getAllRoles,
  getRol,
  updateRol
} from '../controllers/roles.controller.js';

const router = Router();

router.route('/').get(getAllRoles).post(createRol);
router.route('/:id_rol').get(getRol).put(updateRol).delete(deleteRol);

export default router;
