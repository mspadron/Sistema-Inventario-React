import {
    Button,
    Card,
    CardContent,
    Typography,
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
  import ProductoForm from './ProductoForm.jsx';
  
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
      const categoria = categorias.find((cat) => cat.id_categoria === idCategoria);
      return categoria ? categoria.nombre_categoria : 'Desconocido';
    };
  
    const handleDelete = async (id) => {
      try {
        await fetch(`http://localhost:4000/productos/${id}`, {
          method: 'DELETE',
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '40px' }}>
          <h1>Lista de Productos</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            Nuevo Producto
          </Button>
  
          <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Fecha de Expiración</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id_producto}>
                    <TableCell>{producto.nombre_producto}</TableCell>
                    <TableCell>{producto.precio_producto}</TableCell>
                    <TableCell>{producto.fechaexpiracion_producto}</TableCell>
                    <TableCell>{getCategoriaNombre(producto.id_categoria)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => handleOpen(producto.id_producto)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleDelete(producto.id_producto)}
                        sx={{ marginLeft: '.5rem' }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
  
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editProductoId ? 'Editar Producto' : 'Crear Producto'}</DialogTitle>
            <DialogContent>
              <ProductoForm productoId={editProductoId} onClose={handleClose} onSave={cargarProductos} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    );
  }
  
  export default ProductoList;
  