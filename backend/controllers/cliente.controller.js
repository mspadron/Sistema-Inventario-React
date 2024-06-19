import { pool } from "../db.js";

export const createCliente = async (req, res, next) => {
  try {
    const { id_usuario, nombre, correo, telefono, direccion } = req.body;

    const newCliente = await pool.query(
      `INSERT INTO "Cliente" (id_usuario, nombre, correo, telefono, direccion) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [id_usuario, nombre, correo, telefono, direccion]
    );

    res.json(newCliente.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllClientes = async (req, res, next) => {
  try {
    const allClientes = await pool.query(`SELECT * FROM "Cliente"`);
    const clienteCount = await countClientes();
    res.json({ clientes: allClientes.rows, count: clienteCount });
  } catch (error) {
    next(error);
  }
};

export const getCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM "Cliente" WHERE id_cliente = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Cliente not found" });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario, nombre, correo, telefono, direccion } = req.body;

    const result = await pool.query(
      `UPDATE "Cliente" SET id_usuario = $1, nombre = $2, correo = $3, telefono = $4, direccion = $5 WHERE id_cliente = $6 RETURNING *`,
      [id_usuario, nombre, correo, telefono, direccion, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Cliente not found" });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteCliente = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Eliminar los pagos asociados con el cliente
    await pool.query(`DELETE FROM "Pago" WHERE id_cliente = $1`, [id]);

    // Luego eliminar el cliente
    const result = await pool.query(
      `DELETE FROM "Cliente" WHERE id_cliente = $1`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Cliente not found" });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const countClientes = async () => {
  const result = await pool.query(`SELECT COUNT(*) FROM "Cliente"`);
  return parseInt(result.rows[0].count);
};
