import { Form, Row, Col } from 'react-bootstrap';
import { Submit } from '../components/ButtonField.tsx';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { useEstablecimientosEvento } from '../hooks/useEstablecimientos.tsx';
import alert from '../components/alert.tsx';
import { useEquiposEvento } from '../hooks/useEquipos.tsx';

export default function CrearPartido() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  //const [loading, setLoading] = useState(false);
  const { eventoId } = useParams();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string>();

  const { establecimientos, loadingEstablecimientos, errorEstablecimientos } =
    useEstablecimientosEvento(eventoId);

  const { equipos, loadingEquipos, errorEquipos } = useEquiposEvento(eventoId);

  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    juez: '',
    resultadoLocal: '',
    resultadoVisitante: '',
    equipoLocal: '',
    equipoVisitante: '',
    evento: id ?? 0,
    establecimiento: '',
  });

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
        ...form,
        resultadoLocal:
          form.resultadoLocal === '' ? null : Number(form.resultadoLocal),
        resultadoVisitante:
          form.resultadoVisitante === ''
            ? null
            : Number(form.resultadoVisitante),
      };
      const response = await axios.post(
        'http://localhost:3000/api/partidos',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Respuesta del backend:', response.data);
      setMessage('Partido creado con éxito');
      setSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
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

      {alert({ message, success })}
      <Form onSubmit={handleSubmit}>
        <Row>
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
                    <option key={equipo.id} value={equipo.id}>
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
                  <option key={equipo.id} value={equipo.id}>
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
