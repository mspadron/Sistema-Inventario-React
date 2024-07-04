import { pool } from '../db.js';

// Crear un proveedor sin `id_existencia`
export const createProveedor = async (req, res, next) => {
  try {
    const { nombre_proveedor, correo_proveedor, telefono } = req.body;

    const newProveedor = await pool.query(
      'INSERT INTO proveedor (nombre_proveedor, correo_proveedor, telefono) VALUES($1, $2, $3) RETURNING *',
      [nombre_proveedor, correo_proveedor, telefono]
    );

    res.json(newProveedor.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los proveedores
export const getAllProveedores = async (req, res, next) => {
  try {
    const allProveedores = await pool.query('SELECT * FROM proveedor');
    res.json(allProveedores.rows);
  } catch (error) {
    next(error);
  }
};

// Obtener un proveedor por ID
export const getProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM proveedor WHERE id_proveedor = $1', [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Proveedor not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Actualizar un proveedor
export const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_existencia, nombre_proveedor, correo_proveedor, telefono } = req.body;

    const result = await pool.query(
      'UPDATE proveedor SET id_existencia = $1, nombre_proveedor = $2, correo_proveedor = $3, telefono = $4 WHERE id_proveedor = $5 RETURNING *',
      [id_existencia, nombre_proveedor, correo_proveedor, telefono, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Proveedor not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Eliminar un proveedor
export const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM proveedor WHERE id_proveedor = $1', [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Proveedor not found' });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
