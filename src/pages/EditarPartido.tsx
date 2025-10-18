import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Submit } from '../components/ButtonField.tsx';
import axios from 'axios';
import { useEstablecimientosEvento } from '../hooks/useEstablecimientos.tsx';
import alert from '../components/alert.tsx';
import { useOnePartido } from '../hooks/usePartidos.tsx';

export default function EditarPartido() {
  const navigate = useNavigate();
  const { id, partidoId } = useParams<{
    id: string;
    partidoId: string;
  }>();
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fecha: '2023-12-31',
    hora: '12:00',
    juez: '',
    resultadoLocal: '',
    resultadoVisitante: '',
    equipoLocal: 0,
    equipoVisitante: 0,
    evento: id ?? 0,
    establecimiento: 0,
    id: 0,
  });

  const { establecimientos, loadingEstablecimientos, errorEstablecimientos } =
    useEstablecimientosEvento(id);
  const {
    partido,
    loadingPartido,
    errorPartido,
    setPartido,
    setLoadingPartido,
    setErrorPartido,
  } = useOnePartido(partidoId);

  useEffect(() => {
    if (!partidoId) return;

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
    if (partido) {
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
  }, [partido]);

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
      const response = await axios.put(
        'http://localhost:3000/api/partidos/' + form.id,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Respuesta del backend:', response.data);
      setMessage('Partido modificado con éxito');
      setSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error === false) {
        console.error('Error desconocido:', error);
        setMessage('Ocurrió un error desconocido.');
      } else {
        console.error('Error al modificar partido: ', error.message);
        setMessage('Error al modificar partido: ' + error.message);
      }
    }
  };

  return (
    <div className="container mt-4 text-bg-dark p-4 rounded-3 shadow-lg">
      <h2>
        {loadingPartido ? 'Cargando datos del partido...' : 'Editar Partido'}
      </h2>
      {errorPartido &&
        alert({
          message:
            'Error al cargar los datos del partido: ' + errorPartido.message,
          success: false,
        })}
      {alert({ message, success })}
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
            <label htmlFor="resultadoLocal" className="form-label">
              Goles Local
            </label>
            <input
              type="number"
              min={0}
              id="resultadoLocal"
              name="resultadoLocal"
              value={form.resultadoLocal}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="resultadoVisitante" className="form-label">
              Goles Visitante
            </label>
            <input
              type="number"
              min={0}
              id="resultadoVisitante"
              name="resultadoVisitante"
              value={form.resultadoVisitante}
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
              Seleccione un Establecimiento
            </label>
            <select
              id="establecimiento"
              name="establecimiento"
              className="form-select"
              value={form.establecimiento}
              onChange={handleChange}
            >
              <option value="" disabled>
                {loadingEstablecimientos
                  ? 'Cargando establecimientos...'
                  : establecimientos.length === 0
                  ? 'No hay establecimientos disponibles'
                  : 'Seleccione el establecimiento'}
              </option>
              {!loadingEstablecimientos &&
                establecimientos.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.nombre} - {est.direccion}
                  </option>
                ))}
            </select>

            {errorEstablecimientos &&
              alert({
                message:
                  'Error al cargar los establecimientos: ' +
                  errorEstablecimientos.message,
                success: false,
              })}
          </div>
          <Submit>Guardar cambios</Submit>
        </form>
      )}
    </div>
  );
}
