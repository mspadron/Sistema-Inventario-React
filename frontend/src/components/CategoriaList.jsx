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
  import CategoriaForm from './CategoriaForm.jsx';
  
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
          method: 'DELETE',
        });
        setCategorias(categorias.filter((categoria) => categoria.id_categoria !== id));
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '40px' }}>
          <h1>Lista de Categorías</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            Nueva Categoría
          </Button>
  
          <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.id_categoria}>
                    <TableCell>{categoria.nombre_categoria}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => handleOpen(categoria.id_categoria)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleDelete(categoria.id_categoria)}
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
            <DialogTitle>{editCategoriaId ? 'Editar Categoría' : 'Crear Categoría'}</DialogTitle>
            <DialogContent>
              <CategoriaForm categoriaId={editCategoriaId} onClose={handleClose} onSave={cargarCategorias} />
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
  
  export default CategoriaList;
  