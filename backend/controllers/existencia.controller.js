import { pool } from '../db.js';

export const createExistencia = async (req, res, next) => {
  try {
    const { stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia, id_producto, id_proveedor, id_usuario } = req.body;

    // Crear la nueva existencia
    const newExistencia = await pool.query(
      'INSERT INTO existencia (stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia) VALUES ($1, $2, $3, $4) RETURNING *',
      [stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia]
    );

    const id_existencia = newExistencia.rows[0].id_existencia;

    // Actualizar el campo id_existencia en la tabla producto
    await pool.query(
      'UPDATE producto SET id_existencia = $1 WHERE id_producto = $2',
      [id_existencia, id_producto]
    );

    // Actualizar el campo id_existencia en la tabla proveedor
    await pool.query(
      'UPDATE proveedor SET id_existencia = $1 WHERE id_proveedor = $2',
      [id_existencia, id_proveedor]
    );

    // Crear relación en la tabla gestiona
    await pool.query(
      'INSERT INTO gestiona (id_usuario, id_existencia) VALUES ($1, $2)',
      [id_usuario, id_existencia]
    );

    res.json(newExistencia.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllExistencias = async (req, res, next) => {
  try {
    const query = `
      SELECT 
          e.id_existencia, 
          e.stockinicial_existencia, 
          e.stockactual_existencia, 
          e.preciocompra_existencia, 
          e.precioventa_existencia, 
          p.nombre_producto, 
          c.nombre_categoria, 
          pr.nombre_proveedor, 
          u.nombre_usuario AS gestionada_por
      FROM 
          existencia e
      JOIN 
          producto p ON e.id_existencia = p.id_existencia
      JOIN 
          categoria c ON p.id_categoria = c.id_categoria
      LEFT JOIN 
          proveedor pr ON e.id_existencia = pr.id_existencia
      LEFT JOIN 
          gestiona g ON e.id_existencia = g.id_existencia
      LEFT JOIN 
          usuario u ON g.id_usuario = u.id_usuario;
    `;
    const allExistencias = await pool.query(query);
    res.json(allExistencias.rows);
  } catch (error) {
    next(error);
  }
};

export const getExistencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM existencia WHERE id_existencia = $1', [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Existencia not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateExistencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia } = req.body;

    const result = await pool.query(
      'UPDATE existencia SET stockinicial_existencia = $1, stockactual_existencia = $2, preciocompra_existencia = $3, precioventa_existencia = $4 WHERE id_existencia = $5 RETURNING *',
      [stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Existencia not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteExistencia = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Eliminar el campo id_existencia en la tabla producto
    await pool.query('UPDATE producto SET id_existencia = NULL WHERE id_existencia = $1', [id]);

    // Eliminar el campo id_existencia en la tabla proveedor
    await pool.query('UPDATE proveedor SET id_existencia = NULL WHERE id_existencia = $1', [id]);

    // Eliminar la relación en la tabla gestiona
    await pool.query('DELETE FROM gestiona WHERE id_existencia = $1', [id]);

    const result = await pool.query('DELETE FROM existencia WHERE id_existencia = $1', [id]);

    if (result.rowCount === 0) return res.status(404).json({ message: 'Existencia not found' });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
