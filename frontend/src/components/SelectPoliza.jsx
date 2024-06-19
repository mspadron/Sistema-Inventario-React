// SelectPoliza.jsx
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SelectPoliza = ({ value, onChange }) => {
  const [polizas, setPolizas] = useState([]);
  const [selectedValue, setSelectedValue] = useState(value);

  const loadPolizas = async () => {
    try {
      const response = await fetch('http://localhost:4000/polizas');
      const data = await response.json();
      setPolizas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPolizas();
  }, []);

  const handleSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
      <InputLabel style={{ color: 'white' }}>Pólizas</InputLabel>
      <Select
        value={selectedValue || ''} // Aseguramos que el valor no sea undefined
        onChange={handleSelect}
        inputProps={{ style: { color: 'white' } }}
        label="Pólizas"
      >
        {polizas.map((poliza) => (
          <MenuItem key={poliza.id} value={poliza.id}>
            {poliza.tipo_poliza}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectPoliza;
