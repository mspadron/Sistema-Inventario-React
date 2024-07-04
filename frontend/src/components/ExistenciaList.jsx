import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import Navbar from './Navbar.jsx';
  
  function ExistenciaList() {
    const [existencias, setExistencias] = useState([]);
  
    const cargarExistencias = async () => {
      try {
        const response = await fetch('http://localhost:4000/existencias');
        const data = await response.json();
        if (Array.isArray(data)) {
          setExistencias(data);
        } else {
          console.error('Los datos de existencias no son un array:', data);
        }
      } catch (error) {
        console.error('Error al cargar existencias:', error);
      }
    };
  
    useEffect(() => {
      cargarExistencias();
    }, []);
  
    return (
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '20px' }}>
          <h1>Lista de Existencias</h1>
          <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Stock Inicial</TableCell>
                  <TableCell>Stock Actual</TableCell>
                  <TableCell>Precio Compra</TableCell>
                  <TableCell>Precio Venta</TableCell>
                  <TableCell>Gestionada por</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {existencias.map((existencia) => (
                  <TableRow key={existencia.id_existencia}>
                    <TableCell>{existencia.nombre_categoria}</TableCell>
                    <TableCell>{existencia.nombre_producto}</TableCell>
                    <TableCell>{existencia.nombre_proveedor}</TableCell>
                    <TableCell>{existencia.stockinicial_existencia}</TableCell>
                    <TableCell>{existencia.stockactual_existencia}</TableCell>
                    <TableCell>{existencia.preciocompra_existencia}</TableCell>
                    <TableCell>{existencia.precioventa_existencia}</TableCell>
                    <TableCell>{existencia.nombre_usuario}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  }
  
  export default ExistenciaList;
  