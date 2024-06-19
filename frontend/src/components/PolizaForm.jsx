import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function PolizaForm() {
  const [poliza, setPoliza] = useState({
    tipo_poliza: '',
    descripcion: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (params.id) {
        response = await fetch(`http://localhost:4000/polizas/${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(poliza)
        });
      } else {
        response = await fetch('http://localhost:4000/polizas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(poliza)
        });
      }
      await response.json();
      setLoading(false);
      navigate('/dashPoliza');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setPoliza({ ...poliza, [e.target.name]: e.target.value });
  };

  const loadPoliza = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/polizas/${id}`);
      const data = await res.json();
      setPoliza({
        tipo_poliza: data.tipo_poliza,
        descripcion: data.descripcion
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadPoliza(params.id);
    }
  }, [params.id]);

  return (
    <>
      <Navbar />
      <div>
        <Typography variant="h5" textAlign="center" color="white">
          Crear Póliza
        </Typography>
        <Card style={{ backgroundColor: '#1e272e', padding: '1rem' }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="filled"
                label="Tipo de Póliza"
                fullWidth
                sx={{ marginBottom: '1rem' }}
                name="tipo_poliza"
                value={poliza.tipo_poliza}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <TextField
                variant="filled"
                label="Descripción"
                fullWidth
                sx={{ marginBottom: '1rem' }}
                name="descripcion"
                value={poliza.descripcion}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <Button variant="contained" color="primary" type="submit">
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  'Crear'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default PolizaForm;
