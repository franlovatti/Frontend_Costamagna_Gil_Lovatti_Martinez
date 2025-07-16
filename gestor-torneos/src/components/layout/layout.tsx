import '../../styles/layout.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='container-fluid' style={{backgroundColor:"var(--background)", color:"var(--text)", height:"100%"}}>
      <Navbar expand="lg" fixed="top" data-bs-theme="dark" style={{backgroundColor:"var(--background)"}} >
      <Container>
        <Navbar.Brand href="#home" style={{color:"var(--text)"}}>React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="ms-auto">
            <Nav.Link href="#" className='mx-2'>Torneos</Nav.Link>
            <Nav.Link href="#" className='mx-2'>Tablon</Nav.Link>
            <Nav.Link href="#" className='mx-2'>Perfil</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <div style={{height:"56px"}}></div>
      <div className="wrapper" style={{display:"flex", flexDirection:"column",minHeight: "100vh"}}>
        <main className="content container my-4" style={{flex:"1"}}>{children}</main>
      </div>
      <footer className='text-center'> Diseñado por </footer>
    </div>
  );
}

/*<nav classNameName='row'>
        <ul classNameName='col ms-auto'>
          <li>torneos</li>
          <li>tablon </li>
          <li>Contact</li>
        </ul>
      </nav>*/ 


/*
<nav className="navbar navbar-expand-lg fixed-top" style={{backgroundColor:"var(--background)"}}>
        <div className="container-fluid">
          <a className="navbar-brand ps-2" href="#" style={{color:"var(--text)"}}>Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style={{color:"var(--text)"}}>
            <span style={{color:"var(--text)"}}>x</span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#" style={{color:"var(--text)"}}>Torneos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" style={{color:"var(--text)"}}>Tablon</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" style={{color:"var(--text)"}}>Perfil</a>
              </li>
            </ul>

          </div>
        </div>
      </nav>

*/