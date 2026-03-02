import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import type { Equipo, Participation, Partido, Usuario, Stats } from '../types';
import type { Torneo } from '../contexts/torneo.tsx';
import { Row, Col } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import './TorneoDetalle.css';
import { useParticipantesEvento } from '../hooks/useUsuario.tsx';
import { useTorneo } from '../hooks/useTorneo.tsx';
import { useEquipos } from '../hooks/useEquipos.tsx';
import { usePartidos } from '../hooks/usePartidos.tsx';
import ConfirmModal from '../components/ConfirmModal.tsx';
import {
  formatFecha,
  compararFechas,
  estaAbiertoPeriodo,
  getFechaString,
} from '../helpers/convertirFechas';
import TablaEquipos from '../components/TablaEquipos.tsx';
import TablaPartidos from '../components/TablaPartidos.tsx';
import TablaParticipantes from '../components/TablaParticipantes.tsx';
import ModalInscripcion from '../components/ModalInscripcion.tsx';
import ModalResultados from '../components/ModalResultados.tsx';
import FormTorneos from '../components/FormTorneos.tsx';

export default function TorneoDetalle() {
  const {
    torneo,
    getUnTorneo,
    borrarTorneo,
    modificarTorneo,
    error: errorTorneo,
    loading: loadingTorneo,
  } = useTorneo();
  const [showConfirmTorneo, setShowConfirmTorneo] = useState(false);
  const [showConfirmEquipo, setShowConfirmEquipo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [equipoAEliminar, setEquipoAEliminar] = useState<number>(0);

  const {
    borrarEquipo,
    loading: loadingEquipo,
    error: errorEquipo,
    salirEquipo,
    inscribirseEquipo,
  } = useEquipos();

  const {
    cargarResultado,
    borrarPartido,
    loading: loadingPartido,
    error: errorPartido,
  } = usePartidos();

  const [showConfirmPartido, setShowConfirmPartido] = useState(false);
  const [partidoAEliminar, setPartidoAEliminar] = useState<number>(0);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Equipo | null>(null);
  const [enrollPassword, setEnrollPassword] = useState('');
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [abandono, setAbandono] = useState(false);
  const [resultadoModal, setResultadoModal] = useState(false);
  const [resultadoLocal, setResultadoLocal] = useState<string>('');
  const [resultadoVisitante, setResultadoVisitante] = useState<string>('');
  const [partidoSeleccionado, setPartidoSeleccionado] =
    useState<Partido | null>(null);
  const [ordenarParticipanteCriterio, setOrdenarParticipanteCriterio] =
    useState<string>('puntos');
  const [tabKey, setTabKey] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getUnTorneo(Number(id));
  }, [id, getUnTorneo]);

  useEffect(() => {
    if (torneo && torneo.partidos && torneo.partidos.length > 0) {
      const firstDate = getFechaString(torneo.partidos[0].fecha);
      setTabKey(firstDate);
    }
  }, [torneo]);

  const { participantes: participantesDesordenados } =
    useParticipantesEvento(id);

  const calcularStats = (participations: Participation[] | undefined) => {
    if (!participations)
      return { faltas: 0, minutosjugados: 0, puntos: 0, equipo: 0 };

    return participations.reduce(
      (acc, part) => {
        acc.faltas += part.faltas;
        acc.minutosjugados += part.minutosjugados;
        acc.puntos += part.puntos;
        return acc;
      },
      { faltas: 0, minutosjugados: 0, puntos: 0, equipo: 0 },
    );
  };

  const ordenarParticipantes = (
    participantes: Usuario[],
    c: keyof Stats = 'puntos',
  ) => {
    return [...participantes].sort((a, b) => {
      const statsA = calcularStats(a.participations);
      const statsB = calcularStats(b.participations);
      return statsB[c] - statsA[c];
    });
  };

  const participantes = ordenarParticipantes(
    participantesDesordenados,
    ordenarParticipanteCriterio as keyof Stats,
  );

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
    setEquipoAEliminar(id);
    setShowConfirmEquipo(true);
  };
  const handleConfirmDeleteEquipo = async () => {
    if (equipoAEliminar) {
      const success = await borrarEquipo(equipoAEliminar);
      if (success) {
        await getUnTorneo(Number(id));
      }
    }
    setShowConfirmEquipo(false);
    setEquipoAEliminar(0);
  };
  const handleCancelDeleteEquipo = () => {
    setShowConfirmEquipo(false);
    setEquipoAEliminar(0);
  };

  const handleEditTorneo = async (data: Partial<Torneo>) => {
    if (!torneo) return;
    modificarTorneo({ ...data, id: torneo.id } as Torneo);
    setShowEditModal(false);
    getUnTorneo(Number(id));
  };

  const handleDeletePartido = async (id: number) => {
    setPartidoAEliminar(id);
    setShowConfirmPartido(true);
  };
  const handleConfirmDeletePartido = async () => {
    if (partidoAEliminar) {
      const success = await borrarPartido(partidoAEliminar);
      if (success) {
        await getUnTorneo(Number(id));
      }
    }
    setShowConfirmPartido(false);
    setPartidoAEliminar(0);
  };
  const handleCancelDeletePartido = () => {
    setShowConfirmPartido(false);
    setPartidoAEliminar(0);
  };

  const handleInscribe = async () => {
    if (!selectedTeam) return;

    // Validar que las inscripciones estén abiertas
    if (
      !estaAbiertoPeriodo(
        torneo?.fechaInicioInscripcion,
        torneo?.fechaFinInscripcion,
      )
    ) {
      setEnrollError('Las inscripciones no están abiertas en este momento');
      return;
    }

    if (!selectedTeam.esPublico && enrollPassword.trim() === '') {
      setEnrollError('La contrasenia es obligatoria para este equipo');
      return;
    }
    if (
      !selectedTeam.esPublico &&
      enrollPassword !== selectedTeam.contrasenia
    ) {
      setEnrollError('La contrasenia es incorrecta');
      return;
    }

    const userId = Number(user?.id);
    const success = await inscribirseEquipo(
      selectedTeam,
      enrollPassword,
      userId,
    );
    if (success) {
      setShowEnrollModal(false);
      await getUnTorneo(Number(id));
    }
  };

  const handleCargarResultado = async () => {
    if (!partidoSeleccionado) return;
    const success = await cargarResultado({
      partidoId: partidoSeleccionado.id,
      resultadoLocal,
      resultadoVisitante,
    });
    if (success) {
      setResultadoModal(false);
      setResultadoLocal('');
      setResultadoVisitante('');
      setPartidoSeleccionado(null);
      await getUnTorneo(Number(id));
    }
  };

  const handleConfirmDeleteTorneo = async () => {
    if (torneo?.id) {
      borrarTorneo(torneo.id);
      if (!errorTorneo) navigate('/home/torneos');
    }
    setShowConfirmTorneo(false);
  };

  const handleAbandono = async () => {
    if (!selectedTeam) return;

    const success = await salirEquipo(selectedTeam.id, Number(user?.id));
    if (success) {
      setAbandono(false);
      await getUnTorneo(Number(id));
    }
  };

  const partidosOrdenados = [...(torneo?.partidos || [])].sort((a, b) =>
    compararFechas(a.fecha, b.fecha),
  );

  const partidosPorFecha = partidosOrdenados.reduce(
    (acc, partido) => {
      const fechaKey = getFechaString(partido.fecha);
      if (!acc[fechaKey]) acc[fechaKey] = [];
      acc[fechaKey].push(partido);
      return acc;
    },
    {} as Record<string, Partido[]>,
  );

  const isCreator = Number(user?.id) === torneo?.creador;

  if (loadingTorneo || !torneo)
    return (
      <div className="torneo-detalle-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Cargando torneo...</p>
        </div>
      </div>
    );

  if (showEditModal) {
    return (
      <FormTorneos
        setShowModal={setShowEditModal}
        editingTorneo={torneo}
        onSave={handleEditTorneo}
      />
    );
  }
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
                  onClick={() => setShowEditModal(true)}
                >
                  Editar
                </button>
                <button
                  className="btn-header-action btn-delete-header"
                  onClick={() => setShowConfirmTorneo(true)}
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
                {formatFecha(torneo.fechaInicioEvento)} {' - '}{' '}
                {formatFecha(torneo.fechaFinEvento)}
              </p>
            </Col>
            <Col>
              <p>
                <strong>Inscripciones:</strong>{' '}
                {formatFecha(torneo.fechaInicioInscripcion)} {' - '}{' '}
                {formatFecha(torneo.fechaFinInscripcion)}
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

        {/* Error de conexión */}
        {(errorTorneo || errorPartido || errorEquipo) &&
          !loadingTorneo &&
          !loadingPartido &&
          !loadingEquipo && (
            <div className="alert-danger-custom">
              ⚠️ {errorTorneo || errorPartido || errorEquipo}
            </div>
          )}

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
            estaAbiertoPeriodo(
              torneo.fechaInicioInscripcion,
              torneo.fechaFinInscripcion,
            ) ? (
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
                Inscribir Equipo
              </button>
            )
          ) : (
            <button className="action-btn btn-disabled" disabled>
              ✓ Equipo Inscrito
            </button>
          )}
          {isCreator &&
            (torneo.equipos && torneo.equipos.length > 1 ? (
              <button
                onClick={() =>
                  navigate(`/home/torneos/${torneo.id}/crearPartido`)
                }
                className="action-btn btn-secondary-action"
              >
                Crear Partidos
              </button>
            ) : (
              <button className="action-btn btn-disabled" disabled>
                Crear Partidos
              </button>
            ))}
        </div>

        {/* Tabla de Equipos */}
        <TablaEquipos
          torneo={torneo}
          isMember={isMember}
          userIsMember={userIsMember}
          isCaptain={isCaptain}
          setSelectedTeam={setSelectedTeam}
          setEnrollPassword={setEnrollPassword}
          setEnrollError={setEnrollError}
          setShowEnrollModal={setShowEnrollModal}
          handleDeleteTeam={handleDeleteTeam}
          setAbandono={setAbandono}
        />

        {/* Partidos por Fecha */}
        <TablaPartidos
          partidosPorFecha={partidosPorFecha}
          tabKey={tabKey}
          setTabKey={setTabKey}
          torneo={torneo}
          isCreator={isCreator}
          setPartidoSeleccionado={setPartidoSeleccionado}
          setResultadoLocal={setResultadoLocal}
          setResultadoVisitante={setResultadoVisitante}
          setResultadoModal={setResultadoModal}
          handleDeletePartido={handleDeletePartido}
        />

        {/*Tabla de Participantes*/}
        <TablaParticipantes
          participantes={participantes}
          setOrdenarParticipanteCriterio={setOrdenarParticipanteCriterio}
          calcularStats={calcularStats}
        />
      </div>

      {/* Modal de Inscripción */}
      {showEnrollModal && (
        <ModalInscripcion
          selectedTeam={selectedTeam}
          enrollPassword={enrollPassword}
          setEnrollPassword={setEnrollPassword}
          setShowEnrollModal={setShowEnrollModal}
          handleInscribe={handleInscribe}
          enrollError={enrollError}
          errorInscribirse={errorEquipo}
          loadingInscribirse={loadingEquipo}
        />
      )}

      {/* Modal de Resultado */}
      {resultadoModal && partidoSeleccionado && (
        <ModalResultados
          partidoSeleccionado={partidoSeleccionado}
          resultadoLocal={resultadoLocal}
          setResultadoLocal={setResultadoLocal}
          resultadoVisitante={resultadoVisitante}
          setResultadoVisitante={setResultadoVisitante}
          handleCargarResultado={handleCargarResultado}
          setResultadoModal={setResultadoModal}
          errorCargarResultados={errorEquipo}
          loadingCargarResultados={loadingEquipo}
        />
      )}

      {/*Modals de Confirmación para todas las cosas*/}

      {showConfirmEquipo && (
        <ConfirmModal
          objeto={'eliminar el equipo'}
          setShowConfirm={setShowConfirmEquipo}
          handleConfirmDelete={handleConfirmDeleteEquipo}
          handleCancelDelete={handleCancelDeleteEquipo}
        />
      )}

      {showConfirmTorneo && (
        <ConfirmModal
          objeto={'eliminar el torneo ' + (torneo ? ` "${torneo.nombre}"` : '')}
          setShowConfirm={setShowConfirmTorneo}
          handleConfirmDelete={handleConfirmDeleteTorneo}
          handleCancelDelete={() => setShowConfirmTorneo(false)}
        />
      )}

      {showConfirmPartido && (
        <ConfirmModal
          objeto={'eliminar el partido'}
          setShowConfirm={setShowConfirmPartido}
          handleConfirmDelete={handleConfirmDeletePartido}
          handleCancelDelete={handleCancelDeletePartido}
        />
      )}

      {abandono && (
        <ConfirmModal
          objeto={'abandonar el equipo'}
          setShowConfirm={setAbandono}
          handleConfirmDelete={handleAbandono}
          handleCancelDelete={() => setAbandono(false)}
        />
      )}
    </div>
  );
}
