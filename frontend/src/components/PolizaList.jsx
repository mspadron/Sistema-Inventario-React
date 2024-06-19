import { Button, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function PolizaList() {
  const [polizas, setPolizas] = useState([]);
  const navigate = useNavigate();

  const loadPolizas = async () => {
    try {
      const response = await fetch('http://localhost:4000/polizas');
      const data = await response.json();
      if (Array.isArray(data.polizas)) {
        // Verificar si los datos de pólizas son un array
        setPolizas(data.polizas); // Establecer las pólizas en el estado
      } else {
        console.error('Los datos de pólizas no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar pólizas:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/polizas/${id}`, {
        method: 'DELETE'
      });
      setPolizas(polizas.filter((poliza) => poliza.id_poliza !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPolizas();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1>Lista de Pólizas</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/polizas/new')}
        >
          Nueva Póliza
        </Button>
      </div>

      {polizas.map((poliza) => (
        <Card
          style={{
            marginBottom: '.7rem',
            backgroundColor: '#1e272e'
          }}
          key={poliza.id_poliza}
        >
          <CardContent
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ color: 'white' }}>
              <Typography>Tipo de Póliza: {poliza.tipo_poliza}</Typography>
              <Typography>Descripción: {poliza.descripcion}</Typography>
            </div>
            <div>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate(`/polizas/${poliza.id_poliza}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleDelete(poliza.id_poliza)}
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

export default PolizaList;
