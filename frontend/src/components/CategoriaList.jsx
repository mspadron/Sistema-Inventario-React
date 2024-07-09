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
import CategoriaForm from './CategoriaForm.jsx';

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

function CategoriaList() {
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCategoriaId, setEditCategoriaId] = useState(null);

  const cargarCategorias = async () => {
    try {
      const response = await fetch('http://localhost:4000/categorias');
      const data = await response.json();
      if (Array.isArray(data.categorias)) {
        setCategorias(data.categorias);
      } else {
        console.error('Los datos del proveedor no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/categorias/${id}`, {
        method: 'DELETE'
      });
      setCategorias(
        categorias.filter((categoria) => categoria.id_categoria !== id)
      );
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const handleOpen = (id = null) => {
    setEditCategoriaId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditCategoriaId(null);
    setOpen(false);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, paddingRight: 4, marginLeft: '40px' }}
      >
        <h1>LISTA DE CATEGORIAS</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen()}
        >
          Nueva Categoría
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria) => (
                <StyledTableRow key={categoria.id_categoria}>
                  <StyledTableCell component="th" scope="row">
                    {categoria.nombre_categoria}
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
                      onClick={() => handleOpen(categoria.id_categoria)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(categoria.id_categoria)}
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
            {editCategoriaId ? 'EDITAR CATEGORÍA' : 'CREAR CATEGORÍA'}
          </DialogTitle>
          <DialogContent>
            <CategoriaForm
              categoriaId={editCategoriaId}
              onClose={handleClose}
              onSave={cargarCategorias}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="warning">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default CategoriaList;
