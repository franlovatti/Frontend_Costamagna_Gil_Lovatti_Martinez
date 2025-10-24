import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MapaLocalidad from '../components/apiMaps/MapaLocalidad.tsx';
import './CrearEquipo.css';

export default function FormEstablecimiento() {
  const navigate = useNavigate();
  const { idT, idE } = useParams<{ idT: string; idE: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    evento: idT,
  });

  const isEditing = !!idE;

  useEffect(() => {
    if (!idE) return;

    const fetchEstablecimiento = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/establecimientos/${idE}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        console.log('Fetched establecimiento:', response.data);
        const data = response.data.data;
        setForm({
          nombre: data.nombre,
          direccion: data.direccion,
          evento: data.evento,
        });
      } catch (error) {
        console.error('Error fetching establecimiento:', error);
      }
    };

    fetchEstablecimiento();
  }, [idE]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      nombre: form.nombre,
      direccion: form.direccion,
      evento: idT,
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/establecimientos/${idE}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post('http://localhost:3000/api/establecimientos', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      setShowSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error === false) {
        console.error('Error desconocido:', error);
        // setMessage('Ocurrió un error desconocido.');
      } else {
        console.error('Error al crear establecimiento: ', error.message);
        // setMessage('Error al crear establecimiento: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="crear-equipo-container">
        <div className="crear-equipo-inner">
          {/* Header */}
          <div className="form-header">
            <button className="btn-back" onClick={() => navigate(-1)}>
              ← Volver
            </button>
            <h1 className="form-title">{isEditing ? 'Editar Establecimiento' : 'Crear Nuevo Establecimiento'}</h1>
            <p className="form-subtitle">
              {isEditing ? 'Completa la información para editar tu establecimiento en el torneo' : 'Completa la información para agregar tu establecimiento en el torneo'}
            </p>
          </div>
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="crear-equipo-form">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre del Establecimiento
                <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Ej: Estadio Unico de la Plata"
                value={form.nombre}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
              />
              <span className="form-hint">Mínimo 3 caracteres</span>
            </div>
             <div className="form-group">
            <label htmlFor="direccion" className="form-label">
              Dirección del Establecimiento
              <span className="required">*</span>
            </label>
            <MapaLocalidad onSelect={(place) => setForm({ ...form, direccion: place.formatted_address! })} className="form-input" placeholder='Ej: Zeballos 1341, Rosario' localidad={false} valor={form.direccion} />
            <span className="form-hint">Mínimo 3 caracteres</span>
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
                    {isEditing ? 'Guardando cambios...' : 'Creando establecimiento...'}
                  </>
                ) : (

                  isEditing ? 'Guardar Cambios' : 'Crear Establecimiento'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div
          className="modal-custom-overlay"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="modal-custom-content modal-success"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-custom-header">
              <h2 className="modal-custom-title">{isEditing ? 'Establecimiento Editado!' : 'Establecimiento Creado!'}</h2>
            </div>
            <div className="modal-custom-body">
              <p className="modal-info-text">
                Tu Establecimiento se ha {isEditing ? 'editado' : 'creado'} correctamente.
              </p>
            </div>
            <div className="modal-custom-footer">
              <button
                className="btn-cancel-custom"
                onClick={() => {
                  setShowSuccess(false);
                  navigate(-1);
                }}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
