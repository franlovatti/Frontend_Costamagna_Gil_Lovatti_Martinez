import { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import apiAxios from '../helpers/api';
import type { Localidad, Deporte } from '../types';
import { useNavigate, useParams } from 'react-router';

export default function FormTorneos() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    deporte: 0,
    descripcion: '',
    fechaInicioInscripcion: '',
    fechaFinInscripcion: '',
    fechaInicioTorneo: '',
    fechaFinTorneo: '',
    localidad: 0,
    esPublico: false,
  });
  const [cantidadEquipos, setCantidadEquipos] = useState<number>(32);
  const [dataDeportes, setDataDeportes] = useState<Deporte[]>([]);
  const [dataLocalidades, setDataLocalidades] = useState<Localidad[]>([]);
  const { id } = useParams<{ id: string }>();
  console.log(id);

  useEffect(() => {
    apiAxios
      .get('/deportes')
      .then((response) => {
        {
          setDataDeportes(response.data.data);
        }
      })
      .catch((error) => console.error('Error fetching deportes:', error));
    apiAxios
      .get('/localidades')
      .then((response) => {
        {
          setDataLocalidades(response.data.data);
        }
      })
      .catch((error) => console.error('Error fetching localidades:', error));
  }, []);

  useEffect(() => {
    if (!id) return;
    apiAxios.get(`/eventos/${id}`).then((res) => {
      const torneo = res.data.data;
      console.log(torneo);
      setForm({
        nombre: torneo.nombre,
        deporte: torneo.deporte.id,
        descripcion: torneo.descripcion,
        fechaInicioInscripcion: torneo.fechaInicioInscripcion.split('T')[0],
        fechaFinInscripcion: torneo.fechaFinInscripcion.split('T')[0],
        fechaInicioTorneo: torneo.fechaInicioEvento.split('T')[0],
        fechaFinTorneo: torneo.fechaFinEvento.split('T')[0],
        localidad: torneo.localidad.id,
        esPublico: torneo.esPublico,
      });
      setCantidadEquipos(torneo.cantidadEquipos);
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (name === 'privado' && type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        esPublico: !(e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      deporte: Number(form.deporte),
      localidad: Number(form.localidad),
      esPublico: !form.esPublico,
      cantEquiposMax: cantidadEquipos,
      fechaInicioInscripcion: new Date(
        form.fechaInicioInscripcion
      ).toISOString(),
      fechaFinInscripcion: new Date(form.fechaFinInscripcion).toISOString(),
      fechaInicioEvento: new Date(form.fechaInicioTorneo).toISOString(),
      fechaFinEvento: new Date(form.fechaFinTorneo).toISOString(),
    };
    if (id !== undefined) {
      try {
        await apiAxios.put(`/eventos/${id}`, payload);
        navigate(`/home/torneos/${id}`);
      } catch (error) {
        console.error(error);
        alert('Error al actualizar el torneo');
      }
    } else {
      apiAxios
        .post('/eventos', payload)
        .then((response) => {
          console.log('Torneo creado:', response.data);
          navigate(`/home/torneos/${response.data.data.id}`);
        })
        .catch((error) => {
          console.error('Error al crear el torneo:', error);
        });
    }
  };
  return (
    <div className="text-bg-dark container">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formTournamentName">
              <Form.Label>Nombre del Torneo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del torneo"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Label>Deporte</Form.Label>
            <Form.Select
              aria-label="Deporte"
              name="deporte"
              value={form.deporte}
              onChange={handleChange}
            >
              <option value="">Seleccione el deporte</option>
              {dataDeportes.map((deporte) => (
                <option key={deporte.id} value={deporte.id}>
                  {deporte.nombre}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="formTournamentDescription">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Ingrese una descripción del torneo"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId={`fechaInicioInscripcion`}>
              <Form.Label>Inicio Inscripcion</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicioInscripcion"
                value={form.fechaInicioInscripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId={`fechaFinInscripcion`}>
              <Form.Label>Fin Inscripcion</Form.Label>
              <Form.Control
                type="date"
                name="fechaFinInscripcion"
                value={form.fechaFinInscripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId={`fechaInicioTorneo`}>
              <Form.Label>Inicio del Torneo</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicioTorneo"
                value={form.fechaInicioTorneo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId={`fechaFinTorneo`}>
              <Form.Label>Fin del Torneo</Form.Label>
              <Form.Control
                type="date"
                name="fechaFinTorneo"
                value={form.fechaFinTorneo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Label>Localidad</Form.Label>
            <Form.Select
              aria-label="Localidad"
              name="localidad"
              value={form.localidad}
              onChange={handleChange}
            >
              <option value="">Seleccione la localidad</option>
              {dataLocalidades.map((localidad) => (
                <option key={localidad.id} value={localidad.id}>
                  {localidad.nombre}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Cantidad de Equipos: {cantidadEquipos}</Form.Label>
            <Form.Range
              min={0}
              max={64}
              step={2}
              value={cantidadEquipos}
              onChange={(e) => setCantidadEquipos(Number(e.target.value))}
            />
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Privado"
            name="privado"
            checked={!form.esPublico}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {id ? 'Editar' : 'Crear'} Torneo
        </Button>
      </Form>
    </div>
  );
}
