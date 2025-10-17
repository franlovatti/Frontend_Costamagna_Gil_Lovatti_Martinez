import { useForm } from 'react-hook-form';
import type { Noticia } from '../contexts/noticia.tsx';
import './cssComponentes/DeporteFormModal.css';
import './cssComponentes/ConfirmModal.css';

type NoticiaFormFields = {
  titulo: string;
  descripcion: string;
  fecha: string;
};

interface NoticiaFormModalProps {
  setShowModal: (show: boolean) => void;
  editingNoticia: Noticia | null;
  onSave: (data: Partial<Noticia>) => void;
}

export default function NoticiaFormModal({
  setShowModal,
  editingNoticia,
  onSave
}: NoticiaFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NoticiaFormFields>({
    mode: 'onBlur',
    defaultValues: {
      titulo: editingNoticia ? editingNoticia.titulo : '',
      descripcion: editingNoticia ? editingNoticia.descripcion : '',
      fecha: editingNoticia ? editingNoticia.fecha : ''
    }
  });

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title mb-4">
          {editingNoticia ? 'Editar Noticia' : 'Crear Nueva Noticia'}
        </h2>
      
        <form onSubmit={handleSubmit(onSave)}>
          <div className="mb-3">
            <label className="form-label">Título *</label>
            <input
              type="text"
              className={`form-control custom-input ${errors.titulo ? 'is-invalid' : ''}`}
              {...register("titulo", { required: "El título es obligatorio" })}
            />
            {errors.titulo && (
              <span className="auth-error-text">{errors.titulo.message}</span>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción *</label>
            <textarea
              className={`form-control custom-input ${errors.descripcion ? 'is-invalid' : ''}`}
              {...register("descripcion", { required: "La descripción es obligatoria" })}
            />
            {errors.descripcion && (
              <span className="auth-error-text">{errors.descripcion.message}</span>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha de Publicación</label>
            <input
              type="date"
              className={`form-control custom-input ${errors.fecha ? 'is-invalid' : ''}`}
              {...register("fecha", { required: "La fecha es obligatoria" })}
            />
            {errors.fecha && (
              <span className="auth-error-text">{errors.fecha.message}</span>
            )}
          </div>

          <div className="d-flex gap-3">
            <button
              className="btn btn-cancel-custom flex-grow-1"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button
              className="btn btn-save-custom flex-grow-1"
              type="submit"
              disabled={isSubmitting}
            >
              {editingNoticia ? 'Guardar Cambios' : 'Crear Noticia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}