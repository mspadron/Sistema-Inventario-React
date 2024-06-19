import { pool } from "../db.js";

export const createPoliza = async (req, res, next) => {
  try {
    const { tipo_poliza, descripcion } = req.body;

    const newPoliza = await pool.query(
      `INSERT INTO "Poliza" (tipo_poliza, descripcion) VALUES($1, $2) RETURNING *`,
      [tipo_poliza, descripcion]
    );

    res.json(newPoliza.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllPolizas = async (req, res, next) => {
  try {
    const allPolizas = await pool.query(`SELECT * FROM "Poliza"`);
    const polizaCount = await countPolizas(); 
    res.json({ polizas: allPolizas.rows, count: polizaCount });
  } catch (error) {
    next(error);
  }
};

export const getPoliza = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM "Poliza" WHERE id_poliza = $1`, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Poliza not found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updatePoliza = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo_poliza, descripcion } = req.body;

    const result = await pool.query(
      `UPDATE "Poliza" SET tipo_poliza = $1, descripcion = $2 WHERE id_poliza = $3 RETURNING *`,
      [tipo_poliza, descripcion, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Poliza not found" });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletePoliza = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Eliminar los pagos asociados con la póliza
    await pool.query(`DELETE FROM "Pago" WHERE id_poliza = $1`, [id]);

    // Luego eliminar la póliza
    const result = await pool.query(`DELETE FROM "Poliza" WHERE id_poliza = $1`, [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Poliza not found" });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const countPolizas = async () => {
  const result = await pool.query(`SELECT COUNT(*) FROM "Poliza"`);
  return parseInt(result.rows[0].count);
};

