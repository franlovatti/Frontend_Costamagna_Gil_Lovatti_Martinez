import useNoticias from '../hooks/useNoticias.ts';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

export default function Listanoticias() {
  const navigate = useNavigate();
  const { noticias, loading, error, setNoticias } = useNoticias();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  const handleDelete = async (id: number) => {
    const confirmacion = window.confirm(
      '¿Estás seguro de que querés eliminar esta noticia?'
    );
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost:3000/api/noticias/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNoticias((prev) => prev.filter((noticia) => noticia.id !== id));
      } else {
        alert('Error al eliminar la noticia');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de red al intentar eliminar');
    }
  };
  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-white">Últimas Noticias</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {noticias.map((n) => (
          <Col key={n.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div>
                  <Card.Title className="text-secondary">{n.titulo}</Card.Title>
                  <Card.Text>{n.descripcion}</Card.Text>
                </div>
                <div className="mt-auto d-flex justify-content-between pt-3">
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/editarnoticia/${n.id}`)}
                  >
                    <PencilSquare />
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(n.id)}>
                    <Trash size={20} color="white" />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
