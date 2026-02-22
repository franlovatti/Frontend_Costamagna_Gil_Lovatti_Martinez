import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import type { Equipo, Participation, Partido, Torneo, Usuario } from '../types';
import { Row, Col } from 'react-bootstrap';
import apiAxios from '../helpers/api';
import { useAuth } from '../hooks/useAuth';
import { useParticipacionesTotalesPorTorneo } from '../hooks/useParticipaciones';
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
  const [partidoSeleccionado, setPartidoSeleccionado] =
    useState<Partido | null>(null);
  const [tabKey, setTabKey] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTorneo();
  }, [id]);

  const { participacionesTotales, loading, error } = useParticipacionesTotalesPorTorneo(id);

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

  const handleDeleteTeam = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este equipo?')) return;
    try {
      await apiAxios.delete(`/equipos/${id}`);
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
        if (
          'response' in errObj &&
          typeof errObj.response === 'object' &&
          errObj.response !== null
        ) {
          const resp = errObj.response as Record<string, unknown>;
          if (
            'data' in resp &&
            typeof resp.data === 'object' &&
            resp.data !== null
          ) {
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
        resultadoVisitante:
          resultadoVisitante === '' ? null : Number(resultadoVisitante),
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
    if (
      !confirm(
        '¿Estás seguro de eliminar este torneo? Esta acción no se puede deshacer.'
      )
    )
      return;
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

  if (!torneo)
    return (
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
              <span className="detalle-sport-badge">
                {torneo.deporte.nombre}
              </span>
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
                {new Date(torneo.fechaInicioEvento).toLocaleDateString()}{' '}
                {' - '} {new Date(torneo.fechaFinEvento).toLocaleDateString()}
              </p>
            </Col>
            <Col>
              <p>
                <strong>Inscripciones:</strong>{' '}
                {new Date(torneo.fechaInicioInscripcion).toLocaleDateString()}{' '}
                {' - '}{' '}
                {new Date(torneo.fechaFinInscripcion).toLocaleDateString()}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <strong>Localidad:</strong> {torneo.localidad.descripcion}
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
              Equipos inscritos: <strong>{torneo.equipos?.length || 0}</strong>{' '}
              / {torneo.cantEquiposMax}
            </span>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${
                    ((torneo.equipos?.length || 0) / torneo.cantEquiposMax) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons-section">
          {isCreator && (
            <button
              onClick={() =>
                navigate(`/home/torneos/${torneo.id}/ListarEstablecimientos`)
              }
              className="action-btn btn-secondary-action"
            >
              Establecimientos
            </button>
          )}
          {!userIsMember() ? (
            <button
              onClick={() =>
                navigate(`/home/torneos/${torneo.id}/crear-equipo`)
              }
              className="action-btn btn-primary-action"
            >
              Inscribir Equipo
            </button>
          ) : (
            <button className="action-btn btn-disabled" disabled>
              ✓ Equipo Inscrito
            </button>
          )}
          {isCreator && (
            <button
              onClick={() =>
                navigate(`/home/torneos/${torneo.id}/crearPartido`)
              }
              className="action-btn btn-secondary-action"
            >
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
                          {equipo.miembros?.length ?? 0}/
                          {torneo.deporte?.cantMaxJugadores ?? '-'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge-custom ${
                            equipo.esPublico
                              ? 'badge-equipo'
                              : 'badge-individual'
                          }`}
                        >
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
                                className="btn-action btn-delete"
                                onClick={() => handleDeleteTeam(equipo.id)}
                              >
                                Eliminar
                              </button>
                              <button
                                className="btn-action"
                                onClick={() =>
                                  navigate(`/home/equipos/${equipo.id}`)
                                }
                              >
                                Ver equipo
                              </button>
                            </>
                          ) : isMember(equipo) ? (
                            <button
                              className="btn-action"
                              onClick={() =>
                                navigate(`/home/equipos/${equipo.id}`)
                              }
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
                        {equipo.miembros?.length ?? 0}/
                        {torneo.deporte?.cantMaxJugadores ?? '-'}
                      </span>
                    </div>
                    <div className="equipo-info-row">
                      <span className="equipo-info-label">Tipo</span>
                      <span
                        className={`badge-custom ${
                          equipo.esPublico ? 'badge-equipo' : 'badge-individual'
                        }`}
                      >
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
                          onClick={() =>
                            navigate(`/home/equipos/${equipo.id}/editar`)
                          }
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
                    <span className="tab-date">
                      {new Date(fecha).toLocaleDateString('es-AR')}
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
                                    {new Date(
                                      partido.fecha
                                    ).toLocaleDateString()}
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
                                          navigate(`/home/partido-detalle/${partido.id}`)
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
                                                `/home/Participaciones/${partido.id}`
                                              )
                                            }
                                            className="btn-action btn-small"
                                          >
                                            Participaciones
                                          </button>
                                          <button
                                            onClick={() =>
                                              navigate(
                                                `/home/torneos/${torneo.id}/EditarPartido/${partido.id}`
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
                                                      partido.resultadoLocal
                                                    )
                                              );
                                              setResultadoVisitante(
                                                partido.resultadoVisitante ==
                                                  null
                                                  ? ''
                                                  : String(
                                                      partido.resultadoVisitante
                                                    )
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
                                    {new Date(
                                      partido.fecha
                                    ).toLocaleDateString()}
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
                                      `/home/partido-detalle/${partido.id}`
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
                                          `/home/Participaciones/${partido.id}`
                                        )
                                      }
                                      className="btn-action"
                                    >
                                      📋 Participaciones
                                    </button>
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/home/torneos/${torneo.id}/EditarPartido/${partido.id}`
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
                                            : String(partido.resultadoLocal)
                                        );
                                        setResultadoVisitante(
                                          partido.resultadoVisitante == null
                                            ? ''
                                            : String(partido.resultadoVisitante)
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
                    )
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

        {/* Tabla de participaciones*/}
        <div className='section-container'>
          <h2 className='section-title'>Participaciones</h2>ç
          
 {/* Versión Desktop - Tabla */}
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Faltas</th>
                  <th>Minutos Jugados</th>
                  <th>Puntos</th>
                </tr>
              </thead>
              <tbody>
                {participacionesTotales && participacionesTotales.length > 0 ? (
                  participacionesTotales.map((participacion: Participation) => (
                    <tr key={participacion.usuario.nombre}>
                      <td>{participacion.usuario.nombre}</td>
                      <td>{participacion.faltas}</td>
                      <td> {participacion.minutosjugados}
                      </td>
                      <td>
                        {participacion.puntos}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="empty-state-cell">
                      No hay participaciones registradas aún
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
                        {equipo.miembros?.length ?? 0}/
                        {torneo.deporte?.cantMaxJugadores ?? '-'}
                      </span>
                    </div>
                    <div className="equipo-info-row">
                      <span className="equipo-info-label">Tipo</span>
                      <span
                        className={`badge-custom ${
                          equipo.esPublico ? 'badge-equipo' : 'badge-individual'
                        }`}
                      >
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
                          onClick={() =>
                            navigate(`/home/equipos/${equipo.id}/editar`)
                          }
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
      </div>

      {/* Modal de Inscripción */}
      {showEnrollModal && (
        <div
          className="modal-custom-overlay"
          onClick={() => setShowEnrollModal(false)}
        >
          <div
            className="modal-custom-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-custom-header">
              <h2 className="modal-custom-title">
                Inscribirse en {selectedTeam?.nombre}
              </h2>
              <button
                className="modal-custom-close"
                onClick={() => setShowEnrollModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-custom-body">
              {enrollError && (
                <div className="alert-danger-custom">{enrollError}</div>
              )}
              {selectedTeam && !selectedTeam.esPublico ? (
                <div className="modal-form-group">
                  <label className="modal-form-label">
                    Contraseña del equipo
                  </label>
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
                <p className="modal-info-text">
                  Este equipo es público. Confirme para inscribirse.
                </p>
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
        <div
          className="modal-custom-overlay"
          onClick={() => setResultadoModal(false)}
        >
          <div
            className="modal-custom-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-custom-header">
              <h2 className="modal-custom-title">Resultado del Partido</h2>
              <button
                className="modal-custom-close"
                onClick={() => setResultadoModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-custom-body">
              <p className="modal-info-text">
                {partidoSeleccionado.equipoLocal.nombre} vs{' '}
                {partidoSeleccionado.equipoVisitante.nombre}
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
              <button
                className="btn-cancel-custom"
                onClick={() => setResultadoModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-save-custom"
                onClick={handleCargarResultado}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
