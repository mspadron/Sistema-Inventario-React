import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ClienteForm() {
  const [cliente, setCliente] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const userId = localStorage.getItem('usuarioId'); // Obtener el ID de usuario del localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...cliente,
        id_usuario: userId // Agregar el ID de usuario al objeto de datos del cliente
      };

      if (params.id) {
        const response = await fetch(
          `http://localhost:4000/clientes/${params.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
          }
        );
        await response.json();
      } else {
        const response = await fetch('http://localhost:4000/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        await response.json();
      }

      setLoading(false);
      navigate('/dashCliente');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const loadCliente = async (id) => {
    const res = await fetch(`http://localhost:4000/clientes/${id}`);
    const data = await res.json();
    setCliente({
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      direccion: data.direccion
    });
  };

  useEffect(() => {
    if (params.id) {
      loadCliente(params.id);
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
            Crear Cliente
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
                value={cliente.nombre}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />

              <TextField
                variant="filled"
                label="Correo"
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}
                name="correo"
                value={cliente.correo}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />

              <TextField
                variant="filled"
                label="Teléfono"
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}
                name="telefono"
                value={cliente.telefono}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />

              <TextField
                variant="filled"
                label="Dirección"
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}
                name="direccion"
                value={cliente.direccion}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={
                  !cliente.nombre ||
                  !cliente.correo ||
                  !cliente.telefono ||
                  !cliente.direccion
                }
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
