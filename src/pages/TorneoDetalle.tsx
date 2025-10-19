import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import type { Equipo, Partido, Torneo, Usuario } from '../types';
import { Row, Col } from 'react-bootstrap';
import apiAxios from '../helpers/api';
import { useAuth } from '../hooks/useAuth';
import './TorneoDetalle.css';

export default function TorneoDetalle() {
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Equipo | null>(null);
  const [enrollPassword, setEnrollPassword] = useState('');
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [resultadoModal, setResultadoModal] = useState(false);
  const [resultadoLocal, setResultadoLocal] = useState<string>('');
  const [resultadoVisitante, setResultadoVisitante] = useState<string>('');
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);
  const [tabKey, setTabKey] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTorneo();
  }, [id]);

  const fetchTorneo = async () => {
    if (!id) return;
    try {
      const res = await apiAxios.get(`/eventos/${id}`);
      setTorneo(res.data.data);
      // Set primera fecha como tab activo
      const partidos = res.data.data.partidos || [];
      if (partidos.length > 0 && !tabKey) {
        const firstDate = new Date(partidos[0].fecha).toDateString();
        setTabKey(firstDate);
      }
    } catch (err) {
      console.error('Error fetching torneo:', err);
    }
  };

  const userIsMember = (): boolean => {
    if (!user || !torneo?.equipos) return false;
    const userIdStr = String(user.id);
    return torneo.equipos.some((e) => {
      const miembros = e.miembros ?? [];
      return miembros.some((m) => {
        const memberId = m.id;
        return memberId !== undefined && String(memberId) === userIdStr;
      });
    });
  };

  const isCaptain = (equipo: Equipo): boolean => {
    if (!user) return false;
    const capitan = equipo.capitan as Usuario;
    return capitan !== undefined && String(capitan.id) === String(user.id);
  };

  const isMember = (equipo: Equipo): boolean => {
    if (!user) return false;
    const miembros = (equipo.miembros as Usuario[]) ?? [];
    const userIdStr = String(user.id);
    return miembros.some((m) => {
      const memberId = m.id;
      return memberId !== undefined && String(memberId) === userIdStr;
    });
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (!confirm('¿Estás seguro de eliminar este equipo?')) return;
    try {
      await apiAxios.delete(`/equipos/${teamId}`);
      fetchTorneo();
    } catch (err) {
      console.error('Error eliminando equipo:', err);
    }
  };

  const handleInscribe = async () => {
    if (!selectedTeam) return;
    if (!selectedTeam.esPublico && enrollPassword.trim() === '') {
      setEnrollError('La contraseña es obligatoria para este equipo');
      return;
    }
    if (!selectedTeam.esPublico && enrollPassword !== selectedTeam.contraseña) {
      setEnrollError('La contraseña es incorrecta');
      return;
    }
    setEnrollError(null);
    setEnrolling(true);
    try {
      const userId = Number(user?.id);
      const body: Record<string, unknown> = { usuarioId: userId };
      if (!selectedTeam.esPublico) body.contraseña = enrollPassword;
      await apiAxios.post(`/equipos/${selectedTeam.id}/miembros`, body);
      await fetchTorneo();
      setShowEnrollModal(false);
    } catch (err: unknown) {
      console.error('Error al inscribirse:', err);
      let message = 'Error al inscribirse';
      if (typeof err === 'object' && err !== null) {
        const errObj = err as Record<string, unknown>;
        if ('response' in errObj && typeof errObj.response === 'object' && errObj.response !== null) {
          const resp = errObj.response as Record<string, unknown>;
          if ('data' in resp && typeof resp.data === 'object' && resp.data !== null) {
            const data = resp.data as Record<string, unknown>;
            if ('message' in data) message = String(data.message);
          }
        } else if ('message' in errObj) {
          message = String((errObj as { message: unknown }).message);
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      setEnrollError(message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleCargarResultado = async () => {
    if (!partidoSeleccionado) return;
    try {
      await apiAxios.put(`/partidos/${partidoSeleccionado.id}`, {
        resultadoLocal: resultadoLocal === '' ? null : Number(resultadoLocal),
        resultadoVisitante: resultadoVisitante === '' ? null : Number(resultadoVisitante),
      });
      setResultadoModal(false);
      setResultadoLocal('');
      setResultadoVisitante('');
      setPartidoSeleccionado(null);
      await fetchTorneo();
    } catch (err) {
      console.error('Error al cargar resultado:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este torneo? Esta acción no se puede deshacer.')) return;
    if (!id) return;
    try {
      await apiAxios.delete(`/eventos/${id}`);
      navigate('/home/torneos');
    } catch (error) {
      console.error('Error eliminando torneo:', error);
    }
  };

  const handleDeletePartido = async (partidoId: number) => {
    if (!confirm('¿Estás seguro de eliminar este partido?')) return;
    try {
      await apiAxios.delete(`/partidos/${partidoId}`);
      fetchTorneo();
    } catch (error) {
      console.error('Error eliminando partido:', error);
    }
  };

  const partidosOrdenados = [...(torneo?.partidos || [])].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const partidosPorFecha = partidosOrdenados.reduce((acc, partido) => {
    const fechaKey = new Date(partido.fecha).toDateString();
    if (!acc[fechaKey]) acc[fechaKey] = [];
    acc[fechaKey].push(partido);
    return acc;
  }, {} as Record<string, Partido[]>);

  const isCreator = Number(user?.id) === torneo?.creador;

  if (!torneo) return (
    <div className="torneo-detalle-container">
      <div className="loading-state">Cargando torneo...</div>
    </div>
  );

  return (
    <div className="torneo-detalle-container">
      <div className="torneo-detalle-inner">
        {/* Header con título y acciones */}
        <div className="detalle-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="detalle-title">{torneo.nombre}</h1>
              <span className="detalle-sport-badge">{torneo.deporte.nombre}</span>
            </div>
            {isCreator && (
              <div className="header-actions">
                <button 
                  className="btn-header-action btn-edit"
                  onClick={() => navigate(`/home/torneos/${id}/editar`)}
                >
                  Editar
                </button>
                <button 
                  className="btn-header-action btn-delete-header"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
          <p className="detalle-description pb-4">{torneo.descripcion}</p>
          <Row>
             <Col>
               <p>
                 <strong>Duracion:</strong>{' '}
                 {new Date(torneo.fechaInicioEvento).toLocaleDateString()} {' - '}{' '}
                 {new Date(torneo.fechaFinEvento).toLocaleDateString()}
               </p>
             </Col>
             <Col>
               <p>
                 <strong>Inscripciones:</strong>{' '}
                 {new Date(torneo.fechaInicioInscripcion).toLocaleDateString()}{' '}
                 {' - '} {new Date(torneo.fechaFinInscripcion).toLocaleDateString()}
               </p>
             </Col>
           </Row>
           <Row>
             <Col>
               <p>
                 <strong>Localidad:</strong> {torneo.localidad.nombre}
               </p>
             </Col>
             <Col>
               <p>
                 <strong>Código:</strong> {torneo.codigo}
               </p>
             </Col>
           </Row>
        </div>

        {/* Equipos Info y Status */}
        <div className="equipos-status-section">
          <div className="equipos-count-card">
            <span className="equipos-count-text">
              Equipos inscritos: <strong>{torneo.equipos?.length || 0}</strong> / {torneo.cantEquiposMax}
            </span>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((torneo.equipos?.length || 0) / torneo.cantEquiposMax) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons-section">
          {isCreator && (
            <button onClick={() => navigate(`/home/torneos/${torneo.id}/crearEstablecimiento`)} className="action-btn btn-secondary-action">
              Crear Establecimientos
            </button>
          )}
          {!userIsMember() ? (
            <button onClick={() => navigate(`/home/torneos/${torneo.id}/crear-equipo`)} className="action-btn btn-primary-action">
              Inscribir Equipo
            </button>
          ) : (
            <button className="action-btn btn-disabled" disabled>
              ✓ Equipo Inscrito
            </button>
          )}
          {isCreator && (
            <button onClick={() => navigate(`/home/torneos/${torneo.id}/crearPartido`)} className="action-btn btn-secondary-action">
              Crear Partidos
            </button>
          )}
        </div>

        {/* Tabla de Equipos */}
        <div className="section-container">
          <h2 className="section-title">Equipos Participantes</h2>
          
          {/* Versión Desktop - Tabla */}
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipo</th>
                  <th>Jugadores</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {torneo.equipos && torneo.equipos.length > 0 ? (
                  torneo.equipos.map((equipo: Equipo, idx: number) => (
                    <tr key={equipo.id}>
                      <td>{idx + 1}</td>
                      <td className="team-name-cell">{equipo.nombre}</td>
                      <td>
                        <span className="jugadores-badge">
                          {equipo.miembros?.length ?? 0}/{torneo.deporte?.cantMaxJugadores ?? '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-custom ${equipo.esPublico ? 'badge-equipo' : 'badge-individual'}`}>
                          {equipo.esPublico ? 'Público' : 'Privado'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          {!userIsMember() ? (
                            <button
                              className="btn-action"
                              onClick={() => {
                                setSelectedTeam(equipo);
                                setEnrollPassword('');
                                setEnrollError(null);
                                setShowEnrollModal(true);
                              }}
                            >
                              Unirse
                            </button>
                          ) : isCaptain(equipo) ? (
                            <>
                              <button
                                className="btn-action"
                                onClick={() => navigate(`/home/equipos/${equipo.id}/editar`)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn-action btn-delete"
                                onClick={() => handleDeleteTeam(equipo.id)}
                              >
                                Eliminar
                              </button>
                              <button
                                className="btn-action"
                                onClick={() => navigate(`/home/equipos/${equipo.id}`)}
                              >
                                Ver equipo
                              </button>
                            </>
                          ) : isMember(equipo) ? (
                            <button
                              className="btn-action"
                              onClick={() => navigate(`/home/equipos/${equipo.id}`)}
                            >
                              Ver equipo
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="empty-state-cell">
                      No hay equipos inscritos aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Versión Mobile - Cards */}
          <div className="equipos-mobile-list">
            {torneo.equipos && torneo.equipos.length > 0 ? (
              torneo.equipos.map((equipo: Equipo, idx: number) => (
                <div key={equipo.id} className="equipo-mobile-card">
                  <div className="equipo-mobile-header">
                    <div className="equipo-mobile-number">{idx + 1}</div>
                    <div className="equipo-mobile-name">{equipo.nombre}</div>
                  </div>
                  <div className="equipo-mobile-info">
                    <div className="equipo-info-row">
                      <span className="equipo-info-label">Jugadores</span>
                      <span className="jugadores-badge">
                        {equipo.miembros?.length ?? 0}/{torneo.deporte?.cantMaxJugadores ?? '-'}
                      </span>
                    </div>
                    <div className="equipo-info-row">
                      <span className="equipo-info-label">Tipo</span>
                      <span className={`badge-custom ${equipo.esPublico ? 'badge-equipo' : 'badge-individual'}`}>
                        {equipo.esPublico ? 'Público' : 'Privado'}
                      </span>
                    </div>
                  </div>
                  <div className="equipo-mobile-actions">
                    {!userIsMember() ? (
                      <button
                        className="btn-action"
                        onClick={() => {
                          setSelectedTeam(equipo);
                          setEnrollPassword('');
                          setEnrollError(null);
                          setShowEnrollModal(true);
                        }}
                      >
                        Unirse
                      </button>
                    ) : isCaptain(equipo) ? (
                      <>
                        <button
                          className="btn-action"
                          onClick={() => navigate(`/home/equipos/${equipo.id}/editar`)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-action"
                          onClick={() => navigate(`/home/equipos/${equipo.id}`)}
                        >
                          Ver equipo
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteTeam(equipo.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    ) : isMember(equipo) ? (
                      <button
                        className="btn-action"
                        onClick={() => navigate(`/home/equipos/${equipo.id}`)}
                      >
                        Ver equipo
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <p className="empty-state-text">No hay equipos inscritos aún</p>
              </div>
            )}
          </div>
        </div>

        {/* Partidos por Fecha */}
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
                    <span className="tab-date">{new Date(fecha).toLocaleDateString('es-AR')}</span>
                  </button>
                ))}
              </div>
              <div className="tab-content">
                {Object.entries(partidosPorFecha).map(([fecha, partidos]) => (
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
                                <td>{new Date(partido.fecha).toLocaleDateString()}</td>
                                <td>{partido.hora}</td>
                                <td>{partido.establecimiento?.nombre || '-'}</td>
                                <td className="team-name-cell">{partido.equipoLocal.nombre}</td>
                                <td className="team-name-cell">{partido.equipoVisitante.nombre}</td>
                                <td>
                                  {partido.resultadoLocal != null && partido.resultadoVisitante != null ? (
                                    <span className="resultado-badge">
                                      {partido.resultadoLocal} - {partido.resultadoVisitante}
                                    </span>
                                  ) : (
                                    <span className="resultado-pending">-</span>
                                  )}
                                </td>
                                <td>
                                  <div className="table-actions">
                                    <button onClick={() => navigate(`/home/partido-detalle`)} className="btn-action btn-small">
                                      Ver Partido
                                    </button>
                                    {isCreator && (
                                      <>
                                        <button onClick={() => navigate(`/home/Participaciones/${partido.id}`)} className="btn-action btn-small">
                                          Participaciones
                                        </button>
                                        <button onClick={() => navigate(`/home/torneos/${torneo.id}/EditarPartido/${partido.id}`)} className="btn-action btn-small">
                                          Editar
                                        </button>
                                        <button
                                          className="btn-action btn-small"
                                          onClick={() => {
                                            setPartidoSeleccionado(partido);
                                            setResultadoLocal(partido.resultadoLocal == null ? '' : String(partido.resultadoLocal));
                                            setResultadoVisitante(partido.resultadoVisitante == null ? '' : String(partido.resultadoVisitante));
                                            setResultadoModal(true);
                                          }}
                                        >
                                          Resultado
                                        </button>
                                        <button
                                          className="btn-action btn-delete btn-small"
                                          onClick={() => handleDeletePartido(partido.id)}
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
                          <div key={partido.id} className="partido-mobile-card">
                            <div className="partido-mobile-header">
                              <div className="partido-number-badge">{i + 1}</div>
                              <div className="partido-date-time">
                                <div className="partido-date">{new Date(partido.fecha).toLocaleDateString()}</div>
                                <div className="partido-time">{partido.hora}</div>
                              </div>
                            </div>

                            <div className="partido-teams-section">
                              <div className="partido-team-row">
                                <div>
                                  <div className="partido-team-label">Local</div>
                                  <div className="partido-team-name">{partido.equipoLocal.nombre}</div>
                                </div>
                                {partido.resultadoLocal != null && (
                                  <div className="partido-score">{partido.resultadoLocal}</div>
                                )}
                              </div>
                              <div className="partido-vs">vs</div>
                              <div className="partido-team-row">
                                <div>
                                  <div className="partido-team-label">Visitante</div>
                                  <div className="partido-team-name">{partido.equipoVisitante.nombre}</div>
                                </div>
                                {partido.resultadoVisitante != null && (
                                  <div className="partido-score">{partido.resultadoVisitante}</div>
                                )}
                              </div>
                            </div>

                            {partido.establecimiento && (
                              <div className="partido-info-grid">
                                <div className="partido-info-item">
                                  <span className="partido-info-label">Establecimiento</span>
                                  <span className="partido-info-value">{partido.establecimiento.nombre}</span>
                                </div>
                                <div className="partido-info-item">
                                  <span className="partido-info-label">Estado</span>
                                  {partido.resultadoLocal != null && partido.resultadoVisitante != null ? (
                                    <span className="resultado-badge">Finalizado</span>
                                  ) : (
                                    <span className="partido-info-value">Pendiente</span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="partido-mobile-actions">
                              <button onClick={() => navigate(`/home/partido-detalle`)} className="btn-action">
                                Ver Partido
                              </button>
                              {isCreator && (
                                <>
                                  <button onClick={() => navigate(`/home/Participaciones/${partido.id}`)} className="btn-action">
                                    📋 Participaciones
                                  </button>
                                  <button onClick={() => navigate(`/home/torneos/${torneo.id}/EditarPartido/${partido.id}`)} className="btn-action">
                                    ✏️ Editar Partido
                                  </button>
                                  <button
                                    className="btn-action"
                                    onClick={() => {
                                      setPartidoSeleccionado(partido);
                                      setResultadoLocal(partido.resultadoLocal == null ? '' : String(partido.resultadoLocal));
                                      setResultadoVisitante(partido.resultadoVisitante == null ? '' : String(partido.resultadoVisitante));
                                      setResultadoModal(true);
                                    }}
                                  >
                                    📊 Cargar Resultado
                                  </button>
                                  <button
                                    className="btn-action btn-delete"
                                    onClick={() => handleDeletePartido(partido.id)}
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
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">⚽</div>
              <p className="empty-state-text">No hay partidos programados aún</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Inscripción */}
      {showEnrollModal && (
        <div className="modal-custom-overlay" onClick={() => setShowEnrollModal(false)}>
          <div className="modal-custom-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-custom-header">
              <h2 className="modal-custom-title">
                Inscribirse en {selectedTeam?.nombre}
              </h2>
              <button className="modal-custom-close" onClick={() => setShowEnrollModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-custom-body">
              {enrollError && <div className="alert-danger-custom">{enrollError}</div>}
              {selectedTeam && !selectedTeam.esPublico ? (
                <div className="modal-form-group">
                  <label className="modal-form-label">Contraseña del equipo</label>
                  <input
                    type="password"
                    className="modal-form-input"
                    value={enrollPassword}
                    onChange={(e) => setEnrollPassword(e.target.value)}
                    placeholder="Ingrese la contraseña"
                    autoFocus
                  />
                </div>
              ) : (
                <p className="modal-info-text">Este equipo es público. Confirme para inscribirse.</p>
              )}
            </div>
            <div className="modal-custom-footer">
              <button
                className="btn-cancel-custom"
                onClick={() => setShowEnrollModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-save-custom"
                onClick={handleInscribe}
                disabled={enrolling}
              >
                {enrolling ? 'Inscribiendo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resultado */}
      {resultadoModal && partidoSeleccionado && (
        <div className="modal-custom-overlay" onClick={() => setResultadoModal(false)}>
          <div className="modal-custom-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-custom-header">
              <h2 className="modal-custom-title">
                Resultado del Partido
              </h2>
              <button className="modal-custom-close" onClick={() => setResultadoModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-custom-body">
              <p className="modal-info-text">
                {partidoSeleccionado.equipoLocal.nombre} vs {partidoSeleccionado.equipoVisitante.nombre}
              </p>
              <div className="resultado-inputs-grid">
                <div className="modal-form-group">
                  <label className="modal-form-label">Goles Local</label>
                  <input
                    type="number"
                    min="0"
                    className="modal-form-input"
                    value={resultadoLocal}
                    onChange={(e) => setResultadoLocal(e.target.value)}
                    placeholder="0"
                    autoFocus
                  />
                </div>
                <div className="modal-form-group">
                  <label className="modal-form-label">Goles Visitante</label>
                  <input
                    type="number"
                    min="0"
                    className="modal-form-input"
                    value={resultadoVisitante}
                    onChange={(e) => setResultadoVisitante(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="modal-custom-footer">
              <button className="btn-cancel-custom" onClick={() => setResultadoModal(false)}>
                Cancelar
              </button>
              <button className="btn-save-custom" onClick={handleCargarResultado}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// dejo el viejo por las dudas



// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router';
// import { useNavigate, Link } from 'react-router-dom';
// import type { Equipo, Partido, Torneo, Usuario } from '../types';
// import apiAxios from '../helpers/api';
// import {
//   Button,
//   Col,
//   Row,
//   Table,
//   Modal,
//   Form,
//   Tabs,
//   Tab,
// } from 'react-bootstrap';
// import { useAuth } from '../hooks/useAuth';

// export default function TorneoDetalle() {
//   const [torneo, setTorneo] = useState<Torneo | null>(null);
//   const [showEnrollModal, setShowEnrollModal] = useState(false);
//   const [selectedTeam, setSelectedTeam] = useState<Equipo | null>(null);
//   const [enrollPassword, setEnrollPassword] = useState('');
//   const [enrollError, setEnrollError] = useState<string | null>(null);
//   const [enrolling, setEnrolling] = useState(false);
//   const [resultadoModal, setResultadoModal] = useState(false);
//   const [resultadoLocal, setResultadoLocal] = useState<string>('');
//   const [resultadoVisitante, setResultadoVisitante] = useState<string>('');
//   const [partidoSeleccionado, setPartidoSeleccionado] =
//     useState<Partido | null>(null);
//   const [tabKey, setTabKey] = useState<string>('');
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!id) return;
//     apiAxios.get(`/eventos/${id}`).then((res) => {
//       setTorneo(res.data.data);
//     });
//   }, [id]);

//   const fetchTorneo = async () => {
//     if (!id) return;
//     try {
//       const res = await apiAxios.get(`/eventos/${id}`);
//       setTorneo(res.data.data);
//     } catch (err) {
//       console.error('Error fetching torneo:', err);
//     }
//   };

//   const userIsMember = (): boolean => {
//     if (!user || !torneo?.equipos) return false;
//     const userIdStr = String(user.id);
//     return torneo.equipos.some((e) => {
//       const miembros = e.miembros ?? [];
//       return miembros.some((m) => {
//         const memberId = m.id;
//         return memberId !== undefined && String(memberId) === userIdStr;
//       });
//     });
//   };

//   const isCaptain = (equipo: Equipo): boolean => {
//     if (!user) return false;
//     const capitan = equipo.capitan as Usuario;
//     return capitan !== undefined && String(capitan.id) === String(user.id);
//   };

//   const isMember = (equipo: Equipo): boolean => {
//     if (!user) return false;
//     const miembros = (equipo.miembros as Usuario[]) ?? [];
//     const userIdStr = String(user.id);
//     return miembros.some((m) => {
//       const memberId = m.id;
//       return memberId !== undefined && String(memberId) === userIdStr;
//     });
//   };

//   const handleDeleteTeam = async (teamId: number) => {
//     try {
//       await apiAxios.delete(`/equipos/${teamId}`);
//       fetchTorneo();
//     } catch (err) {
//       console.error('Error eliminando equipo:', err);
//     }
//   };
//   const handleInscribe = async () => {
//     if (!selectedTeam) return;
//     if (!selectedTeam.esPublico && enrollPassword.trim() === '') {
//       setEnrollError('La contraseña es obligatoria para este equipo');
//       return;
//     }

//     if (!selectedTeam.esPublico && enrollPassword !== selectedTeam.contraseña) {
//       setEnrollError('La contraseña es incorrecta');
//       return;
//     }

//     setEnrollError(null);
//     setEnrolling(true);

//     try {
//       const userId = Number(user?.id);
//       const body: Record<string, unknown> = { usuarioId: userId };
//       if (!selectedTeam.esPublico) body.contraseña = enrollPassword;
//       await apiAxios.post(`/equipos/${selectedTeam.id}/miembros`, body);
//       await fetchTorneo();
//       setShowEnrollModal(false);
//     } catch (err: unknown) {
//       console.error('Error al inscribirse:', err);
//       let message = 'Error al inscribirse';
//       if (typeof err === 'object' && err !== null) {
//         const errObj = err as Record<string, unknown>;
//         if (
//           'response' in errObj &&
//           typeof errObj.response === 'object' &&
//           errObj.response !== null
//         ) {
//           const resp = errObj.response as Record<string, unknown>;
//           if (
//             'data' in resp &&
//             typeof resp.data === 'object' &&
//             resp.data !== null
//           ) {
//             const data = resp.data as Record<string, unknown>;
//             if ('message' in data) message = String(data.message);
//           }
//         } else if ('message' in errObj) {
//           message = String((errObj as { message: unknown }).message);
//         }
//       } else if (typeof err === 'string') {
//         message = err;
//       }
//       setEnrollError(message);
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   const handleCargarResultado = async () => {
//     if (!partidoSeleccionado) return;
//     try {
//       await apiAxios.put(`/partidos/${partidoSeleccionado.id}`, {
//         resultadoLocal: resultadoLocal === '' ? null : Number(resultadoLocal),
//         resultadoVisitante:
//           resultadoVisitante === '' ? null : Number(resultadoVisitante),
//       });
//       setResultadoModal(false);
//       setResultadoLocal('');
//       setResultadoVisitante('');
//       setPartidoSeleccionado(null);
//       await fetchTorneo();
//     } catch (err) {
//       console.error('Error al cargar resultado:', err);
//     }
//   };
//   const handleDelete = async () => {
//     if (!id) return;
//     try {
//       await apiAxios.delete(`/eventos/${id}`);
//       navigate('/home/torneos');
//     } catch (error) {
//       console.error('Error eliminando torneo:', error);
//     }
//   };

//   const partidosOrdenados = [...(torneo?.partidos || [])].sort(
//     (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
//   );

//   const partidosPorFecha = partidosOrdenados.reduce((acc, partido) => {
//     const fechaKey = new Date(partido.fecha).toDateString();
//     if (!acc[fechaKey]) acc[fechaKey] = [];
//     acc[fechaKey].push(partido);
//     return acc;
//   }, {} as Record<string, Partido[]>);

//   async function handleDeletePartido(id: number) {
//     try {
//       await apiAxios.delete(`/partidos/${id}`);
//       fetchTorneo();
//     } catch (error) {
//       console.error('Error eliminando partido:', error);
//     }
//   }

//   if (!torneo) return <p>Cargando...</p>;

//   return (
//     <div className="container text-bg-dark p-3">
//       <Row>
//         <Col>
//           <h2>{torneo.nombre}</h2>
//         </Col>
//         <Col className="d-flex justify-content-center mb-2 mb-md-0">
//           {Number(user?.id) === torneo.creador && (
//             <Button
//               variant="outline-light"
//               onClick={() => {
//                 navigate(`/home/torneos/${id}/editar`);
//               }}
//             >
//               Editar
//             </Button>
//           )}
//         </Col>
//         <Col className="d-flex justify-content-center">
//           {Number(user?.id) === torneo.creador && (
//             <Button
//               variant="danger"
//               onClick={() => {
//                 handleDelete();
//               }}
//             >
//               Eliminar
//             </Button>
//           )}
//         </Col>
//       </Row>
//       <Row>
//         <p style={{ opacity: 0.8 }}>{torneo.deporte.nombre}</p>
//       </Row>
//       <Row>
//         <p>{torneo.descripcion}</p>
//       </Row>
//       <Row>
//         <Col>
//           <p>
//             <strong>Duracion:</strong>{' '}
//             {new Date(torneo.fechaInicioEvento).toLocaleDateString()} {' - '}{' '}
//             {new Date(torneo.fechaFinEvento).toLocaleDateString()}
//           </p>
//         </Col>

//         <Col>
//           <p>
//             <strong>Código:</strong> {torneo.codigo}
//           </p>
//         </Col>
//         <Col>
//           <p>
//             <strong>Inscripciones:</strong>{' '}
//             {new Date(torneo.fechaInicioInscripcion).toLocaleDateString()}{' '}
//             {' - '} {new Date(torneo.fechaFinInscripcion).toLocaleDateString()}
//           </p>
//         </Col>
//       </Row>
//       <Row>
//         <Col>
//           <p>
//             <strong>Localidad:</strong> {torneo.localidad.nombre}
//           </p>
//         </Col>
//       </Row>
//       <Row>
//         <Col>
//           <p>
//             Cantidad maxima de equipos: {torneo.cantEquiposMax} - Equipos
//             inscriptos: {torneo.equipos && torneo.equipos.length}{' '}
//           </p>
//         </Col>
//       </Row>
//       <Row className="mb-3">
//         <Col>
//           {userIsMember() && (
//             <div className="mt-2 alert alert-info py-2 mb-0">
//               Ya estás inscripto en un equipo de este evento.
//             </div>
//           )}
//         </Col>
//       </Row>
//       <Row className="mb-3">
//         <Col
//           xs={12}
//           md={4}
//           className="d-flex justify-content-center mb-2 mb-md-0"
//         >
//           {Number(user?.id) === torneo.creador && (
//             <Link to={`CrearEstablecimiento`}>
//               <Button variant="outline-primary">Crear Establecimientos</Button>
//             </Link>
//           )}
//         </Col>
//         <Col
//           xs={12}
//           md={4}
//           className="d-flex justify-content-center mb-2 mb-md-0"
//         >
//           {!userIsMember() ? (
//             <Link to={`/home/torneos/${torneo.id}/crear-equipo`}>
//               <Button variant="primary">Inscribir Equipo</Button>
//             </Link>
//           ) : (
//             <Button variant="primary" disabled>
//               Inscribir Equipo
//             </Button>
//           )}
//         </Col>
//         <Col
//           xs={12}
//           md={4}
//           className="d-flex justify-content-center mb-2 mb-md-0"
//         >
//           {Number(user?.id) === torneo.creador && (
//             <Link to={`/home/torneos/${torneo.id}/CrearPartido`}>
//               <Button variant="outline-primary">Crear Partidos</Button>
//             </Link>
//           )}
//         </Col>
//       </Row>
//       <Table responsive striped variant="dark">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Equipos</th>
//             <th>Jugadores</th>
//             <th>Publico</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {torneo.equipos?.map((equipo: Equipo, idx) => (
//             <tr key={equipo.id}>
//               <td>{idx + 1}</td>
//               <td>{equipo.nombre}</td>
//               <td>
//                 {equipo.miembros?.length ?? 0}/
//                 {torneo.deporte?.cantMaxJugadores ?? '-'}
//               </td>

//               <td>{equipo.esPublico ? 'Sí' : 'No'}</td>
//               <td>
//                 {!userIsMember() ? (
//                   <div className="d-flex flex-column align-items-start">
//                     <Button
//                       variant="outline-primary"
//                       onClick={() => {
//                         setSelectedTeam(equipo);
//                         setEnrollPassword('');
//                         setEnrollError(null);
//                         setShowEnrollModal(true);
//                       }}
//                     >
//                       Unirse
//                     </Button>
//                   </div>
//                 ) : isCaptain(equipo) ? (
//                   <div className="d-flex gap-2">
//                     <Button
//                       variant="outline-light"
//                       onClick={() =>
//                         navigate(`/home/equipos/${equipo.id}/editar`)
//                       }
//                     >
//                       Editar
//                     </Button>
//                     <Button
//                       variant="danger"
//                       onClick={() => handleDeleteTeam(equipo.id)}
//                     >
//                       Eliminar
//                     </Button>
//                     <Button
//                       variant="primary"
//                       onClick={() => navigate(`/home/equipos/${equipo.id}`)}
//                     >
//                       Ver equipo
//                     </Button>
//                   </div>
//                 ) : isMember(equipo) ? (
//                   <Button
//                     variant="primary"
//                     onClick={() => navigate(`/home/equipos/${equipo.id}`)}
//                   >
//                     Ver equipo
//                   </Button>
//                 ) : null}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <Tabs
//         id="tab-partidos"
//         activeKey={tabKey}
//         onSelect={(k) => {
//           if (typeof k === 'string') setTabKey(k);
//         }}
//       >
//         {Object.entries(partidosPorFecha).map(([fecha, partidos], idx) => (
//           <Tab
//             key={fecha}
//             eventKey={fecha}
//             title={`Fecha ${idx + 1} - ${new Date(fecha).toLocaleDateString(
//               'es-AR'
//             )}`}
//           >
//             <Table responsive striped variant="dark">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Fecha</th>
//                   <th>Hora inicio</th>
//                   <th>Establecimiento</th>
//                   <th>Local</th>
//                   <th>Visitante</th>
//                   <th>Resultado</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {partidos.map((partido, i) => (
//                   <tr key={partido.id}>
//                     <td>{i + 1}</td>
//                     <td>{new Date(partido.fecha).toLocaleDateString()}</td>
//                     <td>{partido.hora}</td>
//                     <td>{partido.establecimiento?.nombre}</td>
//                     <td>{partido.equipoLocal.nombre}</td>
//                     <td>{partido.equipoVisitante.nombre}</td>
//                     <td>
//                       {partido.resultadoLocal != null &&
//                       partido.resultadoVisitante != null
//                         ? `${partido.resultadoLocal} - ${partido.resultadoVisitante}`
//                         : '-'}
//                     </td>
//                     <td>
//                       <div className="d-flex gap-2 align-items-start">
//                         <Link to={`/home/partido-detalle`}>
//                           <Button variant="outline-primary">Ver Partido</Button>
//                         </Link>
//                         {Number(user?.id) === torneo.creador && (
//                           <div className="d-flex gap-2 align-items-start">
//                             <Link to={`/home/Participaciones/${partido.id}`}>
//                               <Button variant="outline-primary">
//                                 Cargar Participaciones
//                               </Button>
//                             </Link>
//                             <Link
//                               to={`/home/torneos/${torneo.id}/EditarPartido/${partido.id}`}
//                             >
//                               <Button variant="outline-primary">
//                                 Editar Partido
//                               </Button>
//                             </Link>
//                             <Button
//                               variant="outline-primary"
//                               onClick={() => {
//                                 setPartidoSeleccionado(partido);
//                                 setResultadoLocal(
//                                   partido.resultadoLocal == null
//                                     ? ''
//                                     : String(partido.resultadoLocal)
//                                 );
//                                 setResultadoVisitante(
//                                   partido.resultadoVisitante == null
//                                     ? ''
//                                     : String(partido.resultadoVisitante)
//                                 );
//                                 setResultadoModal(true);
//                               }}
//                             >
//                               Editar Resultado
//                             </Button>
//                             <Button
//                               variant="danger"
//                               onClick={() => {
//                                 handleDeletePartido(partido.id);
//                               }}
//                             >
//                               Eliminar
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Tab>
//         ))}
//       </Tabs>

//       <Modal
//         show={resultadoModal}
//         onHide={() => setResultadoModal(false)}
//         contentClassName="bg-dark text-light"
//         backdropClassName="bg-dark bg-opacity-20"
//       >
//         <Modal.Header
//           closeButton
//           closeVariant="white"
//           className="border-secondary"
//         >
//           <Modal.Title>
//             Resultado de {partidoSeleccionado?.equipoLocal.nombre} -{' '}
//             {partidoSeleccionado?.equipoVisitante.nombre}
//           </Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Row>
//             <Col>
//               <Form.Group>
//                 <Form.Label>Goles Local</Form.Label>
//                 <Form.Control
//                   className="bg-bs-dark text-bg-dark border border-primary form-control"
//                   type="number"
//                   min={0}
//                   value={resultadoLocal}
//                   onChange={(e) => setResultadoLocal(e.target.value)}
//                   placeholder="0"
//                   autoFocus
//                 />
//               </Form.Group>
//             </Col>
//             <Col>
//               <Form.Group>
//                 <Form.Label>Goles Visitante</Form.Label>
//                 <Form.Control
//                   className="bg-bs-dark text-bg-dark border border-primary form-control"
//                   type="number"
//                   min={0}
//                   value={resultadoVisitante}
//                   onChange={(e) => setResultadoVisitante(e.target.value)}
//                   placeholder="0"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//         </Modal.Body>

//         <Modal.Footer className="border-secondary">
//           <Button variant="secondary" onClick={() => setResultadoModal(false)}>
//             Cancelar
//           </Button>
//           <Button variant="primary" onClick={handleCargarResultado}>
//             Guardar
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={showEnrollModal}
//         onHide={() => setShowEnrollModal(false)}
//         contentClassName="bg-dark text-light"
//         backdropClassName="bg-dark bg-opacity-20"
//         centered
//         backdrop="static"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedTeam
//               ? `Inscribirse en ${selectedTeam.nombre}`
//               : 'Inscribirse'}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {enrollError && (
//             <div className="alert alert-danger">{enrollError}</div>
//           )}
//           {selectedTeam && !selectedTeam.esPublico && (
//             <Form.Group>
//               <Form.Label>Contraseña del equipo</Form.Label>
//               <Form.Control
//                 type="password"
//                 value={enrollPassword}
//                 onChange={(e) => setEnrollPassword(e.target.value)}
//                 placeholder="Ingrese la contraseña"
//                 autoFocus
//               />
//             </Form.Group>
//           )}
//           {selectedTeam && selectedTeam.esPublico && (
//             <p>Este equipo es público. Confirme para inscribirse.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>
//             Cancelar
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleInscribe}
//             disabled={enrolling}
//           >
//             {enrolling ? 'Enviando...' : 'Confirmar'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }
