import { Button, Card, ListGroup } from 'react-bootstrap';
import '../CardTorneos.css';

import type { Torneo } from '../types';
interface CardTorneosProps {
  torneo: Torneo;
  handleClick: (id: number) => void;
  isMember?: boolean;
  onEnroll?: (torneo: Torneo) => void;
}

export default function CardTorneos({
  torneo,
  handleClick,
  isMember = false,
  onEnroll,
}: CardTorneosProps) {
  const fechaInicioEvento = new Date(
    torneo.fechaInicioEvento
  ).toLocaleDateString('es-AR');
  const fechaFinEvento = new Date(torneo.fechaFinEvento).toLocaleDateString(
    'es-AR'
  );
  const deporteNombre = torneo.deporte?.nombre ?? 'Sin deporte';
  const localidadNombre = torneo.localidad?.nombre ?? 'Sin localidad';
  return (
    <div className="torneos-card-styles">
      <Card
        bg="dark"
        border="secondary"
        text="white"
        onClick={() => handleClick(torneo.id)}
      >
        <Card.Img variant="top" src={torneo.img} />
        <Card.Body>
          <Card.Title>{torneo.nombre}</Card.Title>
          <Card.Text
            style={{
              minHeight: '100px',
              maxHeight: '100px',
              overflow: 'hidden',
            }}
          >
            {torneo.descripcion}
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item className="bg-dark text-white border-primary">
              {deporteNombre}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary">
              {fechaInicioEvento} - {fechaFinEvento}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary">
              {localidadNombre}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary"></ListGroup.Item>
          </ListGroup>
          <div className="d-flex justify-content-center">
            {isMember && (
              <Button variant="outline-primary" disabled>
                Inscribirse
              </Button>
            )}
            {!isMember && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  onEnroll ? onEnroll(torneo) : handleClick(torneo.id)
                }
              >
                Inscribirse
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
