import { pool } from '../db.js';

export const createSalida = async (req, res, next) => {
  try {
    const { id_existencia, cantidad_salida, fecha_salida, id_usuario } = req.body;

    // Crear la nueva salida
    const newSalida = await pool.query(
      'INSERT INTO salida (id_existencia, cantidad_salida, fecha_salida) VALUES ($1, $2, $3) RETURNING *',
      [id_existencia, cantidad_salida, fecha_salida]
    );

    // Actualizar el stock actual en la tabla existencia
    await pool.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia - $1 WHERE id_existencia = $2',
      [cantidad_salida, id_existencia]
    );

    // Crear relación en la tabla gestiona
    await pool.query(
      'INSERT INTO gestiona (id_usuario, id_existencia) VALUES ($1, $2)',
      [id_usuario, id_existencia]
    );

    res.json(newSalida.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllSalidas = async (req, res, next) => {
  try {
    const allSalidas = await pool.query('SELECT * FROM salida');
    res.json(allSalidas.rows);
  } catch (error) {
    next(error);
  }
};

export const getSalida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM salida WHERE id_salida = $1', [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Salida not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateSalida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_existencia, cantidad_salida, fecha_salida } = req.body;

    // Obtener la salida actual para determinar la diferencia en la cantidad
    const currentSalida = await pool.query('SELECT cantidad_salida FROM salida WHERE id_salida = $1', [id]);
    if (currentSalida.rows.length === 0) return res.status(404).json({ message: 'Salida not found' });

    const currentCantidadSalida = currentSalida.rows[0].cantidad_salida;
    const cantidadDiferencia = cantidad_salida - currentCantidadSalida;

    // Actualizar la salida
    const result = await pool.query(
      'UPDATE salida SET id_existencia = $1, cantidad_salida = $2, fecha_salida = $3 WHERE id_salida = $4 RETURNING *',
      [id_existencia, cantidad_salida, fecha_salida, id]
    );

    // Actualizar el stock actual en la tabla existencia
    await pool.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia - $1 WHERE id_existencia = $2',
      [cantidadDiferencia, id_existencia]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteSalida = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener la salida actual para determinar la cantidad a restar del stock
    const currentSalida = await pool.query('SELECT id_existencia, cantidad_salida FROM salida WHERE id_salida = $1', [id]);
    if (currentSalida.rows.length === 0) return res.status(404).json({ message: 'Salida not found' });

    const { id_existencia, cantidad_salida } = currentSalida.rows[0];

    // Eliminar la salida
    const result = await pool.query('DELETE FROM salida WHERE id_salida = $1', [id]);

    // Actualizar el stock actual en la tabla existencia
    await pool.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia + $1 WHERE id_existencia = $2',
      [cantidad_salida, id_existencia]
    );

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
