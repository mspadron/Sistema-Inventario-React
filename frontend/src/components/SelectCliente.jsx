// SelectCliente.jsx
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SelectCliente = ({ value, onChange }) => {
  const [clientes, setClientes] = useState([]);
  const [selectedValue, setSelectedValue] = useState(value);

  const loadClientes = async () => {
    try {
      const response = await fetch('http://localhost:4000/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
      <InputLabel style={{ color: 'white' }}>Clientes</InputLabel>
      <Select
        value={selectedValue || ''} // Aseguramos que el valor no sea undefined
        onChange={handleSelect}
        inputProps={{ style: { color: 'white' } }}
        label="Clientes"
      >
        {clientes.map((cliente) => (
          <MenuItem key={cliente.id} value={cliente.id}>
            {cliente.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCliente;
