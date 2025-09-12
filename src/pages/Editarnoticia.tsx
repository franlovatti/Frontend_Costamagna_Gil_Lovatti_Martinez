import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useNoticia from '../hooks/useNoticia.ts';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

export default function Editarnoticia() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { noticia, loading, error } = useNoticia(id as unknown as BigInteger);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '' });
  const [mensaje, setMensaje] = useState('');

  // Actualiza el formData cuando la noticia esté disponible
  useEffect(() => {
    if (noticia) {
      setFormData({ titulo: noticia.titulo, descripcion: noticia.descripcion });
    }
  }, [noticia]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!noticia) return <p>No se encontró la noticia</p>;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/noticias/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Respuesta del backend:', result);
        setMensaje('Datos enviados correctamente');
        setTimeout(() => {
          navigate(-1); // vuelve a la página anterior
        }, 5000);
      } else {
        setMensaje('Error en el servidor');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setMensaje('Error de red');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="mb-4 text-center text-white">
            {' '}
            <u>Formulario de contacto</u>
          </h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formtitulo">
              <Form.Label className="text-white h4">titulo</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ingresá el titulo"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label className="text-white h4">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Escribí la descripción..."
                rows={5} // controla la altura
                className="rounded border border-secondary"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="primary" type="submit">
                Enviar
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Volver
              </Button>
            </div>
          </Form>
          {mensaje && <Alert variant="info">{mensaje}</Alert>}
        </Col>
      </Row>
    </Container>
  );
}
