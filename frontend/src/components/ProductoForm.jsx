import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function ProductoForm({ productoId, onClose, onSave }) {
  const [producto, setProducto] = useState({
    id_categoria: '',
    nombre_producto: '',
    precio_producto: '',
    fecha_expiracion_producto: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducto, setLoadingProducto] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:4000/categorias');
        const data = await response.json();
        if (Array.isArray(data.categorias)) {
          setCategorias(data.categorias);
        } else {
          console.error('Los datos del proveedor no son un array:', data);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    const fetchProducto = async () => {
      if (productoId) {
        setLoadingProducto(true);
        try {
          const response = await fetch(`http://localhost:4000/productos/${productoId}`);
          const data = await response.json();
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            setProducto(data); // Establece el producto a editar
          } else {
            console.error('Los datos de productos no son un array:', data);
          }
          setLoadingProducto(false);
        } catch (error) {
          console.error('Error al cargar producto:', error);
          setLoadingProducto(false);
        }
      }
    };

    fetchCategorias();
    fetchProducto();
  }, [productoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = productoId
        ? `http://localhost:4000/productos/${productoId}`
        : 'http://localhost:4000/productos';
      const method = productoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
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
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div>
        <Typography variant="h5" textAlign="center" color="white">
          {productoId ? 'Editar Producto' : 'Crear Producto'}
        </Typography>
        <Card style={{ backgroundColor: '#1e272e', padding: '1rem' }}>
          <CardContent>
            {loadingProducto ? (
              <CircularProgress color="inherit" />
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Select
                      variant="filled"
                      label="Categoría"
                      fullWidth
                      sx={{ marginBottom: '1rem' }}
                      name="id_categoria"
                      value={producto.id_categoria || ''}
                      onChange={handleChange}
                      inputProps={{ style: { color: 'white' } }}
                    >
                      {categorias.map((categoria) => (
                        <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                          {categoria.nombre_categoria}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="filled"
                      label="Nombre Producto"
                      fullWidth
                      sx={{ marginBottom: '1rem' }}
                      name="nombre_producto"
                      value={producto.nombre_producto || ''}
                      onChange={handleChange}
                      inputProps={{ style: { color: 'white' } }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  variant="filled"
                  label="Precio"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="precio_producto"
                  value={producto.precio_producto || ''}
                  onChange={handleChange}
                  inputProps={{ style: { color: 'white' } }}
                />
                <TextField
                  variant="filled"
                  label="Fecha de Expiración"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="fecha_expiracion_producto"
                  type="date"
                  value={producto.fecha_expiracion_producto || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
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

export default ProductoForm;
