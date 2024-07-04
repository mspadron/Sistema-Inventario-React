import { pool } from '../db.js';

export const createProducto = async (req, res, next) => {
  try {
    const { id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto } = req.body;

    const newProducto = await pool.query(
      `INSERT INTO producto (id_categoria, nombre_producto, precio_producto, fechaexpiracion_producto) 
       VALUES($1, $2, $3, $4) RETURNING *`,
      [id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto]
    );

    res.json(newProducto.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllProductos = async (req, res, next) => {
  try {
    const allProductos = await pool.query('SELECT * FROM producto');
    res.json(allProductos.rows);
  } catch (error) {
    next(error);
  }
};

export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM producto WHERE id_producto = $1', [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Producto not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto } = req.body;

    const result = await pool.query(
      `UPDATE producto SET id_categoria = $1, nombre_producto = $2, precio_producto = $3, fechaexpiracion_producto = $4 
       WHERE id_producto = $5 RETURNING *`,
      [id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Producto not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateProductoExistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_existencia } = req.body;

    const result = await pool.query(
      `UPDATE producto SET id_existencia = $1 WHERE id_producto = $2 RETURNING *`,
      [id_existencia, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Producto not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM producto WHERE id_producto = $1', [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Producto not found' });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
