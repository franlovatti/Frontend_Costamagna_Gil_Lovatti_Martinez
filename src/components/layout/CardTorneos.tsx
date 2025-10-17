import { Button, Card, ListGroup } from 'react-bootstrap';
import type { Torneo } from '../../types';
import '../CardTorneos.css';

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
              {torneo.deporte.nombre}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary">
              {fechaInicioEvento} - {fechaFinEvento}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary">
              {torneo.localidad.nombre}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary"></ListGroup.Item>
          </ListGroup>
          <div className="d-flex justify-content-center">
            {isMember && (
              <Button
                variant="outline-info"
                className="align-self-center"
                onClick={() => handleClick(torneo.id)}
              >
                Mas Informacion
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
