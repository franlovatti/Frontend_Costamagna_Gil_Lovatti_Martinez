import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ThemeToggle from '../ThemeToggle.tsx';
import '../cssComponentes/Layout.css';

export default function MainLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="main-layout">
      <Navbar
        expand="lg"
        fixed="top"
        data-bs-theme="dark"
        className="main-navbar"
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to={isAuthenticated ? '/home' : '/'}
            className="brand-text"
          >
            Gestor de Torneos
          </Navbar.Brand>
          <div className="navbar-theme-navbar d-none d-lg-block">
            <ThemeToggle />
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto fw-bold navbar-nav">
              {isAuthenticated ? (
                <>
                  <Nav.Link
                    as={Link}
                    to={'/home/torneos'}
                  >
                    Torneos
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={'/home/mis-torneos'}
                  >
                    Mis torneos
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={'/home/noticias'}
                  >
                    Noticias
                  </Nav.Link>
                  <Nav.Link as={Link} to="/home/perfil" className="nav-link">
                    Perfil
                  </Nav.Link>
                  {user?.role === 'Administrador' && (
                    <Nav.Link as={Link} to="/admin" className="nav-link">
                      Admin
                    </Nav.Link>
                  )}
                  <div className="navbar-theme-mobile d-lg-none">
                    <ThemeToggle />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn nav-link-logout"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="login" className="nav-link">
                    Iniciar sesión
                  </Nav.Link>
                  <Nav.Link as={Link} to="registro" className="nav-link">
                    Registro
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-fill">
        <Outlet />
      </main>

      <footer className="main-footer">
        <div className="footer-container">
          <p className="footer-text mb-0">
            Creado por: Estudiantes de DSW - Desarrollo de Software
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Sobre nosotros
            </a>
            <span className="footer-separator">•</span>
            <a href="#" className="footer-link">
              Contacto
            </a>
            <span className="footer-separator">•</span>
            <a href="#" className="footer-link">
              Términos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
