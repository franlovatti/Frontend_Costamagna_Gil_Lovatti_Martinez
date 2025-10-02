import StatCard from '../components/StatCard.tsx';
import ActivityItem from '../components/ActivityItem.tsx';
import { useStats } from '../hooks/useStats.tsx';
import './Dashboard.css';

const statCards = [
  {
    icon: "👥",
    title: "Total Usuarios",
    key: "totalUsers",
  },
  {
    icon: "⚽",
    title: "Deportes",
    key: "deportes",
  },
  {
    icon: "🏆",
    title: "Eventos",
    key: "eventos",
  }
];

const Dashboard = () => {
  const { stats, loading } = useStats();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header mb-4 pb-3">
        <h1 className="mb-2">Panel de Control</h1>
        <p className="text-muted-custom mb-0">Gestión de torneos deportivos</p>
      </div>
      
      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div className="col-12 col-sm-6 col-lg-3" key={card.key}>
            {loading ? (
              <div className="stat-card d-flex align-items-center justify-content-center" style={{ minHeight: 120 }}>
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <StatCard
                icon={card.icon}
                title={card.title}
                value={stats?.[card.key] ?? 0}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="content-card h-100">
            <h2 className="mb-4">Actividad Reciente</h2>
            <div className="d-flex flex-column gap-3">
              <ActivityItem icon="👤" text="Nuevo usuario registrado" time="hace 2 minutos" />
              <ActivityItem icon="💰" text="Pago recibido" time="hace 15 minutos" />
              <ActivityItem icon="📧" text="Campaña de correo enviada" time="hace 1 hora" />
              <ActivityItem icon="🏆" text="Torneo finalizado" time="hace 3 horas" />
            </div>
          </div>
        </div>
        
        <div className="col-12 col-lg-4">
          <div className="content-card h-100">
            <h2 className="mb-4">Acciones Rápidas</h2>
            <div className="d-flex flex-column gap-2">
              <button className="action-btn">
                <span>📊</span>
                Ver Reportes
              </button>
              <button className="action-btn">
                <span>👥</span>
                Gestionar Usuarios
              </button>
              <button className="action-btn">
                <span>⚙️</span>
                Configuración
              </button>
              <button className="action-btn">
                <span>📧</span>
                Enviar Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;