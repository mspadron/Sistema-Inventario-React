import React, { useState } from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Person as UserIcon, Store as StoreIcon, Inventory as InventoryIcon, Payment as PaymentIcon, Close as CloseIcon, Home as HomeIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Navbar = () => {
  const navigate = useNavigate();
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('tipoUsuario');
    navigate('/');
  };

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const renderMenuItems = () => {
    const menuItems = [];

    if (tipoUsuario === '1') { // Administrador
      menuItems.push(
        { text: 'Dashboard', icon: <HomeIcon />, link: '/dashboard' },
        { text: 'Usuarios', icon: <UserIcon />, link: '/dashUser' },
        { text: 'Proveedores', icon: <StoreIcon />, link: '/dashProveedor' },
        { text: 'Categorías', icon: <InventoryIcon />, link: '/dashCategoria' },
        { text: 'Productos', icon: <InventoryIcon />, link: '/dashProducto' },
        { text: 'Existencias', icon: <PaymentIcon />, link: '/dashExistencia' },
        { text: 'Entradas', icon: <PaymentIcon />, link: '/dashEntrada' },
        { text: 'Salidas', icon: <PaymentIcon />, link: '/dashSalida' },
        { text: 'Existencias Mínimas', icon: <PaymentIcon />, link: '/reporteMinExis' }
      );
    } else if (tipoUsuario === '2') { // Bodega
      menuItems.push(
        { text: 'Dashboard', icon: <HomeIcon />, link: '/dashboard' },
        { text: 'Existencias', icon: <PaymentIcon />, link: '/dashExistencia' }
      );
    } else if (tipoUsuario === '3') { // Gerente
      menuItems.push(
        { text: 'Dashboard', icon: <HomeIcon />, link: '/dashboard' },
        { text: 'Entradas', icon: <PaymentIcon />, link: '/dashEntrada' },
        { text: 'Salidas', icon: <PaymentIcon />, link: '/dashSalida' },
        { text: 'Existencias Mínimas', icon: <PaymentIcon />, link: '/reporteMinExis' }
      );
    } else if (tipoUsuario === '4') { // Gestor
      menuItems.push(
        { text: 'Dashboard', icon: <HomeIcon />, link: '/dashboard' },
        { text: 'Proveedores', icon: <StoreIcon />, link: '/dashProveedor' },
        { text: 'Categorías', icon: <InventoryIcon />, link: '/dashCategoria' },
        { text: 'Productos', icon: <InventoryIcon />, link: '/dashProducto' }
      );
    }

    return (
      <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            component={item.link ? Link : 'button'}
            to={item.link}
            onClick={item.action}
            sx={{
              '&:hover': {
                backgroundColor: '#2c3848',
                '& .MuiListItemIcon-root': {
                  color: '#FFF'
                },
                '& .MuiListItemText-primary': {
                  color: '#FFF'
                }
              },
              backgroundColor: hoveredItem === index ? '#2c3848' : 'transparent'
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <ListItemIcon sx={{ color: '#FFF' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider /> {/* Añade una línea divisoria después de los elementos del menú */}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            backgroundColor: hoveredItem === menuItems.length ? '#2c3848' : 'transparent',
            marginTop: 'auto',
            '&:hover': {
              backgroundColor: '#2c3848',
              '& .MuiListItemIcon-root': {
                color: '#FFF'
              },
              '& .MuiListItemText-primary': {
                color: '#FFF'
              }
            }
          }}
          onMouseEnter={() => handleMouseEnter(menuItems.length)}
          onMouseLeave={handleMouseLeave}
        >
          <ListItemIcon sx={{ color: '#FFF' }}>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        anchor="left"
        open={true}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1A202C',
            color: '#FFF',
            height: '100vh',
            top: 0,
            zIndex: 1000
          }
        }}
      >
        {renderMenuItems()}
      </Drawer>
    </Box>
  );
};

export default Navbar;
