import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import Navbar from './Navbar.jsx';

import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#02152B',
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

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
    const tableColumn = [
      'ID Salida',
      'Cantidad Salida',
      'Fecha Salida',
      'Categoria',
      'Proveedor',
      'Producto',
      'Gestionada por'
    ];
    const tableRows = [];

    salidas.forEach((salida) => {
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
    doc.text('Reporte de Salidas', 14, 15);
    doc.save('salidas_reporte.pdf');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, paddingRight: 4, marginLeft: '40px' }}
      >
        <h1>REPORTE DE SALIDAS</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadPDF}
          sx={{ marginRight: '1rem' }}
        >
          Descargar PDF
        </Button>
        <Button variant="contained" color="secondary">
          <CSVLink
            data={salidas}
            filename={'salidas_reporte.csv'}
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Descargar CSV
          </CSVLink>
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID Salida</StyledTableCell>
                <StyledTableCell align="right">Cantidad Salida</StyledTableCell>
                <StyledTableCell align="right">Categoria</StyledTableCell>
                <StyledTableCell align="right">Proveedor</StyledTableCell>
                <StyledTableCell align="right">Producto</StyledTableCell>
                <StyledTableCell align="right">Gestionada por</StyledTableCell>
                <StyledTableCell align="right">Fecha Salida</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salidas.map((salida) => (
                <StyledTableRow key={salida.id_salida}>
                  <StyledTableCell component="th" scope="row">
                    {salida.id_salida}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {salida.cantidad_salida}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {salida.nombre_categoria}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {salida.nombre_proveedor}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {salida.nombre_producto}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {salida.gestionada_por}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {new Date(salida.fecha_salida).toLocaleDateString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SalidaReporte;
