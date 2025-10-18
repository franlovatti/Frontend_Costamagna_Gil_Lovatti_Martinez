import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './temas.css';
import './App.css';
// Context and Providers
import AuthProvider from './providers/AuthProvider.tsx';
import DeportesProvider from './providers/DeporteProvider.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import TorneosProvider from './providers/TorneoProvider.tsx';
import UsuariosProvider from './providers/UsuarioProvider.tsx';
import NoticiasProvider from './providers/NoticiaProvider.tsx';

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
import Dashboard from './pages/admin/Dashboard.tsx';
import DeportesAdmin from './pages/admin/DeportesAdmin.tsx';
import TorneosAdmin from './pages/admin/TorneosAdmin.tsx';
import AuthLayout from './components/layout/AuthLayout.tsx';
import CrearTorneo from './pages/CrearTorneo.tsx';
import CrearPartido from './pages/CrearPartido.tsx';
// import Listanoticias from './pages/Listanoticias.tsx';
// import Crearnoticia from './pages/Crearnoticia.tsx';
// import Editarnoticia from './pages/Editarnoticia.tsx';
import NoLoggedHome from './pages/NoLoggedHome.tsx';
import CrearEstablecimiento from './pages/CrearEstablecimiento.tsx';
import EditarEstablecimiento from './pages/EditarEstablecimiento.tsx';
import EditarPartido from './pages/EditarPartido.tsx';

import TorneoDetalle from './pages/TorneoDetalle.tsx';
import EditarTorneo from './pages/EditarTorneo.tsx';
import CrearEquipo from './pages/CrearEquipo.tsx';
import VerEquipo from './pages/VerEquipo.tsx';
import EditarEquipo from './pages/EditarEquipo.tsx';
import CrearParticipacion from './pages/CrearParticipacion.tsx';
import EditarParticipacion from './pages/EditarParticipacion.tsx';
import NoticiaPage from './pages/NoticiaPage.tsx';
import MisTorneos from './pages/misTorneos.tsx';
import UsuariosAdmin from './pages/admin/UsuariosAdmin.tsx';
import NoticiasAdmin from './pages/admin/NoticiasAdmin.tsx';

function App() {
  return (
    <AuthProvider>
      <DeportesProvider>
        <TorneosProvider>
          <BrowserRouter>
            <div className="App">
              <Routes>
                {/*Rutas con el MainLayout*/}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<NoLoggedHome />} />
                  <Route path="Login" element={<Login />} />
                  <Route path="CrearPartido" element={<CrearPartido />} />
                  <Route
                    path="CrearPartido/:eventoId"
                    element={<CrearPartido />}
                  />
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
                  <Route
                    path="EditarPartido/:eventoId/:partidoId"
                    element={<EditarPartido />}
                  />
                  <Route path="Registro" element={<Registro />}></Route>
                  <Route
                    path="ForgottenPassword"
                    element={<ForgottenPassword />}
                  ></Route>
                  <Route
                    path="ChangePassword"
                    element={<ChangePassword />}
                  ></Route>
                </Route>
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={['Usuario', 'Administrador']}
                    />
                  }
                >
                  <Route path="home" element={<MainLayout />}>
                    <Route index element={<MainHome />} />
                    <Route path="torneos" element={<Torneos />} />
                    <Route
                      path="torneos/crear-torneo"
                      element={<CrearTorneo />}
                    />
                    <Route path="torneos/:id" element={<TorneoDetalle />} />
                    <Route
                      path="torneos/:id/editar"
                      element={<EditarTorneo />}
                    />
                    <Route path="noticias" element={<Noticias />} />
                    <Route
                      path="torneos/:id/crear-equipo"
                      element={<CrearEquipo />}
                    />
                    <Route path="CrearPartido" element={<CrearPartido />} />
                    <Route
                      path="torneos/:id/CrearPartido"
                      element={<CrearPartido />}
                    />
                    <Route
                      path="torneos/:id/CrearEstablecimiento"
                      element={<CrearEstablecimiento />}
                    />
                    <Route
                      path="torneos/:id/EditarEstablecimiento"
                      element={<EditarEstablecimiento />}
                    />
                    <Route
                      path="torneos/:id/EditarPartido"
                      element={<EditarPartido />}
                    />
                    <Route path="mis-torneos" element={<MisTorneos />} />
                    <Route path="equipos/:id" element={<VerEquipo />} />
                    <Route
                      path="equipos/:id/editar"
                      element={<EditarEquipo />}
                    />
                    <Route
                      path="participaciones/:id"
                      element={<CrearParticipacion />}
                    />
                    <Route
                      path="editarparticipacion/:id"
                      element={<EditarParticipacion />}
                    />

                    <Route path="perfil" element={<Perfil />} />
                  </Route>
                </Route>

                {/* Rutas con el AuthLayout - Area Protegida */}
                <Route
                  element={<ProtectedRoute allowedRoles={['Administrador']} />}
                >
                  <Route path="admin" element={<AuthLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route
                      path="/admin/usuarios"
                      element={
                        <UsuariosProvider>
                          <UsuariosAdmin />
                        </UsuariosProvider>
                      }
                    />
                    <Route
                      path="/admin/deportes"
                      element={
                        <DeportesProvider>
                          <DeportesAdmin />
                        </DeportesProvider>
                      }
                    />
                    <Route
                      path="/admin/noticias"
                      element={
                        <NoticiasProvider>
                          <NoticiasAdmin />
                        </NoticiasProvider>
                      }
                    />
                    <Route
                      path="/admin/torneos"
                      element={
                        <TorneosProvider>
                          <TorneosAdmin />
                        </TorneosProvider>
                      }
                    />
                    <Route
                      path="/admin/noticias"
                      element={
                        <NoticiasProvider>
                          <NoticiasAdmin />
                        </NoticiasProvider>
                      }
                    />
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
