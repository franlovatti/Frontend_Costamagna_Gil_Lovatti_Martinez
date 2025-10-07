import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import type { Equipo, Torneo } from '../types';
import apiAxios from '../helpers/api';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

export default function TorneoDetalle() {
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    apiAxios.get(`/eventos/${id}`).then((res) => {
      setTorneo(res.data.data);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await apiAxios.delete(`/eventos/${id}`);
      navigate('/home/torneos');
    } catch (error) {
      console.error('Error eliminando torneo:', error);
    }
  };
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
        <Col className="d-flex justify-content-center">
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
        <Col className="d-flex justify-content-center">
          <Button variant="primary">Crear Equipo</Button>
        </Col>
        <Col className="d-flex justify-content-center">
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
      <Table striped variant="dark">
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
                {equipo.miembros.length}/{torneo.deporte.cantMaxJugadores}
              </td>
              <td>{equipo.esPublico ? 'Sí' : 'No'}</td>
              <td>
                <Button variant="outline-primary">Unirse</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
