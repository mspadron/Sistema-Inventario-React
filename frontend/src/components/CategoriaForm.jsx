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
  import Navbar from './Navbar.jsx';
  
  function CategoriaForm({ categoriaId, onClose, onSave }) {
    const [categoria, setCategoria] = useState({
      nombre_categoria: '',
    });
    const [loading, setLoading] = useState(false);
    const [loadingCategoria, setLoadingCategoria] = useState(false);
  
    useEffect(() => {
      const fetchCategoria = async () => {
        if (categoriaId) {
          setLoadingCategoria(true);
          try {
            const response = await fetch(`http://localhost:4000/categorias/${categoriaId}`);
            const data = await response.json();
            setCategoria(data);
            setLoadingCategoria(false);
          } catch (error) {
            console.error('Error al cargar categoría:', error);
            setLoadingCategoria(false);
          }
        }
      };
  
      fetchCategoria();
    }, [categoriaId]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const url = categoriaId
          ? `http://localhost:4000/categorias/${categoriaId}`
          : 'http://localhost:4000/categorias';
        const method = categoriaId ? 'PUT' : 'POST';
  
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoria),
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
      setCategoria({ ...categoria, [e.target.name]: e.target.value });
    };
  
    return (
      <>
        <Navbar />
        <div>
          <Typography variant="h5" textAlign="center" color="white">
            {categoriaId ? 'Editar Categoría' : 'Crear Categoría'}
          </Typography>
          <Card style={{ backgroundColor: '#1e272e', padding: '1rem' }}>
            <CardContent>
              {loadingCategoria ? (
                <CircularProgress color="inherit" />
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        variant="filled"
                        label="Nombre Categoría"
                        fullWidth
                        sx={{ marginBottom: '1rem' }}
                        name="nombre_categoria"
                        value={categoria.nombre_categoria || ''}
                        onChange={handleChange}
                        inputProps={{ style: { color: 'white' } }}
                      />
                    </Grid>
                  </Grid>
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
  
  export default CategoriaForm;
  