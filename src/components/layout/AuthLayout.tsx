import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="auth-layout">
      <aside className="auth-sidebar">
        <div className="sidebar-header">
          <h2>Gestion de Torneos</h2>
          <p>Bienvenido, {user?.nombre || 'User'}!</p>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link">
            <span className="icon">🏠</span>
            Inicio
          </Link>
          <Link to="/dashboard" className="sidebar-link">
            <span className="icon">📊</span>
            Panel de Control
          </Link>
          <Link to="/deportes" className="sidebar-link">
            <span className="icon">🧴</span>
            Deportes
          </Link>
          <Link to="/usuarios" className="sidebar-link">
            <span className="icon">👤</span>
            Usuarios
          </Link>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="icon">🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>
      
      <main className="auth-content">
        <header className="auth-header">
          <h1>Area Protegida</h1>
        </header>
        
        <div className="auth-main">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout; 