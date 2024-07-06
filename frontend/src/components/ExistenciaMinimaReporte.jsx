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

const ExistenciaMinimaReporte = () => {
  const [existenciasMinimas, setExistenciasMinimas] = useState([]);

  useEffect(() => {
    fetchExistenciasMinimas();
  }, []);

  const fetchExistenciasMinimas = async () => {
    try {
      const response = await fetch('http://localhost:4000/existencias/minimas');
      const data = await response.json();
      setExistenciasMinimas(data);
    } catch (error) {
      console.error('Error fetching existencias minimas:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID Existencia", "Producto", "Categoría", "Proveedor", "Stock Actual"];
    const tableRows = [];

    existenciasMinimas.forEach(existencia => {
      const existenciaData = [
        existencia.id_existencia,
        existencia.nombre_producto,
        existencia.nombre_categoria,
        existencia.nombre_proveedor,
        existencia.stockactual_existencia
      ];
      tableRows.push(existenciaData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Reporte de Existencias Mínimas", 14, 15);
    doc.save('existencias_minimas_reporte.pdf');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '20px' }}>
        <h1>Reporte de Existencias Mínimas</h1>
        <Button variant="contained" color="primary" onClick={downloadPDF} sx={{ marginRight: '1rem' }}>
          Descargar PDF
        </Button>
        <Button variant="contained" color="secondary">
          <CSVLink
            data={existenciasMinimas}
            filename={"existencias_minimas_reporte.csv"}
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Descargar CSV
          </CSVLink>
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Existencia</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Stock Actual</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {existenciasMinimas.map((existencia) => (
                <TableRow key={existencia.id_existencia}>
                  <TableCell>{existencia.id_existencia}</TableCell>
                  <TableCell>{existencia.nombre_producto}</TableCell>
                  <TableCell>{existencia.nombre_categoria}</TableCell>
                  <TableCell>{existencia.nombre_proveedor}</TableCell>
                  <TableCell>{existencia.stockactual_existencia}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ExistenciaMinimaReporte;
