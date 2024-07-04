import { pool } from '../db.js';

export const createCategoria = async (req, res, next) => {
  try {
    const { nombre_categoria } = req.body;

    const newCategoria = await pool.query(
      'INSERT INTO categoria (nombre_categoria) VALUES($1) RETURNING *',
      [nombre_categoria]
    );

    res.json(newCategoria.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllCategorias = async (req, res, next) => {
  try {
    const allCategorias = await pool.query('SELECT * FROM categoria');
    res.json(allCategorias.rows);
  } catch (error) {
    next(error);
  }
};

export const getCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categoria WHERE id_categoria = $1', [
      id
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Categoria not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_categoria } = req.body;

    const result = await pool.query(
      'UPDATE categoria SET nombre_categoria = $1 WHERE id_categoria = $2 RETURNING *',
      [nombre_categoria, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Categoria not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categoria WHERE id_categoria = $1', [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Categoria not found' });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
