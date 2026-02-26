import { useState } from 'react';
import { useMisEquipos } from '../hooks/useEquipos.tsx';
import { useNavigate } from 'react-router-dom';
import './cssComponentes/TorneosPerfil.css';
            
type TorneosPerfilProps = {
  equipos: ReturnType<typeof useMisEquipos>['equipos'];
  loadingEquipos: ReturnType<typeof useMisEquipos>['loadingEquipos'];
  errorEquipos: ReturnType<typeof useMisEquipos>['errorEquipos'];
};

const TorneosPerfil = ({ equipos, loadingEquipos, errorEquipos }: TorneosPerfilProps) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const navigate = useNavigate();

  const torneosBase = equipos
    .map(equipo => {
      const torneo = equipo.evento;
      if (!torneo) return null;

      return {
        id: torneo.id,
        nombre: torneo.nombre,
        deporte: torneo.deporte.nombre,
        fechaIniIns: torneo.fechaInicioInscripcion,
        fechaFinIns: torneo.fechaFinInscripcion,
        fechaInicio: torneo.fechaInicioEvento,
        fechaFin: torneo.fechaFinEvento,
        estado: (() => {
          const ahora = new Date();
          const inicioEvento = new Date(torneo.fechaInicioEvento);
          const finEvento = new Date(torneo.fechaFinEvento);
          const finInscripcion = new Date(torneo.fechaFinInscripcion);
          if (ahora < finInscripcion) return 'inscripcion';
          if (ahora < inicioEvento) return 'pendiente';
          if (ahora > finEvento) return 'finalizado';
          return 'en_curso';
        })(),
        equipo: equipo.nombre,
        partidosJugados: torneo.partidos?.filter(p => 
          p.equipoLocal.id === equipo.id || p.equipoVisitante.id === equipo.id
        ).length || 0,
        partidosGanados: torneo.partidos?.filter(p => {
          const esLocal = p.equipoLocal.id === equipo.id;
          const esVisitante = p.equipoVisitante.id === equipo.id;
          if (!esLocal && !esVisitante) return false;
          if (p.resultadoLocal === null || p.resultadoVisitante === null) return false;
          if (esLocal) return p.resultadoLocal > p.resultadoVisitante;
          if (esVisitante) return p.resultadoVisitante > p.resultadoLocal;
          return false;
        }).length || 0,
      };
    })
    .filter((torneo): torneo is NonNullable<typeof torneo> => torneo !== null);

  const torneosFiltrados = filtroEstado === 'todos' ? torneosBase : torneosBase.filter(t => t.estado === filtroEstado);

  return (
    <div className="torneos-section">
      {loadingEquipos ? (
        <div className="stat-card d-flex align-items-center justify-content-center" style={{ minHeight: 120 }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : errorEquipos ? (
        <div className="alert-danger-custom" role="alert">
          ⚠️ No se pudieron cargar los torneos: {errorEquipos}
        </div>
      ) : (
      <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="torneos-title mb-0">Mis Torneos</h3>
        <select 
          className="filtro-select-small"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="en_curso">En curso</option>
          <option value="finalizado">Finalizados</option>
          <option value="inscripcion">Inscripción</option>
        </select>
      </div>

      <div className="torneos-list">
        {torneosFiltrados.length === 0 ? (
          <div className="empty-state text-center py-5">
            <p className="text-muted-light mb-0">No hay torneos para mostrar</p>
          </div>
        ) : (
          torneosFiltrados.map(torneo => (
            <div key={torneo.id} className="torneo-item" role="button" onClick={() => navigate(`/home/torneos/${torneo.id}`)}>
              <div className="torneo-header">
                <div>
                  <h4 className="torneo-nombre">{torneo.nombre}</h4>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="torneo-deporte">⚽ {torneo.deporte}</span>
                    <span className={`badge-estado ${torneo.estado === 'en_curso' ? 'badge-en-curso' : torneo.estado === 'finalizado' ? 'badge-finalizado' : 'badge-inscripcion'}`}>
                      {torneo.estado}
                    </span>
                  </div>
                </div>
              </div>

              <div className="torneo-details">
                <div className="torneo-detail-item">
                  <span className="detail-label">Equipo:</span>
                  <span className="detail-value">{torneo.equipo}</span>
                </div>
                <div className="torneo-detail-item">
                  <span className="detail-label">Fechas:</span>
                  <span className="detail-value">
                    {new Date(torneo.fechaInicio).toLocaleDateString()} - {new Date(torneo.fechaFin).toLocaleDateString()}
                  </span>
                </div>
                {torneo.partidosJugados > 0 && (
                  <div className="torneo-detail-item">
                    <span className="detail-label">Resultados:</span>
                    <span className="detail-value">
                      {torneo.partidosGanados} Victorias - {torneo.partidosJugados - torneo.partidosGanados} Derrotas
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      </div>
      )}
    </div>
  );
};

export default TorneosPerfil;