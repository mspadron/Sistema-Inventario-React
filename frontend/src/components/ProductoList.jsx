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
import ProductoForm from './ProductoForm.jsx';

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

function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProductoId, setEditProductoId] = useState(null);

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:4000/productos');
      const data = await response.json();
      if (Array.isArray(data.productos)) {
        setProductos(data.productos);
      } else {
        console.error('Los datos de productos no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch('http://localhost:4000/categorias');
      const data = await response.json();
      if (Array.isArray(data.categorias)) {
        setCategorias(data.categorias);
      } else {
        console.error('Los datos de categorías no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const getCategoriaNombre = (idCategoria) => {
    const categoria = categorias.find(
      (cat) => cat.id_categoria === idCategoria
    );
    return categoria ? categoria.nombre_categoria : 'Desconocido';
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/productos/${id}`, {
        method: 'DELETE'
      });
      setProductos(productos.filter((producto) => producto.id_producto !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleOpen = (id = null) => {
    setEditProductoId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditProductoId(null);
    setOpen(false);
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, paddingRight: 4, marginLeft: '40px' }}
      >
        <h1>LISTA DE PRODUCTOS</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen()}
        >
          Nuevo Producto
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="right">Precio</StyledTableCell>
                <StyledTableCell align="right">
                  Fecha de Expiración
                </StyledTableCell>
                <StyledTableCell align="right">Categoría</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <StyledTableRow key={producto.id_producto}>
                  <StyledTableCell component="th" scope="row">
                    {producto.nombre_producto}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {producto.precio_producto}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {producto.fechaexpiracion_producto}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {getCategoriaNombre(producto.id_categoria)}
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
                      onClick={() => handleOpen(producto.id_producto)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(producto.id_producto)}
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
            {editProductoId ? 'EDITAR PRODUCTO' : 'CREAR PRODUCTO'}
          </DialogTitle>
          <DialogContent>
            <ProductoForm
              productoId={editProductoId}
              onClose={handleClose}
              onSave={cargarProductos}
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

export default ProductoList;
