import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';

export default function MainLayout() {
  /**Con logica de logeo <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand> tendria el href="/home" */
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="bg-dark d-flex flex-column min-vh-100">
      <Navbar expand="lg" fixed="top" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to={isAuthenticated ? '/home' : '/'}>
            React-Bootstrap
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto fw-bold">
              {isAuthenticated ? (
                <>
                  <NavDropdown title="Torneos" id="torneos-nav-dropdown">
                    <NavDropdown.Item as={Link} to="mis-torneos">
                      Mis Torneos
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="torneos">
                      Lista de Torneos
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link
                    as={Link}
                    to={
                      user?.role === 'Administrador'
                        ? 'lista-noticias'
                        : 'noticias'
                    }
                  >
                    Noticias
                  </Nav.Link>
                  <Nav.Link as={Link} to="perfil">
                    Perfil
                  </Nav.Link>
                  {user?.role === 'Administrador' && (
                    <Nav.Link as={Link} to="admin">
                      Admin
                    </Nav.Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn btn-link nav-link"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="login">
                    Iniciar sesión
                  </Nav.Link>
                  <Nav.Link as={Link} to="registro">
                    Registro
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ height: '56px' }}></div>

      <main className="flex-fill">
        <Outlet />
      </main>

      <footer className="text-bg-dark text-center py-3">
        <p>Creado por: Estudiantes de DSW</p>
      </footer>
    </div>
  );
}
