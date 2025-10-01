import './Dashboard.css';

const Dashboard = () => {
  const mockData = {
    totalUsers: 1250,
    activeUsers: 892,
    revenue: 45600,
    growth: 12.5
  };

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <h1 className="title">Panel de Control</h1>
        <p className="subtitle">Gestión de torneos deportivos</p>
      </div>
      
      <div className="dashboardStats">
        <div className="statCard">
          <div className="statHeader">
            <span className="statIcon">👥</span>
            <h3 className="statTitle">Total Usuarios</h3>
          </div>
          <p className="statNumber">{mockData.totalUsers.toLocaleString()}</p>
          <span className="statChange">+5.2% vs mes anterior</span>
        </div>
        <div className="statCard">
          <div className="statHeader">
            <span className="statIcon">🟢</span>
            <h3 className="statTitle">Usuarios Activos</h3>
          </div>
          <p className="statNumber">{mockData.activeUsers.toLocaleString()}</p>
          <span className="statChange">+3.1% esta semana</span>
        </div>
        <div className="statCard">
          <div className="statHeader">
            <span className="statIcon">💰</span>
            <h3 className="statTitle">Ingresos</h3>
          </div>
          <p className="statNumber">${mockData.revenue.toLocaleString()}</p>
          <span className="statChange">+{mockData.growth}% este mes</span>
        </div>
        <div className="statCard">
          <div className="statHeader">
            <span className="statIcon">📈</span>
            <h3 className="statTitle">Crecimiento</h3>
          </div>
          <p className="statNumber">{mockData.growth}%</p>
          <span className="statChange">+2.3% trimestral</span>
        </div>
      </div>
      
      <div className="dashboardContent">
        <div className="contentCard">
          <h2 className="contentTitle">Actividad Reciente</h2>
          <div className="activityList">
            <div className="activityItem">
              <span className="activityIcon">👤</span>
              <div className="activityContent">
                <p className="activityText">Nuevo usuario registrado</p>
                <span className="activityTime">hace 2 minutos</span>
              </div>
            </div>
            <div className="activityItem">
              <span className="activityIcon">💰</span>
              <div className="activityContent">
                <p className="activityText">Pago recibido</p>
                <span className="activityTime">hace 15 minutos</span>
              </div>
            </div>
            <div className="activityItem">
              <span className="activityIcon">📧</span>
              <div className="activityContent">
                <p className="activityText">Campaña de correo enviada</p>
                <span className="activityTime">hace 1 hora</span>
              </div>
            </div>
            <div className="activityItem">
              <span className="activityIcon">🏆</span>
              <div className="activityContent">
                <p className="activityText">Torneo finalizado</p>
                <span className="activityTime">hace 3 horas</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="contentCard">
          <h2 className="contentTitle">Acciones Rápidas</h2>
          <div className="quickActions">
            <button className="actionBtn">
              <span>📊</span>
              Ver Reportes
            </button>
            <button className="actionBtn">
              <span>👥</span>
              Gestionar Usuarios
            </button>
            <button className="actionBtn">
              <span>⚙️</span>
              Configuración
            </button>
            <button className="actionBtn">
              <span>📧</span>
              Enviar Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;