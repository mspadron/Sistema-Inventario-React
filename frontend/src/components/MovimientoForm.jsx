import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

function MovimientoForm({ existencia, onClose, onMovement, tipo }) {
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = tipo === 'entrada' ? 'http://localhost:4000/entradas' : 'http://localhost:4000/salidas';
    const payload = {
        id_existencia: existencia.id_existencia,
        ...(tipo === 'entrada' 
          ? { cantidad_entrada: parseFloat(cantidad), fecha_entrada: new Date().toISOString() } 
          : { cantidad_salida: parseFloat(cantidad), fecha_salida: new Date().toISOString() }
        ),
        id_usuario: localStorage.getItem('usuarioId'), // Obtener el ID del usuario desde localStorage
      };
      
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await response.json();
      setLoading(false);
      onMovement();
      onClose();
    } catch (error) {
      console.error('Error al realizar el movimiento:', error);
      setLoading(false);
    }
  };

  return (
    <div className="movimiento-form">
      <Typography variant="h5" textAlign="center" color="white">
        {tipo === 'entrada' ? 'Entrada de Stock' : 'Salida de Stock'}
      </Typography>
      <Card style={{ backgroundColor: '#1e272e', padding: '1rem' }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  label="Cantidad"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  inputProps={{ style: { color: 'white' } }}
                  required
                />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" type="submit">
              {loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'
              )}
            </Button>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default MovimientoForm;
