import {
  Button,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import ProveedorForm from './ProveedorForm.jsx';

import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#02152B',
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

function ProveedorList() {
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProveedorId, setEditProveedorId] = useState(null);

  const cargarProveedores = async () => {
    try {
      const response = await fetch('http://localhost:4000/proveedores');
      const data = await response.json();
      if (Array.isArray(data.proveedores)) {
        setProveedores(data.proveedores);
      } else {
        console.error('Los datos del proveedor no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/proveedores/${id}`, {
        method: 'DELETE'
      });
      setProveedores(
        proveedores.filter((proveedor) => proveedor.id_proveedor !== id)
      );
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
    }
  };

  const handleOpen = (id = null) => {
    setEditProveedorId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditProveedorId(null);
    setOpen(false);
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, paddingRight: 4, marginLeft: '40px' }}
      >
        <h1>LISTA DE PROVEEDORES</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen()}
        >
          NUEVO PROVEEDOR
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="right">Correo</StyledTableCell>
                <StyledTableCell align="right">Telefono</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.map((proveedor) => (
                <StyledTableRow key={proveedor.id_proveedor}>
                  <StyledTableCell component="th" scope="row">
                    {proveedor.nombre_proveedor}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {proveedor.correo_proveedor}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {proveedor.telefono}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#FFA000',
                        color: 'white', // Cambia el color del texto si es necesario
                        '&:hover': {
                          backgroundColor: '#FFA001' // Color al hacer hover
                        }
                      }}
                      onClick={() => handleOpen(proveedor.id_proveedor)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(proveedor.id_proveedor)}
                      sx={{ marginLeft: '.5rem' }}
                    >
                      Eliminar
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editProveedorId ? 'EDITAR PROVEEDOR' : 'CREAR PROVEEDOR'}
          </DialogTitle>
          <DialogContent>
            <ProveedorForm
              proveedorId={editProveedorId}
              onClose={handleClose}
              onSave={cargarProveedores}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="warning">
              CANCELAR
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ProveedorList;
