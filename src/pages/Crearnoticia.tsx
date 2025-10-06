import { useState } from 'react';
import { Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { Submit } from '../components/ButtonField.tsx';

export default function CrearNoticia() {
  const [formData, setFormData] = useState({ titulo: '', descripcion: '' });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Respuesta del backend:', result);
        setMensaje('Datos enviados correctamente');
        setFormData({ titulo: '', descripcion: '' });
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

            <Submit>Enviar</Submit>
          </Form>
          {mensaje && <Alert variant="info">{mensaje}</Alert>}
        </Col>
      </Row>
    </Container>
  );
}
