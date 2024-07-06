import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function UsuarioForm({ userId, onClose, onSave }) {
  const [usuario, setUsuario] = useState({
    id_rol: '',
    nombre_usuario: '',
    clave_usuario: '',
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:4000/roles');
        const data = await response.json();
        setRoles(data.roles);
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    };

    const fetchUsuario = async () => {
      if (userId) {
        setLoadingUser(true);
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          const data = await response.json();
          setUsuario({ ...data, password: '' });
          setLoadingUser(false);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
          setLoadingUser(false);
        }
      }
    };

    fetchRoles();
    fetchUsuario();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = userId
        ? `http://localhost:4000/users/${userId}`
        : 'http://localhost:4000/users';
      const method = userId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });
      await response.json();
      setLoading(false);
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div>
        <Typography variant="h5" textAlign="center" color="white">
          {userId ? 'Editar Usuario' : 'Crear Usuario'}
        </Typography>
        <Card style={{ backgroundColor: '#1e272e', padding: '1rem' }}>
          <CardContent>
            {loadingUser ? (
              <CircularProgress color="inherit" />
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Select
                      variant="filled"
                      label="Rol"
                      fullWidth
                      sx={{ marginBottom: '1rem' }}
                      name="id_rol"
                      value={usuario.id_rol || ''}
                      onChange={handleChange}
                      inputProps={{ style: { color: 'white' } }}
                    >
                      {roles.map((rol) => (
                        <MenuItem key={rol.id_rol} value={rol.id_rol}>
                          {rol.nombre_rol}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="filled"
                      label="Nombre Usuario"
                      fullWidth
                      sx={{ marginBottom: '1rem' }}
                      name="nombre_usuario"
                      value={usuario.nombre_usuario || ''}
                      onChange={handleChange}
                      inputProps={{ style: { color: 'white' } }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  variant="filled"
                  label="Clave"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="clave_usuario"
                  type="password"
                  value={usuario.clave_usuario || ''}
                  onChange={handleChange}
                  inputProps={{ style: { color: 'white' } }}
                />
                <Button variant="contained" color="primary" type="submit">
                  {loading ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default UsuarioForm;
