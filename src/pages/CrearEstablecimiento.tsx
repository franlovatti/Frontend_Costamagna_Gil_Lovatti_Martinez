import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap';
import { Submit } from '../components/ButtonField.tsx';
import axios from 'axios';

export default function CrearEstablecimiento() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventoSeleccionado = location.state?.evento ?? null;

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    evento: eventoSeleccionado?.id ?? null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/establecimientos',
        form,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Respuesta del backend:', response.data);
      alert('Establecimiento creado con éxito');
      navigate(-1);
    } catch (error: unknown) {
      if (error instanceof Error === false) {
        console.error('Error desconocido:', error);
        alert('Ocurrió un error desconocido.');
      } else {
        console.error('Error al crear establecimiento: ', error.message);
        alert('Error al crear establecimiento: ' + error.message);
      }
    }
  };

  return (
    <div className="container mt-4 text-bg-dark p-4 rounded-3 shadow-lg">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del establecimiento"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formDireccion" className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Submit>Guardar Establecimiento</Submit>
        </div>
      </Form>
    </div>
  );
}
