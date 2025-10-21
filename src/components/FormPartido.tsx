import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstablecimientosEvento } from '../hooks/useEstablecimientos';
import { useEquiposEvento } from '../hooks/useEquipos';
import { useOnePartido } from '../hooks/usePartidos';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';
import { Submit } from '../components/ButtonField';
import alert from '../components/Alert';

interface FormPartidoProps {
  id: string;
  createMode: boolean;
  partidoId?: string;
}

export default function FormPartido({
  id,
  createMode,
  partidoId,
}: FormPartidoProps) {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    juez: '',
    resultadoLocal: '',
    resultadoVisitante: '',
    equipoLocal: 0,
    equipoVisitante: 0,
    evento: Number(id),
    establecimiento: 0,
    id: 0,
  });

  const { establecimientos, loadingEstablecimientos, errorEstablecimientos } =
    useEstablecimientosEvento(id);

  const { equipos, loadingEquipos, errorEquipos } = useEquiposEvento(id);

  const {
    partido,
    loadingPartido,
    errorPartido,
    setPartido,
    setLoadingPartido,
    setErrorPartido,
  } = useOnePartido(partidoId);

  useEffect(() => {
    if (!partidoId || createMode) return;

    const fetchData = async () => {
      setLoadingPartido(true);
      setErrorPartido(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/partidos/${partidoId}`
        );
        setPartido(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        setErrorPartido(err as Error);
      } finally {
        setLoadingPartido(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partidoId]);

  useEffect(() => {
    if (partido && !createMode) {
      setForm({
        fecha: new Date(partido.fecha).toISOString().split('T')[0],
        hora: partido.hora,
        juez: partido.juez,
        resultadoLocal: partido.resultadoLocal?.toLocaleString() ?? '',
        resultadoVisitante: partido.resultadoVisitante?.toLocaleString() ?? '',
        equipoLocal: partido.equipoLocal.id,
        equipoVisitante: partido.equipoVisitante.id,
        evento: partido.evento.id,
        establecimiento: partido.establecimiento?.id ?? 0,
        id: partido.id,
      });
    }
  }, [partido, createMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...(!createMode && { id: form.id }),
        fecha: form.fecha,
        hora: form.hora,
        juez: form.juez,
        resultadoLocal:
          form.resultadoLocal === '' ? null : Number(form.resultadoLocal),
        resultadoVisitante:
          form.resultadoVisitante === ''
            ? null
            : Number(form.resultadoVisitante),
        equipoLocal: form.equipoLocal,
        equipoVisitante: form.equipoVisitante,
        evento: form.evento,
        establecimiento: form.establecimiento,
      };
      console.log('Payload a enviar:', payload);
      let response;
      if (createMode) {
        response = await axios.post(
          'http://localhost:3000/api/partidos',
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        response = await axios.put(
          'http://localhost:3000/api/partidos/' + form.id,
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      console.log('Respuesta del backend:', response.data);
      setMessage('Partido modificado con éxito');
      setSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error del backend:', error.response.data);
          setMessage(
            error.response.data.message || 'Error desconocido del servidor'
          );
          setSuccess(false);
        } else if (error.request) {
          console.error('Sin respuesta del servidor:', error.request);
          setMessage('No se recibió respuesta del servidor.');
          setSuccess(false);
        } else {
          console.error('Error al configurar la petición:', error.message);
          setMessage('Error al enviar la solicitud: ' + error.message);
          setSuccess(false);
        }
      } else if (error instanceof Error === false) {
        console.error('Error desconocido:', error);
        setMessage('Ocurrió un error desconocido.');
      } else {
        console.error('Error al modificar partido: ', error.message);
        setMessage('Error al modificar partido: ' + error.message);
      }
    }
  };

  return (
    <div className="text-bg-dark container">
      {errorEstablecimientos &&
        alert({
          message:
            'Error al cargar los establecimientos: ' +
            errorEstablecimientos.message,
          success: false,
        })}

      {errorEquipos &&
        alert({
          message: 'Error al cargar los equipos: ' + errorEquipos.message,
          success: false,
        })}

      {errorPartido &&
        alert({
          message:
            'Error al cargar los datos del partido: ' + errorPartido.message,
          success: false,
        })}

      {alert({ message, success })}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={12}>
            <h3>
              {createMode
                ? 'Crear Partido'
                : loadingPartido
                ? 'Cargando Partido...'
                : 'Editar Partido'}
            </h3>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formHomeTeam">
              <Form.Label>Seleccione el equipo local</Form.Label>
              <Form.Select
                className="bg-bs-dark text-bg-dark border border-primary"
                name="equipoLocal"
                value={form.equipoLocal}
                onChange={handleChange}
                required
              >
                <option value="">
                  {loadingEquipos
                    ? 'Cargando equipos...'
                    : 'Seleccione el equipo local'}
                </option>
                {!loadingEquipos &&
                  equipos.map((equipo) => (
                    <option
                      key={equipo.id}
                      value={equipo.id}
                      disabled={equipo.id === form.equipoVisitante}
                    >
                      {equipo.nombre}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="formAwayTeam">
              <Form.Label>Seleccione el equipo Visitante</Form.Label>
              <Form.Select
                className="bg-bs-dark text-bg-dark border border-primary"
                name="equipoVisitante"
                value={form.equipoVisitante}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el equipo visitante</option>
                {equipos.map((equipo) => (
                  <option
                    key={equipo.id}
                    value={equipo.id}
                    disabled={equipo.id === form.equipoLocal}
                  >
                    {equipo.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formMatchDate">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                className="bg-bs-dark text-bg-dark border border-primary"
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formMatchTime">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                className="bg-bs-dark text-bg-dark border border-primary"
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formMatchReferee">
              <Form.Label>Juez</Form.Label>
              <Form.Control
                className="bg-bs-dark text-bg-dark border border-primary"
                type="text"
                placeholder="Ingrese el nombre del juez"
                name="juez"
                value={form.juez}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3" controlId="formResultadoLocal">
              <Form.Label>Goles Local</Form.Label>
              <Form.Control
                className="bg-bs-dark text-bg-dark border border-primary"
                type="number"
                min={0}
                name="resultadoLocal"
                value={form.resultadoLocal}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3" controlId="formResultadoVisitante">
              <Form.Label>Goles Visitante</Form.Label>
              <Form.Control
                className="bg-bs-dark text-bg-dark border border-primary"
                type="number"
                min={0}
                name="resultadoVisitante"
                value={form.resultadoVisitante}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="establecimiento">
              <Form.Label>Seleccione el establecimiento</Form.Label>
              <Form.Select
                className="bg-bs-dark text-bg-dark border border-primary"
                name="establecimiento"
                value={form.establecimiento}
                onChange={handleChange}
                required
              >
                <option value="">
                  {loadingEstablecimientos
                    ? 'Cargando establecimientos...'
                    : establecimientos.length === 0
                    ? 'No hay establecimientos disponibles'
                    : 'Seleccione el establecimiento'}
                </option>

                {!loadingEstablecimientos &&
                  establecimientos.map((establecimiento) => (
                    <option key={establecimiento.id} value={establecimiento.id}>
                      {establecimiento.nombre +
                        ' - ' +
                        establecimiento.direccion}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Submit>Cargar Partido</Submit>
      </Form>
    </div>
  );
}
