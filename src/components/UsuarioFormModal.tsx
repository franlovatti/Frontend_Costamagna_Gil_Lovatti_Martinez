import { useForm } from 'react-hook-form';
import type { User } from '../contexts/auth.tsx';
import './cssComponentes/DeporteFormModal.css';
import './cssComponentes/ConfirmModal.css';

type UsuarioFormFields = {
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  role: string;
};

interface UsuarioFormModalProps {
  setShowModal: (show: boolean) => void;
  editingUsuario: User | null;
  onSave: (data: Partial<User>) => void;
  error?: string | null;
}

export default function UsuarioFormModal({
  setShowModal,
  editingUsuario,
  onSave,
  error,
}: UsuarioFormModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting} } = useForm<UsuarioFormFields>({
    defaultValues: {
      nombre: editingUsuario?.nombre || '',
      apellido: editingUsuario?.apellido || '',
      email: editingUsuario?.email || '',
      fechaNacimiento: editingUsuario?.fechaNacimiento ? new Date(editingUsuario.fechaNacimiento).toISOString().split('T')[0] : '',
      role: editingUsuario?.role || 'Usuario',
    },
  });

  const onSubmit = (data: UsuarioFormFields) => {
    const updatedData: Partial<User> = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      fechaNacimiento: new Date(data.fechaNacimiento),
      role: data.role,
    };
    onSave(updatedData);
  };

  return (  
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title mb-4">Editar Usuario</h2>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Nombre *</label>
            <input
              type="text"
              className={`form-control custom-input ${
                errors.nombre ? 'is-invalid' : ''
              }`}
              placeholder="Ej: Pedro"
              {...register('nombre', {
                required: 'El nombre es obligatorio',
              })}
            />
            {errors.nombre && (
              <span className="auth-error-text">{errors.nombre.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Apellido *</label>
            <input
              type="text"
              className={`form-control custom-input ${
                errors.apellido ? 'is-invalid' : ''
              }`}
              placeholder="Ej: Pérez"
              {...register('apellido', {
                required: 'El apellido es obligatorio',
              })}
            />
            {errors.apellido && (
              <span className="auth-error-text">{errors.apellido.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Mail *</label>
            <input
              type="text"
              className={`form-control custom-input ${
                errors.email ? 'is-invalid' : ''
              }`}
              placeholder="Ej: pedro@ejemplo.com"
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Formato de email inválido',
                },
              })}
            />
            {errors.email && (
              <span className="auth-error-text">{errors.email.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha de nacimiento *</label>
            <input
              type="date"
              className={`form-control custom-input ${
                errors.fechaNacimiento ? 'is-invalid' : ''
              }`}
              placeholder="Ej: 1990-01-01"
              {...register('fechaNacimiento', {
                required: 'La fecha de nacimiento es obligatoria',
              })}
            />
            {errors.fechaNacimiento && (
              <span className="auth-error-text">{errors.fechaNacimiento.message}</span>
            )}
          </div>
          <input type="text" className="d-none" {...register('role')} />
        <div className="d-flex gap-3">
            <button
              type="button"
              className="btn btn-cancel-custom flex-grow-1"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-save-custom flex-grow-1"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando...'
                : editingUsuario
                ? 'Guardar Cambios'
                : 'Crear Usuario'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}