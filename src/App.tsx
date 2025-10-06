import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Context and Providers
import AuthProvider from './providers/AuthProvider.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

// Layouts and Components
import NotFound from './pages/NotFound.js';
import MainLayout from './components/layout/MainLayout.tsx';

// Pages
import MainHome from './pages/MainHome.tsx';
import Torneos from './pages/Torneos.tsx';
import Noticias from './pages/Noticias.tsx';
import Perfil from './pages/Perfil.tsx';
import Login from './pages/Login.tsx';
import Registro from './pages/Registro.tsx';
import ForgottenPassword from './pages/ForgottenPassword.tsx';
import ChangePassword from './pages/ChangePassword.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AuthLayout from './components/layout/AuthLayout.tsx';
import CrearTorneo from './pages/CrearTorneo.tsx';
import CrearPartido from './pages/CrearPartido.tsx';
// import Listanoticias from './pages/Listanoticias.tsx';
// import Crearnoticia from './pages/Crearnoticia.tsx';
// import Editarnoticia from './pages/Editarnoticia.tsx';
import NoLoggedHome from './pages/NoLoggedHome.tsx';
import CrearEstablecimiento from './pages/CrearEstablecimiento.tsx';
import EditarEstablecimiento from './pages/EditarEstablecimiento.tsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/*Rutas con el MainLayout*/}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<NoLoggedHome />} />
              <Route path="Login" element={<Login />} />
              <Route path="CrearPartido" element={<CrearPartido />} />
              <Route path="CrearPartido/:eventoId" element={<CrearPartido />} />
              <Route
                path="CrearEstablecimiento"
                element={<CrearEstablecimiento />}
              />
              <Route
                path="CrearEstablecimiento/:eventoId"
                element={<CrearEstablecimiento />}
              />
              <Route
                path="EditarEstablecimiento/:eventoId"
                element={<EditarEstablecimiento />}
              />
              <Route path="Registro" element={<Registro />}></Route>
              <Route
                path="ForgottenPassword"
                element={<ForgottenPassword />}
              ></Route>
              <Route path="ChangePassword" element={<ChangePassword />}></Route>
            </Route>
            <Route
              element={
                <ProtectedRoute allowedRoles={['Usuario', 'Administrador']} />
              }
            >
              <Route path="home" element={<MainLayout />}>
                <Route index element={<MainHome />} />
                <Route path="torneos" element={<Torneos />} />
                <Route path="torneos/crear-torneo" element={<CrearTorneo />} />
                <Route path="noticias" element={<Noticias />} />

                <Route path="perfil" element={<Perfil />} />
              </Route>
            </Route>

            {/* Rutas con el AuthLayout - Area Protegida */}
            <Route
              element={<ProtectedRoute allowedRoles={['Administrador']} />}
            >
              <Route path="home/admin" element={<AuthLayout />}>
                <Route index element={<Dashboard />} />
                {/* <Route path="usuarios" element={<Usuarios />} />
              <Route path="deportes" element={<Deportes />} /> */}
                {/* <Route path="lista-noticias" element={<Listanoticias />} />
                <Route path="crear-noticia" element={<Crearnoticia />} />
                <Route path="editar-noticia/:id" element={<Editarnoticia />} /> */}
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
