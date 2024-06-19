import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function PagoForm() {
  const [pago, setPago] = useState({
    id_cliente: '',
    id_poliza: '',
    montoPrima: '',
    fechaEmision: ''
  });
  const [clientes, setClientes] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:4000/clientes');
        const data = await response.json();
        setClientes(data.clientes); // Establecer los clientes en el estado
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      }
    };

    const fetchPolizas = async () => {
      try {
        const response = await fetch('http://localhost:4000/polizas');
        const data = await response.json();
        setPolizas(data.polizas); // Establecer las pólizas en el estado
      } catch (error) {
        console.error('Error al cargar pólizas:', error);
      }
    };

    fetchClientes();
    fetchPolizas();

    if (params.id) {
      // Si hay un ID en los parámetros, cargar los datos del pago correspondiente
      const fetchPago = async () => {
        try {
          const response = await fetch(
            `http://localhost:4000/pagos/${params.id}`
          );
          const data = await response.json();

          // Asegurar que la fecha de emisión esté en el formato correcto al cargar los datos del pago
          const fechaEmision = data.fechaEmision
            ? data.fechaEmision.split('T')[0]
            : ''; // Si no hay fecha, establecerla como cadena vacía
          setPago({ ...data, fechaEmision }); // Establecer los datos del pago en el estado
        } catch (error) {
          console.error('Error al cargar el pago:', error);
        }
      };
      fetchPago();
    }
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = 'http://localhost:4000/pagos';
      let method = 'POST';

      if (params.id) {
        // Si el pago tiene un ID, se está editando
        url = `http://localhost:4000/pagos/${params.id}`;
        method = 'PUT';
      }

      // Formatear la fecha al formato ISO 8601 antes de enviarla al servidor
      const formattedPago = {
        ...pago,
        fechaEmision: pago.fechaEmision
          ? new Date(pago.fechaEmision).toISOString()
          : null // Si no hay fecha, establecerla como null
      };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedPago)
      });
      await response.json();
      setLoading(false);
      navigate('/dashPago');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setPago({ ...pago, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div>
        <Typography variant="h5" textAlign="center" color="white">
          {params.id ? 'Editar Pago' : 'Crear Pago'}
        </Typography>
        <Card style={{ backgroundColor: '#1e272e', padding: '1rem' }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Select
                    variant="filled"
                    label="ID Cliente"
                    fullWidth
                    sx={{ marginBottom: '1rem' }}
                    name="id_cliente"
                    value={pago.id_cliente}
                    onChange={handleChange}
                    inputProps={{ style: { color: 'white' } }}
                  >
                    {clientes.map((cliente) => (
                      <MenuItem
                        key={cliente.id_cliente}
                        value={cliente.id_cliente}
                      >
                        {cliente.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <Select
                    variant="filled"
                    label="ID Póliza"
                    fullWidth
                    sx={{ marginBottom: '1rem' }}
                    name="id_poliza"
                    value={pago.id_poliza}
                    onChange={handleChange}
                    inputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: 'white' } }}
                  >
                    {polizas.map((poliza) => (
                      <MenuItem key={poliza.id_poliza} value={poliza.id_poliza}>
                        {poliza.tipo_poliza}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <TextField
                variant="filled"
                label="Monto Prima"
                fullWidth
                sx={{ marginBottom: '1rem' }}
                name="montoPrima"
                value={pago.montoPrima}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
              />
              <TextField
                variant="filled"
                label="Fecha Emisión"
                fullWidth
                sx={{ marginBottom: '1rem' }}
                name="fechaEmision"
                type="date"
                value={pago.fechaEmision}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <Button variant="contained" color="primary" type="submit">
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  'Guardar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default PagoForm;
