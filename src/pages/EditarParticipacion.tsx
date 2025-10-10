import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import apiAxios from '../helpers/api';
import type { Participation } from '../types';

export default function EditarParticipacion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participation, setParticipation] = useState<Participation | null>(
    null
  );
  const [formData, setFormData] = useState({
    puntos: 0,
    minutosjugados: 0,
    faltas: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    if (!id) return;
    try {
      console.log(`Attempting to delete participation with id: ${id}`);
      await apiAxios.delete(`/participaciones/${id}`);
      console.log('Participation deleted successfully. Redirecting...');
      navigate(`/home/participacion/crear`, { replace: true }); // Force navigation
      console.log('Navigation to /home/participacion/crear completed.');
    } catch (error) {
      console.error('Error deleting participation:', error);
    }
  };

  useEffect(() => {
    const fetchParticipation = async () => {
      if (!id) {
        console.error(
          'Error: idparticipacion is undefined. Cannot fetch participation data.'
        );
        return;
      }

      try {
        console.log(`Fetching participation with id: ${id}`);
        const response = await apiAxios.get(`/participaciones/${id}`);
        console.log('API Response:', response.data);
        const fetchedData = response.data.data || response.data; // Adjust for nested data
        setParticipation(fetchedData);
        setFormData({
          puntos: fetchedData.puntos,
          minutosjugados: fetchedData.minutosjugados,
          faltas: fetchedData.faltas,
        });
        console.log('Form data updated:', {
          puntos: fetchedData.puntos,
          minutosjugados: fetchedData.minutosjugados,
          faltas: fetchedData.faltas,
        });
      } catch (error) {
        console.error('Error fetching participation:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipation();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiAxios.put(`/participaciones/${id}`, formData);
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error('Error updating participation:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!participation) {
    console.log('Participation is null, showing error state.');
    return <p>Error: Participation not found.</p>;
  }

  return (
    <Container className="mt-4">
      <h2>Editar Participación</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Puntos</Form.Label>
          <Form.Control
            type="number"
            name="puntos"
            value={formData.puntos}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Minutos Jugados</Form.Label>
          <Form.Control
            type="number"
            name="minutosjugados"
            value={formData.minutosjugados}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Faltas</Form.Label>
          <Form.Control
            type="number"
            name="faltas"
            value={formData.faltas}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Guardar Cambios
        </Button>
      </Form>

      <Button variant="secondary" onClick={handleDelete} className="mt-3">
        Cancelar
      </Button>
    </Container>
  );
}
