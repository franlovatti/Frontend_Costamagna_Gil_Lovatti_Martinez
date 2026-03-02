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
import LocalidadProvider from './providers/LocalidadProvider.tsx';
import EstablecimientoProvider from './providers/EstablecimientoProvider.tsx';
import EquipoProvider from './providers/EquipoProvider.tsx';

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
import Dashboard from './pages/admin/Dashboard.tsx';
import DeportesAdmin from './pages/admin/DeportesAdmin.tsx';
import TorneosAdmin from './pages/admin/TorneosAdmin.tsx';
import LocalidadesAdmin from './pages/admin/LocalidadesAdmin.tsx';
import AuthLayout from './components/layout/AuthLayout.tsx';
import FormEstablecimiento from './pages/FormEstablecimiento.tsx';
import FormPartido from './pages/FormPartido.tsx';
import TorneoDetalle from './pages/TorneoDetalle.tsx';
import CrearEquipo from './pages/CrearEquipo.tsx';
import EditarEquipo from './pages/EditarEquipo.tsx';
import CrearParticipacion from './pages/CrearParticipacion.tsx';
import MisTorneos from './pages/misTorneos.tsx';
import UsuariosAdmin from './pages/admin/UsuariosAdmin.tsx';
import NoticiasAdmin from './pages/admin/NoticiasAdmin.tsx';
import PartidoDetalle from './pages/PartidoDetalle.tsx';
import ListarEstablecimientos from './pages/ListarEstablecimientos.tsx';
import UnirseEquipo from './pages/UnirseEquipo.tsx';



function App() {
  return (
    <AuthProvider>
      <EquipoProvider>
        <EstablecimientoProvider>
        <DeportesProvider>
        <TorneosProvider>
          <NoticiasProvider>
            <LocalidadProvider>
              <BrowserRouter>
                <div className="App">
                  <Routes>
                    {/*Rutas con el MainLayout*/}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<MainHome />} />
                      <Route path="Login" element={<Login />} />
                      <Route path="Registro" element={<Registro />}></Route>

                      <Route
                        path="unirse-equipo"
                        element={<UnirseEquipo />}
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
                        <Route path="torneos/:id" element={<TorneoDetalle />} />
                        <Route path="noticias" element={<Noticias />} />
                        <Route
                          path="torneos/:id/crear-equipo"
                          element={<CrearEquipo />}
                        />
                        <Route path="CrearPartido" element={<FormPartido />} />
                        <Route
                          path="torneos/:id/CrearPartido"
                          element={<FormPartido />}
                        />
                        <Route
                          path="torneos/:id/ListarEstablecimientos"
                          element={<ListarEstablecimientos />}
                        />
                        <Route
                          path="torneos/:idT/FormEstablecimiento/:idE?"
                          element={<FormEstablecimiento />}
                        />
                        <Route
                          path="torneos/:id/EditarPartido/:partidoId"
                          element={<FormPartido />}
                        />
                        <Route path="mis-torneos" element={<MisTorneos />} />
                        <Route path="equipos/:id" element={<EditarEquipo />} />
                        <Route
                          path="participaciones/:id"
                          element={<CrearParticipacion />}
                        />
                        <Route
                          path="partido-detalle/:id"
                          element={<PartidoDetalle />}
                        ></Route>

                        <Route
                          path="perfil"
                          element={
                            <UsuariosProvider>
                              <Perfil />
                            </UsuariosProvider>
                          }
                        />
                      </Route>
                    </Route>

                    {/* Rutas con el AuthLayout - Area Protegida */}
                    <Route
                      element={
                        <ProtectedRoute allowedRoles={['Administrador']} />
                      }
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
                          element={<DeportesAdmin />}
                        />
                        <Route
                          path="/admin/noticias"
                          element={<NoticiasAdmin />}
                        />
                        <Route
                          path="/admin/torneos"
                          element={<TorneosAdmin />}
                        />
                        <Route
                          path="/admin/localidades"
                          element={<LocalidadesAdmin />}
                        />
                      </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </LocalidadProvider>
          </NoticiasProvider>
        </TorneosProvider>
      </DeportesProvider>
      </EstablecimientoProvider>
      </EquipoProvider>
    </AuthProvider>
  );
}

export default App;
