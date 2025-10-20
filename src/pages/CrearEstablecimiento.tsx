import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap';
import { Submit } from '../components/ButtonField.tsx';
import alert from '../components/Alert.tsx';
import axios from 'axios';

export default function CrearEstablecimiento() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    evento: id,
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
    console.log('evento id', id);
    const payload = {
      nombre: form.nombre,
      direccion: form.direccion,
      evento: id,
    };
    console.log('Payload a enviar:', payload);
    console.log('Enviando formulario con datos:', form);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/establecimientos',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Respuesta del backend:', response.data);
      setMessage('Establecimiento creado con éxito');
      setSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error === false) {
        console.error('Error desconocido:', error);
        setMessage('Ocurrió un error desconocido.');
      } else {
        console.error('Error al crear establecimiento: ', error.message);
        setMessage('Error al crear establecimiento: ' + error.message);
      }
    }
  };

  return (
    <div className="container mt-4 text-bg-dark p-4 rounded-3 shadow-lg">
      {alert({ message, success })}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                className="bg-bs-dark text-bg-dark border border-primary"
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
                className="bg-bs-dark text-bg-dark border border-primary"
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
