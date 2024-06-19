import { Router } from "express";
import {
  createPoliza,
  deletePoliza,
  getAllPolizas,
  getPoliza,
  updatePoliza
} from "../controllers/poliza.controller.js";

const router = Router();

router.route("/").get(getAllPolizas).post(createPoliza);
router.route("/:id").get(getPoliza).put(updatePoliza).delete(deletePoliza);
export default router;
