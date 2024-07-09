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
import UsuarioForm from './UsuarioForm.jsx';

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
        method: 'DELETE'
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
      <Box
        component="main"
        sx={{ flexGrow: 1, paddingRight: 4, marginLeft: '40px' }}
      >
        <h1>LISTA DE USUARIOS</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen()}
        >
          NUEVO USUARIO
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="right">Rol</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <StyledTableRow key={usuario.id_usuario}>
                  <StyledTableCell component="th" scope="row">
                    {usuario.nombre_usuario}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {getRolNombre(usuario.id_rol)}
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
                      onClick={() => handleOpen(usuario.id_usuario)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(usuario.id_usuario)}
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
            {editUserId ? 'EDITAR USUARIO' : 'CREAR USUARIO'}
          </DialogTitle>
          <DialogContent>
            <UsuarioForm
              userId={editUserId}
              onClose={handleClose}
              onSave={cargarUsuarios}
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

export default UsuarioList;
