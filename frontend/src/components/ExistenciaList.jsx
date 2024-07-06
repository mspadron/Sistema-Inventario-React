import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import ExistenciaForm from './ExistenciaForm.jsx';
import MovimientoForm from './MovimientoForm.jsx';

function ExistenciaList() {
  const [existencias, setExistencias] = useState([]);
  const [open, setOpen] = useState(false);
  const [openMovimiento, setOpenMovimiento] = useState(false);
  const [selectedExistencia, setSelectedExistencia] = useState(null);
  const [movimientoTipo, setMovimientoTipo] = useState('');

  const cargarExistencias = async () => {
    try {
      const response = await fetch('http://localhost:4000/existencias');
      const data = await response.json();
      if (Array.isArray(data.existencias)) {
        const existenciasUnicas = data.existencias.reduce((acc, existencia) => {
          const found = acc.find(e => e.id_existencia === existencia.id_existencia);
          if (found) {
            found.gestionada_por += `, ${existencia.gestionada_por}`;
          } else {
            acc.push({ ...existencia, gestionada_por: existencia.gestionada_por });
          }
          return acc;
        }, []);
        setExistencias(existenciasUnicas);
      } else {
        console.error('Los datos de existencias no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar existencias:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenMovimiento = (existencia, tipo) => {
    setSelectedExistencia(existencia);
    setMovimientoTipo(tipo);
    setOpenMovimiento(true);
  };

  const handleCloseMovimiento = () => {
    setOpenMovimiento(false);
    setSelectedExistencia(null);
    setMovimientoTipo('');
  };

  useEffect(() => {
    cargarExistencias();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '20px' }}>
        <h1>Lista de Existencias</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Nueva Existencia
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Stock Inicial</TableCell>
                <TableCell>Stock Actual</TableCell>
                <TableCell>Precio Compra</TableCell>
                <TableCell>Precio Venta</TableCell>
                <TableCell>Gestionada por</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {existencias.map((existencia) => (
                <TableRow key={existencia.id_existencia}>
                  <TableCell>{existencia.nombre_categoria}</TableCell>
                  <TableCell>{existencia.nombre_producto}</TableCell>
                  <TableCell>{existencia.nombre_proveedor}</TableCell>
                  <TableCell>{existencia.stockinicial_existencia}</TableCell>
                  <TableCell>{existencia.stockactual_existencia}</TableCell>
                  <TableCell>{existencia.preciocompra_existencia}</TableCell>
                  <TableCell>{existencia.precioventa_existencia}</TableCell>
                  <TableCell>{existencia.gestionada_por}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenMovimiento(existencia, 'entrada')}
                      sx={{ marginRight: '0.5rem' }}
                    >
                      Entrada
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenMovimiento(existencia, 'salida')}
                    >
                      Salida
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Crear Nueva Existencia</DialogTitle>
          <DialogContent>
            <ExistenciaForm onClose={handleClose} onSave={cargarExistencias} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openMovimiento} onClose={handleCloseMovimiento} maxWidth="sm" fullWidth>
          <DialogTitle>{movimientoTipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}</DialogTitle>
          <DialogContent>
            {selectedExistencia && (
              <MovimientoForm
                existencia={selectedExistencia}
                onClose={handleCloseMovimiento}
                onMovement={cargarExistencias}
                tipo={movimientoTipo}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMovimiento} color="secondary">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ExistenciaList;
