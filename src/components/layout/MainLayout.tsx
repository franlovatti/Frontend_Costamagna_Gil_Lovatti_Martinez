import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


export default function MainLayout() {
  /**Con logica de logeo <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand> tendria el href="/home" */
  return (
    <div className='bg-dark d-flex flex-column min-vh-100'>
      <Navbar expand="lg" fixed='top' bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto fw-bold">
              <Nav.Link href="torneos">Torneos</Nav.Link>
              <Nav.Link href="noticias">Noticias</Nav.Link>
              <Nav.Link href="perfil">Perfil</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ height: "56px" }}></div>

      <main className="flex-fill">
        <Outlet />
      </main>

      <footer className="text-bg-dark text-center py-3">
        <p>Creado por:</p> 
      </footer>
    </div>
  );
}
