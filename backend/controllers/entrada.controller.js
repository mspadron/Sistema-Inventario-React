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

    // Verificar si la relación ya existe en la tabla gestiona
    const result = await pool.query(
      'SELECT * FROM gestiona WHERE id_usuario = $1 AND id_existencia = $2',
      [id_usuario, id_existencia]
    );

    // Si la relación no existe, crearla
    if (result.rowCount === 0) {
      await pool.query(
        'INSERT INTO gestiona (id_usuario, id_existencia) VALUES ($1, $2)',
        [id_usuario, id_existencia]
      );
    }

    res.json(newEntrada.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllEntradas = async (req, res, next) => {
  try {
    const query = `
      SELECT 
          e.id_entrada, 
          e.cantidad_entrada, 
          e.fecha_entrada, 
          c.nombre_categoria, 
          pr.nombre_proveedor, 
          p.nombre_producto, 
          u.nombre_usuario AS gestionada_por
      FROM 
          entrada e
      JOIN 
          existencia ex ON e.id_existencia = ex.id_existencia
      JOIN 
          producto p ON ex.id_producto = p.id_producto
      JOIN 
          categoria c ON p.id_categoria = c.id_categoria
      LEFT JOIN 
          proveedor pr ON ex.id_proveedor = pr.id_proveedor
      LEFT JOIN 
          gestiona g ON ex.id_existencia = g.id_existencia
      LEFT JOIN 
          usuario u ON g.id_usuario = u.id_usuario;
    `;
    const allEntradas = await pool.query(query);
    const entradaCount = await countEntradas();
    res.json({ entradas: allEntradas.rows, count: entradaCount });
  } catch (error) {
    next(error);
  }
};

export const countEntradas = async () => {
  const result = await pool.query(`SELECT COUNT(*) FROM "entrada"`);
  return parseInt(result.rows[0].count, 10);
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



