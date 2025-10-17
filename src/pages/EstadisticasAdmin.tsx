import { useState } from 'react';
import './Estadisticas.css';

const Estadisticas = () => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');

  // Datos mock - reemplazar con datos reales de tu API
  const estadisticas = {
    general: {
      torneosActivos: 12,
      torneosTotales: 45,
      participantesActivos: 234,
      participantesTotales: 567,
      equiposRegistrados: 89,
      partidosJugados: 156
    },
    deportesMasPopulares: [
      { nombre: 'Fútbol', torneos: 18, participantes: 198, porcentaje: 35 },
      { nombre: 'Básquetbol', torneos: 12, participantes: 132, porcentaje: 27 },
      { nombre: 'Voleibol', torneos: 8, participantes: 96, porcentaje: 18 },
      { nombre: 'Tenis', torneos: 5, participantes: 89, porcentaje: 12 },
      { nombre: 'Padel', torneos: 2, participantes: 52, porcentaje: 8 }
    ],
    tendenciaMensual: [
      { mes: 'Ene', torneos: 8, participantes: 120 },
      { mes: 'Feb', torneos: 10, participantes: 150 },
      { mes: 'Mar', torneos: 12, participantes: 180 },
      { mes: 'Abr', torneos: 15, participantes: 220 },
      { mes: 'May', torneos: 18, participantes: 280 },
      { mes: 'Jun', torneos: 20, participantes: 320 }
    ],
    topParticipantes: [
      { nombre: 'Juan Pérez', torneos: 8, victorias: 5, deporte: 'Fútbol' },
      { nombre: 'María García', torneos: 7, victorias: 6, deporte: 'Tenis' },
      { nombre: 'Carlos López', torneos: 6, victorias: 4, deporte: 'Básquetbol' },
      { nombre: 'Ana Martínez', torneos: 6, victorias: 3, deporte: 'Voleibol' },
      { nombre: 'Pedro Rodríguez', torneos: 5, victorias: 4, deporte: 'Padel' }
    ],
    distribucionTipos: {
      publicos: 45,
      privados: 13
    }
  };

  return (
    <div className="estadisticas-page">
      {/* Header */}
      <div className="page-header mb-4 pb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="mb-2">Estadísticas</h1>
            <p className="text-muted-custom mb-0">Análisis general de la plataforma</p>
          </div>
          <select 
            className="form-select periodo-select"
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          >
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="trimestre">Último trimestre</option>
            <option value="año">Último año</option>
          </select>
        </div>
      </div>

      {/* Stats Grid Principal */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="stat-card-large">
            <div className="stat-icon-large">🏆</div>
            <div>
              <p className="stat-label">Torneos Activos</p>
              <h3 className="stat-value">{estadisticas.general.torneosActivos}</h3>
              <p className="stat-subtext">de {estadisticas.general.torneosTotales} totales</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="stat-card-large">
            <div className="stat-icon-large">👥</div>
            <div>
              <p className="stat-label">Participantes Activos</p>
              <h3 className="stat-value">{estadisticas.general.participantesActivos}</h3>
              <p className="stat-subtext">de {estadisticas.general.participantesTotales} registrados</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="stat-card-large">
            <div className="stat-icon-large">⚽</div>
            <div>
              <p className="stat-label">Partidos Jugados</p>
              <h3 className="stat-value">{estadisticas.general.partidosJugados}</h3>
              <p className="stat-subtext">{estadisticas.general.equiposRegistrados} equipos registrados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deportes más populares y Distribución */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="stats-card h-100">
            <h2 className="card-title mb-4">Deportes Más Populares</h2>
            <div className="deportes-list">
              {estadisticas.deportesMasPopulares.map((deporte, index) => (
                <div key={index} className="deporte-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h4 className="deporte-nombre mb-1">{deporte.nombre}</h4>
                      <p className="deporte-info mb-0">
                        {deporte.torneos} torneos • {deporte.participantes} participantes
                      </p>
                    </div>
                    <span className="deporte-porcentaje">{deporte.porcentaje}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${deporte.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="stats-card h-100">
            <h2 className="card-title mb-4">Distribución de Torneos</h2>
            <div className="distribucion-container">
              <div className="donut-chart">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  <circle cx="50" cy="50" r="40" className="donut-ring"></circle>
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    className="donut-segment"
                    style={{
                      strokeDasharray: `${(estadisticas.distribucionTipos.publicos / (estadisticas.distribucionTipos.publicos + estadisticas.distribucionTipos.privados)) * 251} 251`
                    }}
                  ></circle>
                </svg>
                <div className="donut-center">
                  <span className="donut-total">{estadisticas.distribucionTipos.publicos + estadisticas.distribucionTipos.privados}</span>
                  <span className="donut-label">Total</span>
                </div>
              </div>
              <div className="distribucion-legend">
                <div className="legend-item">
                  <span className="legend-dot legend-dot-publico"></span>
                  <span className="legend-text">Públicos</span>
                  <span className="legend-value">{estadisticas.distribucionTipos.publicos}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot legend-dot-privado"></span>
                  <span className="legend-text">Privados</span>
                  <span className="legend-value">{estadisticas.distribucionTipos.privados}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tendencia y Top Participantes */}
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="stats-card h-100">
            <h2 className="card-title mb-4">Tendencia Mensual</h2>
            <div className="chart-container">
              {estadisticas.tendenciaMensual.map((dato, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bars">
                    <div 
                      className="chart-bar chart-bar-torneos"
                      style={{ height: `${(dato.torneos / 20) * 100}%` }}
                      title={`${dato.torneos} torneos`}
                    ></div>
                    <div 
                      className="chart-bar chart-bar-participantes"
                      style={{ height: `${(dato.participantes / 320) * 100}%` }}
                      title={`${dato.participantes} participantes`}
                    ></div>
                  </div>
                  <span className="chart-label">{dato.mes}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: 'var(--primary)' }}></span>
                <span className="legend-text">Torneos</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: 'var(--accent)' }}></span>
                <span className="legend-text">Participantes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="stats-card h-100">
            <h2 className="card-title mb-4">Top Participantes</h2>
            <div className="top-list">
              {estadisticas.topParticipantes.map((participante, index) => (
                <div key={index} className="top-item">
                  <div className="top-rank">{index + 1}</div>
                  <div className="flex-grow-1">
                    <h4 className="top-nombre mb-1">{participante.nombre}</h4>
                    <p className="top-info mb-0">
                      {participante.deporte} • {participante.torneos} torneos • {participante.victorias} victorias
                    </p>
                  </div>
                  <div className="top-badge">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;