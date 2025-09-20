import { Button, Card, ListGroup } from 'react-bootstrap';
import type { Torneo } from '../../types';
export default function CardTorneos(torneo: Torneo) {
  return (
    <Card bg="dark" text="white">
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
            {torneo.deporte}
          </ListGroup.Item>
          <ListGroup.Item className="bg-dark text-white border-primary">
            {torneo.fechaInicioTorneo} - {torneo.fechaFinTorneo}
          </ListGroup.Item>
          <ListGroup.Item className="bg-dark text-white border-primary">
            {torneo.ubicacion}
          </ListGroup.Item>
          <ListGroup.Item className="bg-dark text-white border-primary"></ListGroup.Item>
        </ListGroup>
        <div className="d-flex justify-content-center">
          <Button variant="outline-info" className="align-self-center">
            Mas Informacion
          </Button>
        </div>
      </Card.Body>
      <Button variant="outline-primary">Inscribirse</Button>
    </Card>
  );
}
