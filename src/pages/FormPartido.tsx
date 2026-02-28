import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEstablecimientosEvento } from '../hooks/useEstablecimientos';
import { useEquiposEvento } from '../hooks/useEquipos';
import { useOnePartido } from '../hooks/usePartidos';
import axios from 'axios';
import '../components/cssComponentes/FormTorneos.css';


export default function FormPartido() {
  const { id, partidoId } = useParams();
  const createMode = !partidoId;
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  } = useOnePartido(partidoId);

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
    setIsSubmitting(true);
    setMessage('');
    
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

      if (createMode) {
        await axios.post(
          'http://localhost:3000/api/partidos',
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        await axios.put(
          'http://localhost:3000/api/partidos/' + form.id,
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      setMessage(createMode ? 'Partido creado con éxito' : 'Partido modificado con éxito');
      setSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error: unknown) {
      setSuccess(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage(error.response.data.message || 'Error desconocido del servidor');
        } else if (error.request) {
          setMessage('No se recibió respuesta del servidor.');
        } else {
          setMessage('Error al enviar la solicitud: ' + error.message);
        } 
      } else if (error instanceof Error) {
        setMessage('Error: ' + error.message);
      } else {
        setMessage('Ocurrió un error desconocido.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-torneos-container">
      <div className="form-torneos-inner">
        {/* Header */}
        <div className="form-header">
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
            type="button"
          >
            ← Volver
          </button>
          <h1 className="form-title">
            {createMode ? 'Crear Partido' : loadingPartido ? 'Cargando Partido...' : 'Editar Partido'}
          </h1>
          <p className="form-subtitle">
            {createMode 
              ? 'Completa la información del partido' 
              : 'Modifica los detalles del partido'}
          </p>
        </div>

        {/* Alertas de error */}
        {errorEstablecimientos && (
          <div className="alert-danger-custom">
            ⚠️ Error al cargar los establecimientos: {errorEstablecimientos.message}
          </div>
        )}

        {errorEquipos && (
          <div className="alert-danger-custom">
            ⚠️ Error al cargar los equipos: {errorEquipos.message}
          </div>
        )}

        {errorPartido && (
          <div className="alert-danger-custom">
            ⚠️ Error al cargar los datos del partido: {errorPartido.message}
          </div>
        )}

        {/* Mensaje de éxito/error */}
        {message && (
          <div className={success ? 'alert-success-custom' : 'alert-danger-custom'}>
            {success ? '✓' : '⚠️'} {message}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="torneo-form">
          {/* Equipos */}
          <div className="form-section">
            <h2 className="section-title-form">Equipos</h2>
            <div className="form-card">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="equipoLocal" className="form-label">
                    Equipo Local
                    <span className="required">*</span>
                  </label>
                  <select
                    id="equipoLocal"
                    name="equipoLocal"
                    className="form-select"
                    value={form.equipoLocal}
                    onChange={handleChange}
                    required
                    disabled={loadingEquipos}
                  >
                    <option value="">
                      {loadingEquipos
                        ? 'Cargando equipos...'
                        : 'Seleccione el equipo local'}
                    </option>
                    {!loadingEquipos &&
                      equipos?.map((equipo) => (
                        <option
                          key={equipo.id}
                          value={equipo.id}
                          disabled={equipo.id === form.equipoVisitante}
                        >
                          {equipo.nombre}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="equipoVisitante" className="form-label">
                    Equipo Visitante
                    <span className="required">*</span>
                  </label>
                  <select
                    id="equipoVisitante"
                    name="equipoVisitante"
                    className="form-select"
                    value={form.equipoVisitante}
                    onChange={handleChange}
                    required
                    disabled={loadingEquipos}
                  >
                    <option value="">Seleccione el equipo visitante</option>
                    {equipos?.map((equipo) => (
                      <option
                        key={equipo.id}
                        value={equipo.id}
                        disabled={equipo.id === form.equipoLocal}
                      >
                        {equipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="form-section">
            <h2 className="section-title-form">Fecha y Hora</h2>
            <div className="form-card">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fecha" className="form-label">
                    Fecha
                    <span className="required">*</span>
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    name="fecha"
                    className="form-input"
                    value={form.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hora" className="form-label">
                    Hora
                    <span className="required">*</span>
                  </label>
                  <input
                    id="hora"
                    type="time"
                    name="hora"
                    className="form-input"
                    value={form.hora}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detalles del Partido */}
          <div className="form-section">
            <h2 className="section-title-form">Detalles del Partido</h2>
            <div className="form-card">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="juez" className="form-label">
                    Juez/Árbitro
                  </label>
                  <input
                    id="juez"
                    type="text"
                    name="juez"
                    className="form-input"
                    placeholder="Nombre del juez"
                    value={form.juez}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="establecimiento" className="form-label">
                    Establecimiento
                    <span className="required">*</span>
                  </label>
                  <select
                    id="establecimiento"
                    name="establecimiento"
                    className="form-select"
                    value={form.establecimiento}
                    onChange={handleChange}
                    required
                    disabled={loadingEstablecimientos}
                  >
                    <option value="">
                      {loadingEstablecimientos
                        ? 'Cargando establecimientos...'
                        : establecimientos?.length === 0
                        ? 'No hay establecimientos disponibles'
                        : 'Seleccione el establecimiento'}
                    </option>
                    {!loadingEstablecimientos &&
                      establecimientos?.map((establecimiento) => (
                        <option key={establecimiento.id} value={establecimiento.id}>
                          {establecimiento.nombre} - {establecimiento.direccion}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Resultados */}
              <div className="form-group">
                <label className="form-label">Resultados (opcional)</label>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="resultadoLocal" className="form-label">
                      Goles Local
                    </label>
                    <input
                      id="resultadoLocal"
                      type="number"
                      name="resultadoLocal"
                      className="form-input"
                      min={0}
                      placeholder="0"
                      value={form.resultadoLocal}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="resultadoVisitante" className="form-label">
                      Goles Visitante
                    </label>
                    <input
                      id="resultadoVisitante"
                      type="number"
                      name="resultadoVisitante"
                      className="form-input"
                      min={0}
                      placeholder="0"
                      value={form.resultadoVisitante}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <span className="form-hint">
                  Deja vacío si el partido aún no se ha jugado
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel-form"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {createMode ? 'Creando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  {createMode ? '✓ Crear Partido' : '✓ Guardar Cambios'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}