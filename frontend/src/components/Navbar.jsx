import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider // Importa Divider para separar visualmente los elementos
} from '@mui/material';
import {
  Person as UserIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  Payment as PaymentIcon,
  Close as CloseIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

    if (tipoUsuario === '1') {
      menuItems.push(
        { text: 'Dashboard', icon: <HomeIcon />, link: '/incompleto' },
        { text: 'Usuarios', icon: <UserIcon />, link: '/dashUser' },
        { text: 'Proveedores', icon: <StoreIcon />, link: '/dashProveedor' },
        { text: 'Categorias', icon: <InventoryIcon />, link: '/dashCategoria' },
        { text: 'Productos', icon: <InventoryIcon />, link: '/dashProducto' },
        { text: 'Existencias', icon: <PaymentIcon />, link: '/dashExistencia' }
        
      );
    } else if (tipoUsuario === '2') {
      menuItems.push(
        { text: 'Dashboard', icon: <HomeIcon />, link: '/incompleto' },
        { text: 'Proveedores', icon: <StoreIcon />, link: '/incompleto' },
        { text: 'Productos', icon: <InventoryIcon />, link: '/incompleto' },
        { text: 'Existencias', icon: <PaymentIcon />, link: '/incompleto' }
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
        <Divider />{' '}
        {/* Añade una línea divisoria después de los elementos del menú */}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            backgroundColor:
              hoveredItem === menuItems.length ? '#2c3848' : 'transparent', 
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
