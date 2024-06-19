import { Router } from "express";
import {
  createCliente,
  deleteCliente,
  getAllClientes,
  getCliente,
  updateCliente,
} from "../controllers/cliente.controller.js";

const router = Router();

router.route("/").get(getAllClientes).post(createCliente);
router.route("/:id").get(getCliente).put(updateCliente).delete(deleteCliente);
export default router;
