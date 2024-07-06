import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import Navbar from './Navbar.jsx';

const DashboardSistema = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [providersCount, setProvidersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [existencesCount, setExistencesCount] = useState(0);
  const [entriesCount, setEntriesCount] = useState(0);
  const [exitsCount, setExitsCount] = useState(0);

  const contarUsuarios = async () => {
    try {
          const response = await fetch('http://localhost:4000/users');
          const data = await response.json();
          if (Array.isArray(data.usuarios)) {
            setUsersCount(data.count);
          } else {
            console.error('Los datos de usuarios no son un array:', data);
          }
        } catch (error) {
          console.error('Error al contar usuarios:', error);
        }
    }
  
    const contarRoles = async () => {
      try {
            const response = await fetch('http://localhost:4000/roles');
            const data = await response.json();
            if (Array.isArray(data.roles)) {
              setRolesCount(data.count);
            } else {
              console.error('Los datos de roles no son un array:', data);
            }
          } catch (error) {
            console.error('Error al contar roles:', error);
          }
      }

      const contarProveedor = async () => {
        try {
              const response = await fetch('http://localhost:4000/proveedores');
              const data = await response.json();
              if (Array.isArray(data.proveedores)) {
                setProvidersCount(data.count);
              } else {
                console.error('Los datos de roles no son un array:', data);
              }
            } catch (error) {
              console.error('Error al contar roles:', error);
            }
        }

        const contarCategoria = async () => {
          try {
                const response = await fetch('http://localhost:4000/proveedores');
                const data = await response.json();
                if (Array.isArray(data.proveedores)) {
                  setCategoriesCount(data.count);
                } else {
                  console.error('Los datos de roles no son un array:', data);
                }
              } catch (error) {
                console.error('Error al contar roles:', error);
              }
          }

          const contarProductos = async () => {
            try {
                  const response = await fetch('http://localhost:4000/productos');
                  const data = await response.json();
                  if (Array.isArray(data.productos)) {
                    setProductsCount(data.count);
                  } else {
                    console.error('Los datos de roles no son un array:', data);
                  }
                } catch (error) {
                  console.error('Error al contar roles:', error);
                }
            }

            const contarExistencia = async () => {
              try {
                    const response = await fetch('http://localhost:4000/existencias');
                    const data = await response.json();
                    if (Array.isArray(data.existencias)) {
                      setExistencesCount(data.count);
                    } else {
                      console.error('Los datos de roles no son un array:', data);
                    }
                  } catch (error) {
                    console.error('Error al contar roles:', error);
                  }
              }

              const contarEntrada = async () => {
                try {
                      const response = await fetch('http://localhost:4000/entradas');
                      const data = await response.json();
                      if (Array.isArray(data.entradas)) {
                        setEntriesCount(data.count);
                      } else {
                        console.error('Los datos de roles no son un array:', data);
                      }
                    } catch (error) {
                      console.error('Error al contar roles:', error);
                    }
                }

                const contarSalida = async () => {
                  try {
                        const response = await fetch('http://localhost:4000/salidas');
                        const data = await response.json();
                        if (Array.isArray(data.salidas)) {
                          setExitsCount(data.count);
                        } else {
                          console.error('Los datos de roles no son un array:', data);
                        }
                      } catch (error) {
                        console.error('Error al contar roles:', error);
                      }
                  }
    
  

 

  useEffect(() => {
    contarUsuarios();
    contarRoles();
    contarProveedor();
    contarCategoria();
    contarProductos();
    contarExistencia();
    contarEntrada();
    contarSalida();
  }, []);

  return (
    <>
      <Navbar />
      <Box mt={4} mx="auto" maxWidth={800}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Usuarios
                </Typography>
                <Typography variant="h3" component="div">
                  {usersCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Roles
                </Typography>
                <Typography variant="h3" component="div">
                  {rolesCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Proveedores
                </Typography>
                <Typography variant="h3" component="div">
                  {providersCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Categorías
                </Typography>
                <Typography variant="h3" component="div">
                  {categoriesCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Productos
                </Typography>
                <Typography variant="h3" component="div">
                  {productsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Existencias
                </Typography>
                <Typography variant="h3" component="div">
                  {existencesCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Entradas
                </Typography>
                <Typography variant="h3" component="div">
                  {entriesCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Salidas
                </Typography>
                <Typography variant="h3" component="div">
                  {exitsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DashboardSistema;
