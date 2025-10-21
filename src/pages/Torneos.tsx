import { Button, Col, Row, Form, Modal } from 'react-bootstrap';
import { useState } from 'react';
import CardTorneos from '../components/CardTorneos';
import { Link, useNavigate } from 'react-router-dom';
import apiAxios from '../helpers/api';
import { useEffect } from 'react';
import type { Torneo, Deporte, Localidad, Usuario, Equipo } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function Torneos() {
  const [dataTorneos, setDataTorneos] = useState<Torneo[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>('');
  const [dataDeportes, setDataDeportes] = useState<Deporte[]>([]);
  const [dataLocalidades, setDataLocalidades] = useState<Localidad[]>([]);
  const [errorConexion, setErrorConexion] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Torneo | null>(null);
  const [eventPwd, setEventPwd] = useState('');
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      apiAxios.get('/eventos'),
      apiAxios.get('/deportes'),
      apiAxios.get('/localidades'),
    ])
      .then(([torneosRes, deportesRes, localidadesRes]) => {
        setDataTorneos(torneosRes.data.data);
        setDataDeportes(deportesRes.data.data);
        setDataLocalidades(localidadesRes.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setErrorConexion(true);
      });
  }, []);
  const handleClick = (id: number) => {
    navigate(`/home/torneos/${id}`);
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
        const requiredPwd = selectedEvent.contraseña;
        if (!eventPwd.trim()) {
          setEventError('Ingrese la contraseña');
          return;
        }
        if (eventPwd !== requiredPwd) {
          setEventError('Contraseña incorrecta');
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
    setResolving(true);
    try {
      const res = await apiAxios.get(
        `/eventos/codigo/${encodeURIComponent(trimmed)}`
      );
      const evento = res.data?.data ?? res.data;
      if (evento && typeof evento.id === 'number') {
        navigate(`/home/torneos/${evento.id}`);
        setShowCodeModal(false);
      } else {
        setCodeError('Código inválido');
      }
    } catch {
      setCodeError('No se encontró un torneo con ese código');
    } finally {
      setResolving(false);
    }
  };
  return (
    <div className="text-bg-dark container">
      <Modal
        show={showCodeModal}
        onHide={() => setShowCodeModal(false)}
        centered
      >
        <Modal.Header
          data-bs-theme="dark"
          closeButton
          className="text-bg-dark border-primary"
        >
          <Modal.Title>Ingresar código de torneo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleResolveCode}>
          <Modal.Body className="text-bg-dark">
            <Form.Group controlId="codigoTorneo">
              <Form.Label>Código</Form.Label>
              <Form.Control
                className="bg-bs-dark text-bg-dark border border-primary"
                type="text"
                placeholder="p. ej. ABC123"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (codeError) setCodeError(null);
                }}
                autoFocus
              />
              {codeError && <div className="text-danger mt-2">{codeError}</div>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="text-bg-dark border-primary">
            <Button
              variant="secondary"
              onClick={() => setShowCodeModal(false)}
              disabled={resolving}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={resolving}>
              {resolving ? 'Buscando...' : 'Ir al torneo'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Modal de inscripción al evento */}
      <Modal
        show={showEventModal}
        onHide={() => setShowEventModal(false)}
        centered
      >
        <Form onSubmit={handleSubmitEventEnroll}>
          <Modal.Header closeButton className="text-bg-dark border-primary">
            <Modal.Title>
              {selectedEvent?.esPublico === false
                ? 'Inscribirse a torneo privado'
                : 'Inscribirse al torneo'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-bg-dark">
            <p className="mb-3">
              Torneo: <strong>{selectedEvent?.nombre}</strong>
            </p>
            {selectedEvent?.esPublico === false ? (
              <Form.Group controlId="eventoPassword">
                <Form.Label>Contraseña del torneo</Form.Label>
                <Form.Control
                  className="bg-bs-dark text-bg-dark border border-primary"
                  type="password"
                  placeholder="Ingrese la contraseña"
                  value={eventPwd}
                  onChange={(e) => {
                    setEventPwd(e.target.value);
                    if (eventError) setEventError(null);
                  }}
                  autoFocus
                />
              </Form.Group>
            ) : (
              <div>
                Este torneo es público. ¿Desea continuar y ver los detalles para
                inscribirse?
              </div>
            )}
            {eventError && <div className="text-danger mt-2">{eventError}</div>}
          </Modal.Body>
          <Modal.Footer className="text-bg-dark border-primary">
            <Button
              variant="secondary"
              onClick={() => setShowEventModal(false)}
              disabled={eventSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={eventSubmitting}>
              {eventSubmitting ? 'Validando...' : 'Continuar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {errorConexion && (
        <div className="alert alert-danger" role="alert">
          Ocurrió un error al recuperar los datos. Por favor, inténtelo de
          nuevo.
        </div>
      )}
      <Row className="text-center p-3">
        <Col>
          <Button variant="outline-primary" onClick={openCodeModal}>
            Ingresar codigo
          </Button>
        </Col>
        <Col>
          <Link to="crear-torneo" className="btn btn-primary">
            Crear Torneo
          </Link>
        </Col>
        <Col>
          <Form.Select
            aria-label="seleccionar deporte"
            className="bg-bs-dark text-bg-dark border border-primary"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">Filtrar por deporte</option>
            {dataDeportes.map((sport) => (
              <option key={sport.id} value={sport.nombre}>
                {sport.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select
            aria-label="seleccionar localidad"
            className="bg-bs-dark text-bg-dark border border-primary"
            value={selectedLocalidad}
            onChange={(e) => setSelectedLocalidad(e.target.value)}
          >
            <option value="">Filtrar por localidad</option>
            {dataLocalidades.map((localidad) => (
              <option key={localidad.id} value={localidad.nombre}>
                {localidad.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {dataTorneos
          .filter(
            (torneo) =>
              (!selectedSport ||
                String(torneo.deporte.nombre) === selectedSport) &&
              (!selectedLocalidad ||
                String(torneo.localidad.nombre) === selectedLocalidad)
          )
          .map((torneo) => (
            <Col key={torneo.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <CardTorneos
                torneo={torneo}
                handleClick={handleClick}
                isMember={userIsMemberOf(torneo)}
                onEnroll={handleEnrollFromCard}
                isCreador={userIsCreadorOf(torneo)}
              />
            </Col>
          ))}
      </Row>
    </div>
  );
}
