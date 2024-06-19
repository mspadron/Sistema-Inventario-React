import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Principal from './components/Principal.jsx';
import UserList from './components/UserList.jsx';
import UserForm from './components/UserForm.jsx';
import ClienteList from './components/ClienteList.jsx';
import ClienteForm from './components/ClienteForm.jsx';
import PolizaList from './components/PolizaList.jsx';
import PolizaForm from './components/PolizaForm.jsx';
import PagoList from './components/PagoList.jsx';
import PagoForm from './components/PagoForm.jsx';

import { Login } from './components/Login.jsx';
import { Incompleto } from './components/Incompleto.jsx';

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
            <Route path="/dashCliente" element={<ClienteList />} />
            <Route path="/clientes/new" element={<ClienteForm />} />
            <Route path="/clientes/:id/edit" element={<ClienteForm />} />
            <Route path="/dashUser" element={<UserList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
            <Route path="/dashPoliza" element={<PolizaList />} />
            <Route path="/polizas/new" element={<PolizaForm />} />
            <Route path="/polizas/:id/edit" element={<PolizaForm />} />
            <Route path="/dashPago" element={<PagoList />} />
            <Route path="/pagos/new" element={<PagoForm />} />
            <Route path="/pagos/:id/edit" element={<PagoForm />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
