import { Router } from "express";
import {
  createPago,
  deletePago,
  getAllPagos,
  getPago,
  updatePago,
  countPagos
} from "../controllers/pago.controller.js";

const router = Router();

router.route("/").get(getAllPagos).post(createPago);
router.route("/:id").get(getPago).put(updatePago).delete(deletePago);
router.route("/count").get(countPagos);
export default router;

