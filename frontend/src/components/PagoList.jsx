import { Button, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function PagoList() {
  const [pagos, setPagos] = useState([]);
  const navigate = useNavigate();

  const loadPagos = async () => {
    try {
      const response = await fetch('http://localhost:4000/pagos');
      const responseData = await response.json();

      const data = responseData.pagos; // Acceder a la propiedad "pagos" del objeto de respuesta

      if (Array.isArray(data)) {
        // Verificar si los datos de pagos son un array
        // Para cada pago, obtener el nombre del cliente y el tipo de póliza
        const pagosWithNames = await Promise.all(
          data.map(async (pago) => {
            const clienteResponse = await fetch(
              `http://localhost:4000/clientes/${pago.id_cliente}`
            );
            const clienteData = await clienteResponse.json();
            const polizaResponse = await fetch(
              `http://localhost:4000/polizas/${pago.id_poliza}`
            );
            const polizaData = await polizaResponse.json();
            return {
              ...pago,
              nombre_cliente: clienteData.nombre,
              tipo_poliza: polizaData.tipo_poliza,
              // Formatear la fecha de emisión
              fechaEmision: new Date(pago.fechaEmision).toLocaleDateString(
                'es-ES',
                { year: 'numeric', month: '2-digit', day: '2-digit' }
              )
            };
          })
        );
        setPagos(pagosWithNames);
      } else {
        console.error('Los datos de pagos no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/pagos/${id}`, {
        method: 'DELETE'
      });
      setPagos(pagos.filter((pago) => pago.id_pago !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPagos();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1>Lista de Pagos</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/pagos/new')}
        >
          Nuevo Pago
        </Button>
      </div>

      {pagos.map((pago) => (
        <Card
          style={{
            marginBottom: '.7rem',
            backgroundColor: '#1e272e'
          }}
          key={pago.id_pago}
        >
          <CardContent
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ color: 'white' }}>
              <Typography>Cliente: {pago.nombre_cliente}</Typography>
              <Typography>Póliza: {pago.tipo_poliza}</Typography>
              <Typography>Monto Prima: {pago.montoPrima}</Typography>
              <Typography>Fecha Emisión: {pago.fechaEmision}</Typography>
            </div>
            <div>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate(`/pagos/${pago.id_pago}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleDelete(pago.id_pago)}
                style={{ marginLeft: '.5rem' }}
              >
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default PagoList;
