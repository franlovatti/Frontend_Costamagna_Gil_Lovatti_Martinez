import { useParams, useNavigate } from 'react-router';
import apiAxios from '../helpers/api.tsx';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Col, Row, Form, Card } from 'react-bootstrap';

import type { Partido, Usuario, Participation } from '../types.tsx';

export default function CrearParticipacion() {
  const navigate = useNavigate();
  const [partido, setPartido] = useState<Partido | null>(null);
  const [localMembers, setLocalMembers] = useState<Usuario[]>([]);
  const [visitorMembers, setVisitorMembers] = useState<Usuario[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const { idpartido } = useParams<{ idpartido: string }>();
  const validIdPartido =
    idpartido && !isNaN(Number(idpartido)) ? Number(idpartido) : 3;

  const traerpartido = async (id: number) => {
    try {
      const response = await apiAxios.get(`/partidos/${id}`);
      const partidoData = response.data.data;
      setPartido(partidoData);

      // Fetch existing participations
      const participationsResponse = await apiAxios.get(
        `/participaciones?partidoId=${id}`
      );
      const existingParticipations: Participation[] =
        participationsResponse.data.data;
      setParticipations(existingParticipations);

      // Filter out members who already have participations
      const localMemberIds = existingParticipations
        .filter(
          (p) =>
            p.partido.id === id &&
            partidoData.equipoLocal.miembros.some(
              (m: Usuario) => m.id === p.usuario.id
            )
        )
        .map((p) => p.usuario.id);
      const visitorMemberIds = existingParticipations
        .filter(
          (p) =>
            p.partido.id === id &&
            partidoData.equipoVisitante.miembros.some(
              (m: Usuario) => m.id === p.usuario.id
            )
        )
        .map((p) => p.usuario.id);

      setLocalMembers(
        partidoData.equipoLocal.miembros.filter(
          (member: Usuario) => !localMemberIds.includes(member.id)
        )
      );
      setVisitorMembers(
        partidoData.equipoVisitante.miembros.filter(
          (member: Usuario) => !visitorMemberIds.includes(member.id)
        )
      );
    } catch (error) {
      console.error('Error fetching partido or participations:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!validIdPartido) {
        console.error('Invalid idpartido:', idpartido);
        return;
      }
      const partidoData = await traerpartido(validIdPartido);
      console.log(partidoData);
    };
    fetchData();
  }, [idpartido, validIdPartido]);

  const handleAddParticipation = async (
    team: 'local' | 'visitor',
    memberId: number,
    data: Partial<Omit<Participation, 'id' | 'usuario' | 'partido'>>
  ) => {
    const newParticipation: Participation = {
      id: participations.length + 1, // Temporary ID generation
      usuario: { id: memberId } as Usuario, // Simplified Usuario object
      partido: partido!,
      minutosjugados: data.minutosjugados || 0,
      faltas: data.faltas || 0,
      puntos: data.puntos || 0, // Default to 0 if not provided
    };

    try {
      await apiAxios.post('http://localhost:3000/api/participaciones', {
        usuario: memberId,
        partido: partido?.id,
        minutosjugados: newParticipation.minutosjugados,
        faltas: newParticipation.faltas,
        puntos: newParticipation.puntos,
      });

      setParticipations([...participations, newParticipation]);

      if (team === 'local') {
        setLocalMembers(
          localMembers.filter((member) => member.id !== memberId)
        );
      } else {
        setVisitorMembers(
          visitorMembers.filter((member) => member.id !== memberId)
        );
      }
    } catch (error) {
      console.error('Error creating participation:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Crear Participaciones</h2>
      {partido && (
        <div>
          <Row>
            <Col md={6} className="mb-4">
              <h3>Equipo Local</h3>
              {localMembers.length > 0 ? (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const minutosjugados =
                      Number(formData.get('minutosjugados')) || 0;
                    const faltas = Number(formData.get('faltas')) || 0;
                    const puntos = Number(formData.get('puntos')) || 0;
                    const memberId = Number(formData.get('memberId'));
                    handleAddParticipation('local', memberId, {
                      minutosjugados,
                      faltas,
                      puntos,
                    });
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Seleccionar Miembro</Form.Label>
                    <Form.Select name="memberId" required>
                      {localMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Minutos Jugados</Form.Label>
                    <Form.Control
                      type="number"
                      name="minutosjugados"
                      placeholder="Minutos Jugados"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Faltas</Form.Label>
                    <Form.Control
                      type="number"
                      name="faltas"
                      placeholder="Faltas"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Puntos</Form.Label>
                    <Form.Control
                      type="number"
                      name="puntos"
                      placeholder="Puntos"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Agregar Participación
                  </Button>
                </Form>
              ) : (
                <p>
                  Todos los miembros del equipo local tienen participaciones.
                </p>
              )}
            </Col>

            <Col md={6} className="mb-4">
              <h3>Equipo Visitante</h3>
              {visitorMembers.length > 0 ? (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const minutosjugados =
                      Number(formData.get('minutosjugados')) || 0;
                    const faltas = Number(formData.get('faltas')) || 0;
                    const puntos = Number(formData.get('puntos')) || 0;
                    const memberId = Number(formData.get('memberId'));
                    handleAddParticipation('visitor', memberId, {
                      minutosjugados,
                      faltas,
                      puntos,
                    });
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Seleccionar Miembro</Form.Label>
                    <Form.Select name="memberId" required>
                      {visitorMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Minutos Jugados</Form.Label>
                    <Form.Control
                      type="number"
                      name="minutosjugados"
                      placeholder="Minutos Jugados"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Faltas</Form.Label>
                    <Form.Control
                      type="number"
                      name="faltas"
                      placeholder="Faltas"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Puntos</Form.Label>
                    <Form.Control
                      type="number"
                      name="puntos"
                      placeholder="Puntos"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Agregar Participación
                  </Button>
                </Form>
              ) : (
                <p>
                  Todos los miembros del equipo visitante tienen
                  participaciones.
                </p>
              )}
            </Col>
          </Row>

          <h3 className="mt-4">Participaciones Creadas</h3>
          <Row>
            {participations.map((participation, index) => (
              <Col key={index} md={6} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>Participación {index + 1}</Card.Title>
                    <Card.Text>
                      <strong>Miembro:</strong> {participation.usuario.id}
                      <br />
                      <strong>Minutos Jugados:</strong>{' '}
                      {participation.minutosjugados}
                      <br />
                      <strong>Faltas:</strong> {participation.faltas}
                      <br />
                      <strong>Puntos:</strong> {participation.puntos}
                    </Card.Text>
                    <Button
                      className="btn-outline-light"
                      onClick={() =>
                        navigate(
                          `/home/editarparticipacion/${participation.id}`
                        )
                      }
                    >
                      Editar y borrar
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
