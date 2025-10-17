import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Row, Col, Modal, Button as RBButton } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { Submit } from '../components/ButtonField';

export default function CrearEquipo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [form, setForm] = useState({
    nombre: '',
    esPublico: false,
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para crear un equipo.');
      return;
    }

    if (!form.esPublico && !form.contraseña) {
      setError('La contraseña es obligatoria si el equipo es privado.');
      return;
    }
    setError('');

    const nuevoEquipo = {
      nombre: form.nombre,
      nombreCapitan: user.nombre,
      capitan: user.id,
      puntos: 0,
      esPublico: form.esPublico,
      privado: !form.esPublico,
      contraseña: !form.esPublico ? form.contraseña : null,
      miembros: [user.id],
      evento: Number(id),
    };

    console.debug('Payload nuevoEquipo (ids):', nuevoEquipo);

    try {
      const res = await axios.post(
        'http://localhost:3000/api/equipos',
        nuevoEquipo,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Equipo creado con éxito', res.data);
      const newTeamId: number | undefined =
        res?.data?.data?.id ?? res?.data?.id;
      setCreatedTeamId(typeof newTeamId === 'number' ? newTeamId : null);
      setShowSuccess(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error response data:', err.response?.data);
        const message =
          err.response?.data?.message || 'Error al crear el equipo.';
        console.error('Error al crear equipo:', message);
        alert('Error al crear equipo: ' + message);
      } else {
        console.error('Error desconocido:', err);
        alert('Ocurrió un error desconocido.');
      }
    }
  };

  return (
    <div className="container mt-4 text-bg-dark p-4 rounded-3 shadow-lg">
      <h2 className="text-center mb-4">Crear Nuevo Equipo</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={12}>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre del Equipo</Form.Label>
              <Form.Control
                className="bg-bs-dark text-bg-dark border border-primary"
                type="text"
                placeholder="Ingrese el nombre del equipo"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formPrivado" className="mb-3">
              <Form.Check
                type="checkbox"
                label="¿Equipo es público?"
                name="esPublico"
                checked={form.esPublico}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          {!form.esPublico && (
            <Col md={6}>
              <Form.Group controlId="formContraseña" className="mb-3">
                <Form.Label>Contraseña del Equipo</Form.Label>
                <Form.Control
                  className="bg-bs-dark text-bg-dark border border-primary"
                  type="password"
                  placeholder="Ingrese la contraseña"
                  name="contraseña"
                  value={form.contraseña}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          )}
        </Row>

        {error && <p className="text-danger">{error}</p>}

        <div className="text-center mt-3">
          <Submit>Crear Equipo</Submit>
        </div>
      </Form>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Header
          data-bs-theme="dark"
          className="text-bg-dark border-primary"
        >
          <Modal.Title>Equipo creado</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-dark">
          ¡El equipo se creó correctamente!
        </Modal.Body>
        <Modal.Footer className="text-bg-dark border-primary">
          <RBButton
            variant="secondary"
            onClick={() => {
              setShowSuccess(false);
              navigate(`/home/torneos/${id}`);
            }}
          >
            Ir al torneo
          </RBButton>
          <RBButton
            variant="primary"
            onClick={() => {
              setShowSuccess(false);
              if (createdTeamId) {
                navigate(`/home/equipos/${createdTeamId}`);
              } else {
                navigate(`/home/torneos/${id}`);
              }
            }}
          >
            Ver equipo
          </RBButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
