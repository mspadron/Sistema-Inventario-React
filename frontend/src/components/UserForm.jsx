import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserForm() {
  const [user, setUser] = useState({
    nombre: '',
    password: '',
    tipo_usuario: '' // Estado inicial para el tipo de usuario
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (params.id) {
        const response = await fetch(
          `http://localhost:4000/users/${params.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          }
        );
        await response.json();
      } else {
        const response = await fetch('http://localhost:4000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        await response.json();
      }

      setLoading(false);
      navigate('/dashUser');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loadUser = async (id) => {
    const res = await fetch(`http://localhost:4000/users/${id}`);
    const data = await res.json();
    setUser({
      nombre: data.nombre,
      password: data.password,
      tipo_usuario: data.tipo_usuario
    });
  };

  useEffect(() => {
    if (params.id) {
      loadUser(params.id);
    }
  }, [params.id]);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={3}>
        <Card
          sx={{ mt: 5 }}
          style={{ backgroundColor: '#1e272e', padding: '1rem' }}
        >
          <Typography variant="5" textAlign="center" color="white">
            Crear Usuario
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="filled"
                label="Nombre"
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}
                name="nombre"
                value={user.nombre}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />

              <TextField
                variant="filled"
                label="Contraseña"
                type="password"
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}
                name="password"
                value={user.password}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />

              {/* Cambiado a un campo de selección */}
              <TextField
                select
                variant="filled"
                label="Tipo de Usuario"
                fullWidth
                sx={{
                  marginTop: '1rem',
                  '& .MuiInputLabel-root': {
                    color: 'white' // Color del texto de la etiqueta
                  },
                  '& .MuiInputBase-root': {
                    color: 'white' // Color del texto de entrada
                  },
                  '& .MuiFilledInput-root': {
                    backgroundColor: '#37474f', // Color de fondo del campo
                    '&:hover': {
                      backgroundColor: '#455a64' // Color de fondo al pasar el mouse
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#455a64' // Color de fondo cuando está enfocado
                    }
                  }
                }}
                name="tipo_usuario"
                value={user.tipo_usuario}
                onChange={handleChange}
              >
                <MenuItem value="Agente">Agente</MenuItem>
                <MenuItem value="Administrador">Administrador</MenuItem>
              </TextField>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!user.nombre || !user.password || !user.tipo_usuario}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  'Crear'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
