import { Outlet, Link} from "react-router-dom";
import { useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';



const MainLayout = () => {
  /**Con logica de logeo <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand> tendria el href="/home" */
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className='bg-dark d-flex flex-column min-vh-100'>
      <Navbar expand="lg" fixed='top' bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto fw-bold">
              { isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="torneos">Torneos</Nav.Link>
                  <Nav.Link as={Link} to="noticias">Noticias</Nav.Link>
                  <Nav.Link as={Link} to="perfil">Perfil</Nav.Link>
                  {user?.role === 'Administrador' && (
                    <Nav.Link as={Link} to="admin">Admin</Nav.Link>
                  )}
                  <button onClick={handleLogout} className="btn btn-link nav-link">
                  Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="login">Iniciar sesión</Nav.Link>
                  <Nav.Link as={Link} to="registro">Registro</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ height: "56px" }}></div>

      <main className="flex-fill">
        <Outlet />
      </main>

      <footer className="text-bg-dark text-center py-3">
        <p>Creado por: Estudiantes de DSW</p> 
      </footer>
    </div>
  );
}

export default MainLayout;