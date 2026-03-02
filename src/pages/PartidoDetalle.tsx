import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import { usePartidos } from '../hooks/usePartidos';
import { useParticipaciones } from '../hooks/useParticipaciones';
import { useNavigate } from 'react-router-dom';
import type { Partido } from '../contexts/partido.tsx';

export default function PartidoDetalle() {
  const { id } = useParams<{ id: string }>();
  const [partido, setPartido] = useState<Partido | null>(null);
  const {
    getOnePartido,
    loading: loadingPartido,
    error: errorPartido,
  } = usePartidos();

  useEffect(() => {
    const fetchPartido = async () => {
      const data = await getOnePartido(Number(id));
      setPartido(data);
    };
    fetchPartido();
  }, [getOnePartido, id]);

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
    // loading: loadingParticipaciones,
    // error: errorParticipaciones,
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
    <Container>
      <div className="participacion-container">
        <div className="participacion-inner">
          {/* Botón volver */}
          <div className="volver-section">
            <button
              className="btn-volver"
              onClick={() => navigate(`/home/torneos/${partido.evento.id}`)}
            >
              ← Volver al Torneo
            </button>
          </div>
          <div className="detalle-header">
            <div className="header-content">
              <div className="header-title-section">
                <h1 className="detalle-title">Detalle del Partido</h1>
                <strong>{partido.equipoLocal?.nombre}</strong> vs{' '}
                <strong>{partido.equipoVisitante?.nombre}</strong>
              </div>
            </div>
            <Row>
              <Col md={6}>
                <p className="detalle-description">
                  <strong>Fecha:</strong>{' '}
                  {new Date(partido.fecha).toLocaleDateString()}
                </p>
                <p className="detalle-description">
                  <strong>Hora:</strong> {partido.hora}
                </p>
                <p className="detalle-description fs-5">
                  <strong>Resultado:</strong>{' '}
                  <strong>{partido.resultadoLocal}</strong> -{' '}
                  <strong>{partido.resultadoVisitante}</strong>
                </p>
              </Col>
              <Col md={6}>
                <p className="detalle-description">
                  <strong>Establecimiento:</strong>{' '}
                  {partido.establecimiento?.nombre || 'N/A'}
                </p>
                <p className="detalle-description">
                  <strong>Juez:</strong> {partido.juez}
                </p>
              </Col>
            </Row>
          </div>

          <div className="participacion-header">
            <div className="equipos-tabs">
              <button
                className={`equipo-tab ${
                  equipoSeleccionado === 'local' ? 'active' : ''
                }`}
                onClick={() => setEquipoSeleccionado('local')}
              >
                {partido.equipoLocal?.nombre || 'Equipo Local'}
              </button>
              <button
                className={`equipo-tab ${
                  equipoSeleccionado === 'visitante' ? 'active' : ''
                }`}
                onClick={() => setEquipoSeleccionado('visitante')}
              >
                {partido.equipoVisitante?.nombre || 'Equipo Visitante'}
              </button>
            </div>
          </div>

          <div className="participaciones-card">
            <div className="participaciones-header">
              <h3 className="participaciones-title">
                Participaciones de {equipo.nombre}
              </h3>
            </div>
            <div className="participaciones-table-container">
              <table className="participaciones-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th>Puntos</th>
                    <th>Minutos</th>
                    <th>Faltas</th>
                  </tr>
                </thead>
                <tbody>
                  {participaciones && participaciones.length > 0 ? (
                    participaciones.map((participacion, idx) => (
                      <tr key={participacion.id}>
                        <td>{idx + 1}</td>
                        <td className="nombre-jugador">
                          {participacion.usuario?.nombre ?? ''}{' '}
                          {participacion.usuario?.apellido ?? ''}
                        </td>
                        <td>
                          <span className="stat-badge">
                            {participacion.puntos}
                          </span>
                        </td>
                        <td>{participacion.minutosjugados}'</td>
                        <td>{participacion.faltas}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="empty-participaciones">
                        <div className="empty-icon">📋</div>
                        <p>No hay participaciones registradas aún</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
