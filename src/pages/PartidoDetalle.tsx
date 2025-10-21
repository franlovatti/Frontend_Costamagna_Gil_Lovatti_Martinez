import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import {
  Card,
  Nav,
  Table,
  Row,
  Col,
  Spinner,
  Alert,
  Container,
} from 'react-bootstrap';
import { useOnePartido } from '../hooks/usePartidos';
import { useParticipaciones } from '../hooks/useParticipaciones';
import { Button } from '../components/ButtonField.tsx';
import { useNavigate } from 'react-router-dom';

export default function PartidoDetalle() {
  const { id } = useParams<{ id: string }>();
  const { partido, loadingPartido, errorPartido } = useOnePartido(id);

  const [equipoSeleccionado, setEquipoSeleccionado] = useState<
    'local' | 'visitante'
  >('local');
  const [equipoid, setEquipoid] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (partido) {
      const id =
        equipoSeleccionado === 'local'
          ? String(partido.equipoLocal?.id)
          : String(partido.equipoVisitante?.id);
      setEquipoid(id);
    }
  }, [partido, equipoSeleccionado]);

  const {
    participaciones,
    loading: loadingParticipaciones,
    error: errorParticipaciones,
  } = useParticipaciones(id || '', equipoid || '');

  if (loadingPartido) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (errorPartido) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">Error al cargar el partido.</Alert>
      </div>
    );
  }

  if (!partido || !partido.equipoLocal || !partido.equipoVisitante) {
    return <div className="text-center mt-5">No se encontró el partido.</div>;
  }

  const equipo =
    equipoSeleccionado === 'local'
      ? partido.equipoLocal
      : partido.equipoVisitante;

  return (
    <Container className="text-bg-dark py-4">
      <Card className="bg-dark text-light border border-primary shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="text-center display-6">
            Detalle del Partido
          </Card.Title>
          <Card.Text className="text-center fs-4">
            <strong>{partido.equipoLocal?.nombre}</strong> vs{' '}
            <strong>{partido.equipoVisitante?.nombre}</strong>
          </Card.Text>
          <hr className="border-primary" />

          <Card.Text>
            <span>Fecha:</span> {new Date(partido.fecha).toLocaleDateString()} -{' '}
            <span>Hora:</span> {partido.hora}
          </Card.Text>

          <Card.Text>
            <span>Establecimiento:</span>{' '}
            {partido.establecimiento?.nombre || 'N/A'}
          </Card.Text>
          <Card.Text>
            <span>Juez:</span> {partido.juez}
          </Card.Text>
          <Card.Text className="fs-4">
            <span>Resultado:</span> <strong>{partido.resultadoLocal}</strong> -{' '}
            <strong>{partido.resultadoVisitante}</strong>
          </Card.Text>
        </Card.Body>
      </Card>

      <Row className="text-center mb-4">
        <Col>
          <Nav
            variant="pills"
            className="justify-content-center"
            activeKey={equipoSeleccionado}
            onSelect={(selectedKey) =>
              setEquipoSeleccionado(selectedKey as 'local' | 'visitante')
            }
          >
            <Nav.Item>
              <Nav.Link eventKey="local" className="fw-bold">
                {partido.equipoLocal?.nombre || 'Equipo Local'}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="visitante" className="fw-bold">
                {partido.equipoVisitante?.nombre || 'Equipo Visitante'}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {loadingParticipaciones ? (
        <div>Cargando participaciones...</div>
      ) : errorParticipaciones ? (
        <div>Error al cargar participaciones: {errorParticipaciones}</div>
      ) : (
        <Card className="bg-dark text-light border border-primary shadow-sm">
          <Card.Body>
            <Card.Title className="text-center fs-4">
              Participaciones de {equipo.nombre}
            </Card.Title>
            <Table
              striped
              bordered
              hover
              responsive
              size="sm"
              className="table-dark align-middle mt-3"
            >
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Puntos</th>
                  <th>Minutos</th>
                  <th>Faltas</th>
                </tr>
              </thead>
              <tbody>
                {participaciones?.map((participacion) => (
                  <tr key={participacion.id}>
                    <td>{participacion.usuario?.nombre ?? ''}</td>
                    <td>{participacion.usuario?.apellido ?? ''}</td>
                    <td>{participacion.puntos}</td>
                    <td>{participacion.minutosjugados}</td>
                    <td>{participacion.faltas}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      <Button
        className="btn-outline-light"
        onClick={() => navigate(`/home/torneos/${partido.evento.id}`)}
        disabled={typeof partido.evento.id === 'undefined'}
      >
        Volver
      </Button>
    </Container>
  );
}
