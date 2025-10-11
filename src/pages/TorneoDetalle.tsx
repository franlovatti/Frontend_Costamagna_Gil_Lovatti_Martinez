import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate, Link } from 'react-router-dom';
import type { Equipo, Partido, Torneo, Usuario } from '../types';
import apiAxios from '../helpers/api';
import {
  Button,
  Col,
  Row,
  Table,
  Modal,
  Form,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

export default function TorneoDetalle() {
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Equipo | null>(null);
  const [enrollPassword, setEnrollPassword] = useState('');
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [resultadoModal, setResultadoModal] = useState(false);
  const [resultado, setResultado] = useState('');
  const [partidoSeleccionado, setPartidoSeleccionado] =
    useState<Partido | null>(null);
  const [tabKey, setTabKey] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    apiAxios.get(`/eventos/${id}`).then((res) => {
      setTorneo(res.data.data);
    });
  }, [id]);

  const fetchTorneo = async () => {
    if (!id) return;
    try {
      const res = await apiAxios.get(`/eventos/${id}`);
      setTorneo(res.data.data);
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
        resultado,
      });
      setResultadoModal(false);
      setResultado('');
      setPartidoSeleccionado(null);
      await fetchTorneo();
    } catch (err) {
      console.error('Error al cargar resultado:', err);
    }
  };
  const handleDelete = async () => {
    if (!id) return;
    try {
      await apiAxios.delete(`/eventos/${id}`);
      navigate('/home/torneos');
    } catch (error) {
      console.error('Error eliminando torneo:', error);
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

  if (!torneo) return <p>Cargando...</p>;

  return (
    <div className="container text-bg-dark p-3">
      <Row>
        <h2>{torneo.nombre}</h2>
      </Row>
      <Row>
        <p style={{ opacity: 0.8 }}>{torneo.deporte.nombre}</p>
      </Row>
      <Row>
        <p>{torneo.descripcion}</p>
      </Row>
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
      </Row>
      <Row>
        <Col>
          <p>
            Cantidad maxima de equipos: {torneo.cantEquiposMax} - Equipos
            inscriptos: {torneo.equipos && torneo.equipos.length}{' '}
          </p>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          {userIsMember() && (
            <div className="mt-2 alert alert-info py-2 mb-0">
              Ya estás inscripto en un equipo de este evento.
            </div>
          )}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col
          xs={12}
          md={4}
          className="d-flex justify-content-center mb-2 mb-md-0"
        >
          {Number(user?.id) === torneo.creador && (
            <Button
              variant="outline-light"
              onClick={() => {
                navigate(`/home/torneos/${id}/editar`);
              }}
            >
              Editar
            </Button>
          )}
        </Col>
        <Col
          xs={12}
          md={4}
          className="d-flex justify-content-center mb-2 mb-md-0"
        >
          {!userIsMember() ? (
            <Link to={`/home/torneos/${torneo.id}/crear-equipo`}>
              <Button variant="primary">Inscribir Equipo</Button>
            </Link>
          ) : (
            <Button variant="primary" disabled>
              Inscribir Equipo
            </Button>
          )}
        </Col>
        <Col xs={12} md={4} className="d-flex justify-content-center">
          {Number(user?.id) === torneo.creador && (
            <Button
              variant="danger"
              onClick={() => {
                handleDelete();
              }}
            >
              Eliminar
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          md={4}
          className="d-flex justify-content-center mb-2 mb-md-0"
        >
          {Number(user?.id) === torneo.creador && (
            <Link to={`CrearEstablecimiento`}>
              <Button variant="outline-primary">Crear Establecimientos</Button>
            </Link>
          )}
        </Col>
        <Col
          xs={12}
          md={4}
          className="d-flex justify-content-center mb-2 mb-md-0"
        >
          {Number(user?.id) === torneo.creador && (
            <Link to={`/home/torneos/${torneo.id}/CrearPartido`}>
              <Button variant="outline-primary">Crear Partidos</Button>
            </Link>
          )}
        </Col>
        <Col xs={12} md={4} className="d-flex justify-content-center">
          {Number(user?.id) === torneo.creador && (
            <Link to={`/home/Participaciones/${torneo.id}`}>
              <Button variant="outline-primary">Cargar Participaciones</Button>
            </Link>
          )}
        </Col>
      </Row>
      <Table responsive striped variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipos</th>
            <th>Jugadores</th>
            <th>Publico</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {torneo.equipos?.map((equipo: Equipo, idx) => (
            <tr key={equipo.id}>
              <td>{idx + 1}</td>
              <td>{equipo.nombre}</td>
              <td>
                {equipo.miembros?.length ?? 0}/
                {torneo.deporte?.cantMaxJugadores ?? '-'}
              </td>

              <td>{equipo.esPublico ? 'Sí' : 'No'}</td>
              <td>
                {!userIsMember() ? (
                  <div className="d-flex flex-column align-items-start">
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        setSelectedTeam(equipo);
                        setEnrollPassword('');
                        setEnrollError(null);
                        setShowEnrollModal(true);
                      }}
                    >
                      Unirse
                    </Button>
                  </div>
                ) : isCaptain(equipo) ? (
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-light"
                      onClick={() =>
                        navigate(`/home/equipos/${equipo.id}/editar`)
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteTeam(equipo.id)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/home/equipos/${equipo.id}`)}
                    >
                      Ver equipo
                    </Button>
                  </div>
                ) : isMember(equipo) ? (
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/home/equipos/${equipo.id}`)}
                  >
                    Ver equipo
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Tabs
        id="tab-partidos"
        activeKey={tabKey}
        onSelect={(k) => {
          if (typeof k === 'string') setTabKey(k);
        }}
      >
        {Object.entries(partidosPorFecha).map(([fecha, partidos], idx) => (
          <Tab
            key={fecha}
            eventKey={fecha}
            title={`Fecha ${idx + 1} - ${new Date(fecha).toLocaleDateString(
              'es-AR'
            )}`}
          >
            <Table responsive striped variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Hora inicio</th>
                  <th>Establecimiento</th>
                  <th>Local</th>
                  <th>Visitante</th>
                  <th>Resultado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {partidos.map((partido, i) => (
                  <tr key={partido.id}>
                    <td>{i + 1}</td>
                    <td>{new Date(partido.fecha).toLocaleDateString()}</td>
                    <td>
                      {partido.hora instanceof Date
                        ? partido.hora.toLocaleTimeString()
                        : partido.hora}
                    </td>
                    <td>{partido.establecimiento?.nombre}</td>
                    <td>{partido.equipoLocal.nombre}</td>
                    <td>{partido.equipoVisitante.nombre}</td>
                    <td>{partido.resultado || '-'}</td>
                    <td>
                      {Number(user?.id) === torneo.creador && (
                        <div className="d-flex gap-2 align-items-start">
                          <Link to={`/home/Participaciones/${torneo.id}`}>
                            <Button variant="outline-primary">
                              Cargar Participaciones
                            </Button>
                          </Link>
                          <Link to={`/home/torneos/${torneo.id}/EditarPartido`}>
                            <Button variant="outline-primary">
                              Editar Partido
                            </Button>
                          </Link>
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setPartidoSeleccionado(partido);
                              setResultadoModal(true);
                            }}
                          >
                            Editar Resultado
                          </Button>
                          <Button variant="danger">Eliminar</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
        ))}
      </Tabs>

      <Modal
        show={resultadoModal}
        onHide={() => setResultadoModal(false)}
        contentClassName="bg-dark text-light"
        backdropClassName="bg-dark bg-opacity-20"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-secondary"
        >
          <Modal.Title>
            Resultado de {partidoSeleccionado?.equipoLocal.nombre} -{' '}
            {partidoSeleccionado?.equipoVisitante.nombre}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Resultado del equipo </Form.Label>
            <Form.Control
              type="text"
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              placeholder="Ingrese el resultado del partido (ej: 3-1)"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={() => setResultadoModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCargarResultado}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEnrollModal}
        onHide={() => setShowEnrollModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTeam
              ? `Inscribirse en ${selectedTeam.nombre}`
              : 'Inscribirse'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {enrollError && (
            <div className="alert alert-danger">{enrollError}</div>
          )}
          {selectedTeam && !selectedTeam.esPublico && (
            <Form.Group>
              <Form.Label>Contraseña del equipo</Form.Label>
              <Form.Control
                type="password"
                value={enrollPassword}
                onChange={(e) => setEnrollPassword(e.target.value)}
                placeholder="Ingrese la contraseña"
                autoFocus
              />
            </Form.Group>
          )}
          {selectedTeam && selectedTeam.esPublico && (
            <p>Este equipo es público. Confirme para inscribirse.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleInscribe}
            disabled={enrolling}
          >
            {enrolling ? 'Enviando...' : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
