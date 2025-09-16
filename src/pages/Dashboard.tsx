import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const mockData = {
    totalUsers: 1250,
    activeUsers: 892,
    revenue: 45600,
    growth: 12.5
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Panel de control</h1>
        <p>Bienvenido nuevamente, {user?.nombre || 'User'}!</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total usuarios</h3>
            <p className="stat-number">{mockData.totalUsers.toLocaleString()}</p>
            <span className="stat-change positive">+5.2%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>Usuarios activos</h3>
            <p className="stat-number">{mockData.activeUsers.toLocaleString()}</p>
            <span className="stat-change positive">+3.1%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Ganancia</h3>
            <p className="stat-number">${mockData.revenue.toLocaleString()}</p>
            <span className="stat-change positive">+{mockData.growth}%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Indice de crecimiento</h3>
            <p className="stat-number">{mockData.growth}%</p>
            <span className="stat-change positive">+2.3%</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="content-card">
          <h2>Actividad reciente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-content">
                <p>Nuevo usuario registrado</p>
                <span className="activity-time">hace 2 minutos</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">💰</span>
              <div className="activity-content">
                <p>Pago recibido</p>
                <span className="activity-time">hace 15 minutos</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📧</span>
              <div className="activity-content">
                <p>Campaña de correo electrónico enviada</p>
                <span className="activity-time">hace 1 hora</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="content-card">
          <h2>Acciones</h2>
          <div className="quick-actions">
            <button className="action-btn">📊 Ver reportes</button>
            <button className="action-btn">👥 Manejo de usuarios</button>
            <button className="action-btn">⚙️ Configuraciones</button>
            <button className="action-btn">📧 Enviar email</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 