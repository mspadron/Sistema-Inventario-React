import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    TextField,
    Typography,
  } from '@mui/material';
  import { useState, useEffect } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import Navbar from './Navbar.jsx';
  
  function ProveedorForm({ proveedorId, onClose, onSave }) {
    const [proveedor, setProveedor] = useState({
      nombre_proveedor: '',
      correo_proveedor: '',
      telefono: '',
    });
    const [loading, setLoading] = useState(false);
    const [loadingProveedor, setLoadingProveedor] = useState(false);
  
    const navigate = useNavigate();
    const params = useParams();
  
    useEffect(() => {
      const fetchProveedor = async () => {
        if (proveedorId) {
          setLoadingProveedor(true);
          try {
            const response = await fetch(`http://localhost:4000/proveedores/${proveedorId}`);
            const data = await response.json();
            setProveedor({ ...data });
            setLoadingProveedor(false);
          } catch (error) {
            console.error('Error al cargar proveedor:', error);
            setLoadingProveedor(false);
          }
        }
      };
  
      fetchProveedor();
    }, [proveedorId]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const url = proveedorId
          ? `http://localhost:4000/proveedores/${proveedorId}`
          : 'http://localhost:4000/proveedores';
        const method = proveedorId ? 'PUT' : 'POST';
  
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proveedor),
        });
        await response.json();
        setLoading(false);
        onSave();
        onClose();
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
  
    const handleChange = (e) => {
      setProveedor({ ...proveedor, [e.target.name]: e.target.value });
    };
  
    return (
      <>
        <Navbar />
        <div>
          <Typography variant="h5" textAlign="center" color="white">
            {proveedorId ? 'Editar Proveedor' : 'Crear Proveedor'}
          </Typography>
          <Card style={{ backgroundColor: '#1e272e', padding: '1rem' }}>
            <CardContent>
              {loadingProveedor ? (
                <CircularProgress color="inherit" />
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        variant="filled"
                        label="Nombre Proveedor"
                        fullWidth
                        sx={{ marginBottom: '1rem' }}
                        name="nombre_proveedor"
                        value={proveedor.nombre_proveedor || ''}
                        onChange={handleChange}
                        inputProps={{ style: { color: 'white' } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        variant="filled"
                        label="Correo Proveedor"
                        fullWidth
                        sx={{ marginBottom: '1rem' }}
                        name="correo_proveedor"
                        value={proveedor.correo_proveedor || ''}
                        onChange={handleChange}
                        inputProps={{ style: { color: 'white' } }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    variant="filled"
                    label="Teléfono"
                    fullWidth
                    sx={{ marginBottom: '1rem' }}
                    name="telefono"
                    value={proveedor.telefono || ''}
                    onChange={handleChange}
                    inputProps={{ style: { color: 'white' } }}
                  />
                  <Button variant="contained" color="primary" type="submit">
                    {loading ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      'Guardar'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  
  export default ProveedorForm;
  