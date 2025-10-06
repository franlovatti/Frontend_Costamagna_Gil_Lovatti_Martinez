import { Form, Row, Col } from 'react-bootstrap';
import { Submit } from '../components/ButtonField.tsx';
import React, { useState } from 'react';

export default function CrearPartido() {
  const equipos = [
    {
      id: 1,
      nombre: 'Equipo A',
      nombreCapitan: 'Capitán A',
      miembros: ['Jugador 1', 'Jugador 2', 'Jugador 3'],
    },
    {
      id: 2,
      nombre: 'Equipo B',
      nombreCapitan: 'Capitán B',
      miembros: ['Jugador 4', 'Jugador 5', 'Jugador 6'],
    },
    {
      id: 3,
      nombre: 'Equipo C',
      nombreCapitan: 'Capitán C',
      miembros: ['Jugador 7', 'Jugador 8', 'Jugador 9'],
    },
    {
      id: 4,
      nombre: 'Equipo D',
      nombreCapitan: 'Capitán D',
      miembros: ['Jugador 10', 'Jugador 11', 'Jugador 12'],
    },
  ];
  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    juez: '',
    resultado: '',
    equipoLocal: '',
    equipoVisitante: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="text-bg-dark container">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formHomeTeam">
              <Form.Label>Seleccione el equipo local</Form.Label>
              <Form.Select
                name="local"
                value={form.equipoLocal}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el equipo local</option>
                {equipos.map((equipo) => (
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
                name="Visitante"
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
                type="text"
                placeholder="Ingrese el nombre del juez"
                name="juez"
                value={form.juez}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formMatchResult">
              <Form.Label>Resultado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: 2 - 1"
                name="resultado"
                value={form.resultado}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Submit>Cargar Partido</Submit>
      </Form>
    </div>
  );
}
