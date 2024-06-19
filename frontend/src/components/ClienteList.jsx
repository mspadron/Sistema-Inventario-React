import { Button, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();

  const loadClientes = async () => {
    try {
      const response = await fetch('http://localhost:4000/clientes');
      const data = await response.json();
      if (Array.isArray(data.clientes)) {
        // Verificar si los datos de clientes son un array dentro del objeto
        setClientes(data.clientes); // Establecer los clientes en el estado
      } else {
        console.error('Los datos de clientes no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/clientes/${id}`, {
        method: 'DELETE'
      });
      setClientes(clientes.filter((cliente) => cliente.id_cliente !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1>Lista de Clientes</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/clientes/new')}
        >
          Nuevo Cliente
        </Button>
      </div>

      {clientes.map((cliente) => (
        <Card
          style={{
            marginBottom: '.7rem',
            backgroundColor: '#1e272e'
          }}
          key={cliente.id_cliente}
        >
          <CardContent
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ color: 'white' }}>
              <Typography>{cliente.nombre}</Typography>
              <Typography>{cliente.correo}</Typography>
            </div>
            <div>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate(`/clientes/${cliente.id_cliente}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleDelete(cliente.id_cliente)}
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

export default ClienteList;
