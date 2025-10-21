import { useForm } from 'react-hook-form';
import type { Deporte } from '../../contexts/deporte';
import '../cssComponentes/DeporteFormModal.css';
import '../cssComponentes/ConfirmModal.css';

type DeporteFormFields = {
  nombre: string;
  cantMinJugadores: number;
  cantMaxJugadores: number;
  duracion: number;
};

interface DeporteFormModalProps {
  setShowModal: (show: boolean) => void;
  editingDeporte: Deporte | null;
  onSave: (data: Partial<Deporte>) => void;
}

export default function DeporteFormModal({
  setShowModal,
  editingDeporte,
  onSave,
}: DeporteFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DeporteFormFields>({
    mode: 'onBlur',
    defaultValues: {
      nombre: editingDeporte ? editingDeporte.nombre : '',
      cantMinJugadores: editingDeporte ? editingDeporte.cantMinJugadores : 0,
      cantMaxJugadores: editingDeporte ? editingDeporte.cantMaxJugadores : 0,
      duracion: editingDeporte ? editingDeporte.duracion : 0,
    },
  });

  const minimo = watch('cantMinJugadores');

  const onSubmit = (data: DeporteFormFields) => {
    const deporteData: Partial<Deporte> = {
      nombre: data.nombre,
      cantMinJugadores: data.cantMinJugadores,
      cantMaxJugadores: data.cantMaxJugadores,
      duracion: data.duracion,
    };

    if (editingDeporte) {
      deporteData.id = editingDeporte.id;
    }

    onSave(deporteData);
    setShowModal(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title mb-4">
          {editingDeporte ? 'Editar Deporte' : 'Crear Nuevo Deporte'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Nombre *</label>
            <input
              type="text"
              className={`form-control custom-input ${
                errors.nombre ? 'is-invalid' : ''
              }`}
              placeholder="Ej: Fútbol"
              {...register('nombre', {
                required: 'El nombre es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 45, message: 'Máximo 45 caracteres' },
              })}
            />
            {errors.nombre && (
              <span className="auth-error-text">{errors.nombre.message}</span>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Cantidad mínima de jugadores *</label>
            <input
              type="number"
              className={`form-control custom-input ${
                errors.cantMinJugadores ? 'is-invalid' : ''
              }`}
              {...register('cantMinJugadores', {
                required: 'La cantidad de jugadores es obligatoria',
                min: {
                  value: 1,
                  message: 'Debe haber al menos 1 jugador',
                },
                valueAsNumber: true,
              })}
            />
            {errors.cantMinJugadores && (
              <span className="auth-error-text">
                {errors.cantMinJugadores.message}
              </span>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Cantidad máxima de jugadores *</label>
            <input
              type="number"
              className={`form-control custom-input ${
                errors.cantMaxJugadores ? 'is-invalid' : ''
              }`}
              {...register('cantMaxJugadores', {
                required: 'La cantidad de jugadores es obligatoria',
                min: {
                  value: 1,
                  message: 'Debe haber al menos 1 jugador',
                },
                validate: (value) => {
                  return (
                    value >= minimo ||
                    'La cantidad máxima debe ser mayor o igual a la mínima'
                  );
                },
                valueAsNumber: true,
              })}
            />
            {errors.cantMaxJugadores && (
              <span className="auth-error-text">
                {errors.cantMaxJugadores.message}
              </span>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Duracion de un partido *</label>
            <input
              type="number"
              className={`form-control custom-input ${
                errors.duracion ? 'is-invalid' : ''
              }`}
              {...register('duracion', {
                required: 'La duración es obligatoria',
                valueAsNumber: true,
              })}
            />
            {errors.duracion && (
              <span className="auth-error-text">{errors.duracion.message}</span>
            )}
          </div>

          <div className="d-flex gap-3">
            <button
              className="btn btn-cancel-custom flex-grow-1"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              className="btn btn-save-custom flex-grow-1"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando...'
                : editingDeporte
                ? 'Guardar Cambios'
                : 'Crear Deporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
