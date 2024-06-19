import { Button, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/users');
      const data = await response.json();
      if (Array.isArray(data.users)) {
        // Verificar si los datos de usuarios son un array
        setUsers(data.users); // Extraer los usuarios del objeto
      } else {
        console.error('Los datos de usuarios no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/users/${id}`, {
        method: 'DELETE'
      });
      setUsers(users.filter((user) => user.id_usuario !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1>Lista de Usuarios</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/users/new')}
        >
          Nuevo Usuario
        </Button>
      </div>

      {users.map((user) => (
        <Card
          style={{
            marginBottom: '.7rem',
            backgroundColor: '#1e272e'
          }}
          key={user.id_usuario}
        >
          <CardContent
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ color: 'white' }}>
              <Typography>{user.nombre}</Typography>
              <Typography>{user.tipo_usuario}</Typography>
            </div>
            <div>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate(`/users/${user.id_usuario}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleDelete(user.id_usuario)}
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

export default UserList;
