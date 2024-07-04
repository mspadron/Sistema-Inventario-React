import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Principal from './components/Principal.jsx';
import UsuarioList from './components/UsuarioList.jsx';
import ProveedorList from './components/ProveedorList.jsx';
import CategoriaList from './components/CategoriaList.jsx';
import ProductoList from './components/ProductoList.jsx';
import { Login } from './components/Login.jsx';
import { Incompleto } from './components/Incompleto.jsx';
import ExistenciaList from './components/ExistenciaList.jsx';
function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {isAuthenticated ? (
          <>
            <Route path="/incompleto" element={<Incompleto />} />

            <Route path="/principal" element={<Principal />} />
            <Route path="/dashUser" element={<UsuarioList />} />
            <Route path="/dashCategoria" element={<CategoriaList />} />
            <Route path="/dashProducto" element={<ProductoList />} />
            <Route path="/dashProveedor" element={<ProveedorList />} />
            <Route path="/dashExistencia" element={<ExistenciaList />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
