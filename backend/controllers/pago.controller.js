import { pool } from "../db.js";

export const createPago = async (req, res, next) => {
  try {
    const { id_cliente, id_poliza, montoPrima, fechaEmision } = req.body;

    const newPago = await pool.query(
      `INSERT INTO "Pago" (id_cliente, id_poliza, "montoPrima", "fechaEmision") VALUES($1, $2, $3, $4) RETURNING *`,
      [id_cliente, id_poliza, montoPrima, fechaEmision]
    );

    res.json(newPago.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllPagos = async (req, res, next) => {
  try {
    const allPagos = await pool.query(`SELECT * FROM "Pago"`);
    const pagoCount = await countPagos();
    res.json({ pagos: allPagos.rows, count: pagoCount });
  } catch (error) {
    next(error);
  }
};

export const getPago = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM "Pago" WHERE id_pago = $1`, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Pago not found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updatePago = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_cliente, id_poliza, montoPrima, fechaEmision } = req.body;

    const result = await pool.query(
      `UPDATE "Pago" SET id_cliente = $1, id_poliza = $2, "montoPrima" = $3, "fechaEmision" = $4 WHERE id_pago = $5 RETURNING *`,
      [id_cliente, id_poliza, montoPrima, fechaEmision, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Pago not found" });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletePago = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM "Pago" WHERE id_pago = $1`, [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Pago not found" });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const countPagos = async () => {
  const result = await pool.query(`SELECT COUNT(*) FROM "Pago"`);
  return parseInt(result.rows[0].count);
};