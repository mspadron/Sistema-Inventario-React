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
import UsuarioForm from './UsuarioForm.jsx';

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:4000/users');
      const data = await response.json();
      if (Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
        
      } else {
        console.error('Los datos de usuarios no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await fetch('http://localhost:4000/roles');
      const data = await response.json();
      if (Array.isArray(data.roles)) {
        setRoles(data.roles);
      } else {
        console.error('Los datos de roles no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  const getRolNombre = (idRol) => {
    const rol = roles.find((rol) => rol.id_rol === idRol);
    return rol ? rol.nombre_rol : 'Desconocido';
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/users/${id}`, {
        method: 'DELETE',
      });
      setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleOpen = (id = null) => {
    setEditUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditUserId(null);
    setOpen(false);
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '40px' }}>
        <h1>Lista de Usuarios</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Nuevo Usuario
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id_usuario}>
                  <TableCell>{usuario.nombre_usuario}</TableCell>
                  <TableCell>{getRolNombre(usuario.id_rol)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={() => handleOpen(usuario.id_usuario)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleDelete(usuario.id_usuario)}
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
          <DialogTitle>{editUserId ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
          <DialogContent>
            <UsuarioForm userId={editUserId} onClose={handleClose} onSave={cargarUsuarios} />
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

export default UsuarioList;
