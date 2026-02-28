import { useParticipacionesporUsuario } from '../hooks/useParticipaciones';
import { useState, useMemo } from 'react';
import './cssComponentes/ParticipacionesPerfil.css';

type ParticipacionBase = {
  id: number;
  idEvento: number;
  nombreTorneo: string;
  deporte: string;
  equipolocal: string;
  equipovisitante: string;
  puntos: number;
  fecha: string;
  hora: string;
  minutosjugados: number;
  faltas: number;
};

type ParticipacionesPerfilProps = {
  participaciones: ReturnType<
    typeof useParticipacionesporUsuario
  >['participaciones'];
  loading: ReturnType<typeof useParticipacionesporUsuario>['loading'];
  error: ReturnType<typeof useParticipacionesporUsuario>['error'];
};

const ParticipacionesPerfil = ({
  participaciones,
  loading,
  error,
}: ParticipacionesPerfilProps) => {
  const [busquedaEvento, setBusquedaEvento] = useState<string>('');
  const [filtroDeporte, setFiltroDeporte] = useState<string>('todos');

  const participacionesbase = participaciones
    .map((p) => {
      const torneo = p.partido.evento;
      if (!torneo) return null;
      return {
        id: p.id,
        idEvento: torneo.id,
        nombreTorneo: torneo.nombre,
        deporte: torneo.deporte.nombre,
        equipolocal: p.partido.equipoLocal.nombre,
        equipovisitante: p.partido.equipoVisitante.nombre,
        puntos: p.puntos,
        fecha: String(p.partido.fecha),
        hora: p.partido.hora,
        minutosjugados: p.minutosjugados,
        faltas: p.faltas,
      };
    })
    .filter((p): p is ParticipacionBase => p !== null);

  const deportesUnicos = useMemo(() => {
    const deportes = new Set<string>();
    participacionesbase.forEach((p) => {
      deportes.add(p.deporte);
    });
    return Array.from(deportes);
  }, [participacionesbase]);

  const participacionesFiltradas = useMemo(() => {
    let filtradas = participacionesbase;

    if (busquedaEvento.trim() !== '') {
      filtradas = filtradas.filter((p) =>
        p.nombreTorneo.toLowerCase().includes(busquedaEvento.toLowerCase()),
      );
    }

    if (filtroDeporte !== 'todos') {
      filtradas = filtradas.filter((p) => p.deporte === filtroDeporte);
    }

    return filtradas;
  }, [participacionesbase, busquedaEvento, filtroDeporte]);

  const participacionesPorEvento = useMemo(() => {
    const grupos = new Map<
      number,
      {
        nombreEvento: string;
        deporte: string;
        participaciones: ParticipacionBase[];
      }
    >();

    participacionesFiltradas.forEach((p) => {
      const key = p.idEvento;
      if (!grupos.has(key)) {
        grupos.set(key, {
          nombreEvento: p.nombreTorneo,
          deporte: p.deporte,
          participaciones: [],
        });
      }
      grupos.get(key)!.participaciones.push(p);
    });

    return Array.from(grupos.values());
  }, [participacionesFiltradas]);

  if (loading) {
    return <div className="text-center p-4">Cargando participaciones...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="participaciones-section">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="participaciones-title mb-0">Mis Participaciones</h3>
        <div className="filtros-participaciones">
          <input
            type="text"
            className="filtro-input-busqueda"
            placeholder="Buscar por nombre de evento..."
            value={busquedaEvento}
            onChange={(e) => setBusquedaEvento(e.target.value)}
          />
          <select
            className="filtro-select-small"
            value={filtroDeporte}
            onChange={(e) => setFiltroDeporte(e.target.value)}
          >
            <option value="todos">Todos los deportes</option>
            {deportesUnicos.map((deporte) => (
              <option key={deporte} value={deporte}>
                {deporte}
              </option>
            ))}
          </select>
        </div>
      </div>

      {participacionesFiltradas.length > 0 && (
        <p className="resultado-contador">
          Mostrando {participacionesFiltradas.length} participación(es) en{' '}
          {participacionesPorEvento.length} evento(s)
        </p>
      )}

      <div className="participaciones-list">
        {participacionesPorEvento.length === 0 ? (
          <div className="empty-state text-center py-5">
            <p className="text-muted-light mb-0">
              No hay participaciones para mostrar
            </p>
          </div>
        ) : (
          participacionesPorEvento.map((evento, idx) => (
            <div key={idx} className="participacion-item">
              <div className="participacion-header">
                <div>
                  <h4 className="participacion-evento">
                    {evento.nombreEvento}
                  </h4>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="participacion-deporte">
                      ⚽ {evento.deporte}
                    </span>
                    <span className="badge-estado badge-en-curso">
                      {evento.participaciones.length} participación(es)
                    </span>
                  </div>
                </div>
              </div>

              <div className="participaciones-evento-list">
                {evento.participaciones.map((p) => (
                  <div key={p.id} className="participacion-card">
                    <div className="partido-info">
                      <div className="partido-equipos">
                        <span className="equipo-nombre">
                          {p.equipolocal || 'Equipo Local'}
                        </span>
                        <span className="vs-separator">vs</span>
                        <span className="equipo-nombre">
                          {p.equipovisitante || 'Equipo Visitante'}
                        </span>
                      </div>
                      <div className="partido-fecha">
                        📅 {new Date(p.fecha).toLocaleDateString()} - ⏰{' '}
                        {p.hora}
                      </div>
                    </div>

                    <div className="participacion-stats">
                      <div className="stat-item">
                        <span className="stat-label">Puntos</span>
                        <span className="stat-value stat-puntos">
                          {p.puntos}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Minutos</span>
                        <span className="stat-value">{p.minutosjugados}'</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Faltas</span>
                        <span className="stat-value">{p.faltas}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParticipacionesPerfil;
