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
  import ProveedorForm from './ProveedorForm.jsx';
  
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
          method: 'DELETE',
        });
        setProveedores(proveedores.filter((proveedor) => proveedor.id_proveedor !== id));
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '40px' }}>
          <h1>Lista de Proveedores</h1>
          <Button variant="contained" color="primary" onClick={() => handleOpen()}>
            Nuevo Proveedor
          </Button>
  
          <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proveedores.map((proveedor) => (
                  <TableRow key={proveedor.id_proveedor}>
                    <TableCell>{proveedor.nombre_proveedor}</TableCell>
                    <TableCell>{proveedor.correo_proveedor}</TableCell>
                    <TableCell>{proveedor.telefono}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => handleOpen(proveedor.id_proveedor)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleDelete(proveedor.id_proveedor)}
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
            <DialogTitle>{editProveedorId ? 'Editar Proveedor' : 'Crear Proveedor'}</DialogTitle>
            <DialogContent>
              <ProveedorForm proveedorId={editProveedorId} onClose={handleClose} onSave={cargarProveedores} />
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
  
  export default ProveedorList;
  