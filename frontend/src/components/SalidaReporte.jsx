import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
import Navbar from './Navbar.jsx';

const SalidaReporte = () => {
  const [salidas, setSalidas] = useState([]);

  useEffect(() => {
    fetchSalidas();
  }, []);

  const fetchSalidas = async () => {
    try {
      const response = await fetch('http://localhost:4000/salidas');
      const data = await response.json();
      setSalidas(data.salidas);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID Salida", "Cantidad Salida", "Fecha Salida", "Categoria", "Proveedor", "Producto", "Gestionada por"];
    const tableRows = [];

    salidas.forEach(salida => {
      const salidaData = [
        salida.id_salida,
        salida.cantidad_salida,
        new Date(salida.fecha_salida).toLocaleDateString(),
        salida.nombre_categoria,
        salida.nombre_proveedor,
        salida.nombre_producto,
        salida.gestionada_por
      ];
      tableRows.push(salidaData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Reporte de Salidas", 14, 15);
    doc.save('salidas_reporte.pdf');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '20px' }}>
        <h1>Reporte de Salidas</h1>
        <Button variant="contained" color="primary" onClick={downloadPDF} sx={{ marginRight: '1rem' }}>
          Descargar PDF
        </Button>
        <Button variant="contained" color="secondary">
          <CSVLink
            data={salidas}
            filename={"salidas_reporte.csv"}
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Descargar CSV
          </CSVLink>
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Salida</TableCell>
                <TableCell>Cantidad Salida</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Gestionada por</TableCell>
                <TableCell>Fecha Salida</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salidas.map((salida) => (
                <TableRow key={salida.id_salida}>
                  <TableCell>{salida.id_salida}</TableCell>
                  <TableCell>{salida.cantidad_salida}</TableCell>
                  <TableCell>{salida.nombre_categoria}</TableCell>
                  <TableCell>{salida.nombre_proveedor}</TableCell>
                  <TableCell>{salida.nombre_producto}</TableCell>
                  <TableCell>{salida.gestionada_por}</TableCell>
                  <TableCell>{new Date(salida.fecha_salida).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SalidaReporte;
