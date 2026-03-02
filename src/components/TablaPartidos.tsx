import { useNavigate } from "react-router-dom";
import type { Partido } from "../contexts/partido.tsx";
import type { Torneo } from "../contexts/torneo";
import { formatFecha } from "../helpers/convertirFechas.tsx";

export default function TablaPartidos({
  partidosPorFecha,
  tabKey,
  setTabKey,
  torneo,
  isCreator,
  setPartidoSeleccionado,
  setResultadoLocal,
  setResultadoVisitante,
  setResultadoModal,
  handleDeletePartido
}: {
  partidosPorFecha: Record<string, Partido[]>;
  tabKey: string;
  setTabKey: (key: string) => void;
  torneo: Torneo;
  isCreator: boolean;
  setPartidoSeleccionado: (partido: Partido | null) => void;
  setResultadoLocal: (resultado: string) => void;
  setResultadoVisitante: (resultado: string) => void;
  setResultadoModal: (show: boolean) => void;
  handleDeletePartido: (partidoId: number) => void;
}) {

  const navigate = useNavigate(); 

  return (
    <div className="section-container">
          <h2 className="section-title">Partidos</h2>
          {Object.keys(partidosPorFecha).length > 0 ? (
            <div className="tabs-container">
              <div className="tabs-header">
                {Object.entries(partidosPorFecha).map(([fecha], idx) => (
                  <button
                    key={fecha}
                    className={`tab-button ${tabKey === fecha ? 'active' : ''}`}
                    onClick={() => setTabKey(fecha)}
                  >
                    Fecha {idx + 1}
                    <span className="tab-date">
                      {formatFecha(fecha, 'es-AR')}
                    </span>
                  </button>
                ))}
              </div>
              <div className="tab-content">
                {Object.entries(partidosPorFecha).map(
                  ([fecha, partidos]) =>
                    tabKey === fecha && (
                      <div key={fecha}>
                        {/* Versión Desktop - Tabla */}
                        <div className="custom-table-container">
                          <table className="custom-table partidos-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Establecimiento</th>
                                <th>Local</th>
                                <th>Visitante</th>
                                <th>Resultado</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partidos.map((partido, i) => (
                                <tr key={partido.id}>
                                  <td>{i + 1}</td>
                                  <td>
                                    {formatFecha(partido.fecha)}
                                  </td>
                                  <td>{partido.hora}</td>
                                  <td>
                                    {partido.establecimiento?.nombre || '-'}
                                  </td>
                                  <td className="team-name-cell">
                                    {partido.equipoLocal.nombre}
                                  </td>
                                  <td className="team-name-cell">
                                    {partido.equipoVisitante.nombre}
                                  </td>
                                  <td>
                                    {partido.resultadoLocal != null &&
                                    partido.resultadoVisitante != null ? (
                                      <span className="resultado-badge">
                                        {partido.resultadoLocal} -{' '}
                                        {partido.resultadoVisitante}
                                      </span>
                                    ) : (
                                      <span className="resultado-pending">
                                        -
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="table-actions">
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/home/partido-detalle/${partido.id}`,
                                          )
                                        }
                                        className="btn-action btn-small"
                                      >
                                        Ver Partido
                                      </button>
                                      {isCreator && (
                                        <>
                                          <button
                                            onClick={() =>
                                              navigate(
                                                `/home/Participaciones/${partido.id}`,
                                              )
                                            }
                                            className="btn-action btn-small"
                                          >
                                            Participaciones
                                          </button>
                                          <button
                                            onClick={() =>
                                              navigate(
                                                `/home/torneos/${torneo.id}/EditarPartido/${partido.id}`,
                                              )
                                            }
                                            className="btn-action btn-small"
                                          >
                                            Editar
                                          </button>
                                          <button
                                            className="btn-action btn-small"
                                            onClick={() => {
                                              setPartidoSeleccionado(partido);
                                              setResultadoLocal(
                                                partido.resultadoLocal == null
                                                  ? ''
                                                  : String(
                                                      partido.resultadoLocal,
                                                    ),
                                              );
                                              setResultadoVisitante(
                                                partido.resultadoVisitante ==
                                                  null
                                                  ? ''
                                                  : String(
                                                      partido.resultadoVisitante,
                                                    ),
                                              );
                                              setResultadoModal(true);
                                            }}
                                          >
                                            Resultado
                                          </button>
                                          <button
                                            className="btn-action btn-delete btn-small"
                                            onClick={() =>
                                              handleDeletePartido(partido.id)
                                            }
                                          >
                                            Eliminar
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Versión Mobile - Cards */}
                        <div className="partidos-mobile-list">
                          {partidos.map((partido, i) => (
                            <div
                              key={partido.id}
                              className="partido-mobile-card"
                            >
                              <div className="partido-mobile-header">
                                <div className="partido-number-badge">
                                  {i + 1}
                                </div>
                                <div className="partido-date-time">
                                  <div className="partido-date">
                                    {formatFecha(partido.fecha)}
                                  </div>
                                  <div className="partido-time">
                                    {partido.hora}
                                  </div>
                                </div>
                              </div>

                              <div className="partido-teams-section">
                                <div className="partido-team-row">
                                  <div>
                                    <div className="partido-team-label">
                                      Local
                                    </div>
                                    <div className="partido-team-name">
                                      {partido.equipoLocal.nombre}
                                    </div>
                                  </div>
                                  {partido.resultadoLocal != null && (
                                    <div className="partido-score">
                                      {partido.resultadoLocal}
                                    </div>
                                  )}
                                </div>
                                <div className="partido-vs">vs</div>
                                <div className="partido-team-row">
                                  <div>
                                    <div className="partido-team-label">
                                      Visitante
                                    </div>
                                    <div className="partido-team-name">
                                      {partido.equipoVisitante.nombre}
                                    </div>
                                  </div>
                                  {partido.resultadoVisitante != null && (
                                    <div className="partido-score">
                                      {partido.resultadoVisitante}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {partido.establecimiento && (
                                <div className="partido-info-grid">
                                  <div className="partido-info-item">
                                    <span className="partido-info-label">
                                      Establecimiento
                                    </span>
                                    <span className="partido-info-value">
                                      {partido.establecimiento.nombre}
                                    </span>
                                  </div>
                                  <div className="partido-info-item">
                                    <span className="partido-info-label">
                                      Estado
                                    </span>
                                    {partido.resultadoLocal != null &&
                                    partido.resultadoVisitante != null ? (
                                      <span className="resultado-badge">
                                        Finalizado
                                      </span>
                                    ) : (
                                      <span className="partido-info-value">
                                        Pendiente
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="partido-mobile-actions">
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/home/partido-detalle/${partido.id}`,
                                    )
                                  }
                                  className="btn-action"
                                >
                                  Ver Partido
                                </button>
                                {isCreator && (
                                  <>
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/home/Participaciones/${partido.id}`,
                                        )
                                      }
                                      className="btn-action"
                                    >
                                      📋 Participaciones
                                    </button>
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/home/torneos/${torneo.id}/EditarPartido/${partido.id}`,
                                        )
                                      }
                                      className="btn-action"
                                    >
                                      ✏️ Editar Partido
                                    </button>
                                    <button
                                      className="btn-action"
                                      onClick={() => {
                                        setPartidoSeleccionado(partido);
                                        setResultadoLocal(
                                          partido.resultadoLocal == null
                                            ? ''
                                            : String(partido.resultadoLocal),
                                        );
                                        setResultadoVisitante(
                                          partido.resultadoVisitante == null
                                            ? ''
                                            : String(
                                                partido.resultadoVisitante,
                                              ),
                                        );
                                        setResultadoModal(true);
                                      }}
                                    >
                                      📊 Cargar Resultado
                                    </button>
                                    <button
                                      className="btn-action btn-delete"
                                      onClick={() =>
                                        handleDeletePartido(partido.id)
                                      }
                                    >
                                      🗑️ Eliminar
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">⚽</div>
              <p className="empty-state-text">
                No hay partidos programados aún
              </p>
            </div>
          )}
        </div>
  );
}