import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import Navbar from './Navbar.jsx';

const Principal = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [policiesCount, setPoliciesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:4000/users');
        const usersData = await usersResponse.json();
        setUsersCount(usersData.count);

        const clientsResponse = await fetch('http://localhost:4000/clientes');
        const clientsData = await clientsResponse.json();
        setClientsCount(clientsData.count);

        const paymentsResponse = await fetch('http://localhost:4000/pagos');
        const paymentsData = await paymentsResponse.json();
        setPaymentsCount(paymentsData.count);

        const policiesResponse = await fetch('http://localhost:4000/polizas');
        const policiesData = await policiesResponse.json();
        setPoliciesCount(policiesData.count);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Box mt={4} mx="auto" maxWidth={1200}>
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
                  Clientes
                </Typography>
                <Typography variant="h3" component="div">
                  {clientsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Pagos
                </Typography>
                <Typography variant="h3" component="div">
                  {paymentsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Pólizas
                </Typography>
                <Typography variant="h3" component="div">
                  {policiesCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Principal;
