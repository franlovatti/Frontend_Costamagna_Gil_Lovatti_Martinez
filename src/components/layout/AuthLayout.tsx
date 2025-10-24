import { Outlet, Link } from 'react-router-dom';
import '../cssComponentes/AuthLayout.css';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle.tsx';

const AuthLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="auth-layout d-flex">
      <aside className="auth-sidebar d-flex flex-column">
        <div className="sidebar-header p-4">
          <span className="theme-toggle-wrapper">
            <ThemeToggle />
          </span>
          <h2 className="mb-2 p-1">Gestión de Torneos</h2>
          <p className="mb-0 text-muted-sidebar">Bienvenido, {user?.nombre || 'User'}!</p>
        </div>
        <nav className="sidebar-nav flex-grow-1 py-3">
          <Link
            to="/home"
            className="sidebar-link d-flex align-items-center gap-3 px-4 py-3 text-decoration-none"
          >
            <span className="icon">🏠</span>
            <span>Inicio</span>
          </Link>
          <Link
            to="/admin"
            className="sidebar-link d-flex align-items-center gap-3 px-4 py-3 text-decoration-none"
          >
            <span className="icon">📊</span>
            <span>Panel de Estadísticas</span>
          </Link>
          <Link
            to="/admin/usuarios"
            className="sidebar-link d-flex align-items-center gap-3 px-4 py-3 text-decoration-none"
          >
            <span className="icon">👤</span>
            <span>Usuarios</span>
          </Link>
          <Link to="/admin/torneos" className="sidebar-link d-flex align-items-center gap-3 px-4 py-3 text-decoration-none">
            <span className="icon">🏆</span>
            <span>Torneos</span>
          </Link>
          <Link to="/admin/deportes" className="sidebar-link d-flex align-items-center gap-3 px-4 py-3 text-decoration-none">
            <span className="icon">🏅</span>
            <span>Deportes</span>
          </Link> 
          <Link to="/admin/noticias" className="sidebar-link d-flex align-items-center gap-3 px-4 py-3 text-decoration-none">
            <span className="icon">📰</span>
            <span>Noticias</span>
          </Link>
          <Link to="/admin/localidades" className="sidebar-link d-flex align-items-center gap-3 px-4 py-3 text-decoration-none">
            <span className="icon">📍</span>
            <span>Localidades</span>
          </Link>
        </nav>
        <div className="sidebar-footer p-4">
          <button onClick={handleLogout} className="logout-btn w-100 d-flex align-items-center justify-content-center gap-2">
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="auth-content flex-grow-1 d-flex flex-column">
        <header className="auth-header p-4">
          <h1 className="mb-0">Área Protegida</h1>
        </header>

        <div className="auth-main flex-grow-1 p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;