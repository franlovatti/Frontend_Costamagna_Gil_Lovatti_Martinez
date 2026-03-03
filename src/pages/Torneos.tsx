import { useState, useEffect } from 'react';
import { useTorneo } from '../hooks/useTorneo';
import CardTorneos from '../components/CardTorneos';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Equipo } from '../contexts/equipo.tsx';
import type { Usuario } from '../contexts/usuario.tsx';
import type { Torneo } from '../contexts/torneo.tsx';
import type { Deporte } from '../contexts/deporte.tsx';
import { useAuth } from '../hooks/useAuth';
import MapaLocalidad from '../components/ApiMaps/MapaLocalidad';
import './Torneos.css';
import { useDeporte } from '../hooks/useDeporte.tsx';
import FormTorneos from '../components/FormTorneos.tsx';

export default function Torneos() {
  const {
    torneos,
    loading,
    error,
    getTorneos,
    crearTorneo,
    torneo,
    getTorneoPorCodigo,
  } = useTorneo();
  const { deportes, getDeportes } = useDeporte();
  const [dataTorneos, setDataTorneos] = useState<Torneo[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>('');
  const [dataDeportes, setDataDeportes] = useState<Deporte[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Modal de código
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  // Modal de inscripción a evento
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Torneo | null>(null);
  const [eventPwd, setEventPwd] = useState('');
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventSubmitting, setEventSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    getTorneos();
    getDeportes();
    // Si vienes desde crear torneo, abre el formulario
    if (location.state?.showForm) {
      setShowForm(true);
    }
  }, [getTorneos, getDeportes, location]);

  useEffect(() => {
    setDataTorneos(torneos);
  }, [torneos]);

  useEffect(() => {
    setDataDeportes(deportes);
  }, [deportes]);

  const handleClick = (id: number | undefined) => {
    if (id === undefined) return;
    navigate(`/home/torneos/${id}`);
  };

  const handleCreateTorneo = async (data: Partial<Torneo>) => {
    crearTorneo(data as Torneo);
    setShowForm(false);
    getTorneos();
  };

  const handleEnrollFromCard = async (evt: Torneo) => {
    setSelectedEvent(evt);
    setEventPwd('');
    setEventError(null);
    setShowEventModal(true);
  };

  const handleSubmitEventEnroll = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedEvent) return;
    setEventError(null);
    setEventSubmitting(true);
    try {
      if (selectedEvent.esPublico === false) {
        const requiredPwd = selectedEvent.contrasenia?.trim() || '';
        const inputPwd = eventPwd.trim();
        if (!inputPwd) {
          setEventError('Ingrese la contrasenia');
          return;
        }
        if (inputPwd !== requiredPwd) {
          setEventError('contrasenia incorrecta');
          return;
        }
      }
      setShowEventModal(false);
      navigate(`/home/torneos/${selectedEvent.id}`);
    } catch (err) {
      console.error('Error preparando inscripción:', err);
      setEventError('No se pudo validar el torneo. Intente nuevamente.');
    } finally {
      setEventSubmitting(false);
    }
  };

  const userIsMemberOf = (torneo: Torneo): boolean => {
    if (!user || !torneo?.equipos) return false;
    const userIdStr = String(user.id);
    return torneo.equipos.some((e: Equipo) => {
      const miembros = (e.miembros as Usuario[]) ?? [];
      return miembros.some((m) => String(m.id) === userIdStr);
    });
  };

  const userIsCreadorOf = (torneo: Torneo): boolean => {
    if (!user || !torneo?.equipos) return false;
    const userIdStr = String(user.id);
    const torneoCreadorId = String(torneo.creador);
    return torneoCreadorId === userIdStr;
  };

  const openCodeModal = () => {
    setCode('');
    setCodeError(null);
    setShowCodeModal(true);
  };

  const handleResolveCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setCodeError('Ingrese un código');
      return;
    }
    getTorneoPorCodigo(trimmed);
    if (torneo && typeof torneo.id === 'number') {
      setShowCodeModal(false);
      handleEnrollFromCard(torneo as Torneo);
    } else {
      setCodeError('Código inválido');
    }
  };

  const torneosFiltrados = dataTorneos.filter(
    (torneo) =>
      (!selectedSport || String(torneo.deporte.nombre) === selectedSport) &&
      (!selectedLocalidad ||
        String(torneo.localidad.codigo) === selectedLocalidad),
  );

  if (showForm) {
    return (
      <FormTorneos
        setShowModal={setShowForm}
        editingTorneo={null}
        onSave={handleCreateTorneo}
      />
    );
  }
  return (
    <div className="torneos-page-container">
      <div className="torneos-inner-container">
        {/* Header */}
        <div className="torneos-header">
          <h1>Torneos</h1>
          <p className="torneos-subtitle">
            Explora y únete a los torneos deportivos disponibles
          </p>
        </div>

        {/* Toolbar */}
        <div className="torneos-toolbar">
          <div className="toolbar-actions">
            <button className="btn-toolbar" onClick={openCodeModal}>
              Ingresar código
            </button>
            <button
              className="btn-save-custom"
              onClick={() => setShowForm(true)}
            >
              Crear Torneo
            </button>
            <select
              className="filtro-select-toolbar"
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <option value="">Todos los deportes</option>
              {dataDeportes.map((sport) => (
                <option key={sport.id} value={sport.nombre}>
                  {sport.nombre}
                </option>
              ))}
            </select>
            <MapaLocalidad
              onSelect={(place) => setSelectedLocalidad(place.place_id!)}
              localidad={true}
              className="filtro-select-toolbar"
            />
          </div>
        </div>

        {/* Error de conexión */}
        {error && !loading && (
          <div className="alert-danger-custom">⚠️ {error}</div>
        )}

        {/* Grid de torneos */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Cargando torneos...</p>
          </div>
        ) : torneosFiltrados.length === 0 ? (
          <div className="torneos-empty-state">
            <div className="empty-state-icon">🏆</div>
            <p className="empty-state-text">No se encontraron torneos</p>
          </div>
        ) : (
          <div className="torneos-grid">
            {torneosFiltrados.map((torneo) => (
              <CardTorneos
                key={torneo.id}
                torneo={torneo}
                handleClick={handleClick}
                isMember={userIsMemberOf(torneo)}
                onEnroll={handleEnrollFromCard}
                isCreador={userIsCreadorOf(torneo)}
              />
            ))}
          </div>
        )}

        {/* Modal de código */}
        {showCodeModal && (
          <div
            className="modal-custom-overlay"
            onClick={() => setShowCodeModal(false)}
          >
            <div
              className="modal-custom-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-custom-header">
                <h2 className="modal-custom-title">
                  Ingresar código de torneo
                </h2>
                <button
                  className="modal-custom-close"
                  onClick={() => setShowCodeModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleResolveCode}>
                <div className="modal-custom-body">
                  <div className="modal-form-group">
                    <label className="modal-form-label">Código</label>
                    <input
                      type="text"
                      className="modal-form-input"
                      placeholder="p. ej. ABC123"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        if (codeError) setCodeError(null);
                      }}
                      autoFocus
                    />
                    {codeError && (
                      <div className="modal-error-text">{codeError}</div>
                    )}
                  </div>
                </div>
                <div className="modal-custom-footer">
                  <button
                    type="button"
                    className="modal-btn modal-btn-secondary"
                    onClick={() => setShowCodeModal(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="modal-btn modal-btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Buscando...' : 'Ir al torneo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de inscripción al evento */}
        {showEventModal && selectedEvent && (
          <div
            className="modal-custom-overlay"
            onClick={() => setShowEventModal(false)}
          >
            <div
              className="modal-custom-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-custom-header">
                <h2 className="modal-custom-title">
                  {selectedEvent.esPublico === false
                    ? 'Inscribirse a torneo privado'
                    : 'Inscribirse al torneo'}
                </h2>
                <button
                  className="modal-custom-close"
                  onClick={() => setShowEventModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmitEventEnroll}>
                <div className="modal-custom-body">
                  <p className="modal-info-text">
                    Torneo: <strong>{selectedEvent.nombre}</strong>
                  </p>
                  {selectedEvent.esPublico === false ? (
                    <div className="modal-form-group">
                      <label className="modal-form-label">
                        contrasenia del torneo
                      </label>
                      <input
                        type="password"
                        className="modal-form-input"
                        placeholder="Ingrese la contrasenia"
                        value={eventPwd}
                        onChange={(e) => {
                          setEventPwd(e.target.value);
                          if (eventError) setEventError(null);
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="modal-info-text">
                      Este torneo es público. ¿Desea continuar y ver los
                      detalles para inscribirse?
                    </p>
                  )}
                  {eventError && (
                    <div className="modal-error-text">{eventError}</div>
                  )}
                </div>
                <div className="modal-custom-footer">
                  <button
                    type="button"
                    className="modal-btn modal-btn-secondary"
                    onClick={() => setShowEventModal(false)}
                    disabled={eventSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="modal-btn modal-btn-primary"
                    disabled={eventSubmitting}
                  >
                    {eventSubmitting ? 'Validando...' : 'Continuar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
