import type { Deporte } from '../contexts/deporte';
import type { Torneo } from '../contexts/torneo';
import type { Noticia } from '../types';
import './cssComponentes/ConfirmModal.css';

function getDisplay(obj: Deporte | Torneo | Noticia | null): string {
  if (!obj) return '';
  if ('nombre' in obj && typeof obj.nombre === 'string') return obj.nombre;
  if ('titulo' in obj && typeof obj.titulo === 'string') return obj.titulo;
  return '';
}

export default function ConfirmModal({
  objeto,
  setShowConfirm,
  objetoAEliminar,
  handleConfirmDelete,
  handleCancelDelete,
}: {
  objeto: string;
  setShowConfirm: (show: boolean) => void;
  objetoAEliminar: Deporte | Torneo | Noticia | null;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h5 className="modal-title">Confirmar eliminación</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCancelDelete}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            ¿Estás seguro de que deseas eliminar el {objeto} '
            {getDisplay(objetoAEliminar)}'?
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-action mx-2" onClick={handleCancelDelete}>
            Cancelar
          </button>
          <button
            className="btn btn-action btn-delete mx-2"
            onClick={handleConfirmDelete}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
