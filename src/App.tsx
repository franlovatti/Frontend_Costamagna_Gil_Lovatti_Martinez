import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./temas.css";
import "./App.css";
// Context and Providers
import AuthProvider from './providers/AuthProvider.tsx';
import DeportesProvider from "./providers/DeporteProvider.tsx";
import ProtectedRoute from './components/ProtectedRoute.tsx';
import TorneosProvider from "./providers/TorneoProvider.tsx";
import UsuariosProvider from "./providers/UsuarioProvider.tsx";

// Layouts and Components
import NotFound from './pages/NotFound.js';
import MainLayout from './components/layout/MainLayout.tsx';

// Pages
import MainHome from './pages/MainHome.tsx';
import Torneos from './pages/Torneos.tsx';
import Noticias from './pages/Noticias.tsx';
import Perfil from './pages/Perfil.tsx';
import Login from './pages/Login.tsx';
import Registro from "./pages/Registro.tsx";
import ForgottenPassword from "./pages/ForgottenPassword.tsx";
import ChangePassword from './pages/ChangePassword.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AuthLayout from "./components/layout/AuthLayout.tsx";
import DeportesAdmin from "./pages/DeportesAdmin.tsx";
import TorneosAdmin from "./pages/TorneosAdmin.tsx";
import UsuariosAdmin from "./pages/UsuariosAdmin.tsx";

function App() {
  return (
    <AuthProvider>
      <DeportesProvider>
      <TorneosProvider>
        <BrowserRouter>
          <div className="App">
          <Routes>
            {/*Rutas con el MainLayout*/}
            <Route path='/' element={<MainLayout/>}>
              <Route index element={<MainHome />} />
              <Route path="Login" element={<Login/>} />
              <Route path="Registro" element={<Registro/>}></Route>
              <Route path = "ForgottenPassword" element={<ForgottenPassword/>}></Route>
              <Route path = "ChangePassword" element = {<ChangePassword/>}></Route>
              <Route element={<ProtectedRoute allowedRoles={["Usuario", "Administrador"]} />}>
                <Route path="torneos" element={<Torneos />} />
                <Route path="noticias" element={<Noticias />} />
                <Route path="perfil" element={<Perfil />} />
              </Route>
            </Route>
            {/* Rutas con el AuthLayout - Area Protegida */}
            <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
              <Route path='/admin' element={<AuthLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="/admin/usuarios" element={<UsuariosProvider><UsuariosAdmin /></UsuariosProvider>} />
                <Route path="/admin/deportes" element={<DeportesProvider><DeportesAdmin /></DeportesProvider>} />
                <Route path="/admin/torneos" element={<TorneosProvider><TorneosAdmin /></TorneosProvider>} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </BrowserRouter>
      </TorneosProvider>
      </DeportesProvider>
    </AuthProvider>
  );
}

export default App;
