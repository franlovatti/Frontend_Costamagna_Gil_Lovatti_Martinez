import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Torneo } from '../contexts/torneo.tsx';
import { useDeporte } from '../hooks/useDeporte.tsx';
import { useLocalidad } from '../hooks/useLocalidad.tsx';
import {
  toDatetimeLocal,
  parseDatetimeLocal,
} from '../helpers/convertirFechas.tsx';
import './cssComponentes/FormTorneos.css';

type TorneoFormFields = {
  nombre: string;
  descripcion: string;
  esPublico: 'true' | 'false';
  contrasenia: string;
  cantEquiposMax: number;
  fechaInicioInscripcion: string;
  fechaFinInscripcion: string;
  fechaInicioEvento: string;
  fechaFinEvento: string;
  deporteId: number;
  localidadId: number;
};

interface TorneoFormProps {
  setShowModal: (show: boolean) => void;
  editingTorneo: Torneo | null;
  onSave: (data: Partial<Torneo>) => void;
}

export default function FormTorneos({
  setShowModal,
  editingTorneo,
  onSave,
}: TorneoFormProps) {
  const { deportes, getDeportes, error: errorDeporte } = useDeporte();
  const { localidades, getLocalidades, error: errorLocalidad } = useLocalidad();
  const isEditing = Boolean(editingTorneo);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TorneoFormFields>({
    mode: 'onBlur',
    defaultValues: {
      nombre: editingTorneo?.nombre || '',
      descripcion: editingTorneo?.descripcion || '',
      esPublico: editingTorneo?.esPublico ? 'true' : 'false',
      contrasenia: editingTorneo?.contrasenia || '',
      cantEquiposMax: editingTorneo?.cantEquiposMax || 8,
      fechaInicioInscripcion:
        toDatetimeLocal(editingTorneo?.fechaInicioInscripcion).split('T')[0] ||
        '',
      fechaFinInscripcion:
        toDatetimeLocal(editingTorneo?.fechaFinInscripcion).split('T')[0] || '',
      fechaInicioEvento:
        toDatetimeLocal(editingTorneo?.fechaInicioEvento).split('T')[0] || '',
      fechaFinEvento:
        toDatetimeLocal(editingTorneo?.fechaFinEvento).split('T')[0] || '',
      deporteId: editingTorneo?.deporte?.id || 0,
      localidadId: editingTorneo?.localidad?.id || 0,
    },
  });

  const esPublico = watch('esPublico') === 'true';
  const fechaInicioInscripcion = watch('fechaInicioInscripcion');
  const fechaFinInscripcion = watch('fechaFinInscripcion');
  const fechaInicioEvento = watch('fechaInicioEvento');

  useEffect(() => {
    getDeportes();
  }, [getDeportes]);

  useEffect(() => {
    getLocalidades();
  }, [getLocalidades]);

  const onSubmit = (data: TorneoFormFields) => {
    const deporteSeleccionado = deportes?.find(
      (d) => d.id === Number(data.deporteId),
    );
    const localidadSeleccionada = localidades?.find(
      (l) => l.id === Number(data.localidadId),
    );
    const esPublico = data.esPublico === 'true';
    const torneoData: Partial<Torneo> = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      esPublico: esPublico,
      contrasenia: esPublico ? undefined : data.contrasenia?.trim() || undefined,
      cantEquiposMax: data.cantEquiposMax,
      fechaInicioInscripcion: parseDatetimeLocal(data.fechaInicioInscripcion)!,
      fechaFinInscripcion: parseDatetimeLocal(data.fechaFinInscripcion)!,
      fechaInicioEvento: parseDatetimeLocal(data.fechaInicioEvento)!,
      fechaFinEvento: parseDatetimeLocal(data.fechaFinEvento)!,
      deporte: deporteSeleccionado!,
      localidad: localidadSeleccionada!,
    };

    if (editingTorneo) {
      torneoData.id = editingTorneo.id;
    }

    onSave(torneoData);
    setShowModal(false);
  };

  return (
    <div className="form-torneos-container">
      <div className="form-torneos-inner">
        {/* Header */}
        <div className="form-header">
          <button
            className="btn-back"
            onClick={() => {
              setShowModal(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            type="button"
          >
            ← Volver
          </button>
          <h1 className="form-title">
            {isEditing ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
          </h1>
          <p className="form-subtitle">
            {isEditing
              ? 'Modifica la información de tu torneo'
              : 'Completa la información para crear tu torneo deportivo'}
          </p>
        </div>

        {/* Errores */}
        {errorDeporte || errorLocalidad ? (
          <div className="alert-danger-custom">
            ⚠️ Error al cargar los datos. Por favor, recarga la página.
          </div>
        ) : null}

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="torneo-form">
          {/* Información Básica */}
          <div className="form-section">
            <h2 className="section-title-form">Información Básica</h2>
            <div className="form-card">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">
                    Nombre del Torneo
                    <span className="required">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    className="form-input"
                    placeholder="Ej: Copa de Verano 2024"
                    {...register('nombre', {
                      required: 'El nombre es obligatorio',
                      minLength: {
                        value: 3,
                        message: 'El nombre debe tener al menos 3 caracteres',
                      },
                    })}
                  />
                  {errors.nombre && (
                    <span className="auth-error-text">
                      {errors.nombre.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="deporte" className="form-label">
                    Deporte
                    <span className="required">*</span>
                  </label>
                  <select
                    id="deporte"
                    className={`form-select custom-input ${errors.deporteId ? 'is-invalid' : ''}`}
                    {...register('deporteId', {
                      required: 'Debe seleccionar un deporte',
                      validate: (value) =>
                        value > 0 || 'Debe seleccionar un deporte válido',
                    })}
                  >
                    <option value="0">-- Seleccione un deporte --</option>
                    {Array.isArray(deportes) &&
                      deportes.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nombre}
                        </option>
                      ))}
                  </select>
                  {errors.deporteId && (
                    <span className="auth-error-text">
                      {errors.deporteId.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion" className="form-label">
                  Descripción
                  <span className="required">*</span>
                </label>
                <textarea
                  id="descripcion"
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe el torneo, reglas especiales, premios, etc."
                  {...register('descripcion', {
                    minLength: {
                      value: 3,
                      message:
                        'La descripción debe tener al menos 3 caracteres',
                    },
                  })}
                />
                {errors.descripcion && (
                  <span className="auth-error-text">
                    {errors.descripcion.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="form-section">
            <h2 className="section-title-form">Fechas Importantes</h2>
            <div className="form-card">
              <div className="dates-section">
                <div className="dates-group">
                  <h3 className="dates-group-title">
                    Período de Inscripciones
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label
                        htmlFor="fechaInicioInscripcion"
                        className="form-label"
                      >
                        Inicio
                        <span className="required">*</span>
                      </label>
                      <input
                        id="fechaInicioInscripcion"
                        type="date"
                        className={`form-control custom-input ${errors.fechaInicioInscripcion ? 'is-invalid' : ''}`}
                        {...register('fechaInicioInscripcion', {
                          required:
                            'La fecha de inicio de inscripción es obligatoria',
                        })}
                      />
                      {errors.fechaInicioInscripcion && (
                        <span className="auth-error-text">
                          {errors.fechaInicioInscripcion.message}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="fechaFinInscripcion"
                        className="form-label"
                      >
                        Fin
                        <span className="required">*</span>
                      </label>
                      <input
                        id="fechaFinInscripcion"
                        type="date"
                        className={`form-control custom-input ${errors.fechaFinInscripcion ? 'is-invalid' : ''}`}
                        {...register('fechaFinInscripcion', {
                          required:
                            'La fecha de fin de inscripción es obligatoria',
                          validate: (value) => {
                            if (!fechaInicioInscripcion) return true;
                            return (
                              new Date(value) >
                                new Date(fechaInicioInscripcion) ||
                              'Debe ser posterior al inicio de inscripción'
                            );
                          },
                        })}
                      />
                      {errors.fechaFinInscripcion && (
                        <span className="auth-error-text">
                          {errors.fechaFinInscripcion.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dates-divider"></div>

                <div className="dates-group">
                  <h3 className="dates-group-title">Período del Torneo</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="fechaInicioTorneo" className="form-label">
                        Inicio
                        <span className="required">*</span>
                      </label>
                      <input
                        id="fechaInicioTorneo"
                        type="date"
                        className={`form-control custom-input ${errors.fechaInicioEvento ? 'is-invalid' : ''}`}
                        {...register('fechaInicioEvento', {
                          required:
                            'La fecha de inicio del evento es obligatoria',
                          validate: (value) => {
                            if (!fechaFinInscripcion) return true;
                            return (
                              new Date(value) >=
                                new Date(fechaFinInscripcion) ||
                              'Debe ser posterior o igual al fin de inscripción'
                            );
                          },
                        })}
                      />
                      {errors.fechaInicioEvento && (
                        <span className="auth-error-text">
                          {errors.fechaInicioEvento.message}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechaFinTorneo" className="form-label">
                        Fin
                        <span className="required">*</span>
                      </label>
                      <input
                        id="fechaFinTorneo"
                        type="date"
                        className={`form-control custom-input ${errors.fechaFinEvento ? 'is-invalid' : ''}`}
                        {...register('fechaFinEvento', {
                          required: 'La fecha de fin del evento es obligatoria',
                          validate: (value) => {
                            if (!fechaInicioEvento) return true;
                            return (
                              new Date(value) > new Date(fechaInicioEvento) ||
                              'Debe ser posterior al inicio del evento'
                            );
                          },
                        })}
                      />
                      {errors.fechaFinEvento && (
                        <span className="auth-error-text">
                          {errors.fechaFinEvento.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="form-section">
            <h2 className="section-title-form">Configuración</h2>
            <div className="form-card">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="localidad" className="form-label">
                    Localidad
                    <span className="required">*</span>
                  </label>
                  <select
                    id="localidad"
                    className={`form-select custom-input ${errors.localidadId ? 'is-invalid' : ''}`}
                    {...register('localidadId', {
                      required: 'Debe seleccionar una localidad',
                      validate: (value) =>
                        value > 0 || 'Debe seleccionar una localidad válida',
                    })}
                  >
                    <option value="0">-- Seleccione una localidad --</option>
                    {Array.isArray(localidades) &&
                      localidades.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.descripcion}
                        </option>
                      ))}
                  </select>
                  {errors.localidadId && (
                    <span className="auth-error-text">
                      {errors.localidadId.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Cantidad de Equipos
                    <span className="required">*</span>
                  </label>
                  <input
                    id="cantidadEquipos"
                    type="number"
                    className={`form-control custom-input ${errors.cantEquiposMax ? 'is-invalid' : ''}`}
                    {...register('cantEquiposMax', {
                      required: 'La cantidad de equipos es obligatoria',
                      min: {
                        value: 2,
                        message: 'Debe haber al menos 2 equipos',
                      },
                      max: {
                        value: 64,
                        message: 'Máximo 64 equipos permitidos',
                      },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.cantEquiposMax && (
                    <span className="auth-error-text">
                      {errors.cantEquiposMax.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Visibilidad */}
              <div className="form-group">
                <label className="form-label">Visibilidad del Torneo</label>
                <div className="visibility-options">
                  <label className="radio-card">
                    <input
                      type="radio"
                      value="true"
                      checked={esPublico}
                      {...register('esPublico')}
                    />
                    <div className="radio-content">
                      <div className="radio-icon">🌍</div>
                      <div className="radio-text">
                        <div className="radio-title">Público</div>
                        <div className="radio-description">
                          Visible para todos los usuarios
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="radio-card">
                    <input
                      type="radio"
                      value="false"
                      checked={!esPublico}
                      {...register('esPublico')}
                    />
                    <div className="radio-content">
                      <div className="radio-icon">🔒</div>
                      <div className="radio-text">
                        <div className="radio-title">Privado</div>
                        <div className="radio-description">
                          Requiere código o contrasenia
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* contrasenia si es privado */}
              {!esPublico && (
                <div className="form-group password-group">
                  <label htmlFor="contrasenia" className="form-label">
                    contrasenia del Torneo
                    <span className="required">*</span>
                  </label>
                  <input
                    id="contrasenia"
                    type="password"
                    className={`form-control custom-input ${errors.contrasenia ? 'is-invalid' : ''}`}
                    placeholder="Ingrese una contrasenia"
                    {...register('contrasenia', {
                      required: !esPublico
                        ? 'La contrasenia es obligatoria para torneos privados'
                        : false,
                      minLength: {
                        value: 4,
                        message:
                          'La contrasenia debe tener al menos 4 caracteres',
                      },
                    })}
                  />
                  {errors.contrasenia && (
                    <span className="auth-error-text">
                      {errors.contrasenia.message}
                    </span>
                  )}
                  <span className="form-hint">
                    Los usuarios necesitarán esta contrasenia para acceder al
                    torneo
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel-form"
              onClick={() => {
                setShowModal(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
                  {isEditing ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                <>{isEditing ? '✓ Guardar Cambios' : '✓ Crear Torneo'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
