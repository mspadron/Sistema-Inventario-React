import { pool } from '../db.js';

export const createEntrada = async (req, res, next) => {
  try {
    const { id_existencia, cantidad_entrada, fecha_entrada, id_usuario } = req.body;

    // Crear la nueva entrada
    const newEntrada = await pool.query(
      'INSERT INTO entrada (id_existencia, cantidad_entrada, fecha_entrada) VALUES ($1, $2, $3) RETURNING *',
      [id_existencia, cantidad_entrada, fecha_entrada]
    );

    // Actualizar el stock actual en la tabla existencia
    await pool.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia + $1 WHERE id_existencia = $2',
      [cantidad_entrada, id_existencia]
    );

    // Crear relación en la tabla gestiona
    await pool.query(
      'INSERT INTO gestiona (id_usuario, id_existencia) VALUES ($1, $2)',
      [id_usuario, id_existencia]
    );

    res.json(newEntrada.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllEntradas = async (req, res, next) => {
  try {
    const allEntradas = await pool.query('SELECT * FROM entrada');
    res.json(allEntradas.rows);
  } catch (error) {
    next(error);
  }
};

export const getEntrada = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM entrada WHERE id_entrada = $1', [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Entrada not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateEntrada = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_existencia, cantidad_entrada, fecha_entrada } = req.body;

    // Obtener la entrada actual para determinar la diferencia en la cantidad
    const currentEntrada = await pool.query('SELECT cantidad_entrada FROM entrada WHERE id_entrada = $1', [id]);
    if (currentEntrada.rows.length === 0) return res.status(404).json({ message: 'Entrada not found' });

    const currentCantidadEntrada = currentEntrada.rows[0].cantidad_entrada;
    const cantidadDiferencia = cantidad_entrada - currentCantidadEntrada;

    // Actualizar la entrada
    const result = await pool.query(
      'UPDATE entrada SET id_existencia = $1, cantidad_entrada = $2, fecha_entrada = $3 WHERE id_entrada = $4 RETURNING *',
      [id_existencia, cantidad_entrada, fecha_entrada, id]
    );

    // Actualizar el stock actual en la tabla existencia
    await pool.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia + $1 WHERE id_existencia = $2',
      [cantidadDiferencia, id_existencia]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteEntrada = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener la entrada actual para determinar la cantidad a restar del stock
    const currentEntrada = await pool.query('SELECT id_existencia, cantidad_entrada FROM entrada WHERE id_entrada = $1', [id]);
    if (currentEntrada.rows.length === 0) return res.status(404).json({ message: 'Entrada not found' });

    const { id_existencia, cantidad_entrada } = currentEntrada.rows[0];

    // Eliminar la entrada
    const result = await pool.query('DELETE FROM entrada WHERE id_entrada = $1', [id]);

    // Actualizar el stock actual en la tabla existencia
    await pool.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia - $1 WHERE id_existencia = $2',
      [cantidad_entrada, id_existencia]
    );

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
