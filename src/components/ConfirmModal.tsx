import "./cssComponentes/ConfirmModal.css";

export default function ConfirmModal({
  objeto,
  asunto,
  setShowConfirm,
  handleConfirmDelete,
  handleCancelDelete,
}: {
  objeto: string;
  asunto?: string;
  setShowConfirm: (show: boolean) => void;
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
          <h5 className="modal-title">Confirmar {asunto ? asunto : 'eliminación'}</h5>
          <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro de que deseas {objeto}?</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-action mx-2" onClick={handleCancelDelete}>
            Cancelar
          </button>
          <button className="btn btn-action btn-delete mx-2" onClick={handleConfirmDelete}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
