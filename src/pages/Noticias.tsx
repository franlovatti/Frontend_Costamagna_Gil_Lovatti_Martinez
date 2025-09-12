import useNoticias from '../hooks/useNoticias.ts';
import { Container, Row, Col, Card } from 'react-bootstrap';

function LasNoticias() {
  const { noticias, loading, error } = useNoticias();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-white">Últimas Noticias</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {noticias.map((n) => (
          <Col key={n.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-secondary">{n.titulo}</Card.Title>
                <Card.Text>{n.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default function Noticias() {
  return (
    <div>
      <LasNoticias />
    </div>
  );
}
