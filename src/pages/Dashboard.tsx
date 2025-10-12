import DonutChart from '../components/DonutChart.tsx';
import StatCard from '../components/StatCard.tsx';
import DeportePopular from '../components/DeportePopular.tsx';
import { useStats } from '../hooks/useStats.tsx';
import './Dashboard.css';

const statCards = [
  {
    icon: "👥",
    title: "Usuarios activos",
    subtitle: "Usuarios totales",
    key2: "totalUsers",
    key: "activeUsers"
  },
  {
    icon: "⚽",
    title: "Deportes con eventos activos",
    subtitle: "Deportes totales",
    key: "activeDeportes",
    key2: "deportes"
  },
  {
    icon: "🏆",
    title: "Eventos activos",
    subtitle: "Eventos totales",
    key2: "eventos",
    key: "activeEventos"
  },
  {
    icon: "🎮",
    title: "Partidos jugados",
    subtitle: "Partidos programados",
    key: "partidosJugados",
    key2: "partidosPorJugar"
  }
];

const Dashboard = () => {
  const { stats, deportesConEventos, loading } = useStats();

  const eventos = stats?.eventos || 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header mb-4 pb-3">
        <h1 className="mb-2">Panel de Estadísticas</h1>
        <p className="text-muted-custom mb-0">Análisis general de la plataforma</p>
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
                subtitle={card.subtitle}
                value2={stats?.[card.key2] ?? 0}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          {loading ? (
            <div className="stat-card d-flex align-items-center justify-content-center" style={{ minHeight: 120 }}>
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="stats-card h-100">
              <h2 className="card-title mb-4">Deportes Más Populares</h2>
              <div className="deportes-list">
                {deportesConEventos.map((deporte, index) => (
                  <div key={index} className="deporte-item">
                    <DeportePopular deporte={deporte} eventos={eventos} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-lg-4">
          <div className="stats-card h-100">
            {loading ? (
              <div className="stat-card d-flex align-items-center justify-content-center" style={{ minHeight: 120 }}>
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <DonutChart publicos={stats?.publicos ?? 0} totales={stats?.eventos ?? 0} />
            )}
          </div>
        </div>
    </div>
  </div>
  );
};

export default Dashboard;