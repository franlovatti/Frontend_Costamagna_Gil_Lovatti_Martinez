import type { Deporte } from "../contexts/deporte";
import type { Torneo } from "../contexts/torneo";
import "./cssComponentes/ConfirmModal.css";

export default function ConfirmModal({
  objeto,
  setShowConfirm,
  objetoAEliminar,
  handleConfirmDelete,
  handleCancelDelete
}: {
  objeto: string;
  setShowConfirm: (show: boolean) => void;
  objetoAEliminar: Deporte | Torneo | null;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
}) {

  return (
    <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Confirmar eliminación</h5>
          <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro de que deseas eliminar el {objeto} '{objetoAEliminar?.nombre}'?</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-action mx-2" onClick={handleCancelDelete}>
            Cancelar
          </button>
          <button className="btn btn-action btn-delete mx-2" onClick={handleConfirmDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}