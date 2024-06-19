import express from "express";

const router = express.Router();

import userRouter from "./user.routes.js";
import clienteRouter from "./cliente.routes.js";  
import polizaRouter from "./poliza.routes.js";
import pagoRouter from "./pago.routes.js";

router.use("/users", userRouter);
router.use("/clientes", clienteRouter);  
router.use("/polizas", polizaRouter); 
router.use("/pagos", pagoRouter); 


export default router;