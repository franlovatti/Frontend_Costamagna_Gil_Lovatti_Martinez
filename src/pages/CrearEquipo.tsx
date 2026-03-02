import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEquipos } from '../hooks/useEquipos';
import './CrearEquipo.css';
import type { EquiposPayload } from '../DTOs/equipoDTO.tsx';

export default function CrearEquipo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [form, setForm] = useState({
    nombre: '',
    esPublico: true,
    constrasenia: '',
  });

  const { loading, error: crearEquipoError, crearEquipo } = useEquipos();

  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para crear un equipo.');
      return;
    }

    if (!form.esPublico && !form.constrasenia) {
      setError('La constrasenia es obligatoria si el equipo es privado.');
      return;
    }

    if (form.nombre.trim().length < 3) {
      setError('El nombre del equipo debe tener al menos 3 caracteres.');
      return;
    }

    setError('');

    const nuevoEquipo: EquiposPayload = {
      nombre: form.nombre,
      nombreCapitan: user.nombre,
      capitan: user.id,
      puntos: 0,
      esPublico: form.esPublico,
      privado: !form.esPublico,
      contrasenia: !form.esPublico ? form.constrasenia : null,
      miembros: [user.id],
      evento: Number(id),
    };

    const equipoCreado = await crearEquipo(nuevoEquipo);
    if (equipoCreado) {
      setCreatedTeamId(equipoCreado?.id ?? null);
      setShowSuccess(true);
    } else {
      setError(crearEquipoError || 'Error desconocido al crear el equipo.');
    }
  };

  return (
    <div className="crear-equipo-container">
      <div className="crear-equipo-inner">
        {/* Header */}
        <div className="form-header">
          <button
            className="btn-back"
            onClick={() => navigate(`/home/torneos/${id}`)}
          >
            ← Volver al torneo
          </button>
          <h1 className="form-title">Crear Nuevo Equipo</h1>
          <p className="form-subtitle">
            Completa la información para inscribir tu equipo en el torneo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="equipo-form">
          <div className="form-card">
            {/* Nombre del equipo */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre del Equipo
                <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Ej: Los Campeones"
                value={form.nombre}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
              />
              <span className="form-hint">Mínimo 3 caracteres</span>
            </div>

            {/* Capitán (readonly) */}
            <div className="form-group">
              <label className="form-label">Capitán del Equipo</label>
              <input
                type="text"
                className="form-input form-input-readonly"
                value={user?.nombre || ''}
                readOnly
              />
              <span className="form-hint">
                Tú serás el capitán de este equipo
              </span>
            </div>

            {/* Visibilidad */}
            <div className="form-group">
              <label className="form-label">Visibilidad del Equipo</label>
              <div className="visibility-options">
                <label className="radio-card">
                  <input
                    type="radio"
                    name="esPublico"
                    checked={form.esPublico === true}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        esPublico: true,
                        constrasenia: '',
                      }))
                    }
                  />
                  <div className="radio-content">
                    <div className="radio-icon">🌍</div>
                    <div className="radio-text">
                      <div className="radio-title">Público</div>
                      <div className="radio-description">
                        Cualquier usuario puede unirse libremente
                      </div>
                    </div>
                  </div>
                </label>

                <label className="radio-card">
                  <input
                    type="radio"
                    name="esPublico"
                    checked={form.esPublico === false}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, esPublico: false }))
                    }
                  />
                  <div className="radio-content">
                    <div className="radio-icon">🔒</div>
                    <div className="radio-text">
                      <div className="radio-title">Privado</div>
                      <div className="radio-description">
                        Requiere constrasenia para unirse
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* constrasenia (solo si es privado) */}
            {!form.esPublico && (
              <div className="form-group password-group">
                <label htmlFor="constrasenia" className="form-label">
                  constrasenia del Equipo
                  <span className="required">*</span>
                </label>
                <input
                  id="constrasenia"
                  type="password"
                  name="constrasenia"
                  className="form-input"
                  placeholder="Ingrese una constrasenia segura"
                  value={form.constrasenia}
                  onChange={handleChange}
                  required={!form.esPublico}
                  minLength={4}
                />
                <span className="form-hint">
                  Comparte esta constrasenia con los miembros que quieras
                  invitar
                </span>
              </div>
            )}

            {/* Error */}
            {error && <div className="alert-danger-custom">⚠️ {error}</div>}

            {/* Info adicional */}
            <div className="info-box">
              <div className="info-icon">ℹ️</div>
              <div className="info-text">
                <strong>Importante:</strong> Como capitán, podrás gestionar el
                equipo, agregar o remover jugadores, y editar la información del
                equipo.
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel-form"
              onClick={() => navigate(`/home/torneos/${id}`)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit-form"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creando equipo...
                </>
              ) : (
                <>Crear Equipo</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
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
              <h2 className="modal-custom-title">¡Equipo Creado!</h2>
            </div>
            <div className="modal-custom-body">
              <p className="modal-info-text">
                Tu equipo se ha creado correctamente. ¿Qué deseas hacer ahora?
              </p>
            </div>
            <div className="modal-custom-footer">
              <button
                className="btn-cancel-custom"
                onClick={() => {
                  setShowSuccess(false);
                  navigate(`/home/torneos/${id}`);
                }}
              >
                Ir al torneo
              </button>
              <button
                className="btn-save-custom"
                onClick={() => {
                  setShowSuccess(false);
                  if (createdTeamId) {
                    navigate(`/home/equipos/${createdTeamId}`);
                  } else {
                    navigate(`/home/torneos/${id}`);
                  }
                }}
              >
                Ver equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
