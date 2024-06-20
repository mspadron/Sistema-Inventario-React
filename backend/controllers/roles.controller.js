import { pool } from '../db.js';

export const createRol = async (req, res, next) => {
  try {
    const { nombre_rol } = req.body;

    const newRol = await pool.query(
      'INSERT INTO rol (nombre_rol) VALUES($1) RETURNING *',
      [nombre_rol]
    );

    res.json(newRol.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllRoles = async (req, res, next) => {
  try {
    const allRoles = await pool.query('SELECT * FROM rol');
    res.json(allRoles.rows);
  } catch (error) {
    next(error);
  }
};

export const getRol = async (req, res) => {
  try {
    const { id_rol } = req.params;
    const result = await pool.query('SELECT * FROM rol WHERE id_rol = $1', [
      id_rol
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Rol not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateRol = async (req, res) => {
  try {
    const { id_rol } = req.params;
    const { nombre_rol } = req.body;

    const result = await pool.query(
      'UPDATE rol SET nombre_rol = $1 WHERE id_rol = $2 RETURNING *',
      [nombre_rol, id_rol]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Rol not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteRol = async (req, res) => {
  try {
    const { id_rol } = req.params;
    const result = await pool.query('DELETE FROM rol WHERE id_rol = $1', [
      id_rol
    ]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Rol not found' });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
