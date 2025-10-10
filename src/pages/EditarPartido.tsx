import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Partido } from '../types.tsx';
import { Submit } from '../components/ButtonField.tsx';
import axios from 'axios';

export default function EditarPartido() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { eventoId } = useParams();
  const [partidos, setPartidos] = useState<Partido[]>();

  const [form, setForm] = useState({
    fecha: '2023-12-31',
    hora: '12:00',
    juez: '',
    resultado: '',
    equipoLocal: 0,
    equipoVisitante: 0,
    evento: eventoId ?? 0,
    establecimiento: 0,
    id: 0,
  });

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://localhost:3000/api/partidos/evento/' + eventoId
        );
        setPartidos(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [eventoId]);

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
      const response = await axios.put(
        'http://localhost:3000/api/partidos/' + form.id,
        form,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Respuesta del backend:', response.data);
      alert('Partido modificado con éxito');
      navigate(-1);
    } catch (error: unknown) {
      if (error instanceof Error === false) {
        console.error('Error desconocido:', error);
        alert('Ocurrió un error desconocido.');
      } else {
        console.error('Error al modificar partido: ', error.message);
        alert('Error al modificar partido: ' + error.message);
      }
    }
  };

  return (
    <div className="container mt-4 text-bg-dark p-4 rounded-3 shadow-lg">
      <h2>Editar Partido</h2>

      {/* Selección del partido */}
      <div className="mb-3">
        <label htmlFor="selectPartido" className="form-label">
          Seleccione el partido a modificar
        </label>
        <select
          id="selectPartido"
          className="form-select"
          value={form.id ?? ''} // necesitamos que form tenga id
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selected = partidos?.find((p) => p.id === selectedId);
            if (selected) {
              setForm({
                fecha: new Date(selected.fecha).toISOString().split('T')[0],
                hora: new Date(selected.hora).toTimeString().split(' ')[0],
                juez: selected.juez,
                resultado: selected.resultado,
                equipoLocal: selected.equipoLocal.id,
                equipoVisitante: selected.equipoVisitante.id,
                evento: selected.evento.id,
                establecimiento: selected.establecimiento?.id ?? 0,
                id: selected.id,
              });
            }
          }}
        >
          <option value="">Seleccione un partido</option>
          {!loading &&
            partidos &&
            partidos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.equipoLocal.nombre} vs {p.equipoVisitante.nombre} -{' '}
                {new Date(p.fecha).toISOString().split('T')[0]}
              </option>
            ))}
        </select>
      </div>

      {/* Formulario para editar */}
      {form.id && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fecha" className="form-label">
              Fecha
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="hora" className="form-label">
              Hora
            </label>
            <input
              type="time"
              id="hora"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="juez" className="form-label">
              Juez
            </label>
            <input
              type="text"
              id="juez"
              name="juez"
              value={form.juez}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="resultado" className="form-label">
              Resultado
            </label>
            <input
              type="text"
              id="resultado"
              name="resultado"
              value={form.resultado}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="equipoLocal" className="form-label">
              Equipo Local
            </label>
            <input
              type="text"
              id="equipoLocal"
              name="equipoLocal"
              value={form.equipoLocal}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="equipoVisitante" className="form-label">
              Equipo Visitante
            </label>
            <input
              type="text"
              id="equipoVisitante"
              name="equipoVisitante"
              value={form.equipoVisitante}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="establecimiento" className="form-label">
              Establecimiento
            </label>
            <input
              type="text"
              id="establecimiento"
              name="establecimiento"
              value={form.establecimiento}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <Submit>Guardar cambios</Submit>
        </form>
      )}
    </div>
  );
}
