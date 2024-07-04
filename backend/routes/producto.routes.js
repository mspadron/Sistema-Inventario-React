import { Router } from 'express';
import {
  createProducto,
  deleteProducto,
  getAllProductos,
  getProducto,
  updateProducto
} from '../controllers/producto.controller.js';

const router = Router();

router.route('/').get(getAllProductos).post(createProducto);
router.route('/:id').get(getProducto).put(updateProducto).delete(deleteProducto);

export default router;
